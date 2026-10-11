// A Shop Nobi web story is a Google Web Story for one search page at /shop/stories/<slug>, built from the
// same page data. The search page links to it, so the build and the browser both need its address.

import { BaseUrl } from "./shopNobiPage.js";

const WebStoryPathPrefix = "/shop/stories/";

/**
 * Returns the path of a search page's web story.
 *
 * @param {string} slug The search page's slug, such as "black-leather-boots".
 * @returns {string} The path, such as "/shop/stories/black-leather-boots".
 */
export function webStoryPath(slug) {
  return `${WebStoryPathPrefix}${slug}`;
}

/**
 * Returns the full address of a search page's web story.
 *
 * @param {string} slug The search page's slug.
 * @returns {string} The story's address on nobi.ai.
 */
export function webStoryUrl(slug) {
  return `${BaseUrl}${webStoryPath(slug)}`;
}
