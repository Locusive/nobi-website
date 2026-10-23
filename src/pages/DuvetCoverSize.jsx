import React, { useEffect, useRef, useState } from "react";
import PageLayout from "../components/PageLayout.jsx";
import { useSEO } from "../hooks/useSEO.js";
import { addDuvetCover, compareDuvetDimensions, describeDuvetDifference, DuvetBases, DuvetSizeSeo, emptyDuvetInput } from "../utils/duvetSize.js";
import { createDuvetCompletionReporter, duvetShoppingPath } from "../utils/duvetMeasurement.js";

const Control = "mt-2 w-full rounded-lg border border-black/30 bg-white p-3 text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-600";
const Panel = "rounded-2xl border border-black/15 p-5 dark:border-white/20";
const Outcomes = {
  same: ["Same entered dimensions", "The cover and insert have the same entered width and length. Check pairing advice, ties, opening and care guidance; this is not a fit guarantee."],
  "cover-larger": ["Cover larger on at least one axis", "The cover has more flat width or length than the insert. Ask the maker whether that difference is intended."],
  "insert-larger": ["Insert larger on at least one axis", "The insert has more flat width or length than the cover. This can be intentional; the numbers alone do not tell us how full or comfortable the result will be."],
  mixed: ["Different directions", "One piece is wider while the other is longer. Check orientation and the maker’s exact pairing guidance before choosing."],
};

/** A local, neutral dimension comparison; no nominal-size lookup or automatic fit judgment. */
export default function DuvetCoverSize() {
  useSEO(DuvetSizeSeo);
  const [input, setInput] = useState(emptyDuvetInput);
  const [result, setResult] = useState(null);
  const [ready, setReady] = useState(false);
  const [shoppingPath, setShoppingPath] = useState(() => duvetShoppingPath());
  const form = useRef(null);
  const reporter = useRef(null);
  useEffect(() => { setReady(true); setShoppingPath(duvetShoppingPath(window.location.search)); }, []);
  const clearResult = next => { setInput(next); setResult(null); };
  const change = (id, key, value) => clearResult(id === "insert" ? { ...input, insert: { ...input.insert, [key]: value } }
    : { ...input, covers: input.covers.map(cover => cover.id === id ? { ...cover, [key]: value } : cover) });
  const compare = event => {
    event.preventDefault();
    const next = compareDuvetDimensions(input);
    setResult(next);
    const firstError = Object.keys(next.errors)[0];
    if (firstError) form.current?.elements.namedItem(firstError)?.focus();
    else { reporter.current ??= createDuvetCompletionReporter(); reporter.current(next); }
  };
  return <PageLayout active="shop"><div className="mx-auto max-w-6xl px-6 pb-16 text-black dark:text-white">
    <header className="max-w-3xl py-10"><p className="text-sm font-semibold uppercase tracking-widest text-purple-700 dark:text-purple-300">Measurements before labels</p><h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">Compare a duvet cover with your insert</h1><p className="mt-5 text-lg">A Queen or King label does not tell you whether two pieces have the same dimensions. Enter the width and length of your insert and up to three covers. Measurements alone do not guarantee fit.</p></header>
    <form ref={form} onSubmit={compare} noValidate>
      <p id="duvet-help" className="mb-5 max-w-3xl">Use current measurements for the exact product and size. Measure owned bedding flat without stretching it. Keep width and length in the maker’s orientation; do not enter mattress dimensions. Use 86.5 for 86½.</p>
      <noscript><p>Enable JavaScript for automatic comparison. You can still subtract insert width from cover width, and insert length from cover length, using the same units. Read the examples below.</p></noscript>
      <div className="grid items-start gap-5 md:grid-cols-2"><MeasurementFields id="insert" title="Your insert" row={input.insert} errors={result?.errors} change={change} disabled={!ready} />{input.covers.map(cover => <MeasurementFields key={cover.id} id={cover.id} title={`Cover ${cover.id}`} row={cover} errors={result?.errors} change={change} disabled={!ready} remove={cover.id === "A" ? null : () => clearResult({ ...input, covers: input.covers.filter(item => item.id !== cover.id) })} />)}</div>
      {Object.keys(result?.errors || {}).length > 0 && <p role="alert" className="mt-4 text-red-700 dark:text-red-300">Complete the highlighted measurements, units and source choices. Complete or remove an optional cover before comparing.</p>}
      <div className="mt-6 flex flex-wrap gap-3"><button disabled={!ready} type="submit" className="rounded-lg bg-purple-700 px-5 py-3 font-semibold text-white">Compare dimensions</button><button disabled={!ready || input.covers.length >= 3} type="button" className="rounded-lg border border-current px-5 py-3" onClick={() => clearResult({ ...input, covers: addDuvetCover(input.covers) })}>Add another cover</button><button disabled={!ready} type="button" className="rounded-lg border border-current px-5 py-3" onClick={() => clearResult(emptyDuvetInput())}>Reset measurements</button></div>
      <p className="mt-4 text-sm">Your dimensions stay in page memory. A valid comparison sends only a fixed completion signal through our existing analytics, without dimensions or result values.</p>
    </form>
    <section aria-label="Dimension comparison" aria-live="polite" aria-atomic="true" className="mt-8"><h2 className="text-2xl font-semibold">Your dimension comparison</h2>{result?.comparisons ? <DimensionResults result={result} /> : <p className="mt-4">Enter your measurements and compare. Editing an entry clears the previous comparison.</p>}<p className="mt-5 max-w-3xl">This compares flat measurements, not fill volume, comfort or guaranteed compatibility. A maker may intentionally use different cover and insert dimensions. Check its pairing advice, ties, closure and care instructions before buying.</p></section>
    <section className="mt-10 max-w-3xl"><h2 className="text-2xl font-semibold">What the differences mean</h2><p className="mt-4">For an illustrative 90 × 94 in insert and 92 × 92 in cover, the cover is 2 in wider and 2 in shorter. The different directions matter; equal area does not establish equal shape. We do not rotate measurements or choose a “best fit”.</p><p className="mt-4">90 × 94 in is exactly 228.6 × 238.76 cm, using 1 in = 2.54 cm. A tiny nonzero difference stays a difference, even when it would round to zero at one decimal.</p><h3 className="mt-6 text-xl font-semibold">A manufacturer example, with limits</h3><p className="mt-3">The reviewed <a className="underline" href="https://parachutehome.com/pages/size-guide-cotton-duvet-cover-set">Parachute cotton-cover guide</a> lists Full/Queen at 90 × 92 in. Its <a className="underline" href="https://parachutehome.com/products/down-duvet">down-insert page</a> lists Full/Queen at 90 × 94 in. That is the same width and a 2 in length difference. It does not establish that those products will or will not fit together, or give dimensions for other variants.</p><p className="mt-4"><a className="underline" href="https://www.ikea.com/ie/en/cat/duvet-cover-10680/">IKEA Ireland’s cover guidance</a> also advises checking actual measurements when combining bedding sources. Regional size labels are not a universal US size table. Sources reviewed October 23, 2026; no price, stock or physical fit test is supplied.</p>
      <h2 className="mt-8 text-2xl font-semibold">Ready to compare covers?</h2><ol className="mt-4 list-decimal space-y-3 pl-5"><li>Confirm the exact product and size variant using its current dimensions.</li><li>Check the maker’s pairing advice, especially when the insert is larger.</li><li>Compare ties, corner loops, opening and orientation; their presence does not prove alignment.</li><li>Read the product’s care instructions and current purchase conditions. Do not assume a universal shrinkage or return rule.</li></ol><p className="mt-5"><a className="font-semibold underline" href={shoppingPath}>Browse duvet covers</a>. This calculator does not filter the collection or guarantee that any listed item matches your entries. Confirm dimensions and included items with the retailer.</p><p className="mt-3 text-sm">Shop Nobi may earn a commission from some product links. You buy directly from the store.</p>
    </section>
  </div></PageLayout>;
}

/** Label every dimension, unit and measurement source; errors focus the exact control. */
function MeasurementFields({ id, title, row, errors = {}, change, disabled, remove }) {
  const field = (key, label, control) => <div className="mt-4"><label htmlFor={`duvet-${id}-${key}`} className="font-medium">{title}: {label}</label>{control}{errors?.[`${id}.${key}`] && <p id={`duvet-${id}-${key}-error`} className="mt-2 text-sm text-red-700 dark:text-red-300">{errors[`${id}.${key}`]}</p>}</div>;
  const props = key => ({ id: `duvet-${id}-${key}`, name: `${id}.${key}`, value: row[key], disabled, className: Control, onChange: event => change(id, key, event.target.value), "aria-invalid": !!errors?.[`${id}.${key}`], "aria-describedby": `duvet-help${errors?.[`${id}.${key}`] ? ` duvet-${id}-${key}-error` : ""}` });
  return <fieldset className={Panel}><legend className="px-2 text-xl font-semibold">{title}</legend>{["width", "length"].map(key => <React.Fragment key={key}>{field(key, key === "width" ? "Width" : "Length", <input {...props(key)} type="text" inputMode="decimal" maxLength={9} autoComplete="off" />)}</React.Fragment>)}{field("unit", "Unit", <select {...props("unit")}><option value="">Choose units</option><option value="in">Inches (in)</option><option value="cm">Centimetres (cm)</option></select>)}{field("basis", "Measurement source", <select {...props("basis")}><option value="">Choose source</option>{Object.entries(DuvetBases).map(([value, label]) => <option value={value} key={value}>{label}</option>)}</select>)}{remove && <button disabled={disabled} type="button" className="mt-5 underline" onClick={remove}>Remove Cover {id}</button>}</fieldset>;
}

/** Preserve candidate order and show each signed axis separately, without ranking. */
function DimensionResults({ result }) {
  return <div className="mt-5 grid gap-5 md:grid-cols-2 lg:grid-cols-3">{result.comparisons.map(item => <article key={item.id} className={Panel}><h3 className="text-xl font-semibold">Cover {item.id}: {Outcomes[item.state][0]}</h3><dl className="mt-4 space-y-2"><div><dt>Entered cover</dt><dd>{item.cover.enteredWidth} × {item.cover.enteredLength} {item.cover.unit}</dd></div><div><dt>Entered insert</dt><dd>{result.insert.enteredWidth} × {result.insert.enteredLength} {result.insert.unit}</dd></div><div><dt>Width difference</dt><dd className="font-semibold">{describeDuvetDifference(item.width, "width", result.insert.unit)}</dd></div><div><dt>Length difference</dt><dd className="font-semibold">{describeDuvetDifference(item.length, "length", result.insert.unit)}</dd></div></dl><p className="mt-4">{Outcomes[item.state][1]}</p>{item.unconfirmed && <p className="mt-4 font-semibold">Your measurements are unconfirmed. Check the exact width and length before choosing.</p>}{item.swapped && <p className="mt-4">These numbers match only if width and length are swapped. Recheck the labels, opening and tie orientation.</p>}</article>)}</div>;
}
