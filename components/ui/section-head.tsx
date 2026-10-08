/**
 * The index line that opens every section:
 *   01   SELECTED WORK                                  INDEX / 01 ENTRY
 */
export function SectionHead({
  index,
  title,
  aside,
  id,
  as: Tag = "h2",
}: {
  index: string;
  title: string;
  aside?: React.ReactNode;
  id?: string;
  as?: "h1" | "h2";
}) {
  return (
    <div className="t-meta grid-12 rule-ink items-baseline pt-2.5" data-reveal>
      <span className="col-span-2 text-muted md:col-span-1">{index}</span>
      <Tag id={id} className="col-span-10 md:col-span-5">
        {title}
      </Tag>
      {aside ? <div className="col-span-12 text-muted md:col-span-6 md:text-right">{aside}</div> : null}
    </div>
  );
}
