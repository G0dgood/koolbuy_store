// Koolbuy sample catalog.
//
// There is no products API yet, so the storefront reads from this file.
// Vendor slugs match the links on the home page (e.g. /products?vendor=cashncarry)
// and category names match the home page category tabs (/products?category=Chiller).
// When the backend exists, replace these arrays with API calls and keep the shapes.

export interface Vendor {
  slug: string;
  name: string;
  image: string;
  location: string;
}

export interface CatalogProduct {
  id: string;
  title: string;
  price: string;
  originalPrice?: string;
  rating: number;
  orders: number;
  shipping: string;
  description: string;
  image: string;
  category: string;
  vendor: string; // Vendor.slug
  brand: string; // manufacturer
  power: string; // power type, used by the "Power type" filter
}

export const VENDORS: Vendor[] = [
  { slug: "lighthouse", name: "Lighthouse Electronics", image: "/images/koolboks/vendors/12.webp", location: "Lagos" },
  { slug: "biizinilah", name: "Adobe Electronics", image: "/images/koolboks/vendors/13.webp", location: "Lagos" },
  { slug: "modus", name: "Modus Ideal Electronics", image: "/images/koolboks/vendors/14.webp", location: "Lagos" },
  { slug: "donvic", name: "Don Vic LTD", image: "/images/koolboks/vendors/17.webp", location: "Lagos" },
  { slug: "cashncarry", name: "Cash N Carry (Allen)", image: "/images/koolboks/vendors/11.webp", location: "Allen Avenue, Ikeja" },
  { slug: "ajah", name: "Ajah Store", image: "/images/koolboks/vendors/15.webp", location: "Ajah, Lagos" },
  { slug: "albertina", name: "Albertina Nig LTD", image: "/images/koolboks/vendors/16.webp", location: "Lagos" },
];

export const CATEGORIES = [
  "Single Door Chest Freezers",
  "Double Door Chest Freezers",
  "Upright Freezer",
  "Chiller",
  "Cold Room Freezers",
  "Ice Makers",
  "Power station",
  "Pedestal Batteries",
  "Air Conditioners",
];

export const BRANDS = ["Koolboks", "Scanfrost", "Thermocool", "Hisense", "Bruhm", "Somotex"];

export const POWER_TYPES = ["Any", "Solar DC", "AC/DC Hybrid", "AC Inverter"];

export const PRICE_MIN = 0;
export const PRICE_MAX = 4000000;

export const PRODUCTS: CatalogProduct[] = [
  {
    id: "p1", title: "Koolboks 208L DC Solar Freezer", price: "₦1,950,000.00", originalPrice: "₦2,100,000.00",
    rating: 4.8, orders: 312, shipping: "Free delivery in Lagos",
    description: "208-litre solar DC chest freezer that runs directly off solar panels, built for shops and homes with unreliable grid power.",
    image: "/images/koolboks/items/3.webp", category: "Single Door Chest Freezers", vendor: "cashncarry", brand: "Koolboks", power: "Solar DC",
  },
  {
    id: "p2", title: "Koolboks 600L AC Inverter Freezer", price: "₦1,468,000.00",
    rating: 4.7, orders: 188, shipping: "Delivery in 2–4 days",
    description: "Large 600-litre inverter chest freezer for high-volume cold storage with lower power draw.",
    image: "/images/koolboks/items/6.webp", category: "Double Door Chest Freezers", vendor: "cashncarry", brand: "Koolboks", power: "AC Inverter",
  },
  {
    id: "p3", title: "Hisense 230L Chest Freezer", price: "₦430,000.00", originalPrice: "₦470,000.00",
    rating: 4.5, orders: 540, shipping: "Delivery in 2–4 days",
    description: "Compact 230-litre chest freezer for homes and small kitchens.",
    image: "/images/koolboks/items/5.webp", category: "Single Door Chest Freezers", vendor: "cashncarry", brand: "Hisense", power: "AC Inverter",
  },
  {
    id: "p4", title: "Kool Scanfrost 600L Inverter Freezer", price: "₦1,406,000.00",
    rating: 4.6, orders: 201, shipping: "Free delivery in Lagos",
    description: "600-litre Scanfrost inverter chest freezer with fast freezing for commercial use.",
    image: "/images/koolboks/items/5.webp", category: "Double Door Chest Freezers", vendor: "lighthouse", brand: "Scanfrost", power: "AC Inverter",
  },
  {
    id: "p5", title: "Kool Bruhm 60Ah Pedestal Battery", price: "₦1,287,600.00",
    rating: 4.6, orders: 97, shipping: "Delivery in 2–4 days",
    description: "60Ah pedestal battery to keep your freezer running through outages.",
    image: "/images/koolboks/items/1.webp", category: "Pedestal Batteries", vendor: "lighthouse", brand: "Bruhm", power: "AC/DC Hybrid",
  },
  {
    id: "p6", title: "Kool Bruhm 100Ah Pedestal Battery", price: "₦1,662,370.00",
    rating: 4.7, orders: 83, shipping: "Delivery in 2–4 days",
    description: "100Ah pedestal battery for longer backup on larger freezers.",
    image: "/images/koolboks/items/4.webp", category: "Pedestal Batteries", vendor: "biizinilah", brand: "Bruhm", power: "AC/DC Hybrid",
  },
  {
    id: "p7", title: "Kool-242L Somotex Glass-Top Chiller", price: "₦2,100,000.00",
    rating: 4.5, orders: 64, shipping: "Delivery in 3–5 days",
    description: "242-litre glass-top display chiller for drinks and chilled goods.",
    image: "/images/koolboks/items/3.webp", category: "Chiller", vendor: "donvic", brand: "Somotex", power: "AC Inverter",
  },
  {
    id: "p8", title: "Kool Thermocool 100Ah Pedestal Battery", price: "₦1,662,370.00",
    rating: 4.6, orders: 71, shipping: "Delivery in 2–4 days",
    description: "100Ah Thermocool pedestal battery for dependable backup power.",
    image: "/images/koolboks/items/4.webp", category: "Pedestal Batteries", vendor: "donvic", brand: "Thermocool", power: "AC/DC Hybrid",
  },
  {
    id: "p9", title: "Koolboks 538L Maxi Solar Freezer", price: "₦3,607,000.00",
    rating: 4.9, orders: 142, shipping: "Free delivery in Lagos",
    description: "538-litre solar freezer with ice storage, designed for food businesses off the grid.",
    image: "/images/koolboks/items/6.webp", category: "Cold Room Freezers", vendor: "modus", brand: "Koolboks", power: "Solar DC",
  },
  {
    id: "p10", title: "Koolboks 538L Refurbished Freezer", price: "₦1,538,000.00", originalPrice: "₦1,800,000.00",
    rating: 4.4, orders: 59, shipping: "Delivery in 3–5 days",
    description: "Refurbished 538-litre Koolboks freezer, inspected and ready for work.",
    image: "/images/koolboks/items/2.webp", category: "Double Door Chest Freezers", vendor: "modus", brand: "Koolboks", power: "Solar DC",
  },
  {
    id: "p11", title: "Koolboks 195L DC Ice Maker", price: "₦3,235,000.00",
    rating: 4.7, orders: 48, shipping: "Delivery in 3–5 days",
    description: "195-litre solar DC ice maker for selling ice and chilled goods.",
    image: "/images/koolboks/items/6.webp", category: "Ice Makers", vendor: "ajah", brand: "Koolboks", power: "Solar DC",
  },
  {
    id: "p12", title: "Kool Scanfrost 60Ah Pedestal Battery", price: "₦1,287,600.00",
    rating: 4.5, orders: 66, shipping: "Delivery in 2–4 days",
    description: "60Ah Scanfrost pedestal battery for freezer backup.",
    image: "/images/koolboks/items/1.webp", category: "Pedestal Batteries", vendor: "ajah", brand: "Scanfrost", power: "AC/DC Hybrid",
  },
  {
    id: "p13", title: "200L AC Inverter Upright Freezer", price: "₦2,420,000.00",
    rating: 4.6, orders: 77, shipping: "Delivery in 3–5 days",
    description: "200-litre upright inverter freezer with easy-access shelves.",
    image: "/images/koolboks/items/3.webp", category: "Upright Freezer", vendor: "albertina", brand: "Koolboks", power: "AC Inverter",
  },
  {
    id: "p14", title: "Thermocool 519L Deep Freezer", price: "₦1,890,000.00",
    rating: 4.6, orders: 118, shipping: "Free delivery in Lagos",
    description: "519-litre deep freezer for bulk storage of meat and fish.",
    image: "/images/koolboks/items/5.webp", category: "Double Door Chest Freezers", vendor: "albertina", brand: "Thermocool", power: "AC Inverter",
  },
  {
    id: "p15", title: "Koolboks 100Ah AC Battery", price: "₦1,662,370.00",
    rating: 4.5, orders: 90, shipping: "Delivery in 2–4 days",
    description: "100Ah AC battery pack to power a freezer through the night.",
    image: "/images/koolboks/items/4.webp", category: "Power station", vendor: "biizinilah", brand: "Koolboks", power: "AC/DC Hybrid",
  },
];

export const getVendor = (slug: string | null | undefined) =>
  slug ? VENDORS.find((v) => v.slug === slug) : undefined;

export const parsePrice = (price: string) => parseFloat(price.replace(/[₦$,]/g, ""));
