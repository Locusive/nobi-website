import { ShopNobiImage } from "./shopNobiPage.js";
import { IndexableRobots } from "./previewImage.js";

export const GiftGuideDataId = "shop-nobi-gift-guide-data";

export function giftGuideProductName(product) {
  const rawBrand = product.brand && !/-inc\b/i.test(product.brand) ? product.brand : product.storeName;
  const brand = typeof rawBrand === "string" ? rawBrand.trim() : "";
  return brand && !product.name.toLowerCase().includes(brand.toLowerCase()) ? `${brand} ${product.name}` : product.name;
}

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
        "@type": "ListItem", position: index + 1, name: giftGuideProductName(product), url: product.url,
      })) },
    }],
  };
}
