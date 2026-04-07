import React from "react";
import { useParams } from "react-router-dom";
import { MDXProvider } from "@mdx-js/react";
import { useSEO } from "../hooks/useSEO";
import ArticleLayout from "../components/ArticleLayout";
import { getPostBySlug } from "../content/utils/mdxPostLoader";

const components = {};

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
    "dateModified": meta.publishedAt || meta.date,
    "image": meta.heroImage ? `https://nobi.ai${meta.heroImage}` : undefined,
    "author": { "@type": "Person", "name": meta.author || "Nobi Team" },
    "publisher": { "@type": "Organization", "name": "Nobi", "url": "https://nobi.ai" },
    "mainEntityOfPage": { "@type": "WebPage", "@id": `https://nobi.ai/blog/${post.slug}` },
    "description": meta.description || meta.excerpt || "",
  } : null;

  const schema = articleSchema ? [
    articleSchema,
    ...(meta.faqItems ? [{
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
    title: meta?.title ? `${meta.title} | Nobi` : undefined,
    description: meta?.description || meta?.excerpt || undefined,
    path: post ? `/blog/${post.slug}` : undefined,
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
        <Component />
      </MDXProvider>
    </ArticleLayout>
  );
}
