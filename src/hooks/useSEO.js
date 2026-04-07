import { useEffect } from "react";

const BASE_URL = "https://nobi.ai";
const DEFAULT_IMAGE = `${BASE_URL}/og-image.png`;

function upsertMeta(selector, value) {
  if (!value) return;
  let el = document.querySelector(selector);
  if (!el) {
    el = document.createElement("meta");
    const m = selector.match(/\[(property|name)="([^"]+)"\]/);
    if (m) el.setAttribute(m[1], m[2]);
    document.head.appendChild(el);
  }
  el.setAttribute("content", value);
}

function upsertLink(rel, href) {
  if (!href) return;
  let el = document.querySelector(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement("link");
    el.rel = rel;
    document.head.appendChild(el);
  }
  el.href = href;
}

function upsertSchema(id, data) {
  let el = document.getElementById(id);
  if (!el) {
    el = document.createElement("script");
    el.type = "application/ld+json";
    el.id = id;
    document.head.appendChild(el);
  }
  el.textContent = JSON.stringify(data);
}

/**
 * Sets per-page meta tags, canonical URL, Open Graph tags, and optionally a JSON-LD schema.
 *
 * @param {object} opts
 * @param {string}  opts.title       Full page title (e.g. "Pricing | Nobi")
 * @param {string}  opts.description Meta description (≤160 chars)
 * @param {string}  opts.path        URL path (e.g. "/pricing") — used for canonical
 * @param {string}  [opts.image]     OG image URL (defaults to /og-image.png)
 * @param {string}  [opts.type]      og:type (default "website")
 * @param {object}  [opts.schema]    JSON-LD schema object; null removes any existing schema
 */
export function useSEO({ title, description, path, image, type = "website", schema } = {}) {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    const canonical = path ? `${BASE_URL}${path}` : null;
    const ogImage = image || DEFAULT_IMAGE;

    if (title) document.title = title;
    upsertMeta('meta[name="description"]', description);
    upsertLink("canonical", canonical);

    upsertMeta('meta[property="og:type"]',        type);
    upsertMeta('meta[property="og:title"]',       title);
    upsertMeta('meta[property="og:description"]', description);
    upsertMeta('meta[property="og:url"]',         canonical);
    upsertMeta('meta[property="og:image"]',       ogImage);

    upsertMeta('meta[name="twitter:title"]',       title);
    upsertMeta('meta[name="twitter:description"]', description);
    upsertMeta('meta[name="twitter:image"]',       ogImage);

    if (schema) {
      upsertSchema("page-schema", schema);
    } else {
      document.getElementById("page-schema")?.remove();
    }
  });
}
