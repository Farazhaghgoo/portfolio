"use client";

import { Fragment, useEffect, useRef } from "react";
import { useFinePointer, useReducedMotion } from "@/lib/hooks";

const BASE = 600;
const MIN = 230;

/**
 * The name, set large. Letters near the pointer thin out, like ink under a
 * lens, then settle back with a little inertia. Each glyph sits in a slot
 * sized at the base weight, so the line never reflows.
 */
export function HeroName({ name }: { name: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const fine = useFinePointer();
  const reduced = useReducedMotion();

  useEffect(() => {
    const root = ref.current;
    if (!root || !fine || reduced) return;
    const letters = Array.from(root.querySelectorAll<HTMLElement>("[data-live]"));
    const slots = letters.map((l) => l.parentElement as HTMLElement);
    const weight = letters.map(() => BASE);
    let px = -1e5;
    let py = -1e5;
    let raf = 0;

    const frame = () => {
      const size = parseFloat(getComputedStyle(root).fontSize) || 100;
      const radius = size * 1.05;
      let moving = false;
      const box = root.getBoundingClientRect();
      if (box.bottom < 0 || box.top > window.innerHeight) {
        // Off screen: settle immediately and stop.
        letters.forEach((l, i) => {
          weight[i] = BASE;
          l.style.fontWeight = "";
        });
        raf = 0;
        return;
      }
      const rects = slots.map((s) => s.getBoundingClientRect());
      for (let i = 0; i < letters.length; i++) {
        const r = rects[i];
        const dx = px - (r.left + r.width / 2);
        const dy = (py - (r.top + r.height / 2)) * 1.3;
        const t = Math.max(0, 1 - Math.hypot(dx, dy) / radius);
        const eased = t * t * (3 - 2 * t);
        const target = BASE - (BASE - MIN) * eased;
        weight[i] += (target - weight[i]) * 0.14;
        if (Math.abs(target - weight[i]) > 0.6) moving = true;
        letters[i].style.fontWeight = String(Math.round(weight[i]));
      }
      raf = moving ? requestAnimationFrame(frame) : 0;
    };

    const kick = () => {
      if (!raf) raf = requestAnimationFrame(frame);
    };
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      px = e.clientX;
      py = e.clientY;
      kick();
    };
    const onLeave = () => {
      px = -1e5;
      py = -1e5;
      kick();
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      letters.forEach((l) => (l.style.fontWeight = ""));
    };
  }, [fine, reduced]);

  const words = name.split(" ");

  return (
    <>
      <span className="sr-only">{name}</span>
      <span ref={ref} aria-hidden="true" className="hero-name">
        {words.map((word, w) => (
          <Fragment key={word}>
            {w > 0 ? " " : null}
            <span className="hero-name__mask">
              <span style={{ ["--i" as string]: w } as React.CSSProperties}>
                {Array.from(word).map((ch, i) => (
                  <span key={i} className="hero-name__slot">
                    <span className="hero-name__ghost">{ch}</span>
                    <span className="hero-name__live" data-live>
                      {ch}
                    </span>
                  </span>
                ))}
              </span>
            </span>
          </Fragment>
        ))}
      </span>
    </>
  );
}
