# Roofwander — investor site & deck

Public repository: **static HTML** for the Roofwander home page, **How it works**, and the **investor pitch deck** (marketplace for rooftop tent travel).

LinkedIn drafts and marketing calendars are **not** stored here — they live in a **separate private** place for the team (see **[docs/TEAM.md](docs/TEAM.md)**).

---

## Repository layout

```
├── pitch-deck-slides/     # Site + deck (entry: index.html, deck.html)
├── docs/
│   └── TEAM.md            # For teammates: scope, LinkedIn workflow, where things live
└── README.md
```

Details: **[pitch-deck-slides/README.md](pitch-deck-slides/README.md)** (slide list, build scripts, local server).

---

## View locally

From `pitch-deck-slides/`:

```bash
cd pitch-deck-slides
python -m http.server 8080
```

| Page | URL |
|------|-----|
| Home | http://localhost:8080/ |
| Deck | http://localhost:8080/deck.html |
| How it works | http://localhost:8080/how-it-works.html |

---

## Sharing

1. Push to GitHub (this repo is safe to share; no LinkedIn content).
2. Optional: publish with **GitHub Pages** or any static host pointing at `pitch-deck-slides/` (or the repo root if Pages is configured that way).
3. Share `deck.html` or individual slide URLs under `investor-*` / `roofwander-system/` as needed.

---

## Team

If you work on Roofwander content with us, read **[docs/TEAM.md](docs/TEAM.md)** for what belongs here vs elsewhere and how LinkedIn assets are managed outside this repo.
