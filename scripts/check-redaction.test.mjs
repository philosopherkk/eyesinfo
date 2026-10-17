import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const script = fileURLToPath(new URL("./check-redaction.mjs", import.meta.url));

function dummyIdentifier() {
  return ["A", "123456", "(0)"].join("");
}

function run(root) {
  return spawnSync(process.execPath, [script, "--root", root], { encoding: "utf8" });
}

function fixture() {
  return mkdtempSync(join(tmpdir(), "redaction-check-"));
}

test("one module and a literal only under test/ exits 0", () => {
  const root = fixture();
  try {
    mkdirSync(join(root, "src"));
    mkdirSync(join(root, "test"));
    writeFileSync(join(root, "src", "pii.js"), "export {}\n");
    writeFileSync(join(root, "test", "sample.js"), `const sample = ${JSON.stringify(dummyIdentifier())};\n`);
    const result = run(root);
    assert.equal(result.status, 0);
    assert.match(result.stdout, /check-redaction: ok/);
    assert.equal(result.stdout.includes(dummyIdentifier()), false);
    assert.equal(result.stderr.includes(dummyIdentifier()), false);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test("a second pii.js exits 1 on single-redaction-module", () => {
  const root = fixture();
  try {
    mkdirSync(join(root, "src"));
    mkdirSync(join(root, "copy"));
    writeFileSync(join(root, "src", "pii.js"), "export {}\n");
    writeFileSync(join(root, "copy", "pii.js"), "export {}\n");
    const result = run(root);
    assert.equal(result.status, 1);
    assert.match(result.stderr, /single-redaction-module/);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test("a dummy literal in app.js exits 1 on no-identifier-literals-outside-tests", () => {
  const root = fixture();
  try {
    mkdirSync(join(root, "src"));
    writeFileSync(join(root, "src", "pii.js"), "export {}\n");
    writeFileSync(join(root, "src", "app.js"), `const sample = ${JSON.stringify(dummyIdentifier())};\n`);
    const result = run(root);
    assert.equal(result.status, 1);
    assert.match(result.stderr, /no-identifier-literals-outside-tests: src\/app\.js:1/);
    assert.equal(result.stderr.includes(dummyIdentifier()), false);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});
