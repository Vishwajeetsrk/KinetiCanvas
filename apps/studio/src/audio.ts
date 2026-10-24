let ctx: AudioContext | null = null;

export function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
  if (!AudioCtx) return null;
  ctx ??= new AudioCtx();
  return ctx;
}

/** Schedules a soft two-note notification chime on any AudioNode destination. */
export function scheduleChime(ac: BaseAudioContext, dest: AudioNode, when: number, volume: number) {
  [880, 1320].forEach((freq, i) => {
    const osc = ac.createOscillator();
    const gain = ac.createGain();
    osc.type = "sine";
    osc.frequency.value = freq;
    const t0 = when + i * 0.12;
    gain.gain.setValueAtTime(0, t0);
    gain.gain.linearRampToValueAtTime(0.25 * volume, t0 + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.6);
    osc.connect(gain).connect(dest);
    osc.start(t0);
    osc.stop(t0 + 0.65);
  });
}

export function playChime(volume: number) {
  const ac = getAudioContext();
  if (!ac) return;
  if (ac.state === "suspended") void ac.resume();
  scheduleChime(ac, ac.destination, ac.currentTime, volume);
}

/* ==========================================================================
   AMBIENT BACKGROUND MUSIC ENGINE (Procedural Web Audio)
   ========================================================================== */

let musicInterval: number | null = null;
let musicNodes: { stop: () => void }[] = [];

const CHORDS = [
  [261.63, 329.63, 392.00, 493.88], // Cmaj7 (C4, E4, G4, B4)
  [220.00, 261.63, 329.63, 392.00], // Am7 (A3, C4, E4, G4)
  [174.61, 220.00, 261.63, 329.63], // Fmaj7 (F3, A3, C4, E4)
  [196.00, 246.94, 293.66, 349.23], // G7 (G3, B3, D4, F4)
];

export function startAmbientMusic(volume = 0.35, dest?: AudioNode) {
  stopAmbientMusic();
  const ac = getAudioContext();
  if (!ac) return;
  if (ac.state === "suspended") void ac.resume();

  const targetDest = dest || ac.destination;
  let chordIdx = 0;

  const playBar = () => {
    const chord = CHORDS[chordIdx % CHORDS.length];
    chordIdx++;
    const now = ac.currentTime;
    const barDuration = 2.4;

    // Filtered pad chord
    const filter = ac.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(600, now);
    filter.frequency.exponentialRampToValueAtTime(1400, now + barDuration * 0.5);
    filter.frequency.exponentialRampToValueAtTime(600, now + barDuration);

    const masterGain = ac.createGain();
    masterGain.gain.setValueAtTime(0, now);
    masterGain.gain.linearRampToValueAtTime(volume * 0.15, now + 0.2);
    masterGain.gain.setValueAtTime(volume * 0.15, now + barDuration - 0.2);
    masterGain.gain.linearRampToValueAtTime(0.001, now + barDuration);

    filter.connect(masterGain).connect(targetDest);

    const activeOscs: OscillatorNode[] = [];
    chord.forEach((freq, idx) => {
      const osc = ac.createOscillator();
      osc.type = idx % 2 === 0 ? "sine" : "triangle";
      osc.frequency.setValueAtTime(freq, now);
      osc.connect(filter);
      osc.start(now);
      osc.stop(now + barDuration);
      activeOscs.push(osc);
    });

    // Soft lofi rhythm kick & tick
    const tickOsc = ac.createOscillator();
    const tickGain = ac.createGain();
    tickOsc.type = "triangle";
    tickOsc.frequency.setValueAtTime(120, now);
    tickOsc.frequency.exponentialRampToValueAtTime(30, now + 0.1);
    tickGain.gain.setValueAtTime(volume * 0.3, now);
    tickGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.12);
    tickOsc.connect(tickGain).connect(targetDest);
    tickOsc.start(now);
    tickOsc.stop(now + 0.15);

    musicNodes.push({
      stop: () => {
        try {
          activeOscs.forEach((o) => o.stop());
          tickOsc.stop();
        } catch {
          // ignore already stopped
        }
      },
    });
  };

  playBar();
  musicInterval = window.setInterval(playBar, 2400);
}

export function stopAmbientMusic() {
  if (musicInterval !== null) {
    clearInterval(musicInterval);
    musicInterval = null;
  }
  musicNodes.forEach((n) => n.stop());
  musicNodes = [];
}

/* ==========================================================================
   COMPANION TALKING VOICE SYNTHESIZER (Formant Babbles)
   ========================================================================== */

export type VoiceProfile = {
  wave: "sine" | "triangle" | "square" | "sawtooth";
  note: number;
  rate: number;
};

let talkCancel: (() => void) | null = null;

export function speakText(text: string, voice: VoiceProfile, onDone?: () => void): () => void {
  stopTalking();
  const ac = getAudioContext();
  if (!ac) {
    onDone?.();
    return () => {};
  }
  if (ac.state === "suspended") void ac.resume();

  let cancelled = false;
  const words = text.trim().split(/\s+/);
  const syllables = Math.min(24, Math.max(4, words.length * 2));
  const baseFreq = voice.note || 520;
  const syllableDuration = 0.09 / (voice.rate || 1.0);
  let index = 0;

  const timer = window.setInterval(() => {
    if (cancelled || index >= syllables) {
      clearInterval(timer);
      talkCancel = null;
      if (!cancelled) onDone?.();
      return;
    }

    const now = ac.currentTime;
    const osc = ac.createOscillator();
    const filter = ac.createBiquadFilter();
    const gain = ac.createGain();

    // Random inflection around base note
    const pitchOffset = Math.sin(index * 1.3) * 65 + (Math.random() - 0.5) * 40;
    osc.type = voice.wave;
    osc.frequency.setValueAtTime(baseFreq + pitchOffset, now);
    osc.frequency.linearRampToValueAtTime(baseFreq + pitchOffset * 0.8, now + syllableDuration);

    // Formant filter (shifts between 800Hz and 2200Hz to simulate vowels)
    filter.type = "bandpass";
    const formantFreq = 800 + (index % 5) * 320;
    filter.frequency.setValueAtTime(formantFreq, now);
    filter.Q.value = 3.5;

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.18, now + syllableDuration * 0.2);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + syllableDuration);

    osc.connect(filter).connect(gain).connect(ac.destination);
    osc.start(now);
    osc.stop(now + syllableDuration + 0.02);

    index++;
  }, syllableDuration * 1000 * 1.1);

  talkCancel = () => {
    cancelled = true;
    clearInterval(timer);
    talkCancel = null;
  };

  return talkCancel;
}

export function stopTalking() {
  if (talkCancel) {
    talkCancel();
    talkCancel = null;
  }
}
