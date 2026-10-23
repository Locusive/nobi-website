import React from "react";
import ScrollLink from "../home/ScrollLink";
import EnterpriseTag from "./EnterpriseTag";
import { FEATURE_SAMPLES } from "./featureSamples";
import { PanelTheme } from "./panelThemes";
import { buildFeaturePath, findFeature } from "../../content/features";
import { FEATURE_PAGES } from "../../content/featurePages";

// The sample screens are drawn at their full size, then scaled down to fit a card.
const SAMPLE_WIDTH = 480;
const SAMPLE_SCALE = 0.6;

/** A card's picture: the feature's sample screen, scaled down on the feature's panel color. */
function CardPicture({ slug }) {
  const Sample = FEATURE_SAMPLES[slug];
  const theme = PanelTheme[FEATURE_PAGES[slug].theme];

  return (
    <div aria-hidden="true" style={{ position: "relative", height: 230, overflow: "hidden", background: theme.bg, backgroundImage: theme.glow }}>
      <div style={{ position: "absolute", top: 26, left: "50%", width: SAMPLE_WIDTH, transform: `translateX(-50%) scale(${SAMPLE_SCALE})`, transformOrigin: "top center", pointerEvents: "none" }}>
        <Sample shadow={theme.shadow} />
      </div>
    </div>
  );
}

/** A card for one feature: a picture of it, its name, its tag when it is an enterprise feature, and what it does. */
export default function FeatureCard({ slug }) {
  const feature = findFeature(slug);

  return (
    <ScrollLink to={buildFeaturePath(slug)} className="nb-feature-tile" style={{ display: "flex", flexDirection: "column", overflow: "hidden", background: "#ffffff", border: "1px solid rgba(20,16,40,0.09)", borderRadius: 22, textDecoration: "none" }}>
      <CardPicture slug={slug} />
      <div style={{ display: "flex", flexDirection: "column", gap: 8, padding: "22px 24px 24px" }}>
        <span style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", fontSize: 20, fontWeight: 700, letterSpacing: "-0.02em", color: "#1b1626" }}>
          {feature.name}
          {feature.enterprise && <EnterpriseTag />}
        </span>
        <span style={{ fontSize: 15, lineHeight: 1.5, color: "#615b70" }}>{feature.menuLine}</span>
      </div>
    </ScrollLink>
  );
}
