"use client";

import React, { useState } from "react";
import { Button } from "@/app/components/Button";
import { Modal, ModalBody } from "@/app/components/Modal";
import Link from "next/link";
import {
  HiOutlineExclamationTriangle,
  HiOutlineExclamationCircle,
  HiOutlineCheckCircle,
  HiOutlineXMark,
  HiOutlineArrowTopRightOnSquare,
} from "react-icons/hi2";

interface DiagnosticIssue {
  id: string;
  severity: "Warning" | "Critical";
  issue: string;
  suggestedFix: string;
  department: string;
  actionText: string;
  actionHref: string;
}

const initialIssues: DiagnosticIssue[] = [
  {
    id: "1",
    severity: "Warning",
    issue: "8280 Orphaned Products",
    suggestedFix:
      "Products found without a valid Vendor. Delete them or assign a vendor.",
    department: "Commercial Team",
    actionText: "Assign Vendor",
    actionHref: "/admin/products",
  },
  {
    id: "2",
    severity: "Warning",
    issue: "615 Active Products without Images",
    suggestedFix:
      "Products are live but have no images. Add images via Catalog.",
    department: "Commercial Team",
    actionText: "Update Images",
    actionHref: "/admin/products",
  },
  {
    id: "3",
    severity: "Critical",
    issue: "10 Active Vendors without Service Area",
    suggestedFix:
      "Vendors are active but have no service area defined. They cannot receive orders.",
    department: "Commercial Team",
    actionText: "Define Service Area",
    actionHref: "/admin/service-area",
  },
];

export default function ErrorAndHealthPage() {
  const [issues, setIssues] = useState<DiagnosticIssue[]>(initialIssues);
  const [selectedIssue, setSelectedIssue] = useState<DiagnosticIssue | null>(
    null,
  );
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleResolve = (issueId: string) => {
    const target = issues.find((i) => i.id === issueId);
    if (target) {
      setIssues((prev) => prev.filter((i) => i.id !== issueId));
      showToast(`Notification routed to ${target.department} for resolution.`);
      setSelectedIssue(null);
    }
  };

  return (
    <div className="flex flex-col gap-6 pb-12">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-8 z-50 bg-[#1D3557] text-white text-xs px-4 py-3 rounded-lg shadow-xl flex items-center gap-2 animate-in fade-in slide-in-from-top-2 duration-200">
          <HiOutlineCheckCircle className="w-4 h-4 text-[#00BCD4]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Container */}
      <div className="bg-white rounded-lg border border-gray-100 shadow-sm overflow-hidden">
        {/* Header section matching exact text */}
        <div className="p-6 border-b border-gray-100">
          <h1 className="text-xl font-black text-gray-900 tracking-tight">
            Diagnostic Results
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            The following table lists potential issues detected in the system
            configuration, database, or environment.
          </p>
        </div>

        {/* Table with EXACT requested headers:
            Severity | Issue | Suggested Fix | Department | Action */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-212.5">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                <th className="py-4 px-6 w-32">Severity</th>
                <th className="py-4 px-6">Issue</th>
                <th className="py-4 px-6">Suggested Fix</th>
                <th className="py-4 px-6">Department</th>
                <th className="py-4 px-6 text-right w-44">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-xs text-gray-700">
              {issues.length > 0 ? (
                issues.map((item) => {
                  const isCritical = item.severity === "Critical";

                  return (
                    <tr
                      key={item.id}
                      className="hover:bg-gray-50/60 transition-colors"
                    >
                      {/* 1. Severity */}
                      <td className="py-4 px-6 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold border ${
                            isCritical
                              ? "bg-rose-50 text-rose-700 border-rose-200"
                              : "bg-amber-50 text-amber-700 border-amber-200"
                          }`}
                        >
                          {isCritical ? (
                            <HiOutlineExclamationCircle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                          ) : (
                            <HiOutlineExclamationTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                          )}
                          <span>{item.severity}</span>
                        </span>
                      </td>

                      {/* 2. Issue */}
                      <td className="py-4 px-6 font-bold text-gray-900 whitespace-nowrap">
                        {item.issue}
                      </td>

                      {/* 3. Suggested Fix */}
                      <td className="py-4 px-6 text-gray-600 max-w-md leading-relaxed">
                        {item.suggestedFix}
                      </td>

                      {/* 4. Department */}
                      <td className="py-4 px-6 font-semibold text-gray-800 whitespace-nowrap">
                        <span className="px-2.5 py-1 rounded-md bg-gray-100 text-gray-700 text-[11px] font-bold">
                          {item.department}
                        </span>
                      </td>

                      {/* 5. Action */}
                      <td className="py-4 px-6 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={item.actionHref}
                            className="inline-flex items-center gap-1 text-xs font-bold text-brand-blue hover:text-[#00BCD4] px-2.5 py-1.5 rounded-lg hover:bg-brand-blue-light/40 transition-colors"
                          >
                            <span>{item.actionText}</span>
                            <HiOutlineArrowTopRightOnSquare className="w-3.5 h-3.5" />
                          </Link>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 px-3 text-xs font-semibold border-gray-200 text-gray-700 hover:bg-gray-50 rounded-lg cursor-pointer"
                            onClick={() => setSelectedIssue(item)}
                          >
                            Resolve
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td
                    colSpan={5}
                    className="py-12 text-center text-gray-400 text-xs"
                  >
                    <div className="flex flex-col items-center justify-center gap-2">
                      <HiOutlineCheckCircle className="w-8 h-8 text-emerald-500" />
                      <p className="font-bold text-gray-700">
                        All Diagnostics Clear
                      </p>
                      <p className="text-gray-400 text-[11px]">
                        No configuration, database, or environment anomalies
                        detected.
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Resolution Details Modal */}
      {selectedIssue && (
        <Modal isOpen={!!selectedIssue} onClose={() => setSelectedIssue(null)}>
          <ModalBody>
            <div className="space-y-4 pt-1">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                      selectedIssue.severity === "Critical"
                        ? "bg-rose-50 text-rose-600"
                        : "bg-amber-50 text-amber-600"
                    }`}
                  >
                    {selectedIssue.severity === "Critical" ? (
                      <HiOutlineExclamationCircle className="w-5 h-5" />
                    ) : (
                      <HiOutlineExclamationTriangle className="w-5 h-5" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-sm">
                      {selectedIssue.issue}
                    </h3>
                    <p className="text-[11px] text-gray-400">
                      Severity: {selectedIssue.severity} • Assigned:{" "}
                      {selectedIssue.department}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedIssue(null)}
                  className="p-1 text-gray-400 hover:text-gray-600 rounded-md cursor-pointer"
                >
                  <HiOutlineXMark className="w-4 h-4" />
                </button>
              </div>

              <div className="p-3.5 bg-gray-50 rounded-lg border border-gray-100 text-xs">
                <span className="font-bold text-gray-700 block mb-1">
                  Suggested Fix
                </span>
                <p className="text-gray-600 leading-relaxed">
                  {selectedIssue.suggestedFix}
                </p>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-gray-100">
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-lg text-xs"
                  onClick={() => setSelectedIssue(null)}
                >
                  Close
                </Button>
                <Link
                  href={selectedIssue.actionHref}
                  className="inline-flex items-center gap-1.5 h-8 px-3 text-xs font-semibold rounded-lg bg-[#00BCD4] hover:bg-[#00BCD4]/90 text-white transition-colors"
                >
                  <span>Open {selectedIssue.actionText}</span>
                  <HiOutlineArrowTopRightOnSquare className="w-3.5 h-3.5" />
                </Link>
                <Button
                  size="sm"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold"
                  onClick={() => handleResolve(selectedIssue.id)}
                >
                  Mark as Resolved
                </Button>
              </div>
            </div>
          </ModalBody>
        </Modal>
      )}
    </div>
  );
}
