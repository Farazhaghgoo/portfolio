import type { Metadata } from "next";
import Link from "next/link";
import { SignalOnMount } from "@/components/system/signal-on-mount";
import { graveyard } from "@/data/graveyard";

export const metadata: Metadata = {
  title: "Graveyard",
  description: "Abandoned ideas and what they taught me.",
  robots: { index: false, follow: false },
};

export default function GraveyardPage() {
  return (
    <div data-page className="frame flex min-h-[86svh] flex-col pt-[calc(var(--header-h)+clamp(32px,6vw,104px))]">
      <SignalOnMount id="graveyard" />
      <p className="t-meta load-fade text-muted">
        <span className="text-ink">FH</span>—∅ / Graveyard
      </p>

      {graveyard.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center py-24 text-center">
          <p className="t-meta load-fade text-muted" style={{ ["--i" as string]: 1 } as React.CSSProperties}>
            Here lie
          </p>
          <h1 className="t-serif load-rise mt-6 text-[clamp(40px,6vw,108px)] leading-[0.98] tracking-[-0.02em] balance" style={{ ["--i" as string]: 2 } as React.CSSProperties}>
            Nothing buried <em>publicly</em> yet.
          </h1>
          <p className="t-small load-fade mt-8 max-w-[40ch] text-muted pretty" style={{ ["--i" as string]: 4 } as React.CSSProperties}>
            Abandoned ideas will rest here one day, each with what it taught me.
          </p>
          <Link href="/" className="t-meta hit load-fade mt-10 inline-flex items-center gap-2 hover:text-blue" style={{ ["--i" as string]: 5 } as React.CSSProperties}>
            <span aria-hidden="true">←</span> Back among the living
          </Link>
        </div>
      ) : (
        <>
          <h1 className="t-h1 mt-6">Graveyard</h1>
          <ol className="rule mt-12">
            {graveyard.map((g) => (
              <li key={g.title} className="grid-12 gap-y-2 border-b border-line py-6">
                <p className="t-meta col-span-12 text-muted md:col-span-2">{g.year}</p>
                <h2 className="t-h3 col-span-12 md:col-span-4">{g.title}</h2>
                <div className="col-span-12 space-y-2 md:col-span-6">
                  <p className="t-body text-ink-2">
                    <span className="t-meta mr-2 text-muted">Cause</span>
                    {g.cause}
                  </p>
                  <p className="t-body">
                    <span className="t-meta mr-2 text-muted">Lesson</span>
                    {g.lesson}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </>
      )}
    </div>
  );
}
