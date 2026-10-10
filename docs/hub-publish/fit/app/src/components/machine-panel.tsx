"use client";

import { useState, type ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatGB } from "@/lib/format";
import type { Machine } from "@/lib/types";

export type CustomInput = {
  ramGB: number;
  vramGB: number;
  bandwidthGBps: number;
  apple: boolean;
};

export function MachineCard({
  machine,
  detected,
  status,
  previewing,
}: {
  machine: Machine | null;
  detected: Machine | null;
  status: "loading" | "ready" | "error";
  previewing: boolean;
}) {
  const shown = machine ?? detected;
  return (
    <section
      className="rounded-3xl border border-border bg-card p-5 sm:p-6"
      aria-labelledby="machine-heading"
    >
      <div className="flex flex-wrap items-center gap-2">
        <h2 id="machine-heading" className="text-sm font-medium">
          {previewing ? "Preview" : "This computer"}
        </h2>
        {previewing ? (
          <Badge variant="secondary">Not a live scan</Badge>
        ) : status === "ready" && shown?.scan === "browser" ? (
          <Badge variant="secondary">Seen by the browser</Badge>
        ) : status === "ready" && shown?.scan === "bridge" ? (
          <Badge variant="secondary">Full scan of this computer</Badge>
        ) : status === "ready" ? (
          <Badge variant="secondary">Scanned just now</Badge>
        ) : null}
      </div>
      {previewing ? (
        <p className="mt-2 text-sm text-muted-foreground">
          These picks use the preview, not the machine running this page.
          {detected ? ` This computer has ${describeShort(detected)}.` : ""}
        </p>
      ) : null}
      {status === "error" && !previewing ? (
        <p className="mt-3 text-sm text-destructive">
          Specs could not be read from this computer. Choose a preview, or enter them below.
        </p>
      ) : null}
      {status === "loading" && !shown ? (
        <div className="mt-4 h-16 animate-pulse rounded-xl bg-muted" />
      ) : shown ? (
        <dl className="mt-4 grid gap-4 sm:grid-cols-2">
          <Spec
            term="Processor"
            value={shown.cpuName}
            detail={processorDetail(shown)}
          />
          <Spec term="Memory" value={`${formatGB(shown.ramGB)} GB`} detail="System RAM" />
          <Spec
            term="Graphics"
            value={graphicsValue(shown)}
            detail={graphicsDetail(shown)}
          />
          {shown.platform !== "preview" ? (
            <Spec
              term="Free disk"
              value={shown.diskFreeGB > 0 ? `${formatGB(shown.diskFreeGB)} GB` : "Unknown"}
              detail="Space to download a model"
            />
          ) : (
            <Spec
              term="Usable for a model"
              value={usableValue(shown)}
              detail="After leaving room for the system"
            />
          )}
        </dl>
      ) : null}
      {shown && shown.notes.length > 0 && !previewing ? (
        <ul className="mt-4 space-y-1 text-sm text-muted-foreground">
          {shown.notes.map((note) => (
            <li key={note}>{note}</li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}

export function describeShort(machine: Machine): string {
  const gpu = machine.gpus[0];
  if (gpu) {
    return `${formatGB(machine.ramGB)} GB memory and ${formatGB(gpu.vramGB)} GB graphics`;
  }
  if (machine.apple) {
    return `${formatGB(machine.ramGB)} GB shared memory`;
  }
  return `${formatGB(machine.ramGB)} GB memory and no dedicated GPU`;
}

export function CustomSpecs({
  detected,
  active,
  onApply,
}: {
  detected: Machine | null;
  active: boolean;
  onApply: (input: CustomInput) => void;
}) {
  const gpu = detected?.gpus[0];
  const [ramGB, setRamGB] = useState(
    detected ? String(Math.round(detected.ramGB)) : "32",
  );
  const [vramGB, setVramGB] = useState(
    gpu ? String(Math.round(gpu.vramGB)) : "0",
  );
  const [bandwidthGBps, setBandwidthGBps] = useState(
    gpu?.bandwidthGBps
      ? String(Math.round(gpu.bandwidthGBps))
      : detected?.apple
        ? String(Math.round(detected.apple.bandwidthGBps))
        : "70",
  );
  const [apple, setApple] = useState(!!detected?.apple);

  return (
    <details className="rounded-2xl border border-border bg-card px-4 py-3">
      <summary className="cursor-pointer text-sm font-medium">
        Enter your own specs
      </summary>
      <form
        className="mt-4 grid gap-4 sm:grid-cols-2"
        onSubmit={(event) => {
          event.preventDefault();
          onApply({
            ramGB: Number(ramGB),
            vramGB: Number(vramGB),
            bandwidthGBps: Number(bandwidthGBps),
            apple,
          });
        }}
      >
        <Field label="Memory (GB)" hint="System RAM">
          <Input
            inputMode="decimal"
            value={ramGB}
            onChange={(e) => setRamGB(e.target.value)}
            className="h-10"
            required
          />
        </Field>
        <Field label="Graphics memory (GB)" hint="0 if there is no dedicated GPU">
          <Input
            inputMode="decimal"
            value={vramGB}
            onChange={(e) => setVramGB(e.target.value)}
            className="h-10"
            disabled={apple}
            required
          />
        </Field>
        <Field
          label="Memory speed (GB/s)"
          hint="272 modest GPU, 1008 RTX 4090, 273 M4 Pro"
        >
          <Input
            inputMode="decimal"
            value={bandwidthGBps}
            onChange={(e) => setBandwidthGBps(e.target.value)}
            className="h-10"
            required
          />
        </Field>
        <label className="flex items-center gap-2 self-end pb-2 text-sm">
          <input
            type="checkbox"
            checked={apple}
            onChange={(e) => setApple(e.target.checked)}
            className="size-4 accent-[var(--primary)]"
          />
          Apple silicon, shared memory
        </label>
        <div className="sm:col-span-2">
          <Button type="submit" className="h-10 px-4">
            {active ? "Update specs" : "Use these specs"}
          </Button>
        </div>
      </form>
    </details>
  );
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint: string;
  children: ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      {children}
      <p className="text-xs text-muted-foreground">{hint}</p>
    </div>
  );
}

function Spec({
  term,
  value,
  detail,
}: {
  term: string;
  value: string;
  detail: string;
}) {
  return (
    <div>
      <dt className="text-sm text-muted-foreground">{term}</dt>
      <dd className="mt-1 text-base font-medium text-pretty">{value}</dd>
      <p className="text-sm text-muted-foreground">{detail}</p>
    </div>
  );
}

function processorDetail(machine: Machine): string {
  if (machine.platform === "preview") return "Example machine";
  if (machine.logicalCores > machine.physicalCores) {
    return `${machine.physicalCores} cores, ${machine.logicalCores} threads`;
  }
  return `${machine.physicalCores} cores`;
}

function graphicsValue(machine: Machine): string {
  if (machine.gpus.length === 0) {
    return machine.apple ? "Shared with the chip" : "No dedicated GPU";
  }
  return machine.gpus
    .map((gpu) => gpu.name.replace(/NVIDIA |GeForce /g, ""))
    .join(" + ");
}

function graphicsDetail(machine: Machine): string {
  if (machine.gpus.length === 0) {
    return machine.apple
      ? `${Math.round(machine.apple.bandwidthGBps)} GB/s shared memory`
      : "Runs on system memory";
  }
  const vram = machine.gpus.reduce((sum, gpu) => sum + gpu.vramGB, 0);
  const bandwidth = machine.gpus.find((gpu) => gpu.bandwidthGBps)?.bandwidthGBps;
  if (bandwidth) {
    return `${formatGB(vram)} GB · ${Math.round(bandwidth).toLocaleString("en-US")} GB/s`;
  }
  return `${formatGB(vram)} GB`;
}

function usableValue(machine: Machine): string {
  if (machine.gpus.length > 0) {
    const vram = machine.gpus.reduce((sum, gpu) => sum + gpu.vramGB, 0);
    return `${formatGB(vram)} GB graphics`;
  }
  if (machine.apple) return `${formatGB(0.7 * machine.ramGB)} GB shared`;
  return `${formatGB(Math.max(1, machine.ramGB - 4))} GB RAM`;
}
