import React from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence } from "framer-motion";
import { DropdownMenu, DropdownItem, DropdownFooterAction } from "../Dropdown/DropdownMenu";

interface SearchAutocompleteProps {
  searchQuery: string;
  isVisible: boolean;
}

export const SearchAutocomplete: React.FC<SearchAutocompleteProps> = ({ searchQuery, isVisible }) => {
  const router = useRouter();

  return (
    <AnimatePresence>
      {isVisible && searchQuery.length > 0 && (
        <div className="absolute top-full left-0 pt-2 w-full z-100">
          <DropdownMenu width="100%" className="shadow-2xl border border-gray-100 rounded-2xl overflow-hidden bg-white">
            <div className="px-4 py-2 text-xs font-bold text-gray-400 border-b border-gray-50 uppercase tracking-wider">
              Top Results for "{searchQuery}"
            </div>
            <DropdownItem
              label={`${searchQuery} DC Solar Freezers`}
              subtext="In Solar Refrigeration"
              icon="search"
              onClick={() => router.push(`/products?search=${encodeURIComponent(searchQuery)}`)}
            />
            <DropdownItem
              label={`${searchQuery} 538L Maxi Solar Panel`}
              subtext="In Hybrid Freezers"
              icon="search"
              onClick={() => router.push(`/products?search=${encodeURIComponent(searchQuery)}`)}
            />
            <DropdownItem
              label={`${searchQuery} Commercial Chest Freezers`}
              subtext="In Commercial Cooling"
              icon="search"
              onClick={() => router.push(`/products?search=${encodeURIComponent(searchQuery)}`)}
            />
            <DropdownFooterAction 
              label={`View all results for "${searchQuery}"`} 
              onClick={() => router.push(`/products?search=${encodeURIComponent(searchQuery)}`)} 
              icon="arrow_forward" 
            />
          </DropdownMenu>
        </div>
      )}
    </AnimatePresence>
  );
};
