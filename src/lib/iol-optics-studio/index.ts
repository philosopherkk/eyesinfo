/** IOL Optics Studio — educational paraxial model (educational-paraxial-v1). */
export * from "./types.ts";
export * from "./optics.ts";
export {
  DICTIONARY,
  modelNotesHtml,
  patientParagraphs,
} from "./explanations.ts";
export {
  createStudioScene,
  drawRetinalFootprint,
  studioLangFromLocale,
  THREE_MODULE_URL,
  ORBIT_CONTROLS_URL,
} from "./scene.ts";
