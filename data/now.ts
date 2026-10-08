import type { NowPage } from "@/lib/types";

/**
 * The /now page. Edit this file, change `updated`, ship.
 * A "now page" says what you're focused on at this point in your life.
 * See nownownow.com.
 */
export const now: NowPage = {
  updated: "2026-10",
  intro: "What I’m focused on at the moment. Updated when it changes, not on a schedule.",
  sections: [
    {
      label: "Building",
      items: [
        "Production software and interactive products. Some public, most not yet.",
        "This website, which is also an experiment.",
      ],
    },
    {
      label: "Exploring",
      items: [
        "AI-native interfaces.",
        "Human–computer interaction.",
        "Products that behave less like websites.",
      ],
    },
    {
      label: "Learning",
      items: [
        "Product architecture, informally, by shipping things.",
      ],
    },
    {
      label: "Thinking about",
      items: ["What changes when intelligent software becomes ordinary?"],
    },
  ],
};
