import React from "react";

const STATS = [
  { value: "$1M+", label: "extra revenue in year one" },
  { value: "39x", label: "return on investment" },
  { value: "2.5x", label: "more likely to buy" },
];

export default function CaseStudyFlagship() {
  return (
    <div style={{ position: "relative", isolation: "isolate", overflow: "hidden", background: "#3d2f96", color: "#fff", padding: "clamp(56px,6vw,76px) clamp(24px,5vw,80px)" }}>
      <div aria-hidden="true" style={{ pointerEvents: "none", position: "absolute", inset: 0, zIndex: -1 }}>
        <div style={{ position: "absolute", left: "-10%", top: "-30%", height: 560, width: 560, borderRadius: "50%", filter: "blur(64px)", background: "radial-gradient(closest-side,#6d5ce0,transparent)" }} />
        <div style={{ position: "absolute", right: "-8%", bottom: "-35%", height: 540, width: 540, borderRadius: "50%", filter: "blur(64px)", background: "radial-gradient(closest-side,#e8935e,transparent)", opacity: 0.6 }} />
        <div style={{ position: "absolute", left: "35%", bottom: "-20%", height: 420, width: 520, borderRadius: "50%", filter: "blur(64px)", background: "radial-gradient(closest-side,#8b7cf0,transparent)", opacity: 0.7 }} />
      </div>
      <div style={{ margin: "0 auto", maxWidth: "64rem", padding: "0 1.5rem" }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
          <span style={{ fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", color: "rgba(255,255,255,0.5)" }}>Customer story</span>
          <img src="/media/logos/lucchese.svg" alt="Lucchese" style={{ height: 26, width: "auto", filter: "brightness(0) invert(1)", opacity: 0.9 }} />
        </div>
        <div className="nb-cs-grid" style={{ marginTop: "1.75rem", display: "grid", gridTemplateColumns: "repeat(3,minmax(0,1fr))", gap: "2.5rem" }}>
          <div className="nb-cs-quote" style={{ gridColumn: "span 2 / span 2", minWidth: 0 }}>
            <p style={{ margin: "1rem 0 0", fontSize: "clamp(1.125rem,1.9vw,1.375rem)", fontWeight: 500, lineHeight: 1.45, letterSpacing: "-0.02em", color: "#fff" }}>
              &ldquo;If you want to learn and be inspired, you should implement a tool like Nobi. We've seen great
              incremental results, but the biggest reason a brand should implement this is that you have the
              opportunity to apply more information towards optimizing campaigns and your broader brand and e-comm
              goals.&rdquo;
            </p>
            <div style={{ marginTop: "1.5rem", display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <img
                src="https://www.nobi.ai/media/lourdes.png"
                alt=""
                style={{ height: "2.5rem", width: "2.5rem", borderRadius: "50%", background: "rgba(255,255,255,0.1)", objectFit: "cover" }}
              />
              <div>
                <div style={{ fontSize: "0.875rem", fontWeight: 600, color: "#fff" }}>Lourdes Servin</div>
                <div style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.6)" }}>Sr. Director, Digital and E-Commerce</div>
              </div>
            </div>
          </div>
          <div className="nb-cs-stats" style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
            {STATS.map((s, i) => (
              <div
                key={s.value}
                style={{
                  display: "flex",
                  alignItems: "baseline",
                  gap: "0.75rem",
                  padding: "1rem 0",
                  borderBottom: i < STATS.length - 1 ? "1px solid rgba(255,255,255,0.1)" : "none",
                }}
              >
                <div style={{ width: "6rem", flexShrink: 0, fontSize: "2.25rem", fontWeight: 600, letterSpacing: "-0.02em", color: "#fff", fontVariantNumeric: "tabular-nums" }}>
                  {s.value}
                </div>
                <div style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.6)" }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
