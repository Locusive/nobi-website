import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { StaticRouter } from "react-router-dom";
import HomePage from "../src/pages/HomePage.jsx";
import Pricing from "../src/pages/Pricing.jsx";
import Product from "../src/pages/Product.jsx";
import ShopPage from "../src/pages/ShopPage.jsx";
import Privacy from "../src/pages/Privacy.jsx";
import Terms from "../src/pages/Terms.jsx";
import CoveCubbyComparison from "../src/pages/CoveCubbyComparison.jsx";
import MarleySpoonCost from "../src/pages/MarleySpoonCost.jsx";
import { MarleySpoonPath } from "../src/content/marleySpoonCost.js";
import { CoveCubbyPath } from "../src/content/coveCubbyComparison.js";

import BaseusTwoScreens from "../src/pages/BaseusTwoScreens.jsx";
import { BaseusScreenPath } from "../src/content/baseusScreens.js";

const Pages = { "/": HomePage, "/pricing": Pricing, "/product": Product, "/shop": ShopPage, "/privacy": Privacy, "/terms": Terms };
Pages[CoveCubbyPath] = CoveCubbyComparison;
Pages[MarleySpoonPath] = MarleySpoonCost;
Pages[BaseusScreenPath] = BaseusTwoScreens;

/** Render the same components visitors see, without browser APIs or effects. */
export function renderPageBody(path) {
  const Page = Pages[path];
  if (!Page) throw new Error(`No page renderer registered for ${path}`);
  return renderToStaticMarkup(
    <StaticRouter location={path}>
      <Page />
    </StaticRouter>
  );
}

/** Render a prebuilt Shop Nobi page the way ShopPage shows it before the live search loads. */
export function renderPrebuiltPageBody(content) {
  return renderToStaticMarkup(
    <StaticRouter location={content.path}>
      <ShopPage prebuiltContent={content} />
    </StaticRouter>
  );
}
