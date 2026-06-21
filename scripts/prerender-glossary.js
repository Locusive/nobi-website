// Generate per-route HTML + markdown for every glossary term at build time,
// plus the /glossary index. Same rationale as prerender-blog.js: JS-blind
// crawlers (GPTBot, ClaudeBot, PerplexityBot, Bing) must see the definition
// prose and JSON-LD, since the whole point of the glossary is AEO citations.
//
// Reuses the MDX-parsing + markdown-rendering helpers from prerender-blog.js
// (imported, not duplicated). Run via: node scripts/prerender-glossary.js
// (chained from `build`, after prerender-blog.js).

import { readFileSync, writeFileSync, readdirSync, mkdirSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import {
  readMeta,
  renderBodyHtml,
  readMarkdownBody,
  htmlEscape,
  stripHomepageMeta,
} from "./prerender-blog.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const DIST = join(ROOT, "dist");
const GLOSSARY_DIR = join(ROOT, "src/content/glossary");
const SHELL = join(DIST, "index.html");
const BASE_URL = "https://nobi.ai";

function buildSchemas(meta, slug) {
  const url = `${BASE_URL}/glossary/${slug}`;
  const schemas = [
    {
      "@context": "https://schema.org",
      "@type": "DefinedTerm",
      "name": meta.term,
      "description": meta.definition || "",
      "inDefinedTermSet": `${BASE_URL}/glossary`,
      "url": url,
    },
  ];
  const faqs = Array.isArray(meta.faqItems) ? meta.faqItems : [];
  if (faqs.length) {
    schemas.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": faqs.map((i) => ({
        "@type": "Question",
        "name": i.question,
        "acceptedAnswer": { "@type": "Answer", "text": i.answer },
      })),
    });
  }
  return schemas;
}

function buildHeadInjection(meta, slug) {
  const url = `${BASE_URL}/glossary/${slug}`;
  const description = meta.definition || "";
  const schemas = buildSchemas(meta, slug);
  const tags = [
    `<link rel="canonical" href="${htmlEscape(url)}">`,
    `<link rel="alternate" type="text/markdown" href="${htmlEscape(url)}.md">`,
    `<meta property="og:type" content="article">`,
    `<meta property="og:url" content="${htmlEscape(url)}">`,
    `<meta property="og:title" content="${htmlEscape(meta.term || "Nobi Glossary")}">`,
    `<meta property="og:description" content="${htmlEscape(description)}">`,
    `<meta name="twitter:card" content="summary">`,
    `<meta name="twitter:title" content="${htmlEscape(meta.term || "Nobi Glossary")}">`,
    `<meta name="twitter:description" content="${htmlEscape(description)}">`,
    `<script type="application/ld+json" id="page-schema">${JSON.stringify(schemas)}</script>`,
  ];
  return tags.join("\n    ");
}

function injectShell(shell, { title, description, headBlock, bodyHtml }) {
  let html = stripHomepageMeta(shell);
  html = html.replace(
    "<!--__PRERENDER_TITLE__-->",
    `<title>${htmlEscape(title)}</title>`
  );
  html = html.replace(
    "<!--__PRERENDER_DESC__-->",
    `<meta name="description" content="${htmlEscape(description)}">\n    ${headBlock}`
  );
  if (bodyHtml) {
    html = html.replace(
      '<div id="root"></div>',
      `<div id="root"><article class="prerendered-article">\n${bodyHtml}\n</article></div>`
    );
  }
  return html;
}

function writeBoth(subdir, slug, html) {
  const dirPath = join(DIST, subdir, slug);
  mkdirSync(dirPath, { recursive: true });
  writeFileSync(join(dirPath, "index.html"), html);
  writeFileSync(join(DIST, subdir, `${slug}.html`), html);
}

function buildMarkdown(meta, slug, mdBody) {
  const url = `${BASE_URL}/glossary/${slug}`;
  const parts = [`# ${meta.term || "Glossary term"}`, ""];
  if (meta.definition) parts.push(`> ${meta.definition}`, "");
  parts.push(`_Source: ${url}_`, "", mdBody, "");
  return parts.join("\n");
}

function buildIndex(metas, shell) {
  // Index head: DefinedTermSet schema over all terms.
  const schema = {
    "@context": "https://schema.org",
    "@type": "DefinedTermSet",
    "name": "Nobi Glossary",
    "description": "Definitions of AI search, ecommerce, and dealership terms.",
    "url": `${BASE_URL}/glossary`,
    "hasDefinedTerm": metas.map((m) => ({
      "@type": "DefinedTerm",
      "name": m.term,
      "description": m.definition || "",
      "url": `${BASE_URL}/glossary/${m.slug}`,
    })),
  };
  const headBlock = [
    `<link rel="canonical" href="${BASE_URL}/glossary">`,
    `<meta property="og:type" content="website">`,
    `<meta property="og:url" content="${BASE_URL}/glossary">`,
    `<meta property="og:title" content="Glossary | Nobi">`,
    `<script type="application/ld+json" id="page-schema">${JSON.stringify([schema])}</script>`,
  ].join("\n    ");
  // Body: a simple definition list so JS-blind crawlers read every term.
  const sorted = [...metas].sort((a, b) => a.term.localeCompare(b.term));
  const bodyHtml =
    "<h1>Glossary</h1>\n" +
    sorted
      .map(
        (m) =>
          `<h2><a href="/glossary/${m.slug}">${htmlEscape(m.term)}</a></h2>\n<p>${htmlEscape(m.definition || "")}</p>`
      )
      .join("\n");
  const html = injectShell(shell, {
    title: "Glossary of AI Search & Ecommerce Terms | Nobi",
    description:
      "Plain-English definitions of AI search, ecommerce, and dealership terms - what each means, how it works, and why it matters.",
    headBlock,
    bodyHtml,
  });
  const dirPath = join(DIST, "glossary");
  mkdirSync(dirPath, { recursive: true });
  writeFileSync(join(dirPath, "index.html"), html);
}

function main() {
  if (!existsSync(SHELL)) {
    console.warn("prerender-glossary: dist/index.html not found - run 'vite build' first. Skipping.");
    return;
  }
  if (!existsSync(GLOSSARY_DIR)) {
    console.log("prerender-glossary: no glossary dir, skipping.");
    return;
  }
  const shell = readFileSync(SHELL, "utf8");
  const files = readdirSync(GLOSSARY_DIR).filter((f) => f.endsWith(".mdx"));
  const metas = [];
  let written = 0;
  let skipped = 0;

  for (const file of files) {
    const path = join(GLOSSARY_DIR, file);
    const meta = readMeta(path);
    if (!meta || !meta.slug || meta.draft === true) {
      skipped++;
      continue;
    }
    try {
      const headBlock = buildHeadInjection(meta, meta.slug);
      const bodyHtml = renderBodyHtml(path);
      const html = injectShell(shell, {
        title: `What Is ${meta.term}? | Nobi Glossary`,
        description: meta.definition || "",
        headBlock,
        bodyHtml,
      });
      writeBoth("glossary", meta.slug, html);
      writeFileSync(
        join(DIST, "glossary", `${meta.slug}.md`),
        buildMarkdown(meta, meta.slug, readMarkdownBody(path))
      );
      metas.push({ term: meta.term, slug: meta.slug, definition: meta.definition || "" });
      written++;
    } catch (e) {
      console.warn(`prerender-glossary: failed for ${meta.slug}: ${e.message}`);
      skipped++;
    }
  }

  if (metas.length) buildIndex(metas, shell);
  console.log(`✓ prerender-glossary — ${written} terms + index (${skipped} skipped)`);
}

main();
