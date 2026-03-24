#!/usr/bin/env python3
"""Build deck.html with inline slide content from standalone HTML files."""

import re
from pathlib import Path

BASE = Path(__file__).parent

def extract_body(html: str) -> str:
    """Extract content between <body> and </body>, excluding body tag."""
    match = re.search(r'<body[^>]*>(.*)</body>', html, re.DOTALL | re.IGNORECASE)
    if match:
        return match.group(1).strip()
    return ""

def fix_paths(html: str, slide_name: str) -> str:
    """Fix asset paths to be relative to deck.html root."""
    path_map = {
        "investor-hero": [
            (r'src="hero-video\.mp4"', 'src="investor-hero/hero-video.mp4"'),
            (r'poster="hero-poster\.webp"', 'poster="investor-hero/hero-poster.webp"'),
        ],
        "investor-market-context": [
            (r'src="decathlon\.svg"', 'src="investor-market-context/decathlon.svg"'),
            (r'src="thule\.svg"', 'src="investor-market-context/thule.svg"'),
            (r'src="dometic\.svg"', 'src="investor-market-context/dometic.svg"'),
            (r'src="soft-shell\.webp"', 'src="investor-market-context/soft-shell.webp"'),
            (r'src="hard-shell\.webp"', 'src="investor-market-context/hard-shell.webp"'),
        ],
        "investor-solution": [
            (r'src="\.\./investor-hero/hero-video\.mp4"', 'src="investor-hero/hero-video.mp4"'),
        ],
        "investor-team": [
            (r'src="sebastian\.webp"', 'src="investor-team/sebastian.webp"'),
            (r'src="samuele\.webp"', 'src="investor-team/samuele.webp"'),
            (r'src="lucas\.webp"', 'src="investor-team/lucas.webp"'),
            (r'src="motivation-video\.mp4"', 'src="investor-team/motivation-video.mp4"'),
        ],
    }
    for key, replacements in path_map.items():
        if key in slide_name:
            for pat, repl in replacements:
                html = re.sub(pat, repl, html)
    return html

SLIDES = [
    ("investor-hero", "investor-hero/investor-hero.html"),
    ("investor-market-context", "investor-market-context/investor-market-context.html"),
    ("investor-problem", "investor-problem/investor-problem.html"),
    ("investor-solution", "investor-solution/investor-solution.html"),
    ("roofwander-system", "roofwander-system/system-diagram.html"),
    ("investor-market", "investor-market/investor-market.html"),
    ("investor-roadmap", "investor-roadmap/investor-roadmap.html"),
    ("investor-traction", "investor-traction/investor-traction.html"),
    ("investor-unit-economics", "investor-unit-economics/investor-unit-economics.html"),
    ("investor-finance", "investor-finance/investor-finance.html"),
    ("investor-team", "investor-team/investor-team.html"),
    ("investor-ask", "investor-ask/investor-ask.html"),
]

def remove_styles_only(html: str) -> str:
    """Remove embedded <style> - deck.css handles styles. Keep <script> for interactivity."""
    html = re.sub(r'<style[^>]*>.*?</style>', '', html, flags=re.DOTALL | re.IGNORECASE)
    return html

slide_contents = []
for slide_name, path in SLIDES:
    fpath = BASE / path
    if not fpath.exists():
        print(f"Warning: {fpath} not found")
        slide_contents.append("<!-- missing -->")
        continue
    html = fpath.read_text(encoding="utf-8")
    body = extract_body(html)
    body = remove_styles_only(body)
    body = fix_paths(body, slide_name)
    slide_contents.append(body)

HEAD = r'''<!DOCTYPE html>
<html lang="en" class="deck-root">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Roofwander — Investor Overview</title>
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
<link rel="stylesheet" href="assets/deck.css" />
</head>
<body>

<button class="deck-arrow deck-arrow--prev" type="button" aria-label="Previous slide">‹</button>
<button class="deck-arrow deck-arrow--next" type="button" aria-label="Next slide">›</button>

<nav class="deck-nav" aria-label="Section navigation">
  <a href="index.html" class="deck-nav-home">Home</a>
  <a href="#slide-0" data-slide="0">Hero</a>
  <a href="#slide-1" data-slide="1">Market Context</a>
  <a href="#slide-2" data-slide="2">Problem</a>
  <a href="#slide-3" data-slide="3">Solution</a>
  <a href="#slide-4" data-slide="4">System</a>
  <a href="#slide-5" data-slide="5">Market</a>
  <a href="#slide-6" data-slide="6">Roadmap</a>
  <a href="#slide-7" data-slide="7">Traction</a>
  <a href="#slide-8" data-slide="8">Unit Economics</a>
  <a href="#slide-9" data-slide="9">Finance</a>
  <a href="#slide-10" data-slide="10">Team</a>
  <a href="#slide-11" data-slide="11">Ask</a>
  <span class="deck-progress" aria-live="polite">1 / 12</span>
</nav>

<div class="deck-shell">
  <div class="deck-track">
'''

FOOT = '''
  </div>
</div>

<script src="assets/deck.js"></script>
</body>
</html>
'''

labels = ["Hero", "Market Context", "Problem", "Solution", "System", "Market", "Roadmap", "Traction", "Unit Economics", "Finance", "Team", "Ask"]
slide_wrappers = []
for i in range(12):
    slide_wrappers.append(
        "    <!-- SLIDE " + str(i) + ": " + labels[i] + " -->\n"
        "    <div class=\"deck-slide\" id=\"slide-" + str(i) + "\" data-slide-index=\"" + str(i) + "\">\n"
        "      <div class=\"deck-slide-inner\" style=\"overflow-y:auto\">\n"
        + slide_contents[i] + "\n"
        "      </div>\n"
        "    </div>"
    )

out = HEAD + "\n".join(slide_wrappers) + FOOT
(BASE / "deck.html").write_text(out, encoding="utf-8")
print("Built deck.html")
