import React from "react";
import { useLocation } from "react-router-dom";
import { useSEO } from "../hooks/useSEO.js";
import { buildElectionNightMealUrl, ElectionNightCheckedDate, ElectionNightElectionSource, ElectionNightEntryPoint, ElectionNightProduct, ElectionNightQuery, ElectionNightSeo, ElectionNightSlug } from "../content/electionNight.js";
import { handleProductLinkClick } from "../utils/shopNobiProductClick.js";
import { readStoreLinkRel } from "../utils/shopNobiPage.js";

/** A readable, nonpartisan checklist with optional existing earning destinations. */
export default function ElectionNight() {
  useSEO(ElectionNightSeo);
  const location = useLocation();
  const mealUrl = buildElectionNightMealUrl(location.search);
  return <div className="election-night-page">
    <a className="election-skip" href="#election-main">Skip to the checklist</a>
    <header className="election-header"><a className="election-brand" href="/shop">Shop Nobi</a><a href="#checklist">The checklist</a></header>
    <main id="election-main" className="election-main">
      <p className="election-disclosure"><strong>#ad</strong> Nobi may earn a commission from qualifying purchases through links on this page.</p>
      <section className="election-hero" aria-labelledby="election-title">
        <div><p className="election-date">November 3, 2026</p><h1 id="election-title">Election Night<br />Survival Kit</h1><p className="election-lead">A little planning for an evening at home. Charge your devices, plan dinner and make room for a screen break.</p><p className="election-own">Start with what you already own.</p><a className="election-primary" href="#checklist">See the free checklist</a></div>
        <img src="/media/election-night-preview.svg" width="1200" height="630" alt="Original line drawings of a phone and cable, a plate and a cup: charge, plan dinner and take a break." />
      </section>

      <section className="election-checklist" id="checklist" aria-labelledby="checklist-title">
        <div><h2 id="checklist-title">Five things to set out.</h2><p>No purchase needed. Save this page or use your browser’s print option.</p></div>
        <ul><li>Charge your phone and any power bank.</li><li>Check your cable and outlet.</li><li>Plan dinner and its preparation time.</li><li>Put water within reach.</li><li>Choose a screen-break time.</li></ul>
      </section>

      <section className="election-section" id="power" aria-labelledby="power-title">
        <div className="election-prose"><h2 id="power-title">Put power within reach.</h2><p>Charge your phone and any power bank before the evening. Check that the cable fits your device. A charger, outlet and cable you already own may be all you need.</p><p>Need a portable option? The Baseus EnerCore CR11 has a retractable USB-C cable. Check device compatibility and the seller’s delivery estimate before ordering.</p><p className="election-limit">There is no promise that a new order will arrive before November 3. A capacity rating is not a guarantee of a full evening’s use.</p></div>
        <aside className="election-option" aria-labelledby="power-option-title"><p className="election-option-label">Optional shopping</p><h3 id="power-option-title">Baseus EnerCore CR11</h3><p>Power bank with a retractable USB-C cable. Manufacturer specifications, not a hands-on test.</p><a className="election-store-link" href={ElectionNightProduct.url} target="_blank" rel={readStoreLinkRel(ElectionNightProduct.paidLink)} onClick={recordProductClick} onAuxClick={recordProductClick}>Check price and availability at Baseus</a><p className="election-small">Opens Baseus. Verify the current price, compatibility and delivery date there.</p></aside>
      </section>

      <section className="election-section" id="dinner" aria-labelledby="dinner-title">
        <div className="election-prose"><h2 id="dinner-title">Decide dinner before the evening.</h2><p>Plan something you already know how to make, use leftovers or arrange a meal ahead of time.</p><p>Considering a meal kit? Compare the introductory offer, shipping and later deliveries before subscribing. Marley Spoon meals require preparation and cooking. Confirm your actual menu, delivery date and recurring subscription terms with the seller.</p></div>
        <aside className="election-option election-meal-option" aria-labelledby="dinner-option-title"><p className="election-option-label">Optional meal planning</p><h3 id="dinner-option-title">Look beyond the first box.</h3><p>The Marley Spoon cost calculator compares the first five deliveries and full price using a dated offer example.</p><a className="election-store-link" href={mealUrl}>Compare Marley Spoon delivery costs</a><p className="election-small">The calculator includes an affiliate link. Check the current offer and your delivery window before subscribing.</p></aside>
      </section>

      <section className="election-break" aria-labelledby="break-title"><h2 id="break-title">Pick a stopping point.</h2><p>Put water within reach and choose when to take a screen break. This part of the kit costs nothing.</p><a href="#checklist">Back to the checklist</a></section>

      <section className="election-notes" aria-labelledby="notes-title"><h2 id="notes-title">Sources and limits</h2><p>The November 3 date comes from the <a href={ElectionNightElectionSource} target="_blank" rel="noopener">Federal Election Commission</a>. This is a nonpartisan shopping and planning checklist. It does not provide election results or voting instructions.</p><p>Product details checked {ElectionNightCheckedDate} against Baseus’s product page. We have not physically tested the power bank. Prices, availability, offers and delivery dates can change. Verify them with the seller.</p><noscript><p>The checklist and ordinary store link work without JavaScript. Affiliate attribution may not be available without JavaScript.</p></noscript></section>

      <details className="election-video"><summary>Watch the 15-second checklist</summary><video controls playsInline preload="none" poster="/media/election-night-video-poster.png" width="1080" height="1920" aria-label="Silent video checklist: charge your devices, plan dinner and choose a screen break. Nobi may earn a commission from optional shopping links."><source src="/media/election-night-15s.mp4" type="video/mp4" />The complete checklist is readable above.</video><p>Silent video with all instructions written on screen. The full text is also on this page.</p></details>
    </main>
    <footer className="election-footer"><a href="/shop">Explore Shop Nobi</a><div><a href="/privacy">Privacy</a><a href="/terms">Terms</a></div></footer>
  </div>;
}

/** Preserve the exact authored product identity and current page acquisition tags on a real exit. */
function recordProductClick(event) {
  handleProductLinkClick(event, { product: ElectionNightProduct, position: 1, query: ElectionNightQuery, slug: ElectionNightSlug, entryPoint: ElectionNightEntryPoint });
}
