// Keep shopping guidance consistent with the product records actually published on the page.
import { formatPrice } from "../src/utils/shopNobiSearchPage.js";

const MoneyAmount = /(?:[$€£¥]\s*\d|\b(?:USD|EUR|GBP|CAD|AUD|JPY)\s*\d|\d[\d,.]*\s*(?:USD|EUR|GBP|CAD|AUD|JPY|dollars?|euros?)\b)/i;
const CurrencyClaim = /\b(?:currency|USD|EUR|GBP|CAD|AUD|JPY|US dollars?)\b/i;
const SearchInstruction = /^(?:For example,?\s*)?(?:Enter|Type|Search for|Try searching for|(?:Try|Use|Refine|Narrow)\b[^.!?]*\bShop Nobi search|Use the search box)\b/i;
const SentenceSegmenter = new Intl.Segmenter("en", { granularity: "sentence" });
const InitialPeriod = "\uE000";
const RetailerCheck = "Confirm the selected variant's current price, availability and purchase terms with the retailer.";

/**
 * Withholds source copy tied to removed listings and replaces fixed monetary assertions with catalog facts.
 * No source record, price, link or product order is changed. This is not a general factual verifier.
 */
export function withPublicationQuality(page) {
  const filtered = page.publicationFilteredProducts === true;
  const priceSummary = catalogPriceSummary(page.products);
  const guide = filtered ? [] : page.guide.filter(paragraph => paragraph !== priceSummary).map(withoutFixedPrices).filter(Boolean);
  // A shortened answer can change its meaning; omit the complete pair when it asserts a fixed price/currency.
  const faq = filtered ? [] : page.faq.map(entry => withoutDepartedBoot(entry, page.products)).filter(({ question, answer }) =>
    !MoneyAmount.test(`${question} ${answer}`) && !CurrencyClaim.test(`${question} ${answer}`));
  const changed = filtered || guide.length !== page.guide.length
    || guide.some((paragraph, index) => paragraph !== page.guide[index]) || faq.length !== page.faq.length
    || faq.some((entry, index) => entry.answer !== page.faq[index]?.answer);
  if (!changed) return page;
  return {
    ...page,
    ...(filtered ? { description: `${page.products.length} product listings are displayed. ${RetailerCheck}`, guideSources: [] } : {}),
    guide: [priceSummary, ...guide,
      ...(filtered ? ["Use the search box below to describe your preferred features, size and budget and look for other options."] : [])],
    faq,
  };
}

/** Preserves non-price advice, decimal numbers and retailer initials such as H. Lorenzo. */
function withoutFixedPrices(paragraph) {
  if (!MoneyAmount.test(paragraph)) return paragraph;
  const protectedText = paragraph.replace(/\b([A-Z])\.(?=\s+[A-Z])/g, `$1${InitialPeriod}`);
  return [...SentenceSegmenter.segment(protectedText)]
    .map(({ segment }) => segment.replaceAll(InitialPeriod, ".").trim())
    .filter(sentence => !MoneyAmount.test(sentence) || SearchInstruction.test(sentence))
    .join(" ");
}

/** Summarizes only valid listed amounts in one currency, without treating them as a live offer or stock check. */
export function catalogPriceSummary(products) {
  const priced = products.filter(product => Number.isFinite(product.price) && product.price > 0 && product.currency);
  const currencies = new Set(priced.map(product => product.currency));
  if (!priced.length || currencies.size !== 1) return `Check each product card for its listed price and currency. ${RetailerCheck}`;
  const currency = priced[0].currency;
  const amounts = priced.map(product => product.price);
  const low = Math.min(...amounts);
  const high = Math.max(...amounts);
  const range = low === high ? `at ${formatPrice(low, currency)}` : `from ${formatPrice(low, currency)} to ${formatPrice(high, currency)}`;
  return `The ${priced.length} displayed ${priced.length === 1 ? "listing with a price is" : "listings with prices are"} listed ${range} (${currency}) in this catalog snapshot. ${RetailerCheck}`;
}

/** Corrects the independently confirmed departed product in the previously authored boots comparison. */
function withoutDepartedBoot(entry, products) {
  const staleSentence = "The listings include Elle Leather Ankle Boots, Ducati high boots, lace-ups, back-zip boots and an ankle wedge.";
  if (!entry.answer.includes(staleSentence) || products.some(product => product.name === "Elle Leather Ankle Boots")) return entry;
  return { ...entry, answer: entry.answer.replace(staleSentence, "Compare the boot shapes in the displayed listings.") };
}
