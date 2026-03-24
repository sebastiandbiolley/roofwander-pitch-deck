# For the team

This document explains **what this GitHub repository is for** and **where LinkedIn-related work lives**, so everyone stays aligned.

---

## What belongs in *this* public repo

| Area | Location | Purpose |
|------|----------|---------|
| Marketing / investor **site** | `pitch-deck-slides/index.html`, `how-it-works.html` | Home, careers, long-form “How it works” |
| **Investor deck** | `pitch-deck-slides/deck.html` + `investor-*/` slides | Full-screen deck and standalone slide HTML |
| **Shared UI** | `pitch-deck-slides/assets/` | `deck.css`, `deck.js` |
| **Charts / data** | `pitch-deck-slides/data/` | Source exports used by slides |
| **How it works (source)** | `pitch-deck-slides/how-it-works-content/*.md` | Markdown; build with `build-how-it-works.py` |

Anything you push here may be visible to **friends, investors, or the public** on GitHub. Do not commit secrets, internal-only financial detail you would not share, or **LinkedIn drafts**.

---

## LinkedIn content — not in this repo

**LinkedIn posts, calendars, and diagram HTML for social** are maintained **outside** this repository (e.g. a **private** GitHub repo, or a shared drive only the team uses).

Reason: this repo is intentionally **safe to share**; LinkedIn planning is internal and changes often.

### If you already have a `linkedin-posts/` folder next to this repo

Your machine may still have a local `linkedin-posts/` directory (same layout as before). That folder is **gitignored** here so it never gets pushed. Keep using it locally or move it into your **private** team repo.

Suggested **private** repo name: e.g. `roofwander-linkedin` or `roofwander-marketing` — only invite teammates.

---

## LinkedIn folder structure (for the private repo)

Each topic folder typically contains:

- **`linkedin-post.md`** — Post copy (edit in Markdown, paste into LinkedIn).
- **`*-diagram.html`** — Open in a browser; print to PDF for carousels or document posts.

Optional: **`CALENDAR.md`** / **`CALENDAR.html`** for scheduling.

### Editing posts

1. Open `linkedin-post.md` in your editor.
2. Edit; copy the text into LinkedIn when ready (basic Markdown pastes reasonably well).

### HTML diagrams

1. Open the `.html` file in Chrome / Edge / Firefox.
2. **Ctrl+P** (Windows) or **Cmd+P** (Mac) → destination **Save as PDF** for LinkedIn uploads.
3. Enable **Background graphics** in print options if colors matter; use **Landscape** if the diagram is wide.

### SEO topic map (example)

| Topic | Visual |
|-------|--------|
| infrastructure | Technical SEO diagrams |
| content-strategy | Content ecosystem diagram |
| page-usefulness | Analytics / engagement notes |
| multilingual | Locale / SEO diagram |

(Adjust filenames to match whatever you keep in the private repo.)

---

## Who to ask

If you are unsure whether something should live **here** (public) vs **LinkedIn private repo**, ask before pushing — when in doubt, keep it out of this repo.
