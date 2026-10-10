#!/usr/bin/env node
// Reads this computer and answers http://127.0.0.1:41732/hardware
// so the Fit page can see the machine in front of you.
import { execFile } from "node:child_process";
import fs from "node:fs";
import http from "node:http";
import os from "node:os";
import { promisify } from "node:util";

const exec = promisify(execFile);
const PORT = 41732;

function run(command, args) {
  return exec(command, args, { timeout: 5000, windowsHide: true })
    .then((result) => result.stdout)
    .catch(() => "");
}

function diskFreeGB() {
  try {
    const stat = fs.statfsSync?.("/");
    if (stat) return (Number(stat.bavail) * Number(stat.bsize)) / 1024 ** 3;
  } catch {
    // statfs is missing on some Windows drives; df covers the rest.
  }
  return 0;
}

async function nvidia() {
  const stdout = await run("nvidia-smi", ["--query-gpu=name,memory.total", "--format=csv,noheader,nounits"]);
  return stdout
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [name, memory] = line.split(",").map((part) => part.trim());
      const vramGB = Number(memory) / 1024;
      return { name: name || "NVIDIA GPU", vramGB };
    })
    .filter((gpu) => gpu.name && Number.isFinite(gpu.vramGB) && gpu.vramGB > 0.5);
}

async function appleGraphics() {
  if (os.platform() !== "darwin") return [];
  const stdout = await run("system_profiler", ["SPDisplaysDataType", "-json"]);
  try {
    const parsed = JSON.parse(stdout);
    const cards = parsed.SPDisplaysDataType ?? [];
    return cards
      .map((card) => ({
        name: String(card.sppci_model || "Apple GPU"),
        vramGB: Number.parseInt(String(card.spdisplays_vram || "0"), 10) / 1024,
      }))
      .filter((gpu) => gpu.name);
  } catch {
    return [];
  }
}

async function windowsGraphics() {
  if (os.platform() !== "win32") return [];
  const stdout = await run("powershell.exe", [
    "-NoProfile",
    "-Command",
    "Get-CimInstance Win32_VideoController | Select-Object Name,AdapterRAM | ConvertTo-Json -Compress",
  ]);
  try {
    const parsed = JSON.parse(stdout);
    const rows = Array.isArray(parsed) ? parsed : [parsed];
    return rows
      .map((row) => ({
        name: String(row.Name || ""),
        vramGB: Number(row.AdapterRAM) > 0 ? Number(row.AdapterRAM) / 1024 ** 3 : 0,
      }))
      .filter((gpu) => gpu.name && !/microsoft basic|remote|iddc|virtual/i.test(gpu.name));
  } catch {
    return [];
  }
}

async function linuxGraphics() {
  if (os.platform() !== "linux") return [];
  const stdout = await run("lspci", ["-mm"]);
  return stdout
    .split("\n")
    .filter((line) => /VGA|3D|Display/.test(line))
    .map((line) => {
      const parts = [...line.matchAll(/"([^"]*)"/g)].map((match) => match[1]);
      const name = parts[parts.length - 1] || "";
      return { name, vramGB: 0 };
    })
    .filter((gpu) => gpu.name && !/aspeed|matrox|virtio|qemu|vmware|cirrus/i.test(gpu.name));
}

async function cpuInfo() {
  const logical = os.cpus().length || 1;
  let name = os.cpus()[0]?.model?.trim() || "Unknown processor";
  let physical = logical;
  if (os.platform() === "darwin") {
    const brand = (await run("sysctl", ["-n", "machdep.cpu.brand_string"])).trim();
    const cores = Number((await run("sysctl", ["-n", "hw.physicalcpu"])).trim());
    if (brand) name = brand;
    if (cores > 0) physical = cores;
  } else if (os.platform() === "linux") {
    try {
      const info = fs.readFileSync("/proc/cpuinfo", "utf8");
      const perSocket = Number(/cpu cores\s*:\s*(\d+)/.exec(info)?.[1] ?? 0);
      const sockets = new Set([...info.matchAll(/^physical id\s*:\s*(\d+)/gm)].map((match) => match[1])).size || 1;
      if (perSocket > 0) physical = perSocket * sockets;
    } catch {
      physical = logical;
    }
  } else if (os.platform() === "win32") {
    const stdout = await run("powershell.exe", [
      "-NoProfile",
      "-Command",
      "(Get-CimInstance Win32_Processor | Select-Object -First 1 Name,NumberOfCores,NumberOfLogicalProcessors | ConvertTo-Json -Compress)",
    ]);
    try {
      const parsed = JSON.parse(stdout);
      if (parsed.Name) name = String(parsed.Name).trim();
      if (Number(parsed.NumberOfCores) > 0) physical = Number(parsed.NumberOfCores);
    } catch {
      physical = logical;
    }
  }
  return { name, physical, logical };
}

async function report() {
  const cpu = await cpuInfo();
  const nvidiaGpus = await nvidia();
  const gpus = nvidiaGpus.length
    ? nvidiaGpus
    : [...(await appleGraphics()), ...(await windowsGraphics()), ...(await linuxGraphics())];
  const ollama = Boolean((await run("ollama", ["--version"])).trim());
  let disk = diskFreeGB();
  if (disk <= 0) {
    const df = await run("df", ["-k", "/"]);
    const line = df.trim().split("\n").at(-1) ?? "";
    const available = Number(line.trim().split(/\s+/)[3]);
    if (available > 0) disk = (available * 1024) / 1024 ** 3;
  }
  return {
    cpuName: cpu.name,
    physicalCores: cpu.physical,
    logicalCores: cpu.logical,
    ramGB: os.totalmem() / 1024 ** 3,
    gpus,
    diskFreeGB: disk,
    platform: os.platform(),
    ollamaInstalled: ollama,
    detectedAt: new Date().toISOString(),
  };
}

function allow(request, response) {
  response.setHeader("Access-Control-Allow-Origin", request.headers.origin || "*");
  response.setHeader("Vary", "Origin");
  response.setHeader("Access-Control-Allow-Private-Network", "true");
  response.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  response.setHeader("Access-Control-Allow-Headers", "*");
}

const server = http.createServer((request, response) => {
  allow(request, response);
  if (request.method === "OPTIONS") {
    response.writeHead(204);
    response.end();
    return;
  }
  if (request.url?.startsWith("/hardware")) {
    report()
      .then((body) => {
        response.writeHead(200, { "Content-Type": "application/json", "Cache-Control": "no-store" });
        response.end(JSON.stringify(body));
      })
      .catch((error) => {
        response.writeHead(500, { "Content-Type": "application/json" });
        response.end(JSON.stringify({ error: String(error?.message || error) }));
      });
    return;
  }
  response.writeHead(404);
  response.end();
});

server.listen(PORT, "127.0.0.1", () => {
  console.log(`Fit is reading this computer at http://127.0.0.1:${PORT}/hardware`);
  console.log("Leave this running, go back to the page, and press Rescan.");
});
