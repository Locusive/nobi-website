// Pinterest has a different editorial job from a search preview: show one recognizable, available product,
// with specific copy, without filling several boards with the same photograph. Search and Story order stay intact.

import { widenShopifyImage } from "../src/utils/previewImage.js";
import { BannedTopLevel, listPinBoards, readTopLevel } from "../src/utils/shopNobiPinBoard.js";
import { CommissionNotice } from "../src/utils/shopNobiPage.js";
import { PinHeroReviews } from "./shop-nobi-pin-editorial.js";

const PinTitleLimit = 100;
const ImageTransformParameters = ["width", "height", "crop", "quality", "format"];
const ProductTrackingParameters = ["variant", "fbclid", "gclid", "nobi-conversation-id"];
const PlaceholderFilePattern = /^(?:no[-_]?image|image[-_]?not[-_]?available|placeholder|spacer|blank)\.(?:gif|png|jpe?g|webp)$/i;
const ReviewedHeroes = new Map(PinHeroReviews.map((review) => [review.pageSlug, review]));
const BoardTopLevels = new Set(listPinBoards().map(({ topLevel }) => topLevel));

/**
 * Selects one eligible hero per page, avoiding repeated photographs and product destinations across boards.
 * A simpler canonical slug owns a shared product first, so refresh timestamps cannot swap duplicate ownership.
 * Candidates retain their existing page relevance; explicit earning candidates are preferred within that set.
 *
 * @param {object[]} searchPages The built pages, with validated product data.
 * @returns {{page: object, product: object, imageUrl: string, title: string, description: string}[]} Selected items.
 */
export function selectPinItems(searchPages) {
  const usedSlugs = new Set();
  const usedImages = new Set();
  const usedProducts = new Set();
  const selected = [];
  const candidates = searchPages
    .filter((page) => readTopLevel(page.categoryPath) !== BannedTopLevel)
    .map((page) => ({ page, products: eligibleProducts(page) }));

  for (const { page, products } of candidates.sort(compareEditorialOwnership)) {
    if (usedSlugs.has(page.slug)) {
      continue;
    }
    const product = products.find((candidate) =>
      !usedImages.has(normalizePinImage(candidate.imageUrl)) && !usedProducts.has(normalizeProductDestination(candidate.url)));
    if (!product) {
      continue;
    }

    usedSlugs.add(page.slug);
    usedImages.add(normalizePinImage(product.imageUrl));
    usedProducts.add(normalizeProductDestination(product.url));
    selected.push({ page, product, imageUrl: widenShopifyImage(product.imageUrl), ...describePin(page, product) });
  }
  return selected;
}

/**
 * Normalizes only common rendering parameters, preserving the image path, version and other identity values.
 * Different product photos must not collapse just because they share a CDN host.
 *
 * @param {string} imageUrl The original native product picture.
 * @returns {string} A stable identity for that picture, or an empty string for an unsafe address.
 */
export function normalizePinImage(imageUrl) {
  const address = readHttpsAddress(imageUrl);
  if (!address) {
    return "";
  }
  ImageTransformParameters.forEach((parameter) => address.searchParams.delete(parameter));
  address.hash = "";
  address.searchParams.sort();
  return address.toString();
}

/** Keeps explicitly available, priced USD products with a real HTTPS photo and safe shopper destination. */
function eligibleProducts(page) {
  return (page.products ?? [])
    .filter((product) => product.isInStock === true && Number.isFinite(product.price) && product.price > 0 && product.currency === "USD")
    .filter((product) => matchesReviewedHero(page.slug, product))
    .filter((product) => typeof product.name === "string" && product.name.trim() && readHttpsAddress(product.url) && usableImage(product.imageUrl))
    .sort((first, second) => Number(second.paidLink === true) - Number(first.paidLink === true));
}

/** Keeps a reviewed page tied to its actual product/photo pair instead of falling back to an unrelated or unreviewed result. */
function matchesReviewedHero(pageSlug, product) {
  const review = ReviewedHeroes.get(pageSlug);
  return !review || (normalizeProductDestination(product.url) === review.preferredProductUrl
    && normalizePinImage(product.imageUrl) === review.preferredImageUrl);
}

/** Rejects known placeholders; URL validity alone is not an aesthetic verdict. */
function usableImage(imageUrl) {
  const address = readHttpsAddress(imageUrl);
  return address && !PlaceholderFilePattern.test(address.pathname.split("/").pop());
}

/** Preserves board coverage and earning destinations, then prefers a canonical page over color synonyms. */
function compareEditorialOwnership(first, second) {
  const hasBoard = ({ page }) => BoardTopLevels.has(readTopLevel(page.categoryPath));
  const hasEarningHero = ({ products }) => products[0]?.paidLink === true;
  return Number(hasBoard(second)) - Number(hasBoard(first))
    || Number(hasEarningHero(second)) - Number(hasEarningHero(first))
    || Number(ReviewedHeroes.has(second.page.slug)) - Number(ReviewedHeroes.has(first.page.slug))
    || first.page.slug.length - second.page.slug.length
    || first.page.slug.localeCompare(second.page.slug, "en");
}

/** Returns one product identity, removing tracking and variant selectors so alternate variants do not flood boards. */
function normalizeProductDestination(productUrl) {
  const address = readHttpsAddress(productUrl);
  if (!address) {
    return "";
  }
  for (const parameter of [...address.searchParams.keys()]) {
    if (parameter.startsWith("utm_") || ProductTrackingParameters.includes(parameter)) {
      address.searchParams.delete(parameter);
    }
  }
  address.hash = "";
  address.searchParams.sort();
  return address.toString();
}

/** Writes Pinterest-specific copy from the pictured product and the page's actual shopping query. */
function describePin(page, product) {
  const subject = readSubject(page);
  const name = product.name.trim().replace(/\s+/g, " ");
  const store = typeof product.storeName === "string" ? product.storeName.trim().replace(/\s+/g, " ") : "";
  const title = name.toLocaleLowerCase("en-US").includes(subject.toLocaleLowerCase("en-US")) ? name : `${name} | ${subject}`;
  const commission = page.products.some((candidate) => candidate.paidLink === true)
    ? `#ad ${CommissionNotice} from some links on this page. `
    : "";
  return {
    title: shortenTitle(title),
    description: `${commission}Explore ${subject}. Pictured: ${name}${store ? ` from ${store}` : ""}. Compare listed options on Shop Nobi and buy directly from the store.`,
  };
}

/** Removes the known SEO template without making a new popularity, testing or quality claim. */
function readSubject(page) {
  const text = typeof page.query === "string" && page.query.trim() ? page.query : page.title;
  return text.trim().replace(/^Best\s+/i, "").replace(/\s+from Top Stores$/i, "").replace(/\s+/g, " ");
}

/** Keeps the product identity first and avoids cutting a word when the platform's title limit is reached. */
function shortenTitle(title) {
  if (title.length <= PinTitleLimit) {
    return title;
  }
  return `${title.slice(0, PinTitleLimit - 1).replace(/\s+\S*$/, "").trimEnd()}…`;
}

/** Reads an actual HTTPS address; prefix matching must not admit credentials or malformed URLs. */
function readHttpsAddress(value) {
  try {
    const address = new URL(value);
    return address.protocol === "https:" && !address.username && !address.password ? address : null;
  } catch {
    return null;
  }
}
