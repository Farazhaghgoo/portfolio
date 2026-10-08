"use client";

import { useEffect, useRef } from "react";
import { signals } from "@/data/signals";
import { useFocusTrap, useScrollLock } from "@/lib/hooks";
import { SIGNAL_TOTAL, clearLog, closeLog, useSystem } from "@/lib/system";

function clock(t: number) {
  const d = new Date(t);
  return [d.getHours(), d.getMinutes(), d.getSeconds()].map((n) => String(n).padStart(2, "0")).join(":");
}

function offset(t: number, start: number) {
  const s = Math.max(0, Math.floor((t - start) / 1000));
  return `+${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
}

/** The hidden screen: everything you did here, kept only in this tab. */
export default function SessionLog() {
  const open = useSystem((s) => s.logOpen);
  if (!open) return null;
  return <Log />;
}

function Log() {
  const log = useSystem((s) => s.log);
  const found = useSystem((s) => s.found);
  const startedAt = useSystem((s) => s.startedAt);
  const ref = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useFocusTrap(ref, true);
  useScrollLock(true);

  useEffect(() => {
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLog();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    // Scroll the panel itself; scrollIntoView would also move the locked page.
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [log.length]);

  const start = startedAt || log[0]?.t || 0;

  return (
    <div
      ref={ref}
      role="dialog"
      aria-modal="true"
      aria-labelledby="session-log-title"
      className="fixed inset-0 z-[88] flex flex-col bg-ink text-paper [animation:fade_.35s_var(--ease-out)_both]"
    >
      <div className="frame flex h-[var(--header-h)] flex-none items-center justify-between border-b border-paper/15">
        <h2 id="session-log-title" className="t-meta">
          Session log <span className="text-paper/50">/ {log.length} entries</span>
        </h2>
        <div className="flex items-center gap-1">
          <button type="button" onClick={clearLog} className="t-meta hit px-3 text-paper/60 hover:text-paper">
            Clear
          </button>
          <button ref={closeRef} type="button" onClick={closeLog} className="t-meta hit -mr-3 px-3 hover:text-blue">
            Close <span className="text-paper/50">esc</span>
          </button>
        </div>
      </div>

      <div ref={scrollRef} className="frame grid-12 scroll-quiet min-h-0 flex-1 gap-y-8 overflow-y-auto py-8">
        <div className="col-span-12 lg:col-span-4">
          <p className="t-serif text-[clamp(30px,3.4vw,52px)] leading-[1.02] italic text-paper/95 balance">
            Everything you did here, in order.
          </p>
          <p className="t-small mt-5 max-w-[38ch] text-paper/60 pretty">
            Kept in this tab only. Nothing on this site sends it anywhere: no analytics, no tracking. Close the tab and it’s gone.
          </p>
          <div className="mt-8">
            <p className="t-meta text-paper/50">
              Signals {found.length} / {SIGNAL_TOTAL}
            </p>
            <ul className="t-small mt-2 space-y-1">
              {signals.map((s) => (
                <li key={s.id} className={found.includes(s.id) ? "text-paper" : "text-paper/35"}>
                  <span className={`mr-2 inline-block size-[5px] -translate-y-[2px] rotate-45 ${found.includes(s.id) ? "bg-signal" : "bg-paper/25"}`} aria-hidden="true" />
                  {found.includes(s.id) ? s.found : "Not found yet."}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <ol className="t-mono col-span-12 text-[13px] leading-[1.75] lg:col-span-8" aria-label="Log entries">
          {log.map((e, i) => (
            <li key={`${e.t}-${i}`} className="grid grid-cols-[8.5ch_7ch_10ch_1fr] gap-x-3 border-b border-paper/10 py-1 max-sm:grid-cols-[8.5ch_1fr] max-sm:gap-y-0">
              <span className="text-paper/55 tabular">{clock(e.t)}</span>
              <span className="text-paper/35 tabular max-sm:hidden">{offset(e.t, start)}</span>
              <span className="flex items-center gap-2 uppercase text-paper/55 max-sm:hidden">
                <span
                  aria-hidden="true"
                  className={`size-[5px] flex-none ${e.kind === "signal" ? "rotate-45 bg-signal" : e.kind === "route" ? "bg-blue" : "bg-paper/30"}`}
                />
                {e.kind}
              </span>
              <span className="text-paper/90">{e.text}</span>
            </li>
          ))}
          <li className="py-2 text-paper/40">
            <span className="inline-block h-[1.1em] w-[0.55em] translate-y-[3px] bg-paper/70 [animation:pulse-dot_1.1s_steps(1)_infinite]" aria-hidden="true" />
          </li>
        </ol>
      </div>
    </div>
  );
}
