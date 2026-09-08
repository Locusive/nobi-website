// src/pages/ShopPage.jsx
import React, { useEffect, useRef, useState } from "react";
import Header from "../components/Header";
import { useSEO } from "../hooks/useSEO";

// The container id the assistant bundle creates when it boots in full-page
// search mode. This page adopts that container into its own layout.
const AssistantContainerId = "nobi-app-container";

// The Shop Nobi page: the site's own header, with the search experience under
// it. The assistant bundle loaded in index.html detects the /shop path, boots
// in full-page search mode, and appends its container to the body; this page
// moves that container into its layout slot so the experience lives inside the
// site's frame instead of floating outside it. On unmount the container goes
// back to the body, so leaving the page does not destroy the running app.
export default function ShopPage() {
  const slotRef = useRef(null);
  const [assistantHasMounted, setAssistantHasMounted] = useState(false);

  useEffect(() => {
    const slot = slotRef.current;

    function adoptAssistantContainer() {
      const appContainer = document.getElementById(AssistantContainerId);
      if (appContainer && slot && appContainer.parentElement !== slot) {
        slot.appendChild(appContainer);
        setAssistantHasMounted(true);
        return true;
      }
      return false;
    }

    if (adoptAssistantContainer()) {
      return () => returnAssistantContainerToBody();
    }
    const observer = new MutationObserver(() => {
      if (adoptAssistantContainer()) {
        observer.disconnect();
      }
    });
    observer.observe(document.body, { childList: true });
    return () => {
      observer.disconnect();
      returnAssistantContainerToBody();
    };
  }, []);

  function returnAssistantContainerToBody() {
    const appContainer = document.getElementById(AssistantContainerId);
    if (appContainer && appContainer.parentElement !== document.body) {
      document.body.appendChild(appContainer);
    }
  }

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
