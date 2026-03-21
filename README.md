# Babak Mohammadi Profile Site

A polished multi-page static profile site for Babak Mohammadi, positioned as an automotive executive, operational strategist, process builder, and writer with hands-on dealership leadership depth.

## Current Repo Summary

The repository now uses a simple static-file structure with:

- Multi-page HTML files in `src/`.
- One shared stylesheet in `src/assets/css/main.css`.
- One shared JavaScript file in `src/assets/js/main.js`.
- JSON-driven content in `src/data/`.
- A placeholder visual asset in `src/assets/img/`.

## Final File Tree

```text
.
├── README.md
└── src
    ├── index.html
    ├── about.html
    ├── experience.html
    ├── articles.html
    ├── projects.html
    ├── contact.html
    ├── assets
    │   ├── css
    │   │   └── main.css
    │   ├── img
    │   │   └── headshot-placeholder.svg
    │   └── js
    │       └── main.js
    └── data
        ├── profile.json
        ├── experience.json
        ├── articles.json
        └── projects.json
```

## Pages

- `src/index.html` — executive home page with summary, highlights, experience preview, and writing preview.
- `src/about.html` — professional narrative and leadership themes.
- `src/experience.html` — expanded timeline view.
- `src/articles.html` — article cards with category filtering.
- `src/projects.html` — current systems, tools, and training projects.
- `src/contact.html` — professional CTA and placeholder contact assets.

## Content Model

Most repeated site content is driven by JSON:

- `profile.json` stores name, headline, links, home-page metrics, and about-page principles.
- `experience.json` stores timeline entries.
- `articles.json` stores article cards and filter categories.
- `projects.json` stores project cards.

This keeps the HTML pages lightweight while preserving a no-build, framework-free setup.

## Local Run Instructions

Because this site loads local JSON with `fetch`, open it through a simple local web server rather than double-clicking the HTML files.

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

You can use any simple static file server as long as it serves the repository root and lets the browser access `src/data/*.json`.

## Notes

- No framework, bundler, or build step is required.
- Shared header and footer markup are injected by `main.js` so every page stays consistent.
- Placeholder locations are included for headshot, resume PDF, LinkedIn URL, project links, and article links.
- If you later change file structure, update the JSON paths in `src/assets/js/main.js` and the page links in the shared header/footer renderer.
