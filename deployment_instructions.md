# Deployment Instructions — CRITICAL

## The Root Cause of ALL CSS Issues

The Astro build process **hardcodes absolute file paths** into the manifest at build time.
When you build on **Windows** (your local machine), the built files contain paths like:
```
file:///E:/Program%20Files/git/Alexis-vuadelle-potfolio/frontend/dist/client/
```

When the server (Linux) tries to serve CSS from that Windows path, it obviously fails.

> [!CAUTION]
> **You MUST build on the O2Switch server, NOT on your Windows machine.**
> Never run `npm run build` locally and push the `dist/` folder.

---

## Step-by-Step Deployment

### 1. Commit & Push (from your Windows machine)
```bash
git add -A
git commit -m "fix: standalone mode + correct build scripts"
git push
```

### 2. Deploy Frontend (from O2Switch SSH terminal)
```bash
cd ~/repositories/Alexis-vuadelle-portfolio

# Pull the latest changes
git pull

# Go to frontend
cd frontend

# Clean EVERYTHING
rm -rf dist .astro node_modules/.vite

# Build on the server (this creates Linux paths in the manifest)
npm run build

# Restart Passenger
touch tmp/restart.txt
```

### 3. Deploy CMS (from O2Switch SSH terminal)
```bash
cd ~/repositories/Alexis-vuadelle-portfolio/cms

# Clean previous builds
rm -rf .next

# Build on the server (full build, no --compile flag)
npm run build

# Restart Passenger
touch tmp/restart.txt
```

### 4. Verify
- Visit https://alexis-vuadelle.com/ — should have full CSS styling
- Visit https://cms.alexis-vuadelle.com/ — should show Payload admin login

---

## What Changed

| File | Change | Why |
|------|--------|-----|
| `frontend/astro.config.mjs` | `mode: 'standalone'` | Standalone handler serves both pages AND static assets |
| `frontend/server.js` | Uses `http.createServer` with Astro handler | No Express needed; standalone handler does everything |
| `frontend/package.json` | Removed Express, cleaned build script | Simplified dependencies |
| `cms/package.json` | Removed `--experimental-build-mode compile` | That flag produces incomplete builds missing build-id |
| `cms/package.json` | Removed `--no-wasm-memory-reservation` | Not allowed in NODE_OPTIONS on Node 22 |
| `cms/server.js` | Removed wasm flag injection | Same reason |

## .gitignore Reminder
Make sure `dist/` and `.next/` are in `.gitignore` — these should never be committed.
