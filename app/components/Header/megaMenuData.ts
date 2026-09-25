export interface MegaMenuColumn {
  title: string;
  items: {
    label: string;
    href: string;
    badge?: string;
  }[];
}

export interface MegaMenuData {
  [key: string]: {
    columns: MegaMenuColumn[];
    bottomBanner?: {
      title: string;
      desc: string;
      cta: string;
      href: string;
    };
  };
}

export const megaMenuContent: MegaMenuData = {
  categories: {
    columns: [
      {
        title: "CHEST FREEZERS",
        items: [
          {
            label: "All Chest Freezers",
            href: "/products?category=Single+Door+Chest+Freezers",
          },
          {
            label: "Single Door Chest Freezers",
            href: "/products?category=Single+Door+Chest+Freezers",
          },
          {
            label: "Double Door Chest Freezers",
            href: "/products?category=Double+Door+Chest+Freezers",
          },
          {
            label: "Commercial Deep Freezers",
            href: "/products?category=Cold+Room+Freezers",
          },
          {
            label: "Hybrid Solar Freezers",
            href: "/products?category=single-door",
          },
          {
            label: "Refurbished Freezers",
            href: "/products?sort=refurbished",
            badge: "HOT",
          },
        ],
      },
      {
        title: "CHILLERS & COOLERS",
        items: [
          { label: "All Chillers", href: "/products?category=Chiller" },
          { label: "Single Door Chillers", href: "/products?category=Chiller" },
          {
            label: "Display Beverage Chillers",
            href: "/products?category=Chiller",
          },
          {
            label: "Upright Freezers",
            href: "/products?category=Upright+Freezer",
          },
          {
            label: "Cold Room Freezers",
            href: "/products?category=Cold+Room+Freezers",
          },
          {
            label: "Ice Cream Freezers",
            href: "/products?category=ice-makers",
          },
        ],
      },
      {
        title: "SOLAR & POWER",
        items: [
          {
            label: "All Power Units",
            href: "/products?category=Power+station",
          },
          {
            label: "AC/DC Power Stations",
            href: "/products?category=Power+station",
          },
          {
            label: "Pedestal Batteries (60Ah)",
            href: "/products?category=Pedestal+Batteries",
          },
          {
            label: "Pedestal Batteries (100Ah)",
            href: "/products?category=Pedestal+Batteries",
          },
          {
            label: "Solar Lithium Battery Kits",
            href: "/products?category=Pedestal+Batteries",
          },
          {
            label: "Solar Hybrid Controllers",
            href: "/products?category=Power+station",
          },
        ],
      },
      {
        title: "AIR CONDITIONERS",
        items: [
          {
            label: "All Air Conditioners",
            href: "/products?category=Air+Conditioners",
          },
          {
            label: "Inverter Split ACs",
            href: "/products?category=Air+Conditioners",
          },
          {
            label: "Solar Hybrid AC Units",
            href: "/products?category=Air+Conditioners",
          },
          {
            label: "Standing Floor ACs",
            href: "/products?category=Air+Conditioners",
          },
          {
            label: "Commercial Cooling AC",
            href: "/products?category=Air+Conditioners",
          },
        ],
      },
      {
        title: "APPLIANCES & MORE",
        items: [
          {
            label: "Commercial Ice Makers",
            href: "/products?category=Ice+Makers",
          },
          {
            label: "DC Solar Chest Freezers",
            href: "/products?category=Single+Door+Chest+Freezers",
          },
          {
            label: "Pure Sine Wave Inverters",
            href: "/products?category=Power+station",
          },
          {
            label: "Solar Generator Kits",
            href: "/products?category=Power+station",
          },
          { label: "Koolboks Spare Parts & Kits", href: "/products" },
        ],
      },
      {
        title: "POPULAR COLLECTIONS",
        items: [
          {
            label: "On Sale Freezers",
            href: "/products?sort=sale",
            badge: "SALE",
          },
          { label: "New Arrivals 2026", href: "/products?sort=newest" },
          { label: "Best Selling Units", href: "/products?sort=bestsellers" },
          { label: "Verified Vendor Deals", href: "/products?vendor=all" },
          {
            label: "Commercial Heavy Duty",
            href: "/products?category=Cold+Room+Freezers",
          },
        ],
      },
    ],
  },
  marketplace: {
    columns: [
      {
        title: "MARKETPLACE DIRECTORY",
        items: [
          { label: "All Marketplace Products", href: "/products" },
          {
            label: "Chest Freezers & Chillers",
            href: "/products?category=Single+Door+Chest+Freezers",
          },
          {
            label: "Solar Energy & Inverters",
            href: "/products?category=Power+station",
          },
          {
            label: "Commercial Cold Storage",
            href: "/products?category=Cold+Room+Freezers",
          },
          {
            label: "Ice Makers & Accessories",
            href: "/products?category=Ice+Makers",
          },
          {
            label: "Refurbished Certified Stock",
            href: "/products?sort=refurbished",
          },
        ],
      },
      {
        title: "VERIFIED VENDORS",
        items: [
          {
            label: "Lighthouse Electronics",
            href: "/products?vendor=lighthouse",
          },
          { label: "Adobe Electronics", href: "/products?vendor=biizinilah" },
          { label: "Modus Ideal Electronics", href: "/products?vendor=modus" },
          { label: "Don Vic LTD", href: "/products?vendor=donvic" },
          {
            label: "Cash N Carry (Allen)",
            href: "/products?vendor=cashncarry",
          },
          { label: "Ajah Store & Appliances", href: "/products?vendor=ajah" },
          { label: "Albertina Nig LTD", href: "/products?vendor=albertina" },
        ],
      },
      {
        title: "TOP BRANDS",
        items: [
          { label: "Koolboks Official", href: "/products?search=Koolboks" },
          { label: "Scanfrost Nigeria", href: "/products?search=Scanfrost" },
          { label: "Haier Thermocool", href: "/products?search=Thermocool" },
          { label: "Hisense Appliances", href: "/products?search=Hisense" },
          { label: "Bruhm Electronics", href: "/products?search=Bruhm" },
          { label: "Samsung & LG Cooling", href: "/brands" },
          { label: "View All 20+ Brands", href: "/brands", badge: "ALL" },
        ],
      },
      {
        title: "DEALS & FINANCING",
        items: [
          {
            label: "Flash Sale Discounts",
            href: "/products?sort=sale",
            badge: "SAVE",
          },
          { label: "Pay As Low As ₦20,000/mo", href: "/help/payment" },
          { label: "Wholesale & Bulk Enquiries", href: "/help" },
          { label: "Vendor Clearance Stock", href: "/products" },
          { label: "Free Installation Offers", href: "/help" },
        ],
      },
    ],
  },
  quickLinks: {
    columns: [
      {
        title: "POPULAR DESTINATIONS",
        items: [
          { label: "Hot Deals & Offers", href: "/products", badge: "HOT" },
          { label: "New Arrivals 2026", href: "/products?sort=newest" },
          { label: "Brands Directory", href: "/brands" },
          { label: "Gift Boxes & Bundles", href: "/gift-boxes" },
          { label: "Top Rated Products", href: "/products?sort=rating" },
        ],
      },
      {
        title: "CUSTOMER SUPPORT",
        items: [
          { label: "Help & Support Center", href: "/help" },
          { label: "Place & Track An Order", href: "/help/tracking" },
          { label: "Payment Options & Plans", href: "/help/payment" },
          { label: "Returns & Refund Policy", href: "/refund" },
          { label: "Warranty & Repair Terms", href: "/help" },
        ],
      },
      {
        title: "VENDOR PROGRAM",
        items: [
          {
            label: "Become A Verified Vendor",
            href: "/register",
            badge: "JOIN",
          },
          { label: "Vendor Benefits & Perks", href: "/register" },
          { label: "Store Locations in Lagos", href: "/#vendor" },
          { label: "Vendor Verification Portal", href: "/login" },
          { label: "Commercial Partnership", href: "/help" },
        ],
      },
      {
        title: "ABOUT KOOLBUY",
        items: [
          { label: "About Koolbuy Clean Tech", href: "/help" },
          { label: "Meet Our Partners", href: "/brands" },
          { label: "Solar Energy Mission", href: "/help" },
          { label: "Contact Us (WhatsApp & Chat)", href: "/help" },
          { label: "Terms & Privacy Policy", href: "/help" },
        ],
      },
    ],
  },
};
