/* Four independent buffers share a single Web Audio clock. No network required. */
'use strict';
class LayerPlayer {
  constructor() {
    this.context = null; this.buffers = []; this.sources = []; this.gains = [];
    this.volumes = [0.8, 0.7, 0.8, 0.65]; this.enabled = [true, true, true, true];
    this.solo = -1; this.offset = 0; this.startedAt = 0; this.playing = false;
    this.loop = false; this.demoPromise = null; this.demoBuffers = null;
  }
  get duration() { return this.buffers.length ? Math.max(...this.buffers.map(b => b.duration)) : 20; }
  get position() {
    if (!this.playing) return this.offset;
    const elapsed = this.offset + Math.max(0, this.context.currentTime - this.startedAt);
    return this.loop ? elapsed % this.duration : Math.min(elapsed, this.duration);
  }
  init() {
    if (this.context) return;
    const Context = globalThis.AudioContext || globalThis.webkitAudioContext;
    if (!Context) throw new Error('Este navegador não suporta áudio Web. Experimenta um navegador atualizado.');
    this.context = new Context();
    const master = this.context.createGain(); master.gain.value = 0.75;
    const limiter = this.context.createDynamicsCompressor();
    limiter.threshold.value = -8; limiter.ratio.value = 10;
    master.connect(limiter); limiter.connect(this.context.destination);
    this.gains = this.volumes.map(() => { const g = this.context.createGain(); g.connect(master); return g; });
    this.updateGains();
  }
  async ensureDemo() {
    this.init();
    if (!this.demoPromise) this.demoPromise = Promise.resolve().then(() => {
      this.demoBuffers = makeDemo(this.context);
      if (!this.buffers.length) this.buffers = this.demoBuffers.slice();
    }).catch(error => { this.demoPromise = null; throw error; });
    await this.demoPromise;
  }
  isAudible(i) { return this.enabled[i] && (this.solo < 0 || this.solo === i); }
  updateGains() {
    this.gains.forEach((gain, i) => gain.gain.setTargetAtTime(this.isAudible(i) ? this.volumes[i] : 0, this.context.currentTime, 0.012));
  }
  stopSources() {
    this.sources.forEach(source => { try { source.stop(); } catch {} source.disconnect(); });
    this.sources = [];
  }
  startAt(offset) {
    this.stopSources();
    this.offset = offset >= this.duration ? 0 : Math.max(0, offset);
    // Schedule every track for the exact same instant, including after seeking.
    this.startedAt = this.context.currentTime + 0.025;
    this.buffers.forEach((original, i) => {
      let buffer = original;
      // Pad shorter imported tracks with silence so all loop boundaries match.
      if (this.loop && original.duration < this.duration - 0.001) {
        buffer = this.context.createBuffer(original.numberOfChannels, Math.ceil(this.duration * original.sampleRate), original.sampleRate);
        for (let channel = 0; channel < original.numberOfChannels; channel++) buffer.copyToChannel(original.getChannelData(channel), channel);
      }
      if (this.offset >= buffer.duration) return;
      const source = this.context.createBufferSource(); source.buffer = buffer;
      source.loop = this.loop; source.loopEnd = this.duration; source.connect(this.gains[i]);
      source.start(this.startedAt, this.offset); this.sources.push(source);
    });
    this.playing = true;
  }
  async play() { await this.ensureDemo(); await this.context.resume(); this.startAt(this.position); }
  pause() { this.offset = this.position; this.stopSources(); this.playing = false; }
  seek(time) { const position = Math.max(0, Math.min(time, this.duration)); if (this.playing) this.startAt(position); else this.offset = position; }
  restart() { this.seek(0); }
  setLoop(value) { const position = this.position; this.loop = value; if (this.playing) this.startAt(position); }
  tick() {
    if (this.playing && !this.loop && this.position >= this.duration) {
      this.stopSources(); this.offset = this.duration; this.playing = false; return true;
    }
    return false;
  }
}

function makeDemo(context) {
  // Original eight-bar phrase in C major, 96 BPM; independent piano, guitar,
  // bass and drums, rendered locally into four mono buffers.
  const rate = 22050, beat = 60 / 96, duration = beat * 32;
  const arrays = Array.from({length: 4}, () => new Float32Array(Math.ceil(rate * duration)));
  const frequency = midi => 440 * 2 ** ((midi - 69) / 12);
  let seed = 117;
  const noise = () => { seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; return seed / 2147483648 - 1; };
  function note(track, midi, time, length, amplitude) {
    const data = arrays[track], start = Math.round(time * rate), n = Math.min(Math.round(length * rate), data.length - start), f = frequency(midi);
    for (let k = 0; k < n; k++) {
      const t = k / rate, phase = 2 * Math.PI * f * t;
      const attack = Math.min(1, t / 0.008), release = Math.min(1, (n - k) / (rate * 0.06));
      let tone;
      if (track === 0) tone = (Math.sin(phase) + .35 * Math.sin(phase * 2) + .12 * Math.sin(phase * 3)) * Math.exp(-t * 2.6);
      else if (track === 1) tone = (Math.sin(phase) + .4 * Math.sin(phase * 2) + .23 * Math.sin(phase * 3) + .1 * Math.sin(phase * 5)) * Math.exp(-t * 5);
      else tone = (Math.sin(phase) + .18 * Math.sin(phase * 2)) * Math.exp(-t * 1.6);
      data[start + k] += tone * amplitude * attack * release;
    }
  }
  const chords = [[48,52,55],[45,48,52],[41,45,48],[43,47,50],[48,52,55],[45,48,52],[41,45,48],[43,47,50]];
  const melody = [[72,76,79,76],[72,76,81,79],[77,76,72,69],[71,74,79,74],[76,79,84,83],[81,79,76,72],[77,81,79,77],[74,71,72,72]];
  chords.forEach((chord, bar) => {
    melody[bar].forEach((midi, b) => note(0, midi, (bar * 4 + b) * beat, beat * 1.35, .22));
    for (let b = 0; b < 8; b++) note(1, chord[b % 3] + 12, (bar * 4 + b / 2) * beat, beat * .9, .15);
    for (let b = 0; b < 4; b++) note(2, chord[0] - 12 + (b === 2 ? 7 : 0), (bar * 4 + b) * beat, beat * .85, .29);
  });
  function drum(time, type) {
    const start = Math.round(time * rate), length = type === 'kick' ? .3 : type === 'snare' ? .18 : .07;
    for (let k = 0; k < length * rate && start + k < arrays[3].length; k++) {
      const t = k / rate; let value;
      if (type === 'kick') value = Math.sin(2 * Math.PI * (48 * t + 7 * (1 - Math.exp(-t * 30)))) * Math.exp(-t * 17) * .48;
      else if (type === 'snare') value = (noise() * .75 + Math.sin(2 * Math.PI * 180 * t) * .25) * Math.exp(-t * 25) * .32;
      else value = noise() * Math.exp(-t * 75) * .1;
      arrays[3][start + k] += value * Math.min(1, k / 20);
    }
  }
  for (let b = 0; b < 32; b++) { drum(b * beat, b % 2 === 0 ? 'kick' : 'snare'); drum(b * beat, 'hat'); drum((b + .5) * beat, 'hat'); }
  return arrays.map(data => { const buffer = context.createBuffer(1, data.length, rate); buffer.copyToChannel(data, 0); return buffer; });
}
if (typeof module !== 'undefined') module.exports = { LayerPlayer, makeDemo };
