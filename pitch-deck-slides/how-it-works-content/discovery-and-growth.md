---
title: Discovery & Growth
description: How travelers find listings. Search, content, flywheel. Multilanguage model, locales, city coverage.
order: 5
---

# Discovery & Growth

## Section 5 — Discovery & Growth

How travelers discover rooftop tents and how the marketplace grows. Multiple channels feed the same goal: visit → listing → booking.

<div class="doc-flow">
  <span class="doc-flow-item">Search / Content / Ads</span>
  <span class="doc-flow-arrow">↓</span>
  <span class="doc-flow-item">Platform visit</span>
  <span class="doc-flow-arrow">↓</span>
  <span class="doc-flow-item">Listings discovered</span>
  <span class="doc-flow-arrow">↓</span>
  <span class="doc-flow-item highlight">Booking request</span>
</div>

## Channels

We use four main channels:

**Search** — Primary entry. Location, dates, intent. Results filter by geography, availability, brand, tent type, capacity (filters can appear in the URL). Curated carousels (family, hardshell, couples) for common use cases.

**Content** — Guides, comparisons, destination articles. Early-funnel queries. Links to listings.

**Location & brand** — City configs (Paris, Lyon, Brussels, Berlin, etc.) with pre-computed bounds. Footer and sitemap link to search. Brand filters available; no dedicated brand URL paths.

**Paid** — Search ads, retargeting, campaigns.

## Flywheel

<div class="doc-flow">
  <span class="doc-flow-item">More listings</span>
  <span class="doc-flow-arrow">↓</span>
  <span class="doc-flow-item">More search visibility</span>
  <span class="doc-flow-arrow">↓</span>
  <span class="doc-flow-item">More travelers</span>
  <span class="doc-flow-arrow">↓</span>
  <span class="doc-flow-item">More bookings</span>
  <span class="doc-flow-arrow">↓</span>
  <span class="doc-flow-item highlight">More owners join</span>
</div>

Listings alone aren't enough for SEO. Users search earlier: brands, road trip ideas, comparisons. The platform builds an ecosystem—location pages, guides, blog—to capture those intents. Internal links connect everything.

**Structured data** — Brand, model, tent type, capacity, vehicle compatibility. Powers filters and search. See Marketplace Model.

**SEO** — Sitemap index: general, listings, blog, guides, locations. New listings auto-added. Push-based: IndexNow (Bing), Google Indexing API. Internal links: guides → listings, blog → marketplace.

## Multilanguage Model

**Locales** — Seven languages (en, de, fr, es, nl, it, pt). URLs use `/:locale/`. Detected from path, then Accept-Language, then browser. Each locale maps to a geographic focus for landing page listings.

**City coverage** — Pre-configured city searches with bounds. Footer and sitemap link to search. Locale-specific (e.g. Brussels for `nl` and `fr`). The platform focuses on France, Belgium, Germany, and Portugal.

<aside class="doc-see-also doc-see-also-mobile-only">
  <p class="doc-see-also-title">See also</p>
  <ul>
    <li><a href="./booking-flow">Booking Flow</a> — User journey</li>
    <li><a href="./revenue-model">Revenue Model</a> — Commission, affiliate</li>
    <li><a href="./lifecycle-communication">Lifecycle Communication</a> — Emails</li>
  </ul>
</aside>
