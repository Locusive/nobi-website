import React, { useEffect } from "react";
import PageLayout from "../../components/PageLayout";
import { getSignupUrl } from "../../utils/signupUrl";
import { useDemoForm } from "../../context/DemoFormContext";

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
                <span className="text-sm text-slate-400">×</span>
                <span className="text-sm font-semibold text-slate-500">Nobi</span>
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
          <div className="mx-auto max-w-4xl px-6 space-y-16">
            <div className="space-y-3">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-fuchsia-600">What changed</p>
              <h2 className="text-3xl sm:text-4xl font-semibold text-slate-900">Three things that moved the needle</h2>
            </div>

            {[
              {
                number: "01",
                title: "Always show results",
                body: "Keyword search returns nothing when a query doesn't exactly match product copy. Nobi always surfaces the closest relevant products instead. When a shopper searched \"Terlingua\" (a West Texas town), Shopify returned zero results. Nobi used its knowledge base to figure out what the shopper was going for and returned the Walter boot and others with a matching look and feel. The shopper added to cart.",
              },
              {
                number: "02",
                title: "Better rankings with RAG",
                body: "Standard search ranks purely by keyword match frequency. Nobi uses Retrieval Augmented Generation to rank by actual relevance. For the query \"Olive,\" Shopify buried the Dante Olive Chocolate boot past 16 results, requiring shoppers to click \"Load More.\" Nobi surfaced it on row two. The shopper bought it.",
              },
              {
                number: "03",
                title: "Semantic search",
                body: "Shoppers don't always use the same words you used to describe your products. A search for \"card holder\" on Shopify only returned tote bags that happened to have card slots, missing Lucchese's entire wallet and card case collection. Nobi understood what the shopper meant and surfaced wallets, card cases, and bifold options. The shopper bought a wallet in Ostrich Cognac.",
              },
            ].map((item) => (
              <div key={item.number} className="max-w-2xl pb-14 border-b border-slate-200 last:border-0 last:pb-0 space-y-4">
                <div className="text-4xl font-bold text-slate-200">{item.number}</div>
                <h3 className="text-xl font-semibold text-slate-900">{item.title}</h3>
                <p className="text-base text-slate-600 leading-relaxed">{item.body}</p>
              </div>
            ))}
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
              In the first two months after launch, Nobi drove a <strong>21% improvement in conversion rates</strong> compared to the standard Shopify experience in a direct A/B test. By year one, Lucchese had generated <strong>$1M+ in incremental revenue</strong>, a 74% improvement over the standard Shopify experience, at an <strong>ROI of 33x</strong>.
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
                Lucchese and Nobi continue to explore new ways to use AI throughout the shopping experience as Lucchese works toward its "Make it Smart" goal for 2025 and beyond.
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
