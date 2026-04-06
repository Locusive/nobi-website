import React, { useEffect } from "react";
import PageLayout from "../../components/PageLayout";
import { getSignupUrl } from "../../utils/signupUrl";
import { useDemoForm } from "../../context/DemoFormContext";

const GRADIENT = "bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500 bg-clip-text text-transparent";

// Images from docs.nobi.ai
const IMG_CHANNEL_REPORT = "https://imagedelivery.net/IEMzXmjRvW0g933AN5ejrA/assetsbulletsitefiles-31cc7ba9-c3dd-8066-9382-ebac6405dfcd-attachment8fea41c4-9871-405b-824f-fc16435fe6c8imagepng/public";
const IMG_INSIGHTS = "https://imagedelivery.net/IEMzXmjRvW0g933AN5ejrA/assetsbulletsitefiles-2e1c7ba9-c3dd-8052-aeca-e9137d03eb5c-attachmentc7117cb2-969a-462c-8bc7-fc5a4ca5047finsights-minpng/public";
const IMG_METRICS = "https://imagedelivery.net/IEMzXmjRvW0g933AN5ejrA/assetsbulletsitefiles-2e1c7ba9-c3dd-806a-84a9-d4740187b34c-attachment6d666b45-2b36-4c0b-b00e-3d2232bc3ef1metrics-minpng/public";

function StatCallout({ value, label }) {
  return (
    <span className="inline-flex flex-col items-center bg-violet-50 border border-violet-200 rounded-xl px-3 py-1.5 mx-1 align-middle">
      <span className="text-lg font-bold text-violet-700 leading-none">{value}</span>
      <span className="text-[10px] text-violet-500 font-medium leading-none mt-0.5">{label}</span>
    </span>
  );
}

export default function UNTUCKitCustomer() {
  const { onOpen } = useDemoForm();

  useEffect(() => {
    document.title = "UNTUCKit + Nobi | Customer Story";
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
                <img src="/media/logos/untuckit.svg" alt="UNTUCKit" className="h-5 w-auto" />
                <span className="text-sm text-slate-400">×</span>
                <span className="text-sm font-semibold text-slate-500">Nobi</span>
              </div>
              <div className="space-y-4">
                <p className="text-sm font-semibold tracking-[0.2em] text-fuchsia-600 uppercase">Customer story</p>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold leading-[1.05] text-slate-900 text-balance">
                  How UNTUCKit turned a{" "}
                  <span className={GRADIENT}>two-month pilot</span>{" "}
                  into a long-term partnership
                </h1>
                <p className="text-lg text-slate-600 max-w-2xl leading-relaxed">
                  UNTUCKit wanted more shoppers engaging with search. They ran a two-month A/B test, saw the numbers, dropped the split, and went all in.
                </p>
              </div>

              {/* Stats row */}
              <div className="grid sm:grid-cols-3 gap-4 max-w-2xl">
                {[
                  { value: "+17.1%", label: "Conversion rate", note: "17.6% Nobi vs. 15.0% Shopify default" },
                  { value: "+21.3%", label: "Revenue per searcher", note: "$39.17 vs. $32.30 on Shopify" },
                  { value: "+3.3%", label: "Average order value", note: "$222 vs. $215 on Shopify" },
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

        {/* About + Why they started */}
        <section className="bg-white border-t border-slate-100 py-16">
          <div className="mx-auto max-w-4xl px-6">
            <div className="grid md:grid-cols-2 gap-10 lg:gap-16">
              <div className="space-y-4">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-400">About UNTUCKit</p>
                <p className="text-base text-slate-600 leading-relaxed">
                  UNTUCKit is a men's and women's clothing brand known for shirts designed to be worn untucked. Built around a simple idea (that casual dress clothes should actually fit and look good), they've grown into a major direct-to-consumer brand with a strong online presence.
                </p>
              </div>
              <div className="space-y-4">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-400">Why they started</p>
                <p className="text-base text-slate-600 leading-relaxed">
                  UNTUCKit knew that shoppers who search convert at a much higher rate than those who don't — so getting more visitors to engage with search was a real business lever. One of the first things Nobi did was add an "Ask AI" button to their nav bar, giving shoppers a new way to engage with the site. Then they ran a two-month A/B test to see what the results actually looked like.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Three examples */}
        <section className="bg-gradient-to-b from-slate-50 to-white py-20">
          <div className="mx-auto max-w-4xl px-6 space-y-10">
            <div className="space-y-3">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-fuchsia-600">What the test found</p>
              <h2 className="text-3xl font-semibold text-slate-900">Three places Nobi pulled ahead</h2>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  title: "Fixing misspellings",
                  body: "A shopper typed \"smiths sirt.\" Shopify returned no results and suggested top sellers. Nobi figured out they meant the Smithson Shirt. It was the first result, and the shopper bought it.",
                },
                {
                  title: "Better product rankings",
                  body: "A search for \"white button down\" on Shopify returned a t-shirt as the first result. Nobi returned only actual button-downs. The shopper bought the Gironde.",
                },
                {
                  title: "Semantic search",
                  body: "A search for \"navy vest\" (a product UNTUCKit didn't carry in navy) had Shopify showing t-shirts. Nobi confirmed no navy vests were available but surfaced vests in other colors and other navy items. The shopper stayed on the site.",
                },
              ].map((item) => (
                <div key={item.title} className="rounded-2xl border border-slate-200 bg-white p-6 space-y-3 shadow-[0_8px_24px_-16px_rgba(15,23,42,0.12)]">
                  <h3 className="text-base font-semibold text-slate-900">{item.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{item.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Results — stats woven into narrative */}
        <section className="bg-white border-t border-slate-100 py-16">
          <div className="mx-auto max-w-4xl px-6 space-y-6">
            <div className="space-y-3">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-fuchsia-600">The result</p>
              <h2 className="text-2xl font-semibold text-slate-900">The A/B test ran for two months. Then they stopped splitting.</h2>
            </div>
            <div className="space-y-4 text-base text-slate-600 leading-relaxed max-w-2xl">
              <p>
                Nobi's conversion rate came in at <strong>17.6%</strong> against Shopify's <strong>15.0%</strong> — a <strong>+17.1% lift</strong>. Revenue per searcher climbed from <strong>$32.30</strong> to <strong>$39.17</strong>, a <strong>+21.3% improvement</strong>. Average order value moved from <strong>$215</strong> to <strong>$222</strong>.
              </p>
              <p>
                The numbers were clear enough that UNTUCKit didn't need to keep running the test. They moved Nobi from a split to 100% of their traffic and started looking at what else they could do with it.
              </p>
            </div>
          </div>
        </section>

        {/* What happened next — dark section with images */}
        <section className="bg-gradient-to-b from-[#17122f] via-[#1c1540] to-[#17122f] py-20 text-white">
          <div className="mx-auto max-w-4xl px-6 space-y-10">
            <div className="space-y-3 max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-purple-300">After the pilot</p>
              <h2 className="text-3xl font-semibold text-white">They went all in — and started shaping the product</h2>
              <p className="text-base text-slate-300">
                Once they committed fully, UNTUCKit pushed deeper into Nobi than almost any other customer. Some of what they asked for became features every Nobi customer uses today.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Panel 1: Query channel report */}
              <div className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
                <div className="aspect-[16/9] overflow-hidden bg-white/5">
                  <img
                    src={IMG_CHANNEL_REPORT}
                    alt="Queries by Channel report in Nobi dashboard"
                    className="w-full h-full object-cover object-top"
                  />
                </div>
                <div className="p-6 space-y-2">
                  <h3 className="text-base font-semibold text-white">They asked for a query channel report</h3>
                  <p className="text-sm text-slate-300 leading-relaxed">UNTUCKit wanted to understand which channels their search traffic was coming from — organic, paid, email, social — and which queries drove revenue. Nobi built it. That report is now in every customer's dashboard.</p>
                </div>
              </div>

              {/* Panel 2: Hooks API — code block, no image available */}
              <div className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
                <div className="aspect-[16/9] overflow-hidden bg-[#0f0c1d] flex items-center justify-center p-6">
                  <pre className="text-xs text-violet-300 leading-relaxed font-mono overflow-auto w-full"><code>{`window.NobiFeatureHooks = {
  onProductDisplay: function(product) {
    // customize how Nobi renders
    // each product card
    return {
      badge: getBadge(product),
      subtitle: getSubtitle(product),
    };
  }
}`}</code></pre>
                </div>
                <div className="p-6 space-y-2">
                  <h3 className="text-base font-semibold text-white">They inspired Nobi's Hooks API</h3>
                  <p className="text-sm text-slate-300 leading-relaxed">UNTUCKit's team wanted to control how Nobi displayed products — customizing each card to match their experience. That request became Nobi's Hooks capability, which lets any developer inject custom logic into the assistant without touching Nobi's code directly.</p>
                </div>
              </div>

              {/* Panel 3: Weekly insights */}
              <div className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
                <div className="aspect-[16/9] overflow-hidden bg-white/5">
                  <img
                    src={IMG_INSIGHTS}
                    alt="Nobi Insights dashboard"
                    className="w-full h-full object-cover object-top"
                  />
                </div>
                <div className="p-6 space-y-2">
                  <h3 className="text-base font-semibold text-white">They run Nobi insights in weekly meetings</h3>
                  <p className="text-sm text-slate-300 leading-relaxed">UNTUCKit's team reviews Nobi's search insights every week as part of their regular business review — looking at query trends, zero-result searches, and what shoppers are actually asking for. It became a standing part of how they think about their catalog.</p>
                </div>
              </div>

              {/* Panel 4: Search history */}
              <div className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
                <div className="aspect-[16/9] overflow-hidden bg-white/5">
                  <img
                    src={IMG_METRICS}
                    alt="Nobi Performance Metrics dashboard"
                    className="w-full h-full object-cover object-top"
                  />
                </div>
                <div className="p-6 space-y-2">
                  <h3 className="text-base font-semibold text-white">They now have full search history</h3>
                  <p className="text-sm text-slate-300 leading-relaxed">Before Nobi, UNTUCKit's search data only went back 12 months. Nobi stores everything from day one, so they can track long-term trends, compare seasons, and build a real picture of how search behavior changes over time.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="bg-gradient-to-b from-[#17122f] to-[#1c1540] text-white py-20 border-t border-white/5">
          <div className="mx-auto max-w-4xl px-6">
            <div className="space-y-8 text-center max-w-2xl mx-auto">
              <div className="space-y-4">
                <h2 className="text-3xl sm:text-4xl font-semibold">See what Nobi can do for your brand</h2>
                <p className="text-lg text-white/70">Start with a two-month test. Keep going if it works.</p>
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
