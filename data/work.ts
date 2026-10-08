import type { WorkItem } from "@/lib/types";

/**
 * Selected work.
 *
 * To add a project: append an object. It appears in the Work index, gets a
 * page at /work/[slug], an Archive row, a sitemap entry and a command in the
 * palette. Set `visibility: "private"` to keep a draft out of every listing.
 *
 * Fields left `null` (year, role) render as a dash. Don't guess them.
 */
export const work: WorkItem[] = [
  {
    slug: "inrebus-educational",
    index: 1,
    title: "inRebus Educational",
    subtitle: "Digital experience",
    context: "Professional",
    category: ["Digital experience", "Web"],
    status: "shipped",
    year: null, // TODO: add when you're ready to state it
    role: null, // TODO: add your role or title
    summary:
      "The public digital experience of inRebus Digital Learning. Interfaces and web systems, built inside a multidisciplinary software team.",
    description:
      "inRebus Digital Learning is the digital-learning line of inRebus, a Turin software house. It designs courses, platforms and learning experiences for companies and public institutions.",
    url: "https://www.inrebus.education/",
    cover: {
      src: "/work/inrebus-educational/desktop.jpg",
      width: 2400,
      height: 1500,
      alt: "The inRebus Digital Learning homepage: the headline “Learning outside the box” in orange and white over a photograph of people working at shared tables.",
      caption: "inrebus.education, desktop. Public site.",
    },
    gallery: [
      {
        src: "/work/inrebus-educational/mobile.jpg",
        width: 860,
        height: 1864,
        alt: "The same homepage on a phone: logo, menu button and the stacked headline “Learning outside the box”.",
        caption: "Mobile.",
      },
    ],
    sections: [
      {
        type: "text",
        heading: "Context",
        body: [
          "The site has a lot to carry: services, platforms, a working method and a body of client work, in two languages, for HR teams, training managers and public institutions at the same time.",
        ],
      },
      {
        type: "text",
        heading: "The work",
        body: [
          "This is professional work, done as part of a multidisciplinary team of project managers, instructional and multimedia designers, developers and writers. My side of it is the software: interfaces, front-end and the web systems behind them.",
          "It's where a lot of my day-to-day practice comes from. Real constraints, real users, things that have to keep working after launch.",
        ],
      },
    ],
    visibility: "public",
    featured: true,
  },
  {
    slug: "examassist", index: 2, title: "EXAMassist", subtitle: "Exam preparation",
    context: "With collaborators", category: ["Product", "Learning"], status: "ongoing",
    year: null, role: "Software development", demo: "exam",
    summary: "An exam-preparation product in the assist365 family. My contributions connect the learning journey, accounts and checkout.",
    description: "Keep the learner’s intent intact, even as they move between different parts of the product.",
    url: "https://exam.assist365.app", visibility: "public", featured: true,
    sections: [{ type: "text", heading: "My contribution", body: ["Working with a collaborator, I contributed to preserving the selected exam through sign-up and checkout, account recovery, and aggregate funnel counts."] }, { type: "text", heading: "About this preview", body: ["The question above is a small interactive sketch made for this portfolio. It illustrates an answer-and-explanation interaction; it is not a screenshot, a live exam or the full product."] }],
  },
  {
    slug: "vibeassist", index: 3, title: "VibeAssist", subtitle: "Product dashboard",
    context: "With collaborators", category: ["Product", "Data"], status: "ongoing",
    year: null, role: "Software development", demo: "metrics",
    summary: "A dashboard for independent app makers. My contributions span accounts, stored metrics, campaign data and an AI advisor integration.",
    description: "A place to bring product and campaign information together, with the systems behind it connected.",
    url: "https://vibeassist.assist365.app", visibility: "public", featured: true,
    sections: [{ type: "text", heading: "My contribution", body: ["Built with a collaborator. I contributed to authentication, stored metrics and manual entries, campaign storage, and the AI advisor integration."] }, { type: "text", heading: "About this preview", body: ["The dashboard above is an interactive portfolio sketch using fictional figures. Switching weeks demonstrates a small data interaction, not business results or a live connection to the product."] }],
  },
];
