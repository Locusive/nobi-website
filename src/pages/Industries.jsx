import React, { useEffect } from "react";
import PageLayout from "../components/PageLayout";
import { getSignupUrl } from "../utils/signupUrl";
import { useDemoForm } from "../context/DemoFormContext";
import {
  BookOpen,
  MessageCircleQuestion,
  Heart,
  LayoutGrid,
} from "lucide-react";

const GRADIENT =
  "bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500 bg-clip-text text-transparent";

export default function Industries() {
  const { onOpen } = useDemoForm();

  useEffect(() => {
    document.title = "Industries | Nobi";
  }, []);

  const industries = [
    {
      icon: "🛍️",
      name: "Ecommerce",
      desc: "Nobi helps shoppers find products in natural language, answers sizing and shipping questions, and captures leads from browsers who aren't ready to buy. Our customers see 17-22% higher conversion rates vs. their prior search tools.",
    },
    {
      icon: "🏠",
      name: "Home Services",
      desc: "Homeowners describe their problem in plain language and Nobi identifies the right service, answers questions about the process, and collects their contact info for a follow-up call.",
    },
    {
      icon: "🏡",
      name: "Real Estate",
      desc: "Buyers describe what they want and Nobi surfaces matching listings, answers questions about the neighborhood or process, and routes serious inquiries to the right agent.",
    },
    {
      icon: "💼",
      name: "SaaS and B2B",
      desc: "Visitors ask about pricing, integrations, and use cases. Nobi pulls answers from your docs and sales content, and captures contact info from prospects who engage.",
    },
    {
      icon: "🚗",
      name: "Automotive",
      desc: "Shoppers describe the vehicle or part they need in plain language. Nobi surfaces the right match, answers compatibility questions, and moves serious buyers toward a quote or test drive.",
    },
  ];

  const features = [
    {
      icon: BookOpen,
      title: "Learns your specific terminology",
      desc: "Nobi reads your product catalog, service descriptions, and knowledge base. It understands your industry's language without any custom training.",
    },
    {
      icon: MessageCircleQuestion,
      title: "Answers your industry's specific questions",
      desc: "Sizing for apparel, compatibility for auto parts, zoning for real estate. Nobi's answers come from your content, not generic AI.",
    },
    {
      icon: Heart,
      title: "Captures leads the way your industry works",
      desc: "Email for ecommerce, phone for home services, agent routing for real estate. Configure the lead capture flow to match how you close deals.",
    },
    {
      icon: LayoutGrid,
      title: "Works with your existing tools",
      desc: "CRM routing, form handlers, remarketing pixels, and analytics integrations work the same way regardless of industry.",
    },
  ];

  const steps = [
    {
      number: "1",
      title: "Connect your content",
      desc: "Nobi reads your product catalog, service pages, and help docs. It understands your business without any custom training or tagging.",
    },
    {
      number: "2",
      title: "Set up your capture flow",
      desc: "Configure how Nobi collects contact info and where it routes leads. Works with any CRM or form handler you already use.",
    },
    {
      number: "3",
      title: "Go live and measure",
      desc: "Deploy with one script tag. Track searches, questions, leads, and conversions in the Nobi dashboard.",
    },
  ];

  return (
    <PageLayout>
      <div className="bg-gradient-to-b from-white via-white to-slate-50 text-black min-h-screen">
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div className="absolute -left-32 -top-24 w-80 h-80 bg-purple-200/50 blur-3xl" aria-hidden />
          <div className="absolute right-[-120px] top-16 w-96 h-96 bg-blue-200/50 blur-3xl" aria-hidden />

          <div className="relative mx-auto max-w-6xl xl:max-w-7xl px-6 pb-14 pt-16 sm:pt-20 lg:pt-24">
            <div className="space-y-8 text-center max-w-3xl mx-auto">
              <p className="text-sm font-semibold tracking-[0.2em] text-fuchsia-600 uppercase">
                Works everywhere
              </p>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold leading-[1.1] text-slate-900">
                Built for any site that needs to{" "}
                <span className={GRADIENT}>convert visitors</span>
              </h1>

              <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
                Nobi helps visitors find what they need and take the next step.
                The same assistant that works for fashion ecommerce works for
                real estate, home services, and SaaS.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
                <button
                  onClick={onOpen}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl font-medium transition bg-black text-white hover:opacity-90 shadow-sm h-12 px-6 text-base"
                >
                  Get a demo
                </button>
                <a
                  href={getSignupUrl()}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl font-medium transition border border-black/10 bg-white/70 h-12 px-6 text-base hover:border-black/30"
                >
                  Get started free
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Industry grid */}
        <section className="bg-gradient-to-b from-white via-slate-50 to-white py-16">
          <div className="mx-auto max-w-6xl xl:max-w-7xl px-6">
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {industries.map((industry) => (
                <div
                  key={industry.name}
                  className="rounded-2xl border border-black/10 bg-white/70 p-6 shadow-sm"
                >
                  <div className="text-4xl mb-3">{industry.icon}</div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-3">
                    {industry.name}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {industry.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="bg-gradient-to-b from-white via-slate-50 to-white py-16">
          <div className="mx-auto max-w-6xl xl:max-w-7xl px-6 space-y-8">
            <div className="text-center space-y-3 max-w-2xl mx-auto">
              <h2 className="text-3xl sm:text-4xl font-semibold text-slate-900">
                The same core engine, tuned to your industry
              </h2>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              {features.map((feature) => {
                const Icon = feature.icon;
                return (
                  <div
                    key={feature.title}
                    className="rounded-2xl border border-black/10 bg-white/70 p-6 shadow-sm"
                  >
                    <div className="flex gap-4">
                      <div className="flex-shrink-0">
                        <Icon className="w-6 h-6 text-indigo-600" />
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-lg font-semibold text-slate-900">
                          {feature.title}
                        </h3>
                        <p className="text-sm text-slate-600 leading-relaxed">
                          {feature.desc}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="bg-gradient-to-b from-white via-slate-50 to-white py-16">
          <div className="mx-auto max-w-6xl xl:max-w-7xl px-6 space-y-8">
            <div className="text-center space-y-3 max-w-2xl mx-auto">
              <h2 className="text-3xl sm:text-4xl font-semibold text-slate-900">
                Get started in three steps
              </h2>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
              {steps.map((step) => (
                <div
                  key={step.number}
                  className="relative"
                >
                  <div className="absolute top-0 left-0 w-10 h-10 rounded-full bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500 flex items-center justify-center text-white font-bold text-sm">
                    {step.number}
                  </div>

                  <div className="pl-16 space-y-2">
                    <h3 className="text-lg font-semibold text-slate-900">
                      {step.title}
                    </h3>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      {step.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Dark bottom CTA */}
        <section className="bg-gradient-to-b from-[#17122f] to-[#1c1540] py-20">
          <div className="mx-auto max-w-6xl xl:max-w-7xl px-6">
            <div className="text-center space-y-8 max-w-3xl mx-auto">
              <div className="space-y-3">
                <h2 className="text-3xl sm:text-4xl font-semibold text-white">
                  See Nobi for your industry
                </h2>
                <p className="text-base text-slate-300">
                  Get a personalized demo showing how Nobi converts visitors in
                  your specific industry.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={onOpen}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl font-medium transition bg-white text-black hover:opacity-90 shadow-sm h-12 px-6 text-base"
                >
                  Get a demo
                </button>
                <a
                  href={getSignupUrl()}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl font-medium transition border border-white/20 text-white hover:border-white/40 h-12 px-6 text-base"
                >
                  Get started free
                </a>
              </div>
            </div>
          </div>
        </section>
      </div>
    </PageLayout>
  );
}
