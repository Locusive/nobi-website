// src/pages/ShopPage.jsx
import React from "react";
import { useSEO } from "../hooks/useSEO";

// The Shop Nobi page. The assistant bundle loaded in index.html detects the
// /shop path and boots in full-page search mode: it creates and fills its own
// container, so this component only carries the page's SEO tags and a brief
// loading hint the bundle covers as soon as it mounts. No marketing nav or
// footer: the search experience is the whole page.
export default function ShopPage() {
  useSEO({
    title: "Shop Nobi | Nobi",
    description:
      "One search across hundreds of independent stores. Shop Nobi finds the product; you buy it directly from the store.",
    path: "/shop",
  });
  return (
    <div className="flex min-h-screen items-center justify-center bg-white text-black/60 dark:bg-[#0a0a0a] dark:text-white/60">
      <p>Loading Shop Nobi…</p>
    </div>
  );
}
