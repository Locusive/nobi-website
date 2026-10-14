import React, { useRef, useState } from "react";
import { useTurnstileToken } from "../../hooks/useTurnstileToken";
import { DemoLookupStatus, lookUpDemoStore } from "../../utils/storeDemo";
import { checkStoreSubmission, HumanCheckPendingMessage, submitStore } from "../../utils/storeSubmission";

/** Tells Nobi's inbox that the owner asked for a demo on their own store, not to join Shop Nobi. */
const DemoRequestPurpose = "homepage_demo";
const NotReadyMessage = "We need a moment to load your store. Leave your name and work email, and we'll email you a link to your demo.";
const DemoRequestedMessage = "Thanks! We'll email you a link to your demo soon.";
const MissingAddressMessage = "Please enter your store's address.";
const InvalidAddressMessage = "Please enter your store's web address, like www.yourstore.com.";
const FailedLookupMessage = "Something went wrong. Please try again.";
const OwnStoreStep = { Closed: "closed", Address: "address", Contact: "contact", Done: "done" };

/**
 * Lets a store owner try the demo on their own store. A store we can demo now opens right away; for any other store
 * the owner leaves a name and work email, and Nobi emails them a demo link once their catalog is loaded.
 *
 * @param {{onStoreFound: (store: object) => void}} props Switches the demo to the owner's store.
 */
export default function OwnStoreDemo({ onStoreFound }) {
  const [step, setStep] = useState(OwnStoreStep.Closed);
  const [storeUrl, setStoreUrl] = useState("");

  if (step === OwnStoreStep.Closed) {
    return (
      <button type="button" className="nb-demo-own-link" onClick={() => setStep(OwnStoreStep.Address)}>
        Try it on your own store
      </button>
    );
  }
  if (step === OwnStoreStep.Done) {
    return <p className="nb-demo-own nb-demo-own-message" role="status">{DemoRequestedMessage}</p>;
  }

  const showStore = (store) => {
    setStep(OwnStoreStep.Closed);
    onStoreFound(store);
  };
  return step === OwnStoreStep.Address
    ? <StoreAddressForm storeUrl={storeUrl} onChange={setStoreUrl} onReady={showStore} onNotReady={() => setStep(OwnStoreStep.Contact)} />
    : <DemoRequestForm storeUrl={storeUrl} onSent={() => setStep(OwnStoreStep.Done)} />;
}

/** The store address field; it asks the API whether the store can be demoed now. */
function StoreAddressForm({ storeUrl, onChange, onReady, onNotReady }) {
  const [isLooking, setIsLooking] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function lookUp(event) {
    event.preventDefault();
    if (!storeUrl.trim()) {
      setErrorMessage(MissingAddressMessage);
      return;
    }

    setErrorMessage("");
    setIsLooking(true);
    const answer = await lookUpDemoStore(storeUrl);
    setIsLooking(false);
    if (answer.status === DemoLookupStatus.Ready) {
      onReady(answer.store);
      return;
    }
    if (answer.status === DemoLookupStatus.NotReady) {
      onNotReady();
      return;
    }
    setErrorMessage(answer.status === DemoLookupStatus.InvalidAddress ? InvalidAddressMessage : FailedLookupMessage);
  }

  return (
    <form className="nb-demo-own" onSubmit={lookUp} noValidate>
      <label htmlFor="store-demo-own-url" className="nb-demo-own-label">Your store's address</label>
      <div className="nb-demo-own-row">
        <input
          id="store-demo-own-url"
          type="text"
          inputMode="url"
          value={storeUrl}
          onChange={(event) => onChange(event.target.value)}
          readOnly={isLooking}
          placeholder="www.yourstore.com"
          autoComplete="url"
          autoFocus
        />
        <button type="submit" className="nb-demo-own-button" disabled={isLooking}>{isLooking ? "Looking…" : "Show me"}</button>
      </div>
      {errorMessage && <p className="nb-demo-own-error" role="alert">{errorMessage}</p>}
    </form>
  );
}

/** The name and work email form for a store we cannot demo yet; it emails Nobi's inbox through the API. */
function DemoRequestForm({ storeUrl, onSent }) {
  const humanCheckRef = useRef(null);
  const { token, resetToken } = useTurnstileToken(humanCheckRef);
  const [contact, setContact] = useState({ name: "", email: "" });
  const [isSending, setIsSending] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const updateContact = (event) => setContact((current) => ({ ...current, [event.target.name]: event.target.value }));

  async function send(event) {
    event.preventDefault();
    const fields = { storeUrl, ...contact, purpose: DemoRequestPurpose };
    const formProblem = checkStoreSubmission(fields);
    if (formProblem || !token) {
      setErrorMessage(formProblem || HumanCheckPendingMessage);
      return;
    }

    setErrorMessage("");
    setIsSending(true);
    const result = await submitStore(fields, token);
    setIsSending(false);
    if (result.accepted) {
      onSent();
      return;
    }
    setErrorMessage(result.message);
    resetToken();
  }

  return (
    <form className="nb-demo-own" onSubmit={send} noValidate>
      <p className="nb-demo-own-message">{NotReadyMessage}</p>
      <div className="nb-demo-own-row">
        <input name="name" type="text" value={contact.name} onChange={updateContact} placeholder="Your name" aria-label="Your name" autoComplete="name" maxLength={100} autoFocus />
        <input name="email" type="email" value={contact.email} onChange={updateContact} placeholder="Work email" aria-label="Work email" autoComplete="email" />
        <button type="submit" className="nb-demo-own-button" disabled={isSending}>{isSending ? "Sending…" : "Email me a demo"}</button>
      </div>
      <div ref={humanCheckRef} />
      {errorMessage && <p className="nb-demo-own-error" role="alert">{errorMessage}</p>}
    </form>
  );
}
