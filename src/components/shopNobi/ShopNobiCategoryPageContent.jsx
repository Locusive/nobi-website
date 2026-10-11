import React from "react";
import ShopNobiSearchLinks from "./ShopNobiSearchLinks";
import { describeCategoryPage } from "../../utils/shopNobiCategoryPage";

/**
 * A prebuilt Shop Nobi category page: its name and links to its search pages. Visitors see it until the live
 * search takes its place.
 *
 * @param {{category: {name: string, pages: object[]}}} props The category page data.
 */
export default function ShopNobiCategoryPageContent({ category }) {
  return (
    <main className="mx-auto max-w-6xl px-4 py-8 text-black dark:text-white">
      <nav aria-label="Breadcrumb" className="text-sm text-black/60 dark:text-white/60">
        <ol className="flex flex-wrap gap-2">
          <li><a href="/shop" className="hover:underline">Shop Nobi</a></li>
          <li aria-current="page"><span aria-hidden="true">› </span>{category.name}</li>
        </ol>
      </nav>
      <h1 className="mt-4 text-3xl font-semibold">{category.name}</h1>
      <p className="mt-2 max-w-3xl text-black/70 dark:text-white/70">{describeCategoryPage(category.name)}</p>
      <ShopNobiSearchLinks pages={category.pages} />
    </main>
  );
}
