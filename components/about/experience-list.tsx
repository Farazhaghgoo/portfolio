import { experience } from "@/data/experience";

/**
 * Compact on purpose. Professional work first and larger; education after.
 * Unknown roles and dates are simply not rendered.
 */
export function ExperienceList() {
  return (
    <div className="space-y-[clamp(40px,5vw,72px)]">
      <div>
        <h3 className="t-meta mb-3 text-muted" data-reveal>
          Work
        </h3>
        <ul className="rule">
          {experience.map((e) => (
            <li key={e.organization} className="grid-12 gap-y-2 border-b border-line py-[clamp(16px,2vw,28px)]" data-reveal>
              <div className="col-span-12 md:col-span-4">
                <p className="t-h3">
                  {e.url ? (
                    <a href={e.url} target="_blank" rel="noreferrer" className="link-under">
                      {e.organization}
                      <span className="sr-only"> (opens in a new tab)</span>
                    </a>
                  ) : (
                    e.organization
                  )}
                </p>
                {e.role ? <p className="t-small mt-1 text-muted">{e.role}</p> : null}
              </div>
              <p className="t-body col-span-12 max-w-[52ch] text-ink-2 pretty md:col-span-6">{e.summary}</p>
              <p className="t-meta col-span-12 text-muted md:col-span-2 md:text-right">{e.period}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
