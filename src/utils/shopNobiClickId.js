// A click id names the page and the visit a paid click came from, so a network's commission report can be
// traced back to them. It goes in the network's sub-ID slot, which the API fills with the channel name.

/** The most characters a click id may have, so it fits Skimlinks xcust and Rakuten u1. */
const ClickIdLimit = 50;
const VisitIdLength = 8;
const VisitIdBase = 36;
const ByteValueCount = 256;
const UnsafeClickIdCharacters = /[^A-Za-z0-9.-]/g;
/** Tracking tags never hold the sub-ID, even when the API puts the store link in a link without encoding it. */
const TrackingTagPrefix = "utm_";

/**
 * Makes a short random id for one page view, from lowercase letters and digits.
 *
 * @param {Uint8Array} [randomBytes] The random bytes to use; new ones by default.
 * @returns {string} The visit id, such as "k3x9a0qz".
 */
export function createVisitId(randomBytes = makeRandomBytes()) {
  return Array.from(randomBytes, (byte) => (byte % VisitIdBase).toString(VisitIdBase)).join("");
}

/** Makes random bytes for a visit id. It is not a secret, so Math.random serves in every browser and Node version. */
function makeRandomBytes() {
  return Uint8Array.from({ length: VisitIdLength }, () => Math.floor(Math.random() * ByteValueCount));
}

/**
 * Builds the click id "<slug>.<visit id>", shortening the slug so the whole id has at most 50 characters.
 *
 * @param {string} slug The search page's slug.
 * @param {string} visitId The page view's visit id.
 * @returns {string} The click id, using only letters, digits, dots and dashes.
 */
export function buildClickId(slug, visitId) {
  const slugRoom = ClickIdLimit - visitId.length - 1;
  return `${slug.slice(0, slugRoom)}.${visitId}`.replace(UnsafeClickIdCharacters, "");
}

/**
 * Puts the click id in place of the channel name in a finished link's own sub-ID parameter. Only parameters of the
 * link itself are changed, never the store link encoded inside it, and the rest of the link stays exactly as sent.
 *
 * @param {string} link The finished link.
 * @param {string} channel The channel name the API put in the sub-ID slot, such as "shop_nobi".
 * @param {string} clickId The click id.
 * @returns {string} The link with the click id, or the same link when it has no sub-ID slot.
 */
export function fillClickId(link, channel, clickId) {
  const fragmentStart = link.includes("#") ? link.indexOf("#") : link.length;
  const queryStart = link.indexOf("?");
  if (queryStart < 0 || queryStart > fragmentStart) {
    return link;
  }

  const query = link.slice(queryStart + 1, fragmentStart);
  const filledQuery = query.split("&").map((pair) => fillClickIdPair(pair, channel, clickId)).join("&");
  return `${link.slice(0, queryStart + 1)}${filledQuery}${link.slice(fragmentStart)}`;
}

/** Returns one name=value pair with the click id as its value when its value is the channel name. */
function fillClickIdPair(pair, channel, clickId) {
  const [name, value, ...rest] = pair.split("=");
  const isSubIdSlot = value === channel && rest.length === 0 && !name.startsWith(TrackingTagPrefix);
  return isSubIdSlot ? `${name}=${encodeURIComponent(clickId)}` : pair;
}
