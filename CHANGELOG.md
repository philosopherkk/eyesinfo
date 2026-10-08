# CHANGELOG — 護眼學堂 / eyesinfo.org

Git-sourced history for this site. Entries follow commits on `main`, not chat notes.

## [1.85] — 2026-10-08

- **Summary:** (1) `/tools/tunnel` 街景圖 `public/iol/street.jpg` 改用 Wikimedia Commons CC0 相片（來源、作者、授權與取得日期見 `public/iol/CREDITS.md`），取代來源不明的舊圖。(2) 青光眼專題「2. 正常眼壓性青光眼」CNTGS 句改為：剔除白內障影響後再降約三成眼壓的一組惡化較少；意向治療分析未見顯著分別；不少未治療者亦未見惡化；是否積極降壓由醫生個別評估（繁／EN／JA）。`cntgs1998a`（PMID 9780093）備註第二句同步改為意向治療分析未見顯著分別、剔除白內障影響後差異才出現（並補 EN／JA）。目標眼壓段落未改。(3) 未知 `/tools/*` 路徑（包括 `/tools/report`、`/tools/referral`）改為真正 HTTP 404，不再回傳空殼 200；不設任何導向。(4) sitemap `/t/d4`、`/tools/tunnel` lastmod 更新。`CONTENT_VERSION` → **1.85**；網站最近覆核不變。
- **Files:** `public/iol/street.jpg`, `public/iol/CREDITS.md`, `src/data/{topics,citations}.ts`, `src/i18n/{topics-en,topics-ja}.ts`, `src/routes/tools.$toolId.tsx`, `public/sitemap.xml`, `public/sitemap-lastmod.json`, `scripts/generate-sitemap.mjs`, `scripts/topic-structure-polish.test.mjs`, `src/lib/site.ts`, `CHANGELOG.md`

## [1.84] — 2026-10-08

- **Summary:** `/tools/tunnel` 改為互動式青光眼視野示意（輕度／中度／重度／末期、弓形／鼻側階梯／周邊收窄三種形態、「模擬示意」標籤、兩眼補償說明、折疊式眼壓研究群體數字）；`/iol` 與 `/tools/tunnel` 共用街景圖 `street.jpg` 內可辨認的商舖招牌已模糊處理；sitemap 的 `/tools/tunnel`、`/iol` lastmod 更新。`CONTENT_VERSION` → **1.84**；網站最近覆核不變。
- **Files:** `src/components/glaucoma-field-sim.tsx`, `src/lib/glaucoma-field.ts`, `src/lib/glaucoma-field.test.ts`, `src/i18n/glaucoma-field-sim-text.ts`, `src/data/{citations,tools,search-index,seo-descriptions}.ts`, `src/i18n/catalog.ts`, `src/components/tool-demos.tsx`, `src/routes/tools.$toolId.tsx`, `public/iol/street.jpg`, `public/sitemap.xml`, `public/sitemap-lastmod.json`, `scripts/generate-sitemap.mjs`, `scripts/topic-structure-polish.test.mjs`, `src/lib/site.ts`, `package.json`, `CHANGELOG.md`

## [1.83] — 2026-10-08

- **Summary:** 三個空殼專題路徑（`/t/parent-gaps`、`/t/water-acanthamoeba`、`/t/ok-hygiene`）永久導向母專題錨點；sitemap 改為依 git 內容最後變更日寫入 per-URL lastmod。`CONTENT_VERSION` → **1.83**；網站最近覆核不變。
- **Files:** `vercel.json`, `src/routes/t.$topicId.tsx`, `src/data/seo-descriptions.ts`, `public/sitemap.xml`, `public/sitemap-lastmod.json`, `scripts/generate-sitemap.mjs`, `scripts/{seo-static,topic-structure-polish}.test.mjs`, `src/lib/site.ts`, `RELEASE.md`, `package.json`, `CHANGELOG.md`

## [1.82] — 2026-10-07

- **Summary:** SEO canonical/hreflang alignment — self-referencing canonical + `og:url` per locale (`?lang=` for non-TC deep routes; locale homes `/` `/en` `/zh-Hans` `/ja`); `vercel.json` `trailingSlash: false` so trailing-slash redirects are permanent (308); sitemap locs stay final www 200 URLs with `xhtml:link` hreflang alternates (no `?lang=` as separate locs). `CONTENT_VERSION` → **1.82**; review stamp unchanged.
- **Files:** `src/lib/page-seo.ts`, `src/lib/page-seo.test.ts`, `src/lib/site.ts`, `src/components/{medical-webpage-jsonld,breadcrumbs}.tsx`, `vercel.json`, `public/sitemap.xml`, `scripts/seo-static.test.mjs`, `package.json`, `CHANGELOG.md`

## fix — 1.80 polish (site-level review stamp, grok leftovers, export warning, chalazion wording)

- **Summary:** (1) Review stamp is now explicitly site-level: TC 「網站最近覆核：2026年10月6日 · 潘家健醫生」, EN "Site last reviewed: 6 October 2026 · Dr Poon Ka Kin", JA 「サイト最終確認：2026年10月6日 · 潘家健医師」 (SC auto-converts) on home, shell footer, `EditorialFooter` and `/legal`; EN/JA date now derived from `EDITORIAL.reviewedIso` (was a stale hard-coded 24 Sep); pages no longer pass a per-page date, and `MedicalWebPage` JSON-LD drops per-page `lastReviewed`. (2) Removed the injected `https://grok.com/grok-app-builder/extensions.js` script (PWA head injector) and `https://auth.grok.me` from every CSP `connect-src` in `vercel.json`. (3) IOL Optics Studio JSON export `warning` now carries the on-page teaching-model warning in TC first, then EN / JA (HTML + TS port). (4) Chalazion: 「小型內側切口可不需縫合」 → 「結膜面小切口可不需縫合」 with matching EN. `CONTENT_VERSION` stays **1.80**.
- **Files:** `src/i18n/{ui,index}.ts`, `src/components/{editorial-footer,app-shell,home-page,medical-webpage-jsonld}.tsx`, `src/routes/{t.$topicId,c.$catId,iol,tools.$toolId,legal}.tsx`, `scripts/grok-pwa-shared.{mjs,d.mts}`, `scripts/grok-pwa-plugin.test.mjs`, `vercel.json`, `public/iol-optics-studio.html`, `src/lib/iol-optics-studio/optics.ts`, `public/procedures-3d.html`, `CHANGELOG.md`

## [1.80] — 2026-10-06

- **Summary:** Publish #95 mobile single-finger page scroll on 3D teaching canvases (mouse vs touch hints; release-capture cleanup; two-finger rotate); #94 IOL Optics Studio on `/iol-optics` (not-a-clinical-outcome warnings, 人工晶體/厘米 wording, routeTree typecheck, sync touch helper); #96 chalazion 3D lower-lid geometry and eversion (inferior tarsal border; lashes forward-down; 覆診). `CONTENT_VERSION` → **1.80**; `CONTENT_UPDATED` → **2026-10-06**.
- **Files:** `public/js/orbit-page-scroll.js`, `public/{eye-viewer,cataract-phaco,procedures-3d,iol-optics-studio}.html`, IOL optics studio routes/components/i18n/SEO, chalazion 3D scene + copy, `src/lib/site.ts`, `CHANGELOG.md`
- **Follow-up:** Site-wide 最近覆核 stamp (`EDITORIAL.reviewed` / `reviewedIso` / `DEFAULT_LAST_REVIEWED`) → **2026-10-06** so home/footer match the release (was still 2026-09-24).

## chore — procedure-day copy fixes (preview)

- **Summary:** On `feat/procedure-day-pages` — YAG title shortened to 後囊切開當日 with Nd:YAG kept in the lead; remove failure / IOL-exchange lines; toric as add-on in cataract lead and day-sequence (zh/en/ja); barrier spots not a ring; injection title scoped to anti-VEGF; same-day path uses `/urgent` sameDayH wording. `CONTENT_VERSION` unchanged.
- **Files:** `src/data/procedure-day-topics.ts`, `src/i18n/procedure-day-en.ts`, `src/i18n/procedure-day-ja.ts`, cross-link title strings in topics/tools/search/seo, `CHANGELOG.md`

## chore — IOL simulator hedges (preview)

- **Summary:** `/iol` follow-up on `feat/iol-simulator-2` — qualitative acuity / teaching-scale halo / coarse toric alignment; night overlay (halos, rings, no radial starburst); PMID-backed defocus-curve & dysphotopsia references with diffractive-vs-refractive attribution hedges; dominant-eye copy (Dolman both-eyes-open); night-driving distance cap line; 因設計而異 / by design. `CONTENT_VERSION` unchanged.
- **Files:** `src/routes/iol.tsx`, `src/components/iol-scene.tsx`, `src/components/halo-overlay.tsx`, `src/data/citations.ts`, `src/data/iol-references.ts`, `src/lib/iol-optics.ts`, `src/lib/iol-optics.test.ts`, `src/i18n/ui.ts`, `CHANGELOG.md`

## [1.78] — 2026-09-24

- **Summary:** `/urgent` only — clarified private-clinic vs A&E lead; added same-day private ophthalmologist call-ahead line under the same-day tier; updated `/urgent` meta (zh/en/ja; zh-Hans via toHans). No clinic names, phones, booking or WhatsApp. `CONTENT_VERSION` → **1.78**.
- **Files:** `src/i18n/ui.ts`, `src/data/seo-descriptions.ts`, `src/lib/site.ts`

## [1.77] — 2026-09-24

- **Summary:** SEO 1.77 — IndexNow key + post-Production workflow; fuller head-only meta descriptions (zh/en/ja; zh-Hans via toHans); MedicalWebPage JSON-LD on `/t/*` and `/c/*` (BreadcrumbList unchanged). `CONTENT_UPDATED` unchanged. Google verification HTML untouched.
- **Files:** `public/<indexnow-key>.txt`, `.github/workflows/indexnow.yml`, `vercel.json`, `src/data/seo-descriptions.ts`, `src/lib/seo-description.ts`, `src/components/medical-webpage-jsonld.tsx`, topic/category/tools/search routes, `docs/seo-descriptions-1.77.md`, `src/lib/site.ts`

## [1.76] — 2026-09-24

- **Summary:** New `/resources` further-reading page (GovHK, Student Health Service, HKOS Public Education, AAO EyeSmart, Cleveland Clinic Health Library); footer/sitemap/search wiring; `CONTENT_VERSION` → 1.76
- **Files:** `src/routes/resources.tsx`, `src/data/resources.ts`, `src/i18n/ui.ts`, `src/lib/site.ts`, `src/lib/site-search.ts`, `src/components/{app-shell,home-page,editorial-footer,breadcrumbs}.tsx`, `public/sitemap.xml`, `CHANGELOG.md`

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
