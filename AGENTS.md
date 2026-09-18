# AGENTS.md — 護眼學堂 / eyesinfo.org

Standing brief for any agent working in this repository.

## Source of truth

**This git repo** (`philosopherkk/eyesinfo`) is the only source of truth.

Never treat chat history, a Grok preview, or a bot’s private disk as the project. Accepted site changes belong in files here, committed on a branch, reviewed via PR.

## Three habits after any accepted site change

### 1) CANONICAL REPO

- Write or overwrite files **only** in this repository.
- List every file touched.
- Do not treat chat pastebacks, previews, or side copies as the live project.

### 2) GIT

After accepted writes:

1. `git status`
2. Stage **those** files
3. Commit

Release commit message form: `vX.YZ — short description`.

**Never** push, force-push, amend published history, or rewrite `main` without explicit KK yes. PRs are the normal path.

### 3) DEPLOY PATH (git → preview → merge)

Deploy path for **eyesinfo.org**:

- GitHub repo **philosopherkk/eyesinfo** is what **Vercel builds** (Vite React app — **not** static-HTML-only folklore).
- Production domain **eyesinfo.org** tracks branch **`main` only**.
- A content edit: commit on a **feature branch** → push → **Vercel Preview URL** → KK reads **繁體** on the preview → KK says **merge** → production.
- **Never** `vercel --prod` from chat unless KK typed **“prod deploy”** in that message.
- **Never** deploy from a Bot’s cloud disk copy. Only from **this repo’s git remote**.
- After production: open https://eyesinfo.org and confirm **網站版本** and **最近覆核** match the commit. If not, say so. Do not “fix live” by editing in the Vercel dashboard.
- **Preview** for medical copy; **production** for releases.
- One page, one branch (e.g. `feat/t-d1-…`) when practical.

**Allowed without extra ceremony** after KK approved the file edits: write files, commit, push a **feature branch**, paste Preview URL and wait.

**Still needs KK yes that turn:** merge to `main`, `vercel --prod` / prod deploy, DNS / domain / env / token, deleting deployments, making repo public.

## Hard rules

- **繁體中文 is canonical.** 简 / EN / 日 are translations — never overwrite 繁 with a translation.
- Keep **不能代替註冊醫生**.
- No 診斷 / 處方 / 預約 / 購買 / 轉介.
- Keep the 急症 / 999 banner.
- Literature numbers = study results / relative risk, **not** personal prognosis.
- Bump **最近覆核** on content edits.
- Bump **網站版本** (`CONTENT_VERSION` in `src/lib/site.ts`) **only** when KK says this is a release.
- Medical copy: **draft and wait** — KK approves 繁 before file writes.

## Autonomy L1

Plan → show file list / diff → **wait**.

- No silent file writes.
- No deploy.
- No site emails.

## Publish gates

- **EyesInfo** lands publish only after KK **Proceed**.
- **Evidence / Cap**: **KEEP** after live.
