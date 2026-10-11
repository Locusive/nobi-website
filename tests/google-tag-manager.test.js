import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import vm from "node:vm";

const Dist = new URL("../dist/", import.meta.url);
const BuiltPages = ["index.html", "homepage.html", "pricing.html", "shop.html"];

/** Reads a built page. */
function readBuiltPage(page) {
  return readFileSync(new URL(page, Dist), "utf8");
}

/** Reads the inline script that loads Google Tag Manager from a built page. */
function readTagManagerLoader(page) {
  const html = readBuiltPage(page);
  const loader = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(([, code]) => code).find((code) => code.includes("gtm.js"));
  assert.ok(loader, `${page} has no Google Tag Manager loader`);
  return loader;
}

/** Runs the loader in a stand-in browser and returns the script addresses it added to the page. */
function runLoader(loader, globalPrivacyControl) {
  const addedScripts = [];
  const firstScript = { parentNode: { insertBefore: (script) => addedScripts.push(script.src) } };
  const document = { getElementsByTagName: () => [firstScript], createElement: () => ({}) };
  vm.runInNewContext(loader, { window: {}, document, navigator: { globalPrivacyControl } });
  return addedScripts;
}

test("Google Tag Manager loads normally and stays off when the browser sends Global Privacy Control", () => {
  for (const page of BuiltPages) {
    const loader = readTagManagerLoader(page);
    assert.deepEqual(runLoader(loader, undefined), ["https://www.googletagmanager.com/gtm.js?id=GTM-PMGNQGLR"], page);
    assert.deepEqual(runLoader(loader, true), [], page);
  }
});

test("no Google Tag Manager iframe loads without JavaScript, where Global Privacy Control cannot be read", () => {
  for (const page of BuiltPages) {
    assert.ok(!/<iframe[^>]*googletagmanager/.test(readBuiltPage(page)), page);
  }
});
