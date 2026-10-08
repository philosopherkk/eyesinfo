# RELEASE.md — operator card

Short card for 護眼學堂 / eyesinfo.org releases.

## 最近覆核

Bump on **content edits** (date stamp).

## 網站版本 / CONTENT_VERSION

Bump **only** when KK says this is a release (`CONTENT_VERSION` in `src/lib/site.ts`).

## Deploy

- GitHub **philosopherkk/eyesinfo** → Vercel build (Vite React). Production **eyesinfo.org** = branch **`main` only**.
- Content path: feature branch → push → Preview URL → KK reads 繁 → KK says **merge** → production.
- **Never** weekday auto-deploy.
- **Never** CLI `vercel --prod` unless KK typed **“prod deploy”** in that message.
- Never deploy from a Bot disk copy — only this repo’s git remote.
- Do not “fix live” in the Vercel dashboard.

## Post-deploy check

Open https://www.eyesinfo.org (canonical host). Homepage **最近覆核** and **網站版本** must match the deployed commit. If not, say so. Apex `eyesinfo.org` must 301/308 to www.

## Sitemap lastmod

`public/sitemap.xml` `<lastmod>` values are **per-URL content dates** (Asia/Hong_Kong `YYYY-MM-DD`), derived from git history of that page’s body/data sources — not one date for all pages, and not the build date. Shared chrome (header, disclaimer, CSP, `CONTENT_VERSION`) is excluded from the source map so layout-only commits do not bump every URL.

- **Regenerate after content edits** (full git history required): `npm run sitemap:regen`
  - Writes `public/sitemap-lastmod.json` (committed mapping) and `public/sitemap.xml`.
- **Vercel / shallow clone:** the committed mapping is the source of truth at build time. If you need to rebuild XML without git history: `npm run sitemap:from-map`.
- Do not list redirect-only section stubs (`/t/parent-gaps`, `/t/water-acanthamoeba`, `/t/ok-hygiene`) in the sitemap — they 308 to parent topic anchors.

## Normal content update flow

1. Draft 繁 → KK approve
2. Write on feature branch → push
3. Paste Preview URL → KK reads
4. KK says merge → production (`main`)
5. Post-deploy homepage check
