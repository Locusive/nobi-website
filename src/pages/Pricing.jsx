import React from "react";
import { CheckCircle2, ChevronDown, Gift, Search, Smile, BarChart3 } from "lucide-react";
import { useSEO } from "../hooks/useSEO";
import { useDemoForm } from "../context/DemoFormContext";
import { getSignupUrl } from "../utils/signupUrl";
import "../components/home/homepage.css";
import Nav from "../components/home/Nav";
import FooterCTA from "../components/home/FooterCTA";
import SiteFooter from "../components/home/SiteFooter";
import PricingCalculator from "../components/PricingCalculator.jsx";

// All figures below are ported verbatim from the real, live pricing page
// (git history: src/pages/Pricing.jsx) — not from the design bundle, which
// paraphrased some of this (and got the overage FAQ wrong: it says usage is
// "simply billed," but customers can actually choose to pause instead).
const PLAN_PRICE = 25;
const PLAN_SEARCH_CAP = "2,500";
const PLAN_MESSAGE_CAP = "250";
const OVERAGE_RATE_MESSAGE = "$0.10";
const OVERAGE_RATE_SEARCH = "$0.01";
const TRIAL_DAYS = 30;
const MAX_PRODUCTS = "5,000";
const MAX_KB_DOCS = "5,000";

const PLAN_HIGHLIGHTS = [
  `$0.10/message, $0.01/search after that`,
  `Up to ${MAX_PRODUCTS} products`,
  `${MAX_KB_DOCS} knowledge base documents`,
  `Insights & analytics`,
];

const ENTERPRISE_HIGHLIGHTS = [
  "Dedicated support",
  "Custom integrations & onboarding",
  "Volume discounts on usage",
  `${MAX_PRODUCTS}+ products & documents`,
];

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
    a: `Yes — every account gets 100 free messages every month to try the full Nobi experience in your dashboard, no credit card needed. When you're ready to go live on your site, start a ${TRIAL_DAYS}-day free trial.`,
  },
  {
    q: "How does pricing work?",
    a: `Nobi is $${PLAN_PRICE}/month base and includes ${PLAN_SEARCH_CAP} searches and ${PLAN_MESSAGE_CAP} conversational messages. If you go over, you can choose to either pause until the next billing cycle or pay ${OVERAGE_RATE_MESSAGE}/message and ${OVERAGE_RATE_SEARCH}/search.`,
  },
  {
    q: "What happens if I go over my limit?",
    a: `You choose: either Nobi pauses until the next billing cycle, or you pay ${OVERAGE_RATE_MESSAGE} per additional message and ${OVERAGE_RATE_SEARCH} per additional search. You can change this setting at any time from your dashboard.`,
  },
  {
    q: "What counts as a search vs. a message?",
    a: "A search is when a visitor uses Nobi to find products or information on your site. A message is a back-and-forth conversational exchange. Both are tracked separately with their own limits.",
  },
  {
    q: "What kind of support do you offer?",
    a: "Our customers get full access to our founders and we even have Slack Connect channels for real-time support.",
  },
  {
    q: "Do you offer annual or enterprise pricing?",
    a: "Yes, we offer custom pricing for high-volume businesses, large catalogs, and annual commitments. Contact us to learn more.",
  },
];

const LOGOS = [
  { alt: "UNTUCKit", src: "/media/logos/untuckit.svg", height: 20 },
  { alt: "Lucchese", src: "/media/logos/lucchese.svg", height: 26 },
  { alt: "Kilte", src: "/media/logos/kilte.webp", height: 22 },
  { alt: "TOOLUP", src: "/media/logos/toolup.svg", height: 22 },
  { alt: "Alps and Meters", src: "/media/logos/alps_meters.png", height: 22 },
];

export default function Pricing() {
  const { onOpen: openDemoForm } = useDemoForm();

  useSEO({
    title: "Pricing | Nobi",
    description: "Simple pricing starting at $25/month. Try free in your dashboard with 100 free messages every month — no credit card needed. AI search, knowledge base, and lead capture for any website.",
    path: "/pricing",
    schema: {
      "@context": "https://schema.org",
      "@type": "Product",
      "name": "Nobi",
      "description": "AI site search and shopping assistant for ecommerce stores.",
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
    <div style={{ fontFamily: "'Schibsted Grotesk','Helvetica Neue',Helvetica,Arial,sans-serif", background: "#ffffff" }}>
      <Nav active="pricing" />

      {/* Hero */}
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

      {/* Tiers */}
      <div style={{ background: "#f5f3fb", padding: "56px clamp(24px,5vw,80px) 20px" }}>
        <div style={{ maxWidth: 940, margin: "0 auto" }}>
          <div
            style={{
              background: "#fff",
              border: "1px solid rgba(20,16,40,0.08)",
              borderRadius: 16,
              boxShadow: "0 24px 60px -44px rgba(76,40,130,0.4)",
              padding: "16px 22px",
              display: "flex",
              alignItems: "center",
              gap: 14,
              flexWrap: "wrap",
              justifyContent: "center",
              marginBottom: 22,
            }}
          >
            <span style={{ display: "inline-flex", width: 34, height: 34, borderRadius: 10, background: "#f1ecff", alignItems: "center", justifyContent: "center", flex: "none" }}>
              <Gift size={18} color="#6d3bff" />
            </span>
            <span style={{ fontSize: 15, color: "#3a3646" }}>
              <strong style={{ color: "#1b1626", fontWeight: 700 }}>Start free, no credit card needed.</strong> 100
              free messages every month to try the full experience in your dashboard.
            </span>
          </div>

          <div className="nb-tiers" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 22 }}>
            {/* Standard */}
            <div style={{ position: "relative", background: "#fff", border: "2px solid #6d3bff", borderRadius: 22, padding: "32px 30px", boxShadow: "0 34px 80px -40px rgba(76,40,130,0.6)", display: "flex", flexDirection: "column" }}>
              <div style={{ fontSize: 18, fontWeight: 700, color: "#1b1626" }}>Standard</div>
              <div style={{ marginTop: 6, fontSize: 14, color: "#6a6478", minHeight: 40 }}>
                Everything you need to power search and conversations on your site.
              </div>
              <div style={{ marginTop: 18, display: "flex", alignItems: "baseline", gap: 6 }}>
                <span style={{ fontSize: 46, fontWeight: 700, letterSpacing: "-0.03em", color: "#1b1626" }}>${PLAN_PRICE}</span>
                <span style={{ fontSize: 15, color: "#6a6478" }}>/ month base</span>
              </div>
              <div style={{ marginTop: 4, fontSize: 13.5, color: "#8a8498" }}>
                {PLAN_SEARCH_CAP} searches + {PLAN_MESSAGE_CAP} messages included
              </div>
              <a
                href={getSignupUrl()}
                style={{ marginTop: 22, display: "block", textAlign: "center", background: "#6d3bff", color: "#fff", borderRadius: 12, padding: 13, fontSize: 15, fontWeight: 700, textDecoration: "none" }}
              >
                Start for Free
              </a>
              <div style={{ marginTop: 22, display: "flex", flexDirection: "column", gap: 11 }}>
                {PLAN_HIGHLIGHTS.map((h) => (
                  <div key={h} style={{ display: "flex", gap: 9, fontSize: 14, color: "#3a3646" }}>
                    <CheckCircle2 size={18} color="#1fab6d" strokeWidth={2.4} style={{ flex: "none", marginTop: 1 }} />
                    {h}
                  </div>
                ))}
              </div>
            </div>

            {/* Enterprise */}
            <div style={{ background: "#100a24", border: "1px solid #100a24", borderRadius: 22, padding: "32px 30px", boxShadow: "0 24px 60px -40px rgba(76,40,130,0.5)", display: "flex", flexDirection: "column", color: "#fff" }}>
              <div style={{ fontSize: 18, fontWeight: 700 }}>Enterprise</div>
              <div style={{ marginTop: 6, fontSize: 14, color: "rgba(255,255,255,0.6)", minHeight: 40 }}>
                Tailored plans for high-volume businesses with large catalogs.
              </div>
              <div style={{ marginTop: 18, display: "flex", alignItems: "baseline", gap: 6 }}>
                <span style={{ fontSize: 42, fontWeight: 700, letterSpacing: "-0.03em" }}>Custom</span>
              </div>
              <div style={{ marginTop: 4, fontSize: 13.5, color: "rgba(255,255,255,0.55)" }}>Volume pricing</div>
              <button
                type="button"
                onClick={openDemoForm}
                style={{ marginTop: 22, display: "block", width: "100%", textAlign: "center", background: "#fff", color: "#100a24", border: "none", borderRadius: 12, padding: 13, fontSize: 15, fontWeight: 700, cursor: "pointer" }}
              >
                Get in Touch
              </button>
              <div style={{ marginTop: 22, display: "flex", flexDirection: "column", gap: 11 }}>
                {ENTERPRISE_HIGHLIGHTS.map((h) => (
                  <div key={h} style={{ display: "flex", gap: 9, fontSize: 14, color: "rgba(255,255,255,0.82)" }}>
                    <CheckCircle2 size={18} color="#4fd1a0" strokeWidth={2.4} style={{ flex: "none", marginTop: 1 }} />
                    {h}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing calculator — real, working component (lead capture + tracking), used as-is */}
      <div style={{ background: "#f5f3fb", paddingBottom: 24 }}>
        <PricingCalculator />
      </div>

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

      {/* Logos */}
      <div style={{ background: "#f5f3fb", padding: "56px clamp(24px,5vw,80px)" }}>
        <div style={{ maxWidth: 1120, margin: "0 auto", textAlign: "center" }}>
          <div style={{ fontSize: 13, color: "#8a8498", fontWeight: 500 }}>
            Trusted by ecommerce teams serious about search &amp; discovery
          </div>
          <div style={{ marginTop: 26, display: "flex", alignItems: "center", justifyContent: "center", gap: "clamp(30px,6vw,64px)", flexWrap: "wrap", opacity: 0.62 }}>
            {LOGOS.map((l) => (
              <img key={l.alt} src={l.src} alt={l.alt} style={{ height: l.height, width: "auto" }} />
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
