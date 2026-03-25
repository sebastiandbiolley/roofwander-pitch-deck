---
title: "refactor: Flatten repo structure and organise source tree by audience"
type: refactor
status: active
date: 2026-03-25
brainstorm: docs/brainstorms/2026-03-25-repo-directory-restructure-brainstorm.md
---

# refactor: Flatten repo structure and organise source tree by audience

## Overview

Remove the misleading `pitch-deck-slides/` wrapper and promote everything to repo root. Organise source files under `src/` by audience (`src/public/investors/`, `src/public/home/`) and rename the build output from `dist/` to `public/`. Update all Python build scripts and documentation to match the new layout. Result: a clean, self-explanatory static site repo ready for Netlify/Vercel/Cloudflare Pages deployment.

## Problem Statement / Motivation

- `pitch-deck-slides/` is a misleading folder name — it contains the full static site (home page, how-it-works, investor deck), build tooling, assets, and built output.
- Every path is needlessly deep (`pitch-deck-slides/scripts/build-deck.py`, `pitch-deck-slides/dist/index.html`).
- No clear distinction between source, built output, or audience (public/private) in the current tree.
- `dist/` is a build-tool convention, not a web-server convention. Netlify/Vercel/Cloudflare Pages all use `public/` as the default document root.

## Proposed Solution

Lift `pitch-deck-slides/` contents to root, then reorganise under three principles:

1. **`src/` by audience** — `src/public/investors/`, `src/public/home/`, `src/assets/` (shared), future `src/private/`
2. **`public/` as document root** — replaces `dist/`; URL structure inside `public/` is preserved so no external links break
3. **`data/` at root** — raw CSVs are data, not markup; separate from code

## Technical Considerations

### Path resolution in build scripts

All four scripts use `_SCRIPT_DIR = Path(__file__).resolve().parent` and `ROOT = _SCRIPT_DIR.parent`. After moving `scripts/` to repo root, `_SCRIPT_DIR.parent` automatically becomes the repo root — **`ROOT` requires no code change**. Only `DIST`, `MD_PATH`, per-slide source paths, and the `data` sync path need updating.

### Preserving public/ URL structure

Standalone slide HTML files are served at `public/investor-hero/investor-hero.html`, etc. These output paths are preserved so no external links break. Only the *source* side renames from `src/investor-hero/` to `src/public/investors/hero/`. The `SLIDES` list in `build-deck.py` is split into `src_name` + `dist_folder` to express this.

### `<base href="../">` depth

Standalone slides use `<base href="../">` to resolve `assets/` relative to `public/` root (one level up from `public/investor-hero/`). After the move the depth is identical — standalones still live one level deep in `public/` — so **no change needed** to the base tag.

### `html_build.py` and icon resolution

`html_build.py` reads `root / "partials" / "head-fragment.html"` where `root = SRC`. `src/partials/` stays at `src/partials/` — **no change**. Icons are resolved via `SRC / "assets/icons/lucide"` — since `src/assets/` stays in place — **no change**.

### Built output (`public/`) and git

`pitch-deck-slides/dist/` is currently untracked (never staged). Decide before committing whether to commit `public/` (manual deploy) or gitignore it (CI builds on push). This plan does not commit `public/`; that decision is separate.

## Acceptance Criteria

- [ ] Repo root contains `src/`, `public/`, `scripts/`, `data/`, `docs/`, `README.md`, `TEAM.md`, `DESIGN-SYSTEM.md`, `requirements.txt` — and nothing else
- [ ] `pitch-deck-slides/` folder no longer exists
- [ ] `python scripts/build-deck.py` (run from repo root) produces identical `public/` output to the old `dist/`
- [ ] `python scripts/build-how-it-works.py` (run from repo root) produces identical `public/how-it-works.html`
- [ ] `python -m http.server 8080` from `public/` serves home, deck, how-it-works, and all investor slides correctly
- [ ] `docs/TEAM.md` is removed; `TEAM.md` at root is the single copy
- [ ] `README.md` updated to reflect new commands and paths
- [ ] No broken icon inlining (all `data-rw-icon` spans resolve)
- [ ] Git history preserved for moved files (use `git mv`, not delete + re-add)

## Implementation Phases

### Phase 1 — Create new directories and move files with `git mv`

Run from repo root. Create intermediate directories before moving into them.

```powershell
# 1. Scripts
git mv pitch-deck-slides/scripts scripts

# 2. Shared source tree (assets and partials stay at src/ level)
New-Item -ItemType Directory -Force src/assets | Out-Null
New-Item -ItemType Directory -Force src/partials | Out-Null
git mv pitch-deck-slides/src/assets src/assets
git mv pitch-deck-slides/src/partials src/partials

# 3. Raw data moves to repo root
git mv pitch-deck-slides/src/data data

# 4. Home page sources
New-Item -ItemType Directory -Force src/public/home | Out-Null
git mv "pitch-deck-slides/src/index.body.html" "src/public/home/index.body.html"
git mv "pitch-deck-slides/src/how-it-works-content" "src/public/home/how-it-works-content"

# 5. Investor slides — strip 'investor-' prefix, rename roofwander-system to keep as-is
New-Item -ItemType Directory -Force src/public/investors | Out-Null
git mv pitch-deck-slides/src/investor-hero            src/public/investors/hero
git mv pitch-deck-slides/src/investor-market-context  src/public/investors/market-context
git mv pitch-deck-slides/src/investor-problem         src/public/investors/problem
git mv pitch-deck-slides/src/investor-solution        src/public/investors/solution
git mv pitch-deck-slides/src/roofwander-system        src/public/investors/roofwander-system
git mv pitch-deck-slides/src/investor-market          src/public/investors/market
git mv pitch-deck-slides/src/investor-market-positioning src/public/investors/market-positioning
git mv pitch-deck-slides/src/investor-roadmap         src/public/investors/roadmap
git mv pitch-deck-slides/src/investor-traction        src/public/investors/traction
git mv pitch-deck-slides/src/investor-unit-economics  src/public/investors/unit-economics
git mv pitch-deck-slides/src/investor-finance         src/public/investors/finance
git mv pitch-deck-slides/src/investor-team            src/public/investors/team
git mv pitch-deck-slides/src/investor-ask             src/public/investors/ask

# 6. Built output: dist/ → public/
git mv pitch-deck-slides/dist public

# 7. Root-level files from pitch-deck-slides/
git mv pitch-deck-slides/DESIGN-SYSTEM.md DESIGN-SYSTEM.md
git mv pitch-deck-slides/requirements.txt requirements.txt
```

After these moves, `pitch-deck-slides/` should be empty (or contain only `__pycache__/` and the old `README.md`):

```powershell
# Remove stale README (content will be merged into root README.md in Phase 3)
Remove-Item pitch-deck-slides/README.md
# Remove __pycache__ debris
Remove-Item -Recurse -Force pitch-deck-slides/__pycache__ -ErrorAction SilentlyContinue
# Remove the now-empty wrapper
Remove-Item -Recurse pitch-deck-slides
```

**Remove `docs/TEAM.md`** (root `TEAM.md` is the single source):

```powershell
git rm docs/TEAM.md
```

---

### Phase 2 — Update build scripts

#### `scripts/build-deck.py`

Three areas to update: `DIST` constant, the `SLIDES` list (split src/dist folders), and the `data` sync call.

**Change 1 — `DIST` constant** (line ~18):

```python
# Before
DIST = ROOT / "dist"

# After
DIST = ROOT / "public"
```

**Change 2 — Add source path helpers and update `INDEX_BODY`** (after `DIST` line):

```python
# Add after DIST definition
SRC_INVESTORS = SRC / "public" / "investors"
SRC_HOME = SRC / "public" / "home"

# Change INDEX_BODY
# Before:
INDEX_BODY = Path("index.body.html")

# After:
INDEX_BODY = SRC_HOME / "index.body.html"
```

And in `build_index_html()`, update the body path read:

```python
# Before
body_path = SRC / INDEX_BODY

# After
body_path = INDEX_BODY
```

**Change 3 — `SLIDES` list** — add `src_name` as first element (short folder name in `src/public/investors/`), keep `dist_folder` as second (preserves existing `public/` URL paths):

```python
# Tuple shape: (src_name, dist_folder, standalone_filename, nav_label, title, html_class)
SLIDES = [
    ("hero",                 "investor-hero",              "investor-hero.html",              "Hero",           "Roofwander — Investor Overview",            None),
    ("market-context",       "investor-market-context",    "investor-market-context.html",    "Market Context", "Slide 2 — Market Context",                  None),
    ("problem",              "investor-problem",           "investor-problem.html",           "Problem",        "Slide 3 - The Problem",                     None),
    ("solution",             "investor-solution",          "investor-solution.html",          "Solution",       "Slide 4 - The Solution",                    None),
    ("roofwander-system",    "roofwander-system",          "system-diagram.html",             "System",         "How Roofwander Works as a System",          "standalone-system-diagram"),
    ("market",               "investor-market",            "investor-market.html",            "Market",         "Slide 7 - Market Size",                     None),
    ("market-positioning",   "investor-market-positioning","investor-market-positioning.html","Positioning",    "Market Positioning",                        None),
    ("roadmap",              "investor-roadmap",           "investor-roadmap.html",           "Roadmap",        "Product Roadmap — Roofwander",              None),
    ("traction",             "investor-traction",          "investor-traction.html",          "Traction",       "Traction — Roofwander",                     None),
    ("unit-economics",       "investor-unit-economics",    "investor-unit-economics.html",    "Unit Economics", "Unit Economics — Roofwander",               None),
    ("finance",              "investor-finance",           "investor-finance.html",           "Finance",        "Finance — Roofwander",                      None),
    ("team",                 "investor-team",              "investor-team.html",              "Team",           "Team — Roofwander",                         None),
    ("ask",                  "investor-ask",               "investor-ask.html",               "Ask",            "The Ask — Roofwander",                      None),
]
```

**Change 4 — Update functions that read/write using `SLIDES`**:

In `copy_slide_static_assets(folder)` — add `dist_folder` param:

```python
# Before
def copy_slide_static_assets(folder: str) -> None:
    src_sl = SRC / folder
    dist_sl = DIST / folder

# After
def copy_slide_static_assets(src_name: str, dist_folder: str) -> None:
    src_sl = SRC_INVESTORS / src_name
    dist_sl = DIST / dist_folder
```

In `prepare_dist_static()` — update data sync and slide loop:

```python
def prepare_dist_static() -> None:
    DIST.mkdir(parents=True, exist_ok=True)
    sync_tree(SRC / "assets", DIST / "assets")
    sync_tree(ROOT / "data", DIST / "data")          # data/ now at repo root
    for src_name, dist_folder, *_ in SLIDES:
        copy_slide_static_assets(src_name, dist_folder)
```

In `main()` — update slide body path and output path references:

```python
# Before
for folder, out_name, _label, title, html_class in SLIDES:
    body_path = SRC / folder / "body.html"
    out_path = DIST / folder / out_name

# After
for src_name, dist_folder, out_name, _label, title, html_class in SLIDES:
    body_path = SRC_INVESTORS / src_name / "body.html"
    out_path = DIST / dist_folder / out_name
```

Also update the `build_nav_links` / `SLIDES` unpack in the deck-building loop:

```python
# Before (iterating for labels)
for i in range(n):
    label = SLIDES[i][2]

# After (nav_label is now index 3)
for i in range(n):
    label = SLIDES[i][3]
```

#### `scripts/build-how-it-works.py`

Two changes:

```python
# Before
DIST = ROOT / "dist"
MD_PATH = SRC / "how-it-works-content" / "how-roofwander-works-full.md"

# After
DIST = ROOT / "public"
MD_PATH = SRC / "public" / "home" / "how-it-works-content" / "how-roofwander-works-full.md"
```

And in `ensure_dist_shared_static()`:

```python
# Before
_sync_tree(SRC / "data", DIST / "data")

# After
_sync_tree(ROOT / "data", DIST / "data")
```

#### `scripts/html_build.py` — no changes needed

`root / "partials" / "head-fragment.html"` with `root = SRC` resolves to `src/partials/` — unchanged.

#### `scripts/inline_rw_icons.py` — no changes needed

`DEFAULT_LUCIDE_DIR = Path("assets/icons/lucide")` joined with `SRC` resolves to `src/assets/icons/lucide/` — unchanged.

---

### Phase 3 — Update documentation

#### `README.md` (root)

Update to reflect:
- New directory layout (remove all `pitch-deck-slides/` references)
- New commands: run scripts from repo root
- New local server: `cd public && python -m http.server 8080`
- New URLs (same paths, different root)
- Link to `DESIGN-SYSTEM.md` (now at root)

Key commands after restructure:

```bash
# Build investor deck + home page
python scripts/build-deck.py

# Build how-it-works page
python scripts/build-how-it-works.py

# Serve locally
cd public && python -m http.server 8080
# Then visit: http://localhost:8080/
```

#### `DESIGN-SYSTEM.md`

Update any path references from `pitch-deck-slides/src/assets/` to `src/assets/`.

#### `.gitignore`

Confirm `public/` is handled appropriately. Since `dist/` was never committed (all `??` in git status), `public/` should similarly remain untracked if using CI/CD deploy. If deploying by committing built output, no gitignore entry needed.

Current `.gitignore` already covers `**/__pycache__/` — no changes needed for Python cache.

---

### Phase 4 — Smoke-test the build

```powershell
# Run from repo root
python scripts/build-deck.py
python scripts/build-how-it-works.py

# Serve and verify
cd public
python -m http.server 8080
```

Verify these URLs load correctly:
- `http://localhost:8080/` — home page
- `http://localhost:8080/deck.html` — investor deck (all slides, navigation)
- `http://localhost:8080/how-it-works.html` — how-it-works page
- `http://localhost:8080/investor-hero/investor-hero.html` — standalone slide (check `<base href>` resolves assets)
- `http://localhost:8080/roofwander-system/system-diagram.html` — system diagram standalone

Check: no missing icons (no `Warning: missing icon` in build output), all slide images/videos load.

---

## Dependencies & Risks

| Risk | Mitigation |
|------|------------|
| `git mv` across directory boundaries may not track rename in all git clients | Run `git status` after each batch of moves; verify git sees renames not deletions |
| SLIDES tuple index shift (added `src_name` as index 0) breaks nav label lookups | Index references to SLIDES elements are updated in Phase 2 (label is now `[3]` not `[2]`) |
| `<base href="../">` depth assumption | Standalones still nest one level deep in `public/` — depth unchanged. Verify with smoke test. |
| `how-it-works-content/` sub-Markdown files (not just `how-roofwander-works-full.md`) | `git mv pitch-deck-slides/src/how-it-works-content src/public/home/how-it-works-content` moves the whole folder including all `.md` files |
| `public/` not in `.gitignore` but also not staged | Keep as-is (untracked); decide separately whether to commit built output or add to `.gitignore` |

## References

- Brainstorm: `docs/brainstorms/2026-03-25-repo-directory-restructure-brainstorm.md`
- Build entry point: `scripts/build-deck.py` (after move)
- Shared head helper: `scripts/html_build.py`
- Current README (pre-restructure): `pitch-deck-slides/README.md`
