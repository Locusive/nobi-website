// src/pages/Shop.jsx
import React, { useEffect } from "react";
import { useSEO } from "../hooks/useSEO";

// The dedicated Shop Nobi merchant, matching Merchant.ShopNobiMerchantId in the API.
const ShopNobiMerchantId = "9282b7cb-66ce-4d53-8c37-c291352ef03d";

/**
 * Shop Nobi: search every store Nobi powers, from one page.
 *
 * This page deliberately carries no site chrome. The assistant bundle renders the whole
 * experience into the window, so a header and footer around it would leave the results
 * competing with the marketing site for the screen.
 *
 * The path matters: the API only mints a Shop Nobi session for a page whose path is /shop
 * or sits beneath it, so this route cannot move without the search being refused.
 */
export default function Shop() {
  useSEO({
    title: "Shop Nobi | Search every store at once",
    description:
      "Search across every store Nobi powers and find what you are looking for in one place.",
    path: "/shop",
  });

  useEffect(() => {
    // The bundle is loaded once by index.html; initialize is idempotent and no-ops if a
    // previous call already rendered.
    if (window.Nobi && typeof window.Nobi.initialize === "function") {
      window.Nobi.initialize({
        merchantId: ShopNobiMerchantId,
        // The results are the page here, so Nobi injects none of its launch components.
        searchResultsPage: true,
        // Shop Nobi links out to the stores rather than selling anything itself.
        hideQuickAdd: true,
      });
    }
  }, []);

  return <div data-shop-nobi-page="true" />;
}
