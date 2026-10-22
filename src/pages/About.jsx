import React from "react";
import PageLayout from "../components/PageLayout";
import { AboutSeo } from "../content/about";
import { useSEO } from "../hooks/useSEO";

/** Explains who operates Shop Nobi and what shoppers can expect from the service. */
export default function About() {
  useSEO(AboutSeo);

  return (
    <PageLayout>
      <article className="prose prose-lg mx-auto px-4 py-10 dark:prose-invert">
        <a href="/shop" className="text-sm">Back to Shop Nobi</a>
        <h1>About Shop Nobi</h1>
        <p>
          Shop Nobi is a free shopping search that helps you find products across
          online stores. Search for what you need, explore the results, and visit
          the store when you find something you like.
        </p>

        <h2>Who we are</h2>
        <p>
          Shop Nobi is operated by Locusive, Inc., doing business as Nobi. We also
          build <a href="/product">AI-powered site search and shopping assistants</a> for
          online stores.
        </p>

        <h2>How shopping works</h2>
        <p>
          Shop Nobi is a search engine, not the retailer. You buy directly from
          the store, which handles your order, payment, shipping and returns.
          Check the store for current prices, availability and purchase terms.
        </p>

        <h2>How we support Shop Nobi</h2>
        <p>
          Some store links are affiliate links. If you make a qualifying purchase
          after following a link, Nobi may earn a commission.
        </p>
        <p>
          Our <a href="/privacy">Privacy Policy</a> explains how we handle information
          when you use Shop Nobi. Our <a href="/terms">Terms of Service</a> explain
          the terms that apply to the service.
        </p>
      </article>
    </PageLayout>
  );
}
