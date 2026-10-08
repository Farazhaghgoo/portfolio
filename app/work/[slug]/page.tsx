import { ProjectPreview } from "@/components/work/project-preview";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Figure, Sections } from "@/components/work/sections";
import { getWork, getWorkItem, pad, statusLabel } from "@/lib/content";

export function generateStaticParams() {
  return getWork().map((w) => ({ slug: w.slug }));
}

export async function generateMetadata({ params }: PageProps<"/work/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const item = getWorkItem(slug);
  if (!item) return {};
  return {
    title: item.title,
    description: item.summary,
    alternates: { canonical: `/work/${item.slug}` },
    openGraph: {
      title: item.title,
      description: item.summary,
      url: `/work/${item.slug}`,
      ...(item.cover ? { images: [{ url: item.cover.src, width: item.cover.width, height: item.cover.height, alt: item.cover.alt }] } : {}),
    },
  };
}

export default async function WorkRecordPage({ params }: PageProps<"/work/[slug]">) {
  const { slug } = await params;
  const item = getWorkItem(slug);
  if (!item) notFound();

  const all = getWork();
  const i = all.findIndex((w) => w.slug === item.slug);
  const prev = all[i - 1];
  const next = all[i + 1];

  const facts = [
    { label: "Type", value: item.subtitle },
    { label: "Context", value: item.context },
    { label: "Status", value: statusLabel[item.status] },
    { label: "Role", value: item.role },
    { label: "Year", value: item.year },
  ].filter((f): f is { label: string; value: string } => Boolean(f.value));

  return (
    <article data-page>
      <header className="frame pt-[calc(var(--header-h)+clamp(32px,6vw,104px))]">
        <div className="t-meta grid-12 load-fade text-muted">
          <p className="col-span-8 md:col-span-6">
            <span className="text-ink">FH</span>—001 /{" "}
            <Link href={`/work#project-${item.slug}`} className="-my-3 inline-flex min-h-[44px] items-center hover:text-blue">
              Work
            </Link>{" "}
            / {pad(item.index)}
          </p>
          <p className="col-span-4 text-right md:col-span-6">{item.category.join(" / ")}</p>
        </div>
        <h1 className="t-h1 mt-[clamp(20px,3vw,40px)] balance">
          <span className="load-line">
            <span>{item.title}</span>
          </span>
        </h1>

        <div className="grid-12 mt-[clamp(28px,4vw,64px)] gap-y-8">
          <p className="t-lead load-rise col-span-12 max-w-[44ch] pretty md:col-span-7" style={{ ["--i" as string]: 2 } as React.CSSProperties}>
            {item.summary}
          </p>
          <dl className="t-meta load-rise col-span-12 grid grid-cols-[10ch_1fr] content-start gap-y-1.5 md:col-span-4 md:col-start-9" style={{ ["--i" as string]: 3 } as React.CSSProperties}>
            {facts.map((f) => (
              <div key={f.label} className="contents">
                <dt className="text-muted">{f.label}</dt>
                <dd>{f.value}</dd>
              </div>
            ))}
            {item.url ? (
              <div className="contents">
                <dt className="text-muted">Link</dt>
                <dd>
                  <a href={item.url} target="_blank" rel="noreferrer" className="-my-3 inline-flex min-h-[44px] items-center normal-case hover:text-blue">
                    {item.url.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "")} ↗
                  </a>
                </dd>
              </div>
            ) : null}
          </dl>
        </div>
      </header>

      {item.cover || item.demo ? (
        <div className="frame mt-[clamp(48px,6vw,96px)] load-fade" style={{ ["--i" as string]: 4 } as React.CSSProperties}>
          <ProjectPreview item={item} />
        </div>
      ) : null}

      <div className="frame mt-[clamp(64px,8vw,140px)]">
        {item.description ? (
          <div className="grid-12 mb-[clamp(56px,7vw,120px)] gap-y-4" data-reveal>
            <h2 className="t-meta col-span-12 text-muted md:col-span-3">Overview</h2>
            <p className="t-serif col-span-12 text-[clamp(28px,3vw,48px)] leading-[1.08] tracking-[-0.015em] balance md:col-span-8 md:col-start-4">
              {item.description}
            </p>
          </div>
        ) : null}

        {item.sections ? <Sections sections={item.sections} /> : null}

        {item.gallery?.length ? (
          <div className="grid-12 mt-[clamp(56px,7vw,120px)] gap-y-6">
            {item.gallery.map((m) => (
              <div key={m.src} className="col-span-8 col-start-3 sm:col-span-6 sm:col-start-4 md:col-span-3 md:col-start-4" data-reveal>
                <Figure media={{ ...m, treatment: m.treatment ?? "color" }} layout="inset" bare />
              </div>
            ))}
            <p className="t-small col-span-12 self-end text-muted pretty md:col-span-4 md:col-start-8" data-reveal>
              Screenshots of the public site. Nothing here is from a private system.
            </p>
          </div>
        ) : null}
      </div>

      <nav aria-label="Work records" className="frame mt-[clamp(80px,10vw,180px)]">
        <div className="t-meta grid-12 rule-ink items-center pt-2.5">
          <Link href={`/work#project-${item.slug}`} className="col-span-6 -my-3 inline-flex min-h-[44px] items-center gap-2 hover:text-blue md:col-span-4">
            <span aria-hidden="true">←</span> Index
          </Link>
          <div className="col-span-6 flex justify-end gap-6 md:col-span-8">
            {prev ? (
              <Link href={`/work/${prev.slug}`} className="-my-3 inline-flex min-h-[44px] items-center hover:text-blue">
                ← {pad(prev.index)} {prev.title}
              </Link>
            ) : null}
            {next ? (
              <Link href={`/work/${next.slug}`} className="-my-3 inline-flex min-h-[44px] items-center hover:text-blue">
                {pad(next.index)} {next.title} →
              </Link>
            ) : (
              <span className="text-muted">End of index</span>
            )}
          </div>
        </div>
      </nav>
    </article>
  );
}
