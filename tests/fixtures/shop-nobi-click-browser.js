const ChromeAgent = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36";

/** A stand-in window that records every beacon and fetch, with a saved shopper id and the page's conversation. */
export function makeBrowser({
  pageUrl = "https://nobi.ai/shop/s/black-leather-boots?utm_source=pinterest",
  userAgent = ChromeAgent,
  webdriver = false,
  acceptsBeacons = true,
  readStorage,
  pageConversationId = "6f1c2a4e-8b3d-4c5e-9f70-1a2b3c4d5e6f",
  smokeTestToken = null,
} = {}) {
  const address = new URL(pageUrl);
  const browser = { beacons: [], fetches: [], shopNobiPageConversationId: pageConversationId };
  browser.location = { href: address.href, hostname: address.hostname };
  browser.document = { referrer: "https://www.google.com/" };
  browser.localStorage = { getItem: readStorage ?? (() => JSON.stringify({ "nobi-shopper-id": "shopper-1" })) };
  browser.sessionStorage = { getItem: (key) => (key === "nobi_smoke_test_token" ? smokeTestToken : null) };
  browser.navigator = {
    userAgent,
    webdriver,
    sendBeacon: (url, body) => {
      browser.beacons.push({ url, event: JSON.parse(body) });
      return acceptsBeacons;
    },
  };
  browser.fetch = (url, request) => {
    browser.fetches.push({ url, request, event: JSON.parse(request.body) });
    return Promise.resolve();
  };
  return browser;
}

