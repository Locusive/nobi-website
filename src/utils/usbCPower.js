/** Empty values stay unknown; the checker never supplies a charger allocation. */
export const EmptyPowerInput = Object.freeze({ target1: "", target2: "", allocation1: "", allocation2: "", total: "" });
const MaxWatts = 10000;

/** Parse a documented nonnegative wattage in integer tenths, without float arithmetic. */
function parseWatts(value) {
  if (typeof value !== "string") return { error: true };
  const text = value.trim();
  if (!text) return { value: null };
  if (!/^\d+(?:\.\d)?$/.test(text)) return { error: true };
  const [whole, decimal = "0"] = text.split(".");
  const tenths = Number(whole) * 10 + Number(decimal);
  return Number.isSafeInteger(tenths) && tenths <= MaxWatts * 10 ? { value: tenths } : { error: true };
}

/** Compare entered two-port ceilings with targets; never infer compatibility or a power split. */
export function checkUsbCPower(input) {
  const errors = {};
  const values = {};
  for (const key of Object.keys(EmptyPowerInput)) {
    const parsed = parseWatts(input[key]);
    if (parsed.error) errors[key] = `Enter 0–${MaxWatts.toLocaleString("en-US")} watts with at most one decimal, or leave unknown.`;
    values[key] = parsed.value;
  }
  if (Object.keys(errors).length) return { status: "invalid", errors };
  const devices = [1, 2].map(number => {
    const target = values[`target${number}`];
    const allocation = values[`allocation${number}`];
    return { number, target, allocation, shortfall: target === null || allocation === null ? null : Math.max(0, target - allocation) };
  });
  const knownOutput = devices.reduce((sum, device) => sum + (device.allocation ?? 0), 0);
  const inconsistent = values.total !== null && knownOutput > values.total;
  const unknown = devices.some(device => device.target === null || device.allocation === null);
  const noPositiveTarget = !devices.some(device => device.target > 0);
  const status = inconsistent ? "inconsistent" : unknown || noPositiveTarget ? "unknown"
    : devices.some(device => device.shortfall > 0) ? "shortfall" : "meets";
  return { status, errors, devices, noPositiveTarget };
}

/** Format an integer tenth of a watt for the result and examples. */
export function formatPower(tenths) { return `${tenths / 10}W`; }

/** Shared browser and static metadata for the anonymous arithmetic worksheet. */
export const UsbCPowerSeo = {
  path: "/tools/usb-c-power-check",
  title: "USB-C Shared Power Checker: Laptop + Phone | Shop Nobi",
  description: "Compare two device wattage targets with a charger's documented simultaneous port outputs. Check shortfalls and missing information before buying.",
  schema: [{ "@context": "https://schema.org", "@type": "WebPage", name: "USB-C Shared Power Checker", url: "https://nobi.ai/tools/usb-c-power-check" }],
};
