// Shop Nobi has one Pinterest board per top level of the Google product taxonomy. Each board reads its own RSS
// feed at /shop/pins/<slug>.xml, which holds only the search pages under that top level.

import { BaseUrl } from "./shopNobiPage.js";

/** The board name for each top level of a page's categoryPath: Google's taxonomy, in Shop Nobi wording. */
export const PinBoardNameByTopLevel = Object.freeze({
  apparel_accessories: "Apparel & Accessories",
  home_garden: "Home & Garden",
  health_beauty: "Health & Beauty",
  sporting_goods: "Sporting Goods",
  food_beverages_tobacco: "Food & Drinks",
  arts_entertainment: "Arts & Crafts",
  hardware: "Hardware & Tools",
  toys_games: "Toys & Games",
  furniture: "Furniture",
  office_supplies: "Office Supplies",
  electronics: "Electronics",
  media: "Books, Movies & Music",
  baby_toddler: "Baby & Toddler",
  animals_pet_supplies: "Pet Supplies",
  luggage_bags: "Luggage & Bags",
  cameras_optics: "Cameras & Optics",
  vehicles_parts: "Vehicles & Parts",
  software: "Software",
  business_industrial: "Business & Industrial",
  religious_ceremonial: "Religious & Ceremonial",
});

/** The top level kept out of every feed, because Pinterest bans weapons. */
export const BannedTopLevel = "mature";

const PinBoardFeedPathPrefix = "/shop/pins/";
const CategoryPathSeparator = ".";

/**
 * Returns the top level of a category path, such as "apparel_accessories" for "apparel_accessories.shoes.boots".
 *
 * @param {unknown} categoryPath The page's category path.
 * @returns {string | null} The top level in lowercase, or null when the path is missing or blank.
 */
export function readTopLevel(categoryPath) {
  if (typeof categoryPath !== "string") {
    return null;
  }

  const topLevel = categoryPath.split(CategoryPathSeparator)[0].trim().toLowerCase();
  return topLevel || null;
}

/**
 * Lists every Pinterest board, in the order of the name map.
 *
 * @returns {{topLevel: string, slug: string, name: string, feedPath: string, feedUrl: string}[]} The boards.
 */
export function listPinBoards() {
  return Object.entries(PinBoardNameByTopLevel).map(([topLevel, name]) => {
    const slug = topLevel.replaceAll("_", "-");
    const feedPath = `${PinBoardFeedPathPrefix}${slug}.xml`;
    return { topLevel, slug, name, feedPath, feedUrl: `${BaseUrl}${feedPath}` };
  });
}
