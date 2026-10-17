import React from "react";
import { salePagePath } from "../../utils/shopNobiSalePage";

/**
 * The prebuilt list of Shop Nobi sale pages at /shop/sale, one link per category with its number of marked-down
 * products. It stays under the search box until the shopper's own search draws live products.
 *
 * @param {{hub: object}} props The hub data.
 */
export default function ShopNobiSaleHubContent({ hub }) {
  return (
    <main className="mx-auto max-w-6xl px-4 py-8 text-black dark:text-white">
      <nav aria-label="Breadcrumb" className="text-sm text-black/60 dark:text-white/60">
        <ol className="flex flex-wrap gap-2">
          <li><a href="/shop" className="hover:underline">Shop Nobi</a></li>
          <li aria-current="page"><span aria-hidden="true">› </span>{hub.title}</li>
        </ol>
      </nav>
      <h1 className="mt-4 text-3xl font-semibold">{hub.title}</h1>
      {hub.updatedDate && <p className="mt-1 text-sm text-black/50 dark:text-white/50">Updated {hub.updatedDate}</p>}
      <p className="mt-2 max-w-3xl text-black/70 dark:text-white/70">{hub.description}</p>
      <ul className="mt-6 flex flex-wrap gap-3">
        {hub.pages.map((page) => (
          <li key={page.slug} className="rounded-full border border-black/10 px-3 py-1 text-sm dark:border-white/20">
            <a href={salePagePath(page.slug)} className="hover:underline">{page.name}</a>
            <span className="text-black/50 dark:text-white/50"> ({page.productCount})</span>
          </li>
        ))}
      </ul>
    </main>
  );
}
