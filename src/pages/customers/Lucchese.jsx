import React, { useEffect } from "react";
import PageLayout from "../../components/PageLayout";
import { getSignupUrl } from "../../utils/signupUrl";
import { useDemoForm } from "../../context/DemoFormContext";

const GRADIENT = "bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500 bg-clip-text text-transparent";

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
                <span className="text-sm text-slate-400">×</span>
                <span className="text-sm font-semibold text-slate-500">Nobi</span>
              </div>
              <div className="space-y-4">
                <p className="text-sm font-semibold tracking-[0.2em] text-fuchsia-600 uppercase">Customer story</p>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold leading-[1.05] text-slate-900 text-balance">
                  How Lucchese hit{" "}
                  <span className={GRADIENT}>33x ROI</span>{" "}
                  with AI search
                </h1>
                <p className="text-lg text-slate-600 max-w-2xl leading-relaxed">
                  Lucchese's traffic was up. Their load times were better. But conversions were down. They replaced keyword search with Nobi and generated $1M+ in incremental revenue in year one.
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

        {/* Company + challenge */}
        <section className="bg-white border-t border-slate-100 py-16">
          <div className="mx-auto max-w-4xl px-6">
            <div className="grid md:grid-cols-2 gap-10 lg:gap-16">
              <div className="space-y-4">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-400">About Lucchese</p>
                <p className="text-base text-slate-600 leading-relaxed">
                  Founded in 1883 by Italian immigrant Salvatore "Sam" Lucchese, Lucchese Bootmaker is one of America's most storied western boot brands. Each pair is handcrafted in El Paso using century-old techniques, taking more than 200 steps to complete.
                </p>
              </div>
              <div className="space-y-4">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-400">The challenge</p>
                <p className="text-base text-slate-600 leading-relaxed">
                  Entering 2025 with a "Make it Smart" mandate, Lucchese's leading indicators were moving in the right direction: more traffic, faster load times. But conversion rates were down. They suspected search was the culprit: keyword-based search required constant product copy maintenance and still missed what shoppers actually meant.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonial image + quote */}
        <section className="bg-gradient-to-b from-[#17122f] to-[#1c1540] py-16">
          <div className="mx-auto max-w-4xl px-6">
            <div className="grid md:grid-cols-2 gap-10 items-center">
              <div className="relative rounded-2xl overflow-hidden aspect-[4/3]">
                <img
                  src="/media/lucchese-testimonial-image.png"
                  alt="Lucchese boots"
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>
              <div className="space-y-6">
                <blockquote className="text-lg text-white leading-relaxed">
                  "If you want to learn and be inspired, you should implement a tool like Nobi. We've seen great incremental results, but the biggest reason a brand should implement this is that you have the opportunity to apply more information towards optimizing campaigns and your broader brand and e-comm goals."
                </blockquote>
                <div className="flex items-center gap-3">
                  <img
                    src="/media/lourdes.png"
                    alt="Lourdes"
                    className="h-10 w-10 rounded-full object-cover border border-white/20"
                  />
                  <div>
                    <div className="text-sm font-semibold text-white">Lourdes</div>
                    <div className="text-xs text-white/60">Sr. Director, Digital and E-Commerce, Lucchese Bootmaker</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* What Nobi changed */}
        <section className="bg-white py-20">
          <div className="mx-auto max-w-4xl px-6 space-y-12">
            <div className="space-y-3">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-fuchsia-600">How it worked</p>
              <h2 className="text-3xl sm:text-4xl font-semibold text-slate-900">Three things that moved the needle</h2>
            </div>

            {[
              {
                number: "01",
                title: "Always show results",
                body: "Keyword search returns nothing when a query doesn't exactly match product copy. Nobi always surfaces the closest relevant products instead. When a Lucchese shopper searched \"Terlingua\" (a West Texas town), Shopify returned zero results. Nobi returned the Walter boot and others that matched the vibe. The shopper added to cart.",
                before: { label: "Shopify default", text: "SEARCH: TERLINGUA\n0 results" },
                after: { label: "Nobi", text: "\"Terlingua\" → Walter boot\nShopper added to cart" },
              },
              {
                number: "02",
                title: "Better rankings with RAG",
                body: "Standard search ranks purely by keyword match frequency. Nobi uses Retrieval Augmented Generation to rank by actual relevance. For the query \"Olive,\" Shopify buried the Dante Olive Chocolate boot past 16 results, requiring shoppers to click \"Load More.\" Nobi surfaced it on row two. The shopper bought it.",
                before: { label: "Shopify default", text: "\"Olive\" → Dante Olive Chocolate\nnot in first 16 results" },
                after: { label: "Nobi", text: "\"Olive\" → Dante Olive Chocolate\non row 2, shopper purchased" },
              },
              {
                number: "03",
                title: "Semantic search",
                body: "Shoppers don't always use the same words you used to describe your products. A search for \"card holder\" on Shopify only returned tote bags that happened to have card slots, missing Lucchese's entire wallet and card case collection. Nobi understood what the shopper meant and surfaced wallets, card cases, and bifold options. The shopper bought a wallet in Ostrich Cognac.",
                before: { label: "Shopify default", text: "\"card holder\" → 2 tote bags\n(keyword match only)" },
                after: { label: "Nobi", text: "\"card holder\" → wallets,\ncard cases, bifolds → purchased" },
              },
            ].map((item) => (
              <div key={item.number} className="grid md:grid-cols-2 gap-8 items-start pb-10 border-b border-slate-100 last:border-0 last:pb-0">
                <div className="space-y-4">
                  <div className="text-4xl font-bold text-slate-200">{item.number}</div>
                  <h3 className="text-xl font-semibold text-slate-900">{item.title}</h3>
                  <p className="text-base text-slate-600 leading-relaxed">{item.body}</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-2">
                    <div className="flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-slate-300" />
                      <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">{item.before.label}</span>
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed whitespace-pre-line">{item.before.text}</p>
                  </div>
                  <div className="rounded-xl border border-violet-200 bg-violet-50 p-4 space-y-2">
                    <div className="flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-indigo-500 to-fuchsia-500" />
                      <span className="text-[11px] font-semibold text-violet-600 uppercase tracking-wide">{item.after.label}</span>
                    </div>
                    <p className="text-xs text-violet-800 leading-relaxed whitespace-pre-line">{item.after.text}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Results summary */}
        <section className="bg-gradient-to-b from-slate-50 to-white py-16">
          <div className="mx-auto max-w-4xl px-6 space-y-6">
            <h2 className="text-2xl font-semibold text-slate-900">The result</h2>
            <p className="text-base text-slate-600 leading-relaxed max-w-2xl">
              In the first two months after launch, Nobi drove a <strong>21% improvement in conversion rates</strong> compared to the standard Shopify experience in a direct A/B test. By year one, Lucchese had generated <strong>$1M+ in incremental revenue</strong>, a 74% improvement over the standard Shopify experience, at an <strong>ROI of 33x</strong>.
            </p>
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
