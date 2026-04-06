import React, { useEffect } from "react";
import PageLayout from "../../components/PageLayout";
import { getSignupUrl } from "../../utils/signupUrl";
import { useDemoForm } from "../../context/DemoFormContext";

const GRADIENT = "bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500 bg-clip-text text-transparent";

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
                  UNTUCKit wanted to see what AI could actually do for their site. They ran a two-month A/B test, saw the results, and kept going. Deeper than almost any other customer.
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

        {/* Company + challenge */}
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
                  UNTUCKit knew that shoppers who search are far more likely to convert than those who don't. They wanted to test whether AI search could meaningfully improve what happened after a visitor typed something in, and whether the ROI would justify the cost.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* What Nobi outperformed on */}
        <section className="bg-gradient-to-b from-slate-50 to-white py-20">
          <div className="mx-auto max-w-4xl px-6 space-y-10">
            <div className="space-y-3">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-fuchsia-600">Where Nobi outperformed</p>
              <h2 className="text-3xl font-semibold text-slate-900">Three areas that drove the lift</h2>
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
                  body: "A search for \"navy vest\" (a product UNTUCKit didn't carry in navy) had Shopify showing t-shirts. Nobi correctly confirmed no navy vests were available, but surfaced vests in other colors and other navy items. The shopper stayed on the site.",
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

        {/* Partnership grew */}
        <section className="bg-gradient-to-b from-[#17122f] via-[#1c1540] to-[#17122f] py-20 text-white">
          <div className="mx-auto max-w-4xl px-6 space-y-10">
            <div className="space-y-3 max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-purple-300">What happened after the pilot</p>
              <h2 className="text-3xl font-semibold text-white">The pilot ended. The partnership didn't.</h2>
              <p className="text-base text-slate-300">
                After seeing the A/B test results and getting comfortable with the pricing, UNTUCKit kept going and pushed deeper into what Nobi could do.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-5">
              {[
                {
                  title: "They asked for a query channel report",
                  body: "UNTUCKit wanted to understand which channels their search traffic was coming from. Nobi built it. That report is now available to every customer.",
                },
                {
                  title: "They inspired Nobi's Hooks API",
                  body: "UNTUCKit's team wanted to control how Nobi displayed product information, customizing the output to match their experience. That request turned into Nobi's Hooks capability, which any developer can now use.",
                },
                {
                  title: "They run Nobi insights in weekly meetings",
                  body: "UNTUCKit's team reviews Nobi's search insights every week as part of their regular business review, looking at query trends, zero-result searches, and what shoppers are asking for.",
                },
                {
                  title: "They now have full search history",
                  body: "Before Nobi, UNTUCKit's search data only went back 12 months. Nobi stores everything from day one, so they can track long-term trends, compare seasons, and build a real picture of how search behavior changes over time.",
                },
              ].map((item) => (
                <div key={item.title} className="rounded-2xl border border-white/10 bg-white/5 p-6 space-y-2">
                  <h3 className="text-base font-semibold text-white">{item.title}</h3>
                  <p className="text-sm text-slate-300 leading-relaxed">{item.body}</p>
                </div>
              ))}
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
