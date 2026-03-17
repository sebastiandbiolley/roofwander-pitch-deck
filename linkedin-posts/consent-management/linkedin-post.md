One thing that turned out to be much more complicated than expected while building Roofwander:

Consent management.

At first it sounds simple.

Show a cookie banner and you're done.

But once you start implementing it properly, things get more complex:

• analytics consent
• marketing consent
• blocking tags before consent
• updating tracking after user choice
• storing preferences
• respecting GDPR rules

We ended up implementing Google Consent Mode v2 through Google Tag Manager.

The idea is simple:

Everything is deny-by-default.

Tags only run after the user grants consent.

Users can:

• accept all
• reject all
• customize preferences

Once a choice is made, the consent preference is stored in a cookie and the consent state is updated in GTM so tags activate dynamically.

Analytics and marketing tags only run if the corresponding consent is granted.

But honestly, we still struggle with this topic.

Between GDPR requirements, analytics tools, marketing tags, and user experience, it is harder than it first appears.

Still learning and improving the setup.

Curious how others handle this.

Do you manage consent internally or use external tools like Cookiebot, Didomi or OneTrust?
