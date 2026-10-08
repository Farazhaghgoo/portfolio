"use client";

import { type RefObject, useEffect, useSyncExternalStore } from "react";

/* ------------------------------------------------------------------ media */

const mediaSubscribers = new Map<string, (cb: () => void) => () => void>();

function subscribeMedia(query: string) {
  let sub = mediaSubscribers.get(query);
  if (!sub) {
    sub = (cb: () => void) => {
      const mql = window.matchMedia(query);
      mql.addEventListener("change", cb);
      return () => mql.removeEventListener("change", cb);
    };
    mediaSubscribers.set(query, sub);
  }
  return sub;
}

/** Server snapshot is `fallback`; the client corrects it after hydration. */
export function useMediaQuery(query: string, fallback = false): boolean {
  return useSyncExternalStore(
    subscribeMedia(query),
    () => window.matchMedia(query).matches,
    () => fallback,
  );
}

export function useReducedMotion(): boolean {
  return useMediaQuery("(prefers-reduced-motion: reduce)");
}

export function useFinePointer(): boolean {
  return useMediaQuery("(hover: hover) and (pointer: fine)");
}

/* ------------------------------------------------------------------ clock */

let clockNow: number | null = null;
const clockListeners = new Set<() => void>();
let clockTimer: ReturnType<typeof setTimeout> | null = null;

function tick() {
  clockNow = Date.now();
  clockListeners.forEach((l) => l());
  clockTimer = setTimeout(tick, 1000 - (Date.now() % 1000) + 5);
}

function subscribeClock(cb: () => void) {
  clockListeners.add(cb);
  if (!clockTimer) tick();
  return () => {
    clockListeners.delete(cb);
    if (clockListeners.size === 0 && clockTimer) {
      clearTimeout(clockTimer);
      clockTimer = null;
    }
  };
}

/** A shared one-second clock. Null during server render and hydration. */
export function useNow(): number | null {
  return useSyncExternalStore(
    subscribeClock,
    () => clockNow,
    () => null,
  );
}

const formatters = new Map<string, Intl.DateTimeFormat>();

export function formatTime(now: number, timeZone: string, seconds = false): { time: string; zone: string } {
  const key = `${timeZone}:${seconds}`;
  let f = formatters.get(key);
  if (!f) {
    f = new Intl.DateTimeFormat("en-GB", {
      timeZone,
      hour: "2-digit",
      minute: "2-digit",
      second: seconds ? "2-digit" : undefined,
      hour12: false,
      timeZoneName: "short",
    });
    formatters.set(key, f);
  }
  const parts = f.formatToParts(now);
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "";
  const time = [get("hour"), get("minute"), seconds ? get("second") : null].filter(Boolean).join(":");
  // en-GB gives "CEST"/"CET" for Europe/Rome; fall back to GMT offsets elsewhere.
  return { time, zone: get("timeZoneName") };
}

export function formatDuration(ms: number): string {
  const s = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  return [h, m, sec].map((n) => String(n).padStart(2, "0")).join(":");
}

/* ------------------------------------------------------------------ focus */

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Keeps Tab focus inside `ref` while active and restores focus to whatever
 * was focused before when it deactivates.
 */
export function useFocusTrap(ref: RefObject<HTMLElement | null>, active: boolean) {
  useEffect(() => {
    if (!active) return;
    const previous = document.activeElement as HTMLElement | null;
    const node = ref.current;
    if (!node) return;

    function onKey(e: KeyboardEvent) {
      if (e.key !== "Tab" || !node) return;
      const items = Array.from(node.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
        (el) => el.offsetParent !== null || el === document.activeElement,
      );
      if (items.length === 0) {
        e.preventDefault();
        return;
      }
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      if (previous && document.contains(previous)) previous.focus({ preventScroll: true });
    };
  }, [ref, active]);
}

/** Locks page scroll while active, without layout jump from the scrollbar. */
export function useScrollLock(active: boolean) {
  useEffect(() => {
    if (!active) return;
    const root = document.documentElement;
    const gap = window.innerWidth - root.clientWidth;
    const prevOverflow = root.style.overflow;
    const prevPadding = root.style.paddingRight;
    root.style.overflow = "hidden";
    if (gap > 0) root.style.paddingRight = `${gap}px`;
    return () => {
      root.style.overflow = prevOverflow;
      root.style.paddingRight = prevPadding;
    };
  }, [active]);
}

/* ------------------------------------------------------------------ misc */

export function isTypingTarget(target: EventTarget | null): boolean {
  const el = target as HTMLElement | null;
  if (!el) return false;
  const tag = el.tagName;
  return tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || el.isContentEditable;
}
