// Writes ATS-friendly CV pages (plain single column, standard headings, real text)
// to .build/cv-en.html and .build/cv-it.html, plus .build/og.html for the social
// preview image. Print them to assets/cv/*.pdf and assets/og.png with any
// Chromium browser (see README).
import { mkdirSync, writeFileSync } from 'node:fs';
import {
  site, ui, about, experience, research, projects, skills, languages, education, certifications,
} from '../src/content.mjs';

const t = (f, l) => (f && typeof f === 'object' && l in f ? f[l] : f);
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const H = {
  summary: { en: 'Summary', it: 'Profilo' },
  experience: { en: 'Experience', it: 'Esperienza professionale' },
  projects: { en: 'Selected projects', it: 'Progetti selezionati' },
  skills: { en: 'Skills', it: 'Competenze' },
  education: { en: 'Education', it: 'Formazione' },
  certs: { en: 'Certifications', it: 'Certificazioni' },
  languages: { en: 'Languages', it: 'Lingue' },
  portfolio: { en: 'Portfolio', it: 'Portfolio' },
};

function cv(lang) {
  const jobs = experience.map(j => {
    const points = j.id === 'romatre' ? [...t(j.points, lang), research[lang].points[2]] : t(j.points, lang);
    return `<div class="item"><div class="row"><strong>${esc(t(j.role, lang))} — ${esc(j.company)}</strong><span>${esc(t(j.period, lang))}</span></div>
      <div class="sub">${esc(t(j.place, lang))}</div><ul>${points.map(p => `<li>${esc(p)}</li>`).join('')}</ul></div>`;
  }).join('');
  const proj = projects.slice(0, 7).map(p =>
    `<li><strong>${esc(p.name)}</strong> (${esc(p.stack.join(', '))}): ${esc(t(p.desc, lang))} <span class="sub">github.com/Tridrik-Dey/${esc(p.repo)}</span></li>`).join('');
  return `<!doctype html><html lang="${lang}"><head><meta charset="utf-8"><title>${site.name} — CV</title>
<style>
  @page { size: A4; margin: 16mm 16mm 14mm; }
  body { font: 10.2pt/1.42 Arial, Helvetica, sans-serif; color: #111; margin: 0; }
  h1 { font-size: 21pt; margin: 0; }
  .headline { font-size: 11pt; margin: 2px 0 6px; }
  .contact { font-size: 9.4pt; color: #333; margin-bottom: 4px; }
  h2 { font-size: 11pt; text-transform: uppercase; letter-spacing: .06em; border-bottom: 1.2px solid #0d9488; padding-bottom: 2px; margin: 14px 0 6px; color: #0b4f49; }
  p { margin: 0 0 5px; }
  .item { margin-bottom: 7px; break-inside: avoid; }
  .row { display: flex; justify-content: space-between; gap: 12px; }
  .row span { white-space: nowrap; color: #333; }
  .sub { color: #555; font-size: 9.2pt; }
  ul { margin: 3px 0 0; padding-left: 16px; }
  li { margin-bottom: 2px; }
  a { color: #111; text-decoration: none; }
</style></head><body>
<h1>${site.name}</h1>
<div class="headline">${esc(t(ui.headline, lang))}</div>
<div class="contact">${esc(t(site.location, lang))} · ${site.email} · linkedin.com/in/tridrik-dey · github.com/Tridrik-Dey · ${H.portfolio[lang]}: tridrik-dey.github.io</div>
<div class="contact">${ui.brief.map(b => `${esc(t(b.label, lang))}: ${esc(t(b.value, lang))}`).join(' · ')}</div>
<h2>${H.summary[lang]}</h2>
${about[lang].map(p => `<p>${esc(p)}</p>`).join('')}
<h2>${H.experience[lang]}</h2>
${jobs}
<h2>${H.projects[lang]}</h2>
<ul>${proj}</ul>
<h2>${H.skills[lang]}</h2>
${skills.map(g => `<p><strong>${esc(t(g.group, lang))}:</strong> ${g.items.map(([n]) => esc(n)).join(', ')}</p>`).join('')}
<h2>${H.education[lang]}</h2>
${education.map(e => `<div class="item"><div class="row"><strong>${esc(t(e.degree, lang))}</strong><span>${e.period}</span></div><div class="sub">${esc(e.school)}</div></div>`).join('')}
<h2>${H.certs[lang]}</h2>
<ul>${certifications.map(c => `<li>${esc(c.name)} — ${esc(c.issuer)}</li>`).join('')}</ul>
<h2>${H.languages[lang]}</h2>
<p>${languages[lang].map(esc).join(' · ')}</p>
</body></html>`;
}

const og = `<!doctype html><html><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@500&family=Space+Grotesk:wght@500;700&display=swap" rel="stylesheet">
<style>
  html, body { margin: 0; width: 1200px; height: 630px; overflow: hidden; }
  body { background: radial-gradient(70% 90% at 85% 50%, #0f3f3a 0%, #0b0f14 65%); color: #e6edf3; font-family: 'Space Grotesk', sans-serif; display: flex; align-items: center; gap: 56px; padding: 0 80px; box-sizing: border-box; }
  img { width: 250px; height: 250px; border-radius: 50%; border: 5px solid #2dd4bf; box-shadow: 0 0 0 14px rgba(45,212,191,.18); object-fit: cover; }
  .bin { font: 500 20px 'JetBrains Mono', monospace; color: #2dd4bf; opacity: .8; margin-bottom: 8px; }
  h1 { font-size: 84px; margin: 0; letter-spacing: -1px; }
  .role { font-size: 32px; color: #9fb0c3; margin: 6px 0 22px; }
  .tags { font: 500 22px 'JetBrains Mono', monospace; color: #38bdf8; }
  .url { position: absolute; right: 60px; bottom: 40px; font: 500 20px 'JetBrains Mono', monospace; color: #8b9bb0; }
</style></head><body>
<img src="../${site.photo}" alt="">
<div><div class="bin">01010100 01000100 › rome, italy</div><h1>Tridrik Dey</h1>
<div class="role">Software Developer</div>
<div class="tags">DocuSign Integrations · Java · Spring Boot · RAG</div></div>
<div class="url">tridrik-dey.github.io</div>
</body></html>`;

mkdirSync('.build', { recursive: true });
writeFileSync('.build/cv-en.html', cv('en'));
writeFileSync('.build/cv-it.html', cv('it'));
writeFileSync('.build/og.html', og);
console.log('Wrote .build/cv-en.html, .build/cv-it.html, .build/og.html');
