import assert from "node:assert/strict";
import { createServer } from "node:http";
import { join } from "node:path";
import { before, test } from "node:test";
import { fileURLToPath, pathToFileURL } from "node:url";
import { build } from "vite";
import { isWorkEmail } from "../src/utils/workEmail.js";
import {
  checkStoreSubmission,
  FailedRequestMessage,
  MissingFieldsMessage,
  PersonalEmailMessage,
  StoreSubmissionPath,
  submitStore,
  ThankYouMessage,
} from "../src/utils/storeSubmission.js";

const RendererEntry = fileURLToPath(new URL("./fixtures/render-add-your-store.jsx", import.meta.url));
const RendererFolder = fileURLToPath(new URL("../node_modules/.cache/add-your-store-test/", import.meta.url));
const HttpAccepted = 202;
const HttpBadRequest = 400;
const HttpServerError = 500;
const Fields = { storeUrl: " www.acme.com ", name: " Jo Rivera ", email: " jo@acme.com " };

let renderShopPage;
let renderAddYourStoreForm;

before(async () => {
  await build({
    configFile: false,
    logLevel: "warn",
    // Button.jsx leaves out the React import, so JSX compiles to the automatic runtime, as in the site's own build.
    // The build has its own folder, since test files run at once and the page prerender folder is emptied per build.
    esbuild: { jsx: "automatic" },
    build: {
      ssr: RendererEntry,
      outDir: RendererFolder,
      emptyOutDir: true,
      rollupOptions: { output: { entryFileNames: "renderer.mjs" } },
    },
  });
  ({ renderAddYourStoreForm, renderShopPage } = await import(pathToFileURL(join(RendererFolder, "renderer.mjs")).href));
});

/** Starts a server that records each request and answers with the given status and body. */
async function startApiServer(status, body) {
  const requests = [];
  const server = createServer((request, response) => {
    let text = "";
    request.on("data", (chunk) => { text += chunk; });
    request.on("end", () => {
      requests.push({ method: request.method, url: request.url, body: JSON.parse(text) });
      response.writeHead(status, { "content-type": "application/json" });
      response.end(JSON.stringify(body));
    });
  });
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  return {
    apiBaseUrl: `http://127.0.0.1:${server.address().port}`,
    requests,
    close: () => new Promise((resolve) => server.close(resolve)),
  };
}

test("the Shop Nobi page shows store owners the link to add their store", () => {
  const html = renderShopPage();

  assert.ok(html.includes("Run an online store?"));
  assert.ok(html.includes("Add it to Shop Nobi"));
});

test("the form asks for the store's address, the owner's name and a work email, and no store name", () => {
  const html = renderAddYourStoreForm();

  assert.ok(html.includes("Add your store to Shop Nobi"));
  for (const [label, name] of [["Store address", "storeUrl"], ["Your name", "name"], ["Work email", "email"]]) {
    assert.ok(html.includes(`>${label}</span>`), label);
    assert.ok(html.includes(`name="${name}"`), name);
  }
  assert.ok(html.includes('type="email"'));
  assert.ok(!html.includes("Store name"));
  assert.ok(html.includes('maxLength="100"'));
  assert.ok(html.includes('type="submit"'));
});

test("the work email rule refuses free email providers and addresses without a domain", () => {
  for (const email of ["jo@acme.com", "Jo@Acme.Store", " jo@shop.acme.co.uk "]) {
    assert.equal(isWorkEmail(email), true, email);
  }
  for (const email of ["jo@gmail.com", "JO@YAHOO.COM", "jo@icloud.com", "jo@proton.me", "jo", "jo@", "", null]) {
    assert.equal(isWorkEmail(email), false, String(email));
  }
});

test("the form is checked before it is sent: every field is needed and the email must be a work email", () => {
  assert.equal(checkStoreSubmission(Fields), "");
  assert.equal(checkStoreSubmission({ ...Fields, name: "  " }), MissingFieldsMessage);
  assert.equal(checkStoreSubmission({ ...Fields, storeUrl: "" }), MissingFieldsMessage);
  assert.equal(checkStoreSubmission({ ...Fields, email: "jo@gmail.com" }), PersonalEmailMessage);
});

test("the form posts the trimmed fields and the human check's token, and every accepted store gets the same thank-you", async () => {
  const api = await startApiServer(HttpAccepted, { status: "received" });
  try {
    const result = await submitStore(Fields, "turnstile-token", { apiBaseUrl: api.apiBaseUrl });

    assert.deepEqual(result, { accepted: true, message: ThankYouMessage });
    assert.deepEqual(api.requests, [{
      method: "POST",
      url: StoreSubmissionPath,
      body: { storeUrl: "www.acme.com", name: "Jo Rivera", email: "jo@acme.com", turnstileToken: "turnstile-token" },
    }]);
  } finally {
    await api.close();
  }
});

test("a refused form shows the API's message, and any other failure shows a general one", async () => {
  const refusingApi = await startApiServer(HttpBadRequest, { error: "Please use your work email address." });
  const failingApi = await startApiServer(HttpServerError, { error: "internal_error" });
  try {
    const refused = await submitStore(Fields, "token", { apiBaseUrl: refusingApi.apiBaseUrl });
    const failed = await submitStore(Fields, "token", { apiBaseUrl: failingApi.apiBaseUrl });
    const unreachable = await submitStore(Fields, "token", { apiBaseUrl: "http://127.0.0.1:1" });

    assert.deepEqual(refused, { accepted: false, message: "Please use your work email address." });
    assert.deepEqual(failed, { accepted: false, message: FailedRequestMessage });
    assert.deepEqual(unreachable, { accepted: false, message: FailedRequestMessage });
  } finally {
    await refusingApi.close();
    await failingApi.close();
  }
});
