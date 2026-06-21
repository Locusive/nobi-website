import React from "react";
import { useParams } from "react-router-dom";
import { MDXProvider } from "@mdx-js/react";
import { useSEO } from "../hooks/useSEO";
import GlossaryLayout from "../components/GlossaryLayout";
import { getTermBySlug } from "../content/utils/mdxGlossaryLoader";

const components = {
  table: (props) => (
    <div className="my-6 overflow-x-auto">
      <table {...props} />
    </div>
  ),
};

export default function GlossaryTerm() {
  const { slug } = useParams();
  const entry = getTermBySlug(slug);
  const meta = entry?.meta;

  const origin = typeof window !== "undefined" ? window.location.origin : "https://nobi.ai";
  const schema = entry ? [
    {
      "@context": "https://schema.org",
      "@type": "DefinedTerm",
      "name": meta.term,
      "description": meta.definition,
      "inDefinedTermSet": `${origin}/glossary`,
      "url": `${origin}/glossary/${entry.slug}`,
    },
    ...(meta.faqItems?.length ? [{
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": meta.faqItems.map((item) => ({
        "@type": "Question",
        "name": item.question,
        "acceptedAnswer": { "@type": "Answer", "text": item.answer },
      })),
    }] : []),
  ] : null;

  useSEO({
    title: meta?.term ? `What Is ${meta.term}? | Nobi Glossary` : undefined,
    description: meta?.definition || undefined,
    path: entry ? `/glossary/${entry.slug}` : undefined,
    type: "article",
    schema,
  });

  if (!entry) {
    return (
      <GlossaryLayout meta={{ term: "Term not found" }}>
        <p>Sorry, we couldn't find that glossary term. <a href="/glossary">Browse the glossary</a>.</p>
      </GlossaryLayout>
    );
  }

  const { Component } = entry;

  return (
    <GlossaryLayout meta={meta}>
      <MDXProvider components={components}>
        <Component components={components} />
      </MDXProvider>

      {meta.related?.href && (
        <p className="not-prose mt-10 text-sm text-black/70 dark:text-white/70">
          Related reading:{" "}
          <a className="font-semibold text-fuchsia-600 hover:underline" href={meta.related.href}>
            {meta.related.label || "Learn more"}
          </a>
        </p>
      )}

      <div className="not-prose mt-8 rounded-2xl border border-black/10 dark:border-white/10 bg-black/[.02] dark:bg-white/[.03] p-6">
        <p className="text-base text-black/80 dark:text-white/80">
          Nobi is a conversational website assistant that combines product
          search, automated shopper Q&amp;A, and lead generation in one product.
        </p>
        <a
          href="https://dashboard.nobi.ai"
          className="mt-4 inline-flex items-center justify-center rounded-2xl bg-black text-white dark:bg-white dark:text-black px-5 h-11 text-sm font-medium no-underline hover:opacity-90"
        >
          Get started with Nobi
        </a>
      </div>
    </GlossaryLayout>
  );
}
