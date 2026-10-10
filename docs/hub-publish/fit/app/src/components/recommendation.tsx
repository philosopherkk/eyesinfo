"use client";

import { useRef, useState } from "react";
import { Check, Copy } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatGB, formatTokens, formatTps } from "@/lib/format";
import type { Task } from "@/lib/types";
import { contextOverrideCommand, type ScoredModel } from "@/lib/recommend";

export function Recommendation({
  selected,
  best,
  others,
  slower,
  tooBig,
  task,
  showDisk,
  showOllama,
  ollamaInstalled,
  onSelect,
}: {
  selected: ScoredModel;
  best: ScoredModel | null;
  others: ScoredModel[];
  slower: ScoredModel[];
  tooBig: { model: { id: string; name: string; paramsLabel: string }; neededGB: number }[];
  task: Task;
  showDisk: boolean;
  showOllama: boolean;
  ollamaInstalled: boolean | null;
  onSelect: (id: string | null) => void;
}) {
  const isBest = selected.model.id === best?.model.id;
  const override = contextOverrideCommand(selected.contextTokens);

  return (
    <div className="rounded-3xl border border-primary/25 bg-card p-6 shadow-[0_1px_0_rgba(40,30,10,0.04)] sm:p-8">
      <p className="text-sm font-medium text-primary">
        {isBest ? "Best fit" : "Another model that fits"}
      </p>
      <h2 className="mt-2 font-display text-4xl tracking-tight text-balance sm:text-5xl">
        {selected.model.name}
      </h2>
      <p className="mt-3 max-w-xl text-base leading-7 text-muted-foreground">
        {selected.model.blurb}
      </p>

      <dl className="mt-6 grid gap-3 sm:grid-cols-3">
        <Stat
          label="Context"
          value={formatTokens(selected.contextTokens)}
          detail="Tokens it can read at once"
        />
        <Stat
          label="Speed"
          value={`~${formatTps(selected.tokensPerSec)} tok/s`}
          detail={selected.pace}
        />
        <Stat
          label="Memory"
          value={`${formatGB(selected.memoryGB)} GB`}
          detail={memoryDetail(selected)}
        />
      </dl>

      <div className="mt-6 flex flex-wrap gap-2 text-xs text-muted-foreground">
        <Badge variant="outline">{selected.model.paramsLabel}</Badge>
        <Badge variant="outline">{selected.model.license}</Badge>
        {selected.model.vision ? <Badge variant="outline">Reads images</Badge> : null}
        {selected.model.thinking ? <Badge variant="outline">Thinks first</Badge> : null}
        <Badge variant="outline">{placementLabel(selected.placement)}</Badge>
      </div>

      {selected.model.thinking ? (
        <p className="mt-4 text-sm leading-6 text-muted-foreground">
          It writes its reasoning before the answer, so a full reply takes longer than the speed
          number suggests.
        </p>
      ) : null}
      {selected.model.mtp ? (
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Ollama drafts extra tokens for this model, so it often runs faster than this estimate.
        </p>
      ) : null}

      <div className="mt-6 rounded-2xl bg-background p-4">
        <p className="text-sm font-medium">Run it</p>
        <p className="mt-1 text-sm text-muted-foreground">
          One command, after{" "}
          <a
            className="underline underline-offset-4"
            href="https://ollama.com/download"
          >
            Ollama
          </a>{" "}
          is installed.
          {showOllama && ollamaInstalled === false
            ? " It is not installed on this computer yet."
            : ""}
          {showOllama && ollamaInstalled ? " Ollama is already installed here." : ""}
        </p>
        <CommandRow text={selected.command} />
        {selected.needsContextOverride ? (
          <div className="mt-4">
            <p className="text-sm leading-6 text-muted-foreground">
              Ollama would otherwise keep only {formatTokens(selected.ollamaDefaultContext)} tokens.
              Quit it, then start it with the longer window:
            </p>
            <CommandRow text={override} />
          </div>
        ) : null}
        {showDisk && !selected.diskOk ? (
          <p className="mt-3 text-sm text-destructive">
            Free disk looks tight for a {formatGB(selected.model.weightsGB)} GB download.
          </p>
        ) : null}
        <a
          className="mt-3 inline-block text-sm text-muted-foreground underline underline-offset-4"
          href={`https://ollama.com/library/${selected.model.tag}`}
        >
          Model card
        </a>
      </div>

      {!isBest ? (
        <button
          type="button"
          className="mt-4 text-sm font-medium text-primary underline-offset-4 hover:underline"
          onClick={() => onSelect(null)}
        >
          Back to the best fit
        </button>
      ) : null}

      {others.length > 0 ? (
        <div className="mt-8">
          <h3 className="text-sm font-medium">Other models that fit</h3>
          <ul className="mt-3 divide-y divide-border border-y border-border">
            {others.map((item) => (
              <li key={item.model.id}>
                <button
                  type="button"
                  className="flex w-full flex-col gap-1 py-3 text-left sm:flex-row sm:items-center sm:justify-between"
                  onClick={() => onSelect(item.model.id)}
                >
                  <span>
                    <span className="font-medium">{item.model.name}</span>
                    <span className="mt-0.5 block text-sm text-muted-foreground sm:mt-0">
                      {best ? altReason(item, best, task) : "Also fits"}
                    </span>
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {formatTokens(item.contextTokens)} · ~{formatTps(item.tokensPerSec)} / sec ·{" "}
                    {formatGB(item.memoryGB)} GB
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {slower.length > 0 || tooBig.length > 0 ? (
        <details className="mt-6 text-sm">
          <summary className="cursor-pointer font-medium">Models that are a worse fit</summary>
          <ul className="mt-3 space-y-2 text-muted-foreground">
            {slower.map((item) => (
              <li key={item.model.id}>
                <button
                  type="button"
                  className="text-left underline-offset-4 hover:underline"
                  onClick={() => onSelect(item.model.id)}
                >
                  {item.model.name}
                </button>
                <span>
                  {" "}
                  — ~{formatTps(item.tokensPerSec)} / sec, {formatTokens(item.contextTokens)}{" "}
                  context
                </span>
              </li>
            ))}
            {tooBig.map((item) => (
              <li key={item.model.id}>
                {item.model.name} — needs about {formatGB(item.neededGB)} GB before it is
                comfortable
              </li>
            ))}
          </ul>
        </details>
      ) : null}
    </div>
  );
}

export function CommandRow({ text }: { text: string }) {
  const codeRef = useRef<HTMLElement>(null);
  const [state, setState] = useState<"idle" | "copied" | "highlighted">("idle");

  async function copy() {
    setState("copied");
    let ok = false;
    try {
      const write = navigator.clipboard?.writeText(text).then(() => true);
      ok = await Promise.race([
        write ?? Promise.resolve(false),
        new Promise<boolean>((resolve) => {
          window.setTimeout(() => resolve(false), 300);
        }),
      ]);
    } catch {
      ok = false;
    }
    if (!ok) {
      const node = codeRef.current;
      if (node) {
        const range = document.createRange();
        range.selectNodeContents(node);
        const selection = window.getSelection();
        selection?.removeAllRanges();
        selection?.addRange(range);
      }
      try {
        ok = document.execCommand("copy");
      } catch {
        ok = false;
      }
      setState(ok ? "copied" : "highlighted");
    }
    window.setTimeout(() => setState("idle"), 4000);
  }

  return (
    <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center">
      <code
        ref={codeRef}
        className="block flex-1 overflow-x-auto rounded-xl bg-muted px-3 py-2 font-mono text-sm text-foreground select-text"
      >
        {text}
      </code>
      <Button type="button" className="h-10 px-4 sm:min-w-36" onClick={() => void copy()}>
        {state === "idle" ? <Copy /> : <Check />}
        {state === "copied" ? "Copied" : state === "highlighted" ? "Highlighted" : "Copy"}
      </Button>
    </div>
  );
}

function Stat({
  label,
  value,
  detail,
}: {
  label: string;
  value: string;
  detail: string;
}) {
  return (
    <div className="rounded-2xl bg-background px-4 py-3">
      <dt className="text-sm text-muted-foreground">{label}</dt>
      <dd className="mt-1 font-display text-3xl tracking-tight">{value}</dd>
      <p className="mt-1 text-sm leading-5 text-muted-foreground">{detail}</p>
    </div>
  );
}

function memoryDetail(selected: ScoredModel): string {
  const free = `${formatGB(selected.headroomGB)} GB still free`;
  if (selected.placement === "gpu") return `${free} on the GPU`;
  if (selected.placement === "apple") return `${free} in shared memory`;
  if (selected.placement === "offload") return "Too big for the GPU, so it spills into RAM";
  return `${free} for the rest of the system`;
}

function placementLabel(placement: ScoredModel["placement"]): string {
  if (placement === "gpu") return "Stays on the GPU";
  if (placement === "apple") return "Shared memory";
  if (placement === "offload") return "Spills into RAM";
  return "Runs on the CPU";
}

function altReason(item: ScoredModel, best: ScoredModel, task: Task): string {
  if (item.model.quality[task] >= best.model.quality[task] + 4) {
    return "Smarter, if you can wait";
  }
  if (item.tokensPerSec >= 1.35 * best.tokensPerSec) return "Faster";
  if (item.contextTokens >= 1.5 * best.contextTokens) return "Longer context";
  if (item.memoryGB <= 0.75 * best.memoryGB) return "Uses less memory";
  return "Also a solid fit";
}
