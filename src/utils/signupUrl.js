/**
 * Builds a dashboard signup URL that forwards any UTM / ad-click-ID
 * parameters from the current page URL.
 *
 * If the visitor arrived at a landing page via an SEM ad
 * (e.g. ?utm_source=google&utm_medium=cpc&gclid=xxx), those params
 * are appended to the signup link so the dashboard can capture them.
 */

const DASHBOARD_URL = "https://dashboard.nobi.ai";

const FORWARDED_PARAMS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
  "gclid",
  "fbclid",
];

/**
 * Returns a dashboard URL with any recognised UTM / click-ID params from the
 * current page URL appended.
 *
 * @param {object} [opts]
 * @param {string} [opts.path] Path appended to the dashboard base URL.
 *   Defaults to "/signup"; pass "" for the bare dashboard URL.
 * @returns {string} The dashboard URL, with or without query params.
 */
export function getSignupUrl({ path = "/signup" } = {}) {
  const currentParams = new URLSearchParams(window.location.search);
  const forwarded = new URLSearchParams();

  for (const key of FORWARDED_PARAMS) {
    const value = currentParams.get(key);
    if (value) {
      forwarded.set(key, value);
    }
  }

  const base = `${DASHBOARD_URL}${path}`;
  const qs = forwarded.toString();
  return qs ? `${base}?${qs}` : base;
}
