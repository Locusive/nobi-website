// Groups the built search pages into category pages by their first breadcrumb, and picks the links /shop shows.

import { isSafeSlug, isText } from "./shop-nobi-search-page-view.js";

const PopularPageLimit = 50;

/**
 * Returns a page's top category: its first breadcrumb's name, with a slug made from that name.
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
 * Counts the different top categories among the pages.
 *
 * @param {object[]} pages The pages.
 * @returns {number} How many category pages they need.
 */
export function countCategories(pages) {
  return new Set(pages.map(readCategory).filter(Boolean).map((category) => category.slug)).size;
}

/**
 * Builds one category page per top category of the built search pages, in order of first appearance.
 *
 * @param {object[]} searchPages The built search pages.
 * @param {number} categoryLimit The most category pages to build.
 * @returns {{slug: string, name: string, refreshedAt: string | null, pages: object[]}[]} The category pages.
 */
export function buildCategoryPages(searchPages, categoryLimit) {
  const categoryBySlug = new Map();
  for (const page of searchPages) {
    const category = readCategory(page);
    if (category) {
      addToCategory(categoryBySlug, category, page);
    }
  }
  return [...categoryBySlug.values()].slice(0, Math.max(0, categoryLimit));
}

/**
 * Picks the links /shop shows: every category page, the first search pages, and the pages without a category.
 *
 * @param {object[]} searchPages The built search pages, most searched first.
 * @param {object[]} categoryPages The built category pages.
 * @returns {{categories: object[], pages: object[], moreSearches: object[]}} The links.
 */
export function buildPopularSearches(searchPages, categoryPages) {
  const pages = searchPages.slice(0, PopularPageLimit).map(toLink);
  const shownSlugs = new Set(pages.map((page) => page.slug));
  const moreSearches = searchPages.filter((page) => !readCategory(page) && !shownSlugs.has(page.slug)).map(toLink);
  return {
    categories: categoryPages.map((category) => ({ slug: category.slug, name: category.name })),
    pages,
    moreSearches,
  };
}

/** Adds a search page to its category, creating the category on first use and keeping its latest refresh time. */
function addToCategory(categoryBySlug, category, page) {
  if (!categoryBySlug.has(category.slug)) {
    categoryBySlug.set(category.slug, { ...category, refreshedAt: null, pages: [] });
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

/** Makes a slug from a name: accents dropped, lowercase, other characters turned into single dashes. */
function makeSlug(name) {
  return name
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
