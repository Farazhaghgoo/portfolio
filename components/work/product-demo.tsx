"use client";
import { useState } from "react";
import { examDemo, metricsDemo } from "@/data/demos";
export function ProductDemo({ kind }: { kind: "exam" | "metrics" }) {
  const [answer, setAnswer] = useState<number | null>(null);
  const [period, setPeriod] = useState(0);
  const sample = metricsDemo.periods[period];
  return <div className={`product-demo product-demo--${kind}`}>
    <div className="demo-heading"><strong>{kind === "exam" ? "EXAMassist" : "VibeAssist"}</strong><span>Interactive sketch · Sample data</span></div>
    {kind === "exam" ? <>
      <p className="demo-kicker">Try one question / Quantitative reasoning</p>
      <fieldset><legend>{examDemo.question}</legend><div className="demo-options">{examDemo.options.map((option, i) => <button type="button" key={option} aria-pressed={answer === i} onClick={() => setAnswer(i)}>{option}<span aria-hidden="true">{answer === i ? "●" : "○"}</span></button>)}</div></fieldset>
      <div className="demo-feedback" role="status">{answer === null ? "Choose an answer to reveal the reasoning." : <><strong>{answer === examDemo.correct ? "That’s right. " : "Not quite. "}</strong>{examDemo.explanation}</>}</div>
      <button className="demo-reset" onClick={() => setAnswer(null)} disabled={answer === null}>Reset question ↻</button>
    </> : <>
      <div className="demo-periods" role="group" aria-label="Sample reporting period">{metricsDemo.periods.map((item, i) => <button key={item.label} aria-pressed={period === i} onClick={() => setPeriod(i)}>{item.label}</button>)}</div>
      <dl className="demo-metrics" aria-live="polite"><div><dt>Revenue</dt><dd>€{sample.revenue.toLocaleString("en-IE")}</dd></div><div><dt>Ad spend</dt><dd>€{sample.spend}</dd></div><div><dt>After ad spend*</dt><dd>€{sample.revenue - sample.spend}</dd></div></dl>
      <div className="demo-chart" aria-hidden="true">{sample.values.map((value, i) => <span key={i} style={{ height: `${value}%` }} />)}</div>
      <p className="demo-chart-caption">Illustrative daily activity · Mon–Sun</p><p className="demo-disclaimer">*Revenue minus advertising only; other costs excluded. Fictional figures, never live customer data.</p>
    </>}
  </div>;
}
