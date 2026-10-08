"use client";

import { useEffect } from "react";
import { signals } from "@/data/signals";
import { SIGNAL_TOTAL, dismissToast, useSystem } from "@/lib/system";

/** A quiet note in the corner. No confetti. Gone in a few seconds. */
export function SignalToast() {
  const toast = useSystem((s) => s.toast);
  const count = useSystem((s) => s.found.length);
  const signal = toast ? signals.find((s) => s.id === toast.id) : null;
  const seq = toast?.seq;

  useEffect(() => {
    if (seq === undefined) return;
    const t = setTimeout(dismissToast, 4600);
    return () => clearTimeout(t);
  }, [seq]);

  return (
    <div role="status" aria-live="polite" className="pointer-events-none fixed bottom-4 left-4 z-[85] sm:bottom-6 sm:left-6">
      {signal ? (
        <div
          key={seq}
          className="pointer-events-auto w-[min(300px,calc(100vw-32px))] border border-line bg-paper px-3.5 py-3 shadow-[0_12px_40px_-16px_rgb(0_0_0/0.3)] [animation:rise_.6s_var(--ease-out)_both]"
        >
          <p className="t-meta-sm flex items-center justify-between text-muted">
            <span className="flex items-center gap-2">
              <span className="size-[5px] rotate-45 bg-signal" aria-hidden="true" />
              Signal discovered
            </span>
            <span className="tabular">
              {count} / {SIGNAL_TOTAL}
            </span>
          </p>
          <p className="t-small mt-1.5">{signal.found}</p>
        </div>
      ) : null}
    </div>
  );
}
