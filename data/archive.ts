import type { ArchiveExtra } from "@/lib/types";

/**
 * The Archive is the chronological index of everything made, explored or
 * shipped. Work and Lab items join it automatically (see lib/content.ts).
 *
 * Add things here that aren't Work or Lab: articles, prototypes, visual
 * experiments, abandoned concepts. Records sort by year; unknown years first.
 */
export const archiveExtras: ArchiveExtra[] = [
  {
    title: "Production products with collaborators",
    type: "Products / Systems",
    status: "private",
    year: null,
    summary:
      "Production web products, AI-enabled tools and data-driven interfaces built with collaborators. Not public yet. Happy to talk about them in person.",
    visibility: "redacted",
  },
  {
    title: "This website",
    type: "Website / System",
    status: "ongoing",
    year: "2026",
    summary:
      "Portfolio, archive and lab in one. Next.js, TypeScript and very few dependencies. It is also an experiment: try the command line.",
    href: "/",
    visibility: "public",
  },
];
