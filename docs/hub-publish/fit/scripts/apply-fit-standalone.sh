#!/usr/bin/env bash
# Create philosopherkk/fit (public), push main, and open a hub-card PR.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../../../.." && pwd)"
APP="$ROOT/docs/hub-publish/fit/app"
HUB_SRC="$ROOT/docs/hub-publish/fit/hub-root"
WORK="${TMPDIR:-/tmp}/fit-standalone-$$"
HUB_WORK="${TMPDIR:-/tmp}/fit-hub-$$"

if [[ ! -f "$APP/package.json" ]]; then
  echo "Missing $APP/package.json" >&2
  exit 1
fi

if ! command -v gh >/dev/null; then
  echo "gh CLI required" >&2
  exit 1
fi

if ! gh repo view philosopherkk/fit >/dev/null 2>&1; then
  echo "Creating public philosopherkk/fit …"
  gh repo create philosopherkk/fit \
    --public \
    --description "Fit — recommend an open local LLM for this computer" \
    --disable-wiki \
    --disable-issues=false
else
  echo "philosopherkk/fit already exists"
fi

rm -rf "$WORK"
mkdir -p "$WORK"
tar -C "$APP" -cf - . | tar -C "$WORK" -xf -
cd "$WORK"
git init -b main
git add -A
git add -f next-env.d.ts 2>/dev/null || true
git commit -m "Initial import: Fit — open local LLM recommender"
git remote add origin "https://github.com/philosopherkk/fit.git"
git push -u origin main

echo "Pushed https://github.com/philosopherkk/fit"

rm -rf "$HUB_WORK"
gh repo clone philosopherkk/philosopherkk.github.io "$HUB_WORK"
cd "$HUB_WORK"
git checkout -b feat/fit-hub-card
cp "$HUB_SRC/index.html" index.html
cp "$HUB_SRC/README.md" README.md
cp "$HUB_SRC/AGENTS.md" AGENTS.md
if [[ -x scripts/check-hub.sh ]]; then
  bash scripts/check-hub.sh
fi
git add index.html README.md AGENTS.md
git commit -m "Add Fit hub card (external: fit-llm.vercel.app)"
git push -u origin feat/fit-hub-card
gh pr create --base main \
  --title "Add Fit hub card" \
  --body "Card 10 · Fit — links to https://fit-llm.vercel.app and https://github.com/philosopherkk/fit. Hub links out only (no Fit folder on github.io)."

echo "Done. Merge the hub PR, then connect Vercel fit-llm → philosopherkk/fit (see APPLY.md)."
