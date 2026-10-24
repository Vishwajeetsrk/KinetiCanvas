import type { MotionId } from "./motion";

export type CharacterId = "kipi" | "pomo" | "fynn" | "olli" | "nixi" | "ember";

export type Character = {
  id: CharacterId;
  name: string;
  role: string;
  feel: string;
  species: string;
  defaultMotion: MotionId;
  url: string;
  cdnUrl: string;
};

export const characters: Character[] = [
  {
    id: "kipi",
    name: "Kipi",
    role: "Creative assistant",
    feel: "Curious, focused, energetic",
    species: "Antenna bunny",
    defaultMotion: "wave",
    url: "/assets/characters/kipi-hd.jpg",
    cdnUrl: "https://cdn.magicpatterns.com/patterns/generated-images/550e078d-bf60-458c-9959-79db74371daf.jpg"
  },
  {
    id: "pomo",
    name: "Pomo",
    role: "Organizer",
    feel: "Calm, cheerful, steady",
    species: "Blob",
    defaultMotion: "idle",
    url: "/assets/characters/pomo-hd.jpg",
    cdnUrl: "https://cdn.magicpatterns.com/patterns/generated-images/9b1513ce-9a1f-4a6a-ab39-5251d7409e8c.jpg"
  },
  {
    id: "fynn",
    name: "Fynn",
    role: "Designer",
    feel: "Nimble, playful, precise",
    species: "Fox",
    defaultMotion: "paint",
    url: "/assets/characters/fynn-hd.jpg",
    cdnUrl: "https://cdn.magicpatterns.com/patterns/generated-images/cb667cf4-8cab-4864-8d2f-91c79d6cb4ef.jpg"
  },
  {
    id: "olli",
    name: "Olli",
    role: "Analyst",
    feel: "Thoughtful, observant, methodical",
    species: "Owl",
    defaultMotion: "analyze",
    url: "/assets/characters/olli-hd.jpg",
    cdnUrl: "https://cdn.magicpatterns.com/patterns/generated-images/bff251e7-d8b1-481f-a848-7ab21d4922b1.jpg"
  },
  {
    id: "nixi",
    name: "Nixi",
    role: "Explorer",
    feel: "Friendly, expressive, experimental",
    species: "Axolotl",
    defaultMotion: "think",
    url: "/assets/characters/nixi-hd.jpg",
    cdnUrl: "https://cdn.magicpatterns.com/patterns/generated-images/cd56a215-f494-494d-92d3-eb6df0498e83.jpg"
  },
  {
    id: "ember",
    name: "Ember",
    role: "Builder",
    feel: "Bold, enthusiastic, resilient",
    species: "Dragon",
    defaultMotion: "work",
    url: "/assets/characters/ember-hd.jpg",
    cdnUrl: "https://cdn.magicpatterns.com/patterns/generated-images/771d8825-cb38-46e7-9ea6-e7f724b39669.jpg"
  },
];

export const characterById = (id: CharacterId) => characters.find((c) => c.id === id) || characters[0];
