// "My room": a small low-poly diorama built from primitives (no external models).
// Each interactive object opens one section of the CV. Lighting follows the
// real time of day in Rome; tapping the VR headset vibrates phones.
import * as THREE from 'three';

const ROME_TZ = 'Europe/Rome';
const HOME_TARGET = new THREE.Vector3(-0.1, 1.45, -0.9);
const easeInOut = t => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);

function romeTime() {
  const parts = new Intl.DateTimeFormat('en-GB', { timeZone: ROME_TZ, hour: '2-digit', minute: '2-digit', hour12: false })
    .formatToParts(new Date());
  const h = Number(parts.find(p => p.type === 'hour').value) % 24;
  const m = Number(parts.find(p => p.type === 'minute').value);
  const phase = h >= 8 && h < 17 ? 'day' : (h >= 6 && h < 8) || (h >= 17 && h < 20) ? 'dusk' : 'night';
  return { h, m, phase, label: `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}` };
}

/* ---------- Canvas textures ---------- */

function canvasTexture(w, h, draw) {
  const c = document.createElement('canvas');
  c.width = w; c.height = h;
  const ctx = c.getContext('2d');
  draw(ctx, w, h);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  return { tex, ctx, canvas: c };
}

// View from the window: Roman sky, umbrella pines and the Colosseum.
function drawSky(ctx, w, h, phase) {
  const skies = {
    day: ['#5fa8e8', '#bfe3ff'],
    dusk: ['#3b3f8f', '#ff9a5a'],
    night: ['#050914', '#16224a'],
  };
  const [top, bottom] = skies[phase];
  const g = ctx.createLinearGradient(0, 0, 0, h);
  g.addColorStop(0, top); g.addColorStop(1, bottom);
  ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
  if (phase === 'night') {
    ctx.fillStyle = '#fff';
    for (let i = 0; i < 70; i++) {
      ctx.globalAlpha = 0.3 + Math.random() * 0.7;
      ctx.fillRect(Math.random() * w, Math.random() * h * 0.6, 1.5, 1.5);
    }
    ctx.globalAlpha = 1;
    ctx.fillStyle = '#f4f1de';
    ctx.beginPath(); ctx.arc(w * 0.78, h * 0.2, 16, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = top;
    ctx.beginPath(); ctx.arc(w * 0.78 + 7, h * 0.2 - 4, 14, 0, Math.PI * 2); ctx.fill();
  } else {
    ctx.fillStyle = phase === 'day' ? '#fff6c8' : '#ffcf7a';
    ctx.beginPath(); ctx.arc(w * 0.2, phase === 'day' ? h * 0.2 : h * 0.55, 18, 0, Math.PI * 2); ctx.fill();
  }
  const stone = { day: '#c7a27a', dusk: '#7a4e48', night: '#1b1a2c' }[phase];
  const shade = { day: '#8d6b4f', dusk: '#4e3036', night: '#0e0d1a' }[phase];
  // Colosseum: three tiers of arches over a solid band.
  const x0 = w * 0.12, x1 = w * 0.88, base = h * 0.9, tier = h * 0.12;
  ctx.fillStyle = stone;
  ctx.fillRect(x0, base - tier * 3.3, x1 - x0, tier * 3.3);
  ctx.fillStyle = shade;
  for (let row = 0; row < 3; row++) {
    const y = base - tier * (row + 1) + tier * 0.15;
    for (let x = x0 + 8; x < x1 - 14; x += 18) {
      ctx.beginPath();
      ctx.moveTo(x, y + tier * 0.8);
      ctx.lineTo(x, y + 5);
      ctx.arc(x + 5, y + 5, 5, Math.PI, 0);
      ctx.lineTo(x + 10, y + tier * 0.8);
      ctx.fill();
    }
  }
  // Ruined top edge on the right.
  ctx.fillStyle = top;
  ctx.beginPath();
  ctx.moveTo(x1 - 70, base - tier * 3.3 - 1); ctx.lineTo(x1, base - tier * 2.2); ctx.lineTo(x1 + 1, base - tier * 3.3 - 1);
  ctx.fill();
  // Umbrella pines in front.
  const pine = { day: '#2f5a33', dusk: '#26303a', night: '#05070d' }[phase];
  ctx.fillStyle = pine;
  for (const [px, py, s] of [[w * 0.07, h * 0.62, 1], [w * 0.95, h * 0.58, 1.2]]) {
    ctx.fillRect(px - 2, py, 4 * s, h - py);
    ctx.beginPath(); ctx.ellipse(px, py, 34 * s, 12 * s, 0, 0, Math.PI * 2); ctx.fill();
  }
  ctx.fillStyle = shade;
  ctx.fillRect(0, base, w, h - base);
}

// Code that scrolls on the monitor.
const CODE = [
  ['#c792ea', '@Service'],
  ['#82aaff', 'public class CvRetriever {'],
  ['#e6edf3', '  private final VectorStore store;'],
  ['#e6edf3', ''],
  ['#82aaff', '  public Answer ask(String q) {'],
  ['#e6edf3', '    var hits = store.search(q, 4);'],
  ['#2dd4bf', '    return llm.answer(q, hits);'],
  ['#82aaff', '  }'],
  ['#82aaff', '}'],
  ['#e6edf3', ''],
  ['#5c6b7f', '// kafka -> incentives -> balance'],
  ['#82aaff', '@KafkaListener(topics = "transactions")'],
  ['#e6edf3', 'void on(Transaction tx) { ... }'],
  ['#e6edf3', ''],
  ['#5c6b7f', '# videorag: transcribe, embed, cite'],
  ['#f78c6c', 'segments = whisper.transcribe(video)'],
  ['#f78c6c', 'index.add(embed(segments))'],
  ['#e6edf3', ''],
];
function drawCode(ctx, w, h, offset) {
  ctx.fillStyle = '#0a0f16'; ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = '#121a25'; ctx.fillRect(0, 0, w, 26);
  ['#ff5f57', '#febc2e', '#28c840'].forEach((c, i) => {
    ctx.fillStyle = c; ctx.beginPath(); ctx.arc(16 + i * 16, 13, 5, 0, Math.PI * 2); ctx.fill();
  });
  ctx.font = '600 13px "JetBrains Mono", monospace';
  ctx.fillStyle = '#8b9bb0'; ctx.fillText('tridrik@rome: ~/portfolio', 70, 18);
  ctx.font = '15px "JetBrains Mono", monospace';
  const lineH = 20;
  for (let i = 0; i < 13; i++) {
    const [color, text] = CODE[(i + offset) % CODE.length];
    ctx.fillStyle = '#3a4757'; ctx.fillText(String(i + offset + 1).padStart(3, ' '), 8, 50 + i * lineH);
    ctx.fillStyle = color; ctx.fillText(text, 48, 50 + i * lineH);
  }
  if (Math.floor(performance.now() / 500) % 2) { ctx.fillStyle = '#2dd4bf'; ctx.fillRect(48, 50 + 12 * lineH - 13, 9, 16); }
}

// Career as a circuit: a bus from 2015 to now with a component per step.
const CAREER = [['2011', 'B.Tech ECE'], ['2015', 'QA · IBS'], ['2016', 'Ops · Tata'], ['2021', 'M.Sc · Padova'], ['2024', 'VR · Roma Tre'], ['2025', 'Dev · BARS']];
function drawCircuit(ctx, w, h, t) {
  ctx.fillStyle = '#0b3328'; ctx.fillRect(0, 0, w, h);
  ctx.strokeStyle = 'rgba(255,255,255,0.04)';
  for (let x = 0; x < w; x += 16) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke(); }
  const busY = h * 0.55, left = 40, right = w - 40, step = (right - left) / (CAREER.length - 1);
  ctx.lineWidth = 5; ctx.strokeStyle = '#c9a54a'; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(left, busY); ctx.lineTo(right, busY); ctx.stroke();
  ctx.lineWidth = 3;
  CAREER.forEach((_, i) => {
    const x = left + i * step, up = i % 2 === 0;
    ctx.beginPath(); ctx.moveTo(x, busY); ctx.lineTo(x, up ? busY - 70 : busY + 70); ctx.stroke();
  });
  // Travelling pulses.
  for (let k = 0; k < 3; k++) {
    const p = ((t * 0.00012 + k / 3) % 1);
    const x = left + p * (right - left);
    const g = ctx.createRadialGradient(x, busY, 0, x, busY, 22);
    g.addColorStop(0, 'rgba(94,255,226,1)'); g.addColorStop(1, 'rgba(94,255,226,0)');
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, busY, 22, 0, Math.PI * 2); ctx.fill();
  }
  CAREER.forEach(([year, label], i) => {
    const x = left + i * step, up = i % 2 === 0, y = up ? busY - 70 : busY + 70;
    const lit = (t * 0.00012) % 1 * (CAREER.length - 1) >= i - 0.15;
    ctx.fillStyle = '#111'; ctx.fillRect(x - 34, y - 16, 68, 32);
    ctx.strokeStyle = i === CAREER.length - 1 ? '#5effe2' : '#c9a54a'; ctx.lineWidth = 2; ctx.strokeRect(x - 34, y - 16, 68, 32);
    ctx.fillStyle = lit ? '#5effe2' : '#e9e3cf';
    ctx.font = '700 15px "JetBrains Mono", monospace'; ctx.textAlign = 'center';
    ctx.fillText(year, x, y + 5);
    ctx.font = '600 12px "JetBrains Mono", monospace'; ctx.fillStyle = '#e9e3cf';
    ctx.fillText(label, x, up ? y - 24 : y + 34);
    ctx.fillStyle = '#c9a54a'; ctx.beginPath(); ctx.arc(x, busY, 6, 0, Math.PI * 2); ctx.fill();
  });
  ctx.textAlign = 'start';
}

// Cork board with sticky notes.
function drawBoard(ctx, w, h) {
  ctx.fillStyle = '#a27a50'; ctx.fillRect(0, 0, w, h);
  for (let i = 0; i < 1800; i++) {
    ctx.fillStyle = Math.random() < 0.5 ? 'rgba(80,50,20,.18)' : 'rgba(255,230,190,.12)';
    ctx.fillRect(Math.random() * w, Math.random() * h, 2, 2);
  }
  const notes = [['Java', '#fde68a'], ['Spring Boot', '#99f6e4'], ['RAG', '#fbcfe8'], ['React', '#bae6fd'], ['Kafka', '#fde68a'], ['LLM agents', '#99f6e4'], ['Angular', '#bae6fd'], ['VR + haptics', '#fbcfe8']];
  notes.forEach(([text, color], i) => {
    const col = i % 4, row = Math.floor(i / 4);
    const x = 24 + col * 122, y = 26 + row * 160;
    ctx.save(); ctx.translate(x + 50, y + 55); ctx.rotate(((i * 37) % 11 - 5) * 0.012);
    ctx.fillStyle = 'rgba(0,0,0,.25)'; ctx.fillRect(-46, -46, 100, 104);
    ctx.fillStyle = color; ctx.fillRect(-50, -50, 100, 104);
    ctx.fillStyle = '#e11d48'; ctx.beginPath(); ctx.arc(0, -40, 6, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#1f2937'; ctx.font = '700 17px "Space Grotesk", sans-serif'; ctx.textAlign = 'center';
    const words = text.split(' ');
    words.forEach((wd, k) => ctx.fillText(wd, 0, 6 + k * 20 - (words.length - 1) * 8));
    ctx.restore();
  });
}

/* ---------- Scene ---------- */

export function initRoom(section) {
  const canvas = section.querySelector('.room-canvas');
  const tooltip = section.querySelector('.room-tooltip');
  const clock = section.querySelector('.room-clock');
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let needsRender = true;
  const labels = Object.fromEntries([...section.querySelectorAll('.hotspot')].map(b => [b.dataset.object, { label: b.textContent, target: b.dataset.target, btn: b }]));

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100);

  const mat = (color, extra = {}) => new THREE.MeshStandardMaterial({ color, roughness: 0.85, metalness: 0.02, flatShading: true, ...extra });
  const add = (parent, geo, material, x = 0, y = 0, z = 0) => {
    const m = new THREE.Mesh(geo, material);
    m.position.set(x, y, z); m.castShadow = true; m.receiveShadow = true;
    parent.add(m); return m;
  };
  const box = (parent, w, h, d, color, x, y, z, extra) => add(parent, new THREE.BoxGeometry(w, h, d), typeof color === 'string' ? mat(color, extra) : color, x, y, z);

  /* Room shell */
  box(scene, 8, 0.2, 8, '#3b2b20', 0, -0.1, 0);
  for (let i = -3.5; i <= 3.5; i += 1) box(scene, 0.02, 0.005, 8, '#2d2018', i, 0.003, 0);
  const wallMat = mat('#1d2836');
  box(scene, 8.2, 4.4, 0.2, wallMat, -0.1, 2.2, -4.1);
  box(scene, 0.2, 4.4, 8, wallMat, -4.1, 2.2, 0);
  box(scene, 8, 0.14, 0.04, '#2a3a4d', 0, 0.07, -3.98);
  box(scene, 0.04, 0.14, 8, '#2a3a4d', -3.98, 0.07, 0);
  add(scene, new THREE.CylinderGeometry(1.9, 1.9, 0.02, 40), mat('#123f3b'), 0.6, 0.01, -1.1);
  add(scene, new THREE.CylinderGeometry(1.5, 1.5, 0.025, 40), mat('#185a52'), 0.6, 0.012, -1.1);

  /* Desk */
  box(scene, 3.6, 0.12, 1.4, '#7a5a40', 0.6, 1.0, -3.25);
  for (const [x, z] of [[-1.1, -3.85], [2.3, -3.85], [-1.1, -2.65], [2.3, -2.65]]) box(scene, 0.1, 0.94, 0.1, '#4b3726', x, 0.47, z);
  box(scene, 0.9, 0.6, 1.2, '#6a4d36', 1.8, 0.62, -3.25);
  box(scene, 0.92, 0.04, 1.22, '#4b3726', 1.8, 0.62, -3.25);

  /* Chair, turned towards the room */
  const chair = new THREE.Group();
  chair.position.set(1.0, 0, -1.9); chair.rotation.y = -0.5;
  scene.add(chair);
  box(chair, 0.8, 0.1, 0.8, '#26384a', 0, 0.62, 0);
  box(chair, 0.8, 0.7, 0.1, '#26384a', 0, 1.0, 0.36);
  add(chair, new THREE.CylinderGeometry(0.05, 0.05, 0.55, 8), mat('#11161d'), 0, 0.32, 0);
  add(chair, new THREE.CylinderGeometry(0.4, 0.4, 0.05, 5), mat('#11161d'), 0, 0.05, 0);

  /* Keyboard + mug + floor lamp + plant */
  box(scene, 1.0, 0.04, 0.32, '#273241', 0.6, 1.08, -2.85);
  box(scene, 0.14, 0.04, 0.2, '#273241', 1.3, 1.08, -2.85);
  add(scene, new THREE.CylinderGeometry(0.08, 0.07, 0.18, 12), mat('#2dd4bf'), 1.55, 1.15, -3.55);
  add(scene, new THREE.CylinderGeometry(0.02, 0.02, 2.2, 6), mat('#11161d'), -3.4, 1.1, -3.4);
  add(scene, new THREE.CylinderGeometry(0.35, 0.35, 0.03, 16), mat('#11161d'), -3.4, 0.02, -3.4);
  const shade = add(scene, new THREE.ConeGeometry(0.35, 0.4, 16, 1, true), mat('#f3d9a8', { side: THREE.DoubleSide, emissive: '#ffb45e', emissiveIntensity: 0.2 }), -3.4, 2.25, -3.4);
  shade.castShadow = false;
  add(scene, new THREE.CylinderGeometry(0.28, 0.22, 0.5, 10), mat('#c8643b'), 3.3, 0.25, -3.3);
  for (const [x, y, z, s] of [[3.3, 0.85, -3.3, 0.42], [3.1, 1.15, -3.2, 0.3], [3.45, 1.2, -3.4, 0.28], [3.3, 1.45, -3.3, 0.24]]) {
    add(scene, new THREE.IcosahedronGeometry(s, 0), mat('#2f7d4f'), x, y, z);
  }

  /* ---------- Interactive objects ---------- */
  const objects = {};
  const register = (id, group, view, anchor) => {
    group.userData.id = id;
    objects[id] = { group, view, anchor, meshes: [] };
    group.traverse(o => {
      if (!o.isMesh) return;
      o.material = o.material.clone();
      objects[id].meshes.push(o);
    });
    scene.add(group);
  };

  // Monitor -> projects
  const monitor = new THREE.Group();
  box(monitor, 0.5, 0.04, 0.3, '#11161d', 0.6, 1.08, -3.5);
  box(monitor, 0.12, 0.4, 0.1, '#11161d', 0.6, 1.3, -3.55);
  box(monitor, 1.8, 1.05, 0.08, '#0d1218', 0.6, 1.95, -3.55);
  const screen = canvasTexture(512, 300, (ctx, w, h) => drawCode(ctx, w, h, 0));
  const screenMesh = new THREE.Mesh(new THREE.PlaneGeometry(1.68, 0.95), new THREE.MeshBasicMaterial({ map: screen.tex, toneMapped: false }));
  screenMesh.position.set(0.6, 1.95, -3.505);
  monitor.add(screenMesh);
  register('monitor', monitor, { pos: [0.6, 2.0, -1.15], look: [0.6, 1.9, -3.55] }, [0.6, 2.6, -3.55]);

  // VR headset -> research
  const headset = new THREE.Group();
  headset.position.set(-0.55, 1.06, -3.0); headset.rotation.y = 0.45;
  box(headset, 0.52, 0.26, 0.3, '#232c38', 0, 0.15, 0);
  box(headset, 0.46, 0.18, 0.04, '#0f766e', 0, 0.15, 0.16, { emissive: '#2dd4bf', emissiveIntensity: 0.55, roughness: 0.3 });
  const strap = add(headset, new THREE.TorusGeometry(0.27, 0.03, 6, 20), mat('#3b4656'), 0, 0.15, -0.08);
  strap.rotation.x = Math.PI / 2;
  register('headset', headset, { pos: [-0.1, 1.85, -1.75], look: [-0.55, 1.2, -3.0] }, [-0.55, 1.6, -3.0]);

  // Letter -> contact
  const letter = new THREE.Group();
  letter.position.set(-0.05, 1.07, -2.65); letter.rotation.y = -0.35;
  box(letter, 0.5, 0.02, 0.34, '#f1e9da', 0, 0, 0);
  const flap = box(letter, 0.25, 0.006, 0.25, '#ddcfb6', 0, 0.013, -0.03);
  flap.rotation.y = Math.PI / 4;
  add(letter, new THREE.CylinderGeometry(0.05, 0.05, 0.015, 14), mat('#c0392b'), 0, 0.02, 0.06);
  register('letter', letter, { pos: [0.5, 1.95, -1.45], look: [-0.05, 1.05, -2.65] }, [-0.05, 1.45, -2.65]);

  // Window -> about
  const win = new THREE.Group();
  const sky = canvasTexture(256, 230, (ctx, w, h) => drawSky(ctx, w, h, romeTime().phase));
  const glass = new THREE.Mesh(new THREE.PlaneGeometry(1.6, 1.44), new THREE.MeshBasicMaterial({ map: sky.tex, toneMapped: false }));
  glass.position.set(-2.3, 2.65, -3.985);
  win.add(glass);
  const frameColor = '#d9cbb5';
  box(win, 1.76, 0.09, 0.12, frameColor, -2.3, 3.42, -3.95);
  box(win, 1.76, 0.09, 0.12, frameColor, -2.3, 1.88, -3.95);
  box(win, 0.09, 1.6, 0.12, frameColor, -3.14, 2.65, -3.95);
  box(win, 0.09, 1.6, 0.12, frameColor, -1.46, 2.65, -3.95);
  box(win, 0.05, 1.5, 0.08, frameColor, -2.3, 2.65, -3.95);
  box(win, 1.6, 0.05, 0.08, frameColor, -2.3, 2.65, -3.95);
  box(win, 1.95, 0.07, 0.3, frameColor, -2.3, 1.82, -3.85);
  register('window', win, { pos: [-1.9, 2.5, -0.9], look: [-2.3, 2.6, -4] }, [-2.3, 3.6, -3.95]);

  // Circuit board -> experience
  const circuit = new THREE.Group();
  const board = canvasTexture(640, 380, (ctx, w, h) => drawCircuit(ctx, w, h, 0));
  box(circuit, 0.06, 1.82, 3.02, '#c9a54a', -3.97, 2.5, -0.7);
  const pcb = new THREE.Mesh(new THREE.PlaneGeometry(2.9, 1.72), mat('#ffffff', { map: board.tex, emissive: '#ffffff', emissiveMap: board.tex, emissiveIntensity: 0.45, flatShading: false }));
  pcb.position.set(-3.935, 2.5, -0.7); pcb.rotation.y = Math.PI / 2;
  circuit.add(pcb);
  register('circuit', circuit, { pos: [-0.9, 2.45, -0.7], look: [-4, 2.45, -0.7] }, [-3.9, 3.55, -0.7]);

  // Pinboard -> skills
  const pin = new THREE.Group();
  const cork = canvasTexture(512, 340, drawBoard);
  box(pin, 1.72, 1.18, 0.05, '#5a3e26', 2.5, 2.65, -3.98);
  const corkMesh = new THREE.Mesh(new THREE.PlaneGeometry(1.6, 1.06), mat('#ffffff', { map: cork.tex, flatShading: false }));
  corkMesh.position.set(2.5, 2.65, -3.95);
  pin.add(corkMesh);
  register('board', pin, { pos: [2.45, 2.55, -1.45], look: [2.5, 2.6, -4] }, [2.5, 3.4, -3.95]);

  // Bookshelf -> education
  const shelf = new THREE.Group();
  shelf.position.set(-3.65, 0, 2.0);
  const wood = '#5c4330';
  box(shelf, 0.5, 2.4, 0.06, wood, 0, 1.2, -0.9);
  box(shelf, 0.5, 2.4, 0.06, wood, 0, 1.2, 0.9);
  box(shelf, 0.05, 2.4, 1.86, wood, -0.23, 1.2, 0);
  const bookColors = ['#2dd4bf', '#38bdf8', '#f59e0b', '#e11d48', '#a78bfa', '#e6edf3', '#22c55e', '#f97316'];
  for (let level = 0; level < 4; level++) {
    const y = 0.08 + level * 0.6;
    box(shelf, 0.5, 0.05, 1.8, wood, 0, y, 0);
    let z = -0.82;
    let k = level * 3;
    while (z < 0.78) {
      const w = 0.08 + ((k * 7) % 5) * 0.015, hgt = 0.36 + ((k * 11) % 4) * 0.04;
      if (level === 3 && z > 0.1) break;
      const b = box(shelf, 0.32, hgt, w, bookColors[k % bookColors.length], 0.02, y + 0.025 + hgt / 2, z + w / 2);
      if ((k % 9) === 4) b.rotation.x = 0.18;
      z += w + 0.012; k++;
    }
  }
  // Mortarboard and a framed certificate on the top shelf.
  box(shelf, 0.42, 0.03, 0.42, '#11161d', 0.02, 2.5, 0.45).rotation.y = Math.PI / 4;
  add(shelf, new THREE.CylinderGeometry(0.12, 0.13, 0.1, 10), mat('#11161d'), 0.02, 2.44, 0.45);
  const cert = box(shelf, 0.04, 0.34, 0.44, '#c9a54a', -0.05, 2.06, 0.45);
  cert.rotation.z = 0.08;
  box(shelf, 0.02, 0.28, 0.38, '#f1e9da', -0.025, 2.06, 0.45).rotation.z = 0.08;
  register('shelf', shelf, { pos: [-1.2, 1.75, 2.1], look: [-3.65, 1.3, 2.0] }, [-3.65, 2.85, 2.0]);

  // Server rack -> integrations; its lights blink like traffic between systems.
  const rack = new THREE.Group();
  rack.position.set(3.2, 0, -1.6);
  box(rack, 0.8, 1.6, 0.7, '#161d26', 0, 0.8, 0);
  box(rack, 0.84, 0.06, 0.74, '#0d1218', 0, 1.62, 0);
  const leds = [];
  for (let u = 0; u < 6; u++) {
    const y = 0.28 + u * 0.22;
    box(rack, 0.7, 0.16, 0.02, '#232c38', 0, y, 0.36);
    for (let k = 0; k < 3; k++) {
      leds.push(box(rack, 0.04, 0.04, 0.02, '#0f766e', -0.26 + k * 0.08, y, 0.375,
        { emissive: k === 2 ? '#f59e0b' : '#2dd4bf', emissiveIntensity: 0.8 }));
    }
  }
  register('rack', rack, { pos: [1.5, 1.55, 0.9], look: [3.2, 0.9, -1.6] }, [3.2, 1.95, -1.6]);

  /* ---------- Lights ---------- */
  const hemi = new THREE.HemisphereLight('#c9dcff', '#3b2b20', 0.9);
  scene.add(hemi);
  const key = new THREE.DirectionalLight('#ffffff', 1.6);
  key.position.set(6, 9, 5);
  key.castShadow = true;
  key.shadow.mapSize.set(1024, 1024);
  Object.assign(key.shadow.camera, { left: -7, right: 7, top: 7, bottom: -7, near: 1, far: 30 });
  key.shadow.bias = -0.0008;
  scene.add(key);
  const windowLight = new THREE.PointLight('#bfe3ff', 6, 7, 1.6);
  windowLight.position.set(-2.3, 2.6, -3.4);
  scene.add(windowLight);
  const lamp = new THREE.PointLight('#ffb45e', 4, 6, 1.4);
  lamp.position.set(-3.4, 2.05, -3.3);
  scene.add(lamp);
  const screenGlow = new THREE.PointLight('#2dd4bf', 1.4, 3, 2);
  screenGlow.position.set(0.6, 1.9, -3.0);
  scene.add(screenGlow);

  const applyTime = () => {
    const time = romeTime();
    const { phase } = time;
    drawSky(sky.ctx, 256, 230, phase); sky.tex.needsUpdate = true;
    const cfg = {
      day: { hemi: 1.0, key: 1.7, win: ['#cfe8ff', 7], lamp: 1.2 },
      dusk: { hemi: 0.7, key: 1.1, win: ['#ffb27a', 5], lamp: 4 },
      night: { hemi: 0.75, key: 0.8, win: ['#7d8fe8', 3.5], lamp: 8 },
    }[phase];
    hemi.intensity = cfg.hemi; key.intensity = cfg.key;
    windowLight.color.set(cfg.win[0]); windowLight.intensity = cfg.win[1];
    lamp.intensity = cfg.lamp;
    needsRender = true;
    if (clock) clock.textContent = `${clock.dataset.rome} ${time.label} · ${clock.dataset[phase]}`;
  };
  applyTime();
  setInterval(applyTime, 60_000);

  /* ---------- Camera: home orbit, drag, and fly-to ---------- */
  const look = HOME_TARGET.clone();
  const orbit = { yaw: Math.PI / 4, pitch: 0.48, radius: 12 };
  const orbitTarget = { yaw: orbit.yaw, pitch: orbit.pitch };
  let mode = 'home'; // 'home' | 'flying' | 'focused'
  let flight = null;

  const homePosition = () => {
    const { yaw, pitch, radius } = orbit;
    return new THREE.Vector3(
      HOME_TARGET.x + Math.sin(yaw) * Math.cos(pitch) * radius,
      HOME_TARGET.y + Math.sin(pitch) * radius,
      HOME_TARGET.z + Math.cos(yaw) * Math.cos(pitch) * radius,
    );
  };

  const flyTo = (pos, lookAt, done) => {
    if (reduceMotion) {
      camera.position.copy(pos); look.copy(lookAt); camera.lookAt(look);
      done?.(); return;
    }
    flight = { from: camera.position.clone(), fromLook: look.clone(), to: pos, toLook: lookAt, t0: performance.now(), dur: 900, done };
    mode = 'flying';
  };

  const layout = () => {
    needsRender = true;
    const w = canvas.clientWidth, h = canvas.clientHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    orbit.radius = 10.6 * Math.min(Math.max(1.45 / camera.aspect, 1), 1.9);
    if (mode === 'home') { camera.position.copy(homePosition()); camera.lookAt(look); }
  };
  layout();
  addEventListener('resize', layout);

  /* ---------- Hover + click ---------- */
  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  const pickables = Object.values(objects).flatMap(o => o.meshes);
  let hovered = null;
  const highlight = '#2dd4bf';

  const setHover = id => {
    if (hovered === id) return;
    needsRender = true;
    if (hovered) {
      objects[hovered].meshes.forEach(m => m.material.emissive && m.material.emissive.copy(m.userData.baseEmissive));
      labels[hovered]?.btn.classList.remove('is-hover');
    }
    hovered = id;
    canvas.classList.toggle('is-hover', !!id);
    if (!id) { tooltip.classList.remove('is-on'); return; }
    objects[id].meshes.forEach(m => {
      if (!m.material.emissive) return;
      m.userData.baseEmissive ??= m.material.emissive.clone();
      m.material.emissive.set(highlight).multiplyScalar(0.35).add(m.userData.baseEmissive);
    });
    labels[id]?.btn.classList.add('is-hover');
    tooltip.textContent = labels[id]?.label || id;
    tooltip.classList.add('is-on');
  };
  Object.values(objects).forEach(o => o.meshes.forEach(m => { if (m.material.emissive) m.userData.baseEmissive = m.material.emissive.clone(); }));

  const pick = (clientX, clientY) => {
    const r = canvas.getBoundingClientRect();
    pointer.set(((clientX - r.left) / r.width) * 2 - 1, -((clientY - r.top) / r.height) * 2 + 1);
    raycaster.setFromCamera(pointer, camera);
    const hit = raycaster.intersectObjects(pickables, false)[0];
    if (!hit) return null;
    let o = hit.object;
    while (o && !o.userData.id) o = o.parent;
    return o?.userData.id || null;
  };

  const focus = id => {
    const obj = objects[id];
    if (!obj || mode === 'flying') return;
    if (navigator.vibrate) navigator.vibrate(id === 'headset' ? [35, 45, 70, 45, 35] : 12);
    setHover(null);
    flyTo(new THREE.Vector3(...obj.view.pos), new THREE.Vector3(...obj.view.look), () => {
      mode = 'focused';
      document.dispatchEvent(new CustomEvent('room:open', { detail: { target: labels[id].target } }));
    });
  };

  let drag = null;
  canvas.addEventListener('pointerdown', e => {
    drag = { x: e.clientX, y: e.clientY, yaw: orbitTarget.yaw, pitch: orbitTarget.pitch, moved: false };
  });
  addEventListener('pointermove', e => {
    if (drag) {
      const dx = e.clientX - drag.x, dy = e.clientY - drag.y;
      if (Math.abs(dx) + Math.abs(dy) > 6) { drag.moved = true; canvas.classList.add('is-drag'); }
      if (drag.moved && mode === 'home') {
        orbitTarget.yaw = THREE.MathUtils.clamp(drag.yaw - dx * 0.004, 0.12, 1.45);
        orbitTarget.pitch = THREE.MathUtils.clamp(drag.pitch + dy * 0.003, 0.22, 0.9);
      }
      return;
    }
    if (e.target !== canvas) { if (!e.target.closest?.('.hotspot')) setHover(null); return; }
    if (mode !== 'home') return;
    setHover(pick(e.clientX, e.clientY));
  }, { passive: true });
  addEventListener('pointerup', e => {
    if (!drag) return;
    const wasClick = !drag.moved && e.target === canvas;
    drag = null;
    canvas.classList.remove('is-drag');
    if (wasClick && mode === 'home') {
      const id = pick(e.clientX, e.clientY);
      if (id) focus(id);
    }
  });
  addEventListener('pointercancel', () => { drag = null; canvas.classList.remove('is-drag'); });
  canvas.addEventListener('pointerleave', () => { if (!drag) setHover(null); });

  document.addEventListener('room:focus', e => {
    section.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'center' });
    focus(e.detail.object);
  });
  document.addEventListener('room:hover', e => { if (mode === 'home') setHover(e.detail.object); });
  document.addEventListener('panel:closed', () => {
    if (mode === 'home') return;
    mode = 'flying';
    flyTo(homePosition(), HOME_TARGET.clone(), () => { mode = 'home'; });
  });

  /* ---------- Loop ---------- */
  let visible = true;
  new IntersectionObserver(([e]) => { visible = e.isIntersecting; }).observe(canvas);
  let codeOffset = 0, lastCode = 0, lastBlink = 0, lastPulse = 0, lastLed = 0, texturesDrawn = false;
  const anchor = new THREE.Vector3();

  const frame = now => {
    requestAnimationFrame(frame);
    if (!visible || document.hidden) return;

    if (mode === 'flying' && flight) {
      const p = Math.min((now - flight.t0) / flight.dur, 1), k = easeInOut(p);
      camera.position.lerpVectors(flight.from, flight.to, k);
      look.lerpVectors(flight.fromLook, flight.toLook, k);
      if (p >= 1) { const done = flight.done; flight = null; done?.(); }
    } else if (mode === 'home') {
      const sway = reduceMotion ? 0 : Math.sin(now * 0.00025) * 0.04;
      if (Math.abs(orbitTarget.yaw + sway - orbit.yaw) + Math.abs(orbitTarget.pitch - orbit.pitch) > 1e-4) needsRender = true;
      orbit.yaw += (orbitTarget.yaw + sway - orbit.yaw) * 0.06;
      orbit.pitch += (orbitTarget.pitch - orbit.pitch) * 0.06;
      camera.position.copy(homePosition());
      look.lerp(HOME_TARGET, 0.1);
    }
    camera.lookAt(look);

    // Decorative textures redraw only when they change: code scrolls every 1.4 s with
    // a 2 Hz cursor, the circuit pulses at ~20 fps. Reduced motion draws them once.
    if (!reduceMotion || !texturesDrawn) {
      if (now - lastCode > 1400) { lastCode = now; codeOffset = (codeOffset + 1) % CODE.length; }
      if (!texturesDrawn || now - lastBlink > 500) {
        lastBlink = now;
        drawCode(screen.ctx, 512, 300, codeOffset); screen.tex.needsUpdate = true;
      }
      if (!texturesDrawn || now - lastPulse > 50) {
        lastPulse = now;
        drawCircuit(board.ctx, 640, 380, reduceMotion ? 0 : now); board.tex.needsUpdate = true;
      }
      texturesDrawn = true;
    }
    if (!reduceMotion) objects.headset.group.position.y = 1.06 + Math.sin(now * 0.002) * 0.015;
    if (!reduceMotion && now - lastLed > 180) {
      lastLed = now;
      leds.forEach(l => { l.material.emissiveIntensity = Math.random() < 0.35 ? 0.15 : 1.1; });
    }

    if (hovered) {
      anchor.set(...objects[hovered].anchor).project(camera);
      tooltip.style.left = `${(anchor.x * 0.5 + 0.5) * canvas.clientWidth}px`;
      tooltip.style.top = `${(-anchor.y * 0.5 + 0.5) * canvas.clientHeight}px`;
    }
    // With reduced motion the scene is static, so render only when something changed.
    if (reduceMotion && mode !== 'flying' && !needsRender) return;
    needsRender = false;
    renderer.render(scene, camera);
  };
  requestAnimationFrame(frame);
  section.classList.add('is-live');
}
