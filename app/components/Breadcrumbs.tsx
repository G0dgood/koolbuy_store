import React from "react";
import Link from "next/link";
import { Icon } from "./Icon";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
  hideHome?: boolean;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items, className = "", hideHome = false }) => {
  return (
    <nav
      aria-label="Breadcrumb"
      className={`flex items-center gap-1.5 text-[12px] md:text-[13px] text-faint whitespace-nowrap overflow-x-auto scrollbar-none ${className}`}
    >
      {!hideHome && (
        <Link
          href="/"
          aria-label="Home"
          className="flex items-center text-faint hover:text-brand-charcoal transition-colors duration-200"
        >
          <Icon name="home" size="sm" />
        </Link>
      )}
      {items.map((item, idx) => (
        <React.Fragment key={idx}>
          {(!hideHome || idx > 0) && (
            <span aria-hidden="true" className="text-medium-gray">›</span>
          )}
          {item.href ? (
            <Link href={item.href} className="text-faint hover:text-brand-charcoal transition-colors duration-200">
              {item.label}
            </Link>
          ) : (
            <span aria-current="page" className="text-subtle">{item.label}</span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};
