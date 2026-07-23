import React from "react";
import Nav from "./home/Nav";
import SiteFooter from "./home/SiteFooter";

// Lightweight layout for a single glossary entry. Unlike ArticleLayout (blog),
// there is no hero, author byline, or date - a glossary term is a structured
// reference definition, not a dated post.
export default function GlossaryLayout({ meta, children }) {
  const { term, category, definition } = meta || {};

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-50 dark:from-[#0a0a0a] dark:to-black text-black dark:text-white">
      <Nav />

      <article className="mx-auto max-w-3xl px-6 pt-32 pb-12 sm:pt-36 sm:pb-16 prose prose-slate dark:prose-invert prose-lg">
        <header className="not-prose mb-8">
          <a
            href="/glossary"
            className="text-sm font-semibold text-fuchsia-600 no-underline hover:underline"
          >
            ← Glossary
          </a>
          <h1 className="mt-3 text-4xl sm:text-5xl font-semibold tracking-tight">{term}</h1>
          {category && (
            <div className="mt-3">
              <span className="px-2 py-1 rounded-full bg-black/5 dark:bg-white/10 text-xs font-semibold text-black/70 dark:text-white/70">
                {category}
              </span>
            </div>
          )}
          {definition && (
            <p className="mt-5 text-lg text-black/80 dark:text-white/80 leading-relaxed">
              {definition}
            </p>
          )}
        </header>

        {children}
      </article>

      <SiteFooter />
    </div>
  );
}
