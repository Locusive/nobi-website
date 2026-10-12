import React from "react";
import ShopNobiSearchLinks from "./ShopNobiSearchLinks";
import { categoryPagePath, describeCategoryPage } from "../../utils/shopNobiCategoryPage";

/**
 * A prebuilt Shop Nobi category page: its name, links to the category pages under it, and links to its search
 * pages. It stays under the search box until the shopper's own search draws live products.
 *
 * @param {{category: {name: string, subcategories?: object[], pages: object[]}}} props The category page data.
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
      <Subcategories subcategories={category.subcategories ?? []} />
      <ShopNobiSearchLinks pages={category.pages} />
    </main>
  );
}

/** Links to the category pages under a top category's page, when it has any. */
function Subcategories({ subcategories }) {
  if (subcategories.length === 0) {
    return null;
  }

  return (
    <section className="mt-6">
      <h2 className="text-lg font-semibold">Browse by category</h2>
      <ul className="mt-3 flex flex-wrap gap-3">
        {subcategories.map((subcategory) => (
          <li key={subcategory.slug} className="rounded-full border border-black/10 px-3 py-1 text-sm dark:border-white/20">
            <a href={categoryPagePath(subcategory.slug)} className="hover:underline">{subcategory.name}</a>
          </li>
        ))}
      </ul>
    </section>
  );
}
