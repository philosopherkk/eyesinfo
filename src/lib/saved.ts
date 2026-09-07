/** Local-only save keys for `/saved` (zustand prefs.saved). No accounts. */

export const TOOL_SAVE_PREFIX = "tool:" as const;

export function topicSaveKey(topicId: string): string {
  return topicId;
}

export function toolSaveKey(toolId: string): string {
  return `${TOOL_SAVE_PREFIX}${toolId}`;
}

export function parseSaveKey(
  key: string,
): { kind: "topic"; id: string } | { kind: "tool"; id: string } {
  if (key.startsWith(TOOL_SAVE_PREFIX)) {
    return { kind: "tool", id: key.slice(TOOL_SAVE_PREFIX.length) };
  }
  return { kind: "topic", id: key };
}
