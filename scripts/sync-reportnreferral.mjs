#!/usr/bin/env node
/**
 * Copy ReportNReferral static assets into public/ so Vite/Vercel serve them at
 * /reportnreferral/. Source of truth remains reportnreferral/.
 */
import { cpSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const src = join(root, "reportnreferral");
const dest = join(root, "public", "reportnreferral");

rmSync(dest, { recursive: true, force: true });
mkdirSync(dest, { recursive: true });
for (const name of ["index.html", "styles.css"]) {
  cpSync(join(src, name), join(dest, name));
}
cpSync(join(src, "src"), join(dest, "src"), { recursive: true });
writeFileSync(join(dest, ".gitkeep"), "");
console.log("[sync-reportnreferral] wrote public/reportnreferral/");
