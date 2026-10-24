import React from "react";
import FeatureCard from "./FeatureCard";
import { listFeaturesInGroup } from "../../content/features";

/** One group on the All features page: a large heading, one line on the group, and a card for each of its features. */
export default function FeatureGroupSection({ group, background }) {
  return (
    <section id={group.id} style={{ background, padding: "clamp(88px,10vw,130px) clamp(24px,5vw,80px)" }}>
      <div style={{ maxWidth: 1120, margin: "0 auto" }}>
        <h2 style={{ margin: 0, fontSize: "clamp(44px,5.4vw,80px)", fontWeight: 700, letterSpacing: "-0.04em", lineHeight: 1, color: "#1b1626" }}>{group.name}</h2>
        <p style={{ margin: "18px 0 0", maxWidth: "46ch", fontSize: "clamp(17px,1.4vw,21px)", lineHeight: 1.5, color: "#615b70" }}>{group.summary}</p>
        <div className="nb-grid3" style={{ marginTop: "clamp(36px,4vw,52px)", display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16 }}>
          {listFeaturesInGroup(group.id).map((feature) => (
            <FeatureCard key={feature.slug} slug={feature.slug} />
          ))}
        </div>
      </div>
    </section>
  );
}
