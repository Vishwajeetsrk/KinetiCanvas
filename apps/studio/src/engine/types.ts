/** The editable character package — mirrors character.json from docs/ASSET_LIBRARY.md. */
export type Form = "chibi" | "blob";
export type BodyShape = "round" | "pear" | "bean";
export type HeadFeature = "none" | "fox" | "bunny" | "tufts" | "horns" | "gills" | "bear";
export type Topper = "none" | "antenna" | "tuft" | "crest";
export type FaceMask = "none" | "muzzle" | "mask" | "hood";
export type Nose = "none" | "dot" | "beak" | "nostrils";
export type EyeStyle = "round" | "sparkle" | "small";
export type MouthStyle = "smile" | "open" | "cat" | "fang";
export type Wings = "none" | "bat" | "feather";
export type Tail = "none" | "fox" | "dragon" | "axolotl" | "pom";
export type Expression = "happy" | "joy" | "calm" | "surprised" | "sleepy" | "wink";
export type Wave = "sine" | "triangle" | "square" | "sawtooth";

export type ItemId =
  | "headphones" | "glasses" | "party-hat" | "crown" | "bow" | "flower"
  | "scarf" | "star" | "laptop" | "coffee" | "brush" | "magnifier";

export type CharacterSpec = {
  id: string;
  name: string;
  role: string;
  feel: string;
  species: string;
  starter?: boolean;
  reference?: string;
  form: Form;
  body: BodyShape;
  head: HeadFeature;
  topper: Topper;
  mask: FaceMask;
  nose: Nose;
  eyes: EyeStyle;
  mouth: MouthStyle;
  wings: Wings;
  tail: Tail;
  expression: Expression;
  colors: { body: string; belly: string; accent: string; cheek: string; feet: string; iris: string };
  items: ItemId[];
  voice: { wave: Wave; note: number; rate: number };
  version: 1;
};
