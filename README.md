# 護眼學堂 (eyesinfo.org)

Hong Kong public eye-education site. Not a clinic shopfront.

## Deploy on Vercel

1. Import this repository at https://vercel.com/new
2. Framework: Vite (auto-detected)
3. After the first deploy succeeds: Project → Settings → Domains → add `eyesinfo.org` and `www.eyesinfo.org`

Cloudflare DNS (already set):

- A `@` → `76.76.21.21` (DNS only)
- CNAME `www` → `cname.vercel-dns.com` (DNS only)
