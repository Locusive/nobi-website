import React from "react";

// Real product photos from the Shop Nobi catalog, used in the sample screens so the mockups look like a real store
// across categories, not the same few images. Prices are illustrative.
export const SAMPLE_PRODUCT = {
  hoka: { name: "Clifton 11 GTX", price: "$170", img: "/media/samples/shoe-hoka.png" },
  allbirds: { name: "Wool Runner Mid", price: "$160", img: "/media/samples/shoe-allbirds.png" },
  kizik: { name: "Adrenaline GTS 25", price: "$155", img: "/media/samples/shoe-brooks.jpg" },
  earbuds: { name: "T13 Earbuds", price: "$30", img: "/media/samples/earbuds-qcy.png" },
  headphones: { name: "Inspire XH1", price: "$150", img: "/media/samples/headphones-baseus.jpg" },
  melobuds: { name: "MeloBuds N60", price: "$40", img: "/media/samples/earbuds-baseus.png" },
  tentChogori: { name: "Chogori Tent", price: "$440", img: "/media/samples/tent-chogori.jpg" },
  tentDagger: { name: "Dagger Tent", price: "$320", img: "/media/samples/tent-dagger.jpg" },
  jacket: { name: "Cloudshield Jacket", price: "$168", img: "/media/samples/jacket-baleaf.jpg" },
  backpack: { name: "Asher Daypack", price: "$78", img: "/media/samples/backpack-kelty.jpg" },
  watch: { name: "Runwell Watch", price: "$195", img: "/media/samples/watch-shinola.png" },
  kettle: { name: "Gooseneck Kettle", price: "$89", img: "/media/samples/kettle-stagg.png" },
  mug: { name: "Ceramic Cup Set", price: "$32", img: "/media/samples/mug-kinto.jpg" },
  grinder: { name: "Encore Grinder", price: "$99", img: "/media/samples/grinder-baratza.jpg" },
};

/** The product's photo on a soft neutral tile, shown whole so no product gets cropped oddly. */
export function ProductImage({ product, ratio = "1/1", radius = 12 }) {
  return (
    <div style={{ aspectRatio: ratio, borderRadius: radius, overflow: "hidden", background: "#f4f2f8", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <img src={product.img} alt="" loading="lazy" style={{ width: "100%", height: "100%", objectFit: "contain", padding: "8%", boxSizing: "border-box" }} />
    </div>
  );
}

/** A product card: the photo, the name and the price. */
export function ProductTile({ product }) {
  return (
    <div style={{ minWidth: 0 }}>
      <ProductImage product={product} ratio={product.ratio || "1/1"} />
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
