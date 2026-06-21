// Generate per-route HTML for every blog post at build time.
//
// Why: Without this, the Cloudflare Pages deploy serves a single
// SPA shell (dist/index.html) for every URL. The shell carries the
// homepage <title>, og:* tags, and only Organization + WebSite
// JSON-LD - nothing article-specific. Crawlers that don't render
// JavaScript (Bing, AI training crawlers, social link previewers
// like LinkedIn / Twitter / Slack / Discord) see the homepage data
// when they fetch a blog URL. Even crawlers that render JS pay a
// freshness/reliability tax for waiting on hydration.
//
// What this does: after `vite build`, for every shipped .mdx in
// src/content/posts/, write dist/blog/<slug>/index.html with the
// article's title, meta description, og/twitter tags, canonical
// link, and Article + FAQPage + ItemList JSON-LD schemas injected
// into the head, AND the rendered article body injected inside
// <div id="root">. React's createRoot() clears and replaces #root on
// mount, so real users get the live SPA while JS-blind crawlers
// (GPTBot, ClaudeBot, PerplexityBot, Bing) can read the actual prose
// they'd otherwise never see - the part they cite.
//
// It also writes dist/blog/<slug>.md - a clean-markdown copy of each
// article (title, description, prose; no nav, CSS, or widgets) served
// at /blog/<slug>.md. AI fetchers increasingly request a .md variant
// to get plain text instead of digging prose out of the DOM; each
// prerendered page advertises its copy via <link rel="alternate"
// type="text/markdown">.
//
// Run via: node scripts/prerender-blog.js (chained from `build`).

import { readFileSync, writeFileSync, readdirSync, mkdirSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import vm from "vm";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT      = join(__dirname, "..");
const DIST      = join(ROOT, "dist");
const POSTS_DIR = join(ROOT, "src/content/posts");
const SHELL     = join(DIST, "index.html");
const BASE_URL  = "https://nobi.ai";

// Customer profiles for author bio. Mirrors src/content/authors.json
// at runtime; we read it for the schema author block but the page's
// visible byline is rendered client-side from the same source.
function loadAuthorsJson() {
  const path = join(ROOT, "src/content/authors.json");
  try {
    return JSON.parse(readFileSync(path, "utf8"));
  } catch {
    return {};
  }
}

// Pull the `export const meta = {...};` block out of an .mdx file
// and evaluate it in a sandboxed VM context. Safer than eval; the
// MDX files are checked into our repo so we trust the input but
// still want isolation.
export function readMeta(mdxPath) {
  const content = readFileSync(mdxPath, "utf8");
  const match = content.match(/export const meta\s*=\s*(\{[\s\S]*?\n\s*\};)/);
  if (!match) return null;
  // The match includes the trailing `};` - strip it before evaluating.
  const body = match[1].replace(/;\s*$/, "");
  try {
    return vm.runInNewContext(`(${body})`, {}, { timeout: 1000 });
  } catch (e) {
    console.warn(`prerender: failed to parse meta in ${mdxPath}: ${e.message}`);
    return null;
  }
}

// Escape any character that would break out of an HTML attribute or
// element body. Used for content we inject into the head (title,
// description, og:* values).
export function htmlEscape(s) {
  if (s === null || s === undefined) return "";
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// ── Article body rendering ──────────────────────────────────────────
// Crawlers that don't run JS (GPTBot, ClaudeBot, PerplexityBot, Bing)
// fetch the page and read the HTML. Without the article body in that
// HTML they see only the <head> schema - not the prose they'd cite.
// We render the MDX body to static HTML and drop it inside #root.
// React's createRoot() clears #root and re-renders on mount, so real
// users never see this copy - it exists purely for JS-blind fetchers.

// Pull the markdown body (everything after the meta block) and strip
// the things a crawler shouldn't or can't use: the JSON-LD script
// (already in <head>), import lines, and JSX/custom-element widgets.
function readBody(mdxPath) {
  const content = readFileSync(mdxPath, "utf8");
  const m = content.match(/export const meta\s*=\s*\{[\s\S]*?\n\s*\};/);
  if (!m) return "";
  let body = content.slice(m.index + m[0].length);
  body = body.replace(/<script[\s\S]*?<\/script>/gi, "");
  body = body.replace(/^import .*$/gm, "");
  // Paired JSX component blocks (<Comp ...> ... </Comp>) and custom
  // elements (<nobi-button ...> ... </nobi-button>) - interactive
  // widgets with no crawler-relevant prose.
  body = body.replace(/<([A-Z][A-Za-z0-9]*)\b[^>]*>[\s\S]*?<\/\1>/g, "");
  body = body.replace(/<([a-z]+-[a-z-]+)\b[^>]*>[\s\S]*?<\/\1>/g, "");
  // Self-closing JSX / custom elements (<BlogQualifier ... />).
  body = body.replace(/<[A-Za-z][\w-]*\b[^>]*\/>/g, "");
  return body.trim();
}

// Like readBody, but produces clean *markdown* for the .md endpoint
// rather than markdown destined for HTML conversion. readBody leaves
// lowercase HTML wrappers (the <div className="..."> CTA blocks, inline
// <a> links, and the FAQ-accordion JSX template) untouched - harmless
// when we render to HTML, but noise in a plain-text .md file. Clean
// those up while preserving real prose, links, and code examples.
export function readMarkdownBody(mdxPath) {
  const content = readFileSync(mdxPath, "utf8");
  const meta = content.match(/export const meta\s*=\s*\{[\s\S]*?\n\s*\};/);
  if (!meta) return "";
  let md = content.slice(meta.index + meta[0].length);

  // Protect fenced code blocks - install snippets contain literal HTML
  // (<nobi-search-bar>, </head>) that must survive verbatim.
  const fences = [];
  md = md.replace(/```[\s\S]*?```/g, (m) => {
    fences.push(m);
    return `%%FENCE${fences.length - 1}%%`;
  });

  // JSON-LD script (already in <head>) and import lines.
  md = md.replace(/<script[\s\S]*?<\/script>/gi, "");
  md = md.replace(/^import .*$/gm, "");
  // FAQ-accordion JSX map. The real Q&A lives in frontmatter and is
  // re-emitted by buildMarkdown, so drop the template here.
  md = md.replace(/\{[\s\S]*?\.map\([\s\S]*?\)\)\}/g, "");
  // Paired JSX components (<Comp>...</Comp>) and custom elements
  // (<nobi-button>...</nobi-button>) - interactive widgets, no prose.
  md = md.replace(/<([A-Z][A-Za-z0-9]*)\b[^>]*>[\s\S]*?<\/\1>/g, "");
  md = md.replace(/<([a-z]+-[a-z-]+)\b[^>]*>[\s\S]*?<\/\1>/g, "");
  md = md.replace(/<[A-Za-z][\w-]*\b[^>]*\/>/g, "");
  // Paired <div>...</div> wrappers (CTA buttons).
  md = md.replace(/<div\b[^>]*>[\s\S]*?<\/div>/gi, "");
  // Inline <a href="...">text</a> -> [text](url), keeping the link.
  md = md.replace(/<a\b[^>]*\bhref="([^"]+)"[^>]*>([\s\S]*?)<\/a>/gi, "[$2]($1)");
  // Any remaining real HTML tags (keep inner text). Requiring a leading
  // letter/slash avoids eating a "<" used as a comparison operator.
  md = md.replace(/<\/?[a-zA-Z][\w-]*(?:\s[^>]*)?>/g, "");
  // A bare "---" horizontal rule reads as stray syntax once widgets are
  // gone; drop it. Then collapse the blank lines the removals leave.
  md = md.replace(/^\s*---\s*$/gm, "");
  md = md.replace(/[ \t]+$/gm, "");
  md = md.replace(/\n{3,}/g, "\n\n");

  // Restore code fences.
  md = md.replace(/%%FENCE(\d+)%%/g, (_, i) => fences[Number(i)]);
  return md.trim();
}

// Assemble the served markdown file: an H1 title, the description as a
// blockquote, a source link back to the canonical URL, the prose, and
// the article's FAQs (from frontmatter). This is what an AI fetcher
// gets when it requests /blog/<slug>.md - plain text, no nav, no CSS,
// no DOM to dig through.
function buildMarkdown(meta, slug, mdBody) {
  const url = `${BASE_URL}/blog/${slug}`;
  const parts = [`# ${meta.title || "Nobi"}`, ""];
  const desc = meta.description || meta.excerpt || "";
  if (desc) parts.push(`> ${desc}`, "");
  parts.push(`_Source: ${url}_`, "", mdBody, "");

  // Append real FAQs from frontmatter. Skip the "1. Nobi" numbered
  // vendor pseudo-FAQs the assembler stores in the same array, and skip
  // any whose question already appears in the prose (no duplication).
  const faqs = (Array.isArray(meta.faqItems) ? meta.faqItems : []).filter(
    (i) =>
      i && i.question && i.answer &&
      !/^\d+\.\s+/.test(i.question) &&
      !mdBody.includes(i.question)
  );
  if (faqs.length) {
    parts.push("## Frequently asked questions", "");
    for (const f of faqs) parts.push(`### ${f.question}`, "", f.answer, "");
  }
  return parts.join("\n").replace(/\n{3,}/g, "\n\n");
}

// Inline markdown -> HTML: links, bold, italic. HTML is escaped first,
// so the URL/text inside a link are already escaped when we wrap them.
function mdInline(s) {
  let e = htmlEscape(s);
  e = e.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (mt, t, u) => `<a href="${u}">${t}</a>`);
  e = e.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  e = e.replace(/(^|[^*])\*([^*]+)\*(?!\*)/g, "$1<em>$2</em>");
  return e;
}

function renderTable(rows) {
  const cells = rows.map((l) =>
    l.replace(/^\s*\|/, "").replace(/\|\s*$/, "").split("|").map((c) => c.trim())
  );
  if (cells.length < 2) return "";
  const th = cells[0].map((c) => `<th>${mdInline(c)}</th>`).join("");
  const trs = cells
    .slice(2) // row 1 is the |---|---| separator
    .map((r) => `<tr>${r.map((c) => `<td>${mdInline(c)}</td>`).join("")}</tr>`)
    .join("");
  return `<table><thead><tr>${th}</tr></thead><tbody>${trs}</tbody></table>`;
}

// Convert the subset of markdown our MDX bodies use: ##/### headings,
// paragraphs, - bullet lists, and | tables |. Good enough for crawler
// extraction; React renders the real thing for humans.
function mdToHtml(md) {
  const lines = md.split("\n");
  const out = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (!line.trim()) { i++; continue; }
    const h = line.match(/^(#{1,4})\s+(.*)$/);
    if (h) {
      const lvl = h[1].length;
      out.push(`<h${lvl}>${mdInline(h[2].trim())}</h${lvl}>`);
      i++;
      continue;
    }
    if (line.trim().startsWith("|")) {
      const tbl = [];
      while (i < lines.length && lines[i].trim().startsWith("|")) { tbl.push(lines[i]); i++; }
      out.push(renderTable(tbl));
      continue;
    }
    if (/^\s*[-*]\s+/.test(line)) {
      const items = [];
      while (i < lines.length && /^\s*[-*]\s+/.test(lines[i])) {
        items.push(`<li>${mdInline(lines[i].replace(/^\s*[-*]\s+/, ""))}</li>`);
        i++;
      }
      out.push(`<ul>${items.join("")}</ul>`);
      continue;
    }
    const para = [];
    while (
      i < lines.length && lines[i].trim() &&
      !/^#{1,4}\s/.test(lines[i]) &&
      !lines[i].trim().startsWith("|") &&
      !/^\s*[-*]\s+/.test(lines[i])
    ) { para.push(lines[i].trim()); i++; }
    if (para.length) out.push(`<p>${mdInline(para.join(" "))}</p>`);
  }
  return out.join("\n");
}

export function renderBodyHtml(mdxPath) {
  const body = readBody(mdxPath);
  return body ? mdToHtml(body) : "";
}

// Resolve a heroImage value to an absolute URL. The frontmatter can
// carry either a relative `/media/...` path or a fully-qualified
// `https://storage.googleapis.com/...` URL; both are valid. og:image
// requires absolute.
function resolveImage(heroImage) {
  if (!heroImage) return `${BASE_URL}/og-image.png`;
  if (/^https?:\/\//i.test(heroImage)) return heroImage;
  return `${BASE_URL}${heroImage}`;
}

// Build the JSON-LD schema array for an article. Mirrors the runtime
// schema generated by src/pages/BlogPost.jsx so a JS-aware crawler
// and a JS-blind crawler see the same structured data.
function buildSchemas(meta, slug) {
  const article = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": meta.title,
    "datePublished": meta.date,
    "dateModified": meta.lastUpdated || meta.publishedAt || meta.date,
    "image": resolveImage(meta.heroImage),
    "author": { "@type": "Person", "name": meta.author || "Nobi Team" },
    "publisher": { "@type": "Organization", "name": "Nobi", "url": "https://nobi.ai" },
    "mainEntityOfPage": { "@type": "WebPage", "@id": `${BASE_URL}/blog/${slug}` },
    "description": meta.description || meta.excerpt || "",
  };

  const schemas = [article];

  // FAQPage: real FAQs only, not vendor sections shaped like "1. Nobi".
  const faqItems = Array.isArray(meta.faqItems) ? meta.faqItems : [];
  const numberedVendor = /^\d+\.\s+/;
  const realFaqs = faqItems.filter(
    (i) => i && i.question && !numberedVendor.test(i.question)
  );
  if (realFaqs.length > 0) {
    schemas.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": realFaqs.map((i) => ({
        "@type": "Question",
        "name": i.question,
        "acceptedAnswer": { "@type": "Answer", "text": i.answer },
      })),
    });
  }

  // ItemList: derived from numbered vendor entries in faqItems
  // (the assembler writes vendor sections as "1. Nobi", "2. Algolia"
  // questions). Required for "best of" SERP rich-result eligibility.
  const vendorEntries = faqItems
    .filter((i) => i && i.question && numberedVendor.test(i.question))
    .map((i, idx) => {
      const m = i.question.match(/^\d+\.\s+(.+)$/);
      const name = m ? m[1].trim() : null;
      if (!name) return null;
      return {
        "@type": "ListItem",
        "position": idx + 1,
        "name": name,
        "url": `${BASE_URL}/blog/${slug}#${name.toLowerCase().replace(/\s+/g, "-")}`,
      };
    })
    .filter(Boolean);
  if (vendorEntries.length >= 2) {
    schemas.push({
      "@context": "https://schema.org",
      "@type": "ItemList",
      "itemListElement": vendorEntries,
    });
  }

  return schemas;
}

// Build the head injection block for one article. Replaces the
// homepage's title/og/twitter/canonical with article-specific values
// and adds the per-article JSON-LD schemas.
function buildHeadInjection(meta, slug) {
  const url = `${BASE_URL}/blog/${slug}`;
  const title = meta.title ? `${meta.title} | Nobi` : "Nobi";
  const description = meta.description || meta.excerpt || "";
  const image = resolveImage(meta.heroImage);
  const schemas = buildSchemas(meta, slug);

  // The article's <title> and <meta name="description"> are written
  // separately (via the title/description placeholders that replace
  // the homepage versions). This block is everything else: canonical,
  // og:*, twitter:*, plus the JSON-LD schemas. Don't include title or
  // description here or they end up duplicated in the rendered HTML.
  const tags = [
    `<link rel="canonical" href="${htmlEscape(url)}">`,
    // Advertise the clean-markdown copy of this page. AI fetchers that
    // prefer plain text over a JS-rendered DOM can follow this instead.
    `<link rel="alternate" type="text/markdown" href="${htmlEscape(url)}.md">`,
    `<meta property="og:type" content="article">`,
    `<meta property="og:url" content="${htmlEscape(url)}">`,
    `<meta property="og:title" content="${htmlEscape(meta.title || "Nobi")}">`,
    `<meta property="og:description" content="${htmlEscape(description)}">`,
    `<meta property="og:image" content="${htmlEscape(image)}">`,
    `<meta name="twitter:card" content="summary_large_image">`,
    `<meta name="twitter:title" content="${htmlEscape(meta.title || "Nobi")}">`,
    `<meta name="twitter:description" content="${htmlEscape(description)}">`,
    `<meta name="twitter:image" content="${htmlEscape(image)}">`,
  ];
  // Single script tag with id="page-schema" so useSEO finds and
  // updates the same element instead of creating a duplicate after
  // hydration. The runtime hook writes its array of schemas into the
  // same id; we mirror its shape here. If the array is just one
  // schema, useSEO writes a single object - we keep the array form
  // for consistency.
  if (schemas.length > 0) {
    tags.push(
      `<script type="application/ld+json" id="page-schema">${JSON.stringify(schemas)}</script>`
    );
  }
  return tags.join("\n    ");
}

// Strip the homepage's article-irrelevant head content from the SPA
// shell so the per-article values we inject aren't competing with
// stale homepage tags. We replace specific tag sets, not the whole
// head, so the Vite-injected scripts/styles stay intact.
export function stripHomepageMeta(shell) {
  let out = shell;

  // Replace the static <title>.
  out = out.replace(
    /<title>[^<]*<\/title>/,
    "<!--__PRERENDER_TITLE__-->"
  );

  // Replace the homepage's <meta name="description">.
  out = out.replace(
    /<meta\s+name="description"\s+content="[^"]*"\s*\/?>\s*/,
    "<!--__PRERENDER_DESC__-->"
  );

  // Replace homepage og:* and twitter:* tags. The Vite shell emits
  // these statically pointing at "/" - swap them all.
  out = out.replace(
    /<meta\s+property="og:[^"]*"\s+content="[^"]*"\s*\/?>\s*/g,
    ""
  );
  out = out.replace(
    /<meta\s+name="twitter:[^"]*"\s+content="[^"]*"\s*\/?>\s*/g,
    ""
  );

  return out;
}

function prerenderOne(meta, slug, shell, bodyHtml) {
  const headBlock = buildHeadInjection(meta, slug);
  let html = stripHomepageMeta(shell);

  // Drop the per-article block in place of the title/description
  // placeholders we just inserted. Keeps the rest of the head
  // (Vite scripts, GTM, MCP, theme color, fonts) untouched.
  html = html.replace(
    "<!--__PRERENDER_TITLE__-->",
    `<title>${htmlEscape(meta.title ? `${meta.title} | Nobi` : "Nobi")}</title>`
  );
  html = html.replace(
    "<!--__PRERENDER_DESC__-->",
    `<meta name="description" content="${htmlEscape(meta.description || meta.excerpt || "")}">\n    ${headBlock}`
  );

  // Inject the rendered article body INSIDE #root. createRoot() clears
  // and replaces #root on mount, so real users never see this copy -
  // it exists only so JS-blind crawlers can read (and cite) the prose.
  if (bodyHtml) {
    html = html.replace(
      '<div id="root"></div>',
      `<div id="root"><article class="prerendered-article">\n${bodyHtml}\n</article></div>`
    );
  }

  // Write BOTH dist/blog/<slug>.html AND dist/blog/<slug>/index.html
  // so the prerendered file is served regardless of trailing-slash
  // form. Cloudflare Pages (and vite preview) match the slugless URL
  // /blog/<slug> against <slug>.html when that file exists; the
  // trailing-slash form /blog/<slug>/ matches the index.html under
  // the directory. Without both, the no-slash URL (which the sitemap
  // and internal links use) falls through to the SPA shell.
  const dirPath = join(DIST, "blog", slug);
  mkdirSync(dirPath, { recursive: true });
  writeFileSync(join(dirPath, "index.html"), html);
  // Flat file alongside the directory; the slugless URL resolves to
  // <slug>.html. mkdirSync above guarantees dist/blog/ exists.
  writeFileSync(join(DIST, "blog", `${slug}.html`), html);
}

function main() {
  if (!existsSync(SHELL)) {
    console.warn(
      `prerender: dist/index.html not found - run 'vite build' first. Skipping.`
    );
    return;
  }
  const shell = readFileSync(SHELL, "utf8");

  const today = new Date().toISOString().slice(0, 10);
  const files = readdirSync(POSTS_DIR).filter((f) => f.endsWith(".mdx"));
  let written = 0;
  let skipped = 0;

  for (const file of files) {
    const meta = readMeta(join(POSTS_DIR, file));
    if (!meta || !meta.slug) {
      skipped++;
      continue;
    }
    if (meta.draft === true) {
      skipped++;
      continue;
    }
    // Skip future-dated posts (consistent with the sitemap).
    const publishDate = meta.publishedAt || meta.date;
    if (publishDate && publishDate > today) {
      skipped++;
      continue;
    }
    try {
      const bodyHtml = renderBodyHtml(join(POSTS_DIR, file));
      prerenderOne(meta, meta.slug, shell, bodyHtml);
      // Also emit a clean-markdown copy at /blog/<slug>.md for AI
      // fetchers that ask for plain text instead of HTML.
      const mdBody = readMarkdownBody(join(POSTS_DIR, file));
      writeFileSync(
        join(DIST, "blog", `${meta.slug}.md`),
        buildMarkdown(meta, meta.slug, mdBody)
      );
      written++;
    } catch (e) {
      console.warn(`prerender: failed for ${meta.slug}: ${e.message}`);
      skipped++;
    }
  }

  console.log(`✓ prerender — ${written} blog posts (${skipped} skipped)`);
}

// Run the blog prerender only when this file is executed directly, not when
// another script (prerender-glossary.js) imports its helpers.
if (process.argv[1] && process.argv[1].endsWith("prerender-blog.js")) {
  main();
}
