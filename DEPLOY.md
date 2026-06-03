# Deploying — GitHub + Vercel

Share two live links with the team:

- **Prototype** (Next.js app) → a Vercel project
- **Storybook** (component library) → a second Vercel project, same repo

Both auto-redeploy on every `git push`.

---

## 1. Push the code to GitHub

The repo is already committed locally. Authenticate the GitHub CLI once, then create
+ push in one command:

```bash
cd lms-prototype
gh auth login          # choose: GitHub.com → HTTPS → Login with a web browser
gh repo create skillup-lms-prototype --public --source=. --remote=origin --push
```

That creates `github.com/<you>/skillup-lms-prototype` and pushes `main`.

> Prefer the web UI? Create an empty repo at github.com/new (no README), then:
> ```bash
> git remote add origin https://github.com/<you>/skillup-lms-prototype.git
> git push -u origin main
> ```

---

## 2. Deploy the prototype to Vercel

1. Go to **vercel.com → Add New… → Project** and **Import** the GitHub repo.
2. Vercel auto-detects **Next.js** + **pnpm** — leave everything default.
3. Click **Deploy**. ~1 min later you get a URL like `https://skillup-lms-prototype.vercel.app`.

`/` redirects to the active video lesson, so the URL opens straight into the player.

---

## 3. Deploy Storybook to Vercel (second project)

Create a **second** Vercel project from the **same repo** with a Storybook build:

1. **Add New… → Project → Import** the same repo again.
2. Give it a distinct name, e.g. `skillup-lms-storybook`.
3. Override these settings:
   - **Framework Preset:** `Other`
   - **Build Command:** `pnpm build-storybook`
   - **Output Directory:** `storybook-static`
   - **Install Command:** leave default (`pnpm install`)
4. **Deploy** → URL like `https://skillup-lms-storybook.vercel.app`.

---

## Notes

- **pnpm version** is pinned via `"packageManager": "pnpm@11.5.1"` in `package.json`, so
  Vercel builds match local exactly. `pnpm-workspace.yaml` pre-approves the `esbuild` /
  `sharp` build scripts, so installs run clean.
- **Auto-deploy:** every push to `main` redeploys both projects; PRs get preview URLs.
- **Env vars:** none required — all data is mock (`lib/data-model.json`).
- **Custom domains** can be added per project in Vercel → Settings → Domains.

## Live links (deployed)

| Link | What |
|------|------|
| **https://lms-prototype-mu.vercel.app** | The interactive Video lesson prototype |
| **https://storybook-static-roan-psi.vercel.app** | The component library / design-system docs (159 stories) |

Both are **public** (no login needed) and live on Vercel.

## Notes on the Vercel build

- `vercel.json` sets `installCommand: "pnpm install --ignore-scripts"`. Vercel's pnpm
  treats un-approved dependency build scripts (esbuild, sharp, …) as a hard error in CI;
  those native builds aren't needed for `next build`, so we skip them. This is the
  reliable cross-environment fix.

## Redeploying

```bash
# prototype (from repo root)
vercel --prod --yes

# storybook (build locally, deploy the static output)
pnpm build-storybook
cd storybook-static && vercel --prod --yes
```

To get **auto-deploy on every `git push`**, connect the GitHub repo in each Vercel
project → Settings → Git (optional; the CLI deploys above are immediate either way).
