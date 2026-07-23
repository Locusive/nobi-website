import React from "react";
import {
  Search,
  LifeBuoy,
  ShoppingBag,
  Zap,
  UserPlus,
  Bot,
  SlidersHorizontal,
  BarChart3,
  Sparkles,
  Repeat,
  Tag,
  Wand2,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import { useSEO } from "../hooks/useSEO";
import { useDemoForm } from "../context/DemoFormContext";
import { trackDemoFormOpened } from "../utils/eventTracker";
import "../components/home/homepage.css";
import Nav from "../components/home/Nav";
import FooterCTA from "../components/home/FooterCTA";
import SiteFooter from "../components/home/SiteFooter";

// All capability claims below are grounded in seo/config/capabilities.yml +
// nobi_facts.yml (nobi-marketing repo) and docs.nobi.ai — not invented.
// Lead Capture is deliberately NOT framed as an ecommerce feature: the real
// facts config is explicit that ecommerce shoppers buy or abandon, they
// don't leave leads. It's real, but scoped to the verticals where a
// qualified lead — not a purchase — is the actual goal.

function Kicker({ children }) {
  return (
    <span
      style={{
        display: "inline-block",
        fontFamily: "'SF Mono',ui-monospace,Menlo,monospace",
        fontSize: 12.5,
        letterSpacing: "0.2em",
        textTransform: "uppercase",
        color: "#6d3bff",
        fontWeight: 600,
      }}
    >
      {children}
    </span>
  );
}

function TriggerBadge({ children }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        fontSize: 13,
        fontWeight: 600,
        color: "#3a3646",
        background: "#f3f0fa",
        border: "1px solid rgba(20,16,40,0.08)",
        borderRadius: 999,
        padding: "7px 14px",
      }}
    >
      {children}
    </span>
  );
}

function SectionShell({ id, bg, children }) {
  return (
    <div id={id} style={{ background: bg, padding: "clamp(64px,8vw,100px) clamp(24px,5vw,80px)" }}>
      <div style={{ maxWidth: 1120, margin: "0 auto" }}>{children}</div>
    </div>
  );
}

function SectionRow({ reverse, text, visual }) {
  return (
    <div
      className="nb-feat-row"
      style={{
        display: "flex",
        flexDirection: reverse ? "row-reverse" : "row",
        alignItems: "center",
        gap: "clamp(32px,6vw,90px)",
        flexWrap: "wrap",
      }}
    >
      <div className="nb-feat-col" style={{ flex: "1 1 420px", minWidth: 300 }}>
        {text}
      </div>
      <div className="nb-feat-col" style={{ flex: "1 1 440px", minWidth: 300, display: "flex", justifyContent: "center" }}>
        {visual}
      </div>
    </div>
  );
}

function DemoCard({ children }) {
  return (
    <div style={{ width: "min(480px,100%)", background: "#ffffff", borderRadius: 22, boxShadow: "0 40px 90px -45px rgba(76,40,130,0.45)", border: "1px solid rgba(20,16,40,0.06)", overflow: "hidden" }}>
      {children}
    </div>
  );
}

const ALSO_INCLUDED = [
  {
    icon: Zap,
    bg: "#efe8ff",
    color: "#6d3bff",
    title: "Custom Actions",
    body: "A JS API to trigger real workflows from inside the chat - book an appointment, submit a quote, open a support ticket, redirect, or call your own API.",
  },
  {
    icon: BarChart3,
    bg: "#e0f7ef",
    color: "#0f8a54",
    title: "A/B Testing",
    body: "Native, stable per-visitor split testing. Shopify add-to-cart and checkout events are captured automatically, no extra tagging.",
  },
  {
    icon: Sparkles,
    bg: "#ffe6f4",
    color: "#d541b3",
    title: "Reporting & Insights",
    body: "Search analytics, zero-result queries, top terms, conversation summaries, and revenue attribution in one dashboard.",
  },
  {
    icon: Wand2,
    bg: "#eef2ff",
    color: "#4f46e5",
    title: "Query Overrides",
    body: "Rule-based control over specific queries - redirect a search term to an exact result or collection, no code required.",
  },
  {
    icon: Repeat,
    bg: "#fff4e5",
    color: "#c2660d",
    title: "Remarketing Pixels",
    body: "Fire Meta, Google, or TikTok pixels straight from assistant behavior - e.g. when a shopper asks about a category but doesn't buy.",
  },
  {
    icon: Tag,
    bg: "#f0f9ff",
    color: "#0369a1",
    title: "Product Recommendations",
    body: "AI-generated recommendations inside the chat and search results, based on browsing and purchase history. In beta.",
  },
];

export default function Product() {
  useSEO({
    title: "Product | Nobi",
    description:
      "Everything Nobi does: AI-powered search and support, a proactive shopping assistant, triggered engagement, lead capture, and an agent endpoint every AI can call.",
    path: "/product",
  });

  const { onOpen } = useDemoForm();
  const openDemo = () => {
    trackDemoFormOpened();
    onOpen();
  };

  return (
    <div style={{ fontFamily: "'Schibsted Grotesk','Helvetica Neue',Helvetica,Arial,sans-serif", background: "#ffffff" }}>
      <Nav active="product" />

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
        <div style={{ position: "relative", zIndex: 2, maxWidth: 760, margin: "0 auto" }}>
          <span style={{ display: "inline-block", fontFamily: "'SF Mono',ui-monospace,Menlo,monospace", fontSize: 13, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.72)", fontWeight: 600 }}>
            Product
          </span>
          <h1 style={{ margin: "20px 0 0", fontSize: "clamp(38px,5.2vw,64px)", fontWeight: 700, letterSpacing: "-0.035em", lineHeight: 1.04 }}>
            One assistant. Every job your website needs done.
          </h1>
          <p style={{ margin: "20px auto 0", maxWidth: "50ch", fontSize: "clamp(16px,1.3vw,20px)", lineHeight: 1.55, color: "rgba(255,255,255,0.85)" }}>
            Nobi is a single AI assistant that searches, answers, sells, engages, and captures leads - grounded in
            your real content, live on your site in minutes.
          </p>
        </div>
      </div>

      {/* 1. Search & Answers */}
      <SectionShell bg="#ffffff">
        <SectionRow
          text={
            <>
              <Kicker>Search &amp; answers</Kicker>
              <h2 style={{ margin: "16px 0 0", fontSize: "clamp(30px,3.6vw,44px)", fontWeight: 700, letterSpacing: "-0.03em", color: "#1b1626", lineHeight: 1.08 }}>
                Ask it anything. It answers from what's actually true.
              </h2>
              <p style={{ margin: "18px 0 0", fontSize: 16.5, lineHeight: 1.6, color: "#615b70", maxWidth: "46ch" }}>
                Nobi reads your catalog, docs, PDFs, and pages, then answers in plain language with a citation - the
                way AI answer engines work, but grounded entirely in your own content. It's a product finder, a
                support desk, and a product-page expert in one: semantic search that understands what shoppers mean
                (not just the words they type), sizing and care questions answered from real specs, and shipping,
                returns, and policy questions deflected before they become a ticket.
              </p>
              <ul style={{ margin: "22px 0 0", display: "flex", flexDirection: "column", gap: 10, padding: 0, listStyle: "none" }}>
                {[
                  "Semantic search - typos, synonyms, and zero-result recovery handled automatically",
                  "Support answers cited to your real docs and policies, not guesses",
                  "A product-page assistant that answers in the context of the exact item being viewed",
                ].map((t) => (
                  <li key={t} style={{ display: "flex", gap: 9, fontSize: 14.5, color: "#3a3646" }}>
                    <CheckCircle2 size={18} color="#1fab6d" strokeWidth={2.4} style={{ flex: "none", marginTop: 1 }} />
                    {t}
                  </li>
                ))}
              </ul>
            </>
          }
          visual={
            <DemoCard>
              <div style={{ display: "flex", alignItems: "center", gap: 11, padding: "13px 13px 13px 18px", borderBottom: "1px solid rgba(20,16,40,0.07)" }}>
                <Search size={18} color="#8a8498" strokeWidth={2.3} style={{ flex: "none" }} />
                <span style={{ flex: 1, fontSize: 15, color: "#1b1626" }}>does this run true to size?</span>
                <span style={{ flex: "none", display: "inline-flex", alignItems: "center", gap: 6, background: "linear-gradient(90deg,#d946ef,#ec4899)", color: "#fff", borderRadius: 999, padding: "7px 13px", fontSize: 12.5, fontWeight: 600 }}>
                  <Sparkles size={13} /> Ask AI
                </span>
              </div>
              <div style={{ padding: "18px 18px 20px" }}>
                <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                  <span style={{ flex: "none", width: 30, height: 30, borderRadius: 8, background: "linear-gradient(135deg,#6d3bff,#d541b3)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <LifeBuoy size={15} color="#fff" />
                  </span>
                  <div style={{ flex: 1, fontSize: 14.5, lineHeight: 1.55, color: "#1b1626" }}>
                    This style runs about half a size small - most shoppers your height order one size up. Free
                    exchanges if it's not right.
                  </div>
                </div>
                <div style={{ marginTop: 14, marginLeft: 42, fontSize: 12, color: "#a49dba", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em" }}>
                  Cited from Sizing &amp; Fit Guide
                </div>
              </div>
            </DemoCard>
          }
        />
      </SectionShell>

      {/* 2. Sales Assistance */}
      <SectionShell bg="#f5f3fb">
        <SectionRow
          reverse
          text={
            <>
              <Kicker>Sales assistance</Kicker>
              <h2 style={{ margin: "16px 0 0", fontSize: "clamp(30px,3.6vw,44px)", fontWeight: 700, letterSpacing: "-0.03em", color: "#1b1626", lineHeight: 1.08 }}>
                A shopping assistant, not just a search bar.
              </h2>
              <p style={{ margin: "18px 0 0", fontSize: 16.5, lineHeight: 1.6, color: "#615b70", maxWidth: "46ch" }}>
                Nobi proactively helps shoppers find what they want, narrows options down, compares items, and adds
                to cart - the way a great in-store associate would, on traffic you already have.
              </p>
              <ul style={{ margin: "22px 0 0", display: "flex", flexDirection: "column", gap: 10, padding: 0, listStyle: "none" }}>
                {["Guided product discovery through natural conversation", "Side-by-side comparisons on request", "One-click add to cart from inside search or chat"].map((t) => (
                  <li key={t} style={{ display: "flex", gap: 9, fontSize: 14.5, color: "#3a3646" }}>
                    <CheckCircle2 size={18} color="#1fab6d" strokeWidth={2.4} style={{ flex: "none", marginTop: 1 }} />
                    {t}
                  </li>
                ))}
              </ul>
            </>
          }
          visual={
            <DemoCard>
              <div style={{ display: "flex", alignItems: "center", gap: 11, padding: "13px 13px 13px 18px", borderBottom: "1px solid rgba(20,16,40,0.07)" }}>
                <ShoppingBag size={17} color="#6d3bff" strokeWidth={2.2} style={{ flex: "none" }} />
                <span style={{ fontSize: 13.5, fontWeight: 600, color: "#1b1626" }}>Shop with AI</span>
                <span style={{ marginLeft: "auto", fontSize: 11, fontWeight: 700, color: "#0f8a54", background: "#ecfdf5", borderRadius: 999, padding: "4px 10px" }}>Live</span>
              </div>
              <div style={{ padding: 16, display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10 }}>
                {["/media/prod-1.webp", "/media/prod-2.webp", "/media/prod-3.webp"].map((src) => (
                  <div key={src} style={{ borderRadius: 12, overflow: "hidden", background: "#f4eef2" }}>
                    <div style={{ aspectRatio: "3/4" }}>
                      <img src={src} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    </div>
                  </div>
                ))}
              </div>
            </DemoCard>
          }
        />
      </SectionShell>

      {/* 3. Proactive / Triggered Engagement */}
      <SectionShell bg="#ffffff">
        <SectionRow
          text={
            <>
              <Kicker>Proactive engagement</Kicker>
              <h2 style={{ margin: "16px 0 0", fontSize: "clamp(30px,3.6vw,44px)", fontWeight: 700, letterSpacing: "-0.03em", color: "#1b1626", lineHeight: 1.08 }}>
                It reaches out at the right moment - not every moment.
              </h2>
              <p style={{ margin: "18px 0 0", fontSize: 16.5, lineHeight: 1.6, color: "#615b70", maxWidth: "46ch" }}>
                Set behavioral triggers and Nobi surfaces itself - a floating bar, a compact button, a message pill
                or card, or a popup - exactly when it's useful, controlled entirely from your dashboard with page
                targeting and scheduling.
              </p>
              <div style={{ marginTop: 20, display: "flex", flexWrap: "wrap", gap: 9 }}>
                {["Exit intent", "Idle time", "Scroll depth", "Time on page", "Page load", "Returning visitor", "Search referral"].map((t) => (
                  <TriggerBadge key={t}>{t}</TriggerBadge>
                ))}
              </div>
            </>
          }
          visual={
            <DemoCard>
              <div style={{ padding: 20 }}>
                <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "#a49dba", marginBottom: 12 }}>
                  Trigger: Exit intent
                </div>
                <div style={{ border: "1px solid rgba(20,16,40,0.08)", borderRadius: 16, padding: 16, background: "#faf8ff" }}>
                  <div style={{ display: "flex", gap: 11, alignItems: "flex-start" }}>
                    <span style={{ flex: "none", width: 30, height: 30, borderRadius: 8, background: "linear-gradient(135deg,#6d3bff,#d541b3)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Sparkles size={15} color="#fff" />
                    </span>
                    <div style={{ fontSize: 14.5, color: "#1b1626", lineHeight: 1.5 }}>
                      Still deciding? I can help you compare sizes, or find something similar in stock.
                    </div>
                  </div>
                </div>
              </div>
            </DemoCard>
          }
        />
      </SectionShell>

      {/* 4. Lead Capture — honestly scoped, not framed as an ecommerce feature */}
      <SectionShell bg="#f5f3fb">
        <SectionRow
          reverse
          text={
            <>
              <Kicker>Lead capture</Kicker>
              <h2 style={{ margin: "16px 0 0", fontSize: "clamp(30px,3.6vw,44px)", fontWeight: 700, letterSpacing: "-0.03em", color: "#1b1626", lineHeight: 1.08 }}>
                When the goal is a lead, not a cart.
              </h2>
              <p style={{ margin: "18px 0 0", fontSize: 16.5, lineHeight: 1.6, color: "#615b70", maxWidth: "46ch" }}>
                For dealerships, service businesses, B2B, financial services, and agencies, the win isn't a
                purchase - it's a qualified contact. Nobi collects names, contact info, and qualifying details right
                inside the conversation, so your sales team gets a callable lead instead of a bounced visitor.
              </p>
              <ul style={{ margin: "22px 0 0", display: "flex", flexDirection: "column", gap: 10, padding: 0, listStyle: "none" }}>
                {["Collected inline, mid-conversation - no separate form to abandon", "Sent straight to your CRM or sales workflow", "Built for automotive, services, B2B, and financial sites"].map((t) => (
                  <li key={t} style={{ display: "flex", gap: 9, fontSize: 14.5, color: "#3a3646" }}>
                    <CheckCircle2 size={18} color="#1fab6d" strokeWidth={2.4} style={{ flex: "none", marginTop: 1 }} />
                    {t}
                  </li>
                ))}
              </ul>
            </>
          }
          visual={
            <DemoCard>
              <div style={{ display: "flex", alignItems: "center", gap: 11, padding: "13px 13px 13px 18px", borderBottom: "1px solid rgba(20,16,40,0.07)" }}>
                <UserPlus size={17} color="#6d3bff" strokeWidth={2.2} style={{ flex: "none" }} />
                <span style={{ fontSize: 13.5, fontWeight: 600, color: "#1b1626" }}>New lead captured</span>
              </div>
              <div style={{ padding: 18 }}>
                <div style={{ fontSize: 14, color: "#615b70", lineHeight: 1.6 }}>
                  "I'd like to schedule a test drive this weekend if you have the 2026 model in stock."
                </div>
                <div style={{ marginTop: 14, paddingTop: 14, borderTop: "1px solid rgba(20,16,40,0.06)", display: "flex", justifyContent: "space-between", fontSize: 12.5, color: "#8a8498" }}>
                  <span>Name + phone captured</span>
                  <span style={{ color: "#0f8a54", fontWeight: 600 }}>Sent to CRM</span>
                </div>
              </div>
            </DemoCard>
          }
        />
      </SectionShell>

      {/* 5. Reach AI Agents / MCP */}
      <SectionShell bg="#ffffff">
        <SectionRow
          text={
            <>
              <Kicker>Reach AI agents</Kicker>
              <h2 style={{ margin: "16px 0 0", fontSize: "clamp(30px,3.6vw,44px)", fontWeight: 700, letterSpacing: "-0.03em", color: "#1b1626", lineHeight: 1.08 }}>
                Your business, callable by every AI your customers use.
              </h2>
              <p style={{ margin: "18px 0 0", fontSize: 16.5, lineHeight: 1.6, color: "#615b70", maxWidth: "46ch" }}>
                Every Nobi assistant is automatically also an MCP endpoint. Claude, ChatGPT, Gemini, and any
                MCP-compatible agent can discover and query it directly - no separate setup, nothing extra to
                deploy. As AI agents become how people research and buy, a callable, discoverable endpoint is the
                new equivalent of having a website.
              </p>
              <ul style={{ margin: "22px 0 0", display: "flex", flexDirection: "column", gap: 10, padding: 0, listStyle: "none" }}>
                {["No extra setup - the same assistant on your site is the MCP endpoint", "Built for customer and prospect interactions, not developer tooling", "Discoverable via your site's llms.txt"].map((t) => (
                  <li key={t} style={{ display: "flex", gap: 9, fontSize: 14.5, color: "#3a3646" }}>
                    <CheckCircle2 size={18} color="#1fab6d" strokeWidth={2.4} style={{ flex: "none", marginTop: 1 }} />
                    {t}
                  </li>
                ))}
              </ul>
            </>
          }
          visual={
            <DemoCard>
              <div style={{ display: "flex", alignItems: "center", gap: 11, padding: "13px 13px 13px 18px", borderBottom: "1px solid rgba(20,16,40,0.07)" }}>
                <Bot size={17} color="#6d3bff" strokeWidth={2.2} style={{ flex: "none" }} />
                <span style={{ fontSize: 13.5, fontWeight: 600, color: "#1b1626" }}>MCP: ask_question</span>
              </div>
              <div style={{ padding: 18, fontFamily: "'SF Mono',ui-monospace,Menlo,monospace", fontSize: 12.5, lineHeight: 1.7, color: "#3a3646", background: "#faf8ff" }}>
                <div>agent → "does this brand ship to Canada?"</div>
                <div style={{ marginTop: 6, color: "#6d3bff" }}>nobi → grounded answer + citation</div>
              </div>
            </DemoCard>
          }
        />
      </SectionShell>

      {/* 6. Merchandising & Personalization */}
      <SectionShell bg="#f5f3fb">
        <SectionRow
          reverse
          text={
            <>
              <Kicker>Merchandising &amp; personalization</Kicker>
              <h2 style={{ margin: "16px 0 0", fontSize: "clamp(30px,3.6vw,44px)", fontWeight: 700, letterSpacing: "-0.03em", color: "#1b1626", lineHeight: 1.08 }}>
                Control what shows. Let it learn who's looking.
              </h2>
              <p style={{ margin: "18px 0 0", fontSize: 16.5, lineHeight: 1.6, color: "#615b70", maxWidth: "46ch" }}>
                Boost, bury, pin, or hide products in results, no code or CSV uploads. And Nobi remembers what each
                visitor has browsed, searched, and bought, so results and recommendations adapt for returning
                visitors automatically.
              </p>
              <ul style={{ margin: "22px 0 0", display: "flex", flexDirection: "column", gap: 10, padding: 0, listStyle: "none" }}>
                {["Pin bestsellers, bury out-of-stock, schedule promotions", "All controlled through a UI, not a spreadsheet", "Personalized results for returning visitors, no manual segmentation"].map((t) => (
                  <li key={t} style={{ display: "flex", gap: 9, fontSize: 14.5, color: "#3a3646" }}>
                    <CheckCircle2 size={18} color="#1fab6d" strokeWidth={2.4} style={{ flex: "none", marginTop: 1 }} />
                    {t}
                  </li>
                ))}
              </ul>
            </>
          }
          visual={
            <DemoCard>
              <div style={{ display: "flex", alignItems: "center", gap: 9, padding: "13px 13px 13px 18px", borderBottom: "1px solid rgba(20,16,40,0.07)" }}>
                <SlidersHorizontal size={16} color="#0f8a54" strokeWidth={2.2} />
                <span style={{ fontSize: 13.5, fontWeight: 600, color: "#1b1626" }}>Results ordering</span>
                <span style={{ marginLeft: "auto", fontSize: 11, fontWeight: 700, color: "#0f8a54", background: "#ecfdf5", borderRadius: 999, padding: "4px 10px" }}>Live</span>
              </div>
              <div style={{ padding: 14, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <div style={{ position: "relative", border: "2px solid #6d3bff", borderRadius: 12, overflow: "hidden" }}>
                  <div style={{ aspectRatio: "1/1", background: "#f4eef2" }}>
                    <img src="/media/prod-1.webp" alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </div>
                  <span style={{ position: "absolute", top: 7, left: 7, fontSize: 10.5, fontWeight: 700, color: "#fff", background: "#6d3bff", borderRadius: 999, padding: "3px 8px" }}>Pinned</span>
                </div>
                <div style={{ border: "1px solid rgba(20,16,40,0.08)", borderRadius: 12, overflow: "hidden" }}>
                  <div style={{ aspectRatio: "1/1", background: "#f4eef2" }}>
                    <img src="/media/prod-2.webp" alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </div>
                </div>
              </div>
            </DemoCard>
          }
        />
      </SectionShell>

      {/* Also included */}
      <SectionShell bg="#ffffff">
        <div style={{ textAlign: "center", maxWidth: "44ch", margin: "0 auto" }}>
          <Kicker>And more</Kicker>
          <h2 style={{ margin: "14px 0 0", fontSize: "clamp(28px,3.4vw,42px)", fontWeight: 700, letterSpacing: "-0.03em", color: "#1b1626", lineHeight: 1.08 }}>
            Also included
          </h2>
        </div>
        <div className="nb-grid3" style={{ marginTop: "clamp(36px,5vw,52px)", display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "clamp(16px,2.2vw,24px)" }}>
          {ALSO_INCLUDED.map(({ icon: Icon, bg, color, title, body }) => (
            <div key={title} style={{ border: "1px solid rgba(20,16,40,0.09)", borderRadius: 18, padding: "24px 22px", background: "#faf9fc" }}>
              <span style={{ display: "inline-flex", width: 42, height: 42, borderRadius: 11, alignItems: "center", justifyContent: "center", background: bg, color }}>
                <Icon size={21} strokeWidth={2.1} />
              </span>
              <h3 style={{ margin: "15px 0 0", fontSize: 16.5, fontWeight: 700, letterSpacing: "-0.01em", color: "#1b1626" }}>{title}</h3>
              <p style={{ margin: "7px 0 0", fontSize: 13.5, lineHeight: 1.5, color: "#615b70" }}>{body}</p>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 40, textAlign: "center" }}>
          <span
            onClick={openDemo}
            style={{
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              color: "#6d3bff",
              fontSize: 15,
              fontWeight: 600,
            }}
          >
            See it all on a call <ArrowRight size={16} />
          </span>
        </div>
      </SectionShell>

      <FooterCTA />
      <SiteFooter />
    </div>
  );
}
