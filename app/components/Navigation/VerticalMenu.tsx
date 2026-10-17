import React from "react";
import { Icon } from "../Icon";

interface MenuItem {
  id: string;
  label: string;
  icon?: string;
  count?: number;
}

interface VerticalMenuProps {
  items: MenuItem[];
  activeId?: string;
  onItemClick?: (id: string) => void;
  className?: string;
}

const VerticalMenu: React.FC<VerticalMenuProps> = ({
  items,
  activeId,
  onItemClick,
  className = "",
}) => {
  return (
    <nav className={`w-full max-w-xs bg-white rounded-lg border border-light-gray  overflow-hidden ${className}`}>
      <ul className="flex flex-col">
        {items.map((item) => {
          const isActive = item.id === activeId;
          return (
            <li key={item.id}>
              <button
                onClick={() => onItemClick?.(item.id)}
                className={`flex items-center w-full px-4 py-3 text-sm font-medium transition-colors border-l-4 ${isActive
                  ? "bg-brand-orange-soft text-brand-orange-text border-brand-charcoal"
                  : "text-subtle border-transparent hover:bg-black/[0.04] hover:text-brand-charcoal"
                  }`}
              >
                {item.icon && (
                  <Icon
                    name={item.icon}
                    size="sm"
                    className={`mr-3 ${isActive ? "text-brand-orange-text" : "text-faint"}`}
                  />
                )}
                <span className="flex-1 text-left">{item.label}</span>
                {item.count !== undefined && (
                  <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${isActive ? "bg-brand-charcoal text-white" : "bg-black/[0.04] text-faint"
                    }`}>
                    {item.count}
                  </span>
                )}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export { VerticalMenu };
