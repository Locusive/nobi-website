/** The six purchase requirements. Unknown or unrecognized answers never establish a match. */
export const MindTheColorQuestions = Object.freeze([
  { id: "photoshop", label: "Your Photoshop access", options: [
    ["ready", "Licensed desktop Photoshop 26 or later"], ["older", "Desktop Photoshop older than 26"],
    ["other", "Web, iPad, Lightroom or no Photoshop"],
  ], failure: "You need licensed desktop Photoshop 26 or later. The plugin price does not include Adobe software." },
  { id: "platform", label: "Your computer", options: [["windows", "Windows"], ["mac", "macOS"], ["other", "Another platform"]],
    failure: "The creator documents Windows and macOS. Other platforms are outside this checklist’s supported scope." },
  { id: "installer", label: "Creative Cloud Desktop and plugin installation", options: [
    ["ready", "Up to date; I can install a .ccx plugin"], ["update", "Needs updating or installation permission"], ["unavailable", "Unavailable on this computer"],
  ], failure: "Resolve Creative Cloud Desktop and .ccx installation access before buying." },
  { id: "internet", label: "Internet when you open the plugin", options: [["yes", "Available at each launch"], ["no", "I need to launch fully offline"]],
    failure: "Fully offline launches do not fit: the manual requires online verification each time the plugin opens." },
  { id: "users", label: "Who will use this license?", options: [["single", "One person, using the same Adobe account"], ["team", "Multiple people or a shared team license"]],
    failure: "One personal license does not cover shared team access. Ask the creator about separate licenses for each user." },
  { id: "workflow", label: "Your intended use", options: [["creative", "Manual creative work, including client images"], ["automated", "AI/ML training or automated software access"]],
    failure: "The creator’s license restricts AI/ML and automation use of the software and its outputs. Confirm your exact workflow with the creator." },
]);

/** Evaluate only declared prerequisites; this is neither hardware inspection nor a guarantee of compatibility. */
export function evaluateMindTheColorFit(answers = {}) {
  const failures = [];
  const unknowns = [];
  for (const question of MindTheColorQuestions) {
    const answer = answers?.[question.id];
    if (!question.options.some(([value]) => value === answer)) unknowns.push(question.label);
    else if (!["ready", "windows", "mac", "yes", "single", "creative"].includes(answer)) failures.push(question.failure);
  }
  if (failures.length) return { status: "blocked", title: "Resolve these requirements before buying", failures, unknowns };
  if (unknowns.length) return { status: "unknown", title: "A few requirements still need checking", failures, unknowns };
  return { status: "conditional", title: "Your answers match the listed prerequisites", failures, unknowns };
}
