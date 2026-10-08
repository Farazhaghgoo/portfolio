import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/page-header";
import { now } from "@/data/now";
import { formatMonth, pad } from "@/lib/content";

export const metadata: Metadata = {
  title: "Now",
  description: "What Faraz Haghgoo is building, exploring, learning and thinking about right now.",
  alternates: { canonical: "/now" },
};

export default function NowPage() {
  const updated = formatMonth(now.updated);
  return (
    <div data-page>
      <PageHeader
        code="004"
        section="Now"
        title={
          <>
            Now <span className="t-serif font-normal italic text-muted">/ {updated}</span>
          </>
        }
        aside={<time dateTime={now.updated}>Updated {updated}</time>}
        intro={now.intro}
      />

      <section aria-label={`Now, ${updated}`} className="frame mt-[clamp(56px,8vw,140px)]">
        <dl>
          {now.sections.map((section, i) => (
            <div key={section.label} className="grid-12 rule-ink gap-y-4 pb-[clamp(40px,5vw,88px)] pt-3" data-reveal>
              <dt className="t-meta col-span-12 flex gap-4 md:col-span-3">
                <span className="text-muted">{pad(i + 1, 2)}</span>
                {section.label}
              </dt>
              <dd className="col-span-12 space-y-2 md:col-span-9">
                {section.items.map((item) => (
                  <p
                    key={item}
                    className={
                      section.items.length === 1
                        ? "t-serif text-[clamp(32px,4vw,72px)] leading-[1.02] tracking-[-0.02em] balance"
                        : "text-[clamp(24px,2.6vw,44px)] font-[460] leading-[1.08] tracking-[-0.035em] pretty"
                    }
                  >
                    {item}
                  </p>
                ))}
              </dd>
            </div>
          ))}
        </dl>
        <p className="t-small max-w-[52ch] text-muted pretty" data-reveal>
          This is a{" "}
          <a href="https://nownownow.com/about" target="_blank" rel="noreferrer" className="link-under">
            now page
          </a>
          : a note on what I’m focused on at this point, not a feed. It changes when I do.
        </p>
      </section>
    </div>
  );
}
