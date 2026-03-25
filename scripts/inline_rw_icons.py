"""Replace empty <span class="... rw-icon ..." data-rw-icon="name"></span> with inlined SVG.

Runs at build time so Cloudflare Pages (and file://) need no fetch(). Idempotent: skips spans
that already contain <svg>. Strips data-rw-icon*, data-rw-icon-src, data-rw-icon-pack from the tag.
"""

from __future__ import annotations

import re
from pathlib import Path

DEFAULT_LUCIDE_DIR = Path("assets/icons/lucide")


def _strip_svg_decorations(svg: str) -> str:
    t = svg.strip()
    t = re.sub(r"^<!--.*?-->\s*", "", t, flags=re.DOTALL)
    m = re.search(r"<svg([^>]*)>", t, flags=re.IGNORECASE | re.DOTALL)
    if not m:
        return t
    rest = m.group(1)
    rest = re.sub(r'\s+width="[^"]*"', "", rest)
    rest = re.sub(r'\s+height="[^"]*"', "", rest)
    rest = re.sub(r'\s+class="[^"]*"', "", rest)
    return ("<svg" + rest + ">" + t[m.end() :]).strip()


def _strip_placeholder_attrs(open_tag: str) -> str:
    """open_tag is '<span ...>' ; remove loader/build attributes."""
    if not open_tag.lower().startswith("<span"):
        return open_tag
    inner = open_tag[5:-1]
    inner = re.sub(r'\s+data-rw-icon="[^"]*"', "", inner)
    inner = re.sub(r'\s+data-rw-icon-src="[^"]*"', "", inner)
    inner = re.sub(r'\s+data-rw-icon-pack="[^"]*"', "", inner)
    return "<span" + inner + ">"


def _resolve_svg_path(root: Path, open_tag: str) -> Path | None:
    m_src = re.search(r'data-rw-icon-src="([^"]+)"', open_tag)
    if m_src:
        p = (root / m_src.group(1).strip().lstrip("/")).resolve()
        return p if p.is_file() else None

    m_name = re.search(r'data-rw-icon="([^"]+)"', open_tag)
    if not m_name:
        return None
    name = m_name.group(1)
    m_pack = re.search(r'data-rw-icon-pack="([^"]+)"', open_tag)
    if m_pack:
        pack_dir = Path(m_pack.group(1).strip().rstrip("/"))
        p = (root / pack_dir / f"{name}.svg").resolve()
    else:
        p = (root / DEFAULT_LUCIDE_DIR / f"{name}.svg").resolve()
    return p if p.is_file() else None


def inline_rw_icons(html: str, root: Path) -> str:
    root = root.resolve()
    i = 0
    out: list[str] = []
    lo = html.lower()

    while i < len(html):
        a = lo.find('data-rw-icon="', i)
        b = lo.find('data-rw-icon-src="', i)
        if a == -1 and b == -1:
            out.append(html[i:])
            break
        if a == -1:
            idx = b
        elif b == -1:
            idx = a
        else:
            idx = min(a, b)

        span_start = html.rfind("<span", i, idx)
        if span_start == -1:
            out.append(html[i : idx + 1])
            i = idx + 1
            continue

        tag_end = html.find(">", idx)
        if tag_end == -1:
            out.append(html[i:])
            break
        open_tag = html[span_start : tag_end + 1]

        if "rw-icon" not in open_tag:
            out.append(html[i : idx + 1])
            i = idx + 1
            continue

        after_gt = tag_end + 1
        m_close = re.match(r"\s*</span>", html[after_gt:], re.IGNORECASE)
        if not m_close:
            out.append(html[i : idx + 1])
            i = idx + 1
            continue

        inner_slice = html[after_gt : after_gt + m_close.start()]
        if "<svg" in inner_slice.lower():
            out.append(html[i : after_gt + m_close.end()])
            i = after_gt + m_close.end()
            continue

        svg_path = _resolve_svg_path(root, open_tag)
        if not svg_path:
            print(f"Warning: missing icon for {open_tag[:120]}...")
            out.append(html[i : after_gt + m_close.end()])
            i = after_gt + m_close.end()
            continue

        raw = svg_path.read_text(encoding="utf-8")
        svg = _strip_svg_decorations(raw)
        new_open = _strip_placeholder_attrs(open_tag)
        replacement = new_open + svg + "</span>"
        out.append(html[i:span_start])
        out.append(replacement)
        i = after_gt + m_close.end()

    return "".join(out)


def inline_rw_icons_in_file(path: Path, root: Path) -> bool:
    if not path.is_file():
        return False
    try:
        if path.stat().st_size > 800_000:
            return False
    except OSError:
        return False
    text = path.read_text(encoding="utf-8")
    if "data-rw-icon" not in text and "data-rw-icon-src" not in text:
        return False
    new_text = inline_rw_icons(text, root)
    if new_text != text:
        path.write_text(new_text, encoding="utf-8")
        return True
    return False
