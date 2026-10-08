"use client";

import { LocalTime } from "@/components/chrome/local-time";
import { profile } from "@/data/profile";
import { formatDuration, useNow } from "@/lib/hooks";
import { advanceStage, useSystem } from "@/lib/system";

/**
 * A small, live readout. Editorial, not a terminal.
 * The status line advances through the process when pressed; going all the
 * way round is one of the site's signals.
 */
export function SystemStatus() {
  const stage = useSystem((s) => s.stage);
  const startedAt = useSystem((s) => s.startedAt);
  const cycleAt = useSystem((s) => s.cycleAt);
  const now = useNow();
  const complete = now !== null && cycleAt > 0 && now - cycleAt < 3500;

  const rows: { label: string; value: React.ReactNode }[] = [
    { label: "Location", value: `${profile.location.city} / ${profile.location.country}` },
    { label: "Local time", value: <LocalTime seconds /> },
    { label: "Working in", value: profile.status.workingIn },
    { label: "Exploring", value: profile.status.exploring },
  ];

  return (
    <section aria-labelledby="status-title" data-spec="Component / SystemStatus" className="rule-ink pt-2.5">
      <div className="t-meta flex items-center justify-between">
        <h2 id="status-title">System status</h2>
        <span className="flex items-center gap-2 text-muted">
          <span className="dot dot-live" aria-hidden="true" />
          Live
        </span>
      </div>

      <dl className="mt-3 text-[14px] leading-[1.35] tracking-[-0.005em]">
        {rows.map((row) => (
          <div key={row.label} className="grid grid-cols-[11ch_1fr] gap-3 border-b border-line py-[7px]">
            <dt className="t-meta-sm pt-[2px] text-muted">{row.label}</dt>
            <dd>{row.value}</dd>
          </div>
        ))}

        <div className="grid grid-cols-[11ch_1fr] gap-3 border-b border-line py-[7px]">
          <dt className="t-meta-sm pt-[2px] text-muted">Status</dt>
          <dd className="min-w-0">
            <button
              type="button"
              onClick={advanceStage}
              data-cursor-label="Next stage"
              aria-label={`Status: ${profile.processStatus[stage]}. Advance to the next stage.`}
              className="group -my-2 flex min-h-[36px] w-full items-center justify-between gap-2 text-left"
            >
              <span className="text-blue">{profile.processStatus[stage]}</span>
              <span
                aria-hidden="true"
                className={`t-meta-sm transition-opacity duration-500 ${complete ? "text-ink opacity-100" : "text-muted opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100"}`}
              >
                {complete ? "Cycle complete ✓" : "Next →"}
              </span>
            </button>
            <ol className="t-meta-sm mt-1.5 flex flex-wrap gap-x-1.5 text-muted" aria-label="Process">
              {profile.process.map((step, i) => (
                <li key={step} className="flex items-center gap-1.5" aria-current={i === stage ? "step" : undefined}>
                  <span className={i === stage ? "text-blue" : ""}>{step}</span>
                  {i < profile.process.length - 1 ? (
                    <span aria-hidden="true" className="text-faint">
                      →
                    </span>
                  ) : null}
                </li>
              ))}
            </ol>
          </dd>
        </div>

        <div className="grid grid-cols-[11ch_1fr] gap-3 py-[7px]">
          <dt className="t-meta-sm pt-[2px] text-muted">Session</dt>
          <dd className="t-mono tabular text-[13px]" suppressHydrationWarning>
            {now && startedAt ? formatDuration(now - startedAt) : "00:00:00"}
          </dd>
        </div>
      </dl>
    </section>
  );
}
