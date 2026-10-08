/**
 * Opening block for inner pages:
 *   FH—003 / ARCHIVE                                   05 ENTRIES
 *   Archive
 *   intro
 */
export function PageHeader({
  code,
  section,
  title,
  aside,
  intro,
  children,
}: {
  code: string;
  section: string;
  title: React.ReactNode;
  aside?: React.ReactNode;
  intro?: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <header className="studio-inner-header frame pt-[calc(var(--header-h)+clamp(32px,6vw,104px))]">
      <div className="t-meta grid-12 load-fade text-muted">
        <p className="col-span-7 md:col-span-6">
          <span className="text-ink">FH</span>—{code} / {section}
        </p>
        {aside ? <div className="col-span-5 text-right md:col-span-6">{aside}</div> : null}
      </div>
      <h1 className="t-h1 mt-[clamp(20px,3vw,40px)] balance" data-spec="H1 / Geist 560">
        <span className="load-line">
          <span>{title}</span>
        </span>
      </h1>
      {intro ? (
        <div className="grid-12 mt-[clamp(24px,3vw,48px)]">
          <div className="t-lead load-rise col-span-12 max-w-[46ch] text-ink-2 pretty md:col-span-8 lg:col-span-6" style={{ ["--i" as string]: 2 } as React.CSSProperties}>
            {intro}
          </div>
        </div>
      ) : null}
      {children}
    </header>
  );
}
