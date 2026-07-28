# Hansam (Sam) Jo — Portfolio

Simple static personal site (dark theme). No build step.

## Open locally

```bash
cd "/Users/samjo/code/portfolio website"
open index.html
```

Or serve with any static server:

```bash
python3 -m http.server 5173
# then visit http://localhost:5173
```

## Deploy to GitHub Pages

1. Create a repo (e.g. `HansamJo.github.io` for `https://hansamjo.github.io`, or any repo + Pages from `/root`).
2. Push this folder’s contents to `main`.
3. GitHub → **Settings** → **Pages** → Source: Deploy from branch `main` / root.
4. Site will be live at `https://<user>.github.io/<repo>/` (or the user site URL if using `username.github.io`).

## Git hooks (no Cursor co-author on commits)

Cursor sometimes adds `Co-authored-by: Cursor <cursoragent@cursor.com>` to commit messages. This repo includes a hook that removes that line before the commit is finalized.

One-time setup on your machine:

```bash
cd "/Users/samjo/code/portfolio website"
chmod +x .githooks/commit-msg
git config core.hooksPath .githooks
```

After that, commits made in this repo (including from Cursor) should show only you on GitHub, as long as hooks are not skipped with `--no-verify`.

## Contents

- `index.html` — page structure
- `styles.css` — dark theme styles
- `script.js` — active nav on scroll
- `assets/avatar.png` — profile photo
- `assets/Hansam_Jo_Resume.pdf` — resume
- `assets/logos/` — SemiAI, Argus, FST, Phonely marks

## Future ideas (do not build until asked)

- **Blog / posts:** Hansam wants a writing section later (personal posts and blogs), not an auto LinkedIn feed. Keep v1 project-focused; add a clean Posts/Writing section when ready (hand-authored, not scraped).
- Skip GitHub contribution graph unless the graph looks strong and he asks for it.

## Note

Profile photo is the headshot on file. GitHub social link: https://github.com/hjo3-cse40

## Previews

Screenshot previews (generated locally) live in `previews/`:

- `desktop-hero.png` — top of page
- `desktop-projects.png` — taller capture including projects
- `mobile.png` — phone-width layout
