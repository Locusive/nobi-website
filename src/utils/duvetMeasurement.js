import { sendShopNobiEvent } from "./shopNobiOutboundClick.js";
const TrafficTags = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"];

/** Preserve existing acquisition tags on an internal handoff; never serialize measurements. */
export function duvetShoppingPath(search = "") {
  const incoming = new URLSearchParams(search);
  const params = new URLSearchParams({ nobi_tool: "duvet_cover_size" });
  for (const tag of TrafficTags) if (incoming.has(tag)) params.set(tag, incoming.get(tag));
  return `/shop/s/duvet-covers?${params}`;
}

/** Record at most one valid comparison per page mount with fixed, non-measurement details. */
export function createDuvetCompletionReporter(browser = globalThis) {
  let sent = false;
  return result => {
    if (sent || !result?.comparisons?.length || Object.keys(result.errors).length) return;
    sent = true;
    sendShopNobiEvent("Shopper Utility Completed", { toolId: "duvet_cover_size", action: "compare_dimensions" }, browser);
  };
}
