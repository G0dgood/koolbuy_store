"use client";

import React, { useEffect, useState } from "react";
import "./admin.css";
import { AdminSidebar } from "../components/Admin/AdminSidebar";
import { AdminHeader } from "../components/Admin/AdminHeader";
import { UserProvider } from "../context/UserContext";
import { usePathname } from "next/navigation";

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
    return () => {
      document.body.classList.remove("admin-theme");
    };
  }, []);

  return (
    <UserProvider>
      <div id="page-wrapper" className={`admin-theme overflow-x-hidden ${mobileMenuOpen ? "mobile-nav-open" : ""}`}>
        <AdminHeader onOpenMenu={() => setMobileMenuOpen((prev) => !prev)}
          isOpen={mobileMenuOpen}
        />
        <AdminSidebar
          isOpen={mobileMenuOpen}
          onClose={() => setMobileMenuOpen(false)}
        />
        <main>
          {children}
        </main>
      </div>
    </UserProvider>
  );
}
