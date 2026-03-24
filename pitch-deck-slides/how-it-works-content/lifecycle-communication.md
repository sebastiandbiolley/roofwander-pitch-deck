---
title: Lifecycle Communication
description: Emails and notifications during the booking flow and account lifecycle.
order: 9
---

# Lifecycle Communication

## Section 9 — Lifecycle Communication

Lifecycle communication covers all emails and messages sent during the user journey. Messages are triggered by user events, not by a fixed calendar.

## Types of communication

- **Transactional** — Required system emails (booking, payments, account).
- **Event-based** — Follow-up messages based on behavior.
- **Retargeting** — Ads and messages before signup, based on tracking events.

## Transactional emails

Transactional emails are tied to product actions and are required for the marketplace to function. They include booking confirmations, payment and payout updates, and account notifications (signup, password reset, email verification). For bookings, they roughly follow this sequence: request received, request confirmed or declined, reminder before pickup, and a completion email with a review request.

## Event-based emails

Event-based emails respond to behavior on the platform and keep users moving forward, for example onboarding after signup, reminders after saving listings, and follow-ups after viewing listings without contacting anyone.

## Retargeting

Part of the journey happens before signup. Many visitors browse locations and listings without creating an account.

When consent allows it, events from the tracking system are used to build audiences in ad platforms. Retargeting then shows ads to people who:

- viewed listings earlier
- started but did not complete a booking

Email tools, tracking, and ads work together. The specific tool (Brevo, HubSpot, Customer.io, or an in-house system) can change, but the principle stays the same: user events create audiences, and those audiences are used for retargeting.

## Full lifecycle diagram

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

<aside class="doc-see-also doc-see-also-mobile-only">
  <p class="doc-see-also-title">See also</p>
  <ul>
    <li><a href="./booking-flow">Booking Flow</a> — User journey</li>
    <li><a href="./tracking">Tracking</a> — Events, funnels, ads</li>
  </ul>
</aside>
