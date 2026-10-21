import React from "react";
import PageLayout from "../components/PageLayout.jsx";
import { useSEO } from "../hooks/useSEO.js";
import { GiftGuides, GiftGuidesSeo } from "../content/giftGuides.js";

/** A small shopper-facing directory of existing original guides, with no new product or availability claims. */
export default function GiftGuidesPage() {
  useSEO(GiftGuidesSeo);
  return (
    <PageLayout active="shop">
      <div className="bg-white text-black dark:bg-[#0a0a0a] dark:text-white">
        <div className="mx-auto max-w-6xl px-6 pb-16">
          <a href="/shop" className="text-sm underline underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-purple-600">← Back to Shop Nobi</a>
          <header className="max-w-3xl pb-10 pt-8">
            <p className="text-sm font-semibold uppercase tracking-widest text-purple-700 dark:text-purple-300">Gift guides</p>
            <h1 className="mt-4 text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">Start with the person,<br />not the present.</h1>
            <p className="mt-5 max-w-2xl text-lg text-black/70 dark:text-white/70">What do they enjoy? What would they rather skip? Pick the situation that sounds familiar, then work through the choices before buying.</p>
          </header>
          <section aria-label="Choose a gift guide" className="grid gap-5 lg:grid-cols-3">
            {GiftGuides.map((guide, index) => (
              <article key={guide.slug} className="flex flex-col rounded-2xl border border-black/10 bg-slate-50 p-6 dark:border-white/20 dark:bg-white/5">
                <p className="text-sm font-semibold text-purple-700 dark:text-purple-300">0{index + 1} / {guide.need}</p>
                <h2 className="mt-4 text-2xl font-semibold leading-snug"><a href={`/blog/${guide.slug}`} className="underline decoration-black/20 underline-offset-4 hover:decoration-purple-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-purple-600">{guide.title}</a></h2>
                <p className="mt-4 text-black/70 dark:text-white/70">{guide.summary}</p>
                <p className="mt-auto pt-6 text-sm"><strong>Ask first:</strong> {guide.question}</p>
              </article>
            ))}
          </section>
          <section aria-labelledby="gift-examples-heading" className="mt-10 rounded-2xl border border-purple-200 p-6 dark:border-purple-900">
            <h2 id="gift-examples-heading" className="text-xl font-semibold">Prefer a few concrete starting points?</h2>
            <p className="mt-2 text-black/70 dark:text-white/70">The <a href="/tools/gift-chooser" className="underline underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-purple-600">gift chooser</a> has a small set of reviewed coffee, painting and charging examples you can narrow by budget and preferences.</p>
          </section>
          <p className="mt-8 max-w-3xl text-sm text-black/60 dark:text-white/70">These guides use source information checked October 19, 2026. Confirm current product details, total cost, delivery and returns with the retailer. Some guides include affiliate links; we may earn a commission from qualifying purchases.</p>
        </div>
      </div>
    </PageLayout>
  );
}
