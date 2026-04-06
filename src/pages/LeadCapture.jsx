import React, { useEffect } from "react";
import PageLayout from "../components/PageLayout";
import DemoCTAButton from "../components/DemoCTAButton";
import { getSignupUrl } from "../utils/signupUrl";
import { useDemoForm } from "../context/DemoFormContext";
import { Heart, MessageCircleQuestion, BarChart3, MousePointerClick } from "lucide-react";

const GRADIENT = "bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500 bg-clip-text text-transparent";

export default function LeadCapture() {
  const { onOpen } = useDemoForm();

  useEffect(() => {
    document.title = "Lead Capture | Nobi";
  }, []);

  return (
    <PageLayout>
      <div className="bg-gradient-to-b from-white via-white to-slate-50 text-black min-h-screen">
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div className="absolute -left-32 -top-24 w-80 h-80 bg-purple-200/50 blur-3xl" aria-hidden />
          <div className="absolute right-[-120px] top-16 w-96 h-96 bg-blue-200/50 blur-3xl" aria-hidden />

          <div className="relative mx-auto max-w-6xl xl:max-w-7xl px-6 pb-14 pt-16 sm:pt-20 lg:pt-24">
            <div className="space-y-8 max-w-3xl">
              <div className="space-y-6">
                <p className="text-sm font-semibold tracking-[0.2em] text-fuchsia-600 uppercase">
                  Lead capture
                </p>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold leading-[1.05] text-slate-900 text-balance">
                  Capture leads <span className={GRADIENT}>through conversation</span>
                </h1>
                <p className="text-lg text-slate-600 max-w-2xl leading-relaxed">
                  Nobi collects contact info at the right moment and routes every lead to your CRM with full source attribution. No pop-up forms required.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 pt-2">
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
          </div>
        </section>

        {/* Stats bar */}
        <section className="bg-gradient-to-b from-white via-slate-50 to-white py-16">
          <div className="mx-auto max-w-6xl xl:max-w-7xl px-6">
            <div className="grid gap-4 sm:gap-5 md:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  stat: "17.6%",
                  label: "conversion rate",
                  desc: "UNTUCKit Nobi users vs. 15.0% on Shopify default in a head-to-head A/B test.",
                  palette: "blue",
                },
                {
                  stat: "+21.3%",
                  label: "revenue per referral",
                  desc: "Faherty Brand after adding Nobi lead capture. Measured against their prior tool.",
                  palette: "purple",
                },
                {
                  stat: "100%",
                  label: "of leads attributed",
                  desc: "Every lead tagged with the conversation and campaign that drove it, sent to your CRM automatically.",
                  palette: "blue",
                },
              ].map((item) => (
                <div
                  key={item.stat}
                  className={`relative overflow-hidden rounded-xl border text-white shadow-[0_18px_42px_-24px_rgba(64,41,153,0.45)] ${
                    item.palette === "blue"
                      ? "border-[#3f6bff] bg-gradient-to-br from-[#3fb7ff] via-[#4f7dff] to-[#6b52d9]"
                      : "border-[#4c3ab8] bg-gradient-to-br from-[#4a47a8] via-[#6b52d9] to-[#7f4ff0]"
                  }`}
                >
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_22%_18%,rgba(255,255,255,0.16),transparent_40%),radial-gradient(circle_at_80%_0%,rgba(255,255,255,0.12),transparent_36%)]" aria-hidden />
                  <div className="relative px-5 sm:px-6 py-6 sm:py-7 flex flex-col gap-2">
                    <div className="text-3xl sm:text-4xl font-bold tracking-tight text-white drop-shadow-sm">{item.stat}</div>
                    <div className="text-xs sm:text-sm font-medium text-white/85">{item.label}</div>
                    <div className="text-xs text-white/70 leading-relaxed pt-1">{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="bg-gradient-to-b from-white via-slate-50 to-white py-16">
          <div className="mx-auto max-w-6xl xl:max-w-7xl px-6 space-y-5 sm:space-y-8">
            <div className="text-center space-y-2">
              <h2 className="text-3xl sm:text-4xl font-semibold text-slate-900">
                How Nobi captures leads
              </h2>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              {[
                {
                  icon: Heart,
                  title: "Collects contact info through conversation",
                  desc: "Instead of a pop-up form, Nobi asks for an email or phone number at the right moment in a conversation. Visitors give it because they want to hear back.",
                },
                {
                  icon: MessageCircleQuestion,
                  title: "Routes to your CRM automatically",
                  desc: "Every lead goes straight to the CRM or form handler you already use. No Zapier required, no manual exports.",
                },
                {
                  icon: BarChart3,
                  title: "Full source attribution",
                  desc: "Every lead is tagged with the campaign, channel, and conversation that drove it. You know exactly what's working.",
                },
                {
                  icon: MousePointerClick,
                  title: "Exit-intent and session triggers",
                  desc: "Configure when Nobi asks -- after X seconds, on exit intent, after a product view, or whenever a visitor gets stuck. Timing is everything.",
                },
              ].map((card) => {
                const Icon = card.icon;
                return (
                  <div
                    key={card.title}
                    className="flex flex-col gap-4 bg-white rounded-2xl border border-slate-200 shadow-[0_18px_46px_-32px_rgba(15,23,42,0.35)] p-5 sm:p-6"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 mt-1">
                        <Icon className="w-6 h-6 text-violet-600" />
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-lg font-semibold text-slate-900">{card.title}</h3>
                        <p className="text-sm text-slate-600 leading-relaxed">{card.desc}</p>
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
          <div className="mx-auto max-w-6xl xl:max-w-7xl px-6 space-y-5 sm:space-y-8">
            <div className="text-center space-y-2">
              <h2 className="text-3xl sm:text-4xl font-semibold text-slate-900">
                Set up in three steps
              </h2>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {[
                {
                  step: "1",
                  title: "Add a line of code",
                  desc: "Drop one script tag on your site. Nobi reads your pages and sets up in minutes without a full integration.",
                },
                {
                  step: "2",
                  title: "Set your trigger rules",
                  desc: "Choose when Nobi should ask for contact info -- on exit intent, after a set time, or after a visitor views a specific page or product.",
                },
                {
                  step: "3",
                  title: "Leads land in your CRM",
                  desc: "Every captured contact is sent to your existing CRM or form handler with full context about the conversation that drove it.",
                },
              ].map((item) => (
                <div
                  key={item.step}
                  className="flex flex-col gap-4 bg-white rounded-2xl border border-slate-200 shadow-[0_18px_46px_-32px_rgba(15,23,42,0.35)] p-6"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500 text-white font-semibold">
                      {item.step}
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900">{item.title}</h3>
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="bg-gradient-to-b from-[#17122f] to-[#1c1540] text-white py-16">
          <div className="mx-auto max-w-6xl xl:max-w-7xl px-6">
            <div className="space-y-8 text-center">
              <div className="space-y-4">
                <h2 className="text-3xl sm:text-4xl font-semibold">
                  Start capturing better leads today
                </h2>
                <p className="text-lg text-white/70 max-w-2xl mx-auto leading-relaxed">
                  Get your lead capture questions set up in minutes, no code changes required.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
                <button
                  onClick={onOpen}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl font-medium transition bg-white text-black hover:bg-white/90 shadow-sm h-12 px-6 text-base"
                >
                  Get a demo
                </button>
                <a
                  href={getSignupUrl()}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl font-medium transition border border-white/30 bg-white/10 text-white h-12 px-6 text-base hover:border-white/50"
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
