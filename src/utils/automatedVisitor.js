// Tells a crawler or an automated browser from a person. Copied from the Shop Nobi widget's
// frontend_assistant/src/utils/automatedVisitor.js, so the website and the widget agree.

/** Crawler names as crawlers write them, such as Googlebot/2.1, AdsBot-Google or Baiduspider-render, and HeadlessChrome. */
const AutomatedVisitorPattern = /(bot|crawler|spider)[/;-]|bot\.html|slurp|headless/i;

/** Returns the page's browser, or undefined where there is none, such as during the build. */
function findBrowserNavigator() {
  return typeof navigator === "undefined" ? undefined : navigator;
}

/**
 * Says whether a crawler or a browser driven by automation is viewing the page, going by what the browser says about
 * itself. A bot that pretends to be a normal browser is not caught.
 *
 * @param {{userAgent?: string, webdriver?: boolean}} [browserNavigator] The browser to check; the page's own by default.
 * @returns {boolean} True for a crawler or an automated browser.
 */
export function isAutomatedVisitor(browserNavigator = findBrowserNavigator()) {
  if (!browserNavigator) {
    return false;
  }

  if (browserNavigator.webdriver === true) {
    return true;
  }

  return AutomatedVisitorPattern.test(browserNavigator.userAgent || "");
}
