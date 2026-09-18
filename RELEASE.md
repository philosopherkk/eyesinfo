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

Open https://eyesinfo.org. Homepage **最近覆核** and **網站版本** must match the deployed commit. If not, say so.

## Normal content update flow

1. Draft 繁 → KK approve
2. Write on feature branch → push
3. Paste Preview URL → KK reads
4. KK says merge → production (`main`)
5. Post-deploy homepage check
