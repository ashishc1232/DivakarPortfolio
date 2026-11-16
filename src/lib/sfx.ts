let ctx: AudioContext | null = null;
let enabled = false;
let lastTick = 0;

export function setSfxEnabled(on: boolean) {
  enabled = on;
  if (on && !ctx) {
    const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AC) ctx = new AC();
  }
  if (on) void ctx?.resume();
}

function blip(freq: number, dur: number, gain: number, type: OscillatorType = "square") {
  if (!enabled || !ctx) return;
  try {
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = type;
    o.frequency.value = freq;
    o.connect(g);
    g.connect(ctx.destination);
    const t = ctx.currentTime;
    g.gain.setValueAtTime(gain, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.start(t);
    o.stop(t + dur + 0.02);
  } catch {
    // audio unavailable — stay silent
  }
}

export const sfx = {
  select() {
    blip(620, 0.08, 0.05, "triangle");
  },
  tick() {
    const now = performance.now();
    if (now - lastTick < 70) return;
    lastTick = now;
    blip(2300 + Math.random() * 700, 0.02, 0.018);
  },
  done() {
    blip(880, 0.07, 0.04, "sine");
  },
};
