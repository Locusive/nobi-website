import assert from "node:assert/strict";
import { test } from "node:test";
import { compareFootprints, convertMeasurement, exteriorArea } from "../src/utils/catFootprintFit.js";
import { CoveCubbyProducts } from "../src/content/coveCubbyComparison.js";

/** Return only the buyer-facing geometric outcomes for a supplied space. */
function fits(measurements) {
  return compareFootprints(measurements).placements.map(product => product.fits);
}

test("a 20 by 24 inch exterior-only example fits Cubby but not Cove", () => {
  assert.deepEqual(fits({ width: 20, depth: 24, clearance: 0 }), [true, false]);
});

test("exact exterior boundaries fit and a smaller width or depth does not", () => {
  assert.deepEqual(fits({ width: 15.2, depth: 21.2, clearance: 0 }), [true, false]);
  assert.deepEqual(fits({ width: 16, depth: 26, clearance: 0 }), [true, true]);
  for (const space of [{ width: 15.19, depth: 26 }, { width: 16, depth: 21.19 }]) {
    assert.deepEqual(fits({ ...space, clearance: 0 }), [false, false]);
  }
});

test("the user's allowance applies to all four sides and changes the fit", () => {
  assert.deepEqual(fits({ width: 20, depth: 30, clearance: 2 }), [true, true]);
  assert.deepEqual(fits({ width: 20, depth: 30, clearance: 2.01 }), [true, false]);
  assert.deepEqual(fits({ width: 20, depth: 24, clearance: 2 }), [false, false]);
});

test("rotation is opt-in and normal orientation is retained when it fits", () => {
  const space = { width: 26, depth: 16, clearance: 0 };
  assert.deepEqual(fits(space), [false, false]);
  const rotated = compareFootprints({ ...space, allowRotation: true }).placements;
  assert.deepEqual(rotated.map(item => [item.fits, item.rotated, item.placedWidth, item.placedDepth]), [
    [true, true, 21.2, 15.2], [true, true, 26, 16],
  ]);
  assert.ok(compareFootprints({ width: 30, depth: 30, clearance: 0, allowRotation: true }).placements.every(item => !item.rotated));
});

test("centimeter conversion preserves physical measurements and placement decisions", () => {
  const inches = { width: "20", depth: "24", clearance: "0" };
  const centimeters = Object.fromEntries(Object.entries(inches).map(([key, value]) => [key, convertMeasurement(value, "in", "cm")]));
  assert.deepEqual(centimeters, { width: "50.8", depth: "60.96", clearance: "0" });
  assert.deepEqual(fits({ ...centimeters, unit: "cm" }), fits(inches));
  assert.equal(convertMeasurement("38.608", "cm", "in"), "15.2");
  assert.equal(convertMeasurement("", "in", "cm"), "");
  assert.equal(convertMeasurement("bad", "in", "cm"), "bad");
});

test("missing, nonfinite and invalid dimensions never produce a fit result", () => {
  for (const changes of [
    { width: "" }, { depth: "  " }, { clearance: "" }, { width: 0 }, { depth: -1 },
    { clearance: -1 }, { width: Infinity }, { depth: "NaN" }, { clearance: 1.79e308 },
    { width: false }, { unit: "feet" },
  ]) {
    assert.throws(() => compareFootprints({ width: 20, depth: 30, clearance: 0, ...changes }));
  }
  assert.throws(() => convertMeasurement("20", "feet", "in"));
});

test("the exterior rectangles differ by about 29 percent, without implying usable interior area", () => {
  const areas = CoveCubbyProducts.map(exteriorArea);
  assert.equal(Number(areas[0].toFixed(2)), 322.24);
  assert.equal(areas[1], 416);
  assert.equal(Math.round((areas[1] / areas[0] - 1) * 100), 29);
});
