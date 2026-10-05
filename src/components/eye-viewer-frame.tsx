import { useEffect, useState } from "react";
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

/** Same `/eye-viewer.html` model used everywhere 眼圖 is opened. */
export function EyeViewerFrame() {
  const { locale } = useI18n();
  const [branch, setBranch] = useState<AnatomyHomeBranchId | null>(null);

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
      const data = event.data as { type?: unknown; structure?: unknown } | null;
      if (!data || data.type !== "eyesinfo-eye-select") return;
      if (typeof data.structure !== "string") return;
      setBranch(homeBranchForViewerStructure(data.structure));
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  const topics = branch ? topicsForBranch(branch) : [];

  return (
    <div>
      <iframe
        id="eyesinfo-eye-viewer"
        src={`/eye-viewer.html?lang=${eyeViewerLang(locale)}`}
        title="互動 3D 眼球解剖：旋轉、縮放及查看分層"
        className="eye-viewer-frame"
      />
      {topics.length > 0 ? (
        <ul className="mt-3 overflow-hidden rounded-xl border border-line bg-card">
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
      ) : null}
    </div>
  );
}
