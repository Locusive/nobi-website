import React from "react";
import PageLayout from "../components/PageLayout.jsx";
import { useSEO } from "../hooks/useSEO.js";
import { handleProductLinkClick } from "../utils/shopNobiProductClick.js";
import { formatPrice } from "../utils/shopNobiSearchPage.js";
import { readStoreLinkRel } from "../utils/shopNobiPage.js";
import { giftGuidePriceContext, giftGuideProductName, giftGuideSeo, readEmbeddedGiftGuide } from "../utils/shopGiftGuide.js";
import { ShopGiftGuideAdvice } from "../content/shopGiftGuideAdvice.js";
import "./ShopGiftGuide.css";

export default function ShopGiftGuide({ guide: serverGuide = null }) {
  const guide = serverGuide || readEmbeddedGiftGuide(typeof window === "undefined" ? "" : window.location.pathname);
  useSEO(guide ? giftGuideSeo(guide) : { title: "Gift guides | Shop Nobi", noindex: true });
  if (!guide) return <PageLayout active="shop"><main className="sgg-empty"><h1>Guide unavailable</h1><a href="/gift-guides">Browse gift guides</a></main></PageLayout>;
  const editorialSubject = guide.subjectPlural || "products";
  const editorialSingular = guide.subjectSingular || "item";
  const updated = guide.generatedAt && !Number.isNaN(Date.parse(guide.generatedAt))
    ? new Date(guide.generatedAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" }) : null;
  return <PageLayout active="shop" contentTop={guide.editorial ? 80 : 128} background={guide.editorial ? "#f4f2ec" : undefined}>
    <main className={`sgg${guide.editorial ? " sgg-editorial" : ""}`}>
      <nav aria-label="Breadcrumb" className="sgg-breadcrumb"><a href="/shop">Shop Nobi</a><span>›</span><a href="/gift-guides">Guides</a><span>›</span><span>{guide.title}</span></nav>
      <header className="sgg-header">
        <div className="sgg-header-copy"><p className="sgg-kicker">{guide.editorial ? "The Shop Nobi buying edit" : "The Shop Nobi gift edit"}</p><h1>{guide.title}</h1><p className="sgg-intro">{guide.intro}</p>
          <p className="sgg-meta">{updated ? `Guide assembled from the Shop Nobi catalog ${updated}. ` : ""}Individual listings may be older; confirm prices and availability at the store.</p>
          {guide.storyPath && <p className="sgg-meta"><a href={guide.storyPath}>See a short preview as a Web Story</a></p>}
        </div>
        {guide.editorial ? <aside className="sgg-cover"><img src={guide.products[0].imageUrl} alt={giftGuideProductName(guide.products[0])} /><p>Featured: {giftGuideProductName(guide.products[0])}</p></aside>
          : <aside className="sgg-note"><span>Before you choose</span><p>Start with the recipient’s habits. Check fit, materials and returns with the seller.</p></aside>}
      </header>
      {guide.editorial && <section className="sgg-method"><h2>How we chose these {editorialSubject}</h2><p>{guide.methodology}</p></section>}
      {guide.editorial && <section className="sgg-compare" aria-labelledby="sgg-compare-heading"><div className="sgg-compare-intro"><p className="sgg-kicker">At a glance</p><h2 id="sgg-compare-heading">Find your kind of {editorialSingular}</h2><p>Start with the shape and use case, then read the tradeoff before visiting the store. Prices are the last catalog snapshot, not a live quote.</p></div><div className="sgg-compare-scroll"><table><thead><tr><th scope="col">The pick</th><th scope="col">Best for</th><th scope="col">Catalog price</th></tr></thead><tbody>{guide.products.map((product, index) => <tr key={product.productVariantId || product.url}><th scope="row"><a href={`#pick-${index + 1}`}>{product.editorialHeading.split(" — ")[0]}</a></th><td>{product.editorialHeading.split(" — ")[1]}</td><td>{formatPrice(product.price, product.currency) || "Check store"}</td></tr>)}</tbody></table></div></section>}
      {guide.editorial && <nav className="sgg-jump" aria-label={`Jump to a ${editorialSingular}`}><span>Explore the picks</span><div>{guide.products.map((product, index) => <a key={product.productVariantId || product.url} href={`#pick-${index + 1}`}>{product.editorialHeading.split(" — ")[0]}</a>)}</div></nav>}
      <section className="sgg-advice" aria-labelledby="sgg-advice-heading"><div><p className="sgg-kicker">The buying brief</p><h2 id="sgg-advice-heading">How to choose well</h2></div><ol>{(guide.editorial ? guide.buyingGuide : ShopGiftGuideAdvice[guide.slug] || []).map((tip, index) => <li key={tip}><span>{String(index + 1).padStart(2, "0")}</span>{tip}</li>)}</ol></section>
      <div className="sgg-section-heading"><p>Selected from Shop Nobi</p><h2>{guide.editorial ? `The ten ${editorialSubject}` : "Ideas worth a closer look"}</h2><span>{guide.editorial ? "10 researched picks" : `${guide.products.length} catalog matches`}</span></div>
      <ol className="sgg-list">
        {guide.products.map((product, index) => {
          const price = formatPrice(product.price, product.currency);
          const handleClick = (event) => handleProductLinkClick(event, { product, position: index + 1,
            query: guide.title, slug: guide.slug, entryPoint: "Gift Guide" });
          const displayName = giftGuideProductName(product);
          const priceContext = giftGuidePriceContext(product, guide.products);
          const buyingChecks = ShopGiftGuideAdvice[guide.slug] || [];
          const buyingCheck = buyingChecks[index % buyingChecks.length] || product.editorialCheck;
          return <li className="sgg-item" id={guide.editorial ? `pick-${index + 1}` : undefined} key={product.productVariantId || product.url}>
            <div className="sgg-ordinal">{String(index + 1).padStart(2, "0")}</div>
            <div className="sgg-picture"><img src={product.imageUrl} alt={displayName} loading={index < 2 ? "eager" : "lazy"} /></div>
            <div className="sgg-item-copy"><p className="sgg-store">{product.storeName || "Retailer"}</p><h3>{product.editorialHeading || displayName}</h3>
              {product.editorialDetail && <p className="sgg-item-detail">{product.editorialDetail}</p>}
              {product.editorialWhy ? <p className="sgg-item-why"><strong>Why it made the list.</strong> {product.editorialWhy}</p> : priceContext && <p>{priceContext}</p>}
              <p className="sgg-check"><strong>What to check.</strong> {product.editorialCheck || buyingCheck}</p>
              <div className="sgg-actions"><a href={product.url} target="_blank" rel={readStoreLinkRel(product.paidLink)} onClick={handleClick} onAuxClick={handleClick}>{guide.editorial ? `Explore ${displayName} at ${product.storeName}` : "See it at the store"} <span aria-hidden="true">↗</span></a>{price && <span>{price} at last catalog check</span>}</div>
              {product.editorialSource && <a className="sgg-source" href={product.editorialSource} target="_blank" rel="noopener noreferrer">Check the maker’s product details</a>}
              {product.paidLink && <small>Affiliate link · Shop Nobi may earn a commission</small>}
            </div>
          </li>;
        })}
      </ol>
      <footer className="sgg-footer"><h2>{guide.editorial ? `Didn't find your ${editorialSingular}?` : "Still looking for the right gift?"}</h2><p>Tell Shop Nobi what you want to find. Try a style, size, material or budget that these picks missed.</p>
        <form action="/shop" method="get" className="sgg-search-form" role="search">
          <label htmlFor="sgg-search-input">Search for more options</label>
          <div className="sgg-search-row"><input id="sgg-search-input" name="q" type="search" required placeholder={`e.g. ${guide.searchExample || guide.products[0]?.sourceQuery || "a thoughtful gift"}`} autoComplete="off" /><button type="submit">Search Shop Nobi <span aria-hidden="true">↗</span></button></div>
          <input type="hidden" name="utm_source" value="gift_guide" /><input type="hidden" name="utm_campaign" value={guide.slug} />
        </form>
        <p className="sgg-disclosure">Selections reflect current Shop Nobi catalog matches and variety across stores; we have not tested these products hands-on. {guide.paidCount > 0 ? "Some links may earn Shop Nobi a commission." : "The current picks use standard store links."} Confirm details, total cost, delivery and returns with the seller.</p></footer>
    </main>
  </PageLayout>;
}
