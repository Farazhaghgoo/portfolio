"use client";

import { Mark } from "@/components/chrome/mark";
import { SIGNAL_TOTAL, cycleTheme, openPalette, toggleInspect, useSystem } from "@/lib/system";

export function ThemeSwitch() {
  const theme = useSystem((s) => s.theme);
  return (
    <button
      type="button"
      onClick={cycleTheme}
      className="t-meta -my-3 inline-flex min-h-[44px] items-center gap-1.5 text-muted transition-colors hover:text-ink"
      aria-label={`Theme: ${theme}. Change theme.`}
    >
      Theme <span className="text-ink">{theme}</span>
    </button>
  );
}

export function SignalCount() {
  const found = useSystem((s) => s.found.length);
  if (found === 0) return null;
  return (
    <button
      type="button"
      onClick={() => openPalette("signals")}
      className="t-meta -my-3 inline-flex min-h-[44px] items-center gap-1.5 text-muted transition-colors hover:text-ink"
      aria-label={`${found} of ${SIGNAL_TOTAL} signals discovered. Show signals.`}
    >
      <span className="size-[5px] rotate-45 bg-signal" aria-hidden="true" />
      {found} / {SIGNAL_TOTAL} signals
    </button>
  );
}

/** The obscure mark. It toggles Inspect mode. */
export function InspectGlyph() {
  const on = useSystem((s) => s.inspect);
  return (
    <button
      type="button"
      onClick={toggleInspect}
      aria-pressed={on}
      aria-label="Inspect mode"
      title="Inspect"
      data-cursor-label="Inspect"
      className="group -m-3 inline-flex size-11 items-center justify-center text-faint transition-colors hover:text-ink aria-pressed:text-ink"
    >
      <Mark className="size-3.5 transition-transform duration-500 ease-[var(--ease-spring)] group-hover:-translate-y-px group-aria-pressed:rotate-180" />
    </button>
  );
}
