import type { Signal } from "@/lib/types";

/**
 * Discoverable signals. Every one of them is real and reachable.
 * Progress is stored in this browser only.
 */
export const signals: Signal[] = [
  {
    id: "palette",
    found: "Opened the command line.",
    hint: "Some keys do more than type. Try the one that leans forward.",
  },
  {
    id: "whoami",
    found: "Asked the system who it is.",
    hint: "Ask the system who it is. It answers to an old Unix question.",
  },
  {
    id: "cycle",
    found: "Ran a full cycle.",
    hint: "Follow the homepage idea through all three stages: system, interface, product.",
  },
  {
    id: "inspect",
    found: "Looked under the surface.",
    hint: "There’s a small mark at the very bottom of every page. It isn’t decoration.",
  },
  {
    id: "lab",
    found: "Entered the Lab.",
    hint: "Not everything here is meant to be useful.",
  },
  {
    id: "graveyard",
    found: "Found the graveyard.",
    hint: "Ideas go somewhere when they die. Robots are told not to look.",
  },
  {
    id: "log",
    found: "Read the session log.",
    hint: "The system keeps a log. Old games had a code for everything.",
  },
];
