import React from "react";
import {
  Search,
  LifeBuoy,
  Zap,
  UserPlus,
  Bot,
  SlidersHorizontal,
  BarChart3,
  Sparkles,
  Repeat,
  Tag,
  Wand2,
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
    <div
      id={id}
      style={{
        background: bg,
        padding: "84px clamp(24px,5vw,80px)",
        boxSizing: "border-box",
      }}
    >
      <div style={{ maxWidth: 1180, margin: "0 auto", width: "100%" }}>{children}</div>
    </div>
  );
}

// Text sits above, visual runs the full width beneath it — the visual is the
// dominant element on the section, not a card squeezed beside a paragraph.
function SectionRow({ text, visual }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "clamp(28px,4vw,44px)" }}>
      <div style={{ maxWidth: 640 }}>{text}</div>
      <div>{visual}</div>
    </div>
  );
}

// A real, stylized mockup of the product doing the specific thing the
// section describes — not an abstract icon. Full-width and generously
// sized so the visual carries the section, the way the pre-refactor
// capability pages' mockups did.
function DemoCard({ children }) {
  return (
    <div
      style={{
        width: "100%",
        background: "#ffffff",
        borderRadius: 24,
        boxShadow: "0 46px 100px -50px rgba(76,40,130,0.5)",
        border: "1px solid rgba(20,16,40,0.06)",
        overflow: "hidden",
      }}
    >
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
      "Everything Nobi does: AI-powered search and support, engagement triggered by visitor behavior, lead capture, merchandising and personalization, and an agent endpoint every AI can call.",
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
            Nobi is a single AI assistant that searches, answers, engages, and captures leads - grounded in your
            real content, live on your site in minutes.
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
                Relevant answers with semantic search.
              </h2>
              <p style={{ margin: "18px 0 0", fontSize: 17, lineHeight: 1.6, color: "#615b70", maxWidth: "42ch" }}>
                Shoppers ask anything - sizing, specs, return policy - in one box, and get a correct answer pulled
                from your real content.
              </p>
            </>
          }
          visual={
            <DemoCard>
              <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "22px 26px", borderBottom: "1px solid rgba(20,16,40,0.07)" }}>
                <Search size={22} color="#8a8498" strokeWidth={2.2} style={{ flex: "none" }} />
                <span style={{ flex: 1, fontSize: 19, color: "#1b1626" }}>does this run true to size?</span>
                <span style={{ flex: "none", display: "inline-flex", alignItems: "center", gap: 7, background: "linear-gradient(90deg,#d946ef,#ec4899)", color: "#fff", borderRadius: 999, padding: "9px 16px", fontSize: 14, fontWeight: 600 }}>
                  <Sparkles size={15} /> Ask AI
                </span>
              </div>
              <div style={{ padding: "26px 26px 30px" }}>
                <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
                  <span style={{ flex: "none", width: 40, height: 40, borderRadius: 11, background: "linear-gradient(135deg,#6d3bff,#d541b3)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <LifeBuoy size={20} color="#fff" />
                  </span>
                  <div style={{ flex: 1, fontSize: 18, lineHeight: 1.55, color: "#1b1626" }}>
                    This style runs about half a size small - most shoppers your height order one size up. Free
                    exchanges if it's not right.
                  </div>
                </div>
                <div style={{ marginTop: 16, marginLeft: 56, fontSize: 13, color: "#a49dba", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em" }}>
                  Cited from Sizing &amp; Fit Guide
                </div>
              </div>
            </DemoCard>
          }
        />
      </SectionShell>

      {/* 2. Proactive / Triggered Engagement */}
      <SectionShell bg="#f5f3fb">
        <SectionRow
          text={
            <>
              <Kicker>Proactive engagement</Kicker>
              <h2 style={{ margin: "16px 0 0", fontSize: "clamp(30px,3.6vw,44px)", fontWeight: 700, letterSpacing: "-0.03em", color: "#1b1626", lineHeight: 1.08 }}>
                Engage customers based on triggers.
              </h2>
              <p style={{ margin: "18px 0 0", fontSize: 17, lineHeight: 1.6, color: "#615b70", maxWidth: "42ch" }}>
                Set a trigger and Nobi reaches out on its own - no one has to lift a finger.
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
              <div style={{ padding: "26px 26px 8px" }}>
                <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "#a49dba" }}>
                  Trigger: Exit intent
                </div>
              </div>
              <div style={{ padding: "16px 26px 30px" }}>
                <div style={{ border: "1px solid rgba(20,16,40,0.08)", borderRadius: 18, padding: 22, background: "#faf8ff" }}>
                  <div style={{ display: "flex", gap: 15, alignItems: "flex-start" }}>
                    <span style={{ flex: "none", width: 40, height: 40, borderRadius: 11, background: "linear-gradient(135deg,#6d3bff,#d541b3)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Sparkles size={20} color="#fff" />
                    </span>
                    <div style={{ fontSize: 18, color: "#1b1626", lineHeight: 1.5 }}>
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
      <SectionShell bg="#ffffff">
        <SectionRow
          text={
            <>
              <Kicker>Lead capture</Kicker>
              <h2 style={{ margin: "16px 0 0", fontSize: "clamp(30px,3.6vw,44px)", fontWeight: 700, letterSpacing: "-0.03em", color: "#1b1626", lineHeight: 1.08 }}>
                Capture leads with a conversation.
              </h2>
              <p style={{ margin: "18px 0 0", fontSize: 17, lineHeight: 1.6, color: "#615b70", maxWidth: "42ch" }}>
                Built for automotive, services, B2B, and financial sites, where the win is a qualified contact,
                not a purchase. Nobi collects name and contact info mid-conversation and sends it straight to your
                team.
              </p>
            </>
          }
          visual={
            <DemoCard>
              <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "22px 26px", borderBottom: "1px solid rgba(20,16,40,0.07)" }}>
                <UserPlus size={21} color="#6d3bff" strokeWidth={2.1} style={{ flex: "none" }} />
                <span style={{ fontSize: 16, fontWeight: 600, color: "#1b1626" }}>New lead captured</span>
              </div>
              <div style={{ padding: 26 }}>
                <div style={{ fontSize: 17, color: "#615b70", lineHeight: 1.6 }}>
                  "I'd like to schedule a test drive this weekend if you have the 2026 model in stock."
                </div>
                <div style={{ marginTop: 18, paddingTop: 18, borderTop: "1px solid rgba(20,16,40,0.06)", display: "flex", justifyContent: "space-between", fontSize: 14, color: "#8a8498" }}>
                  <span>Name + phone captured</span>
                  <span style={{ color: "#0f8a54", fontWeight: 600 }}>Sent to CRM</span>
                </div>
              </div>
            </DemoCard>
          }
        />
      </SectionShell>

      {/* 5. Reach AI Agents / MCP */}
      <SectionShell bg="#f5f3fb">
        <SectionRow
          text={
            <>
              <Kicker>Reach AI agents</Kicker>
              <h2 style={{ margin: "16px 0 0", fontSize: "clamp(30px,3.6vw,44px)", fontWeight: 700, letterSpacing: "-0.03em", color: "#1b1626", lineHeight: 1.08 }}>
                Answer AI agents with an MCP endpoint.
              </h2>
              <p style={{ margin: "18px 0 0", fontSize: 17, lineHeight: 1.6, color: "#615b70", maxWidth: "42ch" }}>
                Every Nobi assistant is automatically also an MCP endpoint. Claude, ChatGPT, Gemini, and other AI
                agents can query it directly - no extra setup.
              </p>
            </>
          }
          visual={
            <DemoCard>
              <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "22px 26px", borderBottom: "1px solid rgba(20,16,40,0.07)" }}>
                <Bot size={21} color="#6d3bff" strokeWidth={2.1} style={{ flex: "none" }} />
                <span style={{ fontSize: 16, fontWeight: 600, color: "#1b1626" }}>MCP: ask_question</span>
              </div>
              <div style={{ padding: 26, fontFamily: "'SF Mono',ui-monospace,Menlo,monospace", fontSize: 15, lineHeight: 1.8, color: "#3a3646", background: "#faf8ff" }}>
                <div>agent → "does this brand ship to Canada?"</div>
                <div style={{ marginTop: 8, color: "#6d3bff" }}>nobi → grounded answer + citation</div>
              </div>
            </DemoCard>
          }
        />
      </SectionShell>

      {/* 6. Merchandising & Personalization */}
      <SectionShell bg="#ffffff">
        <SectionRow
          text={
            <>
              <Kicker>Merchandising &amp; personalization</Kicker>
              <h2 style={{ margin: "16px 0 0", fontSize: "clamp(30px,3.6vw,44px)", fontWeight: 700, letterSpacing: "-0.03em", color: "#1b1626", lineHeight: 1.08 }}>
                Control results with merchandising rules.
              </h2>
              <p style={{ margin: "18px 0 0", fontSize: 17, lineHeight: 1.6, color: "#615b70", maxWidth: "42ch" }}>
                Boost, bury, pin, or hide products in results with no code. Nobi also remembers what each visitor
                has browsed and bought, so results adapt automatically for returning visitors.
              </p>
            </>
          }
          visual={
            <DemoCard>
              <div style={{ display: "flex", alignItems: "center", gap: 11, padding: "22px 26px", borderBottom: "1px solid rgba(20,16,40,0.07)" }}>
                <SlidersHorizontal size={19} color="#0f8a54" strokeWidth={2.1} />
                <span style={{ fontSize: 16, fontWeight: 600, color: "#1b1626" }}>Results ordering</span>
                <span style={{ marginLeft: "auto", fontSize: 12.5, fontWeight: 700, color: "#0f8a54", background: "#ecfdf5", borderRadius: 999, padding: "5px 12px" }}>Live</span>
              </div>
              <div style={{ padding: 22, display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14 }}>
                <div style={{ position: "relative", border: "2px solid #6d3bff", borderRadius: 14, overflow: "hidden" }}>
                  <div style={{ aspectRatio: "1/1", background: "#f4eef2" }}>
                    <img src="/media/prod-1.webp" alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </div>
                  <span style={{ position: "absolute", top: 9, left: 9, fontSize: 11.5, fontWeight: 700, color: "#fff", background: "#6d3bff", borderRadius: 999, padding: "4px 10px" }}>Pinned</span>
                </div>
                <div style={{ border: "1px solid rgba(20,16,40,0.08)", borderRadius: 14, overflow: "hidden" }}>
                  <div style={{ aspectRatio: "1/1", background: "#f4eef2" }}>
                    <img src="/media/prod-2.webp" alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </div>
                </div>
                <div style={{ border: "1px solid rgba(20,16,40,0.08)", borderRadius: 14, overflow: "hidden" }}>
                  <div style={{ aspectRatio: "1/1", background: "#f4eef2" }}>
                    <img src="/media/prod-3.webp" alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </div>
                </div>
              </div>
            </DemoCard>
          }
        />
      </SectionShell>

      {/* Also included */}
      <SectionShell bg="#f5f3fb">
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
