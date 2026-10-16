"use client";

import React, { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AdminOrdersList } from "../../components/Admin/Orders/AdminOrdersList";

function OrderListingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Backward compatibility: /admin/orders?type=bnpl → dedicated page
  useEffect(() => {
    if (searchParams.get("type") === "bnpl") router.replace("/admin/bnpl-orders");
  }, [searchParams, router]);

  return <AdminOrdersList />;
}

export default function OrderListing() {
  return (
    <React.Suspense fallback={null}>
      <OrderListingContent />
    </React.Suspense>
  );
}
