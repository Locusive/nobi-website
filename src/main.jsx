import React, { StrictMode, Suspense, lazy, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, useLocation, useNavigationType } from "react-router-dom";

// HomePage is eagerly loaded — it's the first thing every visitor sees
import HomePage from "./pages/HomePage.jsx";

// Everything else is lazy-loaded — only downloaded when navigated to
const Terms              = lazy(() => import("./pages/Terms.jsx"));
const Privacy            = lazy(() => import("./pages/Privacy.jsx"));
const FAQs               = lazy(() => import("./pages/FAQs.jsx"));
const Blog               = lazy(() => import("./pages/Blog.jsx"));
const BlogPost           = lazy(() => import("./pages/BlogPost.jsx"));
const Glossary           = lazy(() => import("./pages/Glossary.jsx"));
const GlossaryTerm       = lazy(() => import("./pages/GlossaryTerm.jsx"));
const BetterSearch       = lazy(() => import("./pages/BetterSearch.jsx"));
const LeadCapture        = lazy(() => import("./pages/LeadCapture.jsx"));
const CustomActions      = lazy(() => import("./pages/CustomActions.jsx"));
const AutomatedSupport   = lazy(() => import("./pages/AutomatedSupport.jsx"));
const AgentEndpoint      = lazy(() => import("./pages/AgentEndpoint.jsx"));
const CustomersIndex     = lazy(() => import("./pages/customers/index.jsx"));
const LuccheseCustomer   = lazy(() => import("./pages/customers/Lucchese.jsx"));
const UNTUCKitCustomer   = lazy(() => import("./pages/customers/UNTUCKit.jsx"));
const KilteCustomer      = lazy(() => import("./pages/customers/Kilte.jsx"));
const Pricing            = lazy(() => import("./pages/Pricing.jsx"));
const Product            = lazy(() => import("./pages/Product.jsx"));
const SearchEngineLanding = lazy(() => import("./pages/landing/SearchEngineLanding.jsx"));
const AIAssistantLanding  = lazy(() => import("./pages/landing/AIAssistantLanding.jsx"));
const Webinar            = lazy(() => import("./pages/Webinar.jsx"));
const WebinarIPullRank   = lazy(() => import("./pages/WebinarIPullRank.jsx"));
const NotFound           = lazy(() => import("./pages/NotFound.jsx"));

import { RequestDemoModal } from "./components/DemoModals.jsx";
import { DemoFormProvider } from "./context/DemoFormContext.jsx";
import "./index.css";

const SCROLL_KEY_PREFIX = "nobi-scroll:";

// The browser's own automatic scroll restoration can fire asynchronously and
// fight a router-driven scrollTo (it did — see the effects below). Take full
// manual control instead: we decide scroll position on every navigation.
if (typeof window !== "undefined" && "scrollRestoration" in window.history) {
  window.history.scrollRestoration = "manual";
}

function App() {
  const location = useLocation();
  const navigationType = useNavigationType();

  const [isFormOpen, setIsFormOpen] = useState(() => {
    const params = new URLSearchParams(location.search);
    return isContactParamTrue(params);
  });

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (isContactParamTrue(params)) {
      setIsFormOpen(true);
    }
  }, [location.search]);

  // Forward navigation scrolls to top at click time (see ScrollLink) — that
  // happens before the old, still-tall page unmounts, which is what actually
  // works reliably. This effect only handles browser back/forward (POP):
  // restore wherever the visitor actually was, from sessionStorage so it
  // survives a full reload too (e.g. leaving to an external site like
  // Start Free and hitting the back button).
  useEffect(() => {
    if (navigationType !== "POP") return;
    const saved = sessionStorage.getItem(SCROLL_KEY_PREFIX + location.pathname);
    window.scrollTo({ top: saved ? parseInt(saved, 10) : 0, left: 0, behavior: "instant" });
  }, [location.pathname, navigationType]);

  // Continuously remember scroll position per path so the restore above has
  // something real to read.
  useEffect(() => {
    const key = SCROLL_KEY_PREFIX + location.pathname;
    let raf = null;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = null;
        sessionStorage.setItem(key, String(window.scrollY));
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [location.pathname]);

  return (
    <DemoFormProvider isOpen={isFormOpen} onOpen={() => setIsFormOpen(true)}>
      <Suspense fallback={null}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/glossary" element={<Glossary />} />
          <Route path="/glossary/:slug" element={<GlossaryTerm />} />
          <Route path="/why-nobi/better-search" element={<BetterSearch />} />
          <Route path="/why-nobi/automated-support" element={<AutomatedSupport />} />
          <Route path="/why-nobi/ai-agents" element={<AgentEndpoint />} />
          <Route path="/why-nobi/agent-endpoint" element={<AgentEndpoint />} />
          <Route path="/lead-capture" element={<LeadCapture />} />
          <Route path="/custom-actions" element={<CustomActions />} />
          <Route path="/customers" element={<CustomersIndex />} />
          <Route path="/customers/lucchese" element={<LuccheseCustomer />} />
          <Route path="/customers/untuckit" element={<UNTUCKitCustomer />} />
          <Route path="/customers/kilte" element={<KilteCustomer />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/product" element={<Product />} />
          <Route path="/faqs" element={<FAQs />} />
          <Route path="/s/search" element={<SearchEngineLanding />} />
          <Route path="/s/ai-assistant" element={<AIAssistantLanding />} />
          <Route path="/webinar" element={<Webinar />} />
          <Route path="/webinar/ipullrank" element={<WebinarIPullRank />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>

      <RequestDemoModal open={isFormOpen} onClose={() => setIsFormOpen(false)} />
    </DemoFormProvider>
  );
}


function isContactParamTrue(params) {
  const value = params.get("contact-us");
  if (!value) return false;
  return ["1", "true", "yes", "open"].includes(value.toLowerCase());
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);
