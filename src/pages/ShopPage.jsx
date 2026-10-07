// src/pages/ShopPage.jsx
import React, { useEffect, useRef } from "react";
import Nav from "../components/home/Nav";
import "../components/home/homepage.css";
import { useAdoptedAssistantContainer } from "../hooks/useAdoptedAssistantContainer";
import { useSEO } from "../hooks/useSEO";

// The site nav floats above the page and takes no space, so the search
// experience starts this far down to stay clear of it.
const FixedNavClearancePixels = 88;

// The same metadata and structured data prerender-pages.js bakes into the
// static head, so React keeps them after it mounts instead of wiping them.
const ShopPageSeo = {
  title: "Shop Nobi | Nobi",
  description:
    "One search across hundreds of independent stores. Shop Nobi finds the product; you buy it directly from the store.",
  path: "/shop",
  schema: [
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "Nobi",
      url: "https://nobi.ai",
      logo: "https://nobi.ai/og-image.png",
    },
    { "@context": "https://schema.org", "@type": "WebSite", name: "Shop Nobi", url: "https://nobi.ai/shop" },
  ],
};

/**
 * Reserves room for the nav while this page is open, so a question the search
 * scrolls to the top of the window does not land behind the nav.
 *
 * @returns {function} Removes the reserved room again.
 */
function keepScrolledContentClearOfNav() {
  const page = document.documentElement;
  page.style.scrollPaddingTop = `${FixedNavClearancePixels}px`;
  return () => {
    page.style.scrollPaddingTop = "";
  };
}

// The Shop Nobi page: the site's nav, with the search experience the
// assistant bundle boots on /shop moved into the slot under it.
export default function ShopPage() {
  const slotRef = useRef(null);
  const assistantHasMounted = useAdoptedAssistantContainer(slotRef);

  useEffect(keepScrolledContentClearOfNav, []);
  useSEO(ShopPageSeo);

  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a0a]">
      <Nav />
      <div ref={slotRef} style={{ paddingTop: FixedNavClearancePixels }}>
        {!assistantHasMounted && (
          <div className="flex min-h-[60vh] items-center justify-center text-black/60 dark:text-white/60">
            <p>Loading Shop Nobi…</p>
          </div>
        )}
      </div>
    </div>
  );
}
