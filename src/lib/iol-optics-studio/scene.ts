/**
 * Three.js schematic eye scene for IOL Optics Studio.
 * Decorative rings are schematic markers — not manufacturer product geometry.
 */

import {
  atPosition,
  BRANCH_COLORS,
  clamp,
  Mat,
  OPTICAL_CONSTANTS,
  sampleDisc,
} from "./optics.ts";
import type { Branch, OpticModel, StudioLang, StudioState } from "./types.ts";

/** Minimal Three.js surface used by this module (vendor ESM). */
export type ThreeNS = {
  Scene: new () => SceneLike;
  PerspectiveCamera: new (
    fov: number,
    aspect: number,
    near: number,
    far: number,
  ) => CameraLike;
  WebGLRenderer: new (params: {
    antialias?: boolean;
    alpha?: boolean;
  }) => RendererLike;
  AmbientLight: new (color: number, intensity: number) => object;
  DirectionalLight: new (color: number, intensity: number) => LightLike;
  Group: new () => GroupLike;
  BufferGeometry: new () => BufferGeometryLike;
  Float32BufferAttribute: new (
    array: number[],
    itemSize: number,
  ) => unknown;
  Line: new (geometry: unknown, material: unknown) => LineLike;
  LineBasicMaterial: new (params: Record<string, unknown>) => unknown;
  LineDashedMaterial: new (params: Record<string, unknown>) => unknown;
  Mesh: new (geometry: unknown, material: unknown) => MeshLike;
  MeshBasicMaterial: new (params: Record<string, unknown>) => MatLike;
  MeshPhongMaterial: new (params: Record<string, unknown>) => MatLike;
  CircleGeometry: new (radius: number, segments: number) => unknown;
  SphereGeometry: new (
    radius: number,
    w: number,
    h: number,
  ) => unknown;
  Sprite: new (material: unknown) => SpriteLike;
  SpriteMaterial: new (params: Record<string, unknown>) => MatLike;
  CanvasTexture: new (canvas: HTMLCanvasElement) => TexLike;
  Points: new (geometry: unknown, material: unknown) => object;
  PointsMaterial: new (params: Record<string, unknown>) => unknown;
  Vector3: new (x: number, y: number, z: number) => unknown;
  DoubleSide: unknown;
  SRGBColorSpace: unknown;
};

type SceneLike = {
  add: (o: unknown) => void;
};
type CameraLike = {
  position: { set: (x: number, y: number, z: number) => void };
  aspect: number;
  updateProjectionMatrix: () => void;
};
type RendererLike = {
  setPixelRatio: (n: number) => void;
  setClearColor: (c: number, a: number) => void;
  outputColorSpace: unknown;
  setSize: (w: number, h: number, updateStyle?: boolean) => void;
  domElement: HTMLCanvasElement;
  render: (scene: unknown, camera: unknown) => void;
};
type LightLike = { position: { set: (x: number, y: number, z: number) => void } };
type GroupLike = {
  add: (o: unknown) => void;
  clear: () => void;
  traverse: (fn: (o: Disposable) => void) => void;
};
type BufferGeometryLike = {
  setFromPoints: (pts: unknown[]) => BufferGeometryLike;
  setAttribute: (name: string, attr: unknown) => void;
  dispose: () => void;
};
type LineLike = {
  computeLineDistances: () => void;
};
type MeshLike = {
  rotation: { y: number };
  position: { x: number; set: (x: number, y: number, z: number) => void };
  scale: { set: (x: number, y: number, z: number) => void };
};
type SpriteLike = {
  position: { set: (x: number, y: number, z: number) => void };
  scale: { set: (x: number, y: number, z: number) => void };
};
type MatLike = { map?: TexLike; dispose: () => void };
type TexLike = { dispose: () => void };
type Disposable = {
  geometry?: { dispose: () => void };
  material?: MatLike | MatLike[];
};

export type OrbitControlsLike = {
  target: { set: (x: number, y: number, z: number) => void };
  enableDamping: boolean;
  minDistance: number;
  maxDistance: number;
  addEventListener: (type: string, fn: () => void) => void;
  update: () => void;
};

export type SceneHandle = {
  rebuild: (
    state: StudioState,
    branches: Branch[],
    models: OpticModel[],
    labels: { cornea: string; iol: string; retina: string },
  ) => void;
  resize: (width: number, height: number) => void;
  setView: (view: "3d" | "side" | "retina", state: StudioState) => void;
  render: () => void;
  dispose: () => void;
  canvas: HTMLCanvasElement;
};

function disposeGroup(group: GroupLike) {
  const geometries = new Set<{ dispose: () => void }>();
  const materials = new Set<MatLike>();
  const textures = new Set<TexLike>();

  group.traverse((object) => {
    if (object.geometry) geometries.add(object.geometry);
    const entries = Array.isArray(object.material)
      ? object.material
      : object.material
        ? [object.material]
        : [];
    for (const material of entries) {
      materials.add(material);
      if (material.map) textures.add(material.map);
    }
  });

  geometries.forEach((item) => item.dispose());
  materials.forEach((item) => item.dispose());
  textures.forEach((item) => item.dispose());
  group.clear();
}

export function createStudioScene(
  THREE: ThreeNS,
  OrbitControls: new (
    camera: CameraLike,
    el: HTMLElement,
  ) => OrbitControlsLike,
  onContextLost: () => void,
): SceneHandle {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 300);
  camera.position.set(-15, 22, 48);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setClearColor(0xf3f0e9, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  renderer.domElement.addEventListener("webglcontextlost", (event) => {
    event.preventDefault();
    onContextLost();
  });

  const orbit = new OrbitControls(camera, renderer.domElement);
  orbit.target.set(10, 0, 0);
  orbit.enableDamping = false;
  orbit.minDistance = 18;
  orbit.maxDistance = 105;
  orbit.addEventListener("change", () => renderer.render(scene, camera));

  scene.add(new THREE.AmbientLight(0xdce8ef, 1.35));
  const light = new THREE.DirectionalLight(0xffffff, 2.1);
  light.position.set(-10, 20, 30);
  scene.add(light);

  const dynamicGroup = new THREE.Group();
  scene.add(dynamicGroup);

  function line(
    points: number[][],
    color: string,
    opacity = 1,
    dashed = false,
  ) {
    const geometry = new THREE.BufferGeometry().setFromPoints(
      points.map((point) => new THREE.Vector3(point[0]!, point[1]!, point[2]!)),
    );
    const material = dashed
      ? new THREE.LineDashedMaterial({
          color,
          transparent: true,
          opacity,
          dashSize: 0.6,
          gapSize: 0.4,
          depthWrite: false,
        })
      : new THREE.LineBasicMaterial({
          color,
          transparent: true,
          opacity,
          depthWrite: false,
        });
    const result = new THREE.Line(geometry, material);
    if (dashed) result.computeLineDistances();
    dynamicGroup.add(result);
  }

  function textSprite(text: string, position: number[], color = "#003153") {
    const canvas = document.createElement("canvas");
    canvas.width = 768;
    canvas.height = 128;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.font = "600 42px 'Noto Sans TC', system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = color;
    ctx.fillText(text, canvas.width / 2, canvas.height / 2);
    const texture = new THREE.CanvasTexture(canvas);
    const material = new THREE.SpriteMaterial({
      map: texture,
      transparent: true,
      depthTest: false,
      depthWrite: false,
    });
    const sprite = new THREE.Sprite(material);
    sprite.position.set(position[0]!, position[1]!, position[2]!);
    sprite.scale.set(12, 2, 1);
    dynamicGroup.add(sprite);
  }

  function disk(x: number, radius: number, color: string, opacity: number) {
    const geometry = new THREE.CircleGeometry(radius, 80);
    const material = new THREE.MeshBasicMaterial({
      color,
      transparent: true,
      opacity,
      side: THREE.DoubleSide,
      depthWrite: false,
    });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.rotation.y = Math.PI / 2;
    mesh.position.x = x;
    dynamicGroup.add(mesh);
  }

  function ring(x: number, radius: number, color: string, opacity = 0.7) {
    const points: number[][] = [];
    for (let i = 0; i <= 100; i++) {
      const angle = (i / 100) * Math.PI * 2;
      points.push([x, radius * Math.cos(angle), radius * Math.sin(angle)]);
    }
    line(points, color, opacity);
  }

  function buildAnatomy(
    state: StudioState,
    labels: { cornea: string; iol: string; retina: string },
  ) {
    const AL = state.axialLength;
    const lensX = OPTICAL_CONSTANTS.lensDepth * 1000;

    const shell = new THREE.Mesh(
      new THREE.SphereGeometry(1, 36, 24),
      new THREE.MeshBasicMaterial({
        color: "#4d6d86",
        transparent: true,
        opacity: 0.12,
        wireframe: true,
        depthWrite: false,
      }),
    );
    shell.position.x = AL / 2;
    shell.scale.set(AL / 2, 10.5, 10.5);
    dynamicGroup.add(shell);

    // Clear cornea plane — restrained transparency.
    disk(0, 5.7, "#7eb8d4", 0.14);
    ring(0, 5.7, "#0a4468", 0.8);

    const lens = new THREE.Mesh(
      new THREE.SphereGeometry(1, 48, 32),
      new THREE.MeshPhongMaterial({
        color: "#9ec5dd",
        transparent: true,
        opacity: 0.28,
        shininess: 100,
        side: THREE.DoubleSide,
        depthWrite: false,
      }),
    );
    lens.position.x = lensX;
    lens.scale.set(0.65, 3, 3);
    dynamicGroup.add(lens);
    ring(lensX, 3, "#003153", 0.75);

    // Stylized haptics; not manufacturer-specific geometry.
    line(
      [
        [lensX, 2.4, 1.7],
        [lensX, 4.3, 2.4],
        [lensX, 5.1, 1.7],
        [lensX, 5.3, 0.3],
      ],
      "#4d6d86",
      0.65,
    );
    line(
      [
        [lensX, -2.4, -1.7],
        [lensX, -4.3, -2.4],
        [lensX, -5.1, -1.7],
        [lensX, -5.3, -0.3],
      ],
      "#4d6d86",
      0.65,
    );

    if (state.design === "multi") {
      // Decorative schematic rings; not actual diffractive zones / product geometry.
      for (const radius of [0.8, 1.3, 1.8, 2.3]) {
        ring(lensX - 0.7, radius, BRANCH_COLORS.intermediate, 0.22);
      }
    }
    if (state.design === "edof") {
      ring(lensX - 0.7, 1.7, BRANCH_COLORS.intermediate, 0.32);
    }

    disk(AL, 6, "#c788aa", 0.12);
    ring(AL, 6, "#b54a6a", 0.8);

    for (const offset of [-4, -2, 0, 2, 4]) {
      const edge = Math.sqrt(36 - offset * offset);
      line(
        [
          [AL, offset, -edge],
          [AL, offset, edge],
        ],
        "#845f7d",
        0.25,
      );
      line(
        [
          [AL, -edge, offset],
          [AL, edge, offset],
        ],
        "#845f7d",
        0.25,
      );
    }

    line(
      [
        [-13, 0, 0],
        [36, 0, 0],
      ],
      "#6b7785",
      0.35,
      true,
    );

    textSprite(labels.cornea, [0, -7.2, 0], "#0a4468");
    textSprite(labels.iol, [lensX, 7.1, 0], "#003153");
    textSprite(labels.retina, [AL, -7.2, 0], "#b54a6a");

    if (state.cornealCylinder > 0.05) {
      const angle = (state.cornealAxis * Math.PI) / 180;
      const y = 5.3 * Math.cos(angle);
      const z = 5.3 * Math.sin(angle);
      line(
        [
          [0, -y, -z],
          [0, y, z],
        ],
        BRANCH_COLORS.intermediate,
        0.9,
      );
    }

    if (state.toricEnabled && state.toricCylinder > 0.01) {
      const angle = (state.toricAxis * Math.PI) / 180;
      const y = 2.8 * Math.cos(angle);
      const z = 2.8 * Math.sin(angle);
      line(
        [
          [lensX - 0.75, -y, -z],
          [lensX - 0.75, y, z],
        ],
        BRANCH_COLORS.near,
        0.95,
      );
    }
  }

  function buildRays(
    state: StudioState,
    branches: Branch[],
    models: OpticModel[],
  ) {
    const lensX = OPTICAL_CONSTANTS.lensDepth * 1000;
    const AL = state.axialLength;
    const rayCount = state.design === "edof" ? 12 : 20;

    branches.forEach((branch, branchIndex) => {
      const model = models[branchIndex]!;

      for (let i = 0; i < rayCount; i++) {
        const angle = (i / rayCount) * Math.PI * 2;
        const radius =
          OPTICAL_CONSTANTS.entranceRadiusMM * (i % 2 === 0 ? 1 : 0.6);
        const entrance: [number, number] = [
          radius * Math.cos(angle),
          radius * Math.sin(angle),
        ];
        const atLens = Mat.vec(model.Y, entrance);
        const atRetina = Mat.vec(model.retinaMap, entrance);
        const externalX = -12;
        const externalFactor =
          1 + (externalX / 1000) * state.objectVergence;
        const opacity =
          state.design === "edof"
            ? 0.16 + branch.weight * 1.1
            : 0.2 + branch.weight * 0.6;

        line(
          [
            [
              externalX,
              entrance[0] * externalFactor,
              entrance[1] * externalFactor,
            ],
            [0, entrance[0], entrance[1]],
            [lensX, atLens[0], atLens[1]],
            [AL, atRetina[0], atRetina[1]],
          ],
          branch.color,
          opacity,
        );

        if (state.showExtensions) {
          const finiteFoci = model.fociMM.filter((v) =>
            Number.isFinite(v as number),
          ) as number[];
          const furthestFocus = finiteFoci.length
            ? Math.max(...finiteFoci)
            : AL;
          const endX = Math.min(38, Math.max(AL + 2, furthestFocus + 1));
          const endPoint = atPosition(state, model, entrance, endX);
          line(
            [
              [AL, atRetina[0], atRetina[1]],
              [endX, endPoint[0], endPoint[1]],
            ],
            branch.color,
            opacity * 0.45,
            true,
          );
        }
      }

      if (state.showExtensions) {
        const uniqueFoci: number[] = [];
        for (const focusX of model.fociMM) {
          if (
            !Number.isFinite(focusX as number) ||
            (focusX as number) < lensX ||
            (focusX as number) > 38 ||
            uniqueFoci.some((value) => Math.abs(value - (focusX as number)) < 0.02)
          ) {
            continue;
          }
          uniqueFoci.push(focusX as number);
          const focalCurve: number[][] = [];
          for (let i = 0; i <= 60; i++) {
            const angle = (i / 60) * Math.PI * 2;
            const entrance: [number, number] = [
              OPTICAL_CONSTANTS.entranceRadiusMM * Math.cos(angle),
              OPTICAL_CONSTANTS.entranceRadiusMM * Math.sin(angle),
            ];
            const p = atPosition(state, model, entrance, focusX as number);
            focalCurve.push([focusX as number, p[0], p[1]]);
          }
          line(focalCurve, branch.color, 0.55);
          const marker = new THREE.Mesh(
            new THREE.SphereGeometry(0.1, 12, 8),
            new THREE.MeshBasicMaterial({
              color: branch.color,
              transparent: true,
              opacity: 0.7,
            }),
          );
          marker.position.set(focusX as number, 0, 0);
          dynamicGroup.add(marker);
        }
      }

      const cloud = sampleDisc(130);
      const vertices: number[] = [];
      for (const entrance of cloud) {
        const [y, z] = Mat.vec(model.retinaMap, entrance);
        vertices.push(AL - 0.015, y, z);
      }
      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute(
        "position",
        new THREE.Float32BufferAttribute(vertices, 3),
      );
      dynamicGroup.add(
        new THREE.Points(
          geometry,
          new THREE.PointsMaterial({
            color: branch.color,
            size: 0.055,
            transparent: true,
            opacity: clamp(branch.weight * 1.5, 0.12, 0.8),
            depthWrite: false,
          }),
        ),
      );
    });
  }

  return {
    canvas: renderer.domElement,
    rebuild(state, branches, models, labels) {
      disposeGroup(dynamicGroup);
      buildAnatomy(state, labels);
      buildRays(state, branches, models);
      renderer.render(scene, camera);
    },
    resize(width, height) {
      renderer.setSize(width, height, false);
      camera.aspect = width / Math.max(1, height);
      camera.updateProjectionMatrix();
      renderer.render(scene, camera);
    },
    setView(view, state) {
      const targetX = state.axialLength / 2 - 2;
      if (view === "side") {
        camera.position.set(targetX, 0, 57);
        orbit.target.set(targetX, 0, 0);
      } else if (view === "retina") {
        camera.position.set(state.axialLength + 42, 0.01, 0.01);
        orbit.target.set(state.axialLength, 0, 0);
      } else {
        camera.position.set(-15, 22, 48);
        orbit.target.set(targetX, 0, 0);
      }
      orbit.update();
      renderer.render(scene, camera);
    },
    render() {
      renderer.render(scene, camera);
    },
    dispose() {
      disposeGroup(dynamicGroup);
      renderer.domElement.remove();
    },
  };
}

export function drawRetinalFootprint(
  canvas: HTMLCanvasElement,
  branches: Branch[],
  models: OpticModel[],
  scaleLabel: string,
  paperBg = "#0c1a28",
): string {
  const rect = canvas.getBoundingClientRect();
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const cssW = Math.max(1, rect.width || canvas.clientWidth || 280);
  const cssH = Math.max(1, rect.height || canvas.clientHeight || 220);
  canvas.width = Math.round(cssW * dpr);
  canvas.height = Math.round(cssH * dpr);
  const ctx = canvas.getContext("2d");
  if (!ctx) return "";
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  const width = cssW;
  const height = cssH;
  const cx = width / 2;
  const cy = height / 2;

  ctx.fillStyle = paperBg;
  ctx.fillRect(0, 0, width, height);

  const samples = sampleDisc();
  const clouds = models.map((model) =>
    samples.map((point) => Mat.vec(model.retinaMap, point)),
  );

  let maxRadiusMM = 0.03;
  for (const cloud of clouds) {
    for (const point of cloud) {
      maxRadiusMM = Math.max(maxRadiusMM, Math.hypot(...point));
    }
  }

  const displayRadiusMM = maxRadiusMM * 1.18;
  const pixelsPerMM = (Math.min(width, height) * 0.41) / displayRadiusMM;

  ctx.strokeStyle = "#2a4054";
  ctx.lineWidth = 1;
  for (const fraction of [0.25, 0.5, 0.75, 1]) {
    ctx.beginPath();
    ctx.arc(cx, cy, fraction * displayRadiusMM * pixelsPerMM, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.beginPath();
  ctx.moveTo(10, cy);
  ctx.lineTo(width - 10, cy);
  ctx.moveTo(cx, 10);
  ctx.lineTo(cx, height - 10);
  ctx.stroke();

  clouds.forEach((cloud, index) => {
    ctx.fillStyle = branches[index]!.color;
    ctx.globalAlpha = clamp(branches[index]!.weight * 1.7, 0.12, 0.75);
    for (const [y, z] of cloud) {
      ctx.beginPath();
      ctx.arc(cx + z * pixelsPerMM, cy - y * pixelsPerMM, 1.6, 0, Math.PI * 2);
      ctx.fill();
    }
  });

  ctx.globalAlpha = 1;
  ctx.fillStyle = "#9aabba";
  ctx.font = "11px 'Noto Sans TC', system-ui";
  ctx.fillText("y", cx + 6, 15);
  ctx.fillText("z", width - 15, cy - 6);

  return `${scaleLabel}: ±${(displayRadiusMM * 1000).toFixed(0)} µm`;
}

export function studioLangFromLocale(
  locale: string,
): StudioLang {
  if (locale === "en" || locale === "ja") return "en";
  return "zh";
}

export const THREE_MODULE_URL =
  "/vendor/three/0.180.0/build/three.module.js";
export const ORBIT_CONTROLS_URL =
  "/vendor/three/0.180.0/examples/jsm/controls/OrbitControls.js";
