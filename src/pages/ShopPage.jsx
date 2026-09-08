// src/pages/ShopPage.jsx
import React, { useEffect, useState } from "react";
import { useSEO } from "../hooks/useSEO";

// The container id the assistant bundle creates when it boots in full-page
// search mode. The loading hint below stays up only until this appears.
const AssistantContainerId = "nobi-app-container";

// The Shop Nobi page. The assistant bundle loaded in index.html detects the
// /shop path and boots in full-page search mode: it creates and fills its own
// container in the page flow after this one. This component carries the page's
// SEO tags and a brief loading hint, and it must remove that hint once the
// bundle mounts: the hint fills the viewport, so leaving it up would push the
// search page below the first screen. No marketing nav or footer: the search
// experience is the whole page.
export default function ShopPage() {
  const [assistantHasMounted, setAssistantHasMounted] = useState(
    () => typeof document !== "undefined" && !!document.getElementById(AssistantContainerId)
  );

  useEffect(() => {
    if (assistantHasMounted) {
      return undefined;
    }
    const observer = new MutationObserver(() => {
      if (document.getElementById(AssistantContainerId)) {
        setAssistantHasMounted(true);
        observer.disconnect();
      }
    });
    observer.observe(document.body, { childList: true });
    return () => observer.disconnect();
  }, [assistantHasMounted]);
  useSEO({
    title: "Shop Nobi | Nobi",
    description:
      "One search across hundreds of independent stores. Shop Nobi finds the product; you buy it directly from the store.",
    path: "/shop",
    // The same structured data prerender-pages.js bakes into the static head;
    // passing it here keeps the schema after React mounts instead of wiping it.
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
  });
  if (assistantHasMounted) {
    return null;
  }
  return (
    <div className="flex min-h-screen items-center justify-center bg-white text-black/60 dark:bg-[#0a0a0a] dark:text-white/60">
      <p>Loading Shop Nobi…</p>
    </div>
  );
}
