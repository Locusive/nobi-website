import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { StaticRouter } from "react-router-dom";
import ShopPage from "../../src/pages/ShopPage.jsx";
import { setPageProgress } from "./shop-page-progress.js";

/** Render the production page at a scripted external-assistant lifecycle state. */
export function renderShopPage(content, progress) {
  setPageProgress(progress);
  return renderToStaticMarkup(<StaticRouter location={content?.path || "/shop"}>
    <ShopPage prebuiltContent={content} />
  </StaticRouter>);
}
