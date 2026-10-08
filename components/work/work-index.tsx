"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { pad, statusLabel } from "@/lib/content";
import { useFinePointer, useReducedMotion } from "@/lib/hooks";
import type { WorkItem } from "@/lib/types";

/**
 * An editorial index, not a card grid.
 * Hover (fine pointers) sends a preview after the pointer with a little
 * inertia. Everywhere, the + toggle opens the same preview inline, so
 * nothing depends on hover.
 */
export function WorkIndex({ items, headingLevel = 3 }: { items: WorkItem[]; headingLevel?: 2 | 3 }) {
  const [hovered, setHovered] = useState<string | null>(null);
  const [open, setOpen] = useState<string | null>(null);
  const fine = useFinePointer();
  const baseId = useId();
  const Heading = headingLevel === 2 ? "h2" : "h3";

  return (
    <div className="relative" onPointerLeave={() => setHovered(null)} data-spec="Component / WorkIndex">
      <ol className="group/list">
        {items.map((item) => {
          const isOpen = open === item.slug;
          const panelId = `${baseId}-${item.slug}`;
          return (
            <li
              key={item.slug}
              className="border-b border-line transition-opacity duration-500 data-[dim]:opacity-35"
              data-dim={hovered && hovered !== item.slug ? "" : undefined}
            >
              <div
                className="group/row grid-12 relative items-center gap-y-2 py-[clamp(18px,2.4vw,36px)]"
                onPointerEnter={(e) => e.pointerType === "mouse" && setHovered(item.slug)}
              >
                <span className="t-meta col-span-2 self-start pt-[0.55em] text-muted transition-colors duration-300 group-hover/row:text-blue md:col-span-1">
                  {pad(item.index)}
                </span>
                <Heading className="col-span-8 md:col-span-6">
                  <Link
                    href={`/work/${item.slug}`}
                    data-cursor-label="View"
                    className="block text-[clamp(30px,4.2vw,72px)] font-[520] leading-[0.98] tracking-[-0.045em] transition-[translate,color] duration-700 ease-[var(--ease-out)] after:absolute after:inset-0 group-hover/row:translate-x-[0.18em] focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:outline-blue"
                  >
                    {item.title}
                  </Link>
                </Heading>
                <dl className="t-meta col-span-10 col-start-3 flex flex-wrap gap-x-4 gap-y-1 text-muted md:col-span-4 md:col-start-auto xl:grid xl:grid-cols-4 xl:gap-x-[var(--gutter)]">
                  <div className="xl:col-span-2">
                    <dt className="sr-only">Type</dt>
                    <dd className="text-ink">{item.subtitle}</dd>
                  </div>
                  <div>
                    <dt className="sr-only">Context</dt>
                    <dd>{item.context}</dd>
                  </div>
                  <div>
                    <dt className="sr-only">Status</dt>
                    <dd>
                      {statusLabel[item.status]}
                      {item.year ? ` · ${item.year}` : null}
                    </dd>
                  </div>
                </dl>
                <div className="relative z-10 col-span-2 col-start-11 row-start-1 flex justify-end self-start md:col-span-1 md:col-start-auto md:row-start-auto md:self-center">
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? null : item.slug)}
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    data-cursor-label={isOpen ? "Close" : "Preview"}
                    className="hit -mr-3 inline-flex items-center justify-center"
                  >
                    <span className="sr-only">{isOpen ? "Hide" : "Show"} preview of {item.title}</span>
                    <span aria-hidden="true" className="relative block size-3.5">
                      <span className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-ink" />
                      <span
                        className={`absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-ink transition-transform duration-500 ease-[var(--ease-out)] ${isOpen ? "scale-y-0" : ""}`}
                      />
                    </span>
                  </button>
                </div>
              </div>

              <div
                id={panelId}
                role="region"
                aria-label={`${item.title} preview`}
                className="grid transition-[grid-template-rows] duration-700 ease-[var(--ease-out)]"
                style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
                inert={!isOpen}
              >
                <div className="min-h-0 overflow-hidden">
                  <InlinePreview item={item} />
                </div>
              </div>
            </li>
          );
        })}
      </ol>
      {fine ? <FloatingPreview item={items.find((i) => i.slug === hovered && i.slug !== open) ?? null} /> : null}
    </div>
  );
}

function InlinePreview({ item }: { item: WorkItem }) {
  return (
    <div className="grid-12 gap-y-6 pb-[clamp(24px,3vw,48px)]">
      {item.cover ? (
        <figure className="mono-img-hover col-span-12 md:col-span-7 md:col-start-2">
          <div className="relative aspect-[16/10] overflow-hidden bg-paper-2">
            <Image
              src={item.cover.src}
              alt={item.cover.alt}
              fill
              sizes="(min-width: 768px) 58vw, 100vw"
              className="mono-img object-cover object-top"
            />
          </div>
          {item.cover.caption ? <figcaption className="t-meta mt-2 text-muted">{item.cover.caption}</figcaption> : null}
        </figure>
      ) : null}
      <div className="col-span-12 flex flex-col md:col-span-4">
        <p className="t-lead pretty">{item.summary}</p>
        <dl className="t-meta mt-6 grid grid-cols-[10ch_1fr] gap-y-1.5">
          <dt className="text-muted">Status</dt>
          <dd>{statusLabel[item.status]}</dd>
          <dt className="text-muted">Context</dt>
          <dd>{item.context}</dd>
          {item.role ? (
            <>
              <dt className="text-muted">Role</dt>
              <dd>{item.role}</dd>
            </>
          ) : null}
          {item.year ? (
            <>
              <dt className="text-muted">Year</dt>
              <dd>{item.year}</dd>
            </>
          ) : null}
        </dl>
        <div className="mt-auto flex flex-wrap gap-x-6 pt-6 text-[15px]">
          <Link href={`/work/${item.slug}`} className="hit inline-flex items-center gap-2 link-under">
            Read the record <span aria-hidden="true">→</span>
          </Link>
          {item.url ? (
            <a href={item.url} target="_blank" rel="noreferrer" className="hit inline-flex items-center gap-2 link-under">
              Visit site <span aria-hidden="true">↗</span>
            </a>
          ) : null}
        </div>
      </div>
    </div>
  );
}

/** Follows the pointer with inertia. Purely decorative: the row carries the information. */
function FloatingPreview({ item }: { item: WorkItem | null }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const [shown, setShown] = useState<WorkItem | null>(item);

  if (item && item !== shown) setShown(item);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let x = -1000;
    let y = -1000;
    let tx = x;
    let ty = y;
    let raf = 0;
    let started = false;
    const ease = reduced ? 1 : 0.12;

    const render = () => {
      x += (tx - x) * ease;
      y += (ty - y) * ease;
      const vx = (tx - x) * 0.04;
      el.style.transform = `translate3d(${x}px, ${y}px, 0) rotate(${Math.max(-4, Math.min(4, vx))}deg)`;
      raf = Math.abs(tx - x) + Math.abs(ty - y) > 0.3 ? requestAnimationFrame(render) : 0;
    };
    const onMove = (e: PointerEvent) => {
      const w = el.offsetWidth;
      const h = el.offsetHeight;
      const right = e.clientX + 32 + w < window.innerWidth - 16;
      tx = right ? e.clientX + 32 : e.clientX - 32 - w;
      ty = Math.min(Math.max(e.clientY - h / 2, 72), window.innerHeight - h - 16);
      if (!started) {
        started = true;
        x = tx;
        y = ty;
      }
      if (!raf) raf = requestAnimationFrame(render);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
    };
  }, [reduced]);

  const active = Boolean(item);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-40 w-[clamp(260px,24vw,440px)]"
      style={{ transform: "translate3d(-1000px,-1000px,0)" }}
    >
      {shown?.cover ? (
        <div
          className="relative aspect-[16/10] overflow-hidden bg-paper-2 shadow-[0_24px_60px_-24px_rgb(0_0_0/0.45)] transition-[clip-path] duration-700 ease-[var(--ease-out)]"
          style={{ clipPath: active ? "inset(0 0 0 0)" : "inset(0 0 100% 0)" }}
        >
          <Image
            src={shown.cover.src}
            alt=""
            fill
            sizes="440px"
            className={`object-cover object-top transition-[filter,scale] duration-[1200ms] ease-[var(--ease-out)] ${shown.cover.treatment === "color" ? "" : "mono-img"} ${active ? "scale-100" : "scale-110"}`}
          />
          <div className="t-meta-sm absolute inset-x-0 bottom-0 flex justify-between bg-ink px-2.5 py-1.5 text-paper">
            <span>{pad(shown.index)}</span>
            <span>{shown.subtitle}</span>
          </div>
        </div>
      ) : null}
    </div>
  );
}
