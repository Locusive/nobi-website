import React, { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, Check, ChevronDown, FileText, MessageCircle, Play, RotateCcw, Search, Sparkles } from "lucide-react";
import { PricingHero, PricingLogos } from "./Pricing";
import Nav from "../components/home/Nav";
import SiteFooter from "../components/home/SiteFooter";
import PricingCalculator from "../components/PricingCalculator";
import { useDemoForm } from "../context/DemoFormContext";
import { useSEO } from "../hooks/useSEO";
import { getSignupUrl } from "../utils/signupUrl";
import "./PricingConcepts.css";

const OPTIONS = [
  { id: "search", title: "Find things", description: "Show visitors relevant results from your site.", icon: Search },
  { id: "assistant", title: "Get answers", description: "Answer questions using your site's knowledge.", icon: MessageCircle },
  { id: "both", title: "Both", description: "Find something, then talk it through.", icon: Sparkles },
];
const CONCEPTS = [
  { id: "guided", label: "Choose a use case" },
  { id: "example", label: "Watch an example" },
  { id: "compare", label: "Side by side" },
];

function Rate({ assistant = false }) {
  return <span className={`pc-rate ${assistant ? "pc-rate--assistant" : ""}`}>
    {assistant ? <MessageCircle size={14} aria-hidden="true" /> : <Search size={14} aria-hidden="true" />}
    <strong>{assistant ? "10¢" : "1¢"}</strong><span>{assistant ? "/ message" : "/ search"}</span>
  </span>;
}

function SearchResults() {
  return <div className="pc-results">
    {["Getting started", "The step-by-step guide"].map((title, index) => (
      <div className="pc-result" key={title} style={{ "--pc-order": index }}>
        <span className="pc-file"><FileText size={19} aria-hidden="true" /></span>
        <div><strong>{title}</strong><span>{["The essentials, in one place", "A little guidance at every step"][index]}</span></div>
      </div>
    ))}
  </div>;
}

// Illustrative content only; this never sends messages or incurs usage.
function VisitorDemo({ mode = "both", phase = 4, replayKey = 0 }) {
  const assistantOnly = mode === "assistant";
  const showSearch = !assistantOnly;
  const showQuestion = (assistantOnly && phase >= 1) || (mode === "both" && phase >= 3);
  const showAnswer = (assistantOnly && phase >= 2) || (mode === "both" && phase >= 4);
  return <div className="pc-demo" key={`${mode}-${replayKey}`} aria-label="Example visitor interaction">
    <div className="pc-demo-toolbar"><span className="pc-window-dots" aria-hidden="true"><i /><i /><i /></span><span>Your website</span><span className="pc-example-label">Example</span></div>
    <div className="pc-demo-body">
      {showSearch && <div className="pc-demo-search">
        <div className="pc-search-input"><Search size={18} aria-hidden="true" /><span>{phase >= 1 ? "Getting started guides" : "Search this site…"}</span>{phase >= 1 && <Check size={16} aria-label="Search submitted" />}</div>
        {phase >= 2 && <div className="pc-reveal"><SearchResults /><div className="pc-action-caption"><span>Matching results</span><Rate /></div></div>}
      </div>}
      {showQuestion && <div className="pc-conversation pc-reveal">
        <div className="pc-visitor"><span>{assistantOnly ? "How do I get started?" : "Which guide should I read first?"}</span></div>
        <div className="pc-action-caption"><span>{assistantOnly ? "First visitor message" : "Each visitor follow-up"}</span><Rate assistant /></div>
        {showAnswer ? <div className="pc-answer pc-reveal"><span className="pc-nobi-icon"><Sparkles size={16} aria-hidden="true" /></span><div><p>Start with <strong>Getting started</strong>. It covers the essentials, then points you to the next steps.</p><span className="pc-reply-note"><Check size={13} aria-hidden="true" /> Nobi's reply is included</span></div></div> : <div className="pc-thinking" aria-label="Nobi is responding"><i /><i /><i /></div>}
      </div>}
      {phase === 0 && <div className="pc-demo-empty"><Sparkles size={28} aria-hidden="true" /><span>{assistantOnly ? "A visitor has a question." : "A visitor is looking for a guide."}</span></div>}
    </div>
  </div>;
}

function GuidedConcept() {
  const [choice, setChoice] = useState(null);
  const heading = useRef(null);
  const didChoose = useRef(false);
  useEffect(() => { if (didChoose.current) heading.current?.focus({ preventScroll: true }); }, [choice]);
  const selected = OPTIONS.find(option => option.id === choice);
  return <div className="pc-guided">
    {!choice ? <>
      <header className="pc-heading"><h2 ref={heading} tabIndex={-1}>What should Nobi help your visitors do?</h2><p>Choose an experience to see how pricing works.</p></header>
      <div className="pc-choices">
        {OPTIONS.map(({ id, title, description, icon: Icon }) => <button className="pc-choice" key={id} onClick={() => { didChoose.current = true; setChoice(id); }}>
          <span className={`pc-choice-icon pc-choice-icon--${id}`}><Icon size={29} strokeWidth={1.7} aria-hidden="true" /></span>
          <strong>{title}</strong><span>{description}</span><ArrowRight size={20} className="pc-choice-arrow" aria-hidden="true" />
        </button>)}
      </div>
    </> : <div className="pc-experience pc-reveal">
      <div className="pc-explanation">
        <button className="pc-back" onClick={() => setChoice(null)}><ArrowLeft size={16} aria-hidden="true" /> Change experience</button>
        <h2 ref={heading} tabIndex={-1}>{selected.title === "Both" ? "Find it. Talk it through." : selected.title === "Find things" ? "A search finds the right results." : "An assistant helps with the answer."}</h2>
        <p>{choice === "search" ? "Visitors search your site. Nobi returns matching items, pages, or resources." : choice === "assistant" ? "Visitors ask. Nobi answers using your site's knowledge." : "Visitors can search your site, then ask Nobi to help them choose or dig deeper."}</p>
        <div className="pc-simple-rates">{choice !== "assistant" && <div><Search size={20} aria-hidden="true" /><span><strong>1¢ per search</strong>For matching results</span></div>}{choice !== "search" && <div><MessageCircle size={20} aria-hidden="true" /><span><strong>10¢ per visitor message</strong>{choice === "assistant" ? "From the very first question" : "For questions and follow-ups"}</span></div>}</div>
        <p className="pc-rate-note">Rates apply after your included monthly usage.</p>
      </div>
      <VisitorDemo mode={choice} />
    </div>}
  </div>;
}

function AnimatedConcept() {
  const demo = useRef(null);
  const [mode, setMode] = useState("both");
  const [phase, setPhase] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [run, setRun] = useState(0);
  const done = mode === "assistant" ? 2 : 4;
  useEffect(() => {
    if (!playing) return;
    // Keep the same information without motion or delays when reduced motion is requested.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { setPhase(done); setPlaying(false); return; }
    const steps = mode === "assistant" ? [[350, 1], [1500, 2]] : [[350, 1], [1100, 2], [3400, 3], [4800, 4]];
    const timers = steps.map(([delay, next]) => setTimeout(() => { setPhase(next); if (next === done) setPlaying(false); }, delay));
    return () => timers.forEach(clearTimeout);
  }, [playing, run, mode, done]);
  const play = () => {
    setPhase(0);
    setRun(value => value + 1);
    setPlaying(true);
    if (window.matchMedia("(max-width: 620px)").matches) {
      demo.current?.scrollIntoView({ block: "start", behavior: "instant" });
    }
  };
  const changeMode = value => { setPlaying(false); setPhase(0); setMode(value); };
  const status = phase === 0 ? "Play the example to see the usage rates." : mode === "assistant" ? "A visitor's first question uses one assistant message. 10 cents after included usage. Nobi's reply is included." : phase < 3 ? "A search returns matching results. 1 cent after included usage." : "The follow-up uses one assistant message. 10 cents after included usage. Nobi's reply is included.";
  return <div className="pc-experience pc-experience--animated">
    <div className="pc-explanation">
      <h2>See pricing in action.</h2>
      <p>A search finds things. A conversation helps people figure things out.</p>
      <div className="pc-scenarios" role="group" aria-label="Example scenario">
        <button aria-pressed={mode === "both"} onClick={() => changeMode("both")}><Search size={20} aria-hidden="true" /><span><strong>Search, then ask</strong>Results first. A little help next.</span></button>
        <button aria-pressed={mode === "assistant"} onClick={() => changeMode("assistant")}><MessageCircle size={20} aria-hidden="true" /><span><strong>Start with a question</strong>Get an answer from the start.</span></button>
      </div>
      <button className="pc-primary pc-play" onClick={play} disabled={playing}>{phase === done ? <RotateCcw size={17} aria-hidden="true" /> : <Play size={17} aria-hidden="true" />}{playing ? "Playing example…" : phase === done ? "Replay example" : "Play example"}</button>
      <p className="pc-rate-note">Rates apply after your included monthly usage.</p>
      <span className="pc-sr-only" role="status" aria-live="polite" aria-atomic="true">{status}</span>
    </div>
    <div ref={demo} className="pc-demo-wrap"><VisitorDemo mode={mode} phase={phase} replayKey={run} /></div>
  </div>;
}

function ComparisonConcept() {
  return <>
    <header className="pc-heading"><h2>Two ways to help. Two usage rates.</h2><p>Use search, an assistant, or both on your site.</p></header>
    <div className="pc-comparison">
      <article><header><span className="pc-choice-icon"><Search size={24} aria-hidden="true" /></span><div><h3>Find things</h3><p>Matching items, pages, and resources.</p></div></header><VisitorDemo mode="search" /><footer><Rate /><span>For results without a conversation.</span></footer></article>
      <article><header><span className="pc-choice-icon pc-choice-icon--assistant"><MessageCircle size={24} aria-hidden="true" /></span><div><h3>Get answers</h3><p>Questions, guidance, and follow-ups.</p></div></header><VisitorDemo mode="assistant" /><footer><Rate assistant /><span>Every visitor message. Replies included.</span></footer></article>
    </div>
    <p className="pc-comparison-note">Questions cost 10¢ from the first message. Both rates apply after included usage.</p>
  </>;
}

export default function PricingConcepts() {
  const [params, setParams] = useSearchParams();
  const requested = params.get("view");
  const concept = CONCEPTS.some(option => option.id === requested) ? requested : "example";
  const calculator = useRef(null);
  const { onOpen: openDemoForm } = useDemoForm();
  useSEO({ title: "Pricing ideas | Nobi", description: "Local pricing explanation concepts for review.", path: "/pricing", noindex: true });
  return <div className="pc-page">
    <Nav active="pricing" />
    <PricingHero />
    <main>
      <div className="pc-review" aria-label="Local design review"><span>Compare ideas</span><nav aria-label="Pricing concepts">{CONCEPTS.map(({id,label}) => <button key={id} aria-current={concept === id ? "page" : undefined} onClick={() => setParams({ view: id }, { preventScrollReset: true })}>{label}</button>)}</nav><a href="/pricing">Original page</a></div>
      <section className="pc-section" aria-label="How Nobi pricing works">
        {concept === "guided" ? <GuidedConcept key={concept} /> : concept === "compare" ? <ComparisonConcept key={concept} /> : <AnimatedConcept key={concept} />}
        <div className="pc-plan">
          <div className="pc-plan-price"><strong>$25</strong><span>/ month</span></div>
          <div className="pc-included"><strong>Includes both, every month</strong><span>2,500 searches <span aria-hidden="true">+</span> 250 assistant messages</span></div>
          <div className="pc-plan-actions"><a className="pc-primary" href={getSignupUrl()}>Start free</a><button className="pc-text-button" onClick={() => { calculator.current.open = true; calculator.current.scrollIntoView({ block: "start", behavior: "instant" }); calculator.current.querySelector("summary").focus({ preventScroll: true }); }}>Estimate my cost</button></div>
        </div>
        <div className="pc-below-plan"><span>Try it free. No credit card needed.</span><button onClick={openDemoForm}>Need higher usage? Let's talk <ArrowRight size={14} aria-hidden="true" /></button></div>
      </section>
      <div className="pc-more">
        <details ref={calculator} className="pc-calculator"><summary>Estimate my monthly cost <ChevronDown size={18} aria-hidden="true" /></summary><PricingCalculator /></details>
        <details><summary>Is the first message always a search? <ChevronDown size={18} aria-hidden="true" /></summary><p>No. A simple search returns results and uses your search allowance. A question or follow-up uses your assistant message allowance, including a question that starts a conversation. After those allowances, searches are 1¢ each and visitor messages are 10¢ each.</p></details>
        <details><summary>What happens after the included usage? <ChevronDown size={18} aria-hidden="true" /></summary><p>Additional usage is billed at 1¢ per search and 10¢ per visitor message. The two allowances are separate. Nobi's replies are included.</p></details>
      </div>
      <PricingLogos label="Trusted by modern teams" />
    </main>
    <SiteFooter />
  </div>;
}
