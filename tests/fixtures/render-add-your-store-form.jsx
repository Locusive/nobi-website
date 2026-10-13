// Renders the "Add your store" form to HTML for the tests, the way the build renders pages.
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import AddYourStoreForm from "../../src/components/shopNobi/AddYourStoreForm.jsx";

/** Renders the open form. */
export function renderAddYourStoreForm() {
  return renderToStaticMarkup(<AddYourStoreForm onClose={() => {}} />);
}
