"use client";
import { useRef, useState } from "react";
import { heroDemo } from "@/data/demos";
import { discover } from "@/lib/system";
export function MorphStudio() {
  const [mode, setMode] = useState(0);
  const [done, setDone] = useState<boolean[]>([false, false, false]);
  const visited = useRef(new Set([0]));
  function changeMode(next: number) {
    setMode(next);
    visited.current.add(next);
    if (visited.current.size === 3) discover("cycle");
  }
  const completed = done.filter(Boolean).length;
  return <div className="morph-studio working-studio" data-mode={mode}>
    <div className="morph-top"><span>From idea to working thing.</span><span aria-hidden="true">↙</span></div>
    <div className="working-canvas" aria-label="A release checklist taking shape">
      <span className="system-rail" aria-hidden="true" />
      {heroDemo.tasks.map((task, i) => <div className={`working-piece working-piece-${i}`} key={task} data-done={done[i]}>
        <span className="piece-number" aria-hidden="true">0{i + 1}</span>
        <span className="piece-label">{mode === 0 ? ["Input", "State", "Output"][i] : task}</span>
        {mode === 2 && <input type="checkbox" aria-label={task} checked={done[i]} onChange={() => setDone(values => values.map((value, index) => index === i ? !value : value))} />}
      </div>)}
      <div className="working-progress" aria-live="polite">{mode === 2 ? `${completed} / 3 ready to ship` : mode === 1 ? "A release, one step at a time." : "Three parts. One connected system."}</div>
    </div>
    <div className="morph-tabs" role="group" aria-label="Explore the building process">{heroDemo.modes.map((item, i) => <button key={item.title} aria-pressed={mode === i} onClick={() => changeMode(i)}>{item.title}</button>)}</div>
    <div className="morph-caption" aria-live="polite"><strong>{heroDemo.modes[mode].note}</strong><p>{heroDemo.modes[mode].detail}</p></div>
  </div>;
}
