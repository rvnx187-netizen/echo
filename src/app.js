const DEMO_MESSAGES = [
  'você não precisa ter tudo resolvido hoje.', 'a sua presença faz diferença.',
  'que alguma coisa bonita te encontre sem avisar.', 'respira. você chegou até aqui.',
  'há mais gentileza no mundo do que parece.', 'um passo pequeno ainda é movimento.'
];
const MAX = 280;
const field = document.querySelector('#message-field');
const emptyState = document.querySelector('#empty-state');
const form = document.querySelector('#message-form');
const input = document.querySelector('#message-input');
const count = document.querySelector('#character-count');
const status = document.querySelector('#form-status');
const send = document.querySelector('#send-button');
const motionToggle = document.querySelector('#motion-toggle');
const audioToggle = document.querySelector('#audio-toggle');
const shareButton = document.querySelector('#share-button');
const shareStatus = document.querySelector('#share-status');
let paused = false;
let audioContext;
let ambientNodes = [];

function addBubble(text, index) {
  const bubble = document.createElement('p');
  bubble.className = 'bubble';
  bubble.textContent = text;
  bubble.style.left = `${8 + (index * 23) % 78}%`;
  bubble.style.top = `${8 + (index * 31) % 67}%`;
  bubble.style.setProperty('--x', `${(index % 2 ? -1 : 1) * (8 + index * 2)}px`);
  bubble.style.setProperty('--y', `${(index % 3 - 1) * 13}px`);
  bubble.style.setProperty('--duration', `${7 + index % 4}s`);
  bubble.style.setProperty('--delay', `${-index * 1.2}s`);
  field.append(bubble);
}

function renderDemo() { DEMO_MESSAGES.forEach(addBubble); emptyState.hidden = true; }
function setStatus(message, error = false) { status.textContent = message; status.classList.toggle('error', error); }
function validMessage(value) {
  const text = value.trim();
  if (!text) return 'Escreva uma mensagem antes de enviar.';
  if (text.length > MAX) return `Sua mensagem passou do limite de ${MAX} caracteres.`;
  if ([...text].some(char => char.charCodeAt(0) < 32 && !'\n\t'.includes(char))) return 'Alguns caracteres não são permitidos.';
  if (/https?:\/\//i.test(text) || /www\./i.test(text)) return 'Links não são permitidos neste espaço.';
  return '';
}

input.addEventListener('input', () => { count.textContent = `${input.value.length} / ${MAX}`; if (status.classList.contains('error')) setStatus(''); });
motionToggle.addEventListener('click', () => { paused = !paused; field.querySelectorAll('.bubble').forEach(b => { b.style.animationPlayState = paused ? 'paused' : 'running'; }); motionToggle.textContent = paused ? 'Retomar movimento' : 'Pausar movimento'; motionToggle.setAttribute('aria-pressed', String(paused)); });
function toggleAmbient() {
  if (!audioContext) {
    audioContext = new AudioContext();
    const master = audioContext.createGain(); master.gain.value = 0.018; master.connect(audioContext.destination);
    [174.61, 261.63, 392].forEach((frequency, index) => { const oscillator = audioContext.createOscillator(); const gain = audioContext.createGain(); oscillator.type = 'sine'; oscillator.frequency.value = frequency; gain.gain.value = index === 0 ? 0.8 : 0.35; oscillator.connect(gain).connect(master); oscillator.start(); ambientNodes.push(oscillator, gain); });
  }
  if (audioContext.state === 'running') { audioContext.suspend(); audioToggle.innerHTML = '<span aria-hidden="true">◌</span> ouvir o universo'; audioToggle.setAttribute('aria-pressed', 'false'); }
  else { audioContext.resume(); audioToggle.innerHTML = '<span aria-hidden="true">◌</span> silenciar universo'; audioToggle.setAttribute('aria-pressed', 'true'); }
}
audioToggle.addEventListener('click', toggleAmbient);
shareButton.addEventListener('click', async () => { try { if (navigator.share) await navigator.share({ title: 'ECHO', text: 'deixe algo bom no universo', url: location.href }); else { await navigator.clipboard.writeText(location.href); shareStatus.textContent = 'Link copiado. Obrigado por espalhar este eco.'; } } catch { shareStatus.textContent = 'Tudo bem. O compartilhamento foi cancelado.'; } });
document.addEventListener('visibilitychange', () => { if (document.hidden) field.querySelectorAll('.bubble').forEach(b => { b.style.animationPlayState = 'paused'; }); else if (!paused) field.querySelectorAll('.bubble').forEach(b => { b.style.animationPlayState = 'running'; }); });
form.addEventListener('submit', async event => {
  event.preventDefault(); const error = validMessage(input.value); if (error) { setStatus(error, true); return; }
  send.disabled = true; setStatus('enviando para o universo...');
  await new Promise(resolve => setTimeout(resolve, 500));
  addBubble(input.value.trim(), field.children.length); input.value = ''; count.textContent = `0 / ${MAX}`; send.disabled = false;
  setStatus('Recebemos seu eco. No modo demonstração, ele fica apenas neste navegador.');
});
renderDemo();
