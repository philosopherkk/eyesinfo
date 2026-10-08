# Publish ReportNReferral to philosopherkk.github.io

The Cursor agent cannot push to `philosopherkk/philosopherkk.github.io` (no write permission). Run this once on a machine that can.

```bash
git clone https://github.com/philosopherkk/philosopherkk.github.io.git
cd philosopherkk.github.io
git checkout -b feat/reportnreferral

# From the eyesinfo repo (this PR / main after merge):
EYESINFO=/path/to/eyesinfo
rm -rf reportnreferral
cp -a "$EYESINFO/docs/hub-publish/reportnreferral/app" reportnreferral
cp "$EYESINFO/docs/hub-publish/reportnreferral/hub-root/index.html" index.html
cp "$EYESINFO/docs/hub-publish/reportnreferral/hub-root/AGENTS.md" AGENTS.md
cp "$EYESINFO/docs/hub-publish/reportnreferral/hub-root/README.md" README.md
cp "$EYESINFO/docs/hub-publish/reportnreferral/scripts/check-hub.sh" scripts/check-hub.sh

bash scripts/check-hub.sh
git add reportnreferral index.html AGENTS.md README.md scripts/check-hub.sh
git commit -m "Add ReportNReferral to the hub"
git push -u origin feat/reportnreferral
gh pr create --base main --title "Add ReportNReferral to the hub" --body "Live: https://philosopherkk.github.io/reportnreferral/"
```

After the hub PR is merged and https://philosopherkk.github.io/reportnreferral/ works, merge the eyesinfo PR that removes `/reportnreferral` from eyesinfo.org.
