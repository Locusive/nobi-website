import React, { useEffect } from "react";
import { motion } from "framer-motion";
import PageLayout from "../../components/PageLayout";
import { getSignupUrl } from "../../utils/signupUrl";
import { useDemoForm } from "../../context/DemoFormContext";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" } },
};

const GRADIENT = "bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500 bg-clip-text text-transparent";

function Quote({ text, name, title }) {
  return (
    <blockquote className="border-l-4 border-violet-300 pl-6 space-y-3">
      <p className="text-lg text-slate-700 leading-relaxed italic">"{text}"</p>
      <footer className="flex items-center gap-3">
        <img src="/media/lourdes.png" alt={name} className="h-8 w-8 rounded-full object-cover border border-slate-200" />
        <div>
          <div className="text-sm font-semibold text-slate-900">{name}</div>
          <div className="text-xs text-slate-500">{title}</div>
        </div>
      </footer>
    </blockquote>
  );
}

export default function LuccheseCustomer() {
  const { onOpen } = useDemoForm();

  useEffect(() => {
    document.title = "Lucchese + Nobi | Customer Story";
  }, []);

  return (
    <PageLayout>
      <div className="bg-gradient-to-b from-white via-white to-slate-50 text-black min-h-screen">

        {/* Hero */}
        <section className="relative overflow-hidden">
          <div className="absolute -left-32 -top-24 w-80 h-80 bg-purple-200/50 blur-3xl" aria-hidden />
          <div className="absolute right-[-120px] top-16 w-96 h-96 bg-blue-200/50 blur-3xl" aria-hidden />
          <div className="relative mx-auto max-w-4xl px-6 pb-16 pt-16 sm:pt-20 lg:pt-24">
            <div className="space-y-8">
              <div className="flex items-center gap-4">
                <img src="/media/logos/lucchese.svg" alt="Lucchese" className="h-7 w-auto" />
              </div>
              <div className="space-y-4">
                <p className="text-sm font-semibold tracking-[0.2em] text-fuchsia-600 uppercase">Customer story</p>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold leading-[1.05] text-slate-900 text-balance">
                  How Lucchese{" "}
                  <span className={GRADIENT}>"Made it Smart"</span>{" "}
                  and got a 33x ROI
                </h1>
                <p className="text-lg text-slate-600 max-w-2xl leading-relaxed">
                  Lucchese's leading indicators were moving in the right direction going into 2025. Traffic was up, load times were better. But conversions were down, and they suspected search was the problem.
                </p>
              </div>

              {/* Stats row */}
              <div className="grid sm:grid-cols-3 gap-4 max-w-2xl">
                {[
                  { value: "21%", label: "Conversion lift", note: "vs. Shopify default in A/B test" },
                  { value: "$1M+", label: "Incremental revenue", note: "in year one" },
                  { value: "33x", label: "ROI", note: "on Nobi subscription" },
                ].map((s) => (
                  <div key={s.value} className="rounded-2xl border border-slate-200 bg-white px-5 py-5 shadow-[0_8px_24px_-16px_rgba(15,23,42,0.15)]">
                    <div className="text-3xl font-bold text-slate-900">{s.value}</div>
                    <div className="text-sm font-semibold text-slate-700 mt-1">{s.label}</div>
                    <div className="text-xs text-slate-400 mt-0.5">{s.note}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Narrative intro */}
        <section className="bg-white border-t border-slate-100 py-16">
          <div className="mx-auto max-w-4xl px-6">
            <div className="grid md:grid-cols-[2fr_1fr] gap-12 lg:gap-20">
              <div className="space-y-6">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-400">The story</p>
                <div className="space-y-4 text-base text-slate-600 leading-relaxed">
                  <p>
                    Founded in 1883 by Italian immigrant Salvatore "Sam" Lucchese, Lucchese Bootmaker is one of America's most storied western boot brands. Each pair is handcrafted in El Paso using century-old techniques, taking more than 200 steps to complete.
                  </p>
                  <p>
                    Entering 2025 with a "Make it Smart" mandate, Lucchese's goal was to elevate the shopping experience at every point on their site. The leading indicators looked good: more traffic, faster load times. But conversion rates were going the other way. They suspected search was the culprit. Keyword-based search required constant product copy maintenance and still missed what shoppers actually meant.
                  </p>
                  <p>
                    They turned to Nobi to see whether AI search could improve result accuracy and move the needle on conversions.
                  </p>
                </div>
                <Quote
                  text="We want to do more for our customer while leveraging tech. We run a very lean team so we're always looking for partners that have the tech to fill in gaps, especially with things like search where we knew there was a lot of low-hanging fruit."
                  name="Lourdes Servin"
                  title="Sr. Director, Digital and E-Commerce, Lucchese Bootmaker"
                />
              </div>
              <div className="relative rounded-2xl overflow-hidden aspect-[3/4]">
                <img
                  src="/media/lucchese-testimonial-image.png"
                  alt="Lucchese boots"
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Three capability examples */}
        <section className="bg-slate-50 border-t border-slate-100 py-20">
          <div className="mx-auto max-w-5xl px-6 space-y-24">
            <div className="space-y-3">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-fuchsia-600">What changed</p>
              <h2 className="text-3xl sm:text-4xl font-semibold text-slate-900">Three things that moved the needle</h2>
            </div>

            {/* 01 — Always show results */}
            <motion.div
              variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }}
              className="space-y-8 pb-20 border-b border-slate-200"
            >
              <div className="space-y-4 max-w-2xl">
                <div className="text-5xl font-bold text-slate-200 leading-none">01</div>
                <h3 className="text-2xl font-semibold text-slate-900">Always show results</h3>
                <p className="text-base text-slate-600 leading-relaxed">
                  Keyword search returns nothing when a query doesn't exactly match product copy. Nobi always surfaces the closest relevant products instead. When a shopper searched "Terlingua" (a West Texas town), Shopify returned zero results. Nobi used its knowledge base to figure out what the shopper was going for and returned the Walter boot and others with a matching look and feel. The shopper added to cart.
                </p>
              </div>

              {/* Before / After screenshots */}
              <div className="grid sm:grid-cols-2 gap-5 select-none">
                <div className="rounded-2xl border border-red-100 bg-white shadow-[0_18px_46px_-24px_rgba(15,23,42,0.18)] overflow-hidden">
                  <div className="bg-red-50 border-b border-red-100 px-5 py-3 flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-red-400 shrink-0" />
                    <span className="text-sm font-semibold text-red-700">Shopify keyword search</span>
                  </div>
                  <div className="p-4">
                    <div className="rounded-xl border border-slate-200 bg-slate-50 overflow-hidden">
                      <img
                        src="https://storage.googleapis.com/nobi-public/docs_and_marketing_websites/features/better-search/terlingua-no-results.png"
                        alt="Shopify showing zero results for 'terlingua'"
                        className="w-full h-auto"
                        loading="lazy"
                      />
                    </div>
                    <p className="mt-3 text-sm text-slate-500 text-center">
                      "terlingua" <span className="mx-1 text-slate-300">→</span> <span className="font-semibold text-red-600">0 results. Sale lost.</span>
                    </p>
                  </div>
                </div>
                <div className="rounded-2xl border border-emerald-100 bg-white shadow-[0_18px_46px_-24px_rgba(15,23,42,0.18)] overflow-hidden">
                  <div className="bg-emerald-50 border-b border-emerald-100 px-5 py-3 flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 shrink-0" />
                    <span className="text-sm font-semibold text-emerald-700">Nobi semantic search</span>
                  </div>
                  <div className="p-4">
                    <div className="rounded-xl border border-slate-200 bg-slate-50 overflow-hidden">
                      <img
                        src="https://storage.googleapis.com/nobi-public/docs_and_marketing_websites/features/better-search/terlingua-nobi.png"
                        alt="Nobi showing relevant boots for 'terlingua'"
                        className="w-full h-auto"
                        loading="lazy"
                      />
                    </div>
                    <p className="mt-3 text-sm text-slate-500 text-center">
                      "terlingua" <span className="mx-1 text-slate-300">→</span> <span className="font-semibold text-emerald-600">relevant boots surfaced. Sale saved.</span>
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* 02 — Better rankings */}
            <motion.div
              variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }}
              className="space-y-8 pb-20 border-b border-slate-200"
            >
              <div className="space-y-4 max-w-2xl">
                <div className="text-5xl font-bold text-slate-200 leading-none">02</div>
                <h3 className="text-2xl font-semibold text-slate-900">Better rankings with RAG</h3>
                <p className="text-base text-slate-600 leading-relaxed">
                  Standard search ranks by keyword frequency, not relevance. Nobi uses Retrieval Augmented Generation to rank by what the shopper actually wants. For "Olive," Shopify buried the Dante Olive Chocolate boot past 16 results, past a "Load More." Nobi moved it to position 2. The shopper bought it.
                </p>
              </div>

              {/* Before / After ranking lists */}
              <div className="grid sm:grid-cols-2 gap-5 select-none">
                {/* Before */}
                <div className="rounded-2xl border border-red-100 bg-white shadow-[0_18px_46px_-24px_rgba(15,23,42,0.18)] overflow-hidden">
                  <div className="bg-red-50 border-b border-red-100 px-5 py-3 flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-red-400 shrink-0" />
                    <span className="text-sm font-semibold text-red-700">Shopify keyword search</span>
                  </div>
                  <div className="p-4 space-y-2">
                    {/* Search bar */}
                    <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 mb-3">
                      <svg className="w-3.5 h-3.5 text-slate-400 shrink-0" fill="none" viewBox="0 0 16 16"><circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.5"/><path d="M10 10l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
                      <span className="text-xs text-slate-500 font-mono">Olive</span>
                    </div>
                    {/* Results — generic boots, Dante Olive not in sight */}
                    {[
                      { pos: 1, name: "Chukka Boot", sub: "Everyday Collection" },
                      { pos: 2, name: "Classic Western", sub: "Heritage Series" },
                      { pos: 3, name: "El Paso Roper", sub: "Work & Outdoor" },
                      { pos: 4, name: "Lone Star Toe", sub: "Western Collection" },
                    ].map((item) => (
                      <div key={item.pos} className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-slate-50">
                        <span className="text-xs font-mono text-slate-400 w-4 shrink-0">{item.pos}</span>
                        <div className="w-8 h-10 rounded-lg bg-gradient-to-br from-slate-200 to-slate-300 shrink-0" />
                        <div className="flex-1 min-w-0 space-y-1.5">
                          <div className="text-xs font-medium text-slate-600 truncate">{item.name}</div>
                          <div className="h-1.5 bg-slate-200 rounded-full w-2/3" />
                        </div>
                      </div>
                    ))}
                    <div className="mt-1 rounded-lg bg-red-50 border border-red-100 px-3 py-2 text-xs text-red-600 text-center font-medium">
                      Dante Olive Chocolate not visible until position 17
                    </div>
                  </div>
                </div>

                {/* After */}
                <div className="rounded-2xl border border-emerald-100 bg-white shadow-[0_18px_46px_-24px_rgba(15,23,42,0.18)] overflow-hidden">
                  <div className="bg-emerald-50 border-b border-emerald-100 px-5 py-3 flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 shrink-0" />
                    <span className="text-sm font-semibold text-emerald-700">Nobi semantic search</span>
                  </div>
                  <div className="p-4 space-y-2">
                    {/* Search bar */}
                    <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 mb-3">
                      <svg className="w-3.5 h-3.5 text-slate-400 shrink-0" fill="none" viewBox="0 0 16 16"><circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.5"/><path d="M10 10l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
                      <span className="text-xs text-slate-500 font-mono">Olive</span>
                    </div>
                    {/* Results — Dante Olive at #2 */}
                    <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-slate-50">
                      <span className="text-xs font-mono text-slate-400 w-4 shrink-0">1</span>
                      <div className="w-8 h-10 rounded-lg bg-gradient-to-br from-slate-200 to-slate-300 shrink-0" />
                      <div className="flex-1 min-w-0 space-y-1.5">
                        <div className="h-2 bg-slate-200 rounded-full w-3/4" />
                        <div className="h-1.5 bg-slate-100 rounded-full w-1/2" />
                      </div>
                    </div>
                    {/* Position 2 — highlighted */}
                    <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-emerald-50 ring-2 ring-emerald-200">
                      <span className="text-xs font-mono font-bold text-emerald-600 w-4 shrink-0">2</span>
                      <div className="w-8 h-10 rounded-lg bg-gradient-to-br from-green-300 to-emerald-500 shrink-0" />
                      <div className="flex-1 min-w-0 space-y-1">
                        <div className="text-xs font-semibold text-emerald-900">Dante Olive Chocolate</div>
                        <div className="text-[11px] text-emerald-600">Western Collection</div>
                      </div>
                      <span className="text-[10px] font-bold text-emerald-600 bg-emerald-100 px-2 py-1 rounded-full shrink-0">Purchased</span>
                    </div>
                    {[3, 4].map((pos) => (
                      <div key={pos} className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-slate-50">
                        <span className="text-xs font-mono text-slate-400 w-4 shrink-0">{pos}</span>
                        <div className="w-8 h-10 rounded-lg bg-gradient-to-br from-slate-200 to-slate-300 shrink-0" />
                        <div className="flex-1 min-w-0 space-y-1.5">
                          <div className="h-2 bg-slate-200 rounded-full w-2/3" />
                          <div className="h-1.5 bg-slate-100 rounded-full w-1/3" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* 03 — Semantic search */}
            <motion.div
              variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }}
              className="space-y-8"
            >
              <div className="space-y-4 max-w-2xl">
                <div className="text-5xl font-bold text-slate-200 leading-none">03</div>
                <h3 className="text-2xl font-semibold text-slate-900">Semantic search</h3>
                <p className="text-base text-slate-600 leading-relaxed">
                  Shoppers don't always use the same words you used to describe your products. A search for "card holder" on Shopify only returned tote bags that happened to have card slots, missing Lucchese's entire wallet and card case collection. Nobi understood what the shopper meant and surfaced wallets, card cases, and bifold options. The shopper bought a wallet in Ostrich Cognac.
                </p>
              </div>

              {/* Before / After product grids */}
              <div className="grid sm:grid-cols-2 gap-5 select-none">
                {/* Before */}
                <div className="rounded-2xl border border-red-100 bg-white shadow-[0_18px_46px_-24px_rgba(15,23,42,0.18)] overflow-hidden">
                  <div className="bg-red-50 border-b border-red-100 px-5 py-3 flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-red-400 shrink-0" />
                    <span className="text-sm font-semibold text-red-700">Shopify keyword search</span>
                  </div>
                  <div className="p-4 space-y-3">
                    <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
                      <svg className="w-3.5 h-3.5 text-slate-400 shrink-0" fill="none" viewBox="0 0 16 16"><circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.5"/><path d="M10 10l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
                      <span className="text-xs text-slate-500 font-mono">card holder</span>
                    </div>
                    {/* Only 2 wrong results — tote bags */}
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { name: "Canvas Tote", sub: "Has inner card slots", color: "from-stone-200 to-stone-300" },
                        { name: "Market Tote", sub: "Card pocket inside", color: "from-pink-100 to-rose-200" },
                      ].map((item) => (
                        <div key={item.name} className="space-y-2">
                          <div className={`aspect-[3/4] rounded-xl bg-gradient-to-br ${item.color} flex flex-col items-center justify-center gap-2 p-3`}>
                            {/* Tote bag shape */}
                            <div className="w-10 h-2 rounded-full bg-black/10 mx-auto" />
                            <div className="w-12 h-14 rounded-lg bg-white/50 border border-black/10" />
                          </div>
                          <div className="text-xs text-center font-medium text-slate-700">{item.name}</div>
                          <div className="text-[11px] text-center text-slate-400">{item.sub}</div>
                        </div>
                      ))}
                    </div>
                    <div className="rounded-lg bg-red-50 border border-red-100 px-3 py-2 text-xs text-red-600 text-center font-medium">
                      Wallet collection: not shown
                    </div>
                  </div>
                </div>

                {/* After */}
                <div className="rounded-2xl border border-emerald-100 bg-white shadow-[0_18px_46px_-24px_rgba(15,23,42,0.18)] overflow-hidden">
                  <div className="bg-emerald-50 border-b border-emerald-100 px-5 py-3 flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 shrink-0" />
                    <span className="text-sm font-semibold text-emerald-700">Nobi semantic search</span>
                  </div>
                  <div className="p-4 space-y-3">
                    <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
                      <svg className="w-3.5 h-3.5 text-slate-400 shrink-0" fill="none" viewBox="0 0 16 16"><circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.5"/><path d="M10 10l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
                      <span className="text-xs text-slate-500 font-mono">card holder</span>
                    </div>
                    {/* 6 correct results — wallets, card cases, bifolds */}
                    <div className="grid grid-cols-3 gap-2.5">
                      {[
                        { name: "Wallet", color: "from-amber-300 to-amber-500" },
                        { name: "Card Case", color: "from-stone-400 to-stone-600" },
                        { name: "Bifold", color: "from-amber-700 to-amber-900" },
                        { name: "Money Clip", color: "from-zinc-300 to-zinc-500" },
                        { name: "Slim Wallet", color: "from-amber-200 to-amber-400" },
                        { name: "Zip Around", color: "from-stone-200 to-stone-400" },
                      ].map((item, i) => (
                        <div key={item.name} className={`space-y-1.5 ${i === 0 ? "ring-2 ring-emerald-300 rounded-xl" : ""}`}>
                          <div className={`aspect-[3/4] rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center`}>
                            {/* Card / wallet shape */}
                            <div className="w-8 h-6 rounded bg-white/25 border border-white/40 flex items-center justify-center">
                              <div className="w-5 h-1 bg-white/50 rounded-full" />
                            </div>
                          </div>
                          <div className="text-[10px] text-center font-medium text-slate-600 leading-tight">{item.name}</div>
                        </div>
                      ))}
                    </div>
                    <div className="rounded-lg bg-emerald-50 border border-emerald-100 px-3 py-2 flex items-center gap-2">
                      <span className="text-[10px] font-bold text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full shrink-0">Purchased</span>
                      <span className="text-xs text-emerald-700 font-medium">Ostrich Cognac wallet</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

          </div>
        </section>

        {/* Second quote */}
        <section className="bg-gradient-to-b from-[#17122f] to-[#1c1540] py-16">
          <div className="mx-auto max-w-4xl px-6">
            <div className="max-w-2xl mx-auto space-y-6">
              <blockquote className="text-lg text-white/90 leading-relaxed">
                "It's been really great to understand how people are typing and interacting with an agent, and understand how people are looking for our popular categories. It's also a treat to work with a partner who is just as excited to learn and dive deep."
              </blockquote>
              <div className="flex items-center gap-3">
                <img
                  src="/media/lourdes.png"
                  alt="Lourdes"
                  className="h-10 w-10 rounded-full object-cover border border-white/20"
                />
                <div>
                  <div className="text-sm font-semibold text-white">Lourdes Servin</div>
                  <div className="text-xs text-white/60">Sr. Director, Digital and E-Commerce, Lucchese Bootmaker</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Results */}
        <section className="bg-white py-16">
          <div className="mx-auto max-w-4xl px-6 space-y-8">
            <div className="space-y-3">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-fuchsia-600">The result</p>
              <h2 className="text-2xl font-semibold text-slate-900">What happened</h2>
            </div>
            <p className="text-base text-slate-600 leading-relaxed max-w-2xl">
              By year one, Lucchese had generated <strong>$1M+ in incremental revenue</strong> at a <strong>33x ROI</strong>. Across the purchase funnel, Nobi search drove <strong>+12% more add-to-carts</strong>, <strong>+22.9% better checkout completion</strong>, and a <strong>+10.6% lift in average order value</strong> — from $925 to $1,023.
            </p>

            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-8 space-y-4">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-400">Key takeaways</p>
              <ul className="space-y-3 text-base text-slate-600 leading-relaxed">
                <li className="flex gap-3">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-violet-400" />
                  Always showing results, even when a search query doesn't exactly match any product, can still drive sales. Shoppers who get relevant results stay on site.
                </li>
                <li className="flex gap-3">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-violet-400" />
                  Ranking by relevance (not keyword frequency) surfaces the right product at the right time, without requiring constant product copy maintenance.
                </li>
                <li className="flex gap-3">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-violet-400" />
                  Semantic search recovers sales that would otherwise walk out the door. Shoppers shouldn't have to use your language to find your products.
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Third quote + conclusion */}
        <section className="bg-slate-50 border-t border-slate-100 py-16">
          <div className="mx-auto max-w-4xl px-6 space-y-8">
            <div className="space-y-3">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-400">What's next</p>
              <p className="text-base text-slate-600 leading-relaxed max-w-2xl">
                After search, Lucchese kept going. The cart assistant launched in May 2025 and has since driven <strong>$108K in all-time revenue at an 8.5x ROI</strong>. The PDP assistant followed in August. Nobi has become a platform across Lucchese's shopping experience, not just a search layer.
              </p>
            </div>
            <Quote
              text="If you want to learn and be inspired, you should implement a tool like Nobi. We've seen great incremental results, but the biggest reason a brand should implement this is that you have the opportunity to apply more information towards optimizing campaigns and your broader brand and e-comm goals."
              name="Lourdes Servin"
              title="Sr. Director, Digital and E-Commerce, Lucchese Bootmaker"
            />
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="bg-gradient-to-b from-[#17122f] to-[#1c1540] text-white py-20">
          <div className="mx-auto max-w-4xl px-6">
            <div className="space-y-8 text-center max-w-2xl mx-auto">
              <div className="space-y-4">
                <h2 className="text-3xl sm:text-4xl font-semibold">See what Nobi can do for your brand</h2>
                <p className="text-lg text-white/70">Set up takes minutes. Results show up in weeks.</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href={getSignupUrl()}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl font-medium transition bg-white text-black hover:bg-white/90 shadow-sm h-12 px-6 text-base"
                >
                  Sign up free
                </a>
                <button
                  onClick={onOpen}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl font-medium transition border border-white/30 bg-white/10 text-white h-12 px-6 text-base hover:border-white/50"
                >
                  Get a demo
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </PageLayout>
  );
}
