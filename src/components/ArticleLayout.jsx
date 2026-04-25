import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import { formatPostDate } from "../content/utils/mdxPostLoader";

export default function ArticleLayout({ meta, children }) {
  const {
    title,
    date,
    author,
    authorTitle,
    authorBio,
    authorPhoto,
    authorLinkedIn,
    tags = [],
    heroImage,
  } = meta || {};
  const formattedDate = formatPostDate(date);
  const hasRichByline = author && (authorPhoto || authorBio || authorLinkedIn || authorTitle);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-50 dark:from-[#0a0a0a] dark:to-black text-black dark:text-white">
      <Header />

      <article className="mx-auto max-w-5xl px-6 pt-14 pb-12 sm:pt-16 sm:pb-16 prose prose-slate dark:prose-invert prose-lg">
        <header className="not-prose mb-8">
          <p className="text-sm font-semibold text-fuchsia-600">Blog</p>
          <h1 className="mt-2 text-4xl sm:text-5xl font-semibold tracking-tight">{title}</h1>
          <div className="mt-3 text-sm text-black/60 dark:text-white/60 flex flex-wrap items-center gap-2">
            {formattedDate && <span>{formattedDate}</span>}
            {author && !hasRichByline && <span>• {author}</span>}
            {tags.length > 0 && (
              <span className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <span key={tag} className="px-2 py-1 rounded-full bg-black/5 dark:bg-white/10 text-xs font-semibold text-black/70 dark:text-white/70">
                    {tag}
                  </span>
                ))}
              </span>
            )}
          </div>
        </header>

        {heroImage && (
          <div className="not-prose mb-8">
            <img
              src={heroImage}
              alt={title || ""}
              className="w-full rounded-2xl border border-black/10 dark:border-white/10 shadow-sm object-cover"
              loading="lazy"
            />
          </div>
        )}

        {hasRichByline && (
          <div className="not-prose mb-10 flex items-start gap-4 rounded-2xl border border-black/5 dark:border-white/10 bg-black/[.02] dark:bg-white/[.03] p-4">
            {authorPhoto && (
              <img
                src={authorPhoto}
                alt={author || ""}
                className="h-14 w-14 rounded-full object-cover border border-black/10 dark:border-white/10 flex-shrink-0"
                loading="lazy"
              />
            )}
            <div className="text-sm text-black/80 dark:text-white/80">
              <div className="font-semibold text-black dark:text-white">
                {authorLinkedIn ? (
                  <a href={authorLinkedIn} target="_blank" rel="noopener" className="no-underline hover:underline">
                    {author}
                  </a>
                ) : author}
                {authorTitle && <span className="font-normal text-black/60 dark:text-white/60"> — {authorTitle}</span>}
              </div>
              {authorBio && <p className="mt-1 text-black/70 dark:text-white/70 leading-snug">{authorBio}</p>}
            </div>
          </div>
        )}

        <div className="article-body">
          {children}
        </div>
      </article>

      <Footer />
    </div>
  );
}
