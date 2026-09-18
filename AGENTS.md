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

### 3) DEPLOY FROM REPO

- Production = **Vercel** for https://eyesinfo.org from **this repo’s HEAD** after KK says “deploy”.
- Never upload from chat, a preview build, or a second working copy.
- Show the deploy plan first.
- After deploy: check the homepage **最近覆核** date and **網站版本** match the commit that was deployed.

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
