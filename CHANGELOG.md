# CHANGELOG — 護眼學堂 / eyesinfo.org

Git-sourced history for this site. Entries follow commits on `main`, not chat notes.


## feat — IOL education on published v1.77 `/iol` (preview)

- **Summary:** Branch from **`09d93a7` / CONTENT_VERSION 1.77** (pre–simulator-2 `/iol`). Expandable education: dry eye & visual quality, dominant (主力) eye, monovision, MFIOL/EDOF photic phenomena; Miles / Dolman fold-out. No change to 1.77 optics model or site version string.
- **Files:** `src/routes/iol.tsx`, `src/i18n/ui.ts`, `CHANGELOG.md`

## [1.77] — 2026-09-24

- **Summary:** SEO 1.77 — IndexNow key + post-Production workflow; fuller head-only meta descriptions (zh/en/ja; zh-Hans via toHans); MedicalWebPage JSON-LD on `/t/*` and `/c/*` (BreadcrumbList unchanged). `CONTENT_UPDATED` unchanged. Google verification HTML untouched.
- **Files:** `public/<indexnow-key>.txt`, `.github/workflows/indexnow.yml`, `vercel.json`, `src/data/seo-descriptions.ts`, `src/lib/seo-description.ts`, `src/components/medical-webpage-jsonld.tsx`, topic/category/tools/search routes, `docs/seo-descriptions-1.77.md`, `src/lib/site.ts`

## [1.75] — 2026-09-24

- **Summary:** Corrections contact email → `hokusaivision@gmail.com` (all locales); purpose labels unchanged
- **Files:** `src/data/editorial.ts`, `src/i18n/{catalog,index,ui}.ts`, `src/lib/site.ts`

## chore — structure/UX polish (preview)

- Unknown `/c/{slug}` → HTTP 404 via `beforeLoad` (macula chooser kept)
- `/c/macula` on homepage category strip + `sitemap.xml`
- Locale-aware in-body `/legal` (and privacy/accessibility) + chrome `/urgent`
- 版面：adjacent 「手機版」｜「電腦版」｜「自動」 (no 3-state cycle)
- `CONTENT_VERSION` stays **1.72**

## [1.72] — 2026-09-18

- **Commit:** `d4e897b` (`d4e897ba059f2a88c3ae1f0d3f1ba990bd941161`)
- **Summary:** 公開就緒軟修（無障礙版本戳、隱形眼鏡書目連結、www SEO、安全標頭、Amsler 30cm）
- **Files:** soft polish via PR #65 (do not paste leaflet bodies)
