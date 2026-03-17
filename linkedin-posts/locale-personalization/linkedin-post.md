Improving user experience without hurting performance

A small product improvement we recently made on the Roofwander landing page.

One challenge with marketplaces is showing the right listings to new visitors immediately.

If someone lands on the homepage, what should they see first?

• the newest listings
• the most popular ones
• listings near them

We wanted the homepage to feel relevant to visitors from different countries.

But we also wanted to avoid heavy geolocation logic that could slow down the page.

So we tried something simpler.

Locale → geographic origin

We use the website language (locale) to determine a geographic reference point.

For example:

• French locale → listings closer to France
• Dutch locale → listings closer to the Netherlands
• German locale → listings closer to Germany

That origin is then passed when fetching curated listings.

The marketplace backend can then sort listings by distance from that region.

This means visitors see listings closer to their region first.

Why this approach

It improves the initial user experience while keeping things simple:

• no heavy geolocation
• no additional API calls
• minimal performance impact

Just a small signal helping rank listings more intelligently.

Still experimenting with these kinds of improvements.

Curious how others approach this.

How do you personalize marketplace homepages without hurting performance?
