/** Educational paraxial IOL model — types only. Not a clinical calculator. */

export type StudioLang = "en" | "zh";

export type Design = "mono" | "edof" | "multi" | "toric";

export type ScenarioName =
  | "distance"
  | "near"
  | "astig"
  | "corrected"
  | "rotated"
  | "long"
  | "edof"
  | "multi";

export type StudioState = {
  design: Design;
  objectVergence: number;
  cornealCylinder: number;
  cornealAxis: number;
  axialLength: number;
  sphere: number;
  toricEnabled: boolean;
  toricCylinder: number;
  toricAxis: number;
  showExtensions: boolean;
  referenceAL: number;
};

export type Branch = {
  add: number;
  weight: number;
  color: string;
};

/** Column-major 2×2 as [a00, a01, a10, a11]. */
export type Mat2 = [number, number, number, number];

export type OpticModel = {
  C: Mat2;
  Y: Mat2;
  Q: Mat2;
  retinaMap: Mat2;
  fociMM: (number | null)[];
  rmsMM: number;
};

export type OpticalConstants = {
  n: number;
  meanCornea: number;
  lensDepth: number;
  entranceRadiusMM: number;
};
