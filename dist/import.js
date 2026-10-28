'use strict';
const importInstruments = [
  {key:'piano',name:'Piano',slot:0,pattern:/piano|teclado/},
  {key:'guitarra',name:'Guitarra',slot:1,pattern:/guitarra|guitar|violao/},
  {key:'cordas',name:'Cordas',slot:2,pattern:/cordas|strings|violino|violin|violoncelo|cello/},
  {key:'saxo',name:'Saxofone',slot:3,pattern:/saxo|saxophone/},
  {key:'baixo',name:'Baixo',slot:2,pattern:/baixo|bass/},
  {key:'bateria',name:'Bateria',slot:3,pattern:/bateria|drums|percussao/}
];
function describeTrack(filename) {
  const stem = filename.replace(/\.[^.]+$/, '');
  const normalized = stem.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
  return importInstruments.find(info => info.pattern.test(normalized)) || {key:'custom',name:stem.slice(0,32)||'Instrumento',slot:-1};
}
function planImports(files, singleSlot) {
  const list = Array.from(files);
  if (singleSlot === undefined && list.length !== 4) throw new Error('Seleciona exatamente quatro ficheiros de áudio de uma só vez.');
  if (singleSlot !== undefined && (list.length !== 1 || !Number.isInteger(singleSlot) || singleSlot < 0 || singleSlot > 3)) throw new Error('Seleciona uma faixa para este instrumento.');
  const used = new Set();
  return list.map(file => {
    if (!file.size || file.size > 60*1024*1024) throw new Error(`«${file.name}»: escolhe um ficheiro com áudio e até 60 MB.`);
    const info = describeTrack(file.name);
    let index = singleSlot;
    if (index === undefined) {
      index = info.slot >= 0 && !used.has(info.slot) ? info.slot : -1;
      // Reserve recognizable slots even when an unknown file appears first.
      if (index < 0) {
        const reserved = new Set(list.map(f=>describeTrack(f.name).slot));
        index = [0,1,2,3].find(i=>!used.has(i)&&!reserved.has(i));
        if (index === undefined) index = [0,1,2,3].find(i=>!used.has(i));
      }
    }
    used.add(index);
    return {file,index,info};
  });
}
async function decodeImports(context, plan) {
  const decoded = [];
  for (const entry of plan) {
    let buffer;
    try { buffer = await context.decodeAudioData(await entry.file.arrayBuffer()); }
    catch { throw new Error(`Não foi possível ler «${entry.file.name}». Usa um ficheiro de áudio válido e compatível com o navegador.`); }
    if (!Number.isFinite(buffer.duration) || buffer.duration <= 0 || buffer.duration > 600) throw new Error(`«${entry.file.name}»: usa uma faixa com áudio e duração até 10 minutos.`);
    decoded.push({...entry,buffer});
  }
  return decoded;
}
if (typeof module !== 'undefined') module.exports = {describeTrack,planImports,decodeImports};
