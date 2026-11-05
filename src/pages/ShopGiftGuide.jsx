import React from "react";
import PageLayout from "../components/PageLayout.jsx";
import { useSEO } from "../hooks/useSEO.js";
import { handleProductLinkClick } from "../utils/shopNobiProductClick.js";
import { formatPrice } from "../utils/shopNobiSearchPage.js";
import { readStoreLinkRel } from "../utils/shopNobiPage.js";
import { giftGuideSeo, readEmbeddedGiftGuide } from "../utils/shopGiftGuide.js";
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
      <div className="sgg-section-heading"><p>Selected from Shop Nobi</p><h2>Ideas worth a closer look</h2><span>{guide.products.length} catalog matches</span></div>
      <ol className="sgg-list">
        {guide.products.map((product, index) => {
          const price = formatPrice(product.price, product.currency);
          const handleClick = (event) => handleProductLinkClick(event, { product, position: index + 1,
            query: guide.title, slug: guide.slug, entryPoint: "Gift Guide" });
          return <li className="sgg-item" key={product.productVariantId || product.url}>
            <div className="sgg-ordinal">{String(index + 1).padStart(2, "0")}</div>
            <div className="sgg-picture"><img src={product.imageUrl} alt={product.name} loading={index < 2 ? "eager" : "lazy"} /></div>
            <div className="sgg-item-copy"><p className="sgg-store">{product.storeName || "Retailer"}</p><h3>{product.name}</h3>
              <p>{product.editorialWhy}.</p><p className="sgg-check"><strong>Check before buying:</strong> {product.editorialCheck}</p>
              <div className="sgg-actions"><a href={product.url} target="_blank" rel={readStoreLinkRel(product.paidLink)} onClick={handleClick} onAuxClick={handleClick}>See it at the store <span aria-hidden="true">↗</span></a>{price && <span>{price} at last catalog check</span>}</div>
              {product.paidLink && <small>Affiliate link · Shop Nobi may earn a commission</small>}
            </div>
          </li>;
        })}
      </ol>
      <footer className="sgg-footer"><h2>Want to compare more?</h2><p>Search Shop Nobi for the exact style, size or feature the recipient prefers.</p><a href={`/shop?${new URLSearchParams({ q: guide.products[0]?.sourceQuery || guide.title, utm_source: "gift_guide", utm_campaign: guide.slug })}`}>Search more options</a>
        <p className="sgg-disclosure">Selections reflect current Shop Nobi catalog matches and variety across stores; we have not tested these products hands-on. Some links may earn Shop Nobi a commission. Confirm details, total cost, delivery and returns with the seller.</p></footer>
    </main>
  </PageLayout>;
}
