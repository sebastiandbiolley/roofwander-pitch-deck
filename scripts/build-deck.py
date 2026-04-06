#!/usr/bin/env python3
"""Build standalone slide HTML and deck.html from body partials under src/.

Writes all site output to public/ (HTTP root). Syncs src/assets/, data/, and slide-local static
files into public/. From repo root:

    python scripts/build-deck.py
"""

from __future__ import annotations

import re
import shutil
import sys
from pathlib import Path

_SCRIPT_DIR = Path(__file__).resolve().parent
if str(_SCRIPT_DIR) not in sys.path:
    sys.path.insert(0, str(_SCRIPT_DIR))

from html_build import load_head_fragment, render_full_page
from inline_rw_icons import inline_rw_icons, inline_rw_icons_in_file

ROOT = _SCRIPT_DIR.parent
SRC = ROOT / "src"
DIST = ROOT / "public"
SRC_INVESTORS = SRC / "public" / "investors"
SRC_HOME = SRC / "public" / "home"

# Pages under public/ to scan for rw-icon placeholders after generation (optional).
EXTRA_ICON_PAGES = [
    Path("index.html"),
    Path("how-it-works.html"),
]

# (src_name under src/public/investors/, dist_folder under public/, standalone_filename, nav_label, title, html class or None)
SLIDES = [
    ("hero", "investor-hero", "investor-hero.html", "Hero", "Roofwander — Investor Overview", None),
    (
        "market-context",
        "investor-market-context",
        "investor-market-context.html",
        "Market Context",
        "Slide 2 — Market Context",
        None,
    ),
    ("problem", "investor-problem", "investor-problem.html", "Problem", "Slide 3 - The Problem", None),
    ("solution", "investor-solution", "investor-solution.html", "Solution", "Slide 4 - The Solution", None),
    (
        "roofwander-system",
        "roofwander-system",
        "system-diagram.html",
        "System",
        "How Roofwander Works as a System",
        "standalone-system-diagram",
    ),
    ("market", "investor-market", "investor-market.html", "Market", "Slide 7 - Market Size", None),
    (
        "market-positioning",
        "investor-market-positioning",
        "investor-market-positioning.html",
        "Positioning",
        "Market Positioning",
        None,
    ),
    ("roadmap", "investor-roadmap", "investor-roadmap.html", "Roadmap", "Product Roadmap — Roofwander", None),
    ("traction", "investor-traction", "investor-traction.html", "Traction", "Traction — Roofwander", None),
    (
        "unit-economics",
        "investor-unit-economics",
        "investor-unit-economics.html",
        "Unit Economics",
        "Unit Economics — Roofwander",
        None,
    ),
    ("finance", "investor-finance", "investor-finance.html", "Finance", "Finance — Roofwander", None),
    ("team", "investor-team", "investor-team.html", "Team", "Team — Roofwander", None),
    ("ask", "investor-ask", "investor-ask.html", "Ask", "The Ask — Roofwander", None),
]

INDEX_BODY = SRC_HOME / "index.body.html"
INDEX_TITLE = "Roofwander — The marketplace for rooftop tent travel"


def sync_tree(src: Path, dst: Path) -> None:
    if not src.is_dir():
        return
    shutil.copytree(src, dst, dirs_exist_ok=True)


def copy_slide_static_assets(src_name: str, dist_folder: str) -> None:
    """Copy everything in src/public/investors/<src_name>/ except body.html into public/<dist_folder>/."""
    src_sl = SRC_INVESTORS / src_name
    dist_sl = DIST / dist_folder
    if not src_sl.is_dir():
        return
    dist_sl.mkdir(parents=True, exist_ok=True)
    for item in src_sl.iterdir():
        if item.name == "body.html":
            continue
        dest = dist_sl / item.name
        if item.is_dir():
            shutil.copytree(item, dest, dirs_exist_ok=True)
        else:
            shutil.copy2(item, dest)


def prepare_dist_static() -> None:
    DIST.mkdir(parents=True, exist_ok=True)
    sync_tree(SRC / "assets", DIST / "assets")
    sync_tree(ROOT / "data", DIST / "data")
    for src_name, dist_folder, _out, _l, _t, _c in SLIDES:
        copy_slide_static_assets(src_name, dist_folder)


def remove_styles_only(html: str) -> str:
    """Remove embedded <style> - deck.css handles styles."""
    return re.sub(r"<style[^>]*>.*?</style>", "", html, flags=re.DOTALL | re.IGNORECASE)


def remove_inline_scripts(html: str) -> str:
    """Remove inline scripts — deck loads assets/deck-behaviors.js once in the shell."""
    return re.sub(r"<script[^>]*>.*?</script>", "", html, flags=re.DOTALL | re.IGNORECASE)


def build_nav_links(n: int) -> str:
    lines = ['  <div class="deck-nav-left">',
             '    <a href="index.html" class="deck-nav-logo">Roofwander</a>',
             '  </div>',
             '  <div class="deck-nav-center">']
    for i in range(n):
        label = SLIDES[i][3]
        lines.append(f'    <a href="#slide-{i}" data-slide="{i}">{label}</a>')
    lines.append('  </div>')
    lines.append('  <div class="deck-nav-right">')
    lines.append(f'    <span class="deck-progress" aria-live="polite">1 / {n}</span>')
    lines.append('    <a href="index.html" class="deck-nav-home">Home</a>')
    lines.append('  </div>')
    lines.append('  <button class="mobile-menu-toggle" type="button" aria-label="Open menu" aria-expanded="false" aria-controls="mobile-menu">')
    lines.append('    <span></span><span></span><span></span>')
    lines.append('  </button>')
    lines.append('  <div class="deck-nav-progress-bar"><div class="deck-nav-progress-fill"></div></div>')
    return "\n".join(lines)


def build_mobile_menu(n: int) -> str:
    lines = ['<div class="mobile-menu" id="mobile-menu" aria-hidden="true">',
             '  <div class="mobile-menu-header">',
             '    <a href="index.html" class="mobile-menu-logo">Roofwander</a>',
             '    <button class="mobile-menu-close" type="button" aria-label="Close menu">',
             '      <svg viewBox="0 0 24 24" fill="none"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>',
             '    </button>',
             '  </div>',
             '  <div class="mobile-menu-body">',
             '    <p class="mobile-menu-label">Slides</p>',
             '    <ul class="mobile-menu-nav">']
    for i in range(n):
        label = SLIDES[i][3]
        lines.append(f'      <li><a href="#slide-{i}" data-slide="{i}">{label}</a></li>')
    lines.append('    </ul>')
    lines.append('    <div class="mobile-menu-sep"></div>')
    lines.append(f'    <span class="mobile-menu-progress">1 / {n}</span>')
    lines.append('    <ul class="mobile-menu-nav">')
    lines.append('      <li><a href="index.html">Home</a></li>')
    lines.append('    </ul>')
    lines.append('  </div>')
    lines.append('</div>')
    return "\n".join(lines)


def build_index_html() -> None:
    body_path = INDEX_BODY
    if not body_path.is_file():
        raise SystemExit(f"Missing {INDEX_BODY}")
    body_inner = body_path.read_text(encoding="utf-8")
    html = render_full_page(
        SRC,
        title=INDEX_TITLE,
        body_inner=body_inner,
        body_class="home-page",
    )
    html = inline_rw_icons(html, SRC)
    (DIST / "index.html").write_text(html, encoding="utf-8")
    rel = INDEX_BODY.relative_to(ROOT)
    print(f"Built public/index.html from {rel.as_posix()}")


def main() -> None:
    if not SRC.is_dir():
        raise SystemExit(f"Missing source directory: {SRC}")

    prepare_dist_static()
    build_index_html()

    slide_contents: list[str] = []
    for src_name, dist_folder, out_name, _label, title, html_class in SLIDES:
        body_path = SRC_INVESTORS / src_name / "body.html"
        out_path = DIST / dist_folder / out_name
        if not body_path.is_file():
            print(f"Warning: {body_path} not found")
            slide_contents.append("<!-- missing -->")
            continue
        raw = body_path.read_text(encoding="utf-8")
        inlined = inline_rw_icons(raw, SRC)
        base_tag = '<base href="../" />\n'
        standalone = render_full_page(
            SRC,
            title=title,
            body_inner=inlined,
            base_tag=base_tag,
            html_class=html_class,
        )
        out_path.parent.mkdir(parents=True, exist_ok=True)
        out_path.write_text(standalone, encoding="utf-8")
        print(f"  built public/{dist_folder}/{out_name}")

        deck_body = remove_styles_only(remove_inline_scripts(inlined))
        slide_contents.append(deck_body)

    for rel in EXTRA_ICON_PAGES:
        p = DIST / rel
        if p.is_file() and inline_rw_icons_in_file(p, SRC):
            print(f"  inlined icons: public/{rel.as_posix()}")

    n = len(SLIDES)
    if len(slide_contents) != n:
        raise SystemExit("Internal error: slide_contents length mismatch")

    nav_block = build_nav_links(n)
    mobile_menu_block = build_mobile_menu(n)

    slide_wrappers: list[str] = []
    for i in range(n):
        label = SLIDES[i][3]
        slide_wrappers.append(
            f'    <!-- SLIDE {i}: {label} -->\n'
            f'    <div class="deck-slide" id="slide-{i}" data-slide-index="{i}">\n'
            '      <div class="deck-slide-inner" style="overflow-y:auto">\n'
            f"{slide_contents[i]}\n"
            "      </div>\n"
            "    </div>"
        )

    head_inner = load_head_fragment(SRC, "", "Roofwander — Investor Overview", "assets/deck.css")
    head = f"""<!DOCTYPE html>
<html lang="en" class="deck-root">
<head>
{head_inner}
</head>
<body>

<button class="deck-arrow deck-arrow--prev" type="button" aria-label="Previous slide"><span class="rw-icon" data-rw-icon="chevron-left" aria-hidden="true"></span></button>
<button class="deck-arrow deck-arrow--next" type="button" aria-label="Next slide"><span class="rw-icon" data-rw-icon="chevron-right" aria-hidden="true"></span></button>

<nav class="deck-nav" aria-label="Section navigation">
{nav_block}
</nav>

{mobile_menu_block}

<div class="deck-shell">
  <div class="deck-track">
"""

    foot = """
  </div>
</div>

<div class="deck-bottom-bar" aria-label="Slide navigation">
  <button class="deck-bottom-bar-btn deck-bottom-bar-prev" type="button" aria-label="Previous slide">
    <span class="rw-icon" data-rw-icon="chevron-left" aria-hidden="true"></span> Prev
  </button>
  <div class="deck-bottom-bar-progress">
    <span class="deck-bottom-bar-counter">1 / """ + str(n) + """</span>
    <div class="deck-bottom-bar-track"><div class="deck-bottom-bar-fill"></div></div>
  </div>
  <button class="deck-bottom-bar-btn deck-bottom-bar-next" type="button" aria-label="Next slide">
    Next <span class="rw-icon" data-rw-icon="chevron-right" aria-hidden="true"></span>
  </button>
</div>
<div class="deck-swipe-hint" aria-hidden="true">Swipe to navigate</div>

<script src="assets/deck-behaviors.js" defer></script>
<script src="assets/mobile-nav.js" defer></script>
<script src="assets/deck.js" defer></script>
</body>
</html>
"""

    out = head + "\n".join(slide_wrappers) + foot
    out = inline_rw_icons(out, SRC)
    built_slides = out.count('class="deck-slide"')
    if built_slides != n:
        raise SystemExit(f"Slide count mismatch: SLIDES={n}, deck-slide occurrences={built_slides}")
    (DIST / "deck.html").write_text(out, encoding="utf-8")
    print(f"Built public/deck.html ({n} slides)")


if __name__ == "__main__":
    main()
