/** Explicit source and unit choices; no nominal bed-size presets. */
export const DuvetUnits = Object.freeze({ in: 25400, cm: 10000 });
export const DuvetBases = Object.freeze({ listing: "Current product listing", label: "Product label", measured: "Measured flat", unknown: "Not sure" });
const CandidateIds = ["A", "B", "C"];
const EmptyMeasurement = Object.freeze({ width: "", length: "", unit: "", basis: "" });

/** Start unanswered, with one required candidate and no stored measurements. */
export function emptyDuvetInput() { return { insert: { ...EmptyMeasurement }, covers: [{ id: "A", ...EmptyMeasurement }] }; }

/** Add the next fixed candidate label without changing existing measurements or order. */
export function addDuvetCover(covers) {
  const id = CandidateIds.find(candidate => !covers.some(cover => cover.id === candidate));
  return id ? [...covers, { id, ...EmptyMeasurement }].sort((a, b) => a.id.localeCompare(b.id)) : covers;
}

/** Parse hundredths of an entered unit, then normalize to exact integer micrometres. */
function normalizeMeasurement(value, unit) {
  if (typeof value !== "string" || !/^\d{1,6}(?:\.\d{1,2})?$/.test(value.trim())) return null;
  const [whole, decimal = ""] = value.trim().split(".");
  const hundredths = Number(whole) * 100 + Number(decimal.padEnd(2, "0"));
  return hundredths > 0 && Object.hasOwn(DuvetUnits, unit) ? hundredths * DuvetUnits[unit] / 100 : null;
}

/** Validate one complete active row, keeping unknown measurement provenance visible. */
function readDimensions(row, id, errors) {
  const source = row || {};
  if (!Object.hasOwn(DuvetUnits, source.unit)) errors[`${id}.unit`] = "Choose inches or centimetres explicitly.";
  if (!Object.hasOwn(DuvetBases, source.basis)) errors[`${id}.basis`] = "Choose where the measurements came from, or Not sure.";
  const dimensions = {};
  for (const axis of ["width", "length"]) {
    const normalized = normalizeMeasurement(source[axis], source.unit);
    if (normalized === null && Object.hasOwn(DuvetUnits, source.unit)) errors[`${id}.${axis}`] = "Enter a positive number, up to six whole digits and two decimals. Use 86.5 for 86½.";
    dimensions[axis] = normalized;
  }
  return { ...dimensions, unit: source.unit, basis: source.basis, enteredWidth: source.width, enteredLength: source.length };
}

/** Classify signed axis differences without a tolerance, rotation or fit verdict. */
function dimensionState(width, length) {
  if (width === 0 && length === 0) return "same";
  if (width >= 0 && length >= 0) return "cover-larger";
  if (width <= 0 && length <= 0) return "insert-larger";
  return "mixed";
}

/** Compare one insert with every active cover using exact normalized dimensions. */
export function compareDuvetDimensions(input) {
  const errors = {};
  const insert = readDimensions(input?.insert, "insert", errors);
  const covers = input?.covers;
  if (!Array.isArray(covers) || covers.length < 1 || covers.length > 3 || covers[0]?.id !== "A"
      || new Set(covers.map(cover => cover?.id)).size !== covers.length
      || covers.some(cover => !CandidateIds.includes(cover?.id))) errors.covers = "Compare Cover A and up to two additional covers.";
  const candidates = Array.isArray(covers) ? covers.map(cover => ({ id: cover?.id, ...readDimensions(cover, cover?.id, errors) })) : [];
  if (Object.keys(errors).length) return { errors };
  const comparisons = candidates.map(cover => {
    const width = cover.width - insert.width;
    const length = cover.length - insert.length;
    return { id: cover.id, cover, width, length, state: dimensionState(width, length),
      swapped: (width !== 0 || length !== 0) && cover.width === insert.length && cover.length === insert.width,
      unconfirmed: insert.basis === "unknown" || cover.basis === "unknown" };
  });
  return { errors, insert, comparisons };
}

/** Preserve the direction of tiny differences instead of rounding them into equality. */
export function describeDuvetDifference(difference, axis, unit) {
  if (difference === 0) return `Same entered ${axis}`;
  const rounded = Math.round(Math.abs(difference) / DuvetUnits[unit] * 10) / 10;
  const amount = rounded === 0 ? `less than 0.1 ${unit}` : `${rounded.toFixed(1)} ${unit}`;
  const direction = axis === "width" ? difference > 0 ? "wider" : "narrower" : difference > 0 ? "longer" : "shorter";
  return `Cover is ${amount} ${direction}`;
}

/** Shared static and browser metadata, with no product recommendation schema. */
export const DuvetSizeSeo = {
  path: "/tools/duvet-cover-size", title: "Duvet Cover & Insert Size Calculator | Shop Nobi",
  description: "Compare your duvet insert with up to three covers in inches or centimetres. See width and length differences, then check the maker’s fit guidance.",
  schema: [{ "@context": "https://schema.org", "@type": "WebPage", name: "Duvet Cover and Insert Size Calculator", url: "https://nobi.ai/tools/duvet-cover-size" }],
};
