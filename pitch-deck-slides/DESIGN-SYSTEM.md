# Roofwander pitch deck — design system

CSS for the investor deck and standalone slides lives primarily in **`assets/deck.css`**, organized in layers: tokens → base → components → layout → slide-specific overrides.

---

## 1. Layers

```
1. TOKENS       — :root variables (color, space, radius, layout, shadows)
2. BASE         — Reset, body typography
3. COMPONENTS   — Cards, intros, dropdowns, detail panels, pills, tables
4. LAYOUT       — .deck-section, grids, deck shell / track / slide
5. SLIDE-SPECIFIC — Hero, roadmap, traction charts, system diagram, etc.
```

---

## 2. Tokens (summary)

### Colors

| Token | Role |
|-------|------|
| `--accent` | Primary green — emphasis, active states, key metrics |
| `--accent-light`, `--accent-hover`, `--accent-border`, `--accent-muted`, `--accent-shadow` | Surfaces, borders, shadows tied to accent |
| `--grey-light` … `--grey-dark` | Backgrounds, borders, text hierarchy |
| `--bg`, `--surface`, `--surface-soft`, `--text`, `--text-muted`, `--border`, `--border-hover` | Semantic aliases |

### Spacing

`--sp-1` (4px) through `--sp-20` (80px); section padding uses `--section-pad`, `--section-pad-sm`, `--section-pad-x`, and `--gap` / `--gap-sm`.

### Radius

`--radius-sm` through `--radius-xl`, plus `--radius-full` for pills.

### Layout

| Token | Typical use |
|-------|-------------|
| `--container-medium` | Max width for sections (960px) |
| `--intro-width` | Intro text block |
| `--intro-margin-bottom`, `--intro-margin-bottom-lg` | Space below intros |

### Shadows

`--shadow`, `--shadow-hover`, `--shadow-accent` — card elevation; accent-tinted variants align with marketplace/roadmap styling.

### Component-related

Examples in `:root`: `--card-radius`, `--card-pad`, `--dd-radius`, `--detail-radius`, `--detail-pad`, `--close-size`. Use these for new cards and panels instead of one-off pixels.

### Timing

Motion is mostly **inline** in rules. Optional future tokens: `--t-dropdown`, `--t-detail`, `--t-fast`, `--t-icon`.

---

## 3. Base

- Global `box-sizing: border-box` and zeroed margin/padding on `*`.
- `body`: Inter stack, `background: var(--bg)`, `color: var(--text)`, comfortable line-height.

---

## 4. Deck chrome

| Class | Purpose |
|-------|---------|
| `.deck-shell` | Viewport-filling wrapper; hides overflow |
| `.deck-track` | Flex row of slides; translated for active index |
| `.deck-slide` | One viewport width/height; scrollable inner if needed |
| `.deck-slide-inner` | Content scroller inside a slide |
| `.deck-arrow`, `.deck-nav`, `.deck-progress` | Navigation UI |

`html.deck-root` locks document scroll while the deck is active.

---

## 5. Shared components

| Area | Classes (representative) |
|------|---------------------------|
| Intro | `.deck-intro`, `.deck-eyebrow`, `.deck-title`, `.deck-desc` |
| Cards | `.deck-card`, modifiers like `--stat`, `--content`, `--compact`, `--clickable`, `--active` |
| Card text | `.deck-card-title`, `.deck-value`, `.deck-label`, `.deck-card-list`, … |
| Detail panel | `.deck-detail`, `.deck-detail-inner`, `.deck-detail-close`, `.deck-detail-title`, `.deck-detail-panel` |
| Dropdowns | `[class*="-dd"]` pattern: header/body; `.deck-dd-section`, `.deck-dd-intro`, … |
| Layout | `.deck-section`, `.deck-section-inner`, `.deck-dropdowns-section`, `.deck-dropdowns-inner` |
| Other | `.pill`, `.cta`, `.disclosure` |

Prefer composing these over new one-off class names unless the layout is genuinely unique.

---

## 6. Slide-specific styling

Slides may add BEM-like prefixes (e.g. `.market-size-card`, `.traction-card`, `.pos-graph` for positioning). Keep **structure** in shared components; only **layout and data viz** stay custom.

| Slide | Custom focus |
|-------|----------------|
| Hero | Phone mockup, disclosure |
| Market context | Brand grid, tent imagery |
| Problem / solution | Card grids, arrows, laptop |
| System | Layered diagram, expandable cards |
| Market / positioning | Stat cards, map steps, 2×2 chart |
| Roadmap | Timeline / accordion, flywheel asset |
| Traction | Metrics, charts, tables |
| Unit economics | Three pillars, dropdowns |
| Finance | Chart + tables |
| Team | Photos, overlays |
| Ask | Summary layout, CTA |

---

## 7. Width and layout discipline

- Default content width: **`--container-medium`** via `.deck-section` and related wrappers.
- Avoid ad-hoc `max-width` on new sections; extend tokens or modifiers if you need a narrower column.

---

## 8. HTML patterns

**Section with intro and cards:**

```html
<section class="deck-section" id="example">
  <div class="deck-intro">
    <p class="deck-eyebrow">SECTION</p>
    <h2 class="deck-title">Title</h2>
    <p class="deck-desc">Short supporting copy.</p>
  </div>
  <div class="deck-grid">
    <article class="deck-card">…</article>
  </div>
</section>
```

**Clickable card opening a detail layer:** use `data-*` hooks and `.deck-detail` as in the Solution or Roadmap slides; initialize behavior in inline or shared JS consistent with existing slides.

---

## 9. JavaScript

`assets/deck.js` drives slide index, hash, and keyboard navigation. Per-slide scripts handle dropdowns, finance/traction interactions, and hero disclosure so fragile global selectors are avoided.

---

## 10. Related files

- `README.md` — Project map and local server
