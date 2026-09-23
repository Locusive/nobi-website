import React from "react";
import { TrendingUp } from "lucide-react";

import CustomerLogos from "./CustomerLogos";

export default function ProofBar() {
  return (
    <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", padding: "56px clamp(24px,5vw,80px)", background: "#ffffff" }}>
      <div style={{ maxWidth: 1120, margin: "0 auto", display: "flex", flexDirection: "column", alignItems: "center" }}>
        <CustomerLogos />
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
