"use client";

import React from "react";
import { Icon } from "../Icon";
import { useWishlist, WishlistItem } from "@/app/context/WishlistContext";

interface FavoriteButtonProps {
  className?: string;
  item?: WishlistItem;
  onToggle?: (isFavorite: boolean) => void;
  variant?: "outline" | "ghost" | "none";
  size?: "sm" | "md";
  children?: React.ReactNode;
  showIcon?: boolean;
}

export const FavoriteButton: React.FC<FavoriteButtonProps> = ({
  className = "",
  item,
  onToggle,
  variant = "outline",
  size = "md",
  children,
  showIcon = true,
}) => {
  const { wishlistItems, addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  
  const isFavorite = item ? isInWishlist(item.id) : false;

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!item) return;

    if (isFavorite) {
      removeFromWishlist(item.id);
      if (onToggle) onToggle(false);
    } else {
      addToWishlist(item);
      if (onToggle) onToggle(true);
    }
  };

  // DESIGN.md: round, frosted white, no resting shadow, 150–200ms ease-apple colour changes.
  // Saved = brand orange heart on orange-soft.
  const baseStyles =
    "flex items-center justify-center rounded-full cursor-pointer transition-colors duration-200 ease-apple focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange/50";

  const variants = {
    outline: isFavorite
      ? "bg-brand-orange-soft text-brand-orange border border-transparent"
      : "bg-white/80 backdrop-blur-xl backdrop-saturate-150 text-brand-charcoal border border-black/[0.06] hover:bg-brand-orange-soft hover:text-brand-orange",
    ghost: isFavorite ? "text-brand-orange" : "text-faint hover:text-brand-orange",
    none: isFavorite ? "text-brand-orange" : "",
  };

  const sizes = {
    sm: "w-8 h-8",
    md: "w-9 h-9",
  };

  const combinedClassName = [
    baseStyles,
    variants[variant],
    variant === "outline" ? sizes[size] : "",
    className,
  ].join(" ");

  return (
    <button
      className={combinedClassName}
      onClick={handleToggle}
      type="button"
      aria-pressed={isFavorite}
      aria-label={isFavorite ? "Remove from wishlist" : "Add to wishlist"}
    >
      {showIcon && (
        <Icon
          name={isFavorite ? "favorite" : "favorite_border"}
          size={size === "sm" ? "xs" : "sm"}
          className={isFavorite ? "fill-current" : ""}
        />
      )}
      {children}
    </button>
  );
};
