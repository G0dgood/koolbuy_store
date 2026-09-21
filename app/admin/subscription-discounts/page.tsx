"use client";

import React, { useState, useMemo } from "react";
import { Icon } from "../../components/Icon";
import { Button } from "../../components/Button";
import { Input } from "../../components/Form/Inputs";
import { TabFilter } from "../../components/Admin/TabFilter";
import { Pagination } from "../../components/Admin/Pagination";
import { ConfirmationModal } from "@/app/components/Admin/ConfirmationModal";
import { RowsPerPage } from "@/app/components/rows-per-page";
import Checkbox from "@/app/components/Checkbox";
import { BulkActionsDrawer } from "../../components/Admin/BulkActionsDrawer";
import Modal from "../../components/Modal/Modal";
import ModalBody from "../../components/Modal/ModalBody";
import ModalFooter from "../../components/Modal/ModalFooter";
import Drawer from "../../components/Drawer/Drawer";
import { Select } from "../../components/Form/Select";

interface SubscriptionDiscount {
  id: string;
  code: string;
  planName: string;
  discount: string;
  billingCycle: string;
  tier: string;
  startDate: string;
  endDate: string;
  status: "Active" | "Scheduled" | "Expired" | "Inactive";
  subscribersCount: number;
}

const subscriptionDiscountsData: SubscriptionDiscount[] = [
  {
    id: "SUB-01",
    code: "ANNUAL-KOOL-20",
    planName: "Annual Commercial Freezer Maintenance",
    discount: "20%",
    billingCycle: "Annual",
    tier: "Enterprise & Business",
    startDate: "01-01-2025",
    endDate: "31-12-2025",
    status: "Active",
    subscribersCount: 840,
  },
  {
    id: "SUB-02",
    code: "SOLAR-VIP-15",
    planName: "Solar Inverter Quarterly Care Plan",
    discount: "15%",
    billingCycle: "Quarterly",
    tier: "Solar VIP Members",
    startDate: "01-02-2025",
    endDate: "31-12-2025",
    status: "Active",
    subscribersCount: 1250,
  },
  {
    id: "SUB-03",
    code: "FRESH-MEMBER-10",
    planName: "KoolBuy Fresh Club Subscription",
    discount: "10%",
    billingCycle: "Monthly",
    tier: "All Customers",
    startDate: "15-01-2025",
    endDate: "15-12-2025",
    status: "Active",
    subscribersCount: 2100,
  },
  {
    id: "SUB-04",
    code: "BATTERY-SHIELD-25",
    planName: "Battery Replacement Warranty Guard",
    discount: "25%",
    billingCycle: "Semi-Annual",
    tier: "Industrial Solar",
    startDate: "01-03-2025",
    endDate: "31-08-2025",
    status: "Active",
    subscribersCount: 430,
  },
  {
    id: "SUB-05",
    code: "SUMMER-SUB-FREE",
    planName: "Seasonal Routine Checkup Subscription",
    discount: "Free Month",
    billingCycle: "Annual",
    tier: "Early Birds",
    startDate: "01-06-2025",
    endDate: "31-08-2025",
    status: "Scheduled",
    subscribersCount: 0,
  },
  {
    id: "SUB-06",
    code: "LEGACY-FREEZER-5",
    planName: "Scanfrost Chest Freezer Support 2024",
    discount: "5%",
    billingCycle: "Quarterly",
    tier: "Legacy Tier",
    startDate: "01-01-2024",
    endDate: "31-12-2024",
    status: "Expired",
    subscribersCount: 310,
  },
];

const statusConfig: Record<string, string> = {
  Active: "text-blue-500 bg-brand-blue-light",
  Expired: "text-rose-500 bg-rose-50/50",
  Scheduled: "text-brand-blue bg-brand-blue-light",
  Inactive: "text-gray-500 bg-gray-100",
};

export default function SubscriptionDiscountListing() {
  const [discounts, setDiscounts] = useState<SubscriptionDiscount[]>(
    subscriptionDiscountsData,
  );
  const [activeTab, setActiveTab] = useState("All subscriptions");
  const [searchQuery, setSearchQuery] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [discountToDelete, setDiscountToDelete] =
    useState<SubscriptionDiscount | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false);
  const [discountToEdit, setDiscountToEdit] =
    useState<SubscriptionDiscount | null>(null);
  const [isMoreActionsOpen, setIsMoreActionsOpen] = useState(false);
  const [isBulkDeleteConfirmOpen, setIsBulkDeleteConfirmOpen] = useState(false);

  // Filter discounts
  const filteredDiscounts = useMemo(() => {
    return discounts.filter((d) => {
      // Tab filter
      const tab = activeTab.toLowerCase();
      let matchesTab = true;
      if (!tab.startsWith("all")) {
        if (tab.includes("active")) matchesTab = d.status === "Active";
        else if (tab.includes("inactive")) matchesTab = d.status === "Inactive";
        else if (tab.includes("expired")) matchesTab = d.status === "Expired";
      }

      // Search filter
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        d.code.toLowerCase().includes(q) ||
        d.planName.toLowerCase().includes(q) ||
        d.billingCycle.toLowerCase().includes(q) ||
        d.tier.toLowerCase().includes(q);

      return matchesTab && matchesSearch;
    });
  }, [discounts, activeTab, searchQuery]);

  const paginatedDiscounts = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return filteredDiscounts.slice(start, start + rowsPerPage);
  }, [filteredDiscounts, currentPage, rowsPerPage]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredDiscounts.length / rowsPerPage),
  );

  const toggleAll = () => {
    if (
      selectedIds.length === paginatedDiscounts.length &&
      paginatedDiscounts.length > 0
    ) {
      setSelectedIds([]);
    } else {
      setSelectedIds(paginatedDiscounts.map((d) => d.code));
    }
  };

  const toggleItem = (code: string) => {
    setSelectedIds((prev) =>
      prev.includes(code)
        ? prev.filter((item) => item !== code)
        : [...prev, code],
    );
  };

  return (
    <div className="flex flex-col gap-6 max-w-400 mx-auto pb-12">
      {/* Header Area */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Subscription Discounts
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Manage recurring discount codes, subscription cycles, and member
            loyalty incentives
          </p>
        </div>

        <div className="flex gap-3 w-full sm:w-auto">
          <Button
            variant="primary"
            shape="rounded-sm"
            className="flex-1 sm:flex-initial"
            iconLeft={
              <Icon name="circle-plus" folder="dashboardIcon" size="sm" />
            }
            onClick={() => setIsAddModalOpen(true)}
          >
            Add Subscription Discount
          </Button>
          <Button
            variant="outline"
            shape="rounded-sm"
            className="flex-1 sm:flex-initial"
            iconRight={
              <Icon
                name="DotsHorizontal"
                folder="dashboardIcon"
                size="sm"
                className="text-gray-400"
              />
            }
            onClick={() => setIsMoreActionsOpen(true)}
          >
            More Action
          </Button>
        </div>
      </div>

      {/* Main Filter & Table Card */}
      <div className="bg-white rounded-[6px] overflow-hidden flex flex-col border border-[#1C1C1C1A]">
        {/* Filter Controls Row */}
        <div className="p-4 sm:p-6 flex flex-col lg:flex-row gap-6 items-center justify-between border-b border-gray-50">
          <TabFilter
            tabs={["All subscriptions", "Active", "Inactive", "Expired"]}
            activeTab={activeTab}
            onChange={(tab) => {
              setActiveTab(tab);
              setCurrentPage(1);
            }}
            id={""}
          />

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
            <Input
              type="text"
              placeholder="Search subscription plan, code..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              containerClassName="w-full lg:w-80 xl:w-80"
              className="bg-white border-gray-100 placeholder:text-gray-400 text-sm font-medium"
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
              <RowsPerPage
                value={rowsPerPage}
                onChange={(val) => {
                  setRowsPerPage(val);
                  setCurrentPage(1);
                }}
              />

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

        {/* Table Area */}
        <div className="admin-table-container">
          <table>
            <thead>
              <tr>
                <th className="w-10">
                  <Checkbox
                    checked={
                      selectedIds.length === paginatedDiscounts.length &&
                      paginatedDiscounts.length > 0
                    }
                    onChange={toggleAll}
                  />
                </th>
                <th>Discount Code</th>
                <th>Plan Name</th>
                <th>Discount</th>
                <th>Billing Cycle</th>
                <th>Target Tier</th>
                <th>Subscribers</th>
                <th>Status</th>
                <th className="text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {paginatedDiscounts.length === 0 ? (
                <tr>
                  <td
                    colSpan={9}
                    className="text-center py-12 text-gray-400 font-medium text-sm"
                  >
                    No subscription discounts found.
                  </td>
                </tr>
              ) : (
                paginatedDiscounts.map((discount) => (
                  <tr
                    key={discount.code}
                    className="group hover:bg-gray-50/50 transition-colors"
                  >
                    <td>
                      <Checkbox
                        checked={selectedIds.includes(discount.code)}
                        onChange={() => toggleItem(discount.code)}
                      />
                    </td>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-brand-blue-light flex items-center justify-center shrink-0">
                          <Icon
                            name="arrow-refresh-06"
                            folder="dashboardIcon"
                            size="sm"
                            className="text-brand-blue"
                          />
                        </div>
                        <span className="text-xs font-bold text-[#1D3557] group-hover:text-blue-600 transition-colors">
                          {discount.code}
                        </span>
                      </div>
                    </td>
                    <td>
                      <span className="text-xs font-semibold text-gray-800">
                        {discount.planName}
                      </span>
                    </td>
                    <td className="font-bold text-brand-blue text-xs">
                      {discount.discount}
                    </td>
                    <td>
                      <span className="text-xs font-medium text-gray-600 bg-gray-100 px-2.5 py-1 rounded">
                        {discount.billingCycle}
                      </span>
                    </td>
                    <td className="text-xs text-gray-500 font-medium">
                      {discount.tier}
                    </td>
                    <td className="text-xs font-bold text-gray-900">
                      {discount.subscribersCount.toLocaleString()}
                    </td>
                    <td>
                      <span
                        className={`px-3 py-1.5 rounded-[6px] text-[10px] font-bold ${
                          statusConfig[discount.status] ||
                          "text-gray-500 bg-gray-100"
                        }`}
                      >
                        {discount.status}
                      </span>
                    </td>
                    <td className="text-right">
                      <div className="flex justify-end items-center gap-2">
                        <Button
                          variant="outline"
                          shape="rounded-sm"
                          className="p-1.5! text-gray-400 hover:text-blue-500 hover:bg-brand-blue-light transition-all"
                          onClick={() => {
                            setDiscountToEdit(discount);
                            setIsEditDrawerOpen(true);
                          }}
                          title="Edit discount"
                        >
                          <Icon
                            name="settings"
                            folder="dashboardIcon"
                            size="sm"
                          />
                        </Button>
                        <Button
                          variant="outline"
                          shape="rounded-sm"
                          className="p-1.5! text-gray-400 hover:text-rose-500 hover:bg-rose-50 transition-all"
                          onClick={() => setDiscountToDelete(discount)}
                          title="Delete discount"
                        >
                          <Icon
                            name="Delete"
                            folder="dashboardIcon"
                            size="sm"
                          />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Area */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={!!discountToDelete}
        onClose={() => setDiscountToDelete(null)}
        onConfirm={() => {
          if (discountToDelete) {
            setDiscounts((prev) =>
              prev.filter((d) => d.id !== discountToDelete.id),
            );
            setSelectedIds((prev) =>
              prev.filter((id) => id !== discountToDelete.code),
            );
            setDiscountToDelete(null);
          }
        }}
        title="Delete Subscription Discount"
        message={`Are you sure you want to delete subscription discount ${discountToDelete?.code}? Active subscribers on this discount will not be renewed with the discounted price.`}
        confirmText="Yes, delete discount"
        type="danger"
      />

      {/* Add Subscription Discount Modal */}
      <AddSubscriptionDiscountModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={(newDiscount) => {
          setDiscounts((prev) => [newDiscount, ...prev]);
          setIsAddModalOpen(false);
        }}
      />

      {/* Edit Subscription Discount Drawer */}
      <Drawer
        isOpen={isEditDrawerOpen}
        onClose={() => {
          setIsEditDrawerOpen(false);
          setDiscountToEdit(null);
        }}
        title="Edit Subscription Discount"
      >
        {discountToEdit && (
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-gray-500 uppercase">
                Discount Code
              </label>
              <Input value={discountToEdit.code} disabled />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-gray-500 uppercase">
                Plan Name
              </label>
              <Input
                value={discountToEdit.planName}
                onChange={(e) =>
                  setDiscountToEdit({
                    ...discountToEdit,
                    planName: e.target.value,
                  })
                }
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-gray-500 uppercase">
                Discount Value
              </label>
              <Input
                value={discountToEdit.discount}
                onChange={(e) =>
                  setDiscountToEdit({
                    ...discountToEdit,
                    discount: e.target.value,
                  })
                }
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-gray-500 uppercase">
                Billing Cycle
              </label>
              <Select
                value={discountToEdit.billingCycle}
                onChange={(val) =>
                  setDiscountToEdit({
                    ...discountToEdit,
                    billingCycle: val as string,
                  })
                }
                options={[
                  { label: "Monthly", value: "Monthly" },
                  { label: "Quarterly", value: "Quarterly" },
                  { label: "Semi-Annual", value: "Semi-Annual" },
                  { label: "Annual", value: "Annual" },
                ]}
              />
            </div>
            <div className="pt-4 flex gap-3">
              <Button
                variant="primary"
                className="flex-1"
                onClick={() => {
                  setDiscounts((prev) =>
                    prev.map((d) =>
                      d.id === discountToEdit.id ? discountToEdit : d,
                    ),
                  );
                  setIsEditDrawerOpen(false);
                  setDiscountToEdit(null);
                }}
              >
                Save Changes
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setIsEditDrawerOpen(false);
                  setDiscountToEdit(null);
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </Drawer>

      {/* Bulk Actions Drawer */}
      <BulkActionsDrawer
        isOpen={selectedIds.length > 0}
        onClose={() => setSelectedIds([])}
        selectedIds={selectedIds}
        items={discounts}
        onClearSelection={() => setSelectedIds([])}
        idProp="code"
        labelProp="code"
        title="Subscription Discounts Selected"
        actions={[
          {
            id: "export",
            title: "Export Selected",
            icon: "cloud_download",
            folder: "icon",
            onClick: () =>
              console.log("Exporting selected subscription discounts..."),
          },
          {
            id: "delete",
            title: "Delete All Selected",
            icon: "Delete",
            folder: "dashboardIcon",
            variant: "danger",
            onClick: () => setIsBulkDeleteConfirmOpen(true),
          },
        ]}
      />

      <ConfirmationModal
        isOpen={isBulkDeleteConfirmOpen}
        onClose={() => setIsBulkDeleteConfirmOpen(false)}
        onConfirm={() => {
          setDiscounts((prev) =>
            prev.filter((d) => !selectedIds.includes(d.code)),
          );
          setSelectedIds([]);
          setIsBulkDeleteConfirmOpen(false);
        }}
        title="Delete Selected Discounts"
        message={`Are you sure you want to permanently delete the ${selectedIds.length} selected subscription discounts?`}
        confirmText="Yes, delete selected"
        type="danger"
      />
    </div>
  );
}

function AddSubscriptionDiscountModal({
  isOpen,
  onClose,
  onAdd,
}: {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (discount: SubscriptionDiscount) => void;
}) {
  const [formData, setFormData] = useState({
    code: "",
    planName: "",
    discount: "",
    billingCycle: "Annual",
    tier: "All Customers",
    startDate: "01-01-2025",
    endDate: "31-12-2025",
    status: "Active" as const,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({
      id: `SUB-${Date.now()}`,
      ...formData,
      subscribersCount: 0,
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add Subscription Discount"
      size="lg"
    >
      <form onSubmit={handleSubmit}>
        <ModalBody className="flex flex-col gap-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-gray-500 uppercase">
                Discount Code
              </label>
              <Input
                placeholder="e.g. ANNUAL-SAVE-25"
                value={formData.code}
                onChange={(e) =>
                  setFormData({ ...formData, code: e.target.value })
                }
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-gray-500 uppercase">
                Discount Amount / %
              </label>
              <Input
                placeholder="e.g. 20% or ₦10,000"
                value={formData.discount}
                onChange={(e) =>
                  setFormData({ ...formData, discount: e.target.value })
                }
                required
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-gray-500 uppercase">
              Plan Name
            </label>
            <Input
              placeholder="e.g. Annual Commercial Maintenance Plan"
              value={formData.planName}
              onChange={(e) =>
                setFormData({ ...formData, planName: e.target.value })
              }
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-gray-500 uppercase">
                Billing Cycle
              </label>
              <Select
                value={formData.billingCycle}
                onChange={(val) =>
                  setFormData({ ...formData, billingCycle: val as string })
                }
                options={[
                  { label: "Monthly", value: "Monthly" },
                  { label: "Quarterly", value: "Quarterly" },
                  { label: "Semi-Annual", value: "Semi-Annual" },
                  { label: "Annual", value: "Annual" },
                ]}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-gray-500 uppercase">
                Target Tier
              </label>
              <Input
                placeholder="e.g. Solar VIP Members"
                value={formData.tier}
                onChange={(e) =>
                  setFormData({ ...formData, tier: e.target.value })
                }
              />
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button variant="outline" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" type="submit">
            Create Discount
          </Button>
        </ModalFooter>
      </form>
    </Modal>
  );
}
