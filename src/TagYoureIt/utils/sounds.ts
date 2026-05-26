// Web Audio synth — no audio files. Strict "first touch unlock" rule:
// `unlockAudio()` may only run inside a real user gesture handler. Never
// call it from a mount effect — Aigram preloads games while user is on
// the previous game and that mount-time playback leaks into their ears.

let ctx: AudioContext | null = null;
let ready = false;

function getCtx(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!ctx) {
    const Ctor: typeof AudioContext | undefined =
      (window as any).AudioContext || (window as any).webkitAudioContext;
    if (!Ctor) return null;
    try {
      ctx = new Ctor();
    } catch {
      return null;
    }
  }
  return ctx;
}

export function unlockAudio() {
  const c = getCtx();
  if (!c) return;
  if (c.state === 'suspended') {
    c.resume().catch(() => {});
  }
  ready = true;
}

export function isAudioReady() {
  return ready;
}

function tone(
  freq: number,
  durMs: number,
  {
    type = 'square',
    gain = 0.18,
    attack = 0.006,
    release = 0.04,
    detune = 0,
  }: {
    type?: OscillatorType;
    gain?: number;
    attack?: number;
    release?: number;
    detune?: number;
  } = {},
) {
  if (!ready) return;
  const c = getCtx();
  if (!c) return;
  const now = c.currentTime;
  const osc = c.createOscillator();
  const g = c.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  if (detune) osc.detune.value = detune;
  g.gain.setValueAtTime(0, now);
  g.gain.linearRampToValueAtTime(gain, now + attack);
  const tail = Math.max(now + durMs / 1000 - release, now + attack);
  g.gain.setValueAtTime(gain, tail);
  g.gain.exponentialRampToValueAtTime(0.0001, now + durMs / 1000 + release);
  osc.connect(g);
  g.connect(c.destination);
  osc.start(now);
  osc.stop(now + durMs / 1000 + release + 0.02);
}

function noise(durMs: number, gain = 0.2) {
  if (!ready) return;
  const c = getCtx();
  if (!c) return;
  const now = c.currentTime;
  const buf = c.createBuffer(1, Math.floor(c.sampleRate * (durMs / 1000)), c.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < data.length; i++) {
    // simple white noise with decay envelope baked in
    const t = i / data.length;
    data[i] = (Math.random() * 2 - 1) * (1 - t) * (1 - t);
  }
  const src = c.createBufferSource();
  src.buffer = buf;
  const g = c.createGain();
  g.gain.value = gain;
  src.connect(g);
  g.connect(c.destination);
  src.start(now);
}

/** Soft click for taps */
export function playClick() {
  tone(420, 50, { type: 'square', gain: 0.1, attack: 0.001, release: 0.02 });
}

/** Snare-y slap for tag impact */
export function playSlap() {
  noise(120, 0.32);
  tone(150, 90, { type: 'triangle', gain: 0.22, attack: 0.001 });
}

/** Cartoon "boing" for selecting moves */
export function playBoing() {
  if (!ready) return;
  const c = getCtx();
  if (!c) return;
  const now = c.currentTime;
  const osc = c.createOscillator();
  const g = c.createGain();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(180, now);
  osc.frequency.exponentialRampToValueAtTime(560, now + 0.08);
  osc.frequency.exponentialRampToValueAtTime(220, now + 0.22);
  g.gain.setValueAtTime(0, now);
  g.gain.linearRampToValueAtTime(0.2, now + 0.01);
  g.gain.exponentialRampToValueAtTime(0.0001, now + 0.28);
  osc.connect(g);
  g.connect(c.destination);
  osc.start(now);
  osc.stop(now + 0.3);
}

/** Big fanfare on reveal */
export function playFanfare() {
  if (!ready) return;
  const notes = [392, 523, 659, 784];
  notes.forEach((f, i) => {
    setTimeout(() => tone(f, 180, { type: 'square', gain: 0.18 }), i * 120);
  });
}

/** Whip-crack effect for the slam */
export function playWhip() {
  if (!ready) return;
  const c = getCtx();
  if (!c) return;
  const now = c.currentTime;
  const osc = c.createOscillator();
  const g = c.createGain();
  osc.type = 'sawtooth';
  osc.frequency.setValueAtTime(820, now);
  osc.frequency.exponentialRampToValueAtTime(120, now + 0.14);
  g.gain.setValueAtTime(0, now);
  g.gain.linearRampToValueAtTime(0.18, now + 0.005);
  g.gain.exponentialRampToValueAtTime(0.0001, now + 0.18);
  osc.connect(g);
  g.connect(c.destination);
  osc.start(now);
  osc.stop(now + 0.22);
}

/** Soft chime for incoming/inbox notification */
export function playChime() {
  tone(880, 180, { type: 'sine', gain: 0.14 });
  setTimeout(() => tone(1100, 200, { type: 'sine', gain: 0.12 }), 110);
}
