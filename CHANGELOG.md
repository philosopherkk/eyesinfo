# CHANGELOG — 護眼學堂 / eyesinfo.org

Git-sourced history for this site. Entries follow commits on `main`, not chat notes.

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
