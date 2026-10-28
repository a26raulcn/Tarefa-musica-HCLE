const {test} = require('node:test');
const assert = require('node:assert/strict');
const {LayerPlayer,makeDemo} = require('../dist/audio.js');
class Buffer {
  constructor(channels,length,rate) { this.numberOfChannels=channels; this.length=length; this.sampleRate=rate; this.duration=length/rate; this.data=Array.from({length:channels},()=>new Float32Array(length)); }
  getChannelData(i) { return this.data[i]; }
  copyToChannel(data,i) { this.data[i].set(data); }
}
class Context {
  constructor() { this.currentTime=0; this.destination={}; this.started=[]; }
  createBuffer(...args) { return new Buffer(...args); }
  createGain() { return {connect(){},gain:{value:1,setTargetAtTime(value){this.value=value;}}}; }
  createDynamicsCompressor() { return {connect(){},threshold:{value:0},ratio:{value:0}}; }
  createBufferSource() { const source={connect(){},disconnect(){},stop(){this.stopped=true;},start(at,offset){this.at=at;this.offset=offset;}};this.started.push(source);return source; }
  async resume() {}
}
global.AudioContext=Context;
test('original demo has four distinct, finite, non-silent tracks of equal length',()=>{
  const buffers=makeDemo(new Context());
  assert.equal(buffers.length,4);
  const peaks=buffers.map(b=>{ assert.equal(b.duration,20);let peak=0;for(const s of b.data[0]){assert.ok(Number.isFinite(s));peak=Math.max(peak,Math.abs(s));}assert.ok(peak>.05&&peak<1);return peak;});
  assert.equal(new Set(peaks).size,4);
});
test('all tracks start and resume on the exact same audio clock',async()=>{
  const p=new LayerPlayer(); await p.play();
  assert.equal(p.sources.length,4);assert.equal(new Set(p.sources.map(s=>s.at)).size,1);
  p.context.currentTime=3.025;assert.ok(Math.abs(p.position-3)<1e-8);
  p.pause();assert.equal(p.playing,false);assert.equal(p.sources.length,0);
  await p.play();assert.ok(p.sources.every(s=>Math.abs(s.offset-3)<1e-8));
  assert.equal(new Set(p.sources.map(s=>s.at)).size,1);
});
test('muting and solo change gain without restarting any source',async()=>{
  const p=new LayerPlayer();await p.play();const sources=p.sources.slice();
  p.enabled[0]=false;p.updateGains();assert.equal(p.gains[0].gain.value,0);
  p.solo=2;p.updateGains();assert.equal(p.gains[2].gain.value,p.volumes[2]);assert.equal(p.gains[1].gain.value,0);
  assert.deepEqual(p.sources,sources);
});
test('seeking and restart preserve synchronized offsets',async()=>{
  const p=new LayerPlayer();await p.play();p.seek(8);
  assert.ok(p.sources.every(s=>s.offset===8));assert.equal(new Set(p.sources.map(s=>s.at)).size,1);
  p.restart();assert.ok(p.sources.every(s=>s.offset===0));
});
test('end of playback stops all sources and play starts again from zero',async()=>{
  const p=new LayerPlayer();await p.play();p.context.currentTime=21;
  assert.equal(p.tick(),true);assert.equal(p.playing,false);assert.equal(p.position,20);
  await p.play();assert.ok(p.sources.every(s=>s.offset===0));
});
test('loop pads short imports and uses one common boundary',async()=>{
  const p=new LayerPlayer();await p.ensureDemo();p.buffers[1]=p.context.createBuffer(1,22050,22050);
  p.loop=true;await p.play();assert.equal(p.sources.length,4);
  assert.ok(p.sources.every(s=>s.loop&&s.loopEnd===20&&s.buffer.duration===20));
  p.context.currentTime=23.025;assert.ok(Math.abs(p.position-3)<1e-8);
});
test('shorter files do not restart after seeking beyond their end',async()=>{
  const p=new LayerPlayer();await p.ensureDemo();p.buffers[0]=p.context.createBuffer(1,22050,22050);
  await p.play();p.seek(5);assert.equal(p.sources.length,3);assert.ok(p.sources.every(s=>s.offset===5));
});
