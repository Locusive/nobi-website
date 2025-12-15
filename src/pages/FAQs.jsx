import React from "react";
import PageLayout from "../components/PageLayout";
import FAQ, { FAQ_ITEMS } from "../components/FAQ";

export default function FAQs() {
  return (
    <PageLayout>
      <div className="bg-gradient-to-b from-white to-slate-50 dark:from-[#0a0a0a] dark:to-black text-black dark:text-white">
        <div className="mx-auto max-w-6xl px-6 pt-16 pb-12 sm:pt-20 sm:pb-14 text-center">
          <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight">
            Frequently Asked Questions
          </h1>
          <p className="mt-3 text-base sm:text-lg text-black/70 dark:text-white/70 max-w-2xl mx-auto">
            Quick answers about installing, A/B testing, and rolling Nobi out across search, collections, and PDPs.
          </p>
        </div>

        <FAQ
          id="faqs-list"
          title=""
          description=""
          padding="pb-14 sm:pb-16"
          sectionClassName="mx-auto max-w-6xl px-6"
          columns={2}
        />
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": FAQ_ITEMS.map((item) => ({
              "@type": "Question",
              "name": item.q,
              "acceptedAnswer": {
                "@type": "Answer",
                "text": item.a,
              },
            })),
          }),
        }}
      />
    </PageLayout>
  );
}
