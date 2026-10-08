# Faraz Haghgoo — portfolio

A personal R&D archive: portfolio, archive and lab in one site.
Next.js 16 (App Router, Cache Components), React 19, TypeScript, Tailwind CSS 4.
Motion uses CSS, React shared-element view transitions and small `requestAnimationFrame` loops. No animation or smooth-scroll library is required.

```bash
npm install
npm run dev        # http://localhost:3000
npm run build && npm run start
```

## Two layers

- **Layer 1, professional.** Who, what, where, work, experience, contact. Readable in 20 seconds, no interaction required.
- **Layer 2, exploration.** A command line, signals, Inspect mode, a hidden log, the Lab and the Graveyard. Optional, discoverable, never in the way of Layer 1.

## Content: edit `/data`, not components

| File | What it holds |
| --- | --- |
| `data/profile.ts` | Name, statement, rotating lines, status, process, About copy, `whoami` |
| `data/work.ts` | Work items and their case-study sections |
| `data/experience.ts` | Experience and education |
| `data/now.ts` | The /now page (change `updated` when you edit it) |
| `data/archive.ts` | Archive entries that aren't Work or Lab items |
| `data/lab.ts` | Lab experiments (each needs a component, see below) |
| `data/graveyard.ts` | Abandoned ideas and lessons (empty on purpose) |
| `data/social.ts` | Email and LinkedIn |
| `data/demos.ts` | Sample question and fictional dashboard figures |
| `data/notes.ts` | Expandable working notes |
| `data/signals.ts` | The discoverable signals and their hints |
| `data/site.ts` | Title, description, canonical URL |

Types for all of it live in `lib/types.ts`.

### Add a project

Append an object to `data/work.ts`. That alone gives it:

- a row in the Work index (home and `/work`) with image or interactive sketch previews,
- a page at `/work/[slug]` built from its `sections`,
- a row in the Archive,
- a sitemap entry and a command in the palette.

Images go in `public/work/<slug>/`. Use `visibility: "private"` to keep a draft out of every listing, or `"redacted"` to list it in the Archive with the name withheld. Section blocks: `text`, `image`, `gallery`, `facts`, `list`, `quote` (see `components/work/sections.tsx`).

### Add a Lab experiment

1. Add an entry to `data/lab.ts`.
2. Create `components/lab/<slug>.tsx` (default export, client component).
3. Register it in `components/lab/registry.tsx`.

Each experiment is its own JavaScript chunk and only loads on its page. Wrap it in `Stage` to get the frame and the reduced-motion gate.

## Things to fill in

These are left empty on purpose rather than guessed:

- `data/work.ts` → `year`, `role` for inRebus Educational
- `data/experience.ts` → `role`, `period` for inRebus
- `NEXT_PUBLIC_SITE_URL` → the production domain (on Vercel it falls back to the project's production URL)

The inRebus screenshots in `public/work/inrebus-educational/` are captures of the public site, inrebus.education. Replace them with approved assets if you have them.

## Layer 2, for reference

| Thing | How to reach it |
| --- | --- |
| Command line | `/` or `Ctrl/⌘ K`, or the Command button |
| `whoami`, `status`, `random`, `inspect`, `night`, `signals`, `???` | Listed in the command line |
| Hidden commands | `graveyard`, `log`, `sudo`, `hello`, `reset`, `theme auto` (typed only) |
| Inspect mode | The small two-bar mark at the very bottom of every page, or `inspect` |
| Session log | ↑ ↑ ↓ ↓ ← → ← → B A, or `log` |
| Status cycle | Visit Systems, Interfaces and Experiments in the homepage shapes |
| Graveyard | `/graveyard` (also mentioned in `robots.txt`) |

Signals (7) are stored in `localStorage`; the session log in `sessionStorage`. Nothing is sent anywhere. If analytics are ever added, update the copy in `components/system/session-log.tsx`, which promises otherwise.

## Notes on the build

- Every route is statically prerendered, including the Open Graph image (`app/opengraph-image.tsx`).
- Scroll reveals use CSS scroll-driven animations (`animation-timeline: view()`). Browsers without support show everything immediately. `prefers-reduced-motion` turns all motion off, and the Lab waits for an explicit "run it anyway".
- Fonts: Geist, Geist Mono and Instrument Serif through `next/font`. The Google "latin" subset of Geist has no arrow glyphs, so `app/fonts/` holds two ~2 KB subsets of the official variable fonts (OFL, license included) that only cover U+2190–2199.
- The page-entry animation uses `animation-fill-mode: backwards` on purpose: a lingering transform on a page wrapper would break `position: fixed` children such as the work preview.

## Structure

```
app/                 routes, metadata, sitemap, robots, icons, OG image
components/chrome/   header, mobile menu, footer, mark, clock
components/system/   command line, cursor, signals, inspect mode, session log
components/home/     hero, name, rotator, system status
components/work/     work index, case-study sections
components/archive/  archive table
components/lab/      lab index, stage, experiments
data/                all content
lib/                 types, content selectors, client store, hooks
```

## Interactive project sketches

EXAMassist and VibeAssist previews are original portfolio sketches, explicitly labeled sample data. They do not connect to production accounts, exams or metrics. The hero cycles through three animated shapes; project demo state resets on a fresh page load. Public contribution statements are grounded in the research notes in `docs/portfolio-research.md`. Private application source and screenshots are not included.

`ProjectPreview` shares a React ViewTransition identity between the index and each detail page. Browsers without support navigate normally; reduced motion disables the transition. Detail-page index links return to the corresponding project anchor.
