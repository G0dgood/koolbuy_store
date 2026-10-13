/* Sample numbers for the admin dashboard, one set per period. Replace with the
   API's response when it exists; the shape here is what the page reads. */

export type Range = "today" | "week" | "month";

export interface DashboardData {
  /** Points on the time axis (hours, weekdays or days of the month). */
  labels: string[];
  revenue: number[];
  orders: number[];
  previousRevenue: number[];
  totals: {
    revenue: number;
    orders: number;
    customers: number;
    newCustomers: number;
    avgOrder: number;
    vendors: number;
    conversion: number; // percent
  };
  /** Change against the previous period, in percent. */
  change: { revenue: number; orders: number; customers: number; avgOrder: number; vendors: number; conversion: number };
  ordersByStatus: { label: string; value: number }[];
  salesByCategory: { label: string; value: number }[];
  paymentMethods: { label: string; value: number }[];
  topVendors: { label: string; value: number }[];
}

const STATUS = ["Delivered", "Shipped", "Processing", "Pending", "Cancelled"];
const CATEGORIES = ["Chest freezers", "Upright freezers", "Solar kits", "Batteries", "Air conditioners", "Ice makers"];
const PAYMENTS = ["Card", "Bank transfer", "Pay small small", "USSD", "Wallet"];
const VENDORS = ["Gworld Electronics", "Solar Best", "Destiny Electro", "MKK Electronics", "Wugobest", "Matt C Ventures"];

const zip = (labels: string[], values: number[]) => labels.map((label, i) => ({ label, value: values[i] }));

export const DASHBOARD: Record<Range, DashboardData> = {
  today: {
    labels: ["8am", "10am", "12pm", "2pm", "4pm", "6pm", "8pm"],
    revenue: [420000, 1180000, 1960000, 1540000, 2310000, 2890000, 1720000],
    previousRevenue: [380000, 960000, 1710000, 1820000, 1990000, 2240000, 1480000],
    orders: [3, 8, 14, 11, 16, 21, 12],
    totals: { revenue: 12020000, orders: 85, customers: 3842, newCustomers: 37, avgOrder: 141412, vendors: 84, conversion: 3.4 },
    change: { revenue: 13.2, orders: 9.0, customers: 1.0, avgOrder: 3.8, vendors: 0, conversion: 0.4 },
    ordersByStatus: zip(STATUS, [41, 18, 14, 9, 3]),
    salesByCategory: zip(CATEGORIES, [4810000, 2240000, 2650000, 1120000, 830000, 370000]),
    paymentMethods: zip(PAYMENTS, [34, 22, 18, 7, 4]),
    topVendors: zip(VENDORS, [3120000, 2540000, 1980000, 1610000, 1240000, 980000]),
  },
  week: {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    revenue: [6200000, 7800000, 9100000, 8400000, 11300000, 13900000, 9700000],
    previousRevenue: [5400000, 7100000, 7900000, 8800000, 9600000, 11800000, 8900000],
    orders: [52, 61, 70, 66, 88, 104, 73],
    totals: { revenue: 66400000, orders: 514, customers: 3842, newCustomers: 214, avgOrder: 129183, vendors: 84, conversion: 3.1 },
    change: { revenue: 10.8, orders: 7.5, customers: 5.9, avgOrder: 3.0, vendors: 2.4, conversion: -0.2 },
    ordersByStatus: zip(STATUS, [268, 104, 71, 52, 19]),
    salesByCategory: zip(CATEGORIES, [25900000, 12700000, 14100000, 6200000, 5300000, 2200000]),
    paymentMethods: zip(PAYMENTS, [198, 141, 107, 44, 24]),
    topVendors: zip(VENDORS, [17400000, 14200000, 11600000, 9300000, 7800000, 6100000]),
  },
  month: {
    labels: ["1", "4", "7", "10", "13", "16", "19", "22", "25", "28"],
    revenue: [18400000, 22100000, 19800000, 26700000, 31200000, 28900000, 34600000, 30100000, 37800000, 35200000],
    previousRevenue: [16900000, 19400000, 21200000, 22800000, 25100000, 26400000, 27900000, 29300000, 30800000, 31600000],
    orders: [142, 168, 151, 201, 236, 219, 262, 228, 287, 266],
    totals: { revenue: 284800000, orders: 2160, customers: 3842, newCustomers: 868, avgOrder: 131852, vendors: 84, conversion: 3.3 },
    change: { revenue: 14.8, orders: 8.2, customers: 12.5, avgOrder: 6.1, vendors: 5.0, conversion: 0.3 },
    ordersByStatus: zip(STATUS, [1294, 352, 241, 189, 84]),
    salesByCategory: zip(CATEGORIES, [109600000, 52300000, 61800000, 27400000, 23100000, 10600000]),
    paymentMethods: zip(PAYMENTS, [812, 604, 451, 192, 101]),
    topVendors: zip(VENDORS, [72100000, 58800000, 47300000, 39600000, 31900000, 25400000]),
  },
};

/** Status colours: done is green, on the way blue, in progress amber, waiting grey, cancelled red. */
export const STATUS_COLORS = ["#1baf7a", "#2a78d6", "#eda100", "#94a3b8", "#e34948"];

export interface FeedItem {
  id: string;
  customer: string;
  item: string;
  amount: number;
  area: string;
  status: "Paid" | "BNPL approved" | "Delivered" | "Shipped";
}

/** Orders the live feed cycles through. */
export const FEED_POOL: Omit<FeedItem, "id">[] = [
  { customer: "Adaeze O.", item: "Kool 219L Inverter Solar Freezer", amount: 2155000, area: "Ikeja", status: "Paid" },
  { customer: "Tunde B.", item: "Scanfrost 60Ah Battery", amount: 1287600, area: "Alimosho", status: "BNPL approved" },
  { customer: "Chioma E.", item: "Koolboks 600L AC Inverter", amount: 1468000, area: "Lekki", status: "Paid" },
  { customer: "Ibrahim Y.", item: "230L Hisense Freezer", amount: 430000, area: "Ifo", status: "Delivered" },
  { customer: "Folake A.", item: "Ice Maker Pro 40kg", amount: 865000, area: "Surulere", status: "Shipped" },
  { customer: "Emeka N.", item: "Koolboks 538L Refurbished", amount: 1538000, area: "Yaba", status: "Paid" },
  { customer: "Halima S.", item: "Thermocool 100Ah Battery", amount: 1662370, area: "Ajah", status: "BNPL approved" },
  { customer: "Segun O.", item: "Solar kit 2 × 600W panels", amount: 940000, area: "Abeokuta", status: "Paid" },
];

export interface TopProduct {
  name: string;
  category: string;
  sold: number;
  revenue: number;
  stock: number;
}

export const TOP_PRODUCTS: TopProduct[] = [
  { name: "Kool 219L Inverter Solar Freezer", category: "Chest freezers", sold: 312, revenue: 672360000, stock: 48 },
  { name: "Koolboks 600L AC Inverter", category: "Chest freezers", sold: 204, revenue: 299472000, stock: 21 },
  { name: "Scanfrost 60Ah Battery", category: "Batteries", sold: 188, revenue: 242068800, stock: 7 },
  { name: "Solar kit 2 × 600W panels", category: "Solar kits", sold: 161, revenue: 151340000, stock: 33 },
  { name: "230L Hisense Freezer", category: "Upright freezers", sold: 140, revenue: 60200000, stock: 0 },
];
