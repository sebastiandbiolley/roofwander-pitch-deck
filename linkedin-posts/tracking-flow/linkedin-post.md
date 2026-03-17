Tracking traffic is important.

But in our case it wasn't enough.

When building a marketplace like Roofwander, we quickly realized that knowing where visitors come from is only part of the picture.

The real question became:

What actually happens between the first visit and a booking?

Where do users drop in the funnel?
Which listings attract attention but never lead to contact?
What actions signal real booking intent?
Which traffic sources bring users who actually engage?

To understand this better, we started implementing a simple event tracking system.

The flow roughly looks like this:

User action
→ pushEvent()
→ window.dataLayer
→ Google Tag Manager
→ GA4
→ PostHog

We track events at each layer:

• Traffic & Page Views
• Search & Discovery
• Interest
• High Intent
• Conversion

GA4 helps us understand traffic sources.
PostHog helps us visualize funnels and see where users drop.

And it's also extremely important for ads and retargeting.

It's still evolving, but it already helps us better understand how people navigate the platform before booking.

Curious to hear how other teams approach this.

What tools do you use to track product behavior?

PostHog?
Mixpanel?
Amplitude?
Something else?
