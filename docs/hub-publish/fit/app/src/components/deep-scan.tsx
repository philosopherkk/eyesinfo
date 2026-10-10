"use client";

import { browserCommand } from "@/lib/scan";
import { CommandRow } from "@/components/recommendation";

export function DeepScan({ connected }: { connected: boolean }) {
  const origin = typeof window === "undefined" ? "" : window.location.origin;
  const windows = typeof navigator !== "undefined" && /win/i.test(navigator.platform);
  const command = browserCommand(origin || "https://fit-llm.vercel.app", windows);

  if (connected) {
    return (
      <p className="text-sm text-muted-foreground">
        Numbers above are from this computer, including memory, graphics memory, free disk, and Ollama.
      </p>
    );
  }

  return (
    <div className="rounded-2xl border border-border bg-card px-4 py-4">
      <h2 className="text-sm font-medium">Read the exact specs</h2>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        A website cannot open the graphics card or the memory controller. The pick above uses the
        card name and the processor thread count the browser is willing to share. Run this on the
        computer you want to measure, leave that window open, then press Rescan.
      </p>
      <CommandRow text={command} />
      <p className="mt-3 text-sm text-muted-foreground">Needs Node.js. It only listens on this computer.</p>
    </div>
  );
}
