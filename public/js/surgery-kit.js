/**
 * Shared geometry, materials, instruments and motion helpers for the surgery
 * teaching illustrations (`cataract-phaco.html`, `procedures-3d.html`).
 *
 * Same-origin ES module; `three` resolves through each page's import map to
 * the vendored build (no CDN). Everything here is schematic: generic tool
 * silhouettes only, no brands, no dimensions, no numerals on instruments.
 *
 * The eye builder is intentionally self-contained. `eye-viewer.html` has its
 * own, separate eye model; aligning the two is a follow-up.
 */
import * as THREE from "three";

export const clamp = THREE.MathUtils.clamp;
export const lerp = THREE.MathUtils.lerp;

export const smooth = (value) => {
  const x = clamp(value, 0, 1);
  return x * x * (3 - 2 * x);
};

/** Smooth 0..1 ramp of `p` between `a` and `b`. */
export const phase = (p, a, b) => smooth((p - a) / (b - a));

export const REDUCED_MOTION =
  typeof matchMedia === "function" &&
  matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Small deterministic hand tremor (scene units). Off for reduced motion. */
export function tremor(t, amplitude) {
  if (REDUCED_MOTION) return 0;
  return amplitude * (Math.sin(t * 37.1) * 0.6 + Math.sin(t * 61.7 + 1.3) * 0.4);
}

// ---------------------------------------------------------------------------
// Stage timing
// ---------------------------------------------------------------------------

/** Scale weights so their mean is 1 (total playback time is unchanged). */
export function normalizeWeights(weights) {
  const mean = weights.reduce((a, b) => a + b, 0) / weights.length;
  return weights.map((w) => w / mean);
}

/** Tab-session key for the shared surgery timeline speed select. */
const PLAYBACK_SPEED_KEY = "eyesinfo.surgery.playbackSpeed";

/**
 * Restore / persist the speed select for this tab session.
 * Options stay in the HTML (0.5×–4×); this only remembers the choice.
 */
export function bindPlaybackSpeed(select) {
  if (!(select instanceof HTMLSelectElement)) return;
  try {
    const saved = sessionStorage.getItem(PLAYBACK_SPEED_KEY);
    if (saved && [...select.options].some((option) => option.value === saved)) {
      select.value = saved;
    }
  } catch {
    /* private mode / blocked storage */
  }
  select.addEventListener("change", () => {
    try {
      sessionStorage.setItem(PLAYBACK_SPEED_KEY, select.value);
    } catch {
      /* ignore */
    }
  });
}

/**
 * Advance stage-indexed progress by `stages` base-stage units, giving each
 * stage `weights[s]` times the base duration. Progress stays stage-indexed,
 * so setProgress, the slider and step buttons keep working.
 */
export function advanceProgress(progress, stages, weights) {
  const total = weights.length;
  let p = progress;
  let remaining = stages;
  while (remaining > 1e-9 && p < total) {
    const s = Math.min(Math.floor(p + 1e-9), total - 1);
    const w = weights[s];
    const cost = (s + 1 - p) * w;
    if (remaining < cost) {
      p += remaining / w;
      remaining = 0;
    } else {
      p = s + 1;
      remaining -= cost;
    }
  }
  return Math.min(p, total);
}

// ---------------------------------------------------------------------------
// Materials
// ---------------------------------------------------------------------------

const envUsers = [];
let envTexture = null;

function registerEnv(material, intensity = 1) {
  material.envMapIntensity = intensity;
  envUsers.push(material);
  if (envTexture) {
    material.envMap = envTexture;
    material.needsUpdate = true;
  }
  return material;
}

/**
 * Translucent / opaque tissue. `fresnel > 0` brightens (and slightly
 * opacifies) grazing edges so thin shells keep a readable outline.
 */
export function tissue(color, opacity = 1, options = {}) {
  const {
    fresnel = 0,
    rim = 0xffffff,
    roughness = 0.4,
    metalness = 0,
    ...extra
  } = options;

  const material = new THREE.MeshStandardMaterial({
    color,
    opacity,
    transparent: opacity < 1,
    depthWrite: opacity >= 1,
    roughness,
    metalness,
    side: THREE.DoubleSide,
    ...extra,
  });

  if (fresnel > 0) {
    const uniform = { value: fresnel };
    const rimColor = { value: new THREE.Color(rim) };
    material.userData.rimStrength = uniform;
    material.onBeforeCompile = (shader) => {
      shader.uniforms.uRimK = uniform;
      shader.uniforms.uRimColor = rimColor;
      shader.fragmentShader = shader.fragmentShader
        .replace(
          "#include <common>",
          "#include <common>\nuniform float uRimK;\nuniform vec3 uRimColor;"
        )
        .replace(
          "#include <opaque_fragment>",
          `float rimF = pow(1.0 - saturate(abs(dot(normalize(normal), normalize(vViewPosition)))), 3.0);
outgoingLight += uRimColor * rimF * uRimK;
diffuseColor.a = clamp(diffuseColor.a + rimF * uRimK * 0.55, 0.0, 1.0);
#include <opaque_fragment>`
        );
    };
    material.customProgramCacheKey = () => "surgery-rim-v1";
  }
  return material;
}

export function metal(color = 0xd3dce6, roughness = 0.24) {
  return registerEnv(
    new THREE.MeshStandardMaterial({ color, metalness: 1, roughness }),
    1
  );
}

export function plastic(color, roughness = 0.5) {
  return new THREE.MeshStandardMaterial({ color, roughness, metalness: 0.05 });
}

export function clearPlastic(color = 0xc9e6f2, opacity = 0.38) {
  const m = new THREE.MeshStandardMaterial({
    color,
    roughness: 0.12,
    metalness: 0,
    transparent: true,
    opacity,
    depthWrite: false,
    side: THREE.DoubleSide,
  });
  return registerEnv(m, 0.7);
}

/**
 * Small procedural "studio" environment for metals (PMREM, core three).
 * Call once after the renderer exists. Safe to call before or after
 * materials are created.
 */
export function installEnvironment(renderer) {
  if (envTexture) return envTexture;
  const envScene = new THREE.Scene();

  const sphere = new THREE.SphereGeometry(10, 32, 16);
  const colors = [];
  const top = new THREE.Color(0xeaf6ff);
  const mid = new THREE.Color(0x6f8dad);
  const bottom = new THREE.Color(0x2c3d55);
  const c = new THREE.Color();
  const position = sphere.attributes.position;
  for (let i = 0; i < position.count; i++) {
    const y = position.getY(i) / 10;
    if (y > 0) c.copy(mid).lerp(top, Math.pow(y, 0.8));
    else c.copy(mid).lerp(bottom, Math.pow(-y, 0.7));
    colors.push(c.r, c.g, c.b);
  }
  sphere.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
  envScene.add(
    new THREE.Mesh(
      sphere,
      new THREE.MeshBasicMaterial({ vertexColors: true, side: THREE.BackSide })
    )
  );

  const panel = (w, h, pos, scalar) => {
    const m = new THREE.Mesh(
      new THREE.PlaneGeometry(w, h),
      new THREE.MeshBasicMaterial({
        color: new THREE.Color().setScalar(scalar),
        side: THREE.DoubleSide,
      })
    );
    m.position.set(...pos);
    m.lookAt(0, 0, 0);
    envScene.add(m);
  };
  panel(7, 4, [4, 6, 7], 7);
  panel(3, 6, [-8, 2, 3], 2.6);
  panel(6, 2, [0, -4, 6], 1.6);

  const pmrem = new THREE.PMREMGenerator(renderer);
  envTexture = pmrem.fromScene(envScene, 0.03).texture;
  pmrem.dispose();
  envScene.traverse((o) => {
    if (o.isMesh) {
      o.geometry.dispose();
      o.material.dispose();
    }
  });

  for (const m of envUsers) {
    m.envMap = envTexture;
    m.needsUpdate = true;
  }
  return envTexture;
}

// ---------------------------------------------------------------------------
// Procedural textures (CanvasTexture; allowed by img-src data: blob:)
// ---------------------------------------------------------------------------

function seededRandom(seed) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

function canvasTexture(width, height, draw, repeatU = false) {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  draw(canvas.getContext("2d"), width, height);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
  if (repeatU) texture.wrapS = THREE.RepeatWrapping;
  return texture;
}

/** Polar iris map: u = angle, v = 0 at the pupil margin, 1 at the limbus. */
export function irisTexture() {
  return canvasTexture(
    512,
    128,
    (g, w, h) => {
      const rand = seededRandom(7);
      const base = g.createLinearGradient(0, h, 0, 0);
      base.addColorStop(0, "#4a3220");
      base.addColorStop(0.12, "#8a6540");
      base.addColorStop(0.38, "#b8895a");
      base.addColorStop(0.7, "#8e6842");
      base.addColorStop(1, "#4b3524");
      g.fillStyle = base;
      g.fillRect(0, 0, w, h);
      for (let i = 0; i < 900; i++) {
        const x = rand() * w;
        const y0 = h * (0.02 + rand() * 0.3);
        const y1 = y0 + h * (0.25 + rand() * 0.6);
        g.strokeStyle =
          rand() > 0.5
            ? `rgba(235,200,150,${0.05 + rand() * 0.16})`
            : `rgba(40,24,12,${0.08 + rand() * 0.2})`;
        g.lineWidth = 0.6 + rand() * 1.4;
        g.beginPath();
        g.moveTo(x, y0);
        g.lineTo(x + (rand() - 0.5) * 6, Math.min(h, y1));
        g.stroke();
      }
      g.strokeStyle = "rgba(240,215,170,.5)";
      g.lineWidth = 3;
      g.beginPath();
      for (let x = 0; x <= w; x += 8) {
        const y = h * 0.62 + Math.sin(x * 0.2) * 4 + (rand() - 0.5) * 3;
        if (x === 0) g.moveTo(x, y);
        else g.lineTo(x, y);
      }
      g.stroke();
    },
    true
  );
}

/** Pale sclera with a few faint vessels (u = around, v = along the profile). */
export function scleraTexture() {
  return canvasTexture(
    512,
    256,
    (g, w, h) => {
      const rand = seededRandom(23);
      g.fillStyle = "#f1ece6";
      g.fillRect(0, 0, w, h);
      g.lineCap = "round";
      for (let i = 0; i < 46; i++) {
        let x = rand() * w;
        let y = h * (0.55 + rand() * 0.45);
        g.strokeStyle = `rgba(190,70,70,${0.12 + rand() * 0.2})`;
        g.lineWidth = 0.8 + rand() * 1.2;
        g.beginPath();
        g.moveTo(x, y);
        for (let k = 0; k < 9; k++) {
          x += (rand() - 0.5) * 14;
          y -= 4 + rand() * 10;
          g.lineTo(x, y);
        }
        g.stroke();
      }
    },
    true
  );
}

/** Tarsal plate: warm base with soft vertical gland streaks. */
export function tarsusTexture() {
  return canvasTexture(256, 128, (g, w, h) => {
    g.fillStyle = "#dcc7ad";
    g.fillRect(0, 0, w, h);
    const rand = seededRandom(41);
    for (let i = 0; i < 24; i++) {
      const x = (i + 0.5) * (w / 24) + (rand() - 0.5) * 3;
      const grad = g.createLinearGradient(0, 0, 0, h);
      grad.addColorStop(0, "rgba(240,206,130,0)");
      grad.addColorStop(0.18, "rgba(240,206,130,.75)");
      grad.addColorStop(0.82, "rgba(240,206,130,.75)");
      grad.addColorStop(1, "rgba(240,206,130,0)");
      g.strokeStyle = grad;
      g.lineWidth = 3 + rand() * 2;
      g.beginPath();
      g.moveTo(x, h * 0.05);
      g.lineTo(x + (rand() - 0.5) * 3, h * 0.95);
      g.stroke();
    }
  });
}

export function skinTexture() {
  return canvasTexture(128, 128, (g, w, h) => {
    const rand = seededRandom(5);
    g.fillStyle = "#e0ab9c";
    g.fillRect(0, 0, w, h);
    for (let i = 0; i < 900; i++) {
      g.fillStyle = `rgba(150,80,70,${rand() * 0.08})`;
      g.fillRect(rand() * w, rand() * h, 1.5, 1.5);
    }
  });
}

/** Soft radial glow (for light-pipe highlights). */
export function glowTexture() {
  return canvasTexture(128, 128, (g, w, h) => {
    const grad = g.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w / 2);
    grad.addColorStop(0, "rgba(255,246,214,1)");
    grad.addColorStop(0.35, "rgba(255,236,170,.45)");
    grad.addColorStop(1, "rgba(255,230,150,0)");
    g.fillStyle = grad;
    g.fillRect(0, 0, w, h);
  });
}

// ---------------------------------------------------------------------------
// Geometry helpers
// ---------------------------------------------------------------------------

/** Lathe about +Z from (r, z) profile points. */
function latheMesh(points, material, segments = 56) {
  const mesh = new THREE.Mesh(
    new THREE.LatheGeometry(
      points.map(([r, z]) => new THREE.Vector2(r, z)),
      segments
    ),
    material
  );
  mesh.rotation.x = Math.PI / 2;
  return mesh;
}

function bezier(p0, p1, p2, p3, t) {
  const u = 1 - t;
  return [
    u * u * u * p0[0] + 3 * u * u * t * p1[0] + 3 * u * t * t * p2[0] + t * t * t * p3[0],
    u * u * u * p0[1] + 3 * u * u * t * p1[1] + 3 * u * t * t * p2[1] + t * t * t * p3[1],
  ];
}

/** Tapered, bendable tube (for lashes etc.). */
export function taperedTubeGeometry(points, r0, r1, radial = 5, segments = 6) {
  const curve = new THREE.CatmullRomCurve3(points.map((p) => new THREE.Vector3(...p)));
  const frames = curve.computeFrenetFrames(segments, false);
  const positions = [];
  const indices = [];
  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    const p = curve.getPoint(t);
    const r = lerp(r0, r1, t);
    for (let j = 0; j < radial; j++) {
      const a = (j / radial) * Math.PI * 2;
      const v = frames.normals[i].clone().multiplyScalar(Math.cos(a))
        .addScaledVector(frames.binormals[i], Math.sin(a));
      positions.push(p.x + v.x * r, p.y + v.y * r, p.z + v.z * r);
    }
  }
  for (let i = 0; i < segments; i++) {
    for (let j = 0; j < radial; j++) {
      const a = i * radial + j;
      const b = i * radial + ((j + 1) % radial);
      const c = a + radial;
      const d = b + radial;
      indices.push(a, c, b, b, c, d);
    }
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
}

// ---------------------------------------------------------------------------
// Eye (anterior segment + globe). Axis +Z anterior.
// ---------------------------------------------------------------------------

/**
 * Anterior-segment-aware eye shell.
 *
 * sclera: sphere (postR, centred at postZ) from the posterior pole to
 *   `arcEnd` radians, optionally blended to the limbus with a cubic bezier.
 * cornea: elliptical cap from the limbus to `apexZ`.
 * iris: cone-shaped ring with a polar texture; `setPupil(r)` dilates it.
 * lens: optional biconvex lens (procedures page; the cataract page owns its
 *   own capsule / nucleus models).
 */
export function buildEye(o) {
  const {
    postR, postZ, arcEnd, bridge = null,
    limbus: [limbusR, limbusZ],
    apexZ,
    irisOuter, irisZMargin, irisZOuter, pupil = 0.5,
    irisOpacity = 0.3, scleraOpacity = 0.12, corneaOpacity = 0.1,
    lens = null,
  } = o;

  const group = new THREE.Group();

  const profile = [];
  const arcSteps = 24;
  for (let i = 0; i <= arcSteps; i++) {
    const a = (arcEnd * i) / arcSteps;
    profile.push([postR * Math.sin(a), postZ - postR * Math.cos(a)]);
  }
  if (bridge) {
    for (let i = 1; i <= 8; i++) profile.push(bezier(...bridge, i / 8));
  }

  const scleraMat = tissue(0xffffff, scleraOpacity, {
    fresnel: 0.55, rim: 0xcfe4f7, roughness: 0.55, map: scleraTexture(),
  });
  const sclera = latheMesh(profile, scleraMat);
  group.add(sclera);

  const corneaProfile = [];
  for (let i = 0; i <= 12; i++) {
    const t = (i / 12) * (Math.PI / 2);
    corneaProfile.push([limbusR * Math.cos(t), limbusZ + (apexZ - limbusZ) * Math.sin(t)]);
  }
  const corneaMat = tissue(0x9fdcff, corneaOpacity, {
    fresnel: 0.4, rim: 0xe6f6ff, roughness: 0.08,
  });
  const cornea = latheMesh(corneaProfile, corneaMat);
  cornea.renderOrder = 6;
  group.add(cornea);

  const limbusRing = new THREE.Mesh(
    new THREE.TorusGeometry(limbusR, 0.03, 6, 64),
    tissue(0xb7cde0, 0.5)
  );
  limbusRing.position.z = limbusZ;
  group.add(limbusRing);

  // Iris: polar-mapped cone ring.
  const segments = 64;
  const rings = 4;
  const irisPositions = new Float32Array((rings + 1) * (segments + 1) * 3);
  const irisUvs = new Float32Array((rings + 1) * (segments + 1) * 2);
  const irisIndex = [];
  for (let j = 0; j < rings; j++) {
    for (let i = 0; i < segments; i++) {
      const a = j * (segments + 1) + i;
      const b = a + segments + 1;
      irisIndex.push(a, b, a + 1, b, b + 1, a + 1);
    }
  }
  const irisGeometry = new THREE.BufferGeometry();
  irisGeometry.setAttribute("position", new THREE.BufferAttribute(irisPositions, 3));
  irisGeometry.setAttribute("uv", new THREE.BufferAttribute(irisUvs, 2));
  irisGeometry.setIndex(irisIndex);

  const irisMat = tissue(0xffffff, irisOpacity, {
    map: irisTexture(), roughness: 0.6,
  });
  const iris = new THREE.Mesh(irisGeometry, irisMat);
  group.add(iris);

  const pupilEdge = new THREE.Mesh(
    new THREE.TorusGeometry(1, 0.02, 6, 56),
    tissue(0xe3bd84, 0.7)
  );
  group.add(pupilEdge);

  let currentPupil = -1;
  function setPupil(radius) {
    if (Math.abs(radius - currentPupil) < 1e-4) return;
    currentPupil = radius;
    for (let j = 0; j <= rings; j++) {
      const f = j / rings;
      const r = lerp(radius, irisOuter, f);
      const z = lerp(irisZMargin, irisZOuter, Math.pow(f, 0.85));
      for (let i = 0; i <= segments; i++) {
        const a = (i / segments) * Math.PI * 2;
        const k = j * (segments + 1) + i;
        irisPositions[k * 3] = r * Math.cos(a);
        irisPositions[k * 3 + 1] = r * Math.sin(a);
        irisPositions[k * 3 + 2] = z;
        irisUvs[k * 2] = i / segments;
        irisUvs[k * 2 + 1] = f;
      }
    }
    irisGeometry.attributes.position.needsUpdate = true;
    irisGeometry.attributes.uv.needsUpdate = true;
    irisGeometry.computeVertexNormals();
    irisGeometry.computeBoundingSphere();
    pupilEdge.scale.set(radius, radius, radius);
    pupilEdge.position.z = irisZMargin + 0.004;
  }
  setPupil(pupil);

  let lensMesh = null;
  if (lens) {
    const { r, z, front, back } = lens;
    const pts = [];
    for (let i = 0; i <= 10; i++) {
      const t = (i / 10) * (Math.PI / 2);
      pts.push([r * Math.sin(t), z - back * Math.cos(t)]);
    }
    for (let i = 9; i >= 0; i--) {
      const t = (i / 10) * (Math.PI / 2);
      pts.push([r * Math.sin(t), z + front * Math.cos(t)]);
    }
    lensMesh = latheMesh(
      pts,
      tissue(0xeac28a, 0.45, { fresnel: 0.5, rim: 0xfff0d0, roughness: 0.3 }),
      40
    );
    group.add(lensMesh);
  }

  const anterior = [cornea, limbusRing, iris, pupilEdge];
  if (lensMesh) anterior.push(lensMesh);

  return {
    group, sclera, scleraMat, cornea, corneaMat,
    limbus: limbusRing, iris, irisMat, pupilEdge, lens: lensMesh,
    setPupil, anterior,
  };
}

// ---------------------------------------------------------------------------
// Instruments
// ---------------------------------------------------------------------------

const Y_AXIS = new THREE.Vector3(0, 1, 0);

let shared = null;
function sharedMaterials() {
  if (shared) return shared;
  shared = {
    steel: metal(0xd6dee8, 0.22),
    satin: metal(0xaebccb, 0.42),
    dark: plastic(0x27374a, 0.5),
    slate: plastic(0x4b6a82, 0.45),
    teal: plastic(0x3f7f93, 0.45),
    clear: clearPlastic(0xc9e6f2, 0.38),
    sleeve: clearPlastic(0x78b8d6, 0.5),
    silicone: clearPlastic(0x9fe0d0, 0.55),
    glow: new THREE.MeshStandardMaterial({
      color: 0xd9ffd0, emissive: 0x7dff6a, emissiveIntensity: 1.2, roughness: 0.4,
    }),
    lightTip: new THREE.MeshStandardMaterial({
      color: 0xfff4d6, emissive: 0xffe9a8, emissiveIntensity: 1.1, roughness: 0.4,
    }),
  };
  return shared;
}

/** Cylinder between y0 and y1 along +Y (bottom radius rb, top radius rt). */
function cyl(parent, rb, rt, y0, y1, material, radial = 14) {
  const mesh = new THREE.Mesh(
    new THREE.CylinderGeometry(rt, rb, y1 - y0, radial),
    material
  );
  mesh.position.y = (y0 + y1) / 2;
  parent.add(mesh);
  return mesh;
}

function blade(parent, shapePoints, thickness, material) {
  const shape = new THREE.Shape();
  shapePoints.forEach(([x, y], i) => (i ? shape.lineTo(x, y) : shape.moveTo(x, y)));
  shape.closePath();
  const geometry = new THREE.ExtrudeGeometry(shape, { depth: thickness, bevelEnabled: false });
  geometry.translate(0, 0, -thickness / 2);
  const mesh = new THREE.Mesh(geometry, material);
  parent.add(mesh);
  return mesh;
}

/**
 * Generic instrument silhouettes. Local frame: origin at the working tip,
 * +Y runs along the shaft toward the handle. Kinds:
 * keratome, cannula, cystitome, phaco, ia, injector, scalpel, curette,
 * needle, cutter, softTip, laser, lightPipe.
 */
export function createInstrument(kind, options = {}) {
  const M = sharedMaterials();
  const root = new THREE.Group();
  const api = {};

  switch (kind) {
    case "keratome": {
      blade(root, [[0, 0], [0.05, 0.1], [0.05, 0.3], [-0.05, 0.3], [-0.05, 0.1]], 0.008, M.steel);
      cyl(root, 0.016, 0.016, 0.3, 0.9, M.steel);
      cyl(root, 0.05, 0.06, 0.9, 2.0, M.slate);
      break;
    }
    case "cannula": {
      const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.024, 12, 8), M.steel);
      root.add(bulb);
      cyl(root, 0.015, 0.017, 0, 0.9, M.steel);
      cyl(root, 0.017, 0.05, 0.9, 1.0, M.clear);
      cyl(root, 0.085, 0.085, 1.0, 1.8, M.clear, 20);
      cyl(root, 0.02, 0.02, 1.8, 2.3, M.satin);
      cyl(root, 0.08, 0.08, 2.3, 2.34, M.dark, 20);
      break;
    }
    case "cystitome": {
      cyl(root, 0.011, 0.011, 0.05, 0.9, M.steel, 10);
      const hook = cyl(root, 0.005, 0.011, 0, 0.08, M.steel, 8);
      hook.rotation.z = 0.7;
      hook.position.set(-0.025, 0.03, 0);
      cyl(root, 0.045, 0.05, 0.9, 2.0, M.slate);
      break;
    }
    case "phaco": {
      cyl(root, 0.004, 0.02, 0, 0.07, M.steel, 12);
      cyl(root, 0.02, 0.02, 0.07, 0.3, M.steel, 12);
      cyl(root, 0.042, 0.042, 0.1, 0.72, M.sleeve, 16);
      cyl(root, 0.05, 0.08, 0.72, 0.95, M.satin, 18);
      cyl(root, 0.08, 0.11, 0.95, 1.55, M.slate, 20);
      cyl(root, 0.11, 0.09, 1.55, 1.7, M.dark, 20);
      cyl(root, 0.03, 0.03, 1.7, 2.1, M.dark, 10);
      break;
    }
    case "ia": {
      cyl(root, 0.03, 0.03, 0, 0.72, M.sleeve, 14);
      cyl(root, 0.014, 0.014, 0, 0.72, M.steel, 10);
      const port = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.022, 0.012), M.dark);
      port.position.set(0, 0.04, 0.03);
      root.add(port);
      cyl(root, 0.04, 0.065, 0.72, 0.95, M.satin, 16);
      cyl(root, 0.065, 0.075, 0.95, 1.8, M.teal, 18);
      cyl(root, 0.025, 0.025, 1.8, 2.2, M.dark, 10);
      break;
    }
    case "injector": {
      cyl(root, 0.034, 0.07, 0, 0.45, M.clear, 16);
      cyl(root, 0.095, 0.095, 0.45, 1.35, M.clear, 20);
      cyl(root, 0.028, 0.028, 0.45, 1.75, M.satin, 10);
      cyl(root, 0.1, 0.1, 1.75, 1.8, M.dark, 20);
      break;
    }
    case "scalpel": {
      blade(root, [[0, 0], [0.045, 0.07], [0.04, 0.3], [-0.04, 0.3], [-0.045, 0.07]], 0.006, M.steel);
      cyl(root, 0.02, 0.03, 0.3, 0.55, M.steel, 10);
      cyl(root, 0.035, 0.055, 0.55, 1.7, M.slate);
      break;
    }
    case "curette": {
      const loop = new THREE.Mesh(new THREE.TorusGeometry(0.07, 0.013, 8, 28), M.steel);
      loop.rotation.y = Math.PI / 2;
      loop.position.set(0, 0.065, 0);
      root.add(loop);
      cyl(root, 0.017, 0.017, 0.13, 1.0, M.steel, 10);
      cyl(root, 0.04, 0.055, 1.0, 2.0, M.slate);
      break;
    }
    case "needle": {
      const L = options.length ?? 0.38;
      const barrelLength = options.barrel ?? 0.55;
      cyl(root, 0.0, 0.011, 0, 0.04, M.steel, 10);
      cyl(root, 0.011, 0.011, 0.04, L, M.steel, 10);
      cyl(root, 0.011, 0.036, L, L + 0.07, M.clear, 14);
      const b0 = L + 0.07;
      const b1 = b0 + barrelLength;
      cyl(root, 0.075, 0.075, b0, b1, M.clear, 22);
      const flange = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.025, 0.1), M.satin);
      flange.position.y = b1 + 0.01;
      root.add(flange);
      const plunger = new THREE.Group();
      root.add(plunger);
      cyl(plunger, 0.02, 0.02, b0 + 0.05, b1 + 0.5, M.satin, 10);
      cyl(plunger, 0.09, 0.09, b1 + 0.5, b1 + 0.54, M.dark, 20);
      api.plunger = plunger;
      api.setPlunger = (t) => { plunger.position.y = -0.3 * clamp(t, 0, 1); };
      break;
    }
    case "cutter": {
      const tip = new THREE.Mesh(new THREE.SphereGeometry(0.021, 12, 8), M.steel);
      root.add(tip);
      cyl(root, 0.021, 0.021, 0, 0.92, M.steel, 12);
      const port = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.05, 0.016), M.dark);
      port.position.set(0, 0.04, 0.016);
      root.add(port);
      cyl(root, 0.05, 0.075, 0.92, 1.1, M.satin, 16);
      cyl(root, 0.075, 0.075, 1.1, 1.9, M.slate, 18);
      cyl(root, 0.025, 0.025, 1.9, 2.3, M.dark, 8);
      break;
    }
    case "softTip": {
      cyl(root, 0.018, 0.018, 0, 0.16, M.silicone, 12);
      cyl(root, 0.018, 0.018, 0.16, 0.92, M.steel, 12);
      cyl(root, 0.05, 0.07, 0.92, 1.05, M.satin, 16);
      cyl(root, 0.07, 0.07, 1.05, 1.85, M.teal, 18);
      cyl(root, 0.025, 0.025, 1.85, 2.25, M.dark, 8);
      break;
    }
    case "laser": {
      const dot = new THREE.Mesh(new THREE.SphereGeometry(0.02, 10, 8), M.glow);
      root.add(dot);
      cyl(root, 0.017, 0.017, 0, 0.92, M.steel, 12);
      cyl(root, 0.045, 0.06, 0.92, 1.05, M.satin, 16);
      cyl(root, 0.06, 0.06, 1.05, 1.9, M.dark, 18);
      cyl(root, 0.02, 0.02, 1.9, 2.4, M.dark, 8);
      break;
    }
    case "lightPipe": {
      const tip = new THREE.Mesh(new THREE.SphereGeometry(0.03, 12, 8), M.lightTip);
      root.add(tip);
      cyl(root, 0.016, 0.016, 0, 0.92, M.steel, 12);
      cyl(root, 0.05, 0.065, 0.92, 1.05, M.satin, 16);
      cyl(root, 0.065, 0.065, 1.05, 1.7, M.dark, 18);
      cyl(root, 0.02, 0.02, 1.7, 2.1, M.dark, 8);
      break;
    }
    default:
      throw new Error(`Unknown instrument: ${kind}`);
  }

  return { kind, root, ...api };
}

/** Trocar cannula: hub outside, short tube through the wall. Local +Y = outward. */
export function createTrocar({ inner = 0.14, outer = 0.22, tubing = false } = {}) {
  const M = sharedMaterials();
  const root = new THREE.Group();
  cyl(root, 0.034, 0.034, -inner, outer, M.satin, 14);
  cyl(root, 0.07, 0.07, outer - 0.03, outer + 0.03, M.slate, 18);
  if (tubing) {
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0.0, outer + 0.03, 0),
      new THREE.Vector3(0.05, outer + 0.25, 0.04),
      new THREE.Vector3(0.28, outer + 0.38, 0.12),
      new THREE.Vector3(0.7, outer + 0.4, 0.2),
    ]);
    root.add(new THREE.Mesh(new THREE.TubeGeometry(curve, 20, 0.022, 8), M.clear));
  }
  return root;
}

/** Chalazion clamp: ring (conjunctival side) + plate (skin side) + arms + screw. */
export function createChalazionClamp({ ringRadius = 0.27, reachX = 1.55, ringZ = -0.075, plateZ = 0.09 } = {}) {
  const M = sharedMaterials();
  const root = new THREE.Group();

  const ringGroup = new THREE.Group();
  const plateGroup = new THREE.Group();
  root.add(ringGroup, plateGroup);

  const ring = new THREE.Mesh(new THREE.TorusGeometry(ringRadius, 0.03, 10, 48), M.steel);
  ringGroup.add(ring);

  const plate = new THREE.Mesh(
    new THREE.CylinderGeometry(ringRadius * 0.92, ringRadius * 0.92, 0.04, 40),
    M.steel
  );
  plate.rotation.x = Math.PI / 2;
  plateGroup.add(plate);

  const arm = (target, zStart, zEnd, group) => {
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(ringRadius, 0, 0),
      new THREE.Vector3(ringRadius + 0.35, 0, (zEnd - zStart) * 0.25),
      new THREE.Vector3(ringRadius + 0.9, 0, (zEnd - zStart) * 0.7),
      new THREE.Vector3(target, 0, zEnd - zStart),
    ]);
    group.add(new THREE.Mesh(new THREE.TubeGeometry(curve, 24, 0.026, 8), M.steel));
  };
  arm(reachX, ringZ, ringZ - 0.34, ringGroup);
  arm(reachX, plateZ, plateZ, plateGroup);

  const post = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 1, 10), M.steel);
  root.add(post);

  const screwBase = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.2, 12), M.satin);
  screwBase.rotation.x = Math.PI / 2;
  const knob = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.05, 20), M.slate);
  knob.rotation.x = Math.PI / 2;
  root.add(screwBase, knob);

  /** closed: 0 (open, jaws apart) .. 1 (closed). */
  function setClosed(closed) {
    const gap = 0.55 * (1 - closed);
    ringGroup.position.set(0, 0, ringZ - gap);
    plateGroup.position.set(0, 0, plateZ + gap);
    const zBottom = ringZ - gap - 0.34;
    const zTop = plateZ + gap;
    post.position.set(reachX, 0, (zBottom + zTop) / 2);
    post.scale.y = zTop - zBottom;
    post.rotation.x = Math.PI / 2;
    screwBase.position.set(reachX - 0.28, 0, plateZ + gap + 0.1);
    knob.position.set(reachX - 0.28, 0, plateZ + gap + 0.22);
  }
  setClosed(1);

  return { root, setClosed, ringZ, plateZ };
}

// ---------------------------------------------------------------------------
// Instrument pose and path helpers
// ---------------------------------------------------------------------------

const _a = new THREE.Vector3();
const _q = new THREE.Quaternion();

/**
 * Axis (tip -> handle) for a tool pivoting at `fulcrum`. Outside or at the
 * wound the tool keeps the wound axis (`outward`); as the tip goes deeper the
 * shaft swings to pass through the fulcrum. Never a zero-length direction.
 */
export function fulcrumAxis(out, tip, fulcrum, outward, blend = 0.45) {
  _a.copy(fulcrum).sub(tip);
  const len = _a.length();
  if (len < 1e-5) return out.copy(outward);
  const inside = _a.dot(outward);
  const k = smooth(inside / blend);
  _a.divideScalar(len);
  return out.copy(outward).lerp(_a, k).normalize();
}

/** Place an instrument so its tip is at `tip` and +Y points along `axis`. */
export function placeInstrument(instrument, tip, axis, roll = 0) {
  instrument.root.position.copy(tip);
  instrument.root.quaternion.setFromUnitVectors(Y_AXIS, axis);
  if (roll) instrument.root.quaternion.multiply(_q.setFromAxisAngle(Y_AXIS, roll));
}

const _pts = [new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3()];
const _w0 = new THREE.Vector3();
const _w1 = new THREE.Vector3();

function polyline(out, points, s) {
  let remaining = s;
  for (let i = 0; i < points.length - 1; i++) {
    const d = points[i].distanceTo(points[i + 1]);
    if (remaining <= d || i === points.length - 2) {
      return out.lerpVectors(points[i], points[i + 1], d > 1e-6 ? clamp(remaining / d, 0, 1) : 1);
    }
    remaining -= d;
  }
  return out.copy(points[points.length - 1]);
}

function polyLength(points) {
  let total = 0;
  for (let i = 0; i < points.length - 1; i++) total += points[i].distanceTo(points[i + 1]);
  return total;
}

/**
 * Tip position along approach -> work -> retreat for one stage.
 * `from` / `to` are the points the tool arrives from / leaves to; with a
 * `fulcrum` it always passes the wound / port on the way, so it never
 * teleports.
 * `work(q, out)` writes the work-phase tip for q in 0..1.
 */
export function pathTip(out, p, { a = 0.16, r = 0.16, from, to, fulcrum = null, work }) {
  work(0, _w0);
  work(1, _w1);
  const mid = fulcrum ? [fulcrum] : [];
  if (p < a) {
    const pts = [from, ...mid, _w0].map((v) => v.clone());
    return polyline(out, pts, smooth(p / a) * polyLength(pts));
  }
  if (p > 1 - r) {
    const pts = [_w1, ...mid, to].map((v) => v.clone());
    return polyline(out, pts, smooth((p - (1 - r)) / r) * polyLength(pts));
  }
  return work((p - a) / (1 - a - r), out);
}

/** Work-phase progress 0..1 for the given approach / retreat windows. */
export function workProgress(p, a = 0.16, r = 0.16) {
  return clamp((p - a) / (1 - a - r), 0, 1);
}

// ---------------------------------------------------------------------------
// Labels: hide near the tool tip, hide when facing away, de-overlap.
// ---------------------------------------------------------------------------

/**
 * entries: { element, x, y, show, priority? }  (x, y in px within the viewer)
 * avoid: [{ x, y, radius }]
 */
export function layoutLabels(entries, avoid = [], gap = 4) {
  const placed = [];
  const ordered = entries.slice().sort((a, b) => (a.priority ?? 0) - (b.priority ?? 0));
  for (const entry of ordered) {
    const el = entry.element;
    if (!entry.show) {
      el.hidden = true;
      continue;
    }
    let { x, y } = entry;
    const nearTool = avoid.some((s) => Math.hypot(s.x - x, s.y - y) < s.radius);
    if (nearTool) {
      el.hidden = true;
      continue;
    }
    el.hidden = false;
    const w = el.offsetWidth || 90;
    const h = el.offsetHeight || 24;
    let ok = false;
    for (let attempt = 0; attempt < 4 && !ok; attempt++) {
      const box = { x0: x - w / 2, x1: x + w / 2, y0: y - h / 2, y1: y + h / 2 };
      const clash = placed.find(
        (b) => box.x0 < b.x1 + gap && box.x1 > b.x0 - gap && box.y0 < b.y1 + gap && box.y1 > b.y0 - gap
      );
      if (!clash) {
        placed.push(box);
        ok = true;
      } else {
        y = clash.y1 + gap + h / 2;
      }
    }
    if (!ok) {
      el.hidden = true;
      continue;
    }
    el.style.left = `${x}px`;
    el.style.top = `${y}px`;
  }
}

/**
 * Soft framing: if any world point projects outside `margin` of the NDC box
 * at zoom 1, ease camera.zoom out just enough. Does not move the camera, so
 * it never fights orbit controls.
 */
export function frameAssist(camera, points, margin = 0.9, ease = 0.1) {
  const v = new THREE.Vector3();
  const savedZoom = camera.zoom;
  let worst = 0;
  for (const point of points) {
    v.copy(point).project(camera);
    worst = Math.max(worst, Math.abs(v.x) / savedZoom, Math.abs(v.y) / savedZoom);
  }
  const wanted = worst > margin ? margin / worst : 1;
  const next = REDUCED_MOTION ? wanted : lerp(savedZoom, wanted, ease);
  if (Math.abs(next - savedZoom) > 1e-4) {
    camera.zoom = next;
    camera.updateProjectionMatrix();
  }
}

// ---------------------------------------------------------------------------
// Chalazion lid: curved, rolling eversion, clamp bulge, cavity.
// Local frame: +X lateral, +Y toward the free margin, +Z skin (outward).
// ---------------------------------------------------------------------------

export function createRollingLid(options = {}) {
  const {
    globeCenter = new THREE.Vector3(0, 0.42, -0.48),
    globeRadius = 1.2,
    gap = 0.075,
    width = 2.7,
    height = 1.08,
    marginY = -0.28,
    nu = 40,
    nv = 24,
    lesionX = 0.35,
    lesionV = 0.43,
  } = options;

  const group = new THREE.Group();
  const yBorder = marginY - height;
  const R2 = globeRadius + gap;
  const L = 0.95 * R2;

  const restZ = (x, y) => {
    const e = L * Math.tanh((y - globeCenter.y) / L);
    const s = R2 * R2 - x * x - e * e;
    const smoothMax = 0.5 * (s + Math.sqrt(s * s + 0.04));
    return globeCenter.z + Math.sqrt(smoothMax);
  };

  const cols = nu + 1;
  const rows = nv + 1;
  const xs = Array.from({ length: cols }, (_, i) => -width / 2 + (width * i) / nu);
  const ys = Array.from({ length: rows }, (_, j) => yBorder + (height * j) / nv);

  // The free margin arches up toward the canthi and the lid narrows toward
  // the fornix, so the sheet reads as a lid rather than a rectangle.
  const archAt = (u) => 0.3 * u * u;
  const widthAt = (v) => 0.8 + 0.2 * v;
  const restPoint = (i, j) => {
    const v = j / nv;
    const u = xs[i] / (width / 2);
    const x = xs[i] * widthAt(v);
    const y = ys[j] + v * archAt(u);
    return new THREE.Vector3(x, y, restZ(x, y));
  };

  const restP = [];
  const restN = [];
  for (let i = 0; i < cols; i++) {
    restP.push([]);
    restN.push([]);
    for (let j = 0; j < rows; j++) restP[i].push(restPoint(i, j));
  }
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      const dx = restP[Math.min(cols - 1, i + 1)][j].clone()
        .sub(restP[Math.max(0, i - 1)][j]);
      const dy = restP[i][Math.min(rows - 1, j + 1)].clone()
        .sub(restP[i][Math.max(0, j - 1)]);
      restN[i].push(dx.cross(dy).normalize());
    }
  }

  const iL = Math.round(((lesionX + width / 2) / width) * nu);
  const jL = Math.round(lesionV * nv);
  const lx = restP[iL][jL].x;
  const ly = restP[iL][jL].y;

  const lidMid = Array.from({ length: cols }, () => Array.from({ length: rows }, () => new THREE.Vector3()));
  const lidNormal = Array.from({ length: cols }, () => Array.from({ length: rows }, () => new THREE.Vector3()));
  const alphas = new Float32Array(rows);

  function layer(material, withColors) {
    const positions = new Float32Array(cols * rows * 3);
    const uvs = new Float32Array(cols * rows * 2);
    const indices = [];
    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        uvs[(i * rows + j) * 2] = i / nu;
        uvs[(i * rows + j) * 2 + 1] = j / nv;
      }
    }
    for (let i = 0; i < nu; i++) {
      for (let j = 0; j < nv; j++) {
        const a = i * rows + j;
        const b = (i + 1) * rows + j;
        indices.push(a, b, a + 1, b, b + 1, a + 1);
      }
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("uv", new THREE.BufferAttribute(uvs, 2));
    let colors = null;
    if (withColors) {
      colors = new Float32Array(cols * rows * 3);
      geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    }
    geometry.setIndex(indices);
    const mesh = new THREE.Mesh(geometry, material);
    mesh.frustumCulled = false;
    group.add(mesh);
    return { mesh, geometry, positions, colors };
  }

  const skinMat = tissue(0xffffff, 0.5, { map: skinTexture(), fresnel: 0.3, rim: 0xffd9cc, roughness: 0.6 });
  const tarsusMat = tissue(0xffffff, 0.62, { map: tarsusTexture(), roughness: 0.55 });
  const conjMat = tissue(0xffffff, 0.55, { vertexColors: true, fresnel: 0.25, rim: 0xffd0da, roughness: 0.35 });
  const skin = layer(skinMat, false);
  const tarsus = layer(tarsusMat, false);
  const conj = layer(conjMat, true);

  const marginMat = tissue(0xcf9086, 1, { roughness: 0.5 });
  const marginSides = 8;
  const marginPositions = new Float32Array(cols * marginSides * 3);
  const marginIndices = [];
  for (let i = 0; i < nu; i++) {
    for (let k = 0; k < marginSides; k++) {
      const a = i * marginSides + k;
      const b = (i + 1) * marginSides + k;
      const a2 = i * marginSides + ((k + 1) % marginSides);
      const b2 = (i + 1) * marginSides + ((k + 1) % marginSides);
      marginIndices.push(a, b, a2, b, b2, a2);
    }
  }
  const marginGeometry = new THREE.BufferGeometry();
  marginGeometry.setAttribute("position", new THREE.BufferAttribute(marginPositions, 3));
  marginGeometry.setIndex(marginIndices);
  const marginMesh = new THREE.Mesh(marginGeometry, marginMat);
  marginMesh.frustumCulled = false;
  group.add(marginMesh);

  // Lashes: curved, tapered, instanced.
  const lashCount = 26;
  const lashGeometry = taperedTubeGeometry(
    [[0, 0, 0], [0, 0.07, 0.012], [0, 0.14, 0.04], [0, 0.2, 0.085], [0, 0.235, 0.145]],
    0.011, 0.0025, 5, 6
  );
  const lashes = new THREE.InstancedMesh(lashGeometry, tissue(0x3b2d31, 1, { roughness: 0.6 }), lashCount);
  lashes.frustumCulled = false;
  group.add(lashes);

  // Incision strip on the conjunctival surface.
  const slitRows = 13;
  const slitPositions = new Float32Array(slitRows * 2 * 3);
  const slitIndices = [];
  for (let k = 0; k < slitRows - 1; k++) {
    const a = k * 2;
    slitIndices.push(a, a + 1, a + 2, a + 1, a + 3, a + 2);
  }
  const slitGeometry = new THREE.BufferGeometry();
  slitGeometry.setAttribute("position", new THREE.BufferAttribute(slitPositions, 3));
  slitGeometry.setIndex(slitIndices);
  const slit = new THREE.Mesh(slitGeometry, new THREE.MeshStandardMaterial({
    color: 0x7a1f35, roughness: 0.5, side: THREE.DoubleSide,
    polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2,
  }));
  slit.frustumCulled = false;
  group.add(slit);

  const lesionFrame = new THREE.Group();
  lesionFrame.matrixAutoUpdate = false;
  group.add(lesionFrame);

  const baseColor = new THREE.Color(0xf0a2b2);
  const blanchColor = new THREE.Color(0xfbe3e0);
  const lesionColor = new THREE.Color(0xf0c08c);
  const cavityColor = new THREE.Color(0x7d2536);
  const tmpColor = new THREE.Color();
  const tmp = new THREE.Vector3();
  const tmp2 = new THREE.Vector3();
  const xAxis = new THREE.Vector3();
  const yAxis = new THREE.Vector3();
  const zAxis = new THREE.Vector3();

  const rotX = (v, angle) => {
    const c = Math.cos(angle);
    const s = Math.sin(angle);
    const y = v.y * c - v.z * s;
    const z = v.y * s + v.z * c;
    v.y = y;
    v.z = z;
    return v;
  };

  const bumps = (i, j) => {
    const dx = restP[i][j].x - lx;
    const dy = restP[i][j].y - ly;
    return {
      lesion: Math.exp(-((dx / 0.27) ** 2 + (dy / 0.25) ** 2)),
      clamp: Math.exp(-((dx * dx + dy * dy) / (0.17 * 0.17))),
      cavity: Math.exp(-((dx / 0.1) ** 2 + (dy / 0.2) ** 2)),
    };
  };

  let lastKey = "";

  /**
   * state: eversion 0..1, clamp 0..1 (bulge through ring), lesion (size
   * factor), cavity 0..1, incision 0..1 (length), gape 0..1, theta (total
   * roll angle in radians).
   */
  function update(state) {
    const { eversion, clamp: clampAmount, lesion, cavity, incision, gape, theta = 2.5 } = state;
    const key = [eversion, clampAmount, lesion, cavity, incision, gape].map((v) => v.toFixed(4)).join("|");
    if (key === lastKey) return;
    lastKey = key;

    for (let j = 0; j < rows; j++) {
      const v = j / nv;
      alphas[j] = theta * eversion * (0.86 * smooth(v / 0.26) + 0.14 * smooth((v - 0.66) / 0.34));
    }

    for (let i = 0; i < cols; i++) {
      tmp.copy(restP[i][0]);
      lidMid[i][0].copy(tmp);
      for (let j = 1; j < rows; j++) {
        tmp2.copy(restP[i][j]).sub(restP[i][j - 1]);
        rotX(tmp2, (alphas[j - 1] + alphas[j]) / 2);
        tmp.add(tmp2);
        lidMid[i][j].copy(tmp);
      }
      for (let j = 0; j < rows; j++) {
        lidNormal[i][j].copy(restN[i][j]);
        rotX(lidNormal[i][j], alphas[j]);
      }
    }

    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        const m = lidMid[i][j];
        const n = lidNormal[i][j];
        const b = bumps(i, j);
        const k = (i * rows + j) * 3;

        const skinOffset = 0.055 + lesion * 0.1 * b.lesion;
        const tarsusOffset = lesion * 0.03 * b.lesion;
        const conjOffset =
          -0.05 - lesion * 0.065 * b.lesion - 0.12 * clampAmount * b.clamp + 0.16 * cavity * b.cavity;

        skin.positions[k] = m.x + n.x * skinOffset;
        skin.positions[k + 1] = m.y + n.y * skinOffset;
        skin.positions[k + 2] = m.z + n.z * skinOffset;
        tarsus.positions[k] = m.x + n.x * tarsusOffset;
        tarsus.positions[k + 1] = m.y + n.y * tarsusOffset;
        tarsus.positions[k + 2] = m.z + n.z * tarsusOffset;
        conj.positions[k] = m.x + n.x * conjOffset;
        conj.positions[k + 1] = m.y + n.y * conjOffset;
        conj.positions[k + 2] = m.z + n.z * conjOffset;

        tmpColor.copy(baseColor);
        tmpColor.lerp(lesionColor, Math.min(1, b.lesion * 0.35 * lesion));
        tmpColor.lerp(blanchColor, Math.min(1, clampAmount * b.clamp * 0.9));
        tmpColor.lerp(cavityColor, Math.min(1, cavity * b.cavity * 1.1));
        conj.colors[k] = tmpColor.r;
        conj.colors[k + 1] = tmpColor.g;
        conj.colors[k + 2] = tmpColor.b;
      }
    }
    for (const l of [skin, tarsus, conj]) {
      l.geometry.attributes.position.needsUpdate = true;
      l.geometry.computeVertexNormals();
    }
    conj.geometry.attributes.color.needsUpdate = true;

    // Margin roll
    for (let i = 0; i < cols; i++) {
      const m = lidMid[i][nv];
      const n = lidNormal[i][nv];
      tmp.copy(m).sub(lidMid[i][nv - 1]).normalize();
      for (let kSide = 0; kSide < marginSides; kSide++) {
        const a = (kSide / marginSides) * Math.PI * 2;
        const idx = (i * marginSides + kSide) * 3;
        marginPositions[idx] = m.x + tmp.x * (0.03 + Math.sin(a) * 0.055) + n.x * Math.cos(a) * 0.055;
        marginPositions[idx + 1] = m.y + tmp.y * (0.03 + Math.sin(a) * 0.055) + n.y * Math.cos(a) * 0.055;
        marginPositions[idx + 2] = m.z + tmp.z * (0.03 + Math.sin(a) * 0.055) + n.z * Math.cos(a) * 0.055;
      }
    }
    marginGeometry.attributes.position.needsUpdate = true;
    marginGeometry.computeVertexNormals();

    // Lashes
    const matrix = new THREE.Matrix4();
    for (let q = 0; q < lashCount; q++) {
      const f = (q + 0.5) / lashCount;
      const iF = 4 + f * (nu - 8);
      const i0 = Math.floor(iF);
      const t = iF - i0;
      tmp.copy(lidMid[i0][nv]).lerp(lidMid[i0 + 1][nv], t);
      const nn = lidNormal[i0][nv].clone().lerp(lidNormal[i0 + 1][nv], t).normalize();
      const tt = lidMid[i0][nv].clone().sub(lidMid[i0][nv - 1]).normalize();
      const sway = Math.sin(q * 2.17) * 0.18;
      yAxis.copy(nn).multiplyScalar(0.9).addScaledVector(tt, -0.2);
      xAxis.set(1, 0, 0);
      yAxis.addScaledVector(xAxis, sway).normalize();
      zAxis.copy(tt).multiplyScalar(-1).addScaledVector(yAxis, yAxis.dot(tt));
      zAxis.normalize();
      xAxis.crossVectors(yAxis, zAxis).normalize();
      matrix.makeBasis(xAxis, yAxis, zAxis);
      matrix.setPosition(tmp.x + nn.x * 0.02, tmp.y + nn.y * 0.02, tmp.z + nn.z * 0.02);
      const s = 0.9 + 0.2 * Math.sin(q * 1.3);
      matrix.scale(new THREE.Vector3(s, s, s));
      lashes.setMatrixAt(q, matrix);
    }
    lashes.instanceMatrix.needsUpdate = true;

    // Lesion frame
    const tL = lidMid[iL][jL + 1].clone().sub(lidMid[iL][jL - 1]).normalize();
    const nL = lidNormal[iL][jL].clone();
    xAxis.crossVectors(tL, nL).normalize();
    yAxis.crossVectors(nL, xAxis).normalize();
    lesionFrame.matrix.makeBasis(xAxis, yAxis, nL);
    lesionFrame.matrix.setPosition(lidMid[iL][jL]);
    lesionFrame.matrixWorldNeedsUpdate = true;

    // Incision strip
    const active = clamp(incision, 0, 1);
    slit.visible = active > 0.01;
    if (slit.visible) {
      const halfWidth = 0.014 * (1 + 0.9 * gape);
      for (let k = 0; k < slitRows; k++) {
        const kk = ((k - (slitRows - 1) / 2) / ((slitRows - 1) / 2)) * active;
        const jf = clamp(jL + kk * 6, 0, nv - 1.001);
        const j0 = Math.floor(jf);
        const tj = jf - j0;
        const b0 = bumps(iL, j0);
        const b1 = bumps(iL, j0 + 1);
        const off = (b) => -0.05 - lesion * 0.065 * b.lesion - 0.12 * clampAmount * b.clamp + 0.16 * cavity * b.cavity;
        const o = lerp(off(b0), off(b1), tj) - 0.006;
        const p = lidMid[iL][j0].clone().lerp(lidMid[iL][j0 + 1], tj);
        const n = lidNormal[iL][j0].clone().lerp(lidNormal[iL][j0 + 1], tj).normalize();
        p.addScaledVector(n, o);
        const taper = 1 - 0.55 * Math.abs(kk / Math.max(active, 1e-3)) ** 2;
        slitPositions.set([p.x - halfWidth * taper, p.y, p.z], k * 6);
        slitPositions.set([p.x + halfWidth * taper, p.y, p.z], k * 6 + 3);
      }
      slitGeometry.attributes.position.needsUpdate = true;
      slitGeometry.computeVertexNormals();
    }
  }

  /** Surface frame at grid node (i, j): point on the mid surface + normal. */
  function nodeAt(xFrac, vFrac) {
    const i = clamp(Math.round(xFrac * nu), 0, nu);
    const j = clamp(Math.round(vFrac * nv), 0, nv);
    return { point: lidMid[i][j].clone(), normal: lidNormal[i][j].clone() };
  }

  function setLayerOrder(conjFacesViewer) {
    skin.mesh.renderOrder = conjFacesViewer ? 1 : 3;
    tarsus.mesh.renderOrder = 2;
    conj.mesh.renderOrder = conjFacesViewer ? 3 : 1;
  }
  setLayerOrder(false);

  update({ eversion: 0, clamp: 0, lesion: 1, cavity: 0, incision: 0, gape: 0 });

  return {
    group, lesionFrame, update, nodeAt, setLayerOrder,
    skinMat, tarsusMat, conjMat, skin, tarsus, conj,
    lashes, margin: marginMesh,
  };
}
