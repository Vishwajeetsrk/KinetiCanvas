/**
 * Interactive Web Audio procedural synthesizer for KinetiCanvas Studio.
 * Provides character power sounds, task cues, and timeline playback audio
 * entirely offline with zero external audio assets needed.
 */

let audioCtx = null;

function getAudioContext() {
  if (typeof window === "undefined") return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === "suspended") {
    audioCtx.resume();
  }
  return audioCtx;
}

/**
 * Play a synthesized tone with envelope.
 */
export function playTone({ freq = 440, type = "sine", duration = 0.25, volume = 0.2, detune = 0 }) {
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    osc.detune.setValueAtTime(detune, ctx.currentTime);

    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(volume, ctx.currentTime + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch {
    // Audio context may be restricted before user gesture
  }
}

/**
 * Play signature sound for a character based on their power archetype.
 */
export function playCharacterSound(characterId, volume = 0.25) {
  const ctx = getAudioContext();
  if (!ctx) return;

  switch (characterId.toLowerCase()) {
    case "pomo":
      // Meditative bubble pop
      playTone({ freq: 432, type: "sine", duration: 0.18, volume });
      setTimeout(() => playTone({ freq: 648, type: "sine", duration: 0.15, volume: volume * 0.7 }), 60);
      break;

    case "fynn":
      // Upbeat woodblock & creative brush chime
      playTone({ freq: 587.33, type: "triangle", duration: 0.12, volume });
      setTimeout(() => playTone({ freq: 739.99, type: "triangle", duration: 0.18, volume }), 70);
      break;

    case "olli":
      // Crystal glass data chime
      playTone({ freq: 659.25, type: "sine", duration: 0.35, volume });
      setTimeout(() => playTone({ freq: 987.77, type: "sine", duration: 0.4, volume: volume * 0.8 }), 100);
      break;

    case "nixi":
      // 8-bit retro arcade blip
      playTone({ freq: 523.25, type: "square", duration: 0.08, volume: volume * 0.6 });
      setTimeout(() => playTone({ freq: 783.99, type: "square", duration: 0.12, volume: volume * 0.6 }), 50);
      break;

    case "ember":
      // Warm analog synth power chord
      playTone({ freq: 440, type: "sawtooth", duration: 0.3, volume: volume * 0.5 });
      playTone({ freq: 554.37, type: "sawtooth", duration: 0.3, volume: volume * 0.4 });
      playTone({ freq: 659.25, type: "sawtooth", duration: 0.35, volume: volume * 0.35 });
      break;

    case "kipi":
    default:
      // High-tech frequency sweep / agent chirp
      playTone({ freq: 880, type: "sine", duration: 0.15, volume });
      setTimeout(() => playTone({ freq: 1320, type: "sine", duration: 0.2, volume: volume * 0.8 }), 80);
      break;
  }
}

/**
 * Play task cue sound effect.
 */
export function playCueSound(cueType, volume = 0.2) {
  switch (cueType) {
    case "analytics":
      playTone({ freq: 520, type: "sine", duration: 0.1, volume });
      setTimeout(() => playTone({ freq: 780, type: "sine", duration: 0.25, volume }), 80);
      break;
    case "browser":
      playTone({ freq: 480, type: "triangle", duration: 0.12, volume });
      break;
    case "design":
      playTone({ freq: 600, type: "sine", duration: 0.18, volume });
      break;
    case "music":
      playTone({ freq: 440, type: "sawtooth", duration: 0.25, volume: volume * 0.6 });
      break;
    case "terminal":
      playTone({ freq: 350, type: "square", duration: 0.06, volume: volume * 0.5 });
      break;
    case "document":
    default:
      playTone({ freq: 400, type: "sine", duration: 0.1, volume });
      break;
  }
}
