#!/usr/bin/env python3
"""Build how-it-works.html from Markdown source in how-it-works-content/."""

import sys
from pathlib import Path

BASE = Path(__file__).parent
MD_PATH = BASE / "how-it-works-content" / "how-roofwander-works-full.md"
OUT_PATH = BASE / "how-it-works.html"


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

    if not MD_PATH.exists():
        print(f"Source not found: {MD_PATH}", file=sys.stderr)
        sys.exit(1)

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

    page = f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>How it works — Roofwander</title>
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
<link rel="stylesheet" href="assets/deck.css" />
</head>
<body class="home-page how-page">

  <header class="home-topbar">
    <a href="index.html" class="home-logo">Roofwander</a>
    <nav class="home-nav" aria-label="Site">
      <a href="index.html">Home</a>
    </nav>
  </header>

  <main class="home-main how-main">
    <header class="how-hero">
      <a href="index.html" class="how-back">← Back to home</a>
      <h1 class="how-title">How it works</h1>
      <p class="how-subtitle">
        End-to-end overview: the marketplace, revenue, discovery, booking, trust, tracking, and lifecycle communication.
      </p>
    </header>
{toc_block}
    <article class="doc-content">
{article_html}
    </article>
  </main>

</body>
</html>
"""
    OUT_PATH.write_text(page, encoding="utf-8")
    print(f"Wrote {OUT_PATH.relative_to(BASE)}")


if __name__ == "__main__":
    main()
