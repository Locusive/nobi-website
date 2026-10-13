// A store owner asks to add their store to Shop Nobi from the form on /shop. The API checks the form again, runs the
// Turnstile human check, and emails Nobi; every accepted request gets the same thank-you.

import { isWorkEmail } from "./workEmail.js";

/** The API route the form posts to. */
export const StoreSubmissionPath = "/v1/shop/store-submissions";

/** The production API. The dev server posts to the local API on its usual port instead. */
const ProductionApiBaseUrl = "https://api.nobi.ai";
const LocalApiBaseUrl = "http://localhost:7080";

/** The status the API answers a refused form with, carrying a message for the owner. */
const BadRequestStatus = 400;

/** The real Turnstile site key, the one the Shop Nobi search uses, and Cloudflare's always-pass key for local runs. */
const ProductionTurnstileSiteKey = "0x4AAAAAAEEcwr5yjov7u_nM";
const TestTurnstileSiteKey = "1x00000000000000000000BB";

/** The thank-you every accepted request gets, whatever the store, so the form never shows which stores we carry. */
export const ThankYouMessage = "Thanks! We got your store and will take a look.";

export const MissingFieldsMessage = "Please fill in your store's address, its name and your work email.";
export const PersonalEmailMessage = "Please use your work email address, not a personal one like Gmail or Yahoo.";
export const HumanCheckPendingMessage = "One moment, we are still checking that you are a person. Please try again.";
export const FailedRequestMessage = "Something went wrong. Please try again.";

/**
 * Checks the form before it is sent, with the same work email rule as the demo form.
 *
 * @param {{storeUrl: string, storeName: string, email: string}} fields The form's fields.
 * @returns {string} The message to show, or an empty string when the form can be sent.
 */
export function checkStoreSubmission({ storeUrl, storeName, email }) {
  if (!storeUrl.trim() || !storeName.trim() || !email.trim()) {
    return MissingFieldsMessage;
  }
  if (!isWorkEmail(email)) {
    return PersonalEmailMessage;
  }
  return "";
}

/**
 * Builds the JSON body the API reads.
 *
 * @param {{storeUrl: string, storeName: string, email: string}} fields The form's fields.
 * @param {string} turnstileToken The token from the form's Turnstile check.
 * @returns {{storeUrl: string, storeName: string, email: string, turnstileToken: string}} The body.
 */
export function buildStoreSubmissionBody({ storeUrl, storeName, email }, turnstileToken) {
  return { storeUrl: storeUrl.trim(), storeName: storeName.trim(), email: email.trim(), turnstileToken };
}

/**
 * Sends the form to the API.
 *
 * @param {{storeUrl: string, storeName: string, email: string}} fields The form's fields.
 * @param {string} turnstileToken The token from the form's Turnstile check.
 * @param {{apiBaseUrl?: string, fetchImplementation?: typeof fetch}} [options] Tests pass a local server and fetch.
 * @returns {Promise<{accepted: boolean, message: string}>} The thank-you, or the message to show.
 */
export async function submitStore(fields, turnstileToken, options = {}) {
  const { apiBaseUrl = readApiBaseUrl(), fetchImplementation = globalThis.fetch } = options;
  try {
    const response = await fetchImplementation(`${apiBaseUrl}${StoreSubmissionPath}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(buildStoreSubmissionBody(fields, turnstileToken)),
    });
    if (response.ok) {
      return { accepted: true, message: ThankYouMessage };
    }
    return { accepted: false, message: await readRefusalMessage(response) };
  } catch (error) {
    return { accepted: false, message: FailedRequestMessage };
  }
}

/**
 * The Turnstile site key for this build: the real one in production, the always-pass one in the dev server.
 *
 * @returns {string} The site key.
 */
export function readTurnstileSiteKey() {
  return isProductionBuild() ? ProductionTurnstileSiteKey : TestTurnstileSiteKey;
}

/** The API base address for this build. */
function readApiBaseUrl() {
  return isProductionBuild() ? ProductionApiBaseUrl : LocalApiBaseUrl;
}

/** Says whether this is a production build. Node, where the tests run, counts as one. */
function isProductionBuild() {
  return import.meta.env?.DEV !== true;
}

/**
 * Reads the message the API sends when it refuses the form. Only a refused form (400) carries a message meant for
 * the owner; anything else gets the general one.
 */
async function readRefusalMessage(response) {
  if (response.status !== BadRequestStatus) {
    return FailedRequestMessage;
  }
  try {
    const body = await response.json();
    return typeof body.error === "string" ? body.error : FailedRequestMessage;
  } catch (error) {
    return FailedRequestMessage;
  }
}
