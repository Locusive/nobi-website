// src/pages/ShopPage.jsx
import React, { useRef } from "react";
import Header from "../components/Header";
import { useAdoptedAssistantContainer } from "../hooks/useAdoptedAssistantContainer";
import { useSEO } from "../hooks/useSEO";

// The same metadata and structured data prerender-pages.js bakes into the
// static head, so React keeps them after it mounts instead of wiping them.
const ShopPageSeo = {
  title: "Shop Nobi | Nobi",
  description:
    "The best products from the best stores online, in one search. Shop Nobi is a search engine: you buy directly from the store.",
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

// The Shop Nobi page: its own header, with the search experience the
// assistant bundle boots on /shop moved into the slot under it.
export default function ShopPage() {
  const slotRef = useRef(null);
  const assistantHasMounted = useAdoptedAssistantContainer(slotRef);

  useSEO(ShopPageSeo);

  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a0a]">
      <Header />
      <div ref={slotRef}>
        {!assistantHasMounted && (
          <div className="flex min-h-[60vh] items-center justify-center text-black/60 dark:text-white/60">
            <p>Loading Shop Nobi…</p>
          </div>
        )}
      </div>
    </div>
  );
}
