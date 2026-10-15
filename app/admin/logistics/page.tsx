"use client";

import React, { useState, useMemo, useEffect, useCallback } from "react";
import Link from "next/link";
import { Icon } from "@/app/components/Icon";
import { Button } from "@/app/components/Button";
import { Input } from "@/app/components/Form/Inputs";
import { Search, Dropdown } from "@/app/components/Form";
import { Tabs } from "@/app/components/ui/Tabs";
import { Pagination } from "@/app/components/Admin/Pagination";
import { RowsPerPage } from "@/app/components/rows-per-page";
import Modal from "@/app/components/Modal/Modal";
import ModalBody from "@/app/components/Modal/ModalBody";
import ModalFooter from "@/app/components/Modal/ModalFooter";
import Drawer from "@/app/components/Drawer/Drawer";
import { normalizeApiBase } from "@/lib/api";

// ----------------------------------------------------
// Interfaces
// ----------------------------------------------------
export interface DroppingOrder {
  id: string;
  orderRef: string;
  customerName: string;
  customerPhone: string;
  destinationAddress: string;
  lga: string;
  state: string;
  dispatchHub: string;
  carrier: string;
  driverName: string;
  driverPhone: string;
  itemsSummary: string;
  itemType: "Heavy Freezer" | "Solar Kit" | "Ice Chest" | "Spare Parts";
  dropStatus:
  | "Ready for Drop"
  | "Dispatched"
  | "In Transit"
  | "Dropped Off"
  | "Failed Handover";
  dropDate: string;
  estimatedDelivery: string;
  notes?: string;
}

export interface VendorAddress {
  id: string;
  vendorName: string;
  vendorCode: string;
  contactPerson: string;
  contactPhone: string;
  contactEmail: string;
  warehouseAddress: string;
  lga: string;
  state: string;
  operatingHours: string;
  dockAccess: string;
  pickupNotes: string;
  verificationStatus: "Verified" | "Pending Audit" | "Inactive";
}

export interface LgaDeliveryPrice {
  id: string;
  lgaName: string;
  state: string;
  zone: "Zone 1 (Core Metro)" | "Zone 2 (Suburban)" | "Zone 3 (Outskirts)";
  standardDeliveryFee: number;
  heavyApplianceFee: number;
  estimatedTransitTime: string;
  hubAssigned: string;
  status: "Active" | "Restricted" | "Suspended";
}

const API_BASE = normalizeApiBase();

type ActiveTabType = "dropping-orders" | "vendor-addresses" | "delivery-prices";

export default function KoolLogisticsPage() {
  const [activeTab, setActiveTab] = useState<ActiveTabType>("dropping-orders");

  // State: Dropping Orders (Dynamic from backend API)
  const [droppingOrders, setDroppingOrders] = useState<DroppingOrder[]>([]);
  const [dropSearch, setDropSearch] = useState("");
  const [dropStatusFilter, setDropStatusFilter] = useState("all");
  const [dropHubFilter, setDropHubFilter] = useState("all");

  // State: Vendor Addresses (Dynamic from backend API)
  const [vendorAddresses, setVendorAddresses] = useState<VendorAddress[]>([]);
  const [vendorSearch, setVendorSearch] = useState("");
  const [vendorStateFilter, setVendorStateFilter] = useState("all");

  // State: Delivery Prices (Dynamic from backend API)
  const [lgaPrices, setLgaPrices] = useState<LgaDeliveryPrice[]>([]);
  const [lgaSearch, setLgaSearch] = useState("");
  const [lgaStateFilter, setLgaStateFilter] = useState("all");
  const [lgaZoneFilter, setLgaZoneFilter] = useState("all");

  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [dropsRes, vendorsRes, pricesRes] = await Promise.all([
        fetch(`${API_BASE}/logistics/admin/dropping-orders/`),
        fetch(`${API_BASE}/logistics/admin/vendor-addresses/`),
        fetch(`${API_BASE}/logistics/admin/delivery-prices/`),
      ]);
      if (dropsRes.ok) {
        const data = await dropsRes.json();
        if (Array.isArray(data.items)) setDroppingOrders(data.items);
      }
      if (vendorsRes.ok) {
        const data = await vendorsRes.json();
        if (Array.isArray(data.items)) setVendorAddresses(data.items);
      }
      if (pricesRes.ok) {
        const data = await pricesRes.json();
        if (Array.isArray(data.items)) setLgaPrices(data.items);
      }
    } catch (err) {
      console.error("Failed to load logistics data:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Modals & Drawers
  const [selectedDropOrder, setSelectedDropOrder] =
    useState<DroppingOrder | null>(null);
  const [isCreateDropModalOpen, setIsCreateDropModalOpen] = useState(false);
  const [isAddVendorModalOpen, setIsAddVendorModalOpen] = useState(false);
  const [isAddLgaModalOpen, setIsAddLgaModalOpen] = useState(false);
  const [editingLga, setEditingLga] = useState<LgaDeliveryPrice | null>(null);

  // Form: Create Drop Order
  const [newOrderRef, setNewOrderRef] = useState("");
  const [newCustName, setNewCustName] = useState("");
  const [newCustPhone, setNewCustPhone] = useState("");
  const [newAddress, setNewAddress] = useState("");
  const [newLga, setNewLga] = useState("Ikeja");
  const [newState, setNewState] = useState("Lagos");
  const [newCarrier, setNewCarrier] = useState("Kool Logistics Fleet");
  const [newItems, setNewItems] = useState("");
  const [newItemType, setNewItemType] =
    useState<DroppingOrder["itemType"]>("Heavy Freezer");

  // Form: Add Vendor Address
  const [newVenName, setNewVenName] = useState("");
  const [newVenCode, setNewVenCode] = useState("");
  const [newVenContact, setNewVenContact] = useState("");
  const [newVenPhone, setNewVenPhone] = useState("");
  const [newVenEmail, setNewVenEmail] = useState("");
  const [newVenAddress, setNewVenAddress] = useState("");
  const [newVenLga, setNewVenLga] = useState("Ikeja");
  const [newVenState, setNewVenState] = useState("Lagos");
  const [newVenHours, setNewVenHours] = useState(
    "Mon - Fri: 8:00 AM - 5:00 PM",
  );
  const [newVenDock, setNewVenDock] = useState("Loading Bay 1, Ground Level");

  // Form: LGA Price
  const [lgaNameInput, setLgaNameInput] = useState("");
  const [lgaStateInput, setLgaStateInput] = useState("Lagos");
  const [lgaZoneInput, setLgaZoneInput] = useState<LgaDeliveryPrice["zone"]>(
    "Zone 1 (Core Metro)",
  );
  const [stdFeeInput, setStdFeeInput] = useState("5000");
  const [heavyFeeInput, setHeavyFeeInput] = useState("12500");
  const [transitTimeInput, setTransitTimeInput] = useState("24 Hours");
  const [hubInput, setHubInput] = useState("Lagos Central Depot");

  // Filter: Dropping Orders
  const filteredDroppingOrders = useMemo(() => {
    return droppingOrders.filter((order) => {
      if (dropStatusFilter !== "all" && order.dropStatus !== dropStatusFilter)
        return false;
      if (dropHubFilter !== "all" && order.dispatchHub !== dropHubFilter)
        return false;

      if (dropSearch.trim()) {
        const q = dropSearch.toLowerCase();
        const matchesId = order.id.toLowerCase().includes(q);
        const matchesRef = order.orderRef.toLowerCase().includes(q);
        const matchesCust = order.customerName.toLowerCase().includes(q);
        const matchesPhone = order.customerPhone.includes(q);
        const matchesDriver = order.driverName.toLowerCase().includes(q);
        const matchesLga = order.lga.toLowerCase().includes(q);
        if (
          !matchesId &&
          !matchesRef &&
          !matchesCust &&
          !matchesPhone &&
          !matchesDriver &&
          !matchesLga
        ) {
          return false;
        }
      }
      return true;
    });
  }, [droppingOrders, dropStatusFilter, dropHubFilter, dropSearch]);

  // Filter: Vendor Addresses
  const filteredVendors = useMemo(() => {
    return vendorAddresses.filter((ven) => {
      if (vendorStateFilter !== "all" && ven.state !== vendorStateFilter)
        return false;

      if (vendorSearch.trim()) {
        const q = vendorSearch.toLowerCase();
        const matchesName = ven.vendorName.toLowerCase().includes(q);
        const matchesCode = ven.vendorCode.toLowerCase().includes(q);
        const matchesContact = ven.contactPerson.toLowerCase().includes(q);
        const matchesAddress = ven.warehouseAddress.toLowerCase().includes(q);
        const matchesLga = ven.lga.toLowerCase().includes(q);
        if (
          !matchesName &&
          !matchesCode &&
          !matchesContact &&
          !matchesAddress &&
          !matchesLga
        ) {
          return false;
        }
      }
      return true;
    });
  }, [vendorAddresses, vendorStateFilter, vendorSearch]);

  // Filter: LGA Prices
  const filteredLgaPrices = useMemo(() => {
    return lgaPrices.filter((lga) => {
      if (lgaStateFilter !== "all" && lga.state !== lgaStateFilter)
        return false;
      if (lgaZoneFilter !== "all" && lga.zone !== lgaZoneFilter) return false;

      if (lgaSearch.trim()) {
        const q = lgaSearch.toLowerCase();
        const matchesName = lga.lgaName.toLowerCase().includes(q);
        const matchesState = lga.state.toLowerCase().includes(q);
        const matchesHub = lga.hubAssigned.toLowerCase().includes(q);
        if (!matchesName && !matchesState && !matchesHub) return false;
      }
      return true;
    });
  }, [lgaPrices, lgaStateFilter, lgaZoneFilter, lgaSearch]);

  // Handle Tab Switch
  const handleTabChange = (tab: ActiveTabType) => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  // Create Dropping Order
  // Create Dropping Order
  const handleCreateDropOrder = async () => {
    if (!newOrderRef.trim() || !newCustName.trim()) {
      alert("Please enter Order Reference and Customer Name.");
      return;
    }
    setIsSubmitting(true);
    try {
      const res = await fetch(`${API_BASE}/logistics/admin/dropping-orders/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderRef: newOrderRef.trim(),
          customerName: newCustName.trim(),
          customerPhone: newCustPhone || "+234 800 000 0000",
          destinationAddress: newAddress || "Pending delivery address confirmation",
          lga: newLga,
          state: newState,
          dispatchHub: `${newState} Central Depot`,
          carrier: newCarrier,
          itemsSummary: newItems || "Standard Appliance Item",
          itemType: newItemType,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.item) {
          setDroppingOrders((prev) => [data.item, ...prev]);
        } else {
          fetchData();
        }
        setIsCreateDropModalOpen(false);
        setNewOrderRef("");
        setNewCustName("");
        setNewCustPhone("");
        setNewAddress("");
        setNewItems("");
      } else {
        const err = await res.json().catch(() => ({}));
        alert(err.error || "Failed to create dropping order");
      }
    } catch (e) {
      console.error(e);
      alert("Error creating dropping order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Add Vendor Address
  const handleAddVendor = async () => {
    if (!newVenName.trim()) {
      alert("Please provide Vendor Name.");
      return;
    }
    setIsSubmitting(true);
    try {
      const res = await fetch(`${API_BASE}/logistics/admin/vendor-addresses/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          vendorName: newVenName.trim(),
          vendorCode: newVenCode || undefined,
          contactPerson: newVenContact || "Logistics Manager",
          phone: newVenPhone || "+234 800 000 0000",
          contactPhone: newVenPhone || "+234 800 000 0000",
          email: newVenEmail || "logistics@vendor.ng",
          pickupAddress: newVenAddress || "Main Distribution Hub",
          warehouseAddress: newVenAddress || "Main Distribution Hub",
          lga: newVenLga,
          state: newVenState,
          operatingHours: newVenHours,
          dockAccess: newVenDock,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.item) {
          setVendorAddresses((prev) => [data.item, ...prev]);
        } else {
          fetchData();
        }
        setIsAddVendorModalOpen(false);
        setNewVenName("");
        setNewVenCode("");
        setNewVenContact("");
        setNewVenPhone("");
        setNewVenEmail("");
        setNewVenAddress("");
      } else {
        const err = await res.json().catch(() => ({}));
        alert(err.error || "Failed to add vendor address");
      }
    } catch (e) {
      console.error(e);
      alert("Error adding vendor address.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Save / Update LGA Price
  const handleSaveLgaPrice = async () => {
    if (!lgaNameInput.trim()) {
      alert("Please enter LGA Name.");
      return;
    }
    setIsSubmitting(true);
    try {
      if (editingLga) {
        const res = await fetch(`${API_BASE}/logistics/admin/delivery-prices/${editingLga.id}/`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            lgaName: lgaNameInput.trim(),
            state: lgaStateInput,
            zone: lgaZoneInput,
            standardPrice: Number(stdFeeInput) || 5000,
            standardDeliveryFee: Number(stdFeeInput) || 5000,
            heavyAppliancePrice: Number(heavyFeeInput) || 12000,
            heavyApplianceFee: Number(heavyFeeInput) || 12000,
            dispatchHub: hubInput,
            hubAssigned: hubInput,
            estimatedDays: transitTimeInput,
            estimatedTransitTime: transitTimeInput,
          }),
        });
        if (res.ok) {
          const data = await res.json();
          if (data.item) {
            setLgaPrices((prev) => prev.map((l) => (l.id === editingLga.id ? { ...l, ...data.item } : l)));
          } else {
            fetchData();
          }
          setEditingLga(null);
          setIsAddLgaModalOpen(false);
        } else {
          const err = await res.json().catch(() => ({}));
          alert(err.error || "Failed to update LGA delivery tariff");
        }
      } else {
        const res = await fetch(`${API_BASE}/logistics/admin/delivery-prices/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            lgaName: lgaNameInput.trim(),
            state: lgaStateInput,
            zone: lgaZoneInput,
            standardPrice: Number(stdFeeInput) || 5000,
            standardDeliveryFee: Number(stdFeeInput) || 5000,
            heavyAppliancePrice: Number(heavyFeeInput) || 12000,
            heavyApplianceFee: Number(heavyFeeInput) || 12000,
            dispatchHub: hubInput,
            hubAssigned: hubInput,
            estimatedDays: transitTimeInput,
            estimatedTransitTime: transitTimeInput,
          }),
        });
        if (res.ok) {
          const data = await res.json();
          if (data.item) {
            setLgaPrices((prev) => [data.item, ...prev]);
          } else {
            fetchData();
          }
          setIsAddLgaModalOpen(false);
        } else {
          const err = await res.json().catch(() => ({}));
          alert(err.error || "Failed to add LGA delivery tariff");
        }
      }
    } catch (e) {
      console.error(e);
      alert("Error saving LGA delivery price.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Open Edit LGA
  const openEditLgaModal = (lga: LgaDeliveryPrice) => {
    setEditingLga(lga);
    setLgaNameInput(lga.lgaName);
    setLgaStateInput(lga.state);
    setLgaZoneInput(lga.zone);
    setStdFeeInput(lga.standardDeliveryFee.toString());
    setHeavyFeeInput(lga.heavyApplianceFee.toString());
    setTransitTimeInput(lga.estimatedTransitTime);
    setHubInput(lga.hubAssigned);
    setIsAddLgaModalOpen(true);
  };

  // Open Add LGA
  const openAddLgaModal = () => {
    setEditingLga(null);
    setLgaNameInput("");
    setLgaStateInput("Lagos");
    setLgaZoneInput("Zone 1 (Core Metro)");
    setStdFeeInput("5000");
    setHeavyFeeInput("12500");
    setTransitTimeInput("24 Hours");
    setHubInput("Lagos Central Depot");
    setIsAddLgaModalOpen(true);
  };

  // Toggle Drop Order Status
  const handleUpdateDropStatus = async (
    id: string,
    nextStatus: DroppingOrder["dropStatus"],
  ) => {
    setDroppingOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, dropStatus: nextStatus } : o)),
    );
    if (selectedDropOrder && selectedDropOrder.id === id) {
      setSelectedDropOrder((prev) =>
        prev ? { ...prev, dropStatus: nextStatus } : null,
      );
    }
    try {
      await fetch(`${API_BASE}/logistics/admin/dropping-orders/${id}/status/`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      });
    } catch (err) {
      console.error("Failed to update status on server:", err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Tabs Switcher: Dropping Orders Management, Vendor addresses, delivery prices per lga */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex-1 min-w-0">
          <Tabs
            variant="segmented"
            tabs={[
              {
                id: "dropping-orders",
                label: "Dropping Orders Management",
                count: droppingOrders.length,
                icon: (
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    aria-hidden="true"
                  >
                    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                    <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                    <line x1="12" y1="22.08" x2="12" y2="12" />
                  </svg>
                ),
              },
              {
                id: "vendor-addresses",
                label: "Vendor addresses",
                count: vendorAddresses.length,
                icon: (
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    aria-hidden="true"
                  >
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                ),
              },
              {
                id: "delivery-prices",
                label: "delivery prices per lga",
                count: lgaPrices.length,
                icon: (
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    aria-hidden="true"
                  >
                    <line x1="12" y1="1" x2="12" y2="23" />
                    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                  </svg>
                ),
              },
            ]}
            activeTab={activeTab}
            onTabChange={(id) => handleTabChange(id as "dropping-orders" | "vendor-addresses" | "delivery-prices")}
            layoutId="logisticsTabsUnderline"
            className="border-b-0"
          />
        </div>

        <div className="flex items-center gap-2 pb-2 sm:pb-0 shrink-0">
          {activeTab === "dropping-orders" && (
            <button
              onClick={() => setIsCreateDropModalOpen(true)}
              className="px-3.5 py-2 rounded-xl text-xs font-bold bg-brand-charcoal text-white hover:bg-brand-charcoal/90 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Icon name="plus" className="w-3.5 h-3.5" />
              <span>New Dropping Order</span>
            </button>
          )}

          {activeTab === "vendor-addresses" && (
            <button
              onClick={() => setIsAddVendorModalOpen(true)}
              className="px-3.5 py-2 rounded-xl text-xs font-bold bg-brand-charcoal text-white hover:bg-brand-charcoal/90 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Icon name="plus" className="w-3.5 h-3.5" />
              <span>Add Vendor Address</span>
            </button>
          )}

          {activeTab === "delivery-prices" && (
            <button
              onClick={openAddLgaModal}
              className="px-3.5 py-2 rounded-xl text-xs font-bold bg-brand-charcoal text-white hover:bg-brand-charcoal/90 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Icon name="plus" className="w-3.5 h-3.5" />
              <span>Add LGA Price</span>
            </button>
          )}
        </div>
      </div>

      {/* ===================================================================== */}
      {/* TAB 1: DROPPING ORDERS MANAGEMENT                                    */}
      {/* ===================================================================== */}
      {activeTab === "dropping-orders" && (
        <div className="space-y-4">
          {/* Filters Bar */}
          <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="lg:col-span-2">
                <Search
                  placeholder="Search Drop ID, Order Ref, Customer, Driver, LGA..."
                  value={dropSearch}
                  onChange={setDropSearch}
                  maxWidth="100%"
                  className="w-full"
                  showClearButton
                />
              </div>

              <div>
                <Dropdown
                  options={[
                    { label: "All Drop Statuses", value: "all" },
                    { label: "Ready for Drop", value: "Ready for Drop" },
                    { label: "Dispatched", value: "Dispatched" },
                    { label: "In Transit", value: "In Transit" },
                    { label: "Dropped Off", value: "Dropped Off" },
                    { label: "Failed Handover", value: "Failed Handover" },
                  ]}
                  value={dropStatusFilter}
                  onChange={(val) => setDropStatusFilter(val as string)}
                  searchable={true}
                  searchPlaceholder="Search drop status..."
                  placeholder="All Drop Statuses"
                />
              </div>

              <div>
                <Dropdown
                  options={[
                    { label: "All Logistics Hubs", value: "all" },
                    {
                      label: "Lagos Island Hub (Lekki)",
                      value: "Lagos Island Hub (Lekki)",
                    },
                    {
                      label: "Lagos Mainland Depot (Ikeja)",
                      value: "Lagos Mainland Depot (Ikeja)",
                    },
                    {
                      label: "Abuja Regional Center",
                      value: "Abuja Regional Center",
                    },
                    { label: "Port Harcourt Hub", value: "Port Harcourt Hub" },
                    {
                      label: "Ibadan Central Depot",
                      value: "Ibadan Central Depot",
                    },
                  ]}
                  value={dropHubFilter}
                  onChange={(val) => setDropHubFilter(val as string)}
                  searchable={true}
                  searchPlaceholder="Search logistics hub..."
                  placeholder="All Logistics Hubs"
                />
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-gray-900 text-sm">
                  Dropping Orders Queue
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 text-xs font-bold">
                  {filteredDroppingOrders.length} records
                </span>
              </div>

              <RowsPerPage
                value={pageSize}
                onChange={(val) => {
                  setPageSize(val);
                  setCurrentPage(1);
                }}
              />
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-gray-700">
                <thead className="bg-gray-50/75 border-b border-gray-200 text-gray-500 uppercase tracking-wider font-semibold">
                  <tr>
                    <th className="py-3.5 px-4">Drop ID & Order</th>
                    <th className="py-3.5 px-4">Customer & Phone</th>
                    <th className="py-3.5 px-4">Destination & LGA</th>
                    <th className="py-3.5 px-4">Carrier & Driver</th>
                    <th className="py-3.5 px-4">Items / Payload</th>
                    <th className="py-3.5 px-4">Scheduled Drop</th>
                    <th className="py-3.5 px-4 whitespace-nowrap">Drop Status</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredDroppingOrders.length === 0 ? (
                    <tr>
                      <td
                        colSpan={8}
                        className="py-12 text-center text-gray-400"
                      >
                        <p className="font-bold text-gray-700 text-sm">
                          No dropping orders found
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          Try resetting the search or filter.
                        </p>
                      </td>
                    </tr>
                  ) : (
                    filteredDroppingOrders.map((order) => (
                      <tr
                        key={order.id}
                        className="hover:bg-brand-orange-soft/20 transition-colors cursor-pointer"
                        onClick={() => setSelectedDropOrder(order)}
                      >
                        <td className="py-3.5 px-4">
                          <div className="font-mono font-bold text-gray-900">
                            {order.id}
                          </div>
                          <div className="text-[11px] text-brand-orange-text font-medium">
                            {order.orderRef}
                          </div>
                        </td>

                        <td className="py-3.5 px-4">
                          <div className="font-bold text-gray-900">
                            {order.customerName}
                          </div>
                          <div className="text-[11px] text-gray-500 font-mono">
                            {order.customerPhone}
                          </div>
                        </td>

                        <td className="py-3.5 px-4">
                          <div
                            className="text-gray-900 font-medium line-clamp-1 max-w-xs"
                            title={order.destinationAddress}
                          >
                            {order.destinationAddress}
                          </div>
                          <div className="text-[11px] text-gray-500">
                            {order.lga}, {order.state}
                          </div>
                        </td>

                        <td className="py-3.5 px-4">
                          <div className="font-medium text-gray-900">
                            {order.carrier}
                          </div>
                          <div className="text-[11px] text-gray-500">
                            Driver: {order.driverName}
                          </div>
                        </td>

                        <td className="py-3.5 px-4">
                          <div className="font-medium text-gray-900">
                            {order.itemsSummary}
                          </div>
                          <span className="inline-block mt-0.5 text-[11px] font-semibold bg-gray-100 px-1.5 py-0.2 rounded text-gray-600">
                            {order.itemType}
                          </span>
                        </td>

                        <td className="py-3.5 px-4">
                          <div className="text-gray-900 font-medium">
                            {order.dropDate}
                          </div>
                          <div className="text-[11px] text-gray-400">
                            {order.estimatedDelivery.split(" ")[1]}
                          </div>
                        </td>

                        <td className="py-3.5 px-4 whitespace-nowrap">
                          {order.dropStatus === "Ready for Drop" && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                              READY FOR DROP
                            </span>
                          )}
                          {order.dropStatus === "Dispatched" && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-brand-orange-soft text-brand-charcoal border border-brand-orange/30">
                              DISPATCHED
                            </span>
                          )}
                          {order.dropStatus === "In Transit" && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-purple-100 text-purple-800 border border-purple-200 animate-pulse">
                              IN TRANSIT
                            </span>
                          )}
                          {order.dropStatus === "Dropped Off" && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                              DROPPED OFF
                            </span>
                          )}
                          {order.dropStatus === "Failed Handover" && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-rose-100 text-rose-800 border border-rose-200">
                              FAILED
                            </span>
                          )}
                        </td>

                        <td className="py-3.5 px-4 text-right">
                          <div
                            className="flex items-center justify-end gap-1.5"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <button
                              onClick={() => setSelectedDropOrder(order)}
                              className="px-2.5 py-1 rounded-lg text-xs font-bold text-brand-orange-text hover:text-brand-charcoal hover:bg-brand-orange-soft transition-colors"
                            >
                              Details
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* TAB 2: VENDOR ADDRESSES                                               */}
      {/* ===================================================================== */}
      {activeTab === "vendor-addresses" && (
        <div className="space-y-4">
          {/* Filters Bar */}
          <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="lg:col-span-3">
                <Search
                  placeholder="Search vendor name, contact person, address, LGA..."
                  value={vendorSearch}
                  onChange={setVendorSearch}
                  maxWidth="100%"
                  className="w-full"
                  showClearButton
                />
              </div>

              <div>
                <Dropdown
                  options={[
                    { label: "All States", value: "all" },
                    { label: "Lagos", value: "Lagos" },
                    { label: "FCT Abuja", value: "FCT Abuja" },
                    { label: "Rivers", value: "Rivers" },
                    { label: "Kano", value: "Kano" },
                    { label: "Delta", value: "Delta" },
                  ]}
                  value={vendorStateFilter}
                  onChange={(val) => setVendorStateFilter(val as string)}
                  searchable={true}
                  searchPlaceholder="Search state..."
                  placeholder="All States"
                />
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-gray-900 text-sm">
                  Vendor Pickup Locations
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 text-xs font-bold">
                  {filteredVendors.length} warehouses
                </span>
              </div>

              <RowsPerPage
                value={pageSize}
                onChange={(val) => {
                  setPageSize(val);
                  setCurrentPage(1);
                }}
              />
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-gray-700">
                <thead className="bg-gray-50/75 border-b border-gray-200 text-gray-500 uppercase tracking-wider font-semibold">
                  <tr>
                    <th className="py-3.5 px-4">Vendor & Code</th>
                    <th className="py-3.5 px-4">Contact Person</th>
                    <th className="py-3.5 px-4">Warehouse Address & LGA</th>
                    <th className="py-3.5 px-4">Operating Hours</th>
                    <th className="py-3.5 px-4">Dock & Access Notes</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredVendors.length === 0 ? (
                    <tr>
                      <td
                        colSpan={7}
                        className="py-12 text-center text-gray-400"
                      >
                        <p className="font-bold text-gray-700 text-sm">
                          No vendor addresses found
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          Try resetting the search or state filter.
                        </p>
                      </td>
                    </tr>
                  ) : (
                    filteredVendors.map((ven) => (
                      <tr
                        key={ven.id}
                        className="hover:bg-brand-orange-soft/20 transition-colors"
                      >
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-gray-900">
                            {ven.vendorName}
                          </div>
                          <div className="text-[11px] font-mono text-gray-400">
                            {ven.vendorCode}
                          </div>
                        </td>

                        <td className="py-3.5 px-4">
                          <div className="font-medium text-gray-900">
                            {ven.contactPerson}
                          </div>
                          <div className="text-[11px] text-gray-500 font-mono">
                            {ven.contactPhone}
                          </div>
                        </td>

                        <td className="py-3.5 px-4">
                          <div className="text-gray-900 font-medium line-clamp-1 max-w-xs">
                            {ven.warehouseAddress}
                          </div>
                          <div className="text-[11px] text-gray-500">
                            {ven.lga}, {ven.state}
                          </div>
                        </td>

                        <td className="py-3.5 px-4 font-medium text-gray-800">
                          {ven.operatingHours}
                        </td>

                        <td className="py-3.5 px-4">
                          <div className="text-gray-700 text-[11px] line-clamp-2 max-w-xs">
                            {ven.dockAccess}
                          </div>
                        </td>

                        <td className="py-3.5 px-4">
                          {ven.verificationStatus === "Verified" ? (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                              Verified
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                              Pending Audit
                            </span>
                          )}
                        </td>

                        <td className="py-3.5 px-4 text-right">
                          <button
                            onClick={() =>
                              alert(
                                `Address: ${ven.warehouseAddress}, ${ven.lga}, ${ven.state}\nContact: ${ven.contactPerson} (${ven.contactPhone})`,
                              )
                            }
                            className="px-2.5 py-1 rounded-lg text-xs font-bold text-brand-orange-text hover:text-brand-charcoal hover:bg-brand-orange-soft transition-colors"
                          >
                            View Card
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* TAB 3: DELIVERY PRICES PER LGA                                        */}
      {/* ===================================================================== */}
      {activeTab === "delivery-prices" && (
        <div className="space-y-4">
          {/* Filters Bar */}
          <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="lg:col-span-2">
                <Search
                  placeholder="Search LGA name, State, Hub..."
                  value={lgaSearch}
                  onChange={setLgaSearch}
                  maxWidth="100%"
                  className="w-full"
                  showClearButton
                />
              </div>

              <div>
                <Dropdown
                  options={[
                    { label: "All States", value: "all" },
                    { label: "Lagos", value: "Lagos" },
                    { label: "FCT Abuja", value: "FCT Abuja" },
                    { label: "Rivers", value: "Rivers" },
                    { label: "Oyo", value: "Oyo" },
                    { label: "Kano", value: "Kano" },
                  ]}
                  value={lgaStateFilter}
                  onChange={(val) => setLgaStateFilter(val as string)}
                  searchable={true}
                  searchPlaceholder="Search state..."
                  placeholder="All States"
                />
              </div>

              <div>
                <Dropdown
                  options={[
                    { label: "All Zones", value: "all" },
                    {
                      label: "Zone 1 (Core Metro)",
                      value: "Zone 1 (Core Metro)",
                    },
                    { label: "Zone 2 (Suburban)", value: "Zone 2 (Suburban)" },
                    {
                      label: "Zone 3 (Outskirts)",
                      value: "Zone 3 (Outskirts)",
                    },
                  ]}
                  value={lgaZoneFilter}
                  onChange={(val) => setLgaZoneFilter(val as string)}
                  searchable={true}
                  searchPlaceholder="Search zone..."
                  placeholder="All Zones"
                />
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-gray-900 text-sm">
                  LGA Delivery Pricing Tariff
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 text-xs font-bold">
                  {filteredLgaPrices.length} LGAs
                </span>
              </div>

              <RowsPerPage
                value={pageSize}
                onChange={(val) => {
                  setPageSize(val);
                  setCurrentPage(1);
                }}
              />
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-gray-700">
                <thead className="bg-gray-50/75 border-b border-gray-200 text-gray-500 uppercase tracking-wider font-semibold">
                  <tr>
                    <th className="py-3.5 px-4">Local Government Area (LGA)</th>
                    <th className="py-3.5 px-4">State & Zone</th>
                    <th className="py-3.5 px-4">Standard Delivery</th>
                    <th className="py-3.5 px-4">Heavy Solar Appliance</th>
                    <th className="py-3.5 px-4">Estimated Transit SLA</th>
                    <th className="py-3.5 px-4">Assigned Dispatch Hub</th>
                    <th className="py-3.5 px-4">Service Status</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredLgaPrices.length === 0 ? (
                    <tr>
                      <td
                        colSpan={8}
                        className="py-12 text-center text-gray-400"
                      >
                        <p className="font-bold text-gray-700 text-sm">
                          No LGA delivery rates found
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          Try resetting your state or zone filter.
                        </p>
                      </td>
                    </tr>
                  ) : (
                    filteredLgaPrices.map((lga) => (
                      <tr
                        key={lga.id}
                        className="hover:bg-brand-orange-soft/20 transition-colors"
                      >
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-gray-900 text-[13px]">
                            {lga.lgaName}
                          </div>
                          <div className="text-[11px] text-gray-400">
                            {lga.id}
                          </div>
                        </td>

                        <td className="py-3.5 px-4">
                          <div className="font-medium text-gray-900">
                            {lga.state}
                          </div>
                          <span className="inline-block mt-0.5 text-[11px] font-semibold bg-slate-100 px-1.5 py-0.2 rounded text-slate-700">
                            {lga.zone}
                          </span>
                        </td>

                        <td className="py-3.5 px-4 font-mono font-bold text-gray-900">
                          ₦{lga.standardDeliveryFee.toLocaleString()}
                        </td>

                        <td className="py-3.5 px-4 font-mono font-bold text-brand-orange-text">
                          ₦{lga.heavyApplianceFee.toLocaleString()}
                        </td>

                        <td className="py-3.5 px-4 font-medium text-gray-700">
                          {lga.estimatedTransitTime}
                        </td>

                        <td className="py-3.5 px-4 text-gray-700">
                          {lga.hubAssigned}
                        </td>

                        <td className="py-3.5 px-4">
                          {lga.status === "Active" ? (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                              Active
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                              Restricted
                            </span>
                          )}
                        </td>

                        <td className="py-3.5 px-4 text-right">
                          <button
                            onClick={() => openEditLgaModal(lga)}
                            className="px-2.5 py-1 rounded-lg text-xs font-bold text-brand-orange-text hover:text-brand-charcoal hover:bg-brand-orange-soft transition-colors"
                          >
                            Edit Rate
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* DRAWER: DROPPING ORDER INSPECTOR                                      */}
      {/* ===================================================================== */}
      {selectedDropOrder && (
        <Drawer
          isOpen={!!selectedDropOrder}
          onClose={() => setSelectedDropOrder(null)}
          title={`Dropping Order Details: ${selectedDropOrder.id}`}
          width="max-w-xl"
        >
          <div className="space-y-6">
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-mono text-sm font-bold text-gray-900">
                  {selectedDropOrder.id}
                </span>
                <span className="text-xs font-bold text-brand-orange-text">
                  Order Ref: {selectedDropOrder.orderRef}
                </span>
              </div>
              <div className="text-xs text-gray-600 pt-2 border-t border-gray-200 space-y-1">
                <div>
                  Customer:{" "}
                  <span className="font-bold text-gray-900">
                    {selectedDropOrder.customerName}
                  </span>
                </div>
                <div>
                  Phone:{" "}
                  <span className="font-mono text-gray-900">
                    {selectedDropOrder.customerPhone}
                  </span>
                </div>
                <div>
                  Destination:{" "}
                  <span className="font-medium text-gray-900">
                    {selectedDropOrder.destinationAddress},{" "}
                    {selectedDropOrder.lga}, {selectedDropOrder.state}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">
                Update Fulfillment Status
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {(
                  [
                    "Ready for Drop",
                    "Dispatched",
                    "In Transit",
                    "Dropped Off",
                    "Failed Handover",
                  ] as const
                ).map((st) => (
                  <button
                    key={st}
                    onClick={() =>
                      handleUpdateDropStatus(selectedDropOrder.id, st)
                    }
                    className={`p-2.5 rounded-xl border text-xs font-bold transition-all text-center ${selectedDropOrder.dropStatus === st
                        ? "border-brand-orange bg-brand-orange-soft text-brand-charcoal "
                        : "border-gray-200 text-gray-600 hover:bg-gray-50"
                      }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-gray-200 text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-500">Dispatch Hub:</span>
                <span className="font-bold text-gray-800">
                  {selectedDropOrder.dispatchHub}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Assigned Carrier:</span>
                <span className="font-bold text-gray-800">
                  {selectedDropOrder.carrier}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Courier Driver:</span>
                <span className="font-bold text-gray-800">
                  {selectedDropOrder.driverName} (
                  {selectedDropOrder.driverPhone})
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Package Payload:</span>
                <span className="font-bold text-gray-800">
                  {selectedDropOrder.itemsSummary}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Estimated Delivery:</span>
                <span className="font-bold text-gray-800">
                  {selectedDropOrder.estimatedDelivery}
                </span>
              </div>
              {selectedDropOrder.notes && (
                <div className="pt-2 border-t border-gray-100 text-gray-500 italic">
                  Note: {selectedDropOrder.notes}
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-gray-200 flex items-center justify-between">
              <button
                onClick={() =>
                  alert(`Waybill slip generated for ${selectedDropOrder.id}`)
                }
                className="text-xs font-bold text-brand-orange-text hover:text-brand-charcoal"
              >
                Print Waybill Slip
              </button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedDropOrder(null)}
              >
                Close Drawer
              </Button>
            </div>
          </div>
        </Drawer>
      )}

      {/* ===================================================================== */}
      {/* MODAL: CREATE DROPPING ORDER                                          */}
      {/* ===================================================================== */}
      <Modal
        isOpen={isCreateDropModalOpen}
        onClose={() => setIsCreateDropModalOpen(false)}
      >
        <ModalBody>
          <div className="space-y-4 pt-2">
            <div className="w-12 h-12 rounded-lg bg-brand-orange-soft text-brand-orange-text flex items-center justify-center mx-auto">
              <Icon name="plus" className="w-6 h-6" />
            </div>
            <div className="text-center">
              <h3 className="text-lg font-bold text-gray-900">
                Create Dropping Order
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                Dispatch an order payload through the Kool Logistics dropping
                hub network.
              </p>
            </div>

            <div className="space-y-3 pt-2">
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">
                  Order Reference
                </label>
                <Input
                  type="text"
                  placeholder="e.g. ORD-2026-9020"
                  value={newOrderRef}
                  onChange={(e) => setNewOrderRef(e.target.value)}
                  className="w-full text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">
                    Customer Name
                  </label>
                  <Input
                    type="text"
                    placeholder="Full name"
                    value={newCustName}
                    onChange={(e) => setNewCustName(e.target.value)}
                    className="w-full text-xs"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">
                    Customer Phone
                  </label>
                  <Input
                    type="text"
                    placeholder="+234..."
                    value={newCustPhone}
                    onChange={(e) => setNewCustPhone(e.target.value)}
                    className="w-full text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">
                  Destination Address
                </label>
                <Input
                  type="text"
                  placeholder="Street delivery address..."
                  value={newAddress}
                  onChange={(e) => setNewAddress(e.target.value)}
                  className="w-full text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">
                    State
                  </label>
                  <Dropdown
                    options={[
                      { label: "Lagos", value: "Lagos" },
                      { label: "FCT Abuja", value: "FCT Abuja" },
                      { label: "Rivers", value: "Rivers" },
                      { label: "Oyo", value: "Oyo" },
                      { label: "Kano", value: "Kano" },
                    ]}
                    value={newState}
                    onChange={(val) => setNewState(val as string)}
                    searchable={true}
                    searchPlaceholder="Search state..."
                    placeholder="Select state"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">
                    LGA
                  </label>
                  <Input
                    type="text"
                    placeholder="e.g. Ikeja, Eti-Osa..."
                    value={newLga}
                    onChange={(e) => setNewLga(e.target.value)}
                    className="w-full text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">
                  Item Details
                </label>
                <Input
                  type="text"
                  placeholder="e.g. Koolboks Solar Freezer 210L"
                  value={newItems}
                  onChange={(e) => setNewItems(e.target.value)}
                  className="w-full text-xs"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">
                  Carrier Fleet
                </label>
                <Dropdown
                  options={[
                    {
                      label: "Kool Logistics Van #01",
                      value: "Kool Logistics Van #01",
                    },
                    {
                      label: "Kool Logistics Van #02",
                      value: "Kool Logistics Van #02",
                    },
                    {
                      label: "GIG Logistics Express",
                      value: "GIG Logistics Express",
                    },
                    { label: "Red Star Express", value: "Red Star Express" },
                  ]}
                  value={newCarrier}
                  onChange={(val) => setNewCarrier(val as string)}
                  searchable={true}
                  searchPlaceholder="Search carrier..."
                  placeholder="Select carrier fleet"
                />
              </div>
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <div className="flex items-center justify-end gap-2 w-full">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsCreateDropModalOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={handleCreateDropOrder}>
              Stage Dropping Order
            </Button>
          </div>
        </ModalFooter>
      </Modal>

      {/* ===================================================================== */}
      {/* MODAL: ADD VENDOR ADDRESS                                             */}
      {/* ===================================================================== */}
      <Modal
        isOpen={isAddVendorModalOpen}
        onClose={() => setIsAddVendorModalOpen(false)}
      >
        <ModalBody>
          <div className="space-y-4 pt-2">
            <div className="w-12 h-12 rounded-lg bg-brand-orange-soft text-brand-orange-text flex items-center justify-center mx-auto">
              <Icon name="plus" className="w-6 h-6" />
            </div>
            <div className="text-center">
              <h3 className="text-lg font-bold text-gray-900">
                Add Vendor Pickup Address
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                Register a verified merchant warehouse location for pickup
                routing.
              </p>
            </div>

            <div className="space-y-3 pt-2">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">
                    Vendor Name
                  </label>
                  <Input
                    type="text"
                    placeholder="Merchant enterprise..."
                    value={newVenName}
                    onChange={(e) => setNewVenName(e.target.value)}
                    className="w-full text-xs"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">
                    Vendor Code
                  </label>
                  <Input
                    type="text"
                    placeholder="VEN-..."
                    value={newVenCode}
                    onChange={(e) => setNewVenCode(e.target.value)}
                    className="w-full text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">
                    Contact Person
                  </label>
                  <Input
                    type="text"
                    placeholder="Manager name"
                    value={newVenContact}
                    onChange={(e) => setNewVenContact(e.target.value)}
                    className="w-full text-xs"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">
                    Contact Phone
                  </label>
                  <Input
                    type="text"
                    placeholder="+234..."
                    value={newVenPhone}
                    onChange={(e) => setNewVenPhone(e.target.value)}
                    className="w-full text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">
                  Warehouse Address
                </label>
                <Input
                  type="text"
                  placeholder="Street and building number..."
                  value={newVenAddress}
                  onChange={(e) => setNewVenAddress(e.target.value)}
                  className="w-full text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">
                    State
                  </label>
                  <Dropdown
                    options={[
                      { label: "Lagos", value: "Lagos" },
                      { label: "FCT Abuja", value: "FCT Abuja" },
                      { label: "Rivers", value: "Rivers" },
                      { label: "Oyo", value: "Oyo" },
                      { label: "Kano", value: "Kano" },
                    ]}
                    value={newVenState}
                    onChange={(val) => setNewVenState(val as string)}
                    searchable={true}
                    searchPlaceholder="Search state..."
                    placeholder="Select state"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">
                    LGA
                  </label>
                  <Input
                    type="text"
                    placeholder="LGA..."
                    value={newVenLga}
                    onChange={(e) => setNewVenLga(e.target.value)}
                    className="w-full text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">
                  Dock Access & Forklift Specs
                </label>
                <Input
                  type="text"
                  placeholder="e.g. Loading Bay 2, 40ft truck accessible, Forklift available"
                  value={newVenDock}
                  onChange={(e) => setNewVenDock(e.target.value)}
                  className="w-full text-xs"
                />
              </div>
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <div className="flex items-center justify-end gap-2 w-full">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsAddVendorModalOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={handleAddVendor}>
              Save Vendor Address
            </Button>
          </div>
        </ModalFooter>
      </Modal>

      {/* ===================================================================== */}
      {/* MODAL: ADD / EDIT LGA PRICE                                           */}
      {/* ===================================================================== */}
      <Modal
        isOpen={isAddLgaModalOpen}
        onClose={() => setIsAddLgaModalOpen(false)}
      >
        <ModalBody>
          <div className="space-y-4 pt-2">
            <div className="w-12 h-12 rounded-lg bg-brand-orange-soft text-brand-orange-text flex items-center justify-center mx-auto">
              <Icon name="settings" className="w-6 h-6" />
            </div>
            <div className="text-center">
              <h3 className="text-lg font-bold text-gray-900">
                {editingLga
                  ? `Edit LGA Delivery Rate: ${editingLga.lgaName}`
                  : "Add LGA Delivery Pricing Rate"}
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                Configure standard and heavy solar appliance tariffs by Local
                Government Area.
              </p>
            </div>

            <div className="space-y-3 pt-2">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">
                    LGA Name
                  </label>
                  <Input
                    type="text"
                    placeholder="e.g. Alimosho, Ikeja..."
                    value={lgaNameInput}
                    onChange={(e) => setLgaNameInput(e.target.value)}
                    className="w-full text-xs"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">
                    State
                  </label>
                  <Dropdown
                    options={[
                      { label: "Lagos", value: "Lagos" },
                      { label: "FCT Abuja", value: "FCT Abuja" },
                      { label: "Rivers", value: "Rivers" },
                      { label: "Oyo", value: "Oyo" },
                      { label: "Kano", value: "Kano" },
                    ]}
                    value={lgaStateInput}
                    onChange={(val) => setLgaStateInput(val as string)}
                    searchable={true}
                    searchPlaceholder="Search state..."
                    placeholder="Select state"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">
                  Logistics Zone
                </label>
                <Dropdown
                  options={[
                    {
                      label: "Zone 1 (Core Metro)",
                      value: "Zone 1 (Core Metro)",
                    },
                    { label: "Zone 2 (Suburban)", value: "Zone 2 (Suburban)" },
                    {
                      label: "Zone 3 (Outskirts)",
                      value: "Zone 3 (Outskirts)",
                    },
                  ]}
                  value={lgaZoneInput}
                  onChange={(val) => setLgaZoneInput(val as any)}
                  searchable={true}
                  searchPlaceholder="Search zone..."
                  placeholder="Select zone"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">
                    Standard Item Fee (₦)
                  </label>
                  <Input
                    type="number"
                    placeholder="5000"
                    value={stdFeeInput}
                    onChange={(e) => setStdFeeInput(e.target.value)}
                    className="w-full text-xs"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">
                    Heavy Freezer Fee (₦)
                  </label>
                  <Input
                    type="number"
                    placeholder="12000"
                    value={heavyFeeInput}
                    onChange={(e) => setHeavyFeeInput(e.target.value)}
                    className="w-full text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">
                  Estimated Transit SLA
                </label>
                <Input
                  type="text"
                  placeholder="e.g. 24 Hours, 24 - 48 Hours"
                  value={transitTimeInput}
                  onChange={(e) => setTransitTimeInput(e.target.value)}
                  className="w-full text-xs"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">
                  Assigned Dispatch Hub
                </label>
                <Input
                  type="text"
                  placeholder="e.g. Lagos Central Hub"
                  value={hubInput}
                  onChange={(e) => setHubInput(e.target.value)}
                  className="w-full text-xs"
                />
              </div>
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <div className="flex items-center justify-end gap-2 w-full">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsAddLgaModalOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={handleSaveLgaPrice}>
              {editingLga ? "Save Rate" : "Add Rate"}
            </Button>
          </div>
        </ModalFooter>
      </Modal>
    </div>
  );
}
