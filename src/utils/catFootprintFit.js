import { CoveCubbyProducts } from "../content/coveCubbyComparison.js";

const CentimetersPerInch = 2.54;
/** Absorbs decimal conversion error, not a physical placement allowance. */
const NumericalTolerance = 1e-9;

/** Read one finite measurement without treating a missing value as zero. */
function readMeasurement(value, allowsZero) {
  if ((typeof value !== "string" && typeof value !== "number") || String(value).trim() === "") {
    throw new Error("Enter your width, depth and clearance allowance.");
  }
  const measurement = Number(value);
  if (!Number.isFinite(measurement) || (allowsZero ? measurement < 0 : measurement <= 0)) {
    throw new Error("Use positive width and depth, and a clearance of zero or more.");
  }
  return measurement;
}

/** Compare exterior rectangular bounds with the same chosen clearance on all four sides. */
export function compareFootprints({ width, depth, clearance, unit = "in", allowRotation = false }) {
  if (unit !== "in" && unit !== "cm") throw new Error("Choose inches or centimeters.");
  const divisor = unit === "cm" ? CentimetersPerInch : 1;
  const space = {
    width: readMeasurement(width, false) / divisor,
    depth: readMeasurement(depth, false) / divisor,
    clearance: readMeasurement(clearance, true) / divisor,
  };
  if (!Number.isFinite(space.clearance * 2)) throw new Error("Use smaller measurements.");
  return { space, placements: CoveCubbyProducts.map(product => findPlacement(product, space, allowRotation)) };
}

/** Prefer the normal orientation; rotate only when allowed and necessary for a fit. */
function findPlacement(product, space, allowRotation) {
  const fits = (width, depth) => space.width + NumericalTolerance >= width + 2 * space.clearance
    && space.depth + NumericalTolerance >= depth + 2 * space.clearance;
  const normalFits = fits(product.width, product.depth);
  const rotated = !normalFits && Boolean(allowRotation) && fits(product.depth, product.width);
  return {
    ...product,
    fits: normalFits || rotated,
    rotated,
    placedWidth: rotated ? product.depth : product.width,
    placedDepth: rotated ? product.width : product.depth,
  };
}

/** Convert a filled control while keeping its physical measurement unchanged; leave invalid/empty input alone. */
export function convertMeasurement(value, fromUnit, toUnit) {
  if (![fromUnit, toUnit].every(unit => unit === "in" || unit === "cm")) throw new Error("Choose inches or centimeters.");
  if (fromUnit === toUnit || String(value).trim() === "" || !Number.isFinite(Number(value))) return value;
  const factor = toUnit === "cm" ? CentimetersPerInch : 1 / CentimetersPerInch;
  return String(Number((Number(value) * factor).toFixed(8)));
}

/** Return the area of the exterior bounding rectangle, not the usable litter area. */
export function exteriorArea(product) {
  return product.width * product.depth;
}
