import React from "react";
import { BarChart3, ShoppingCart, Sparkles } from "lucide-react";

const CARDS = [
  {
    icon: BarChart3,
    bg: "#efe8ff",
    color: "#6d3bff",
    title: "Insights & analytics",
    body: "See top searches, zero-result gaps, and which queries drive revenue, all in your dashboard.",
  },
  {
    icon: ShoppingCart,
    bg: "#ffe6f4",
    color: "#d541b3",
    title: "One-click add to cart",
    body: "Visitors add products to their cart right from search results, no extra taps to checkout.",
  },
  {
    icon: Sparkles,
    bg: "#e0f7ef",
    color: "#0f8a54",
    title: "Personalization",
    body: "Results adapt to each visitor's behavior, so the most relevant products rise to the top.",
  },
];

export default function MoreFeatures() {
  return (
    <div style={{ background: "#ffffff", padding: "clamp(56px,6vw,72px) clamp(24px,5vw,80px)", display: "flex", flexDirection: "column", justifyContent: "center" }}>
      <div style={{ maxWidth: 1120, margin: "0 auto", width: "100%" }}>
        <div style={{ textAlign: "center", maxWidth: "40ch", margin: "0 auto" }}>
          <span style={{ fontFamily: "'SF Mono',ui-monospace,Menlo,monospace", fontSize: 12.5, letterSpacing: "0.2em", textTransform: "uppercase", color: "#6d3bff", fontWeight: 600 }}>
            And more
          </span>
          <h2 style={{ margin: "14px 0 0", fontSize: "clamp(30px,3.6vw,46px)", fontWeight: 700, letterSpacing: "-0.03em", color: "#1b1626", lineHeight: 1.05 }}>
            Everything else you get
          </h2>
        </div>
        <div className="nb-grid3" style={{ marginTop: "clamp(40px,5vw,60px)", display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "clamp(18px,2.5vw,28px)" }}>
          {CARDS.map(({ icon: Icon, bg, color, title, body }) => (
            <div key={title} style={{ border: "1px solid rgba(20,16,40,0.09)", borderRadius: 20, padding: "28px 24px", background: "#faf9fc" }}>
              <span style={{ display: "inline-flex", width: 46, height: 46, borderRadius: 12, alignItems: "center", justifyContent: "center", background: bg, color }}>
                <Icon size={24} strokeWidth={2.1} />
              </span>
              <h3 style={{ margin: "18px 0 0", fontSize: 19, fontWeight: 700, letterSpacing: "-0.02em", color: "#1b1626" }}>{title}</h3>
              <p style={{ margin: "9px 0 0", fontSize: 14.5, lineHeight: 1.55, color: "#615b70" }}>{body}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
