import type { EducationEntry, ExperienceEntry } from "@/lib/types";

/**
 * Leave `role` and `period` null until you want to state them.
 * Null values render as nothing (or a dash). They are never guessed.
 */
export const experience: ExperienceEntry[] = [
  {
    organization: "inRebus",
    url: "https://www.inrebus.education/",
    role: null, // TODO: your title, e.g. "Software Developer"
    summary:
      "Software development and digital products. Interfaces, web systems and production work inside a multidisciplinary team.",
    period: null, // TODO: e.g. "2024 — Present"
  },
];

export const education: EducationEntry[] = [];
