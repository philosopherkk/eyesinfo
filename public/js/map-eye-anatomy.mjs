/**
 * Anterior-segment subset of the /tools/map eye (`public/eye-viewer.html`).
 * Same revolved (r, z) profiles around the optical +Z axis — extract for
 * shallow-AC / angle-closure teaching without pick / layer UI.
 *
 * Coordinate: anterior = +Z (cornea forward), same as the map eye.
 */

/** @param {typeof import('three')} THREE */
export function createMapEyeAnatomy(THREE, options = {}) {
  const CUT_X = options.cutX ?? 0.15;
  const cutPlane = new THREE.Plane(new THREE.Vector3(-1, 0, 0), CUT_X);
  let cutaway = options.cutaway !== false;

  const group = new THREE.Group();
  const sections = [];
  const clipMeshes = [];

  const V2 = (r, z) => new THREE.Vector2(r, z);
  const polar = (R, a) => {
    const r = R * Math.sin(a);
    return V2(Math.abs(r) < 1e-9 ? 0 : r, R * Math.cos(a));
  };
  const arc = (R, a0, a1, n) => {
    const points = [];
    for (let i = 0; i <= n; i++) points.push(polar(R, a0 + (a1 - a0) * i / n));
    return points;
  };
  const coatPolygon = (outer, inner, start, n = 48) => [
    ...arc(outer, start, Math.PI, n),
    ...arc(inner, Math.PI, start, n),
  ];

  function revolve(polygon, segments, opts = {}) {
    const pts = [];
    for (const p of polygon) {
      const last = pts[pts.length - 1];
      if (!last || last.distanceTo(p) > 1e-6) pts.push(p.clone());
    }
    if (pts.length > 1 && pts[0].distanceTo(pts[pts.length - 1]) < 1e-6) pts.pop();
    const n = pts.length;

    let area = 0;
    for (let i = 0; i < n; i++) {
      const a = pts[i];
      const b = pts[(i + 1) % n];
      area += a.x * b.y - b.x * a.y;
    }
    const sign = area >= 0 ? 1 : -1;
    const segmentNormals = pts.map((a, i) => {
      const b = pts[(i + 1) % n];
      const dx = b.x - a.x;
      const dz = b.y - a.y;
      const length = Math.hypot(dx, dz) || 1;
      return V2(sign * dz / length, -sign * dx / length);
    });

    const creaseLimit = Math.cos(THREE.MathUtils.degToRad(opts.crease ?? 40));
    const nodes = [];
    const nodeIn = [];
    const nodeOut = [];
    for (let k = 0; k < n; k++) {
      const previous = segmentNormals[(k + n - 1) % n];
      const next = segmentNormals[k];
      const p = pts[k];
      const make = (normal) => {
        nodes.push({ r: p.x, z: p.y, nr: normal.x, nz: normal.y, k });
        return nodes.length - 1;
      };
      if (previous.dot(next) >= creaseLimit) {
        const id = make(previous.clone().add(next).normalize());
        nodeIn[k] = nodeOut[k] = id;
      } else {
        nodeIn[k] = make(previous);
        nodeOut[k] = make(next);
      }
    }

    const ring = segments + 1;
    const positions = new Float32Array(nodes.length * ring * 3);
    const normals = new Float32Array(nodes.length * ring * 3);
    const uvs = new Float32Array(nodes.length * ring * 2);

    nodes.forEach((node, index) => {
      for (let j = 0; j <= segments; j++) {
        const phi = (j / segments) * Math.PI * 2;
        const cos = Math.cos(phi);
        const sin = Math.sin(phi);
        let r = node.r;
        let z = node.z;
        if (opts.displace) [r, z] = opts.displace(r, z, phi);
        const at = index * ring + j;
        positions.set([r * cos, r * sin, z], at * 3);
        normals.set([node.nr * cos, node.nr * sin, node.nz], at * 3);
        uvs.set(
          opts.uv ? opts.uv(node, j / segments, r, z, cos, sin) : [j / segments, node.k / n],
          at * 2,
        );
      }
    });

    const indices = [];
    for (let k = 0; k < n; k++) {
      const a = pts[k];
      const b = pts[(k + 1) % n];
      if (a.x < 1e-6 && b.x < 1e-6) continue;
      const start = nodeOut[k] * ring;
      const end = nodeIn[(k + 1) % n] * ring;
      for (let j = 0; j < segments; j++) {
        indices.push(start + j, end + j, start + j + 1, start + j + 1, end + j, end + j + 1);
      }
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("normal", new THREE.BufferAttribute(normals, 3));
    geometry.setAttribute("uv", new THREE.BufferAttribute(uvs, 2));
    geometry.setIndex(indices);
    if (opts.displace) geometry.computeVertexNormals();
    return geometry;
  }

  function clipMinRadius(polygon, minR) {
    const out = [];
    const n = polygon.length;
    for (let i = 0; i < n; i++) {
      const a = polygon[i];
      const b = polygon[(i + 1) % n];
      const aIn = a.x >= minR;
      const bIn = b.x >= minR;
      if (aIn) out.push(a);
      if (aIn !== bIn) {
        const t = (minR - a.x) / (b.x - a.x);
        out.push(V2(minR, a.y + (b.y - a.y) * t));
      }
    }
    return out;
  }

  function capGeometry(polygon, displace) {
    const clipped = clipMinRadius(polygon, CUT_X);
    const mapped = [];
    for (const p of clipped) {
      let r = p.x;
      let z = p.y;
      if (displace) {
        const phi = Math.atan2(Math.sqrt(Math.max(r * r - CUT_X * CUT_X, 0)), CUT_X);
        [r, z] = displace(r, z, phi);
      }
      const y = Math.sqrt(Math.max(r * r - CUT_X * CUT_X, 0));
      const last = mapped[mapped.length - 1];
      if (!last || Math.hypot(last.x - y, last.y - z) > 1e-5) mapped.push(V2(y, z));
    }
    if (
      mapped.length > 2 &&
      Math.hypot(mapped[0].x - mapped.at(-1).x, mapped[0].y - mapped.at(-1).y) < 1e-5
    ) {
      mapped.pop();
    }

    const positions = [];
    const indices = [];
    if (mapped.length >= 3) {
      for (const side of [1, -1]) {
        const base = positions.length / 3;
        const contour = mapped.map((p) => V2(side * p.x, p.y));
        const faces = THREE.ShapeUtils.triangulateShape(contour, []);
        contour.forEach((p) => positions.push(CUT_X + 0.002, p.x, p.y));
        faces.forEach((face) => indices.push(base + face[0], base + face[1], base + face[2]));
      }
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    geometry.setAttribute(
      "normal",
      new THREE.Float32BufferAttribute(
        positions.map((_, i) => (i % 3 === 0 ? 1 : 0)),
        3,
      ),
    );
    geometry.setIndex(indices);
    return geometry;
  }

  function tissue(color, opts = {}) {
    const opacity = opts.opacity ?? 1;
    const Material = opts.physical ? THREE.MeshPhysicalMaterial : THREE.MeshStandardMaterial;
    return new Material({
      color,
      roughness: opts.roughness ?? 0.5,
      metalness: 0,
      side: THREE.DoubleSide,
      transparent: opacity < 1,
      opacity,
      depthWrite: opacity === 1,
      map: opts.map ?? null,
      ...(opts.extra || {}),
    });
  }

  function glassy(mat, rim, glint, key) {
    mat.onBeforeCompile = (shader) => {
      shader.fragmentShader = shader.fragmentShader.replace(
        "#include <opaque_fragment>",
        `float fres = pow(1.0 - clamp(abs(dot(normalize(normal), normalize(vViewPosition))), 0.0, 1.0), 3.0);
         float glow = dot(totalSpecular, vec3(0.3333));
         diffuseColor.a = clamp(diffuseColor.a + fres * ${rim.toFixed(2)} + glow * ${glint.toFixed(2)}, 0.0, 1.0);
         #include <opaque_fragment>`,
      );
    };
    mat.customProgramCacheKey = () => key;
    return mat;
  }

  function addMesh(geometry, mat, parent = group) {
    const mesh = new THREE.Mesh(geometry, mat);
    parent.add(mesh);
    clipMeshes.push(mesh);
    return mesh;
  }

  function addCap(polygon, color, opts = {}) {
    const mat = tissue(color, { roughness: opts.roughness ?? 0.6, opacity: opts.opacity ?? 1 });
    const face = addMesh(capGeometry(polygon, opts.displace), mat);
    face.userData.noClip = true;
    if (opts.renderOrder) face.renderOrder = opts.renderOrder;
    sections.push(face);
    return face;
  }

  // ---- Static coats (map-eye constants) ----
  const LIMBUS_ANGLE = 0.58;
  const ORA_ANGLE = 0.99;

  const scleraPolygon = coatPolygon(1.5, 1.425, LIMBUS_ANGLE);
  addMesh(revolve(scleraPolygon, 64), tissue("#d9d8d6", { roughness: 0.4 }));
  addCap(scleraPolygon, "#f1f2f3");

  const choroidPolygon = coatPolygon(1.423, 1.395, ORA_ANGLE);
  addMesh(revolve(choroidPolygon, 48), tissue("#914d50", { roughness: 0.62 }));
  addCap(choroidPolygon, "#914d50");

  const retinaPolygon = coatPolygon(1.392, 1.36, ORA_ANGLE + 0.01);
  addMesh(revolve(retinaPolygon, 48), tissue("#ef927d", { roughness: 0.66 }));
  addCap(retinaPolygon, "#ef927d");

  // Cornea (aspheric) — fixed like map eye
  const asphere = (R, k) => (r) =>
    (r * r) / (R * (1 + Math.sqrt(Math.max(0, 1 - (1 + k) * ((r * r) / (R * R))))));
  const limbusOuter = polar(1.5, LIMBUS_ANGLE);
  const limbusInner = polar(1.425, LIMBUS_ANGLE);
  const sagOuter = asphere(0.98, -0.25);
  const sagInner = asphere(0.9, -0.25);
  const apexOuter = limbusOuter.y + sagOuter(limbusOuter.x);
  const apexInner = limbusInner.y + sagInner(limbusInner.x);
  const corneaOuter = [];
  const corneaInner = [];
  for (let i = 0; i <= 48; i++) {
    const f = i / 48;
    const ro = limbusOuter.x * f;
    corneaOuter.push(V2(ro, apexOuter - sagOuter(ro)));
    const ri = limbusInner.x * (1 - f);
    corneaInner.push(V2(ri, apexInner - sagInner(ri)));
  }
  const corneaPolygon = [...corneaOuter, ...corneaInner];
  const corneaMat = glassy(
    tissue("#bdeff6", {
      opacity: 0.13,
      roughness: 0.05,
      physical: true,
      extra: { clearcoat: 0.6, clearcoatRoughness: 0.04, ior: 1.376 },
    }),
    0.4,
    1.3,
    "cornea",
  );
  const cornea = addMesh(revolve(corneaPolygon, 64), corneaMat);
  cornea.renderOrder = 5;
  addCap(corneaPolygon, "#9fdbe6");

  // Ciliary body (static)
  const CILIARY_FRONT = 0.6;
  const CILIARY_WALL = 1.422;
  const CILIARY_PROCESSES = 48;
  const ciliaryThickness = [
    [0.6, 0.12],
    [0.63, 0.172],
    [0.7, 0.166],
    [0.78, 0.12],
    [0.86, 0.066],
    [0.93, 0.042],
    [ORA_ANGLE, 0.027],
  ];
  const thicknessAt = (a) => {
    for (let i = 1; i < ciliaryThickness.length; i++) {
      const [a0, t0] = ciliaryThickness[i - 1];
      const [a1, t1] = ciliaryThickness[i];
      if (a <= a1) {
        const f = (a - a0) / (a1 - a0);
        const s = f * f * (3 - 2 * f);
        return t0 + (t1 - t0) * s;
      }
    }
    return ciliaryThickness.at(-1)[1];
  };
  const ciliaryInner = (a) => polar(CILIARY_WALL - thicknessAt(a), a);
  const ciliaryPolygon = [];
  for (let i = 0; i <= 12; i++) {
    ciliaryPolygon.push(polar(CILIARY_WALL, CILIARY_FRONT + (ORA_ANGLE - CILIARY_FRONT) * (i / 12)));
  }
  for (let i = 0; i <= 28; i++) {
    ciliaryPolygon.push(ciliaryInner(ORA_ANGLE - (ORA_ANGLE - CILIARY_FRONT) * (i / 28)));
  }
  const processRidge = (phi) => Math.pow(0.5 + 0.5 * Math.cos(CILIARY_PROCESSES * phi), 1.4);
  const ciliaryDisplace = (r, z, phi) => {
    const R = Math.hypot(r, z);
    if (R > CILIARY_WALL - 0.012) return [r, z];
    const a = Math.atan2(r, z);
    const weight = THREE.MathUtils.clamp((0.8 - a) / 0.12, 0, 1);
    const lift = weight * (1 - processRidge(phi)) * 0.055;
    const scale = (R + lift) / R;
    return [r * scale, z * scale];
  };
  addMesh(
    revolve(ciliaryPolygon, 96, { displace: ciliaryDisplace, crease: 50 }),
    tissue("#b67bba", { roughness: 0.5 }),
  );
  addCap(ciliaryPolygon, "#b67bba", { displace: ciliaryDisplace });

  // Dynamic containers
  const dynamic = new THREE.Group();
  group.add(dynamic);
  /** @type {THREE.Mesh[]} */
  let dynamicMeshes = [];
  /** @type {THREE.LineSegments | null} */
  let zonules = null;

  const irisMat = tissue("#5a8a78", { roughness: 0.55 });
  const lensMat = glassy(tissue("#b6dceb", { opacity: 0.72, roughness: 0.12 }), 0.28, 0.6, "lens");
  const pupilMat = tissue("#050a12", { opacity: 0.74, roughness: 0.3 });
  const aqueousMat = tissue("#63bce7", { opacity: 0.055, roughness: 0.4 });
  const angleOpenMat = tissue("#6ecf8e", { opacity: 0.85, roughness: 0.45 });
  const angleCloseMat = tissue("#e07070", { opacity: 0.9, roughness: 0.45 });

  /** Last aqueous checkpoints in 3D (ciliary → PC → pupil → AC → TM), cut-face visible. */
  let lastFlowPath = [];
  let lastLayout = null;

  function clearDynamic() {
    for (const m of dynamicMeshes) {
      dynamic.remove(m);
      m.geometry?.dispose();
      const idx = clipMeshes.indexOf(m);
      if (idx >= 0) clipMeshes.splice(idx, 1);
      const sidx = sections.indexOf(m);
      if (sidx >= 0) sections.splice(sidx, 1);
    }
    dynamicMeshes = [];
    if (zonules) {
      group.remove(zonules);
      zonules.geometry.dispose();
      zonules = null;
    }
  }

  function track(mesh, isCap = false) {
    dynamic.add(mesh);
    dynamicMeshes.push(mesh);
    clipMeshes.push(mesh);
    if (isCap) {
      mesh.userData.noClip = true;
      sections.push(mesh);
    }
    return mesh;
  }

  /**
   * @param {{
   *   pupilR?: number,
   *   lensEquatorZ?: number,
   *   lensRadius?: number,
   *   lensFront?: number,
   *   lensBack?: number,
   *   bombe?: number,
   *   angleOpen?: number,
   *   cutaway?: boolean,
   * }} p
   */
  function setParams(p = {}) {
    const pupilR = p.pupilR ?? 0.25;
    const lensEquatorZ = p.lensEquatorZ ?? 0.92;
    const lensRadius = p.lensRadius ?? 0.5;
    const lensFrontH = p.lensFront ?? 0.2;
    const lensBackH = p.lensBack ?? 0.3;
    const bombe = p.bombe ?? 0;
    const angleOpen = p.angleOpen ?? 1;
    if (typeof p.cutaway === "boolean") cutaway = p.cutaway;

    clearDynamic();

    const lensFront = (r) =>
      lensEquatorZ + lensFrontH * Math.sqrt(Math.max(0, 1 - (r / lensRadius) ** 2));

    // Crystalline lens only (mechanism teaching — no post-op optic toggle)
    const lensPolygon = [];
    for (let i = 0; i <= 28; i++) {
      const t = (i / 28) * Math.PI / 2;
      lensPolygon.push(V2(lensRadius * Math.sin(t), lensEquatorZ + lensFrontH * Math.cos(t)));
    }
    for (let i = 1; i <= 28; i++) {
      const t = Math.PI / 2 + (i / 28) * Math.PI / 2;
      lensPolygon.push(V2(lensRadius * Math.sin(t), lensEquatorZ + lensBackH * Math.cos(t)));
    }
    const lens = track(new THREE.Mesh(revolve(lensPolygon, 56), lensMat));
    lens.renderOrder = 1;
    const lensCap = track(
      new THREE.Mesh(capGeometry(lensPolygon), tissue("#a9d3e4")),
      true,
    );

    // Iris with optional pupil-block bombé from slider-driven metrics
    const irisRootR = 0.81;
    const irisFrontBase = (r) => 1.15 + ((0.8 - r) / 0.55) * 0.022;
    const irisFront = (r) => {
      const mid = Math.exp(-Math.pow((r - 0.52) / 0.22, 2));
      return irisFrontBase(r) + bombe * mid * 0.085;
    };
    const irisBack = (r) => irisFront(r) - 0.045;
    const irisPolygon = [
      V2(irisRootR, irisFront(0.8)),
      V2(pupilR, irisFront(pupilR)),
      V2(pupilR, irisBack(pupilR)),
      V2(irisRootR, irisBack(0.8)),
    ];
    track(new THREE.Mesh(revolve(irisPolygon, 96), irisMat));
    track(new THREE.Mesh(capGeometry(irisPolygon), tissue("#6f9a84")), true);

    // Pupil aperture skin on optic front
    const pupilPolygon = [];
    for (let i = 0; i <= 10; i++) {
      const r = pupilR * (i / 10);
      pupilPolygon.push(V2(r, lensFront(r) + 0.008));
    }
    for (let i = 10; i >= 0; i--) {
      const r = pupilR * (i / 10);
      pupilPolygon.push(V2(r, lensFront(r) + 0.004));
    }
    const pupil = track(new THREE.Mesh(revolve(pupilPolygon, 40), pupilMat));
    pupil.renderOrder = 6;

    // Aqueous chamber
    const aqueousPolygon = [];
    for (let i = 0; i <= 40; i++) {
      const r = limbusInner.x * (i / 40);
      aqueousPolygon.push(V2(r, apexInner - sagInner(r)));
    }
    aqueousPolygon.push(V2(0.8, irisFront(0.8)));
    aqueousPolygon.push(V2(pupilR, irisFront(pupilR)));
    for (let i = 0; i <= 8; i++) {
      const r = pupilR * (1 - i / 8);
      aqueousPolygon.push(V2(r, lensFront(r)));
    }
    const aqueous = track(new THREE.Mesh(revolve(aqueousPolygon, 48), aqueousMat));
    aqueous.renderOrder = 4;

    // Angle / TM marker at iris root vs cornea inner near limbus
    const rootZ = irisFront(0.8);
    const corneaNear = apexInner - sagInner(0.78);
    const gap = Math.max(0, corneaNear - rootZ);
    const angleMat = angleOpen > 0.45 ? angleOpenMat : angleOpen > 0.2 ? tissue("#f0a030", { opacity: 0.9 }) : angleCloseMat;
    const anglePoly = [
      V2(0.78, rootZ),
      V2(0.86, rootZ + gap * 0.15),
      V2(0.86, corneaNear - 0.01),
      V2(0.78, corneaNear - 0.02),
    ];
    const angleMesh = track(new THREE.Mesh(revolve(anglePoly, 48), angleMat));
    angleMesh.renderOrder = 7;

    // Zonules for crystalline lens
    const tip = ciliaryInner(0.66);
    const zonulePositions = [];
    for (let i = 0; i < CILIARY_PROCESSES; i++) {
      const phi = (i / CILIARY_PROCESSES) * Math.PI * 2;
      const cos = Math.cos(phi);
      const sin = Math.sin(phi);
      for (const dz of [0.035, -0.035]) {
        zonulePositions.push(
          tip.x * cos,
          tip.x * sin,
          tip.y,
          lensRadius * 0.98 * cos,
          lensRadius * 0.98 * sin,
          lensEquatorZ + dz,
        );
      }
    }
    const zg = new THREE.BufferGeometry();
    zg.setAttribute("position", new THREE.Float32BufferAttribute(zonulePositions, 3));
    zonules = new THREE.LineSegments(
      zg,
      new THREE.LineBasicMaterial({ color: "#d9cde4", transparent: true, opacity: 0.75 }),
    );
    group.add(zonules);

    // Flow path on the cut face — keep r > pathX so stations stay spatially distinct
    const pathX = CUT_X + 0.04;
    const yAt = (r) => Math.sqrt(Math.max(r * r - pathX * pathX, 0.002));
    const rCil = Math.max(tip.x * 0.92, pathX + 0.08);
    const rPc = Math.max((pupilR + 0.72) * 0.5, pathX + 0.12);
    const rPup = Math.max(Math.max(pupilR, 0.2) + 0.08, pathX + 0.06);
    const rAc = Math.max(0.38, pathX + 0.1);
    const rTm = Math.max(0.82, pathX + 0.15);
    lastFlowPath = [
      { key: "ciliary", x: pathX, y: yAt(rCil), z: tip.y },
      { key: "pc", x: pathX, y: yAt(rPc), z: irisBack(Math.min(rPc, 0.75)) - 0.02 },
      {
        key: "pupil",
        x: pathX,
        y: yAt(rPup),
        z: (irisFront(pupilR) + lensFront(Math.min(pupilR * 0.85, lensRadius * 0.9))) * 0.5,
      },
      { key: "ac", x: pathX, y: yAt(rAc), z: (irisFront(0.35) + apexInner - sagInner(0.35)) * 0.5 },
      { key: "tm", x: pathX, y: yAt(rTm), z: (rootZ + corneaNear) * 0.5 },
    ];
    lastLayout = {
      gap, rootZ, corneaNear, apexOuter, apexInner, pupilR,
      lensEquatorZ, lensRadius, lensFrontH, lensBackH, bombe, angleOpen,
    };

    applyCutaway();
    void lensCap;
    void angleMesh;
    return lastLayout;
  }

  function getFlowPath() {
    return lastFlowPath.map((p) => ({ ...p }));
  }

  function getLayout() {
    return lastLayout ? { ...lastLayout } : null;
  }

  function applyCutaway() {
    for (const mesh of clipMeshes) {
      if (!mesh.material) continue;
      const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
      for (const mat of mats) {
        mat.clippingPlanes = cutaway && !mesh.userData.noClip ? [cutPlane] : [];
        mat.needsUpdate = true;
      }
    }
    for (const face of sections) face.visible = cutaway;
  }

  function setCutaway(on) {
    cutaway = !!on;
    applyCutaway();
  }

  // Initial default anatomy
  setParams({});

  return {
    group,
    cutPlane,
    setParams,
    setCutaway,
    getFlowPath,
    getLayout,
    constants: {
      LIMBUS_ANGLE,
      apexOuter,
      apexInner,
      limbusInnerX: limbusInner.x,
      baseLensZ: 0.92,
      baseLensR: 0.5,
      basePupilR: 0.25,
    },
  };
}
