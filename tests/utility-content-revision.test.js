import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { buildUtilityRevision, readUtilityRevisions, UtilityRevisionFile } from "../scripts/utility-content-revision.js";

const Dist = new URL("../dist/", import.meta.url);
const UtilityUrls = ["cove-vs-cubby", "marley-spoon-cost", "baseus-two-screens", "mindthecolor-fit", "gift-chooser", "gift-budget", "usb-c-power-check"].map((slug) => `https://nobi.ai/tools/${slug}`);

test("revisions are stable without git and cover rendered facts, metadata, shared bundles and local image bytes", () => {
  const folder = mkdtempSync(join(tmpdir(), "utility-revision-"));
  mkdirSync(join(folder, "media"));
  writeFileSync(join(folder, "media/diagram.svg"), "<svg>original</svg>");
  const html = '<meta name="description" content="Dated specification comparison"><script src="/assets/shared-a.js"></script><img src="/media/diagram.svg"><p>Price: $69</p>';
  try {
    const original = buildUtilityRevision(html, folder);
    assert.match(original, /^[a-f0-9]{64}$/);
    assert.equal(buildUtilityRevision(html, folder), original);
    for (const changed of [html.replace("$69", "$70"), html.replace("Dated specification", "Updated specification"), html.replace("shared-a.js", "shared-b.js")]) {
      assert.notEqual(buildUtilityRevision(changed, folder), original);
    }
    writeFileSync(join(folder, "media/diagram.svg"), "<svg>corrected dimensions</svg>");
    assert.notEqual(buildUtilityRevision(html, folder), original);
  } finally {
    rmSync(folder, { recursive: true, force: true });
  }
});

test("a missing referenced local image fails instead of claiming an unchanged revision", () => {
  const folder = mkdtempSync(join(tmpdir(), "utility-revision-"));
  try {
    assert.throws(() => buildUtilityRevision('<img src="/media/missing.svg">', folder), { code: "ENOENT" });
  } finally {
    rmSync(folder, { recursive: true, force: true });
  }
});

test("malformed revision metadata cannot masquerade as a valid empty snapshot", () => {
  for (const manifest of [{}, { version: 2, revisions: {} }, { version: 1, revisions: [] }, { version: 1, revisions: { [UtilityUrls[0]]: "bad" } }, { version: 1, revisions: { "https://other.example/tools/x": "a".repeat(64) } }]) {
    assert.throws(() => readUtilityRevisions(JSON.stringify(manifest)), /metadata is invalid/);
  }
  assert.equal(readUtilityRevisions('{"version":1,"revisions":{}}').size, 0);
});

test("the actual built utility manifest matches delivered pages and omits invented build-day lastmod dates", () => {
  const revisions = readUtilityRevisions(readFileSync(new URL(UtilityRevisionFile, Dist), "utf8"));
  assert.deepEqual([...revisions.keys()].sort(), [...UtilityUrls].sort());
  const sitemap = readFileSync(new URL("sitemap-pages.xml", Dist), "utf8");
  for (const url of UtilityUrls) {
    const html = readFileSync(new URL(`${new URL(url).pathname.slice(1)}.html`, Dist), "utf8");
    assert.equal(revisions.get(url), buildUtilityRevision(html, Dist.pathname));
    const entry = [...sitemap.matchAll(/<url>([\s\S]*?)<\/url>/g)].find((match) => match[1].includes(`<loc>${url}</loc>`));
    assert.ok(entry, url);
    assert.ok(!entry[1].includes("<lastmod>"), "Unknown utility modification time must not be replaced with the build date.");
  }
});
