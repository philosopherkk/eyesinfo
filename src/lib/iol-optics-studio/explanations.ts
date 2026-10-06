/**
 * Bilingual (EN + 繁體中文) copy for IOL Optics Studio.
 * Traditional Chinese is canonical for site voice; EN preserved from KK’s studio.
 * Japanese / Simplified use site chrome keys elsewhere — optical paragraphs stay EN+繁.
 */

import {
  angularDifference,
  distanceText,
} from "./optics.ts";
import type { OpticModel, StudioLang, StudioState } from "./types.ts";

export type UiDictKey =
  | "title"
  | "subtitle"
  | "notice"
  | "parameters"
  | "lensDesign"
  | "mono"
  | "edof"
  | "multi"
  | "toric"
  | "objectVergence"
  | "cornealCylinder"
  | "cornealAxis"
  | "axialLength"
  | "sphere"
  | "toricCylinder"
  | "toricAxis"
  | "far"
  | "intermediate"
  | "near"
  | "enableToric"
  | "axisNote"
  | "fitSphere"
  | "fitToric"
  | "fixedPowerNote"
  | "extensions"
  | "reset"
  | "export"
  | "threeD"
  | "view3D"
  | "viewSide"
  | "viewRetina"
  | "gesture"
  | "distanceBranch"
  | "intermediateBranch"
  | "nearBranch"
  | "objectDistance"
  | "distanceUnit"
  | "focusOffset"
  | "focusUnit"
  | "rmsLabel"
  | "rmsUnit"
  | "retinalFootprint"
  | "footprintNote"
  | "scenarios"
  | "scenarioDistance"
  | "scenarioNear"
  | "scenarioAstig"
  | "scenarioCorrected"
  | "scenarioRotated"
  | "scenarioLong"
  | "scenarioEDOF"
  | "scenarioMulti"
  | "scenarioNote"
  | "patientExplanation"
  | "limitations"
  | "footer"
  | "cornea"
  | "iol"
  | "retina"
  | "scale"
  | "loading"
  | "loadFail"
  | "contextLost"
  | "phoneTip"
  | "controlsToggle"
  | "compactMode"
  | "fullMode"
  | "visionDemoH";

export const DICTIONARY: Record<StudioLang, Record<UiDictKey, string>> = {
  en: {
    title: "IOL Optics Studio",
    subtitle: "Explore how light, eye length, and lens design interact.",
    notice:
      "Educational schematic only. Not an IOL prescription calculator, visual-acuity prediction, or substitute for a registered doctor’s assessment. 不能代替註冊醫生.",
    parameters: "Optical parameters",
    lensDesign: "IOL design",
    mono: "Monofocal",
    edof: "EDOF — schematic",
    multi: "Multifocal — schematic trifocal",
    toric: "Toric monofocal",
    objectVergence: "Object distance",
    cornealCylinder: "Corneal astigmatism",
    cornealAxis: "Corneal steep meridian",
    axialLength: "Axial length",
    sphere: "Mean IOL power",
    toricCylinder: "IOL-plane toric cylinder",
    toricAxis: "Toric compensation meridian",
    far: "Distance ∞",
    intermediate: "80 cm",
    near: "40 cm",
    enableToric: "Enable toric correction",
    axisNote:
      "Angles here are model meridians, not surgical marking instructions. Cylinder is specified at the IOL plane.",
    fitSphere: "Refit distance power",
    fitToric: "Match toric in model",
    fixedPowerNote:
      "Changing axial length does not automatically change IOL power. Use “Refit distance power” to demonstrate recalibration.",
    extensions: "Show focus-construction extensions",
    reset: "Reset model",
    export: "Export settings",
    threeD: "3D light convergence",
    view3D: "3D view",
    viewSide: "Side view",
    viewRetina: "Retinal view",
    gesture:
      "Drag to rotate · Scroll or pinch to zoom · Dashed rays are mathematical extensions, not light passing through the retina.",
    distanceBranch: "Distance branch",
    intermediateBranch: "Intermediate / EDOF range",
    nearBranch: "Near branch",
    objectDistance: "Object distance",
    distanceUnit: "from corneal plane",
    focusOffset: "Distance-branch principal foci",
    focusUnit: "mm relative to retina; − = in front",
    rmsLabel: "Schematic retinal RMS radius",
    rmsUnit: "µm; includes all modeled branches",
    retinalFootprint: "Retinal light footprint",
    footprintNote:
      "Ray-intersection diagram, not a simulated photograph, point-spread function, or predicted patient vision.",
    scenarios: "Teaching scenarios",
    scenarioDistance: "1. Monofocal / distance",
    scenarioNear: "2. Monofocal / reading",
    scenarioAstig: "3. Uncorrected astigmatism",
    scenarioCorrected: "4. Aligned toric correction",
    scenarioRotated: "5. Rotated toric correction",
    scenarioLong: "6. Longer eye / fixed IOL",
    scenarioEDOF: "7. EDOF / intermediate",
    scenarioMulti: "8. Multifocal / near",
    scenarioNote:
      "Presets isolate teaching concepts. They are not treatment recommendations.",
    patientExplanation: "Patient explanation",
    limitations: "Model assumptions and limitations",
    footer:
      "Educational illustration · No patient data is collected. 不能代替註冊醫生.",
    cornea: "CORNEA",
    iol: "IOL",
    retina: "RETINA",
    scale: "Display radius",
    loading: "Loading 3D model…",
    loadFail:
      "Unable to load the 3D viewer. Check WebGL support and the browser console. Controls and explanations remain available.",
    contextLost:
      "The graphics context was interrupted. Reload this page to restore the 3D view.",
    phoneTip:
      "On a small phone screen, the 3D model is easier to explore in landscape or on a wider browser. Controls stay below the viewer.",
    controlsToggle: "Show or hide controls",
    compactMode: "Compact",
    fullMode: "Full",
    visionDemoH: "Appearance at far / intermediate / near",
  },
  zh: {
    title: "人工水晶體光學教學",
    subtitle: "探索物體距離、眼軸長度及人工水晶體設計如何影響光線聚焦。",
    notice:
      "本模型僅供教學示意，不可用於人工水晶體度數處方、視力預測，亦不能代替註冊醫生的個別評估。",
    parameters: "光學參數",
    lensDesign: "人工水晶體設計",
    mono: "單焦點",
    edof: "延長焦深 EDOF－示意",
    multi: "多焦點－三焦點示意",
    toric: "散光矯正型單焦點",
    objectVergence: "物體距離",
    cornealCylinder: "角膜散光",
    cornealAxis: "角膜較陡子午線",
    axialLength: "眼軸長度",
    sphere: "人工水晶體平均屈光力",
    toricCylinder: "人工水晶體平面散光度數",
    toricAxis: "散光補償子午線",
    far: "遠距離 ∞",
    intermediate: "80 公分",
    near: "40 公分",
    enableToric: "啟用散光矯正",
    axisNote:
      "此處角度為模型子午線，並非手術定位標記。散光度數以人工水晶體平面表示。",
    fitSphere: "重新配合遠距離度數",
    fitToric: "在模型中匹配散光",
    fixedPowerNote:
      "改變眼軸長度不會自動改變人工水晶體度數。可按「重新配合遠距離度數」示範重新校準。",
    extensions: "顯示焦點作圖延長線",
    reset: "重設模型",
    export: "匯出設定",
    threeD: "3D 光線聚焦",
    view3D: "3D 視角",
    viewSide: "側面視角",
    viewRetina: "視網膜視角",
    gesture:
      "拖曳旋轉・滾輪或雙指縮放・虛線為數學作圖延長線，並非光線穿透視網膜。",
    distanceBranch: "遠距離分支",
    intermediateBranch: "中距離／延長焦深範圍",
    nearBranch: "近距離分支",
    objectDistance: "物體距離",
    distanceUnit: "由角膜平面起計",
    focusOffset: "遠距離分支的主焦點",
    focusUnit: "相對視網膜的毫米位置；負值＝前方",
    rmsLabel: "示意視網膜光斑 RMS 半徑",
    rmsUnit: "微米；包含所有模型分支",
    retinalFootprint: "視網膜光線分布",
    footprintNote:
      "此為光線落點圖，並非模擬照片、點擴散函數或患者實際視覺預測。",
    scenarios: "教學情境",
    scenarioDistance: "1. 單焦點／看遠",
    scenarioNear: "2. 單焦點／閱讀",
    scenarioAstig: "3. 未矯正的散光",
    scenarioCorrected: "4. 正確對位的散光矯正",
    scenarioRotated: "5. 散光矯正軸位旋轉",
    scenarioLong: "6. 較長眼軸／固定度數",
    scenarioEDOF: "7. 延長焦深／中距離",
    scenarioMulti: "8. 多焦點／看近",
    scenarioNote: "預設情境用於展示個別光學概念，並非治療建議。",
    patientExplanation: "給患者的解說",
    limitations: "模型假設與限制",
    footer: "教學示意・本工具不收集患者資料。不能代替註冊醫生。",
    cornea: "角膜",
    iol: "人工水晶體",
    retina: "視網膜",
    scale: "顯示半徑",
    loading: "正在載入 3D 模型…",
    loadFail:
      "無法載入 3D 檢視。請確認瀏覽器支援 WebGL。參數與解說仍可使用。",
    contextLost: "圖形內容中斷。請重新載入本頁以還原 3D 視圖。",
    phoneTip:
      "小螢幕手機較適合橫放或以較闊瀏覽器使用 3D 模型；控制項固定在檢視器下方，並避免左右橫向捲動。",
    controlsToggle: "顯示或收合控制項",
    compactMode: "精簡",
    fullMode: "完整",
    visionDemoH: "遠／中／近外觀示意",
  },
};

export function modelNotesHtml(lang: StudioLang): string {
  return lang === "en"
    ? `
      <ul>
        <li>Paraxial, on-axis, equivalent thin-plane ray tracing.
        The 3D eye is schematic rather than anatomically exact.</li>
        <li>Mean corneal power is 43 D, refractive index is 1.336,
        and the effective IOL plane is fixed 5 mm behind the cornea.</li>
        <li>The entrance beam is 3 mm across at the corneal plane.
        This is not a full anatomical pupil or iris model.</li>
        <li>Corneal cylinder represents regular equivalent corneal
        astigmatism. Posterior corneal astigmatism is not independently modeled.</li>
        <li>The power slider represents mean equivalent IOL power.
        Toric cylinder is specified at the IOL plane.
        These values do not correspond directly to a manufacturer’s labeled prescription.</li>
        <li>EDOF is shown as a weighted range of illustrative powers.
        Multifocal is shown using three illustrative power branches.
        Neither is a product-specific diffractive or wave-optical simulation.</li>
        <li>Dashed segments beyond the retinal plane are mathematical
        constructions showing where a focus would occur if propagation continued.</li>
        <li>The retinal diagram and RMS radius describe geometric ray
        intersections only. They do not predict acuity, contrast,
        halos, glare, spectacle independence, or subjective vision.</li>
        <li>No accommodation, diffraction, aberration analysis,
        chromatic effects, retinal disease, neural adaptation,
        lens tilt/decentration, or binocular vision is modeled.</li>
        <li>Changing eye length leaves IOL power fixed until a refit button
        is pressed. Model fitting is for demonstration only, not clinical use.</li>
      </ul>
    `
    : `
      <ul>
        <li>本模型使用近軸、軸上、等效薄平面光線追跡。
        3D 眼球為示意圖，並非精確解剖模型。</li>
        <li>角膜平均屈光力固定為 43 D，折射率為 1.336，
        人工水晶體等效平面固定在角膜後方 5 毫米。</li>
        <li>角膜平面的入射光束直徑為 3 毫米，
        並未完整模擬實際瞳孔或虹膜。</li>
        <li>角膜散光代表規則性的等效角膜散光；
        未獨立模擬角膜後表面散光。</li>
        <li>人工水晶體度數滑桿表示平均等效屈光力。
        散光度數以人工水晶體平面表示，
        不可直接對應廠商標示的處方規格。</li>
        <li>EDOF 以加權的示意屈光力範圍呈現，
        多焦點以三個示意屈光力分支呈現。
        兩者均非特定產品的繞射或波動光學模擬。</li>
        <li>視網膜後方的虛線為數學作圖，
        用於顯示假設光線繼續傳播時的焦點位置。</li>
        <li>光斑及 RMS 半徑僅描述幾何光線落點，
        不能預測視力、對比敏感度、光暈、眩光、
        脫鏡率或主觀視覺。</li>
        <li>未模擬調節、繞射、像差、色差、視網膜疾病、
        神經適應、水晶體傾斜或偏心，以及雙眼視覺。</li>
        <li>改變眼軸後，人工水晶體度數保持不變，
        直至按下重新配合按鈕。模型配合僅供教學，不能用於臨床。</li>
      </ul>
    `;
}

export function patientParagraphs(
  state: StudioState,
  models: OpticModel[],
): { en: string[]; zh: string[] } {
  const en: string[] = [];
  const zh: string[] = [];

  const distanceEN = distanceText(state.objectVergence, "en");
  const distanceZH = distanceText(state.objectVergence, "zh");

  en.push(
    `You are viewing light from an object at ${
      state.objectVergence === 0 ? "a very long distance" : distanceEN
    }. The colored lines show how the model eye bends that light toward the retina.`,
  );

  zh.push(
    `目前顯示的是來自${
      state.objectVergence === 0 ? "很遠處" : distanceZH + "處"
    }物體的光線。彩色線條用來示範模型眼睛如何將光線折射向視網膜。`,
  );

  if (state.design === "mono" || state.design === "toric") {
    en.push(
      "A monofocal IOL has one main focusing range. When selected for distance vision, reading glasses are commonly needed for close work. A different target can be chosen clinically, but this model’s refit button targets distance.",
    );
    zh.push(
      "單焦點人工水晶體主要提供一個聚焦範圍。若以看遠為目標，近距離閱讀通常仍需要閱讀眼鏡。臨床上可選擇其他目標，但本模型的重新配合按鈕以看遠為目標。",
    );
  }

  if (state.design === "edof") {
    en.push(
      "An EDOF IOL aims to extend the useful focusing range, particularly from distance toward intermediate tasks such as a computer screen. Fine print may still require glasses. Here, the extended range is represented schematically; it is not the optical design of a particular lens.",
    );
    zh.push(
      "延長焦深人工水晶體旨在延伸可用的聚焦範圍，特別是由遠距離至電腦螢幕等中距離工作。閱讀細小文字時仍可能需要眼鏡。此處以示意方式呈現延長範圍，並非某款水晶體的實際光學設計。",
    );
    en.push(
      "Glare, halos, and contrast effects vary with lens design and the individual eye. This ray diagram cannot estimate how much you would notice them.",
    );
    zh.push(
      "眩光、光暈及對比變化會因水晶體設計與個人眼睛而異。本光線圖無法估計您實際會感受到的程度。",
    );
  }

  if (state.design === "multi") {
    en.push(
      "A multifocal IOL distributes light among more than one focusing range. This example uses distance, intermediate, and near branches. Some light may be focused for the current task while other light forms a broader background.",
    );
    zh.push(
      "多焦點人工水晶體會將光線分配至多個聚焦範圍。本例顯示遠、中、近三個分支。在目前觀看距離，部分光線可能較集中，其他光線則形成較分散的背景。",
    );
    en.push(
      "Multifocal lenses can reduce dependence on glasses, but glasses may still be needed. Halos, glare, or reduced contrast can occur, and suitability depends on eye health and personal priorities.",
    );
    zh.push(
      "多焦點水晶體可減少對眼鏡的依賴，但仍可能需要眼鏡。可能出現光暈、眩光或對比下降；是否適合需考慮眼睛健康及個人的生活需求。",
    );
  }

  if (state.cornealCylinder >= 0.1) {
    en.push(
      `The model has ${state.cornealCylinder.toFixed(1)} D of regular corneal astigmatism. Different meridians bend light differently, so an uncorrected point can form separated principal foci rather than one compact focus.`,
    );
    zh.push(
      `本模型設定了 ${state.cornealCylinder.toFixed(1)} D 的規則性角膜散光。不同子午線的折光能力不同，因此未矯正時，一個物點可能形成分離的主焦點，而非單一集中的焦點。`,
    );
  }

  if (state.toricEnabled && state.toricCylinder > 0) {
    const error = angularDifference(state.cornealAxis, state.toricAxis);
    en.push(
      `Toric correction is enabled at ${state.toricCylinder.toFixed(2)} D at the IOL plane. Its compensation meridian is ${error.toFixed(0)}° from the corneal steep meridian. Both cylinder amount and alignment matter; alignment alone does not guarantee complete correction.`,
    );
    zh.push(
      `已啟用人工水晶體平面 ${state.toricCylinder.toFixed(2)} D 的散光矯正。補償子午線與角膜較陡子午線相差 ${error.toFixed(0)}°。散光度數及軸位均很重要；僅軸位一致並不保證完全矯正。`,
    );
    if (error >= 10 && state.cornealCylinder >= 0.1) {
      en.push(
        "In this scenario, rotational mismatch can leave residual astigmatism. The model angle is a teaching convention and must not be used as a surgical axis instruction.",
      );
      zh.push(
        "此情境中，旋轉角度不匹配可留下殘餘散光。本模型角度僅屬教學慣例，不可用作手術軸位指示。",
      );
    }
  } else if (state.cornealCylinder >= 0.5) {
    en.push(
      "Toric correction is currently off. Changing from monofocal to EDOF or multifocal alone does not remove the corneal astigmatism shown here.",
    );
    zh.push(
      "目前未啟用散光矯正。單純由單焦點改為延長焦深或多焦點，並不會消除這裡顯示的角膜散光。",
    );
  }

  const deltaAL = state.axialLength - state.referenceAL;
  if (Math.abs(deltaAL) >= 0.15) {
    const longer = deltaAL > 0;
    en.push(
      `The eye is now ${Math.abs(deltaAL).toFixed(1)} mm ${
        longer ? "longer" : "shorter"
      } than at the last distance-power calibration, while IOL power remains fixed. Moving the retina ${
        longer ? "farther back" : "forward"
      } changes its relationship to the focus. Appropriate power selection can compensate in this simplified model.`,
    );
    zh.push(
      `與上次遠距離度數校準相比，目前眼軸${
        longer ? "較長" : "較短"
      } ${Math.abs(deltaAL).toFixed(1)} 毫米，而人工水晶體度數保持不變。視網膜${
        longer ? "向後移動" : "向前移動"
      }會改變它與焦點的相對位置。在此簡化模型中，重新選擇合適度數可作補償。`,
    );
  }

  const base = models[0]!;
  const finiteFoci = base.fociMM.filter((value) => Number.isFinite(value as number)) as number[];
  if (finiteFoci.length) {
    const offsets = finiteFoci.map((value) => value - state.axialLength);
    const allAhead = offsets.every((value) => value < -0.15);
    const allBehind = offsets.every((value) => value > 0.15);
    if (allAhead || allBehind) {
      en.push(
        `The distance branch’s principal foci are ${
          allAhead ? "in front of" : "behind"
        } the retinal plane in this setting. This describes model geometry, not a measured prescription or predicted visual acuity.`,
      );
      zh.push(
        `此設定中，遠距離分支的主焦點位於視網膜平面的${
          allAhead ? "前方" : "後方"
        }。這只描述模型幾何位置，並非實測處方或視力預測。`,
      );
    }
  }

  en.push(
    "Your actual lens choice requires measurements and a discussion with your ophthalmologist. This demonstration cannot determine the best IOL for you, and it cannot replace assessment by a registered doctor.",
  );
  zh.push(
    "實際人工水晶體選擇需經過檢查、量度，並與眼科醫生討論。本示範不能判定哪款水晶體最適合您，亦不能代替註冊醫生的評估。",
  );

  return { en, zh };
}
