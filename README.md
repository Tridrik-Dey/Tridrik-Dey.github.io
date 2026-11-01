# tridrik-dey.github.io

Interactive portfolio and CV of **Tridrik Dey**, Software Developer in Rome (Java, Spring Boot, LLMs, RAG & AI agents).

Live: https://tridrik-dey.github.io · Italiano: https://tridrik-dey.github.io/it/

## What's inside

- **Hero:** a "signal blob" shader that follows the pointer, and the name decoding out of binary.
- **My room:** a low-poly 3D room built in code with three.js. Each object opens a part of the CV: monitor → projects, VR headset → research (phones vibrate), circuit board → career, pinboard → skills, bookshelf → education, window → about, letter → contact. The lighting follows the real time in Rome.
- **Ask my CV:** a small retrieval engine that runs in the browser and ranks every job, project and certification against a question, with citations.
- **Machine-readable:** all text is in the HTML, with English and Italian pages, `hreflang`, schema.org `Person` JSON-LD, `robots.txt` (AI crawlers allowed), `sitemap.xml`, `llms.txt` and `llms-full.txt`.

## Editing

All content lives in [`src/content.mjs`](src/content.mjs), in English and Italian.

```bash
node build.mjs        # regenerates index.html, it/index.html, llms*.txt, sitemap.xml, robots.txt
node tools/cv.mjs     # regenerates .build/cv-*.html and .build/og.html
```

To refresh the PDFs and the preview image, open `.build/cv-en.html`, `.build/cv-it.html` and `.build/og.html` in Chrome or Edge, then print to PDF (A4, no headers) into `assets/cv/` and screenshot `og.html` at 1200×630 into `assets/og.png`.

Preview locally with any static server, for example `npx http-server . -p 4817`.

## Credits

- [three.js](https://threejs.org) (MIT), vendored in `assets/vendor/`.
- The hero effect is inspired by [HamishMW/portfolio](https://github.com/HamishMW/portfolio) (MIT). The shaders and code here are original.
- Simplex noise by Ian McEwan & Stefan Gustavson (Ashima Arts), MIT.
