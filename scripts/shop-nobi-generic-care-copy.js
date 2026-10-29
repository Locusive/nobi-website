// These exact FAQ pairs were reviewed together; unfamiliar wording requires a separate review.
const SuedeCarePairs = [
  {
    answer: "Use a soft brush to remove dirt and apply a suede protector spray to guard against stains.",
    questions: new Set([
      "How do I care for a suede belt?",
      "How do I care for suede boots?",
      "How do I care for suede boat shoes?",
      "How can I care for suede accessories?",
      "How do I care for a suede shoulder bag?",
      "How do I care for suede loafers?",
      "How do I care for suede outerwear?",
      "How do I care for suede sandals?",
      "How should I care for suede espadrilles?",
      "How should I care for a suede navy jacket?",
    ]),
  },
  {
    answer: "Use a soft brush to remove dirt and apply a suede protector spray to guard against stains and water.",
    questions: new Set([
      "What care does suede sandal need?",
      "How do I care for suede shoes?",
      "How do I care for suede navy shoes?",
    ]),
  },
  {
    answer: "Use a suede brush to remove dirt and apply a protective spray to guard against stains.",
    questions: new Set([
      "How do I care for suede brown heels?",
      "How should I care for a suede belt?",
      "How do I care for suede gray shoes?",
    ]),
  },
];
const SuedeCareAnswer = "Before applying a protective treatment, check the maker’s care instructions for the exact suede item, including its finish, lining and trim. Use only cleaning tools and treatments the maker permits for that model; a suede label alone does not establish water or stain protection.";

const WaterproofSelectionPairs = [
  {
    question: "Do hunting jackets need a waterproof rating?",
    answer: "A water-resistant or waxed finish helps keep you dry in rain or snow without adding bulk.",
    replacement: "If rain protection is a requirement, compare the exact hunting jacket’s stated waterproof performance and intended conditions. Check seam and closure details, then fit over your layers; a waxed or water-resistant finish alone does not answer those questions.",
  },
  {
    question: "What makes a windbreaker waterproof?",
    answer: "A windbreaker with a DWR coating or laminated membrane repels rain while staying lightweight.",
    replacement: "Check the exact windbreaker’s manufacturer specifications for waterproof performance and its seam and closure construction. A DWR label or a fabric name alone does not establish that the whole jacket is waterproof.",
  },
  {
    question: "What material is best for a waterproof jacket?",
    answer: "Waxed cotton or treated leather provides water resistance while still looking stylish.",
    replacement: "For a waterproof jacket, compare the maker’s stated waterproof performance for the exact model, including its seam and closure construction. Do not choose by waxed cotton or leather alone; check the intended conditions and fit over your layers.",
  },
];

// Each complete source identity and FAQ pair was reviewed; other rule families keep their title gate.
const SilverSelectionAnswer = "Do not infer skin suitability from a metal name or color alone. Check the maker’s composition and finish details for the exact item, including coatings, clasps and other metal components. If nickel content matters to you, ask the maker to confirm it before choosing.";
const SilverSelectionPairs = [
  {
    slug: "mens-silver-bracelets",
    title: "Best Men's Silver Bracelets from Top Stores",
    question: "Is sterling silver hypoallergenic?",
    answer: "Yes, pure sterling silver is generally safe for most skin types, though some people react to alloy metals.",
  },
  {
    slug: "mens-silver-necklaces",
    title: "Best Men's Silver Necklaces from Top Stores",
    question: "Is sterling silver hypoallergenic?",
    answer: "Yes, pure sterling silver is generally safe for most skin types, though some people react to alloy metals.",
  },
  {
    slug: "silver-chain-bracelets",
    title: "Best Silver Chain Bracelets",
    question: "Is sterling silver hypoallergenic?",
    answer: "Yes, pure sterling silver is generally safe for most skin types, though some people react to alloy metals.",
  },
  {
    slug: "sterling-statement-rings",
    title: "Best Sterling Statement Rings",
    question: "Is sterling silver hypoallergenic?",
    answer: "Yes, pure sterling silver is generally safe for most skin types, though some people react to alloy metals.",
  },
  {
    slug: "gray-silver-jewelry",
    title: "Best Gray Silver Jewelry from Top Stores",
    question: "Does silver jewelry cause skin irritation?",
    answer: "Pure silver is generally hypoallergenic, but some people react to alloy metals like nickel.",
  },
  {
    slug: "mens-polished-silver-jewelry",
    title: "Best Men's Polished Silver Jewelry from Top Stores",
    question: "Are these items suitable for sensitive skin?",
    answer: "Sterling silver is generally hypoallergenic, though some people react to alloy metals in the setting.",
  },
  {
    slug: "sterling-silver-chain-necklaces",
    title: "Best Sterling Silver Chain Necklaces from Top Stores",
    question: "Are these necklaces hypoallergenic?",
    answer: "Sterling silver is generally hypoallergenic, but some people react to the small amount of alloy metals.",
  },
  {
    slug: "sterling-silver-pendant-necklaces",
    title: "Best Sterling Silver Pendant Necklaces from Top Stores",
    question: "Are pendant necklaces suitable for sensitive skin?",
    answer: "Sterling silver is generally hypoallergenic, but some people may react to alloy metals.",
  },
  {
    slug: "womens-silver-bracelets",
    title: "Best Women's Silver Bracelets",
    question: "Is sterling silver hypoallergenic?",
    answer: "Sterling silver is generally safe for most skin types, though some people may react to the small amount of copper it contains.",
  },
  {
    slug: "womens-silver-earrings",
    title: "Best Women's Silver Earrings from Top Stores",
    question: "Are silver earrings good for sensitive ears?",
    answer: "Solid 925 sterling silver is generally hypoallergenic, but people with severe metal allergies should check for nickel-free plating.",
  },
  {
    slug: "womens-silver-rings",
    title: "Best Women's Silver Rings from Top Stores",
    question: "Can I wear a silver ring if I have metal allergies?",
    answer: "Sterling silver is generally hypoallergenic, though some people react to the alloy metals.",
  },
  {
    slug: "caviar-rings",
    title: "Best Caviar Rings from Top Stores",
    question: "Is sterling silver a good choice for everyday wear?",
    answer: "Yes, it is durable and hypoallergenic, though it may need occasional polishing to maintain shine.",
    replacement: "For everyday wear, compare the exact ring’s fit, setting and finish, and follow the maker’s care instructions. A sterling-silver label alone does not establish skin suitability; ask for the complete composition if you need to avoid a particular metal.",
  },
  {
    slug: "diamond-charm-bracelets",
    title: "Best Diamond Charm Bracelets from Top Stores",
    question: "Are sterling-silver charm bracelets hypoallergenic?",
    answer: "Sterling silver is generally safe for most skin types, but some people react to the copper alloy.",
  },
  {
    slug: "green-white-necklaces",
    title: "Best Green White Necklaces from Top Stores",
    question: "Can I wear a silver necklace with a copper allergy?",
    answer: "Pure sterling silver is usually safe, but if you have a severe metal allergy, choose hypoallergenic options like titanium.",
  },
  {
    slug: "mens-pendant-necklaces",
    title: "Best Men's Pendant Necklaces",
    question: "Is sterling silver good for sensitive skin?",
    answer: "Yes, sterling silver is generally hypoallergenic and suitable for most skin types.",
  },
  {
    slug: "navy-bracelets",
    title: "Best Navy Bracelets from Top Stores",
    question: "Is silver or gold better for sensitive skin?",
    answer: "Silver, especially sterling silver, is generally more hypoallergenic than gold alloys.",
  },
  {
    slug: "black-beaded-bracelets",
    title: "Best Black Beaded Bracelets",
    question: "Are black onyx bracelets suitable for sensitive skin?",
    answer: "Onyx set in sterling silver or gold is generally safe, but avoid nickel-plated settings if you have allergies.",
  },
  {
    slug: "black-beaded-necklaces",
    title: "Best Black Beaded Necklaces",
    question: "Should I avoid certain metals if I have sensitive skin?",
    answer: "Nickel-free silver or gold-plated pieces are best for sensitive skin.",
  },
  {
    slug: "blue-beaded-bracelets",
    title: "Best Blue Beaded Bracelets from Top Stores",
    question: "What metal is best for sensitive skin?",
    answer: "Sterling silver and gold vermeil are generally safe for most skin types.",
  },
  {
    slug: "blue-green-necklaces",
    title: "Best Blue Green Necklaces from Top Stores",
    question: "Do I need to worry about metal allergies?",
    answer: "If you have sensitivities, look for necklaces made of hypoallergenic metals like sterling silver or gold.",
  },
  {
    slug: "caviar-chain-bracelets",
    title: "Best Caviar Chain Bracelets from Top Stores",
    question: "What metal is best for sensitive skin?",
    answer: "Sterling silver or nickel-free gold plating are generally hypoallergenic options.",
  },
  {
    slug: "charms",
    title: "Best Charms from Top Stores",
    question: "Can I wear metal charms if I have sensitive skin?",
    answer: "If you have sensitivities, look for nickel-free or hypoallergenic finishes such as sterling silver or plated gold.",
  },
  {
    slug: "clover-jewelry",
    title: "Best Clover Jewelry from Top Stores",
    question: "What metal is best for sensitive skin?",
    answer: "Nickel-free options like pure gold, sterling silver or hypoallergenic alloys are safest for sensitive skin.",
  },
  {
    slug: "coral-necklaces",
    title: "Best Coral Necklaces from Top Stores",
    question: "Is coral jewelry safe for sensitive skin?",
    answer: "Coral set in nickel-free gold or silver is usually safe, but check the metal for any allergens.",
  },
  {
    slug: "green-pendant-necklaces",
    title: "Best Green Pendant Necklaces from Top Stores",
    question: "Can I wear a pendant with a sensitive skin?",
    answer: "Choose hypoallergenic metals like sterling silver or nickel-free gold vermeil to reduce irritation.",
  },
  {
    slug: "mens-stud-earrings",
    title: "Best Men's Stud Earrings from Top Stores",
    question: "Are any of these earrings suitable for sensitive ears?",
    answer: "Sterling silver and gold vermeil are generally safe, but check the product details for nickel-free claims if you have sensitivities.",
  },
  {
    slug: "orange-pink-bracelets",
    title: "Best Orange Pink Bracelets from Top Stores",
    question: "How do I know which metal is best for my skin?",
    answer: "If you have sensitive skin, opt for sterling silver or hypoallergenic gold-filled pieces, which are less likely to cause irritation.",
  },
  {
    slug: "pear-jewelry",
    title: "Best Pear Jewelry from Top Stores",
    question: "Is pear jewelry suitable for sensitive skin?",
    answer: "Choose pieces made from hypoallergenic metals like sterling silver or 14k gold to reduce irritation.",
  },
  {
    slug: "purple-rings",
    title: "Best Purple Rings from Top Stores",
    question: "Are purple gemstone rings hypoallergenic?",
    answer: "Stainless steel and sterling silver settings are generally hypoallergenic, while some gold alloys may cause reactions.",
  },
  {
    slug: "sapphire-stud-earrings",
    title: "Best Sapphire Stud Earrings from Top Stores",
    question: "Which metal should I choose for hypoallergenic wear?",
    answer: "Sterling silver or 18 k gold are generally safe; verify the maker’s metal composition.",
  },
  {
    slug: "stone-earrings",
    title: "Best Stone Earrings from Top Stores",
    question: "Are stone earrings safe for sensitive ears?",
    answer: "Choose earrings set in hypoallergenic metals like sterling silver or gold to reduce irritation.",
  },
  {
    slug: "turquoise-earrings",
    title: "Best Turquoise Earrings from Top Stores",
    question: "Are turquoise earrings hypoallergenic?",
    answer: "Turquoise itself is safe, but the metal setting can cause reactions; choose sterling silver or gold for best tolerance.",
  },
  {
    slug: "womens-black-jewelry",
    title: "Best Women's Black Jewelry from Top Stores",
    question: "Can I wear black earrings if I have sensitive ears?",
    answer: "Choose pieces made from sterling silver or gold-filled metal, which are less likely to cause irritation.",
  },
  {
    slug: "womens-huggie-earrings",
    title: "Best Women's Huggie Earrings from Top Stores",
    question: "Do I need to worry about nickel allergies?",
    answer: "Choose earrings made of nickel-free gold or sterling silver if you have a sensitivity.",
  },
];

/**
 * Replaces only reviewed, complete care, waterproof-selection or silver-composition FAQ pairs in generic search-page copy.
 * The caller excludes authored pages; filtered/empty pages retain their existing suppression.
 * No product data, guide paragraphs, question wording or other fields are changed.
 */
export function withGenericCareCopy(page) {
  if (!page.products?.length || page.publicationFilteredProducts === true
    || page.guideSources?.length) return page;
  const standardSourceTitle = /^Best .+ from Top Stores$/.test(page.title);
  const reviewedSilverSource = SilverSelectionPairs.find(pair => pair.slug === page.slug && pair.title === page.title);
  if (!standardSourceTitle && !reviewedSilverSource) return page;
  let changed = false;
  const faq = page.faq.map(entry => {
    const waterproofPair = standardSourceTitle && WaterproofSelectionPairs.find(pair => pair.question === entry.question && pair.answer === entry.answer);
    const suedePair = standardSourceTitle && SuedeCarePairs.some(pair => pair.answer === entry.answer && pair.questions.has(entry.question));
    const silverPair = reviewedSilverSource && entry.question === reviewedSilverSource.question && entry.answer === reviewedSilverSource.answer;
    const answer = silverPair ? (reviewedSilverSource.replacement ?? SilverSelectionAnswer) : waterproofPair?.replacement ?? (suedePair ? SuedeCareAnswer : null);
    if (answer === null) return entry;
    changed = true;
    return { ...entry, answer };
  });
  return changed ? { ...page, faq } : page;
}

/** Returns the recorded revision for a reviewed replacement answer, not other FAQ text. */
export function genericCareRevision(answer) {
  if (answer === SuedeCareAnswer) return "2026-10-29T01:26:57Z";
  if (WaterproofSelectionPairs.some(pair => pair.replacement === answer)) return "2026-10-29T01:41:28Z";
  if (answer === SilverSelectionAnswer || SilverSelectionPairs.some(pair => pair.replacement === answer)) return "2026-10-29T02:32:22Z";
  return null;
}
