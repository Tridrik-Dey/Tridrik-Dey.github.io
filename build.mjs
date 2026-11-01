// Generates the static site from src/content.mjs.
// Usage: node build.mjs
import { mkdirSync, writeFileSync } from 'node:fs';
import {
  site, ui, about, experience, integrations, research, projects, skills, languages, education, certifications, faq,
} from './src/content.mjs';

// Line drawings of the room's objects, so every section is recognisably "inside" the room.
const ICONS = {
  rack: '<rect x="8" y="3" width="16" height="26" rx="2"/><path d="M8 10h16M8 16h16M8 22h16"/><circle cx="11.5" cy="6.5" r="1" class="led"/><circle cx="11.5" cy="13" r="1" class="led"/><circle cx="11.5" cy="19" r="1" class="led"/><circle cx="11.5" cy="25.5" r="1" class="led"/>',
  circuit: '<path d="M3 17h26M9 17V9h5M19 17v7h5"/><rect x="14" y="6" width="6" height="6" rx="1"/><rect x="24" y="21" width="5" height="6" rx="1"/><circle cx="9" cy="17" r="1.6"/><circle cx="19" cy="17" r="1.6"/><circle cx="27" cy="17" r="1.6"/>',
  headset: '<rect x="4" y="11" width="24" height="11" rx="4"/><circle cx="11" cy="16.5" r="2.4"/><circle cx="21" cy="16.5" r="2.4"/><path d="M6 11c2-6 18-6 20 0"/>',
  monitor: '<rect x="4" y="5" width="24" height="16" rx="2"/><path d="M16 21v5M11 27h10M8 10h6M8 14h10M8 18h4"/>',
  board: '<rect x="4" y="6" width="24" height="20" rx="2"/><rect x="8" y="10" width="7" height="7" rx="1"/><rect x="17" y="13" width="7" height="7" rx="1"/><circle cx="11.5" cy="10" r="1"/><circle cx="20.5" cy="13" r="1"/>',
  shelf: '<rect x="5" y="6" width="5" height="21" rx="1"/><rect x="11" y="9" width="5" height="18" rx="1"/><path d="M18.5 10l4-1.2 4.5 17-4 1.2z"/><path d="M3 28h26"/>',
  window: '<rect x="6" y="4" width="20" height="21" rx="1"/><path d="M16 4v21M6 14.5h20M4 28h24"/><path d="M21.5 7.5a2.5 2.5 0 1 0 2 4"/>',
  letter: '<rect x="4" y="8" width="24" height="16" rx="2"/><path d="M4 9l12 9 12-9"/><circle cx="16" cy="18" r="2.4"/>',
  faq: '<path d="M6 6h20a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H16l-6 5v-5H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2z"/><path d="M13.5 11a2.5 2.5 0 1 1 3.4 2.3c-.6.3-.9.8-.9 1.4v.5"/><circle cx="16" cy="17.6" r=".6"/>',
};
const icon = (key, cls = 'obj') => `<svg class="${cls}" viewBox="0 0 32 32" aria-hidden="true" focusable="false">${ICONS[key]}</svg>`;
// Section -> room object, in document order (this order drives the object index too).
const SECTION_OBJECTS = [
  ['about', 'window'], ['experience', 'circuit'], ['integrations', 'rack'], ['research', 'headset'],
  ['projects', 'monitor'], ['skills', 'board'], ['education', 'shelf'], ['faq', 'faq'], ['contact', 'letter'],
];
const OBJECT_OF = Object.fromEntries(SECTION_OBJECTS);

const LANGS = ['en', 'it'];
const esc = s => String(s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const t = (field, lang) => (field && typeof field === 'object' && lang in field ? field[lang] : field);
const pageUrl = lang => (lang === 'en' ? site.url : `${site.url}it/`);
const repoUrl = repo => `${site.github}/${repo}`;

// Every job, project and certification is a "chunk" the in-browser search can retrieve.
const chunkAttrs = (title, section, tags, kind) =>
  `data-chunk data-kind="${kind}" data-title="${esc(title)}" data-section="${esc(section)}" data-tags="${esc(tags.join(' '))}"`;
const slug = s => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

function jsonLd(lang) {
  const knowsAbout = skills.flatMap(g => g.items.map(([name]) => name));
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    dateModified: site.updated,
    inLanguage: lang,
    mainEntity: {
      '@type': 'Person',
      '@id': `${site.url}#person`,
      name: site.name,
      jobTitle: t(ui.decodeTitle, lang),
      description: t(ui.description, lang),
      email: `mailto:${site.email}`,
      image: site.url + site.photo,
      url: site.url,
      address: { '@type': 'PostalAddress', addressLocality: 'Rome', addressCountry: 'IT' },
      worksFor: { '@type': 'Organization', name: 'BARS' },
      alumniOf: education.map(e => ({ '@type': 'CollegeOrUniversity', name: e.school })),
      hasCredential: certifications.map(c => ({
        '@type': 'EducationalOccupationalCredential', name: c.name,
        recognizedBy: { '@type': 'Organization', name: c.issuer },
      })),
      knowsAbout,
      knowsLanguage: ['en', 'it'],
      sameAs: [site.linkedin, site.github],
    },
  };
}

function faqLd(lang) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    inLanguage: lang,
    mainEntity: faq.map(f => ({ '@type': 'Question', name: t(f.q, lang), acceptedAnswer: { '@type': 'Answer', text: t(f.a, lang) } })),
  };
}

function head(lang) {
  const root = lang === 'en' ? '' : '../';
  return `<!doctype html>
<html lang="${lang}" class="no-js" data-theme="dark">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(t(ui.title, lang))}</title>
<meta name="description" content="${esc(t(ui.description, lang))}">
<meta name="author" content="${site.name}">
<meta name="theme-color" content="#0b0f14">
<link rel="canonical" href="${pageUrl(lang)}">
<link rel="alternate" hreflang="en" href="${pageUrl('en')}">
<link rel="alternate" hreflang="it" href="${pageUrl('it')}">
<link rel="alternate" hreflang="x-default" href="${pageUrl('en')}">
<link rel="alternate" type="text/markdown" title="llms.txt" href="${site.url}llms.txt">
<meta property="og:type" content="profile">
<meta property="og:title" content="${esc(t(ui.title, lang))}">
<meta property="og:description" content="${esc(t(ui.description, lang))}">
<meta property="og:url" content="${pageUrl(lang)}">
<meta property="og:image" content="${site.url}${site.ogImage}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:locale" content="${t(ui.locale, lang)}">
<meta property="og:locale:alternate" content="${t(ui.locale, lang === 'en' ? 'it' : 'en')}">
<meta property="profile:first_name" content="Tridrik">
<meta property="profile:last_name" content="Dey">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="${root}assets/favicon.svg" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;600&family=Space+Grotesk:wght@500;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="${root}assets/css/style.css">
<script>document.documentElement.classList.replace('no-js','js');try{var s=localStorage.getItem('theme');if(s)document.documentElement.dataset.theme=s}catch(e){}</script>
<script type="application/ld+json">${JSON.stringify(jsonLd(lang))}</script>
<script type="application/ld+json">${JSON.stringify(faqLd(lang))}</script>
</head>`;
}

function nav(lang) {
  const other = lang === 'en' ? 'it' : 'en';
  const otherHref = lang === 'en' ? 'it/' : '../';
  const links = Object.entries(ui.nav)
    .map(([id, label]) => `<a href="#${id}">${esc(t(label, lang))}</a>`).join('');
  return `<a class="skip" href="#about">${esc(t(ui.skip, lang))}</a>
<header class="nav">
  <a class="monogram" href="#hero" aria-label="${site.name}">TD</a>
  <nav class="nav-links" aria-label="Main">${links}</nav>
  <div class="nav-tools">
    <a class="lang" href="${otherHref}" hreflang="${other}" lang="${other}">${other.toUpperCase()}<span class="sr-only"> · ${esc(t(ui.otherLang, lang))}</span></a>
    <button class="theme-toggle" type="button" aria-label="${esc(t(ui.themeToggle, lang))}"><span aria-hidden="true"></span></button>
  </div>
</header>`;
}

function hero(lang) {
  const root = lang === 'en' ? '' : '../';
  return `<section id="hero" class="hero">
  <canvas class="hero-canvas" aria-hidden="true"></canvas>
  <div class="hero-inner">
    <img class="hero-photo" src="${root}${site.photo}" alt="${site.name}" width="160" height="160">
    <p class="eyebrow">${esc(t(ui.hi, lang))}</p>
    <h1 class="hero-name"><span class="decode" data-decode>${site.name}</span></h1>
    <p class="hero-title"><span class="decode" data-decode data-delay="500">${esc(t(ui.decodeTitle, lang))}</span></p>
    <p class="hero-roles mono">&gt; <span class="role" data-roles="${esc(JSON.stringify(t(ui.roles, lang)))}">${esc(t(ui.roles, lang)[0])}</span><span class="caret" aria-hidden="true">▌</span></p>
    <p class="hero-lede">${esc(t(ui.lede, lang))}</p>
    <div class="hero-actions">
      <a class="btn btn-primary" href="#room">${esc(t(ui.enterRoom, lang))} ↓</a>
      <a class="btn" href="#about">${esc(t(ui.classic, lang))}</a>
      <a class="btn" href="${root}${t(ui.cvFile, lang)}" download>${esc(t(ui.download, lang))}</a>
      <a class="btn" href="mailto:${site.email}">${esc(t(ui.emailMe, lang))}</a>
    </div>
    <dl class="brief" id="brief" aria-label="${esc(t(ui.briefTitle, lang))}" ${chunkAttrs(t(ui.briefTitle, lang), 'Profile', ui.briefTags.split(' '), 'profile')}>
      ${ui.brief.map(b => `<div><dt>${esc(t(b.label, lang))}</dt><dd>${esc(t(b.value, lang))}</dd></div>`).join('')}
    </dl>
    <p class="hero-meta"><span class="dot" aria-hidden="true"></span>${esc(t(ui.open, lang))} · ${esc(t(site.location, lang))} ·
      <a href="${site.github}" rel="me">GitHub</a> · <a href="${site.linkedin}" rel="me">LinkedIn</a></p>
  </div>
</section>`;
}

function room(lang) {
  const buttons = ui.hotspots.map(h =>
    `<a class="hotspot" href="#${h.target}" data-object="${h.id}" data-target="${h.target}">${icon(OBJECT_OF[h.target], 'obj obj-sm')}${esc(t(h.label, lang))}</a>`).join('');
  return `<section id="room" class="room" aria-labelledby="room-title">
  <div class="room-stage">
    <canvas class="room-canvas" aria-hidden="true"></canvas>
    <div class="room-tooltip" aria-hidden="true"></div>
    <div class="room-hud">
      <h2 id="room-title">${esc(t(ui.room.title, lang))}</h2>
      <p class="room-hint">${esc(t(ui.room.hint, lang))}</p>
      <p class="room-clock mono" data-rome="${esc(t(ui.room.rome, lang))}" data-day="${esc(t(ui.room.day, lang))}" data-dusk="${esc(t(ui.room.dusk, lang))}" data-night="${esc(t(ui.room.night, lang))}"></p>
    </div>
  </div>
  <p class="room-fallback">${esc(t(ui.room.fallback, lang))}</p>
  <nav class="hotspots" aria-label="${esc(t(ui.room.title, lang))}">${buttons}</nav>
</section>`;
}

function aboutSection(lang) {
  const facts = ui.facts.map(f =>
    `<li><strong class="count" data-count="${f.value}">${f.value}</strong><span>${esc(t(f.label, lang))}</span></li>`).join('');
  return `<section id="about" class="section" aria-labelledby="about-h">
  <h2 id="about-h" class="section-title">${icon(OBJECT_OF['about'])}${esc(t(ui.sections.about, lang))}</h2>
  <div class="about-grid">
    <div class="prose">${about[lang].map(p => `<p>${esc(p)}</p>`).join('')}</div>
    <ul class="facts">${facts}</ul>
  </div>
  <ul class="langs">${languages[lang].map(l => `<li>${esc(l)}</li>`).join('')}</ul>
</section>`;
}

function experienceSection(lang) {
  const items = experience.map(j => `<li class="job${j.end ? '' : ' is-current'}" id="job-${j.id}" ${chunkAttrs(`${t(j.role, lang)} · ${j.company}`, t(ui.sections.experience, lang), j.tags, j.id === 'romatre' ? 'research' : 'work')}>
      <span class="node" aria-hidden="true"></span>
      <div class="job-card">
        <p class="job-period mono">${esc(t(j.period, lang))} · ${esc(t(j.place, lang))}</p>
        <h3>${esc(t(j.role, lang))} <span class="at">@ ${esc(j.company)}</span></h3>
        <ul>${t(j.points, lang).map(p => `<li>${esc(p)}</li>`).join('')}</ul>
      </div>
    </li>`).join('\n    ');
  return `<section id="experience" class="section" aria-labelledby="experience-h">
  <h2 id="experience-h" class="section-title">${icon(OBJECT_OF['experience'])}${esc(t(ui.sections.experience, lang))}</h2>
  <ol class="circuit">
    ${items}
  </ol>
</section>`;
}

function integrationsSection(lang) {
  const L = integrations.labels;
  const cards = integrations.items.map(c => `<article class="case${c.featured ? ' is-featured' : ''}" id="case-${c.id}" ${chunkAttrs(t(c.title, lang), t(ui.sections.integrations, lang), c.tags, 'work')}>
      <p class="case-client mono">${esc(t(c.client, lang))}</p>
      <h3>${esc(t(c.title, lang))}</h3>
      <dl>
        <dt>${esc(t(L.need, lang))}</dt><dd>${esc(t(c.need, lang))}</dd>
        <dt>${esc(t(L.role, lang))}</dt><dd>${esc(t(c.role, lang))}</dd>
        <dt>${esc(t(L.flow, lang))}</dt><dd class="flow mono" style="--n:${c.flow.split(' → ').length}">${c.flow.split(' → ').map((step, i) => `<span class="step" style="--i:${i}">${esc(step)}</span>`).join('<span class="arrow" aria-hidden="true">→</span><span class="sr-only">, then </span>')}</dd>
        <dt>${esc(t(L.decision, lang))}</dt><dd>${esc(t(c.decision, lang))}</dd>
        <dt>${esc(t(L.status, lang))}</dt><dd>${esc(t(c.status, lang))}</dd>
      </dl>
      <ul class="stack">${c.stack.map(x => `<li>${esc(x)}</li>`).join('')}</ul>${c.repo ? `
      <a class="project-link mono" href="${repoUrl(c.repo)}">${esc(t(L.publicTest, lang))} github.com/Tridrik-Dey/${esc(c.repo)}</a>` : ''}
    </article>`).join('\n    ');
  return `<section id="integrations" class="section" aria-labelledby="integrations-h">
  <h2 id="integrations-h" class="section-title">${icon(OBJECT_OF['integrations'])}${esc(t(ui.sections.integrations, lang))}</h2>
  <p class="confidential"><span aria-hidden="true">🔒</span> ${esc(t(integrations.note, lang))}</p>
  <div class="case-grid">
    ${cards}
  </div>
</section>`;
}

function landing(lang) {
  const links = SECTION_OBJECTS.map(([id, obj]) =>
    `<a href="#${id}" data-section="${id}">${icon(obj, 'obj obj-sm')}<span>${esc(t(ui.indexNames[id], lang))}</span></a>`).join('');
  return `<p class="landing"><span class="landing-line" aria-hidden="true"></span>${esc(t(ui.landing, lang))}</p>
<nav class="object-index" aria-label="${esc(t(ui.indexLabel, lang))}">${links}</nav>`;
}

function faqSection(lang) {
  const items = faq.map((f, i) => `<details class="faq-item" id="faq-${i + 1}" ${chunkAttrs(t(f.q, lang), t(ui.sections.faq, lang), f.tags, 'profile')}>
      <summary>${esc(t(f.q, lang))}</summary>
      <p>${esc(t(f.a, lang))}</p>
    </details>`).join('\n    ');
  return `<section id="faq" class="section" aria-labelledby="faq-h">
  <h2 id="faq-h" class="section-title">${icon('faq')}${esc(t(ui.sections.faq, lang))}</h2>
  <div class="faq">
    ${items}
  </div>
</section>`;
}

function ctaSection(lang) {
  const root = lang === 'en' ? '' : '../';
  return `<section class="cta" aria-labelledby="cta-h">
  ${icon('letter', 'obj obj-lg')}
  <h2 id="cta-h">${esc(t(ui.cta.title, lang))}</h2>
  <p>${esc(t(ui.cta.text, lang))}</p>
  <div class="hero-actions">
    <a class="btn btn-primary" href="mailto:${site.email}">${esc(t(ui.emailMe, lang))}</a>
    <a class="btn" href="${root}${t(ui.cvFile, lang)}" download>${esc(t(ui.download, lang))}</a>
    <a class="btn" href="${site.linkedin}" rel="me">LinkedIn</a>
  </div>
</section>`;
}

function researchSection(lang) {
  const r = research[lang];
  return `<section id="research" class="section" aria-labelledby="research-h" ${chunkAttrs(t(ui.sections.research, lang), 'Roma Tre', ['vr', 'haptics', 'xr', 'research', 'industry-4.0'], 'research')}>
  <h2 id="research-h" class="section-title">${icon(OBJECT_OF['research'])}${esc(t(ui.sections.research, lang))}</h2>
  <div class="research">
    <div class="haptic-wave" aria-hidden="true"><span></span><span></span><span></span></div>
    <div class="prose">
      <p class="lead">${esc(r.lead)}</p>
      <ul>${r.points.map(p => `<li>${esc(p)}</li>`).join('')}</ul>
      <p class="note mono">${esc(r.note)}</p>
    </div>
  </div>
</section>`;
}

function projectsSection(lang) {
  const a = ui.ask;
  const sugg = t(a.suggestions, lang).map(s => `<button type="button" class="chip" data-q="${esc(s)}">${esc(s)}</button>`).join('');
  const filters = Object.entries(ui.filters).map(([k, v], i) =>
    `<button type="button" class="chip${i ? '' : ' is-on'}" data-filter="${k}" aria-pressed="${i ? 'false' : 'true'}">${esc(t(v, lang))}</button>`).join('');
  const cards = projects.map(p => `<article class="project${p.featured ? ' is-featured' : ''}" id="project-${p.id}" data-cat="${p.cat}" ${chunkAttrs(p.name, t(ui.sections.projects, lang), p.tags, 'project')}>
      <h3>${esc(p.name)}</h3>
      <p>${esc(t(p.desc, lang))}</p>${p.decision ? `
      <p class="decision"><strong>${esc(t(ui.decisionLabel, lang))}</strong> ${esc(t(p.decision, lang))}</p>` : ''}
      <ul class="stack">${p.stack.map(s => `<li>${esc(s)}</li>`).join('')}</ul>
      <a class="project-link mono" href="${repoUrl(p.repo)}">${esc(t(ui.code, lang))} → github.com/Tridrik-Dey/${esc(p.repo)}</a>
    </article>`).join('\n    ');
  return `<section id="projects" class="section" aria-labelledby="projects-h">
  <h2 id="projects-h" class="section-title">${icon(OBJECT_OF['projects'])}${esc(t(ui.sections.projects, lang))}</h2>
  <div class="ask" data-empty="${esc(t(a.empty, lang))}" data-found="${esc(t(a.found, lang))}" data-show="${esc(t(a.show, lang))}"
    data-kinds="${esc(JSON.stringify(Object.fromEntries(Object.entries(a.kinds).map(([k, v]) => [k, t(v, lang)]))))}"
    data-strength="${esc(JSON.stringify(Object.fromEntries(Object.entries(a.strength).map(([k, v]) => [k, t(v, lang)]))))}">
    <h3>${esc(t(a.title, lang))}</h3>
    <p class="muted">${esc(t(a.intro, lang))}</p>
    <form class="ask-form" role="search">
      <label class="sr-only" for="ask-input">${esc(t(a.label, lang))}</label>
      <span class="prompt mono" aria-hidden="true">rag&gt;</span>
      <input id="ask-input" class="mono" type="search" autocomplete="off" spellcheck="false" placeholder="${esc(t(a.placeholder, lang))}">
      <button class="btn btn-primary" type="submit">${esc(t(a.button, lang))}</button>
    </form>
    <p class="ask-tips mono muted">${esc(t(a.tips, lang))}</p>
    <div class="chips">${sugg}</div>
    <div class="ask-results" aria-live="polite"></div>
  </div>
  <div class="chips filters" role="group" aria-label="Filter">${filters}</div>
  <div class="project-grid">
    ${cards}
  </div>
</section>`;
}

function skillsSection(lang) {
  const groups = skills.map(g => `<div class="skill-group">
      <h3>${esc(t(g.group, lang))}</h3>
      <div class="chips">${g.items.map(([name, tag]) => `<button type="button" class="chip skill" data-tag="${tag}" aria-pressed="false">${esc(name)}</button>`).join('')}</div>
    </div>`).join('\n    ');
  return `<section id="skills" class="section" aria-labelledby="skills-h">
  <h2 id="skills-h" class="section-title">${icon(OBJECT_OF['skills'])}${esc(t(ui.sections.skills, lang))}</h2>
  <p class="muted">${esc(t(ui.skillsHint, lang))}</p>
  <div class="skills">
    ${groups}
  </div>
  <div class="skill-trace" aria-live="polite" data-used="${esc(t(ui.usedIn, lang))}" data-none="${esc(t(ui.notListed, lang))}"></div>
</section>`;
}

function educationSection(lang) {
  const edu = education.map(e => `<li class="card" id="edu-${slug(e.school).slice(0, 40)}" ${chunkAttrs(t(e.degree, lang), t(ui.educationH, lang), [], 'training')}>
      <p class="mono muted">${e.period}</p>
      <h4>${esc(t(e.degree, lang))}</h4>
      <p>${esc(e.school)}</p>
    </li>`).join('');
  const certs = certifications.map(c => `<li class="card cert" id="cert-${slug(c.name)}" ${chunkAttrs(c.name, t(ui.certsH, lang), c.tags, 'training')}>
      <p class="mono muted">${esc(c.issuer)}</p>
      <h4>${esc(c.name)}</h4>
    </li>`).join('');
  return `<section id="education" class="section" aria-labelledby="education-h">
  <h2 id="education-h" class="section-title">${icon(OBJECT_OF['education'])}${esc(t(ui.sections.education, lang))}</h2>
  <h3>${esc(t(ui.educationH, lang))}</h3>
  <ul class="cards">${edu}</ul>
  <h3>${esc(t(ui.certsH, lang))}</h3>
  <ul class="cards">${certs}</ul>
</section>`;
}

function contactSection(lang) {
  return `<section id="contact" class="section" aria-labelledby="contact-h">
  <h2 id="contact-h" class="section-title">${icon(OBJECT_OF['contact'])}${esc(t(ui.sections.contact, lang))}</h2>
  <p class="lead">${esc(t(ui.contactText, lang))}</p>
  <div class="contact">
    <a class="email mono" href="mailto:${site.email}">${site.email}</a>
    <button type="button" class="btn copy" data-copy="${site.email}" data-done="${esc(t(ui.copied, lang))}">${esc(t(ui.copy, lang))}</button>
  </div>
  <ul class="contact-links">
    <li><a href="${site.linkedin}" rel="me">LinkedIn</a></li>
    <li><a href="${site.github}" rel="me">GitHub</a></li>
    <li>${esc(t(site.location, lang))}</li>
  </ul>
</section>`;
}

function page(lang) {
  const root = lang === 'en' ? '' : '../';
  return `${head(lang)}
<body>
${nav(lang)}
<main>
${hero(lang)}
${room(lang)}
<div class="cv">
${landing(lang)}
${aboutSection(lang)}
${experienceSection(lang)}
${integrationsSection(lang)}
${researchSection(lang)}
${projectsSection(lang)}
${skillsSection(lang)}
${educationSection(lang)}
${faqSection(lang)}
${contactSection(lang)}
${ctaSection(lang)}
</div>
</main>
<footer class="footer"><p>${esc(t(ui.footer, lang))}</p><p class="mono muted">© 2026 ${site.name}</p></footer>
<dialog class="panel" aria-label="${esc(t(ui.room.title, lang))}">
  <button type="button" class="panel-close" aria-label="${esc(t(ui.close, lang))}">✕</button>
  <div class="panel-body"></div>
</dialog>
<script type="importmap">{"imports":{"three":"${root || './'}assets/vendor/three.module.min.js"}}</script>
<script type="module" src="${root}assets/js/main.js"></script>
</body>
</html>
`;
}

// ---------- llms.txt / llms-full.txt / sitemap / robots ----------

function llms(full) {
  const L = 'en';
  const lines = [
    `# ${site.name}`,
    '',
    `> ${t(ui.description, L)}`,
    '',
    `- Location: Rome, Italy (open to roles in Rome, across Italy, or remote)`,
    `- Current role: Software Developer at BARS (since Sep 2025)`,
    `- Email: ${site.email}`,
    `- LinkedIn: ${site.linkedin}`,
    `- GitHub: ${site.github}`,
    ...ui.brief.map(b => `- ${t(b.label, L)}: ${t(b.value, L)}`),
    '',
    '## Pages',
    '',
    `- [Portfolio (English)](${pageUrl('en')}): interactive CV, projects and contact`,
    `- [Portfolio (Italiano)](${pageUrl('it')}): versione italiana`,
    `- [Full CV in Markdown](${site.url}llms-full.txt): complete experience, projects and skills`,
    `- [CV PDF (English)](${site.url}${t(ui.cvFile, 'en')})`,
    '',
    '## Key skills',
    '',
    ...skills.map(g => `- ${t(g.group, L)}: ${g.items.map(([n]) => n).join(', ')}`),
    '',
    '## DocuSign integration work (client names withheld)',
    '',
    ...integrations.items.map(c => `- ${t(c.title, L)} (${t(c.status, L)}): ${t(c.role, L)}`),
    '',
    '## Featured projects',
    '',
    ...projects.map(p => `- [${p.name}](${repoUrl(p.repo)}): ${t(p.desc, L)}`),
  ];
  if (full) {
    lines.push('', '## About', '', ...about[L].flatMap(p => [p, '']));
    lines.push('## Experience', '');
    for (const j of experience) {
      lines.push(`### ${t(j.role, L)} — ${j.company}`, `${t(j.period, L)} · ${t(j.place, L)}`, '',
        ...t(j.points, L).map(p => `- ${p}`), '');
    }
    lines.push('## DocuSign integration work (BARS, client names withheld)', '', t(integrations.note, L), '');
    for (const c of integrations.items) {
      lines.push(`### ${t(c.title, L)}`, `${t(c.client, L)} · ${t(c.status, L)}`, '', `- Need: ${t(c.need, L)}`, `- Role: ${t(c.role, L)}`, `- Flow: ${c.flow}`, `- Key decision: ${t(c.decision, L)}`, `- Stack: ${c.stack.join(', ')}`, '');
    }
    lines.push('## Research', '', research[L].lead, '', ...research[L].points.map(p => `- ${p}`), '');
    lines.push('## Recruiter FAQ', '', ...faq.flatMap(f => [`**${t(f.q, L)}** ${t(f.a, L)}`, '']));
    lines.push('## Education', '', ...education.map(e => `- ${t(e.degree, L)} — ${e.school} (${e.period})`), '');
    lines.push('## Certifications', '', ...certifications.map(c => `- ${c.name} — ${c.issuer}`), '');
  }
  return lines.join('\n') + '\n';
}

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${LANGS.map(l => `  <url>
    <loc>${pageUrl(l)}</loc>
    <lastmod>${site.updated}</lastmod>
${LANGS.map(a => `    <xhtml:link rel="alternate" hreflang="${a}" href="${pageUrl(a)}"/>`).join('\n')}
  </url>`).join('\n')}
</urlset>
`;

const robots = `# Everyone is welcome, including AI crawlers: this site exists to be found.
User-agent: *
Allow: /

User-agent: GPTBot
Allow: /

User-agent: OAI-SearchBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: Claude-SearchBot
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: Applebot-Extended
Allow: /

Sitemap: ${site.url}sitemap.xml
`;

mkdirSync('it', { recursive: true });
writeFileSync('index.html', page('en'));
writeFileSync('it/index.html', page('it'));
writeFileSync('llms.txt', llms(false));
writeFileSync('llms-full.txt', llms(true));
writeFileSync('sitemap.xml', sitemap);
writeFileSync('robots.txt', robots);
writeFileSync('.nojekyll', '');
console.log('Built: index.html, it/index.html, llms.txt, llms-full.txt, sitemap.xml, robots.txt');
