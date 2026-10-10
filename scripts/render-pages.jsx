import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { StaticRouter } from "react-router-dom";
import HomePage from "../src/pages/HomePage.jsx";
import Pricing from "../src/pages/Pricing.jsx";
import Product from "../src/pages/Product.jsx";
import ShopPage from "../src/pages/ShopPage.jsx";
import { searchPagePath } from "../src/utils/shopNobiSearchPage.js";

const Pages = { "/": HomePage, "/pricing": Pricing, "/product": Product, "/shop": ShopPage };

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

/** Render a prebuilt Shop Nobi search page the way ShopPage shows it before the live search loads. */
export function renderSearchPageBody(page) {
  return renderToStaticMarkup(
    <StaticRouter location={searchPagePath(page.slug)}>
      <ShopPage searchPage={page} />
    </StaticRouter>
  );
}
