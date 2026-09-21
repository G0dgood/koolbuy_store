"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ConfigurationsRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/admin/customize");
  }, [router]);

  return null;
}
