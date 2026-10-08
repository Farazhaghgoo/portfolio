/**
 * Content model for the whole site.
 *
 * Every piece of portfolio content lives in /data as plain objects that
 * satisfy these types. Components never hard-code content; they render
 * whatever these objects describe. Adding a project means adding one object.
 */

/** Vocabulary shared by Work, Lab and the Archive. */
export type Status =
  | "shipped"
  | "ongoing"
  | "prototype"
  | "experiment"
  | "private"
  | "archived";

/**
 * public   — listed everywhere, has its own page
 * private  — exists in the data, never rendered (draft / not ready)
 * redacted — listed in the Archive with the name withheld
 */
export type Visibility = "public" | "private" | "redacted";

export interface Media {
  src: string;
  width: number;
  height: number;
  alt: string;
  caption?: string;
  /** Visual treatment in previews. Defaults to "mono". */
  treatment?: "mono" | "color";
}

export interface Link {
  label: string;
  href: string;
}

/** Blocks a case study can be assembled from. Extend as needed. */
export type Section =
  | { type: "text"; heading?: string; body: string[] }
  | { type: "image"; media: Media; layout?: "full" | "inset" | "offset" }
  | { type: "gallery"; heading?: string; items: Media[] }
  | { type: "facts"; heading?: string; items: { label: string; value: string }[] }
  | { type: "list"; heading?: string; items: string[] }
  | { type: "quote"; text: string; source?: string };

export interface WorkItem {
  slug: string;
  /** Position in the Work index (001, 002, ...). */
  index: number;
  title: string;
  /** Short descriptor, e.g. "Digital experience". */
  subtitle: string;
  /** Broad context, e.g. "Professional", "Independent", "With collaborators". */
  context: string;
  category: string[];
  status: Status;
  /** Leave null when unknown. Never guess. */
  year: string | null;
  /** Leave null when unknown. Never guess. */
  role: string | null;
  collaborators?: string[];
  /** One or two sentences. Shown in the index preview. */
  summary: string;
  description?: string;
  demo?: "exam" | "metrics";
  cover?: Media;
  gallery?: Media[];
  url?: string;
  github?: string;
  technologies?: string[];
  sections?: Section[];
  visibility: Visibility;
  featured?: boolean;
}

export interface LabExperiment {
  slug: string;
  index: number;
  title: string;
  kind: string;
  year: string;
  status: Status;
  summary: string;
  /** Plain-language controls, shown next to the experiment. */
  instructions: string[];
  /** A short note on how it is made. */
  notes?: string;
  visibility: Visibility;
}

/** Things for the Archive that are not Work or Lab items. */
export interface ArchiveExtra {
  title: string;
  type: string;
  status: Status;
  year: string | null;
  summary: string;
  href?: string;
  external?: boolean;
  visibility: Visibility;
}

/** Normalised row, derived from Work + Lab + extras. */
export interface ArchiveRecord {
  key: string;
  no: number;
  title: string;
  type: string;
  status: Status;
  year: string | null;
  summary: string;
  href?: string;
  external?: boolean;
  redacted?: boolean;
  source: "work" | "lab" | "archive";
}

export interface ExperienceEntry {
  organization: string;
  url?: string;
  /** Leave null when unknown. Never guess. */
  role: string | null;
  summary: string;
  /** Free-form, e.g. "2023 — Present". Null when unknown. */
  period: string | null;
}

export interface EducationEntry {
  institution: string;
  degree: string;
  field: string;
  /** Free-form, e.g. "In progress" or "2021 — 2025". */
  period: string | null;
}

export interface NowSection {
  label: string;
  items: string[];
}

export interface NowPage {
  /** ISO month, e.g. "2026-10". Rendered as "October 2026". */
  updated: string;
  intro?: string;
  sections: NowSection[];
}

export interface GraveyardEntry {
  title: string;
  year: string;
  /** Why it died. */
  cause: string;
  lesson: string;
}

export interface Signal {
  id: string;
  /** Shown when found. */
  found: string;
  /** Shown by the ??? command when still hidden. */
  hint: string;
}
