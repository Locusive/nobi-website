import React from "react";
import { useDemoForm } from "../../context/DemoFormContext";
import { trackDemoFormOpened } from "../../utils/eventTracker";
import { getSignupUrl } from "../../utils/signupUrl";

const PRODUCTS = [
  { img: "/media/prod-1.webp", name: "Crochet maxi dress", price: "$168", accent: true },
  { img: "/media/prod-2.webp", name: "Open-knit cover-up", price: "$132", accent: false },
  { img: "/media/prod-3.webp", name: "Knit midi dress", price: "$154", accent: false },
];

export default function FooterCTA() {
  const { onOpen } = useDemoForm();
  const openDemo = () => {
    trackDemoFormOpened();
    onOpen();
  };

  return (
    <section
      style={{
        position: "relative",
        overflow: "hidden",
        borderTop: "1px solid rgba(0,0,0,0.05)",
        background: "linear-gradient(180deg,#ffffff 0%,#fff7ff 55%,#f8fafc 100%)",
      }}
    >
      <div aria-hidden="true" style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 1, background: "linear-gradient(to right,transparent,#f0abfc,transparent)" }} />
      <div style={{ maxWidth: 1120, margin: "0 auto", padding: "clamp(72px,9vw,110px) 24px" }}>
        <div className="nb-feat-row" style={{ display: "flex", alignItems: "center", gap: "clamp(32px,5vw,72px)" }}>
          <div style={{ flex: "1 1 400px", minWidth: 280, display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.22em", color: "#c026d3" }}>Ready when you are</div>
            <h2 style={{ margin: "16px 0 0", maxWidth: "16ch", fontSize: "clamp(34px,4.4vw,54px)", fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 1.03, color: "#020617" }}>
              Turn searches into sales.
            </h2>
            <p style={{ margin: "20px 0 0", maxWidth: "34ch", fontSize: "clamp(16px,1.3vw,19px)", lineHeight: 1.6, color: "#475569" }}>
              Give your visitors search that understands them, and watch more of them convert.
            </p>
            <div style={{ marginTop: 32, display: "flex", gap: 12, flexWrap: "wrap" }}>
              <a
                href={getSignupUrl()}
                style={{ display: "inline-flex", height: 50, alignItems: "center", gap: 8, background: "#6d3bff", color: "#fff", borderRadius: 16, padding: "0 28px", fontSize: 16, fontWeight: 600, textDecoration: "none" }}
              >
                Start Free <span>&rarr;</span>
              </a>
              <span
                onClick={openDemo}
                style={{ cursor: "pointer", display: "inline-flex", height: 50, alignItems: "center", background: "#fff", color: "#020617", border: "1px solid #e2e8f0", borderRadius: 16, padding: "0 28px", fontSize: 16, fontWeight: 600, textDecoration: "none" }}
              >
                Book A Demo
              </span>
            </div>
            <div style={{ marginTop: 18, fontSize: 13.5, color: "#94a3b8" }}>100 free messages monthly &middot; No credit card</div>
          </div>
          <div className="nb-feat-demo" style={{ flex: "0 1 460px", minWidth: 300 }}>
            <div style={{ borderRadius: 24, border: "1px solid #efe2f7", background: "#fff", boxShadow: "0 34px 80px -46px rgba(76,40,130,0.5)", overflow: "hidden" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 11, padding: "16px 18px", borderBottom: "1px solid #f1eaf7" }}>
                <span style={{ fontSize: 14.5, color: "#1b1626" }}>crochet dress for a beach vacation</span>
                <span
                  style={{
                    marginLeft: "auto",
                    flex: "none",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    background: "linear-gradient(90deg,#d946ef,#ec4899)",
                    color: "#fff",
                    borderRadius: 999,
                    padding: "7px 13px",
                    fontSize: 12.5,
                    fontWeight: 600,
                  }}
                >
                  Ask AI
                </span>
              </div>
              <div style={{ padding: 16, display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10 }}>
                {PRODUCTS.map((p) => (
                  <div
                    key={p.name}
                    style={{
                      borderRadius: 14,
                      border: p.accent ? "1px solid #f0abfc" : "1px solid #e2e8f0",
                      background: "#fff",
                      padding: 6,
                      boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
                    }}
                  >
                    <div style={{ aspectRatio: "3/4", overflow: "hidden", borderRadius: 10, background: "#f1f5f9" }}>
                      <img src={p.img} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top" }} />
                    </div>
                    <div style={{ padding: "8px 4px 2px" }}>
                      <div style={{ fontSize: 12, fontWeight: 600, color: "#0f172a" }}>{p.name}</div>
                      <div style={{ fontSize: 12, color: "#64748b" }}>{p.price}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
