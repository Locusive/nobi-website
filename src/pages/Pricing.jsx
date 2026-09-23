import React from "react";
import { ChevronDown, Search, Smile, BarChart3 } from "lucide-react";
import { useSEO } from "../hooks/useSEO";
import "../components/home/homepage.css";
import Nav from "../components/home/Nav";
import ProofBar from "../components/home/ProofBar";
import FooterCTA from "../components/home/FooterCTA";
import SiteFooter from "../components/home/SiteFooter";
import PricingWizard from "../components/PricingWizard.jsx";
import PricingPlans from "../components/PricingPlans.jsx";
import "./Pricing.css";

const PLAN_PRICE = 25;
const PLAN_SEARCH_CAP = "2,500";
const PLAN_MESSAGE_CAP = "250";
const OVERAGE_RATE_MESSAGE = "$0.10";
const OVERAGE_RATE_SEARCH = "$0.01";
const TRIAL_DAYS = 30;
const VALUE_PROPS = [
  {
    icon: Search,
    bg: "#efe8ff",
    color: "#6d3bff",
    title: "Better, Faster Search",
    description: "Semantic search understands intent, outperforming traditional keyword matching.",
  },
  {
    icon: Smile,
    bg: "#e0f7ef",
    color: "#0f8a54",
    title: "Improved Customer Experience",
    description: "Customers get accurate answers powered by data you trust and control.",
  },
  {
    icon: BarChart3,
    bg: "#ffe6f4",
    color: "#d541b3",
    title: "Insights & Data",
    description: "Reporting and trends reveal what your customers are really looking for.",
  },
];

const PRICING_FAQS = [
  {
    q: "Can I try Nobi for free?",
    a: `Yes. Every account gets 100 free messages each month to preview Nobi in your dashboard, no credit card needed. A payment method is required to start the ${TRIAL_DAYS}-day free trial on your live site.`,
  },
  {
    q: "How does pricing work?",
    a: `Nobi starts at $${PLAN_PRICE}/month and includes ${PLAN_SEARCH_CAP} searches and ${PLAN_MESSAGE_CAP} conversational messages each month. Additional usage is billed at ${OVERAGE_RATE_SEARCH}/search and ${OVERAGE_RATE_MESSAGE}/message. Nobi's replies are included. Your plan also includes 5,000 searchable items, 5,000 knowledge base documents, and analytics.`,
  },
  {
    q: "What happens if I go over my limit?",
    a: `Additional usage is billed at ${OVERAGE_RATE_SEARCH} per search and ${OVERAGE_RATE_MESSAGE} per visitor message. Search and message allowances are separate; unused searches do not cover additional messages.`,
  },
  {
    q: "What counts as a search vs. a message?",
    a: "A search returns matching items, pages, or resources. A message is a visitor question or follow-up that needs a conversational response, even if it starts the conversation. Nobi's replies are included. Both are tracked separately with their own limits.",
  },
  {
    q: "What kind of support do you offer?",
    a: "Our customers get full access to our founders and we even have Slack Connect channels for real-time support.",
  },
  {
    q: "Do you offer annual or enterprise pricing?",
    a: "Yes, we offer custom pricing for high-volume websites, custom needs, and annual commitments. Contact us to learn more.",
  },
];

export default function Pricing() {
  useSEO({
    title: "Pricing | Nobi",
    description: "Simple pricing starting at $25/month. Try free in your dashboard with 100 free messages every month — no credit card needed. AI search, knowledge base, and lead capture for any website.",
    path: "/pricing",
    schema: {
      "@context": "https://schema.org",
      "@type": "Product",
      "name": "Nobi",
      "description": "Site search and an AI assistant for any website.",
      "brand": { "@type": "Brand", "name": "Nobi" },
      "offers": {
        "@type": "Offer",
        "price": "25",
        "priceCurrency": "USD",
        "availability": "https://schema.org/InStock",
        "url": "https://nobi.ai/pricing",
      },
    },
  });

  return (
    <div className="nobi-pricing-page" style={{ fontFamily: "'Schibsted Grotesk','Helvetica Neue',Helvetica,Arial,sans-serif", background: "#ffffff" }}>
      <Nav active="pricing" />

      <PricingHero />

      <PricingPlans />

      <PricingWizard />

      {/* Value props */}
      <div style={{ background: "#ffffff", padding: "clamp(56px,6vw,72px) clamp(24px,5vw,80px)" }}>
        <div style={{ maxWidth: 1120, margin: "0 auto" }}>
          <div style={{ textAlign: "center", maxWidth: "40ch", margin: "0 auto" }}>
            <span style={{ fontFamily: "'SF Mono',ui-monospace,Menlo,monospace", fontSize: 12.5, letterSpacing: "0.2em", textTransform: "uppercase", color: "#6d3bff", fontWeight: 600 }}>
              Why Nobi
            </span>
            <h2 style={{ margin: "14px 0 0", fontSize: "clamp(30px,3.6vw,46px)", fontWeight: 700, letterSpacing: "-0.03em", color: "#1b1626", lineHeight: 1.05 }}>
              Access everything you need
            </h2>
          </div>
          <div className="nb-grid3" style={{ marginTop: "clamp(40px,5vw,60px)", display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "clamp(18px,2.5vw,28px)" }}>
            {VALUE_PROPS.map(({ icon: Icon, bg, color, title, description }) => (
              <div key={title} style={{ border: "1px solid rgba(20,16,40,0.09)", borderRadius: 20, padding: "28px 24px", background: "#faf9fc" }}>
                <span style={{ display: "inline-flex", width: 46, height: 46, borderRadius: 12, alignItems: "center", justifyContent: "center", background: bg, color }}>
                  <Icon size={24} strokeWidth={2.1} />
                </span>
                <h3 style={{ margin: "18px 0 0", fontSize: 19, fontWeight: 700, letterSpacing: "-0.02em", color: "#1b1626" }}>{title}</h3>
                <p style={{ margin: "9px 0 0", fontSize: 14.5, lineHeight: 1.55, color: "#615b70" }}>{description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="pricing-proof"><ProofBar /></div>

      {/* FAQ */}
      <div style={{ background: "#ffffff", padding: "80px clamp(24px,5vw,80px)" }}>
        <div style={{ maxWidth: 960, margin: "0 auto" }}>
          <h2 style={{ margin: "0 0 34px", textAlign: "center", fontSize: "clamp(26px,3vw,40px)", fontWeight: 700, letterSpacing: "-0.03em", color: "#1b1626" }}>
            Pricing FAQs
          </h2>
          <div className="nb-faqgrid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            {PRICING_FAQS.map((f) => (
              <details key={f.q} className="nb-faq" style={{ background: "#f5f3fb", border: "1px solid rgba(20,16,40,0.08)", borderRadius: 14, padding: "2px 18px" }}>
                <summary style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, padding: "18px 0", fontSize: 15.5, fontWeight: 600, color: "#1b1626" }}>
                  {f.q}
                  <ChevronDown className="nb-faq-chev" size={18} color="#8a8498" strokeWidth={2.2} style={{ flex: "none" }} />
                </summary>
                <div style={{ padding: "0 0 18px", fontSize: 14.5, lineHeight: 1.6, color: "#615b70" }}>{f.a}</div>
              </details>
            ))}
          </div>
        </div>
      </div>

      <FooterCTA />
      <SiteFooter />
    </div>
  );
}

function PricingHero() {
  return (
      <div style={{ position: "relative", overflow: "hidden", background: "linear-gradient(180deg,#6656ce,#5a3fc0)", color: "#fff", padding: "150px clamp(24px,5vw,80px) 84px", textAlign: "center" }}>
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "radial-gradient(60% 55% at 15% 12%, rgba(255,150,110,0.28), rgba(255,150,110,0) 70%), radial-gradient(55% 55% at 90% 90%, rgba(213,65,179,0.32), rgba(213,65,179,0) 70%)",
          }}
        />
        <div style={{ position: "relative", zIndex: 2, maxWidth: 720, margin: "0 auto" }}>
          <span style={{ display: "inline-block", fontFamily: "'SF Mono',ui-monospace,Menlo,monospace", fontSize: 13, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.72)", fontWeight: 600 }}>
            Pricing
          </span>
          <h1 style={{ margin: "20px 0 0", fontSize: "clamp(40px,5.4vw,68px)", fontWeight: 700, letterSpacing: "-0.035em", lineHeight: 1.02 }}>
            Simple, usage-based pricing
          </h1>
          <p style={{ margin: "20px auto 0", maxWidth: "44ch", fontSize: "clamp(16px,1.3vw,20px)", lineHeight: 1.55, color: "rgba(255,255,255,0.85)" }}>
            Try the full Nobi experience free in your dashboard — no credit card needed. Ready to go live on your
            site? Start a {TRIAL_DAYS}-day free trial.
          </p>
        </div>
      </div>
  );
}
