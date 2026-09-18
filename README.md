# 護眼學堂 (eyesinfo.org)

Hong Kong public eye-education site. Traditional Chinese first; also Simplified, English, Japanese. Not a clinic shopfront.

Live site: https://eyesinfo.org

## Edit and deploy

Source of truth is this repo, not chat history and not an editor buffer.

1. New work: `git checkout -b feat/short-name` or `chore/…` (never commit on main).
2. Edit files. Bump CONTENT_VERSION / 網站版本 only when KK says this is a release. Update 最近覆核 when copy changes.
3. `git add` only the files for this change. Commit. `git push -u origin HEAD`.
4. Open the PR. Use the Vercel Preview URL. KK reads 繁 there and merges main.
5. After merge: hard-refresh https://eyesinfo.org and check footer 網站版本 / 最近覆核.

If you use Cursor, clone https://github.com/philosopherkk/eyesinfo and pull before you edit. Same rules. Chat-only edits that are not committed do not exist.

## Where to edit

| What | File |
|---|---|
| Disease / topic copy | `src/data/topics.ts`, `src/data/extra-topics.ts` |
| English / Japanese packs | `src/i18n/topics-en.ts`, `src/i18n/topics-ja.ts` |
| Buttons, chrome, 4-language UI | `src/i18n/ui.ts`, `src/i18n/catalog.ts` |
| Citations (PMID only) | `src/data/citations.ts` |
| Version stamp | `src/lib/site.ts` (`CONTENT_VERSION`) |
| Tools (Amsler, IOL, …) | `src/routes/`, `src/components/` |
| Lattice QR (not a patient tool) | `src/routes/qr.tsx` — URL `/qr` only |
| Icons | `public/logo.png`, `public/favicon.svg`, `public/icon-512.png` |

## Compliance (do not undo)

- Education only on this host. No clinic address, phone, fees, booking, or links to a practice site.
- No drug / device / IOL brand names. Classes and INN only.
- No testimonials, before/after selfies, success rates, “根治”, “保證”.
- Simulators are demos, not tests. Keep the per-tool caveat.
- Bump `CONTENT_VERSION` on published medical/education changes.

## Scripts

- `npm run dev` — local server (port 8080)
- `npm run build` — production build
- `npx tsc --noEmit` — typecheck

## Vercel / DNS (already live)

- GitHub repo `philosopherkk/eyesinfo` → Vercel production
- Cloudflare: A `@` → `76.76.21.21` (DNS only); CNAME `www` → `cname.vercel-dns.com` (DNS only)
