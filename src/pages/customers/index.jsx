import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import PageLayout from "../../components/PageLayout";
import { getSignupUrl } from "../../utils/signupUrl";
import { useDemoForm } from "../../context/DemoFormContext";

const GRADIENT = "bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500 bg-clip-text text-transparent";

const STORIES = [
  {
    slug: "/customers/lucchese",
    logo: "/media/logos/lucchese.svg",
    name: "Lucchese",
    headline: "33x ROI in 90 days",
    body: "Lucchese replaced keyword search with Nobi and generated $1M+ in incremental revenue in year one, with a 21% conversion lift verified in an A/B test.",
    stats: [
      { value: "21%", label: "Conversion lift" },
      { value: "33x", label: "ROI" },
      { value: "$1M+", label: "Revenue in year one" },
    ],
  },
  {
    slug: "/customers/untuckit",
    logo: "/media/logos/untuckit.svg",
    logoClass: "h-4 w-auto",
    name: "UNTUCKit",
    headline: "+17.1% conversion rate",
    body: "UNTUCKit ran a two-month pilot, saw the results, and kept building. Their feedback shaped Nobi's Hooks API. Their team now runs Nobi search insights in weekly business reviews.",
    stats: [
      { value: "+17.1%", label: "Conversion rate" },
      { value: "+21.3%", label: "Revenue per searcher" },
      { value: "+3.3%", label: "Average order value" },
    ],
  },
  {
    slug: "/customers/kilte",
    logo: "/media/logos/kilte.svg",
    name: "Kilte",
    headline: "+21.7% more conversions",
    body: "Kilte ran a head-to-head comparison against Shopify default search. Nobi won by 21.7%. They switched and now use Nobi across search, filters, and their help hub.",
    stats: [
      { value: "+21.7%", label: "More conversions" },
    ],
  },
];

export default function CustomersIndex() {
  const { onOpen } = useDemoForm();

  useEffect(() => {
    document.title = "Customer Stories | Nobi";
  }, []);

  return (
    <PageLayout>
      <div className="bg-gradient-to-b from-white via-white to-slate-50 text-black min-h-screen">

        {/* Header */}
        <section className="relative overflow-hidden">
          <div className="absolute -left-32 -top-24 w-80 h-80 bg-purple-200/50 blur-3xl" aria-hidden />
          <div className="absolute right-[-120px] top-16 w-96 h-96 bg-blue-200/50 blur-3xl" aria-hidden />
          <div className="relative mx-auto max-w-6xl px-6 pb-16 pt-16 sm:pt-20 lg:pt-24 text-center space-y-5">
            <p className="text-sm font-semibold tracking-[0.2em] text-fuchsia-600 uppercase">Customer stories</p>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold leading-[1.05] text-slate-900 text-balance">
              Real results from{" "}
              <span className={GRADIENT}>real brands</span>
            </h1>
            <p className="text-lg text-slate-600 max-w-xl mx-auto leading-relaxed">
              A/B tested, measured, and verified by the brands that ran them.
            </p>
          </div>
        </section>

        {/* Stories */}
        <section className="bg-white border-t border-slate-100 py-16">
          <div className="mx-auto max-w-6xl px-6 space-y-8">
            {STORIES.map((story) => (
              <Link
                key={story.slug}
                to={story.slug}
                className="group block rounded-3xl border border-slate-200 bg-white p-8 shadow-[0_12px_40px_-24px_rgba(15,23,42,0.15)] hover:border-violet-200 hover:shadow-[0_12px_40px_-24px_rgba(109,40,217,0.2)] transition-all"
              >
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  <div className="space-y-5">
                    <div className="flex items-center gap-4">
                      <img src={story.logo} alt={story.name} className={story.logoClass ?? "h-6 w-auto"} />
                    </div>
                    <div className="space-y-2">
                      <div className="text-2xl font-bold text-slate-900">{story.headline}</div>
                      <p className="text-base text-slate-600 leading-relaxed">{story.body}</p>
                    </div>
                    <div className="inline-flex items-center gap-1.5 text-sm font-semibold text-violet-600 group-hover:gap-2.5 transition-all">
                      Read the story
                      <span aria-hidden>→</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    {story.stats.map((s) => (
                      <div key={s.label} className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-4 group-hover:border-violet-100 group-hover:bg-violet-50/50 transition">
                        <div className="text-2xl font-bold text-slate-900">{s.value}</div>
                        <div className="text-xs text-slate-500 mt-1">{s.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="bg-gradient-to-b from-[#17122f] to-[#1c1540] text-white py-20">
          <div className="mx-auto max-w-6xl px-6">
            <div className="space-y-8 text-center max-w-2xl mx-auto">
              <div className="space-y-4">
                <h2 className="text-3xl sm:text-4xl font-semibold">Add your brand to this list</h2>
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
