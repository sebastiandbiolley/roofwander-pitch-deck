# Roofwander — investor site & deck

Public repository: **static HTML** for the Roofwander home page, **How it works**, and the **investor pitch deck** (marketplace for rooftop tent travel).

LinkedIn drafts and marketing calendars are **not** stored here — they live in a **separate private** place for the team (see **[TEAM.md](TEAM.md)**).

### Local server (preview the built site)

From the **repo root** (after `public/` exists — run `python scripts/build-deck.py` if needed):

```bash
cd public
python -m http.server 8080
```

Then open **http://localhost:8080/** (deck: **http://localhost:8080/deck.html**).

**Without Python:** `npx serve public -p 8080` from the repo root.

More URLs and notes: **[View locally](#view-locally)** below.

---

## Repository layout

```
├── public/                 # Built site — HTTP document root (index.html, deck.html, …)
├── scripts/                # Python build scripts
├── src/                    # All sources — edit here
│   ├── assets/             # Shared CSS, JS, icons, logo → copied to public/assets/
│   ├── partials/         # head-fragment.html
│   └── public/
│       ├── home/           # index.body.html, how-it-works-content/*.md
│       └── investors/      # Slide packages (hero/, problem/, …) each with body.html + assets
├── data/                   # CSV exports → copied to public/data/ on build
├── docs/                   # Internal docs (brainstorms, plans)
├── DESIGN-SYSTEM.md        # CSS layers, tokens, shared classes
├── requirements.txt        # Optional: markdown for build-how-it-works.py
├── TEAM.md
└── README.md
```

**Serve and link against `public/`** — that folder is the built site. **Edit sources under `src/`**, then run the build scripts from the **repo root**.

---

## What lives where

| File / area | Role |
|-------------|------|
| `public/` | **Built site** — `index.html`, `deck.html`, `how-it-works.html`, slide standalones, copied assets, data, slide media |
| `src/public/home/` | Home body, Markdown for how-it-works |
| `src/public/investors/*/` | Each slide folder has **`body.html`** (slide markup) + slide-local static files |
| `src/assets/` | Shared CSS/JS/icons — copied to `public/assets/` |
| `data/` | CSV exports — copied to `public/data/` |
| `scripts/build-deck.py` | Builds `public/` from `src/` and `data/`: home, each slide’s standalone `*.html`, and `deck.html` |
| `scripts/build-how-it-works.py` | Builds `public/how-it-works.html` from `src/public/home/how-it-works-content/how-roofwander-works-full.md` |
| `scripts/html_build.py` | Shared head from `src/partials/` |
| `scripts/inline_rw_icons.py` | Inlines Lucide SVGs at build time |

Slide order, nav labels, and standalone titles live in **`SLIDES`** inside [`scripts/build-deck.py`](scripts/build-deck.py). **Edit `src/public/investors/*/body.html` and `src/public/home/index.body.html`, not the generated HTML under `public/`.**

Nested standalones use `<base href="../">` and asset URLs relative to the **`public/`** root (e.g. `investor-hero/hero-video.mp4`). Serve with a local HTTP server (`file://` can mis-resolve `<base>`).

---

## Deck order (current `deck.html`)

Thirteen slides, indices `0`–`12`:

| # | Section | Standalone path (under `public/`) |
|---|---------|-----------------------------------|
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

`public/assets/deck.js` sets the slide count from the number of `.deck-slide` elements in the DOM.

---

## View locally

If a leftover `pitch-deck-slides/` directory still exists (for example because a process had `dist/` open), stop that process and delete the folder — the canonical build output is **`public/`** at the repo root.

From the **repo root**:

```bash
cd public
python -m http.server 8080
```

| Page | URL |
|------|-----|
| Home | http://localhost:8080/ |
| Deck | http://localhost:8080/deck.html |
| How it works | http://localhost:8080/how-it-works.html |

Standalone example: http://localhost:8080/investor-traction/investor-traction.html

**Without Python:** `npx serve public -p 8080` from the repo root.

---

## Regenerating the deck and home page

From the **repo root**:

```bash
python scripts/build-deck.py
```

The script syncs `src/assets/` and `data/` into `public/`, copies slide-local files into each `public/investor-*/` folder, reads each slide’s `body.html`, inlines icons, writes standalone HTML, strips embedded `<style>` / inline `<script>` for deck assembly, and writes `public/index.html` and `public/deck.html`.

---

## Regenerating `how-it-works.html`

Content lives in Markdown under `src/public/home/how-it-works-content/`. The single-page build uses **`how-roofwander-works-full.md`**. Other `.md` files in that folder are topic splits for reference; they are not merged automatically.

```bash
pip install -r requirements.txt
python scripts/build-how-it-works.py
```

---

## Sharing & deployment

1. Push to GitHub (this repo is safe to share; no LinkedIn content).
2. Publish with **Netlify**, **Vercel**, **Cloudflare Pages**, or similar — set the **publish directory** to **`public/`**.
3. Share `deck.html` or individual slide URLs under `investor-*` / `roofwander-system/` as needed (paths are relative to `public/`).

---

## Team

If you work on Roofwander content with us, read **[TEAM.md](TEAM.md)** for what belongs here vs elsewhere.
