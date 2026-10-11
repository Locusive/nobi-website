import React from "react";
import ShopNobiSearchLinks from "./ShopNobiSearchLinks";
import { categoryPagePath } from "../../utils/shopNobiCategoryPage";
import { ShopNobiPageSeo } from "../../utils/shopNobiPage";

/**
 * Links from /shop to the category pages, the most searched pages and the pages without a category, shown
 * until the live search takes over so crawlers always find them.
 *
 * @param {{popularSearches: {categories: object[], pages: object[], moreSearches: object[]}}} props The links.
 */
export default function ShopNobiPopularSearches({ popularSearches }) {
  const { categories, pages, moreSearches } = popularSearches;

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 text-black dark:text-white">
      <h1 className="text-3xl font-semibold">Shop Nobi</h1>
      <p className="mt-2 max-w-3xl text-black/70 dark:text-white/70">{ShopNobiPageSeo.description}</p>
      <h2 className="mt-8 text-lg font-semibold">Popular searches</h2>
      {categories.length > 0 && (
        <ul className="mt-4 flex flex-wrap gap-3">
          {categories.map((category) => (
            <li key={category.slug} className="rounded-full border border-black/10 px-3 py-1 text-sm dark:border-white/20">
              <a href={categoryPagePath(category.slug)} className="hover:underline">{category.name}</a>
            </li>
          ))}
        </ul>
      )}
      <ShopNobiSearchLinks pages={pages} />
      {moreSearches.length > 0 && (
        <section className="mt-10">
          <h2 className="text-lg font-semibold">More searches</h2>
          <ShopNobiSearchLinks pages={moreSearches} />
        </section>
      )}
    </main>
  );
}
