"use client";

import React, { useState } from "react";
import { Breadcrumbs } from "@/app/components/Breadcrumbs";
import { Icon } from "@/app/components/Icon";
import { Button } from "@/app/components/Button";
import { useParams } from "next/navigation";
import { Select } from "@/app/components/Form/Select";
import { ConfirmationModal } from "@/app/components/Admin/ConfirmationModal";

export default function BnplOrderDetails() {
  const { id } = useParams();
  const [currentStatus, setCurrentStatus] = useState("Delivered");
  const [pendingStatus, setPendingStatus] = useState<string | null>(null);
  const [isStatusConfirmOpen, setIsStatusConfirmOpen] = useState(false);

  const orderId = (typeof id === "string" ? id : "BNPL0001").toUpperCase();

  const bnplOrder = {
    id: `#${orderId}`,
    date: "Jan 12, 2025, 10:30 AM",
    status: currentStatus,
    paymentStatus: "Installment Active (2/3 Paid)",
    planDuration: "3 Months",
    monthlyInstallment: "₦468,666",
    depositAmount: "₦281,200 (Paid)",
    totalAmount: "₦1,406,000",
    paidSoFar: "₦1,218,532",
    remainingBalance: "₦187,468",
    shippingMethod: "Kool Logistics Express",
    customer: {
      name: "Tunde Babalola",
      email: "tunde.babalola@example.com",
      phone: "+234 803 456 7890",
      bvnVerified: true,
      creditScore: "740 (Excellent)",
      avatar:
        "https://ui-avatars.com/api/?name=Tunde+Babalola&background=2196F3&color=fff",
    },
    shippingAddress: {
      line1: "Plot 14, Admiralty Way",
      line2: "Lekki Phase 1",
      city: "Lagos",
      country: "Nigeria",
    },
    items: [
      {
        id: 1,
        name: "Kool - Scanfrost 600L Inverter Chest Freezer",
        price: "₦1,406,000",
        quantity: 1,
        total: "₦1,406,000",
        image: "/images/koolboks/items/5.webp",
      },
    ],
    installments: [
      {
        installmentNo: "Initial Deposit",
        dueDate: "12 Jan 2025",
        amount: "₦281,200",
        status: "Paid",
        paidDate: "12 Jan 2025",
        reference: "TXN-DEP-8831",
      },
      {
        installmentNo: "Installment 1 of 3",
        dueDate: "12 Feb 2025",
        amount: "₦468,666",
        status: "Paid",
        paidDate: "12 Feb 2025",
        reference: "TXN-INS-9201",
      },
      {
        installmentNo: "Installment 2 of 3",
        dueDate: "12 Mar 2025",
        amount: "₦468,666",
        status: "Paid",
        paidDate: "11 Mar 2025",
        reference: "TXN-INS-9942",
      },
      {
        installmentNo: "Installment 3 of 3",
        dueDate: "12 Apr 2025",
        amount: "₦187,468",
        status: "Upcoming",
        paidDate: "-",
        reference: "Pending",
      },
    ],
  };

  return (
    <div className="flex flex-col gap-8 mx-auto pb-12">
      {/* Header & Breadcrumbs */}
      <div className="flex flex-col gap-4">
        <Breadcrumbs
          items={[
            { label: "BNPL Orders", href: "/admin/bnpl-orders" },
            { label: `BNPL Order: ${bnplOrder.id}` },
          ]}
        />
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">
              {bnplOrder.id}
            </h1>
            <span className="px-3 py-1.5 rounded-lg text-[10px] font-black border uppercase tracking-wider bg-brand-blue-light text-brand-blue border-blue-100">
              {currentStatus}
            </span>
            <span className="px-3 py-1.5 rounded-lg text-[10px] font-black border uppercase tracking-wider bg-amber-50 text-amber-700 border-amber-200">
              {bnplOrder.paymentStatus}
            </span>
          </div>
          <div className="flex gap-3 items-center w-full md:w-auto">
            <Button
              variant="ghost"
              className="bg-white border-gray-200 text-gray-700 font-bold px-4 sm:px-6 h-12 shadow-sm"
            >
              <Icon name="file_download" size="xs" className="mr-2" />
              Payment Schedule PDF
            </Button>
            <div className="w-44">
              <Select
                value={pendingStatus || currentStatus}
                onChange={(val: string) => {
                  setPendingStatus(val as string);
                  setIsStatusConfirmOpen(true);
                }}
                options={[
                  { label: "Delivered", value: "Delivered" },
                  { label: "Shipped", value: "Shipped" },
                  { label: "Pending", value: "Pending" },
                  { label: "Cancelled", value: "Cancelled" },
                ]}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main 2 Cols */}
        <div className="lg:col-span-2 flex flex-col gap-8">
          {/* BNPL Summary Card */}
          <div className="bg-linear-to-r from-blue-50/70 via-white to-blue-50/40 rounded-lg border border-blue-100 p-6 shadow-sm flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <div>
                <span className="text-[11px] font-extrabold uppercase tracking-widest text-brand-blue">
                  BNPL Plan Summary
                </span>
                <h3 className="text-lg font-bold text-gray-900 mt-0.5">
                  {bnplOrder.planDuration} Installment Contract
                </h3>
              </div>
              <span className="text-sm font-bold text-gray-600 bg-white px-3 py-1 rounded-full border border-gray-100 shadow-xs">
                Monthly:{" "}
                <strong className="text-gray-900">
                  {bnplOrder.monthlyInstallment}
                </strong>
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2 border-t border-blue-100/60">
              <div>
                <span className="text-xs text-gray-500 font-medium">
                  Total Value
                </span>
                <p className="text-base font-bold text-gray-900">
                  {bnplOrder.totalAmount}
                </p>
              </div>
              <div>
                <span className="text-xs text-gray-500 font-medium">
                  Down Payment
                </span>
                <p className="text-base font-bold text-emerald-600">
                  {bnplOrder.depositAmount}
                </p>
              </div>
              <div>
                <span className="text-xs text-gray-500 font-medium">
                  Paid So Far
                </span>
                <p className="text-base font-bold text-brand-blue">
                  {bnplOrder.paidSoFar}
                </p>
              </div>
              <div>
                <span className="text-xs text-gray-500 font-medium">
                  Remaining Due
                </span>
                <p className="text-base font-bold text-rose-600">
                  {bnplOrder.remainingBalance}
                </p>
              </div>
            </div>
          </div>

          {/* Repayment Schedule */}
          <div className="bg-white rounded-lg border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-50 flex justify-between items-center">
              <h3 className="font-black text-gray-900 text-base">
                Installment Repayment Schedule
              </h3>
              <span className="text-xs font-semibold text-gray-500">
                Next payment due:{" "}
                <strong className="text-gray-900">12 Apr 2025</strong>
              </span>
            </div>

            <div className="admin-table-container">
              <table>
                <thead>
                  <tr>
                    <th>Milestone</th>
                    <th>Due Date</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Paid Date</th>
                    <th>Reference</th>
                  </tr>
                </thead>
                <tbody>
                  {bnplOrder.installments.map((inst, i) => (
                    <tr key={i}>
                      <td className="font-semibold text-gray-900 text-sm">
                        {inst.installmentNo}
                      </td>
                      <td className="text-gray-600 text-sm font-medium">
                        {inst.dueDate}
                      </td>
                      <td className="font-bold text-gray-900 text-sm">
                        {inst.amount}
                      </td>
                      <td>
                        <span
                          className={`px-2.5 py-1 rounded-md text-[11px] font-bold ${
                            inst.status === "Paid"
                              ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                              : "bg-amber-50 text-amber-600 border border-amber-100"
                          }`}
                        >
                          {inst.status}
                        </span>
                      </td>
                      <td className="text-gray-500 text-sm font-medium">
                        {inst.paidDate}
                      </td>
                      <td className="text-xs font-mono text-gray-400">
                        {inst.reference}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Purchased Items */}
          <div className="bg-white rounded-lg border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-50">
              <h3 className="font-black text-gray-900 text-base">
                Order Product
              </h3>
            </div>
            <div className="p-6 flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl border border-gray-100 bg-gray-50 overflow-hidden shrink-0">
                  <img
                    src={bnplOrder.items[0].image}
                    alt={bnplOrder.items[0].name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-sm">
                    {bnplOrder.items[0].name}
                  </h4>
                  <span className="text-xs text-gray-400">
                    Qty: {bnplOrder.items[0].quantity}
                  </span>
                </div>
              </div>
              <span className="font-extrabold text-gray-900 text-base">
                {bnplOrder.items[0].price}
              </span>
            </div>
          </div>
        </div>

        {/* Customer & Shipping Sidebar */}
        <div className="flex flex-col gap-8">
          {/* Customer Profile & Credit Rating */}
          <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-6 flex flex-col gap-4">
            <h3 className="font-black text-gray-900 text-base">
              Customer & Credit
            </h3>
            <div className="flex items-center gap-3">
              <img
                src={bnplOrder.customer.avatar}
                alt={bnplOrder.customer.name}
                className="w-12 h-12 rounded-full border border-gray-100"
              />
              <div>
                <h4 className="font-bold text-gray-900 text-sm">
                  {bnplOrder.customer.name}
                </h4>
                <p className="text-xs text-gray-500">
                  {bnplOrder.customer.email}
                </p>
                <p className="text-xs text-gray-500">
                  {bnplOrder.customer.phone}
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-gray-50 flex flex-col gap-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-500 font-medium">
                  BVN Verification
                </span>
                <span className="text-emerald-600 font-bold flex items-center gap-1">
                  <Icon name="verified" folder="icon" size="xs" /> Verified
                </span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-500 font-medium">Credit Score</span>
                <span className="font-bold text-gray-900">
                  {bnplOrder.customer.creditScore}
                </span>
              </div>
            </div>
          </div>

          {/* Delivery Address */}
          <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-6 flex flex-col gap-3">
            <h3 className="font-black text-gray-900 text-base">
              Delivery Location
            </h3>
            <div className="text-xs text-gray-600 flex flex-col gap-1 leading-relaxed">
              <p className="font-semibold text-gray-900">
                {bnplOrder.shippingAddress.line1}
              </p>
              <p>{bnplOrder.shippingAddress.line2}</p>
              <p>
                {bnplOrder.shippingAddress.city},{" "}
                {bnplOrder.shippingAddress.country}
              </p>
            </div>
            <div className="pt-2 border-t border-gray-50 text-xs text-gray-500 flex justify-between">
              <span>Carrier</span>
              <strong className="text-gray-900">
                {bnplOrder.shippingMethod}
              </strong>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal for status changes */}
      <ConfirmationModal
        isOpen={isStatusConfirmOpen}
        onClose={() => setIsStatusConfirmOpen(false)}
        onConfirm={() => {
          if (pendingStatus) {
            setCurrentStatus(pendingStatus);
          }
          setIsStatusConfirmOpen(false);
        }}
        title="Update Order Status"
        message={`Are you sure you want to change order status to "${pendingStatus}"?`}
        confirmText="Confirm Status"
        type="info"
      />
    </div>
  );
}
