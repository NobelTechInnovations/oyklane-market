/** Where things are. The API is called from this app's server only (the
 * developer's token never reaches the browser). */
export const API_URL = process.env.API_INTERNAL_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
export const ADMIN_ORIGIN = (process.env.NEXT_PUBLIC_ADMIN_ORIGIN || "http://localhost:3000").replace(/\/$/, "");
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://market.oyklane.com").replace(/\/$/, "");
export const MAIN_SITE = "https://oyklane.com";
export const PARTNER_COOKIE = "oy_partner";

/** The seller's admin page for getting a listing (they're signed in there). */
export const getUrl = (kind, slug) => `${ADMIN_ORIGIN}/admin/market/${kind}/${encodeURIComponent(slug)}?install=1`;

export const inr = (n) => `₹${Number(n || 0).toLocaleString("en-IN", { maximumFractionDigits: 2 })}`;

export const CATEGORY_LABELS = {
  fashion: "Fashion & clothing",
  food: "Food & grocery",
  jewellery: "Jewellery",
  electronics: "Electronics",
  beauty: "Beauty",
  home: "Home & living",
  kids: "Kids & toys",
  sports: "Sports & fitness",
  books: "Books & stationery",
  general: "Any shop",
  marketing: "Marketing",
  sales: "Sales & checkout",
  shipping: "Shipping",
  reviews: "Reviews",
  "customer-support": "Customer support",
  analytics: "Analytics",
  "store-design": "Store design",
  other: "Other",
};

/** Screenshots of Oyklane's own themes (public/showcase). */
const OFFICIAL_SHOTS = {
  classic: ["/showcase/classic.webp"],
  modern: ["/showcase/modern.webp"],
  atelier: ["/showcase/atelier.webp", "/showcase/atelier-product.webp", "/showcase/atelier-mobile.webp"],
  lumiere: ["/showcase/lumiere.webp"],
  fizz: ["/showcase/fizz.jpg"],
  carry: ["/showcase/carry.jpg"],
  solo: ["/showcase/solo.jpg"],
  fresh: ["/showcase/fresh.jpg"],
  haveli: ["/showcase/haveli.jpg"],
  zari: ["/showcase/zari.jpg"],
  varq: ["/showcase/varq.jpg", "/showcase/varq-box.jpg"],
  aanch: ["/showcase/aanch.jpg", "/showcase/aanch-flavours.jpg"],
  amber: ["/showcase/amber.jpg", "/showcase/amber-bezel.jpg"],
  noor: ["/showcase/noor.jpg"],
  mithas: ["/showcase/mithas.jpg"],
  velours: ["/showcase/velours.jpg"],
  volt: ["/showcase/volt.jpg", "/showcase/volt-2.jpg"],
  ankur: ["/showcase/ankur.jpg", "/showcase/ankur-2.jpg"],
  stride: ["/showcase/stride.jpg", "/showcase/stride-2.jpg"],
  pothi: ["/showcase/pothi.jpg", "/showcase/pothi-2.jpg"],
  mitti: ["/showcase/mitti.jpg", "/showcase/mitti-2.jpg"],
  resham: ["/showcase/resham.jpg", "/showcase/resham-2.jpg"],
  kora: ["/showcase/kora.jpg", "/showcase/kora-2.jpg"],
  sartaj: ["/showcase/sartaj.jpg", "/showcase/sartaj-2.jpg"],
  darzi: ["/showcase/darzi.jpg", "/showcase/darzi-2.jpg"],
  kundan: ["/showcase/kundan.jpg", "/showcase/kundan-2.jpg"],
  heera: ["/showcase/heera.jpg", "/showcase/heera-2.jpg"],
};
export const withShots = (item) => (item?.official && item.kind === "theme" && !item.screenshots?.length && OFFICIAL_SHOTS[item.slug] ? { ...item, screenshots: OFFICIAL_SHOTS[item.slug] } : item);
