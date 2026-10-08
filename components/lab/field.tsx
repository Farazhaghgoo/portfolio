"use client";

import { useEffect, useRef, useState } from "react";
import { Stage, StageButton, onThemeChange, readColors } from "@/components/lab/stage";

type Mode = "repel" | "attract";

interface Pulse {
  x: number;
  y: number;
  t: number;
}

const K = 0.045; // spring back home
const DAMP = 0.86;
const RADIUS = 150;
const STRENGTH = 2.6;
const PULSE_SPEED = 0.55; // px per ms
const PULSE_WIDTH = 46;
const PULSE_LIFE = 1800;

/** LAB/01 — a sheet of points held by springs. */
export default function Field() {
  return (
    <Stage label="Field / Canvas 2D" hud={null}>
      {(running) => <FieldCanvas running={running} />}
    </Stage>
  );
}

function FieldCanvas({ running }: { running: boolean }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const api = useRef<{ pulse: (x?: number, y?: number) => void; reset: () => void } | null>(null);
  const modeRef = useRef<Mode>("repel");
  const [mode, setMode] = useState<Mode>("repel");
  const [stats, setStats] = useState({ points: 0, energy: 0, awake: false });

  useEffect(() => {
    modeRef.current = mode;
  }, [mode]);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas || !running) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let W = 0;
    let H = 0;
    let n = 0;
    let hx = new Float32Array(0);
    let hy = new Float32Array(0);
    let x = new Float32Array(0);
    let y = new Float32Array(0);
    let vx = new Float32Array(0);
    let vy = new Float32Array(0);
    let colors = readColors();
    const pulses: Pulse[] = [];
    const pointer = { x: 0, y: 0, inside: false, probe: false };
    let raf = 0;
    let last = 0;
    let lastStats = 0;
    let visible = true;

    const build = () => {
      const rect = wrap.getBoundingClientRect();
      W = rect.width;
      H = rect.height;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      canvas.style.width = `${W}px`;
      canvas.style.height = `${H}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const gap = W < 640 ? 17 : W < 1200 ? 20 : 23;
      const cols = Math.floor(W / gap);
      const rows = Math.floor(H / gap);
      const ox = (W - (cols - 1) * gap) / 2;
      const oy = (H - (rows - 1) * gap) / 2;
      n = cols * rows;
      hx = new Float32Array(n);
      hy = new Float32Array(n);
      x = new Float32Array(n);
      y = new Float32Array(n);
      vx = new Float32Array(n);
      vy = new Float32Array(n);
      let i = 0;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          hx[i] = x[i] = ox + c * gap;
          hy[i] = y[i] = oy + r * gap;
          i++;
        }
      }
    };

    const draw = () => {
      ctx.fillStyle = colors.paper;
      ctx.fillRect(0, 0, W, H);
      // Two passes keep fillStyle changes to a minimum.
      ctx.fillStyle = colors.ink;
      for (let i = 0; i < n; i++) {
        const dx = x[i] - hx[i];
        const dy = y[i] - hy[i];
        if (dx * dx + dy * dy < 9) ctx.fillRect(x[i] - 0.75, y[i] - 0.75, 1.5, 1.5);
      }
      ctx.fillStyle = colors.blue;
      for (let i = 0; i < n; i++) {
        const dx = x[i] - hx[i];
        const dy = y[i] - hy[i];
        const d2 = dx * dx + dy * dy;
        if (d2 >= 9) {
          const s = Math.min(1.5 + Math.sqrt(d2) * 0.07, 4);
          ctx.fillRect(x[i] - s / 2, y[i] - s / 2, s, s);
        }
      }
      if (pointer.probe && pointer.inside) {
        ctx.strokeStyle = colors.blue;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(pointer.x, pointer.y, 10, 0, Math.PI * 2);
        ctx.stroke();
      }
    };

    const step = (now: number) => {
      const dt = Math.min(now - last, 40) / 16.67;
      last = now;
      const attract = modeRef.current === "attract";
      const R2 = RADIUS * RADIUS;
      let energy = 0;

      for (let p = pulses.length - 1; p >= 0; p--) if (now - pulses[p].t > PULSE_LIFE) pulses.splice(p, 1);

      for (let i = 0; i < n; i++) {
        let fx = (hx[i] - x[i]) * K;
        let fy = (hy[i] - y[i]) * K;

        if (pointer.inside) {
          const dx = x[i] - pointer.x;
          const dy = y[i] - pointer.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < R2) {
            const d = Math.sqrt(d2) + 0.001;
            const f = (1 - d / RADIUS) ** 2 * STRENGTH * (attract ? -0.55 : 1);
            fx += (dx / d) * f;
            fy += (dy / d) * f;
          }
        }

        for (const pulse of pulses) {
          const age = now - pulse.t;
          const ring = age * PULSE_SPEED;
          const dx = x[i] - pulse.x;
          const dy = y[i] - pulse.y;
          const d = Math.sqrt(dx * dx + dy * dy) + 0.001;
          const band = 1 - Math.abs(d - ring) / PULSE_WIDTH;
          if (band > 0) {
            const amp = band * 3.2 * (1 - age / PULSE_LIFE);
            fx += (dx / d) * amp;
            fy += (dy / d) * amp;
          }
        }

        vx[i] = (vx[i] + fx * dt) * DAMP;
        vy[i] = (vy[i] + fy * dt) * DAMP;
        x[i] += vx[i] * dt;
        y[i] += vy[i] * dt;
        energy += vx[i] * vx[i] + vy[i] * vy[i];
      }
      return energy / Math.max(n, 1);
    };

    const loop = (now: number) => {
      const energy = step(now);
      draw();
      const awake = energy > 0.0004 || pulses.length > 0 || pointer.inside;
      if (now - lastStats > 250) {
        lastStats = now;
        setStats({ points: n, energy, awake });
      }
      if (awake && visible) {
        raf = requestAnimationFrame(loop);
      } else {
        raf = 0;
        setStats({ points: n, energy: 0, awake: false });
      }
    };

    const wake = () => {
      if (!raf && visible) {
        last = performance.now();
        raf = requestAnimationFrame(loop);
      }
    };

    const local = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      return { x: e.clientX - r.left, y: e.clientY - r.top };
    };
    const onMove = (e: PointerEvent) => {
      const p = local(e);
      pointer.x = p.x;
      pointer.y = p.y;
      pointer.inside = true;
      pointer.probe = false;
      wake();
    };
    const onLeave = () => {
      pointer.inside = false;
      wake();
    };
    const onDown = (e: PointerEvent) => {
      const p = local(e);
      pulses.push({ x: p.x, y: p.y, t: performance.now() });
      if (e.pointerType !== "mouse") {
        pointer.x = p.x;
        pointer.y = p.y;
        pointer.inside = true;
      }
      wake();
    };
    const onUp = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") pointer.inside = false;
      wake();
    };
    const onKey = (e: KeyboardEvent) => {
      const stepPx = e.shiftKey ? 48 : 16;
      if (!pointer.probe || !pointer.inside) {
        if (e.key.startsWith("Arrow")) {
          pointer.x = W / 2;
          pointer.y = H / 2;
        }
      }
      switch (e.key) {
        case "ArrowLeft":
          pointer.x -= stepPx;
          break;
        case "ArrowRight":
          pointer.x += stepPx;
          break;
        case "ArrowUp":
          pointer.y -= stepPx;
          break;
        case "ArrowDown":
          pointer.y += stepPx;
          break;
        case " ":
        case "Enter":
          e.preventDefault();
          pulses.push({ x: pointer.inside ? pointer.x : W / 2, y: pointer.inside ? pointer.y : H / 2, t: performance.now() });
          wake();
          return;
        case "Escape":
          pointer.inside = false;
          pointer.probe = false;
          wake();
          return;
        default:
          return;
      }
      e.preventDefault();
      pointer.x = Math.max(0, Math.min(W, pointer.x));
      pointer.y = Math.max(0, Math.min(H, pointer.y));
      pointer.inside = true;
      pointer.probe = true;
      wake();
    };

    api.current = {
      pulse: (px = W / 2, py = H / 2) => {
        pulses.push({ x: px, y: py, t: performance.now() });
        wake();
      },
      reset: () => {
        for (let i = 0; i < n; i++) {
          x[i] = hx[i];
          y[i] = hy[i];
          vx[i] = vy[i] = 0;
        }
        pulses.length = 0;
        draw();
      },
    };

    build();
    draw();
    // Arrive with a single pulse from the centre: this is a field, it moves.
    setTimeout(() => api.current?.pulse(), 350);

    const ro = new ResizeObserver(() => {
      build();
      draw();
    });
    ro.observe(wrap);
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting && !document.hidden;
      if (visible) wake();
    });
    io.observe(wrap);
    const offTheme = onThemeChange(() => {
      colors = readColors();
      draw();
    });

    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerleave", onLeave);
    canvas.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    canvas.addEventListener("keydown", onKey);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      offTheme();
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerleave", onLeave);
      canvas.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      canvas.removeEventListener("keydown", onKey);
      api.current = null;
    };
  }, [running]);

  return (
    <>
      <div ref={wrapRef} className="absolute inset-0">
        <canvas
          ref={canvasRef}
          tabIndex={0}
          role="img"
          aria-label="A field of points. Move the pointer, or use the arrow keys, to disturb it. Press space or tap to send a pulse."
          data-cursor-label="Pulse"
          className="block touch-none select-none outline-none focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-blue"
        />
      </div>
      <div className="t-meta-sm pointer-events-none absolute inset-x-0 top-0 flex justify-between p-3 text-muted">
        <span className="bg-paper px-1">
          {stats.points.toLocaleString("en-GB")} points · {mode}
        </span>
        <span className="tabular bg-paper px-1">{stats.awake ? `energy ${stats.energy.toFixed(3)}` : "asleep"}</span>
      </div>
      <div className="absolute inset-x-0 bottom-0 flex flex-wrap justify-end gap-2 p-3">
        <StageButton onClick={() => api.current?.pulse()}>Pulse</StageButton>
        <StageButton
          onClick={() => setMode((m) => (m === "repel" ? "attract" : "repel"))}
          pressed={mode === "attract"}
          label={`Attract mode ${mode === "attract" ? "on" : "off"}`}
        >
          {mode === "attract" ? "Attract" : "Repel"}
        </StageButton>
        <StageButton onClick={() => api.current?.reset()}>Reset</StageButton>
      </div>
    </>
  );
}
