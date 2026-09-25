"use client";

import React from "react";
import {
  OrderListingView,
  OrderItem,
  StatItem,
} from "../../components/Admin/Orders/OrderListingView";

const bnplOrdersData: OrderItem[] = [
  {
    id: "#BNPL0001",
    product: "Kool - Scanfrost 600L Inverter Chest Freezer",
    image: "/images/koolboks/items/5.webp",
    date: "12-01-2025",
    price: "1,406,000",
    plan: "3 Months • ₦468,666/mo",
    deposit: "₦281,200 (Paid)",
    payment: "Installment Active (2/3 Paid)",
    status: "Delivered",
  },
  {
    id: "#BNPL0002",
    product: "Kool Bruhm 100ah Solar Pedestal Freezer",
    image: "/images/koolboks/items/4.webp",
    date: "10-01-2025",
    price: "1,662,370",
    plan: "6 Months • ₦277,061/mo",
    deposit: "₦332,474 (Paid)",
    payment: "Installment Active (4/6 Paid)",
    status: "Delivered",
  },
  {
    id: "#BNPL0003",
    product: "Kool-242L Somotex Glass Door Display Freezer",
    image: "/images/koolboks/items/3.webp",
    date: "08-01-2025",
    price: "2,100,000",
    plan: "12 Months • ₦175,000/mo",
    deposit: "₦420,000 (Paid)",
    payment: "Completed",
    status: "Delivered",
  },
  {
    id: "#BNPL0004",
    product: "Kool Scanfrost 60ah Single Door Chest Freezer",
    image: "/images/koolboks/items/1.webp",
    date: "05-01-2025",
    price: "1,287,600",
    plan: "4 Months • ₦321,900/mo",
    deposit: "₦257,520 (Pending)",
    payment: "Pending Downpayment",
    status: "Pending",
  },
  {
    id: "#BNPL0005",
    product: "200L AC Inverter Deep Freezer",
    image: "/images/koolboks/items/2.webp",
    date: "03-01-2025",
    price: "2,420,000",
    plan: "6 Months • ₦403,333/mo",
    deposit: "₦484,000 (Paid)",
    payment: "Overdue (1 missed)",
    status: "Delivered",
  },
  {
    id: "#BNPL0006",
    product: "230L Hisense Deep Chest Freezer",
    image: "/images/koolboks/items/6.webp",
    date: "01-01-2025",
    price: "430,000",
    plan: "3 Months • ₦143,333/mo",
    deposit: "₦86,000 (Unpaid)",
    payment: "Cancelled Plan",
    status: "Cancelled",
  },
  {
    id: "#BNPL0007",
    product: "Kool Thermocool 100ah Solar Inverter Freezer",
    image: "/images/koolboks/items/4.webp",
    date: "28-12-2024",
    price: "1,662,370",
    plan: "6 Months • ₦277,061/mo",
    deposit: "₦332,474 (Paid)",
    payment: "Installment Active (5/6 Paid)",
    status: "Delivered",
  },
  {
    id: "#BNPL0008",
    product: "Kool Bruhm 60ah Pedestal Solar Freezer",
    image: "/images/koolboks/items/1.webp",
    date: "26-12-2024",
    price: "1,287,600",
    plan: "3 Months • ₦429,200/mo",
    deposit: "₦257,520 (Paid)",
    payment: "Completed",
    status: "Delivered",
  },
  {
    id: "#BNPL0009",
    product: "Kool - Scanfrost 600L Inverter Chest Freezer",
    image: "/images/koolboks/items/5.webp",
    date: "20-12-2024",
    price: "1,406,000",
    plan: "6 Months • ₦234,333/mo",
    deposit: "₦281,200 (Paid)",
    payment: "Installment Active (3/6 Paid)",
    status: "Shipped",
  },
  {
    id: "#BNPL0010",
    product: "Kool-242L Somotex Glass Door Display Freezer",
    image: "/images/koolboks/items/3.webp",
    date: "15-12-2024",
    price: "2,100,000",
    plan: "12 Months • ₦175,000/mo",
    deposit: "₦420,000 (Paid)",
    payment: "Installment Active (10/12 Paid)",
    status: "Delivered",
  },
];

const bnplStats: StatItem[] = [
  {
    title: "Total BNPL Orders",
    value: "480",
    trendValue: "18.2%",
    trendIsUp: true,
  },
  {
    title: "Active Plans",
    value: "310",
    trendValue: "12.4%",
    trendIsUp: true,
  },
  {
    title: "Completed Plans",
    value: "145",
    trendValue: "24.0%",
    trendIsUp: true,
  },
  {
    title: "Overdue / Missed",
    value: "25",
    trendValue: "3.2%",
    trendIsUp: false,
  },
];

const bnplTabs = [
  "All BNPL order (480)",
  "Active Plan",
  "Completed",
  "Pending",
  "Canceled",
];

export default function BnplOrderListing() {
  return (
    <OrderListingView
      pageType="bnpl"
      title="BNPL Orders"
      stats={bnplStats}
      tabs={bnplTabs}
      initialOrders={bnplOrdersData}
      searchPlaceholder="Search BNPL orders, customer, plan..."
      addOrderButtonLabel="Add BNPL Order"
      baseDetailUrl="/admin/bnpl-orders"
    />
  );
}
