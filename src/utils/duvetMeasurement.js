import { sendShopNobiEvent } from "./shopNobiOutboundClick.js";
const ProductionHosts = new Set(["nobi.ai", "www.nobi.ai"]);
const QaParameter = "nobi_qa";
const TrafficTags = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"];

/** Preserve existing acquisition tags on an internal handoff; never serialize measurements. */
export function duvetShoppingPath(search = "") {
  const incoming = new URLSearchParams(search);
  const params = new URLSearchParams({ nobi_tool: "duvet_cover_size" });
  for (const tag of TrafficTags) if (incoming.has(tag)) params.set(tag, incoming.get(tag));
  return `/shop/s/duvet-covers?${params}`;
}

/** Exclude preview copies and explicitly marked verification visits before event delivery. */
function isProductionComparison(browser) {
  try {
    const url = new URL(browser.location.href);
    return url.protocol === "https:" && ProductionHosts.has(url.hostname) && !url.searchParams.getAll(QaParameter).includes("1");
  } catch {
    return false;
  }
}

/** Record one valid production comparison per mount, excluding preview and nobi_qa=1 visits. */
export function createDuvetCompletionReporter(browser = globalThis) {
  let sent = false;
  return result => {
    if (sent || !result?.comparisons?.length || Object.keys(result.errors).length || !isProductionComparison(browser)) return;
    sent = true;
    sendShopNobiEvent("Shopper Utility Completed", { toolId: "duvet_cover_size", action: "compare_dimensions" }, browser);
  };
}
