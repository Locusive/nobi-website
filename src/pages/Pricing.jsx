import React from "react";
import { ChevronDown, Search, Smile, BarChart3 } from "lucide-react";
import { useSEO } from "../hooks/useSEO";
import "../components/home/homepage.css";
import Nav from "../components/home/Nav";
import ProofBar from "../components/home/ProofBar";
import FooterCTA from "../components/home/FooterCTA";
import SiteFooter from "../components/home/SiteFooter";
import PricingPlans from "../components/PricingPlans.jsx";
import "./Pricing.css";
import { EXTRA_MESSAGE_CENTS, FREE_PREVIEW_MESSAGES, LARGEST_BUNDLE, PRICING_OFFER, PRICING_SEO_DESCRIPTION, SMALLEST_BUNDLE, TRIAL_DAYS, TRIAL_LIMIT_RULE, TRIAL_SUMMARY } from "../constants/pricing";
import { formatCount, formatPrice } from "../utils/priceFormat";

const SMALLEST_PRICE = formatPrice(SMALLEST_BUNDLE.priceCents);
const SMALLEST_MESSAGES = formatCount(SMALLEST_BUNDLE.messages);
const LARGEST_PRICE = formatPrice(LARGEST_BUNDLE.priceCents);
const LARGEST_MESSAGES = formatCount(LARGEST_BUNDLE.messages);

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
    a: `Yes. Every account gets ${FREE_PREVIEW_MESSAGES} free messages each month to preview Nobi in your dashboard, no credit card needed. A payment method is required to start the ${TRIAL_DAYS}-day free trial on your live site. You get ${TRIAL_SUMMARY}`,
  },
  {
    q: "How does pricing work?",
    a: `You pick a monthly bundle of messages. Bundles start at ${SMALLEST_PRICE} for ${SMALLEST_MESSAGES} messages and go up to ${LARGEST_PRICE} for ${LARGEST_MESSAGES} messages. Bigger bundles cost less per message. Nobi's replies are included. Your plan also includes 5,000 searchable items, 5,000 knowledge base documents, and analytics.`,
  },
  {
    q: "What counts as a message?",
    a: "Everything a shopper types into Nobi counts as one message: a search, a chat question, a click on a suggestion, a question on a product page, or a question in the filter panel. There is no separate search allowance. Showing more results for the same search is free.",
  },
  {
    q: "What happens if I go over my bundle?",
    a: `You choose one of two settings for your store. Keep going: Nobi keeps running, and that month is billed at the bundle that fits your usage. Stop and hide Nobi: Nobi stops at your limit and hides from your store until next month. ${TRIAL_LIMIT_RULE}`,
  },
  {
    q: `What if I need more than ${LARGEST_MESSAGES} messages?`,
    a: `Talk to sales for custom pricing. If you stay on Keep going above ${LARGEST_MESSAGES} messages, you pay ${LARGEST_PRICE} plus ${EXTRA_MESSAGE_CENTS} cents for each extra message.`,
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
    description: PRICING_SEO_DESCRIPTION,
    path: "/pricing",
    schema: {
      "@context": "https://schema.org",
      "@type": "Product",
      "name": "Nobi",
      "description": "Site search and an AI assistant for any website.",
      "brand": { "@type": "Brand", "name": "Nobi" },
      "offers": PRICING_OFFER,
    },
  });

  return (
    <div className="nobi-pricing-page" style={{ fontFamily: "'Schibsted Grotesk','Helvetica Neue',Helvetica,Arial,sans-serif", background: "#ffffff" }}>
      <Nav active="pricing" />

      <PricingHero />

      <div className="pricing-proof"><ProofBar /></div>

      <PricingPlans />

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
            Try the full Nobi experience free in your dashboard. No credit card needed. Ready to go live on your
            site? Get {TRIAL_SUMMARY}
          </p>
        </div>
      </div>
  );
}
