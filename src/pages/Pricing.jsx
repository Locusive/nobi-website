import React, { useEffect } from "react";
import PageLayout from "../components/PageLayout";
import DemoCTAButton from "../components/DemoCTAButton";
import FAQList from "../components/FAQList.jsx";
import { Check, Search, Smile, BarChart3, MessageSquare, ArrowRight } from "lucide-react";
import Marquee from "react-fast-marquee";
import { useDemoForm } from "../context/DemoFormContext";

const CUSTOMER_LOGOS = [
  { alt: "UNTUCKit", src: "/media/logos/untuckit.svg" },
  { alt: "Lucchese", src: "/media/logos/lucchese.svg" },
  { alt: "Faherty", src: "/media/logos/faherty.svg" },
  { alt: "TOOLUP", src: "/media/logos/toolup.svg" },
  { alt: "Kilte", src: "/media/logos/kilte.svg" },
  { alt: "Alps and Meters", src: "/media/logos/alps_meters.png" },
];

const PLANS = [
  {
    name: "Starter",
    price: 300,
    messageCap: "3,000",
    description: "For brands getting started with conversational commerce.",
  },
  {
    name: "Growth",
    price: 900,
    messageCap: "10,000",
    highlighted: true,
    badge: "Best Value",
    description: "For growing brands with higher traffic and engagement.",
  },
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
    a: "Absolutely! We offer a free trial period of 30 days or up to 100K messages.",
  },
  {
    q: "How does pricing work?",
    a: "Nobi offers tiered plans based on the number of messages your shoppers send each month. Pick the tier that fits your volume, and if you go over, choose to either pause until the next cycle or pay per additional message.",
  },
  {
    q: "What happens if I go over my message limit?",
    a: "You choose: either Nobi pauses until the next billing cycle, or you pay $0.10 per additional message. You can change this setting at any time from your dashboard.",
  },
  {
    q: "Can I change plans later?",
    a: "Yes! You can upgrade or downgrade at any time. Changes are prorated so you only pay for what you use.",
  },
  {
    q: "What kind of support do you offer?",
    a: "Our customers get full access to our founders and we even have Slack Connect channels for real-time support.",
  },
  {
    q: "Do you offer annual pricing?",
    a: "Yes, we offer discounts for annual commitments. Contact us to learn more about annual plans and custom pricing.",
  },
];

export default function Pricing() {
  const { onOpen: openDemoForm } = useDemoForm();

  useEffect(() => {
    document.title = "Pricing | Nobi: a conversational site assistant to help you grow";
  }, []);

  return (
    <PageLayout>
      <div className="bg-gradient-to-b from-white via-white to-slate-50 text-black min-h-screen">
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
              Simple plans that scale with use
            </h1>
            <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Start with a 30-day free trial. Pick the plan that matches your
              monthly message volume, and only pay for what you need.
            </p>
          </div>
        </section>

        {/* Plan cards */}
        <section className="relative py-6 sm:py-8">
          <div className="mx-auto max-w-4xl px-6">
            {/* Free trial banner */}
            <div className="mb-8 rounded-xl border border-purple-200 bg-gradient-to-r from-purple-50 to-indigo-50 px-5 py-4 text-center shadow-sm">
              <p className="text-sm font-semibold text-purple-800">
                <span className="mr-1.5">🎁</span>
                Free 30-day trial &mdash; 100,000 messages included. Cancel
                anytime.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {PLANS.map((plan) => (
                <PlanCard
                  key={plan.name}
                  plan={plan}
                  onSelect={openDemoForm}
                />
              ))}
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

            {/* Overage note */}
            <p className="mt-6 text-center text-sm text-slate-500">
              Go over your limit? Choose to pause or pay $0.10 per additional
              message.
            </p>
          </div>
        </section>

        {/* Enterprise */}
        <section className="py-12 sm:py-16">
          <div className="mx-auto max-w-4xl px-6">
            <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-br from-[#17122f] via-[#1c1540] to-[#221a4a] p-8 sm:p-10 text-center shadow-[0_22px_60px_-30px_rgba(15,23,42,0.5)]">
              <div
                className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(124,58,237,0.2),transparent_45%),radial-gradient(circle_at_80%_80%,rgba(59,130,246,0.15),transparent_40%)]"
                aria-hidden
              />
              <div className="relative space-y-4">
                <h2 className="text-2xl sm:text-3xl font-semibold text-white">
                  Enterprise
                </h2>
                <p className="text-base text-slate-300 max-w-xl mx-auto leading-relaxed">
                  Custom pricing for high-volume messaging, custom integrations,
                  and dedicated support. We work with brands processing millions
                  of messages per month.
                </p>
                <button
                  onClick={openDemoForm}
                  className="inline-flex items-center gap-2 rounded-full bg-white text-[#17122f] px-6 py-3 text-sm font-semibold shadow-[0_10px_32px_-24px_rgba(255,255,255,0.6)] hover:bg-white/90 transition"
                >
                  Set Up A Free Trial
                  <ArrowRight className="w-4 h-4" />
                </button>
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
                Start your free 30-day trial today. Cancel anytime.
              </p>
            </div>
            <div className="flex justify-center">
              <DemoCTAButton className="h-12 rounded-full bg-black text-white hover:opacity-90 shadow-sm px-6 w-full sm:w-auto" />
            </div>
          </div>
        </section>
      </div>
    </PageLayout>
  );
}

/**
 * Individual plan card for the pricing grid.
 */
function PlanCard({ plan, onSelect }) {
  return (
    <div
      className={`relative rounded-2xl border bg-white p-6 sm:p-8 shadow-[0_18px_46px_-32px_rgba(15,23,42,0.35)] transition hover:-translate-y-1 ${
        plan.highlighted
          ? "border-purple-300 ring-2 ring-purple-200"
          : "border-slate-200"
      }`}
    >
      {plan.badge && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span className="rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 px-4 py-1 text-xs font-semibold text-white shadow-sm">
            {plan.badge}
          </span>
        </div>
      )}

      <div className="space-y-4">
        <div>
          <h3 className="text-xl font-semibold text-slate-900">{plan.name}</h3>
          <p className="text-sm text-slate-500 mt-1">{plan.description}</p>
        </div>

        <div className="flex items-baseline gap-1">
          <span className="text-4xl font-bold tracking-tight text-slate-900">
            ${plan.price}
          </span>
          <span className="text-base text-slate-500">/month</span>
        </div>

        <div className="flex items-center gap-2 text-sm text-slate-600">
          <MessageSquare className="w-4 h-4 text-slate-400" />
          Up to{" "}
          <span className="font-semibold text-slate-900">
            {plan.messageCap}
          </span>{" "}
          messages/month
        </div>

        <button
          onClick={onSelect}
          className={`w-full rounded-xl py-3 text-sm font-semibold transition active:scale-[.98] ${
            plan.highlighted
              ? "bg-black text-white hover:opacity-90 shadow-sm"
              : "bg-white text-black border border-black hover:bg-black/5"
          }`}
        >
          Set Up A Free Trial
        </button>
      </div>
    </div>
  );
}
