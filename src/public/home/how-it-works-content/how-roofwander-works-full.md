---
title: How Roofwander Works
description: End-to-end overview of the three systems that power Roofwander: the rental marketplace, the product discovery layer, and the growth infrastructure.
order: 8
---

# How Roofwander Works

## Overview

Roofwander is a marketplace for rooftop tent travel. It connects tent owners with travelers who want to experience rooftop camping without buying the equipment first.

A rooftop tent costs €1,200–4,000+ and typically sits unused 90% of the year. Meanwhile, travelers curious about rooftop camping have almost no way to try it. Buying without experience is risky, and rental options barely exist. Roofwander solves both sides: owners earn from their idle gear, and travelers get access to an experience that was previously out of reach.

The platform is built around three interconnected systems:

- **The Marketplace.** The core rental engine: listings, bookings, payments, messaging, and trust. This is where supply meets demand. Revenue comes from a commission on every completed booking.
- **Product Discovery.** Structured listing data (brand, model, type) combined with rental reviews creates a product research layer. Travelers explore tents through real-world experience, then buy via affiliate partners. Revenue comes from affiliate commissions.
- **Growth Infrastructure.** SEO, tracking, lifecycle emails, retargeting, and multilanguage support. These systems acquire users, convert visits into bookings, and keep both sides engaged over time.

### The marketplace loop

These three systems create a self-reinforcing cycle. More supply generates more bookings, which produce more data, which improves discovery, which attracts more supply and partners.

<div class="doc-flow">
  <span class="doc-flow-item">More rooftop tents listed</span>
  <span class="doc-flow-arrow">↓</span>
  <span class="doc-flow-item">More locations covered</span>
  <span class="doc-flow-arrow">↓</span>
  <span class="doc-flow-item">More travelers find what they need</span>
  <span class="doc-flow-arrow">↓</span>
  <span class="doc-flow-item">More bookings completed</span>
  <span class="doc-flow-arrow">↓</span>
  <span class="doc-flow-item">More reviews and usage data</span>
  <span class="doc-flow-arrow">↓</span>
  <span class="doc-flow-item">Better product discovery</span>
  <span class="doc-flow-arrow">↓</span>
  <span class="doc-flow-item">More tent purchases (affiliate)</span>
  <span class="doc-flow-arrow">↓</span>
  <span class="doc-flow-item highlight">More owners and partners join</span>
</div>

---

## The Marketplace

The marketplace is the core of Roofwander. It handles everything from listing a tent to completing a rental: search, bookings, payments, communication, and trust.

### Supply

Supply comes from two provider types:

- **Private owners** renting out tents they already own, typically one or a few listings.
- **Professional partners** such as outdoor shops, resellers, and rental companies, listing multiple units and often serving as local pickup points.

Providers are acquired through direct outreach, partnerships with outdoor retailers, community engagement in rooftop tent and overlanding groups, owner-to-owner referrals, and presence at outdoor and travel events.

### Listings

Each rooftop tent is represented by a listing. The creation flow collects:

- **Essentials.** Photos, location, description, price per night, and availability.
- **Tent-specific fields.** Vehicle compatibility, mounting type, and capacity. These enable filters and search matching.
- **Price variants.** A single listing can have multiple prices (e.g. tent-only vs. tent + camping gear).

Listings are discovered through search, location browsing, or curated sections. A Stripe payouts account must be connected before a listing goes live.

### Structured data

When creating a listing, providers fill structured fields: brand, model, tent type, capacity, and vehicle compatibility. This data powers the search and filter system and links every rental to a specific tent product. It is the foundation of Product Discovery.

<div class="doc-flow">
  <span class="doc-flow-item">Listing creation</span>
  <span class="doc-flow-arrow">↓</span>
  <span class="doc-flow-item">Structured data<br><small>(brand, model, type)</small></span>
  <span class="doc-flow-arrow">↓</span>
  <span class="doc-flow-item">Search & filters</span>
  <span class="doc-flow-arrow">↓</span>
  <span class="doc-flow-item highlight">Brand pages, product discovery</span>
</div>

### Booking flow

The booking process connects travelers with providers through a request-and-confirmation model. The platform handles messaging, availability, and payment at each step.

<div class="doc-flow">
  <span class="doc-flow-item">Traveler searches listings</span>
  <span class="doc-flow-arrow">↓</span>
  <span class="doc-flow-item">Listing page viewed</span>
  <span class="doc-flow-arrow">↓</span>
  <span class="doc-flow-item">Booking request sent</span>
  <span class="doc-flow-arrow">↓</span>
  <span class="doc-flow-item">Owner reviews request</span>
  <span class="doc-flow-arrow">↓</span>
  <span class="doc-flow-item">Booking confirmed</span>
  <span class="doc-flow-arrow">↓</span>
  <span class="doc-flow-item">Payment processed</span>
  <span class="doc-flow-arrow">↓</span>
  <span class="doc-flow-item highlight">Rental takes place</span>
</div>

**Step by step:**

1. **Search.** Traveler searches by location, dates, or tent characteristics. Results can be filtered by geography, availability, brand, and capacity.
2. **Listing page.** Shows photos, description, brand/model info, price per night, availability calendar, and pickup location.
3. **Request.** Traveler selects dates and quantity, adds an optional message, and submits. A Stripe PaymentIntent is created; the traveler has 15 minutes to complete payment.
4. **Owner confirmation.** The owner reviews the request from their inbox. They can message the traveler before deciding. On accept, payment is captured. On decline, the traveler gets a full refund.
5. **Payment.** On acceptance, Stripe holds the payment. The provider payout is released 2 days after the booking ends.
6. **Rental.** Traveler and owner coordinate pickup and return. After completion, both can leave reviews within 7 days.

Internally, each transaction moves through a series of platform states:

<div class="doc-flow">
  <span class="doc-flow-item">Inquiry<br><small>optional message</small></span>
  <span class="doc-flow-arrow">↓</span>
  <span class="doc-flow-item">Request<br><small>15 min to pay</small></span>
  <span class="doc-flow-arrow">↓</span>
  <span class="doc-flow-item">Preauthorized<br><small>owner has 6 days to accept</small></span>
  <span class="doc-flow-arrow">↓</span>
  <span class="doc-flow-item">Accepted</span>
  <span class="doc-flow-arrow">↓</span>
  <span class="doc-flow-item">Completed</span>
  <span class="doc-flow-arrow">↓</span>
  <span class="doc-flow-item highlight">Delivered</span>
</div>

### Trust & safety

Trust is critical in peer-to-peer rentals. Both sides need to feel protected before committing. The platform includes:

- **Identity verification.** Account verification for both owners and travelers before any transaction.
- **Reviews.** Both parties can leave reviews within 7 days after a rental. Reviews appear on the listing and on user profiles, building reputation over time.
- **Security deposit.** A €400 hold is placed on the traveler's card at booking. It's released when the rental ends, or used in case of damage or dispute.
- **Secure payments.** All payments flow through Stripe Connect: payment intent created, confirmed client-side, captured on accept, payout on complete.
- **Cancellation policies.** Before acceptance: full refund. After acceptance: a policy applies depending on timing (partial refund or credit).
- **Disputes.** Handled through the transaction engine and support. Messages, dates, and payment records are available to review, so outcomes reflect what actually happened.

### Revenue: commission

The platform earns a commission on every completed booking. The traveler pays the full price; the commission is deducted from the provider's payout.

<div class="doc-stats">
  <div class="doc-stat">
    <span class="doc-stat-value">€200</span>
    <span class="doc-stat-label">Rental value</span>
  </div>
  <div class="doc-stat">
    <span class="doc-stat-value">€30</span>
    <span class="doc-stat-label">Platform commission (15%)</span>
  </div>
  <div class="doc-stat">
    <span class="doc-stat-value">€170</span>
    <span class="doc-stat-label">Provider payout</span>
  </div>
</div>

---

## Product Discovery

Rooftop tents are experiential products. Specs alone don't tell you if a tent is right for you. Renting is the natural try-before-you-buy step. Roofwander captures that journey and turns rental activity into structured product research.

### Rent, research, buy

<div class="doc-flow">
  <span class="doc-flow-item">Discover rooftop tents</span>
  <span class="doc-flow-arrow">↓</span>
  <span class="doc-flow-item">Rent a tent</span>
  <span class="doc-flow-arrow">↓</span>
  <span class="doc-flow-item">Experience rooftop camping</span>
  <span class="doc-flow-arrow">↓</span>
  <span class="doc-flow-item">Research models and brands<br><small>(reviews from real rentals)</small></span>
  <span class="doc-flow-arrow">↓</span>
  <span class="doc-flow-item highlight">Buy a rooftop tent</span>
</div>

### How structured data powers discovery

Every listing carries structured fields: brand, model, tent type, and capacity. This data is indexed across the platform to generate brand pages, model comparisons, and filterable search results. Users explore tents through real-world rental experience, not just manufacturer descriptions.

Reviews from completed rentals attach to specific tent models, building a growing layer of independent, usage-based product information with every booking.

### Revenue: affiliate

Rentals create high-intent buyers. A traveler who rents, experiences, and researches a specific model is far more likely to purchase. Affiliate partnerships with tent brands and outdoor retailers capture this conversion. Brands get qualified traffic and exposure; the platform earns a commission on each purchase.

---

## Growth Infrastructure

The systems that drive traffic to the platform, convert visitors into users, and keep both sides engaged.

### SEO & content

<div class="doc-flow">
  <span class="doc-flow-item">Search engines</span>
  <span class="doc-flow-arrow">↓</span>
  <span class="doc-flow-item">SEO pages<br><small>(blog, guides, locations)</small></span>
  <span class="doc-flow-arrow">↓</span>
  <span class="doc-flow-item">Platform visits</span>
  <span class="doc-flow-arrow">↓</span>
  <span class="doc-flow-item">Listings explored</span>
  <span class="doc-flow-arrow">↓</span>
  <span class="doc-flow-item highlight">Bookings</span>
</div>

Listing pages, guides, and location content rank in search. Internal links connect top-of-funnel content to listings. Brand and location discovery are supported through structured filters, pre-configured city searches (Paris, Lyon, Brussels, Berlin, etc.), and internal linking.

### Channels

- **Search.** Users find listings by location, dates, and intent. Filters include geography, availability, brand, tent type, and capacity. Curated carousels surface featured listings.
- **Content.** Guides, comparisons, and destination articles. Early-funnel content that links to relevant listings.
- **Paid.** Search ads, retargeting, and campaigns targeting high-intent users.

### Tracking & analytics

The data layer connects user behavior to marketing to bookings. Events are emitted from the product and routed through Google Tag Manager, which acts as a central dispatch to analytics tools and ad platforms. This decouples product instrumentation from marketing integrations. The product stays stable while marketing channels evolve.

<div class="doc-flow">
  <span class="doc-flow-item">User actions<br><small>search, listing views, clicks</small></span>
  <span class="doc-flow-arrow">↓</span>
  <span class="doc-flow-item">Tracking events<br><small>dataLayer / GTM</small></span>
  <span class="doc-flow-arrow">↓</span>
  <span class="doc-flow-item">Analytics<br><small>funnels, behavior analysis</small></span>
  <span class="doc-flow-arrow">↓</span>
  <span class="doc-flow-item">Ad platforms<br><small>retargeting audiences</small></span>
  <span class="doc-flow-arrow">↓</span>
  <span class="doc-flow-item highlight">Lifecycle communication<br><small>emails, reminders</small></span>
</div>

**Event levels:** Traffic (landing, source) → Discovery (search, filters, listing views) → Interest (saves, contact, checkout) → Conversion (booking completed).

Tracking only runs after users give consent. A cookie banner lets visitors choose which categories to allow. Until consent is granted, events are limited and retargeting audiences are not built.

### Lifecycle communication

All emails and messages are triggered by user events, not by a fixed calendar. Because the platform tracks what each user does, communication stays relevant to their current stage.

- **Transactional.** Booking confirmations, payment updates, payout notifications. Sequence: request received → confirmed/declined → reminder before pickup → completion email with review prompt.
- **Event-based.** Onboarding after signup, reminders after saving or viewing listings, follow-ups for incomplete bookings.
- **Supply-side.** Onboarding after listing creation, availability reminders, suggestions to improve listing quality.
- **Retargeting.** Many visitors browse without creating an account. When consent is given, tracking events build audiences in ad platforms. Retargeting re-engages people who viewed listings or started but did not complete a booking.

<div class="doc-flow">
  <span class="doc-flow-item">Browse listings<br><small>with or without account</small></span>
  <span class="doc-flow-arrow">↓</span>
  <span class="doc-flow-item">Events captured<br><small>view, save, contact, request</small></span>
  <span class="doc-flow-arrow">↓</span>
  <span class="doc-flow-item">Rules & audiences<br><small>email sequences + retargeting</small></span>
  <span class="doc-flow-arrow">↓</span>
  <span class="doc-flow-item highlight">Emails & ads<br><small>reminders and follow-ups</small></span>
  <span class="doc-flow-arrow">↓</span>
  <span class="doc-flow-item">Booking & reviews</span>
</div>

### Multilanguage & geography

The platform supports seven languages (en, de, fr, es, nl, it, pt) with locale-prefixed URLs (`/:locale/`). City-level search configurations are pre-built for key markets: France, Belgium, Germany, and Portugal.
