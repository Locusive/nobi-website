import React from "react";
import ShopNobiProductCard from "./ShopNobiProductCard";
import { buildSaleClickSlug, SaleHubPath, SaleHubTitle } from "../../utils/shopNobiSalePage";

/**
 * A prebuilt Shop Nobi sale page: one category's products that stores marked down, each with the store's own earlier
 * price and price now. It stays under the search box until the shopper's own search draws live products.
 *
 * @param {{page: object}} props The sale page data.
 */
export default function ShopNobiSalePageContent({ page }) {
  const clickSlug = buildSaleClickSlug(page.slug);
  return (
    <main className="mx-auto max-w-6xl px-4 py-8 text-black dark:text-white">
      <nav aria-label="Breadcrumb" className="text-sm text-black/60 dark:text-white/60">
        <ol className="flex flex-wrap gap-2">
          <li><a href="/shop" className="hover:underline">Shop Nobi</a></li>
          <li><span aria-hidden="true">› </span><a href={SaleHubPath} className="hover:underline">{SaleHubTitle}</a></li>
          <li aria-current="page"><span aria-hidden="true">› </span>{page.name}</li>
        </ol>
      </nav>
      <h1 className="mt-4 text-3xl font-semibold">{page.title}</h1>
      {page.updatedDate && <p className="mt-1 text-sm text-black/50 dark:text-white/50">Updated {page.updatedDate}</p>}
      <p className="mt-2 max-w-3xl text-black/70 dark:text-white/70">{page.description}</p>
      <ul className="mt-6 grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
        {page.products.map((product, index) => (
          <ShopNobiProductCard key={index} product={product} position={index + 1} query={page.query} slug={clickSlug} />
        ))}
      </ul>
      <p className="mt-10 text-sm">
        <a href={SaleHubPath} className="underline hover:no-underline">More categories on sale</a>
      </p>
    </main>
  );
}
