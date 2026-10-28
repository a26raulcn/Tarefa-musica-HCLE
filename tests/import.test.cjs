const {test}=require('node:test');
const assert=require('node:assert/strict');
const {describeTrack,planImports,decodeImports}=require('../dist/import.js');
const file=(name,size=100)=>({name,size,arrayBuffer:async()=>new ArrayBuffer(8)});
test('the four exercise filenames map correctly regardless of selection order',()=>{
 const plan=planImports(['Niv7saxo.wav','Niv7cordas.wav','Niv7guitarra.wav','Niv7piano.wav'].map(n=>file(n)));
 assert.deepEqual(plan.map(p=>[p.index,p.info.name]),[[3,'Saxofone'],[2,'Cordas'],[1,'Guitarra'],[0,'Piano']]);
});
test('unknown names and duplicate instruments each receive a distinct slot',()=>{
 for(const names of [['voz.wav','piano.wav','guitarra.wav','saxo.wav'],['piano.wav','piano2.wav','piano3.wav','piano4.wav'],['A.wav','B.wav','C.wav','D.wav']]) {
  const plan=planImports(names.map(n=>file(n)));assert.equal(new Set(plan.map(p=>p.index)).size,4);assert.ok(plan.every(p=>p.index>=0&&p.index<=3));
 }
 assert.equal(describeTrack('Órgão pessoal.wav').name,'Órgão pessoal');
});
test('individual replacement respects the chosen card',()=>{
 const [entry]=planImports([file('Niv7saxo.wav')],0);assert.equal(entry.index,0);assert.equal(entry.info.name,'Saxofone');
});
test('invalid counts, empty and oversized files fail before decoding',()=>{
 assert.throws(()=>planImports([file('one.wav')]),/quatro/);
 assert.throws(()=>planImports([file('empty.wav',0)],1),/60 MB/);
 assert.throws(()=>planImports([file('large.wav',61*1024*1024)],1),/60 MB/);
});
test('decoding waits for every track and retains its instrument and destination',async()=>{
 const plan=planImports(['saxo.wav','piano.wav','cordas.wav','guitarra.wav'].map(n=>file(n)));
 let calls=0;
 const context={decodeAudioData:async()=>({duration:30,number:++calls})};
 const decoded=await decodeImports(context,plan);assert.equal(decoded.length,4);assert.equal(calls,4);assert.equal(decoded[0].info.name,'Saxofone');assert.equal(decoded[0].index,3);
});
test('corrupt or overlong audio rejects the whole batch without altering the plan',async()=>{
 const plan=planImports(['piano.wav','guitarra.wav','cordas.wav','saxo.wav'].map(n=>file(n)));
 let calls=0;
 await assert.rejects(decodeImports({decodeAudioData:async()=>{if(++calls===2) throw new Error('codec');return {duration:20};}},plan),/guitarra.wav/);
 assert.ok(plan.every(p=>!('buffer' in p)));
 await assert.rejects(decodeImports({decodeAudioData:async()=>({duration:601})},plan),/10 minutos/);
});
