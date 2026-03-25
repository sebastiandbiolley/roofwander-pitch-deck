---
title: How Roofwander Works — Full
description: End-to-end overview of the marketplace: problem, insight, model, revenue, discovery, booking, tracking, and communication.
order: 8
---

# How Roofwander Works — Full

## TL;DR

Roofwander is a marketplace for rooftop tent travel. It connects people who own rooftop tents with travelers who want to experience rooftop camping without buying the equipment.

Supply on the platform comes from two sources:

- Private owners renting out tents they already own (typically one or a few listings)
- Professional partners such as outdoor shops, resellers, and rental companies (can list multiple units)

Travelers can search, compare, and book rooftop tents locally for road trips, festivals, and outdoor travel.

Roofwander generates revenue through rental commissions on bookings and affiliate commissions when travelers later purchase equipment through partner brands.

Roofwander operates at the intersection of three systems:

- **A rental marketplace** — Connects owners and travelers; bookings generate commission.
- **A product discovery layer** — Connects rental activity, structured listing data, and reviews with equipment discovery. Users explore tents by brand, model, and real-world experience instead of only manufacturer descriptions; affiliate partnerships extend to brands and gear.
- **A growth infrastructure** — SEO, tracking, lifecycle communication, and product systems.

<div class="doc-flow">
  <span class="doc-flow-item">Owners & partners</span>
  <span class="doc-flow-arrow">↓</span>
  <span class="doc-flow-item">Listings</span>
  <span class="doc-flow-arrow">↓</span>
  <span class="doc-flow-item">Travelers</span>
  <span class="doc-flow-arrow">↓</span>
  <span class="doc-flow-item">Bookings</span>
  <span class="doc-flow-arrow">↓</span>
  <span class="doc-flow-item highlight">Platform commission</span>
</div>

<div class="doc-flow">
  <span class="doc-flow-item">Product discovery<br><small>tent reviews, comparisons</small></span>
  <span class="doc-flow-arrow">↓</span>
  <span class="doc-flow-item highlight">Affiliate purchases</span>
</div>

---

## The Problem

Rooftop tents are becoming popular for road trips and outdoor travel. However, the market remains fragmented: many tents sit unused while travelers struggle to access them.

Most rooftop tents are used only 10–30 nights per year. Three core issues:

- **Idle equipment** — Rooftop tents cost €1,200–4,000+ and sit unused most of the year. Renting privately is hard; owners worry about damage, trust, and logistics.
- **Limited rental options** — For travelers, renting is difficult and options are scarce. Professional operators can be expensive, availability is tied to specific depots and dates, and fleets carry only a few models.
- **Difficult purchase decisions** — Buying is confusing without hands-on experience. Most decisions rely on specs and marketing, with limited independent reviews and large price differences between models.

This creates a simple gap: unused rooftop tents on one side, travelers wanting to try rooftop camping on the other. A marketplace can connect these two sides.

---

## The Insight

Rooftop tents are experiential: travelers rarely know if a tent fits from specs alone. Renting functions as a try-before-buy step. The two diagrams below are the same story at user level, then at platform level.

### Rent → research → buy (user journey)

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

### The Marketplace Loop (economic engine)

Supply → demand → data → commerce → more supply.

<div class="doc-flow">
  <span class="doc-flow-item">More rooftop tents listed</span>
  <span class="doc-flow-arrow">↓</span>
  <span class="doc-flow-item">More locations available</span>
  <span class="doc-flow-arrow">↓</span>
  <span class="doc-flow-item">More travelers find rentals</span>
  <span class="doc-flow-arrow">↓</span>
  <span class="doc-flow-item">More bookings</span>
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

## Marketplace Model

Supply on Roofwander comes from two provider types: private owners, who usually manage one or a few listings, and professional partners, who can list multiple units.

### Listings

Each rooftop tent is represented by a listing. The creation process collects:

- photos, location, description, price per night, availability
- rooftop tent–specific fields (vehicle fit, mounting type) for compatibility
- price variants — same listing, different prices (e.g. tent-only vs. tent + gear)

Listings are discovered via search, location, or curated sections. A payouts account is required before a listing becomes bookable.

### Structured listing data

Providers submit structured fields — brand, model, tent type, capacity, vehicle compatibility. This powers filters, search, and product comparison; it also supports the rent→buy loop (The Insight) and SEO. Structured listing data connects rentals with specific tent models and brands, enabling comparisons and product discovery.

<div class="doc-flow">
  <span class="doc-flow-item">Listing creation</span>
  <span class="doc-flow-arrow">↓</span>
  <span class="doc-flow-item">Structured data<br><small>(brand, model, type)</small></span>
  <span class="doc-flow-arrow">↓</span>
  <span class="doc-flow-item">Search & filters</span>
  <span class="doc-flow-arrow">↓</span>
  <span class="doc-flow-item highlight">Brand pages, affiliate discovery</span>
</div>

---

## Revenue Model

Two complementary revenue streams:

<div class="doc-flow">
  <div class="doc-flow-supply">
    <span class="doc-flow-item">Rental<br><small>marketplace</small></span>
    <span class="doc-flow-item">Discovery<br><small>brands, guides</small></span>
  </div>
  <span class="doc-flow-arrow">↓</span>
  <div class="doc-flow-supply">
    <span class="doc-flow-item highlight">Commission</span>
    <span class="doc-flow-item highlight">Affiliate</span>
  </div>
</div>

### Rental

Commission on completed bookings. Traveler pays full price; commission deducted from provider payout.

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

### Affiliate

Revenue from affiliate purchases follows the same user journey described in The Insight (rent → research → buy). Rentals create high-intent buyers; brands get exposure and qualified traffic.

---

## Discovery & Growth

Most growth channels ultimately feed the same journey: visit → listing → booking. Growth flywheel = The Marketplace Loop (The Insight).

### Discovery infrastructure (SEO)

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

### Discovery channels

- **Search** — Location, dates, intent. Filters: geography, availability, brand, tent type, capacity. Curated carousels.
- **Content** — Guides, comparisons, destinations. Early-funnel; links to listings.
- **Location & brand** — Brand and location discovery are supported through structured filters, city configurations (Paris, Lyon, Brussels, Berlin, etc.), and internal linking.
- **Paid** — Search ads, retargeting, campaigns.

Listing pages and content rank in search; internal links connect to listings.

### Supply acquisition

Rooftop tents join the marketplace through several channels: direct outreach to owners, partnerships with outdoor shops and resellers, community engagement in rooftop tent and overlanding groups, owner-to-owner referrals, and presence at outdoor and travel events. As supply grows geographically, the platform becomes more useful for travelers, reinforcing the Marketplace Loop (The Insight).

### Multilanguage & geography

Seven languages (en, de, fr, es, nl, it, pt), URLs `/:locale/`. Pre-configured city searches; platform focus: France, Belgium, Germany, Portugal.

---

## Booking Flow

The booking process connects travelers with owners or professional partners through a structured request and confirmation flow. The platform handles communication, availability, and payment.

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

### Steps

1. **Search** — Traveler searches by location, dates, or tent characteristics. Results can be filtered by geography, availability, and brand.
2. **Listing page** — Photos, description, brand/model, price per night, availability calendar, pickup location. Traveler reviews before requesting.
3. **Request** — Traveler submits dates, quantity, optional message. Request is sent to the owner or partner. Checkout creates a transaction; PaymentIntent is created; traveler has 15 minutes to complete payment.
4. **Owner confirmation** — Owner accepts or declines from the inbox. They can message the traveler first. On accept, payment is captured; on decline, full refund.
5. **Payment** — When accepted, payment is held by the platform. Payout is released 2 days after the booking end. Technical details are handled in the payments system.
6. **Rental** — Traveler and owner coordinate pickup and return. Once complete, the transaction is recorded; both can leave reviews within 7 days.

Internally, transactions move through a series of platform states:

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

Deposits, cancellations, and trust mechanisms: Trust & Safety below.

---

## Trust & Safety

Trust is critical in peer-to-peer rentals. The platform includes several mechanisms to protect both travelers and owners:

- **Identity verification** — Account verification for owners and travelers.
- **Reviews** — Both parties can leave reviews within 7 days after a rental; reviews appear on the listing and on both parties' profiles.
- **Security deposit** — €400 charged to the traveler's card at booking and held until the rental ends; then released in full or used in case of damage or dispute.
- **Secure payments** — Payments use a payouts platform (e.g. Stripe Connect). Flow: payment intent created → confirmed client-side → captured on accept → payout on complete.
- **Cancellation policies** — Before acceptance: full refund to traveler. After acceptance: policy applies (e.g. partial refund or credit depending on timing).
- **Disputes** — Handled through the transaction engine and support; evidence from messages, dates, and payouts can be reviewed so outcomes reflect what happened on the platform.

---

## Tracking

The data layer powers growth: **behavior → data → marketing → bookings**. Tracking shows where users drop and which channels or listings lead to bookings, so we can optimise supply and demand acquisition. Events are emitted from the product and routed through Google Tag Manager, which acts as a central dispatch layer to analytics tools and advertising platforms. This keeps product instrumentation stable while analytics and marketing integrations can change over time.

### Product infrastructure flow

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

### Event levels

Traffic (landing, source) → Discovery (search, filters, listing views) → Interest (saves, contact, checkout) → Conversion (booking completed).

### Consent

Tracking for analytics and retargeting only runs after users give consent. A banner lets visitors choose which categories to allow (for example basic analytics vs. ads). Until consent is granted, events are limited or not sent, and ad audiences are not built. Users can change their choices at any time, and tracking follows those settings.

---

## Lifecycle Communication

Lifecycle communication covers all emails and messages sent during the user journey. Messages are triggered by user events, not by a fixed calendar. Because the platform tracks user actions, communication can be triggered by behavior rather than by scheduled campaigns, so messages stay relevant to the user's current stage in the booking journey.

### Types of communication

- **Transactional** — Required system emails (booking, payments, account).
- **Event-based** — Follow-up messages based on behavior.
- **Retargeting** — Ads and messages before signup, based on tracking events.

### Transactional emails

Transactional emails are tied to product actions and are required for the marketplace to function. They include booking confirmations, payment and payout updates, and account notifications (signup, password reset, email verification). For bookings, they roughly follow this sequence: request received, request confirmed or declined, reminder before pickup, and a completion email with a review request.

### Event-based emails

Event-based emails respond to behavior and keep users moving forward: onboarding after signup, reminders after saving listings, follow-ups after viewing listings without contacting anyone.

### Supply-side lifecycle

Owners also receive lifecycle communication: onboarding guidance after listing creation, reminders to update availability, suggestions to improve listings, and booking notifications and follow-ups. This supports supply quality and responsiveness.

### Retargeting and full lifecycle

Part of the journey happens before signup. Many visitors browse locations and listings without creating an account.

When consent allows it, events from the tracking system are used to build audiences in ad platforms. Retargeting then shows ads to people who viewed listings earlier or started but did not complete a booking. Email tools, tracking, and ads work together.

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

