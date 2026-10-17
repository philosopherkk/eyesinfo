#!/usr/bin/env node
/**
 * Redaction boundary for ReportNReferral.
 *
 * single-redaction-module — exactly one file named pii.js.
 * no-identifier-literals-outside-tests — an identifier-shaped literal
 * outside a test file.
 *
 * Prints rule names and file:line only. Never prints matched text.
 *
 *   node scripts/check-redaction.mjs [--root <dir>]
 */
import { readdirSync, readFileSync } from "node:fs";
import { basename, dirname, extname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const SKIP_DIR = new Set([
  "node_modules",
  ".git",
  "dist",
  ".output",
  ".vercel",
  ".tanstack",
  "coverage",
]);

const SOURCE_EXT = new Set([".js", ".mjs", ".cjs", ".ts", ".tsx", ".jsx", ".html", ".htm"]);

/** Same shape the HKID detector treats as an identifier. */
const IDENTIFIER =
  /(?<![A-Za-z0-9])[A-Z]{1,2}\s?\d{6}\s?(?:\(\s?[0-9A]\s?\)|[0-9A](?![A-Za-z0-9]))/g;

function parseRoot(argv) {
  const index = argv.indexOf("--root");
  if (index === -1) return join(dirname(fileURLToPath(import.meta.url)), "..");
  const value = argv[index + 1];
  if (!value) {
    console.error("check-redaction: --root needs a directory");
    process.exit(2);
  }
  return value;
}

function isTestPath(rel) {
  const parts = rel.split(/[/\\]/);
  if (parts.some((part) => part === "test" || part === "tests" || part === "__tests__")) {
    return true;
  }
  return /\.(?:test|spec)\.[^.]+$/.test(parts[parts.length - 1] ?? "");
}

function walk(dir, files) {
  let entries;
  try {
    entries = readdirSync(dir, { withFileTypes: true });
  } catch {
    return;
  }
  for (const entry of entries) {
    if (SKIP_DIR.has(entry.name) || entry.isSymbolicLink()) continue;
    const abs = join(dir, entry.name);
    if (entry.isDirectory()) walk(abs, files);
    else if (entry.isFile()) files.push(abs);
  }
}

function identifierLines(text) {
  const lines = [];
  const seen = new Set();
  IDENTIFIER.lastIndex = 0;
  for (const match of text.matchAll(IDENTIFIER)) {
    const line = text.slice(0, match.index ?? 0).split("\n").length;
    if (seen.has(line)) continue;
    seen.add(line);
    lines.push(line);
  }
  return lines;
}

function check(root) {
  const files = [];
  walk(root, files);
  const messages = [];

  const modules = files.filter((abs) => basename(abs) === "pii.js").sort();
  if (modules.length !== 1) {
    messages.push(`single-redaction-module: expected one pii.js, found ${modules.length}`);
    for (const abs of modules) messages.push(relative(root, abs));
  }

  for (const abs of files) {
    if (!SOURCE_EXT.has(extname(abs))) continue;
    const rel = relative(root, abs);
    if (isTestPath(rel)) continue;
    let text;
    try {
      text = readFileSync(abs, "utf8");
    } catch {
      continue;
    }
    for (const line of identifierLines(text)) {
      messages.push(`no-identifier-literals-outside-tests: ${rel}:${line}`);
    }
  }

  return messages;
}

const root = parseRoot(process.argv.slice(2));
const messages = check(root);
if (messages.length) {
  for (const message of messages) console.error(message);
  process.exit(1);
}
console.log("check-redaction: ok");
