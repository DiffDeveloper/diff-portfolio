// Lightweight procedural audio built on the Web Audio API. Everything is
// synthesized at runtime (filtered noise for wind, short oscillator blips for
// footsteps/interactions), so there are no audio files to ship or download.
//
// Browsers block audio until a user gesture, so the context is created lazily
// and resumed on the first key/pointer input inside the game.
class GameAudio {
  constructor() {
    this.ctx = null;
    this.master = null;
    this.windGain = null;
    this.muted = false;
    this.started = false;
  }

  init() {
    if (this.ctx) return;
    try {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      if (!Ctx) return;
      this.ctx = new Ctx();
      this.master = this.ctx.createGain();
      this.master.gain.value = this.muted ? 0 : 0.5;
      this.master.connect(this.ctx.destination);
      this._startWind();
    } catch {
      this.ctx = null;
    }
  }

  resume() {
    this.init();
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume().catch(() => {});
    }
    this.started = true;
  }

  _startWind() {
    if (!this.ctx) return;
    // Pink-ish noise buffer, low-pass filtered and slowly modulated = wind.
    const bufferSize = 2 * this.ctx.sampleRate;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i += 1) {
      data[i] = Math.random() * 2 - 1;
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    noise.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 480;

    this.windGain = this.ctx.createGain();
    this.windGain.gain.value = 0.12;

    // Slow LFO on the filter cutoff for a breathing gust feel.
    const lfo = this.ctx.createOscillator();
    lfo.frequency.value = 0.08;
    const lfoGain = this.ctx.createGain();
    lfoGain.gain.value = 220;
    lfo.connect(lfoGain).connect(filter.frequency);

    noise.connect(filter).connect(this.windGain).connect(this.master);
    noise.start(0);
    lfo.start(0);
  }

  _blip({ freq = 440, type = "sine", duration = 0.12, gain = 0.18, sweep = 0 }) {
    if (!this.ctx || this.muted) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const env = this.ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, now);
    if (sweep) osc.frequency.exponentialRampToValueAtTime(freq + sweep, now + duration);
    env.gain.setValueAtTime(0.0001, now);
    env.gain.exponentialRampToValueAtTime(gain, now + 0.01);
    env.gain.exponentialRampToValueAtTime(0.0001, now + duration);
    osc.connect(env).connect(this.master);
    osc.start(now);
    osc.stop(now + duration + 0.02);
  }

  footstep(biome = "grove") {
    // Surface-tinted: soft thud on grass, sharper tick on stone.
    const stone = biome === "temple" || biome === "overlook";
    this._blip({
      freq: stone ? 180 : 110,
      type: stone ? "square" : "triangle",
      duration: 0.07,
      gain: 0.05,
      sweep: -40,
    });
  }

  collect() {
    this._blip({ freq: 660, type: "sine", duration: 0.14, gain: 0.14, sweep: 520 });
  }

  discover() {
    this._blip({ freq: 392, type: "sine", duration: 0.18, gain: 0.14 });
    setTimeout(() => this._blip({ freq: 587, type: "sine", duration: 0.22, gain: 0.13 }), 90);
  }

  interact() {
    this._blip({ freq: 330, type: "triangle", duration: 0.1, gain: 0.12, sweep: 120 });
  }

  jump() {
    this._blip({ freq: 300, type: "sine", duration: 0.12, gain: 0.08, sweep: 300 });
  }

  setMuted(muted) {
    this.muted = muted;
    if (this.master && this.ctx) {
      this.master.gain.setTargetAtTime(muted ? 0 : 0.5, this.ctx.currentTime, 0.05);
    }
  }
}

export const gameAudio = new GameAudio();
