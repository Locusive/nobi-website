import { ExtraGiftGuideTopics } from "./shopGiftGuideExtraTopics.js";
import { ExtraGiftGuideSourceCopy } from "./shopGiftGuideExtraCopy.js";
import { MoreGiftGuideTopics } from "./shopGiftGuideMoreTopics.js";
import { ScaleGiftGuideTopics } from "./shopGiftGuideScaleTopics.js";
import { LeatherTotesPilot } from "./shopLeatherTotesPilot.js";
import { MensLeatherJacketsGuide } from "./shopMensLeatherJackets.js";
import { WomensWinterCoatsGuide } from "./shopWomensWinterCoats.js";
import { WomensCrossbodyBagsGuide } from "./shopWomensCrossbodyBags.js";
import { PersonalItemBagsGuide } from "./shopPersonalItemBags.js";
import { CoffeeLoversGiftGuide } from "./shopCoffeeLoversGiftGuide.js";
import { TravelGiftsGuide } from "./shopTravelGifts.js";
import { WomensStockingStuffersGuide } from "./shopWomensStockingStuffers.js";
import { CatLoversGiftGuide } from "./shopCatLoversGiftGuide.js";
import { BestTravelBackpacksGuide } from "./shopBestTravelBackpacks.js";
import { BestCarryOnLuggageGuide } from "./shopBestCarryOnLuggage.js";
import { BestGiftsForDadGuide } from "./shopBestGiftsForDad.js";
import { BestGiftsForMomGuide } from "./shopBestGiftsForMom.js";
import { BestWalletsForMenGuide } from "./shopBestWalletsForMen.js";
import { BestCoffeeGrindersGuide } from "./shopBestCoffeeGrinders.js";
import { MensStockingStuffersGuide } from "./shopMensStockingStuffers.js";
import { BestEspressoMachinesGuide } from "./shopBestEspressoMachines.js";
import { BestChefKnivesGuide } from "./shopBestChefKnives.js";
import { BestGiftsForGardenersGuide } from "./shopBestGiftsForGardeners.js";
import { BestWatchesForMenGuide } from "./shopBestWatchesForMen.js";
import { BestGiftsForCooksGuide } from "./shopBestGiftsForCooks.js";
import { BestWeekenderBagsForWomenGuide } from "./shopBestWeekenderBagsForWomen.js";
import { BestThrowBlanketsGuide } from "./shopBestThrowBlankets.js";
import { BestSlippersForWomenGuide } from "./shopBestSlippersForWomen.js";
import { BestScentedCandlesGuide } from "./shopBestScentedCandles.js";

// Each guide has a distinct shopper and a concrete reason to compare its source categories.
// Product choices come from the live Shop Nobi page feed at build time, not this file.
export const GiftGuideTopics = [
  LeatherTotesPilot,
  MensLeatherJacketsGuide,
  WomensWinterCoatsGuide,
  WomensCrossbodyBagsGuide,
  PersonalItemBagsGuide,
  CoffeeLoversGiftGuide,
  TravelGiftsGuide,
  WomensStockingStuffersGuide,
  CatLoversGiftGuide,
  BestTravelBackpacksGuide,
  BestCarryOnLuggageGuide,
  BestGiftsForDadGuide,
  BestGiftsForMomGuide,
  BestWalletsForMenGuide,
  BestCoffeeGrindersGuide,
  MensStockingStuffersGuide,
  BestEspressoMachinesGuide,
  BestChefKnivesGuide,
  BestGiftsForGardenersGuide,
  BestWatchesForMenGuide,
  BestGiftsForCooksGuide,
  BestWeekenderBagsForWomenGuide,
  BestThrowBlanketsGuide,
  BestSlippersForWomenGuide,
  BestScentedCandlesGuide,
  { slug: "gifts-for-home-cooks", title: "Gifts for home cooks", intro: "For someone who enjoys making dinner as much as eating it, start with tools they can use in the kitchen they already have. A cookbook or well-made utensil is easier to give than a large appliance; reserve the rice cooker for someone who makes rice often and has counter space.", sources: ["cookbooks", "olive-kitchen-tools-and-utensils", "rice-cookers"], why: "A practical addition to a cooking routine", check: "Check dimensions, care instructions and appliance compatibility with the retailer." },
  { slug: "gifts-for-painters", title: "Gifts for painters", intro: "A painter's supplies are personal. Brush shape, handle length and medium matter more than an impressive-looking set. These are starting points to discuss with the artist before buying.", sources: ["paint-brushes", "palette-knives"], why: "Useful tools for an established painting practice", check: "Confirm the brush or knife shape and the artist's preferred medium." },
  { slug: "gifts-for-mechanical-keyboard-fans", title: "Gifts for mechanical keyboard fans", intro: "Keyboard enthusiasts notice layout and feel. Compare the board's size, switch options and keycap compatibility so the gift fits the desk they already have.", sources: ["keyboards", "keycaps"], why: "A desk setup item with room for personal choice", check: "Verify layout, switch type and keycap compatibility before ordering." },
  { slug: "gifts-for-frequent-travelers", title: "Gifts for frequent travelers", intro: "A good travel gift earns its space in a bag. Look at carrying style, packed dimensions and organization instead of assuming a larger bag is better.", sources: ["backpacks", "duffle-bags", "travel-pouches"], why: "Designed for carrying and organizing belongings on the move", check: "Check airline size rules, capacity and return terms." },
  { slug: "gifts-for-nail-art-lovers", title: "Gifts for nail art lovers", intro: "The right kit depends on whether the recipient uses gel, air-dry polish or an electric file. Start with their existing routine, then compare colors and included tools.", sources: ["nail-art-kits", "nail-polishes", "nail-drills"], why: "A way to explore a favorite nail-art technique", check: "Check the included tools, curing requirements and ingredient information." },
  { slug: "gifts-for-kids-who-love-outdoor-play", title: "Gifts for kids who love outdoor play", intro: "Outdoor play equipment needs the right age range and enough safe space. Compare footprint, supervision needs and storage before choosing a water table or ride-on toy.", sources: ["water-tables", "riding-toys", "pedal-cars"], why: "An option for active play outside", check: "Verify age guidance, assembly, dimensions and adult supervision requirements." },
  { slug: "gifts-for-a-new-home-office", title: "Gifts for a new home office", intro: "A better work corner starts with comfort and fit. Chairs and desk accessories make sense only when they suit the recipient's space and working habits.", sources: ["office-chairs", "keyboards", "black-chargers"], why: "A considered addition to a daily work setup", check: "Measure the space and check adjustment, connection and power requirements." },
  { slug: "gifts-for-garden-projects", title: "Gifts for gardeners", intro: "A gardener may appreciate something that makes planting easier, even when the weather keeps them indoors. A kneeler is practical for someone who tends beds by hand; a planter needs the right amount of space and light; a small ornament suits someone whose setup you do not know.", sources: ["gardening-scooters-seats-and-kneelers", "pots-planters", "garden-ornaments"], why: "A useful or decorative addition to a gardening routine", check: "Check dimensions, materials and whether the recipient has space for it." },
  { slug: "gifts-for-pet-parents", title: "Gifts for pet parents", intro: "Start with the animal, not the photograph. A dog bed and a cat bed solve different needs, and a warming mat may be inappropriate for some pets. Ask about size, sleeping habits and the owner's safety preferences before giving anything the animal will use unsupervised.", sources: ["gray-dog-supplies", "cat-beds", "pet-heating-pads"], why: "A comfort option for a particular pet's routine", check: "Confirm species, size, supervision and the manufacturer's safety guidance." },
  { slug: "gifts-for-pool-days", title: "Gifts for pool days", intro: "A pool gift should fit the pool and the way it is used. Look closely at dimensions, weight limits and storage before picking a float or lounger.", sources: ["pool-floats-and-loungers", "pool-and-spa"], why: "An addition to time spent by the water", check: "Check pool compatibility, weight limits and water-safety instructions." },
  { slug: "gifts-for-a-cozy-bedroom", title: "Gifts for a cozy bedroom", intro: "Soft furnishings can make a bedroom feel more personal without requiring a furniture-size surprise. Throws are flexible; a comforter or pillow needs the right bed size, fill and sleep preferences. Check with the recipient before choosing bedding they will use every night.", sources: ["throw-blankets", "comforters", "pillows"], why: "A comfort choice for a personal space", check: "Confirm bed size, fill preference, fabric care and return terms." },
  { slug: "gifts-for-a-holiday-host", title: "Thanksgiving host gift ideas", intro: "A small host gift can be useful long after Thanksgiving dinner. Table linens, candles and serving pieces are easier to carry than a large kitchen appliance; choose something that suits the host's space and taste.", sources: ["cloth-napkins", "candles", "serving-trays", "coasters"], why: "A thoughtful object for hosting or the home", check: "Check size, care and delivery timing with the retailer." },
  ...ExtraGiftGuideTopics,
  ...MoreGiftGuideTopics,
  ...ScaleGiftGuideTopics,
];

// Category-level editorial notes are shared by guides that draw from the same catalog search.
// They name a relevant decision without implying hands-on testing or an unverified feature.
export const GiftGuideSourceCopy = {
  "cookbooks": ["A cookbook can introduce recipes without taking up much counter space", "Check the cuisine, difficulty and whether the recipient already owns this title."],
  "olive-kitchen-tools-and-utensils": ["A frequently used utensil can be a more welcome upgrade than a large appliance", "Check material, heat tolerance and whether it suits the recipient's cookware."],
  "gardening-scooters-seats-and-kneelers": ["A kneeler or garden seat can make longer planting sessions more comfortable", "Check folded dimensions, weight rating and whether it works on the recipient's terrain."],
  "pots-planters": ["A planter leaves room for the recipient to choose the plant", "Check drainage, inside dimensions and whether it is rated for the intended setting."],
  "garden-ornaments": ["A small ornament is easier to gift when you do not know the garden's layout", "Check materials, weather suitability and the recipient's taste."],
  "gray-dog-supplies": ["A dog bed or accessory should suit the animal's actual size and habits", "Measure the dog and check cleaning instructions and material safety."],
  "cat-beds": ["A cat bed can offer a quiet resting place", "Check interior dimensions, cleaning instructions and whether the cat prefers covered or open spaces."],
  "throw-blankets": ["A throw can add warmth without requiring a mattress-size guess", "Check the fiber, dimensions, texture and washing instructions."],
  "pillows": ["A pillow is a personal sleep choice", "Confirm size, firmness, fill and the retailer's return rules before gifting."],
  "copper-cookware": ["Copper cookware is a statement piece for someone who enjoys cooking", "Compare pan sizes, stove compatibility and the care copper requires."],
  "copper-saucepans": ["A saucepan can be easier to fit into an existing kitchen than a full set", "Check its capacity, handle material and stove compatibility."],
  "rice-cookers": ["A dedicated rice cooker can suit a cook who makes rice often", "Confirm bowl capacity, voltage and the cooking modes the recipient needs."],
  "paint-brushes": ["Brush sets open up different marks and techniques", "Match the bristle type and handle length to the recipient's paint medium."],
  "art-brushes": ["A different brush shape can expand an artist's toolkit", "Check the brush size and medium before buying duplicates."],
  "palette-knives": ["Palette knives offer another way to mix or apply paint", "Compare blade shape, flexibility and handle length."],
  "keyboards": ["A keyboard is an everyday part of a desk setup", "Confirm layout, switch options and wired or wireless connection."],
  "keycaps": ["Keycaps let a keyboard fan change the look and feel of a board", "Verify stem compatibility, key sizes and keyboard layout."],
  "backpacks": ["A backpack can make frequent trips easier to organize", "Check capacity, laptop fit and carry-on dimensions."],
  "duffle-bags": ["A duffle suits trips where quick packing matters", "Check packed dimensions, carrying options and empty weight."],
  "travel-pouches": ["A small pouch can keep essentials separate in a larger bag", "Check dimensions and whether the compartments fit the intended items."],
  "nail-art-kits": ["A kit can bring several nail-art tools together", "Check exactly what is included and whether a lamp is needed."],
  "nail-polishes": ["Color choice makes this a personal gift", "Confirm polish type, removal method and ingredient information."],
  "nail-drills": ["An electric file suits someone who already uses nail tools", "Check bits, speeds and the maker's safe-use guidance."],
  "water-tables": ["A water table can support outdoor play", "Confirm age guidance, footprint and supervision requirements."],
  "riding-toys": ["A ride-on toy adds movement to playtime", "Check age guidance, weight limit and assembly."],
  "pedal-cars": ["A pedal car makes a bigger outdoor-play gift", "Measure storage space and check age and weight guidance."],
  "office-chairs": ["A chair can change how a work corner feels", "Check seat dimensions, adjustment and return terms."],
  "black-chargers": ["A charger is useful only if it matches existing devices", "Verify connector type, power rating and device compatibility."],
  "garden-bridges": ["A garden bridge can become a landscape focal point", "Measure the site and check load rating and anchoring."],
  "outdoor-structures": ["A structure can turn an outdoor area into a project", "Check dimensions, materials, assembly and local requirements."],
  "lighting": ["Outdoor lighting can change how a path or garden is used", "Check power, weather rating and installation needs."],
  "pet-heating-pads": ["A warming pad may suit an animal's resting place", "Confirm pet size, heat controls and the manufacturer's safety instructions."],
  "cat-litter-boxes": ["A litter-box upgrade can be practical for a cat household", "Check entry dimensions, cleaning routine and the cat's preferences."],
  "small-animal-supplies": ["Daily-care supplies can be more useful than a novelty gift", "Confirm the animal species, dimensions and material safety."],
  "pool-floats-and-loungers": ["A float or lounger can add comfort by the pool", "Check weight limits, pool size and water-safety guidance."],
  "pool-and-spa": ["A pool accessory can support a favorite summer routine", "Verify pool fit, materials and storage needs."],
  "beds": ["A bed is a substantial bedroom decision", "Measure the room and mattress before choosing a frame."],
  "comforters": ["A comforter changes the feel of a bedroom", "Check size, fill and care instructions."],
  "blue-area-rugs": ["A rug can change a room without replacing furniture", "Measure the floor area and check pile, material and cleaning."],
  "seasonal-and-holiday-decorations": ["Seasonal decor can suit a host who enjoys setting a scene", "Check storage space, electrical requirements and timing."],
  "cloth-napkins": ["Cloth napkins can return to the table for many meals", "Check set size, fabric and washing instructions."],
  "candles": ["A candle is a compact gift for someone who enjoys atmosphere", "Check scent notes, burn guidance and the host's fragrance preferences."],
  "serving-trays": ["A serving tray can work for drinks, snacks or display", "Check dimensions, materials and cleaning instructions."],
  "coasters": ["Coasters are easy to use during a gathering", "Check set size, material and care instructions."],
  ...ExtraGiftGuideSourceCopy,
};
