import React, { useEffect } from "react";
import PageLayout from "../components/PageLayout";
import { getSignupUrl } from "../utils/signupUrl";
import { useDemoForm } from "../context/DemoFormContext";
import {
  Code,
  MousePointerClick,
  Sparkles,
  LayoutGrid,
} from "lucide-react";

const GRADIENT =
  "bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500 bg-clip-text text-transparent";

export default function CustomActions() {
  const { onOpen } = useDemoForm();

  useEffect(() => {
    document.title = "Custom Actions | Nobi";
  }, []);

  const stats = [
    {
      number: "1 line",
      label: "to open Nobi",
      desc: "Call Nobi.openChat() from any button on your site. No iframe wrangling, no custom UI to build.",
    },
    {
      number: "Any",
      label: "workflow supported",
      desc: "Booking, returns, forms, modals, cart actions. If your site can do it with JavaScript, Nobi can trigger it.",
    },
    {
      number: "Minutes",
      label: "to set up",
      desc: "Drop in the script tag, configure your actions in the dashboard, and Nobi handles the rest.",
    },
  ];

  const features = [
    {
      icon: Code,
      title: "Open Nobi from any button",
      desc: "Call window.Nobi.openChat() from any element on your site - a nav item, a help button, a product page CTA. No custom UI required.",
    },
    {
      icon: MousePointerClick,
      title: "Pre-fill the conversation",
      desc: "Pass context when you open Nobi so it starts with the right intent. Open from a returns page and Nobi already knows what the visitor wants.",
    },
    {
      icon: Sparkles,
      title: "Trigger actions from inside the conversation",
      desc: "Configure Nobi to call your own JS functions at the right moment. Book a table, submit a return request, or open a scheduling modal, all from inside the chat.",
    },
    {
      icon: LayoutGrid,
      title: "Works with any stack",
      desc: "The JS API is framework-agnostic. Works on Shopify, headless, custom React or Vue apps, plain HTML, anything that can run JavaScript.",
    },
  ];

  const steps = [
    {
      number: "1",
      title: "Add the script tag",
      desc: "Drop one line of JavaScript on your site. Nobi loads asynchronously so it never blocks your page.",
    },
    {
      number: "2",
      title: "Configure your actions",
      desc: "Define which actions Nobi can trigger from the dashboard. Map conversation triggers to your existing JavaScript functions.",
    },
    {
      number: "3",
      title: "Test and go live",
      desc: "Use the preview mode to walk through conversations and confirm each action fires correctly. Push live when you're ready.",
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
                Custom actions
              </p>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold leading-[1.1] text-slate-900">
                Trigger any workflow{" "}
                <span className={GRADIENT}>from the chat</span>
              </h1>

              <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
                Use the JS API to let Nobi book appointments, submit forms, open
                modals, or launch any workflow from inside a conversation.
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

        {/* Stats bar */}
        <section className="bg-gradient-to-b from-white via-slate-50 to-white py-16">
          <div className="mx-auto max-w-6xl xl:max-w-7xl px-6">
            <div className="grid gap-5 md:grid-cols-3">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-3xl border border-black/10 bg-white/70 p-8 shadow-sm"
                >
                  <div className={`text-4xl font-semibold ${GRADIENT}`}>
                    {stat.number}
                  </div>
                  <div className="mt-1 text-base font-semibold text-black/80">
                    {stat.label}
                  </div>
                  <p className="mt-3 text-sm text-black/60">{stat.desc}</p>
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
                Power and flexibility with a simple API
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
                Set up in three steps
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
                  Build custom workflows in minutes
                </h2>
                <p className="text-base text-slate-300">
                  See how the JS API makes it simple to trigger any action from
                  inside a conversation.
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
