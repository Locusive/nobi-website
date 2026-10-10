import React from "react";
import { formatPrice, searchPagePath } from "../../utils/shopNobiSearchPage";

/**
 * The products of a prebuilt Shop Nobi search page. The build writes this into the HTML for crawlers, and
 * visitors see it until the live search takes its place.
 *
 * @param {{page: object}} props The search page data.
 */
export default function ShopNobiSearchPageContent({ page }) {
  return (
    <main className="mx-auto max-w-6xl px-4 py-8 text-black dark:text-white">
      <Breadcrumbs page={page} />
      <h1 className="mt-4 text-3xl font-semibold">{page.title}</h1>
      <ul className="mt-6 grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
        {page.products.map((product, index) => (
          <ProductCard key={index} product={product} />
        ))}
      </ul>
      <RelatedSearches related={page.related} />
    </main>
  );
}

/** Links back to Shop Nobi and to each category that has its own page. */
function Breadcrumbs({ page }) {
  return (
    <nav aria-label="Breadcrumb" className="text-sm text-black/60 dark:text-white/60">
      <ol className="flex flex-wrap gap-2">
        <li><a href="/shop" className="hover:underline">Shop Nobi</a></li>
        {page.breadcrumbs.map((crumb, index) => (
          <li key={index}>
            <span aria-hidden="true">› </span>
            {crumb.slug ? <a href={searchPagePath(crumb.slug)} className="hover:underline">{crumb.name}</a> : crumb.name}
          </li>
        ))}
        <li aria-current="page"><span aria-hidden="true">› </span>{page.title}</li>
      </ol>
    </nav>
  );
}

/** One product: its picture, name, store and price, linking to the store's page in a new tab. */
function ProductCard({ product }) {
  const price = formatPrice(product.price, product.currency);

  return (
    <li>
      <a href={product.url} rel="nofollow noopener" target="_blank" className="group block">
        {product.imageUrl && (
          <img src={product.imageUrl} alt={product.name} loading="lazy" className="aspect-square w-full rounded-lg bg-black/5 object-cover" />
        )}
        <p className="mt-2 text-sm font-medium group-hover:underline">{product.name}</p>
      </a>
      {product.storeName && <p className="text-sm text-black/60 dark:text-white/60">{product.storeName}</p>}
      {price && <p className="text-sm font-semibold">{price}</p>}
    </li>
  );
}

/** Links to other search pages about similar products. */
function RelatedSearches({ related }) {
  if (related.length === 0) {
    return null;
  }

  return (
    <section className="mt-10">
      <h2 className="text-lg font-semibold">Related searches</h2>
      <ul className="mt-3 flex flex-wrap gap-3">
        {related.map((page) => (
          <li key={page.slug}>
            <a href={searchPagePath(page.slug)} className="rounded-full border border-black/10 px-3 py-1 text-sm hover:underline dark:border-white/20">
              {page.title}
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
