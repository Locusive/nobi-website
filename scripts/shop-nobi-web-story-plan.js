// Decides what each Shop Nobi web story shows: a cover, the page's guide in short pages, a few products, some of
// its questions, and a last page that links back to the search page. Thin pages and mature pages get no story.

import { keepAllowedPages } from "./shop-nobi-search-pages-api.js";
import { choosePosters } from "./shop-nobi-web-story-poster.js";
import { cropShopifyImageToPortrait, widenShopifyImage } from "../src/utils/previewImage.js";
import { webStoryPath } from "../src/utils/shopNobiWebStory.js";

// Google may leave out a story when most of its pages carry more than 180 characters of text.
const StoryPageTextLimit = 180;
const StoryPageLimit = 10;
const GuidePageLimit = 4;
const ProductPageLimit = 3;
const MinGuidePages = 2;
const MinProductPages = 2;
// The cover and the last page.
const FramePageCount = 2;
const SentenceBreakPattern = /(?<=[.!?])\s+/;

/** The kinds of story pages, in the order a story shows them. */
export const StoryPageKind = Object.freeze({
  Cover: "cover",
  Guide: "guide",
  Product: "product",
  Question: "question",
  End: "end",
});

/**
 * Plans a story for each search page that has enough to show and a poster of full size, in page order, up to
 * the limit.
 *
 * @param {object[]} searchPages The built search pages, in sitemap order.
 * @param {number} storyLimit The most stories to build.
 * @param {(imageUrl: string) => Promise<{width: number, height: number} | null>} fetchImageSize Reads a picture's size.
 * @returns {Promise<{stories: object[], leftOutCount: number, smallPosterCount: number}>} The stories, the pages left out by the limit, and the pages without a full-size poster.
 */
export async function planWebStories(searchPages, storyLimit, fetchImageSize) {
  const plannedStories = keepAllowedPages(searchPages)
    .map((page) => ({ page, plan: planWebStory(page) }))
    .filter((story) => story.plan);
  const { stories, checkedCount } = await choosePosters(plannedStories, Math.max(0, storyLimit), fetchImageSize);
  return { stories, leftOutCount: plannedStories.length - checkedCount, smallPosterCount: checkedCount - stories.length };
}

/**
 * Gives each search page the path of its story, or null when it has none, so the page can link to it.
 *
 * @param {object[]} searchPages The built search pages.
 * @param {{page: object}[]} stories The planned stories.
 * @returns {object[]} The search pages, each with a storyPath.
 */
export function linkWebStories(searchPages, stories) {
  const storySlugs = new Set(stories.map((story) => story.page.slug));
  return searchPages.map((page) => ({ ...page, storyPath: storySlugs.has(page.slug) ? webStoryPath(page.slug) : null }));
}

/**
 * Plans one page's story, or returns null when the page lacks a Shopify picture for the poster, enough guide
 * text or enough product pictures to make a real story.
 *
 * @param {object} page The built search page.
 * @returns {{posterCandidates: string[], pages: object[]} | null} The possible posters, best first, and the story pages.
 */
export function planWebStory(page) {
  const posterCandidates = listPortraitPosters(page.products);
  const guideTexts = page.guide.flatMap(splitParagraph).slice(0, GuidePageLimit);
  const pictureProducts = page.products.filter(hasHttpsPicture).slice(0, ProductPageLimit);
  if (posterCandidates.length === 0 || guideTexts.length < MinGuidePages || pictureProducts.length < MinProductPages) {
    return null;
  }

  const questionRoom = StoryPageLimit - FramePageCount - guideTexts.length - pictureProducts.length;
  const questions = page.faq.filter(fitsOnePage).slice(0, questionRoom);
  const pages = [
    { kind: StoryPageKind.Cover },
    ...guideTexts.map((text) => ({ kind: StoryPageKind.Guide, text })),
    ...pictureProducts.map((product) => ({ kind: StoryPageKind.Product, product: widenPicture(product) })),
    ...questions.map((entry) => ({ kind: StoryPageKind.Question, question: entry.question, answer: entry.answer })),
    { kind: StoryPageKind.End },
  ];
  return { posterCandidates, pages };
}

/** Lists the portrait cuts of the https product pictures Shopify serves, in product order, without repeats. */
function listPortraitPosters(products) {
  const posterUrls = products
    .filter(hasHttpsPicture)
    .map((product) => cropShopifyImageToPortrait(product.imageUrl))
    .filter(Boolean);
  return [...new Set(posterUrls)];
}

/**
 * Splits a paragraph into pages of whole sentences within the text limit. A sentence longer than the limit gets
 * a page of its own, so no sentence is ever cut.
 */
function splitParagraph(paragraph) {
  const pageTexts = [];
  for (const sentence of paragraph.trim().split(SentenceBreakPattern)) {
    const lastText = pageTexts.at(-1);
    if (lastText && lastText.length + 1 + sentence.length <= StoryPageTextLimit) {
      pageTexts[pageTexts.length - 1] = `${lastText} ${sentence}`;
    } else {
      pageTexts.push(sentence);
    }
  }
  return pageTexts;
}

/** Returns whether a product has an https picture. */
function hasHttpsPicture(product) {
  return product.imageUrl?.startsWith("https://") ?? false;
}

/** Returns whether a question and its answer fit on one page within the text limit. */
function fitsOnePage(entry) {
  return entry.question.length + entry.answer.length <= StoryPageTextLimit;
}

/** Returns the product with its picture at 1,200 pixels wide when Shopify serves it. */
function widenPicture(product) {
  return { ...product, imageUrl: widenShopifyImage(product.imageUrl) };
}
