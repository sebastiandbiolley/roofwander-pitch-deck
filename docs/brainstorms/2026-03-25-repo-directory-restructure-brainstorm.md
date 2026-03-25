---
date: 2026-03-25
topic: repo-directory-restructure
---

# Repo Directory Restructure

## What We're Building

The current repo has a misleading `pitch-deck-slides/` wrapper that contains the entire static site — home page, how-it-works, investor deck, build scripts, assets, and built output. The name is inaccurate and forces every path to be needlessly nested.

We're restructuring to a flat root layout where:
- **`src/`** holds all source files, organised by audience (`public/investors/`, `public/home/`, `private/`)
- **`public/`** is the built output and HTTP document root (replacing `pitch-deck-slides/dist/`)
- **`scripts/`**, **`docs/`**, and repo-level files live cleanly at root

## Why This Approach (Approach A: Flat promotion + `src/` by audience)

Three options were considered:

| Option | Description | Rejected because |
|--------|-------------|------------------|
| A — Flat + audience split | Promote to root, `src/public/investors` + `src/private` | ← **Chosen** |
| B — Flat + no `public/` wrapper | Same but no `public/` nesting in `src/` | Implicit public/private distinction is weaker |
| C — Just kill the wrapper | Move to root, keep existing `src/` shape | Defers the naming problem |

Approach A was chosen because the `public/private` split in the source tree signals intent clearly, makes gitignore rules obvious (`src/private/`), and mirrors the output structure.

## Proposed Structure

```
(repo root)
├── public/                        ← HTTP document root (was pitch-deck-slides/dist/)
│   ├── index.html
│   ├── deck.html
│   ├── how-it-works.html
│   ├── assets/
│   ├── data/
│   ├── logo/
│   └── investor-*/
│
├── src/                           ← all source files
│   ├── public/                    ← sources that build into public/
│   │   ├── investors/             ← investor-* slide packages (body.html + local assets)
│   │   │   ├── hero/
│   │   │   ├── market/
│   │   │   ├── market-context/
│   │   │   ├── market-positioning/
│   │   │   ├── problem/
│   │   │   ├── solution/
│   │   │   ├── traction/
│   │   │   ├── unit-economics/
│   │   │   ├── finance/
│   │   │   ├── roadmap/
│   │   │   ├── team/
│   │   │   └── ask/
│   │   └── home/                  ← index, how-it-works sources (incl. Markdown), roofwander-system/
│   │
│   ├── assets/                    ← shared CSS, JS, icons, logo (copied to public/assets/ at build)
│   │
│   └── private/                   ← future private docs (gitignored when first used)
│
├── scripts/                       ← build scripts (was pitch-deck-slides/scripts/)
│   ├── build-deck.py
│   ├── build-how-it-works.py
│   ├── html_build.py
│   └── inline_rw_icons.py
│
├── data/                          ← raw CSV data (was pitch-deck-slides/src/data/)
│   ├── market-context/
│   └── traction/
│
├── docs/                          ← repo-internal docs (brainstorms, standards)
│   └── brainstorms/
│
├── README.md
├── TEAM.md                        ← single source (docs/TEAM.md removed)
├── DESIGN-SYSTEM.md               ← moved up from pitch-deck-slides/
└── requirements.txt
```

## Key Decisions

- **`public/` not `dist/`**: More conventional for static sites; confirms with static hosting providers (Netlify, Vercel, Cloudflare Pages all support serving from a `public/` root). Signals "this is what's served" more clearly than `dist/`.
- **`src/public/investors/` not `src/investor-slides/`**: The `public/` prefix makes the intent clear; future `src/private/` follows the same pattern naturally.
- **`src/assets/` top-level in `src/`**: Shared across all pages (investors and home), so it sits above `src/public/` rather than inside it.
- **Markdown how-it-works content stays in `src/public/home/`**: Co-located with the other home sources; no separate `content/` directory.
- **`data/` at root**: Raw CSVs are not markup/code — keeping them top-level (copied to `public/data/` at build time) keeps `src/` focused.
- **`docs/` stays at root**: Repo-internal docs are separate from site source. `docs/TEAM.md` is removed — `TEAM.md` at root is the single source.
- **Build scripts in `scripts/`**: Flat, no sub-nesting needed. All paths inside scripts will need updating to reflect new `src/` and `public/` locations.
- **`src/private/` gitignored when first used**: No point adding it to `.gitignore` while empty.
- **Static host**: Netlify/Vercel/Cloudflare Pages — configure document root to `public/`.

## Resolved Questions

- **Assets location**: `src/assets/` (top-level in src/, not under src/public/).
- **How-it-works Markdown**: stays in `src/public/home/`.
- **`src/private/` gitignore**: only when first populated.
- **Hosting**: external static host (not GitHub Pages); `public/` is the conventional root name for these providers.

## Next Steps

→ `/workflows:plan` for step-by-step migration: file moves, script path updates, README updates, `.gitignore` updates
