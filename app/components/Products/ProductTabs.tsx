import React, { useState } from "react";
import { ProductReviews } from "./ProductReviews";
import { ProductDescription } from "./ProductDescription";

const ProductTabs = () => {
  const [activeTab, setActiveTab] = useState("Description");
  const tabs = ["Description", "Reviews"];

  return (
    <div className="flex-1 bg-white flex flex-col min-h-[600px]">
      {/* Tab Headers */}
      <div className="flex gap-2 border-b border-hairline bg-white">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`
              px-1 mr-6 py-4 text-[17px] transition-colors relative
              ${activeTab === tab ? "text-ink font-semibold border-b-2 border-ink" : "text-gray-500 hover:text-ink"}
            `}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="py-8">
        {activeTab === "Description" && <ProductDescription />}
        {activeTab === "Reviews" && <ProductReviews />}
      </div>
    </div>
  );
};

export { ProductTabs };
