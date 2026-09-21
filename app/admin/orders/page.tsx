"use client";

import React, { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  OrderListingView,
  OrderItem,
  StatItem,
} from "../../components/Admin/Orders/OrderListingView";

const standardOrdersData: OrderItem[] = [
  {
    id: "#ORD0001",
    product: "Kool - Scanfrost 600L Inverter Chest Freezer",
    image: "/images/koolboks/items/5.webp",
    date: "01-01-2025",
    price: "1,406,000",
    payment: "Paid",
    status: "Delivered",
  },
  {
    id: "#ORD0002",
    product: "Kool Bruhm 100ah Solar Pedestal Freezer",
    image: "/images/koolboks/items/4.webp",
    date: "01-01-2025",
    price: "1,662,370",
    payment: "Unpaid",
    status: "Pending",
  },
  {
    id: "#ORD0003",
    product: "Kool-242L Somotex Glass Door Display Freezer",
    image: "/images/koolboks/items/3.webp",
    date: "01-01-2025",
    price: "2,100,000",
    payment: "Paid",
    status: "Delivered",
  },
  {
    id: "#ORD0004",
    product: "Kool Scanfrost 60ah Single Door Chest Freezer",
    image: "/images/koolboks/items/1.webp",
    date: "01-01-2025",
    price: "1,287,600",
    payment: "Paid",
    status: "Shipped",
  },
  {
    id: "#ORD0005",
    product: "200L AC Inverter Deep Freezer",
    image: "/images/koolboks/items/2.webp",
    date: "01-01-2025",
    price: "2,420,000",
    payment: "Unpaid",
    status: "Pending",
  },
  {
    id: "#ORD0006",
    product: "230L Hisense Deep Chest Freezer",
    image: "/images/koolboks/items/6.webp",
    date: "01-01-2025",
    price: "430,000",
    payment: "Unpaid",
    status: "Cancelled",
  },
  {
    id: "#ORD0007",
    product: "Kool Thermocool 100ah Solar Inverter Freezer",
    image: "/images/koolboks/items/4.webp",
    date: "01-01-2025",
    price: "1,662,370",
    payment: "Paid",
    status: "Delivered",
  },
  {
    id: "#ORD0008",
    product: "Kool Bruhm 60ah Pedestal Solar Freezer",
    image: "/images/koolboks/items/1.webp",
    date: "01-01-2025",
    price: "1,287,600",
    payment: "Paid",
    status: "Delivered",
  },
  {
    id: "#ORD0009",
    product: "Kool - Scanfrost 600L Inverter Chest Freezer",
    image: "/images/koolboks/items/5.webp",
    date: "01-01-2025",
    price: "1,406,000",
    payment: "Unpaid",
    status: "Delivered",
  },
  {
    id: "#ORD0010",
    product: "Kool-242L Somotex Glass Door Display Freezer",
    image: "/images/koolboks/items/3.webp",
    date: "01-01-2025",
    price: "2,100,000",
    payment: "Unpaid",
    status: "Delivered",
  },
];

const standardStats: StatItem[] = [
  {
    title: "Total Orders",
    value: "1,240",
    trendValue: "14.4%",
    trendIsUp: true,
  },
  {
    title: "New Orders",
    value: "240",
    trendValue: "20%",
    trendIsUp: true,
  },
  {
    title: "Completed Orders",
    value: "960",
    trendValue: "85%",
    trendIsUp: true,
  },
  {
    title: "Canceled Orders",
    value: "87",
    trendValue: "5%",
    trendIsUp: false,
  },
];

const standardTabs = ["All order (240)", "Completed", "Pending", "Canceled"];

export default function OrderListing() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Backward compatibility: If someone visited /admin/orders?type=bnpl, redirect to dedicated page
  useEffect(() => {
    if (searchParams.get("type") === "bnpl") {
      router.replace("/admin/bnpl-orders");
    }
  }, [searchParams, router]);

  return (
    <OrderListingView
      pageType="standard"
      stats={standardStats}
      tabs={standardTabs}
      initialOrders={standardOrdersData}
      searchPlaceholder="Search order report"
      addOrderButtonLabel="Add Order"
      baseDetailUrl="/admin/orders"
    />
  );
}
