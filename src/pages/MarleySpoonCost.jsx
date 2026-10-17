import React, { useState } from "react";
import { useSEO } from "../hooks/useSEO.js";
import { MarleySpoonCheckedDate, MarleySpoonEntryPoint, MarleySpoonOffer, MarleySpoonPlan, MarleySpoonSeo, MarleySpoonSlug, MarleySpoonSourceUrl, MarleySpoonTermsUrl } from "../content/marleySpoonCost.js";
import { calculateDeliveryCost, formatDeliveryMoney } from "../utils/deliveryCost.js";
import { handleOfferLinkClick } from "../utils/shopNobiOfferClick.js";
import { readStoreLinkRel } from "../utils/shopNobiPage.js";
import "./MarleySpoonCost.css";

const IntroDeliveryCount = MarleySpoonPlan.foodDiscountPercentages.length;
const CompleteDeliveryCount = IntroDeliveryCount + 1;

/** A dated subscription offer and local delivery planner; it creates no merchant account, cart or subscription. */
export default function MarleySpoonCost() {
  useSEO(MarleySpoonSeo);
  return (
    <div className="delivery-cost-page">
      <header className="delivery-cost-header"><a className="delivery-cost-brand" href="/shop">Shop Nobi</a><a href="/shop">Explore Shop Nobi</a></header>
      <main className="delivery-cost-main">
        <section className="delivery-cost-intro" aria-labelledby="delivery-cost-title">
          <h1 id="delivery-cost-title">What does Marley Spoon cost after the first box?</h1>
          <p className="delivery-cost-lead">Follow one plan through its first five discounted deliveries and the next full-price box. Food and shipping stay separate.</p>
          <p className="delivery-cost-checked">US offer checked {MarleySpoonCheckedDate}. All amounts below are USD.</p>
        </section>
        <section className="delivery-cost-plan" aria-labelledby="delivery-cost-plan-title">
          <div><h2 id="delivery-cost-plan-title">2 people. 3 meals. 6 servings.</h2><p>This calculator uses this exact plan, with no priced recipe upgrades.</p></div>
          <div className="delivery-cost-recurring"><p>Full price after the introductory deliveries</p><strong>{formatDeliveryMoney(MarleySpoonPlan.foodCents + MarleySpoonPlan.shippingCents)} <span>per delivery</span></strong><p>{formatDeliveryMoney(MarleySpoonPlan.foodCents)} food + {formatDeliveryMoney(MarleySpoonPlan.shippingCents)} shipping, before tax or extras.</p></div>
        </section>
        <DeliveryPlanner />
        <OfferConditions />
        <section className="delivery-cost-sources" aria-labelledby="delivery-cost-sources-title">
          <h2 id="delivery-cost-sources-title">Sources and calculation</h2>
          <p>We checked the selected plan and code on Marley Spoon’s US site on {MarleySpoonCheckedDate}. This is a price calculation, not a review of the meals.</p>
          <ul><li><a href={MarleySpoonSourceUrl} target="_blank" rel="nofollow noopener">Marley Spoon plan and offer</a></li><li><a href={MarleySpoonTermsUrl} target="_blank" rel="nofollow noopener">Marley Spoon terms, recurring billing and cancellation</a></li></ul>
          <p>Each food discount is rounded to the nearest cent before adding shipping. Later deliveries are modeled using unchanged food, shipping and discount inputs. Your actual checkout can differ with location, eligibility, recipe choices, taxes, fees and later price changes.</p>
        </section>
      </main>
      <footer className="delivery-cost-footer"><a href="/shop">Shop Nobi</a><div><a href="/privacy">Privacy</a><a href="/terms">Terms</a></div></footer>
    </div>
  );
}

/** Keep all six modeled rows visible, while the shopper selects how many delivered boxes to total locally. */
function DeliveryPlanner() {
  const [deliveryCount, setDeliveryCount] = useState(IntroDeliveryCount);
  const result = calculateDeliveryCost(MarleySpoonPlan, deliveryCount);
  const firstFour = calculateDeliveryCost(MarleySpoonPlan, IntroDeliveryCount - 1);
  return (
    <section className="delivery-cost-planner" aria-labelledby="delivery-cost-planner-title">
      <div className="delivery-cost-planner-heading"><h2 id="delivery-cost-planner-title">Count deliveries, not calendar weeks.</h2><p>Skipping a week is different from receiving a box. This table follows delivered boxes under the dated offer.</p></div>
      <div className="delivery-cost-workspace">
        <div className="delivery-cost-controls">
          <label htmlFor="delivery-count">Delivered boxes to include</label>
          <select id="delivery-count" value={deliveryCount} onChange={event => setDeliveryCount(Number(event.target.value))}>
            {Array.from({ length: CompleteDeliveryCount }, (_, index) => index + 1).map(count => <option key={count} value={count}>{count} {count === 1 ? "delivery" : "deliveries"}{count === CompleteDeliveryCount ? " (includes full price)" : ""}</option>)}
          </select>
          <div className="delivery-cost-total" role="status" aria-live="polite" aria-atomic="true">
            <p>Total for {deliveryCount} {deliveryCount === 1 ? "delivery" : "deliveries"}</p><strong>{formatDeliveryMoney(result.totalCents)}</strong>
            <p>{formatDeliveryMoney(result.foodCents)} food<br />+ {formatDeliveryMoney(result.shippingCents)} shipping</p>
          </div>
          <p className="delivery-cost-note">Excludes tax, extras and price changes. Changing this count does not place an order.</p>
          <noscript><p>Enable JavaScript to change the delivery count. The five-delivery total and full schedule are available below.</p></noscript>
        </div>
        <div className="delivery-cost-ledger">
          <table>
            <caption>Food discounts apply to the first five deliveries. Shipping is added every time.</caption>
            <thead><tr><th scope="col">Delivery</th><th scope="col">Food</th><th scope="col">Shipping</th><th scope="col">Total</th></tr></thead>
            <tbody>{result.deliveries.map(delivery => <tr key={delivery.number} className={`${delivery.number <= deliveryCount ? "delivery-cost-included" : ""} ${delivery.number === CompleteDeliveryCount ? "delivery-cost-full-price" : ""}`}>
              <th scope="row">{delivery.number === CompleteDeliveryCount ? "Next full-price delivery" : `Delivery ${delivery.number}`}<span>{delivery.discount ? `${delivery.discount}% off food` : "No introductory discount"}</span></th>
              <td data-label="Food">{formatDeliveryMoney(delivery.foodCents)}</td><td data-label="Shipping">{formatDeliveryMoney(delivery.shippingCents)}</td><td data-label="Total">{formatDeliveryMoney(delivery.totalCents)}</td>
            </tr>)}</tbody>
          </table>
          <p className="delivery-cost-summary">First 4 deliveries: <strong>{formatDeliveryMoney(firstFour.totalCents)}</strong>. First 5: <strong>{formatDeliveryMoney(calculateDeliveryCost(MarleySpoonPlan, IntroDeliveryCount).totalCents)}</strong>. Then <strong>{formatDeliveryMoney(result.fullDeliveryCents)} per delivery</strong> if these plan prices stay unchanged.</p>
        </div>
      </div>
    </section>
  );
}

/** State subscription and eligibility conditions alongside the disclosed merchant exit. */
function OfferConditions() {
  return (
    <section className="delivery-cost-conditions" aria-labelledby="delivery-cost-conditions-title">
      <div><h2 id="delivery-cost-conditions-title">Check the offer before subscribing.</h2>
        <ul><li>For eligible new customers. Confirm delivery availability and the code at checkout.</li><li>The introductory discounts apply to food. Shipping is charged separately.</li><li>This is a recurring subscription. Deliveries and billing continue unless you skip, pause or cancel under Marley Spoon’s terms.</li><li>Change and cancellation deadlines depend on your delivery location. Check your account’s cutoff before the next order.</li></ul>
      </div>
      <div className="delivery-cost-exit"><p>Offer code <strong>{MarleySpoonOffer.code}</strong></p>
        <p className="delivery-cost-disclosure">We may earn a commission from qualifying subscriptions through this link.</p>
        <a className="delivery-cost-store-link" href={MarleySpoonOffer.url} target="_blank" rel={readStoreLinkRel(MarleySpoonOffer.paidLink)} onClick={recordOfferClick} onAuxClick={recordOfferClick}>Check offer at Marley Spoon</a>
        <p className="delivery-cost-note">Opens Marley Spoon. Review the final price and recurring terms there.</p>
      </div>
    </section>
  );
}

/** Reuse the actual server-built paid link and a separate non-product event, with no calculator inputs. */
function recordOfferClick(event) {
  handleOfferLinkClick(event, { offer: MarleySpoonOffer, slug: MarleySpoonSlug, entryPoint: MarleySpoonEntryPoint });
}
