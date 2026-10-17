import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { relative, resolve } from "node:path";
import { isUtilityUrl } from "./shop-nobi-indexnow.js";

export const UtilityRevisionFile = "utility-revisions.json";
const SiteOrigin = "https://nobi.ai";
const ImageExtension = /\.(?:svg|png|jpe?g|webp|gif)$/i;
const RevisionPattern = /^[a-f0-9]{64}$/;

/** Fingerprints delivered HTML, including bundle URLs, and its referenced local image bytes without a build clock or git. */
export function buildUtilityRevision(html, distDir) {
  const hash = createHash("sha256").update(html);
  const imagePaths = new Set();
  for (const [, address] of html.matchAll(/(?:src|content)="([^"]+)"/g)) {
    if (!address.startsWith("/") && !address.startsWith(`${SiteOrigin}/`)) continue;
    const url = new URL(address, SiteOrigin);
    if (url.origin === SiteOrigin && ImageExtension.test(url.pathname)) imagePaths.add(url.pathname);
  }
  for (const pathname of [...imagePaths].sort()) {
    const imagePath = resolve(distDir, `.${decodeURIComponent(pathname)}`);
    if (relative(distDir, imagePath).startsWith("..")) throw new Error("Utility image must stay within the built site.");
    hash.update(`\0${pathname}\0`).update(readFileSync(imagePath));
  }
  return hash.digest("hex");
}

/** Reads a complete utility revision manifest; malformed metadata is unknown, never an empty unchanged snapshot. */
export function readUtilityRevisions(text) {
  const manifest = JSON.parse(text);
  const revisions = manifest?.revisions;
  if (manifest?.version !== 1 || !revisions || typeof revisions !== "object" || Array.isArray(revisions)) {
    throw new Error("Utility revision metadata is invalid.");
  }
  const entries = Object.entries(revisions);
  if (entries.some(([url, revision]) => !isUtilityUrl(url) || typeof revision !== "string" || !RevisionPattern.test(revision))) {
    throw new Error("Utility revision metadata is invalid.");
  }
  return new Map(entries);
}
