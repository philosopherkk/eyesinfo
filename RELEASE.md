# RELEASE.md — operator card

Short card for 護眼學堂 / eyesinfo.org releases.

## 最近覆核

Bump on **content edits** (date stamp).

## 網站版本 / CONTENT_VERSION

Bump **only** when KK says this is a release (`CONTENT_VERSION` in `src/lib/site.ts`).

## Deploy

- Target: **Vercel production** for https://eyesinfo.org.
- Only when KK says **deploy**.
- Merge / PR to `main`, then Vercel prod (or EyesInfo’s established Vercel path).
- **Never** auto weekday deploy.

## Post-deploy check

Homepage must show **最近覆核** and **網站版本** matching the deployed commit.

## Normal content update flow

1. Draft 繁
2. KK approve
3. Write files in this repo
4. Commit
5. **Stop** unless KK said deploy
