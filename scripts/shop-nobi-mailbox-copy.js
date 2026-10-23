// Corrects only observed mailbox advice; shopping products and the original build plan remain unchanged.

const ObservedGuide = [
  "Mailbox posts on this page cost between $75 and $250. The selection includes wooden styles in cedar or dark cedar, as well as painted metal finishes such as classic white, onyx black, and stone gray.",
  "Wooden posts are typically made from cedar, which resists rot naturally, while metal posts are often powder-coated for durability and weather resistance. Many items are sold as a post-and-mailbox kit, so the mailbox attaches directly to the post.",
  "When picking a post, consider the height-standard residential posts are 48-54 inches tall-and the style that matches your home\u2019s exterior. Look for sturdy mounting hardware and a concrete base for stable installation.",
  "Check if the kit includes a mailbox that fits your local postal regulations, and verify that the finish is UV-protected to maintain its appearance over time."
];
const CautiousGuide = [
  "Compare whether each listing is a mail post, a post-mounted mailbox, or a named mailbox-and-post kit. Verify the retailer's included-parts list for the exact option; a name alone does not establish every component supplied.",
  "Read the exact model's material description. A finish name does not establish that an item is made from wood or metal; do not infer its construction from a colour name or product photograph.",
  "Before installation, check the exact manufacturer's instructions and applicable postal and local requirements. Confirm the required mounting components and dimensions rather than using a generic post-height range.",
  "Check the selected mailbox's mounting compatibility and the parts supplied. Do not assume that a support post, concrete base or mounting hardware is included; follow the exact retailer's instructions and care guidance."
];
const ObservedFaq = [
  {
    "answer": "Standard residential posts are usually 48-54 inches tall; select a height that matches your mailbox and local guidelines.",
    "question": "What height should I choose for a mailbox post?"
  },
  {
    "answer": "Cedar and treated wood are naturally resistant to rot, and painted finishes add extra protection against the elements.",
    "question": "Are wooden posts weather-resistant?"
  },
  {
    "answer": "Most posts come with a concrete base or mounting hardware that can be set in a pre-drilled hole and secured with concrete or a ground sleeve.",
    "question": "How is a post installed?"
  },
  {
    "answer": "Many of these kits include a mailbox that attaches to the post, but always verify the product description to be sure.",
    "question": "Do I need a separate mailbox?"
  }
];
const CorrectedFaq = [
  {
    "question": "What height should I choose for a mailbox post?",
    "answer": "Use the exact model's installation instructions and applicable postal and local requirements. A generic post-height range does not establish the correct installed mailbox height."
  },
  {
    "question": "Does a cedar finish mean the post is made of wood?",
    "answer": "No. A finish name does not establish the item's material. Check the exact retailer's material description rather than inferring construction from a colour name or photograph."
  },
  {
    "question": "How is a post installed?",
    "answer": "Read the exact manufacturer's instructions before buying or installing. Confirm the support post, mounting hardware and base materials required, and check which components are supplied."
  },
  {
    "question": "Do I need a separate mailbox?",
    "answer": "Check the exact listing's included-parts list. A post-mount mailbox name does not establish that its support post is supplied, and a kit may still require separately purchased mounting components."
  }
];
const ReviewedHighland = {
  "name": "Highland Mail Post & XL Black Mailbox\u2122 Weathered Cedar",
  "productVariantId": "d22af276-fec2-4a2b-af16-c7d2e88fa192",
  "url": "https://www.step2.com/products/highland-mail-post-xl-black-mailbox?variant=47636615397663"
};

const HighlandSource = {
  label: "Step2 Highland product details (checked October 23, 2026)",
  url: ReviewedHighland.url,
};
const ReviewedMaterialGuide = "For the Highland Mail Post & XL Black Mailbox in Weathered Cedar shown below, Step2 specifies weather-resistant resin and a standard 4x4 wooden mounting post sold separately. This describes that exact model; it does not establish the materials or mounting requirements of the other listings.";

/** Requires the same reviewed listing, retailer address and exact variant before adding its material fact. */
function hasReviewedHighland(products) {
  return products.some((product) => product.name === ReviewedHighland.name
    && product.productVariantId === ReviewedHighland.productVariantId && product.url === ReviewedHighland.url);
}

/** Replaces only an observed question/answer pair, preserving any subsequently refreshed answer. */
function correctQuestion(entry) {
  const index = ObservedFaq.findIndex(({ question, answer }) => question === entry.question && answer === entry.answer);
  return index < 0 ? entry : { ...CorrectedFaq[index] };
}

/**
 * Corrects the captured mailbox wording and keeps any new upstream guidance intact.
 * The item-specific fact and source appear only with the exact reviewed product identity.
 * @param {object} page The normalized mailbox search page.
 * @returns {object} The corrected publication data, or the unchanged page when no observed wording remains.
 */
export function withMailboxClarification(page) {
  const reviewedItemPresent = hasReviewedHighland(page.products);
  const guide = page.guide.map((paragraph) => {
    const index = ObservedGuide.indexOf(paragraph);
    if (index < 0) return paragraph;
    return index === 1 && reviewedItemPresent ? ReviewedMaterialGuide : CautiousGuide[index];
  });
  const faq = page.faq.map(correctQuestion);
  if (guide.every((paragraph, index) => paragraph === page.guide[index])
      && faq.every((entry, index) => entry === page.faq[index])) return page;
  const needsSource = reviewedItemPresent && page.guide.includes(ObservedGuide[1]);
  const sources = page.guideSources ?? [];
  return {
    ...page, guide, faq,
    ...(needsSource ? { guideSources: sources.some(({ url }) => url === HighlandSource.url)
      ? sources : [...sources, { ...HighlandSource }] } : {}),
  };
}
