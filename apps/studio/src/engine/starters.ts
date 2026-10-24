import type { CharacterSpec } from "./types";

// Palettes and sound profiles follow packages/core/src/characters.js in the KinetiCanvas repo.
export const starters: CharacterSpec[] = [
  {
    id: "kipi", name: "Kipi", role: "Maker & Orchestrator", feel: "Curious, focused, energetic", species: "Hooded maker",
    starter: true, reference: "/assets/characters/kipi-hd.jpg",
    form: "chibi", body: "round", head: "bunny", topper: "antenna", mask: "hood", nose: "none", eyes: "round", mouth: "open",
    wings: "none", tail: "none", expression: "joy",
    colors: { body: "#29c3bc", belly: "#fdf8ee", accent: "#ff745f", cheek: "#ff8572", feet: "#1d3848", iris: "#1f7f79" },
    items: ["headphones"], voice: { wave: "sine", note: 880, rate: 1.1 }, version: 1,
  },
  {
    id: "pomo", name: "Pomo", role: "Organizer & Thinker", feel: "Calm, cheerful, steady", species: "Sprout blob",
    starter: true, reference: "/assets/characters/pomo-hd.jpg",
    form: "blob", body: "round", head: "none", topper: "antenna", mask: "none", nose: "none", eyes: "round", mouth: "open",
    wings: "none", tail: "none", expression: "happy",
    colors: { body: "#32c5ba", belly: "#f6f3e5", accent: "#ff826e", cheek: "#ff9182", feet: "#32c5ba", iris: "#1f7f79" },
    items: [], voice: { wave: "sine", note: 432, rate: 0.9 }, version: 1,
  },
  {
    id: "fynn", name: "Fynn", role: "Designer & Painter", feel: "Nimble, playful, precise", species: "Plush fox",
    starter: true, reference: "/assets/characters/fynn-hd.jpg",
    form: "chibi", body: "pear", head: "fox", topper: "tuft", mask: "muzzle", nose: "dot", eyes: "sparkle", mouth: "cat",
    wings: "none", tail: "fox", expression: "joy",
    colors: { body: "#2abcb5", belly: "#fdf8ec", accent: "#ff7b67", cheek: "#ff8c7d", feet: "#1d3848", iris: "#1f7f79" },
    items: ["brush"], voice: { wave: "triangle", note: 587.33, rate: 1.15 }, version: 1,
  },
  {
    id: "olli", name: "Olli", role: "Analyst & Strategist", feel: "Thoughtful, observant, methodical", species: "Feathered owl",
    starter: true, reference: "/assets/characters/olli-hd.jpg",
    form: "chibi", body: "round", head: "tufts", topper: "none", mask: "mask", nose: "beak", eyes: "round", mouth: "smile",
    wings: "feather", tail: "none", expression: "happy",
    colors: { body: "#57d8cc", belly: "#f7f5e9", accent: "#ff8573", cheek: "#ff8573", feet: "#ff8573", iris: "#1f7f79" },
    items: ["glasses"], voice: { wave: "sine", note: 659.25, rate: 0.95 }, version: 1,
  },
  {
    id: "nixi", name: "Nixi", role: "Explorer & Systems", feel: "Friendly, expressive, experimental", species: "Coral-gilled axolotl",
    starter: true, reference: "/assets/characters/nixi-hd.jpg",
    form: "chibi", body: "bean", head: "gills", topper: "none", mask: "none", nose: "none", eyes: "round", mouth: "open",
    wings: "none", tail: "axolotl", expression: "happy",
    colors: { body: "#39c8c1", belly: "#fcf8ea", accent: "#ff7461", cheek: "#ff8575", feet: "#39c8c1", iris: "#1f7f79" },
    items: [], voice: { wave: "square", note: 523.25, rate: 1.2 }, version: 1,
  },
  {
    id: "ember", name: "Ember", role: "Builder & Architect", feel: "Bold, enthusiastic, resilient", species: "Teal baby dragon",
    starter: true, reference: "/assets/characters/ember-hd.jpg",
    form: "chibi", body: "pear", head: "horns", topper: "crest", mask: "none", nose: "nostrils", eyes: "round", mouth: "fang",
    wings: "bat", tail: "dragon", expression: "happy",
    colors: { body: "#21b9b2", belly: "#fed3c7", accent: "#ff6f5b", cheek: "#ff8272", feet: "#21b9b2", iris: "#1f7f79" },
    items: [], voice: { wave: "sawtooth", note: 440, rate: 1.05 }, version: 1,
  },
];

export const blankSpec = (): CharacterSpec => ({
  ...starters[2],
  id: `char-${Math.random().toString(36).slice(2, 9)}`,
  name: "New friend",
  role: "Companion",
  feel: "Kind, curious",
  species: "Original",
  starter: false,
  reference: undefined,
  items: [],
});
