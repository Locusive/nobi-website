import React from "react";
import { searchPagePath } from "../../utils/shopNobiSearchPage";

/**
 * A list of links to Shop Nobi search pages, each showing the page title.
 *
 * @param {{pages: {slug: string, title: string}[]}} props The pages to link to.
 */
export default function ShopNobiSearchLinks({ pages }) {
  return (
    <ul className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
      {pages.map((page) => (
        <li key={page.slug}>
          <a href={searchPagePath(page.slug)} className="hover:underline">{page.title}</a>
        </li>
      ))}
    </ul>
  );
}
