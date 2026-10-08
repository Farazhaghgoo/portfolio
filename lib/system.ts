"use client";

/**
 * The site's small operating system: UI modes, discovered signals and the
 * session log. A tiny external store read through useSyncExternalStore, so
 * components subscribe to exactly the slice they render.
 *
 * Nothing here leaves the browser. Signals persist in localStorage, the
 * session log in sessionStorage. Both fail silently when storage is blocked.
 */

import { useSyncExternalStore } from "react";
import { profile } from "@/data/profile";
import { signals as SIGNALS } from "@/data/signals";

export type Theme = "auto" | "paper" | "night";
export type PaletteView = "commands" | "signals";

export interface LogEntry {
  t: number;
  kind: "route" | "command" | "signal" | "system";
  text: string;
}

interface State {
  paletteOpen: boolean;
  paletteView: PaletteView;
  /** Pre-filled query when the palette opens (e.g. from a hint). */
  paletteSeed: string;
  menuOpen: boolean;
  inspect: boolean;
  theme: Theme;
  found: readonly string[];
  toast: { id: string; seq: number } | null;
  log: readonly LogEntry[];
  logOpen: boolean;
  stage: number;
  stageSteps: number;
  /** When the last full cycle completed (ms), 0 if never. */
  cycleAt: number;
  startedAt: number;
  hydrated: boolean;
}

const KEYS = {
  signals: "fh:signals",
  theme: "fh:theme",
  log: "fh:log",
  started: "fh:started",
};

const initial: State = {
  paletteOpen: false,
  paletteView: "commands",
  paletteSeed: "",
  menuOpen: false,
  inspect: false,
  theme: "auto",
  found: [],
  toast: null,
  log: [],
  logOpen: false,
  stage: profile.processStart,
  stageSteps: 0,
  cycleAt: 0,
  startedAt: 0,
  hydrated: false,
};

let state: State = initial;
const listeners = new Set<() => void>();

function set(patch: Partial<State>) {
  state = { ...state, ...patch };
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useSystem<T>(selector: (s: State) => T): T {
  return useSyncExternalStore(
    subscribe,
    () => selector(state),
    () => selector(initial),
  );
}

export function getSystem(): State {
  return state;
}

/* ------------------------------------------------------------------ storage */

function read(store: "local" | "session", key: string): string | null {
  try {
    return (store === "local" ? localStorage : sessionStorage).getItem(key);
  } catch {
    return null;
  }
}

function write(store: "local" | "session", key: string, value: string | null) {
  try {
    const s = store === "local" ? localStorage : sessionStorage;
    if (value === null) s.removeItem(key);
    else s.setItem(key, value);
  } catch {
    /* storage unavailable: the feature degrades to this page view only */
  }
}

/** Called once, on the client, after hydration. */
export function hydrateSystem() {
  if (state.hydrated) return;
  const valid = new Set(SIGNALS.map((s) => s.id));
  let found: string[] = [];
  try {
    found = (JSON.parse(read("local", KEYS.signals) ?? "[]") as string[]).filter((id) => valid.has(id));
  } catch {
    found = [];
  }
  let log: LogEntry[] = [];
  try {
    log = JSON.parse(read("session", KEYS.log) ?? "[]") as LogEntry[];
  } catch {
    log = [];
  }
  const storedTheme = read("local", KEYS.theme);
  const theme: Theme = storedTheme === "paper" || storedTheme === "night" ? storedTheme : "auto";
  let startedAt = Number(read("session", KEYS.started));
  if (!startedAt) {
    startedAt = Date.now();
    write("session", KEYS.started, String(startedAt));
  }
  set({ found, log, theme, startedAt, hydrated: true });
  if (log.length === 0) addLog("system", "Session started.");
}

/* ------------------------------------------------------------------ log */

export function addLog(kind: LogEntry["kind"], text: string) {
  if (!state.hydrated) hydrateSystem();
  const entry: LogEntry = { t: Date.now(), kind, text };
  const log = [...state.log, entry].slice(-250);
  set({ log });
  write("session", KEYS.log, JSON.stringify(log));
}

export function clearLog() {
  set({ log: [] });
  write("session", KEYS.log, null);
  addLog("system", "Log cleared.");
}

export function openLog() {
  set({ logOpen: true, paletteOpen: false, menuOpen: false });
  discover("log");
}

export function closeLog() {
  set({ logOpen: false });
}

/* ------------------------------------------------------------------ signals */

let toastSeq = 0;

export function discover(id: string) {
  if (!state.hydrated) hydrateSystem();
  if (state.found.includes(id)) return;
  const signal = SIGNALS.find((s) => s.id === id);
  if (!signal) return;
  const found = [...state.found, id];
  set({ found, toast: { id, seq: ++toastSeq } });
  write("local", KEYS.signals, JSON.stringify(found));
  addLog("signal", `Signal ${found.length}/${SIGNALS.length}: ${signal.found}`);
}

export function dismissToast() {
  set({ toast: null });
}

export function resetSignals() {
  set({ found: [], toast: null });
  write("local", KEYS.signals, null);
  addLog("system", "Signals reset.");
}

export const SIGNAL_TOTAL = SIGNALS.length;

/* ------------------------------------------------------------------ palette */

export function openPalette(view: PaletteView = "commands", seed = "") {
  set({ paletteOpen: true, paletteView: view, paletteSeed: seed, menuOpen: false });
  discover("palette");
}

export function closePalette() {
  set({ paletteOpen: false, paletteSeed: "" });
}

export function togglePalette() {
  if (state.paletteOpen) closePalette();
  else openPalette();
}

/* ------------------------------------------------------------------ menu */

export function setMenuOpen(menuOpen: boolean) {
  set({ menuOpen });
}

/* ------------------------------------------------------------------ inspect */

export function setInspect(inspect: boolean) {
  set({ inspect });
  if (inspect) {
    document.documentElement.setAttribute("data-inspect", "");
    discover("inspect");
  } else {
    document.documentElement.removeAttribute("data-inspect");
  }
  addLog("system", inspect ? "Inspect mode on." : "Inspect mode off.");
}

export function toggleInspect() {
  setInspect(!state.inspect);
}

/* ------------------------------------------------------------------ theme */

export function effectiveTheme(theme: Theme = state.theme): "paper" | "night" {
  if (theme !== "auto") return theme;
  if (typeof window === "undefined") return "paper";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "night" : "paper";
}

export function setTheme(theme: Theme) {
  set({ theme });
  const root = document.documentElement;
  if (theme === "auto") root.removeAttribute("data-theme");
  else root.setAttribute("data-theme", theme);
  write("local", KEYS.theme, theme === "auto" ? null : theme);
  addLog("system", `Theme: ${theme}.`);
}

export function cycleTheme() {
  const order: Theme[] = ["auto", "paper", "night"];
  setTheme(order[(order.indexOf(state.theme) + 1) % order.length]);
}

export function toggleNight() {
  setTheme(effectiveTheme() === "night" ? "paper" : "night");
}

/* ------------------------------------------------------------------ status */

export function advanceStage() {
  const stage = (state.stage + 1) % profile.process.length;
  const stageSteps = state.stageSteps + 1;
  if (stageSteps >= profile.process.length) {
    set({ stage, stageSteps: 0, cycleAt: Date.now() });
    addLog("system", "Status: full cycle complete.");
    discover("cycle");
  } else {
    set({ stage, stageSteps });
    addLog("system", `Status: ${profile.process[stage]}.`);
  }
}
