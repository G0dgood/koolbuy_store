"use client";

import React from "react";
import { AdminOrdersList } from "../../components/Admin/Orders/AdminOrdersList";

/* Fulfilment works from the same orders table as Accounting → Orders; the
   status tabs (New, Confirmed, In transit, Delivered…) are the fulfilment view. */
export default function OrderFulfilmentPage() {
  return <AdminOrdersList />;
}
