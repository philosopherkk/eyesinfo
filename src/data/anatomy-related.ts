/** Related routes for EyeAnatomyViewer — keep in sync with CATEGORIES / TOPICS. */

export type AnatomyRegionId =
  | "cornea"
  | "anteriorChamber"
  | "lens"
  | "vitreous"
  | "retina"
  | "macula"
  | "opticNerve";

export type AnatomyCatId = "lens" | "lid" | "glaucoma" | "retina" | "surface";

export type AnatomyRelatedLink =
  | { kind: "cat"; catId: AnatomyCatId }
  | { kind: "topic"; topicId: string }
  | {
      kind: "topics";
      topicIds: string[];
      hub: { kind: "cat"; catId: AnatomyCatId };
    };

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
  macula: {
    kind: "topics",
    topicIds: ["d5", "t-macular-hole", "t-erm", "t-high-myopia-pathology"],
    hub: { kind: "cat", catId: "retina" },
  },
  opticNerve: { kind: "cat", catId: "glaucoma" },
};
