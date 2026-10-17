"use client";

import React, { useState, useMemo, useEffect, useCallback } from "react";
import Link from "next/link";
import { Icon } from "@/app/components/Icon";
import { Button } from "@/app/components/Button";
import { Input } from "@/app/components/Form/Inputs";
import { Search, Dropdown } from "@/app/components/Form";
import { TabFilter } from "@/app/components/Tabs";
import { Pagination } from "@/app/components/Admin/Pagination";
import { RowsPerPage } from "@/app/components/rows-per-page";
import Modal from "@/app/components/Modal/Modal";
import ModalBody from "@/app/components/Modal/ModalBody";
import ModalFooter from "@/app/components/Modal/ModalFooter";
import Drawer from "@/app/components/Drawer/Drawer";
import { normalizeApiBase } from "@/lib/api";
import {
  EmptyDroppingOrdersIllustration,
  EmptyVendorWarehouseIllustration,
  EmptyDeliveryRatesIllustration,
} from "@/app/components/Admin/EmptyLogisticsIllustrations";

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
          <TabFilter<ActiveTabType>
            ariaLabel="Logistics sections"
            options={[
              {
                value: "dropping-orders",
                label: "Dropping Orders Management",
                count: droppingOrders.length,
              },
              {
                value: "vendor-addresses",
                label: "Vendor addresses",
                count: vendorAddresses.length,
              },
              {
                value: "delivery-prices",
                label: "delivery prices per lga",
                count: lgaPrices.length,
              },
            ]}
            activeTab={activeTab}
            onChange={handleTabChange}
          />
        </div>

        <div className="flex items-center gap-2 pb-2 sm:pb-0 shrink-0">
          {activeTab === "dropping-orders" && (
            <button
              onClick={() => setIsCreateDropModalOpen(true)}
              className="px-3.5 py-2 rounded-lg text-xs font-semibold bg-brand-charcoal text-white hover:bg-brand-charcoal/90 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Icon name="plus" className="w-3.5 h-3.5" />
              <span>New Dropping Order</span>
            </button>
          )}

          {activeTab === "vendor-addresses" && (
            <button
              onClick={() => setIsAddVendorModalOpen(true)}
              className="px-3.5 py-2 rounded-lg text-xs font-semibold bg-brand-charcoal text-white hover:bg-brand-charcoal/90 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Icon name="plus" className="w-3.5 h-3.5" />
              <span>Add Vendor Address</span>
            </button>
          )}

          {activeTab === "delivery-prices" && (
            <button
              onClick={openAddLgaModal}
              className="px-3.5 py-2 rounded-lg text-xs font-semibold bg-brand-charcoal text-white hover:bg-brand-charcoal/90 transition-all flex items-center gap-1.5 cursor-pointer"
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
          <div className="bg-white border border-light-gray rounded-lg p-4 space-y-4">
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
          <div className="bg-white border border-light-gray rounded-lg overflow-hidden">
            <div className="p-4 border-b border-light-gray flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-brand-charcoal text-sm">
                  Dropping Orders Queue
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-off-white text-subtle text-xs font-semibold">
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
              <table className="w-full text-left text-xs text-subtle">
                <thead className="bg-off-white border-b border-light-gray text-faint text-[12px] font-semibold">
                  <tr>
                    <th className="py-3.5 px-4">Drop ID & order</th>
                    <th className="py-3.5 px-4">Customer & phone</th>
                    <th className="py-3.5 px-4">Destination & LGA</th>
                    <th className="py-3.5 px-4">Carrier & driver</th>
                    <th className="py-3.5 px-4">Items / payload</th>
                    <th className="py-3.5 px-4">Scheduled drop</th>
                    <th className="py-3.5 px-4 whitespace-nowrap">Drop status</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-light-gray">
                  {filteredDroppingOrders.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-14 text-center">
                        <div className="max-w-md mx-auto space-y-3">
                          <EmptyDroppingOrdersIllustration className="w-52 h-40 mx-auto" />
                          <div className="space-y-1">
                            <p className="font-semibold text-brand-charcoal text-sm">
                              {dropSearch || dropStatusFilter !== "all" || dropHubFilter !== "all"
                                ? "No matching dropping orders found"
                                : "No dropping orders in the dispatch queue"}
                            </p>
                            <p className="text-xs text-faint leading-relaxed max-w-sm mx-auto">
                              {dropSearch || dropStatusFilter !== "all" || dropHubFilter !== "all"
                                ? "Try resetting your search query or clear the status and hub filters to view all orders."
                                : "Create your first dropping order to start dispatching shipments across regional hubs."}
                            </p>
                          </div>
                          <div className="flex items-center justify-center gap-2 pt-1">
                            {(dropSearch || dropStatusFilter !== "all" || dropHubFilter !== "all") && (
                              <button
                                type="button"
                                onClick={() => {
                                  setDropSearch("");
                                  setDropStatusFilter("all");
                                  setDropHubFilter("all");
                                  setCurrentPage(1);
                                }}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-off-white hover:bg-light-gray text-subtle transition-colors cursor-pointer"
                              >
                                Reset filters
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => setIsCreateDropModalOpen(true)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-brand-charcoal text-white hover:bg-brand-charcoal/90 transition-colors cursor-pointer"
                            >
                              <Icon name="plus" className="w-3.5 h-3.5" />
                              <span>New Dropping Order</span>
                            </button>
                          </div>
                        </div>
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
                          <div className="font-mono font-semibold text-brand-charcoal">
                            {order.id}
                          </div>
                          <div className="text-[11px] text-brand-orange-text font-medium">
                            {order.orderRef}
                          </div>
                        </td>

                        <td className="py-3.5 px-4">
                          <div className="font-semibold text-brand-charcoal">
                            {order.customerName}
                          </div>
                          <div className="text-[11px] text-faint font-mono">
                            {order.customerPhone}
                          </div>
                        </td>

                        <td className="py-3.5 px-4">
                          <div
                            className="text-brand-charcoal font-medium line-clamp-1 max-w-xs"
                            title={order.destinationAddress}
                          >
                            {order.destinationAddress}
                          </div>
                          <div className="text-[11px] text-faint">
                            {order.lga}, {order.state}
                          </div>
                        </td>

                        <td className="py-3.5 px-4">
                          <div className="font-medium text-brand-charcoal">
                            {order.carrier}
                          </div>
                          <div className="text-[11px] text-faint">
                            Driver: {order.driverName}
                          </div>
                        </td>

                        <td className="py-3.5 px-4">
                          <div className="font-medium text-brand-charcoal">
                            {order.itemsSummary}
                          </div>
                          <span className="inline-block mt-0.5 text-[11px] font-semibold bg-off-white px-1.5 py-0.2 rounded text-subtle">
                            {order.itemType}
                          </span>
                        </td>

                        <td className="py-3.5 px-4">
                          <div className="text-brand-charcoal font-medium">
                            {order.dropDate}
                          </div>
                          <div className="text-[11px] text-faint">
                            {order.estimatedDelivery.split(" ")[1]}
                          </div>
                        </td>

                        <td className="py-3.5 px-4 whitespace-nowrap">
                          {order.dropStatus === "Ready for Drop" && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-warning/15 text-brand-charcoal border border-warning/30">
                              READY FOR DROP
                            </span>
                          )}
                          {order.dropStatus === "Dispatched" && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-brand-orange-soft text-brand-charcoal border border-brand-orange/30">
                              DISPATCHED
                            </span>
                          )}
                          {order.dropStatus === "In Transit" && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-brand-orange-soft text-brand-charcoal border border-brand-orange/30 animate-pulse">
                              IN TRANSIT
                            </span>
                          )}
                          {order.dropStatus === "Dropped Off" && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-success-soft text-success border border-success/30">
                              DROPPED OFF
                            </span>
                          )}
                          {order.dropStatus === "Failed Handover" && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-error-soft text-error border border-error/30">
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
                              className="px-2.5 py-1 rounded-lg text-xs font-semibold text-brand-orange-text hover:text-brand-charcoal hover:bg-brand-orange-soft transition-colors"
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
          <div className="bg-white border border-light-gray rounded-lg p-4 space-y-4">
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
          <div className="bg-white border border-light-gray rounded-lg overflow-hidden">
            <div className="p-4 border-b border-light-gray flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-brand-charcoal text-sm">
                  Vendor Pickup Locations
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-off-white text-subtle text-xs font-semibold">
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
              <table className="w-full text-left text-xs text-subtle">
                <thead className="bg-off-white border-b border-light-gray text-faint text-[12px] font-semibold">
                  <tr>
                    <th className="py-3.5 px-4">Vendor & code</th>
                    <th className="py-3.5 px-4">Contact person</th>
                    <th className="py-3.5 px-4">Warehouse address & LGA</th>
                    <th className="py-3.5 px-4">Operating hours</th>
                    <th className="py-3.5 px-4">Dock & access notes</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-light-gray">
                  {filteredVendors.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-14 text-center">
                        <div className="max-w-md mx-auto space-y-3">
                          <EmptyVendorWarehouseIllustration className="w-52 h-40 mx-auto" />
                          <div className="space-y-1">
                            <p className="font-semibold text-brand-charcoal text-sm">
                              {vendorSearch || vendorStateFilter !== "all"
                                ? "No matching vendor addresses found"
                                : "No vendor pickup locations registered"}
                            </p>
                            <p className="text-xs text-faint leading-relaxed max-w-sm mx-auto">
                              {vendorSearch || vendorStateFilter !== "all"
                                ? "No vendor depots match your search criteria. Try clearing the state filter or search query."
                                : "Add authorized vendor warehouses and depot locations for collection and stocking."}
                            </p>
                          </div>
                          {(vendorSearch || vendorStateFilter !== "all") && (
                            <div className="flex items-center justify-center gap-2 pt-1">
                              <button
                                type="button"
                                onClick={() => {
                                  setVendorSearch("");
                                  setVendorStateFilter("all");
                                  setCurrentPage(1);
                                }}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-off-white hover:bg-light-gray text-subtle transition-colors cursor-pointer"
                              >
                                Reset filters
                              </button>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredVendors.map((ven) => (
                      <tr
                        key={ven.id}
                        className="hover:bg-brand-orange-soft/20 transition-colors"
                      >
                        <td className="py-3.5 px-4">
                          <div className="font-semibold text-brand-charcoal">
                            {ven.vendorName}
                          </div>
                          <div className="text-[11px] font-mono text-faint">
                            {ven.vendorCode}
                          </div>
                        </td>

                        <td className="py-3.5 px-4">
                          <div className="font-medium text-brand-charcoal">
                            {ven.contactPerson}
                          </div>
                          <div className="text-[11px] text-faint font-mono">
                            {ven.contactPhone}
                          </div>
                        </td>

                        <td className="py-3.5 px-4">
                          <div className="text-brand-charcoal font-medium line-clamp-1 max-w-xs">
                            {ven.warehouseAddress}
                          </div>
                          <div className="text-[11px] text-faint">
                            {ven.lga}, {ven.state}
                          </div>
                        </td>

                        <td className="py-3.5 px-4 font-medium text-brand-charcoal">
                          {ven.operatingHours}
                        </td>

                        <td className="py-3.5 px-4">
                          <div className="text-subtle text-[11px] line-clamp-2 max-w-xs">
                            {ven.dockAccess}
                          </div>
                        </td>

                        <td className="py-3.5 px-4">
                          {ven.verificationStatus === "Verified" ? (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-success-soft text-success border border-success/30">
                              Verified
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-warning/10 text-warning border border-warning/30">
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
                            className="px-2.5 py-1 rounded-lg text-xs font-semibold text-brand-orange-text hover:text-brand-charcoal hover:bg-brand-orange-soft transition-colors"
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
          <div className="bg-white border border-light-gray rounded-lg p-4 space-y-4">
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
          <div className="bg-white border border-light-gray rounded-lg overflow-hidden">
            <div className="p-4 border-b border-light-gray flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-brand-charcoal text-sm">
                  LGA Delivery Pricing Tariff
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-off-white text-subtle text-xs font-semibold">
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
              <table className="w-full text-left text-xs text-subtle">
                <thead className="bg-off-white border-b border-light-gray text-faint text-[12px] font-semibold">
                  <tr>
                    <th className="py-3.5 px-4">Local government area (LGA)</th>
                    <th className="py-3.5 px-4">State & zone</th>
                    <th className="py-3.5 px-4">Standard delivery</th>
                    <th className="py-3.5 px-4">Heavy solar appliance</th>
                    <th className="py-3.5 px-4">Estimated transit SLA</th>
                    <th className="py-3.5 px-4">Assigned dispatch hub</th>
                    <th className="py-3.5 px-4">Service status</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-light-gray">
                  {filteredLgaPrices.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-14 text-center">
                        <div className="max-w-md mx-auto space-y-3">
                          <EmptyDeliveryRatesIllustration className="w-52 h-40 mx-auto" />
                          <div className="space-y-1">
                            <p className="font-semibold text-brand-charcoal text-sm">
                              {lgaSearch || lgaStateFilter !== "all" || lgaZoneFilter !== "all"
                                ? "No matching delivery rates found"
                                : "No LGA delivery pricing configured"}
                            </p>
                            <p className="text-xs text-faint leading-relaxed max-w-sm mx-auto">
                              {lgaSearch || lgaStateFilter !== "all" || lgaZoneFilter !== "all"
                                ? "Try resetting your search query or clear the state and logistics zone filters."
                                : "Configure delivery tariffs and transit time by Local Government Area across hubs."}
                            </p>
                          </div>
                          {(lgaSearch || lgaStateFilter !== "all" || lgaZoneFilter !== "all") && (
                            <div className="flex items-center justify-center gap-2 pt-1">
                              <button
                                type="button"
                                onClick={() => {
                                  setLgaSearch("");
                                  setLgaStateFilter("all");
                                  setLgaZoneFilter("all");
                                  setCurrentPage(1);
                                }}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-off-white hover:bg-light-gray text-subtle transition-colors cursor-pointer"
                              >
                                Reset filters
                              </button>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredLgaPrices.map((lga) => (
                      <tr
                        key={lga.id}
                        className="hover:bg-brand-orange-soft/20 transition-colors"
                      >
                        <td className="py-3.5 px-4">
                          <div className="font-semibold text-brand-charcoal text-[13px]">
                            {lga.lgaName}
                          </div>
                          <div className="text-[11px] text-faint">
                            {lga.id}
                          </div>
                        </td>

                        <td className="py-3.5 px-4">
                          <div className="font-medium text-brand-charcoal">
                            {lga.state}
                          </div>
                          <span className="inline-block mt-0.5 text-[11px] font-semibold bg-off-white px-1.5 py-0.2 rounded text-subtle">
                            {lga.zone}
                          </span>
                        </td>

                        <td className="py-3.5 px-4 font-mono font-semibold text-brand-charcoal">
                          ₦{lga.standardDeliveryFee.toLocaleString()}
                        </td>

                        <td className="py-3.5 px-4 font-mono font-semibold text-brand-orange-text">
                          ₦{lga.heavyApplianceFee.toLocaleString()}
                        </td>

                        <td className="py-3.5 px-4 font-medium text-subtle">
                          {lga.estimatedTransitTime}
                        </td>

                        <td className="py-3.5 px-4 text-subtle">
                          {lga.hubAssigned}
                        </td>

                        <td className="py-3.5 px-4">
                          {lga.status === "Active" ? (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-success-soft text-success border border-success/30">
                              Active
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-warning/10 text-warning border border-warning/30">
                              Restricted
                            </span>
                          )}
                        </td>

                        <td className="py-3.5 px-4 text-right">
                          <button
                            onClick={() => openEditLgaModal(lga)}
                            className="px-2.5 py-1 rounded-lg text-xs font-semibold text-brand-orange-text hover:text-brand-charcoal hover:bg-brand-orange-soft transition-colors"
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
            <div className="bg-off-white rounded-lg p-4 border border-light-gray space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-mono text-sm font-semibold text-brand-charcoal">
                  {selectedDropOrder.id}
                </span>
                <span className="text-xs font-semibold text-brand-orange-text">
                  Order Ref: {selectedDropOrder.orderRef}
                </span>
              </div>
              <div className="text-xs text-subtle pt-2 border-t border-light-gray space-y-1">
                <div>
                  Customer:{" "}
                  <span className="font-semibold text-brand-charcoal">
                    {selectedDropOrder.customerName}
                  </span>
                </div>
                <div>
                  Phone:{" "}
                  <span className="font-mono text-brand-charcoal">
                    {selectedDropOrder.customerPhone}
                  </span>
                </div>
                <div>
                  Destination:{" "}
                  <span className="font-medium text-brand-charcoal">
                    {selectedDropOrder.destinationAddress},{" "}
                    {selectedDropOrder.lga}, {selectedDropOrder.state}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-[12px] font-medium text-subtle">
                Update fulfillment status
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
                    className={`p-2.5 rounded-lg border text-xs font-semibold transition-all text-center ${selectedDropOrder.dropStatus === st
                        ? "border-brand-orange bg-brand-orange-soft text-brand-charcoal "
                        : "border-light-gray text-subtle hover:bg-off-white"
                      }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg border border-light-gray text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-faint">Dispatch Hub:</span>
                <span className="font-semibold text-brand-charcoal">
                  {selectedDropOrder.dispatchHub}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-faint">Assigned Carrier:</span>
                <span className="font-semibold text-brand-charcoal">
                  {selectedDropOrder.carrier}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-faint">Courier Driver:</span>
                <span className="font-semibold text-brand-charcoal">
                  {selectedDropOrder.driverName} (
                  {selectedDropOrder.driverPhone})
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-faint">Package Payload:</span>
                <span className="font-semibold text-brand-charcoal">
                  {selectedDropOrder.itemsSummary}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-faint">Estimated Delivery:</span>
                <span className="font-semibold text-brand-charcoal">
                  {selectedDropOrder.estimatedDelivery}
                </span>
              </div>
              {selectedDropOrder.notes && (
                <div className="pt-2 border-t border-light-gray text-faint italic">
                  Note: {selectedDropOrder.notes}
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-light-gray flex items-center justify-between">
              <button
                onClick={() =>
                  alert(`Waybill slip generated for ${selectedDropOrder.id}`)
                }
                className="text-xs font-semibold text-brand-orange-text hover:text-brand-charcoal"
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
              <h3 className="text-lg font-semibold text-brand-charcoal">
                Create Dropping Order
              </h3>
              <p className="text-xs text-faint mt-1">
                Dispatch an order payload through the Kool Logistics dropping
                hub network.
              </p>
            </div>

            <div className="space-y-3 pt-2">
              <div>
                <label className="text-xs font-semibold text-subtle block mb-1">
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
                  <label className="text-xs font-semibold text-subtle block mb-1">
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
                  <label className="text-xs font-semibold text-subtle block mb-1">
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
                <label className="text-xs font-semibold text-subtle block mb-1">
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
                  <label className="text-xs font-semibold text-subtle block mb-1">
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
                  <label className="text-xs font-semibold text-subtle block mb-1">
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
                <label className="text-xs font-semibold text-subtle block mb-1">
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
                <label className="text-xs font-semibold text-subtle block mb-1">
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
              <h3 className="text-lg font-semibold text-brand-charcoal">
                Add Vendor Pickup Address
              </h3>
              <p className="text-xs text-faint mt-1">
                Register a verified merchant warehouse location for pickup
                routing.
              </p>
            </div>

            <div className="space-y-3 pt-2">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-subtle block mb-1">
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
                  <label className="text-xs font-semibold text-subtle block mb-1">
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
                  <label className="text-xs font-semibold text-subtle block mb-1">
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
                  <label className="text-xs font-semibold text-subtle block mb-1">
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
                <label className="text-xs font-semibold text-subtle block mb-1">
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
                  <label className="text-xs font-semibold text-subtle block mb-1">
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
                  <label className="text-xs font-semibold text-subtle block mb-1">
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
                <label className="text-xs font-semibold text-subtle block mb-1">
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
              <h3 className="text-lg font-semibold text-brand-charcoal">
                {editingLga
                  ? `Edit LGA Delivery Rate: ${editingLga.lgaName}`
                  : "Add LGA Delivery Pricing Rate"}
              </h3>
              <p className="text-xs text-faint mt-1">
                Configure standard and heavy solar appliance tariffs by Local
                Government Area.
              </p>
            </div>

            <div className="space-y-3 pt-2">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-subtle block mb-1">
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
                  <label className="text-xs font-semibold text-subtle block mb-1">
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
                <label className="text-xs font-semibold text-subtle block mb-1">
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
                  <label className="text-xs font-semibold text-subtle block mb-1">
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
                  <label className="text-xs font-semibold text-subtle block mb-1">
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
                <label className="text-xs font-semibold text-subtle block mb-1">
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
                <label className="text-xs font-semibold text-subtle block mb-1">
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
