
import React, { useState } from "react";
import { ProductReviews } from "./ProductReviews";
import { ProductDescription } from "./ProductDescription";

const ProductTabs = () => {
  const [activeTab, setActiveTab] = useState("Description");
  const tabs = ["Description", "Reviews"];

  return (
    <div className="flex-1 w-full min-w-0 bg-white rounded-tile border border-light-gray overflow-hidden flex flex-col min-h-[600px]">
      {/* Tab headers: pill segmented control */}
      <div className="px-6 md:px-10 pt-6 md:pt-8">
        <div className="inline-flex items-center gap-1 p-1 rounded-full bg-black/[0.04]">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`
                px-5 py-2 rounded-full text-[14px] font-medium transition-colors cursor-pointer
                ${activeTab === tab ? "bg-brand-charcoal text-white" : "text-subtle hover:text-brand-charcoal"}
              `}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="p-6 md:p-10">
        {activeTab === "Description" && <ProductDescription />}
        {activeTab === "Reviews" && <ProductReviews />}
      </div>
    </div>
  );
};

export { ProductTabs };
