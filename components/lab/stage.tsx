"use client";

import { useState } from "react";
import { useReducedMotion } from "@/lib/hooks";

/**
 * A framed stage for experiments. If the system asks for reduced motion,
 * the experiment waits for an explicit "run it anyway".
 */
export function Stage({
  label,
  children,
  hud,
  controls,
}: {
  label: string;
  children: (running: boolean) => React.ReactNode;
  hud?: React.ReactNode;
  controls?: React.ReactNode;
}) {
  const reduced = useReducedMotion();
  const [consent, setConsent] = useState(false);
  const running = !reduced || consent;

  return (
    <div className="relative" data-spec={`Lab / ${label}`}>
      <div className="relative h-[min(74svh,62vw)] min-h-[420px] overflow-hidden border border-line bg-paper max-md:h-[68svh]">
        {children(running)}
        {hud ? <div className="t-meta-sm pointer-events-none absolute inset-x-0 top-0 flex justify-between p-3 text-muted">{hud}</div> : null}
        {!running ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-paper/85 p-6 text-center">
            <p className="t-small max-w-[36ch] text-ink-2">
              Your system asks for reduced motion. This experiment is mostly motion, so it waits for you.
            </p>
            <button type="button" onClick={() => setConsent(true)} className="hit border border-ink px-4 text-[14px] hover:bg-ink hover:text-paper">
              Run it anyway
            </button>
          </div>
        ) : null}
      </div>
      {controls ? <div className="mt-3 flex flex-wrap items-center justify-between gap-x-6 gap-y-2">{controls}</div> : null}
    </div>
  );
}

export function StageButton({
  children,
  onClick,
  pressed,
  label,
}: {
  children: React.ReactNode;
  onClick: () => void;
  pressed?: boolean;
  label?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={pressed}
      aria-label={label}
      className="t-meta hit inline-flex items-center gap-2 border border-line bg-paper px-3 transition-colors hover:border-ink aria-pressed:border-blue aria-pressed:text-blue"
    >
      {children}
    </button>
  );
}

export function readColors() {
  const cs = getComputedStyle(document.documentElement);
  return {
    paper: cs.getPropertyValue("--paper").trim() || "#f1eee6",
    ink: cs.getPropertyValue("--ink").trim() || "#131312",
    blue: cs.getPropertyValue("--blue").trim() || "#2440ff",
    faint: cs.getPropertyValue("--faint").trim() || "#a7a397",
    signal: cs.getPropertyValue("--signal").trim() || "#ff4f1a",
  };
}

/** Calls `cb` when the effective theme changes. */
export function onThemeChange(cb: () => void) {
  const mo = new MutationObserver(cb);
  mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  const mql = window.matchMedia("(prefers-color-scheme: dark)");
  mql.addEventListener("change", cb);
  return () => {
    mo.disconnect();
    mql.removeEventListener("change", cb);
  };
}
