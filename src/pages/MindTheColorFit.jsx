import React, { useState } from "react";
import { useSEO } from "../hooks/useSEO.js";
import { MindTheColorCheckedDate, MindTheColorEntryPoint, MindTheColorOffer, MindTheColorSeo, MindTheColorSlug, MindTheColorSources } from "../content/mindTheColor.js";
import { evaluateMindTheColorFit, MindTheColorQuestions } from "../utils/mindTheColorFit.js";
import { handleOfferLinkClick } from "../utils/shopNobiOfferClick.js";
import { readStoreLinkRel } from "../utils/shopNobiPage.js";
import "./MindTheColorFit.css";

/** A source-based purchase checklist for one digital license, with all answers kept in this page. */
export default function MindTheColorFit() {
  useSEO(MindTheColorSeo);
  return (
    <div className="color-fit-page">
      <header className="color-fit-header"><a className="color-fit-brand" href="/shop">Shop Nobi</a><a href="/shop">Explore Shop Nobi</a></header>
      <main className="color-fit-main">
        <section className="color-fit-intro" aria-labelledby="color-fit-title">
          <div>
            <h1 id="color-fit-title">Will MindTheColor 3 fit your Photoshop setup?</h1>
            <p className="color-fit-lead">Check the host app, online launch and license limits before buying this color and retouching plugin.</p>
            <p className="color-fit-price"><strong>€{MindTheColorOffer.sourcePrice} + VAT</strong><span>Creator’s listed plugin price, checked {MindTheColorCheckedDate}.</span></p>
            <p className="color-fit-note">Adobe Photoshop is a separate purchase or subscription. Gumroad’s final currency, taxes and price can vary at checkout.</p>
            <a href="#color-fit-check">Check my requirements</a>
          </div>
          <figure><img src="/media/mindthecolor-requirements.svg" width="1200" height="800" alt="MindTheColor runs inside desktop Photoshop 26 or later, installs through Creative Cloud Desktop, needs Internet at launch and binds to one user’s Adobe account." /><figcaption>Our requirements diagram, based on the creator’s manual. We have not installed or tested the plugin.</figcaption></figure>
        </section>
        <RequirementsCheck />
        <section className="color-fit-license" aria-labelledby="color-fit-license-title">
          <div>
            <h2 id="color-fit-license-title">One user. One Adobe account.</h2>
            <p>The license can follow the same person across their computers on the same Adobe account. It does not cover pooled or shared team access.</p>
            <p>The creator permits ordinary commercial and client outputs. Its license restricts AI/ML and automation use of the software and outputs; check the full terms for your workflow.</p>
            <p>Sales are final except where mandatory legal rights apply. Read the license and product refund notice before paying.</p>
          </div>
          <div className="color-fit-exit">
            <h3>MindTheColor 3 personal license</h3>
            <p>Purchase and download are handled by the creator through Gumroad.</p>
            <p className="color-fit-disclosure">We may earn a commission from qualifying purchases through this link.</p>
            <a className="color-fit-store-link" href={MindTheColorOffer.url} target="_blank" rel={readStoreLinkRel(MindTheColorOffer.paidLink)} onClick={recordOfferClick} onAuxClick={recordOfferClick}>Check current listing on Gumroad</a>
            <p className="color-fit-note">Opening the listing does not buy or install anything. A link here does not mean the plugin fits your answers.</p>
          </div>
        </section>
        <section className="color-fit-facts" aria-labelledby="color-fit-facts-title">
          <h2 id="color-fit-facts-title">Check these before paying</h2>
          <dl>
            <div><dt>Desktop Photoshop 26+</dt><dd>Windows or macOS with a valid Adobe license. Check Adobe’s requirements for your exact Photoshop version and hardware.</dd></div>
            <div><dt>Creative Cloud installation</dt><dd>The current Creative Cloud Desktop app installs the .ccx package. You need permission to install plugins on that computer.</dd></div>
            <div><dt>Internet at every launch</dt><dd>The manual describes online verification when the plugin opens, then offline use for that Photoshop session. A restart needs another online check. License-service outages can prevent a new session.</dd></div>
            <div><dt>Read the full license</dt><dd>One person, one Adobe account. Connectivity rules and compatibility can change; this checklist does not replace the creator’s terms.</dd></div>
          </dl>
        </section>
        <section className="color-fit-sources" aria-labelledby="color-fit-sources-title">
          <h2 id="color-fit-sources-title">Sources, checked {MindTheColorCheckedDate}</h2>
          <p>This is a requirements and license comparison from public sources, not a performance review. The local checklist cannot inspect your computer or guarantee compatibility.</p>
          <ul>{Object.entries(MindTheColorSources).map(([id, source]) => <li key={id}><a href={source.url} target="_blank" rel="nofollow noopener">{source.name}</a></li>)}</ul>
        </section>
      </main>
      <footer className="color-fit-footer"><a href="/shop">Shop Nobi</a><div><a href="/privacy">Privacy</a><a href="/terms">Terms</a></div></footer>
    </div>
  );
}

/** Submit only to the local pure evaluator; edits clear the previous result so it cannot describe stale answers. */
function RequirementsCheck() {
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const updateAnswer = (id, value) => { setAnswers(previous => ({ ...previous, [id]: value })); setResult(null); };
  return (
    <section id="color-fit-check" className="color-fit-check" aria-labelledby="color-fit-check-title">
      <h2 id="color-fit-check-title">Check your requirements</h2>
      <p className="color-fit-note">Your answers stay here. This does not scan your computer, run a search or install software.</p>
      <div className="color-fit-workspace">
        <form onSubmit={event => { event.preventDefault(); setResult(evaluateMindTheColorFit(answers)); }}>
          <div className="color-fit-fields">{MindTheColorQuestions.map(question => <div key={question.id}>
            <label htmlFor={`color-fit-${question.id}`}>{question.label}</label>
            <select id={`color-fit-${question.id}`} value={answers[question.id] || "unknown"} onChange={event => updateAnswer(question.id, event.target.value)}>
              <option value="unknown">Not sure yet</option>{question.options.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
            </select>
          </div>)}</div>
          <button type="submit">Check requirements</button>
          <noscript><p>The checklist needs JavaScript to evaluate answers. The complete requirements and license notes are below.</p></noscript>
        </form>
        <div className={`color-fit-result color-fit-result-${result?.status || "unknown"}`} role="status" aria-live="polite" aria-atomic="true">
          <h3>{result?.title || "Start with your setup"}</h3>
          {!result && <p>Choose an answer for each requirement, then check the result. “Not sure yet” stays unresolved.</p>}
          {result?.failures.length > 0 && <ul>{result.failures.map(reason => <li key={reason}>{reason}</li>)}</ul>}
          {result?.unknowns.length > 0 && <p>Still to confirm: {result.unknowns.join("; ")}.</p>}
          {result?.status === "conditional" && <p>Based on your answers and the dated sources. Confirm your exact hardware against Adobe’s requirements and read the current creator license before purchase. This is not a tested compatibility result.</p>}
        </div>
      </div>
    </section>
  );
}

/** Reuse the actual Java-built link and existing offer event. Never transmit checklist answers. */
function recordOfferClick(event) {
  handleOfferLinkClick(event, { offer: MindTheColorOffer, slug: MindTheColorSlug, entryPoint: MindTheColorEntryPoint });
}
