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

/**
 * Replaces only reviewed, complete suede-care FAQ pairs in generic search-page copy.
 * The caller excludes authored pages; filtered/empty pages retain their existing suppression.
 * No product data, guide paragraphs, question wording or other fields are changed.
 */
export function withGenericCareCopy(page) {
  if (!page.products?.length || page.publicationFilteredProducts === true
    || !/^Best .+ from Top Stores$/.test(page.title) || page.guideSources?.length) return page;
  let changed = false;
  const faq = page.faq.map(entry => {
    const matches = SuedeCarePairs.some(pair => pair.answer === entry.answer && pair.questions.has(entry.question));
    if (!matches) return entry;
    changed = true;
    return { ...entry, answer: SuedeCareAnswer };
  });
  return changed ? { ...page, faq } : page;
}
