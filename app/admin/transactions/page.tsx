"use client";

import React, { useState } from "react";
import { Icon } from "../../components/Icon";
import { Button } from "../../components/Button";
import { Input } from "../../components/Form/Inputs";
import { StatCard } from "../../components/Admin/StatCard";
import { TabFilter } from "../../components/Admin/TabFilter";
import { Pagination } from "../../components/Admin/Pagination";
import { TransactionDetailDrawer } from "../../components/Admin/TransactionDetailDrawer";
import { RowsPerPage } from "@/app/components/rows-per-page";
import Checkbox from "@/app/components/Checkbox";
import { HiOutlineDocumentText } from "react-icons/hi2";

const transactionsData = [
  {
    custId: "#CUST001",
    name: "John Doe",
    date: "01-01-2025",
    total: "₦2,904",
    method: "CC",
    status: "Complete",
  },
  {
    custId: "#CUST002",
    name: "John Doe",
    date: "01-01-2025",
    total: "₦2,904",
    method: "PayPal",
    status: "Complete",
  },
  {
    custId: "#CUST003",
    name: "John Doe",
    date: "01-01-2025",
    total: "₦2,904",
    method: "CC",
    status: "Complete",
  },
  {
    custId: "#CUST004",
    name: "John Doe",
    date: "01-01-2025",
    total: "₦2,904",
    method: "Bank",
    status: "Complete",
  },
  {
    custId: "#CUST005",
    name: "Jane Smith",
    date: "01-01-2025",
    total: "₦2,904",
    method: "CC",
    status: "Canceled",
  },
  {
    custId: "#CUST006",
    name: "Emily Davis",
    date: "01-01-2025",
    total: "₦2,904",
    method: "PayPal",
    status: "Pending",
  },
  {
    custId: "#CUST007",
    name: "Jane Smith",
    date: "01-01-2025",
    total: "₦2,904",
    method: "Bank",
    status: "Canceled",
  },
  {
    custId: "#CUST008",
    name: "John Doe",
    date: "01-01-2025",
    total: "₦2,904",
    method: "CC",
    status: "Complete",
  },
  {
    custId: "#CUST009",
    name: "Emily Davis",
    date: "01-01-2025",
    total: "₦2,904",
    method: "PayPal",
    status: "Pending",
  },
  {
    custId: "#CUST010",
    name: "Jane Smith",
    date: "01-01-2025",
    total: "₦2,904",
    method: "Bank",
    status: "Canceled",
  },
];

const statusStyles = {
  Complete: { color: "text-success", bg: "bg-success" },
  Canceled: { color: "text-rose-500", bg: "bg-rose-500" },
  Pending: { color: "text-brand-orange-text", bg: "bg-brand-orange" },
};

export default function TransactionsPage() {
  const [activeTab, setActiveTab] = useState("All transactions");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isDetailDrawerOpen, setIsDetailDrawerOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null);

  const toggleAll = () => {
    if (selectedIds.length === transactionsData.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(transactionsData.map((t) => t.custId));
    }
  };

  const toggleItem = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Top Grid: Stats */}
      <div className="grid grid-cols-1 gap-6">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          <StatCard
            title="Total Revenue"
            value="₦15,045"
            trendValue="14.4%"
            trendIsUp={true}
            periodLabel="Last 7 days"
          />
          <StatCard
            title="Completed Transactions"
            value="3,150"
            trendValue="20%"
            trendIsUp={true}
            periodLabel="Last 7 days"
          />
          <StatCard
            title="Pending Transactions"
            value="150"
            trendValue="85%"
            trendIsUp={true}
            periodLabel="Last 7 days"
          />
          <StatCard
            title="Failed Transactions"
            value="75"
            trendValue="15%"
            trendIsUp={false}
            periodLabel="Last 7 days"
          />
        </div>
      </div>

      {/* Transaction History Card */}
      <div className="bg-white rounded-lg overflow-hidden flex flex-col border border-[#1C1C1C1A]">
        {/* Controls Bar */}
        <div className="p-4 sm:p-6 flex flex-col lg:flex-row gap-6 items-center justify-between border-b border-gray-50">
          <TabFilter
            tabs={["All transactions", "Completed", "Pending", "Canceled"]}
            activeTab={activeTab}
            onChange={setActiveTab}
          />

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
            <Input
              type="text"
              placeholder="Search payment history"
              containerClassName="w-full lg:w-80 xl:w-96"
              className="bg-white border-gray-100 placeholder:text-gray-400 text-xs font-medium"
              suffixElement={
                <Icon
                  name="search-01"
                  folder="dashboardIcon"
                  size="sm"
                  className="text-gray-400"
                />
              }
            />

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <RowsPerPage value={rowsPerPage} onChange={setRowsPerPage} />

              <div className="flex gap-2 ml-auto sm:ml-0">
                <Button
                  variant="outline"
                  shape="rounded-sm"
                  className="p-2.5! text-gray-400"
                >
                  <Icon name="sort" folder="dashboardIcon" size="sm" />
                </Button>
                <Button
                  variant="outline"
                  shape="rounded-sm"
                  className="p-2.5! text-gray-400"
                >
                  <Icon
                    name="flowbite_arrow-up-down-outline"
                    folder="dashboardIcon"
                    size="sm"
                  />
                </Button>
                <Button
                  variant="outline"
                  shape="rounded-sm"
                  className="p-2.5! text-gray-400"
                >
                  <Icon
                    name="DotsHorizontal"
                    folder="dashboardIcon"
                    size="sm"
                  />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="admin-table-container ">
          <table>
            <thead>
              <tr>
                <th className="w-10 pl-8">
                  <Checkbox
                    checked={
                      selectedIds.length === transactionsData.length &&
                      transactionsData.length > 0
                    }
                    onChange={toggleAll}
                  />
                </th>
                <th>Customer Id</th>
                <th>Name</th>
                <th className="text-center">Date</th>
                <th>Total</th>
                <th className="text-center">Method</th>
                <th>Status</th>
                <th className="text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {transactionsData.map((tx, idx) => (
                <tr key={idx} className="group">
                  <td className="w-10 pl-8">
                    <Checkbox
                      checked={selectedIds.includes(tx.custId)}
                      onChange={() => toggleItem(tx.custId)}
                    />
                  </td>
                  <td>
                    <span className="text-xs font-bold text-gray-900">
                      {tx.custId}
                    </span>
                  </td>
                  <td className="text-xs font-bold text-gray-700">{tx.name}</td>
                  <td className="text-xs font-bold text-gray-400 text-center">
                    {tx.date}
                  </td>
                  <td className="text-xs font-bold text-gray-900">
                    {tx.total}
                  </td>
                  <td className="text-xs font-bold text-gray-700 text-center">
                    {tx.method}
                  </td>
                  <td>
                    <div className="flex items-center gap-2">
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${statusStyles[tx.status as keyof typeof statusStyles].bg}`}
                      ></span>
                      <span
                        className={`text-xs font-bold ${statusStyles[tx.status as keyof typeof statusStyles].color}`}
                      >
                        {tx.status}
                      </span>
                    </div>
                  </td>
                  <td className="text-right">
                    <div className="flex justify-end gap-2 pr-4">
                      <Button
                        variant="outline"
                        shape="rounded-sm"
                        className="p-1.5! text-gray-400 hover:text-brand-orange-text hover:bg-brand-orange-soft transition-all"
                        onClick={() => {
                          setSelectedTransaction(tx);
                          setIsDetailDrawerOpen(true);
                        }}
                      >
                        <HiOutlineDocumentText size={14} />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <Pagination
          currentPage={currentPage}
          totalPages={24}
          onPageChange={setCurrentPage}
        />
      </div>

      <TransactionDetailDrawer
        isOpen={isDetailDrawerOpen}
        onClose={() => setIsDetailDrawerOpen(false)}
        transaction={selectedTransaction}
      />
    </div>
  );
}
