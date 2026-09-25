"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SubscriptionDiscountRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/admin/subscription-discounts");
  }, [router]);

  return null;
}
