import React, { useEffect } from "react";
import PageLayout from "../../components/PageLayout";
import { getSignupUrl } from "../../utils/signupUrl";
import { useDemoForm } from "../../context/DemoFormContext";

const GRADIENT = "bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500 bg-clip-text text-transparent";

export default function KilteCustomer() {
  const { onOpen } = useDemoForm();

  useEffect(() => {
    document.title = "Kilte + Nobi | Customer Story";
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
                <img src="/media/logos/kilte.svg" alt="Kilte" className="h-7 w-auto" />
                <span className="text-sm text-slate-400">×</span>
                <span className="text-sm font-semibold text-slate-500">Nobi</span>
              </div>
              <div className="space-y-4">
                <p className="text-sm font-semibold tracking-[0.2em] text-fuchsia-600 uppercase">Customer story</p>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold leading-[1.05] text-slate-900 text-balance">
                  Kilte beat Shopify default search by{" "}
                  <span className={GRADIENT}>21.7%</span>
                </h1>
                <p className="text-lg text-slate-600 max-w-2xl leading-relaxed">
                  Kilte ran a head-to-head comparison between Nobi and Shopify's default search. Nobi converted 21.7% more visitors. They've been on Nobi ever since and now use it across their entire site.
                </p>
              </div>

              {/* Stat */}
              <div className="max-w-xs">
                <div className="rounded-2xl border border-slate-200 bg-white px-5 py-5 shadow-[0_8px_24px_-16px_rgba(15,23,42,0.15)]">
                  <div className="text-3xl font-bold text-slate-900">+21.7%</div>
                  <div className="text-sm font-semibold text-slate-700 mt-1">More conversions</div>
                  <div className="text-xs text-slate-400 mt-0.5">Nobi vs. Shopify default in A/B test</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Story */}
        <section className="bg-white border-t border-slate-100 py-16">
          <div className="mx-auto max-w-4xl px-6 space-y-10">
            <div className="grid md:grid-cols-2 gap-10 lg:gap-16">
              <div className="space-y-4">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-400">About Kilte</p>
                <p className="text-base text-slate-600 leading-relaxed">
                  Kilte is a fashion brand selling directly to consumers online. Like most ecommerce brands, their site depends on shoppers being able to find what they're looking for, which made search a critical part of the experience.
                </p>
              </div>
              <div className="space-y-4">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-400">The test</p>
                <p className="text-base text-slate-600 leading-relaxed">
                  Kilte ran a straightforward comparison: Shopify default search against Nobi, measured on conversion rate. Nobi won by 21.7%. They didn't need more convincing. They switched and haven't looked back.
                </p>
              </div>
            </div>

            {/* How they use Nobi */}
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-slate-900">How Kilte uses Nobi today</h2>
              <div className="grid md:grid-cols-3 gap-5">
                {[
                  {
                    title: "AI search",
                    body: "Nobi powers search across Kilte's catalog, understanding what shoppers mean rather than just matching keywords.",
                  },
                  {
                    title: "Prompts beside filters",
                    body: "Kilte uses Nobi's AI suggestion pills alongside their collection filters, keeping shoppers engaged and clicking deeper into the catalog.",
                  },
                  {
                    title: "Help hub for returns",
                    body: "Kilte launches Nobi from their help hub to handle return questions, giving shoppers fast answers without a support ticket.",
                  },
                ].map((item) => (
                  <div key={item.title} className="rounded-2xl border border-slate-200 bg-white p-6 space-y-3 shadow-[0_8px_24px_-16px_rgba(15,23,42,0.12)]">
                    <h3 className="text-base font-semibold text-slate-900">{item.title}</h3>
                    <p className="text-sm text-slate-600 leading-relaxed">{item.body}</p>
                  </div>
                ))}
              </div>
            </div>
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
