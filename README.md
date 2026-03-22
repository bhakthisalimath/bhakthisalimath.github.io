# Bhakthi Salimath — Portfolio

A modern, responsive personal portfolio and project showcase built with **Next.js**, **React**, and **TypeScript**. Designed to present my background, education, and technical projects to recruiters and hiring managers as part of graduate-role applications.

**Live site:** [bhakthisalimath.github.io](https://bhakthisalimath.github.io) *(or your custom domain once configured)*

---

## Overview

This repository is the source for my personal portfolio site. It highlights:

- **Who I am** — Final-year Bachelor of Advanced Computing student at the University of Sydney, majoring in Computer Science
- **What I build** — Intelligent systems, data-driven applications, and projects in algorithms, OOP, and software engineering
- **How to reach me** — GitHub, LinkedIn, and email

The site is built as a **static export** (no server at runtime), so it runs fast and deploys easily to **GitHub Pages** or any static host.

---

## Tech Stack

| Category        | Technologies |
|----------------|--------------|
| **Framework**  | [Next.js 16](https://nextjs.org) (App Router) |
| **UI**         | [React 19](https://react.dev), [TypeScript](https://www.typescriptlang.org) |
| **Styling**    | [Tailwind CSS 4](https://tailwindcss.com), CSS custom properties (theme) |
| **3D / Effects** | [Three.js](https://threejs.org), [React Three Fiber](https://docs.pmnd.rs/react-three-fiber), [@whatisjery/react-fluid-distortion](https://www.npmjs.com/package/@whatisjery/react-fluid-distortion) (cursor effect) |
| **Deployment** | Static export → [GitHub Pages](https://pages.github.com) (or Vercel/Netlify) |

- **Next.js** — App Router, static `output: "export"`, and optimised font loading
- **TypeScript** — End-to-end type safety across app, data, and components
- **Tailwind 4** — Utility-first CSS with a custom design system (light/dark theme variables)
- **React Three Fiber** — Used on the Projects page for interactive 3D scatter/timeline views

---

## Features

- **Theme toggle** — Light and dark mode with system-preference detection and `localStorage` persistence
- **Hero section** — Greeting, current role, location, and quick links (GitHub, LinkedIn, Email)
- **About** — Short bio, tech stack, and quick facts; dedicated `/about` page with the same design system
- **Education** — Timeline of degree and coursework (e.g. data structures, algorithms, software engineering)
- **Projects** — Four featured projects with:
  - **Scatter view** — 3D interactive layout of project cards
  - **Timeline view** — Chronological list with expandable details
  - Links to GitHub repos (Checkers, Student BST, BitStateManager, MovieStore)
- **Contact** — Section and/or link for getting in touch
- **Fluid cursor** — Optional pointer-follow distortion effect (desktop)
- **Responsive layout** — Single-column, card-based layout that works across screen sizes
- **Accessibility** — Semantic HTML, ARIA where needed, keyboard-friendly nav, reduced motion respected

---

## Project Structure

```
├── .github/workflows/     # GitHub Actions: build + deploy to GitHub Pages
├── public/
│   ├── avatar/            # Profile images, logo (e.g. logo.png, me.jpg)
│   └── icons/             # SVG icons (home, github, linkedin, email)
├── src/
│   ├── app/
│   │   ├── about/page.tsx # About me page
│   │   ├── projects/      # Projects page (scatter + timeline)
│   │   ├── page.tsx       # Home page
│   │   ├── layout.tsx     # Root layout, theme script, Navbar
│   │   └── providers.tsx # Theme provider
│   ├── components/
│   │   ├── Navbar.tsx     # Top nav: theme toggle, Home, logo, Projects, About, Contact
│   │   ├── FluidCursor.tsx
│   │   ├── ProjectCard.tsx
│   │   └── projects/     # ScatterView, TimelineView, useProjectScale
│   ├── context/
│   │   └── ThemeContext.tsx
│   ├── data/
│   │   ├── about.ts       # About page copy
│   │   ├── home.ts        # Hero, about, education, featured projects copy
│   │   └── projects.ts    # Project list and metadata
│   └── styles/
│       ├── globals.css    # Theme variables, Tailwind, imports
│       ├── pages/         # home, about, projects, contact, main layout
│       └── components/    # navbar, projectCard
├── next.config.ts        # output: "export", images: unoptimized
├── package.json
└── README.md
```

- **Content** is centralised in `src/data/` (e.g. `home.ts`, `about.ts`, `projects.ts`) so copy and project entries can be updated without touching layout code.
- **Theme** is driven by CSS variables in `globals.css` and `ThemeContext`; the navbar includes a light/dark toggle.

---

## Getting Started

### Prerequisites

- **Node.js** 18+ (e.g. 20 or 22)
- **npm** (or yarn/pnpm/bun)

### Install and run locally

```bash
# Clone the repository
git clone https://github.com/bhakthisalimath/bhakthisalimath.github.io.git
cd bhakthisalimath.github.io

# Install dependencies
npm install

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser. The dev server supports hot reload.

### Build for production (static export)

```bash
npm run build
```

This generates a static site in the `out/` directory. You can serve it with any static host:

```bash
npx serve out
# or
npm run start   # runs next start (for non-export mode; with export, use a static server for out/)
```

For **static export**, the project is configured with `output: "export"` in `next.config.ts`, so `next build` writes to `out/`. The GitHub Actions workflow uses this artifact to deploy to GitHub Pages.

---

## Deployment (GitHub Pages)

The repo uses **GitHub Actions** to build and deploy on every push to `main`:

1. **Workflow:** `.github/workflows/nextjs.yml`
2. **Build:** `npm ci` → `npm run build` → upload `out/` as the GitHub Pages artifact
3. **Deploy:** GitHub Pages deploys from that artifact

To use it:

- Ensure the repository name is `bhakthisalimath.github.io` (or your username/org) for the default GitHub Pages URL.
- In the repo: **Settings → Pages → Build and deployment**: Source = **GitHub Actions**.
- Push to `main`; the workflow will build and deploy the site.

The live site will be at `https://bhakthisalimath.github.io` (or your custom domain if set in Pages settings).

---

## Customisation

- **Copy and links** — Edit `src/data/home.ts`, `src/data/about.ts`, and `src/data/projects.ts` for all text, social links, and project entries.
- **Theme colours** — Adjust CSS variables in `src/styles/globals.css` (e.g. `--accent`, `--bg`, `--text`) for light and dark themes.
- **Navbar** — Update logo, home icon, and nav items in `src/components/Navbar.tsx`.
- **Projects** — Add or remove projects in `src/data/projects.ts`; ensure each has `id`, `name`, `link`, and optionally `accent` for card colour.

---

## Content Cheat Sheet (Projects, Featured, LinkedIn)

### 1. Add a new project

**Where:** `src/data/projects.ts`

1. **Create the project entry**
   - Add a new object to the exported `projects: Project[] = [ ... ]` array.
   - Required fields:
     - `id`: short, URL-safe id (e.g. `"bitesavr"`, `"clueless-wardrobe"`).
     - `name`: full project title.
     - `role`: e.g. `"Solo Developer"` or `"Hackathon Project (Contributor)"`.
     - `period`: e.g. `"Sep 2025"` or `"Mar 2024 – Apr 2024"`.
     - `techStack`: string array of key technologies.
     - `shortDescription`: 1–2 sentence summary.
     - `highlights`: list of bullet-point strings.
   - Recommended optional fields:
     - `link`: GitHub or live demo URL.
     - `bookmarkLabel`: short label used in project UIs and sorting.
     - `accent`: hex colour for that project (card accent).
     - `mediaType`, `mediaLabel`: for the detail view.

2. **Hackathon-specific fields (for event info button and gold styling)**
   - Make sure `role` contains the word **"Hackathon"** somewhere, e.g.:
     - `"Hackathon Project (Contributor)"` or `"Hackathon Project (Team)"`.
     - This automatically enables the **gold hackathon styling** on the `/projects` gallery cards.
   - Add the event link and label so the detail view shows a button:
     - `hackathonEventUrl`: URL to Devpost / event / challenge page.
     - `hackathonEventLabel`: button text, e.g. `"Devpost — full submission & try-it info"`.

3. **Optional: YouTube demo**
   - Easiest: add a mapping to `src/data/projectYoutubeDemos.ts`:
     - Key: the project’s `id`.
     - Value: a full YouTube URL or video id.
   - Or: set `demoYoutubeUrl` directly on the project entry.
   - **Two videos** (e.g. elevator pitch + product demo): set `demoYoutubeUrl` to the **product** video and `demoYoutubeSecondaryUrl` to the **elevator pitch** (or swap labels in the UI by which URL you put in each field). The `/projects` detail view shows tabs for both.

4. **Optional: image gallery for the project detail page**
   - Place images under `public/projects/<project-id>/` named `image1.jpeg`, `image2.jpeg`, etc.
   - Run:
     - `npm run sync:project-assets`
   - This updates `src/data/projectGalleries.auto.json` so the `/projects` detail page can show those images.

5. **Verify**
   - Run `npm run dev` and open:
     - `/projects` to see the project in scatter/timeline.
     - `/projects?selected=<project-id>&expanded=1` to jump straight to it.

### 2. Change featured projects on the home screen

**Where:** `src/data/home.ts`

1. Under `homeCopy.featuredProjects` update:

   ```ts
   featuredProjects: {
     title: "Featured Projects",
     subtitle: "...",
     cta: "View all projects",
     projectIds: ["bitesavr", "clueless-wardrobe", "bytelove-syncs"],
   },
   ```

2. Replace `projectIds` with the `id`s from `src/data/projects.ts` that you want featured, in order:
   - Example:

   ```ts
   projectIds: ["checkers-java", "inkball", "holiday-planner"],
   ```

3. Thumbnails:
   - If a project has `public/projects/<id>/image1.jpeg` (and you’ve run `npm run sync:project-assets`), the home cards will automatically show that as a small preview image.
   - If no `image1` exists for that id, the card still renders, just without a thumbnail.

### 3. Change featured LinkedIn posts on the home screen

**Where:** `src/data/home.ts`

1. In `home.ts`, update the `linkedin.posts` array:

   ```ts
   linkedin: {
     title: "From LinkedIn",
     subtitle: "...",
     /** Update these to feature different embedded posts on the home page. */
     posts: [
       {
         title: "My LinkedIn post title",
         href: "https://www.linkedin.com/feed/update/urn:li:ugcPost:XXXXXXXXXXXX",
         tag: "Optional tag text",
       },
       // add/remove/reorder posts here
     ],
   },
   ```

   - Get `href` by copying the **post URL** from LinkedIn (`.../feed/update/urn:li:ugcPost:...`).
   - `title` is used for iframe `title` (accessibility) and for your own reference.
   - `tag` is metadata only (safe to change; not required).

2. The LinkedIn section on the home page automatically embeds posts by mapping over `content.linkedin.posts` and converting each `href` into an embed URL, so **no React code changes** are needed when you update this list.

3. To feature different posts, just:
   - Replace the objects in `posts` with new `title` + `href` values.
   - Reorder them to change display order.

---

## Author & Contact

**Bhakthi Salimath**  
Bachelor of Advanced Computing (Computer Science), University of Sydney (expected 2026)

- **GitHub:** [bhakthisalimath](https://github.com/bhakthisalimath)
- **LinkedIn:** [bhakthisalimath](https://www.linkedin.com/in/bhakthisalimath/)
- **Email:** bhakthisalimath@gmail.com

---

## License

This project is for personal/portfolio use. You may reuse the code structure for your own portfolio; please do not copy the content (bio, projects, images) without permission.
