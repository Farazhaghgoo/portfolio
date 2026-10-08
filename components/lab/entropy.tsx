"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Stage, StageButton } from "@/components/lab/stage";
import { useMediaQuery } from "@/lib/hooks";

type Kind = "text" | "meta" | "pill" | "display" | "serif" | "italic" | "rule" | "row" | "dot";

interface BlockDef {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
  kind: Kind;
  text: string;
}

/* The homepage, drawn as blocks on a unit grid. 24×15 wide, 12×20 tall. */
const WIDE: { cols: number; rows: number; blocks: BlockDef[] } = {
  cols: 24,
  rows: 15,
  blocks: [
    { id: "name", x: 1, y: 0.8, w: 3.6, h: 0.55, kind: "text", text: "Faraz Haghgoo" },
    { id: "work", x: 9.4, y: 0.8, w: 1.3, h: 0.55, kind: "text", text: "Work" },
    { id: "about", x: 11, y: 0.8, w: 1.5, h: 0.55, kind: "text", text: "About" },
    { id: "archive", x: 12.8, y: 0.8, w: 1.8, h: 0.55, kind: "text", text: "Archive" },
    { id: "now", x: 14.9, y: 0.8, w: 1.1, h: 0.55, kind: "text", text: "Now" },
    { id: "lab", x: 16.3, y: 0.8, w: 1.1, h: 0.55, kind: "text", text: "Lab" },
    { id: "cmd", x: 19, y: 0.8, w: 2, h: 0.55, kind: "text", text: "Command /" },
    { id: "contact", x: 21.2, y: 0.7, w: 1.8, h: 0.75, kind: "pill", text: "Contact" },
    { id: "m1", x: 1, y: 2.2, w: 3.2, h: 0.4, kind: "meta", text: "FH—000 / Index" },
    { id: "m2", x: 7, y: 2.2, w: 4.2, h: 0.4, kind: "meta", text: "45.0703° N 7.6869° E" },
    { id: "m3", x: 13, y: 2.2, w: 4.4, h: 0.4, kind: "meta", text: "Software / Product / AI" },
    { id: "m4", x: 20, y: 2.2, w: 3, h: 0.4, kind: "meta", text: "Turin, Italy" },
    { id: "h1", x: 1, y: 3.2, w: 22, h: 3.6, kind: "display", text: "Faraz Haghgoo" },
    { id: "s1", x: 1, y: 8.6, w: 8.4, h: 1.3, kind: "serif", text: "I build systems," },
    { id: "s2", x: 3.4, y: 9.9, w: 5, h: 1.3, kind: "italic", text: "products" },
    { id: "s3", x: 1, y: 11.2, w: 8.2, h: 1.3, kind: "serif", text: "and interfaces." },
    { id: "rot", x: 1, y: 13, w: 9, h: 0.5, kind: "dot", text: "Turning complex systems into understandable interfaces." },
    { id: "st0", x: 15, y: 8.4, w: 8, h: 0.5, kind: "rule", text: "System status" },
    { id: "st1", x: 15, y: 9.1, w: 8, h: 0.55, kind: "row", text: "Location|Turin / Italy" },
    { id: "st2", x: 15, y: 9.75, w: 8, h: 0.55, kind: "row", text: "Local time|17:42:09" },
    { id: "st3", x: 15, y: 10.4, w: 8, h: 0.55, kind: "row", text: "Working in|Software / Product" },
    { id: "st4", x: 15, y: 11.05, w: 8, h: 0.55, kind: "row", text: "Exploring|AI / Interaction" },
    { id: "st5", x: 15, y: 11.7, w: 8, h: 0.55, kind: "row", text: "Status|Building" },
    { id: "st6", x: 15, y: 12.35, w: 8, h: 0.55, kind: "row", text: "Session|00:04:12" },
    { id: "f1", x: 1, y: 14, w: 6.6, h: 0.4, kind: "meta", text: "Software Developer / Product Builder" },
    { id: "f2", x: 21.4, y: 14, w: 1.6, h: 0.4, kind: "meta", text: "Index ↓" },
  ],
};

const TALL: typeof WIDE = {
  cols: 12,
  rows: 20,
  blocks: [
    { id: "name", x: 0.8, y: 0.8, w: 4.6, h: 0.7, kind: "text", text: "Faraz Haghgoo" },
    { id: "menu", x: 9.4, y: 0.8, w: 1.8, h: 0.7, kind: "text", text: "Menu" },
    { id: "m1", x: 0.8, y: 2.2, w: 4.4, h: 0.5, kind: "meta", text: "FH—000 / Index" },
    { id: "m4", x: 7.2, y: 2.2, w: 4, h: 0.5, kind: "meta", text: "Turin, Italy" },
    { id: "h1a", x: 0.8, y: 3.3, w: 6.8, h: 2.6, kind: "display", text: "Faraz" },
    { id: "h1b", x: 0.8, y: 5.9, w: 10.4, h: 2.6, kind: "display", text: "Haghgoo" },
    { id: "s1", x: 0.8, y: 9.3, w: 8.6, h: 1.2, kind: "serif", text: "I build systems," },
    { id: "s2", x: 2.6, y: 10.5, w: 5, h: 1.2, kind: "italic", text: "products" },
    { id: "s3", x: 0.8, y: 11.7, w: 8.4, h: 1.2, kind: "serif", text: "and interfaces." },
    { id: "rot", x: 0.8, y: 13.3, w: 10.4, h: 0.6, kind: "dot", text: "Building digital products." },
    { id: "st0", x: 0.8, y: 14.5, w: 10.4, h: 0.6, kind: "rule", text: "System status" },
    { id: "st1", x: 0.8, y: 15.2, w: 10.4, h: 0.6, kind: "row", text: "Location|Turin / Italy" },
    { id: "st2", x: 0.8, y: 15.85, w: 10.4, h: 0.6, kind: "row", text: "Local time|17:42:09" },
    { id: "st5", x: 0.8, y: 16.5, w: 10.4, h: 0.6, kind: "row", text: "Status|Building" },
    { id: "st6", x: 0.8, y: 17.15, w: 10.4, h: 0.6, kind: "row", text: "Session|00:04:12" },
    { id: "f1", x: 0.8, y: 18.6, w: 8, h: 0.5, kind: "meta", text: "Developer / Product builder" },
  ],
};

interface Body {
  el: HTMLElement;
  hx: number;
  hy: number;
  w: number;
  h: number;
  ox: number;
  oy: number;
  vx: number;
  vy: number;
  a: number;
  va: number;
  drag: boolean;
}

type EntropyApi = { wake: () => void; shake: () => void };

/** LAB/02 — the homepage as a physical system. */
export default function Entropy() {
  const apiRef = useRef<EntropyApi | null>(null);
  const [entropy, setEntropy] = useState(0);
  const [displacement, setDisplacement] = useState(0);
  const sliderId = useId();

  return (
    <Stage
      label="Entropy / DOM physics"
      controls={
        <>
          <EntropyControls entropy={entropy} setEntropy={setEntropy} sliderId={sliderId} apiRef={apiRef} />
          <p className="t-meta flex gap-5 text-muted" aria-live="off">
            <span>Order {Math.round(100 - entropy)}%</span>
            <span className="tabular">Displacement {displacement.toFixed(1)}px</span>
          </p>
        </>
      }
    >
      {(running) => <EntropyStage running={running} entropy={entropy} apiRef={apiRef} onReadout={setDisplacement} />}
    </Stage>
  );
}

function EntropyStage({
  running,
  entropy,
  apiRef,
  onReadout,
}: {
  running: boolean;
  entropy: number;
  apiRef: React.RefObject<EntropyApi | null>;
  onReadout: (displacement: number) => void;
}) {
  const tall = useMediaQuery("(max-width: 767px)");
  const layout = tall ? TALL : WIDE;
  const stageRef = useRef<HTMLDivElement>(null);
  const entropyRef = useRef(0);

  useEffect(() => {
    entropyRef.current = entropy / 100;
    apiRef.current?.wake();
  }, [entropy, apiRef]);

  const blocks = layout.blocks;

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage || !running) return;
    const els = Array.from(stage.querySelectorAll<HTMLElement>("[data-block]"));
    let bodies: Body[] = [];
    let W = 0;
    let H = 0;
    let raf = 0;
    let lastReadout = 0;

    const measure = () => {
      const rect = stage.getBoundingClientRect();
      W = rect.width;
      H = rect.height;
      const unit = Math.min(W / layout.cols, H / layout.rows);
      const offX = (W - unit * layout.cols) / 2;
      const offY = (H - unit * layout.rows) / 2;
      bodies = els.map((el, i) => {
        const def = blocks[i];
        const prev = bodies[i];
        const w = def.w * unit;
        const h = def.h * unit;
        el.style.width = `${w}px`;
        el.style.height = `${h}px`;
        el.style.fontSize = `${unit}px`;
        return {
          el,
          hx: offX + def.x * unit,
          hy: offY + def.y * unit,
          w,
          h,
          ox: prev?.ox ?? 0,
          oy: prev?.oy ?? 0,
          vx: prev?.vx ?? 0,
          vy: prev?.vy ?? 0,
          a: prev?.a ?? 0,
          va: prev?.va ?? 0,
          drag: false,
        };
      });
      render();
    };

    const render = () => {
      for (const b of bodies) {
        b.el.style.transform = `translate3d(${b.hx + b.ox}px, ${b.hy + b.oy}px, 0) rotate(${b.a}deg)`;
      }
    };

    const step = () => {
      const E = entropyRef.current;
      const order = 1 - E;
      const k = 0.07 * order * order;
      const noise = Math.pow(E, 1.4) * 1.1;
      const damp = 0.86 + 0.11 * E;
      let moving = false;
      let total = 0;
      for (const b of bodies) {
        if (!b.drag) {
          b.vx = (b.vx - b.ox * k + (Math.random() - 0.5) * noise * 2) * damp;
          b.vy = (b.vy - b.oy * k + (Math.random() - 0.5) * noise * 2) * damp;
          b.va = (b.va - b.a * k * 0.8 + (Math.random() - 0.5) * noise * 0.5) * damp;
          b.ox += b.vx;
          b.oy += b.vy;
          b.a += b.va;
          // Walls: keep each block's centre inside the stage.
          const cx = b.hx + b.ox + b.w / 2;
          const cy = b.hy + b.oy + b.h / 2;
          if (cx < 0) {
            b.ox -= cx;
            b.vx = Math.abs(b.vx) * 0.6;
          } else if (cx > W) {
            b.ox -= cx - W;
            b.vx = -Math.abs(b.vx) * 0.6;
          }
          if (cy < 0) {
            b.oy -= cy;
            b.vy = Math.abs(b.vy) * 0.6;
          } else if (cy > H) {
            b.oy -= cy - H;
            b.vy = -Math.abs(b.vy) * 0.6;
          }
        }
        const speed = Math.abs(b.vx) + Math.abs(b.vy) + Math.abs(b.va);
        b.el.toggleAttribute("data-hot", speed > 2.5 || b.drag);
        if (speed > 0.02 || Math.abs(b.ox) + Math.abs(b.oy) + Math.abs(b.a) > 0.1 || b.drag) moving = true;
        total += Math.hypot(b.ox, b.oy);
      }
      if (!moving) {
        for (const b of bodies) {
          b.ox = b.oy = b.a = b.vx = b.vy = b.va = 0;
        }
      }
      return { moving: moving || E > 0, displacement: total / Math.max(bodies.length, 1) };
    };

    const loop = (now: number) => {
      const { moving, displacement } = step();
      render();
      if (now - lastReadout > 200) {
        lastReadout = now;
        onReadout(displacement);
      }
      if (moving) raf = requestAnimationFrame(loop);
      else {
        raf = 0;
        onReadout(0);
      }
    };
    const wake = () => {
      if (!raf) raf = requestAnimationFrame(loop);
    };

    // Dragging
    let drag: { body: Body; id: number; gx: number; gy: number; lx: number; ly: number; lt: number; vx: number; vy: number } | null = null;
    const onDown = (e: PointerEvent) => {
      const target = (e.target as HTMLElement).closest<HTMLElement>("[data-block]");
      if (!target) return;
      const body = bodies.find((b) => b.el === target);
      if (!body) return;
      e.preventDefault();
      stage.setPointerCapture(e.pointerId);
      const r = stage.getBoundingClientRect();
      const px = e.clientX - r.left;
      const py = e.clientY - r.top;
      body.drag = true;
      body.vx = body.vy = 0;
      drag = { body, id: e.pointerId, gx: px - (body.hx + body.ox), gy: py - (body.hy + body.oy), lx: px, ly: py, lt: performance.now(), vx: 0, vy: 0 };
      target.setAttribute("data-grabbed", "");
      wake();
    };
    const onMove = (e: PointerEvent) => {
      if (!drag || e.pointerId !== drag.id) return;
      const r = stage.getBoundingClientRect();
      const px = e.clientX - r.left;
      const py = e.clientY - r.top;
      const now = performance.now();
      const dt = Math.max(now - drag.lt, 1);
      drag.vx = drag.vx * 0.6 + ((px - drag.lx) / dt) * 16.67 * 0.4;
      drag.vy = drag.vy * 0.6 + ((py - drag.ly) / dt) * 16.67 * 0.4;
      drag.lx = px;
      drag.ly = py;
      drag.lt = now;
      drag.body.ox = px - drag.gx - drag.body.hx;
      drag.body.oy = py - drag.gy - drag.body.hy;
      drag.body.a = Math.max(-12, Math.min(12, drag.vx * 0.8));
    };
    const onUp = (e: PointerEvent) => {
      if (!drag || e.pointerId !== drag.id) return;
      drag.body.drag = false;
      drag.body.vx = drag.vx;
      drag.body.vy = drag.vy;
      drag.body.va = drag.vx * 0.3;
      drag.body.el.removeAttribute("data-grabbed");
      drag = null;
      wake();
    };

    apiRef.current = {
      wake,
      shake: () => {
        for (const b of bodies) {
          b.vx += (Math.random() - 0.5) * 36;
          b.vy += (Math.random() - 0.5) * 36;
          b.va += (Math.random() - 0.5) * 14;
        }
        wake();
      },
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(stage);
    stage.addEventListener("pointerdown", onDown);
    stage.addEventListener("pointermove", onMove);
    stage.addEventListener("pointerup", onUp);
    stage.addEventListener("pointercancel", onUp);
    wake();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      stage.removeEventListener("pointerdown", onDown);
      stage.removeEventListener("pointermove", onMove);
      stage.removeEventListener("pointerup", onUp);
      stage.removeEventListener("pointercancel", onUp);
      apiRef.current = null;
    };
  }, [running, layout, blocks, apiRef, onReadout]);

  return (
    <>
      <div ref={stageRef} className="absolute inset-0 select-none" aria-hidden="true">
        {blocks.map((b) => (
          <div
            key={b.id}
            data-block
            data-kind={b.kind}
            data-cursor-label="Drag"
            className="entropy-block absolute left-0 top-0 touch-none"
          >
            <BlockContent def={b} />
          </div>
        ))}
      </div>
    </>
  );
}

function EntropyControls({
  entropy,
  setEntropy,
  sliderId,
  apiRef,
}: {
  entropy: number;
  setEntropy: (n: number) => void;
  sliderId: string;
  apiRef: React.RefObject<EntropyApi | null>;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <label htmlFor={sliderId} className="t-meta flex h-11 items-center gap-3 border border-line bg-paper px-3">
        <span>Entropy</span>
        <input
          id={sliderId}
          type="range"
          min={0}
          max={100}
          step={1}
          value={entropy}
          onChange={(e) => setEntropy(Number(e.target.value))}
          className="entropy-range w-[clamp(96px,14vw,180px)]"
          aria-valuetext={`${entropy} percent`}
        />
        <span className="tabular w-[3ch] text-right">{entropy}</span>
      </label>
      <StageButton onClick={() => apiRef.current?.shake()}>Shake</StageButton>
      <StageButton
        onClick={() => {
          setEntropy(0);
          apiRef.current?.wake();
        }}
      >
        Restore order
      </StageButton>
    </div>
  );
}

function BlockContent({ def }: { def: BlockDef }) {
  switch (def.kind) {
    case "display":
      return <span className="block whitespace-nowrap text-[2.9em] font-semibold leading-[1.1] tracking-[-0.058em]">{def.text}</span>;
    case "serif":
    case "italic":
      return (
        <span className={`t-serif block whitespace-nowrap text-[1.15em] leading-[1.1] tracking-[-0.02em] ${def.kind === "italic" ? "italic" : ""}`}>
          {def.text}
        </span>
      );
    case "pill":
      return <span className="flex h-full items-center justify-center rounded-full bg-ink text-[0.32em] text-paper">{def.text}</span>;
    case "meta":
      return <span className="block truncate font-mono text-[0.24em] uppercase leading-[1.7em] tracking-[0.04em] text-muted">{def.text}</span>;
    case "rule":
      return <span className="block h-full border-t border-ink pt-[0.08em] font-mono text-[0.24em] uppercase tracking-[0.04em]">{def.text}</span>;
    case "row": {
      const [k, v] = def.text.split("|");
      return (
        <span className="flex h-full items-center gap-[1em] border-b border-line text-[0.3em]">
          <span className="w-[9em] font-mono text-[0.82em] uppercase text-muted">{k}</span>
          <span className={k === "Status" ? "text-blue" : ""}>{v}</span>
        </span>
      );
    }
    case "dot":
      return (
        <span className="flex h-full items-center gap-[0.8em] truncate text-[0.3em]">
          <span className="size-[0.5em] flex-none rounded-full bg-blue" />
          {def.text}
        </span>
      );
    default:
      return <span className="flex h-full items-center whitespace-nowrap text-[0.32em]">{def.text}</span>;
  }
}
