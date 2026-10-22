import React from "react";
import { FeatH2, FeatP, Kicker, NOISE_BG } from "../home/featurePanelParts";
import { findProductSection } from "../../constants/productSections";

/**
 * One full-screen colored section of the Product page, drawn like the homepage feature panels:
 * a label, a large headline and a short paragraph on the left, and a sample screen on the right.
 *
 * sectionId names the entry in PRODUCT_SECTIONS that supplies the anchor and the label.
 * bg is the base color, and radial is the glow layered over it.
 */
export default function ProductSection({ sectionId, bg, radial, title, titleMaxCh, textColor, text, sample }) {
  const section = findProductSection(sectionId);

  return (
    <section
      id={section.id}
      className="nb-product-section"
      style={{ position: "relative", overflow: "hidden", display: "flex", alignItems: "center", background: bg }}
    >
      <div style={{ position: "absolute", inset: 0, opacity: 0.13, mixBlendMode: "soft-light", backgroundImage: NOISE_BG }} />
      <div style={{ position: "absolute", inset: 0, backgroundImage: radial }} />
      <div
        className="nb-feat-row"
        style={{
          position: "relative",
          zIndex: 2,
          width: "100%",
          maxWidth: 1220,
          margin: "0 auto",
          padding: "clamp(96px,10vw,140px) clamp(24px,5vw,72px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "clamp(32px,6vw,150px)",
          flexWrap: "wrap",
        }}
      >
        <div className="nb-feat-col" style={{ flex: "1 1 420px", minWidth: 300 }}>
          <Kicker>{section.name}</Kicker>
          <FeatH2 maxCh={titleMaxCh}>{title}</FeatH2>
          <FeatP color={textColor}>{text}</FeatP>
        </div>
        <div className="nb-feat-col" style={{ flex: "1 1 440px", minWidth: 300, display: "flex", justifyContent: "center" }}>
          {sample}
        </div>
      </div>
    </section>
  );
}
