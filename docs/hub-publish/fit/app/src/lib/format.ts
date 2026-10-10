export function formatGB(value: number): string {
  if (!Number.isFinite(value)) return "—";
  const rounded = value >= 10 ? Math.round(value) : Math.round(value * 10) / 10;
  return String(rounded);
}

export function formatTokens(tokens: number): string {
  if (tokens >= 1_000_000) {
    const millions = Math.round(tokens / 100_000) / 10;
    return `${millions}M`.replace(".0M", "M");
  }
  if (tokens >= 1024) return `${Math.round(tokens / 1024)}k`;
  return String(tokens);
}

export function formatTps(tokensPerSec: number): string {
  if (tokensPerSec >= 10) return String(Math.round(tokensPerSec));
  return (Math.round(tokensPerSec * 10) / 10).toFixed(1);
}

export function formatBandwidth(gbps: number): string {
  return `${Math.round(gbps).toLocaleString("en-US")} GB/s`;
}
