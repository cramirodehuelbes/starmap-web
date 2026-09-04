import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { projects, clusters, siteContent } from "./projects.js";
import { setupAudio } from "./audio.js";

/* =============================================================
   Boot sequence
   ============================================================= */
const bootLines = [
  "ESTABLISHING UPLINK...",
  "CALIBRATING STAR CHART...",
  "LOCATING WAYPOINTS...",
  "READY.",
];
const bootLog = document.getElementById("boot-log");
const bootBarFill = document.getElementById("boot-bar-fill");
const bootScreen = document.getElementById("boot-screen");
const hud = document.getElementById("hud");

let bootStep = 0;
function runBoot() {
  if (bootStep >= bootLines.length) {
    setTimeout(() => {
      bootScreen.classList.add("fade-out");
      hud.classList.remove("hidden");
      flyToOverview(true);
      setTimeout(() => (bootScreen.style.display = "none"), 900);
    }, 300);
    return;
  }
  const line = document.createElement("div");
  line.textContent = bootLines[bootStep];
  if (bootStep === bootLines.length - 1) line.classList.add("ok");
  bootLog.appendChild(line);
  bootBarFill.style.width = `${((bootStep + 1) / bootLines.length) * 100}%`;
  bootStep++;
  setTimeout(runBoot, 320);
}
setTimeout(runBoot, 260);

/* =============================================================
   Renderer / scene / camera
   ============================================================= */
const canvas = document.getElementById("scene");
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x050711);
scene.fog = new THREE.FogExp2(0x050711, 0.017);

const camera = new THREE.PerspectiveCamera(
  55,
  window.innerWidth / window.innerHeight,
  0.1,
  500
);
const OVERVIEW_POS = new THREE.Vector3(0, 11, 32);
const OVERVIEW_TARGET = new THREE.Vector3(0, 0, 0);
camera.position.copy(OVERVIEW_POS).multiplyScalar(1.8);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.06;
controls.minDistance = 6;
controls.maxDistance = 75;
controls.autoRotate = true;
controls.autoRotateSpeed = 0.25;
controls.target.copy(OVERVIEW_TARGET);

/* Ambient light for node cores; scene is otherwise unlit/emissive */
scene.add(new THREE.AmbientLight(0x8892b8, 0.6));
const keyLight = new THREE.PointLight(0x7b6ef6, 1.2, 60);
keyLight.position.set(-10, 15, 10);
scene.add(keyLight);

/* =============================================================
   Starfield (cheap: one Points object, generated sprite texture)
   ============================================================= */
function makeSoftCircleTexture(size, color) {
  const cvs = document.createElement("canvas");
  cvs.width = cvs.height = size;
  const ctx = cvs.getContext("2d");
  const grad = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  grad.addColorStop(0, color);
  grad.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);
  const tex = new THREE.CanvasTexture(cvs);
  tex.needsUpdate = true;
  return tex;
}

const starTexture = makeSoftCircleTexture(64, "rgba(255,255,255,1)");

// Four-point "sparkle" outline (like ✦) for featured career waypoints,
// built as real geometry (not a raster texture) so its points stay sharp
// at any zoom level instead of blurring like a scaled-up bitmap.
function buildStarShape(outerR, innerR) {
  const shape = new THREE.Shape();
  for (let i = 0; i < 4; i++) {
    const aOuter = (Math.PI / 2) * i - Math.PI / 2;
    const aInner = aOuter + Math.PI / 4;
    const ox = outerR * Math.cos(aOuter);
    const oy = outerR * Math.sin(aOuter);
    const ix = innerR * Math.cos(aInner);
    const iy = innerR * Math.sin(aInner);
    if (i === 0) shape.moveTo(ox, oy);
    else shape.lineTo(ox, oy);
    shape.lineTo(ix, iy);
  }
  shape.closePath();
  return shape;
}
const sparkleOuterGeo = new THREE.ShapeGeometry(buildStarShape(1, 0.22));
const sparkleInnerGeo = new THREE.ShapeGeometry(buildStarShape(1, 0.15));

function buildStarfield(count, radius) {
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    // distribute in a sphere shell, biased outward
    const r = radius * (0.35 + 0.65 * Math.random());
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    positions[i * 3 + 2] = r * Math.cos(phi);
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  const mat = new THREE.PointsMaterial({
    size: 0.55,
    map: starTexture,
    transparent: true,
    depthWrite: false,
    opacity: 0.8,
    color: 0xe7e9f5,
    blending: THREE.AdditiveBlending,
  });
  return new THREE.Points(geo, mat);
}

scene.add(buildStarfield(2600, 140));
scene.add(buildStarfield(900, 60)); // closer, denser layer for parallax feel

/* =============================================================
   Waypoint nodes (one per project)
   ============================================================= */
const nodeGroup = new THREE.Group();
scene.add(nodeGroup);

const nodeMeshes = []; // for raycasting
const glowTextureCache = new Map();

function glowTextureFor(hexColor) {
  if (glowTextureCache.has(hexColor)) return glowTextureCache.get(hexColor);
  const tex = makeSoftCircleTexture(128, hexColor);
  glowTextureCache.set(hexColor, tex);
  return tex;
}

projects.forEach((project) => {
  const group = new THREE.Group();
  group.position.set(project.position.x, project.position.y, project.position.z);

  const featured = !!project.featured;

  // Core sphere
  const core = new THREE.Mesh(
    new THREE.IcosahedronGeometry(0.42, 2),
    new THREE.MeshStandardMaterial({
      color: project.color,
      emissive: project.color,
      emissiveIntensity: featured ? 2.1 : 1.1,
      roughness: 0.35,
      metalness: 0.1,
    })
  );
  core.userData.project = project;
  group.add(core);

  // Soft round glow sprite (billboard, additive) behind everything — this
  // blur is intentional (an ambient halo), unlike the sparkle points below.
  const glow = new THREE.Sprite(
    new THREE.SpriteMaterial({
      map: glowTextureFor(project.color),
      color: project.color,
      transparent: true,
      opacity: featured ? 1 : 0.85,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    })
  );
  const glowScale = featured ? 4.2 : 3.2;
  glow.scale.set(glowScale, glowScale, 1);
  group.add(glow);

  // Four-point sparkle for featured waypoints: real geometry, billboarded
  // to face the camera each frame, so its points stay crisp when zoomed in
  // instead of blurring like a scaled-up texture would.
  let sparkleOuter = null;
  let sparkleInner = null;
  if (featured) {
    sparkleOuter = new THREE.Mesh(
      sparkleOuterGeo,
      new THREE.MeshBasicMaterial({
        color: project.color,
        transparent: true,
        opacity: 0.9,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide,
      })
    );
    sparkleOuter.scale.setScalar(2.6);
    sparkleInner = new THREE.Mesh(
      sparkleInnerGeo,
      new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.95,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide,
      })
    );
    sparkleInner.scale.setScalar(1.3);
    group.add(sparkleOuter);
    group.add(sparkleInner);
  }

  // Thin orbit ring for a "waypoint marker" look
  const ringGeo = new THREE.RingGeometry(0.62, 0.66, 48);
  const ringMat = new THREE.MeshBasicMaterial({
    color: project.color,
    transparent: true,
    opacity: featured ? 0.85 : 0.5,
    side: THREE.DoubleSide,
  });
  const ring = new THREE.Mesh(ringGeo, ringMat);
  ring.userData.baseRotationSpeed = 0.4 + Math.random() * 0.3;
  group.add(ring);

  group.userData.project = project;
  group.userData.ring = ring;
  group.userData.core = core;
  group.userData.glow = glow;
  group.userData.sparkleOuter = sparkleOuter;
  group.userData.sparkleInner = sparkleInner;
  group.userData.featured = featured;
  group.userData.pulsePhase = Math.random() * Math.PI * 2;

  nodeGroup.add(group);
  nodeMeshes.push(core);
});

/* Faint connecting route lines between consecutive waypoints */
if (projects.length > 1) {
  const pts = projects.map((p) => new THREE.Vector3(p.position.x, p.position.y, p.position.z));
  const routeGeo = new THREE.BufferGeometry().setFromPoints(pts);
  const routeMat = new THREE.LineBasicMaterial({
    color: 0x8b90ac,
    transparent: true,
    opacity: 0.25,
  });
  scene.add(new THREE.Line(routeGeo, routeMat));
}

/* =============================================================
   Interaction: hover + click on waypoints
   ============================================================= */
const raycaster = new THREE.Raycaster();
const pointerNDC = new THREE.Vector2();
const tooltip = document.createElement("div");
tooltip.id = "node-tooltip";
tooltip.innerHTML = '<span class="dot">&#9679;</span><span id="tooltip-label"></span>';
document.body.appendChild(tooltip);
const tooltipLabel = tooltip.querySelector("#tooltip-label");

let hoveredNode = null;
let focusedProject = null;
let flying = false;

function updatePointer(event) {
  const x = event.touches ? event.touches[0].clientX : event.clientX;
  const y = event.touches ? event.touches[0].clientY : event.clientY;
  pointerNDC.x = (x / window.innerWidth) * 2 - 1;
  pointerNDC.y = -(y / window.innerHeight) * 2 + 1;
  return { x, y };
}

window.addEventListener("pointermove", (e) => {
  const { x, y } = updatePointer(e);
  raycaster.setFromCamera(pointerNDC, camera);
  const hits = raycaster.intersectObjects(nodeMeshes);
  if (hits.length) {
    const project = hits[0].object.userData.project;
    hoveredNode = project;
    tooltipLabel.textContent = project.name;
    tooltip.style.left = `${x}px`;
    tooltip.style.top = `${y}px`;
    tooltip.classList.add("visible");
    canvas.style.cursor = "pointer";
  } else {
    hoveredNode = null;
    tooltip.classList.remove("visible");
    canvas.style.cursor = "grab";
  }
});

window.addEventListener("pointerdown", (e) => {
  // avoid hijacking drags: only treat as click if pointer barely moved
  const startX = e.clientX, startY = e.clientY;
  const onUp = (upEvent) => {
    const dx = upEvent.clientX - startX;
    const dy = upEvent.clientY - startY;
    if (Math.hypot(dx, dy) < 6 && hoveredNode) {
      selectProject(hoveredNode);
    }
    window.removeEventListener("pointerup", onUp);
  };
  window.addEventListener("pointerup", onUp);
});

/* =============================================================
   Camera flight (simple eased lerp, no extra dependency)
   ============================================================= */
function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function flyCameraTo(targetPos, targetLookAt, duration = 1200) {
  flying = true;
  controls.autoRotate = false;
  const startPos = camera.position.clone();
  const startTarget = controls.target.clone();
  const startTime = performance.now();

  function step(now) {
    const t = Math.min(1, (now - startTime) / duration);
    const e = easeInOutCubic(t);
    camera.position.lerpVectors(startPos, targetPos, e);
    controls.target.lerpVectors(startTarget, targetLookAt, e);
    if (t < 1) {
      requestAnimationFrame(step);
    } else {
      flying = false;
    }
  }
  requestAnimationFrame(step);
}

function flyToOverview(instant = false) {
  focusedProject = null;
  document.getElementById("return-btn").classList.add("hidden");
  closeProjectPanel();
  if (instant) {
    flyCameraTo(OVERVIEW_POS, OVERVIEW_TARGET, 1600);
  } else {
    flyCameraTo(OVERVIEW_POS, OVERVIEW_TARGET, 1100);
    setTimeout(() => (controls.autoRotate = true), 1150);
  }
}

function selectProject(project) {
  focusedProject = project;
  const nodePos = new THREE.Vector3(project.position.x, project.position.y, project.position.z);
  const dir = nodePos.clone().normalize();
  const camPos = nodePos.clone().add(dir.multiplyScalar(5)).add(new THREE.Vector3(0, 1.2, 0));
  flyCameraTo(camPos, nodePos, 1100);
  document.getElementById("return-btn").classList.remove("hidden");
  openProjectPanel(project);
}

/* =============================================================
   HUD wiring: panels, nav, return button, coordinate readout
   ============================================================= */
const projectPanel = document.getElementById("project-panel");
const infoPanel = document.getElementById("info-panel");

function openProjectPanel(project) {
  const imageWrap = document.getElementById("panel-image-wrap");
  const imageEl = document.getElementById("panel-image");
  if (project.image) {
    imageEl.src = project.image;
    imageEl.alt = `${project.name} preview`;
    imageWrap.classList.remove("hidden");
  } else {
    imageEl.removeAttribute("src");
    imageWrap.classList.add("hidden");
  }

  document.getElementById("panel-tag").textContent = project.tag;
  document.getElementById("panel-title").textContent = project.name;
  document.getElementById("panel-role").textContent = project.role;
  document.getElementById("panel-description").textContent = project.description;

  const stackEl = document.getElementById("panel-stack");
  stackEl.innerHTML = "";
  project.stack.forEach((s) => {
    const li = document.createElement("li");
    li.textContent = s;
    stackEl.appendChild(li);
  });

  const linksEl = document.getElementById("panel-links");
  linksEl.innerHTML = "";
  project.links.forEach((l) => {
    const a = document.createElement("a");
    a.href = l.url;
    a.textContent = l.label;
    a.target = "_blank";
    a.rel = "noopener";
    if (!l.primary) a.classList.add("secondary");
    linksEl.appendChild(a);
  });
  if (project.note) {
    const note = document.createElement("p");
    note.id = "panel-note";
    note.textContent = project.note;
    linksEl.appendChild(note);
  }

  infoPanel.classList.remove("open");
  projectPanel.classList.remove("hidden");
  requestAnimationFrame(() => projectPanel.classList.add("open"));
}
function closeProjectPanel() {
  projectPanel.classList.remove("open");
}

document.getElementById("panel-close").addEventListener("click", flyToOverview);
document.getElementById("return-btn").addEventListener("click", flyToOverview);
window.addEventListener("keydown", (e) => {
  if (e.key === "Escape") flyToOverview();
});

function openInfoPanel(key) {
  const data = siteContent[key];
  if (!data) return;
  document.getElementById("info-content").innerHTML = `<h2>${data.heading}</h2>${data.html}`;
  closeProjectPanel();
  infoPanel.classList.remove("hidden");
  requestAnimationFrame(() => infoPanel.classList.add("open"));
}
document.getElementById("info-close").addEventListener("click", () => {
  infoPanel.classList.remove("open");
});
document.querySelectorAll(".hud-link[data-panel]").forEach((btn) => {
  btn.addEventListener("click", () => openInfoPanel(btn.dataset.panel));
});

setupAudio(document.getElementById("sound-toggle"));

const coordReadout = document.getElementById("coord-readout");

/* =============================================================
   Visor sector detection — which project cluster is the camera
   currently looking toward. Compares the camera's forward vector
   against the direction to each cluster's center; the closest
   match (within a threshold) becomes the active sector. A short
   debounce avoids the label flickering near cluster boundaries.
   ============================================================= */
const sectorReadout = document.getElementById("sector-readout");
const sectorLabel = document.getElementById("sector-label");
const SECTOR_DOT_THRESHOLD = 0.9; // cosine similarity; higher = must look more directly at it
const SECTOR_DEBOUNCE_MS = 250;

let currentSector = null;
let pendingSector = undefined; // undefined = "not yet evaluated" so the first frame always sets a baseline
let pendingSince = 0;
const forwardVec = new THREE.Vector3();
const toClusterVec = new THREE.Vector3();

function evaluateSector(now) {
  // While a waypoint is focused, the camera sits right in front of it
  // looking inward — the nearest-by-angle cluster center at that range can
  // easily be a neighboring cluster "behind" the star, not its own. Once a
  // project is selected, its own category is authoritative.
  const candidate = focusedProject
    ? clusters.find((c) => c.id === focusedProject.category) || null
    : (() => {
        camera.getWorldDirection(forwardVec);
        let best = null;
        let bestDot = -Infinity;
        clusters.forEach((cluster) => {
          toClusterVec
            .set(cluster.center.x, cluster.center.y, cluster.center.z)
            .sub(camera.position)
            .normalize();
          const dot = toClusterVec.dot(forwardVec);
          if (dot > bestDot) {
            bestDot = dot;
            best = cluster;
          }
        });
        return bestDot > SECTOR_DOT_THRESHOLD ? best : null;
      })();

  if (candidate !== pendingSector) {
    pendingSector = candidate;
    pendingSince = now;
  }
  if (pendingSector !== currentSector && now - pendingSince > SECTOR_DEBOUNCE_MS) {
    currentSector = pendingSector;
    if (currentSector) {
      sectorLabel.textContent = `SECTOR: ${currentSector.label}`;
      sectorReadout.style.borderColor = currentSector.color;
      sectorReadout.style.color = currentSector.color;
      sectorReadout.classList.add("visible");
    } else {
      sectorReadout.classList.remove("visible");
    }
  }
}

/* =============================================================
   Resize
   ============================================================= */
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

/* =============================================================
   Render loop
   ============================================================= */
const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);
  const t = clock.getElapsedTime();

  nodeGroup.children.forEach((group) => {
    const { ring, core, glow, sparkleOuter, sparkleInner, pulsePhase, featured } = group.userData;
    ring.rotation.z += 0.003 * ring.userData.baseRotationSpeed;
    const pulse = 1 + Math.sin(t * 1.6 + pulsePhase) * (featured ? 0.16 : 0.06);
    core.scale.setScalar(pulse);
    if (featured) {
      // Brightness twinkle so the sparkle reads as "shining."
      glow.material.opacity = 0.85 + Math.sin(t * 2.2 + pulsePhase) * 0.15;
      // Billboard the sparkle geometry to face the camera, then spin it in
      // that facing plane — real geometry, so its points stay sharp on zoom.
      sparkleOuter.quaternion.copy(camera.quaternion);
      sparkleOuter.rotateZ(t * 0.25 + pulsePhase);
      sparkleInner.quaternion.copy(camera.quaternion);
      sparkleInner.rotateZ(t * 0.25 + pulsePhase);
    }
  });

  controls.update();
  renderer.render(scene, camera);
  evaluateSector(performance.now());

  coordReadout.textContent =
    `X ${camera.position.x.toFixed(1).padStart(6, " ")}` +
    `  Y ${camera.position.y.toFixed(1).padStart(6, " ")}` +
    `  Z ${camera.position.z.toFixed(1).padStart(6, " ")}`;
}
animate();
