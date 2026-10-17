"use client";

import React, { useState } from "react";
import { ProductReviews } from "./ProductReviews";
import { ProductDescription } from "./ProductDescription";
import type { ProductView } from "./productDetailShared";
import { TabFilter, type TabOption } from "../Tabs";

type Tab = "Description" | "Reviews";

const ProductTabs: React.FC<{ product: ProductView }> = ({ product }) => {
  const [activeTab, setActiveTab] = useState<Tab>("Description");
  const tabs: TabOption<Tab>[] = [
    { value: "Description", label: "Description" },
    {
      value: "Reviews",
      label: "Reviews",
      count: product.reviewCount !== null && product.reviewCount > 0 ? product.reviewCount.toLocaleString("en-NG") : undefined,
    },
  ];

  return (
    <div className="flex-1 w-full min-w-0 bg-white rounded-tile border border-light-gray overflow-hidden flex flex-col min-h-[420px]">
      <div className="px-6 md:px-10 pt-6 md:pt-8">
        <TabFilter ariaLabel="Product information" options={tabs} activeTab={activeTab} onChange={setActiveTab} />
      </div>

      <div role="tabpanel" className="p-6 md:p-10">
        {activeTab === "Description" && <ProductDescription product={product} />}
        {activeTab === "Reviews" && <ProductReviews productId={product.id} rating={product.rating} />}
      </div>
    </div>
  );
};

export { ProductTabs };
