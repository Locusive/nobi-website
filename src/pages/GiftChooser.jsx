import React, { useState } from "react";
import { useSEO } from "../hooks/useSEO.js";
import { chooseGifts, GiftInterests, readGiftChoice } from "../utils/giftChoice.js";
import { GiftChooserSeo } from "../content/giftChooserProducts.js";
import { formatPrice } from "../utils/shopNobiSearchPage.js";

/** A small explicit chooser over a source-dated reviewed set, with no automatic search or provider request. */
export default function GiftChooser() {
  useSEO(GiftChooserSeo);
  const [interest, setInterest] = useState("");
  const [selection, setSelection] = useState(null);
  const submit = event => {
    event.preventDefault();
    setSelection(chooseGifts(readGiftChoice(new FormData(event.currentTarget))));
  };
  return <div className="gift-chooser">
    <header className="gift-nav"><a href="https://nobi.ai/shop">Shop Nobi</a><a href="https://nobi.ai/blog/gifts-for-someone-who-wants-nothing">Read the gift guide</a></header>
    <main>
      <section className="gift-intro"><h1>Start with what<br />they actually use.</h1><p>A few thoughtful starting points beat another thing to store. Tell us what they enjoy, then compare the fit and the catch.</p></section>
      <section className="gift-form-section" aria-labelledby="gift-form-heading">
        <h2 id="gift-form-heading">What do you know about them?</h2>
        <p>This small chooser uses reviewed examples for three interests. It does not search the whole catalog or confirm live stock.</p>
        <form onSubmit={submit} onChange={() => setSelection(null)}>
          <div className="gift-fields">
            <div><label htmlFor="gift-interest">An interest they already enjoy</label><select id="gift-interest" name="interest" value={interest} required onChange={event => setInterest(event.target.value)}>
              <option value="">Choose an interest</option>{Object.entries(GiftInterests).map(([value, item]) => <option key={value} value={value}>{item.label}</option>)}
            </select></div>
            <div><label htmlFor="gift-budget">Item budget in USD</label><input id="gift-budget" name="budget" type="number" min="1" max="5000" step="0.01" defaultValue="50" required /><span className="gift-field-note">Before tax and shipping, for one gift.</span></div>
          </div>
          <fieldset><legend>What should we keep in mind?</legend>
            {interest === "coffee" && <label className="gift-check"><input type="checkbox" name="decafOnly" /> Only options labeled decaf</label>}
            {interest === "painting" && <label className="gift-check"><input type="checkbox" name="shortHandlesOnly" /> Short-handled brushes only</label>}
            <label className="gift-check"><input type="checkbox" name="avoidDeviceChecks" /> Avoid gifts that need device-compatibility checks</label>
          </fieldset>
          <button className="gift-primary" type="submit">Show my starting points</button>
          <p className="gift-small">Choosing options here does not run a live search. We show fewer than three when the reviewed set cannot meet your choices.</p>
        </form>
      </section>
      <div aria-live="polite" aria-atomic="false">{selection && <GiftResults selection={selection} />}</div>
      <section className="gift-source-note"><h2>A starting point, with limits.</h2><p>These examples use product records reviewed October 18–19, 2026. Displayed prices are snapshot item prices, not live quotes. Check the exact variant, ingredients or compatibility, stock, shipping and returns at the store.</p><p>We have not tested the products hands-on. The list is a small editorial selection, not a search ranking or a promise that a gift is right for someone. You buy directly from the retailer.</p></section>
    </main>
    <footer className="gift-footer"><a href="https://nobi.ai/shop">Shop Nobi</a><a href="/privacy">Privacy</a><a href="/terms">Terms</a></footer>
  </div>;
}

/** Render the real selection and supported manual-search path without inventing an automatic query route. */
export function GiftResults({ selection }) {
  const [copyState, setCopyState] = useState("");
  const [request, setRequest] = useState(selection.request || "");
  if (selection.error) return <p className="gift-error" role="alert">{selection.error}</p>;
  const copyRequest = async () => {
    try { await navigator.clipboard.writeText(request); setCopyState("Copied. Open Shop Nobi and paste this request."); }
    catch { setCopyState("Select and copy the request below, then paste it in Shop Nobi."); }
  };
  return <section className="gift-results" aria-labelledby="gift-results-heading">
    <h2 id="gift-results-heading">{selection.items.length ? `${selection.items.length} starting ${selection.items.length === 1 ? "point" : "points"} to compare` : "No reviewed option meets those choices"}</h2>
    <p>{selection.items.length ? `For ${selection.interest.label.toLowerCase()}, within your $${selection.choice.budget} snapshot item budget. Choose one; the prices are not a combined gift bundle.` : "Keep your preferences. You can adjust the budget or ask Shop Nobi for a wider selection."}</p>
    <div className="gift-options">{selection.items.map(product => <GiftOption key={product.id} product={product} />)}</div>
    <div className="gift-collection"><p className="gift-disclosure">Nobi may earn a commission from qualifying purchases made through links in Shop Nobi.</p><a className="gift-primary" href={selection.interest.collection}>Browse the current collection in Shop Nobi</a><p>This opens the full collection, not a result filtered by these answers. Confirm your preferences and current item details there.</p></div>
    <details className="gift-handoff"><summary>Ask for a wider selection</summary><p>Copy or edit this request, then open Shop Nobi and paste it into the search box. Opening the link does not submit a search.</p>
      <label htmlFor="gift-request">Your shopping request</label><textarea id="gift-request" value={request} onChange={event => setRequest(event.target.value)} rows="4" />
      <div className="gift-handoff-actions"><button type="button" className="gift-secondary" onClick={copyRequest}>Copy request</button><a className="gift-primary" href={selection.shopUrl}>Open Shop Nobi</a><a href={selection.interest.collection}>Browse this collection</a></div>
      {copyState && <p role="status">{copyState}</p>}
    </details>
  </section>;
}

/** Keep native retailer details as a source link; buying continues through the supported tracked Nobi collection. */
function GiftOption({ product }) {
  return <article className="gift-option">
    <img src={product.imageUrl} alt={product.name} loading="lazy" width="180" height="180" />
    <div><p className="gift-store">{product.storeName}</p><h3>{product.name}</h3><p className="gift-price">{formatPrice(product.price, product.currency)} <span>snapshot price</span></p>
      <p><strong>Why it fits:</strong> {product.why}</p><p className="gift-tradeoff"><strong>What to check:</strong> {product.tradeoff}</p>
      <a className="gift-retailer" href={product.url} target="_blank" rel="nofollow noopener">Retailer source and details: {product.storeName}</a>
    </div>
  </article>;
}
