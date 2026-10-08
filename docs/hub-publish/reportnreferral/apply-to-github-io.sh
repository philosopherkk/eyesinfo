#!/usr/bin/env bash
# Apply the hub publish bundle into a local clone of philosopherkk.github.io
set -euo pipefail
BUNDLE_ROOT="$(cd "$(dirname "$0")" && pwd)"
TARGET="${1:-}"
if [[ -z "$TARGET" || ! -d "$TARGET/.git" ]]; then
  echo "Usage: $0 /path/to/philosopherkk.github.io" >&2
  exit 1
fi
rm -rf "$TARGET/reportnreferral"
cp -a "$BUNDLE_ROOT/app" "$TARGET/reportnreferral"
cp "$BUNDLE_ROOT/hub-root/index.html" "$TARGET/index.html"
cp "$BUNDLE_ROOT/hub-root/AGENTS.md" "$TARGET/AGENTS.md"
cp "$BUNDLE_ROOT/hub-root/README.md" "$TARGET/README.md"
cp "$BUNDLE_ROOT/scripts/check-hub.sh" "$TARGET/scripts/check-hub.sh"
(cd "$TARGET" && bash scripts/check-hub.sh)
echo "Applied. Commit and push from $TARGET"
