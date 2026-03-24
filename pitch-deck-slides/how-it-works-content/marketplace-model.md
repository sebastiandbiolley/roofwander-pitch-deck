---
title: Marketplace Model
description: How listings and bookings work. Technical flow, payments, discovery.
order: 3
---

# Marketplace Model

## Section 3 — Marketplace Model

How listings, bookings, and the transaction flow work. Supply and revenue are covered in separate sections.

## Listings

Each rooftop tent is represented by a listing. The creation process collects:

- photos, location, description, price per night, availability
- rooftop tent–specific fields (vehicle fit, mounting type) for compatibility
- price variants — same listing, different prices (e.g. tent-only vs. tent + gear)

Listings are discovered via search, location, or curated sections. A Stripe account is required before a listing becomes bookable.

## Structured Listing Data

Providers submit structured fields during creation—brand, model, tent type (soft/hard shell), capacity, vehicle compatibility. This powers filters, search, brand pages, and product discovery. The same data can link rentals to equipment pages, supporting the rent → research → buy loop.

<div class="doc-flow">
  <span class="doc-flow-item">Listing creation</span>
  <span class="doc-flow-arrow">↓</span>
  <span class="doc-flow-item">Structured data<br><small>(brand, model, type)</small></span>
  <span class="doc-flow-arrow">↓</span>
  <span class="doc-flow-item">Search & filters</span>
  <span class="doc-flow-arrow">↓</span>
  <span class="doc-flow-item highlight">Brand pages, affiliate discovery</span>
</div>

## Booking Flow

See [Booking Flow](./booking-flow) for the user journey. Technical flow: Inquiry (optional message before payment) → Request (traveler has 15 min to pay) → Preauthorized (owner has 6 days to accept) → Accepted → Completed (2 days after rental end) → Delivered. Both parties can leave reviews within 7 days; reviews appear on the listing and on both parties' profiles. Cancellations before acceptance: full refund to traveler. After acceptance, cancellation policy applies (e.g. partial refund or credit depending on timing).

## Payments (Stripe)

Payments use Stripe Connect (PCI-DSS compliant). Flow: PaymentIntent created → confirmed client-side → captured on accept → payout on complete. Security deposit is €400: charged to the traveler's card at booking and held until the rental ends; then released in full or used in case of damage or dispute.

## Trust & Safety

Several mechanisms reduce risk for both sides:

- Reviews for both traveler and provider after each booking.
- Clear transaction states and timestamps for requests, payments, and payouts.
- Security deposit held during the rental in case of damage or disputes.

Disputes are handled through the transaction engine and support tools: evidence from messages, dates, and payouts can be reviewed so that outcomes are based on what actually happened on the platform.

<aside class="doc-see-also doc-see-also-mobile-only">
  <p class="doc-see-also-title">See also</p>
  <ul>
    <li><a href="./booking-flow">Booking Flow</a> — User journey</li>
    <li><a href="./revenue-model">Revenue Model</a> — Commission, affiliate</li>
    <li><a href="./lifecycle-communication">Lifecycle Communication</a> — Emails</li>
  </ul>
</aside>
