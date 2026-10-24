import React from "react";
import { useParams } from "react-router-dom";
import { useSEO } from "../hooks/useSEO";
import "../components/home/homepage.css";
import Nav from "../components/home/Nav";
import FooterCTA from "../components/home/FooterCTA";
import SiteFooter from "../components/home/SiteFooter";
import FeatureHero from "../components/features/FeatureHero";
import { FeatureProof, HowItWorks, RelatedFeatures, WhyItHelps, WorksFor } from "../components/features/FeatureSections";
import { FEATURE_SAMPLES } from "../components/features/featureSamples";
import { PanelTheme } from "../components/features/panelThemes";
import { FEATURE_GROUPS, buildFeaturePath, findFeature } from "../content/features";
import { FEATURE_PAGES } from "../content/featurePages";
import NotFound from "./NotFound";

/** One feature's page: the opening panel, how it works, customer proof when there is some, and related features. */
export function FeaturePageContent({ slug }) {
  const feature = findFeature(slug);
  const page = FEATURE_PAGES[slug];
  const group = FEATURE_GROUPS.find((candidate) => candidate.id === feature.group);
  const Sample = FEATURE_SAMPLES[slug];

  useSEO({ title: page.seoTitle, description: page.seoDescription, path: buildFeaturePath(slug) });

  return (
    <div style={{ fontFamily: "'Schibsted Grotesk','Helvetica Neue',Helvetica,Arial,sans-serif", background: "#ffffff" }}>
      <Nav active="product" />
      <FeatureHero groupName={group.name} feature={feature} page={page} sample={<Sample shadow={PanelTheme[page.theme].shadow} />} />
      {page.benefits && <WhyItHelps heading="Why it matters" benefits={page.benefits} />}
      <HowItWorks steps={page.steps} />
      {page.worksFor && <WorksFor examples={page.worksFor} background="#ffffff" />}
      {page.proof && <FeatureProof proof={page.proof} />}
      <RelatedFeatures feature={feature} groupName={group.name} />
      <FooterCTA {...group.closing} />
      <SiteFooter />
    </div>
  );
}

/** The route for /product/:slug. An address with no feature behind it shows the not-found page. */
export default function FeaturePage() {
  const { slug } = useParams();
  return findFeature(slug) ? <FeaturePageContent slug={slug} /> : <NotFound />;
}
