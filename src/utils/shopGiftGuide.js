import { ShopNobiImage } from "./shopNobiPage.js";
import { IndexableRobots } from "./previewImage.js";

export const GiftGuideDataId = "shop-nobi-gift-guide-data";

export function readEmbeddedGiftGuide(pathname) {
  if (typeof document === "undefined") return null;
  const element = document.getElementById(GiftGuideDataId);
  if (!element) return null;
  try {
    const guide = JSON.parse(element.textContent);
    return guide.path === pathname.replace(/\/+$/, "") ? guide : null;
  } catch { return null; }
}

export function giftGuideSeo(guide) {
  const url = `https://nobi.ai${guide.path}`;
  return {
    path: guide.path,
    title: `${guide.title} | Shop Nobi`,
    description: guide.intro,
    image: guide.products.find((product) => product.imageUrl)?.imageUrl || ShopNobiImage,
    robots: IndexableRobots,
    schema: [{
      "@context": "https://schema.org", "@type": "CollectionPage", name: guide.title,
      description: guide.intro, url,
      mainEntity: { "@type": "ItemList", itemListElement: guide.products.map((product, index) => ({
        "@type": "ListItem", position: index + 1, name: product.name, url: product.url,
      })) },
    }],
  };
}
