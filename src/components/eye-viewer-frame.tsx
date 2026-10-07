import { useEffect, useRef, useState } from "react";
import {
  getTopic,
  topicCardTitle,
  topicsByCategory,
  type CategoryId,
  type Topic,
} from "@/data/topics";
import {
  ANATOMY_RELATED,
  homeBranchForViewerStructure,
  type AnatomyHomeBranchId,
} from "@/data/anatomy-related";
import { LocaleHrefLink } from "@/components/locale-href";
import { localizeTopic, useI18n } from "@/i18n";
import type { Locale } from "@/i18n/locale";

/**
 * KK's viewer is 繁 / EN only (`?lang=zh|en`).
 * ja → en and zh-Hans → zh; this pass does not add Japanese or simplified copy.
 */
export function eyeViewerLang(locale: Locale): "zh" | "en" {
  if (locale === "en" || locale === "ja") return "en";
  return "zh";
}

function topicsForBranch(branch: AnatomyHomeBranchId): Topic[] {
  if (branch === "vitreous") {
    const topic = getTopic("d8");
    return topic ? [topic] : [];
  }
  if (branch === "macula") {
    const related = ANATOMY_RELATED.macula;
    if (related.kind !== "topics") return [];
    return related.topicIds.flatMap((id) => {
      const topic = getTopic(id);
      return topic ? [topic] : [];
    });
  }
  return topicsByCategory(branch as CategoryId);
}

type ViewerCopy = {
  related: string;
  hint: string;
  empty: string;
  fullscreen: string;
  exit: string;
};

const VIEWER_COPY: Record<Locale, ViewerCopy> = {
  "zh-Hant": {
    related: "相關教育專題",
    hint: "點選眼球上的結構，這裡會列出相關專題。",
    empty: "此結構暫時沒有專屬專題。",
    fullscreen: "全螢幕",
    exit: "離開全螢幕",
  },
  "zh-Hans": {
    related: "相关教育专题",
    hint: "点选眼球上的结构，这里会列出相关专题。",
    empty: "此结构暂时没有专属专题。",
    fullscreen: "全屏",
    exit: "退出全屏",
  },
  en: {
    related: "Related topics",
    hint: "Select a structure on the eye to list related topics here.",
    empty: "No dedicated topic for this structure yet.",
    fullscreen: "Fullscreen",
    exit: "Exit fullscreen",
  },
  ja: {
    related: "関連トピック",
    hint: "眼の構造を選ぶと、ここに関連トピックが表示されます。",
    empty: "この構造に専用のトピックはまだありません。",
    fullscreen: "全画面",
    exit: "全画面を終了",
  },
};

type Selection = { id: string; label: string | null };

type FullscreenDocument = Document & {
  webkitFullscreenElement?: Element | null;
  webkitExitFullscreen?: () => void;
};
type FullscreenElement = HTMLElement & { webkitRequestFullscreen?: () => void };

/** Same `/eye-viewer.html` model used everywhere 眼圖 is opened. */
export function EyeViewerFrame() {
  const { locale } = useI18n();
  const copy = VIEWER_COPY[locale];
  const chromeRef = useRef<HTMLDivElement>(null);
  const [selection, setSelection] = useState<Selection | null>(null);
  const [fullscreen, setFullscreen] = useState(false);
  const [fullscreenSupported, setFullscreenSupported] = useState(false);

  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;
      const iframe = document.getElementById("eyesinfo-eye-viewer");
      if (
        !(iframe instanceof HTMLIFrameElement) ||
        event.source !== iframe.contentWindow
      ) {
        return;
      }
      const data = event.data as {
        type?: unknown;
        structure?: unknown;
        label?: unknown;
      } | null;
      if (!data || data.type !== "eyesinfo-eye-select") return;
      if (data.structure === null) {
        setSelection(null);
        return;
      }
      if (typeof data.structure !== "string") return;
      setSelection({
        id: data.structure,
        label: typeof data.label === "string" ? data.label : null,
      });
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  useEffect(() => {
    const root = document.documentElement as FullscreenElement;
    setFullscreenSupported(
      typeof root.requestFullscreen === "function" ||
        typeof root.webkitRequestFullscreen === "function",
    );
    const sync = () => {
      const doc = document as FullscreenDocument;
      const active = doc.fullscreenElement ?? doc.webkitFullscreenElement ?? null;
      setFullscreen(active !== null && active === chromeRef.current);
    };
    document.addEventListener("fullscreenchange", sync);
    document.addEventListener("webkitfullscreenchange", sync);
    return () => {
      document.removeEventListener("fullscreenchange", sync);
      document.removeEventListener("webkitfullscreenchange", sync);
    };
  }, []);

  const enterFullscreen = () => {
    const el = chromeRef.current as FullscreenElement | null;
    if (!el) return;
    if (typeof el.requestFullscreen === "function") {
      void el.requestFullscreen().catch(() => {});
    } else {
      el.webkitRequestFullscreen?.();
    }
  };

  const exitFullscreen = () => {
    const doc = document as FullscreenDocument;
    if (typeof doc.exitFullscreen === "function" && doc.fullscreenElement) {
      void doc.exitFullscreen().catch(() => {});
    } else {
      doc.webkitExitFullscreen?.();
    }
  };

  const branch = selection ? homeBranchForViewerStructure(selection.id) : null;
  const topics = branch ? topicsForBranch(branch) : [];
  const viewerTitle =
    locale === "en" || locale === "ja"
      ? "Interactive 3D eye anatomy: rotate, zoom, and view layers"
      : "互動 3D 眼球解剖：旋轉、縮放及查看分層";

  return (
    <div>
      {fullscreenSupported ? (
        <div className="eye-teaching-toolbar">
          <button
            type="button"
            id="eye-enter-fullscreen"
            className="eye-fs-button"
            aria-pressed={fullscreen}
            onClick={enterFullscreen}
          >
            {copy.fullscreen}
          </button>
        </div>
      ) : null}
      <div
        id="eye-teaching-chrome"
        ref={chromeRef}
        className={fullscreen ? "eye-teaching-chrome is-fullscreen" : "eye-teaching-chrome"}
      >
        <div className="eye-fs-exit-bar">
          <button
            type="button"
            id="eye-exit-fullscreen"
            className="eye-fs-button"
            onClick={exitFullscreen}
          >
            {copy.exit}
          </button>
        </div>
        <iframe
          id="eyesinfo-eye-viewer"
          src={`/eye-viewer.html?lang=${eyeViewerLang(locale)}`}
          title={viewerTitle}
          className="eye-viewer-frame"
          allow="fullscreen"
        />
        <section
          className="eye-related-panel mt-3 rounded-xl border border-line bg-card"
          aria-labelledby="eye-related-heading"
          aria-live="polite"
        >
          <h2
            id="eye-related-heading"
            className="px-3 pt-3 text-[0.9rem] font-semibold text-navy"
          >
            {copy.related}
            {selection?.label ? ` · ${selection.label}` : ""}
          </h2>
          {!selection ? (
            <p className="px-3 pb-3 pt-1 text-[0.85rem] text-muted">{copy.hint}</p>
          ) : topics.length === 0 ? (
            <p className="px-3 pb-3 pt-1 text-[0.85rem] text-muted">{copy.empty}</p>
          ) : (
            <ul className="mt-2 overflow-hidden border-t border-line">
              {topics.map((topic) => {
                const loc = localizeTopic(topic, locale);
                return (
                  <li key={topic.id} className="border-b border-line last:border-b-0">
                    <LocaleHrefLink
                      path={`/t/${topic.id}`}
                      className="flex min-h-11 items-center px-3 py-2 text-[0.85rem] font-semibold text-navy no-underline"
                    >
                      {topicCardTitle(loc.title)}
                    </LocaleHrefLink>
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
