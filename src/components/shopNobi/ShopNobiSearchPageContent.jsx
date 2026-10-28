import React, { useEffect } from "react";
import { handleProductLinkClick } from "../../utils/shopNobiProductClick";
import { FirstProductPosition, sendSearchPageShownProducts } from "../../utils/shopNobiShownProducts";
import { formatPrice, readCrumbPath, readRelatedSearchPath } from "../../utils/shopNobiSearchPage";
import { CommissionNotice, readStoreLinkRel } from "../../utils/shopNobiPage";
import { focusLandingSearch, landingVariant, LiveSearchAnchor, participatesInLandingExperiment, ProductsFirstVariant } from "../../utils/shopNobiLandingExperiment";

/**
 * The products of a prebuilt Shop Nobi search page, which visitors see until live products replace them, and which a
 * page view records as shown. The build writes it into the HTML for crawlers and runs no effects, so it records nothing.
 *
 * @param {{page: object}} props The search page data.
 */
export default function ShopNobiSearchPageContent({ page }) {
  const inExperiment = participatesInLandingExperiment(page);
  const productsFirst = inExperiment && landingVariant(page.slug) === ProductsFirstVariant;
  // Keyed on the slug, so the page records its products once however often it renders.
  useEffect(() => sendSearchPageShownProducts(page), [page.slug]);

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 text-black dark:text-white">
      <Breadcrumbs page={page} />
      <h1 className="mt-4 text-3xl font-semibold">{page.title}</h1>
      {page.updatedDate && <p className="mt-1 text-sm text-black/50 dark:text-white/50">Updated {page.updatedDate}</p>}
      {page.description && <p className="mt-2 max-w-3xl text-black/70 dark:text-white/70">{page.description}</p>}
      {productsFirst && (
        <p className="mt-4">
          <a href={`#${LiveSearchAnchor}`} onClick={event => focusLandingSearch(event, page.slug)}
            className="inline-block rounded-full border border-black/20 px-4 py-2 text-sm font-medium hover:bg-black/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 dark:border-white/30 dark:hover:bg-white/10">
            Search for something more specific
          </a>
        </p>
      )}
      {!productsFirst && <BuyingGuide page={page} />}
      <ul className="mt-6 grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
        {page.products.map((product, index) => (
          <ProductCard key={index} product={product} position={index + FirstProductPosition} query={page.query} slug={page.slug} landingExperiment={inExperiment} />
        ))}
      </ul>
      {productsFirst && <section className="mt-10" aria-label="Buying guidance"><BuyingGuide page={page} /></section>}
      {page.productComparisonPath && <p className="mt-6"><a className="underline" href={page.productComparisonPath}>Compare sellers for the Bodum Tribute 34 oz French press</a></p>}
      <Questions faq={page.faq} />
      <WebStoryLink storyPath={page.storyPath} />
      <RelatedSearches related={page.related} />
    </main>
  );
}

/** Preserve all authored guidance and its sources when the experiment moves it below the products. */
function BuyingGuide({ page }) {
  return <>
    {page.guide.map((paragraph, index) => (
      <p key={index} className="mt-3 max-w-3xl text-black/70 dark:text-white/70">{paragraph}</p>
    ))}
    <ProductComparison comparison={page.comparison} />
    <GuideSources sources={page.guideSources ?? []} />
  </>;
}

/** An optional semantic comparison stays inside the guide's existing experiment placement. */
function ProductComparison({ comparison }) {
  if (!comparison?.rows?.length) return null;
  return (
    <div className="mt-5 max-w-full rounded-lg border border-black/10 dark:border-white/20">
      <div className="p-4">
        <h2 className="text-lg font-semibold">{comparison.caption}</h2>
        <p className="mt-1 text-sm text-black/60 dark:text-white/60">{comparison.note}</p>
        <p className="mt-2 text-sm text-black/60 dark:text-white/60 sm:hidden">Scroll sideways to compare all details.</p>
      </div>
      <div role="region" aria-label={comparison.caption} tabIndex={0}
        className="max-w-full overflow-x-auto rounded-b-lg focus-visible:outline focus-visible:outline-2">
        <table className="w-full min-w-[40rem] text-left text-sm">
          <caption className="sr-only">{comparison.caption}</caption>
          <thead className="bg-black/5 dark:bg-white/10">
            <tr>{(comparison.columns ?? ["Model", "Setup", "Adjustment", "Device-fit check"]).map(label => <th key={label} scope="col" className="p-3 font-semibold">{label}</th>)}</tr>
          </thead>
          <tbody>
            {comparison.rows.map(row => (
              <tr key={row.model} className="border-t border-black/10 align-top dark:border-white/20">
                <th scope="row" className="p-3 font-medium">{row.model}</th>
                <td className="p-3">{row.setup}</td>
                <td className="p-3">{row.adjustment}</td>
                <td className="p-3">{row.fit}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/** Optional references for the exact product facts in authored guidance. */
function GuideSources({ sources }) {
  if (sources.length === 0) return null;
  return (
    <ul aria-label="Guidance sources" className="mt-3 max-w-3xl text-sm text-black/60 dark:text-white/60">
      {sources.map(({ label, url }) => (
        <li key={url}><a href={url} target="_blank" rel="noopener noreferrer nofollow" className="underline underline-offset-2">{label}</a></li>
      ))}
    </ul>
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
 * One product: its picture, name, store and price, linking to the store's page in a new tab. A click sets the link to
 * open and is counted. A link that earns a commission has a small notice under it.
 */
function ProductCard({ product, position, query, slug, landingExperiment }) {
  const price = formatPrice(product.price, product.currency);
  const commissionNotice = product.commissionNotice || (product.paidLink ? CommissionNotice : null);
  const handleClick = (event) => handleProductLinkClick(event, { product, position, query, slug, landingExperiment });

  return (
    <li>
      <a
        href={product.url}
        rel={readStoreLinkRel(product.paidLink)}
        target="_blank"
        onClick={handleClick}
        onAuxClick={handleClick}
        className="group block"
      >
        {product.imageUrl && (
          <img src={product.imageUrl} alt={product.name} loading="lazy" className="aspect-square w-full rounded-lg bg-black/5 object-cover" />
        )}
        <p className="mt-2 text-sm font-medium group-hover:underline">{product.name}</p>
      </a>
      {product.storeName && <p className="text-sm text-black/60 dark:text-white/60">{product.storeName}</p>}
      {price && <p className="text-sm font-semibold">{price}</p>}
      {commissionNotice && (
        <p className={product.commissionNotice
          ? "mt-1 text-xs leading-snug text-black/70 dark:text-white/70"
          : "mt-1 text-[10px] leading-tight text-black/40 dark:text-white/40"}>
          {commissionNotice}
        </p>
      )}
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

/** Links to related built pages, or opens the related query when it has no prebuilt page. */
function RelatedSearches({ related }) {
  if (related.length === 0) {
    return null;
  }

  return (
    <section className="mt-10">
      <h2 className="text-lg font-semibold">Related searches</h2>
      <ul className="mt-3 flex flex-wrap gap-3">
        {related.map((page, index) => {
          const path = readRelatedSearchPath(page);
          return (
            <li key={index} className="rounded-full border border-black/10 px-3 py-1 text-sm dark:border-white/20">
              {path ? <a href={path} className="hover:underline">{page.title}</a> : page.title}
            </li>
          );
        })}
      </ul>
    </section>
  );
}

