"use client";

import React, { Suspense, useEffect, useState } from "react";
import "./admin.css";
import { AdminSidebar } from "../components/Admin/AdminSidebar";
import { AdminHeader } from "../components/Admin/AdminHeader";
import { UserProvider } from "../context/UserContext";
import { usePathname } from "next/navigation";
import { applyAdminTheme, getAdminTheme } from "../components/Admin/adminTheme";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    if (mobileMenuOpen) {
      setMobileMenuOpen(false);
    }
  }, [pathname]);

  useEffect(() => {
    document.body.classList.add("admin-theme");
    // Saved light/dark choice; the storefront is always light, so clear it on the way out.
    applyAdminTheme(getAdminTheme());
    return () => {
      document.body.classList.remove("admin-theme");
      document.documentElement.classList.remove("dark");
    };
  }, []);

  return (
    <UserProvider>
      <div id="page-wrapper" className={`admin-theme overflow-x-hidden ${mobileMenuOpen ? "mobile-nav-open" : ""}`}>
        <AdminHeader onOpenMenu={() => setMobileMenuOpen((prev) => !prev)}
          isOpen={mobileMenuOpen}
        />
        {/* The sidebar reads ?tab= to highlight query-based sub-items */}
        <Suspense fallback={null}>
          <AdminSidebar
            isOpen={mobileMenuOpen}
            onClose={() => setMobileMenuOpen(false)}
          />
        </Suspense>
        <main>
          {children}
        </main>
      </div>
    </UserProvider>
  );
}
