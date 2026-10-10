# Publish Fit as its own public GitHub project + hub card

The Cloud Agent can only push to `philosopherkk/eyesinfo`. Creating
`philosopherkk/fit` and editing `philosopherkk.github.io` need a machine with
your GitHub credentials (or grant the Cursor GitHub App access to those repos).

## One-shot (recommended)

From this eyesinfo checkout (after this PR is on your machine or on `main`):

```bash
bash docs/hub-publish/fit/scripts/apply-fit-standalone.sh
```

That script:

1. Creates public `philosopherkk/fit` if missing
2. Pushes `main` from `docs/hub-publish/fit/app/`
3. Opens a hub PR on `philosopherkk.github.io` with the Fit card (links to
   https://fit-llm.vercel.app and https://github.com/philosopherkk/fit)

## Link Vercel (after `main` exists)

In the Vercel dashboard for project **fit-llm** (team eyesinfo):

1. Settings → Git → Connect Git Repository → `philosopherkk/fit`
2. Production branch: `main`
3. Keep alias https://fit-llm.vercel.app

Or with CLI (on a machine logged into Vercel):

```bash
cd /path/to/fit
vercel link --yes --project fit-llm --scope eyesinfo
vercel git connect https://github.com/philosopherkk/fit
```

## After hub merge

Open https://philosopherkk.github.io/ and confirm card **10 · Fit**.
Live app stays at https://fit-llm.vercel.app (not on github.io).
