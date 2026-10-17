#!/usr/bin/env node
/**
 * Assemble the ReportNReferral hub app from reportnreferral/.
 *
 * The committed snapshot at docs/hub-publish/reportnreferral/app does not
 * store a second pii.js. Pass --dest to copy the redaction module into a
 * build output (CI temp dir, or the github.io tree at apply time).
 */
import { cpSync, mkdirSync, rmSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const src = join(root, "reportnreferral");

function parseDest(argv) {
  const index = argv.indexOf("--dest");
  if (index === -1) return null;
  const value = argv[index + 1];
  if (!value) {
    console.error("bundle-reportnreferral-for-hub: --dest needs a directory");
    process.exit(2);
  }
  return value;
}

const destArg = parseDest(process.argv.slice(2));
const emitModule = destArg != null;
const dest = destArg ?? join(root, "docs", "hub-publish", "reportnreferral", "app");

rmSync(dest, { recursive: true, force: true });
mkdirSync(dest, { recursive: true });
for (const name of ["index.html", "styles.css"]) {
  cpSync(join(src, name), join(dest, name));
}
cpSync(join(src, "src"), join(dest, "src"), { recursive: true });
cpSync(join(src, "README.md"), join(dest, "README.md"));
if (!emitModule) rmSync(join(dest, "src", "pii.js"), { force: true });

console.log(
  `[bundle-reportnreferral-for-hub] wrote ${dest}${emitModule ? " (includes src/pii.js)" : " (pii.js omitted from the stored snapshot)"}`,
);
