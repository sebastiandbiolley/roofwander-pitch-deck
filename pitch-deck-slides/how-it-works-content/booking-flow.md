---
title: Booking Flow
description: How travelers search, request, and complete rooftop tent rentals.
order: 6
---

# Booking Flow

## Section 6 — Booking Flow

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

## Steps

**1. Search** — Traveler searches by location, dates, or tent characteristics. Results can be filtered by geography, availability, and brand. See Discovery & Growth for channels and SEO.

**2. Listing page** — Photos, description, brand/model, price per night, availability calendar, pickup location. Traveler reviews before requesting.

**3. Request** — Traveler submits dates, quantity, optional message. Request sent to owner or partner. Checkout creates a transaction; PaymentIntent created; traveler has 15 minutes to complete payment.

**4. Owner confirmation** — Owner accepts or declines from Inbox. Can message traveler first. On accept, payment is captured; on decline, full refund.

**5. Payment** — When accepted, payment is held by the platform (Stripe). Payout released 2 days after booking end. See Marketplace Model for technical details.

**6. Rental** — Traveler and owner coordinate pickup and return. Once complete, transaction recorded; both can leave reviews within 7 days.

<aside class="doc-see-also doc-see-also-mobile-only">
  <p class="doc-see-also-title">See also</p>
  <ul>
    <li><a href="./marketplace-model">Marketplace Model</a> — Transaction states, payments</li>
    <li><a href="./lifecycle-communication">Lifecycle Communication</a> — Emails at each step</li>
  </ul>
</aside>
