import React, { useEffect } from "react";
import { useSEO } from "../hooks/useSEO";
import PageLayout from "../components/PageLayout";
import FAQList from "../components/FAQList.jsx";
import { Check, Search, Smile, BarChart3, MessageSquare, ArrowRight, Gift } from "lucide-react";
import Marquee from "react-fast-marquee";
import { getSignupUrl } from "../utils/signupUrl";
import { useDemoForm } from "../context/DemoFormContext";

const CUSTOMER_LOGOS = [
  { alt: "UNTUCKit", src: "/media/logos/untuckit.svg" },
  { alt: "Lucchese", src: "/media/logos/lucchese.svg" },
  { alt: "TOOLUP", src: "/media/logos/toolup.svg" },
  { alt: "Kilte", src: "/media/logos/kilte.svg" },
  { alt: "Alps and Meters", src: "/media/logos/alps_meters.png" },
];

/** Nobi plan pricing constants. */
const PLAN_PRICE = 25;
const PLAN_SEARCH_CAP = "2,500";
const PLAN_MESSAGE_CAP = "250";
const OVERAGE_RATE_MESSAGE = "$0.10";
const OVERAGE_RATE_SEARCH = "$0.01";
const TRIAL_DAYS = 30;
const MAX_PRODUCTS = "5,000";
const MAX_KB_DOCS = "5,000";

const PLAN_HIGHLIGHTS = [
  `Up to ${MAX_PRODUCTS} products and ${MAX_KB_DOCS} knowledge base documents`,
];

const ENTERPRISE_HIGHLIGHTS = [
  "Dedicated support",
  "Custom integrations and onboarding",
  "Volume discounts on usage",
  `Over ${MAX_PRODUCTS} products and knowledge base documents`,
];

const SHARED_FEATURES = [
  "Search mode, suggestion pills, buttons, and all other components",
  "Custom questions answered with your knowledge base",
  "Insights and analytics on your customers",
  "Merchandising rules and controls",
];

const VALUE_PROPS = [
  {
    icon: Search,
    color: "from-blue-500 to-indigo-600",
    bgColor: "bg-blue-50",
    title: "Better, Faster Search",
    description:
      "Semantic search understands intent, outperforming traditional keyword matching.",
  },
  {
    icon: Smile,
    color: "from-emerald-500 to-teal-600",
    bgColor: "bg-emerald-50",
    title: "Improved Customer Experience",
    description:
      "Customers get accurate answers powered by data you trust and control.",
  },
  {
    icon: BarChart3,
    color: "from-purple-500 to-violet-600",
    bgColor: "bg-purple-50",
    title: "Insights & Data",
    description:
      "Reporting and trends reveal what your customers are really looking for.",
  },
];

const PRICING_FAQS = [
  {
    q: "Can we try it before committing?",
    a: `Yes! The Nobi plan comes with a free ${TRIAL_DAYS}-day trial. You can also preview Nobi from your dashboard with your own products before going live on your site.`,
  },
  {
    q: "How does pricing work?",
    a: `Nobi is $${PLAN_PRICE}/month base and includes ${PLAN_SEARCH_CAP} searches and ${PLAN_MESSAGE_CAP} conversational messages. If you go over, you can choose to either pause until the next billing cycle or pay ${OVERAGE_RATE_MESSAGE}/message and ${OVERAGE_RATE_SEARCH}/search.`,
  },
  {
    q: "What happens if I go over my limit?",
    a: `You choose: either Nobi pauses until the next billing cycle, or you pay ${OVERAGE_RATE_MESSAGE} per additional message and ${OVERAGE_RATE_SEARCH} per additional search. You can change this setting at any time from your dashboard.`,
  },
  {
    q: "What counts as a search vs. a message?",
    a: "A search is when a visitor uses Nobi to find products or information on your site. A message is a back-and-forth conversational exchange. Both are tracked separately with their own limits.",
  },
  {
    q: "What kind of support do you offer?",
    a: "Our customers get full access to our founders and we even have Slack Connect channels for real-time support.",
  },
  {
    q: "Do you offer annual or enterprise pricing?",
    a: "Yes, we offer custom pricing for high-volume businesses, large catalogs, and annual commitments. Contact us to learn more.",
  },
];

export default function Pricing() {
  const { onOpen: openDemoForm } = useDemoForm();

  useSEO({
    title: "Pricing | Nobi",
    description: "Simple pricing starting at $25/month with a 30-day free trial. AI search, knowledge base, and lead capture for any website.",
    path: "/pricing",
    schema: {
      "@context": "https://schema.org",
      "@type": "Product",
      "name": "Nobi",
      "description": "AI site search and shopping assistant for ecommerce stores.",
      "brand": { "@type": "Brand", "name": "Nobi" },
      "offers": {
        "@type": "Offer",
        "price": "25",
        "priceCurrency": "USD",
        "availability": "https://schema.org/InStock",
        "url": "https://nobi.ai/pricing",
      },
    },
  });

  return (
    <PageLayout>
      <div className="bg-gradient-to-b from-white via-white to-slate-50 text-black min-h-screen overflow-x-hidden">
        {/* Hero */}
        <section className="relative">
          <div
            className="absolute -left-32 -top-24 w-80 h-80 bg-purple-200/50 blur-3xl pointer-events-none"
            aria-hidden
          />
          <div
            className="absolute right-[-120px] top-16 w-96 h-96 bg-blue-200/50 blur-3xl pointer-events-none"
            aria-hidden
          />

          <div className="relative mx-auto max-w-6xl px-6 pt-16 pb-2 sm:pt-20 sm:pb-4 text-center">
            <p className="text-sm font-semibold tracking-[0.2em] text-purple-600 uppercase mb-4">
              Pricing
            </p>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-slate-900 text-balance">
              Simple, usage-based pricing
            </h1>
            <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
              A low monthly base with per-use rates for searches and messages.
              Start with a free {TRIAL_DAYS}-day trial.
            </p>
          </div>
        </section>

        {/* Plan cards */}
        <section className="relative py-6 sm:py-8">
          <div className="mx-auto max-w-4xl px-6">
            {/* Free trial banner */}
            <div className="rounded-xl border border-purple-200 bg-white px-6 py-4 mb-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center flex-shrink-0">
                  <Gift className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="font-semibold text-slate-900">Free {TRIAL_DAYS}-day trial</p>
                  <p className="text-sm text-slate-500">
                    Full plan limits included. Cancel anytime.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {/* Standard Plan Card */}
              <div className="relative rounded-2xl border border-purple-200 bg-gradient-to-br from-purple-50/50 to-white p-6 sm:p-8 shadow-[0_18px_46px_-32px_rgba(15,23,42,0.35)] transition hover:-translate-y-1 ring-2 ring-purple-100">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-semibold text-slate-900">Standard</h3>
                    <p className="text-sm text-slate-500 mt-1">
                      Everything you need to power search and conversations on your site.
                    </p>
                  </div>

                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold tracking-tight text-slate-900">
                      ${PLAN_PRICE}
                    </span>
                    <span className="text-base text-slate-500">monthly base</span>
                  </div>

                  <p className="text-sm text-slate-500">
                    {PLAN_SEARCH_CAP} searches and {PLAN_MESSAGE_CAP} messages included. {OVERAGE_RATE_MESSAGE}/message and {OVERAGE_RATE_SEARCH}/search after that.
                  </p>

                  <ul className="space-y-2">
                    {PLAN_HIGHLIGHTS.map((highlight) => (
                      <li
                        key={highlight}
                        className="flex items-start gap-2 text-sm text-slate-600"
                      >
                        <Check className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                        {highlight}
                      </li>
                    ))}
                  </ul>

                  <a
                    href={getSignupUrl()}
                    className="block w-full rounded-xl py-3 text-sm font-semibold text-center transition active:scale-[.98] bg-black text-white hover:opacity-90 shadow-sm"
                  >
                    Start Free Trial
                  </a>
                </div>
              </div>

              {/* Enterprise Card */}
              <div className="relative rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-[0_18px_46px_-32px_rgba(15,23,42,0.35)] transition hover:-translate-y-1">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-semibold text-slate-900">Enterprise</h3>
                    <p className="text-sm text-slate-500 mt-1">
                      Tailored plans for high-volume businesses with large catalogs.
                    </p>
                  </div>

                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold tracking-tight text-slate-900">
                      Custom
                    </span>
                    <span className="text-base text-slate-500">pricing</span>
                  </div>

                  <ul className="space-y-2">
                    {ENTERPRISE_HIGHLIGHTS.map((highlight) => (
                      <li
                        key={highlight}
                        className="flex items-start gap-2 text-sm text-slate-600"
                      >
                        <Check className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                        {highlight}
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={openDemoForm}
                    className="block w-full rounded-xl py-3 text-sm font-semibold text-center transition active:scale-[.98] bg-white text-black border border-black hover:bg-black/5"
                  >
                    Get in Touch
                  </button>
                </div>
              </div>
            </div>

            {/* Shared features */}
            <div className="mt-10 text-center">
              <p className="text-sm font-semibold text-slate-500 uppercase tracking-[0.15em] mb-4">
                Included in every plan
              </p>
              <div className="flex flex-wrap justify-center gap-x-6 gap-y-3">
                {SHARED_FEATURES.map((feature) => (
                  <div
                    key={feature}
                    className="flex items-center gap-2 text-sm text-slate-700"
                  >
                    <Check className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                    {feature}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Value propositions */}
        <section className="bg-gradient-to-b from-slate-50 via-white to-white py-16 border-t border-slate-200/70">
          <div className="mx-auto max-w-6xl px-6">
            <div className="text-center space-y-2 mb-12">
              <p className="text-sm uppercase tracking-[0.2em] text-purple-600 font-semibold">
                Why Nobi
              </p>
              <h2 className="text-3xl sm:text-4xl font-semibold text-slate-900">
                Every plan includes everything you need
              </h2>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
              {VALUE_PROPS.map((prop) => {
                const Icon = prop.icon;
                return (
                  <div
                    key={prop.title}
                    className="text-center space-y-4 p-6 rounded-2xl border border-slate-200 bg-white shadow-[0_12px_36px_-24px_rgba(15,23,42,0.2)]"
                  >
                    <div
                      className={`inline-flex items-center justify-center w-12 h-12 rounded-xl ${prop.bgColor}`}
                    >
                      <Icon className={`w-6 h-6 bg-gradient-to-br ${prop.color} bg-clip-text`} style={{ color: prop.color.includes('blue') ? '#3b82f6' : prop.color.includes('emerald') ? '#10b981' : '#8b5cf6' }} />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900">
                      {prop.title}
                    </h3>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      {prop.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Social proof */}
        <section className="border-t border-slate-200/70 bg-gradient-to-b from-white to-slate-50 py-16">
          <div className="mx-auto max-w-6xl px-6 space-y-4">
            <p className="text-center text-base text-black/60 tracking-[0.04em]">
              Trusted by ecommerce teams who are serious about search &amp; discovery
            </p>
            <div className="bg-white rounded-xl border border-[#d6d6d6] shadow-[0_8px_22px_-18px_rgba(15,23,42,0.45)] overflow-hidden py-5 px-2">
              <Marquee speed={36} gradient={false} pauseOnHover>
                {[...CUSTOMER_LOGOS, ...CUSTOMER_LOGOS].map((logo, idx) => (
                  <img
                    key={`${logo.alt}-${idx}`}
                    src={logo.src}
                    alt={logo.alt}
                    className="h-5 w-auto object-contain grayscale opacity-60 hover:opacity-100 transition mx-4"
                    loading="lazy"
                  />
                ))}
              </Marquee>
            </div>
          </div>
        </section>

        {/* Pricing FAQs */}
        <section className="bg-gradient-to-b from-slate-50 via-white to-white py-16 border-t border-slate-200/70">
          <div className="mx-auto max-w-6xl px-6">
            <FAQList
              id="pricing-faqs"
              title="Pricing FAQs"
              headingAlign="center"
              sectionClassName="px-0"
              padding="py-0"
              columns={2}
              items={PRICING_FAQS}
            />
          </div>
        </section>

        {/* Closing CTA */}
        <section className="bg-gradient-to-b from-white via-slate-50 to-white py-16">
          <div className="mx-auto max-w-5xl px-6 text-center space-y-5">
            <div className="space-y-3">
              <h2 className="text-3xl sm:text-4xl font-semibold text-slate-900">
                Ready to grow your conversions?
              </h2>
              <p className="text-base text-slate-600">
                Start your free {TRIAL_DAYS}-day trial today. Cancel anytime.
              </p>
            </div>
            <div className="flex justify-center">
              <a
                href={getSignupUrl()}
                className="h-12 rounded-full bg-black text-white hover:opacity-90 shadow-sm px-6 text-sm font-semibold transition active:scale-[.98] inline-flex items-center justify-center"
              >
                Sign Up Free
              </a>
            </div>
          </div>
        </section>
      </div>
    </PageLayout>
  );
}
