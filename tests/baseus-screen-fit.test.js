import assert from "node:assert/strict";
import { test } from "node:test";
import { evaluateBaseusScreens } from "../src/utils/baseusScreenFit.js";

const ConfirmedOffice = Object.freeze({
  laptop: "Exact manufacturer model", laptopSource: "https://manufacturer.example/laptop/specs", os: "mac14",
  count: "2", firstMode: "1440p60", secondMode: "1440p60", builtIn: "yes", builtInConfirmed: "yes",
  host: "yes", path: "hdmi", modePath: "yes", videoGroups: "yes", displayLink: "yes", use: "office", charging: "no",
});
const Windows4k = { ...ConfirmedOffice, os: "win11", firstMode: "4k60", secondMode: "4k60", dp: "dp14dsc" };
const evaluate = (id, changes = {}, initial = ConfirmedOffice) => evaluateBaseusScreens({ ...initial, ...changes }).find(item => item.id === id);

// These cases describe documented source boundaries, not an emulated hardware test.
test("complete Mac DisplayLink confirmations permit NU1 dual1440p while RD1's two Mac outputs still mirror", () => {
  assert.equal(evaluate("nu1-air-mac").status, "conditional");
  const rd1 = evaluate("rd1-pro");
  assert.equal(rd1.display.status, "fail");
  assert.match(rd1.display.checks.find(item => item.status === "fail").message, /mirror/);
  assert.equal(rd1.power.status, "not-requested");
  assert.equal(evaluate("rd1-pro", { os: "macOther" }).status, "fail", "Old Mac OS does not evade the dock's mirror limitation");
});

test("no permission on a Mac can correctly leave neither model suitable, despite unanswered prerequisites", () => {
  const results = evaluateBaseusScreens({ os: "mac14", displayLink: "no", count: "2" });
  assert.deepEqual(results.map(result => result.status), ["fail", "fail"]);
  assert.match(results[0].display.checks[0].message, /software and permissions/,
    "The first visible reason must explain the failure before listing missing evidence");
  assert.match(results[1].display.checks[0].message, /mirror/);
});

test("defaults and merely naming a known laptop never create a compatibility promise", () => {
  assert.deepEqual(evaluateBaseusScreens().map(result => result.status), ["unknown", "unknown"]);
  assert.equal(evaluate("nu1-air-mac", { laptop: "MacBook Air M2", host: "unknown" }).status, "unknown");
  for (const changes of [{ laptop: "" }, { laptopSource: "" }, { laptopSource: "http://manufacturer.example/specs" },
    { modePath: "unknown" }, { builtInConfirmed: "unknown" }, { os: "macOther" }, { displayLink: "unknown" }, { videoGroups: "unknown" }]) {
    assert.equal(evaluate("nu1-air-mac", changes).status, "unknown", JSON.stringify(changes));
  }
});

test("NU1 distinguishes exact simultaneous modes from connector maxima and conflicting marketing", () => {
  assert.equal(evaluate("nu1-air-mac", { count: "1", firstMode: "4k60", videoGroups: "unknown" }).status, "conditional");
  assert.equal(evaluate("nu1-air-mac", { firstMode: "4k60", secondMode: "4k60" }).status, "unknown");
  assert.equal(evaluate("nu1-air-mac", { firstMode: "4k120" }).status, "fail");
  assert.equal(evaluate("nu1-air-mac", { firstMode: "1080p60", secondMode: "1080p60" }).status, "unknown", "A lower but unlisted mode is not invented");
  assert.equal(evaluate("nu1-air-mac", { firstMode: "1440p60", secondMode: "4k60" }).status, "unknown");
  assert.equal(evaluate("nu1-air-mac", { videoGroups: "no" }).status, "fail");
});

test("Windows RD1 dual4K60 depends on actual DP/DSC, not the number of HDMI connectors", () => {
  assert.equal(evaluate("rd1-pro", {}, Windows4k).status, "conditional");
  for (const dp of ["dp14", "dp12"]) assert.equal(evaluate("rd1-pro", { dp }, Windows4k).status, "fail");
  assert.equal(evaluate("rd1-pro", { dp: "unknown" }, Windows4k).status, "unknown");
  assert.equal(evaluate("rd1-pro", { dp: "dp14", firstMode: "4k30", secondMode: "4k30" }, Windows4k).status, "conditional");
  assert.equal(evaluate("rd1-pro", { dp: "dp12", firstMode: "1080p60", secondMode: "1080p60" }, Windows4k).status, "conditional");
  assert.equal(evaluate("rd1-pro", { dp: "dp14", firstMode: "1440p60", secondMode: "1440p60" }, Windows4k).status, "unknown", "Manual hardware revision remains unverified");
});

test("single HDMI2 high refresh never carries over to HDMI1 or two outputs", () => {
  const single = { ...Windows4k, count: "1", firstMode: "4k120", rd1Port: "hdmi2" };
  assert.equal(evaluate("rd1-pro", {}, single).status, "conditional");
  assert.equal(evaluate("rd1-pro", { rd1Port: "hdmi1" }, single).status, "fail");
  assert.equal(evaluate("rd1-pro", { rd1Port: "unknown" }, single).status, "unknown");
  assert.equal(evaluate("rd1-pro", { count: "2", secondMode: "4k120" }, single).status, "fail");
  assert.equal(evaluate("rd1-pro", { firstMode: "4k60", rd1Port: "unknown" }, single).status, "conditional");
});

test("Windows DP1.2 documents single 4K30 on both HDMI outputs", () => {
  for (const os of ["win10", "win11"]) for (const rd1Port of ["hdmi1", "hdmi2"]) {
    const result = evaluate("rd1-pro", { os, dp: "dp12", count: "1", firstMode: "4k30", rd1Port }, Windows4k);
    assert.equal(result.display.status, "conditional", `${os} ${rd1Port} must retain the actual 4K30 source row`);
    assert.match(result.display.checks.find(check => check.source === "rd1Modes").message, /DP1\.2.*4K30/);
  }
});

test("Windows single-output limits preserve unknown host versions and distinct Mac/mixed rows", () => {
  for (const os of ["win10", "win11"]) for (const rd1Port of ["hdmi1", "hdmi2"]) {
    for (const firstMode of ["4k60", "4k120"]) {
      const result = evaluate("rd1-pro", { os, dp: "dp12", count: "1", firstMode, rd1Port }, Windows4k);
      assert.equal(result.display.status, "fail", `${os} ${rd1Port} ${firstMode} exceeds the documented DP1.2 single row`);
      assert.match(result.display.checks[0].message, /DP1\.2.*4K30/);
    }
    for (const firstMode of ["4k30", "4k60", "4k120"]) {
      assert.equal(evaluate("rd1-pro", { os, dp: "unknown", count: "1", firstMode, rd1Port }, Windows4k).display.status, "unknown");
    }
  }
  for (const firstMode of ["4k60", "4k120"]) {
    assert.equal(evaluate("rd1-pro", { count: "1", firstMode, dp: "dp12", rd1Port: "hdmi2" }).display.status, "conditional",
      "The Windows path selector must not override the separate Mac single-output guide");
  }
  for (const [firstMode, secondMode] of [["4k120", "4k60"], ["4k60", "4k120"]]) {
    assert.equal(evaluate("rd1-pro", { dp: "dp12", firstMode, secondMode }, Windows4k).display.status, "unknown",
      "Unlisted mixed modes do not become a fabricated documented prohibition");
  }
});

test("data-only sockets, unsupported counts and known cable/host failures rule out a plan", () => {
  for (const changes of [{ path: "usb-c" }, { count: "3" }, { host: "no" }, { modePath: "no" }, { builtInConfirmed: "no" }]) {
    assert.equal(evaluate("nu1-air-mac", changes).status, "fail", JSON.stringify(changes));
    assert.equal(evaluate("rd1-pro", changes, Windows4k).status, "fail", JSON.stringify(changes));
  }
  for (const path of ["dp", "mixed"]) {
    const result = evaluate("rd1-pro", { path }, Windows4k);
    assert.equal(result.display.status, "fail", "RD1 has no direct DisplayPort connector");
    assert.match(result.display.checks[0].message, /HDMI/);
  }
  assert.equal(evaluate("rd1-pro", { path: "adapter" }, Windows4k).status, "unknown");
  for (const path of ["dp", "mixed"]) assert.equal(evaluate("nu1-air-mac", { path }).status, "conditional");
  assert.equal(evaluate("nu1-air-mac", { path: "adapter" }).status, "unknown");
});

test("special uses and mixed modes remain uncertain rather than inheriting office-mode claims", () => {
  for (const use of ["protected", "gaming", "prelogin", "unknown"]) {
    assert.equal(evaluate("nu1-air-mac", { use }).status, "unknown");
    assert.equal(evaluate("rd1-pro", { use }, Windows4k).status, "unknown");
  }
  assert.equal(evaluate("rd1-pro", { secondMode: "1440p60" }, Windows4k).status, "unknown");
});

test("NU1 power is separate: 100W input supplies the documented90W or75W laptop allocation", () => {
  const powered = { ...ConfirmedOffice, charging: "yes", watts: "90", pdPath: "yes", nu1Adapter: "100", nu1Usb: "one" };
  assert.equal(evaluate("nu1-air-mac", {}, powered).power.status, "conditional");
  let result = evaluate("nu1-air-mac", { nu1Usb: "all" }, powered);
  assert.equal(result.display.status, "conditional");
  assert.equal(result.power.status, "fail");
  assert.equal(result.status, "fail");
  assert.equal(evaluate("nu1-air-mac", { nu1Usb: "all", watts: "75" }, powered).status, "conditional");
  assert.equal(evaluate("nu1-air-mac", { watts: "100" }, powered).power.status, "fail");
  for (const nu1Usb of ["mixed", "unknown"]) {
    assert.equal(evaluate("nu1-air-mac", { nu1Usb, watts: "100" }, powered).power.status, "unknown",
      "The highest enumerated allocation is not a documented maximum for an unlisted USB-load scenario");
    for (const watts of ["101", "301"]) {
      const excessInput = evaluate("nu1-air-mac", { nu1Usb, watts }, powered);
      assert.equal(excessInput.power.status, "fail", "Laptop demand cannot exceed the documented maximum input");
      assert.match(excessInput.power.checks[0].message, /100W maximum input/);
    }
  }
  assert.equal(evaluate("nu1-air-mac", { nu1Adapter: "other" }, powered).power.status, "unknown");
  assert.equal(evaluate("nu1-air-mac", { nu1Adapter: "none" }, powered).power.status, "fail");
});

test("RD1's shared160W and up-to100W host limits require the actual supply and individual-port evidence", () => {
  const powered = { ...Windows4k, charging: "yes", watts: "100", pdPath: "yes", rd1Supply: "yes", peripheralWatts: "60", peripheralPorts: "yes" };
  assert.equal(evaluate("rd1-pro", {}, powered).status, "conditional");
  assert.equal(evaluate("rd1-pro", { peripheralWatts: "61" }, powered).power.status, "fail");
  assert.equal(evaluate("rd1-pro", { watts: "101", peripheralWatts: "0" }, powered).power.status, "fail");
  for (const changes of [{ rd1Supply: "unknown" }, { peripheralWatts: "" }, { peripheralPorts: "unknown" }, { pdPath: "unknown" }]) {
    assert.equal(evaluate("rd1-pro", changes, powered).power.status, "unknown", JSON.stringify(changes));
  }
  assert.equal(evaluate("rd1-pro", { rd1Supply: "no" }, powered).power.status, "fail");
});

test("blank, malformed and nonfinite power values never become zero or a positive charging claim", () => {
  const powered = { ...ConfirmedOffice, charging: "yes", pdPath: "yes", nu1Adapter: "100", nu1Usb: "one" };
  for (const watts of ["", " ", "NaN", "Infinity", "-1", "0", "0x41", true, false, null]) assert.equal(evaluate("nu1-air-mac", { watts }, powered).power.status, "unknown", watts);
  assert.equal(evaluate("nu1-air-mac", { charging: "unknown", watts: "65" }, powered).power.status, "unknown");
});

test("undecided charging ignores retained hidden answers while explicit charging still evaluates them", () => {
  const stalePlans = [
    ["nu1-air-mac", ConfirmedOffice, { watts: "100", pdPath: "no", nu1Adapter: "none", nu1Usb: "all" }],
    ["rd1-pro", Windows4k, { watts: "160", pdPath: "no", rd1Supply: "no", peripheralWatts: "100", peripheralPorts: "no" }],
  ];
  for (const [id, initial, hiddenAnswers] of stalePlans) {
    assert.equal(evaluate(id, { charging: "yes", ...hiddenAnswers }, initial).power.status, "fail");
    for (const charging of ["unknown", "", null]) {
      const result = evaluate(id, { charging, ...hiddenAnswers }, initial);
      assert.equal(result.display.status, "conditional");
      assert.equal(result.power.status, "unknown");
      assert.equal(result.status, "unknown");
      assert.deepEqual(result.power.checks.map(check => check.status), ["unknown"]);
      assert.match(result.power.checks[0].message, /Decide whether/);
    }
    const notRequested = evaluate(id, { charging: "no", ...hiddenAnswers }, initial);
    assert.equal(notRequested.power.status, "not-requested");
    assert.equal(notRequested.status, "conditional");
  }
});

test("a video-only host stays uncertain for displays and fails only a requested laptop-charging plan", () => {
  const modelPlans = [
    ["nu1-air-mac", ConfirmedOffice, { watts: "65", pdPath: "yes", nu1Adapter: "100", nu1Usb: "one" }],
    ["rd1-pro", Windows4k, { watts: "65", pdPath: "yes", rd1Supply: "yes", peripheralWatts: "0", peripheralPorts: "yes" }],
  ];
  for (const [id, initial, powerAnswers] of modelPlans) {
    const displayOnly = evaluate(id, { host: "video-only", charging: "no" }, initial);
    assert.equal(displayOnly.display.status, "unknown", "No manufacturer proof means uncertainty, not a hard display exclusion");
    assert.equal(displayOnly.power.status, "not-requested");
    assert.equal(displayOnly.status, "unknown");
    assert.match(displayOnly.display.checks[0].message, /full-featured.*charging/);
    assert.match(displayOnly.display.checks[0].message, /Baseus/);
    const chargingPlan = evaluate(id, { host: "video-only", charging: "yes", ...powerAnswers }, initial);
    assert.equal(chargingPlan.display.status, "unknown");
    assert.equal(chargingPlan.power.status, "fail", "The known no-charging port cannot satisfy a requested charging plan");
    const undecided = evaluate(id, { host: "video-only", charging: "unknown", ...powerAnswers, pdPath: "no" }, initial);
    assert.equal(undecided.power.status, "unknown", "A retained no-PD answer must not decide an undecided charging requirement");
    assert.equal(undecided.status, "unknown");
    assert.equal(evaluate(id, { host: "no", charging: "no" }, initial).display.status, "fail", "Missing data or video remains incompatible");
    assert.equal(evaluate(id, { host: "yes", charging: "no" }, initial).display.status, "conditional");
  }
});

test("known numeric power demands above a documented budget fail instead of becoming missing", () => {
  const rd1Power = { charging: "yes", pdPath: "yes", rd1Supply: "yes", peripheralPorts: "yes" };
  for (const peripheralWatts of ["160.01", "161", "301", "1000"]) {
    for (const watts of ["65", ""]) {
      const result = evaluate("rd1-pro", { ...rd1Power, watts, peripheralWatts }, Windows4k);
      assert.equal(result.power.status, "fail", `Known ${peripheralWatts}W peripheral demand exceeds the shared total`);
      assert.match(result.power.checks[0].message, /160W shared total/);
    }
  }
  assert.equal(evaluate("rd1-pro", { ...rd1Power, watts: "301", peripheralWatts: "0" }, Windows4k).power.status, "fail");
  const unknownLaptop = evaluate("rd1-pro", { ...rd1Power, watts: "", peripheralWatts: "160" }, Windows4k);
  assert.equal(unknownLaptop.power.status, "unknown");
  assert.ok(!unknownLaptop.power.checks.some(check => /stated total is within/.test(check.message)), "Unknown laptop watts cannot confirm the full shared total");
  assert.equal(evaluate("nu1-air-mac", { charging: "yes", watts: "301", pdPath: "yes", nu1Adapter: "100", nu1Usb: "one" }).power.status, "fail");
  for (const peripheralWatts of ["", " ", "NaN", "Infinity", "-1", "0x41", null]) {
    assert.equal(evaluate("rd1-pro", { ...rd1Power, watts: "65", peripheralWatts }, Windows4k).power.status, "unknown");
  }
});
