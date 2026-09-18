# AGENTS.md — 護眼學堂 / eyesinfo.org

Standing brief for any agent working in this repository.

## Source of truth

**Canonical source = this private GitHub repo** (`philosopherkk/eyesinfo`).

There is **no** requirement for a local Mac folder. Never treat chat history, a Grok preview, or a bot’s private disk as the project. Accepted site changes belong in files here, committed on a branch, reviewed via PR.

## Autonomy L1

Plan → show file list / diff → **wait**.

- Never treat chat as the site.
- No silent file writes.
- No deploy.
- No site emails.

## Three habits after any accepted site change

### 1) CANONICAL REPO

- Write or overwrite files **only** in this repository.
- List every file touched.
- Do not treat chat pastebacks, previews, or side copies as the live project.

### 2) GIT

After accepted writes:

1. `git status`
2. Stage **those** files
3. Commit on a **`feat/*` or `chore/*`** branch (never on `main`)

Release commit message form: `vX.YZ — short description`.

**Never:**

- Commit on `main` — KK merges to `main`
- Force-push or amend published history
- Push `main`
- `vercel --prod` from chat (unless KK typed **“prod deploy”** in that message)
- Touch DNS / Cloudflare orange-cloud / Pages

PRs are the normal path.

### 3) DEPLOY PATH (git → preview → merge)

Deploy path for **eyesinfo.org**:

- GitHub repo **philosopherkk/eyesinfo** is what **Vercel builds** (Vite React app — **not** static-HTML-only folklore).
- Production domain **eyesinfo.org** tracks branch **`main` only**.
- A content edit: commit on a **`feat/*` or `chore/*` branch** → push → **Vercel Preview URL** → KK reads **繁體** on the preview → KK says **merge** → production.
- **Never** deploy from a Bot’s cloud disk copy. Only from **this repo’s git remote**.
- After KK merges: open https://eyesinfo.org and confirm **網站版本** and **最近覆核** match `origin/main`. If not, say so. Do not “fix live” by editing in the Vercel dashboard.
- **Preview** for medical copy; **production** for releases.
- One page, one branch (e.g. `feat/t-d1-…`) when practical.
- **CHANGELOG.md** entries come from **git**, not from chat.

**Allowed without extra ceremony** after KK approved the file edits: write files, commit, push a **feature/chore branch**, paste Preview URL and wait.

**Still needs KK yes that turn:** merge to `main`, `vercel --prod` / prod deploy, DNS / domain / env / token, deleting deployments, making repo public.

## Secrets

- Never commit `.env`, tokens, or keys.
- If secrets are found in the tree: **stop** and report the **path only** (do not paste values).

## Cloudflare

DNS **grey-cloud only**. Do not orange-cloud or use Cloudflare Pages for this site.

## Hard rules

- **繁體中文 is canonical.** 简 / EN / 日 are translations — never overwrite 繁 with a translation.
- Keep **不能代替註冊醫生**.
- No 診斷 / 處方 / 預約 / 購買 / 轉介.
- Keep the 急症 / 999 banner.
- Literature numbers = study results / relative risk, **not** personal prognosis.
- Bump **最近覆核** on content edits.
- Bump **網站版本** (`CONTENT_VERSION` in `src/lib/site.ts`) **only** when KK says this is a release.
- Medical copy: **draft and wait** — KK approves 繁 before file writes.

## Publish gates

- **EyesInfo** lands publish only after KK **Proceed**.
- **Evidence / Cap**: **KEEP** after live.
