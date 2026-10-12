import React from "react";
import { formatPrice, readCrumbPath, searchPagePath, replaceProductLinkOnClick } from "../../utils/shopNobiSearchPage";
import { CommissionNotice, readStoreLinkRel } from "../../utils/shopNobiPage";

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
      {page.updatedDate && <p className="mt-1 text-sm text-black/50 dark:text-white/50">Updated {page.updatedDate}</p>}
      {page.description && <p className="mt-2 max-w-3xl text-black/70 dark:text-white/70">{page.description}</p>}
      {page.guide.map((paragraph, index) => (
        <p key={index} className="mt-3 max-w-3xl text-black/70 dark:text-white/70">{paragraph}</p>
      ))}
      <ul className="mt-6 grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
        {page.products.map((product, index) => (
          <ProductCard key={index} product={product} />
        ))}
      </ul>
      <Questions faq={page.faq} />
      <WebStoryLink storyPath={page.storyPath} />
      <RelatedSearches related={page.related} />
    </main>
  );
}

/** Links back to Shop Nobi, to the category page, and to each category that has its own search page. */
function Breadcrumbs({ page }) {
  return (
    <nav aria-label="Breadcrumb" className="text-sm text-black/60 dark:text-white/60">
      <ol className="flex flex-wrap gap-2">
        <li><a href="/shop" className="hover:underline">Shop Nobi</a></li>
        {page.breadcrumbs.map((crumb, index) => {
          const crumbPath = readCrumbPath(page, crumb, index);
          return (
            <li key={index}>
              <span aria-hidden="true">› </span>
              {crumbPath ? <a href={crumbPath} className="hover:underline">{crumb.name}</a> : crumb.name}
            </li>
          );
        })}
        <li aria-current="page"><span aria-hidden="true">› </span>{page.title}</li>
      </ol>
    </nav>
  );
}

/**
 * One product: its picture, name, store and price, linking to the store's page in a new tab. A click swaps in the
 * link to open. A link that earns a commission has a small notice under it.
 */
function ProductCard({ product }) {
  const price = formatPrice(product.price, product.currency);
  const followStoreLink = (event) => replaceProductLinkOnClick(event, product);

  return (
    <li>
      <a
        href={product.url}
        rel={readStoreLinkRel(product.paidLink)}
        target="_blank"
        onClick={followStoreLink}
        onAuxClick={followStoreLink}
        className="group block"
      >
        {product.imageUrl && (
          <img src={product.imageUrl} alt={product.name} loading="lazy" className="aspect-square w-full rounded-lg bg-black/5 object-cover" />
        )}
        <p className="mt-2 text-sm font-medium group-hover:underline">{product.name}</p>
      </a>
      {product.storeName && <p className="text-sm text-black/60 dark:text-white/60">{product.storeName}</p>}
      {price && <p className="text-sm font-semibold">{price}</p>}
      {product.paidLink && <p className="mt-1 text-[10px] leading-tight text-black/40 dark:text-white/40">{CommissionNotice}</p>}
    </li>
  );
}

/** Common questions about these products, with their answers. */
function Questions({ faq }) {
  if (faq.length === 0) {
    return null;
  }

  return (
    <section className="mt-10 max-w-3xl">
      <h2 className="text-lg font-semibold">Questions</h2>
      {faq.map((entry, index) => (
        <div key={index} className="mt-4">
          <h3 className="font-medium">{entry.question}</h3>
          <p className="mt-1 text-black/70 dark:text-white/70">{entry.answer}</p>
        </div>
      ))}
    </section>
  );
}

/** Links to this page's Google Web Story, when the build made one. */
function WebStoryLink({ storyPath }) {
  if (!storyPath) {
    return null;
  }

  return (
    <p className="mt-10 text-sm">
      <a href={storyPath} className="underline hover:no-underline">See this guide as a Web Story</a>
    </p>
  );
}

/** Links to other search pages about similar products. A search that was not built shows as plain text. */
function RelatedSearches({ related }) {
  if (related.length === 0) {
    return null;
  }

  return (
    <section className="mt-10">
      <h2 className="text-lg font-semibold">Related searches</h2>
      <ul className="mt-3 flex flex-wrap gap-3">
        {related.map((page, index) => (
          <li key={index} className="rounded-full border border-black/10 px-3 py-1 text-sm dark:border-white/20">
            {page.slug ? <a href={searchPagePath(page.slug)} className="hover:underline">{page.title}</a> : page.title}
          </li>
        ))}
      </ul>
    </section>
  );
}
