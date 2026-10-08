"use client";

import { useEffect, useRef } from "react";
import { useFinePointer, useReducedMotion } from "@/lib/hooks";

const INTERACTIVE = "a[href], button, [role='button'], [role='option'], summary, label, [data-cursor-label]";
const TEXT_ENTRY = "input, textarea, select, [contenteditable='true']";

/**
 * A small companion to the OS pointer. It never replaces it.
 * It only speaks when it has something to say:
 *   data-cursor-label="View" -> VIEW
 *   external links           -> ↗
 *   other actions            -> the dot turns blue
 */
export function Cursor() {
  const fine = useFinePointer();
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    const labelEl = labelRef.current;
    if (!fine || !el || !labelEl) return;

    let x = 0;
    let y = 0;
    let tx = 0;
    let ty = 0;
    let raf = 0;
    let visible = false;
    const ease = reduced ? 1 : 0.24;

    const render = () => {
      x += (tx - x) * ease;
      y += (ty - y) * ease;
      el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      raf = Math.abs(tx - x) + Math.abs(ty - y) > 0.2 ? requestAnimationFrame(render) : 0;
    };

    const setTarget = (target: Element | null) => {
      if (!target || target.closest(TEXT_ENTRY)) {
        el.removeAttribute("data-label");
        el.removeAttribute("data-kind");
        el.toggleAttribute("data-visible", !target?.closest(TEXT_ENTRY));
        return;
      }
      el.setAttribute("data-visible", "");
      const hit = target.closest<HTMLElement>(INTERACTIVE);
      if (!hit) {
        el.removeAttribute("data-label");
        el.removeAttribute("data-kind");
        return;
      }
      let label = hit.getAttribute("data-cursor-label");
      if (!label && hit instanceof HTMLAnchorElement && hit.target === "_blank") label = "↗";
      el.setAttribute("data-kind", "action");
      if (label) {
        labelEl.textContent = label;
        el.setAttribute("data-label", "");
      } else {
        el.removeAttribute("data-label");
      }
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      tx = e.clientX;
      ty = e.clientY;
      if (!visible) {
        visible = true;
        x = tx;
        y = ty;
        el.setAttribute("data-visible", "");
      }
      if (!raf) raf = requestAnimationFrame(render);
    };
    const onOver = (e: PointerEvent) => {
      if (e.pointerType === "mouse") setTarget(e.target as Element);
    };
    const onLeave = () => {
      visible = false;
      el.removeAttribute("data-visible");
    };
    const onDown = () => el.setAttribute("data-pressed", "");
    const onUp = () => el.removeAttribute("data-pressed");

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerover", onOver, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("pointerup", onUp, { passive: true });
    window.addEventListener("blur", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerover", onOver);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("blur", onLeave);
    };
  }, [fine, reduced]);

  return (
    <div ref={ref} className="cursor" aria-hidden="true">
      <div className="cursor__ring">
        <span ref={labelRef} className="cursor__label" />
      </div>
    </div>
  );
}
