import Link from "next/link";
import { getLab, pad, statusLabel } from "@/lib/content";

export function LabIndex({ headingLevel = 3 }: { headingLevel?: 2 | 3 }) {
  const items = getLab();
  const Heading = headingLevel === 2 ? "h2" : "h3";
  return (
    <ol className="rule" data-spec="Component / LabIndex">
      {items.map((item) => (
        <li key={item.slug} className="border-b border-line" data-reveal>
          <div className="group grid-12 relative items-baseline gap-y-1 py-[clamp(16px,2vw,28px)]">
            <span className="t-meta col-span-2 text-muted transition-colors group-hover:text-blue md:col-span-1">
              L/{pad(item.index, 2)}
            </span>
            <Heading className="col-span-10 md:col-span-3">
              <Link
                href={`/lab/${item.slug}`}
                data-cursor-label="Open"
                className="inline-block text-[clamp(24px,2.6vw,40px)] font-[520] leading-none tracking-[-0.04em] transition-[translate] duration-700 ease-[var(--ease-out)] after:absolute after:inset-0 group-hover:translate-x-[0.15em] focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:outline-blue"
              >
                {item.title}
              </Link>
            </Heading>
            <p className="t-body col-span-10 col-start-3 text-ink-2 pretty md:col-span-5 md:col-start-auto">{item.summary}</p>
            <p className="t-meta col-span-10 col-start-3 text-muted md:col-span-3 md:col-start-auto md:text-right">
              {item.kind} · {statusLabel[item.status]} · {item.year}
            </p>
          </div>
        </li>
      ))}
    </ol>
  );
}
