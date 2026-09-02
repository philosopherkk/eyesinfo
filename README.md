# 護眼學堂 (eyesinfo.org)

Hong Kong public eye-education site. Traditional Chinese first; also Simplified, English, Japanese. Not a clinic shopfront.

Live site: https://eyesinfo.org

## Open in Cursor (recommended from now on)

This GitHub repo is the source of truth. Grok chat edits will **not** appear in Cursor unless you pull them. Cursor `git push` to `main` updates Vercel → eyesinfo.org.

1. Install [Cursor](https://cursor.com) and sign in with GitHub if asked.
2. **File → Clone repo** (or Command Palette: `Git: Clone`).
3. Paste: `https://github.com/philosopherkk/eyesinfo`
4. Open the cloned folder.
5. In Cursor’s terminal:

```bash
npm install
npm run dev
```

6. Browser: http://localhost:8080

After you change files:

```bash
# bump version in src/lib/site.ts when you change education content
git add -A
git commit -m "describe the change"
git push origin main
```

Vercel builds `main` automatically. Wait for Production, then hard-refresh https://eyesinfo.org (footer shows the content version).

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
