"use client";

import React, { useState, useMemo } from "react";
import { Icon } from "../../components/Icon";
import { Button } from "../../components/Button";
import { Input } from "../../components/Form/Inputs";
import { StatCard } from "../../components/Admin/StatCard";
import { TabFilter } from "../../components/Admin/TabFilter";
import { Pagination } from "../../components/Admin/Pagination";
import { RowsPerPage } from "@/app/components/rows-per-page";
import {
  HiOutlineArrowTrendingUp,
  HiOutlineHeart,
  HiOutlineArrowPath,
  HiOutlineDocumentArrowDown,
} from "react-icons/hi2";

// Top Performing Products data
const topPerformingData = [
  {
    id: 1,
    name: "Kool - Scanfrost 600L Inverter Chest Freezer",
    sku: "KB-SF-600",
    category: "Chest Freezers",
    price: "₦1,406,000",
    unitsSold: 342,
    totalRevenue: "₦480,852,000",
    growth: "+24.5%",
    image: "/images/koolboks/items/5.webp",
  },
  {
    id: 2,
    name: "Kool Bruhm 100ah Solar Pedestal Freezer",
    sku: "KB-BR-100",
    category: "Solar Freezers",
    price: "₦1,662,370",
    unitsSold: 284,
    totalRevenue: "₦472,113,080",
    growth: "+19.2%",
    image: "/images/koolboks/items/4.webp",
  },
  {
    id: 3,
    name: "Kool-242L Somotex Glass Door Display Freezer",
    sku: "KB-SM-242",
    category: "Commercial Freezers",
    price: "₦2,100,000",
    unitsSold: 195,
    totalRevenue: "₦409,500,000",
    growth: "+15.8%",
    image: "/images/koolboks/items/3.webp",
  },
  {
    id: 4,
    name: "Commercial Solar Deep Freezer 500L",
    sku: "KB-CS-500",
    category: "Solar Freezers",
    price: "₦2,350,000",
    unitsSold: 112,
    totalRevenue: "₦263,200,000",
    growth: "+8.7%",
    image: "/images/koolboks/items/3.webp",
  },
  {
    id: 5,
    name: "Kool Scanfrost 60ah Single Door Chest Freezer",
    sku: "KB-SF-060",
    category: "Single Door Chest Freezers",
    price: "₦1,287,600",
    unitsSold: 168,
    totalRevenue: "₦216,316,800",
    growth: "+11.4%",
    image: "/images/koolboks/items/1.webp",
  },
  {
    id: 6,
    name: "230L Hisense High-Efficiency Deep Freezer",
    sku: "KB-HS-230",
    category: "Chest Freezers",
    price: "₦430,000",
    unitsSold: 245,
    totalRevenue: "₦105,350,000",
    growth: "+22.1%",
    image: "/images/koolboks/items/6.webp",
  },
];

// Most Wishlist Products data
const mostWishlistData = [
  {
    id: 1,
    name: "Kool Bruhm 100ah Solar Pedestal Freezer",
    sku: "KB-BR-100",
    category: "Solar Freezers",
    price: "₦1,662,370",
    totalWishlists: 342,
    stockStatus: "In Stock",
    addedThisMonth: 68,
    image: "/images/koolboks/items/4.webp",
  },
  {
    id: 2,
    name: "Kool - Scanfrost 600L Inverter Chest Freezer",
    sku: "KB-SF-600",
    category: "Chest Freezers",
    price: "₦1,406,000",
    totalWishlists: 285,
    stockStatus: "In Stock",
    addedThisMonth: 52,
    image: "/images/koolboks/items/5.webp",
  },
  {
    id: 3,
    name: "Commercial Solar Deep Freezer 500L",
    sku: "KB-CS-500",
    category: "Solar Freezers",
    price: "₦2,350,000",
    totalWishlists: 240,
    stockStatus: "In Stock",
    addedThisMonth: 45,
    image: "/images/koolboks/items/3.webp",
  },
  {
    id: 4,
    name: "Double Door Chest Freezer 400L",
    sku: "KB-DD-400",
    category: "Double Door Freezers",
    price: "₦1,120,000",
    totalWishlists: 198,
    stockStatus: "Low Stock",
    addedThisMonth: 38,
    image: "/images/koolboks/items/2.webp",
  },
  {
    id: 5,
    name: "Kool-242L Somotex Glass Door Display Freezer",
    sku: "KB-SM-242",
    category: "Commercial Freezers",
    price: "₦2,100,000",
    totalWishlists: 174,
    stockStatus: "Out of Stock",
    addedThisMonth: 29,
    image: "/images/koolboks/items/3.webp",
  },
  {
    id: 6,
    name: "Kool Scanfrost 60ah Single Door Chest Freezer",
    sku: "KB-SF-060",
    category: "Single Door Chest Freezers",
    price: "₦1,287,600",
    totalWishlists: 152,
    stockStatus: "In Stock",
    addedThisMonth: 24,
    image: "/images/koolboks/items/1.webp",
  },
];

// Most Refunded Products data
const mostRefundedData = [
  {
    id: 1,
    name: "200L AC Inverter Deep Freezer",
    sku: "KB-AC-200",
    category: "Inverter Freezers",
    price: "₦2,420,000",
    unitsRefunded: 6,
    refundRate: "2.8%",
    primaryReason: "Delivery transit damage",
    image: "/images/koolboks/items/2.webp",
  },
  {
    id: 2,
    name: "Kool Bruhm 60ah Pedestal Solar Freezer",
    sku: "KB-BR-060",
    category: "Solar Freezers",
    price: "₦1,287,600",
    unitsRefunded: 4,
    refundRate: "2.1%",
    primaryReason: "Customer ordered wrong voltage",
    image: "/images/koolboks/items/1.webp",
  },
  {
    id: 3,
    name: "Double Door Chest Freezer 400L",
    sku: "KB-DD-400",
    category: "Double Door Freezers",
    price: "₦1,120,000",
    unitsRefunded: 3,
    refundRate: "1.6%",
    primaryReason: "Size incompatible with space",
    image: "/images/koolboks/items/2.webp",
  },
  {
    id: 4,
    name: "Kool Thermocool 100ah Solar Inverter Freezer",
    sku: "KB-TC-100",
    category: "Solar Freezers",
    price: "₦1,662,370",
    unitsRefunded: 2,
    refundRate: "1.2%",
    primaryReason: "Delayed installation dispatch",
    image: "/images/koolboks/items/4.webp",
  },
  {
    id: 5,
    name: "Kool Scanfrost 60ah Single Door Chest Freezer",
    sku: "KB-SF-060",
    category: "Single Door Chest Freezers",
    price: "₦1,287,600",
    unitsRefunded: 2,
    refundRate: "0.9%",
    primaryReason: "Duplicate order placed",
    image: "/images/koolboks/items/1.webp",
  },
];

export default function ProductPerformancePage() {
  const [activeTab, setActiveTab] = useState("Top Performing Products");
  const [searchQuery, setSearchQuery] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const tabs = [
    "Top Performing Products",
    "Most Wishlist Products",
    "Most Refunded Products",
  ];

  // Pick dataset based on tab
  const activeDataset = useMemo(() => {
    switch (activeTab) {
      case "Top Performing Products":
        return topPerformingData;
      case "Most Wishlist Products":
        return mostWishlistData;
      case "Most Refunded Products":
        return mostRefundedData;
      default:
        return topPerformingData;
    }
  }, [activeTab]);

  // Filter dataset by search
  const filteredData = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return activeDataset;
    return activeDataset.filter(
      (item) =>
        item.name.toLowerCase().includes(q) ||
        item.sku.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q),
    );
  }, [activeDataset, searchQuery]);

  const totalPages = Math.ceil(filteredData.length / rowsPerPage) || 1;
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return filteredData.slice(start, start + rowsPerPage);
  }, [filteredData, currentPage, rowsPerPage]);

  return (
    <div className="flex flex-col gap-6 mx-auto pb-12">
      {/* Header Area */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          {/* <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Products Performance Report
          </h1>
          <p className="text-sm text-gray-500">
            Comprehensive sales, wishlist demand, and refund analytics across
            all products.
          </p> */}
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="primary"
            shape="rounded-sm"
            className="flex items-center gap-2 bg-[#00BCD4] hover:bg-[#00acc1] text-white text-xs font-semibold px-4 py-2 cursor-pointer shadow-sm"
            onClick={() => alert("Exporting Product Performance Report...")}
          >
            <HiOutlineDocumentArrowDown className="w-4 h-4" />
            <span>Export Report</span>
          </Button>
        </div>
      </div>

      {/* 3 Summary Cards with requested headers */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          size="sm"
          title="Top Performing Products"
          value="148"
          trendValue="18.4%"
          trendIsUp={true}
          subtitle="Best seller: Scanfrost 600L Inverter"
          badgeIcon={
            <HiOutlineArrowTrendingUp className="w-4 h-4 text-emerald-600" />
          }
        />
        <StatCard
          size="sm"
          title="Most Wishlist Products"
          value="86"
          trendValue="24.2%"
          trendIsUp={true}
          subtitle="Top wishlisted: Bruhm 100ah Solar"
          badgeIcon={<HiOutlineHeart className="w-4 h-4 text-rose-500" />}
        />
        <StatCard
          size="sm"
          title="Most Refunded Products"
          value="12"
          trendValue="1.8%"
          trendIsUp={false}
          subtitle="Lowest return rate across catalog"
          badgeIcon={<HiOutlineArrowPath className="w-4 h-4 text-amber-500" />}
        />
      </div>

      {/* Main Table Card */}
      <div className="bg-white overflow-hidden flex flex-col border border-[#1C1C1C1A] rounded-lg shadow-2xs">
        {/* Filter Controls Bar */}
        <div className="p-4 sm:p-5 flex flex-col lg:flex-row gap-4 items-center justify-between border-b border-gray-100">
          <TabFilter
            tabs={tabs}
            activeTab={activeTab}
            onChange={(tab) => {
              setActiveTab(tab);
              setCurrentPage(1);
            }}
          />

          <div className="flex items-center gap-3 w-full lg:w-auto justify-end">
            <div className="relative w-full sm:w-72">
              <Input
                type="text"
                placeholder="Search product, SKU..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                containerClassName="w-full"
                className="bg-white border-gray-200 placeholder:text-gray-400 text-xs font-medium"
                suffixElement={
                  <Icon
                    name="search-01"
                    folder="dashboardIcon"
                    size="sm"
                    className="text-gray-400"
                  />
                }
              />
            </div>
            <RowsPerPage value={rowsPerPage} onChange={setRowsPerPage} />
          </div>
        </div>

        {/* Table Content Dynamic per Tab */}
        <div className="admin-table-container">
          <table>
            <thead>
              {activeTab === "Top Performing Products" && (
                <tr>
                  <th className="w-14 text-center">Rank</th>
                  <th>Product Name</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th className="text-center">Units Sold</th>
                  <th>Total Revenue</th>
                  <th className="text-right pr-6">Growth</th>
                </tr>
              )}

              {activeTab === "Most Wishlist Products" && (
                <tr>
                  <th className="w-14 text-center">Rank</th>
                  <th>Product Name</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th className="text-center">Total Wishlists</th>
                  <th>Stock Status</th>
                  <th className="text-right pr-6">Added This Month</th>
                </tr>
              )}

              {activeTab === "Most Refunded Products" && (
                <tr>
                  <th className="w-14 text-center">Rank</th>
                  <th>Product Name</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th className="text-center">Units Refunded</th>
                  <th>Refund Rate</th>
                  <th className="text-right pr-6">Primary Reason</th>
                </tr>
              )}
            </thead>

            <tbody>
              {paginatedData.length > 0 ? (
                paginatedData.map((item: any, idx: number) => {
                  const rank = (currentPage - 1) * rowsPerPage + idx + 1;
                  return (
                    <tr
                      key={item.id}
                      className="hover:bg-gray-50/50 transition-colors"
                    >
                      {/* Rank */}
                      <td className="text-center font-bold text-gray-500 text-xs">
                        #{rank}
                      </td>

                      {/* Product Name */}
                      <td>
                        <div className="flex items-center gap-3 min-w-55">
                          <div className="w-12 h-12 rounded-lg border border-gray-100 bg-white p-1 overflow-hidden shrink-0 flex items-center justify-center shadow-2xs">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-full h-full object-contain"
                            />
                          </div>
                          <div className="flex flex-col">
                            <span className="text-sm font-bold text-gray-900 leading-tight">
                              {item.name}
                            </span>
                            <span className="text-[11px] font-medium text-gray-400 mt-0.5">
                              SKU: {item.sku}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td>
                        <span className="text-xs font-semibold text-gray-600">
                          {item.category}
                        </span>
                      </td>

                      {/* Price */}
                      <td>
                        <span className="text-xs font-bold text-gray-900">
                          {item.price}
                        </span>
                      </td>

                      {/* Tab-Specific Columns */}
                      {activeTab === "Top Performing Products" && (
                        <>
                          <td className="text-center">
                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-blue-50 text-brand-blue">
                              {item.unitsSold} units
                            </span>
                          </td>
                          <td>
                            <span className="text-sm font-black text-gray-900">
                              {item.totalRevenue}
                            </span>
                          </td>
                          <td className="text-right pr-6">
                            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                              {item.growth}
                            </span>
                          </td>
                        </>
                      )}

                      {activeTab === "Most Wishlist Products" && (
                        <>
                          <td className="text-center">
                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-600">
                              {item.totalWishlists} wishlists
                            </span>
                          </td>
                          <td>
                            <span
                              className={`text-xs font-semibold px-2 py-0.5 rounded ${
                                item.stockStatus === "In Stock"
                                  ? "bg-emerald-50 text-emerald-600"
                                  : item.stockStatus === "Low Stock"
                                    ? "bg-amber-50 text-amber-600"
                                    : "bg-rose-50 text-rose-600"
                              }`}
                            >
                              {item.stockStatus}
                            </span>
                          </td>
                          <td className="text-right pr-6">
                            <span className="text-xs font-bold text-gray-700">
                              +{item.addedThisMonth} this month
                            </span>
                          </td>
                        </>
                      )}

                      {activeTab === "Most Refunded Products" && (
                        <>
                          <td className="text-center">
                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700">
                              {item.unitsRefunded} units
                            </span>
                          </td>
                          <td>
                            <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded">
                              {item.refundRate}
                            </span>
                          </td>
                          <td className="text-right pr-6">
                            <span className="text-xs font-medium text-gray-600">
                              {item.primaryReason}
                            </span>
                          </td>
                        </>
                      )}
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td
                    colSpan={7}
                    className="text-center py-12 text-gray-400 text-sm"
                  >
                    No products found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="p-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="text-xs text-gray-400 font-medium">
            Showing {paginatedData.length} of {filteredData.length} products
          </span>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>
    </div>
  );
}
