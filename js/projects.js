// =============================================================
// Content sourced from charlotteramiro.com (home + /projects).
// Projects are grouped into four spatial clusters that mirror her
// site's own categories — Software, Electrical, Research, Misc —
// each with its own waypoint color. Positions are hand-placed so
// each cluster reads as its own region of the map.
//
// CUSTOMIZE ME: edit any entry below, or add/remove waypoints.
// `note` (optional) shows in the panel in place of link buttons —
// useful for projects with no public link (e.g. confidential work).
// `image` (optional) shows as a hero image at the top of the panel —
// path relative to index.html, ideally a 16:9 image. Omit it entirely
// to show no image for that project.
// =============================================================

const COLOR = {
  software: "#7B6EF6", // nebula violet
  electrical: "#F2C879", // star amber
  research: "#5FE3C4", // signal cyan
  misc: "#E8949C", // ember rose
};

export const projects = [
  // ---------- Software cluster ----------
  {
    id: "platfrogs",
    image: "assets/projects/platfrogs.jpg",
    name: "Platfrogs",
    tag: "WAYPOINT 01 — SOFTWARE",
    role: "With a partner · PyGame project",
    description:
      "A vertical platformer starring a frog whose goal is simply to jump as high as possible. Built with a partner using the model-view-controller pattern, mainly as a way to get hands-on with the PyGame library and dig into how classic platformers are put together.",
    stack: ["Python", "PyGame", "MVC design"],
    links: [
      { label: "VISIT WEBSITE", url: "https://olincollege.github.io/PlatFrogerGame/", primary: true },
    ],
    position: { x: -13, y: 4, z: -8 },
    category: "software",
    color: COLOR.software,
  },
  {
    id: "huffman-trees",
    image: "assets/projects/huffman-trees.jpg",
    name: "Huffman Coding & Game Trees",
    tag: "WAYPOINT 02 — SOFTWARE",
    role: "Team research paper",
    description:
      "A team research paper on canonical and standard Huffman coding for lossless data compression, alongside an exploration of minimax game-tree search for tic-tac-toe. Charlotte's focus was the Huffman coding algorithm, including a working Python implementation of the encoder.",
    stack: ["Python", "Algorithms", "Technical writing"],
    links: [{ label: "SEE PAPER", url: "https://charlotteramiro.com/documents/trees.pdf", primary: true }],
    position: { x: -9, y: 5, z: -4 },
    category: "software",
    color: COLOR.software,
  },
  {
    id: "acoustic-modem",
    image: "assets/projects/acoustic-modem.jpg",
    name: "Acoustic Modem Receiver",
    tag: "WAYPOINT 03 — SOFTWARE",
    role: "Team project · MATLAB",
    description:
      "A receiver for an acoustic modem, built in MATLAB. Strings are converted to bits and transmitted as a high-frequency cosine wave; the receiver then decodes and filters the incoming signal back into the original message, with time- and frequency-domain plots of both ends.",
    stack: ["MATLAB", "Signal processing"],
    links: [
      { label: "LINK TO PAPER", url: "documents/modem.pdf", primary: true },
      { label: "GITHUB REPO", url: "https://github.com/lila-smith/acoustic-modem" },
    ],
    position: { x: -12, y: 1, z: -6 },
    category: "software",
    color: COLOR.software,
  },
  {
    id: "streaming-scraper",
    image: "assets/projects/streaming-scraper.jpg",
    name: "Streaming Service Data Analysis",
    tag: "WAYPOINT 04 — SOFTWARE",
    role: "With Gibson Njine · Data science",
    description:
      "A data science project that scores the top five streaming services against a user's own genre and rating preferences, pulling catalog and rating data from the WatchMode API so the comparison scales to a wider audience than just one person's taste.",
    stack: ["Python", "Data science", "WatchMode API"],
    links: [
      {
        label: "LINK TO PAPER",
        url: "https://github.com/olincollege/superior-streaming-service/blob/main/superior-movie-service.ipynb",
        primary: true,
      },
      { label: "GITHUB REPO", url: "https://github.com/olincollege/superior-streaming-service" },
    ],
    position: { x: -10, y: 2, z: -9 },
    category: "software",
    color: COLOR.software,
  },
  {
    id: "speech-to-text-cabin",
    name: "Speech-to-Text Cabin Accessibility Prototype",
    tag: "WAYPOINT 05 — SOFTWARE",
    role: "Boeing · Software & Systems Design Engineer",
    description:
      "Evaluated and integrated an offline AI transcription model for real-time captioning, balancing latency, accuracy, testability, and model size. Built a Speech-to-Text cabin accessibility prototype that was demonstrated live at the Aircraft Interiors Expo.",
    stack: ["Speech-to-text", "AI Model evaluation", "Accessibility"],
    links: [],
    note: "Details limited by employer confidentiality.",
    position: { x: -14, y: -2, z: -4 },
    category: "software",
    color: COLOR.software,
    featured: true,
  },
  {
    id: "cli-tool-777-9",
    name: "777-9 Flight Sciences CLI Tool",
    tag: "WAYPOINT 06 — SOFTWARE",
    role: "Boeing · Software & Systems Design Engineer",
    description:
      "Led development of a Python state-machine CLI tool for managing critical-path workflows on the 777-9 program, backed by a GitLab CI/CD pipeline for automated test evaluation. Demonstrated to Software Engineering and Flight Sciences senior leadership.",
    stack: ["Python", "State machines", "CI/CD", "Pytest"],
    links: [],
    note: "Details limited by employer confidentiality.",
    position: { x: -8, y: -3, z: -8 },
    category: "software",
    color: COLOR.software,
    featured: true,
  },
  {
    id: "supergraph-automation",
    name: "GraphQL Supergraph Automation",
    tag: "WAYPOINT 07 — SOFTWARE",
    role: "Expedia Group · Software Development Engineering Intern",
    description:
      "Reduced supergraph composition time by automating Apollo and AWS service lifecycle management on the platform and gateway management team, improving developer velocity across the platform. Added custom metrics to monitor Node.js project health in DataDog and Splunk.",
    stack: ["Apollo GraphQL", "AWS", "Node.js", "DataDog"],
    links: [],
    note: "Details limited by employer confidentiality.",
    position: { x: -8.5, y: -4, z: -1 },
    category: "software",
    color: COLOR.software,
    featured: true,
  },

  // ---------- Electrical cluster ----------
  {
    id: "dispraille",
    image: "assets/projects/dispraille.jpg",
    name: "Dispraille",
    tag: "WAYPOINT 08 — ELECTRICAL",
    role: "MakeHarvard 2023 · Top Original Prize",
    description:
      "A wearable device that uses OCR to read text in its surroundings and convert it into a 6-pin tactile braille display, letting Deaf-blind users read it letter by letter. Built at MakeHarvard 2023 under a materials-only constraint, which qualified it for — and won — the Original category. Charlotte led the Arduino firmware and OCR integration, plus the electrical and mechanical build.",
    stack: ["Arduino", "C++", "OCR", "Electrical design"],
    links: [{ label: "SEE GITHUB", url: "https://github.com/cramirodehuelbes/dispraille/", primary: true }],
    position: { x: 7, y: 2, z: -6 },
    category: "electrical",
    color: COLOR.electrical,
  },
  {
    id: "sirom-power-transfer",
    name: "SIROM Power-Transfer Testing",
    tag: "WAYPOINT 09 — ELECTRICAL",
    role: "SENER Aerospace · Electrical Engineering Intern",
    description:
      "Designed functional and electrical testing procedures for SIROM, a robotic power-transfer mechanism, interfacing over a CAN Bus system. Built a Python GUI for hardware control and testing, and selected components for spaceflight projects using electrical schematics and datasheets.",
    stack: ["CAN Bus", "Python", "Electrical testing", "Component selection"],
    links: [],
    note: "Details limited by employer confidentiality.",
    position: { x: 13, y: 3, z: -3 },
    category: "electrical",
    color: COLOR.electrical,
    featured: true,
  },
  {
    id: "baristabot",
    image: "assets/projects/baristabot.jpg",
    name: "BaristaBot",
    tag: "WAYPOINT 10 — ELECTRICAL",
    role: "Principles of Integrated Engineering · 6 weeks",
    description:
      "A coffee-making machine combining mechanical, electrical, and software systems, built over six weeks. A servo-driven, three-tier rotating platform carries the cup through creamer, sugar, and coffee-brewing stations, with water heated by an induction coil and a touchscreen letting the user opt in or out of creamer and sugar. Charlotte led project management, electrical and power design, and created the website.",
    stack: ["Electrical design", "Power systems", "Project management"],
    links: [{ label: "VISIT WEBSITE", url: "https://olincollege.github.io/pie-2021-03/BaristaBot/", primary: true }],
    position: { x: 11, y: -1, z: -3 },
    category: "electrical",
    color: COLOR.electrical,
  },
  {
    id: "current-mirror-amp",
    image: "assets/projects/current-mirror-amp.jpg",
    name: "Current-Mirror Differential Amplifier",
    tag: "WAYPOINT 11 — ELECTRICAL",
    role: "Lab investigation · 3 experiments",
    description:
      "A three-part lab investigation comparing a current-mirror differential amplifier to a simple differential amplifier: voltage-transfer characteristics, incremental transconductance/output resistance/gain, and a unity-gain follower configuration tested against both small- and large-amplitude input waves.",
    stack: ["Circuit analysis", "Lab instrumentation"],
    links: [{ label: "LINK TO PAPER", url: "https://charlotteramiro.com/documents/diffamp.pdf", primary: true }],
    position: { x: 9, y: -3, z: -1 },
    category: "electrical",
    color: COLOR.electrical,
  },

  // ---------- Research cluster ----------
  {
    id: "antenna-control-unit",
    name: "Antenna Control Unit",
    tag: "WAYPOINT 12 — RESEARCH",
    role: "OSSTP · Project lead",
    description:
      "Originally a senior capstone project, now carried forward by the OSSTP group to track satellites, demodulate their signals, and support remote control through a user interface. Charlotte leads the project; most technical detail is restricted under confidentiality agreements.",
    stack: ["RF / antenna systems", "Satellite tracking", "Project leadership"],
    links: [],
    note: "Details limited by confidentiality agreements.",
    position: { x: 1, y: 9, z: 5 },
    category: "research",
    color: COLOR.research,
  },
  {
    id: "epfd",
    name: "Equivalent Power Flux Density",
    tag: "WAYPOINT 13 — RESEARCH",
    role: "OSSTP research",
    description:
      "MATLAB software research quantifying interference from non-geostationary (NGSO) satellite communications systems into geostationary (GSO) satellite networks and Earth stations, developed with the OSSTP research group.",
    stack: ["MATLAB", "RF interference modeling"],
    links: [],
    note: "Details limited by confidentiality agreements.",
    position: { x: -2, y: 7, z: 8 },
    category: "research",
    color: COLOR.research,
  },

  // ---------- Misc cluster ----------
  {
    id: "skatemate",
    name: "SkateMate",
    tag: "WAYPOINT 14 — MISC",
    role: "Team project · Fourier analysis",
    description:
      "A Fourier-analysis framework for coaching figure skaters, built from accelerometer data collected by strapping a phone to skaters' feet. Taking the discrete Fourier transform of the motion data across all three axes surfaced trends that separate beginner, intermediate, and advanced skaters.",
    stack: ["Fourier analysis", "Accelerometer data", "Python"],
    links: [{ label: "LINK TO WEBSITE", url: "https://sites.google.com/view/skatemate/home", primary: true }],
    position: { x: -5, y: -8, z: 5 },
    category: "misc",
    color: COLOR.misc,
  },
  {
    id: "handwriting-recognition",
    name: "Handwriting Recognition",
    tag: "WAYPOINT 15 — MISC",
    role: "PCA-based OCR",
    description:
      "A character-recognition system using Principal Component Analysis to detect text in images and translate it into strings automatically — built for travelers and anyone working with non-digital text that would otherwise need to be transcribed by hand.",
    stack: ["Principal Component Analysis", "Python"],
    links: [{ label: "LINK TO PAPER", url: "https://charlotteramiro.com/documents/ocr.pdf", primary: true }],
    position: { x: -1, y: -6, z: 9 },
    category: "misc",
    color: COLOR.misc,
  },
  {
    id: "bio-hopper",
    name: 'Bufflea the Vampire Slayer',
    tag: "WAYPOINT 16 — MISC",
    role: "Bio-inspired mechanical design",
    description:
      "A mechanical hopper modeled on how fleas jump — one of the largest jumps relative to body size in nature. A resilin-like spring compressed between a 'thigh' and 'calf' segment is held down by a suction-cup trigger, then released to launch the hopper into the air.",
    stack: ["Mechanical design", "Bio-inspired engineering"],
    links: [],
    note: "No public writeup linked yet.",
    position: { x: -3, y: -9, z: 8 },
    category: "misc",
    color: COLOR.misc,
  },
];

// Cluster centers are derived from the projects above, not hand-entered —
// move a waypoint's position and its cluster (and the visor's sector
// detection) follow automatically.
const CLUSTER_LABELS = {
  software: "SOFTWARE",
  electrical: "ELECTRICAL",
  research: "RESEARCH",
  misc: "MISCELLANEOUS",
};

export const clusters = Object.entries(
  projects.reduce((acc, p) => {
    if (!acc[p.category]) acc[p.category] = { sum: { x: 0, y: 0, z: 0 }, count: 0, color: p.color };
    acc[p.category].sum.x += p.position.x;
    acc[p.category].sum.y += p.position.y;
    acc[p.category].sum.z += p.position.z;
    acc[p.category].count += 1;
    return acc;
  }, {})
).map(([key, v]) => ({
  id: key,
  label: CLUSTER_LABELS[key] || key.toUpperCase(),
  color: v.color,
  center: { x: v.sum.x / v.count, y: v.sum.y / v.count, z: v.sum.z / v.count },
}));

export const siteContent = {
  about: {
    heading: "About",
    html: `
      <p>Charlotte Ramiro has a B.S. Electrical and Computer Engineering student at Olin College of Engineering, a small engineering school in Needham, Massachusetts. She is currently working at Boeing Commercial Airplanes as a Software & Systems Design Engineer.</p>
      <p>At Olin, Charlotte did satellite research with the <a href="http://osstp.org" target="_blank" rel="noopener">Olin Satellite and Spectrum Technology and Policy</a> (OSSTP) group, working toward a safer, more sustainable space environment — she led the antenna control unit project and contributed to the team's equivalent power-flux density (EPFD) software. She was also an Academic Resource Co-Designer and a course assistant for Software Design at Olin for two years. Previously, she was a Software Development Engineering intern at Expedia, an electrical engineering intern at <a href="https://www.aeroespacial.sener/en" target="_blank" rel="noopener">SENER Aerospace</a>, and a web developer and photographer for <a href="https://www.kyaroassistive.org" target="_blank" rel="noopener">Kyaro Assistive Tech</a>.</p>
      <p>Outside of work, she's usually taking photos, knitting, or practicing with the Olin Fire Arts Club.</p>
      <p><a href="documents/resume.pdf" target="_blank" rel="noopener">Download resume (PDF)</a></p>
    `,
  },
  contact: {
    heading: "Get in touch",
    html: `
      <p>The fastest way to reach me is by email.</p>
      <ul>
        <li>Email — <a href="mailto:carlota.rdh@gmail.com">carlota.rdh@gmail.com</a></li>
        <li>Phone — (781) 366-5485</li>
        <li>GitHub — <a href="https://github.com/cramirodehuelbes" target="_blank" rel="noopener">github.com/cramirodehuelbes</a></li>
        <li>LinkedIn — <a href="https://www.linkedin.com/in/charlotteramiro/" target="_blank" rel="noopener">linkedin.com/in/charlotteramiro</a></li>
        </ul>
    `,
  },
};
