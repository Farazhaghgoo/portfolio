"use client";

import { useEffect, useState } from "react";
import { effectiveTheme, setInspect, useSystem } from "@/lib/system";

const BREAKPOINTS: [string, number][] = [
  ["3xl", 1920],
  ["2xl", 1536],
  ["xl", 1280],
  ["lg", 1024],
  ["md", 768],
  ["sm", 640],
  ["xs", 400],
  ["base", 0],
];

interface Metrics {
  w: number;
  h: number;
  scroll: number;
  fps: number | null;
  gutter: number;
  margin: number;
  nodes: number;
}

/** Inspect mode: the layout grid, component labels and live metrics. */
export default function InspectOverlay() {
  const on = useSystem((s) => s.inspect);
  const theme = useSystem((s) => s.theme);
  const [m, setM] = useState<Metrics | null>(null);

  useEffect(() => {
    if (!on) return;
    let raf = 0;
    let frames = 0;
    let last = performance.now();
    let fps: number | null = null;
    const read = () => {
      const cs = getComputedStyle(document.documentElement);
      const px = (v: string) => Math.round(parseFloat(cs.getPropertyValue(v)) || 0);
      const max = document.documentElement.scrollHeight - window.innerHeight;
      // --pad and --gutter are clamp() expressions; measure them from a probe.
      const probe = document.createElement("div");
      probe.style.cssText = "position:absolute;visibility:hidden;width:var(--pad);height:var(--gutter)";
      document.body.appendChild(probe);
      const margin = probe.offsetWidth;
      const gutter = probe.offsetHeight;
      probe.remove();
      setM({
        w: window.innerWidth,
        h: window.innerHeight,
        scroll: max > 0 ? Math.round((window.scrollY / max) * 100) : 0,
        fps,
        gutter: gutter || px("--gutter"),
        margin: margin || px("--pad"),
        nodes: document.getElementsByTagName("*").length,
      });
    };
    const loop = (t: number) => {
      frames++;
      if (t - last >= 500) {
        fps = Math.round((frames * 1000) / (t - last));
        frames = 0;
        last = t;
        read();
      }
      raf = requestAnimationFrame(loop);
    };
    read();
    raf = requestAnimationFrame(loop);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !document.querySelector("[aria-modal='true']")) setInspect(false);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("resize", read);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", read);
    };
  }, [on]);

  if (!on) return null;
  const bp = m ? BREAKPOINTS.find(([, min]) => m.w >= min)?.[0] : "—";
  const cols = m && m.w < 768 ? 4 : 12;

  return (
    <>
      <div className="inspect-grid" aria-hidden="true">
        <div className="frame inspect-grid__cols grid h-full" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0,1fr))`, columnGap: "var(--gutter)" }}>
          {Array.from({ length: cols }, (_, i) => (
            <div key={i} />
          ))}
        </div>
      </div>
      <aside
        aria-label="Inspect mode"
        className="t-meta-sm fixed bottom-4 right-4 z-[86] w-[260px] border border-blue bg-paper text-ink shadow-[0_12px_40px_-16px_rgb(0_0_0/0.3)]"
      >
        <div className="flex items-center justify-between bg-blue px-3 py-1.5 text-on-blue">
          <span>Inspect</span>
          <button type="button" onClick={() => setInspect(false)} className="-my-2 -mr-2 min-h-[32px] px-2 uppercase" aria-label="Exit inspect mode">
            Esc ×
          </button>
        </div>
        {m ? (
          <dl className="grid grid-cols-[11ch_1fr] gap-x-2 gap-y-1 px-3 py-2.5">
            <dt className="text-muted">Viewport</dt>
            <dd>
              {m.w} × {m.h}
            </dd>
            <dt className="text-muted">Breakpoint</dt>
            <dd>{bp}</dd>
            <dt className="text-muted">Grid</dt>
            <dd>
              {cols} col · {m.gutter}px gutter
            </dd>
            <dt className="text-muted">Margin</dt>
            <dd>{m.margin}px</dd>
            <dt className="text-muted">Scroll</dt>
            <dd>{m.scroll}%</dd>
            <dt className="text-muted">Frame</dt>
            <dd className={m.fps !== null && m.fps < 30 ? "text-signal" : ""}>{m.fps === null ? "measuring…" : `${m.fps} fps`}</dd>
            <dt className="text-muted">DOM</dt>
            <dd>{m.nodes} nodes</dd>
            <dt className="text-muted">Theme</dt>
            <dd>
              {theme} → {effectiveTheme(theme)}
            </dd>
            <dt className="text-muted">Type</dt>
            <dd className="normal-case">Geist · Geist Mono · Instrument Serif</dd>
          </dl>
        ) : null}
      </aside>
    </>
  );
}
