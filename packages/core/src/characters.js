/**
 * Complete character catalog for KinetiCanvas companions, grounded in the
 * reference artwork with individual powers, working styles, visual morphology,
 * audio signatures, and motion states.
 */

export const CHARACTERS = Object.freeze([
  {
    id: "pomo",
    name: "Pomo",
    title: "The Mind & Ideation Master",
    role: "Organizer & Thinker",
    archetype: "Mind & Strategy",
    species: "Sprout Blob",
    visual: Object.freeze({
      baseColor: "#32c5ba",
      bellyColor: "#f6f3e5",
      accentColor: "#ff826e",
      cheekColor: "#ff9182",
      silhouette: "dome-blob",
      headAccessory: "coral-pom-pom-antenna",
      floatingElement: "idea-bubbles",
      eyeStyle: "glossy-round",
    }),
    powers: Object.freeze([
      "Mind Bubble Matrix (Spawns floating idea bubbles that coalesce into solutions)",
      "Zen Focus & Ideation Shield (Eliminates cognitive noise and clutter)",
      "Clustering & Organization (Sorts raw thoughts into structured project flows)",
    ]),
    workingStyle: "Calm contemplation, iterative bubble-sketching, and structured task organization.",
    signatureCue: "document",
    soundProfile: Object.freeze({
      wave: "sine",
      freq: 432,
      timbre: "meditative water bubble pop",
      notes: Object.freeze(["C5", "E5", "G5"]),
    }),
    supportedMotions: Object.freeze(["Idle", "Walk", "Think", "Work", "Review", "Sleep"]),
  },
  {
    id: "fynn",
    name: "Fynn",
    title: "The Visual Artist & Canvas Magician",
    role: "Designer & Painter",
    archetype: "Design & Aesthetics",
    species: "Plush Fox",
    visual: Object.freeze({
      baseColor: "#2abcb5",
      bellyColor: "#fdf8ec",
      accentColor: "#ff7b67",
      cheekColor: "#ff8c7d",
      silhouette: "fluffy-fox",
      headAccessory: "forehead-tuft-pointed-ears",
      floatingElement: "paint-palette-brush",
      eyeStyle: "sparkling-laugh",
    }),
    powers: Object.freeze([
      "Chromatic Realization (Transforms concepts into vibrant harmonious palettes)",
      "Vector Transmutation (Shapes curves, responsive frames, and SVG canvas layers)",
      "Design Intelligence (Instant UI/UX layout and Canva/Figma visual harmonization)",
    ]),
    workingStyle: "Dynamic brushstrokes, vibrant color layering, and intuitive aesthetic craft.",
    signatureCue: "design",
    soundProfile: Object.freeze({
      wave: "triangle",
      freq: 587.33,
      timbre: "crisp canvas brush stroke & playful woodblock chime",
      notes: Object.freeze(["D5", "F#5", "A5"]),
    }),
    supportedMotions: Object.freeze(["Idle", "Walk", "Think", "Work", "Review", "Sleep"]),
  },
  {
    id: "olli",
    name: "Olli",
    title: "The Data Sage & Quantum Analyst",
    role: "Analyst & Strategist",
    archetype: "Intelligence & Analytics",
    species: "Feathered Owl",
    visual: Object.freeze({
      baseColor: "#57d8cc",
      bellyColor: "#f7f5e9",
      accentColor: "#ff8573",
      cheekColor: "#ff8573",
      beakColor: "#ff9d85",
      silhouette: "plush-owl",
      headAccessory: "feather-ear-tufts",
      floatingElement: "analytics-bar-chart",
      eyeStyle: "oversized-wise-rim",
    }),
    powers: Object.freeze([
      "Predictive Telemetry (Anticipates trends, bottlenecks, and performance anomalies)",
      "Multi-Metric Synthesis (Distills raw data streams into illuminated 3D charts)",
      "Clairvoyant Audit (Scans architectures and workflows with 360-degree clarity)",
    ]),
    workingStyle: "Deep methodical observation, scanning telemetry, and distilling actionable wisdom.",
    signatureCue: "analytics",
    soundProfile: Object.freeze({
      wave: "sine",
      freq: 659.25,
      timbre: "resonant crystal glass chime",
      notes: Object.freeze(["E5", "G#5", "B5"]),
    }),
    supportedMotions: Object.freeze(["Idle", "Walk", "Think", "Work", "Review", "Sleep"]),
  },
  {
    id: "nixi",
    name: "Nixi",
    title: "The Web Navigator & API Explorer",
    role: "Explorer & Systems",
    archetype: "Exploration & Connectivity",
    species: "Coral-Gilled Axolotl",
    visual: Object.freeze({
      baseColor: "#39c8c1",
      bellyColor: "#fcf8ea",
      accentColor: "#ff7461",
      cheekColor: "#ff8575",
      silhouette: "smiling-axolotl",
      headAccessory: "branching-gill-frills",
      floatingElement: "browser-app-console",
      eyeStyle: "wide-wonder",
    }),
    powers: Object.freeze([
      "Web Teleportation (Navigates browser tabs, DOM trees, and Chrome flows seamlessly)",
      "API Deep-Diving (Discovers endpoints and bridges distributed microservices)",
      "Playful Resiliency (Heals edge-case errors with boundless curiosity)",
    ]),
    workingStyle: "Joyful exploration, rapid tab/flow traversal, and interactive experimentation.",
    signatureCue: "browser",
    soundProfile: Object.freeze({
      wave: "square",
      freq: 523.25,
      timbre: "8-bit retro arcade blip & water bubble drop",
      notes: Object.freeze(["C5", "G5", "C6"]),
    }),
    supportedMotions: Object.freeze(["Idle", "Walk", "Think", "Work", "Review", "Sleep"]),
  },
  {
    id: "ember",
    name: "Ember",
    title: "The Master Builder & Musical Architect",
    role: "Builder & Architect",
    archetype: "Architecture & Audio Synthesis",
    species: "Teal Baby Dragon",
    visual: Object.freeze({
      baseColor: "#21b9b2",
      bellyColor: "#fed3c7",
      accentColor: "#ff6f5b",
      hornColor: "#f8f3df",
      cheekColor: "#ff8272",
      silhouette: "dragon-builder",
      headAccessory: "ivory-horns-dorsal-crest",
      floatingElement: "musical-notes",
      eyeStyle: "gleaming-obsidian",
    }),
    powers: Object.freeze([
      "Code Ignition (Forges scalable, high-performance builds from clean blueprints)",
      "Harmonic Composition (Weaves timeline beats and audio cues into musical sync)",
      "Tenacious Resilience (Blazes through compilation hurdles with cheerful fire)",
    ]),
    workingStyle: "Energetic construction, architectural rhythm, and bold musical beats.",
    signatureCue: "music",
    soundProfile: Object.freeze({
      wave: "sawtooth",
      freq: 440,
      timbre: "warm analog synth power chord & rhythmic percussion",
      notes: Object.freeze(["A4", "C#5", "E5", "A5"]),
    }),
    supportedMotions: Object.freeze(["Idle", "Walk", "Think", "Work", "Review", "Sleep"]),
  },
  {
    id: "kipi",
    name: "Kipi",
    title: "The Universal Orchestrator & System Maker",
    role: "Maker & Orchestrator",
    archetype: "Orchestration & Multi-Agent Intelligence",
    species: "Cosmic Plush Maker",
    visual: Object.freeze({
      baseColor: "#29c3bc",
      hoodColor: "#29c3bc",
      faceColor: "#fdf8ee",
      accentColor: "#ff745f",
      earColor: "#6ce1d7",
      bootColor: "#1d3848",
      cheekColor: "#ff8572",
      silhouette: "hooded-maker",
      headAccessory: "spherical-antenna-floppy-ears",
      floatingElement: "equalizer-waveform",
      eyeStyle: "gentle-curved",
    }),
    powers: Object.freeze([
      "Agent Telepathy (Direct pipeline link to Antigravity, Codex, and Claude Code)",
      "Audio Spectrum Equalization (Balances frequencies, dialogue, and soundscapes)",
      "Omni-Tool Synthesis (Chains multi-step workflows with zero friction)",
    ]),
    workingStyle: "Precision orchestration, balancing all systems into unified harmony.",
    signatureCue: "terminal",
    soundProfile: Object.freeze({
      wave: "sine",
      freq: 880,
      timbre: "polyphonic high-tech frequency sweep & agent chirp",
      notes: Object.freeze(["A5", "E6", "A6"]),
    }),
    supportedMotions: Object.freeze(["Idle", "Walk", "Think", "Work", "Review", "Sleep"]),
  },
]);

/**
 * Retrieve a character by ID.
 * @param {string} id
 * @returns {typeof CHARACTERS[number] | undefined}
 */
export function getCharacterById(id) {
  return CHARACTERS.find((char) => char.id === id);
}

/**
 * List all available companion IDs.
 * @returns {string[]}
 */
export function listCharacterIds() {
  return CHARACTERS.map((char) => char.id);
}
