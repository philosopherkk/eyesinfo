/** Related routes for EyeAnatomyViewer — keep in sync with CATEGORIES / TOPICS. */

export type AnatomyRegionId =
  | "cornea"
  | "anteriorChamber"
  | "lens"
  | "vitreous"
  | "retina"
  | "macula"
  | "opticNerve";

export type AnatomyRelatedLink =
  | { kind: "cat"; catId: "lens" | "lid" | "glaucoma" | "retina" | "surface" }
  | { kind: "topic"; topicId: string };

export const ANATOMY_REGION_ORDER: AnatomyRegionId[] = [
  "cornea",
  "anteriorChamber",
  "lens",
  "vitreous",
  "retina",
  "macula",
  "opticNerve",
];

export const ANATOMY_RELATED: Record<AnatomyRegionId, AnatomyRelatedLink> = {
  cornea: { kind: "cat", catId: "surface" },
  anteriorChamber: { kind: "cat", catId: "glaucoma" },
  lens: { kind: "cat", catId: "lens" },
  vitreous: { kind: "topic", topicId: "d8" },
  retina: { kind: "cat", catId: "retina" },
  macula: { kind: "topic", topicId: "d5" },
  opticNerve: { kind: "cat", catId: "glaucoma" },
};
