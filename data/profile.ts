export const profile = {
  name: "Faraz Haghgoo",
  initials: "FH",
  role: "Software Developer / Product Builder",
  roleShort: "Developer / product builder",
  location: {
    city: "Turin",
    country: "Italy",
    timeZone: "Europe/Rome",
    // Piazza Castello, give or take.
    coordinates: { lat: 45.0703, lon: 7.6869 },
  },

  /** The hero statement. Each entry renders on its own line. */
  statement: ["I build systems,", "products", "and interfaces."],

  /** Cycles slowly under the statement. Keep every line true. */
  rotations: [
    "Building digital products.",
    "Turning complex systems into understandable interfaces.",
    "Experimenting with what software can become.",
    "Always building something.",
  ],

  disciplines: ["Software", "Product", "AI"],

  status: {
    workingIn: "Software / Product / Interfaces",
    exploring: "AI / Interaction / New products",
  },

  /** The path between an idea and a working product. Drives the status component. */
  process: ["Understand", "Design", "Build", "Refine", "Ship"],
  /** How each stage reads as a status line. Same order as `process`. */
  processStatus: ["Understanding", "Designing", "Building", "Refining", "Shipping"],
  /** Index into `process` the status starts on. */
  processStart: 2,

  about: {
    lead: "I like the space between the system underneath and the interaction on top.",
    paragraphs: [
      "I’m a software developer and product builder based in Turin. I work on the whole path from an idea to something people can actually use: understanding the problem, shaping the product, building the system, and refining it until it holds up in production.",
      "My work moves between product interfaces, application architecture, interactive systems and experimental software. In practice that means modern web interfaces, data, authentication, databases, APIs, AI-assisted features and deployment, plus the many small decisions that make a product feel obvious.",
    ],
    short: [
      "I build software and products, from the first question to the production release. My work moves between product interfaces, application architecture, interactive systems and experimental software.",
    ],
    interests: [
      "Human–computer interaction",
      "Product architecture",
      "AI-native products",
      "Software systems",
      "Interfaces",
      "Experimentation",
      "Turning strange ideas into working products",
    ],
    /** Broad on purpose: most of this work isn't public yet. */
    experienceNote:
      "Experience building production web products, interactive systems, AI-enabled tools and data-driven interfaces, much of it with collaborators and not public yet.",
  },

  whoami: [
    "Faraz Haghgoo",
    "Developer / product builder",
    "Turin",
    "Status: probably building something",
  ],

  footerLine: "Build something worth using.",
} as const;
