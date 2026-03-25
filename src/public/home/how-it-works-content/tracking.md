---
title: Tracking
description: How we track what happens between visit and booking. Simple event flow, funnels, and ads.
order: 7
---

# Tracking

## Section 7 — Tracking

Traffic source alone isn't enough. The real question: what happens between first visit and booking? Where do users drop? Which listings attract attention but never lead to contact? Which traffic sources bring users who actually engage?

## Flow

We send tracking events through one simple chain, then split them to analytics and ads.

<div class="doc-flow">
  <span class="doc-flow-item">User actions<br><small>(visits, searches, clicks)</small></span>
  <span class="doc-flow-arrow">↓</span>
  <span class="doc-flow-item">Tracking events<br><small>sent from the product</small></span>
  <span class="doc-flow-arrow">↓</span>
  <span class="doc-flow-item highlight">Google Tag Manager</span>
  <span class="doc-flow-arrow">↓</span>
  <div class="doc-flow-supply">
    <span class="doc-flow-item">Analytics<br><small>funnels & behavior</small></span>
    <span class="doc-flow-item">Ad platforms<br><small>campaigns & retargeting</small></span>
  </div>
</div>

## Event Levels

- **Traffic** — Landing page views, where visitors come from
- **Discovery** — Search, filters used, listing views
- **Interest** — Saves, clicks on contact or checkout
- **Conversion** — Booking completed

## Why this matters

Tracking these levels helps us see where people drop, which listings get attention, and which traffic sources bring visitors who actually book.

We use a simple setup: events go into Google Tag Manager, which then sends them both to our analytics tool and to ad platforms for campaigns and retargeting. This helps us bring interested travelers back to the platform without adding extra work to the product.

## Consent

Tracking for analytics and retargeting only runs after users give consent. A banner lets visitors choose which categories to allow (for example basic analytics vs. ads). Until consent is granted, events are limited or not sent, and ad audiences are not built. Users can change their choices at any time, and tracking follows those settings.

<aside class="doc-see-also doc-see-also-mobile-only">
  <p class="doc-see-also-title">See also</p>
  <ul>
    <li><a href="./lifecycle-communication">Lifecycle Communication</a> — Emails at each step</li>
    <li><a href="./discovery-and-growth">Discovery & Growth</a> — How listings are found</li>
  </ul>
</aside>
