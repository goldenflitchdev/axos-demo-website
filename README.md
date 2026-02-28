# Axos Demo Website

Static site for the Goldenflitch Axos demo plan. Built from Markdown in `Axos-Demo-Plan/`; output is a single `index.html`.

## Local development

```bash
npm install
npm run build    # → index.html
npm run serve    # build + serve on http://localhost:3847
```

## Deployment (Vercel)

The repo is set up for Vercel: `vercel.json` defines the build and output.

### One-time: enable automatic deployments

1. Go to [vercel.com](https://vercel.com) and sign in.
2. **Add New** → **Project**.
3. **Import Git Repository** → select **goldenflitchdev/axos-demo-website** (or connect GitHub if needed).
4. Leave **Root Directory** as the repo root. Build Command and Output Directory are read from `vercel.json`.
5. Click **Deploy**.

After this, **every push to `main`** will trigger a new Vercel deployment automatically.

### Workflow: push code and deploy

```bash
git add .
git commit -m "Your message"
git push origin main
```

Once the repo is connected in Vercel, pushing to `main` deploys the site automatically; no extra steps.
