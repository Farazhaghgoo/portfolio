import Image from "next/image";
import type { Media, Section } from "@/lib/types";

/**
 * Renders a case study from data. New block types go here once,
 * then any project can use them.
 */
export function Sections({ sections }: { sections: Section[] }) {
  return (
    <div className="space-y-[clamp(56px,7vw,120px)]">
      {sections.map((section, i) => (
        <Block key={i} section={section} />
      ))}
    </div>
  );
}

function Block({ section }: { section: Section }) {
  switch (section.type) {
    case "text":
      return (
        <section className="grid-12 gap-y-4" data-reveal>
          {section.heading ? <h2 className="t-meta col-span-12 text-muted md:col-span-3">{section.heading}</h2> : null}
          <div className="col-span-12 space-y-5 md:col-span-7 md:col-start-4">
            {section.body.map((p, i) => (
              <p key={i} className={i === 0 ? "t-lead pretty" : "t-body max-w-[60ch] text-ink-2 pretty"}>
                {p}
              </p>
            ))}
          </div>
        </section>
      );
    case "facts":
      return (
        <section className="grid-12 gap-y-4" data-reveal>
          {section.heading ? <h2 className="t-meta col-span-12 text-muted md:col-span-3">{section.heading}</h2> : null}
          <dl className="rule col-span-12 md:col-span-9 md:col-start-4">
            {section.items.map((item) => (
              <div key={item.label} className="grid grid-cols-[minmax(10ch,1fr)_3fr] gap-4 border-b border-line py-3">
                <dt className="t-meta pt-[3px] text-muted">{item.label}</dt>
                <dd className="text-[15px]">{item.value}</dd>
              </div>
            ))}
          </dl>
        </section>
      );
    case "list":
      return (
        <section className="grid-12 gap-y-4" data-reveal>
          {section.heading ? <h2 className="t-meta col-span-12 text-muted md:col-span-3">{section.heading}</h2> : null}
          <ul className="rule col-span-12 md:col-span-7 md:col-start-4">
            {section.items.map((item) => (
              <li key={item} className="border-b border-line py-2.5 text-[17px] tracking-[-0.012em]">
                {item}
              </li>
            ))}
          </ul>
        </section>
      );
    case "quote":
      return (
        <figure className="grid-12" data-reveal>
          <blockquote className="t-serif col-span-12 text-[clamp(30px,3.6vw,60px)] leading-[1.04] balance md:col-span-9 md:col-start-3">
            “{section.text}”
          </blockquote>
          {section.source ? <figcaption className="t-meta col-span-12 mt-4 text-muted md:col-span-9 md:col-start-3">{section.source}</figcaption> : null}
        </figure>
      );
    case "image":
      return <Figure media={section.media} layout={section.layout ?? "full"} />;
    case "gallery":
      return (
        <section className="grid-12 gap-y-6" data-reveal>
          {section.heading ? <h2 className="t-meta col-span-12 text-muted">{section.heading}</h2> : null}
          {section.items.map((m) => (
            <div key={m.src} className="col-span-12 md:col-span-6">
              <Figure media={m} layout="inset" bare />
            </div>
          ))}
        </section>
      );
  }
}

export function Figure({ media, layout, bare = false, priority = false }: { media: Media; layout: "full" | "inset" | "offset"; bare?: boolean; priority?: boolean }) {
  const span = layout === "full" ? "col-span-12" : layout === "offset" ? "col-span-12 md:col-span-8 md:col-start-5" : "col-span-12 md:col-span-10 md:col-start-2";
  const figure = (
    <figure className={bare ? "" : span} data-reveal={bare ? undefined : true}>
      <div className="relative overflow-hidden bg-paper-2" style={{ aspectRatio: `${media.width} / ${media.height}` }}>
        <Image
          src={media.src}
          alt={media.alt}
          fill
          priority={priority}
          sizes={layout === "full" ? "(min-width: 2400px) 2300px, 100vw" : "(min-width: 768px) 66vw, 100vw"}
          className={`object-cover ${media.treatment === "mono" ? "mono-img" : ""}`}
        />
      </div>
      {media.caption ? <figcaption className="t-meta mt-2.5 text-muted">{media.caption}</figcaption> : null}
    </figure>
  );
  return bare ? figure : <div className="grid-12">{figure}</div>;
}
