import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Experiment } from "@/components/lab/registry";
import { SignalOnMount } from "@/components/system/signal-on-mount";
import { getLab, getLabExperiment, pad, statusLabel } from "@/lib/content";

export function generateStaticParams() {
  return getLab().map((l) => ({ slug: l.slug }));
}

export async function generateMetadata({ params }: PageProps<"/lab/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const item = getLabExperiment(slug);
  if (!item) return {};
  return {
    title: `${item.title} — Lab`,
    description: item.summary,
    alternates: { canonical: `/lab/${item.slug}` },
  };
}

export default async function LabExperimentPage({ params }: PageProps<"/lab/[slug]">) {
  const { slug } = await params;
  const item = getLabExperiment(slug);
  if (!item) notFound();

  const all = getLab();
  const next = all[(all.findIndex((l) => l.slug === item.slug) + 1) % all.length];

  return (
    <article data-page className="pt-[var(--header-h)]">
      <SignalOnMount id="lab" />
      <header className="frame grid-12 items-end gap-y-2 py-4">
        <p className="t-meta col-span-12 text-muted md:col-span-3">
          <span className="text-ink">FH</span>—005 /{" "}
          <Link href="/lab" className="-my-3 inline-flex min-h-[44px] items-center hover:text-blue">
            Lab
          </Link>{" "}
          / L{pad(item.index, 2)}
        </p>
        <h1 className="col-span-12 text-[clamp(32px,4vw,64px)] font-[540] leading-[0.95] tracking-[-0.045em] md:col-span-5">
          {item.title}
        </h1>
        <p className="t-meta col-span-12 text-muted md:col-span-4 md:text-right">
          {item.kind} · {statusLabel[item.status]} · {item.year}
        </p>
      </header>

      <div className="frame">
        <Experiment slug={item.slug} />
      </div>

      <section aria-label="About this experiment" className="frame grid-12 mt-[clamp(28px,4vw,56px)] gap-y-8">
        <p className="t-lead col-span-12 max-w-[34ch] pretty md:col-span-5">{item.summary}</p>
        <div className="col-span-12 md:col-span-3 md:col-start-7">
          <h2 className="t-meta mb-2 text-muted">How to</h2>
          <ul className="space-y-1 text-[15px]">
            {item.instructions.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </div>
        {item.notes ? (
          <div className="col-span-12 md:col-span-3">
            <h2 className="t-meta mb-2 text-muted">Notes</h2>
            <p className="t-small text-ink-2 pretty">{item.notes}</p>
          </div>
        ) : null}
      </section>

      <nav aria-label="Lab" className="frame mt-[clamp(56px,7vw,120px)]">
        <div className="t-meta grid-12 rule-ink items-center pt-2.5">
          <Link href="/lab" className="col-span-6 -my-3 inline-flex min-h-[44px] items-center gap-2 hover:text-blue">
            <span aria-hidden="true">←</span> All experiments
          </Link>
          {next && next.slug !== item.slug ? (
            <Link href={`/lab/${next.slug}`} className="col-span-6 -my-3 inline-flex min-h-[44px] items-center justify-end gap-2 hover:text-blue">
              Next: L{pad(next.index, 2)} {next.title} <span aria-hidden="true">→</span>
            </Link>
          ) : null}
        </div>
      </nav>
    </article>
  );
}
