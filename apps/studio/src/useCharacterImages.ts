import { useEffect, useState } from "react";
import { characters, type CharacterId } from "./characters";
import { cues, cueDataUrl, type CueId } from "./cues";

export type ImageBank = {
  chars: Partial<Record<CharacterId, HTMLImageElement>>;
  cues: Partial<Record<CueId, HTMLImageElement>>;
  /** True when image access is blocked from canvas reading — preview still works, pixel exports cannot. */
  tainted: boolean;
  ready: boolean;
};

function load(src: string, cors: boolean) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    if (cors) img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

export function useCharacterImages(): ImageBank {
  const [bank, setBank] = useState<ImageBank>({ chars: {}, cues: {}, tainted: false, ready: false });

  useEffect(() => {
    let alive = true;
    (async () => {
      let tainted = false;
      const chars: ImageBank["chars"] = {};
      await Promise.all(
        characters.map(async (c) => {
          try {
            // First try local asset with CORS
            chars[c.id] = await load(c.url, true);
          } catch {
            try {
              // Try local without CORS if needed
              chars[c.id] = await load(c.url, false);
            } catch {
              try {
                // Try fallback CDN URL with CORS
                chars[c.id] = await load(c.cdnUrl, true);
              } catch {
                tainted = true;
                chars[c.id] = await load(c.cdnUrl, false).catch(() => undefined as never);
              }
            }
          }
          if (alive) setBank((b) => ({ ...b, chars: { ...b.chars, [c.id]: chars[c.id] } }));
        }),
      );
      const cueImgs: ImageBank["cues"] = {};
      await Promise.all(
        cues.filter((q) => q.id !== "none").map(async (q) => {
          cueImgs[q.id] = await load(cueDataUrl(q.id), false);
        }),
      );
      if (alive) setBank({ chars, cues: cueImgs, tainted, ready: true });
    })();
    return () => {
      alive = false;
    };
  }, []);

  return bank;
}
