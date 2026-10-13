import React, { useEffect, useRef, useState } from "react";
import Button from "../Button";
import { useTurnstileToken } from "../../hooks/useTurnstileToken";
import { checkStoreSubmission, HumanCheckPendingMessage, submitStore } from "../../utils/storeSubmission";

const InputClassName = "w-full rounded-xl border border-black/10 dark:border-white/10 bg-transparent px-3 py-2 outline-none";
/** The longest name the API accepts. */
const MaxNameLength = 100;
const EmptyFields = { storeUrl: "", name: "", email: "" };

/**
 * The "Add your store" form, in a dialog over the Shop Nobi page: the store's address, your name and a work email.
 * Every accepted request shows the same thank-you.
 *
 * @param {{onClose: () => void}} props Closes the dialog.
 */
export default function AddYourStoreForm({ onClose }) {
  const humanCheckRef = useRef(null);
  const { fields, updateField, isSubmitting, thankYouMessage, errorMessage, submit } = useStoreSubmission(humanCheckRef);
  useCloseOnEscape(onClose);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="add-your-store-title">
      <button className="absolute inset-0 bg-black/60 backdrop-blur-sm" aria-label="Close form" onClick={onClose} />
      <div className="relative w-full max-w-md rounded-2xl bg-white p-6 text-black shadow-2xl dark:bg-zinc-900 dark:text-white">
        <h2 id="add-your-store-title" className="text-xl font-semibold">Add your store to Shop Nobi</h2>
        {thankYouMessage ? (
          <div className="mt-4">
            <p className="text-black/80 dark:text-white/90">{thankYouMessage}</p>
            <Button className="mt-4" variant="ghost" onClick={onClose}>Close</Button>
          </div>
        ) : (
          <form onSubmit={submit} className="mt-4 space-y-4" noValidate>
            <FormField label="Store address" name="storeUrl" value={fields.storeUrl} onChange={updateField} placeholder="www.yourstore.com" />
            <FormField label="Your name" name="name" value={fields.name} onChange={updateField} maxLength={MaxNameLength} />
            <FormField label="Work email" name="email" type="email" value={fields.email} onChange={updateField} />
            <div ref={humanCheckRef} />
            {errorMessage && <p className="text-sm text-red-600 dark:text-rose-400" role="alert">{errorMessage}</p>}
            <div className="flex items-center gap-3 pt-2">
              <Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Sending…" : "Add my store"}</Button>
              <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

/**
 * Holds the form's fields and sends them, with the Turnstile token from the check drawn in humanCheckRef.
 *
 * @param {{ current: HTMLElement | null }} humanCheckRef The element the Turnstile check is drawn into.
 */
function useStoreSubmission(humanCheckRef) {
  const [fields, setFields] = useState(EmptyFields);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [thankYouMessage, setThankYouMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const { token, resetToken } = useTurnstileToken(humanCheckRef);

  const updateField = (event) => setFields((current) => ({ ...current, [event.target.name]: event.target.value }));

  async function submit(event) {
    event.preventDefault();
    const formProblem = checkStoreSubmission(fields);
    if (formProblem || !token) {
      setErrorMessage(formProblem || HumanCheckPendingMessage);
      return;
    }

    setErrorMessage("");
    setIsSubmitting(true);
    const result = await submitStore(fields, token);
    setIsSubmitting(false);
    if (result.accepted) {
      setThankYouMessage(result.message);
      return;
    }
    setErrorMessage(result.message);
    resetToken();
  }

  return { fields, updateField, isSubmitting, thankYouMessage, errorMessage, submit };
}

/** One labelled text field. */
function FormField({ label, name, type = "text", value, onChange, placeholder, maxLength }) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm">{label}</span>
      <input name={name} type={type} value={value} onChange={onChange} placeholder={placeholder} maxLength={maxLength} required className={InputClassName} />
    </label>
  );
}

/** Closes the dialog on Escape and stops the page behind it from scrolling while it is open. */
function useCloseOnEscape(onClose) {
  useEffect(() => {
    const closeOnEscape = (event) => event.key === "Escape" && onClose();
    document.addEventListener("keydown", closeOnEscape);
    const previousOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", closeOnEscape);
      document.documentElement.style.overflow = previousOverflow;
    };
  }, [onClose]);
}
