# Build Resolution Report: O2Switch Deployment

This document summarizes the technical challenges encountered and the solutions implemented to successfully build and deploy the Alexis Vuadelle Portfolio and Payload CMS to the O2Switch shared hosting environment.

## 1. The Problems Encountered

### 🛑 Turbopack Symlink Block
**Error:** `Symlink points out of the filesystem root`  
**Cause:** Next.js 16 defaults to the new "Turbopack" compiler, which has strict security rules. It was blocking access to the O2Switch `nodevenv` directory because it was located outside the project folder.

### 🛑 Process Limit Crashes
**Error:** `spawn EAGAIN`  
**Cause:** O2Switch (like most shared hosts) limits the number of concurrent processes. Next.js was attempting to spawn **9 worker threads** simultaneously to speed up the build, which exceeded the server's allowed limit.

### 🛑 React Version Duplication
**Error:** `TypeError: Cannot read properties of null (reading 'useContext')`  
**Cause:** In your npm workspace, multiple copies of React 19 were accidentally installed in different subdirectories. Next.js "lost" its context during build because it was seeing two different versions of the React engine.

### 🛑 Legacy Prerendering Bug
**Error:** `<Html> should not be imported outside of pages/_document`  
**Cause:** A known issue in Next.js 15 where it attempts to generate a legacy "Pages Router" 404 page if specific environment conditions are met, even when using the modern App Router.

---

## 2. The Final Solutions

### ✅ Webpack & Stable Next.js 15
We moved the project from the experimental Next.js 16 back to the stable **Next.js 15.4.11**. We also ensured the standard **Webpack** engine is used, which handles symlinked environments correctly.

### ✅ React Singularity (Overrides)
We added a rule to the **root `package.json`** to force every package in the workspace to use the exact same version of React:
```json
"overrides": {
  "react": "19.2.4",
  "react-dom": "19.2.4"
}
```

### ✅ Experimental Build Throttles
To prevent the server from blocking the build, we limited Next.js to a single CPU core and disabled multi-threaded worker pools in `next.config.ts`:
```typescript
experimental: {
  workerThreads: false,
  cpus: 1,
}
```

### ✅ The "Silver Bullet": Compile-Only Mode
The definitive fix was adding the `--experimental-build-mode compile` flag to the build script. This instructs Next.js to:
1.  **Compile** the code perfectly.
2.  **Skip Prerendering**: It skips the "simulated visit" to every page during the build, which avoids the resource spikes and the legacy bugs.
3.  **Use SSR**: Your pages are now rendered on the fly (Server-Side Rendering), ensuring they always have the latest data from your CMS.

---

## 3. Maintenance Tips
- **Always build inside the CMS folder**: `cd cms && npm run build`.
- **Clean start**: If you ever see weird errors again, run `rm -rf .next` before building.
- **Restarting**: After every successful build, run `touch tmp/restart.txt` to tell O2Switch to reload the site.
