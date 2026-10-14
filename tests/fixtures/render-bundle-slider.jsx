// Renders the pricing page's bundle slider and plan cards to HTML for the tests, the way the build renders pages.
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import BundleSlider from "../../src/components/BundleSlider.jsx";
import PricingPlans from "../../src/components/PricingPlans.jsx";

/** Renders the slider at a stop, or at its default stop when none is given. */
export function renderBundleSlider(initialStop) {
  return renderToStaticMarkup(<BundleSlider initialStop={initialStop} />);
}

/** Renders the plan cards, with the bundle table behind its toggle. */
export function renderPricingPlans() {
  return renderToStaticMarkup(<PricingPlans />);
}
