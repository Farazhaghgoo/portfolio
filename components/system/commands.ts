import { profile } from "@/data/profile";
import { signals } from "@/data/signals";
import { contactHref, social } from "@/data/social";
import { getLab, getWork, pad } from "@/lib/content";
import { formatDuration, formatTime } from "@/lib/hooks";
import {
  SIGNAL_TOTAL,
  getSystem,
  openLog,
  resetSignals,
  setTheme,
  toggleInspect,
  toggleNight,
} from "@/lib/system";

export type OutputLine = string | { label: string; value: string; tone?: "blue" | "signal" | "muted" };

export interface Output {
  prompt: string;
  lines: OutputLine[];
}

export interface CommandContext {
  navigate: (href: string) => void;
  pathname: string;
}

export interface Command {
  id: string;
  label: string;
  group: string;
  /** Right-aligned hint, e.g. a path or ↗. */
  hint?: string;
  keywords?: string;
  /** Only appears when typed. Never listed. */
  hidden?: boolean;
  external?: boolean;
  /** Return an Output to show it inline instead of closing. */
  run: (ctx: CommandContext) => Output | void;
}

const destinations = ["/", "/work", "/about", "/now", "/archive", "/lab"];

export function whoamiOutput(): Output {
  return { prompt: "whoami", lines: [...profile.whoami] };
}

export function statusOutput(): Output {
  const s = getSystem();
  const now = Date.now();
  const { time, zone } = formatTime(now, profile.location.timeZone, true);
  return {
    prompt: "status",
    lines: [
      { label: "Location", value: `${profile.location.city} / ${profile.location.country}` },
      { label: "Local time", value: `${time} ${zone}` },
      { label: "Working in", value: profile.status.workingIn },
      { label: "Exploring", value: profile.status.exploring },
      { label: "Status", value: profile.process[s.stage], tone: "blue" },
      { label: "Signals", value: `${s.found.length} / ${SIGNAL_TOTAL}`, tone: s.found.length ? "signal" : "muted" },
      { label: "Session", value: s.startedAt ? formatDuration(now - s.startedAt) : "00:00:00" },
    ],
  };
}

export function signalsOutput(): Output {
  const found = getSystem().found;
  return {
    prompt: "signals",
    lines: [
      ...signals.map((sig, i) =>
        found.includes(sig.id)
          ? { label: pad(i + 1, 2), value: sig.found, tone: "signal" as const }
          : { label: pad(i + 1, 2), value: "Not found yet.", tone: "muted" as const },
      ),
      found.length < SIGNAL_TOTAL ? "Stuck? Try ???" : "All signals found. Thank you for looking this closely.",
    ],
  };
}

function hintOutput(): Output {
  const found = getSystem().found;
  const next = signals.find((s) => !found.includes(s.id));
  if (!next) {
    return { prompt: "???", lines: [`${SIGNAL_TOTAL} / ${SIGNAL_TOTAL}.`, "Nothing left to find. Probably."] };
  }
  return {
    prompt: "???",
    lines: [next.hint, { label: "Found", value: `${found.length} / ${SIGNAL_TOTAL}`, tone: "muted" }],
  };
}

export function buildCommands(): Command[] {
  const contact = contactHref();
  const work = getWork();
  const lab = getLab();

  const commands: Command[] = [
    { id: "home", label: "Home", group: "Go to", hint: "/", run: ({ navigate }) => navigate("/") },
    { id: "work", label: "Work", group: "Go to", hint: "/work", keywords: "projects selected index", run: ({ navigate }) => navigate("/work") },
    { id: "about", label: "About", group: "Go to", hint: "/about", keywords: "bio profile experience", run: ({ navigate }) => navigate("/about") },
    { id: "now", label: "Now", group: "Go to", hint: "/now", keywords: "current building exploring", run: ({ navigate }) => navigate("/now") },
    { id: "archive", label: "Archive", group: "Go to", hint: "/archive", keywords: "index catalogue database", run: ({ navigate }) => navigate("/archive") },
    { id: "lab", label: "Lab", group: "Go to", hint: "/lab", keywords: "experiments playground", run: ({ navigate }) => navigate("/lab") },

    ...work.map<Command>((w) => ({
      id: `work:${w.slug}`,
      label: w.title,
      group: "Work",
      hint: pad(w.index),
      keywords: `${w.subtitle} ${w.context} ${w.category.join(" ")}`,
      run: ({ navigate }) => navigate(`/work/${w.slug}`),
    })),

    ...lab.map<Command>((l) => ({
      id: `lab:${l.slug}`,
      label: `${l.title}`,
      group: "Lab",
      hint: `L/${pad(l.index, 2)}`,
      keywords: `${l.kind} experiment`,
      run: ({ navigate }) => navigate(`/lab/${l.slug}`),
    })),

    {
      id: "contact",
      label: contact.external ? "Contact (LinkedIn)" : `Email ${contact.label}`,
      group: "Contact",
      hint: contact.external ? "↗" : "mail",
      keywords: "email write message hire",
      external: contact.external,
      run: () => {
        if (contact.external) window.open(contact.href, "_blank", "noopener,noreferrer");
        else window.location.href = contact.href;
      },
    },
    {
      id: "linkedin",
      label: "LinkedIn",
      group: "Contact",
      hint: "↗",
      external: true,
      keywords: "cv resume",
      run: () => void window.open(social.linkedin.href, "_blank", "noopener,noreferrer"),
    },

    { id: "whoami", label: "whoami", group: "System", keywords: "who identity me", run: () => whoamiOutput() },
    { id: "status", label: "status", group: "System", keywords: "system state time", run: () => statusOutput() },
    {
      id: "random",
      label: "random",
      group: "System",
      keywords: "surprise shuffle",
      run: ({ navigate, pathname }) => {
        const pool = [
          ...destinations,
          ...work.map((w) => `/work/${w.slug}`),
          ...lab.map((l) => `/lab/${l.slug}`),
        ].filter((p) => p !== pathname);
        navigate(pool[Math.floor(Math.random() * pool.length)]);
      },
    },
    { id: "inspect", label: "inspect", group: "System", hint: "toggle", keywords: "grid debug layout x-ray", run: () => toggleInspect() },
    { id: "night", label: "night", group: "System", hint: "toggle", keywords: "dark theme mode light paper", run: () => toggleNight() },
    { id: "signals", label: "signals", group: "System", keywords: "discovered found progress", run: () => signalsOutput() },
    { id: "???", label: "???", group: "System", keywords: "hint help secret", run: () => hintOutput() },

    // Typed only.
    { id: "graveyard", label: "graveyard", group: "Hidden", hidden: true, run: ({ navigate }) => navigate("/graveyard") },
    { id: "log", label: "log", group: "Hidden", hidden: true, keywords: "session history", run: () => openLog() },
    {
      id: "theme auto",
      label: "theme auto",
      group: "Hidden",
      hidden: true,
      keywords: "system",
      run: () => {
        setTheme("auto");
        return { prompt: "theme auto", lines: ["Following your system theme."] };
      },
    },
    {
      id: "sudo",
      label: "sudo",
      group: "Hidden",
      hidden: true,
      run: () => ({ prompt: "sudo", lines: ["Permission denied.", "This incident will not be reported."] }),
    },
    {
      id: "hello",
      label: "hello",
      group: "Hidden",
      hidden: true,
      keywords: "hi hey ciao",
      run: () => ({ prompt: "hello", lines: ["Hello.", "Try whoami, status or ???."] }),
    },
    {
      id: "reset",
      label: "reset",
      group: "Hidden",
      hidden: true,
      keywords: "signals clear",
      run: () => {
        resetSignals();
        return { prompt: "reset", lines: ["Signals reset. Everything is hidden again."] };
      },
    },
  ];

  return commands;
}

/* ------------------------------------------------------------------ search */

function normalize(s: string) {
  return s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").trim();
}

function subsequence(needle: string, hay: string): boolean {
  let i = 0;
  for (const ch of hay) {
    if (ch === needle[i]) i++;
    if (i === needle.length) return true;
  }
  return false;
}

export function scoreCommand(cmd: Command, rawQuery: string): number {
  const q = normalize(rawQuery);
  if (!q) return cmd.hidden ? -1 : 1;
  const id = normalize(cmd.id);
  const label = normalize(cmd.label);
  const words = normalize(`${cmd.label} ${cmd.keywords ?? ""}`).split(/\s+/);

  if (cmd.hidden) {
    // Hidden commands reveal themselves only to someone who already knows them.
    if (q.length < 3) return -1;
    if (id === q || label === q) return 100;
    if (id.startsWith(q) && q.length >= 4) return 60;
    if (words.includes(q)) return 50;
    return -1;
  }

  if (id === q || label === q) return 100;
  if (label.startsWith(q)) return 80;
  if (words.some((w) => w.startsWith(q))) return 60;
  if (label.includes(q)) return 45;
  if (normalize(cmd.keywords ?? "").includes(q)) return 30;
  if (q.length > 1 && subsequence(q, label)) return 15;
  return -1;
}
