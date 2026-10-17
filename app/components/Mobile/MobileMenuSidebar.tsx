"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Icon } from "../Icon";
import { useMobileMenu } from "@/app/context/MobileMenuContext";

import { useAuthModal } from "@/app/context/AuthModalContext";
import { useGetProfileQuery, useLogoutMutation, type UserProfile } from "@/lib/store/api/auth-api";
import { readStoredTokens, readStoredUser, clearStoredTokens, writeStoredUser } from "@/lib/api";
import { toast } from "sonner";
import { FiShield, FiArrowRight, FiLogOut } from "react-icons/fi";

interface MenuItem {
  label: string;
  icon?: string;
  href: string;
}

const MobileMenuSidebar = () => {
  const { isOpen, closeMenu } = useMobileMenu();
  const { openLogin } = useAuthModal();

  const [hasToken, setHasToken] = React.useState<boolean>(false);
  const [cachedUser, setCachedUser] = React.useState<UserProfile | null>(null);

  React.useEffect(() => {
    if (isOpen) {
      const tokens = readStoredTokens();
      const tokenExists = Boolean(tokens?.access);
      setHasToken(tokenExists);
      if (tokenExists) {
        setCachedUser(readStoredUser<UserProfile>());
      }
    }
  }, [isOpen]);

  const { data: profile } = useGetProfileQuery(undefined, { skip: !hasToken });
  const [logoutUser] = useLogoutMutation();

  const user = profile || cachedUser;
  const isAuthenticated = Boolean(hasToken && user);
  const isSuperAdmin = Boolean(
    user?.role === "admin" ||
      user?.is_superuser === true ||
      user?.staff?.is_super_admin === true
  );
  const isStaff = Boolean(isSuperAdmin || user?.is_staff === true);

  const handleLogout = async () => {
    try {
      await logoutUser().unwrap();
    } catch {
      /* ignore */
    } finally {
      clearStoredTokens();
      writeStoredUser(null);
      setHasToken(false);
      setCachedUser(null);
      closeMenu();
      toast.success("Logged out successfully");
      window.location.href = "/";
    }
  };

  const menuGroups: { items: MenuItem[] }[] = [
    {
      items: [
        { label: "Home", icon: "home", href: "/" },
        { label: "Categories", icon: "list", href: "/products" },
        { label: "Favorites", icon: "favorite_border", href: "/products" },
        { label: "My orders", icon: "inventory_2", href: "/orders" },
      ]
    },
    {
      items: [
        { label: "English | NGN", icon: "language", href: "#" },
        { label: "Contact us", icon: "headset_mic", href: "#" },
        { label: "About", icon: "info", href: "#" },
      ]
    },
    {
      items: [
        { label: "User agreement", href: "#" },
        { label: "Partnership", href: "#" },
        { label: "Privacy policy", href: "#" },
      ]
    }
  ];

  return (
    <aside 
      className={`
        fixed inset-y-0 left-0 w-[280px] bg-white z-[100] shadow-float flex flex-col transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
      `}
    >
      {/* Header / Profile */}
      <div className="bg-off-white p-5 flex flex-col gap-4 relative border-b border-black/[0.06]">
         <button 
           onClick={closeMenu}
           className="absolute top-4 right-4 text-faint hover:text-black cursor-pointer"
         >
            <Icon name="close" size="sm" />
         </button>
         
         {isAuthenticated ? (
           <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-full overflow-hidden flex items-center justify-center text-white font-semibold text-sm shadow-xs ${
                  isSuperAdmin ? "bg-gradient-to-tr from-brand-orange to-amber-500 ring-2 ring-brand-orange/40" : "bg-brand-charcoal"
                }`}>
                   {user?.avatar_url || user?.profile_image_url ? (
                     <img src={user.avatar_url || user.profile_image_url} alt="User" className="w-full h-full object-cover" />
                   ) : (
                     <span>{(user?.name || user?.email || "U").slice(0, 2).toUpperCase()}</span>
                   )}
                </div>
                <div className="flex flex-col min-w-0">
                   <span className="text-sm font-semibold text-brand-charcoal truncate">
                     {user?.name || [user?.first_name, user?.last_name].filter(Boolean).join(" ") || "My Account"}
                   </span>
                   <span className="text-[12px] text-faint truncate">{user?.email}</span>
                   {isSuperAdmin && (
                     <span className="mt-1 inline-flex items-center gap-1 px-1.5 py-0.5 text-[11px] font-semibold rounded-full bg-brand-orange text-white w-fit">
                       <FiShield className="w-2.5 h-2.5" /> Super admin
                     </span>
                   )}
                </div>
              </div>

              {isStaff && (
                <Link
                  href="/admin"
                  onClick={closeMenu}
                  className="mt-1 flex items-center justify-between p-2.5 rounded-full bg-brand-orange text-white font-medium text-xs hover:bg-brand-orange-hover transition-colors"
                >
                  <span className="flex items-center gap-1.5 font-semibold">
                    <FiShield className="w-3.5 h-3.5" />
                    {isSuperAdmin ? "Super Admin Portal" : "Admin Dashboard"}
                  </span>
                  <FiArrowRight className="w-3.5 h-3.5" />
                </Link>
              )}

              <button
                type="button"
                onClick={handleLogout}
                className="flex items-center gap-2 text-xs font-semibold text-error hover:text-error/80 pt-1 cursor-pointer"
              >
                <FiLogOut className="w-3.5 h-3.5" />
                <span>Sign out</span>
              </button>
           </div>
         ) : (
           <div 
             onClick={() => { closeMenu(); openLogin(); }}
             className="flex items-center gap-3 cursor-pointer group"
           >
              <div className="w-12 h-12 rounded-full overflow-hidden bg-white border border-light-gray flex items-center justify-center text-faint group-hover:text-brand-orange transition-colors">
                 <Icon name="profile" size="md" />
              </div>
              <div className="flex flex-col">
                 <span className="text-sm font-semibold text-brand-charcoal group-hover:text-brand-orange transition-colors">Sign in | Register</span>
                 <span className="text-xs text-faint">Manage orders & account</span>
              </div>
           </div>
         )}
      </div>

      {/* Navigation Groups */}
      <div className="flex-1 overflow-y-auto py-4">
         {menuGroups.map((group, gIdx) => (
           <div key={gIdx} className="border-b border-black/[0.06] last:border-0 py-2">
              {group.items.map((item, iIdx) => (
                <Link 
                  key={iIdx} 
                  href={item.href} 
                  onClick={closeMenu}
                  className="flex items-center gap-4 px-6 py-3 text-sm text-subtle hover:bg-black/[0.04] hover:text-brand-orange-text transition-colors group"
                >
                   {item.icon && (
                     <Icon 
                       name={item.icon} 
                       size="sm" 
                       className="text-faint group-hover:text-brand-orange-text" 
                     />
                   )}
                   <span className={!item.icon ? "ml-9" : ""}>{item.label}</span>
                </Link>
              ))}
           </div>
         ))}
      </div>
    </aside>
  );
};

export { MobileMenuSidebar };
