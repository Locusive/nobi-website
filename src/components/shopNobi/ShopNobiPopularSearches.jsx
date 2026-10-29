import React from "react";
import ShopNobiSearchLinks from "./ShopNobiSearchLinks";
import { categoryPagePath } from "../../utils/shopNobiCategoryPage";
import { ShopNobiPageSeo } from "../../utils/shopNobiPage";

const VisibleCategoryCount = 12;

/**
 * Browse links stay beneath the idle assistant. Native disclosures keep every destination in the HTML
 * without presenting thousands of expanded links. Before the assistant mounts, the page retains its introduction.
 *
 * @param {{popularSearches: {categories: object[], pages: object[], moreSearches: object[]}, compact?: boolean}} props The links and mounted presentation.
 */
export default function ShopNobiPopularSearches({ popularSearches, compact = false }) {
  const { categories, pages, moreSearches } = popularSearches;

  return (
    <section aria-labelledby="shop-nobi-browse-heading" className="mx-auto max-w-6xl px-4 py-8 text-black dark:text-white">
      {!compact && <>
        <h1 className="text-3xl font-semibold">Shop Nobi</h1>
        <p className="mt-2 max-w-3xl text-black/70 dark:text-white/70">{ShopNobiPageSeo.description}</p>
      </>}
      <h2 id="shop-nobi-browse-heading" className={`${compact ? "" : "mt-8 "}text-lg font-semibold`}>Browse products</h2>
      <CategoryLinks categories={categories.slice(0, VisibleCategoryCount)} />
      <BrowseDisclosure label="More categories" count={Math.max(0, categories.length - VisibleCategoryCount)}>
        <CategoryLinks categories={categories.slice(VisibleCategoryCount)} />
      </BrowseDisclosure>
      <BrowseDisclosure label="Popular searches" count={pages.length}>
        <ShopNobiSearchLinks pages={pages} />
      </BrowseDisclosure>
      <BrowseDisclosure label="More searches" count={moreSearches.length}>
        <ShopNobiSearchLinks pages={moreSearches} />
      </BrowseDisclosure>
    </section>
  );
}

/** Renders each category once, with its existing destination and label. */
function CategoryLinks({ categories }) {
  if (!categories.length) return null;
  return <ul className="mt-4 flex flex-wrap gap-3">
    {categories.map((category) => (
      <li key={category.slug} className="rounded-full border border-black/10 px-3 py-1 text-sm dark:border-white/20">
        <a href={categoryPagePath(category.slug)} className="hover:underline">{category.name}</a>
      </li>
    ))}
  </ul>;
}

/** Native details remain keyboard-operable without JavaScript; closed content still contains all links. */
function BrowseDisclosure({ label, count, children }) {
  if (!count) return null;
  return <details className="mt-4 rounded-lg border border-black/10 p-3 dark:border-white/20">
    <summary className="cursor-pointer font-medium">{label} ({count})</summary>
    {children}
  </details>;
}
