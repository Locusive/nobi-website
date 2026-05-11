import React from "react";
import { useParams } from "react-router-dom";
import { MDXProvider } from "@mdx-js/react";
import { useSEO } from "../hooks/useSEO";
import ArticleLayout from "../components/ArticleLayout";
import { getPostBySlug } from "../content/utils/mdxPostLoader";
import BlogChatPrompt from "../components/BlogChatPrompt";
import BlogEmailCapture from "../components/BlogEmailCapture";

// Wrap MDX tables in a horizontally-scrollable container so wide
// comparison tables (6+ columns) scroll inside their own box on
// mobile rather than forcing the whole page to scroll sideways.
const components = {
  table: (props) => (
    <div className="my-6 overflow-x-auto">
      <table {...props} />
    </div>
  ),
  BlogChatPrompt,
  BlogEmailCapture,
};

export default function BlogPost() {
  const { slug } = useParams();
  const post = getPostBySlug(slug);

  // Build schema before hook call (hook must be called unconditionally)
  const meta = post?.meta;
  const articleSchema = post ? {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": meta.title,
    "datePublished": meta.date,
    // Use lastUpdated if explicitly set on a re-edited article, else
    // fall back to publishedAt, else the original date. This lets the
    // editor surface freshness ("Last updated 2026-05-04") on articles
    // that have had real content edits since publication.
    "dateModified": meta.lastUpdated || meta.publishedAt || meta.date,
    "image": meta.heroImage
      ? (meta.heroImage.startsWith("http") ? meta.heroImage : `https://nobi.ai${meta.heroImage}`)
      : undefined,
    "author": { "@type": "Person", "name": meta.author || "Nobi Team" },
    "publisher": { "@type": "Organization", "name": "Nobi", "url": "https://nobi.ai" },
    "mainEntityOfPage": { "@type": "WebPage", "@id": `https://nobi.ai/blog/${post.slug}` },
    "description": meta.description || meta.excerpt || "",
  } : null;

  // Derive ItemList schema for listicle articles (best-of, alternatives,
  // multi-vendor comparisons). The vendor entries live in faqItems as
  // questions shaped like "1. Nobi", "2. Algolia" - that's how the
  // assembler writes them. We pull each numbered vendor question out,
  // strip the leading number, and build the ItemList. Without this,
  // listicle articles aren't eligible for SERP rich-result treatment
  // (the "list-style" carousel Google shows for "best X" queries).
  const itemListSchema = (() => {
    if (!post || !meta.faqItems) return null;
    const vendorPattern = /^\d+\.\s+(.+)$/;
    const vendors = meta.faqItems
      .filter((item) => vendorPattern.test(item.question || ""))
      .map((item, idx) => {
        const m = (item.question || "").match(vendorPattern);
        return m ? {
          "@type": "ListItem",
          "position": idx + 1,
          "name": m[1].trim(),
          "url": `https://nobi.ai/blog/${post.slug}#${m[1].trim().toLowerCase().replace(/\s+/g, "-")}`,
        } : null;
      })
      .filter(Boolean);
    if (vendors.length < 2) return null;
    return {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "itemListElement": vendors,
    };
  })();

  const schema = articleSchema ? [
    articleSchema,
    ...(meta.faqItems ? [{
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": meta.faqItems
        // Vendor entries (faqItems with questions like "1. Nobi") are
        // the article's vendor sections, not real FAQs. Including them
        // in FAQPage schema misleads Google's PAA targeting. Filter
        // them out; they're already covered by ItemList schema.
        .filter((item) => !/^\d+\.\s+/.test(item.question || ""))
        .map((item) => ({
          "@type": "Question",
          "name": item.question,
          "acceptedAnswer": { "@type": "Answer", "text": item.answer },
        })),
    }] : []),
    ...(itemListSchema ? [itemListSchema] : []),
  ] : null;

  // Pass the article's hero image through to useSEO so the runtime
  // og:image matches what the build-time prerender wrote. Without
  // this, useSEO defaults to the homepage og-image and overwrites
  // the prerendered one after hydration. Resolves relative paths to
  // absolute URLs the same way BlogPost.jsx's article schema does.
  const ogImage = meta?.heroImage
    ? (meta.heroImage.startsWith("http") ? meta.heroImage : `https://nobi.ai${meta.heroImage}`)
    : undefined;

  useSEO({
    title: meta?.title ? `${meta.title} | Nobi` : undefined,
    description: meta?.description || meta?.excerpt || undefined,
    path: post ? `/blog/${post.slug}` : undefined,
    image: ogImage,
    type: "article",
    schema,
  });

  if (!post) {
    return (
      <ArticleLayout meta={{ title: "Not found" }}>
        <p>Sorry, we couldn't find that article.</p>
      </ArticleLayout>
    );
  }

  const { Component } = post;

  return (
    <ArticleLayout meta={meta}>
      <MDXProvider components={components}>
        <Component components={components} />
      </MDXProvider>
    </ArticleLayout>
  );
}
