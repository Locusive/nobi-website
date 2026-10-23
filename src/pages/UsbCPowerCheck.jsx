import React, { useEffect, useState } from "react";
import PageLayout from "../components/PageLayout.jsx";
import { useSEO } from "../hooks/useSEO.js";
import { checkUsbCPower, EmptyPowerInput, formatPower, UsbCPowerSeo } from "../utils/usbCPower.js";

const Control = "mt-2 w-full rounded-lg border border-black/30 bg-white p-3 text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-600";
const Panel = "rounded-2xl border border-black/15 p-6 dark:border-white/20";
const Titles = { unknown: "More information needed", inconsistent: "These entered outputs conflict with the total", shortfall: "Below your entered target", meets: "Numbers meet your entered targets" };
const Examples = [
  { label: "Try 30W + 15W targets", input: { target1: "30", target2: "15", allocation1: "17.5", allocation2: "17.5", total: "35" } },
  { label: "Try 25W + 5W targets", input: { target1: "25", target2: "5", allocation1: "27.5", allocation2: "7.5", total: "35" } },
];

/** Anonymous two-device worksheet; entered values stay in component memory only. */
export default function UsbCPowerCheck() {
  useSEO(UsbCPowerSeo);
  const [ready, setReady] = useState(false);
  useEffect(() => { setReady(true); }, []);
  const [input, setInput] = useState({ ...EmptyPowerInput });
  const [result, setResult] = useState(null);
  const update = (key, value) => { setInput(previous => ({ ...previous, [key]: value })); setResult(null); };
  const reset = () => { setInput({ ...EmptyPowerInput }); setResult(null); };
  const calculate = event => { event.preventDefault(); setResult(checkUsbCPower(input)); };
  const example = values => { setInput({ ...values }); setResult(checkUsbCPower(values)); };
  return <PageLayout active="shop"><div className="mx-auto max-w-5xl px-6 pb-16 text-black dark:text-white">
    <header className="max-w-3xl py-10"><p className="text-sm font-semibold uppercase tracking-widest text-purple-700 dark:text-purple-300">Two devices. One charger.</p><h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">Check the shared watts before you buy.</h1><p className="mt-5 text-lg">A large total and two USB-C sockets do not tell you what each device gets. Compare your laptop and phone targets with the maker’s output chart for the exact ports used together.</p><p className="mt-4">This worksheet compares numbers you enter. It does not test your charger, discover your devices or predict a charge time.</p></header>
    <div className="grid items-start gap-6 md:grid-cols-2">
      <form onSubmit={calculate} noValidate className={Panel}>
        <h2 className="text-2xl font-semibold">Your two-device setup</h2><noscript><p>Enable JavaScript to calculate locally. You can still read the worked examples below.</p></noscript><p id="power-help" className="mt-3 text-sm">Use watts (W), with at most one decimal. Leave a field blank when unknown. A documented zero is different from unknown. Find each target in your device maker’s guidance and each output in the charger’s simultaneous-port chart.</p>
        {[1, 2].map(number => <fieldset key={number} className="mt-6"><legend className="text-lg font-semibold">Device {number}</legend>{[[`target${number}`, "Your wattage target"], [`allocation${number}`, "Documented output with both ports in use"]].map(([key, label]) => <PowerField key={key} name={key} label={`Device ${number}: ${label}`} value={input[key]} error={result?.errors[key]} onChange={update} disabled={!ready} />)}</fieldset>)}
        <PowerField name="total" label="Charger’s stated total output (optional)" value={input.total} error={result?.errors.total} onChange={update} disabled={!ready} />
        <p className="mt-3 text-sm">The total is only a consistency check. We never divide it or use it to fill missing port outputs.</p>
        {result?.status === "invalid" && <p role="alert" className="mt-4 text-red-700 dark:text-red-300">Correct the highlighted wattages, then check again.</p>}
        <div className="mt-6 flex flex-wrap gap-3"><button className="rounded-lg bg-purple-700 px-5 py-3 font-semibold text-white" type="submit" disabled={!ready}>Check my two-device setup</button><button className="rounded-lg border border-current px-5 py-3" type="button" disabled={!ready} onClick={reset}>Reset to unknown</button></div>
        <p className="mt-4 text-sm">Your entries are calculated in this page. They are not saved or sent by this checker.</p>
      </form>
      <section className={`${Panel} bg-slate-50 dark:bg-white/5`} aria-label="Power comparison result" aria-live="polite" aria-atomic="true">
        {result && result.status !== "invalid" ? <PowerResult result={result} /> : <><h2 className="text-2xl font-semibold">Start with the maker’s chart</h2><p className="mt-4">Enter the two targets and their simultaneous port outputs, then check the numbers. Blank fields stay unknown.</p></>}
        <p className="mt-5 text-sm">Published “up to” outputs are ceilings, not promised real-time delivery. Even a matching number is not a compatibility, fast-charging or safety guarantee. Confirm the exact device, cables, charging requirements and port combination.</p>
      </section>
    </div>
    <section className="mt-10 max-w-3xl"><h2 className="text-2xl font-semibold">A documented split, not a universal rule</h2><p className="mt-4">For its 35W dual USB-C adapter, Apple lists up to 17.5W each for a Mac laptop plus an iPhone or iPad. For a Mac or iPhone plus Apple Watch or AirPods, it lists up to 27.5W for the larger device and 7.5W for the accessory. Those examples apply to that adapter; they are not rules for another charger.</p><p className="mt-3"><a className="underline" href="https://support.apple.com/en-gb/111805">Read Apple’s shared-power instructions</a>.</p>
      <h3 className="mt-6 text-xl font-semibold">Try the arithmetic</h3><p className="mt-3">With example targets of 30W and 15W, outputs of 17.5W each leave the first device 12.5W below its target. Targets of 25W and 5W are both met by 27.5W and 7.5W outputs. These targets are illustrative, not specifications for a named laptop or phone.</p><div className="mt-4 flex flex-wrap gap-3">{Examples.map(item => <button className="rounded-lg border border-current px-4 py-2" key={item.label} type="button" disabled={!ready} onClick={() => example(item.input)}>{item.label}</button>)}</div>
      <h2 className="mt-8 text-2xl font-semibold">Fast charging needs its own check</h2><p className="mt-4">Apple’s Mac fast-charge guidance specifies model-dependent adapters and cables. Connector shape or a matching total does not establish fast charging. <a className="underline" href="https://support.apple.com/en-gb/102378">Check Apple’s combinations for your exact Mac model</a>, or use your device maker’s own guidance.</p>
      <h2 className="mt-8 text-2xl font-semibold">Take the requirements shopping</h2><p className="mt-4">Write down your targets, the exact ports, their simultaneous outputs and required cables. If you connect a third device, look up its three-port configuration; this two-device worksheet does not cover it.</p><p className="mt-4"><a className="font-semibold underline" href="/shop/s/black-chargers">Browse the existing charger collection</a>. Confirm current details and the selected variant with the retailer. This checker has not certified any listed product for your setup.</p><p className="mt-3 text-sm">Some shopping links may earn Shop Nobi a commission. Source information reviewed October 23, 2026. We have not physically tested charging performance or certified safety.</p>
    </section>
  </div></PageLayout>;
}

/** Keep each wattage control explicitly labelled with its own validation feedback. */
function PowerField({ name, label, value, error, onChange, disabled }) {
  return <div className="mt-4"><label htmlFor={`power-${name}`} className="font-medium">{label} (W)</label><input id={`power-${name}`} name={name} type="text" inputMode="decimal" autoComplete="off" maxLength={16} disabled={disabled} value={value} onChange={event => onChange(name, event.target.value)} className={Control} aria-invalid={!!error} aria-describedby={`power-help${error ? ` power-${name}-error` : ""}`} />{error && <p id={`power-${name}-error`} className="mt-2 text-sm text-red-700 dark:text-red-300">{error}</p>}</div>;
}

/** Show known shortfalls even when another device still needs documentation. */
function PowerResult({ result }) {
  return <><h2 className="text-2xl font-semibold">{Titles[result.status]}</h2>{result.status === "inconsistent" && <p className="mt-4">The two entered port outputs add up to more than the stated total. Check that all three values describe the same simultaneous configuration.</p>}{result.noPositiveTarget && <p className="mt-4">Enter at least one positive device target before comparing.</p>}{result.status !== "inconsistent" && <ul className="mt-5 space-y-4">{result.devices.map(device => <li key={device.number}><strong>Device {device.number}: </strong>{device.shortfall === null ? "Target or simultaneous output is unknown." : device.shortfall > 0 ? `${formatPower(device.shortfall)} below your entered target (${formatPower(device.allocation)} output against ${formatPower(device.target)} target).` : `Entered ${formatPower(device.allocation)} output meets your ${formatPower(device.target)} target numerically.`}</li>)}</ul>}</>;
}
