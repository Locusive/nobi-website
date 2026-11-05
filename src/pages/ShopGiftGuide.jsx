import React from "react";
import PageLayout from "../components/PageLayout.jsx";
import { useSEO } from "../hooks/useSEO.js";
import { handleProductLinkClick } from "../utils/shopNobiProductClick.js";
import { formatPrice } from "../utils/shopNobiSearchPage.js";
import { readStoreLinkRel } from "../utils/shopNobiPage.js";
import { giftGuideProductName, giftGuideSeo, readEmbeddedGiftGuide } from "../utils/shopGiftGuide.js";
import { ShopGiftGuideAdvice } from "../content/shopGiftGuideAdvice.js";
import "./ShopGiftGuide.css";

export default function ShopGiftGuide({ guide: serverGuide = null }) {
  const guide = serverGuide || readEmbeddedGiftGuide(typeof window === "undefined" ? "" : window.location.pathname);
  useSEO(guide ? giftGuideSeo(guide) : { title: "Gift guides | Shop Nobi", noindex: true });
  if (!guide) return <PageLayout active="shop"><main className="sgg-empty"><h1>Guide unavailable</h1><a href="/gift-guides">Browse gift guides</a></main></PageLayout>;
  const updated = guide.generatedAt && !Number.isNaN(Date.parse(guide.generatedAt))
    ? new Date(guide.generatedAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" }) : null;
  return <PageLayout active="shop">
    <main className="sgg">
      <nav aria-label="Breadcrumb" className="sgg-breadcrumb"><a href="/shop">Shop Nobi</a><span>›</span><a href="/gift-guides">Gift guides</a><span>›</span><span>{guide.title}</span></nav>
      <header className="sgg-header">
        <div className="sgg-header-copy"><p className="sgg-kicker">The Shop Nobi gift edit</p><h1>{guide.title}</h1><p className="sgg-intro">{guide.intro}</p>
          <p className="sgg-meta">{updated ? `Guide assembled from the Shop Nobi catalog ${updated}. ` : ""}Individual listings may be older; confirm prices and availability at the store.</p>
        </div>
        <aside className="sgg-note"><span>Before you choose</span><p>Start with the recipient’s habits. Check fit, materials and returns with the seller.</p></aside>
      </header>
      <section className="sgg-advice" aria-labelledby="sgg-advice-heading"><div><p className="sgg-kicker">The buying brief</p><h2 id="sgg-advice-heading">How to choose well</h2></div><ol>{(ShopGiftGuideAdvice[guide.slug] || []).map((tip, index) => <li key={tip}><span>{String(index + 1).padStart(2, "0")}</span>{tip}</li>)}</ol></section>
      <div className="sgg-section-heading"><p>Selected from Shop Nobi</p><h2>Ideas worth a closer look</h2><span>{guide.products.length} catalog matches</span></div>
      <ol className="sgg-list">
        {guide.products.map((product, index) => {
          const price = formatPrice(product.price, product.currency);
          const handleClick = (event) => handleProductLinkClick(event, { product, position: index + 1,
            query: guide.title, slug: guide.slug, entryPoint: "Gift Guide" });
          const displayName = giftGuideProductName(product);
          return <li className="sgg-item" key={product.productVariantId || product.url}>
            <div className="sgg-ordinal">{String(index + 1).padStart(2, "0")}</div>
            <div className="sgg-picture"><img src={product.imageUrl} alt={displayName} loading={index < 2 ? "eager" : "lazy"} /></div>
            <div className="sgg-item-copy"><p className="sgg-store">{product.storeName || "Retailer"}</p><h3>{displayName}</h3>
              <p>{product.editorialWhy}.</p><p className="sgg-check"><strong>Check before buying:</strong> {product.editorialCheck}</p>
              <div className="sgg-actions"><a href={product.url} target="_blank" rel={readStoreLinkRel(product.paidLink)} onClick={handleClick} onAuxClick={handleClick}>See it at the store <span aria-hidden="true">↗</span></a>{price && <span>{price} at last catalog check</span>}</div>
              {product.paidLink && <small>Affiliate link · Shop Nobi may earn a commission</small>}
            </div>
          </li>;
        })}
      </ol>
      <footer className="sgg-footer"><h2>Still looking for the right gift?</h2><p>Tell Shop Nobi what you want to find. Try a style, size, material or budget that these picks missed.</p>
        <form action="/shop" method="get" className="sgg-search-form" role="search">
          <label htmlFor="sgg-search-input">Search for more options</label>
          <div className="sgg-search-row"><input id="sgg-search-input" name="q" type="search" required placeholder={`e.g. ${guide.products[0]?.sourceQuery || "a thoughtful gift"}`} autoComplete="off" /><button type="submit">Search Shop Nobi <span aria-hidden="true">↗</span></button></div>
          <input type="hidden" name="utm_source" value="gift_guide" /><input type="hidden" name="utm_campaign" value={guide.slug} />
        </form>
        <p className="sgg-disclosure">Selections reflect current Shop Nobi catalog matches and variety across stores; we have not tested these products hands-on. Some links may earn Shop Nobi a commission. Confirm details, total cost, delivery and returns with the seller.</p></footer>
    </main>
  </PageLayout>;
}
