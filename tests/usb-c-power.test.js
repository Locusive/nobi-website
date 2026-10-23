import assert from "node:assert/strict";
import { test } from "node:test";
import { readFileSync } from "node:fs";
import { checkUsbCPower, EmptyPowerInput } from "../src/utils/usbCPower.js";
const check = changes => checkUsbCPower({ ...EmptyPowerInput, ...changes });
const known = { target1: "30", target2: "15", allocation1: "17.5", allocation2: "17.5", total: "35" };

test("shared outputs show exact device shortfalls without dividing the total", () => {
  const result = check(known);
  assert.equal(result.status, "shortfall");
  assert.deepEqual(result.devices.map(device => device.shortfall), [125, 0]);
  assert.equal(check({ ...known, target1: "25", target2: "5", allocation1: "27.5", allocation2: "7.5" }).status, "meets");
  assert.equal(check({ target1: "30", target2: "15", total: "100" }).status, "unknown");
});
test("unknown and documented zero remain distinct; known deficits survive another unknown", () => {
  assert.equal(check({}).status, "unknown");
  assert.equal(check({ ...known, allocation1: "" }).status, "unknown");
  const partial = check({ ...known, allocation1: "0", allocation2: "" });
  assert.equal(partial.status, "unknown"); assert.equal(partial.devices[0].shortfall, 300);
  assert.equal(check({ ...known, allocation1: "0" }).status, "shortfall");
  assert.equal(check({ ...known, target1: "0", target2: "0" }).status, "unknown");
});
test("contradictory simultaneous outputs cannot produce a passing number check", () => {
  assert.equal(check({ ...known, total: "34.9" }).status, "inconsistent");
  assert.equal(check({ ...known, total: "0" }).status, "inconsistent");
  assert.equal(check({ ...known, total: "" }).status, "shortfall");
  assert.equal(check({ ...known, target1: "0.3", target2: "0", allocation1: "0.1", allocation2: "0.2", total: "0.3" }).status, "shortfall");
});
test("known port outputs expose contradictions even when another output is unknown", () => {
  for (const allocations of [
    { allocation1: "40", allocation2: "" },
    { allocation1: "", allocation2: "40" },
  ]) assert.equal(check({ ...known, ...allocations, total: "35" }).status, "inconsistent");
  assert.equal(check({ ...known, allocation1: "35", allocation2: "", total: "35" }).status, "unknown");
  assert.equal(check({ ...known, allocation1: "", allocation2: "", total: "0" }).status, "unknown");
  assert.equal(check({ ...known, allocation1: "0.1", allocation2: "", total: "0" }).status, "inconsistent");
});
test("invalid and out-of-range watts are rejected on every control", () => {
  for (const key of Object.keys(EmptyPowerInput)) {
    for (const value of ["-1", "NaN", "Infinity", "1e2", "3.14", "2W", ".5", null, "10000.1", "9007199254740991"]) {
      assert.equal(check({ ...known, [key]: value }).status, "invalid", `${key}: ${value}`);
    }
  }
  assert.equal(check({ ...known, target1: " 17.5 " }).devices[0].shortfall, 0);
});
test("static delivery includes the usable worksheet, limitations, sources and discovery", () => {
  for (const file of ["dist/tools/usb-c-power-check.html", "dist/tools/usb-c-power-check/index.html"]) {
    const html = readFileSync(file, "utf8");
    for (const text of ['href="https://nobi.ai/tools/usb-c-power-check"', 'name="target1"', 'name="allocation2"', 'aria-live="polite"', 'Reset to unknown', '17.5W', '12.5W', 'not a compatibility', 'https://support.apple.com/en-gb/111805', 'https://support.apple.com/en-gb/102378', 'href="/shop/s/black-chargers"', 'not saved or sent', 'Enable JavaScript to calculate locally', 'disabled=""']) assert.ok(html.includes(text), text);
  }
  assert.ok(readFileSync("dist/tools/baseus-two-screens.html", "utf8").includes('href="/tools/usb-c-power-check"'));
  assert.ok(readFileSync("public/sitemap-pages.xml", "utf8").includes('<loc>https://nobi.ai/tools/usb-c-power-check</loc>'));
});
