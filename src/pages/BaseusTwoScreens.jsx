import React, { useState } from "react";
import { useSEO } from "../hooks/useSEO.js";
import { BaseusScreenCheckedDate, BaseusScreenEntryPoint, BaseusScreenProducts, BaseusScreenQuery, BaseusScreenSeo, BaseusScreenSlug, BaseusScreenSources } from "../content/baseusScreens.js";
import { BaseusScreenDefaults, evaluateBaseusScreens } from "../utils/baseusScreenFit.js";
import { handleProductLinkClick } from "../utils/shopNobiProductClick.js";
import { readStoreLinkRel } from "../utils/shopNobiPage.js";
import "./BaseusTwoScreens.css";

const Unknown = ["unknown", "I don't know yet"];
const ConfirmationOptions = [Unknown, ["yes", "Yes, checked for this exact setup"], ["no", "No"]];
const ModeOptions = [["1080p60", "1920 × 1080 at 60Hz"], ["1440p60", "2560 × 1440 at 60Hz"], ["4k30", "3840 × 2160 at 30Hz"], ["4k60", "3840 × 2160 at 60Hz"], ["4k120", "3840 × 2160 at 120Hz"], ["unknown", "Other / unknown"]];
const Labels = { conditional: "Documented conditional fit", fail: "Does not fit this plan", unknown: "Needs checking", "not-requested": "Not requested" };

/** Compares two source-dated exact docks without running a search, installer, account action or hardware test. */
export default function BaseusTwoScreens() {
  useSEO(BaseusScreenSeo);
  return <div className="screen-fit-page">
    <header className="screen-fit-header"><a className="screen-fit-brand" href="/shop">Shop Nobi</a><a href="/shop">Explore Shop Nobi</a></header>
    <main className="screen-fit-main">
      <section className="screen-fit-intro" aria-labelledby="screen-fit-title">
        <div><p className="screen-fit-eyebrow">NU1 Air Mac / RD1 Pro WIN</p><h1 id="screen-fit-title">Two monitors.<br />Two different screens?</h1>
          <p className="screen-fit-lead">A second connector can show a second copy. Check the display path before buying a Baseus dock.</p>
          <a href="#screen-selector" className="screen-fit-jump">Check your setup ↓</a><p className="screen-fit-date">US models and prices checked {BaseusScreenCheckedDate}. Manufacturer specifications, not hands-on testing.</p></div>
        <figure><img src="/media/baseus-independent-screens.svg" width="1200" height="800" alt="Independent displays show A, B and C. Mirrored external displays show A, B and B. Connector count does not establish independent desktops." /><figcaption>Letters show different content. This diagram explains the layouts, not every laptop’s native display limit.</figcaption></figure>
      </section>
      <section className="screen-fit-fact-strip" aria-label="The three differences to check"><p><strong>Mac + RD1?</strong> Its two external outputs mirror.</p><p><strong>NU1 + two screens?</strong> Verify DisplayLink and the 1440p60 table.</p><p><strong>Windows + dual 4K60?</strong> RD1 needs the DP1.4 + DSC path.</p></section>
      <ScreenSelector />
      <SourceFacts />
      <SourceNotes />
    </main>
    <footer className="screen-fit-footer"><a href="/shop">Shop Nobi</a><div><a href="/privacy">Privacy</a><a href="/terms">Terms</a></div></footer>
  </div>;
}

/** Keeps answers in component memory and sends only the fixed product topic on an actual merchant exit. */
function ScreenSelector() {
  const [answers, setAnswers] = useState({ ...BaseusScreenDefaults });
  const [results, setResults] = useState(() => evaluateBaseusScreens());
  const [answersChanged, setAnswersChanged] = useState(false);
  const change = event => {
    setAnswers(previous => ({ ...previous, [event.target.name]: event.target.value }));
    setAnswersChanged(true);
  };
  const fieldProps = { answers, change };
  return <section className="screen-fit-selector" id="screen-selector" aria-labelledby="screen-selector-title">
    <div className="screen-fit-section-heading"><h2 id="screen-selector-title">Check the exact setup.</h2><p>“I don’t know” is useful. We’ll show what is missing instead of guessing. These controls calculate locally; using them does not run a product search.</p></div>
    <form onSubmit={event => { event.preventDefault(); setResults(evaluateBaseusScreens(answers)); setAnswersChanged(false); }}>
      <fieldset><legend>1. Your laptop and screens</legend><div className="screen-fit-fields">
        <TextAnswer {...fieldProps} name="laptop" label="Exact laptop model, year and chip / GPU" placeholder="Use the name from the manufacturer’s specifications" />
        <TextAnswer {...fieldProps} name="laptopSource" label="Laptop manufacturer specification link" type="url" placeholder="https://…" />
        <SelectAnswer {...fieldProps} name="os" label="Operating system" options={[Unknown, ["mac14", "macOS Sonoma 14"], ["mac15", "macOS Sequoia 15"], ["mac26", "macOS Tahoe 26"], ["mac27", "macOS Golden Gate 27"], ["macOther", "Another macOS version"], ["win10", "Windows 10"], ["win11", "Windows 11"], ["other", "Another operating system"]]} />
        <SelectAnswer {...fieldProps} name="count" label="Independent external screens through this dock" options={[["1", "1 external screen"], ["2", "2 different external screens"], ["3", "3 different external screens"]]} />
        <SelectAnswer {...fieldProps} name="firstMode" label="Screen 1 resolution and refresh" options={ModeOptions} />
        {answers.count === "2" && <SelectAnswer {...fieldProps} name="secondMode" label="Screen 2 resolution and refresh" options={ModeOptions} />}
        <SelectAnswer {...fieldProps} name="builtIn" label="Must the built-in laptop screen stay on?" options={[Unknown, ["yes", "Yes"], ["no", "No"]]} />
        <SelectAnswer {...fieldProps} name="use" label="What must this setup support?" options={[["office", "Ordinary office desktops"], ["protected", "Protected streaming must work"], ["gaming", "Gaming, HDR / VRR or latency-sensitive work"], ["prelogin", "Pre-login / FileVault display"], Unknown]} />
      </div></fieldset>
      <details className="screen-fit-input-detail"><summary>2. Verify ports, cables and software <span>Needed for a conditional fit</span></summary><div className="screen-fit-fields">
        <SelectAnswer {...fieldProps} name="host" label="Host USB-C capabilities" options={[Unknown, ["yes", "Full-featured: data, DP Alt Mode and charging"], ["video-only", "Data and DP Alt Mode, but no laptop charging"], ["no", "No data or no DP Alt Mode"]]} note="Baseus requires a full-featured host. A port without laptop charging needs exact confirmation, even if you use separate power." />
        <SelectAnswer {...fieldProps} name="path" label="Dock-to-monitor connections" options={[Unknown, ["hdmi", "Direct HDMI cables"], ["dp", "Direct DisplayPort cables"], ["mixed", "One HDMI and one DisplayPort"], ["usb-c", "Dock USB-C data / charging ports"], ["adapter", "Adapters, another hub or another path"]]} />
        <SelectAnswer {...fieldProps} name="modePath" label="Exact host, monitors and cables support the chosen modes" options={ConfirmationOptions} />
        {answers.builtIn === "yes" && <SelectAnswer {...fieldProps} name="builtInConfirmed" label="This exact setup supports the built-in screen staying on" options={ConfirmationOptions} note="Native Mac display limits and lid rules vary by exact model." />}
        <SelectAnswer {...fieldProps} name="displayLink" label="NU1: supporting DisplayLink version and permissions" options={ConfirmationOptions} note="Confirm OS support, installation access and required Mac permissions. Nothing is installed here." />
        {answers.count === "2" && <SelectAnswer {...fieldProps} name="videoGroups" label="NU1: one connection from each video group" options={ConfirmationOptions} note="HDMI or DP in Video 1, plus HDMI or DP in Video 2. Two in one group are not independent." />}
        <SelectAnswer {...fieldProps} name="dp" label="RD1: confirmed Windows host DP / DSC path" options={[Unknown, ["dp14dsc", "DP1.4 with DSC"], ["dp14", "DP1.4 without DSC"], ["dp12", "DP1.2"]]} note="DSC is Display Stream Compression. Do not assume it from a port name." />
        {answers.count === "1" && <SelectAnswer {...fieldProps} name="rd1Port" label="RD1 output for the single screen" options={[Unknown, ["hdmi1", "HDMI1"], ["hdmi2", "HDMI2"]]} />}
      </div></details>
      <details className="screen-fit-input-detail"><summary>3. Keep laptop charging separate <span>Optional, but not assumed</span></summary>
        <div className="screen-fit-fields"><SelectAnswer {...fieldProps} name="charging" label="Must the dock charge the laptop?" options={[Unknown, ["yes", "Yes"], ["no", "No, I will use separate laptop power"]]} />
          {answers.charging === "yes" && <><TextAnswer {...fieldProps} name="watts" label="Laptop manufacturer’s required charging watts" type="number" placeholder="For example, 65" /><SelectAnswer {...fieldProps} name="pdPath" label="Host USB-C PD and cable / port ratings verified" options={ConfirmationOptions} />
            <SelectAnswer {...fieldProps} name="nu1Adapter" label="NU1: separate input adapter" options={[["unknown", "Unknown"], ["100", "Suitable 100W PD adapter"], ["other", "Another adapter"], ["none", "No input adapter"]]} />
            <SelectAnswer {...fieldProps} name="nu1Usb" label="NU1: simultaneous USB-port load" options={[Unknown, ["one", "One USB port in use (90W laptop allocation)"], ["all", "All USB ports in use (75W laptop allocation)"], ["mixed", "A different / mixed USB load"]]} />
            <SelectAnswer {...fieldProps} name="rd1Supply" label="RD1: included 180W supply is used" options={ConfirmationOptions} />
            <TextAnswer {...fieldProps} name="peripheralWatts" label="RD1: other devices’ simultaneous watts" type="number" placeholder="Enter 0 only if no other devices draw power" />
            <SelectAnswer {...fieldProps} name="peripheralPorts" label="RD1: simultaneous individual port allocations checked" options={ConfirmationOptions} note="160W is shared; a total below it does not establish every port’s output." /></>}
        </div>
      </details>
      <button className="screen-fit-compare" type="submit">Compare these docks</button><p className="screen-fit-form-note">A conditional fit uses your confirmations and the dated source claims. It is not a hardware compatibility certification.</p>
      <noscript><p>Enable JavaScript to compare your answers. The model limits and source links below are readable without it.</p></noscript>
    </form>
    {answersChanged && <p className="screen-fit-update-note" role="status">Answers changed. Select “Compare these docks” to update the results below.</p>}
    <div className="screen-fit-results" aria-live="polite" aria-atomic="false">{results.map(result => <ResultCard key={result.id} result={result} />)}</div>
    <p className="screen-fit-native-note">Neither is a fit? Keep a working setup. Check your laptop’s existing native display ports and exact limits before buying another dock. This selector covers only these two models.</p>
  </section>;
}

/** Uses native labeled controls with an explicit unknown option; no third-party form service. */
function SelectAnswer({ answers, change, name, label, options, note }) {
  return <div className="screen-fit-field"><label htmlFor={`screen-${name}`}>{label}</label><select id={`screen-${name}`} name={name} value={answers[name]} onChange={change}>{options.map(([value, text]) => <option value={value} key={value}>{text}</option>)}</select>{note && <small>{note}</small>}</div>;
}

/** Optional evidence stays local, including laptop identity and the source link supplied by the shopper. */
function TextAnswer({ answers, change, name, label, placeholder, type = "text" }) {
  return <div className="screen-fit-field"><label htmlFor={`screen-${name}`}>{label}</label><input id={`screen-${name}`} name={name} type={type} min={type === "number" ? "0" : undefined} step={type === "number" ? "any" : undefined} value={answers[name]} placeholder={placeholder} onChange={change} /></div>;
}

/** A manufacturer-details exit remains clearly separate from a positive compatibility recommendation. */
function ResultCard({ result }) {
  const product = BaseusScreenProducts.find(item => item.id === result.id);
  return <article className={`screen-fit-result screen-fit-result-${result.status}`} aria-labelledby={`result-${product.id}`}>
    <p className="screen-fit-result-status">{Labels[result.status]}</p><h3 id={`result-${product.id}`}>{product.name}</h3><p className="screen-fit-model">{product.model}</p>
    <ResultChecks title="Displays" result={result.display} /><ResultChecks title="Laptop charging" result={result.power} />
    <p className="screen-fit-price">US price checked: <strong>${product.price.toFixed(2)}</strong><span>Before tax or extras. Recheck the current price.</span></p>
    <p className="screen-fit-disclosure">We may earn a commission from qualifying purchases through these links.</p>
    <a className="screen-fit-store-link" href={product.url} target="_blank" rel={readStoreLinkRel(product.paidLink)} onClick={event => recordProductClick(event, product)} onAuxClick={event => recordProductClick(event, product)}>Manufacturer details: {product.name}</a><p className="screen-fit-exit-note">Opens Baseus. This link does not mean the dock fits your answers.</p>
  </article>;
}

/** Displays unmet checks first, while preserving the complete source-linked reasoning. */
function ResultChecks({ title, result }) {
  const unmet = result.checks.filter(item => item.status !== "conditional");
  return <div className="screen-fit-checks"><h4>{title} <span>{Labels[result.status]}</span></h4>
    {unmet.length > 0 && <ul>{unmet.slice(0, 3).map((item, index) => <Reason key={index} item={item} />)}</ul>}
    <details><summary>{unmet.length > 3 ? `${unmet.length} checks need attention; see all reasoning` : "See all checks and sources"}</summary><ul>{result.checks.map((item, index) => <Reason key={index} item={item} />)}</ul></details>
  </div>;
}

/** Connects each factual check to its exact authored source, without treating user input as verified evidence. */
function Reason({ item }) {
  const source = BaseusScreenSources[item.source];
  return <li>{item.message}{source && <> <a href={source.url} target="_blank" rel="nofollow noopener">Source</a></>}</li>;
}

/** Uses the existing standalone visit and real variant identity, never the shopper's selector answers. */
function recordProductClick(event, product) {
  handleProductLinkClick(event, { product, position: BaseusScreenProducts.indexOf(product) + 1, query: BaseusScreenQuery, slug: BaseusScreenSlug, entryPoint: BaseusScreenEntryPoint });
}

/** Makes important limitations useful even when the shopper has incomplete hardware specifications. */
function SourceFacts() {
  return <section className="screen-fit-facts" aria-labelledby="screen-fit-facts-title"><h2 id="screen-fit-facts-title">What the source tables actually say</h2>
    <div className="screen-fit-facts-grid"><article><h3>NU1 Air Mac</h3><p>One 4K60 display, or two 1440p60 displays through DisplayLink. Choose HDMI or DP from each of two video groups.</p><p>Broad “dual 4K” marketing conflicts with the simultaneous-display table. We do not treat dual 4K60 as verified.</p><p>The charger and cables are separate. With the documented 100W input, Baseus shows 90W to the laptop with one USB port in use, or 75W with all USB ports in use.</p></article>
      <article><h3>RD1 Pro WIN</h3><p>On macOS, two connected external outputs mirror. Native Mac multi-display support does not change this dock’s behavior.</p><p>On Windows: DP1.4 + DSC lists dual 4K60; DP1.4 without DSC lists dual 4K30; DP1.2 lists dual 1080p60. The manufacturer manual also lists dual 1440p60 without DSC.</p><p>The Windows DP1.2 single-screen row lists 4K30 on both HDMI outputs. Single 4K120 belongs to HDMI2 and a capable complete path. Its included 180W supply feeds a shared 160W output budget, with up to 100W for the host.</p></article></div>
    <p>Choosing a separate charger for two devices? <a href="/tools/usb-c-power-check">Compare their targets with the charger’s shared port outputs</a>. This separate worksheet does not calculate a dock’s own power budget.</p>
    <p>USB-C data and charging sockets are not monitor outputs. Unlisted mixed modes, adapter chains and special uses remain unverified here.</p>
  </section>;
}

/** Discloses source conflicts, manual-copy limitations and the difference between stated and tested behavior. */
function SourceNotes() {
  return <section className="screen-fit-sources" aria-labelledby="screen-fit-sources-title"><h2 id="screen-fit-sources-title">Sources, dates and limits</h2>
    <p>Checked {BaseusScreenCheckedDate}. We have not physically tested these docks. A conditional result means the source documents the mode and you confirmed the remaining setup conditions.</p>
    <p>The current Mac DisplayLink page lists Manager 17.0 for macOS 14, 15, 26 and 27; older releases have separate legacy downloads. Check the exact version and permissions with your administrator. Nothing is downloaded or installed by this selector.</p>
    <p>The two manufacturer-authored manuals below are mirrored copies. Baseus’s official selector exposed manual links, but its PDF CDN could not be read during this check. We cannot match those copies to the latest hardware revision. The key Mac-mirroring, DSC and simultaneous-display distinctions are also supported by current official product diagrams.</p>
    <ul>{Object.entries(BaseusScreenSources).map(([id, source]) => <li key={id}><a href={source.url} target="_blank" rel="nofollow noopener">{source.label}</a></li>)}</ul>
    <p>Apple’s linked page covers named current Air models; other Mac models need their own specification. DisplayLink can interfere with protected video. Gaming, HDR/VRR, color-critical work and pre-login behavior are not established by these office-display claims.</p>
  </section>;
}
