import assert from "node:assert/strict";
import { test } from "node:test";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { buildSearchPages } from "../scripts/shop-nobi-search-page-view.js";
import { writePrebuiltPages } from "../scripts/shop-nobi-page-files.js";
import { readFixturePageData } from "./shop-nobi-pages-server.js";
import { readBody, readScriptJson } from "./shop-nobi-test-build.js";
import { htmlEscape } from "../scripts/prerender-blog.js";

const ReviewedTopics = [
  ["green-polo", /care label/i],
  ["booties", /intended wearer/i],
  ["100-silk-clothing-accessories", /composition/i],
  ["washed-cotton-velvet-bing-cherry-decor", /furniture model/i],
  ["100-cashmere-clothing", /composition/i],
  ["100-cashmere-sweaters", /composition/i],
  ["100-cotton-underwear-socks", /composition/i],
  ["amplifier-cases", /cover/i],
  ["18k-white-gold-bangles", /diameter/i],
  ["kids-pink-baby-one-pieces", /convertible/i],
  ["mens-black-joggers", /antimicrobial/i],
  ["18k-mixed-gold-jewelry", /metal/i],
  ["18k-rose-gold-tennis-bracelets", /karat/i],
  ["14k-yellow-gold-jewelry", /white gold/i],
  ["womens-pearl-jewelry", /pearl/i],
  ["14k-rose-gold-bracelets-2", /magnet/i],
  ["18k-white-gold-stud-earrings", /weight/i],
  ["womens-rose-gold-jewelry", /plat/i],
  ["18k-rose-gold-bangles", /alloy/i],
  ["18k-rose-gold-earrings", /nickel-free/i],
  ["yellow-earrings", /stone/i],
  ["brown-work-boots", /toe/i],
  ["black-snowboard-boots", /binding/i],
  ["baby-dresses", /adult/i],
  ["brown-leather-jackets", /trim/i],
  ["brown-ankle-boots", /material/i],
  ["brown-knee-high-boots", /waterproof/i],
  ["brown-lifestyle-sneakers", /care/i],
  ["beige-maxi-dresses", /lining/i],
  ["blue-dress-pants", /care/i],
  ["blue-navy-sweaters", /weight/i],
  ["cutting-boards", /bamboo/i],
  ["blender-accessories", /holder/i],
  ["art-brushes", /artwork/i],
  ["bicycle-baskets", /mount/i],
  ["birch-sling-furniture-sets", /load limit/i],
  ["beige-barware-sets", /furniture/i],
  ["bathroom-cleaners", /label/i],
  ["headphone-cushions-and-tips", /model/i],
  ["system-and-power-cables", /mains/i],
  ["army-pants", /color/i],
  ["athletic-heather-t-shirts", /composition/i],
  ["basketball-sneakers", /court/i],
  ["beige-coats", /care/i],
  ["beige-white-shirts-tops", /care/i],
  ["black-motorcycle-jackets", /protect/i],
  ["black-performance-polo-shirts", /shrink/i],
  ["blue-more-responsible-materials-polo-shirts", /claim/i],
  ["blue-more-responsible-materials-shirts-and-tops", /claim/i],
  ["black-snow-pants", /shell/i],
  ["baby-car-seat-accessories", /manufacturer/i],
  ["beige-food-beverage-carriers", /temperature/i],
  ["bakeware", /temperature/i],
  ["beige-seat-cushions", /care/i],
  ["blue-white-kitchen-dining", /dishwasher/i],
  ["amber-decor", /name/i],
  ["bird-feeders", /squirrel/i],
  ["lens-cleaners", /coat/i],
  ["audio-cards-and-adapters", /signal/i],
  ["computer-interface-cards-and-adapters", /voltage/i],
  ["100-cotton-clothing", /fiber/i, "The items include shirts, dresses, shorts, pants and polo styles, all made from 100 % cotton fabrics such as jersey, gauze and woven twill."],
  ["black-suede-footwear", /brand/i, "Most styles are loafers, pumps, heels and boots made from soft suede, often with a polished finish."],
  ["black-woven-swimwear", /capris/i, "The selection includes one-piece suits, bikini tops and bottoms, high-rise swim caps, board shorts and swim skirts, many with UPF50+ protection."],
  ["blue-navy-one-piece-swimsuits", /opacity/i, "Yes, as long as it has a secure fit and a lined interior to prevent transparency."],
  ["blue-swim-trunks", /rating/i, "Swim trunks protect the skin they cover, but you should still apply sunscreen to exposed areas."],
  ["blue-water-friendly-swimwear", /closure/i, "A peel-and-stick or elastic waist can improve fit, and bright blue prints help you stay visible in the water."],
  ["cotton-jeans", /distressed/i, "Stretch fibers add comfort, while raw or distressed finishes give a lived-in look."],
  ["cotton-outerwear", /shell/i, "Follow the label, usually machine wash on gentle and tumble dry low with clean tennis balls to restore loft."],
  ["blue-navy-cotton-shirts-tops", /blend/i, "Short-sleeve shirts provide more airflow, while lightweight long-sleeve options can protect from sun without overheating."],
  ["black-merino-wool-socks", /compression/i, "Mild compression can improve blood flow on long trips or during intense activity."],
  ["climbing-helmets", /sport/i, "Ventilation helps keep your head cool on warm days, but it may slightly reduce impact protection compared to a solid shell."],
  ["carabiners", /working load/i, "It indicates the maximum load the carabiner can hold; higher numbers mean stronger strength."],
  ["candle-snuffers", /cool/i, "When picking a snuffer, look for a length that lets you reach the flame without burning your fingers and a tip that fits the candle size, a small cup for tea lights and a broader edge for larger pillars. Metal snuffers stay cool and are easy to clean."],
  ["brown-ground-coffee", /grind/i, "Yes, a coarse grind works well for cold brew, though many cold brew recipes use whole beans that are ground after steeping."],
  ["brown-coffee-filters", /brewer/i, "The Toddy Reusable Cold Brew Coffee Filters (index 12) and the Fetish-style metal mesh filters are labeled reusable."],
  ["bulb-planting-tools", /depth/i, "A planter with a 2-inch depth guide works well for most tulip bulbs."],
  ["cabinet-knobs", /thread/i, "They fit standard mounting holes, so they can replace most standard knobs regardless of color."],
  ["clear-glass-tableware", /material/i, "All items are made from transparent, lead-free glass that is typically dishwasher-safe. Thicker glasses feel more durable, while thinner designs are elegant but may chip more easily."],
  ["ceramic-drinkware", /component/i, "Most stoneware with a glaze label is microwave-safe, but check the manufacturer’s instructions."],
  ["ceiling-light-fixtures", /dimm/i, "Yes, use dimmable LED bulbs and a compatible dimmer switch for smooth light control."],
  ["performance-polo", /rating/i, "Many are treated with UV-blocking finishes, making them a good choice for sunny outdoor activities."],
  ["tall-polo", /measurement/i, "Tall polos typically add 2 to 3 inches in length to accommodate longer torsos."],
  ["army-shirts-tops", /Army/i, "They include cashmere pieces, cotton tees and polyester blends, all in army colors or camo prints."],
  ["baby-toddler-hats", /intended/i, "Yes, as long as they are snug but not too tight and have no loose strings."],
  ["beads-bracelets", /cord/i, "Surgical-grade stainless steel or nickel-free gold are generally hypoallergenic."],
  ["black-dress-shoes", /width/i, "Yes, wearing them for short periods with thick socks helps soften the material and prevent blisters."],
  ["black-knit-shirts-tops", /care/i, "Use a gentle cycle with cold water and lay flat to dry to prevent stretching."],
  ["blue-navy-midi-dresses", /lining/i, "Consider care needs: cotton and linen dresses are machine washable, while silk or satin blends often require gentle hand-washing or dry cleaning to keep colors vibrant."],
  ["brown-leather-handbags", /finish/i, "Brown leather can hide light stains better, but regular cleaning with a leather conditioner is still recommended."],
  ["brown-maxi-dresses", /length/i, "Check the inseam or overall length listed; a longer dress should reach the floor without dragging."],
  ["pressure-cooker-accessories", /model/i, "Look for accessories that match the size of your cooker’s lid and valve. A good sling or handle makes moving a hot cooker safer, while extra racks let you can or steam multiple items at once."],
  ["tent-poles", /model/i, "Free-zip and cam-butt connectors are common and provide a strong, repeatable lock."],
  ["outdoor-power-equipment", /generator/i, "A 2000 PSI washer is suitable for most driveway and deck cleaning tasks without damaging surfaces."],
  ["electric-knife-accessories", /blade/i, "Most electric knives work with standard stone or diamond sharpeners, but check the blade’s angle and material for best results."],
  ["bicycle-brake-levers", /brake/i, "Road levers can work on a mountain bike if the cable pull matches the calipers, but they may lack the reach needed for gloved hands."],
  ["coffee-filters", /count/i, "Check the brewer’s manual or compare the filter’s shape and size markings, such as cone #4 or basket 100 count, to the recommended filter type."],
  ["coffee-maker-water-filters", /model/i, "Yes, they remove chlorine and some minerals that can affect taste, resulting in a cleaner brew."],
  ["electrical-switches", /finish/i, "Yes, a paintable finish is available for switches that you want to match a custom color."],
  ["power-electrical-supplies", /voltage/i, "Select a supply that meets or exceeds the total wattage of the devices you plan to connect."],
  ["hydration-system-accessories", /temperature/i, "Most soft flasks are designed for cold drinks; for hot liquids use insulated hard bottles."],
  ["brown-gold-charms", /bag/i, "Most are designed for standard charm bracelets, but larger or heavier charms may need a sturdier chain."],
  ["14k-gold-vermeil-jewelry", /construction/i, "Look for a hallmark indicating 14k gold over sterling silver and a weight that feels solid rather than lightweight plating."],
  ["18k-white-gold-pendant-necklaces", /construction/i, "The product description should state the karat; plated pieces usually mention “gold-filled” or “plated” instead of a karat."],
  ["14k-white-gold-rings", /resiz/i, "Yes, a jeweler can resize it, though very small or intricate designs may be more challenging."],
  ["18k-white-gold-eternity-rings", /weight/i, "A higher total carat weight provides more brilliance, but the band’s thickness and comfort fit are also important for everyday wear."],
  ["14k-rose-gold-signet-rings", /engrav/i, "Yes, 14k rose gold is strong enough for daily use and resists tarnish better than higher karat gold."],
  ["black-gold-rings", /construction/i, "Solid gold rings are usually marked with a karat stamp like 14k or 18k and feel heavier than plated pieces."],
  ["18k-white-gold-earrings", /finish/i, "No, white gold is gold alloyed with white metals and plated, while platinum is a naturally white, denser metal."],
  ["blue-green-stud-earrings", /material/i, "Nickel-free options like surgical-steel, titanium or 14-karat gold are usually safest."],
  ["belts", /material/i, "Real leather feels soft, has a natural grain, and develops a patina over time, unlike synthetic leather which feels plasticky."],
];

test("reviewed guides replace unsafe source advice consistently in visible HTML, schema and hydration", async t => {
  const folder = mkdtempSync(new URL("../node_modules/.guide-review-", import.meta.url));
  t.after(() => rmSync(folder, { recursive: true, force: true }));
  writeFileSync(join(folder, "index.html"), '<html><head><!--__PRERENDER_TITLE__--><!--__PRERENDER_DESC__--></head><body><div id="root"></div></body></html>');
  const fixture = readFixturePageData().pages[0];
  const sourcePages = ReviewedTopics.map(([slug, , stale = "Unsafe legacy blanket guidance."]) => ({
    ...fixture, slug, title: "Unreviewed buying guide", query: slug.replaceAll("-", " "),
    guide: [stale],
    faq: [{ question: "How should I choose?", answer: stale }],
    products: fixture.products.slice(0, 2),
  }));
  const pages = buildSearchPages(sourcePages, sourcePages.length).pages;
  const original = structuredClone(pages);
  await writePrebuiltPages({ searchPages: pages, categoryPages: [], popularSearches: { pages: [], moreSearches: [], categories: [] } }, folder);
  for (const [index, [slug, topic, stale = "Unsafe legacy blanket guidance."]] of ReviewedTopics.entries()) {
    const html = readFileSync(join(folder, `shop/s/${slug}.html`), "utf8");
    const published = readScriptJson(html, "shop-nobi-prebuilt-content").data;
    const body = readBody(html).replaceAll("&#x27;", "&#39;");
    assert.ok(!html.includes(htmlEscape(stale)), `${slug}: legacy claim removed`);
    assert.match(published.guide.join(" "), topic, slug);
    assert.ok(body.includes(htmlEscape(published.title)), slug);
    for (const paragraph of published.guide) assert.ok(body.includes(htmlEscape(paragraph)), slug);
    const faq = readScriptJson(html, "page-schema").find(entry => entry["@type"] === "FAQPage");
    assert.deepEqual(faq.mainEntity.map(entry => ({ question: entry.name, answer: entry.acceptedAnswer.text })), published.faq, slug);
    for (const { question, answer } of published.faq) {
      assert.ok(body.includes(htmlEscape(question)), slug);
      assert.ok(body.includes(htmlEscape(answer)), slug);
    }
    assert.ok(html.includes(`<title>${htmlEscape(published.title)} | Shop Nobi</title>`), slug);
    assert.ok(html.includes(`content="${htmlEscape(published.description)}"`), slug);
    assert.deepEqual(published.products, original[index].products, slug);
    assert.equal(published.query, original[index].query, slug);
    assert.equal(published.updatedAt, original[index].updatedAt, slug);
  }
  assert.deepEqual(pages, original, "Source records are preserved for other publication surfaces");
});
