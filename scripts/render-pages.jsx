import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { StaticRouter } from "react-router-dom";
import HomePage from "../src/pages/HomePage.jsx";
import Pricing from "../src/pages/Pricing.jsx";
import Product from "../src/pages/Product.jsx";

const Pages = { "/": HomePage, "/pricing": Pricing, "/product": Product };

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
