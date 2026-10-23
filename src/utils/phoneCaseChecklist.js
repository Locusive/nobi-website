/** Fixed evidence choices describe a shopper's reading, never a compatibility test. */
export const CaseModelEvidence = Object.freeze({
  listed: ["My exact model is listed", "You recorded a maker-declared model match. This is your listing check, not an independent physical fit test."],
  different: ["A different model is listed", "Your phone is not documented by that selected listing. Find the version that explicitly lists it; this does not prove every cross-model case is physically incompatible."],
  unspecified: ["The exact model is not specified", "The model question is unanswered. A photograph, screen size or broad ‘for iPhone’ phrase does not supply that evidence."],
});
export const CaseFeatureLabels = Object.freeze({ charging: "Charging with the case on", magnetic: "Magnetic wallet, grip or stand", protection: "Protection or appearance claims" });
export const CaseEvidenceChoices = Object.freeze({ documented: "Documented", missing: "Not documented", unclear: "Unclear", unnecessary: "Not needed" });

/** New page and Reset both start unanswered, with separate independent feature notes. */
export function emptyCaseChecklist() {
  return { phone: "", variant: "", listedModels: "", model: "", features: Object.fromEntries(Object.keys(CaseFeatureLabels).map(id => [id, { status: "", notes: "" }])) };
}

/** Validate the evidence recorded by the shopper without matching names or inventing a fit score. */
export function reviewCaseChecklist(input) {
  const errors = {};
  const text = (value, key, required, max) => {
    const trimmed = typeof value === "string" ? value.trim() : "";
    if (required && !trimmed) errors[key] = "Record this exact name before reviewing your notes.";
    else if (trimmed.length > max) errors[key] = `Keep this note within ${max} characters.`;
    return trimmed;
  };
  const phone = text(input?.phone, "phone", true, 120);
  const variant = text(input?.variant, "variant", true, 180);
  if (!Object.hasOwn(CaseModelEvidence, input?.model)) errors.model = "Choose what the selected listing actually says.";
  const listedModels = text(input?.listedModels, "listedModels", ["listed", "different"].includes(input?.model), 240);
  const features = Object.entries(CaseFeatureLabels).map(([id, label]) => {
    const feature = input?.features?.[id] || {};
    if (feature.status && !Object.hasOwn(CaseEvidenceChoices, feature.status)) errors[`${id}.status`] = "Choose one of the evidence states.";
    return { id, label, status: CaseEvidenceChoices[feature.status] || "Unanswered", notes: text(feature.notes, `${id}.notes`, false, 300) };
  });
  if (Object.keys(errors).length) return { errors };
  return { errors, phone, variant, listedModels, model: CaseModelEvidence[input.model], features };
}

/** Metadata for the original checklist, without certification or product recommendation schema. */
export const PhoneCaseSeo = {
  path: "/tools/phone-case-check", title: "Phone Case Model & Charging Checklist | Shop Nobi",
  description: "Check the exact phone model and selected case variant, then record separate charging and accessory evidence. A local buying checklist with clear examples.",
  schema: [{ "@context": "https://schema.org", "@type": "WebPage", name: "Phone Case Buying Checklist", url: "https://nobi.ai/tools/phone-case-check" }],
};
