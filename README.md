# Babak Mohammadi Profile Site

A premium multi-page static profile site for Babak Mohammadi, positioned as an automotive executive, operational strategist, process builder, and writer with hands-on dealership leadership depth.

## Current Repo Summary

The repository uses a simple static-file structure with:

- Multi-page HTML files in `src/`
- One shared stylesheet in `src/assets/css/main.css`
- One shared JavaScript file in `src/assets/js/main.js`
- JSON-driven content in `src/data/`
- Image assets in `src/assets/img/`

## Final File Tree

```text
.
├── README.md
└── src
    ├── index.html
    ├── about.html
    ├── experience.html
    ├── articles.html
    ├── article.html
    ├── projects.html
    ├── contact.html
    ├── assets
    │   ├── css
    │   │   └── main.css
    │   ├── img
    │   │   ├── babak-rosenthal-mohammadi.jpg   # add your final photo here
    │   │   └── headshot-placeholder.svg
    │   └── js
    │       └── main.js
    ├── content
    │   └── articles
    │       ├── operational-discipline-modern-dealerships
    │       │   └── article.html
    │       ├── crm-process-management-system
    │       │   └── article.html
    │       └── fixed-operations-workflow-design
    │           └── article.html
    └── data
        ├── profile.json
        ├── experience.json
        ├── articles.json
        └── projects.json
```

## Pages

- `src/index.html` — premium executive landing page with stronger hero hierarchy, summary flow, experience preview, project focus, and writing preview
- `src/about.html` — professional narrative, leadership themes, and principles
- `src/experience.html` — expanded executive-style career timeline
- `src/articles.html` — article platform index with category filtering and internal/external article links
- `src/article.html` — dedicated article reader that loads article content by slug
- `src/projects.html` — strategic project cards for systems, tools, and training work
- `src/contact.html` — refined professional CTA for outreach and opportunity discussions

## Content Model

Most repeated content is JSON-driven:

- `profile.json` stores name, headline, links, metrics, and about-page principles
- `experience.json` stores timeline entries
- `articles.json` stores article metadata, slugs, reading time, internal content paths, and external LinkedIn URLs
- `projects.json` stores project cards

This keeps the site easy to maintain while preserving a no-build, framework-free setup.

## Local Run Instructions

Because the site loads local JSON with `fetch`, serve the repository with a simple static server instead of opening the files directly from disk.

### Option 1: Python

```bash
cd /workspace/babak-profile-site
python3 -m http.server 8000
```

Then open:

```text
http://localhost:8000/src/
```

### Option 2: Any static server

Any static file server will work as long as it serves the repository root and allows browser access to `src/data/*.json`.

## Headshot Setup

To use a real homepage image:

1. Add your final portrait file at `src/assets/img/babak-rosenthal-mohammadi.jpg`
2. Commit and push that file to GitHub
3. Redeploy Cloudflare Pages if it does not auto-deploy

The homepage now uses a real `<img>` tag and automatically falls back to `src/assets/img/headshot-placeholder.svg` if the `.jpg` file is missing.

## Cloudflare Pages Notes

- Use **no build command**
- Set the **output directory** to `src`
- If Cloudflare reports `Could not resolve host: github.com`, that is a repository fetch/network issue during cloning rather than a site HTML/CSS build error

## Notes

- No framework, bundler, or build step is required
- Shared header and footer markup are injected by `main.js`
- Placeholder locations remain for resume PDF, LinkedIn URL, project links, and article links
- If you later change file structure, update the JSON paths and navigation links in `src/assets/js/main.js`

## Article Content Structure

Readable article content now lives in static HTML files under `src/content/articles/{slug}/article.html`.

That keeps the site simple and static while allowing each article to have:

- metadata in `src/data/articles.json`
- an internal readable version loaded into `src/article.html`
- an external LinkedIn link for the original publication
