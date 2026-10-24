import { useEffect, useRef, useState } from "react";
import { TopBar } from "./TopBar";
import { Library } from "./Library";
import { Stage } from "./Stage";
import { Inspector } from "./Inspector";
import { Timeline } from "./Timeline";
import { defaultScene, type Scene } from "./scene";
import { useCharacterImages } from "./useCharacterImages";
import { playChime } from "./audio";

export function App() {
  const [scene, setScene] = useState<Scene>(defaultScene);
  const [time, setTime] = useState(0);
  const [playing, setPlaying] = useState(true);
  const images = useCharacterImages();
  const chimedRef = useRef(false);

  const update = (patch: Partial<Scene>) => setScene((s) => ({ ...s, ...patch }));

  // Playback clock — drives the canvas, timeline playhead and audio cue.
  useEffect(() => {
    if (!playing) return;
    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = (now - last) / 1000;
      last = now;
      setTime((t) => {
        let next = t + dt;
        if (next >= scene.duration) {
          next = next % scene.duration;
          chimedRef.current = false;
        }
        if (scene.audio.enabled && !chimedRef.current && t < scene.audio.at && next >= scene.audio.at) {
          chimedRef.current = true;
          playChime(scene.audio.volume);
        }
        return next;
      });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [playing, scene.duration, scene.audio.enabled, scene.audio.at, scene.audio.volume]);

  return (
    <div className="h-screen flex flex-col bg-shell text-ink overflow-hidden font-sans">
      <TopBar scene={scene} onRename={(name) => update({ name })} images={images} time={time} />
      <div className="flex-1 min-h-0 grid grid-cols-[232px_1fr_288px]">
        <Library scene={scene} onPick={(characterId) => update({ characterId })} />
        <Stage scene={scene} time={time} images={images} playing={playing} onTogglePlay={() => setPlaying((p) => !p)} />
        <Inspector scene={scene} update={update} />
      </div>
      <Timeline
        scene={scene}
        time={time}
        update={update}
        onSeek={(t) => {
          setTime(t);
          chimedRef.current = t > scene.audio.at;
        }}
      />
    </div>
  );
}
