export function walkStrings<T>(value: T, fn: (s: string) => string): T {
  if (typeof value === "string") return fn(value) as T;
  if (Array.isArray(value)) return value.map((v) => walkStrings(v, fn)) as T;
  if (value && typeof value === "object") {
    const src = value as Record<string, unknown>;
    const out: Record<string, unknown> = {};
    for (const key of Object.keys(src)) {
      const v = src[key];
      if (typeof v === "function") out[key] = v;
      else out[key] = walkStrings(v, fn);
    }
    return out as T;
  }
  return value;
}
