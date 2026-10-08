"use client";
import { useRef, useState } from "react";
import { studio } from "@/data/studio";
import { discover } from "@/lib/system";

export function MorphStudio() {
  const [mode, setMode] = useState(0);
  const visited = useRef(new Set([0]));
  const current = studio.modes[mode];

  function changeMode(next: number) {
    setMode(next);
    visited.current.add(next);
    if (visited.current.size === studio.modes.length) discover("cycle");
  }

  return <div className="morph-studio" data-mode={mode}>
    <div className="morph-top"><span>Ideas take shape.</span><span aria-hidden="true">↙</span></div>
    <button className="morph-canvas" onClick={() => changeMode((mode + 1) % studio.modes.length)} aria-label={`Current shape: ${current.title}. Change to ${studio.modes[(mode + 1) % studio.modes.length].title}.`}>
      <span className="morph-piece piece-a" /><span className="morph-piece piece-b" /><span className="morph-piece piece-c" /><span className="morph-piece piece-d" />
      <span className="morph-center" aria-hidden="true">{mode === 0 ? "+" : mode === 1 ? "↗" : "*"}</span>
      <span className="morph-invitation">Click to reshape ↻</span>
    </button>
    <div className="morph-tabs" role="group" aria-label="Explore my interests">{studio.modes.map((item, i) => <button key={item.title} aria-pressed={mode === i} onClick={() => changeMode(i)}>{item.title}</button>)}</div>
    <div className="morph-caption" aria-live="polite"><strong>{current.note}</strong><p>{current.detail}</p></div>
  </div>;
}
