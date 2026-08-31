import React from "react";
import { useSEO } from "../hooks/useSEO";
import PageLayout from "../components/PageLayout";

const CRAWLER_USER_AGENT = "NobiBot/1.0 (+https://nobi.ai/bot)";
const CRAWLER_IP_ADDRESS = "34.86.101.250";

const Bot = () => {
  useSEO({
    title: "NobiBot | Nobi",
    description:
      "What NobiBot is, which address it reads from, and how to allow or block it.",
    path: "/bot",
  });
  return (
    <PageLayout>
      <main className="prose prose-lg mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-4">NobiBot</h1>
        <p className="text-sm text-gray-500 mb-8">
          This page describes the crawler Nobi uses to read a store's product pages, so that a
          site owner can identify it and decide what to do about it.
        </p>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-2">What it does</h2>
          <p className="mb-4">
            Nobi powers search and a shopping assistant for online stores. To answer a shopper's
            question we need to know what the store sells, and most stores give us that through
            their commerce platform. Some do not, and for those we read the product pages on the
            store's own website instead.
          </p>
          <p className="mb-4">
            NobiBot only reads stores that have asked us to. It is not a general web crawler, it
            does not look for stores on its own, and it reads nothing beyond the pages a store has
            pointed us at, usually through a product sitemap they have given us.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-2">How to recognize it</h2>
          <p className="mb-4">Requests from NobiBot carry this user agent:</p>
          <pre className="bg-gray-100 p-3 rounded text-sm overflow-x-auto">{CRAWLER_USER_AGENT}</pre>
          <p className="mb-4">and come from a single address:</p>
          <pre className="bg-gray-100 p-3 rounded text-sm overflow-x-auto">{CRAWLER_IP_ADDRESS}</pre>
          <p className="mb-4">
            That address is fixed. If it ever changes we will update this page before the change
            takes effect.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-2">If you are a Nobi customer</h2>
          <p className="mb-4">
            Bot protection often refuses traffic from cloud providers by default, which means it
            can refuse us while your catalog is waiting to be read. If your catalog has stopped
            updating, this is the most common reason.
          </p>
          <p className="mb-4">
            On Cloudflare, add a WAF custom rule with the <strong>Skip</strong> action for{" "}
            {CRAWLER_IP_ADDRESS}. Adding the address to an allow list on its own is often not
            enough, because bot protection runs before allow lists do.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-2">If you would rather we did not</h2>
          <p className="mb-4">
            Block the address above, or disallow NobiBot in your robots.txt. We would rather you
            told us, though: if you are a customer, being blocked means your own catalog stops
            updating, and we would sooner fix that with you than have you wonder why your search
            results went stale.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-2">Contact</h2>
          <p className="mb-4">
            Questions about NobiBot, or anything it did that you did not expect, go to{" "}
            <a href="mailto:support@nobi.ai" className="text-blue-600 underline">
              support@nobi.ai
            </a>
            .
          </p>
        </section>
      </main>
    </PageLayout>
  );
};

export default Bot;
