/** Unknown answers stay unknown; this selector compares documented modes, not measured hardware. */
export const BaseusScreenDefaults = Object.freeze({
  laptop: "", laptopSource: "", os: "unknown", count: "2", firstMode: "1440p60", secondMode: "1440p60",
  builtIn: "unknown", builtInConfirmed: "unknown", host: "unknown", path: "unknown", modePath: "unknown",
  videoGroups: "unknown", rd1Port: "unknown", displayLink: "unknown", dp: "unknown", use: "office",
  charging: "unknown", watts: "", pdPath: "unknown", nu1Adapter: "unknown", nu1Usb: "unknown",
  rd1Supply: "unknown", peripheralWatts: "", peripheralPorts: "unknown",
});

const KnownMacOs = ["mac14", "mac15", "mac26", "mac27"];
const KnownWindowsOs = ["win10", "win11"];
/** An input ceiling cannot promise that much laptop output. */
const Nu1MaximumInputWatts = 100;
const check = (status, message, source) => ({ status, message, source });
const unknown = (message, source) => check("unknown", message, source);
const fail = (message, source) => check("fail", message, source);
const fit = (message, source) => check("conditional", message, source);

/** Known incompatibility outranks missing evidence, so an unanswered field cannot conceal a failure. */
function outcome(checks) {
  const status = checks.some(item => item.status === "fail") ? "fail"
    : checks.some(item => item.status === "unknown") ? "unknown" : "conditional";
  const priority = { fail: 0, unknown: 1, conditional: 2 };
  return { status, checks: [...checks].sort((first, second) => priority[first.status] - priority[second.status]) };
}

/** A confirmation means the shopper checked the exact combination, not that this page verified it. */
function confirmation(value, yes, no, missing, source) {
  return value === "yes" ? fit(yes, source) : value === "no" ? fail(no, source) : unknown(missing, source);
}

/** Keeps missing video capability distinct from an unverified no-charging host combination. */
function hostDisplayCheck(id, input) {
  const source = id === "nu1-air-mac" ? "nu1Manual" : "rd1Manual";
  if (input.host === "video-only") return unknown("Baseus requires a full-featured host, including charging. A data/DP host without laptop charging is unverified; confirm this exact combination with Baseus.", source);
  return confirmation(input.host, "You confirmed a full-featured host with data, DP Alt Mode and charging capability.",
    "The selected host port lacks data or DP Alt Mode required by this display path.",
    "Check the selected host port's data, DP Alt Mode and full-featured compatibility.", source);
}

/** Checks requirements common to both docks without guessing capabilities from a laptop name. */
function commonDisplayChecks(id, input) {
  const checks = [];
  let sourceUrl;
  try { sourceUrl = new URL(input.laptopSource); } catch { /* Missing evidence remains unknown. */ }
  checks.push(input.laptop.trim() && sourceUrl?.protocol === "https:"
    ? fit("You supplied an exact laptop and manufacturer specification link.")
    : unknown("Add your exact laptop model and its manufacturer specification link."));
  checks.push(hostDisplayCheck(id, input));
  if (!["1", "2"].includes(String(input.count))) checks.push(fail("Only one or two independent external displays are modeled by these docks.", "manuals"));
  checks.push(confirmation(input.modePath, "You confirmed the exact host, monitor and cable path supports the requested mode.",
    "Your host, monitor or cable path cannot carry the requested mode.",
    "Confirm the requested resolution/refresh across the exact host, monitor and cables.", "manuals"));
  if (input.builtIn === "yes") checks.push(confirmation(input.builtInConfirmed,
    "You checked this exact external-screen arrangement with the built-in screen on.",
    "The required built-in-screen arrangement is not supported by your verified setup.",
    "Verify this exact setup with the built-in screen on; native Mac limits are a separate check.", "apple"));
  else if (input.builtIn !== "no") checks.push(unknown("Decide whether the built-in screen must remain on.", "apple"));
  if (input.path === "usb-c") checks.push(fail("These USB-C data/charging ports are not monitor outputs.", "manuals"));
  else if (!["hdmi", "dp", "mixed"].includes(input.path)) checks.push(unknown("An adapter, extra hub or unknown connection needs its own supported-path evidence.", "manuals"));
  if (input.use !== "office") checks.push(unknown(input.use === "protected"
    ? "Protected playback is not assured. DisplayLink can black out protected video, including on other screens."
    : "Gaming, HDR/VRR, latency and pre-login/FileVault behavior are not verified here.", input.use === "protected" ? "protected" : "manuals"));
  return checks;
}

/** Returns only the exact NU1 simultaneous modes corroborated by the current official diagram. */
function nu1Mode(input) {
  if (String(input.count) === "1" && input.firstMode === "4k60") return fit("The NU1 diagram documents one 4K60 screen.", "nu1Modes");
  if (String(input.count) === "2" && input.firstMode === "1440p60" && input.secondMode === "1440p60") return fit("The simultaneous-display table documents two 1440p60 screens.", "nu1Modes");
  if (String(input.count) === "2" && [input.firstMode, input.secondMode].every(mode => mode === "4k60")) return unknown("Dual 4K60 is not verified: broad marketing conflicts with the official dual-1440p60 table.", "nu1Modes");
  if ([input.firstMode, ...(String(input.count) === "2" ? [input.secondMode] : [])].includes("4k120")) return fail("NU1 does not document a 4K120 output; its single-screen maximum is 4K60.", "nu1Modes");
  return unknown("This single, lower, mixed or unlisted mode is not enumerated in the source table. Confirm it with Baseus.", "nu1Modes");
}

/** Matches RD1's documented Windows modes; it does not extrapolate mixed-monitor combinations. */
function rd1Mode(input) {
  if (String(input.count) === "1") {
    if (input.firstMode === "4k60") return fit("The RD1 guide documents one 4K60 screen on either HDMI output.", "rd1Modes");
    if (input.firstMode === "4k120") return input.rd1Port === "hdmi2" ? fit("Single 4K120 is a manufacturer claim for HDMI2 with a capable host/path.", "rd1Modes")
      : input.rd1Port === "hdmi1" ? fail("HDMI1 is limited to single 4K60; the 4K120 claim belongs to HDMI2.", "rd1Modes")
        : unknown("For single 4K120, confirm the HDMI2 output and the complete capable path.", "rd1Modes");
    return unknown("This single-screen mode is not enumerated by this selector; confirm it with Baseus.", "rd1Modes");
  }
  if (input.firstMode !== input.secondMode) return unknown("The source does not specify this mixed-monitor mode.", "rd1Modes");
  const mode = input.firstMode;
  if (mode === "4k120") return fail("RD1's single-HDMI2 4K120 claim is not a dual-4K120 claim.", "rd1Modes");
  if (!["dp14dsc", "dp14", "dp12"].includes(input.dp)) return unknown("Check the host's DP version and DSC support for simultaneous outputs.", "rd1Modes");
  if (mode === "4k60") return input.dp === "dp14dsc" ? fit("Windows DP1.4 with DSC documents dual 4K60.", "rd1Modes") : fail("Dual 4K60 requires DP1.4 with DSC; the confirmed host path falls short.", "rd1Modes");
  if (mode === "4k30" && ["dp14", "dp14dsc"].includes(input.dp)) return fit("The official guide lists dual 4K30 for the DP1.4 no-DSC path.", "rd1Modes");
  if (mode === "1440p60" && ["dp14", "dp14dsc"].includes(input.dp)) return unknown("The mirrored manual lists dual 1440p60 without DSC, but its current hardware-revision match is unverified.", "rd1Manual");
  if (mode === "1080p60" && input.dp === "dp12") return fit("The official guide lists dual 1080p60 for DP1.2.", "rd1Modes");
  if (input.dp === "dp12" && ["1440p60", "4k30"].includes(mode)) return fail("The published DP1.2 dual-screen mode is 1080p60, below this target.", "rd1Modes");
  return unknown("This exact host/mode combination is not enumerated in the source table. Confirm it with Baseus.", "rd1Modes");
}

/** Keeps display compatibility independent from software permission and the dock's actual video architecture. */
function displayResult(id, input) {
  const checks = commonDisplayChecks(id, input);
  const mac = KnownMacOs.includes(input.os);
  const windows = KnownWindowsOs.includes(input.os);
  checks.push(mac || windows ? fit("The selected OS is within the source's stated support scope.", id === "nu1-air-mac" ? (mac ? "macSoftware" : "windowsSoftware") : "rd1")
    : unknown("Check the exact OS and supported software version; older/other releases are not assumed compatible.", id === "nu1-air-mac" ? "macSoftware" : "rd1"));
  if (id === "nu1-air-mac") {
    checks.push(confirmation(input.displayLink, "You confirmed a supporting DisplayLink version and required installation/permissions.",
      "NU1's DisplayLink display path requires software and permissions you cannot use.",
      "Verify a supporting DisplayLink version, installation access and required permissions.", "permission"));
    if (String(input.count) === "2") checks.push(confirmation(input.videoGroups, "One video connection is assigned to each NU1 output group.",
      "Two connectors in the same NU1 video group cannot provide two independent screens.",
      "Use one HDMI or DP connector from each of the two NU1 video groups.", "nu1Manual"));
    checks.push(nu1Mode(input));
  } else {
    if (String(input.os).startsWith("mac") && String(input.count) === "2") checks.push(fail("On macOS, RD1's two outputs mirror. DisplayLink software cannot add a chipset to this dock.", "rd1"));
    if (["dp", "mixed"].includes(input.path)) checks.push(fail("RD1 has HDMI-only video outputs, so the selected direct DisplayPort cable cannot connect.", "rd1"));
    if (!mac || String(input.count) === "1") checks.push(rd1Mode(input));
  }
  return outcome(checks);
}

/** Converts only nonnegative, explicitly supplied power values; blank/NaN never mean zero. */
function watts(value) {
  const text = typeof value === "string" || typeof value === "number" ? String(value).trim() : "";
  return /^(?:\d+(?:\.\d*)?|\.\d+)$/.test(text) && Number.isFinite(Number(text)) ? Number(text) : null;
}

/** Models manufacturer allocation ceilings; it never promises negotiated or measured laptop charging. */
function powerResult(id, input) {
  if (input.charging === "no") return { status: "not-requested", checks: [fit("Laptop charging was not requested. This is not a charging compatibility claim.")] };
  if (input.charging !== "yes") return outcome([unknown("Decide whether this dock must charge your laptop.")]);
  const checks = [];
  const required = watts(input.watts);
  checks.push(required !== null && required > 0 ? fit(`Your stated laptop requirement is ${required}W.`) : unknown("Enter the laptop manufacturer's required charging watts."));
  checks.push(input.host === "video-only" ? fail("The selected host cannot receive laptop charging through this port.", id === "nu1-air-mac" ? "nu1Manual" : "rd1Manual")
    : confirmation(input.pdPath, "You confirmed the host's USB-C PD support and required cable/port ratings.",
      "The confirmed PD/cable path cannot supply the requested laptop charging.", "Check host PD support and the required cable/port ratings.", "manuals"));
  if (id === "nu1-air-mac") {
    if (required !== null && required > Nu1MaximumInputWatts) checks.push(fail("Your laptop demand exceeds NU1's documented 100W maximum input, before dock or peripheral power.", "nu1Manual"));
    checks.push(input.nu1Adapter === "100" ? fit("A suitable separate 100W PD adapter is part of your plan.", "nu1Power")
      : input.nu1Adapter === "none" ? fail("NU1 excludes the charger; this plan has no PD input adapter.", "nu1Manual")
        : unknown("The 90W/75W allocations require the documented 100W adapter; another input is not modeled.", "nu1Power"));
    const budget = input.nu1Usb === "one" ? 90 : input.nu1Usb === "all" ? 75 : null;
    checks.push(budget === null ? unknown("Only one-USB-port and all-USB-ports allocations are documented; choose a known case or verify your mixed load.", "nu1Power")
      : required !== null && required > budget ? fail(`The stated ${required}W laptop need exceeds this ${budget}W allocation.`, "nu1Power")
        : fit(`Baseus allocates up to ${budget}W to the laptop in this stated USB-load case, not 100W.`, "nu1Power"));
  } else {
    checks.push(confirmation(input.rd1Supply, "You confirmed use of RD1's included 180W supply.", "This plan lacks RD1's documented 180W supply.", "Confirm the included RD1 180W supply is used.", "rd1"));
    const peripherals = watts(input.peripheralWatts);
    if (required !== null && required > 100) checks.push(fail("RD1's laptop output is up to 100W, not its 160W shared total.", "rd1"));
    checks.push(peripherals === null ? unknown("Add the simultaneous other-device power demand; 160W is a shared total.", "rd1")
      : peripherals > 160 || (required !== null && required + peripherals > 160) ? fail("Laptop plus other-device demand exceeds the stated 160W shared total.", "rd1")
        : required === null ? unknown("Add the laptop charging demand before checking the 160W shared total.", "rd1")
          : fit("The stated total is within 160W; each port's allocation still needs confirmation.", "rd1"));
    checks.push(confirmation(input.peripheralPorts, "You checked the simultaneous port allocations for the other devices.",
      "A confirmed simultaneous port allocation cannot meet your other-device demand.", "Verify individual simultaneous port allocations; the shared total alone is insufficient.", "rd1Manual"));
  }
  return outcome(checks);
}

/** Evaluates both exact models locally, with separate display/power outcomes and no forced winner. */
export function evaluateBaseusScreens(answers = {}) {
  const input = { ...BaseusScreenDefaults, ...answers };
  input.laptop = String(input.laptop ?? "");
  return ["nu1-air-mac", "rd1-pro"].map(id => {
    const display = displayResult(id, input);
    const power = powerResult(id, input);
    const status = outcome([...display.checks, ...(power.status === "not-requested" ? [] : power.checks)]).status;
    return { id, display, power, status };
  });
}
