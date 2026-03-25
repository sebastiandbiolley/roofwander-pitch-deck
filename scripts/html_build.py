"""Shared HTML shell helpers: head fragment injection and full page wrapper."""

from __future__ import annotations

from pathlib import Path


def load_head_fragment(root: Path, base_tag: str, title: str, css_href: str) -> str:
    frag = (root / "partials" / "head-fragment.html").read_text(encoding="utf-8")
    return (
        frag.replace("{{BASE_TAG}}", base_tag)
        .replace("{{TITLE}}", title)
        .replace("{{CSS_HREF}}", css_href)
        .rstrip("\n")
    )


def render_full_page(
    root: Path,
    *,
    title: str,
    body_inner: str,
    css_href: str = "assets/deck.css",
    base_tag: str = "",
    html_class: str | None = None,
    body_class: str | None = None,
) -> str:
    """Wrap inner body markup in a complete HTML document with shared head.

    `root` is the directory that contains `partials/head-fragment.html` (typically `src/`).
    """
    head = load_head_fragment(root, base_tag, title, css_href)
    html_attr = f' class="{html_class}"' if html_class else ""
    body_attr = f' class="{body_class}"' if body_class else ""
    return f"""<!DOCTYPE html>
<html lang="en"{html_attr}>
<head>
{head}
</head>
<body{body_attr}>

{body_inner.strip()}
</body>
</html>
"""
