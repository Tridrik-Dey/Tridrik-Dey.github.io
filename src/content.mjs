// Single source of truth for the site. Every visible string lives here in
// English and Italian; build.mjs turns it into index.html, it/index.html,
// llms.txt, llms-full.txt and sitemap.xml.

export const site = {
  url: 'https://tridrik-dey.github.io/',
  name: 'Tridrik Dey',
  email: 'tridrik21@gmail.com',
  location: { en: 'Rome, Italy', it: 'Roma, Italia' },
  linkedin: 'https://www.linkedin.com/in/tridrik-dey',
  github: 'https://github.com/Tridrik-Dey',
  photo: 'assets/photo.jpg',
  ogImage: 'assets/og.png',
  updated: '2026-10-31',
  // Search-engine ownership codes (Google Search Console, Bing Webmaster Tools). Empty = no tag.
  verify: { google: 'TpDvIQLYxlIpqFZb74sLDKEGU_5LTjOBwT2x2uKrREA', bing: '' },
};

export const ui = {
  lang: { en: 'en', it: 'it' },
  locale: { en: 'en_US', it: 'it_IT' },
  title: {
    en: 'Tridrik Dey · Software Developer (DocuSign & Enterprise Integrations, Java, Spring Boot)',
    it: 'Tridrik Dey · Sviluppatore Software (DocuSign e integrazioni enterprise, Java, Spring Boot)',
  },
  description: {
    en: 'Software Developer at BARS in Rome, a DocuSign partner, integrating DocuSign with SAP, SharePoint, Microsoft Entra ID and HR systems using Java/Spring Boot, Node.js and TypeScript. Also builds RAG and AI-agent projects.',
    it: 'Sviluppatore software in BARS a Roma, partner DocuSign: integro DocuSign con SAP, SharePoint, Microsoft Entra ID e sistemi HR usando Java/Spring Boot, Node.js e TypeScript. Sviluppo anche progetti RAG e agenti AI.',
  },
  headline: {
    en: 'Software Developer · Java & Spring Boot · DocuSign & Enterprise Integrations',
    it: 'Sviluppatore Software · Java e Spring Boot · DocuSign e integrazioni enterprise',
  },
  // The decoder resolves binary into this line under the name.
  decodeTitle: { en: 'Software Developer', it: 'Sviluppatore Software' },
  roles: {
    en: ['DocuSign integration developer', 'Java & Spring Boot developer', 'SAP · SharePoint · Entra ID integrations', 'RAG & AI agent builder', 'VR & haptics researcher'],
    it: ['Sviluppatore di integrazioni DocuSign', 'Sviluppatore Java e Spring Boot', 'Integrazioni SAP · SharePoint · Entra ID', 'Costruttore di RAG e agenti AI', 'Ricercatore in VR e aptica'],
  },
  hi: { en: "Hi, I'm", it: 'Ciao, sono' },
  lede: {
    en: 'Software Developer at BARS, a DocuSign partner in Rome. I connect DocuSign to enterprise systems — SAP, SharePoint, Microsoft Entra ID, HR platforms — with Java/Spring Boot, Node.js and TypeScript. On my own I build RAG systems and AI agents. Open to remote developer roles, based in Rome (CET).',
    it: 'Sviluppatore software in BARS, partner DocuSign a Roma. Collego DocuSign ai sistemi enterprise (SAP, SharePoint, Microsoft Entra ID, piattaforme HR) con Java/Spring Boot, Node.js e TypeScript. In autonomia costruisco sistemi RAG e agenti AI. Disponibile per ruoli da sviluppatore da remoto, con base a Roma (CET).',
  },
  // Recruiter brief: the facts a recruiter filters on, shown in the hero and searchable.
  brief: [
    { key: 'work', label: { en: 'Right to work', it: 'Diritto al lavoro' }, value: { en: 'Italy ✓ (working in Rome)', it: 'Italia ✓ (lavoro a Roma)' } },
    { key: 'notice', label: { en: 'Notice period', it: 'Preavviso' }, value: { en: 'Flexible', it: 'Flessibile' } },
    { key: 'where', label: { en: 'Where', it: 'Dove' }, value: { en: 'Remote only · based in Rome (CET)', it: 'Solo da remoto · base a Roma (CET)' } },
    { key: 'langs', label: { en: 'Languages', it: 'Lingue' }, value: { en: 'Bengali, Hindi (native) · English (professional) · Italian A2 → B1', it: 'Bengalese, hindi (madrelingua) · Inglese (professionale) · Italiano A2 → B1' } },
  ],
  briefTitle: { en: 'Recruiter brief', it: 'In breve per i recruiter' },
  briefTags: 'right-to-work work-permit availability notice-period location remote languages english italian bengali hindi',
  open: { en: 'Open to remote roles', it: 'Disponibile per ruoli da remoto' },
  enterRoom: { en: 'Explore the room', it: 'Esplora la stanza' },
  classic: { en: 'Read CV', it: 'Leggi il CV' },
  landing: { en: 'Explore the objects above, or read their stories below.', it: 'Esplora gli oggetti qui sopra, oppure leggi le loro storie qui sotto.' },
  indexLabel: { en: 'Sections', it: 'Sezioni' },
  indexNames: {
    about: { en: 'About', it: 'Chi sono' }, experience: { en: 'Career', it: 'Carriera' },
    integrations: { en: 'Integrations', it: 'Integrazioni' }, research: { en: 'Research', it: 'Ricerca' },
    projects: { en: 'Projects', it: 'Progetti' }, skills: { en: 'Skills', it: 'Competenze' },
    education: { en: 'Education', it: 'Formazione' }, faq: { en: 'FAQ', it: 'FAQ' }, contact: { en: 'Contact', it: 'Contatti' },
  },
  cta: {
    title: { en: 'Hiring for DocuSign integrations or Java? Let’s talk.', it: 'Cercate qualcuno per integrazioni DocuSign o Java? Parliamone.' },
    text: { en: 'I reply quickly by email. My CV is one click away, in English and Italian.', it: 'Rispondo rapidamente via email. Il mio CV è a un clic, in inglese e in italiano.' },
  },
  download: { en: 'Download CV', it: 'Scarica CV' },
  emailMe: { en: 'Email me', it: 'Scrivimi' },
  cvFile: { en: 'assets/cv/Tridrik-Dey-CV-EN.pdf', it: 'assets/cv/Tridrik-Dey-CV-IT.pdf' },
  nav: {
    about: { en: 'About', it: 'Chi sono' },
    experience: { en: 'Experience', it: 'Esperienza' },
    integrations: { en: 'Integrations', it: 'Integrazioni' },
    projects: { en: 'Projects', it: 'Progetti' },
    skills: { en: 'Skills', it: 'Competenze' },
    contact: { en: 'Contact', it: 'Contatti' },
  },
  themeToggle: { en: 'Toggle light/dark theme', it: 'Cambia tema chiaro/scuro' },
  skip: { en: 'Skip to content', it: 'Vai al contenuto' },
  room: {
    title: { en: 'My room', it: 'La mia stanza' },
    hint: {
      en: 'Click an object to open that part of my story. Drag to look around.',
      it: 'Clicca un oggetto per aprire quella parte della mia storia. Trascina per guardarti intorno.',
    },
    fallback: {
      en: 'Your browser can’t show the 3D room, but every section is one click away:',
      it: 'Il tuo browser non può mostrare la stanza 3D, ma ogni sezione è a portata di clic:',
    },
    rome: { en: 'Rome time', it: 'Ora di Roma' },
    day: { en: 'daylight', it: 'giorno' },
    dusk: { en: 'golden hour', it: 'ora dorata' },
    night: { en: 'night shift', it: 'turno di notte' },
  },
  hotspots: [
    { id: 'rack', target: 'integrations', label: { en: 'Server rack · Integrations', it: 'Rack server · Integrazioni' } },
    { id: 'monitor', target: 'projects', label: { en: 'Monitor · Projects', it: 'Monitor · Progetti' } },
    { id: 'headset', target: 'research', label: { en: 'VR headset · Research', it: 'Visore VR · Ricerca' } },
    { id: 'circuit', target: 'experience', label: { en: 'Circuit board · Career', it: 'Circuito · Carriera' } },
    { id: 'board', target: 'skills', label: { en: 'Pinboard · Skills', it: 'Bacheca · Competenze' } },
    { id: 'shelf', target: 'education', label: { en: 'Bookshelf · Education', it: 'Libreria · Formazione' } },
    { id: 'window', target: 'about', label: { en: 'Window · About me', it: 'Finestra · Chi sono' } },
    { id: 'letter', target: 'contact', label: { en: 'Letter · Contact', it: 'Lettera · Contatti' } },
  ],
  close: { en: 'Close', it: 'Chiudi' },
  ask: {
    title: { en: 'Ask my CV', it: 'Chiedi al mio CV' },
    intro: {
      en: 'A tiny retrieval engine running in your browser: it ranks every part of this CV against your question and cites where the answer comes from.',
      it: 'Un piccolo motore di retrieval che gira nel tuo browser: confronta ogni parte di questo CV con la tua domanda e cita da dove viene la risposta.',
    },
    placeholder: { en: 'e.g. Kafka experience? VR research? Spring Boot?', it: 'es. esperienza con Kafka? ricerca VR? Spring Boot?' },
    label: { en: 'Your question', it: 'La tua domanda' },
    button: { en: 'Retrieve', it: 'Cerca' },
    tips: { en: 'Tab completes · ↑↓ history', it: 'Tab completa · ↑↓ cronologia' },
    empty: { en: 'No strong match. Try a technology, a company or a topic.', it: 'Nessuna corrispondenza forte. Prova una tecnologia, un’azienda o un argomento.' },
    found: { en: 'Evidence found', it: 'Evidenze trovate' },
    show: { en: 'Show', it: 'Mostra' },
    // What kind of evidence a result is, so a skill used at work isn't confused with one from a course.
    kinds: {
      work: { en: 'Professional experience', it: 'Esperienza professionale' },
      research: { en: 'Research', it: 'Ricerca' },
      project: { en: 'Personal project', it: 'Progetto personale' },
      training: { en: 'Training & certification', it: 'Formazione e certificazioni' },
      profile: { en: 'Profile', it: 'Profilo' },
    },
    strength: {
      direct: { en: 'Direct match', it: 'Corrispondenza diretta' },
      related: { en: 'Related (via similar terms)', it: 'Correlato (termini simili)' },
    },
    suggestions: {
      en: ['Kafka', 'Spring Boot', 'RAG', 'Right to work', 'VR research', 'DocuSign', 'Italian'],
      it: ['Kafka', 'Spring Boot', 'RAG', 'Permesso di lavoro', 'Ricerca VR', 'DocuSign', 'Italiano'],
    },
  },
  filters: {
    all: { en: 'All', it: 'Tutti' },
    ai: { en: 'AI & RAG', it: 'AI e RAG' },
    java: { en: 'Java', it: 'Java' },
    web: { en: 'TypeScript & Web', it: 'TypeScript e Web' },
    lang: { en: 'Language tools', it: 'Strumenti linguistici' },
  },
  code: { en: 'Code', it: 'Codice' },
  decisionLabel: { en: 'Key decision:', it: 'Scelta chiave:' },
  skillsHint: {
    en: 'Click a skill to see where I used it.',
    it: 'Clicca una competenza per vedere dove l’ho usata.',
  },
  usedIn: { en: 'Used in', it: 'Usata in' },
  notListed: { en: 'Listed as a skill; no single project highlights it yet.', it: 'Indicata come competenza; nessun progetto la mette ancora in evidenza.' },
  sections: {
    about: { en: 'About me', it: 'Chi sono' },
    experience: { en: 'Career path', it: 'Percorso professionale' },
    integrations: { en: 'DocuSign integration work', it: 'Integrazioni DocuSign' },
    research: { en: 'Research · VR & haptics', it: 'Ricerca · VR e aptica' },
    projects: { en: 'Projects', it: 'Progetti' },
    skills: { en: 'Skills', it: 'Competenze' },
    education: { en: 'Education & certifications', it: 'Formazione e certificazioni' },
    faq: { en: 'Recruiter FAQ', it: 'Domande frequenti dei recruiter' },
    contact: { en: 'Contact', it: 'Contatti' },
  },
  educationH: { en: 'Education', it: 'Formazione' },
  certsH: { en: 'Certifications', it: 'Certificazioni' },
  // Kept honest: development time is counted separately from QA, operations and research.
  facts: [
    { value: '2025', label: { en: 'Software Developer at BARS since', it: 'Sviluppatore in BARS dal' } },
    { value: '1y 9m', label: { en: 'VR & haptics research, Roma Tre', it: 'ricerca VR e aptica, Roma Tre' } },
    { value: '1y 3m', label: { en: 'software testing, Lufthansa iCargo', it: 'software testing, Lufthansa iCargo' } },
    { value: 'M.Sc.', label: { en: 'ICT for Internet & Multimedia, Padova', it: 'ICT for Internet and Multimedia, Padova' } },
  ],
  contactText: {
    en: 'I’m open to remote software development roles — I’m based in Rome (CET) — especially where Java backends meet integrations (DocuSign, SAP, Microsoft 365) and AI. The fastest way to reach me is email.',
    it: 'Sono disponibile per ruoli di sviluppo software da remoto (con base a Roma, CET), soprattutto dove i backend Java incontrano le integrazioni (DocuSign, SAP, Microsoft 365) e l’AI. Il modo più rapido per contattarmi è l’email.',
  },
  copy: { en: 'Copy email', it: 'Copia email' },
  copied: { en: 'Copied!', it: 'Copiato!' },
  footer: {
    en: 'Built by Tridrik Dey with three.js. Hero effect inspired by HamishMW/portfolio (MIT).',
    it: 'Realizzato da Tridrik Dey con three.js. Effetto hero ispirato a HamishMW/portfolio (MIT).',
  },
  present: { en: 'Present', it: 'Oggi' },
  otherLang: { en: 'Italiano', it: 'English' },
};

export const about = {
  en: [
    'I’m a Software Developer at BARS in Rome, a DocuSign partner. My day-to-day work is integrating DocuSign with enterprise systems — SAP, SharePoint, Microsoft Entra ID and HR platforms — using Java/Spring Boot, Node.js and TypeScript: backend APIs, OAuth 2.0 and SOAP/REST integrations, XML/JSON data contracts and the frontends around them.',
    'Alongside my professional work I build AI projects independently: LLM applications, RAG architectures and AI agents. NVIDIA’s “Building RAG Agents with LLMs” course and the J.P. Morgan Software Engineering program sharpened how I think about scalable systems and AI-assisted development.',
    'Before that I was a researcher at Università Roma Tre, designing and evaluating VR training systems with haptic feedback for Industry 4.0 and workplace safety. My path runs from electronics engineering through QA, operations and research to software development — so I care about systems that work for the people using them.',
  ],
  it: [
    'Sono uno sviluppatore software in BARS a Roma, partner DocuSign. Il mio lavoro quotidiano è integrare DocuSign con i sistemi enterprise (SAP, SharePoint, Microsoft Entra ID e piattaforme HR) usando Java/Spring Boot, Node.js e TypeScript: API backend, integrazioni OAuth 2.0 e SOAP/REST, contratti dati XML/JSON e i frontend che li accompagnano.',
    'Accanto al lavoro sviluppo progetti AI in autonomia: applicazioni LLM, architetture RAG e agenti AI. Il corso NVIDIA “Building RAG Agents with LLMs” e il programma di Software Engineering di J.P. Morgan hanno rafforzato il mio approccio a sistemi scalabili e allo sviluppo assistito dall’AI.',
    'In precedenza sono stato ricercatore all’Università Roma Tre, dove ho progettato e valutato sistemi di formazione in VR con feedback aptico per l’Industria 4.0 e la sicurezza sul lavoro. Il mio percorso va dall’ingegneria elettronica al QA, alle operations e alla ricerca fino allo sviluppo software: per questo tengo a sistemi che funzionano per chi li usa.',
  ],
};

export const experience = [
  {
    id: 'bars',
    company: 'BARS',
    role: { en: 'Software Developer', it: 'Sviluppatore Software' },
    start: '2025-09', end: null,
    period: { en: 'Sep 2025 – Present', it: 'set 2025 – oggi' },
    place: { en: 'Rome, Italy', it: 'Roma, Italia' },
    tags: ['docusign', 'maestro', 'extension-apps', 'sap', 'soap', 'oauth', 'microsoft-graph', 'sharepoint', 'entra-id', 'zucchetti',
      'java', 'spring-boot', 'nodejs', 'typescript', 'angular', 'sap-ui5', 'javascript', 'rest', 'dtm', 'xr', 'xml-json'],
    points: {
      en: [
        'Built a private DocuSign Data IO Extension App (Node.js/Express, OAuth 2.0 client credentials, SOAP) so Maestro workflows retrieve SAP document data by request number before signature — working prototype, ongoing.',
        'Built a Java/Spring Boot proof of concept that collects purchase-order PDFs from SharePoint via Microsoft Graph and sends them as one DocuSign envelope to the vendor, with a credential-free mock mode and a REST contract designed for SAP.',
        'Built a TypeScript proof of concept that writes Microsoft Entra ID user attributes into DocuSign envelope custom fields through a configurable mapping, ready for document-management archiving.',
        'Wrote the bilingual functional analysis and built a mock-data prototype for HR e-signature (in-person signing on tablet, archiving to Zucchetti HR), with integrations behind adapters.',
        'Frontend work with Angular, SAP UI5, JavaScript and HTML5 on DTM and AR/XR business platforms.',
      ],
      it: [
        'Sviluppo di una DocuSign Data IO Extension App privata (Node.js/Express, OAuth 2.0 client credentials, SOAP) con cui i workflow Maestro recuperano da SAP i dati del documento tramite numero di richiesta prima della firma: prototipo funzionante, in corso.',
        'Proof of concept Java/Spring Boot che raccoglie da SharePoint, via Microsoft Graph, i PDF di un ordine d’acquisto e li invia al fornitore in un’unica busta DocuSign, con modalità mock senza credenziali e un contratto REST pensato per SAP.',
        'Proof of concept TypeScript che scrive gli attributi utente di Microsoft Entra ID nei campi personalizzati della busta DocuSign tramite una mappatura configurabile, pronta per l’archiviazione documentale.',
        'Analisi funzionale bilingue e prototipo con dati mock per la firma elettronica HR (firma in presenza su tablet, archiviazione in Zucchetti HR), con le integrazioni dietro adapter.',
        'Frontend con Angular, SAP UI5, JavaScript e HTML5 su piattaforme aziendali DTM e AR/XR.',
      ],
    },
  },
  {
    id: 'romatre',
    company: 'Università degli Studi Roma Tre',
    role: { en: 'Research Assistant', it: 'Assegnista di ricerca' },
    start: '2024-01', end: '2025-09',
    period: { en: 'Jan 2024 – Sep 2025', it: 'gen 2024 – set 2025' },
    place: { en: 'Rome, Italy', it: 'Roma, Italia' },
    tags: ['vr', 'haptics', 'xr', 'research', 'industry-4.0', 'unity', 'csharp', 'meta-quest'],
    points: {
      en: [
        'Designed, built and evaluated VR training systems with haptic feedback, in Unity (C#) for Meta Quest 3.',
        'Integrated WEART TouchDIVER G1 haptic gloves so trainees can feel what they handle, not just see it.',
        'Focus on Industry 4.0 and workplace-safety training scenarios.',
      ],
      it: [
        'Progettazione, sviluppo e valutazione di sistemi di formazione in VR con feedback aptico, in Unity (C#) per Meta Quest 3.',
        'Integrazione dei guanti aptici WEART TouchDIVER G1, perché chi si forma possa sentire ciò che maneggia, non solo vederlo.',
        'Focus su scenari di formazione per l’Industria 4.0 e la sicurezza sul lavoro.',
      ],
    },
  },
  {
    id: 'jrmotors',
    company: 'JR Motors Pvt Ltd (Tata Motors distributor)',
    role: { en: 'Back Office Manager', it: 'Back Office Manager' },
    start: '2016-11', end: '2022-09',
    period: { en: 'Nov 2016 – Nov 2017 · Jun 2018 – Sep 2022', it: 'nov 2016 – nov 2017 · giu 2018 – set 2022' },
    place: { en: 'India', it: 'India' },
    tags: ['crm', 'operations', 'management'],
    points: {
      en: [
        'Data processing in CRM-DMS, the portal built by TCS for all Tata Motors dealers.',
        'Billing and stock management; the bridge between dealers and Tata Motors.',
        'Managed HR and back-office operations under tight deadlines, with teamwork and customer handling.',
      ],
      it: [
        'Elaborazione dati in CRM-DMS, il portale sviluppato da TCS per tutti i concessionari Tata Motors.',
        'Fatturazione e gestione magazzino; punto di collegamento tra concessionari e Tata Motors.',
        'Gestione delle risorse umane e del back office con scadenze strette, lavoro di squadra e rapporto con i clienti.',
      ],
    },
  },
  {
    id: 'wipro',
    company: 'Wipro',
    role: { en: 'Associate Advisor', it: 'Associate Advisor' },
    start: '2017-11', end: '2018-06',
    period: { en: 'Nov 2017 – Jun 2018', it: 'nov 2017 – giu 2018' },
    place: { en: 'India', it: 'India' },
    tags: ['support', 'customer'],
    points: {
      en: [
        'Technical support for British Telecom’s UK customers: broadband, fibre, TV, mobile and telephone — troubleshooting, maintenance and billing.',
        'Consistently received 10/10 CSAT ratings; recognised by the team lead.',
        'Second runner-up performer in the British Telecom process training.',
      ],
      it: [
        'Supporto tecnico ai clienti britannici di British Telecom: banda larga, fibra, TV, mobile e telefonia; risoluzione guasti, manutenzione e fatturazione.',
        'Valutazioni CSAT costantemente di 10/10; riconoscimento dal team leader.',
        'Secondo classificato nella formazione sul processo British Telecom.',
      ],
    },
  },
  {
    id: 'ibs',
    company: 'IBS Software',
    role: { en: 'Software Test Engineer', it: 'Software Test Engineer' },
    start: '2015-09', end: '2016-11',
    period: { en: 'Sep 2015 – Nov 2016', it: 'set 2015 – nov 2016' },
    place: { en: 'India', it: 'India' },
    tags: ['testing', 'selenium', 'java', 'spring-mvc', 'jdbc', 'jquery', 'javascript', 'html5', 'css', 'bootstrap', 'nodejs'],
    points: {
      en: [
        'Tested iCargo, the cargo management system of Lufthansa Cargo (Frankfurt).',
        'Trained in Selenium automation and Java, Spring MVC, JDBC, jQuery, JavaScript, HTML5, CSS, Bootstrap and Node.js.',
        'Recognised as an extraordinary performer in software test training; delivered critical test tasks on time.',
      ],
      it: [
        'Test di iCargo, il sistema di gestione cargo di Lufthansa Cargo (Francoforte).',
        'Formazione in automazione con Selenium e in Java, Spring MVC, JDBC, jQuery, JavaScript, HTML5, CSS, Bootstrap e Node.js.',
        'Riconosciuto come performer eccezionale nella formazione sul testing; attività di test critiche consegnate nei tempi.',
      ],
    },
  },
];

// Professional DocuSign integration work at BARS. Client names are hidden on purpose.
export const integrations = {
  note: {
    en: 'Client names are hidden intentionally: this is my ongoing work at BARS, a DocuSign partner. The code stays private; here I describe the problem, my role, the architecture and the key decisions.',
    it: 'I nomi dei clienti sono nascosti intenzionalmente: è il mio lavoro attuale in BARS, partner DocuSign. Il codice resta privato; qui descrivo il problema, il mio ruolo, l’architettura e le scelte chiave.',
  },
  labels: {
    need: { en: 'Need', it: 'Esigenza' },
    role: { en: 'My role', it: 'Il mio ruolo' },
    flow: { en: 'Flow', it: 'Flusso' },
    decision: { en: 'Key decision', it: 'Scelta chiave' },
    status: { en: 'Status', it: 'Stato' },
    publicTest: { en: 'Public test version (mock mode) →', it: 'Versione di test pubblica (modalità mock) →' },
  },
  items: [
    {
      id: 'sap-maestro', featured: true,
      title: { en: 'SAP document data for DocuSign Maestro', it: 'Dati documentali SAP per DocuSign Maestro' },
      client: { en: 'Enterprise client · ongoing', it: 'Cliente enterprise · in corso' },
      need: {
        en: 'Before a document is signed, a Maestro workflow must pull the right document data from SAP — but users only know an internal request (RDA) number.',
        it: 'Prima della firma, un workflow Maestro deve recuperare da SAP i dati del documento corretto, ma gli utenti conoscono solo un numero di richiesta interno (RDA).',
      },
      role: {
        en: 'Built a private DocuSign Data IO Extension App in Node.js/Express that Maestro calls server-to-server. It queries SAP over SOAP and returns the document ID, title and status to the workflow.',
        it: 'Ho sviluppato una DocuSign Data IO Extension App privata in Node.js/Express che Maestro chiama server-to-server. Interroga SAP via SOAP e restituisce al workflow ID, titolo e stato del documento.',
      },
      flow: 'Maestro web form → Data IO extension (OAuth 2.0) → SAP (SOAP) → document data → signature step',
      decision: {
        en: 'OAuth 2.0 client credentials keep the extension a pure server-to-server service with no user login; a tunnel made the full SAP round-trip testable during development.',
        it: 'Le OAuth 2.0 client credentials rendono l’estensione un servizio server-to-server puro, senza login utente; un tunnel ha reso testabile l’intero giro con SAP durante lo sviluppo.',
      },
      status: { en: 'Working prototype · ongoing', it: 'Prototipo funzionante · in corso' },
      stack: ['DocuSign Maestro', 'Data IO Extension', 'Node.js', 'Express', 'OAuth 2.0', 'SOAP', 'SAP'],
      tags: ['docusign', 'maestro', 'extension-apps', 'sap', 'soap', 'oauth', 'nodejs', 'dtm'],
    },
    {
      id: 'sharepoint-docusign', featured: true,
      title: { en: 'SharePoint purchase orders → DocuSign', it: 'Ordini d’acquisto da SharePoint → DocuSign' },
      client: { en: 'Enterprise client · proof of concept', it: 'Cliente enterprise · proof of concept' },
      need: {
        en: 'Vendors must sign a purchase order together with every supporting document stored in SharePoint, sent as a single envelope.',
        it: 'I fornitori devono firmare l’ordine d’acquisto insieme a tutti i documenti di supporto salvati in SharePoint, inviati in un’unica busta.',
      },
      role: {
        en: 'Built a Java/Spring Boot service: from a PO number and revision it finds the SharePoint folder via Microsoft Graph, collects the PDFs, assembles the DocuSign envelope (main PO first) and sends it, returning envelope ID, status and warnings.',
        it: 'Ho sviluppato un servizio Java/Spring Boot: da numero e revisione dell’ordine trova la cartella SharePoint via Microsoft Graph, raccoglie i PDF, compone la busta DocuSign (ordine principale per primo) e la invia, restituendo ID, stato e avvisi.',
      },
      flow: 'PO request (REST) → Spring Boot → Microsoft Graph / SharePoint → envelope assembly → DocuSign → vendor',
      decision: {
        en: 'A mock mode runs the whole flow without Microsoft or DocuSign credentials, and the REST contract is designed for SAP to call later — so it can be demonstrated and tested before access to client systems exists.',
        it: 'Una modalità mock esegue l’intero flusso senza credenziali Microsoft o DocuSign, e il contratto REST è pensato per essere chiamato da SAP: si può dimostrare e testare prima di avere accesso ai sistemi del cliente.',
      },
      status: { en: 'Proof of concept', it: 'Proof of concept' },
      stack: ['Java', 'Spring Boot', 'Microsoft Graph', 'SharePoint', 'DocuSign eSignature API', 'REST', 'Docker'],
      tags: ['docusign', 'java', 'spring-boot', 'microsoft-graph', 'sharepoint', 'rest', 'sap'],
      repo: 'sharepoint-docusign-poc',
    },
    {
      id: 'entra-enrichment',
      title: { en: 'Signer data from Microsoft Entra ID', it: 'Dati dei firmatari da Microsoft Entra ID' },
      client: { en: 'Enterprise client · proof of concept', it: 'Cliente enterprise · proof of concept' },
      need: {
        en: 'Signed documents must carry company and HR attributes of the sender and the employee, ready for archiving in a document-management system.',
        it: 'I documenti firmati devono riportare gli attributi aziendali e HR di mittente e dipendente, pronti per l’archiviazione in un sistema documentale.',
      },
      role: {
        en: 'Built a TypeScript service that resolves envelope roles, matches users by email in Microsoft Entra ID via Microsoft Graph, and writes the mapped attributes as envelope custom fields.',
        it: 'Ho sviluppato un servizio TypeScript che risolve i ruoli della busta, trova gli utenti per email in Microsoft Entra ID via Microsoft Graph e scrive gli attributi mappati come campi personalizzati.',
      },
      flow: 'DocuSign envelope → roles → email → Microsoft Graph /users → mapped attributes → envelope custom fields',
      decision: {
        en: 'Which roles and attributes are used lives in a mapping file, so the business can change it without a code change.',
        it: 'Quali ruoli e attributi usare è definito in un file di mappatura, così si può cambiare senza modificare il codice.',
      },
      status: { en: 'Proof of concept', it: 'Proof of concept' },
      stack: ['TypeScript', 'Node.js', 'Microsoft Graph', 'Entra ID', 'DocuSign eSignature API', 'Vitest'],
      tags: ['docusign', 'typescript', 'nodejs', 'microsoft-graph', 'entra-id'],
    },
    {
      id: 'hr-esign',
      title: { en: 'HR e-signature and archiving to Zucchetti', it: 'Firma elettronica HR e archiviazione in Zucchetti' },
      client: { en: 'Italian enterprise client · ongoing', it: 'Cliente enterprise italiano · in corso' },
      need: {
        en: 'HR onboarding documents should be signed in person on a tablet and then filed automatically in each employee’s folder in Zucchetti HR.',
        it: 'I documenti di onboarding HR devono essere firmati in presenza su tablet e poi archiviati automaticamente nella cartella del dipendente in Zucchetti HR.',
      },
      role: {
        en: 'Wrote the bilingual functional analysis (EN/IT) and built the phase-1 prototype: in-person signing, archiving and an action log, on mock data.',
        it: 'Ho scritto l’analisi funzionale bilingue (EN/IT) e sviluppato il prototipo di fase 1: firma in presenza, archiviazione e registro delle azioni, su dati mock.',
      },
      flow: 'HR on tablet → in-person signature → signed documents → Zucchetti HR (employee folder) → action log',
      decision: {
        en: 'DocuSign and Zucchetti sit behind adapters, so the real integrations replace the mocks without changing the UI or the business rules.',
        it: 'DocuSign e Zucchetti sono dietro adapter: le integrazioni reali sostituiscono i mock senza cambiare interfaccia o regole di business.',
      },
      status: { en: 'Analysis + phase-1 prototype · ongoing', it: 'Analisi + prototipo di fase 1 · in corso' },
      stack: ['DocuSign', 'Zucchetti HR', 'Node.js', 'Adapters', 'Functional analysis'],
      tags: ['docusign', 'zucchetti', 'nodejs', 'analysis'],
    },
  ],
};

export const research = {
  en: {
    lead: 'At Università Roma Tre I worked on how people learn safety-critical tasks when they can feel what they’re doing — not just see it.',
    points: [
      'Designed and built VR training systems in Unity (C#) for Meta Quest 3 that add haptic (touch) feedback to industrial procedures.',
      'Integrated WEART TouchDIVER G1 haptic gloves, so trainees feel contact and resistance while practising.',
      'Evaluated how these systems support training for Industry 4.0 environments and workplace safety.',
      'Brought the research mindset — hypotheses, measurement, iteration — into how I build software today.',
    ],
    note: 'Try it: on a phone, tapping the VR headset in my room makes your device vibrate.',
  },
  it: {
    lead: 'All’Università Roma Tre ho studiato come le persone imparano compiti critici per la sicurezza quando possono sentire ciò che fanno, non solo vederlo.',
    points: [
      'Progettazione e sviluppo in Unity (C#) per Meta Quest 3 di sistemi di formazione in VR che aggiungono feedback aptico (tattile) alle procedure industriali.',
      'Integrazione dei guanti aptici WEART TouchDIVER G1: chi si forma percepisce contatto e resistenza mentre si esercita.',
      'Valutazione di come questi sistemi supportano la formazione per ambienti Industria 4.0 e la sicurezza sul lavoro.',
      'Ho portato il metodo della ricerca (ipotesi, misurazione, iterazione) nel modo in cui sviluppo software oggi.',
    ],
    note: 'Provalo: da telefono, toccando il visore VR nella mia stanza il dispositivo vibra.',
  },
};

// Order matters: the first three are the strongest proof for the target role
// (Java/Spring + RAG) and are shown as featured, each with one real design decision.
export const projects = [
  {
    id: 'person-registry', name: 'Person Registry', cat: 'java', repo: 'person-registry-monorepo', featured: true,
    stack: ['Spring Boot', 'Java 17', 'MySQL', 'React', 'React Query', 'i18n'],
    tags: ['java', 'spring-boot', 'mysql', 'react', 'rest', 'i18n'],
    desc: {
      en: 'Full-stack CRUD app (Anagrafica Persona) for people and addresses: search by Codice Fiscale, filters by surname and province, validation and Italian/English DTO mapping.',
      it: 'App CRUD full-stack (Anagrafica Persona) per persone e indirizzi: ricerca per Codice Fiscale, filtri per cognome e provincia, validazioni e mappatura DTO italiano/inglese.',
    },
    decision: {
      en: 'Validation of Codice Fiscale and address fields happens at the API boundary, and the Italian/English DTO mapping is switched by configuration — so the same backend serves Italian and international clients.',
      it: 'La validazione del Codice Fiscale e degli indirizzi avviene al confine dell’API, e la mappatura DTO italiano/inglese si cambia da configurazione: lo stesso backend serve clienti italiani e internazionali.',
    },
  },
  {
    id: 'videorag-ai', name: 'VideoRAG-AI', cat: 'ai', repo: 'VideoRAG-AI', featured: true,
    stack: ['Python', 'faster-whisper', 'FAISS', 'Sentence-Transformers', 'Streamlit', 'FFmpeg'],
    tags: ['rag', 'llm', 'python', 'faiss', 'whisper', 'streamlit', 'ffmpeg', 'openai', 'embeddings'],
    desc: {
      en: 'Talk to your videos: local transcription with faster-whisper, semantic search with bge-small embeddings and FAISS, and answers with exact timestamps and “play from here” citations.',
      it: 'Parla con i tuoi video: trascrizione locale con faster-whisper, ricerca semantica con embedding bge-small e FAISS, e risposte con timestamp esatti e citazioni “riproduci da qui”.',
    },
    decision: {
      en: 'Every answer cites timestamps that jump to the source moment, and an extractive fallback answers without any API key — so results can be checked, and the app still works offline.',
      it: 'Ogni risposta cita timestamp che portano al momento esatto del video, e una modalità estrattiva risponde senza chiave API: i risultati sono verificabili e l’app funziona anche offline.',
    },
  },
  {
    id: 'chatcv-ai', name: 'chatCV-AI', cat: 'ai', repo: 'chatCV-AI', featured: true,
    stack: ['Next.js 15', 'OpenAI', 'RAG', 'Tailwind CSS', 'TypeScript'],
    tags: ['rag', 'llm', 'openai', 'nextjs', 'typescript', 'tailwind', 'embeddings'],
    desc: {
      en: 'An AI assistant that represents me to recruiters: answers questions about a professional profile using RAG with gpt-4o-mini and text-embedding-3-small.',
      it: 'Un assistente AI che mi rappresenta con i recruiter: risponde a domande su un profilo professionale tramite RAG con gpt-4o-mini e text-embedding-3-small.',
    },
    decision: {
      en: 'Personal documents are indexed locally and never committed to the public repo; name, role and tone are set through environment variables, so anyone can reuse it without exposing their data.',
      it: 'I documenti personali sono indicizzati in locale e mai pubblicati nel repository; nome, ruolo e tono si impostano con variabili d’ambiente, così chiunque può riusarlo senza esporre i propri dati.',
    },
  },
  {
    id: 'jpmc-midas-core', name: 'Midas Core (J.P. Morgan)', cat: 'java', repo: 'jpmc-midas-core',
    stack: ['Java 17', 'Spring Boot 3', 'Kafka', 'JPA / H2', 'REST'],
    tags: ['java', 'spring-boot', 'kafka', 'rest', 'jpa', 'microservices'],
    desc: {
      en: 'Spring Boot service from the J.P. Morgan Software Engineering program: consumes Kafka transactions, validates them, applies incentive bonuses from a companion API and exposes account balances over REST.',
      it: 'Servizio Spring Boot del programma Software Engineering di J.P. Morgan: consuma transazioni Kafka, le valida, applica bonus da un’API dedicata ed espone i saldi via REST.',
    },
  },
  {
    id: 'jobseekerai', name: 'JobSeekerAI', cat: 'ai', repo: 'JobSeekerAI',
    stack: ['TypeScript', 'LangChain', 'XState', 'Puppeteer', 'OpenAI / OpenRouter / NVIDIA'],
    tags: ['agents', 'llm', 'langchain', 'xstate', 'puppeteer', 'typescript', 'nodejs'],
    desc: {
      en: 'An autonomous job-application agent: GPT-4 plans the steps, an XState state machine orchestrates the workflow, and Puppeteer drives the browser. Multi-provider, with a CLI and recovery from failures.',
      it: 'Un agente autonomo per candidature: GPT-4 pianifica i passi, una macchina a stati XState orchestra il flusso e Puppeteer guida il browser. Multi-provider, con CLI e ripristino dagli errori.',
    },
  },
  {
    id: 'ai-ticket-assistant', name: 'AI Ticket Assistant', cat: 'ai', repo: 'ai-ticket-assistant',
    stack: ['Next.js', 'TypeScript', 'Drizzle ORM', 'PostgreSQL', 'Tailwind CSS'],
    tags: ['llm', 'nextjs', 'typescript', 'postgresql', 'classification'],
    desc: {
      en: 'Hackathon project that classifies support tickets, detects priority, extracts key information and drafts suggested responses.',
      it: 'Progetto hackathon che classifica i ticket di supporto, rileva la priorità, estrae le informazioni chiave e propone risposte.',
    },
  },
  {
    id: 'quicksum', name: 'QuickSum+', cat: 'ai', repo: 'QuickSum-',
    stack: ['Python', 'Transformers', 'T5-small'],
    tags: ['nlp', 'python', 'transformers', 'summarization'],
    desc: {
      en: 'Offline-friendly summariser running a local T5-small model, with a choice of tone: formal, casual or bullet points.',
      it: 'Riassuntore utilizzabile offline con un modello T5-small locale e scelta del tono: formale, informale o elenco puntato.',
    },
  },
  {
    id: 'italian-b1-verb-master', name: 'Italian B1 Verb Master', cat: 'lang', repo: 'italian-b1-verb-master',
    stack: ['React 19', 'TypeScript', 'Vite', 'Tailwind CSS v4', 'Vitest', 'Playwright'],
    tags: ['react', 'typescript', 'vite', 'tailwind', 'testing', 'playwright', 'italian', 'education'],
    desc: {
      en: 'My app for learning Italian: 200 verbs in every standard tense with B1 at the centre, sentence practice with time clues, mixed tests that group mistakes by verb and tense, and progress saved locally. Covered by 230+ unit and component tests plus Playwright end-to-end tests on desktop and mobile.',
      it: 'La mia app per imparare l’italiano: 200 verbi in tutti i tempi standard con il B1 al centro, esercizi con frasi e indizi temporali, test misti che raggruppano gli errori per verbo e tempo, e progressi salvati in locale. Coperta da oltre 230 test unitari e di componente e da test end-to-end Playwright su desktop e mobile.',
    },
  },
  {
    id: 'italian-bridge', name: 'Italian Bridge', cat: 'lang', repo: 'italian-bridge',
    stack: ['JavaScript', 'Firebase'],
    tags: ['javascript', 'firebase', 'italian', 'education'],
    desc: {
      en: 'Italian vocabulary learning app from A1 to B1 (CEFR) with Firebase sync across devices.',
      it: 'App per imparare il lessico italiano dal livello A1 al B1 (QCER) con sincronizzazione Firebase tra dispositivi.',
    },
  },
  {
    id: 'lingualine', name: 'LinguaLine', cat: 'lang', repo: 'LinguaLine',
    stack: ['TypeScript', 'Chrome Extension (MV3)', 'esbuild'],
    tags: ['typescript', 'chrome-extension', 'italian', 'education'],
    desc: {
      en: 'Chrome extension that overlays Italian subtitles with a live English translation underneath on YouTube and Netflix — built because I was learning Italian myself.',
      it: 'Estensione Chrome che mostra i sottotitoli italiani con la traduzione inglese sotto, su YouTube e Netflix: l’ho creata mentre imparavo l’italiano.',
    },
  },
];

// Skill chips; `tag` links a chip to the data-tags on jobs and projects.
export const skills = [
  { group: { en: 'Enterprise integration', it: 'Integrazioni enterprise' }, items: [
    ['DocuSign eSignature API', 'docusign'], ['DocuSign Maestro', 'maestro'], ['Data IO Extension Apps', 'extension-apps'],
    ['SAP (SOAP)', 'sap'], ['Microsoft Graph', 'microsoft-graph'], ['SharePoint', 'sharepoint'], ['Entra ID', 'entra-id'],
    ['OAuth 2.0', 'oauth'], ['Zucchetti HR', 'zucchetti'],
  ] },
  { group: { en: 'Backend', it: 'Backend' }, items: [
    ['Java 17', 'java'], ['Spring Boot', 'spring-boot'], ['Spring MVC', 'spring-mvc'], ['Kafka', 'kafka'],
    ['REST APIs', 'rest'], ['JPA / JDBC', 'jpa'], ['MySQL', 'mysql'], ['PostgreSQL', 'postgresql'], ['XML / JSON contracts', 'xml-json'],
  ] },
  { group: { en: 'Frontend', it: 'Frontend' }, items: [
    ['React', 'react'], ['Angular', 'angular'], ['SAP UI5', 'sap-ui5'], ['Next.js', 'nextjs'], ['TypeScript', 'typescript'],
    ['JavaScript', 'javascript'], ['jQuery', 'jquery'], ['HTML5 / CSS', 'html5'], ['Tailwind CSS', 'tailwind'],
  ] },
  { group: { en: 'AI & data', it: 'AI e dati' }, items: [
    ['LLMs', 'llm'], ['RAG', 'rag'], ['AI agents', 'agents'], ['LangChain', 'langchain'], ['OpenAI API', 'openai'],
    ['Embeddings', 'embeddings'], ['FAISS', 'faiss'], ['Whisper', 'whisper'], ['Transformers', 'transformers'], ['Streamlit', 'streamlit'],
  ] },
  { group: { en: 'XR, quality & tools', it: 'XR, qualità e strumenti' }, items: [
    ['VR / XR', 'vr'], ['Unity', 'unity'], ['C#', 'csharp'], ['Meta Quest 3', 'meta-quest'], ['Haptics (WEART TouchDIVER)', 'haptics'], ['Selenium', 'selenium'], ['Testing / QA', 'testing'], ['Puppeteer', 'puppeteer'],
    ['XState', 'xstate'], ['Firebase', 'firebase'], ['FFmpeg', 'ffmpeg'], ['Git', 'git'],
  ] },
];

export const languages = {
  en: ['Bengali — native (mother tongue)', 'Hindi — native', 'English — professional', 'Italian — A2, preparing for B1'],
  it: ['Bengalese — madrelingua', 'Hindi — madrelingua', 'Inglese — professionale', 'Italiano — A2, in preparazione per il B1'],
};

export const education = [
  {
    school: 'Università degli Studi di Padova',
    degree: { en: "Master's degree, ICT for Internet and Multimedia", it: 'Laurea magistrale, ICT for Internet and Multimedia' },
    period: '2021 – 2023',
  },
  {
    school: 'Maulana Abul Kalam Azad University of Technology, West Bengal (formerly WBUT)',
    degree: { en: "Bachelor's degree, Electronics and Communication Engineering", it: 'Laurea triennale, Ingegneria Elettronica e delle Telecomunicazioni' },
    period: '2011 – 2015',
  },
];

export const certifications = [
  { name: 'Docusign Extension Developer Pro', issuer: 'Docusign', tags: ['docusign', 'extension-apps', 'maestro', 'dtm'] },
  { name: 'Building RAG Agents with LLMs', issuer: 'NVIDIA', tags: ['rag', 'llm', 'agents'] },
  { name: 'Software Engineering Job Simulation', issuer: 'J.P. Morgan', tags: ['java', 'spring-boot', 'kafka'] },
  { name: 'Torq Partner PS Delivery (TPS 301)', issuer: 'Torq', tags: [] },
];

// Short answers to what recruiters ask first. Rendered as <details> (works without JS)
// and as FAQPage structured data.
export const faq = [
  {
    q: { en: 'Do you have the right to work in Italy?', it: 'Hai il diritto di lavorare in Italia?' },
    a: { en: 'Yes. I live and work in Rome, currently as a Software Developer at BARS.', it: 'Sì. Vivo e lavoro a Roma, attualmente come sviluppatore software in BARS.' },
    tags: ['right-to-work', 'work-permit'],
  },
  {
    q: { en: 'What is your notice period?', it: 'Qual è il tuo periodo di preavviso?' },
    a: { en: 'It’s flexible — I’m happy to agree a start date that works for both sides.', it: 'È flessibile: concordiamo volentieri una data di inizio adatta a entrambi.' },
    tags: ['notice-period', 'availability'],
  },
  {
    q: { en: 'Do you work remotely?', it: 'Lavori da remoto?' },
    a: { en: 'Yes — I’m looking for remote roles only. I’m based in Rome (CET), so I overlap fully with European working hours and have the right to work in Italy.', it: 'Sì, cerco solo ruoli da remoto. Ho base a Roma (CET), quindi lavoro negli stessi orari europei e ho il diritto di lavorare in Italia.' },
    tags: ['remote', 'location', 'timezone'],
  },
  {
    q: { en: 'Which languages do you speak?', it: 'Quali lingue parli?' },
    a: { en: 'Bengali (mother tongue) and Hindi (native), professional English, and Italian at A2, preparing for B1 — I even built my own app to practise Italian verbs.', it: 'Bengalese (madrelingua) e hindi (madrelingua), inglese professionale e italiano A2, in preparazione per il B1: ho persino creato un’app per esercitarmi con i verbi italiani.' },
    tags: ['languages', 'italian', 'english', 'bengali', 'hindi'],
  },
  {
    q: { en: 'Can I see the code of your DocuSign integrations?', it: 'Posso vedere il codice delle tue integrazioni DocuSign?' },
    a: { en: 'The client code is private, so the case studies above describe the problem, my role, the architecture and the key decisions. The SharePoint → DocuSign proof of concept has a public test version, and I’m glad to walk through any design in an interview.', it: 'Il codice dei clienti è privato, per questo i casi qui sopra descrivono problema, ruolo, architettura e scelte chiave. Il proof of concept SharePoint → DocuSign ha una versione di test pubblica, e in un colloquio illustro volentieri qualsiasi progetto.' },
    tags: ['docusign', 'code', 'confidential'],
  },
  {
    q: { en: 'What kind of role are you looking for?', it: 'Che tipo di ruolo cerchi?' },
    a: { en: 'Software developer roles where Java/Spring Boot backends meet integrations — DocuSign, SAP, Microsoft 365 — and, ideally, AI and RAG.', it: 'Ruoli da sviluppatore software dove i backend Java/Spring Boot incontrano le integrazioni (DocuSign, SAP, Microsoft 365) e, idealmente, l’AI e la RAG.' },
    tags: ['role', 'java', 'docusign', 'rag'],
  },
];
