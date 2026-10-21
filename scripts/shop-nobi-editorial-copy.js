// Original editorial guidance for one existing search page. Product facts and the shared build plan stay intact.

const SterlingSilverRingCopy = {
  title: "Sterling Silver Rings: Compare Styles, Fit & Finish",
  description: "Compare sterling silver rings by shape, band width, fit and finish. Check each retailer's material details, sizing guidance and purchase policies before choosing.",
  guide: [
    "Start with the shape you want: a plain band, a signet or a more sculptural ring. Compare the profile and width in the retailer's measurements rather than judging size from a product photo.",
    "Check the listed ring sizes and the retailer's sizing guide. For a gift, confirm the recipient's size and check the exchange conditions before choosing a personalized or final-sale option.",
    "Read each product's material and finish description. Check whether stones, coatings or engraving have their own care requirements, and follow the retailer's instructions for that exact ring.",
    "Before buying, check current availability, the total cost including shipping, and the return or resizing options offered for the selected ring. The same style from another retailer may have different purchase conditions.",
  ],
  faq: [
    {
      question: "What should I compare when choosing a sterling silver ring?",
      answer: "Compare the shape, band width, available sizes, material description and finish. Use the retailer's measurements and product details to decide which ring suits your needs.",
    },
    {
      question: "How do I choose a ring size?",
      answer: "Use the sizing guidance for the exact ring and retailer. Confirm the size you need, and check exchange conditions before ordering a gift or a personalized piece.",
    },
    {
      question: "Can I resize or return the ring I choose?",
      answer: "Check the selected product's resizing, return and exchange terms before buying. Size selection, engraving and final-sale conditions can affect the options offered by the retailer.",
    },
    {
      question: "Which care instructions should I follow?",
      answer: "Follow the retailer's care instructions for the ring's stated materials, finish and any stones. Do not assume that instructions for a plain band apply to every coating or setting.",
    },
  ],
};

/**
 * Applies authored copy only to the selected page's published HTML and embedded browser data.
 * The original plan remains available unchanged to product, feed and Web Story generation.
 *
 * @param {object} page The normalized search page, including its existing products and links.
 * @returns {object} The publication copy, or the original page when it has no editorial replacement.
 */
export function withAuthoredSearchPageCopy(page) {
  if (page.slug !== "sterling-silver-rings") {
    return page;
  }

  return {
    ...page,
    ...SterlingSilverRingCopy,
    guide: [...SterlingSilverRingCopy.guide],
    faq: SterlingSilverRingCopy.faq.map((entry) => ({ ...entry })),
  };
}
