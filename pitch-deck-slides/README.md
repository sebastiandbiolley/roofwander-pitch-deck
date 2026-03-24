# Pitch deck slides

Static HTML for Roofwander: a small site entry (`index.html`), a full-screen slide deck (`deck.html`), standalone slide pages for reuse or deep links, and shared assets.

---

## What lives here

| File / area | Role |
|-------------|------|
| `index.html` | Home: links into the deck and other entry points |
| `deck.html` | Investor deck: horizontal slide navigation, hash URLs (`#slide-0` …) |
| `how-it-works.html` | Long-form “How it works” page (generated; see below) |
| `how-it-works-content/` | Markdown sources for that page |
| `build-how-it-works.py` | Builds `how-it-works.html` from `how-it-works-content/how-roofwander-works-full.md` |
| `requirements.txt` | Optional: `markdown` package for `build-how-it-works.py` |
| `assets/deck.css` | Shared design tokens and component styles |
| `assets/deck.js` | Slide navigation, hash sync, shared interaction helpers |
| `build-deck.py` | Optional: regenerates `deck.html` body from standalone HTML files |
| `data/` | Source exports for charts (e.g. traction); update files and refresh slide copy as needed |

Standalone folders (`investor-*`, `roofwander-system/`) each contain one slide as a full HTML page. Edit those for content; the deck inlines them (or you maintain `deck.html` manually if it diverges).

---

## Deck order (current `deck.html`)

Thirteen slides, indices `0`–`12`:

| # | Section | Standalone path |
|---|---------|-----------------|
| 0 | Hero | `investor-hero/investor-hero.html` |
| 1 | Market context | `investor-market-context/investor-market-context.html` |
| 2 | Problem | `investor-problem/investor-problem.html` |
| 3 | Solution | `investor-solution/investor-solution.html` |
| 4 | System | `roofwander-system/system-diagram.html` |
| 5 | Market | `investor-market/investor-market.html` |
| 6 | Positioning | `investor-market-positioning/investor-market-positioning.html` |
| 7 | Roadmap | `investor-roadmap/investor-roadmap.html` |
| 8 | Traction | `investor-traction/investor-traction.html` |
| 9 | Unit economics | `investor-unit-economics/investor-unit-economics.html` |
| 10 | Finance | `investor-finance/investor-finance.html` |
| 11 | Team | `investor-team/investor-team.html` |
| 12 | Ask | `investor-ask/investor-ask.html` |

`assets/deck.js` uses `SLIDE_COUNT = 13` to match this.

---

## Folder layout (abbreviated)

```
pitch-deck-slides/
├── index.html
├── deck.html
├── how-it-works.html
├── build-deck.py
├── build-how-it-works.py
├── requirements.txt
├── how-it-works-content/     # Markdown: canonical = how-roofwander-works-full.md; other files = topic splits / reference
├── assets/
│   ├── deck.css
│   └── deck.js
├── data/
├── investor-hero/
├── investor-market-context/
├── investor-problem/
├── investor-solution/
├── investor-market/
├── investor-market-positioning/
├── investor-roadmap/
├── investor-traction/
├── investor-unit-economics/
├── investor-finance/
├── investor-team/
├── investor-ask/
├── roofwander-system/
└── logo/                    # shared brand assets (as used by slides)
```

Finance CSVs and team media live beside their slide HTML (e.g. `investor-finance/*.csv`, `investor-team/*.webp`).

---

## View locally

Slides rely on relative URLs. Use a local HTTP server so assets and imports resolve reliably.

From this directory:

```bash
python -m http.server 8080
```

Then open:

| Page | URL |
|------|-----|
| Home | http://localhost:8080/ |
| Deck | http://localhost:8080/deck.html |
| How it works | http://localhost:8080/how-it-works.html |

Standalone example: http://localhost:8080/investor-traction/investor-traction.html

Stop the server with `Ctrl+C` in the terminal.

**Without Python:** `npx serve . -p 8080` (Node.js) from the same folder.

---

## Regenerating `deck.html`

```bash
python build-deck.py
```

The script reads each standalone file in `SLIDES`, strips embedded `<style>` (styles come from `assets/deck.css`), adjusts a few asset paths, and writes `deck.html`. If the checked-in deck includes slides or edits not in the script, reconcile manually or extend `SLIDES` in `build-deck.py` before relying on a full regen.

---

## Regenerating `how-it-works.html`

Content lives in Markdown under `how-it-works-content/`. The single-page build uses **`how-roofwander-works-full.md`** (end-to-end narrative). Other files in that folder are smaller topic splits for reference or reuse; they are not merged automatically.

Install the optional dependency once:

```bash
pip install -r requirements.txt
```

Then:

```bash
python build-how-it-works.py
```

This writes `how-it-works.html` (hero, table of contents, article body). Embedded HTML in the Markdown (e.g. `doc-flow` diagrams) is preserved. Commit the generated HTML when you change the source so the site works without running Python.

---

## Docs in this folder

- `DESIGN-SYSTEM.md` — CSS layers, tokens, shared classes

**Team / scope (repo root):** [../docs/TEAM.md](../docs/TEAM.md) — what belongs in this public repo vs LinkedIn work in a private repo.
