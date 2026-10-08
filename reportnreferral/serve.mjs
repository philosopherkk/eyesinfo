#!/usr/bin/env node
/** Minimal static file server for local use: `npm run reportnreferral`. */
import { createReadStream, existsSync, statSync } from "node:fs";
import { createServer } from "node:http";
import { dirname, extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(fileURLToPath(import.meta.url));
const port = Number(process.env.PORT) || 5174;
const types = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".svg": "image/svg+xml",
};

createServer((req, res) => {
  const url = new URL(req.url, "http://localhost");
  let rel = normalize(decodeURIComponent(url.pathname)).replace(/^([/\\])+/, "");
  if (!rel || rel.endsWith("/")) rel += "index.html";
  const file = join(root, rel);
  const allowed = /^(index\.html|styles\.css|src\/[\w.-]+\.js)$/.test(rel.replace(/\\/g, "/"));
  if (!allowed || !file.startsWith(root) || !existsSync(file) || !statSync(file).isFile()) {
    res.writeHead(404, { "content-type": "text/plain" }).end("Not found");
    return;
  }
  res.writeHead(200, {
    "content-type": types[extname(file)] || "application/octet-stream",
    "cache-control": "no-store",
    "x-robots-tag": "noindex",
  });
  createReadStream(file).pipe(res);
}).listen(port, "127.0.0.1", () => {
  console.log(`ReportNReferral running at http://127.0.0.1:${port}/`);
});
