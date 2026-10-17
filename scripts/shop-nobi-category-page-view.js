// Groups the built search pages into category pages by their first breadcrumb, and picks the links /shop shows.
// A category with too few search pages folds them into its top category's page instead.

import { isSafeSlug, isText } from "./shop-nobi-search-page-view.js";
import { PinBoardNameByTopLevel, readTopLevel } from "../src/utils/shopNobiPinBoard.js";

const PopularPageLimit = 50;

/** The fewest search pages a category page lists. A thinner category's pages go to its top category's page. */
export const FewestSearchPagesPerCategory = 3;

/**
 * Returns a page's category: its first breadcrumb's name, with a slug made from that name.
 *
 * @param {{breadcrumbs?: object[]}} page A fetched or built page.
 * @returns {{name: string, slug: string} | null} The category, or null when the page has none with a safe slug.
 */
export function readCategory(page) {
  const crumbs = Array.isArray(page.breadcrumbs) ? page.breadcrumbs : [];
  const firstCrumb = crumbs.find((crumb) => isText(crumb?.name));
  if (!firstCrumb) {
    return null;
  }

  const name = firstCrumb.name.trim();
  const slug = makeSlug(name);
  return isSafeSlug(slug) ? { name, slug } : null;
}

/**
 * Counts the category pages the pages need.
 *
 * @param {object[]} pages The pages.
 * @returns {number} How many category pages they need.
 */
export function countCategories(pages) {
  const categories = [...chooseCategories(pages).values()].filter(Boolean);
  return new Set(categories.map((category) => category.slug)).size;
}

/**
 * Builds the category pages of the built search pages, in order of first appearance. A top category's page also
 * links the built category pages under it.
 *
 * @param {object[]} searchPages The built search pages.
 * @param {number} categoryLimit The most category pages to build.
 * @returns {object[]} The category pages, each {slug, name, refreshedAt, subcategories, pages}.
 */
export function buildCategoryPages(searchPages, categoryLimit) {
  const categoryByPageSlug = chooseCategories(searchPages);
  const categoryBySlug = new Map();
  for (const page of searchPages) {
    const category = categoryByPageSlug.get(page.slug);
    if (category) {
      addToCategory(categoryBySlug, category, page);
    }
  }
  const categoryPages = [...categoryBySlug.values()].slice(0, Math.max(0, categoryLimit));
  return categoryPages.map(({ topLevel, isTopCategory, ...categoryPage }) => ({
    ...categoryPage,
    subcategories: isTopCategory ? listSubcategories(topLevel, categoryPages) : [],
  }));
}

/**
 * Picks the links /shop shows: every category page, the first search pages, and the pages on no category page.
 *
 * @param {object[]} searchPages The built search pages, most searched first.
 * @param {object[]} categoryPages The built category pages.
 * @returns {{categories: object[], pages: object[], moreSearches: object[]}} The links.
 */
export function buildPopularSearches(searchPages, categoryPages) {
  const pages = searchPages.slice(0, PopularPageLimit).map(toLink);
  const shownSlugs = new Set(pages.map((page) => page.slug));
  categoryPages.forEach((category) => category.pages.forEach((page) => shownSlugs.add(page.slug)));
  const moreSearches = searchPages.filter((page) => !shownSlugs.has(page.slug)).map(toLink);
  return {
    categories: categoryPages.map((category) => ({ slug: category.slug, name: category.name })),
    pages,
    moreSearches,
  };
}

/**
 * Gives each search page the slug of the category page it is on, so its first breadcrumb links there. A page on its
 * top category's page gets that category as its first breadcrumb.
 *
 * @param {object[]} searchPages The built search pages.
 * @param {object[]} categoryPages The built category pages.
 * @returns {object[]} The search pages, each with categoryPageSlug set or null.
 */
export function linkCategoryPages(searchPages, categoryPages) {
  const categoryByPageSlug = new Map();
  categoryPages.forEach((category) => category.pages.forEach((page) => categoryByPageSlug.set(page.slug, category)));
  return searchPages.map((page) => {
    const category = categoryByPageSlug.get(page.slug);
    if (!category) {
      return { ...page, categoryPageSlug: null };
    }

    const isOwnCategory = readCategory(page)?.slug === category.slug;
    const breadcrumbs = isOwnCategory ? page.breadcrumbs : [{ name: category.name, slug: null }, ...page.breadcrumbs];
    return { ...page, breadcrumbs, categoryPageSlug: category.slug };
  });
}

/**
 * Returns a page's top-level category, the parent of its first breadcrumb, named the way Shop Nobi names it.
 *
 * @param {{categoryPath?: string}} page A fetched or built page.
 * @returns {{name: string, slug: string} | null} The category, or null when its top level has no Shop Nobi name.
 */
function readTopCategory(page) {
  const topLevel = readTopLevel(page.categoryPath);
  if (!Object.hasOwn(PinBoardNameByTopLevel, topLevel)) {
    return null;
  }

  const name = PinBoardNameByTopLevel[topLevel];

  const slug = makeSlug(name);
  return isSafeSlug(slug) ? { name, slug, isTopCategory: true } : null;
}

/** Lists the slug and name of each built category page under a top category, other than the top category's own. */
function listSubcategories(topLevel, categoryPages) {
  return categoryPages
    .filter((categoryPage) => !categoryPage.isTopCategory && categoryPage.topLevel === topLevel)
    .map((categoryPage) => ({ slug: categoryPage.slug, name: categoryPage.name }));
}

/**
 * Chooses the category page each search page goes on: its first breadcrumb's category when that holds enough
 * pages, else its top category. A category that still holds too few pages gets no page.
 *
 * @param {object[]} searchPages The search pages.
 * @returns {Map<string, {name: string, slug: string} | null>} The category of each page, by page slug, or null.
 */
function chooseCategories(searchPages) {
  const ownCountBySlug = countPagesByCategory(searchPages.map(readCategory));
  const chosenCategories = searchPages.map((page) => chooseCategory(page, ownCountBySlug));

  const chosenCountBySlug = countPagesByCategory(chosenCategories);
  const categoryByPageSlug = new Map();
  searchPages.forEach((page, index) => {
    const category = chosenCategories[index];
    const isKept = category && chosenCountBySlug.get(category.slug) >= FewestSearchPagesPerCategory;
    categoryByPageSlug.set(page.slug, isKept ? category : null);
  });
  return categoryByPageSlug;
}

/** Returns a page's own category when it holds enough pages, its top category when not, or null with no breadcrumb. */
function chooseCategory(page, ownCountBySlug) {
  const ownCategory = readCategory(page);
  if (!ownCategory) {
    return null;
  }

  const hasEnoughPages = ownCountBySlug.get(ownCategory.slug) >= FewestSearchPagesPerCategory;
  return hasEnoughPages ? ownCategory : readTopCategory(page);
}

/** Counts the pages in each category, by category slug, skipping pages with none. */
function countPagesByCategory(categories) {
  const countBySlug = new Map();
  for (const category of categories.filter(Boolean)) {
    countBySlug.set(category.slug, (countBySlug.get(category.slug) ?? 0) + 1);
  }
  return countBySlug;
}

/** Adds a search page to its category, creating the category on first use and keeping its latest refresh time. */
function addToCategory(categoryBySlug, category, page) {
  if (!categoryBySlug.has(category.slug)) {
    const topLevel = readTopLevel(page.categoryPath);
    const isTopCategory = category.isTopCategory === true;
    categoryBySlug.set(category.slug, { slug: category.slug, name: category.name, topLevel, isTopCategory, refreshedAt: null, pages: [] });
  }

  const categoryPage = categoryBySlug.get(category.slug);
  categoryPage.pages.push(toLink(page));
  if (page.refreshedAt && (!categoryPage.refreshedAt || page.refreshedAt > categoryPage.refreshedAt)) {
    categoryPage.refreshedAt = page.refreshedAt;
  }
}

/** Returns the slug and title a link to a search page needs. */
function toLink(page) {
  return { slug: page.slug, title: page.title };
}

/**
 * Makes a slug from a name: accents dropped, lowercase, other characters turned into single dashes.
 *
 * @param {string} name The name, such as "Shirts & Tops".
 * @returns {string} The slug, such as "shirts-tops".
 */
export function makeSlug(name) {
  return name
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
