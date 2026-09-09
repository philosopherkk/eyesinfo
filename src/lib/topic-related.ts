export type RelatedItem = { href: string; label: string };

export const PRIMARY_TOPIC_CAP = 5;

export function isEduToolHref(href: string): boolean {
  return href.startsWith("/tools/") || href === "/amsler" || href === "/iol";
}

export function isTopicSiblingHref(href: string): boolean {
  return href.startsWith("/t/") || href.startsWith("/c/") || href === "/urgent";
}

/** Split mixed related chips into topic siblings vs education tools. */
export function groupRelatedItems(items: RelatedItem[]): {
  topics: RelatedItem[];
  tools: RelatedItem[];
  other: RelatedItem[];
} {
  const topics: RelatedItem[] = [];
  const tools: RelatedItem[] = [];
  const other: RelatedItem[] = [];
  for (const item of items) {
    if (isEduToolHref(item.href)) tools.push(item);
    else if (isTopicSiblingHref(item.href)) topics.push(item);
    else other.push(item);
  }
  return { topics, tools, other };
}
