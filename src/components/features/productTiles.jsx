import React from "react";
import { Armchair, Car, Dumbbell, Footprints, Headphones, Shirt, ShoppingBag, Sparkles, Watch, Wrench } from "lucide-react";

// Clean, varied product stand-ins used in the sample screens, so the samples don't lean on the same few photos.
// Each category has its own color and icon, so one sample can show boots, another headphones, another a truck.
const CATEGORY = {
  apparel: { from: "#8b5cf6", to: "#d946ef", Icon: Shirt },
  footwear: { from: "#0ea5e9", to: "#2563eb", Icon: Footprints },
  bag: { from: "#f59e0b", to: "#d97706", Icon: ShoppingBag },
  auto: { from: "#334155", to: "#0f172a", Icon: Car },
  parts: { from: "#64748b", to: "#334155", Icon: Wrench },
  electronics: { from: "#14b8a6", to: "#0d9488", Icon: Headphones },
  home: { from: "#f97316", to: "#ea580c", Icon: Armchair },
  accessory: { from: "#ec4899", to: "#be185d", Icon: Watch },
  beauty: { from: "#a855f7", to: "#7c3aed", Icon: Sparkles },
  fitness: { from: "#22c55e", to: "#15803d", Icon: Dumbbell },
};

/** The illustrated image for one product: its category color and icon. ratio sets the shape. */
export function ProductImage({ category, ratio = "1/1", radius = 12 }) {
  const style = CATEGORY[category] || CATEGORY.apparel;
  const Icon = style.Icon;

  return (
    <div style={{ aspectRatio: ratio, borderRadius: radius, overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", background: `linear-gradient(135deg, ${style.from}, ${style.to})` }}>
      <Icon size="38%" color="#ffffff" strokeWidth={1.6} style={{ opacity: 0.9 }} />
    </div>
  );
}

/** A product card: an illustrated image, the name and the price. */
export function ProductTile({ product }) {
  return (
    <div style={{ minWidth: 0 }}>
      <ProductImage category={product.category} ratio={product.ratio || "1/1"} />
      <div style={{ marginTop: 7, fontSize: 12.5, fontWeight: 600, color: "#1b1626", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{product.name}</div>
      <div style={{ fontSize: 12, color: "#8a8498", marginTop: 1 }}>{product.price}</div>
    </div>
  );
}

/** A row of product tiles. */
export function ProductTileRow({ products }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: `repeat(${products.length},1fr)`, gap: 10 }}>
      {products.map((product) => (
        <ProductTile key={product.name} product={product} />
      ))}
    </div>
  );
}
