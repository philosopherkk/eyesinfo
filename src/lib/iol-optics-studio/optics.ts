/**
 * IOL Optics Studio — pure paraxial matrix / ray calculations.
 * Educational schematic only. NOT a clinical calculator.
 *
 * Preserves the optical model from KK’s iol-optics-studio-source.html
 * (modelVersion: educational-paraxial-v1).
 */

import type {
  Branch,
  Design,
  Mat2,
  OpticalConstants,
  OpticModel,
  ScenarioName,
  StudioState,
} from "./types.ts";

export const OPTICAL_CONSTANTS: OpticalConstants = {
  n: 1.336,
  meanCornea: 43,
  lensDepth: 0.005,
  entranceRadiusMM: 1.5,
};

/** Branch colors — distance / intermediate / near (site-readable accents). */
export const BRANCH_COLORS = {
  distance: "#0a7ea4",
  intermediate: "#b8860b",
  near: "#b54a6a",
} as const;

export const DEFAULT_STATE: StudioState = {
  design: "mono",
  objectVergence: 0,
  cornealCylinder: 0,
  cornealAxis: 90,
  axialLength: 24,
  sphere: 19,
  toricEnabled: false,
  toricCylinder: 0,
  toricAxis: 90,
  showExtensions: true,
  referenceAL: 24,
};

export function clamp(x: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, x));
}

export const Mat = {
  I: (): Mat2 => [1, 0, 0, 1],

  add: (a: Mat2, b: Mat2): Mat2 => a.map((x, i) => x + b[i]) as Mat2,

  sub: (a: Mat2, b: Mat2): Mat2 => a.map((x, i) => x - b[i]) as Mat2,

  scale: (a: Mat2, s: number): Mat2 => a.map((x) => x * s) as Mat2,

  mul: (a: Mat2, b: Mat2): Mat2 => [
    a[0] * b[0] + a[1] * b[2],
    a[0] * b[1] + a[1] * b[3],
    a[2] * b[0] + a[3] * b[2],
    a[2] * b[1] + a[3] * b[3],
  ],

  vec: (a: Mat2, v: [number, number]): [number, number] => [
    a[0] * v[0] + a[1] * v[1],
    a[2] * v[0] + a[3] * v[1],
  ],

  inverse: (a: Mat2): Mat2 => {
    const det = a[0] * a[3] - a[1] * a[2];
    if (Math.abs(det) < 1e-12) throw new Error("Singular ray matrix");
    return [a[3] / det, -a[1] / det, -a[2] / det, a[0] / det];
  },

  symmetricEigenvalues: (a: Mat2): [number, number] => {
    const mean = (a[0] + a[3]) / 2;
    const off = (a[1] + a[2]) / 2;
    const delta = Math.hypot((a[0] - a[3]) / 2, off);
    return [mean - delta, mean + delta];
  },
};

export function powerMatrix(
  mean: number,
  cylinder: number,
  axisDegrees: number,
  sign = 1,
): Mat2 {
  const angle = (axisDegrees * Math.PI) / 180;
  const c = Math.cos(angle);
  const s = Math.sin(angle);
  const h = (sign * cylinder) / 2;

  return [
    mean + h * (c * c - s * s),
    2 * h * c * s,
    2 * h * c * s,
    mean - h * (c * c - s * s),
  ];
}

export function distanceText(vergence: number, lang: "en" | "zh"): string {
  if (vergence < 0.00001) return lang === "zh" ? "無限遠" : "Infinity";
  const cm = 100 / vergence;
  return lang === "zh"
    ? `${cm.toFixed(cm < 100 ? 0 : 1)} 公分`
    : `${cm.toFixed(cm < 100 ? 0 : 1)} cm`;
}

export function angularDifference(a: number, b: number): number {
  const difference = Math.abs(a - b) % 180;
  return Math.min(difference, 180 - difference);
}

export function branchesFor(design: Design): Branch[] {
  if (design === "multi") {
    return [
      { add: 0, weight: 0.5, color: BRANCH_COLORS.distance },
      { add: 1.75, weight: 0.2, color: BRANCH_COLORS.intermediate },
      { add: 3.5, weight: 0.3, color: BRANCH_COLORS.near },
    ];
  }

  if (design === "edof") {
    // Illustrative continuum sampling, not physical EDOF lens zones.
    const weights = [0.24, 0.2, 0.17, 0.14, 0.11, 0.08, 0.06];
    return weights.map((weight, i) => ({
      add: (i * 2.0) / 6,
      weight,
      color: i === 0 ? BRANCH_COLORS.distance : BRANCH_COLORS.intermediate,
    }));
  }

  return [{ add: 0, weight: 1, color: BRANCH_COLORS.distance }];
}

export function distanceFit(state: StudioState): { mean: number; cylinder: number } {
  const { n, lensDepth: d, meanCornea: K } = OPTICAL_CONSTANTS;
  const L = state.axialLength / 1000 - d;
  const highK = K + state.cornealCylinder / 2;
  const lowK = K - state.cornealCylinder / 2;

  const highP = n / L - highK / (1 - (d * highK) / n);
  const lowP = n / L - lowK / (1 - (d * lowK) / n);

  return {
    mean: (highP + lowP) / 2,
    cylinder: lowP - highP,
  };
}

export function matrices(state: StudioState, add = 0): OpticModel {
  const { n, lensDepth: d, meanCornea } = OPTICAL_CONSTANTS;

  const C = powerMatrix(
    meanCornea,
    state.cornealCylinder,
    state.cornealAxis,
    +1,
  );

  const initialQ = Mat.scale(Mat.I(), state.objectVergence);
  const afterCorneaQ = Mat.sub(initialQ, C);
  const Y = Mat.add(Mat.I(), Mat.scale(afterCorneaQ, d / n));

  // Toric power is lower along the compensation meridian.
  const P = powerMatrix(
    state.sphere + add,
    state.toricEnabled ? state.toricCylinder : 0,
    state.toricAxis,
    -1,
  );

  const Q = Mat.sub(afterCorneaQ, Mat.mul(P, Y));
  const L = state.axialLength / 1000 - d;
  const retinaMap = Mat.add(Y, Mat.scale(Q, L / n));

  const localSlopeMatrix = Mat.mul(Q, Mat.inverse(Y));
  const eig = Mat.symmetricEigenvalues(localSlopeMatrix);

  const fociMM = eig.map((value) => {
    if (value >= -1e-10) return null;
    return (d - n / value) * 1000;
  });

  const r = OPTICAL_CONSTANTS.entranceRadiusMM;
  const rmsMM =
    (r / 2) *
    Math.sqrt(retinaMap.reduce((sum, value) => sum + value * value, 0));

  return { C, Y, Q, retinaMap, fociMM, rmsMM };
}

export function atPosition(
  state: StudioState,
  model: OpticModel,
  entrance: [number, number],
  xMM: number,
): [number, number] {
  const atLens = Mat.vec(model.Y, entrance);
  const q = Mat.vec(model.Q, entrance);
  const travelM = xMM / 1000 - OPTICAL_CONSTANTS.lensDepth;

  return [
    atLens[0] + (travelM * q[0]) / OPTICAL_CONSTANTS.n,
    atLens[1] + (travelM * q[1]) / OPTICAL_CONSTANTS.n,
  ];
}

export function sampleDisc(count = 280): [number, number][] {
  const points: [number, number][] = [];
  const goldenAngle = Math.PI * (3 - Math.sqrt(5));

  for (let i = 0; i < count; i++) {
    const r =
      OPTICAL_CONSTANTS.entranceRadiusMM * Math.sqrt((i + 0.5) / count);
    const theta = i * goldenAngle;
    points.push([r * Math.cos(theta), r * Math.sin(theta)]);
  }

  return points;
}

export function fitSphere(state: StudioState): StudioState {
  const fit = distanceFit(state);
  return {
    ...state,
    sphere: clamp(fit.mean, 0, 40),
    referenceAL: state.axialLength,
  };
}

export function fitToric(state: StudioState): StudioState {
  const fit = distanceFit(state);
  let design = state.design;
  if (design === "mono") design = "toric";

  return {
    ...state,
    sphere: clamp(fit.mean, 0, 40),
    toricCylinder: clamp(fit.cylinder, 0, 8),
    toricAxis: state.cornealAxis,
    toricEnabled: true,
    referenceAL: state.axialLength,
    design,
  };
}

export function calibratedDefaults(): StudioState {
  return fitSphere({ ...DEFAULT_STATE });
}

export function applyScenario(name: ScenarioName): StudioState {
  let state = calibratedDefaults();

  if (name === "near") {
    state = { ...state, objectVergence: 2.5 };
  }

  if (name === "astig") {
    state = fitSphere({ ...state, cornealCylinder: 2 });
  }

  if (name === "corrected" || name === "rotated") {
    state = fitToric({ ...state, cornealCylinder: 2 });
    if (name === "rotated") {
      state = {
        ...state,
        toricAxis: (state.cornealAxis + 30) % 180,
      };
    }
  }

  if (name === "long") {
    // Keep the lens calibrated for the original 24 mm eye.
    state = { ...state, axialLength: 27 };
  }

  if (name === "edof") {
    state = { ...state, design: "edof", objectVergence: 1.25 };
  }

  if (name === "multi") {
    state = { ...state, design: "multi", objectVergence: 2.5 };
  }

  return state;
}

export function focusOffsetsMM(
  state: StudioState,
  model: OpticModel,
): (number | null)[] {
  return model.fociMM.map((value) =>
    Number.isFinite(value as number)
      ? (value as number) - state.axialLength
      : null,
  );
}

export function weightedRmsMM(
  branches: Branch[],
  models: OpticModel[],
): number {
  return Math.sqrt(
    models.reduce(
      (sum, model, index) =>
        sum + branches[index]!.weight * model.rmsMM ** 2,
      0,
    ),
  );
}

export function exportPayload(state: StudioState) {
  return {
    application: "IOL Optics Studio",
    modelVersion: "educational-paraxial-v1",
    warning: "Educational settings only. Not a clinical prescription.",
    exportedAt: new Date().toISOString(),
    parameters: { ...state },
    constants: { ...OPTICAL_CONSTANTS },
    assumptions: {
      regularAstigmatismOnly: true,
      fixedEffectiveLensPlane: true,
      schematicEDOF: true,
      schematicMultifocal: true,
      predictsVisualAcuity: false,
    },
  };
}
