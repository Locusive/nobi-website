/** Existing published decision guides, selected by the shopper's situation rather than product rankings. */
export const GiftGuides = [
  {
    slug: "gifts-for-someone-who-wants-nothing",
    title: "Gifts for Someone Who Wants Nothing: 5 Useful Ways to Choose",
    need: "They don't want more stuff",
    summary: "Start by checking whether a gift is welcome. Compare something they already enjoy, a useful replacement, hobby supplies, a gift card or time together.",
    question: "Do they mean no presents, or no more possessions?",
  },
  {
    slug: "headphones-as-a-gift",
    title: "Headphones as a Gift: Four Checks Before You Buy",
    need: "They asked for headphones",
    summary: "Check their listening routine, devices, preferred fit and return options before choosing. Know when to ask for an exact model instead of guessing.",
    question: "What would they listen to, and on which device?",
  },
  {
    slug: "trivia-card-game-gift",
    title: "How to Choose a Trivia Card Game as a Gift",
    need: "They enjoy a game night",
    summary: "Choose around the people who will play: check age labels, topics, group size, time and the full budget. A quiz is not the right fit for every group.",
    question: "Who would play, and are there topics to avoid?",
  },
];

/** Shared route metadata and truthful collection schema used by both prerendering and React. */
export const GiftGuidesSeo = {
  path: "/gift-guides",
  title: "Gift Guides: Choose by the Person | Shop Nobi",
  description: "Start with the person: explore guides for someone who wants nothing, a headphone gift or a trivia game. Compare the fit before choosing.",
  schema: [{
    "@context": "https://schema.org", "@type": "CollectionPage",
    name: "Shop Nobi Gift Guides", url: "https://nobi.ai/gift-guides",
    hasPart: GiftGuides.map(guide => ({ "@type": "WebPage", name: guide.title, url: `https://nobi.ai/blog/${guide.slug}` })),
  }],
};
