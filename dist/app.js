'use strict';
const $ = selector => document.querySelector(selector);
const player = new LayerPlayer();
const definitions = [
  {name:'Piano',role:'A melodia que fica no ouvido.',color:'#d9ccee',note:'melodia',art:`<g transform="translate(19 17) rotate(-8 65 50)"><path d="M15 23Q18 12 36 12H128Q140 12 140 26V92H15Z" fill="#393044"/><path d="M15 59H140V92H15Z" fill="#fff9e9" stroke="#393044" stroke-width="3"/><path d="M15 59V92M33 59V92M51 59V92M69 59V92M87 59V92M105 59V92M123 59V92" stroke="#393044" stroke-width="2"/><path d="M29 59V79M47 59V79M83 59V79M101 59V79M119 59V79" stroke="#393044" stroke-width="9"/><path d="M24 92V107M130 92V107" stroke="#393044" stroke-width="6"/><path d="M28 34H121" stroke="#a995bf" stroke-width="2"/><circle cx="27" cy="46" r="2" fill="#f4c67c"/></g><path d="M25 30V15L35 12V25M25 28Q16 25 17 32Q22 38 25 30M35 23Q27 20 27 27Q32 32 35 23" fill="#8a6baf"/>`},
  {name:'Guitarra',role:'Os acordes que dão cor.',color:'#efc6b4',note:'harmonia',art:`<g transform="rotate(34 90 70)"><path d="M87 49C51 37 45 65 57 76C25 108 71 137 94 115C112 99 108 87 98 76C114 54 103 40 87 49Z" fill="#b85b39" stroke="#543446" stroke-width="3"/><path d="M84 45V14H96V51" fill="#744850" stroke="#543446" stroke-width="2"/><path d="M81 17V3H98V18Z" fill="#543446"/><path d="M81 6H76M98 6H103M81 13H76M98 13H103" stroke="#543446" stroke-width="3"/><circle cx="82" cy="80" r="11" fill="#362c3f" stroke="#ecc798" stroke-width="3"/><path d="M68 104H90" stroke="#362c3f" stroke-width="6"/><path d="M85 15L77 104M88 15L81 104M91 15L85 104" stroke="#f4dbaf" stroke-width=".8"/></g><path d="M135 43V25L147 22V37" fill="none" stroke="#b45c41" stroke-width="2"/><ellipse cx="131" cy="44" rx="5" ry="3" fill="#b45c41"/><ellipse cx="143" cy="38" rx="5" ry="3" fill="#b45c41"/>`},
  {name:'Baixo',role:'A base que se sente.',color:'#c9dfd3',note:'profundidade',art:`<g transform="rotate(29 90 70)"><path d="M80 67Q65 46 58 62Q48 75 57 86Q41 105 58 119Q75 134 93 119Q107 104 95 85Q108 61 97 53L90 72Z" fill="#4c7567" stroke="#2e4141" stroke-width="3"/><path d="M80 73L84 12H94L90 75" fill="#c39a69" stroke="#2e4141" stroke-width="2"/><path d="M83 15L84 2H98L94 17Z" fill="#2e4141"/><path d="M84 5H78M95 8H102M83 12H78M94 14H101" stroke="#2e4141" stroke-width="3"/><path d="M68 99H89M66 109H87" stroke="#253a37" stroke-width="5"/><path d="M85 12L71 111M88 12L75 111M91 12L79 111M94 12L83 111" stroke="#f3d6a6" stroke-width=".8"/><circle cx="92" cy="105" r="2" fill="#e5c18c"/><circle cx="91" cy="113" r="2" fill="#e5c18c"/></g><path d="M132 48Q151 60 132 73M140 40Q165 60 140 82" fill="none" stroke="#719b82" stroke-width="2"/>`},
  {name:'Bateria',role:'O pulso que põe tudo a mexer.',color:'#f1d98f',note:'ritmo',art:`<path d="M35 45V112M20 119L35 111L49 119M130 50V112M116 120L130 111L144 120" fill="none" stroke="#66524c" stroke-width="3"/><ellipse cx="35" cy="43" rx="26" ry="6" fill="#c49b4e" stroke="#6c5343" stroke-width="2"/><ellipse cx="130" cy="48" rx="25" ry="6" fill="#c49b4e" stroke="#6c5343" stroke-width="2"/><path d="M35 43V35M130 49V40" stroke="#66524c" stroke-width="3"/><path d="M47 58H77V80H47ZM91 54H120V77H91Z" fill="#b85e47" stroke="#59434b" stroke-width="2"/><ellipse cx="62" cy="58" rx="15" ry="5" fill="#f9eed2" stroke="#59434b" stroke-width="2"/><ellipse cx="106" cy="54" rx="15" ry="5" fill="#f9eed2" stroke="#59434b" stroke-width="2"/><circle cx="82" cy="100" r="28" fill="#bd654d" stroke="#59434b" stroke-width="3"/><circle cx="82" cy="100" r="22" fill="#fff1d3" stroke="#59434b" stroke-width="2"/><circle cx="82" cy="100" r="7" fill="#59434b"/><path d="M62 118L57 131M102 118L107 131M66 29L91 47M96 25L77 49" stroke="#59434b" stroke-width="3" stroke-linecap="round"/>`}
];
const extraInstruments = {
  cordas:{name:'Cordas',role:'Um conjunto de sons para descobrir.',note:'cordas',art:`<g transform="rotate(28 90 70)"><path d="M81 9V67H92V9Z" fill="#bf9265" stroke="#3b4140" stroke-width="3"/><path d="M81 8H94V20H81Z" fill="#3b4140"/><path d="M82 58Q60 49 58 67Q58 76 69 81Q48 95 60 114Q78 136 99 114Q112 96 92 81Q103 75 102 66Q98 49 89 58" fill="#b27642" stroke="#3b4140" stroke-width="3"/><path d="M70 88Q62 94 68 101M94 88Q101 94 95 101" fill="none" stroke="#3b4140" stroke-width="2"/><path d="M84 12V116M88 12V116" stroke="#f9e9c8" stroke-width="1"/><path d="M75 112H93" stroke="#3b4140" stroke-width="5"/><path d="M120 18L119 123M125 18L124 123" stroke="#4c6657" stroke-width="3"/></g><path d="M37 42Q24 59 37 74M28 35Q9 59 28 82" fill="none" stroke="#719b82" stroke-width="2"/>`},
  saxo:{name:'Saxofone',role:'O sopro que faz a música ganhar vida.',note:'sopro',art:`<g transform="rotate(-12 90 75)"><path d="M93 25H116V37H105V91Q104 125 79 125Q53 125 53 101V79H70V101Q70 111 79 111Q88 111 88 98V39Q88 29 93 25Z" fill="#c9973e" stroke="#59434b" stroke-width="3"/><path d="M42 63L78 63L71 82H53Z" fill="#dfaf50" stroke="#59434b" stroke-width="3"/><ellipse cx="60" cy="63" rx="18" ry="6" fill="#59434b" stroke="#dfaf50" stroke-width="3"/><path d="M96 39V94" stroke="#fff0c2" stroke-width="2"/><g fill="#f7e4ab" stroke="#59434b" stroke-width="1.5"><circle cx="100" cy="50" r="4"/><circle cx="100" cy="64" r="4"/><circle cx="100" cy="78" r="4"/><circle cx="99" cy="91" r="4"/></g><path d="M114 25H129V32H115" fill="#59434b"/></g><path d="M137 57V40L148 37V52" fill="none" stroke="#a98233" stroke-width="2"/><ellipse cx="133" cy="58" rx="5" ry="3" fill="#a98233"/><ellipse cx="144" cy="53" rx="5" ry="3" fill="#a98233"/>`},
  custom:{name:'Instrumento',role:'Ouve esta faixa e descobre o seu papel.',note:'à escuta',art:`<circle cx="90" cy="74" r="48" fill="none" stroke="#59434b" stroke-width="3"/><path d="M62 68V80M76 50V98M90 40V108M104 55V93M118 66V82" stroke="#59434b" stroke-width="6" stroke-linecap="round"/>`}
};
let busy = false, custom = [false,false,false,false], challengeIndex = 0;
const challenges = [
  () => 'Silencia um instrumento. O que muda na música quando ele desaparece?',
  () => `Ouve só ${nameOf(2)}. Consegues reconhecer o seu som de olhos fechados?`,
  () => `Junta ${nameOf(0)} e ${nameOf(1)}. Como se combinam os dois sons?`,
  () => 'Baixa o volume de três instrumentos e deixa o quarto destacar-se.',
  () => 'Fecha os olhos e tenta reconhecer cada instrumento antes de olhar.'
];
function setBusy(value) {
  busy = value;
  $('#play').disabled = value;
  document.querySelectorAll('input[type="file"]').forEach(input => { input.disabled = value; });
  $('#restore-demo').disabled = value;
  $('#tracks').setAttribute('aria-busy',String(value));
}
function showChallenge() { $('#challenge').textContent = challenges[challengeIndex](); }
function setInstrument(i, info) {
  const instrument = definitions.find(d => d.name.toLowerCase() === info.key) || extraInstruments[info.key] || extraInstruments.custom;
  const card = $(`[data-track="${i}"]`);
  $(`#name-${i}`).value = info.name;
  card.querySelector('.track-role').textContent = instrument.role;
  card.querySelector('.art-note').textContent = instrument.note;
  const art = card.querySelector('svg');
  art.innerHTML = instrument.art;
  art.setAttribute('aria-label',`Ilustração de ${instrument.name.toLowerCase()}`);
}
function tell(text, error = false) { $('#message').textContent = text; $('#message').classList.toggle('error', error); }
function time(seconds) { return `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2,'0')}`; }
function nameOf(i) { return $(`#name-${i}`).value.trim() || definitions[i].name; }
function drawCards() {
  $('#tracks').innerHTML = definitions.map((d,i) => `<article class="track" style="--track-color:${d.color}" data-track="${i}" aria-label="Faixa ${i+1}">
    <div class="track-art"><span class="track-number">0${i+1}</span><svg viewBox="0 0 180 145" role="img" aria-label="Ilustração de ${d.name.toLowerCase()}">${d.art}</svg><span class="art-note">${d.note}</span></div>
    <div class="track-body"><div class="track-title-row"><label class="sr-only" for="name-${i}">Nome do instrumento da faixa ${i+1}</label><input class="track-name" id="name-${i}" value="${d.name}" maxlength="32" title="Podes mudar o nome do instrumento"><button class="toggle" data-toggle="${i}" aria-label="Ativar som de ${d.name}" aria-pressed="true"><span></span></button></div>
    <p class="track-role">${d.role}</p><div class="waveform" aria-hidden="true">${Array.from({length:31},(_,n)=>`<i style="--h:${5+((n*17+i*11)%23)}px;--delay:${(n%7)*-.13}s"></i>`).join('')}</div>
    <div class="volume-row"><span aria-hidden="true">◖</span><label class="sr-only" for="volume-${i}">Volume de ${d.name}</label><input type="range" id="volume-${i}" data-volume="${i}" min="0" max="100" value="${Math.round(player.volumes[i]*100)}"><output for="volume-${i}" id="volume-value-${i}">${Math.round(player.volumes[i]*100)}%</output></div>
    <div class="track-actions"><button class="solo-button" data-solo="${i}" aria-pressed="false">Ouvir só este</button><label class="file-label">Carregar faixa ↗<input class="file-input" type="file" data-file="${i}" aria-label="Carregar faixa para ${d.name}" accept="audio/*,.mp3,.wav,.ogg,.m4a,.flac"></label></div><p class="file-name" id="file-${i}">Composição de demonstração</p></div></article>`).join('');
}
function update() {
  let count = 0;
  definitions.forEach((d,i) => {
    const audible = player.isAudible(i) && player.volumes[i] > 0;
    if (audible) count++;
    $(`[data-track="${i}"]`).classList.toggle('muted', !audible);
    $(`[data-toggle="${i}"]`).setAttribute('aria-pressed',String(player.enabled[i]));
    $(`[data-toggle="${i}"]`).setAttribute('aria-label',`Ativar som de ${nameOf(i)}`);
    $(`#volume-${i}`).setAttribute('aria-label',`Volume de ${nameOf(i)}`);
    $(`[data-file="${i}"]`).setAttribute('aria-label',`Carregar faixa para ${nameOf(i)}`);
    const solo = $(`[data-solo="${i}"]`);
    solo.setAttribute('aria-pressed',String(player.solo === i));
    solo.setAttribute('aria-label',`${player.solo === i ? 'Sair do modo a solo de' : 'Ouvir apenas'} ${nameOf(i)}`);
    solo.textContent = player.solo === i ? 'Voltar ao conjunto' : 'Ouvir só este';
  });
  $('#active-count').textContent = `${count} de 4 ${player.playing ? 'a soar' : 'ativos'}`;
  $('#play-icon').textContent = player.playing ? 'Ⅱ' : '▶';
  $('#play').setAttribute('aria-label',player.playing ? 'Pausar todas as faixas' : 'Reproduzir todas as faixas');
  $('#player-status').textContent = player.playing ? (count ? 'A descobrir cada camada' : 'Todos os instrumentos em silêncio') : player.position >= player.duration ? 'Chegámos ao fim. Vamos repetir?' : player.position > 0 ? 'Em pausa. Continua quando quiseres.' : 'Tudo pronto para ouvir';
  document.body.classList.toggle('is-playing',player.playing);
  $('#loop').setAttribute('aria-pressed',String(player.loop));
  $('#duration').textContent = time(player.duration); $('#seek').max = player.duration;
  player.updateGains();
}
async function togglePlay() {
  if (busy) return;
  if (player.playing) { player.pause(); update(); return; }
  setBusy(true); $('#player-status').textContent = 'A preparar os instrumentos…';
  try { await player.play(); tell(''); } catch (error) { tell(`Não foi possível reproduzir o áudio. ${error.message}`, true); }
  finally { setBusy(false); update(); }
}
function resetMix() {
  player.enabled.fill(true); player.solo = -1; player.volumes = [.8,.7,.8,.65];
  player.volumes.forEach((v,i) => { $(`#volume-${i}`).value = v*100; $(`#volume-value-${i}`).textContent = `${Math.round(v*100)}%`; });
  update(); tell('Mistura reposta. Os quatro instrumentos estão ativos.');
}
function updateSession() {
  const count = custom.filter(Boolean).length;
  $('#session-title').textContent = count ? 'A tua música' : 'Pequeno encontro';
  $('#session-tag').textContent = count === 4 ? '4 FAIXAS IMPORTADAS' : count ? `${count}/4 FAIXAS IMPORTADAS · MISTURA COM DEMO` : 'DEMONSTRAÇÃO ORIGINAL';
  $('#source-note').textContent = count === 4 ? 'As quatro faixas estão prontas. Prime reproduzir para as ouvir em conjunto. Podes substituir qualquer uma nos cartões.' : count ? `Já importaste ${count} de 4 faixas. As restantes ainda são de demonstração. Importa as quatro para ouvir a tua música.` : 'Importa as tuas quatro faixas para começar ou experimenta primeiro a música de demonstração.';
  showChallenge();
}
async function importTracks(input, singleSlot) {
  if (!input.files.length || busy) { input.value = ''; return; }
  let plan;
  try { plan = planImports(input.files,singleSlot); }
  catch(error) { tell(error.message,true); input.value = ''; return; }
  setBusy(true);
  if (player.playing) player.pause();
  update(); tell(plan.length === 4 ? 'A importar as quatro faixas…' : `A importar «${plan[0].file.name}»…`);
  try {
    await player.ensureDemo();
    // Commit only after every file decodes; failures keep the previous mix intact.
    const decoded = await decodeImports(player.context,plan);
    for (const {index:i,buffer,file,info} of decoded) {
      player.buffers[i] = buffer; custom[i] = true;
      setInstrument(i,info);
      $(`#file-${i}`).textContent = file.name; $(`#file-${i}`).title = file.name;
    }
    player.offset = 0; player.enabled.fill(true); player.solo = -1;
    updateSession(); update();
    tell(decoded.length === 4 ? 'Quatro faixas importadas. Prime reproduzir para as ouvir em simultâneo.' : 'Faixa importada. A reprodução volta ao início para manter a sincronização.');
  } catch(error) { tell(`${error.message} A mistura anterior foi mantida.`,true); }
  finally { setBusy(false); input.value = ''; }
}
drawCards(); update();
$('#tracks').addEventListener('click', event => {
  const toggle = event.target.closest('[data-toggle]'), solo = event.target.closest('[data-solo]');
  if (toggle) { const i = +toggle.dataset.toggle; player.enabled[i] = !player.enabled[i]; if (!player.enabled[i] && player.solo === i) player.solo = -1; update(); }
  if (solo) { const i = +solo.dataset.solo; player.solo = player.solo === i ? -1 : i; player.enabled[i] = true; update(); }
});
$('#tracks').addEventListener('input', event => {
  const i = event.target.dataset.volume;
  if (i !== undefined) { player.volumes[+i] = +event.target.value / 100; $(`#volume-value-${i}`).textContent = `${event.target.value}%`; update(); }
  if (event.target.classList.contains('track-name')) { update(); showChallenge(); }
});
$('#tracks').addEventListener('change',event => { if (event.target.dataset.file !== undefined) importTracks(event.target,+event.target.dataset.file); });
$('#import-all').addEventListener('change',event => importTracks(event.target));
$('#play').addEventListener('click',togglePlay);
$('#restart').addEventListener('click',() => { if (!busy) { player.restart(); update(); } });
$('#loop').addEventListener('click',() => { player.setLoop(!player.loop); update(); });
$('#seek').addEventListener('input',event => { player.seek(+event.target.value); update(); });
$('#reset-mix').addEventListener('click',resetMix);
$('#next-challenge').addEventListener('click',() => { challengeIndex = (challengeIndex + 1) % challenges.length; showChallenge(); });
$('#restore-demo').addEventListener('click',async () => {
  if (busy) return;
  setBusy(true);
  try {
    player.pause(); await player.ensureDemo(); player.buffers = player.demoBuffers.slice(); player.offset = 0; custom.fill(false);
    definitions.forEach((d,i) => { setInstrument(i,{key:d.name.toLowerCase(),name:d.name}); $(`#file-${i}`).textContent = 'Composição de demonstração'; $(`#file-${i}`).title = ''; });
    updateSession(); resetMix(); tell('Demonstração original restaurada.');
  } catch(error) { tell(error.message,true); }
  finally { setBusy(false); update(); }
});
document.addEventListener('keydown',event => {
  if (event.repeat || event.altKey || event.ctrlKey || event.metaKey || event.target.closest('input,button,a,textarea,select,summary,[contenteditable]')) return;
  if (event.code === 'Space') { event.preventDefault(); togglePlay(); }
  if (event.key.toLowerCase() === 'r' && !busy) { player.restart(); update(); }
});
function tick() {
  if (player.tick()) update();
  const position = player.position;
  if (document.activeElement !== $('#seek')) $('#seek').value = position;
  $('#current-time').textContent = time(position);
  $('#seek').setAttribute('aria-valuetext',`${Math.floor(position/60)} minutos, ${Math.floor(position%60)} segundos`);
  requestAnimationFrame(tick);
}
requestAnimationFrame(tick);
