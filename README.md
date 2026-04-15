# Alexis Vuadelle's Portfolio Repository 🚀

This repository contains the source code for a dynamic, high-performance portfolio built with **Astro**, **Tailwind CSS**, and **Payload CMS**. 

The project is structured as a Bun Workspace containing two separate applications that communicate together.

## 📁 Repository Structure

- `frontend/` - The visual Astro website using Tailwind CSS for premium responsive design.
- `cms/` - The headless Payload CMS backend running on Next.js, powered by a local SQLite database that stores your projects and profile details.

---

## 🛠️ Getting Started: How to View the Site Locally

To run the full stack locally, you need to start **both** applications in development mode simultaneously.

### Step 1: Install Dependencies
If you have just cloned the repository, ensure all dependencies across both the CMS and the frontend are installed exactly as configured by the lockfile:
```bash
# In the root directory of the repository
bun install
```

### Step 2: Start the Payload CMS Backend

The CMS is the ultimate source of truth for your data. You must start it so the frontend has data to fetch.
Open a terminal and run:

```bash
cd cms
bun run dev
```

The CMS should start on **`http://localhost:3000`**. 

> **Important Setup Step**: The very first time you start the CMS, head to `http://localhost:3000/admin`. You will be prompted to create an Admin account. Once in, make sure to add content to your `Profile` fields and add your first `Projects` so the frontend has something to display!

### Step 3: Start the Astro Frontend

Now, open a **brand new Terminal window**, navigate into the frontend, and run the Astro server:

```bash
cd frontend
bun run dev
```

The website should start on **`http://localhost:4321`**.

You can now view your live portfolio! The frontend will automatically pull data from your Payload backend. Changing something inside the CMS and refreshing the frontend will show the changes instantly.

---

## Technical Details

- **Database**: SQLite (The database file `payload.db` lives locally inside `/cms/payload.db` and can be easily managed).
- **CSS**: Tailwind CSS v4 is used entirely via utility classes in `.astro` components.
- **Node Environment**: Bun is required as the package manager and runtime. Ensure Bun is installed (`bun -v`) to run the stack properly.
