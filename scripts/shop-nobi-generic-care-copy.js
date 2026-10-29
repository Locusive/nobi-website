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

/**
 * Replaces only reviewed, complete care or waterproof-selection FAQ pairs in generic search-page copy.
 * The caller excludes authored pages; filtered/empty pages retain their existing suppression.
 * No product data, guide paragraphs, question wording or other fields are changed.
 */
export function withGenericCareCopy(page) {
  if (!page.products?.length || page.publicationFilteredProducts === true
    || !/^Best .+ from Top Stores$/.test(page.title) || page.guideSources?.length) return page;
  let changed = false;
  const faq = page.faq.map(entry => {
    const waterproofPair = WaterproofSelectionPairs.find(pair => pair.question === entry.question && pair.answer === entry.answer);
    const suedePair = SuedeCarePairs.some(pair => pair.answer === entry.answer && pair.questions.has(entry.question));
    const answer = waterproofPair?.replacement ?? (suedePair ? SuedeCareAnswer : null);
    if (answer === null) return entry;
    changed = true;
    return { ...entry, answer };
  });
  return changed ? { ...page, faq } : page;
}
