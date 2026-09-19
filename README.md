# Hansam Jo — Portfolio

Static personal portfolio for an AI / Software Engineer. No build step.

## Open locally

```bash
cd "/Users/samjo/code/portfolio website"
python3 -m http.server 5173
```

Then visit `http://localhost:5173`.

## Deploy

GitHub Pages deploys from the `main` branch and repository root:

https://hjo3-cse40.github.io/Hansam_Jo_portfolio/

## Structure

- `index.html` — My Story, Career, School, and project content
- `styles.css` — responsive editorial dark theme
- `script.js` — project navigation and interactive Airlock, Argus, and FST demonstrations
- `assets/` — portrait and project/organization logos

## Git hooks

The repository uses `.githooks/commit-msg` through `core.hooksPath` to remove Cursor co-author trailers. Do not bypass hooks without a specific reason.

## Future ideas

- A hand-authored writing/blog section remains on hold until requested.
- Do not add public availability language or a résumé download without asking.
