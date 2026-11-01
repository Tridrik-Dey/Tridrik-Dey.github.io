// Page behaviour. All content is already in the HTML (for crawlers and no-JS
// visitors); this file only adds interaction on top of it.

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- Theme ---------- */
$('.theme-toggle')?.addEventListener('click', () => {
  const next = document.documentElement.dataset.theme === 'light' ? 'dark' : 'light';
  document.documentElement.dataset.theme = next;
  try { localStorage.setItem('theme', next); } catch (e) { /* storage blocked */ }
  document.dispatchEvent(new CustomEvent('theme:change', { detail: next }));
});

/* ---------- Binary decoder: text settles out of 0s and 1s ---------- */
function decode(el) {
  const text = el.textContent;
  if (reduceMotion) return;
  // Screen readers get the real text while the visible copy scrambles.
  const spoken = document.createElement('span');
  spoken.className = 'sr-only';
  spoken.textContent = text;
  el.before(spoken);
  el.setAttribute('aria-hidden', 'true');
  const finish = () => { el.textContent = text; el.removeAttribute('aria-hidden'); spoken.remove(); };
  const delay = Number(el.dataset.delay || 0);
  const duration = 900 + text.length * 45;
  const render = progress => {
    const settled = Math.floor(progress * text.length);
    el.innerHTML = [...text].map((ch, i) => {
      if (i < settled || ch === ' ') return ch;
      return `<span class="glyph" aria-hidden="true">${Math.random() < 0.5 ? '0' : '1'}</span>`;
    }).join('');
  };
  render(0);
  let start;
  const tick = now => {
    start ??= now;
    const p = Math.min((now - start - delay) / duration, 1);
    if (p >= 0) render(p);
    if (p < 1) requestAnimationFrame(tick);
    else finish();
  };
  requestAnimationFrame(tick);
}
$$('[data-decode]').forEach(decode);

/* ---------- Rotating roles, typed like a terminal ---------- */
const roleEl = $('.role');
if (roleEl && !reduceMotion) {
  const roles = JSON.parse(roleEl.dataset.roles);
  let index = 0;
  let run = 0;
  // Each call gets a run id; a newer call stops older ones, so typing never overlaps
  // (background tabs throttle timers and can stretch one run past the interval).
  const type = async (word) => {
    const id = ++run;
    const wait = ms => new Promise(r => setTimeout(r, ms));
    for (let i = roleEl.textContent.length; i >= 0; i--) {
      if (id !== run) return;
      roleEl.textContent = roleEl.textContent.slice(0, i);
      await wait(22);
    }
    for (let i = 1; i <= word.length; i++) {
      if (id !== run) return;
      roleEl.textContent = word.slice(0, i);
      await wait(45);
    }
  };
  setInterval(() => { index = (index + 1) % roles.length; type(roles[index]); }, 3800);
}

/* ---------- Count-up facts ---------- */
const counters = $$('.count');
const countObserver = new IntersectionObserver(entries => {
  for (const e of entries) {
    if (!e.isIntersecting) continue;
    countObserver.unobserve(e.target);
    const end = Number(e.target.dataset.count);
    if (reduceMotion || !end) continue;
    const from = end > 1000 ? end - 40 : 0;
    const t0 = performance.now();
    const step = now => {
      const p = Math.min((now - t0) / 1200, 1);
      e.target.textContent = Math.round(from + (end - from) * (1 - (1 - p) ** 3));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }
}, { threshold: 0.6 });
counters.forEach(c => countObserver.observe(c));

/* ---------- Circuit current: travel the full height of the timeline ---------- */
const circuit = $('.circuit');
const sizeCircuit = () => circuit?.style.setProperty('--trace-h', `${circuit.offsetHeight - 90}px`);
sizeCircuit();
addEventListener('resize', sizeCircuit);

/* ---------- Panel: a room object "borrows" a section and shows it in a dialog ---------- */
const panel = $('.panel');
const panelBody = $('.panel-body');
let borrowed = null;

function openPanel(id) {
  const section = document.getElementById(id);
  if (!section || !panel) return;
  if (panel.open) closePanel(false);
  const placeholder = document.createComment(`panel:${id}`);
  section.before(placeholder);
  panelBody.append(section);
  borrowed = { section, placeholder };
  panel.showModal();
  panelBody.scrollTop = 0;
  if (id === 'experience') sizeCircuit();
}

function closePanel(notify = true) {
  if (!borrowed) return;
  borrowed.placeholder.replaceWith(borrowed.section);
  borrowed = null;
  if (panel.open) panel.close();
  if (notify) document.dispatchEvent(new CustomEvent('panel:closed'));
}

panel?.addEventListener('close', () => closePanel());
$('.panel-close')?.addEventListener('click', () => closePanel());
panel?.addEventListener('click', e => { if (e.target === panel) closePanel(); });
document.addEventListener('room:open', e => openPanel(e.detail.target));

// Jump to an element, wherever it lives right now (page or panel).
function reveal(el) {
  if (!el) return;
  if (borrowed && !borrowed.section.contains(el)) closePanel();
  // A project filter may have hidden the target card; show everything again.
  if (el.closest('[hidden]')) $('[data-filter="all"]')?.click();
  el.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'center' });
  el.classList.remove('flash');
  void el.offsetWidth;
  el.classList.add('flash');
}

/* ---------- Hotspot buttons (keyboard / mobile / no-WebGL path into the room) ---------- */
$$('.hotspot').forEach(btn => {
  btn.addEventListener('click', e => {
    e.preventDefault();
    document.dispatchEvent(new CustomEvent('room:focus', { detail: { object: btn.dataset.object } }));
    // If the 3D room isn't running, open straight away.
    if (!document.querySelector('.room.is-live')) openPanel(btn.dataset.target);
  });
  btn.addEventListener('pointerenter', () =>
    document.dispatchEvent(new CustomEvent('room:hover', { detail: { object: btn.dataset.object } })));
  btn.addEventListener('pointerleave', () =>
    document.dispatchEvent(new CustomEvent('room:hover', { detail: { object: null } })));
});

/* ---------- Project filters ---------- */
$$('[data-filter]').forEach(chip => chip.addEventListener('click', () => {
  const f = chip.dataset.filter;
  $$('[data-filter]').forEach(c => {
    const on = c === chip;
    c.classList.toggle('is-on', on);
    c.setAttribute('aria-pressed', on);
  });
  $$('.project').forEach(p => {
    const show = f === 'all' || p.dataset.cat === f || (f === 'web' && /typescript|nextjs|react|javascript/.test(p.dataset.tags));
    p.hidden = !show;
  });
}));

/* ---------- Gentle 3D tilt on project cards ---------- */
if (!reduceMotion && matchMedia('(hover: hover)').matches) {
  $$('.project').forEach(card => {
    card.addEventListener('pointermove', e => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      card.style.transform = `perspective(700px) rotateX(${-y * 6}deg) rotateY(${x * 8}deg) translateY(-2px)`;
    });
    card.addEventListener('pointerleave', () => { card.style.transform = ''; });
  });
}

/* ---------- Skill tracing: click a chip, light up everything that used it ---------- */
const trace = $('.skill-trace');
$$('.chip.skill').forEach(chip => chip.addEventListener('click', () => {
  const on = chip.getAttribute('aria-pressed') !== 'true';
  $$('.chip.skill').forEach(c => c.setAttribute('aria-pressed', 'false'));
  const chunks = $$('[data-chunk]');
  chunks.forEach(c => c.classList.remove('is-lit', 'is-dim'));
  trace.innerHTML = '';
  if (!on) return;
  chip.setAttribute('aria-pressed', 'true');
  const tag = chip.dataset.tag;
  const hits = chunks.filter(c => c.dataset.tags.split(' ').includes(tag));
  chunks.forEach(c => c.classList.add(hits.includes(c) ? 'is-lit' : 'is-dim'));
  if (!hits.length) { trace.textContent = trace.dataset.none; return; }
  trace.append(`${trace.dataset.used}: `);
  hits.forEach(h => {
    const a = document.createElement('a');
    a.href = `#${h.id}`;
    a.textContent = h.dataset.title;
    a.addEventListener('click', ev => { ev.preventDefault(); reveal(h); });
    trace.append(a);
  });
}));

/* ---------- Ask my CV: a tiny in-browser retrieval engine ---------- */
// Query terms expand through this map, so "AI" also finds RAG, LLM, agents...
const SYNONYMS = {
  ai: ['llm', 'rag', 'agents', 'openai', 'langchain', 'gpt', 'embeddings'],
  ia: ['llm', 'rag', 'agents', 'openai'],
  llm: ['llms', 'gpt', 'openai', 'rag'],
  rag: ['retrieval', 'embeddings', 'faiss', 'llm'],
  agent: ['agents', 'langchain', 'xstate', 'puppeteer'],
  vr: ['virtual', 'haptic', 'haptics', 'xr', 'research', 'aptico', 'aptica'],
  haptic: ['haptics', 'vr', 'aptico'],
  ricerca: ['research', 'vr', 'haptics'],
  research: ['vr', 'haptics', 'university'],
  java: ['spring', 'spring-boot', 'jdbc', 'jpa', 'kafka'],
  spring: ['spring-boot', 'spring-mvc', 'java'],
  backend: ['java', 'spring', 'rest', 'mysql', 'kafka', 'api'],
  frontend: ['react', 'angular', 'sap-ui5', 'javascript', 'nextjs', 'html5'],
  test: ['testing', 'selenium', 'qa'],
  testing: ['selenium', 'qa', 'test'],
  qa: ['testing', 'selenium'],
  database: ['mysql', 'postgresql', 'jpa', 'faiss'],
  docusign: ['maestro', 'envelope', 'esignature', 'extension-apps', 'dtm'],
  esignature: ['docusign', 'envelope', 'signature'],
  firma: ['docusign', 'signature', 'envelope'],
  integration: ['docusign', 'sap', 'microsoft-graph', 'sharepoint', 'entra-id', 'oauth', 'soap', 'rest'],
  integrazione: ['docusign', 'sap', 'microsoft-graph', 'sharepoint'],
  microsoft: ['microsoft-graph', 'sharepoint', 'entra-id'],
  azure: ['entra-id', 'microsoft-graph'],
  sap: ['soap', 'maestro'],
  italian: ['italiano', 'italy', 'italian-bridge', 'lingualine'],
  italiano: ['italian', 'lingualine', 'italian-bridge'],
  kafka: ['transactions', 'streaming', 'microservices'],
  python: ['streamlit', 'faiss', 'transformers', 'whisper'],
  permit: ['right-to-work', 'work-permit'],
  visa: ['right-to-work', 'work-permit'],
  authorization: ['right-to-work', 'work-permit'],
  authorisation: ['right-to-work', 'work-permit'],
  permesso: ['right-to-work', 'work-permit'],
  right: ['right-to-work'],
  available: ['availability', 'notice-period'],
  availability: ['notice-period'],
  notice: ['notice-period', 'availability'],
  start: ['availability', 'notice-period'],
  preavviso: ['notice-period', 'availability'],
  disponibilita: ['availability', 'notice-period'],
  remote: ['remote', 'hybrid', 'location'],
  remoto: ['remote', 'hybrid', 'location'],
  language: ['languages', 'english', 'italian'],
  lingue: ['languages', 'english', 'italian'],
};
const STOP = new Set('a an the and or of in on to for with my your do does did is are you he his have has experience esperienza any what which how di il la le e con per ha hai sa know about tell me'.split(' '));
const tokenize = s => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
  .split(/[^a-z0-9+#.-]+/).map(w => w.replace(/^[.-]+|[.-]+$/g, '')).filter(w => w && !STOP.has(w));

const ask = $('.ask');
const askInput = $('#ask-input');
const results = $('.ask-results');
const history = [];
let historyIndex = -1;

const docs = () => $$('[data-chunk]').map(el => {
  const text = el.textContent.replace(/\s+/g, ' ').trim();
  return { el, title: el.dataset.title, kind: el.dataset.kind, text, tags: el.dataset.tags.split(' ').filter(Boolean), words: tokenize(text) };
});

function search(query) {
  const terms = tokenize(query);
  if (!terms.length) return [];
  const expanded = new Map(terms.map(t => [t, 1]));
  terms.forEach(t => (SYNONYMS[t] || []).forEach(s => expanded.has(s) || expanded.set(s, 0.45)));
  const corpus = docs();
  const df = term => corpus.filter(d => d.words.some(w => w.startsWith(term)) || d.tags.some(tag => tag.startsWith(term))).length;
  return corpus.map(d => {
    let score = 0;
    let direct = false;
    const matched = new Set();
    for (const [term, weight] of expanded) {
      const idf = Math.log(1 + corpus.length / (1 + df(term)));
      const tf = d.words.filter(w => w.startsWith(term)).length;
      const inTags = d.tags.some(tag => tag.startsWith(term) || term.startsWith(tag) && tag.length > 2);
      const inTitle = d.title.toLowerCase().includes(term);
      const s = (Math.min(tf, 4) + (inTags ? 3 : 0) + (inTitle ? 3 : 0)) * idf * weight;
      if (s > 0) { score += s; matched.add(term); if (weight === 1) direct = true; }
    }
    return { ...d, score, matched, direct };
  }).filter(r => r.score > 1.2)
    // Evidence the visitor actually asked for ranks above synonym-only matches.
    .sort((a, b) => (b.direct - a.direct) || (b.score - a.score))
    // Drop weak passing mentions (e.g. "work" in every job) once a strong hit exists.
    .filter((r, _, all) => r.score >= all[0].score * 0.35)
    .slice(0, 4);
}

function snippet(text, matched) {
  const lower = text.toLowerCase();
  let at = 0;
  for (const m of matched) { const i = lower.indexOf(m); if (i >= 0) { at = i; break; } }
  const start = Math.max(0, at - 60);
  let s = (start ? '…' : '') + text.slice(start, start + 170) + (start + 170 < text.length ? '…' : '');
  s = s.replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));
  for (const m of matched) {
    if (m.length < 2) continue;
    s = s.replace(new RegExp(`(${m.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}[a-z0-9-]*)`, 'gi'), '<mark>$1</mark>');
  }
  return s;
}

function runAsk(query) {
  if (!query.trim()) return;
  if (history[0] !== query) history.unshift(query);
  historyIndex = -1;
  const hits = search(query);
  $$('[data-chunk]').forEach(c => c.classList.remove('is-lit', 'is-dim'));
  if (!hits.length) { results.innerHTML = `<p class="muted">${ask.dataset.empty}</p>`; return; }
  const kinds = JSON.parse(ask.dataset.kinds);
  const strength = JSON.parse(ask.dataset.strength);
  results.innerHTML = `<p class="mono muted">${ask.dataset.found}:</p>`;
  hits.forEach((h, i) => {
    const row = document.createElement('div');
    row.className = 'result';
    row.style.animationDelay = `${i * 70}ms`;
    row.innerHTML = `<span class="kind kind-${h.kind}">${kinds[h.kind] || ''}</span>
      <div><h4>${h.title}</h4><p class="mono strength${h.direct ? ' is-direct' : ''}">${h.direct ? strength.direct : strength.related}</p><p>${snippet(h.text, h.matched)}</p></div>`;
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'btn';
    btn.textContent = ask.dataset.show;
    btn.addEventListener('click', () => { h.el.classList.add('is-lit'); reveal(h.el); });
    row.append(btn);
    results.append(row);
  });
}

if (ask) {
  $('.ask-form').addEventListener('submit', e => { e.preventDefault(); runAsk(askInput.value); });
  $$('.chip[data-q]', ask).forEach(c => c.addEventListener('click', () => { askInput.value = c.dataset.q; runAsk(c.dataset.q); }));
  const vocabulary = [...new Set([
    ...$$('[data-chunk]').flatMap(el => el.dataset.tags.split(' ')),
    ...$$('.chip.skill').map(c => c.textContent),
    ...$$('.project h3').map(h => h.textContent),
  ])].filter(Boolean);
  askInput.addEventListener('keydown', e => {
    if (e.key === 'Tab' && askInput.value.trim()) {
      const words = askInput.value.split(' ');
      const last = words.pop().toLowerCase();
      const hit = last && vocabulary.find(v => v.toLowerCase().startsWith(last) && v.toLowerCase() !== last);
      if (hit) { e.preventDefault(); askInput.value = [...words, hit].join(' '); }
    } else if (e.key === 'ArrowUp' && history.length) {
      e.preventDefault();
      historyIndex = Math.min(historyIndex + 1, history.length - 1);
      askInput.value = history[historyIndex];
    } else if (e.key === 'ArrowDown' && historyIndex >= 0) {
      e.preventDefault();
      historyIndex -= 1;
      askInput.value = historyIndex >= 0 ? history[historyIndex] : '';
    }
  });
}

/* ---------- Copy email ---------- */
$$('[data-copy]').forEach(btn => btn.addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(btn.dataset.copy);
    const label = btn.textContent;
    btn.textContent = btn.dataset.done;
    setTimeout(() => { btn.textContent = label; }, 1600);
  } catch (e) { location.href = `mailto:${btn.dataset.copy}`; }
}));

/* ---------- 3D: load only when WebGL works, and only when needed ---------- */
function webglOK() {
  try {
    const c = document.createElement('canvas');
    return !!(window.WebGLRenderingContext && (c.getContext('webgl2') || c.getContext('webgl')));
  } catch (e) { return false; }
}

const roomSection = $('.room');
if (webglOK()) {
  import('./sphere.js').then(m => m.initSphere($('.hero-canvas'))).catch(() => {});
  const lazyRoom = new IntersectionObserver(entries => {
    if (!entries.some(e => e.isIntersecting)) return;
    lazyRoom.disconnect();
    import('./room.js')
      .then(m => m.initRoom(roomSection))
      .catch(() => roomSection.classList.add('no-webgl'));
  }, { rootMargin: '300px' });
  lazyRoom.observe(roomSection);
} else {
  roomSection.classList.add('no-webgl');
}

/* ---------- Object index: highlight the section being read ---------- */
const objectIndex = $('.object-index');
if (objectIndex) {
  const links = new Map($$('a[data-section]', objectIndex).map(a => [a.dataset.section, a]));
  const visible = new Map();
  let shown = null;
  const mark = () => {
    // The section nearest the top of the viewport wins.
    let current = null, best = Infinity;
    for (const [id, top] of visible) if (top < best) { best = top; current = id; }
    if (current === shown) return;
    shown = current;
    links.forEach((a, id) => a.setAttribute('aria-current', id === current ? 'true' : 'false'));
    // Keep the active item in view by scrolling only the menu sideways. (scrollIntoView
    // would also move the page itself, which made scrolling jump.)
    const active = current && links.get(current);
    if (active && objectIndex.scrollWidth > objectIndex.clientWidth) {
      objectIndex.scrollTo({ left: active.offsetLeft - (objectIndex.clientWidth - active.offsetWidth) / 2 });
    }
  };
  const sectionObserver = new IntersectionObserver(entries => {
    for (const e of entries) {
      if (e.isIntersecting) visible.set(e.target.id, Math.abs(e.boundingClientRect.top));
      else visible.delete(e.target.id);
    }
    mark();
  }, { rootMargin: '-120px 0px -55% 0px' });
  links.forEach((_, id) => { const s = document.getElementById(id); if (s) sectionObserver.observe(s); });

  // While the index is in view, the top nav's text links would duplicate it.
  const cv = $('.cv');
  // Only once the CV has reached the top of the screen, not while it is still below the room.
  const syncNav = () => document.documentElement.classList.toggle('in-cv', cv.getBoundingClientRect().top < 70);
  addEventListener('scroll', syncNav, { passive: true });
  syncNav();
}
