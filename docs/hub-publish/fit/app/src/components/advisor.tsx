"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import { RotateCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Machine, Preference, Task } from "@/lib/types";
import {
  customMachine,
  PREVIEWS,
  previewMachine,
  type PreviewId,
} from "@/lib/previews";
import { recommend } from "@/lib/recommend";
import { cn } from "cn";
import {
  CustomSpecs,
  describeShort,
  MachineCard,
  type CustomInput,
} from "@/components/machine-panel";
import { DeepScan } from "@/components/deep-scan";
import { Recommendation } from "@/components/recommendation";
import {
  readBridge,
  scanBrowser,
  scanModeFromLocation,
} from "@/lib/browser-scan";

const TASKS: { id: Task; label: string }[] = [
  { id: "chat", label: "Chat" },
  { id: "code", label: "Code" },
  { id: "reason", label: "Reason" },
  { id: "vision", label: "Images" },
  { id: "docs", label: "Long documents" },
];

const PREFERENCES: { id: Preference; label: string }[] = [
  { id: "fast", label: "Fast replies" },
  { id: "balanced", label: "Balanced" },
  { id: "smart", label: "Best quality" },
];

type Choice =
  | { kind: "detected" }
  | { kind: "preview"; id: PreviewId }
  | { kind: "custom"; input: CustomInput };

export function Advisor() {
  const [detected, setDetected] = useState<Machine | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [scan, setScan] = useState(0);
  const [choice, setChoice] = useState<Choice>({ kind: "detected" });
  const [task, setTask] = useState<Task>("chat");
  const [preference, setPreference] = useState<Preference>("balanced");
  const [picked, setPicked] = useState<{ key: string; id: string } | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setStatus("loading");
      try {
        const mode = scanModeFromLocation();
        if (mode === "browser") {
          const machine = (await readBridge()) ?? (await scanBrowser());
          if (!cancelled) {
            setDetected(machine);
            setStatus("ready");
          }
          return;
        }
        const response = await fetch("/api/hardware", { cache: "no-store" });
        if (!response.ok) throw new Error("hardware");
        const machine = (await response.json()) as Machine;
        if (!cancelled) {
          setDetected(machine);
          setStatus("ready");
        }
      } catch {
        if (!cancelled) {
          try {
            const machine = await scanBrowser();
            if (!cancelled) {
              setDetected(machine);
              setStatus("ready");
            }
          } catch {
            if (!cancelled) setStatus("error");
          }
        }
      }
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, [scan]);

  const choiceKey =
    choice.kind === "custom"
      ? `custom:${JSON.stringify(choice.input)}`
      : choice.kind === "preview"
        ? choice.id
        : "detected";
  const pickKey = `${choiceKey}:${task}:${preference}`;
  const selectedId = picked?.key === pickKey ? picked.id : null;

  const machine = useMemo(() => {
    if (choice.kind === "preview") return previewMachine(choice.id);
    if (choice.kind === "custom") return customMachine(choice.input);
    return detected;
  }, [choice, detected]);

  const result = useMemo(
    () => (machine ? recommend(machine, task, preference) : null),
    [machine, task, preference],
  );

  const selected =
    (result?.best
      ? [result.best, ...result.alternatives, ...result.slower]
      : []
    ).find((item) => item.model.id === selectedId) ??
    result?.best ??
    null;

  const others = (result?.alternatives ?? []).filter(
    (item) => item.model.id !== selected?.model.id,
  );

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-8 px-4 py-8 sm:px-6 sm:py-12">
      <header className="flex items-start justify-between gap-4">
        <div>
          <p className="font-display text-3xl tracking-tight text-foreground">Fit</p>
          <p className="mt-1 max-w-md text-sm text-muted-foreground">
            Which open model this computer can run, and how fast it should feel.
          </p>
        </div>
        <Button
          variant="outline"
          className="h-10 shrink-0"
          onClick={() => setScan((n) => n + 1)}
          disabled={status === "loading"}
        >
          <RotateCw className={cn(status === "loading" && "animate-spin")} />
          Rescan
        </Button>
      </header>

      <p className="text-sm text-muted-foreground">
        {choice.kind === "detected"
          ? status === "loading" && !detected
            ? "Reading this computer…"
            : detected
              ? `This computer · ${describeShort(detected)}${
                  detected.scan === "browser"
                    ? " · from the browser"
                    : detected.scan === "bridge"
                      ? " · full scan"
                      : ""
                }`
              : "Specs could not be read. Pick a preview or enter your own."
          : machine
            ? `Preview · ${describeShort(machine)}. Not the machine running this page.`
            : null}
      </p>

      <section className="space-y-4" aria-labelledby="job-heading">
        <div>
          <h2 id="job-heading" className="text-sm font-medium">
            What will you use it for?
          </h2>
          <div className="mt-2 flex flex-wrap gap-2" role="group" aria-label="Task">
            {TASKS.map((item) => (
              <Chip
                key={item.id}
                pressed={task === item.id}
                onClick={() => setTask(item.id)}
              >
                {item.label}
              </Chip>
            ))}
          </div>
        </div>
        <div>
          <h2 className="text-sm font-medium">What matters more?</h2>
          <div
            className="mt-2 flex flex-wrap gap-2"
            role="group"
            aria-label="Priority"
          >
            {PREFERENCES.map((item) => (
              <Chip
                key={item.id}
                pressed={preference === item.id}
                onClick={() => setPreference(item.id)}
              >
                {item.label}
              </Chip>
            ))}
          </div>
        </div>
      </section>

      <section aria-live="polite" aria-busy={status === "loading" && !result}>
        {selected && result ? (
          <Recommendation
            selected={selected}
            best={result.best}
            others={others}
            slower={result.slower.filter(
              (item) => item.model.id !== selected.model.id,
            )}
            tooBig={result.tooBig}
            task={task}
            showDisk={
              choice.kind === "detected" && (detected?.diskFreeGB ?? 0) > 0
            }
            showOllama={choice.kind === "detected"}
            ollamaInstalled={detected?.ollamaInstalled ?? null}
            onSelect={(id) => setPicked(id ? { key: pickKey, id } : null)}
          />
        ) : status === "loading" ? (
          <div className="rounded-3xl border border-border bg-card p-6 sm:p-8">
            <p className="text-sm text-muted-foreground">Reading this computer…</p>
            <div className="mt-6 h-10 w-2/3 animate-pulse rounded-lg bg-muted" />
            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              <div className="h-24 animate-pulse rounded-xl bg-muted" />
              <div className="h-24 animate-pulse rounded-xl bg-muted" />
              <div className="h-24 animate-pulse rounded-xl bg-muted" />
            </div>
          </div>
        ) : (
          <div className="rounded-3xl border border-border bg-card p-6 sm:p-8">
            <h2 className="font-display text-3xl tracking-tight">No model fits yet</h2>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              {result?.emptyReason ??
                "Specs could not be read. Pick a preview above, or enter memory and graphics memory yourself."}
            </p>
          </div>
        )}
      </section>

      {choice.kind === "detected" && detected && detected.scan !== "server" ? (
        <DeepScan connected={detected.scan === "bridge"} />
      ) : null}

      <section className="space-y-3" aria-labelledby="preview-heading">
        <h2 id="preview-heading" className="text-sm font-medium text-foreground">
          {status === "error" ? "Try a common computer" : "Or preview another computer"}
        </h2>
        <div className="flex flex-wrap gap-2">
          <Chip
            pressed={choice.kind === "detected"}
            disabled={!detected}
            onClick={() => setChoice({ kind: "detected" })}
          >
            This computer
          </Chip>
          {PREVIEWS.map((item) => (
            <Chip
              key={item.id}
              pressed={choice.kind === "preview" && choice.id === item.id}
              title={item.detail}
              onClick={() => setChoice({ kind: "preview", id: item.id })}
            >
              {item.label}
            </Chip>
          ))}
        </div>
        <CustomSpecs
          key={detected?.detectedAt ?? "manual"}
          detected={detected}
          active={choice.kind === "custom"}
          onApply={(input) => setChoice({ kind: "custom", input })}
        />
      </section>

      <MachineCard
        machine={machine}
        detected={detected}
        status={status}
        previewing={choice.kind !== "detected"}
      />

      <footer className="space-y-2 text-sm leading-6 text-muted-foreground">
        <p>
          Speed is an estimate from memory bandwidth, not a live benchmark. Context is the longest
          window that still fits with room to spare. A quantized cache can stretch that window
          further.
        </p>
        {result?.deviceNote ? <p>{result.deviceNote}</p> : null}
        {result?.bandwidthEstimated ? (
          <p>
            Graphics or memory speed was estimated, so the tokens-per-second figure is rougher.
          </p>
        ) : null}
      </footer>
    </div>
  );
}

function Chip({
  pressed,
  onClick,
  children,
  disabled,
  title,
}: {
  pressed: boolean;
  onClick: () => void;
  children: ReactNode;
  disabled?: boolean;
  title?: string;
}) {
  return (
    <button
      type="button"
      title={title}
      aria-pressed={pressed}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "h-10 rounded-full border px-3.5 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-40",
        pressed
          ? "border-primary bg-primary text-primary-foreground"
          : "border-border bg-card text-foreground hover:bg-muted",
      )}
    >
      {children}
    </button>
  );
}
