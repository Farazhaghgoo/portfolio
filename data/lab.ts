import type { LabExperiment } from "@/lib/types";

/**
 * Lab experiments. Each slug must have a matching component registered in
 * components/lab/registry.tsx. Experiments are code-split: their JavaScript
 * only loads on their own page.
 */
export const lab: LabExperiment[] = [
  {
    slug: "field",
    index: 1,
    title: "Field",
    kind: "Physics / Generative",
    year: "2026",
    status: "experiment",
    summary: "A sheet of points that remembers being touched, for a moment.",
    instructions: [
      "Move across the field to disturb it.",
      "Press or tap to send a pulse.",
      "Switch to attract to pull the points in.",
    ],
    notes:
      "A few thousand springs on a 2D canvas. No libraries. It sleeps when nothing is moving, so it costs nothing while you read.",
    visibility: "public",
  },
  {
    slug: "entropy",
    index: 2,
    title: "Entropy",
    kind: "Interface / Simulation",
    year: "2026",
    status: "experiment",
    summary: "An earlier layout of this site, treated as a physical system. Add heat and watch the order go.",
    instructions: [
      "Raise the entropy to add heat.",
      "Drag and throw any block.",
      "Restore order when you’re done.",
    ],
    notes:
      "Each block is held to its place in the layout by a spring. Entropy weakens the springs and adds noise. Layout, in the end, is just a set of forces we agree on.",
    visibility: "public",
  },
];
