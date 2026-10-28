// Renders a planned Shop Nobi web story as an AMP story, the format of Google Web Stories. Store links are a small
// nofollow line on each product page that goes through the API; the last page links back to the full search page.

import { htmlEscape } from "./prerender-blog.js";
import { StoryPageKind } from "./shop-nobi-web-story-plan.js";
import { BaseUrl, CommissionNotice, readStoreLinkRel } from "../src/utils/shopNobiPage.js";
import { describeSearchPage, formatPrice, searchPageUrl } from "../src/utils/shopNobiSearchPage.js";
import { webStoryUrl } from "../src/utils/shopNobiWebStory.js";
import { IndexableRobots, PortraitPosterSize } from "../src/utils/previewImage.js";
import { readProductPlacement } from "../src/utils/shopNobiProductPlacement.js";

const Publisher = "Nobi";
// A square copy of the Nobi icon on white, since Google asks for a logo without a see-through background.
const PublisherLogoUrl = `${BaseUrl}/shop-nobi-story-logo.png`;
const StoryTags = { utm_source: "google_web_stories", utm_medium: "referral", utm_campaign: "shop_nobi" };
const SearchCtaStorySlug = "sofas";
const SearchCtaTags = { ...StoryTags, utm_campaign: "story_to_search", utm_content: SearchCtaStorySlug };
const CoverLabel = "Shop Nobi guide";
const EndText = "The full page has every pick, the whole guide and more questions.";
const BackLinkText = "See every pick";
const SearchEndText = "Looking for a different fit? Search Shop Nobi for the style, size and budget you want.";
const SearchLinkText = "Search for your sofa";
const StoreLinkText = "See it at the store";
// The API counts the tap under a new conversation and forwards to the store link with it, since AMP cannot add one.
const StoreLinkRoute = "https://api.nobi.ai/v1/shop/story-go";
// The API records which product a product page showed, read from the id of the page in view, which AMP fills in.
const StoryViewRoute = "https://api.nobi.ai/v1/shop/story-view";
const StoryPageIdVariable = "${storyPageId}";
// Beacons only, so the story never waits on the API.
const BeaconTransport = { beacon: true, xhrpost: true, image: false };
// AMP requires this exact style block, which hides the page until the AMP script starts.
const AmpBoilerplate = "<style amp-boilerplate>body{-webkit-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-moz-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-ms-animation:-amp-start 8s steps(1,end) 0s 1 normal both;animation:-amp-start 8s steps(1,end) 0s 1 normal both}@-webkit-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-moz-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-ms-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-o-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}</style><noscript><style amp-boilerplate>body{-webkit-animation:none;-moz-animation:none;-ms-animation:none;animation:none}</style></noscript>";
const StoryStyle = [
  "amp-story{font-family:-apple-system,BlinkMacSystemFont,\"Segoe UI\",Roboto,Helvetica,Arial,sans-serif;color:#fff}",
  "amp-story-page{background:#111}",
  ".cover-text{align-content:end;padding:32px 24px 56px;background:linear-gradient(to top,rgba(0,0,0,.85),rgba(0,0,0,0) 65%)}",
  ".text-page{align-content:center;padding:32px 24px}",
  ".product-page{align-content:center;padding:32px 24px;background:#fff;color:#111}",
  ".label{margin:0 0 12px;font-size:14px;letter-spacing:.08em;text-transform:uppercase;opacity:.7}",
  "h1{margin:0 0 8px;font-size:32px;line-height:1.2}",
  "h2{margin:16px 0 8px;font-size:24px;line-height:1.3}",
  ".text{margin:0;font-size:22px;line-height:1.45}",
  ".detail{margin:4px 0 0;font-size:16px;opacity:.75}",
  ".store-link{display:inline-block;margin-top:12px;font-size:14px;color:inherit;opacity:.6}",
  ".commission-notice{margin:6px 0 0;font-size:12px;opacity:.5}",
].join("");

/**
 * Builds a story's whole HTML file.
 *
 * @param {object} page The built search page.
 * @param {{posterUrl: string, pages: object[]}} plan The story plan from planWebStory.
 * @returns {string} The AMP story HTML.
 */
export function renderWebStory(page, plan) {
  const title = htmlEscape(page.title);
  const description = htmlEscape(page.description || describeSearchPage(page.title));
  const storyPages = plan.pages.map((storyPage, index) => renderStoryPage(storyPage, index, page, plan));
  return [
    "<!doctype html>",
    '<html amp lang="en">',
    "<head>",
    '<meta charset="utf-8">',
    '<script async src="https://cdn.ampproject.org/v0.js"></script>',
    '<script async custom-element="amp-story" src="https://cdn.ampproject.org/v0/amp-story-1.0.js"></script>',
    '<script async custom-element="amp-analytics" src="https://cdn.ampproject.org/v0/amp-analytics-0.1.js"></script>',
    `<title>${title}</title>`,
    '<meta name="viewport" content="width=device-width">',
    `<meta name="description" content="${description}">`,
    `<meta name="robots" content="${IndexableRobots}">`,
    `<link rel="canonical" href="${htmlEscape(webStoryUrl(page.slug))}">`,
    AmpBoilerplate,
    `<style amp-custom>${StoryStyle}</style>`,
    "</head>",
    "<body>",
    `<amp-story standalone title="${title}" publisher="${Publisher}" publisher-logo-src="${PublisherLogoUrl}" poster-portrait-src="${htmlEscape(plan.posterUrl)}">`,
    renderViewTracking(page.slug),
    ...storyPages,
    "</amp-story>",
    "</body>",
    "</html>",
  ].join("\n") + "\n";
}

/**
 * Returns the search page's address with the tags that credit Google Web Stories for the visit.
 *
 * @param {string} slug The search page's slug.
 * @returns {string} The tagged address.
 */
export function taggedSearchPageUrl(slug) {
  const address = new URL(searchPageUrl(slug));
  Object.entries(StoryTags).forEach(([key, value]) => address.searchParams.set(key, value));
  return address.toString();
}

/**
 * Renders the analytics config that sends the id of each page a shopper sees. The API records the product of a product
 * page and ignores every other page. Bots are left out by the API, as their taps are.
 *
 * @param {string} slug The story's slug, sent as the page.
 * @returns {string} The amp-analytics element.
 */
function renderViewTracking(slug) {
  const storyViewUrl = `${StoryViewRoute}?page=${encodeURIComponent(slug)}&storyPage=${StoryPageIdVariable}`;
  const config = {
    requests: { storyView: storyViewUrl },
    triggers: { pageInView: { on: "story-page-visible", request: "storyView" } },
    transport: BeaconTransport,
  };
  return `<amp-analytics><script type="application/json">${JSON.stringify(config)}</script></amp-analytics>`;
}

/**
 * Renders one story page with an id made of its kind and position. A product page's id also names its place among the
 * story's products, its product variant and its store, which is how the API learns which product a shopper saw.
 */
function renderStoryPage(storyPage, index, page, plan) {
  const id = buildStoryPageId(storyPage, index, plan);
  const layers = renderLayers(storyPage, page, plan);
  return `<amp-story-page id="${id}">\n${layers}\n</amp-story-page>`;
}

/**
 * Builds a story page's id: "product-{place}-{product variant id}-{store id}" for a product with both ids, or its kind
 * and position for any other page.
 */
function buildStoryPageId(storyPage, index, plan) {
  const product = storyPage.product;
  if (storyPage.kind !== StoryPageKind.Product || !product.productVariantId || !product.owningMerchantId) {
    return `${storyPage.kind}-${index + 1}`;
  }

  const productPages = plan.pages.filter((planned) => planned.kind === StoryPageKind.Product);
  const place = productPages.indexOf(storyPage) + 1;
  const { placementReason } = readProductPlacement(product);
  const placement = typeof product.storyPaidLink === "boolean"
    ? `-${product.storyPaidLink ? "affiliate" : "direct"}-${placementReason || "unknown"}` : "";
  return `${StoryPageKind.Product}-${place}-${product.productVariantId}-${product.owningMerchantId}${placement}`;
}

/** Renders the layers of one story page for its kind. */
function renderLayers(storyPage, page, plan) {
  const title = htmlEscape(page.title);
  switch (storyPage.kind) {
    case StoryPageKind.Cover:
      return renderCover(page, plan.posterUrl);
    case StoryPageKind.Guide:
      return textLayer(`<p class="label">${title}</p><p class="text">${htmlEscape(storyPage.text)}</p>`);
    case StoryPageKind.Product:
      return renderProduct(storyPage.product, page.slug);
    case StoryPageKind.Question:
      return textLayer(`<h2>${htmlEscape(storyPage.question)}</h2><p class="text">${htmlEscape(storyPage.answer)}</p>`);
    default:
      return renderEnd(page);
  }
}

/** Renders the cover: the poster picture with the title and the updated date over it. */
function renderCover(page, posterUrl) {
  const title = htmlEscape(page.title);
  const updated = page.updatedDate ? `<p class="detail">Updated ${htmlEscape(page.updatedDate)}</p>` : "";
  const picture = `<amp-img src="${htmlEscape(posterUrl)}" width="${PortraitPosterSize.width}" height="${PortraitPosterSize.height}" layout="responsive" alt="${title}"></amp-img>`;
  return [
    `<amp-story-grid-layer template="fill">${picture}</amp-story-grid-layer>`,
    `<amp-story-grid-layer template="vertical" class="cover-text"><p class="label">${CoverLabel}</p><h1>${title}</h1>${updated}</amp-story-grid-layer>`,
  ].join("\n");
}

/** Renders a product: its picture, name, store and price, and a small nofollow link to the store. */
function renderProduct(product, slug) {
  const name = htmlEscape(product.name);
  const price = formatPrice(product.price, product.currency);
  const details = [
    `<amp-img src="${htmlEscape(product.imageUrl)}" width="1" height="1" layout="responsive" object-fit="contain" alt="${name}"></amp-img>`,
    `<h2>${name}</h2>`,
    product.storeName ? `<p class="detail">${htmlEscape(product.storeName)}</p>` : "",
    price ? `<p class="detail">${htmlEscape(price)}</p>` : "",
    renderStoreLink(product, slug),
  ];
  return `<amp-story-grid-layer template="vertical" class="product-page">${details.join("")}</amp-story-grid-layer>`;
}

/**
 * Renders the small nofollow store link. It goes through the API, which sends a person's tap through the affiliate link
 * when one pays us; its tooltip names the store's site. A paid link is sponsored and has a notice under it.
 *
 * @param {{url: string, paidLink: boolean}} product The product.
 * @param {string} slug The story's slug, sent as the page.
 * @returns {string} The link, and the notice when the link is paid.
 */
function renderStoreLink(product, slug) {
  const { placementReason } = readProductPlacement(product);
  const placement = placementReason ? `&placementReason=${placementReason}` : "";
  const linkThroughApi = `${StoreLinkRoute}?url=${encodeURIComponent(product.url)}&page=${encodeURIComponent(slug)}${placement}`;
  const tooltip = `data-tooltip-text="${htmlEscape(readStoreSite(product.url))}"`;
  const paidLink = typeof product.storyPaidLink === "boolean" ? product.storyPaidLink : product.paidLink;
  const rel = readStoreLinkRel(paidLink);
  const link = `<a class="store-link" href="${htmlEscape(linkThroughApi)}" ${tooltip} rel="${rel}" target="_blank">${StoreLinkText}</a>`;
  return paidLink ? `${link}<p class="commission-notice">${CommissionNotice}</p>` : link;
}

/** Reads the store's site name from its link, such as "lucchese.com", or the link itself when it cannot be read. */
function readStoreSite(storeUrl) {
  try {
    return new URL(storeUrl).hostname.replace(/^www\./, "");
  } catch {
    return storeUrl;
  }
}

/** Renders the last page, whose swipe-up link opens the full search page. */
function renderEnd(page) {
  const isSearchTest = page.slug === SearchCtaStorySlug;
  const destination = isSearchTest ? taggedStorySearchHomeUrl() : taggedSearchPageUrl(page.slug);
  const linkText = isSearchTest ? SearchLinkText : BackLinkText;
  const bodyText = isSearchTest ? SearchEndText : EndText;
  const backLink = `<a href="${htmlEscape(destination)}">${linkText}</a>`;
  return [
    textLayer(`<p class="label">${htmlEscape(page.title)}</p><p class="text">${bodyText}</p>`),
    `<amp-story-page-outlink layout="nodisplay">${backLink}</amp-story-page-outlink>`,
  ].join("\n");
}

/** Links the one test story to the search home without submitting a query for the visitor. */
function taggedStorySearchHomeUrl() {
  const address = new URL("/shop", BaseUrl);
  Object.entries(SearchCtaTags).forEach(([key, value]) => address.searchParams.set(key, value));
  return address.toString();
}

/** Wraps text in a centered layer on the dark background. */
function textLayer(content) {
  return `<amp-story-grid-layer template="vertical" class="text-page">${content}</amp-story-grid-layer>`;
}
