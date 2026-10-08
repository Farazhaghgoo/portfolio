import { archiveExtras } from "@/data/archive";
import { lab } from "@/data/lab";
import { work } from "@/data/work";
import type { ArchiveRecord, LabExperiment, Status, WorkItem } from "@/lib/types";

export function pad(n: number, width = 3): string {
  return String(n).padStart(width, "0");
}

export const statusLabel: Record<Status, string> = {
  shipped: "Shipped",
  ongoing: "Ongoing",
  prototype: "Prototype",
  experiment: "Experiment",
  private: "Private",
  archived: "Archived",
};

export function getWork(): WorkItem[] {
  return work.filter((w) => w.visibility === "public").sort((a, b) => a.index - b.index);
}

export function getWorkItem(slug: string): WorkItem | undefined {
  return getWork().find((w) => w.slug === slug);
}

export function getLab(): LabExperiment[] {
  return lab.filter((l) => l.visibility === "public").sort((a, b) => a.index - b.index);
}

export function getLabExperiment(slug: string): LabExperiment | undefined {
  return getLab().find((l) => l.slug === slug);
}

/**
 * The Archive: Work + Lab + extras, in one chronological index.
 * Unknown years sort first; ties keep declaration order. `no` is the
 * position in that order, so the index stays chronological as it grows.
 */
export function getArchive(): ArchiveRecord[] {
  const rows: Omit<ArchiveRecord, "no">[] = [
    ...work
      .filter((w) => w.visibility !== "private")
      .map((w) => ({
        key: `work:${w.slug}`,
        title: w.title,
        type: `${w.subtitle} / ${w.context}`,
        status: w.status,
        year: w.year,
        summary: w.summary,
        href: w.visibility === "public" ? `/work/${w.slug}` : undefined,
        redacted: w.visibility === "redacted",
        source: "work" as const,
      })),
    ...lab
      .filter((l) => l.visibility !== "private")
      .map((l) => ({
        key: `lab:${l.slug}`,
        title: l.title,
        type: `Lab / ${l.kind}`,
        status: l.status,
        year: l.year,
        summary: l.summary,
        href: l.visibility === "public" ? `/lab/${l.slug}` : undefined,
        redacted: l.visibility === "redacted",
        source: "lab" as const,
      })),
    ...archiveExtras
      .filter((a) => a.visibility !== "private")
      .map((a, i) => ({
        key: `archive:${i}`,
        title: a.title,
        type: a.type,
        status: a.status,
        year: a.year,
        summary: a.summary,
        href: a.href,
        external: a.external,
        redacted: a.visibility === "redacted",
        source: "archive" as const,
      })),
  ];

  const year = (y: string | null) => (y ? parseInt(y, 10) || 0 : 0);
  return rows
    .map((r, order) => ({ r, order }))
    .sort((a, b) => year(a.r.year) - year(b.r.year) || a.order - b.order)
    .map(({ r }, i) => ({ ...r, no: i + 1 }));
}

/** Real counts, derived from data. Never hard-coded. */
export function getCounts() {
  return {
    work: getWork().length,
    archive: getArchive().length,
    lab: getLab().length,
  };
}

export function formatMonth(isoMonth: string): string {
  const [y, m] = isoMonth.split("-").map(Number);
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];
  return `${months[(m ?? 1) - 1]} ${y}`;
}
