import React from "react";
import { TrendingUp } from "lucide-react";

const LOGOS = [
  { src: "/media/logos/untuckit.svg", alt: "UNTUCKit", height: 23 },
  { src: "/media/logos/lucchese.svg", alt: "Lucchese", height: 31 },
  { src: "/media/logos/toolup.svg", alt: "TOOLUP", height: 22 },
  { src: "/media/logos/kilte.webp", alt: "Kilte", height: 27 },
];

export default function ProofBar() {
  return (
    <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", padding: "56px clamp(24px,5vw,80px)", background: "#ffffff" }}>
      <div style={{ maxWidth: 1120, margin: "0 auto", display: "flex", flexDirection: "column", alignItems: "center" }}>
        <span style={{ fontSize: 11.5, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#a49dba" }}>
          Trusted by modern teams
        </span>
        <div
          style={{
            marginTop: 24,
            width: "100%",
            maxWidth: 780,
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "center",
            gap: "clamp(60px,7vw,80px)",
          }}
        >
          {LOGOS.map((l) => (
            <img key={l.alt} src={l.src} alt={l.alt} style={{ height: l.height, width: "auto", filter: "grayscale(1)", opacity: 0.6 }} />
          ))}
        </div>
        <div
          style={{
            marginTop: 38,
            display: "inline-flex",
            alignItems: "center",
            gap: 9,
            background: "#ffffff",
            border: "1px solid rgba(109,59,255,0.2)",
            borderRadius: 999,
            padding: "11px 20px 11px 16px",
            boxShadow: "0 14px 34px -14px rgba(76,40,130,0.4)",
            whiteSpace: "nowrap",
          }}
        >
          <TrendingUp size={17} color="#6d3bff" strokeWidth={2.4} />
          <span style={{ color: "#57536a", fontSize: 14.5, fontWeight: 500 }}>
            On average,{" "}
            <span
              style={{
                fontWeight: 700,
                background: "linear-gradient(to right,#6d3bff,#d541b3)",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                color: "transparent",
              }}
            >
              21.7% more conversions
            </span>{" "}
            with Nobi
          </span>
        </div>
      </div>
    </div>
  );
}
