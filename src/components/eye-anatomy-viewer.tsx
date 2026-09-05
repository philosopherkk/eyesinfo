import { Link } from "@tanstack/react-router";
import { useId, useState } from "react";
import { cn } from "@/lib/utils";
import { useI18n } from "@/i18n";
import type { Locale } from "@/i18n/locale";
import {
  ANATOMY_RELATED,
  ANATOMY_REGION_ORDER,
  type AnatomyRegionId,
  type AnatomyRelatedLink,
} from "@/data/anatomy-related";

type RegionCopy = {
  title: string;
  summary: string;
  relatedLabel: string;
};

const COPY: Record<Locale, Record<AnatomyRegionId, RegionCopy>> = {
  "zh-Hant": {
    cornea: {
      title: "角膜",
      summary:
        "眼球最前面的透明組織，負責大部分屈光。表面有淚膜覆蓋。",
      relatedLabel: "角膜與眼表專題",
    },
    anteriorChamber: {
      title: "前房",
      summary:
        "前房是角膜與虹膜之間、充滿房水的空間。虹膜與晶體之間則為後房。",
      relatedLabel: "青光眼與視神經專題",
    },
    lens: {
      title: "晶體",
      summary:
        "位於虹膜後方的透明雙凸結構，負責調節對焦，讓遠近景物清晰成像。",
      relatedLabel: "晶體與屈光專題",
    },
    vitreous: {
      title: "玻璃體",
      summary:
        "充滿眼球後部的透明凝膠，維持眼球形狀並讓光線通過到達視網膜。",
      relatedLabel: "飛蚊與脫離風險",
    },
    retina: {
      title: "視網膜",
      summary:
        "眼球內層的感光組織，把光轉成神經訊號，再經視神經傳向腦部。",
      relatedLabel: "視網膜與黃斑專題",
    },
    macula: {
      title: "黃斑",
      summary:
        "視網膜中央專責精細視力與顏色辨識的區域，是閱讀與認人的關鍵。",
      relatedLabel: "年齡相關性黃斑病變",
    },
    opticNerve: {
      title: "視神經",
      summary:
        "把視網膜訊號傳往腦部的神經束，是視覺傳導的通路。",
      relatedLabel: "青光眼與視神經專題",
    },
  },
  "zh-Hans": {
    cornea: {
      title: "角膜",
      summary:
        "眼球最前面的透明组织，负责大部分屈光。表面有泪膜覆盖。",
      relatedLabel: "角膜与眼表专题",
    },
    anteriorChamber: {
      title: "前房",
      summary:
        "前房是角膜与虹膜之间、充满房水的空间。虹膜与晶体之间则为后房。",
      relatedLabel: "青光眼与视神经专题",
    },
    lens: {
      title: "晶体",
      summary:
        "位于虹膜后方的透明双凸结构，负责调节对焦，让远近景物清晰成像。",
      relatedLabel: "晶体与屈光专题",
    },
    vitreous: {
      title: "玻璃体",
      summary:
        "充满眼球后部的透明凝胶，维持眼球形状并让光线通过到达视网膜。",
      relatedLabel: "飞蚊与脱离风险",
    },
    retina: {
      title: "视网膜",
      summary:
        "眼球内层的感光组织，把光转成神经信号，再经视神经传向脑部。",
      relatedLabel: "视网膜与黄斑专题",
    },
    macula: {
      title: "黄斑",
      summary:
        "视网膜中央专责精细视力与颜色辨识的区域，是阅读与认人的关键。",
      relatedLabel: "年龄相关性黄斑病变",
    },
    opticNerve: {
      title: "视神经",
      summary:
        "把视网膜信号传往脑部的神经束，是视觉传导的通路。",
      relatedLabel: "青光眼与视神经专题",
    },
  },
  en: {
    cornea: {
      title: "Cornea",
      summary:
        "The clear front window of the eye that provides most of the focusing power. A tear film covers its surface.",
      relatedLabel: "Cornea & ocular surface",
    },
    anteriorChamber: {
      title: "Anterior chamber",
      summary:
        "The anterior chamber is the aqueous-filled space between the cornea and the iris. The posterior chamber lies between the iris and the lens.",
      relatedLabel: "Glaucoma & optic nerve",
    },
    lens: {
      title: "Lens",
      summary:
        "A clear biconvex structure behind the iris that fine-tunes focus so near and far scenes form a sharp image.",
      relatedLabel: "Lens & refraction",
    },
    vitreous: {
      title: "Vitreous",
      summary:
        "A clear gel that fills the back of the eye, helping maintain its shape and letting light reach the retina.",
      relatedLabel: "Floaters & detachment risk",
    },
    retina: {
      title: "Retina",
      summary:
        "The light-sensing inner layer that turns light into nerve signals for the optic nerve to carry onward.",
      relatedLabel: "Retina & macula",
    },
    macula: {
      title: "Macula",
      summary:
        "The central retina specialised for fine detail and colour — key for reading and recognising faces.",
      relatedLabel: "Age-related macular degeneration",
    },
    opticNerve: {
      title: "Optic nerve",
      summary:
        "The nerve bundle that carries retinal signals to the brain along the visual pathway.",
      relatedLabel: "Glaucoma & optic nerve",
    },
  },
  ja: {
    cornea: {
      title: "角膜",
      summary:
        "眼球の一番前の透明な組織で、屈折の大部分を担います。表面は涙液で覆われています。",
      relatedLabel: "角膜と眼表面",
    },
    anteriorChamber: {
      title: "前房",
      summary:
        "前房は角膜と虹彩のあいだの房水の空間です。虹彩と水晶体のあいだは後房です。",
      relatedLabel: "緑内障と視神経",
    },
    lens: {
      title: "水晶体",
      summary:
        "虹彩の後ろにある透明な両凸の構造で、遠近のピント調節を担います。",
      relatedLabel: "水晶体と屈折",
    },
    vitreous: {
      title: "硝子体",
      summary:
        "眼球後部を満たす透明なゲルで、形を保ち光を網膜へ通します。",
      relatedLabel: "飛蚊と剥離のリスク",
    },
    retina: {
      title: "網膜",
      summary:
        "光を神経信号に変える内層で、視神経を介して脳へ伝えます。",
      relatedLabel: "網膜と黄斑",
    },
    macula: {
      title: "黄斑",
      summary:
        "中心の細かい視力と色を担う網膜の中央部で、読書や顔の識別に重要です。",
      relatedLabel: "加齢黄斑変性",
    },
    opticNerve: {
      title: "視神経",
      summary:
        "網膜の信号を脳へ伝える神経束で、視覚の伝導路です。",
      relatedLabel: "緑内障と視神経",
    },
  },
};

const VIEW_RELATED: Record<Locale, string> = {
  "zh-Hant": "打開相關專題",
  "zh-Hans": "打开相关专题",
  en: "Open related topic",
  ja: "関連の解説を開く",
};

const LEAD: Record<Locale, string> = {
  "zh-Hant":
    "用下面按鈕選取部位（鍵盤 Tab），或直接撳圖。認識結構之後再開專題。示意不是檢查。",
  "zh-Hans":
    "用下面按钮选取部位（键盘 Tab），或直接点图。认识结构之后再开专题。示意不是检查。",
  en: "Select a region with the buttons (Tab), or tap the diagram. Learn the structure, then open a topic. Illustration only — not a test.",
  ja: "下のボタン（Tab）で部位を選ぶか、図をタップ。構造を知ってから解説へ。示意であり検査ではありません。",
};

type EyeAnatomyViewerProps = {
  onSelectRegion?: (regionId: AnatomyRegionId) => void;
  className?: string;
};

export function EyeAnatomyViewer({
  onSelectRegion,
  className,
}: EyeAnatomyViewerProps) {
  const [sel, setSel] = useState<AnatomyRegionId>("cornea");
  const { locale, tx } = useI18n();
  const copy = COPY[locale] ?? COPY["zh-Hant"];
  const liveId = useId();
  const svgLabelId = useId();
  const groupId = useId();

  function select(id: AnatomyRegionId) {
    setSel(id);
    onSelectRegion?.(id);
  }

  const active = copy[sel];
  const related = ANATOMY_RELATED[sel];

  return (
    <div className={cn("space-y-3", className)}>
      <p className="text-[0.88rem] leading-relaxed text-muted">{LEAD[locale]}</p>

      <div className="rounded-xl border border-line bg-card p-3">
        <p className="mb-2 text-center text-[0.75rem] font-semibold text-steel">
          {tx("側面切面")}
        </p>
        <svg
          viewBox="0 0 320 200"
          className="anatomy-svg w-full"
          role="group"
          aria-labelledby={svgLabelId}
        >
          <title id={svgLabelId}>{tx("眼球側面切面示意")}</title>
          <ellipse
            cx="140"
            cy="100"
            rx="95"
            ry="78"
            fill="var(--color-paper)"
            stroke="var(--color-navy)"
            strokeWidth="2"
            aria-hidden
          />

          <RegionPath
            id="vitreous"
            selected={sel === "vitreous"}
            d="M95,40 Q155,28 200,55 Q225,80 220,100 Q225,120 200,145 Q155,172 95,160 Q70,130 70,100 Q70,70 95,40 Z"
            label={copy.vitreous.title}
            onSelect={select}
          />

          {/* Invisible wide hit stroke under retina */}
          <path
            d="M100,38 Q158,26 205,55 Q228,82 222,100 Q228,118 205,145 Q158,174 100,162"
            fill="none"
            stroke="transparent"
            strokeWidth="14"
            className="anatomy-hit"
            onClick={() => select("retina")}
            aria-hidden
          />
          <RegionPath
            id="retina"
            selected={sel === "retina"}
            d="M100,38 Q158,26 205,55 Q228,82 222,100 Q228,118 205,145 Q158,174 100,162"
            fill="none"
            strokeWidth={sel === "retina" ? 5 : 3}
            label={copy.retina.title}
            onSelect={select}
          />

          {/* Macula: larger invisible hit target */}
          <circle
            cx={175}
            cy={108}
            r={16}
            fill="transparent"
            className="anatomy-hit"
            onClick={() => select("macula")}
            aria-hidden
          />
          <RegionCircle
            id="macula"
            selected={sel === "macula"}
            cx={175}
            cy={108}
            r={9}
            label={copy.macula.title}
            onSelect={select}
          />

          <RegionPath
            id="opticNerve"
            selected={sel === "opticNerve"}
            d="M210,88 L285,70 L295,90 L285,130 L210,112 Z"
            label={copy.opticNerve.title}
            onSelect={select}
          />

          <RegionPath
            id="anteriorChamber"
            selected={sel === "anteriorChamber"}
            d="M52,100 Q58,58 92,52 Q78,100 92,148 Q58,142 52,100 Z"
            label={copy.anteriorChamber.title}
            onSelect={select}
          />

          {/* Invisible wide hit stroke under cornea */}
          <path
            d="M48,100 Q52,42 100,38 Q70,100 100,162 Q52,158 48,100 Z"
            fill="none"
            stroke="transparent"
            strokeWidth="14"
            className="anatomy-hit"
            onClick={() => select("cornea")}
            aria-hidden
          />
          <RegionPath
            id="cornea"
            selected={sel === "cornea"}
            d="M48,100 Q52,42 100,38 Q70,100 100,162 Q52,158 48,100 Z"
            fill="none"
            strokeWidth={sel === "cornea" ? 5 : 3}
            label={copy.cornea.title}
            onSelect={select}
          />

          <RegionEllipse
            id="lens"
            selected={sel === "lens"}
            cx={105}
            cy={100}
            rx={14}
            ry={28}
            label={copy.lens.title}
            onSelect={select}
          />

          <ellipse
            cx="88"
            cy="100"
            rx="6"
            ry="22"
            fill="var(--color-navy)"
            opacity="0.25"
            aria-hidden
          />
        </svg>
      </div>

      <div
        className="grid grid-cols-2 gap-2 sm:grid-cols-3"
        role="radiogroup"
        aria-labelledby={groupId}
      >
        <p id={groupId} className="sr-only">
          {tx("解剖部位")}
        </p>
        {ANATOMY_REGION_ORDER.map((id) => (
          <button
            key={id}
            id={`anatomy-opt-${id}`}
            type="button"
            role="radio"
            aria-checked={sel === id}
            onClick={() => select(id)}
            className={cn(
              "anatomy-region-btn min-h-11 rounded-xl border px-3 py-2 text-left text-[0.82rem] font-semibold",
              sel === id
                ? "border-navy bg-navy text-paper"
                : "border-line bg-card text-navy",
            )}
          >
            {copy[id].title}
          </button>
        ))}
      </div>

      {/* Live region: region name only */}
      <p className="sr-only" aria-live="polite" aria-atomic="true" id={liveId}>
        {active.title}
      </p>

      <div className="rounded-xl border border-line bg-card px-3.5 py-3">
        <h3 className="text-[0.95rem] font-semibold text-navy">{active.title}</h3>
        <p className="mt-1.5 text-[0.88rem] leading-relaxed text-ink">
          {active.summary}
        </p>
        <RelatedButton
          related={related}
          label={`${VIEW_RELATED[locale]} · ${active.relatedLabel}`}
        />
      </div>
    </div>
  );
}

function RelatedButton({
  related,
  label,
}: {
  related: AnatomyRelatedLink;
  label: string;
}) {
  const cls =
    "mt-3 inline-flex h-11 items-center rounded-full bg-navy px-4 text-[0.85rem] font-semibold text-paper no-underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy";
  if (related.kind === "cat") {
    return (
      <Link to="/c/$catId" params={{ catId: related.catId }} className={cls}>
        {label}
      </Link>
    );
  }
  return (
    <Link to="/t/$topicId" params={{ topicId: related.topicId }} className={cls}>
      {label}
    </Link>
  );
}

type RegionClick = {
  id: AnatomyRegionId;
  selected: boolean;
  label: string;
  onSelect: (id: AnatomyRegionId) => void;
};

function regionPointerProps({ id, selected, label, onSelect }: RegionClick) {
  return {
    tabIndex: -1 as const,
    "aria-hidden": true as const,
    "data-region": id,
    "data-selected": selected ? "true" : "false",
    "aria-label": label,
    onClick: () => onSelect(id),
    className: cn("anatomy-region", selected && "anatomy-region-selected"),
    style: { cursor: "pointer" as const },
  };
}

function selectedFill(selected: boolean) {
  return selected
    ? "color-mix(in srgb, var(--color-navy) 28%, var(--color-paper))"
    : "color-mix(in srgb, var(--color-steel) 16%, var(--color-paper))";
}

function selectedStroke(selected: boolean) {
  return selected ? "var(--color-navy)" : "var(--color-steel)";
}

function RegionPath({
  id,
  selected,
  d,
  label,
  onSelect,
  fill,
  strokeWidth = 2,
}: RegionClick & {
  d: string;
  fill?: string;
  strokeWidth?: number;
}) {
  const fillColor = fill === "none" ? "none" : selectedFill(selected);
  return (
    <path
      d={d}
      fill={fillColor}
      stroke={selectedStroke(selected)}
      strokeWidth={selected ? Math.max(strokeWidth, 3.5) : strokeWidth}
      {...regionPointerProps({ id, selected, label, onSelect })}
    />
  );
}

function RegionEllipse({
  id,
  selected,
  cx,
  cy,
  rx,
  ry,
  label,
  onSelect,
}: RegionClick & { cx: number; cy: number; rx: number; ry: number }) {
  return (
    <ellipse
      cx={cx}
      cy={cy}
      rx={rx}
      ry={ry}
      fill={selected ? selectedFill(true) : "#dce8ef"}
      stroke={selectedStroke(selected)}
      strokeWidth={selected ? 3 : 2}
      {...regionPointerProps({ id, selected, label, onSelect })}
    />
  );
}

function RegionCircle({
  id,
  selected,
  cx,
  cy,
  r,
  label,
  onSelect,
}: RegionClick & { cx: number; cy: number; r: number }) {
  return (
    <circle
      cx={cx}
      cy={cy}
      r={r}
      fill={selected ? "var(--color-navy)" : "var(--color-steel)"}
      opacity={selected ? 0.85 : 0.5}
      stroke={selectedStroke(selected)}
      strokeWidth={selected ? 2 : 1}
      {...regionPointerProps({ id, selected, label, onSelect })}
    />
  );
}

export type { AnatomyRegionId };
