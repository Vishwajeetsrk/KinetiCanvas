import { useEffect, useRef, useState } from "react";
import { TopBar } from "./TopBar";
import { Library } from "./Library";
import { Stage } from "./Stage";
import { Inspector } from "./Inspector";
import { Timeline } from "./Timeline";
import { defaultScene, type Scene } from "./scene";
import { useCharacterImages } from "./useCharacterImages";
import { playChime, speakText, startAmbientMusic, stopAmbientMusic } from "./audio";
import { CharacterCreatorModal } from "./CharacterCreatorModal";
import { VisionToCodeModal } from "./VisionToCodeModal";
import type { CharacterSpec } from "./engine/types";
import { starters } from "./engine/starters";
import type { Character } from "./characters";

export function App() {
  const [scene, setScene] = useState<Scene>(defaultScene);
  const [time, setTime] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [customCharacters, setCustomCharacters] = useState<Character[]>([]);
  const [showCreatorModal, setShowCreatorModal] = useState(false);
  const [showVisionModal, setShowVisionModal] = useState(false);

  const images = useCharacterImages();
  const chimedRef = useRef(false);
  const spokenRef = useRef(false);

  const update = (patch: Partial<Scene>) => setScene((s) => ({ ...s, ...patch }));

  // Handle ambient music lifecycle
  useEffect(() => {
    if (scene.music?.enabled) {
      startAmbientMusic(scene.music.volume);
    } else {
      stopAmbientMusic();
    }
    return () => stopAmbientMusic();
  }, [scene.music?.enabled, scene.music?.volume]);

  // Playback clock — drives canvas, timeline playhead, chime and talking voice cue
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
          spokenRef.current = false;
        }

        // Trigger Notification Chime
        if (scene.audio.enabled && !chimedRef.current && t < scene.audio.at && next >= scene.audio.at) {
          chimedRef.current = true;
          playChime(scene.audio.volume);
        }

        // Trigger Companion Speech Babble
        if (scene.speech?.enabled && !spokenRef.current && t < scene.speech.at && next >= scene.speech.at) {
          spokenRef.current = true;
          const starter = starters.find((s) => s.id === scene.characterId);
          const voice = starter?.voice || { wave: "sine", note: 540, rate: 1.0 };
          speakText(scene.speech.text, voice);
        }

        return next;
      });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [playing, scene.duration, scene.audio, scene.speech, scene.characterId]);

  const handleSaveCustomCharacter = (spec: CharacterSpec, avatarDataUrl: string) => {
    const newChar: Character = {
      id: spec.id as any,
      name: spec.name,
      role: spec.role,
      feel: spec.feel,
      species: spec.species,
      defaultMotion: "wave",
      url: avatarDataUrl,
      cdnUrl: avatarDataUrl,
    };

    // Load generated avatar image into cache
    const img = new Image();
    img.src = avatarDataUrl;
    img.onload = () => {
      images.chars[spec.id as any] = img;
    };

    setCustomCharacters((prev) => [...prev, newChar]);
    update({ characterId: spec.id as any, items: spec.items || [] });
    setShowCreatorModal(false);
  };

  return (
    <div className="h-screen flex flex-col bg-shell text-ink overflow-hidden font-sans">
      <TopBar
        scene={scene}
        onRename={(name) => update({ name })}
        images={images}
        time={time}
        onOpenVision={() => setShowVisionModal(true)}
        onOpenCreator={() => setShowCreatorModal(true)}
        onToggleMusic={() => update({ music: { ...scene.music, enabled: !scene.music?.enabled } })}
      />

      <div className="flex-1 min-h-0 grid grid-cols-[232px_1fr_288px]">
        <Library
          scene={scene}
          customCharacters={customCharacters}
          onPick={(characterId) => update({ characterId })}
          onOpenCreator={() => setShowCreatorModal(true)}
        />
        <Stage
          scene={scene}
          time={time}
          images={images}
          playing={playing}
          onTogglePlay={() => setPlaying((p) => !p)}
        />
        <Inspector
          scene={scene}
          update={update}
          onOpenCustomizer={() => setShowCreatorModal(true)}
        />
      </div>

      <Timeline
        scene={scene}
        time={time}
        update={update}
        onSeek={(t) => {
          setTime(t);
          chimedRef.current = t > scene.audio.at;
          spokenRef.current = scene.speech ? t > scene.speech.at : false;
        }}
      />

      {/* Character Creator Modal */}
      {showCreatorModal && (
        <CharacterCreatorModal
          onSave={handleSaveCustomCharacter}
          onClose={() => setShowCreatorModal(false)}
        />
      )}

      {/* Vision & Screenshot-to-Code Studio Modal */}
      {showVisionModal && (
        <VisionToCodeModal
          scene={scene}
          time={time}
          onClose={() => setShowVisionModal(false)}
        />
      )}
    </div>
  );
}
