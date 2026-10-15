import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import BlogBuyerActions, { BlogBuyerLink } from "../../src/components/BlogBuyerActions.jsx";

export { trackBlogBuyerAction } from "../../src/components/BlogBuyerActions.jsx";

/** Renders the actual buyer actions without the assistant or a browser. */
export function renderBuyerActions(articleSlug) {
  return renderToStaticMarkup(<BlogBuyerActions articleSlug={articleSlug} placement="comparison" />);
}

/** Renders prose links through the same component used by the opted-in articles. */
export function renderBuyerProse(articleSlug) {
  return renderToStaticMarkup(<p>
    <BlogBuyerLink articleSlug={articleSlug} href="https://dashboard.nobi.ai/signup">Preview</BlogBuyerLink>
    <BlogBuyerLink articleSlug={articleSlug} href="/pricing">Pricing</BlogBuyerLink>
    <BlogBuyerLink articleSlug={articleSlug} href="/pricing#pricing-calculator">Estimate cost</BlogBuyerLink>
    <BlogBuyerLink articleSlug={articleSlug} href={`/blog/${articleSlug}?contact-us=1`}>Demo</BlogBuyerLink>
    <BlogBuyerLink articleSlug={articleSlug} href="/customers/untuckit">Customer story</BlogBuyerLink>
  </p>);
}
