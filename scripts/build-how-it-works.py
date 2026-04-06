#!/usr/bin/env python3
"""Build how-it-works.html from Markdown under src/public/home/how-it-works-content/."""

from __future__ import annotations

import shutil
import sys
from pathlib import Path

_SCRIPT_DIR = Path(__file__).resolve().parent
if str(_SCRIPT_DIR) not in sys.path:
    sys.path.insert(0, str(_SCRIPT_DIR))

from html_build import render_full_page
from inline_rw_icons import inline_rw_icons

ROOT = _SCRIPT_DIR.parent
SRC = ROOT / "src"
DIST = ROOT / "public"

MD_PATH = SRC / "public" / "home" / "how-it-works-content" / "how-roofwander-works-full.md"
OUT_PATH = DIST / "how-it-works.html"


def _sync_tree(src: Path, dst: Path) -> None:
    if not src.is_dir():
        return
    shutil.copytree(src, dst, dirs_exist_ok=True)


def ensure_dist_shared_static() -> None:
    """So how-it-works.html resolves assets/deck.css when this script runs alone."""
    DIST.mkdir(parents=True, exist_ok=True)
    _sync_tree(SRC / "assets", DIST / "assets")
    _sync_tree(ROOT / "data", DIST / "data")


def strip_frontmatter(text: str) -> str:
    if not text.startswith("---"):
        return text
    end = text.find("\n---", 3)
    if end == -1:
        return text
    return text[end + 4 :].lstrip("\n")


def strip_leading_h1(text: str) -> str:
    """Remove the first # line (page title duplicates the HTML hero)."""
    lines = text.splitlines()
    if not lines:
        return text
    if lines[0].startswith("# ") and not lines[0].startswith("##"):
        lines = lines[1:]
        while lines and not lines[0].strip():
            lines = lines[1:]
        return "\n".join(lines) + ("\n" if text.endswith("\n") else "")
    return text


def main() -> None:
    try:
        import markdown
        from markdown.extensions.toc import TocExtension
    except ImportError:
        print(
            "Missing dependency: pip install markdown",
            file=sys.stderr,
        )
        sys.exit(1)

    if not SRC.is_dir():
        print(f"Missing source directory: {SRC}", file=sys.stderr)
        sys.exit(1)

    if not MD_PATH.exists():
        print(f"Source not found: {MD_PATH}", file=sys.stderr)
        sys.exit(1)

    ensure_dist_shared_static()

    raw = MD_PATH.read_text(encoding="utf-8")
    body_md = strip_leading_h1(strip_frontmatter(raw))

    md = markdown.Markdown(
        extensions=[
            "markdown.extensions.extra",
            "markdown.extensions.md_in_html",
            TocExtension(
                title="",
                permalink=False,
                anchorlink=False,
                toc_depth="2-2",
            ),
        ]
    )
    article_html = md.convert(body_md)
    toc_html = md.toc

    toc_block = ""
    if toc_html.strip():
        toc_block = f"""
    <nav class="how-toc" aria-label="On this page">
      <p class="how-toc-title">On this page</p>
      {toc_html}
    </nav>"""

    body_inner = f"""  <header class="home-topbar">
    <a href="index.html" class="home-logo">Roofwander</a>
    <nav class="home-nav" aria-label="Site">
      <a href="index.html">Home</a>
    </nav>
  </header>

  <main class="home-main how-main">
    <header class="how-hero">
      <a href="index.html" class="how-back">← Back to home</a>
      <h1 class="how-title">How Roofwander works</h1>
      <p class="how-subtitle">
        The marketplace, product discovery, and growth systems, explained end to end.
      </p>
    </header>
    <div class="how-layout">
{toc_block}
      <article class="doc-content">
{article_html}
      </article>
    </div>
  </main>
"""

    page = render_full_page(
        SRC,
        title="How it works | Roofwander",
        body_inner=body_inner,
        body_class="home-page how-page",
    )
    page = inline_rw_icons(page, SRC)
    OUT_PATH.write_text(page, encoding="utf-8")
    print(f"Wrote {OUT_PATH.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
