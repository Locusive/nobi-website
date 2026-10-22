import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { StaticRouter } from "react-router-dom";
import HomePage from "../src/pages/HomePage.jsx";
import Pricing from "../src/pages/Pricing.jsx";
import Product from "../src/pages/Product.jsx";
import ShopPage from "../src/pages/ShopPage.jsx";
import Privacy from "../src/pages/Privacy.jsx";
import About from "../src/pages/About.jsx";
import Terms from "../src/pages/Terms.jsx";
import CoveCubbyComparison from "../src/pages/CoveCubbyComparison.jsx";
import MarleySpoonCost from "../src/pages/MarleySpoonCost.jsx";
import { MarleySpoonPath } from "../src/content/marleySpoonCost.js";
import { CoveCubbyPath } from "../src/content/coveCubbyComparison.js";

import BaseusTwoScreens from "../src/pages/BaseusTwoScreens.jsx";
import GiftBudget from "../src/pages/GiftBudget.jsx";
import GiftGuides from "../src/pages/GiftGuides.jsx";
import GiftChooser from "../src/pages/GiftChooser.jsx";
import { GiftChooserSeo } from "../src/content/giftChooserProducts.js";
import { BaseusScreenPath } from "../src/content/baseusScreens.js";

import MindTheColorFit from "../src/pages/MindTheColorFit.jsx";
import { MindTheColorPath } from "../src/content/mindTheColor.js";
import ElectionNight from "../src/pages/ElectionNight.jsx";
import { ElectionNightPath } from "../src/content/electionNight.js";
import ShopNobiMcp from "../src/pages/ShopNobiMcp.jsx";
import { ShopNobiMcpPath } from "../src/content/shopNobiMcp.js";

const Pages = { "/": HomePage, "/pricing": Pricing, "/product": Product, "/shop": ShopPage, "/privacy": Privacy, "/terms": Terms };
Pages["/about"] = About;
Pages[CoveCubbyPath] = CoveCubbyComparison;
Pages[MarleySpoonPath] = MarleySpoonCost;
Pages[BaseusScreenPath] = BaseusTwoScreens;
Pages["/tools/gift-budget"] = GiftBudget;
Pages["/gift-guides"] = GiftGuides;
Pages[GiftChooserSeo.path] = GiftChooser;
Pages[MindTheColorPath] = MindTheColorFit;
Pages[ElectionNightPath] = ElectionNight;
Pages[ShopNobiMcpPath] = ShopNobiMcp;

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
