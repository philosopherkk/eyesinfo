#!/usr/bin/env node
/** Refresh docs/hub-publish/reportnreferral/app from reportnreferral/ shippable files. */
import { cpSync, mkdirSync, rmSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const src = join(root, "reportnreferral");
const dest = join(root, "docs", "hub-publish", "reportnreferral", "app");
rmSync(dest, { recursive: true, force: true });
mkdirSync(dest, { recursive: true });
for (const name of ["index.html", "styles.css"]) {
  cpSync(join(src, name), join(dest, name));
}
cpSync(join(src, "src"), join(dest, "src"), { recursive: true });
cpSync(join(src, "README.md"), join(dest, "README.md"));
console.log("[bundle-reportnreferral-for-hub] wrote", dest);
