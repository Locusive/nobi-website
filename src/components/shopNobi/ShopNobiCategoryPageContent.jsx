import React from "react";
import ShopNobiSearchLinks from "./ShopNobiSearchLinks";
import { categoryPagePath, describeCategoryPage } from "../../utils/shopNobiCategoryPage";
import { searchPagePath } from "../../utils/shopNobiSearchPage";

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
      <JewelryComparison rows={category.jewelryComparisons ?? []} />
      <Subcategories subcategories={category.subcategories ?? []} />
      <ShopNobiSearchLinks pages={category.pages} />
    </main>
  );
}

/** A listing-name comparison, shown only while at least two reviewed examples remain supported. */
function JewelryComparison({ rows }) {
  if (rows.length < 2) return null;

  return (
    <section className="mt-8 max-w-4xl" aria-labelledby="jewelry-comparison-heading">
      <h2 id="jewelry-comparison-heading" className="text-xl font-semibold">Compare the piece, stone and metal</h2>
      <p className="mt-3 max-w-3xl text-black/70 dark:text-white/70">
        Start with the kind of piece you want, then separate the stone name from the metal description.
        A collection heading or white gemstone does not establish the metal of the exact version you are buying.
      </p>
      <p className="mt-3 max-w-3xl text-sm text-black/60 dark:text-white/60">
        These examples read the words in listing names, checked October 23, 2026.
        They are not independent material certifications or products we have tested.
      </p>
      <table role="table" className="mt-5 block w-full table-fixed border-collapse text-left text-sm sm:table">
        <caption className="sr-only">What the selected listing names say about the piece, stone and metal</caption>
        <colgroup className="hidden sm:table-column-group"><col className="w-[43%]" /><col /><col /><col /></colgroup>
        <thead className="sr-only sm:not-sr-only sm:table-header-group"><tr className="border-b border-black/20 dark:border-white/30">
          {["Listing example", "Piece named", "Stone named", "Metal named"].map((label) => (
            <th key={label} scope="col" className="break-words px-2 py-3 align-bottom font-semibold first:pl-0">{label}</th>
          ))}
        </tr></thead>
        <tbody className="block sm:table-row-group">{rows.map((row) => (
          <tr key={row.slug} className="block border-b border-black/10 pb-4 dark:border-white/20 sm:table-row sm:pb-0">
            <th scope="row" className="block break-normal pb-2 pt-4 align-top font-normal sm:table-cell sm:py-4 sm:pr-2">
              <a href={searchPagePath(row.slug)} className="underline underline-offset-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4">{row.name}</a>
            </th>
            {[row.piece, row.stone, row.metal].map((value, index) => (
              <td key={index} className="grid grid-cols-[6rem_1fr] gap-2 break-normal py-1 align-top text-black/70 dark:text-white/70 sm:table-cell sm:px-2 sm:py-4">
                <span aria-hidden="true" className="text-black/60 dark:text-white/60 sm:hidden">{["Piece named", "Stone named", "Metal named"][index]}</span>
                {value}
              </td>
            ))}
          </tr>
        ))}</tbody>
      </table>
      <p className="mt-3 max-w-3xl text-sm text-black/60 dark:text-white/60">
        “Not named” means the title does not provide that detail. It does not mean the item contains no stone or metal.
        Links open collections, not a guaranteed available variant.
      </p>
      <ol className="mt-4 max-w-3xl list-decimal space-y-2 pl-5 text-black/70 dark:text-white/70">
        <li>Choose the piece: ring, earrings or charm.</li>
        <li>Verify the selected variant’s metal, finish and stones with the retailer; a colour word is not a composition specification.</li>
        <li>Check dimensions and quantity. An earring name alone does not establish whether it sells singly or as a pair; a charm may need a compatible chain.</li>
        <li>Compare current total price and returns after identifying the actual options.</li>
      </ol>
    </section>
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
