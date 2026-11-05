import React, { useState } from "react";
import PageLayout from "../components/PageLayout.jsx";
import { useSEO } from "../hooks/useSEO.js";
import { GiftGuides, GiftGuidesSeo } from "../content/giftGuides.js";
import { GiftGuideTopics } from "../content/shopGiftGuideTopics.js";

/** Shopper-facing directory of original guides and current catalog edits. */
export default function GiftGuidesPage() {
  const [filter, setFilter] = useState("");
  const matching = GiftGuideTopics.filter((topic) => topic.title.toLowerCase().includes(filter.trim().toLowerCase()));
  const recipientGuides = matching.filter((topic) => !topic.slug.startsWith("best-"));
  const productGuides = matching.filter((topic) => topic.slug.startsWith("best-"));
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
          <section aria-label="Shop Nobi product gift guides" className="mt-12">
            <h2 className="text-2xl font-semibold">Explore {GiftGuideTopics.length} product guides</h2>
            <p className="mt-2 max-w-2xl text-black/70 dark:text-white/70">Find a person, activity or product category. Each guide has current Shop Nobi catalog options and buying checks to make the choice easier.</p>
            <label className="mt-6 block max-w-lg text-sm font-semibold" htmlFor="gift-guide-filter">Find a guide</label>
            <input id="gift-guide-filter" type="search" value={filter} onChange={(event) => setFilter(event.target.value)} placeholder="Try cook, hiking, boots or jewelry" className="mt-2 w-full max-w-lg rounded-xl border border-black/20 bg-white px-4 py-3 text-base text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-purple-600 dark:border-white/30" />
            {!matching.length && <p className="mt-5 text-black/70 dark:text-white/70">No guide matches that phrase. Try a broader interest or <a className="underline" href="/shop">search Shop Nobi</a> directly.</p>}
            {[{ title: "For a person or activity", guides: recipientGuides }, { title: "By product category", guides: productGuides }].filter((group) => group.guides.length).map((group) => <div className="mt-9" key={group.title}>
              <h3 className="border-b border-black/10 pb-3 text-lg font-semibold dark:border-white/20">{group.title} <span className="font-normal text-black/50 dark:text-white/50">({group.guides.length})</span></h3>
              <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {group.guides.map((topic) => <li key={topic.slug}><a className="block h-full rounded-xl border border-black/10 p-5 text-lg font-medium hover:border-purple-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-purple-600 dark:border-white/20" href={`/gift-guides/${topic.slug}`}>{topic.title} <span aria-hidden="true">↗</span></a></li>)}
              </ul>
            </div>)}
          </section>
          <section aria-labelledby="gift-examples-heading" className="mt-10 rounded-2xl border border-purple-200 p-6 dark:border-purple-900">
            <h2 id="gift-examples-heading" className="text-xl font-semibold">Prefer a few concrete starting points?</h2>
            <p className="mt-2 text-black/70 dark:text-white/70">The <a href="/tools/gift-chooser" className="underline underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-purple-600">gift chooser</a> has a small set of reviewed coffee, painting and charging examples you can narrow by budget and preferences.</p>
          </section>
          <p className="mt-6">Include the extras: <a href="/tools/gift-budget" className="underline underline-offset-4">calculate your gift budget after estimated fees</a>.</p>
          <p className="mt-8 max-w-3xl text-sm text-black/60 dark:text-white/70">Featured articles carry their own source dates; product picks are rebuilt from the Shop Nobi catalog. Confirm current product details, total cost, delivery and returns with the retailer. Some links may earn us a commission.</p>
        </div>
      </div>
    </PageLayout>
  );
}
