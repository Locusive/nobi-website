import React from "react";
import { useSEO } from "../hooks/useSEO";
import { CANONICAL_DESCRIPTION, LINKEDIN_URL } from "../constants/positioning";

import "../components/home/homepage.css";
import Nav from "../components/home/Nav";
import Hero from "../components/home/Hero";
import ProofBar from "../components/home/ProofBar";
import FeatureStack from "../components/home/FeatureStack";
import MoreFeatures from "../components/home/MoreFeatures";
import CaseStudyFlagship from "../components/home/CaseStudyFlagship";
import CaseStudies from "../components/home/CaseStudies";
import FooterCTA from "../components/home/FooterCTA";
import SiteFooter from "../components/home/SiteFooter";

export default function HomePage() {
  useSEO({
    title: "Nobi: Conversational Website Assistant for Search and Support",
    description: CANONICAL_DESCRIPTION,
    path: "/",
    schema: [
      {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "Nobi",
        "url": "https://nobi.ai",
        "logo": "https://nobi.ai/og-image.png",
        "sameAs": [LINKEDIN_URL],
      },
      {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": "Nobi",
        "url": "https://nobi.ai",
      },
      {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "Nobi",
        "applicationCategory": "BusinessApplication",
        "operatingSystem": "Web",
        "description": CANONICAL_DESCRIPTION,
        "url": "https://nobi.ai",
        "offers": { "@type": "Offer", "price": "25", "priceCurrency": "USD", "availability": "https://schema.org/InStock" },
      },
    ],
  });

  return (
    <div style={{ fontFamily: "'Schibsted Grotesk','Helvetica Neue',Helvetica,Arial,sans-serif" }}>
      <Nav />
      <Hero />
      <div style={{ position: "relative", zIndex: 6, background: "#ffffff", boxShadow: "0 -20px 46px -26px rgba(76,40,130,0.3)" }}>
        <ProofBar />
        <FeatureStack />
        <MoreFeatures />
        <CaseStudyFlagship />
        <CaseStudies />
        <FooterCTA />
        <SiteFooter />
      </div>
    </div>
  );
}
