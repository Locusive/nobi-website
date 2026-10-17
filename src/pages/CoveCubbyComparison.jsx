import React, { useState } from "react";
import { useSEO } from "../hooks/useSEO.js";
import { CoveCubbyCheckedDate, CoveCubbyEntryPoint, CoveCubbyProducts, CoveCubbySeo, CoveCubbySlug } from "../content/coveCubbyComparison.js";
import { compareFootprints, convertMeasurement, exteriorArea } from "../utils/catFootprintFit.js";
import { readStoreLinkRel } from "../utils/shopNobiPage.js";
import { handleProductLinkClick } from "../utils/shopNobiProductClick.js";
import "./CoveCubbyComparison.css";

const InitialMeasurements = { width: "", depth: "", clearance: "", unit: "in", allowRotation: false };
const ExampleMeasurements = { width: "20", depth: "24", clearance: "0", unit: "in", allowRotation: false };
const CentimetersPerInch = 2.54;
const Drawing = { width: 350, height: 410, padding: 24 };

/** Format a measurement without implying more precision than the source dimensions. */
function formatMeasurement(value) {
  return Number(value.toFixed(2)).toLocaleString("en-US");
}

/** A source-based comparison and local-only calculator for two litter-box exterior footprints. */
export default function CoveCubbyComparison() {
  useSEO(CoveCubbySeo);
  return (
    <div className="cat-fit-page">
      <header className="cat-fit-header">
        <a className="cat-fit-brand" href="/shop">Shop Nobi</a>
        <a href="/shop">Explore Shop Nobi</a>
      </header>
      <main className="cat-fit-main">
        <p className="cat-fit-top-disclosure"><strong>#ad</strong> Nobi may earn a commission from qualifying purchases through links on this page.</p>
        <section className="cat-fit-intro" aria-labelledby="cat-fit-title">
          <div>
            <h1 id="cat-fit-title">Cove vs Cubby.<br />Which fits your space?</h1>
            <p className="cat-fit-lead">Cubby uses less floor space. Cove adds a built-in tool caddy. Compare their exterior dimensions, then measure your own spot.</p>
            <a className="cat-fit-jump" href="#measure-your-space">Check your floor space</a>
            <p className="cat-fit-checked">Manufacturer specifications and US prices checked {CoveCubbyCheckedDate}.</p>
          </div>
          <figure className="cat-fit-overview">
            <img src="/media/cove-cubby-footprints.svg" width="720" height="400" alt="Cubby and Cove exterior rectangles drawn to the same scale: Cubby is 15.2 inches wide by 21.2 inches deep; Cove is 16 inches wide by 26 inches deep." />
            <figcaption>Exterior rectangular bounds, drawn to one scale. Allow extra room for entry and cleaning.</figcaption>
          </figure>
        </section>
        <FootprintCalculator />
        <ExteriorAreaComparison />
        <ProductComparison />
        <section className="cat-fit-sources" aria-labelledby="cat-fit-sources-title">
          <h2 id="cat-fit-sources-title">Sources and limits</h2>
          <p>Dimensions and features come from Tuft & Paw’s product details and comparison FAQ. This is a specification comparison; we have not tested these litter boxes.</p>
          <ul>{CoveCubbyProducts.map(product => <li key={product.name}><a href={product.sourceUrl} rel="nofollow noopener" target="_blank">{product.name} manufacturer specifications</a></li>)}</ul>
          <p>The calculator checks a rectangle against your measurements. It does not establish comfortable space for your cat, entry height, access, cleaning room or furniture compatibility.</p>
        </section>
      </main>
      <footer className="cat-fit-footer"><a href="/shop">Shop Nobi</a><div><a href="/privacy">Privacy</a><a href="/terms">Terms</a></div></footer>
    </div>
  );
}

/** Explicit measurements produce a local geometric comparison; editing a value clears the old answer. */
function FootprintCalculator() {
  const [measurements, setMeasurements] = useState(InitialMeasurements);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [hasEdited, setHasEdited] = useState(false);

  /** Discard a previous answer whenever its input changes. */
  function updateMeasurement(name, value) {
    setMeasurements(previous => ({ ...previous, [name]: value }));
    setResult(null);
    setError("");
    setHasEdited(true);
  }

  /** Keep the physical space unchanged when displaying another unit. */
  function changeUnit(unit) {
    setMeasurements(previous => ({
      ...previous,
      unit,
      ...Object.fromEntries(["width", "depth", "clearance"].map(name => [name, convertMeasurement(previous[name], previous.unit, unit)])),
    }));
    setResult(null);
    setError("");
    setHasEdited(true);
  }

  /** Display either a complete comparison or the measurement error. */
  function compare(values) {
    try {
      setResult(compareFootprints(values));
      setError("");
    } catch (problem) {
      setError(problem.message);
      setResult(null);
    }
  }

  /** Make every assumption of the common floor-space example explicit. */
  function tryExample() {
    setMeasurements(ExampleMeasurements);
    setHasEdited(true);
    compare(ExampleMeasurements);
  }

  const summary = result ? summarizeFits(result) : hasEdited
    ? "Compare your measurements to see the result."
    : "Enter your measurements to see both footprints in your space.";

  return (
    <section id="measure-your-space" className="cat-fit-calculator" aria-labelledby="cat-fit-calculator-title">
      <div className="cat-fit-section-heading"><h2 id="cat-fit-calculator-title">Your space, at the same scale.</h2><p>Measure the available floor area. Choose your own allowance on each side.</p></div>
      <noscript><p>Enable JavaScript to calculate a fit. The comparison facts and store links below remain available.</p></noscript>
      <div className="cat-fit-workspace">
        <form onSubmit={event => { event.preventDefault(); compare(measurements); }} noValidate>
          <label htmlFor="cat-fit-unit">Units</label>
          <select id="cat-fit-unit" value={measurements.unit} onChange={event => changeUnit(event.target.value)}><option value="in">Inches</option><option value="cm">Centimeters</option></select>
          <div className="cat-fit-measurements">
            {[{ name: "width", label: "Available width", placeholder: measurements.unit === "in" ? "e.g. 20" : "e.g. 50" }, { name: "depth", label: "Available depth", placeholder: measurements.unit === "in" ? "e.g. 30" : "e.g. 75" }].map(field => (
              <div key={field.name}><label htmlFor={`cat-fit-${field.name}`}>{field.label}</label><input id={`cat-fit-${field.name}`} type="number" inputMode="decimal" min="0.01" step="any" required placeholder={field.placeholder} value={measurements[field.name]} onChange={event => updateMeasurement(field.name, event.target.value)} /></div>
            ))}
          </div>
          <label htmlFor="cat-fit-clearance">Extra clearance on each side</label>
          <input id="cat-fit-clearance" type="number" inputMode="decimal" min="0" step="any" required placeholder="Choose an allowance" aria-describedby="cat-fit-clearance-hint" value={measurements.clearance} onChange={event => updateMeasurement("clearance", event.target.value)} />
          <p id="cat-fit-clearance-hint" className="cat-fit-hint">Your choice, not a manufacturer recommendation. Zero checks the exterior alone.</p>
          <div className="cat-fit-checkbox"><input id="cat-fit-rotation" type="checkbox" checked={measurements.allowRotation} onChange={event => updateMeasurement("allowRotation", event.target.checked)} /><label htmlFor="cat-fit-rotation">I can rotate the box 90° and still provide access.</label></div>
          <button className="cat-fit-primary" type="submit">Compare footprints</button>
          {error && <p className="cat-fit-error" role="alert">{error}</p>}
          <button className="cat-fit-example" type="button" onClick={tryExample}>Try the 20 × 24 inch example</button>
          <p className="cat-fit-hint">Example only: no rotation and zero extra clearance.</p>
        </form>
        <div className="cat-fit-results">
          <p className="cat-fit-result-summary" role="status" aria-live="polite">{summary}</p>
          {result ? <PlacementDrawings result={result} unit={measurements.unit} /> : <div className="cat-fit-empty"><svg viewBox="0 0 150 125" aria-hidden="true"><rect x="15" y="10" width="120" height="105" fill="#f5f8ff" stroke="#667592" strokeWidth="2" strokeDasharray="5 5" /><rect x="35" y="40" width="75" height="60" fill="#a3decf" stroke="#202b4a" strokeWidth="2" /></svg><p>One measured space.<br />Two exterior footprints.</p></div>}
          <div className="cat-fit-key"><span><i className="cat-fit-space-key" />Available floor area</span><span><i className="cat-fit-box-key" />Box exterior</span></div>
          <p className="cat-fit-result-note">A footprint fit is only one check. Confirm entry, cleaning access and your cat’s needs before buying.</p>
        </div>
      </div>
    </section>
  );
}

/** Describe the computed geometric outcome without a cat-suitability recommendation. */
function summarizeFits(result) {
  const names = result.placements.filter(placement => placement.fits).map(placement => placement.name);
  if (names.length === 2) return "Both exterior footprints fit with your chosen allowance.";
  if (names.length === 1) return `${names[0]}’s exterior fits with your chosen allowance.`;
  return "Neither exterior fits with these measurements and allowance.";
}

/** Draw both placements using one scale, including an exterior that exceeds the available floor area. */
function PlacementDrawings({ result, unit }) {
  const { space, placements } = result;
  const maximumWidth = Math.max(space.width, ...placements.map(item => item.placedWidth + 2 * space.clearance));
  const maximumDepth = Math.max(space.depth, ...placements.map(item => item.placedDepth + 2 * space.clearance));
  const scale = Math.min((Drawing.width - 2 * Drawing.padding) / maximumWidth, (Drawing.height - 2 * Drawing.padding) / maximumDepth);
  const factor = unit === "cm" ? CentimetersPerInch : 1;
  return <div className="cat-fit-drawings">{placements.map(placement => (
    <section key={placement.name} className="cat-fit-option">
      <h3>{placement.name}</h3>
      <p className="cat-fit-size">{formatMeasurement(placement.width * factor)} × {formatMeasurement(placement.depth * factor)} {unit}</p>
      <svg viewBox={`0 0 ${Drawing.width} ${Drawing.height}`} role="img" aria-label={`${placement.name}: exterior ${placement.fits ? "fits" : "needs more space"}${placement.rotated ? ", rotated 90 degrees" : ""}`}>
        <rect x={Drawing.padding} y={Drawing.padding} width={space.width * scale} height={space.depth * scale} fill="#f5f8ff" stroke="#667592" strokeWidth="2" strokeDasharray="6 5" />
        <rect x={Drawing.padding + space.clearance * scale} y={Drawing.padding + space.clearance * scale} width={placement.placedWidth * scale} height={placement.placedDepth * scale} fill={placement.color} fillOpacity=".85" stroke="#202b4a" strokeWidth="2" />
      </svg>
      <p className="cat-fit-status">{placement.fits ? "Exterior fits" : "Needs more space"}</p>
      <p className="cat-fit-placement">{placement.rotated && "Rotated 90°. "}Needs {formatMeasurement((placement.placedWidth + 2 * space.clearance) * factor)} × {formatMeasurement((placement.placedDepth + 2 * space.clearance) * factor)} {unit}, including your clearance.</p>
    </section>
  ))}</div>;
}

/** Separate exterior rectangle arithmetic from the manufacturer's usable-area statement. */
function ExteriorAreaComparison() {
  const [cubby, cove] = CoveCubbyProducts;
  const increase = Math.round((exteriorArea(cove) / exteriorArea(cubby) - 1) * 100);
  return (
    <section className="cat-fit-area" aria-labelledby="cat-fit-area-title">
      <div><h2 id="cat-fit-area-title">A larger exterior isn’t more litter area.</h2><p>Cove’s exterior rectangle uses about {increase}% more floor area than Cubby’s. Tuft & Paw says the usable litter area is the same; Cove’s extra footprint includes its tool caddy.</p><p className="cat-fit-hint">The area calculation uses exterior width × depth. It does not measure the box’s interior or your cat’s comfort.</p></div>
      <div className="cat-fit-bars">{CoveCubbyProducts.map(product => <div key={product.name}><div className="cat-fit-bar-label"><strong>{product.name}</strong><span>{formatMeasurement(exteriorArea(product))} in²</span></div><div className="cat-fit-bar-track"><div style={{ width: `${exteriorArea(product) / exteriorArea(cove) * 100}%`, background: product.color }} /></div></div>)}</div>
    </section>
  );
}

/** Provide dated prices and manufacturer exits with disclosures only when links are verified as paid. */
function ProductComparison() {
  const hasPaidLinks = CoveCubbyProducts.some(product => product.paidLink);
  return (
    <section className="cat-fit-products" aria-labelledby="cat-fit-products-title">
      <h2 id="cat-fit-products-title">Compare the details.</h2>
      <p className="cat-fit-product-date">US prices checked {CoveCubbyCheckedDate}. Prices and availability can change.</p>
      {hasPaidLinks && <p className="cat-fit-disclosure">We may earn a commission from qualifying purchases through these links.</p>}
      <div className="cat-fit-product-grid">{CoveCubbyProducts.map((product, index) => (
        <article key={product.name}>
          <div className="cat-fit-product-heading"><h3>{product.name}</h3><p>${product.price}<span> USD</span></p></div>
          <p className="cat-fit-product-dimensions">{product.width}″ wide × {product.depth}″ deep</p>
          <p>{product.feature}</p>
          <a className="cat-fit-store-link" href={product.url} target="_blank" rel={readStoreLinkRel(product.paidLink)} onClick={event => recordProductClick(event, product, index)} onAuxClick={event => recordProductClick(event, product, index)}>Check {product.name} at Tuft & Paw</a>
          {product.paidLink && <p className="cat-fit-hint">We may earn a commission.</p>}
        </article>
      ))}</div>
    </section>
  );
}

/** Use the existing standalone click path, with the comparison's actual surface and verified catalog identity. */
function recordProductClick(event, product, index) {
  handleProductLinkClick(event, {
    product,
    position: index + 1,
    query: "Cove vs Cubby",
    slug: CoveCubbySlug,
    entryPoint: CoveCubbyEntryPoint,
  });
}
