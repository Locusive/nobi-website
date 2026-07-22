import React from "react";
import { Link } from "react-router-dom";

const STUDIES = [
  { to: "/customers/lucchese", logo: "/media/logos/lucchese.svg", alt: "Lucchese", height: 21, stat: "39x", label: "return on investment" },
  { to: "/customers/untuckit", logo: "/media/logos/untuckit.svg", alt: "UNTUCKit", height: 16, stat: "+17.1%", label: "conversion-rate lift" },
  { to: "/customers/kilte", logo: "/media/logos/kilte.webp", alt: "Kilte", height: 19, stat: "+21.7%", label: "conversion-rate lift" },
];

export default function CaseStudies() {
  return (
    <div style={{ background: "#ffffff", padding: "clamp(72px,9vw,104px) clamp(24px,5vw,80px)" }}>
      <div style={{ margin: "0 auto", maxWidth: 1120 }}>
        <div style={{ textAlign: "center" }}>
          <span style={{ fontSize: 11.5, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#a49dba" }}>Case studies</span>
          <h2 style={{ margin: "14px auto 0", fontSize: "clamp(28px,3.4vw,44px)", fontWeight: 800, letterSpacing: "-0.03em", color: "#1b1626", lineHeight: 1.05, maxWidth: "20ch" }}>
            Businesses are converting more with Nobi
          </h2>
        </div>
        <div className="nb-cs-more" style={{ marginTop: "clamp(36px,5vw,56px)", display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "clamp(16px,2vw,22px)" }}>
          {STUDIES.map((s) => (
            <Link
              key={s.to}
              to={s.to}
              style={{ display: "block", textDecoration: "none", border: "1px solid rgba(20,16,40,0.1)", borderRadius: 18, padding: "26px 26px 24px", background: "#faf8ff" }}
            >
              <img src={s.logo} alt={s.alt} style={{ height: s.height, width: "auto", opacity: 0.75 }} />
              <div style={{ marginTop: 16, fontSize: "2rem", fontWeight: 700, letterSpacing: "-0.02em", color: "#1b1626" }}>{s.stat}</div>
              <div style={{ marginTop: 2, fontSize: "0.9rem", color: "#615b70" }}>{s.label}</div>
              <div style={{ marginTop: 18, fontSize: "0.85rem", fontWeight: 600, color: "#6d3bff" }}>Read the story &rarr;</div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
