/**
 * Builds a dashboard signup URL that forwards any UTM / ad-click-ID
 * parameters from the current page URL.
 *
 * If the visitor arrived at a landing page via an SEM ad
 * (e.g. ?utm_source=google&utm_medium=cpc&gclid=xxx), those params
 * are appended to the signup link so the dashboard can capture them.
 */

const DASHBOARD_SIGNUP_URL = "https://dashboard.nobi.ai/signup";

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
 * Returns the dashboard signup URL with any recognised UTM / click-ID
 * params from the current page URL appended.
 *
 * @returns {string} The signup URL, with or without query params.
 */
export function getSignupUrl() {
  const currentParams = new URLSearchParams(window.location.search);
  const forwarded = new URLSearchParams();

  for (const key of FORWARDED_PARAMS) {
    const value = currentParams.get(key);
    if (value) {
      forwarded.set(key, value);
    }
  }

  const qs = forwarded.toString();
  return qs ? `${DASHBOARD_SIGNUP_URL}?${qs}` : DASHBOARD_SIGNUP_URL;
}
