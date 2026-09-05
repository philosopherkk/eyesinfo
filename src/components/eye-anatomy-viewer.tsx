import { Link } from "@tanstack/react-router";
import { useId, useState, type KeyboardEvent } from "react";
import { cn } from "@/lib/utils";
import { useI18n } from "@/i18n";
import type { Locale } from "@/i18n/locale";

/** Core cross-section regions — label accurately; anatomy education only. */
export type AnatomyRegionId =
  | "cornea"
  | "anteriorChamber"
  | "lens"
  | "vitreous"
  | "retina"
  | "macula"
  | "opticNerve";

const REGION_ORDER: AnatomyRegionId[] = [
  "cornea",
  "anteriorChamber",
  "lens",
  "vitreous",
  "retina",
  "macula",
  "opticNerve",
];

type RegionCopy = {
  title: string;
  summary: string;
  relatedLabel: string;
};

type RelatedLink =
  | { kind: "cat"; catId: "lens" | "lid" | "glaucoma" | "retina" | "surface" }
  | { kind: "topic"; topicId: string };

const RELATED: Record<AnatomyRegionId, RelatedLink> = {
  cornea: { kind: "cat", catId: "surface" },
  anteriorChamber: { kind: "cat", catId: "glaucoma" },
  lens: { kind: "cat", catId: "lens" },
  vitreous: { kind: "topic", topicId: "d8" },
  retina: { kind: "cat", catId: "retina" },
  macula: { kind: "topic", topicId: "d5" },
  opticNerve: { kind: "cat", catId: "glaucoma" },
};

const COPY: Record<Locale, Record<AnatomyRegionId, RegionCopy>> = {
  "zh-Hant": {
    cornea: {
      title: "角膜",
      summary:
        "眼球最前面的透明組織，負責大部分屈光。表面有淚膜保護；受損或感染可影響視力。",
      relatedLabel: "角膜與眼表專題",
    },
    anteriorChamber: {
      title: "前房",
      summary:
        "角膜與虹膜／晶體之間的空間，充滿房水。房水流經房角，與眼壓調節有關。",
      relatedLabel: "青光眼與視神經專題",
    },
    lens: {
      title: "晶體",
      summary:
        "位於虹膜後方的透明雙凸結構，負責調節對焦。隨年齡可變混濁（白內障）。",
      relatedLabel: "晶體與屈光專題",
    },
    vitreous: {
      title: "玻璃體",
      summary:
        "充滿眼球後部的透明凝膠。可隨年齡液化；飛蚊多來自玻璃體混濁或後脫離。",
      relatedLabel: "飛蚊與脫離風險",
    },
    retina: {
      title: "視網膜",
      summary:
        "眼球內層感光組織，把光轉成神經訊號。周邊視網膜與裂孔、脫離風險相關。",
      relatedLabel: "視網膜與黃斑專題",
    },
    macula: {
      title: "黃斑",
      summary:
        "視網膜中央負責精細視力與顏色的區域。年齡相關性黃斑病變主要影響此處。",
      relatedLabel: "年齡相關性黃斑病變",
    },
    opticNerve: {
      title: "視神經",
      summary:
        "把視網膜訊號傳往腦部的神經束。青光眼可損害視神經纖維，失去的視野通常不能恢復。",
      relatedLabel: "青光眼與視神經專題",
    },
  },
  "zh-Hans": {
    cornea: {
      title: "角膜",
      summary:
        "眼球最前面的透明组织，负责大部分屈光。表面有泪膜保护；受损或感染可影响视力。",
      relatedLabel: "角膜与眼表专题",
    },
    anteriorChamber: {
      title: "前房",
      summary:
        "角膜与虹膜／晶体之间的空间，充满房水。房水流经房角，与眼压调节有关。",
      relatedLabel: "青光眼与视神经专题",
    },
    lens: {
      title: "晶体",
      summary:
        "位于虹膜后方的透明双凸结构，负责调节对焦。随年龄可变混浊（白内障）。",
      relatedLabel: "晶体与屈光专题",
    },
    vitreous: {
      title: "玻璃体",
      summary:
        "充满眼球后部的透明凝胶。可随年龄液化；飞蚊多来自玻璃体混浊或后脱离。",
      relatedLabel: "飞蚊与脱离风险",
    },
    retina: {
      title: "视网膜",
      summary:
        "眼球内层感光组织，把光转成神经信号。周边视网膜与裂孔、脱离风险相关。",
      relatedLabel: "视网膜与黄斑专题",
    },
    macula: {
      title: "黄斑",
      summary:
        "视网膜中央负责精细视力与颜色的区域。年龄相关性黄斑病变主要影响此处。",
      relatedLabel: "年龄相关性黄斑病变",
    },
    opticNerve: {
      title: "视神经",
      summary:
        "把视网膜信号传往脑部的神经束。青光眼可损害视神经纤维，失去的视野通常不能恢复。",
      relatedLabel: "青光眼与视神经专题",
    },
  },
  en: {
    cornea: {
      title: "Cornea",
      summary:
        "The clear front window of the eye that provides most of the focusing power. The tear film protects its surface.",
      relatedLabel: "Cornea & ocular surface",
    },
    anteriorChamber: {
      title: "Anterior chamber",
      summary:
        "The fluid-filled space between cornea and iris/lens. Aqueous humour drains at the angle and relates to eye pressure.",
      relatedLabel: "Glaucoma & optic nerve",
    },
    lens: {
      title: "Lens",
      summary:
        "A clear biconvex structure behind the iris that fine-tunes focus. It can cloud with age (cataract).",
      relatedLabel: "Lens & refraction",
    },
    vitreous: {
      title: "Vitreous",
      summary:
        "A clear gel filling the back of the eye. It can liquefy with age; floaters often come from vitreous opacities or PVD.",
      relatedLabel: "Floaters & detachment risk",
    },
    retina: {
      title: "Retina",
      summary:
        "The light-sensing inner layer that turns light into nerve signals. Peripheral retina relates to tears and detachment risk.",
      relatedLabel: "Retina & macula",
    },
    macula: {
      title: "Macula",
      summary:
        "The central retina for fine detail and colour. Age-related macular degeneration mainly affects this area.",
      relatedLabel: "Age-related macular degeneration",
    },
    opticNerve: {
      title: "Optic nerve",
      summary:
        "The nerve bundle that carries retinal signals to the brain. Glaucoma can damage these fibres; lost field rarely recovers.",
      relatedLabel: "Glaucoma & optic nerve",
    },
  },
  ja: {
    cornea: {
      title: "角膜",
      summary:
        "眼球の一番前の透明な組織で、屈折の大部分を担います。表面は涙液で守られます。",
      relatedLabel: "角膜と眼表面",
    },
    anteriorChamber: {
      title: "前房",
      summary:
        "角膜と虹彩／水晶体のあいだの房水の空間。隅角からの流出が眼圧と関わります。",
      relatedLabel: "緑内障と視神経",
    },
    lens: {
      title: "水晶体",
      summary:
        "虹彩の後ろにある透明な両凸の構造で、ピント調節を担います。加齢で混濁し得ます（白内障）。",
      relatedLabel: "水晶体と屈折",
    },
    vitreous: {
      title: "硝子体",
      summary:
        "眼球後部を満たす透明なゲル。加齢で液化し、飛蚊は混濁や後部剥離と関係することが多いです。",
      relatedLabel: "飛蚊と剥離のリスク",
    },
    retina: {
      title: "網膜",
      summary:
        "光を神経信号に変える内層。周辺網膜は裂孔や剥離のリスクと関連します。",
      relatedLabel: "網膜と黄斑",
    },
    macula: {
      title: "黄斑",
      summary:
        "中心の細かい視力と色を担う網膜の中央部。加齢黄斑変性は主にここを侵します。",
      relatedLabel: "加齢黄斑変性",
    },
    opticNerve: {
      title: "視神経",
      summary:
        "網膜の信号を脳へ伝える神経束。緑内障で線維が傷つくと、失った視野は戻りにくいです。",
      relatedLabel: "緑内障と視神経",
    },
  },
};

const VIEW_RELATED: Record<Locale, string> = {
  "zh-Hant": "查看相關專題",
  "zh-Hans": "查看相关专题",
  en: "View related conditions",
  ja: "関連の解説を見る",
};

const LEAD: Record<Locale, string> = {
  "zh-Hant": "撳圖上部位或用鍵盤 Tab 選取。認識結構之後再開專題。示意不是檢查。",
  "zh-Hans": "点图上部位或用键盘 Tab 选取。认识结构之后再开专题。示意不是检查。",
  en: "Tap a region or use Tab / Enter. Learn the structure, then open a topic. Illustration only — not a test.",
  ja: "図の部位をタップするか Tab／Enter で選択。構造を知ってから解説へ。示意であり検査ではありません。",
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

  function select(id: AnatomyRegionId) {
    setSel(id);
    onSelectRegion?.(id);
  }

  function onRegionKey(
    e: KeyboardEvent<SVGElement>,
    id: AnatomyRegionId,
  ) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      select(id);
    }
  }

  const active = copy[sel];
  const related = RELATED[sel];

  return (
    <div className={cn("space-y-3", className)}>
      <p className="text-[0.88rem] leading-relaxed text-muted">{LEAD[locale]}</p>

      <div className="rounded-xl border border-line bg-card p-3">
        <p className="mb-2 text-center text-[0.75rem] font-semibold text-steel">
          {tx("側面切面")}
        </p>
        <svg
          viewBox="0 0 320 200"
          className="w-full"
          role="img"
          aria-labelledby={svgLabelId}
        >
          <title id={svgLabelId}>{tx("眼球側面切面示意")}</title>
          {/* Globe outline */}
          <ellipse
            cx="140"
            cy="100"
            rx="95"
            ry="78"
            fill="var(--color-paper)"
            stroke="var(--color-navy)"
            strokeWidth="2"
          />

          {/* Vitreous (large posterior fill) */}
          <RegionPath
            id="vitreous"
            selected={sel === "vitreous"}
            d="M95,40 Q155,28 200,55 Q225,80 220,100 Q225,120 200,145 Q155,172 95,160 Q70,130 70,100 Q70,70 95,40 Z"
            label={copy.vitreous.title}
            onSelect={select}
            onKeyDown={onRegionKey}
          />

          {/* Retina arc (inner shell) */}
          <RegionPath
            id="retina"
            selected={sel === "retina"}
            d="M100,38 Q158,26 205,55 Q228,82 222,100 Q228,118 205,145 Q158,174 100,162"
            fill="none"
            strokeWidth={sel === "retina" ? 5 : 3}
            label={copy.retina.title}
            onSelect={select}
            onKeyDown={onRegionKey}
          />

          {/* Macula */}
          <RegionCircle
            id="macula"
            selected={sel === "macula"}
            cx={175}
            cy={108}
            r={8}
            label={copy.macula.title}
            onSelect={select}
            onKeyDown={onRegionKey}
          />

          {/* Optic nerve */}
          <RegionPath
            id="opticNerve"
            selected={sel === "opticNerve"}
            d="M210,88 L285,70 L295,90 L285,130 L210,112 Z"
            label={copy.opticNerve.title}
            onSelect={select}
            onKeyDown={onRegionKey}
          />

          {/* Anterior chamber */}
          <RegionPath
            id="anteriorChamber"
            selected={sel === "anteriorChamber"}
            d="M48,100 Q55,55 95,48 Q78,100 95,152 Q55,145 48,100 Z"
            label={copy.anteriorChamber.title}
            onSelect={select}
            onKeyDown={onRegionKey}
          />

          {/* Cornea (front curve) */}
          <RegionPath
            id="cornea"
            selected={sel === "cornea"}
            d="M48,100 Q52,42 100,38 Q70,100 100,162 Q52,158 48,100 Z"
            fill="none"
            strokeWidth={sel === "cornea" ? 5 : 3}
            label={copy.cornea.title}
            onSelect={select}
            onKeyDown={onRegionKey}
          />

          {/* Lens */}
          <RegionEllipse
            id="lens"
            selected={sel === "lens"}
            cx={105}
            cy={100}
            rx={14}
            ry={28}
            label={copy.lens.title}
            onSelect={select}
            onKeyDown={onRegionKey}
          />

          {/* Iris mark (non-interactive landmark) */}
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
        role="listbox"
        aria-label={tx("解剖部位清單")}
        aria-activedescendant={`anatomy-opt-${sel}`}
      >
        {REGION_ORDER.map((id) => (
          <button
            key={id}
            id={`anatomy-opt-${id}`}
            type="button"
            role="option"
            aria-selected={sel === id}
            onClick={() => select(id)}
            className={cn(
              "min-h-11 rounded-xl border px-3 py-2 text-left text-[0.82rem] font-semibold transition-colors",
              sel === id
                ? "border-navy bg-navy text-paper"
                : "border-line bg-card text-navy",
            )}
          >
            {copy[id].title}
          </button>
        ))}
      </div>

      <div
        className="rounded-xl border border-line bg-card px-3.5 py-3"
        aria-live="polite"
        aria-atomic="true"
        id={liveId}
      >
        <h3 className="text-[0.95rem] font-semibold text-navy">{active.title}</h3>
        <p className="mt-1.5 text-[0.88rem] leading-relaxed text-ink">
          {active.summary}
        </p>
        <RelatedButton related={related} label={`${VIEW_RELATED[locale]} · ${active.relatedLabel}`} />
      </div>
    </div>
  );
}

function RelatedButton({
  related,
  label,
}: {
  related: RelatedLink;
  label: string;
}) {
  const cls =
    "mt-3 inline-flex h-11 items-center rounded-full bg-navy px-4 text-[0.85rem] font-semibold text-paper no-underline";
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

type RegionHandlers = {
  id: AnatomyRegionId;
  selected: boolean;
  label: string;
  onSelect: (id: AnatomyRegionId) => void;
  onKeyDown: (e: KeyboardEvent<SVGElement>, id: AnatomyRegionId) => void;
};

function regionProps({
  id,
  selected,
  label,
  onSelect,
  onKeyDown,
}: RegionHandlers) {
  return {
    role: "button" as const,
    tabIndex: 0,
    "aria-label": label,
    "aria-pressed": selected,
    onClick: () => onSelect(id),
    onKeyDown: (e: KeyboardEvent<SVGElement>) => onKeyDown(e, id),
    style: { cursor: "pointer" as const },
  };
}

function RegionPath({
  id,
  selected,
  d,
  label,
  onSelect,
  onKeyDown,
  fill,
  strokeWidth = 2,
}: RegionHandlers & {
  d: string;
  fill?: string;
  strokeWidth?: number;
}) {
  const fillColor =
    fill === "none"
      ? "none"
      : selected
        ? "color-mix(in srgb, var(--color-danger) 35%, var(--color-paper))"
        : "color-mix(in srgb, var(--color-steel) 18%, var(--color-paper))";
  return (
    <path
      d={d}
      fill={fillColor}
      stroke={selected ? "var(--color-danger)" : "var(--color-navy)"}
      strokeWidth={selected ? Math.max(strokeWidth, 3) : strokeWidth}
      {...regionProps({ id, selected, label, onSelect, onKeyDown })}
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
  onKeyDown,
}: RegionHandlers & { cx: number; cy: number; rx: number; ry: number }) {
  return (
    <ellipse
      cx={cx}
      cy={cy}
      rx={rx}
      ry={ry}
      fill={
        selected
          ? "color-mix(in srgb, var(--color-danger) 40%, var(--color-paper))"
          : "#dce8ef"
      }
      stroke={selected ? "var(--color-danger)" : "var(--color-navy)"}
      strokeWidth={selected ? 3 : 2}
      {...regionProps({ id, selected, label, onSelect, onKeyDown })}
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
  onKeyDown,
}: RegionHandlers & { cx: number; cy: number; r: number }) {
  return (
    <circle
      cx={cx}
      cy={cy}
      r={r}
      fill={selected ? "var(--color-danger)" : "var(--color-navy)"}
      opacity={selected ? 0.7 : 0.45}
      stroke={selected ? "var(--color-danger)" : "var(--color-navy)"}
      strokeWidth={selected ? 2 : 1}
      {...regionProps({ id, selected, label, onSelect, onKeyDown })}
    />
  );
}
