let ctx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
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
