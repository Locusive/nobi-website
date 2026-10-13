// Renders the "Add your store" form and the Shop Nobi page to HTML for the tests, the way the build renders pages.
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { StaticRouter } from "react-router-dom";
import AddYourStoreForm from "../../src/components/shopNobi/AddYourStoreForm.jsx";
import ShopPage from "../../src/pages/ShopPage.jsx";

/** Renders the open form. */
export function renderAddYourStoreForm() {
  return renderToStaticMarkup(<AddYourStoreForm onClose={() => {}} />);
}

/** Renders /shop before the live search arrives. */
export function renderShopPage() {
  return renderToStaticMarkup(
    <StaticRouter location="/shop">
      <ShopPage />
    </StaticRouter>
  );
}
