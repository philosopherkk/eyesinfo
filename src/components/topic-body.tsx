import { useMemo, type ReactNode } from "react";
import type { Block } from "@/data/topics";
import { TOPICS } from "@/data/topics";
import { TOOLS } from "@/data/tools";
import { EduLink } from "@/components/edu-link";
import { useI18n, localizeTopic } from "@/i18n";
import { toHans } from "@/i18n/hans";
import { TOOL_TEXT } from "@/i18n/catalog";
import { resolveHeadingId } from "@/lib/topic-anchors";
import {
  buildMentionCatalog,
  linkifyFirstMentions,
  type MentionLink,
  type TextPart,
} from "@/lib/topic-mentions";

function renderParts(parts: TextPart[]): ReactNode {
  return parts.map((part, i) =>
    part.type === "link" && part.href ? (
      <EduLink
        key={i}
        href={part.href}
        className="font-medium text-navy underline underline-offset-2"
      >
        {part.text}
      </EduLink>
    ) : (
      <span key={i}>{part.text}</span>
    ),
  );
}

function linkText(
  text: string,
  mentions: MentionLink[],
  usedHrefs: Set<string>,
  selfHref?: string,
): ReactNode {
  return renderParts(linkifyFirstMentions(text, mentions, usedHrefs, selfHref));
}

export function TopicBody({
  blocks,
  topicId,
}: {
  blocks: Block[];
  /** Current topic id — skips self-links and seeds localized mention titles. */
  topicId?: string;
}) {
  const { locale } = useI18n();

  const mentions = useMemo(() => {
    const topicTitles = TOPICS.map((t) => {
      const loc = localizeTopic(t, locale);
      return { id: t.id, title: loc.title };
    });
    const toolPack = TOOL_TEXT[locale] ?? TOOL_TEXT["zh-Hant"];
    const toolTitles = TOOLS.map((t) => ({
      href: t.href,
      title: toolPack[t.id]?.title ?? t.title,
    }));
    const catalog = buildMentionCatalog({
      topicTitles,
      toolTitles,
      selfTopicId: topicId,
    });
    // Body copy is OpenCC-converted for zh-Hans; keep phrase matching in sync.
    if (locale === "zh-Hans") {
      return catalog.map((m) => ({ ...m, phrase: toHans(m.phrase) }));
    }
    return catalog;
  }, [locale, topicId]);

  const selfHref = topicId ? `/t/${topicId}` : undefined;

  const nodes = useMemo(() => {
    const usedHrefs = new Set<string>();
    const usedHeadingIds = new Set<string>();
    const rich = (text: string) =>
      linkText(text, mentions, usedHrefs, selfHref);

    return blocks.map((block, i) => {
      if (block.type === "h") {
        const id = resolveHeadingId(block.text, block.id, usedHeadingIds);
        return (
          <h2
            key={i}
            id={id}
            className="scroll-mt-20 pt-1 text-[0.95rem] font-semibold tracking-tight text-navy"
          >
            {block.text}
          </h2>
        );
      }
      if (block.type === "p") {
        return (
          <p key={i} className="text-[0.95rem] leading-relaxed text-ink">
            {rich(block.text)}
          </p>
        );
      }
      if (block.type === "warn") {
        return (
          <div
            key={i}
            className="rounded-lg border border-danger/30 bg-danger-bg px-3.5 py-3 text-[0.9rem] leading-relaxed text-danger"
          >
            {rich(block.text)}
          </div>
        );
      }
      if (block.type === "note") {
        return (
          <div
            key={i}
            className="rounded-lg border border-line bg-line/25 px-3.5 py-3 text-[0.88rem] leading-relaxed text-muted"
          >
            {rich(block.text)}
          </div>
        );
      }
      if (block.type === "ul" || block.type === "ol") {
        const Tag = block.type;
        return (
          <Tag
            key={i}
            className={
              block.type === "ol"
                ? "list-decimal space-y-1.5 pl-5 text-[0.92rem] leading-relaxed"
                : "list-disc space-y-1.5 pl-5 text-[0.92rem] leading-relaxed"
            }
          >
            {block.items.map((item, j) => (
              <li key={j}>{rich(item)}</li>
            ))}
          </Tag>
        );
      }
      if (block.type !== "table") return null;
      const [head, ...rows] = block.rows;
      return (
        <div key={i} className="overflow-x-auto rounded-lg border border-line">
          <table className="w-full min-w-[18rem] border-collapse text-left text-[0.8rem]">
            {head ? (
              <thead>
                <tr className="bg-navy text-paper">
                  {head.map((cell, j) => (
                    <th key={j} className="px-2.5 py-2 font-semibold">
                      {cell}
                    </th>
                  ))}
                </tr>
              </thead>
            ) : null}
            <tbody>
              {rows.map((row, r) => (
                <tr
                  key={r}
                  className={r % 2 === 0 ? "bg-card" : "bg-paper/70"}
                >
                  {row.map((cell, c) => (
                    <td
                      key={c}
                      className="border-t border-line px-2.5 py-2 align-top leading-snug"
                    >
                      {rich(cell)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    });
  }, [blocks, mentions, selfHref]);

  return <div className="space-y-4">{nodes}</div>;
}
