"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { Icon } from "@/app/components/Icon";
import { Button } from "@/app/components/Button";
import { Input } from "@/app/components/Form/Inputs";
import { Select } from "@/app/components/Form/Select";
import { Pagination } from "@/app/components/Admin/Pagination";
import { RowsPerPage } from "@/app/components/rows-per-page";
import Modal from "@/app/components/Modal/Modal";
import ModalBody from "@/app/components/Modal/ModalBody";
import ModalFooter from "@/app/components/Modal/ModalFooter";
import Drawer from "@/app/components/Drawer/Drawer";

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

// ----------------------------------------------------
// Mock Data
// ----------------------------------------------------
const initialDroppingOrders: DroppingOrder[] = [
  {
    id: "DRP-9842",
    orderRef: "ORD-2026-8942",
    customerName: "Babatunde Adeleke",
    customerPhone: "+234 803 123 4567",
    destinationAddress: "Plot 14 Admiralty Way, Lekki Phase 1",
    lga: "Eti-Osa",
    state: "Lagos",
    dispatchHub: "Lagos Island Hub (Lekki)",
    carrier: "Kool Logistics Van #02",
    driverName: "Sunday Musa",
    driverPhone: "+234 812 900 3341",
    itemsSummary: "Solar Freezer 210L (1x)",
    itemType: "Heavy Freezer",
    dropStatus: "In Transit",
    dropDate: "2026-09-20",
    estimatedDelivery: "2026-09-20 17:30",
    notes: "Requires 2 persons for gate offload",
  },
  {
    id: "DRP-9841",
    orderRef: "ORD-2026-8930",
    customerName: "Folake Balogun",
    customerPhone: "+234 802 884 9012",
    destinationAddress: "22 Allen Avenue, Ikeja",
    lga: "Ikeja",
    state: "Lagos",
    dispatchHub: "Lagos Mainland Depot (Ikeja)",
    carrier: "GIG Logistics Express",
    driverName: "Emeka Obi",
    driverPhone: "+234 814 220 9811",
    itemsSummary: "Koolboks Portable Ice Chest 50L (2x)",
    itemType: "Ice Chest",
    dropStatus: "Dropped Off",
    dropDate: "2026-09-20",
    estimatedDelivery: "2026-09-20 13:00",
    notes: "Customer signed electronic POD",
  },
  {
    id: "DRP-9840",
    orderRef: "ORD-2026-8915",
    customerName: "Aliyu Mohammed",
    customerPhone: "+234 809 332 1009",
    destinationAddress: "House 12, 4th Avenue, Gwarinpa Estate",
    lga: "Abuja Municipal (AMAC)",
    state: "FCT Abuja",
    dispatchHub: "Abuja Regional Center",
    carrier: "Kool Logistics Truck #01",
    driverName: "Haruna Garba",
    driverPhone: "+234 805 771 9043",
    itemsSummary: "Commercial Deep Freezer 500L (1x)",
    itemType: "Heavy Freezer",
    dropStatus: "Dispatched",
    dropDate: "2026-09-20",
    estimatedDelivery: "2026-09-21 11:00",
    notes: "Call client before arriving at estate security gate",
  },
  {
    id: "DRP-9839",
    orderRef: "ORD-2026-8899",
    customerName: "Chinedu Eze",
    customerPhone: "+234 806 550 4432",
    destinationAddress: "7 Trans-Amadi Industrial Layout",
    lga: "Port Harcourt",
    state: "Rivers",
    dispatchHub: "Port Harcourt Hub",
    carrier: "Red Star Express",
    driverName: "Godswill Briggs",
    driverPhone: "+234 803 664 1209",
    itemsSummary: "Solar Battery & Inverter Upgrade Kit",
    itemType: "Solar Kit",
    dropStatus: "Ready for Drop",
    dropDate: "2026-09-21",
    estimatedDelivery: "2026-09-21 16:00",
    notes: "Staged at Bay 2 awaiting courier pickup",
  },
  {
    id: "DRP-9838",
    orderRef: "ORD-2026-8874",
    customerName: "Rashidat Olaniyan",
    customerPhone: "+234 701 992 3450",
    destinationAddress: "Plot 8, Ring Road, Challenge",
    lga: "Ibadan South-West",
    state: "Oyo",
    dispatchHub: "Ibadan Central Depot",
    carrier: "Kool Fleet Van #05",
    driverName: "Kayode Ajayi",
    driverPhone: "+234 808 112 5590",
    itemsSummary: "Solar Freezer 150L (1x)",
    itemType: "Heavy Freezer",
    dropStatus: "Failed Handover",
    dropDate: "2026-09-19",
    estimatedDelivery: "2026-09-19 16:00",
    notes: "Recipient unreachable via phone. Rescheduling drop.",
  },
];

const initialVendorAddresses: VendorAddress[] = [
  {
    id: "VADDR-01",
    vendorName: "SolarTech Distribution Ltd",
    vendorCode: "VEN-104",
    contactPerson: "Alhaji Ibrahim Danjuma",
    contactPhone: "+234 802 334 1122",
    contactEmail: "logistics@solartech.ng",
    warehouseAddress: "Block B, Industrial Estate, Ilupeju",
    lga: "Oshodi-Isolo",
    state: "Lagos",
    operatingHours: "Mon - Fri: 8:00 AM - 5:30 PM",
    dockAccess: "Loading Bay 3, Forklift Available, 40ft Trailer Access",
    pickupNotes: "Call warehouse supervisor 30 mins before arrival",
    verificationStatus: "Verified",
  },
  {
    id: "VADDR-02",
    vendorName: "EcoCool Manufacturing Hub",
    vendorCode: "VEN-088",
    contactPerson: "Ngozi Chimamanda",
    contactPhone: "+234 803 778 9901",
    contactEmail: "fulfillment@ecocool.com.ng",
    warehouseAddress: "Km 14 Ikorodu Road, Ojota Depot",
    lga: "Kosofe",
    state: "Lagos",
    operatingHours: "Mon - Sat: 7:30 AM - 6:00 PM",
    dockAccess: "Ground Level Loading, Hydraulic Ramp",
    pickupNotes: "Driver must wear safety boots & hi-vis jacket",
    verificationStatus: "Verified",
  },
  {
    id: "VADDR-03",
    vendorName: "Northern Sun Power Systems",
    vendorCode: "VEN-210",
    contactPerson: "Sani Bello",
    contactPhone: "+234 809 112 4433",
    contactEmail: "dispatch@northernsun.ng",
    warehouseAddress: "Plot 42 Sharada Industrial Area Phase 2",
    lga: "Kano Municipal",
    state: "Kano",
    operatingHours: "Mon - Thu: 8:30 AM - 4:30 PM",
    dockAccess: "Open Yard, Crane & Forklift Service",
    pickupNotes: "Advance gate pass code generated via merchant portal",
    verificationStatus: "Verified",
  },
  {
    id: "VADDR-04",
    vendorName: "Delta Cold Chain Ventures",
    vendorCode: "VEN-312",
    contactPerson: "Efe Akpokona",
    contactPhone: "+234 805 667 8890",
    contactEmail: "efecold@deltaventure.com",
    warehouseAddress: "18 Effurun-Sapele Road, Enerhen",
    lga: "Uvwie",
    state: "Delta",
    operatingHours: "Mon - Fri: 9:00 AM - 5:00 PM",
    dockAccess: "Medium Van Dock, Manual Offloading Crew",
    pickupNotes: "Weekend dispatch requires 24h advance request",
    verificationStatus: "Pending Audit",
  },
  {
    id: "VADDR-05",
    vendorName: "GreenGrid Energy Supplies",
    vendorCode: "VEN-156",
    contactPerson: "Tariq Adele",
    contactPhone: "+234 813 440 2211",
    contactEmail: "warehouse@greengrid.ng",
    warehouseAddress: "Central Business District, Idu Yard",
    lga: "Abuja Municipal (AMAC)",
    state: "FCT Abuja",
    operatingHours: "Mon - Fri: 8:00 AM - 5:00 PM",
    dockAccess: "Full Container Bay, 5-Ton Forklift",
    pickupNotes: "Heavy trucks allowed between 10am and 3pm only",
    verificationStatus: "Verified",
  },
];

const initialLgaDeliveryPrices: LgaDeliveryPrice[] = [
  {
    id: "LGA-01",
    lgaName: "Ikeja",
    state: "Lagos",
    zone: "Zone 1 (Core Metro)",
    standardDeliveryFee: 4500,
    heavyApplianceFee: 11500,
    estimatedTransitTime: "Same Day - 24 Hours",
    hubAssigned: "Lagos Mainland Depot (Ikeja)",
    status: "Active",
  },
  {
    id: "LGA-02",
    lgaName: "Eti-Osa",
    state: "Lagos",
    zone: "Zone 1 (Core Metro)",
    standardDeliveryFee: 5000,
    heavyApplianceFee: 12500,
    estimatedTransitTime: "24 Hours",
    hubAssigned: "Lagos Island Hub (Lekki)",
    status: "Active",
  },
  {
    id: "LGA-03",
    lgaName: "Alimosho",
    state: "Lagos",
    zone: "Zone 2 (Suburban)",
    standardDeliveryFee: 6500,
    heavyApplianceFee: 14000,
    estimatedTransitTime: "24 - 48 Hours",
    hubAssigned: "Lagos Mainland Depot (Ikeja)",
    status: "Active",
  },
  {
    id: "LGA-04",
    lgaName: "Ikorodu",
    state: "Lagos",
    zone: "Zone 3 (Outskirts)",
    standardDeliveryFee: 8500,
    heavyApplianceFee: 18000,
    estimatedTransitTime: "2 - 3 Days",
    hubAssigned: "Ikorodu Satellite Hub",
    status: "Active",
  },
  {
    id: "LGA-05",
    lgaName: "Abuja Municipal (AMAC)",
    state: "FCT Abuja",
    zone: "Zone 1 (Core Metro)",
    standardDeliveryFee: 6000,
    heavyApplianceFee: 15000,
    estimatedTransitTime: "24 Hours",
    hubAssigned: "Abuja Regional Center",
    status: "Active",
  },
  {
    id: "LGA-06",
    lgaName: "Gwagwalada",
    state: "FCT Abuja",
    zone: "Zone 3 (Outskirts)",
    standardDeliveryFee: 9500,
    heavyApplianceFee: 20000,
    estimatedTransitTime: "2 - 3 Days",
    hubAssigned: "Abuja Regional Center",
    status: "Restricted",
  },
  {
    id: "LGA-07",
    lgaName: "Port Harcourt",
    state: "Rivers",
    zone: "Zone 1 (Core Metro)",
    standardDeliveryFee: 5500,
    heavyApplianceFee: 13500,
    estimatedTransitTime: "24 - 48 Hours",
    hubAssigned: "Port Harcourt Central Hub",
    status: "Active",
  },
  {
    id: "LGA-08",
    lgaName: "Obio/Akpor",
    state: "Rivers",
    zone: "Zone 2 (Suburban)",
    standardDeliveryFee: 6500,
    heavyApplianceFee: 15000,
    estimatedTransitTime: "24 - 48 Hours",
    hubAssigned: "Port Harcourt Central Hub",
    status: "Active",
  },
  {
    id: "LGA-09",
    lgaName: "Ibadan North",
    state: "Oyo",
    zone: "Zone 1 (Core Metro)",
    standardDeliveryFee: 4500,
    heavyApplianceFee: 11000,
    estimatedTransitTime: "24 Hours",
    hubAssigned: "Ibadan Central Depot",
    status: "Active",
  },
  {
    id: "LGA-10",
    lgaName: "Kano Municipal",
    state: "Kano",
    zone: "Zone 1 (Core Metro)",
    standardDeliveryFee: 6000,
    heavyApplianceFee: 14500,
    estimatedTransitTime: "24 - 48 Hours",
    hubAssigned: "Kano Regional Depot",
    status: "Active",
  },
];

type ActiveTabType = "dropping-orders" | "vendor-addresses" | "delivery-prices";

export default function KoolLogisticsPage() {
  const [activeTab, setActiveTab] = useState<ActiveTabType>("dropping-orders");

  // State: Dropping Orders
  const [droppingOrders, setDroppingOrders] = useState<DroppingOrder[]>(
    initialDroppingOrders,
  );
  const [dropSearch, setDropSearch] = useState("");
  const [dropStatusFilter, setDropStatusFilter] = useState("all");
  const [dropHubFilter, setDropHubFilter] = useState("all");

  // State: Vendor Addresses
  const [vendorAddresses, setVendorAddresses] = useState<VendorAddress[]>(
    initialVendorAddresses,
  );
  const [vendorSearch, setVendorSearch] = useState("");
  const [vendorStateFilter, setVendorStateFilter] = useState("all");

  // State: Delivery Prices
  const [lgaPrices, setLgaPrices] = useState<LgaDeliveryPrice[]>(
    initialLgaDeliveryPrices,
  );
  const [lgaSearch, setLgaSearch] = useState("");
  const [lgaStateFilter, setLgaStateFilter] = useState("all");
  const [lgaZoneFilter, setLgaZoneFilter] = useState("all");

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
  const handleCreateDropOrder = () => {
    if (!newOrderRef.trim() || !newCustName.trim()) {
      alert("Please enter Order Reference and Customer Name.");
      return;
    }
    const newOrder: DroppingOrder = {
      id: `DRP-${Math.floor(1000 + Math.random() * 9000)}`,
      orderRef: newOrderRef.trim(),
      customerName: newCustName.trim(),
      customerPhone: newCustPhone || "+234 800 000 0000",
      destinationAddress: newAddress || "Pending delivery address confirmation",
      lga: newLga,
      state: newState,
      dispatchHub: `${newState} Central Depot`,
      carrier: newCarrier,
      driverName: "Pending Assignment",
      driverPhone: "-",
      itemsSummary: newItems || "Standard Appliance Item",
      itemType: newItemType,
      dropStatus: "Ready for Drop",
      dropDate: new Date().toISOString().split("T")[0],
      estimatedDelivery: "24 Hours from handover",
    };
    setDroppingOrders([newOrder, ...droppingOrders]);
    setIsCreateDropModalOpen(false);
  };

  // Add Vendor Address
  const handleAddVendor = () => {
    if (!newVenName.trim()) {
      alert("Please provide Vendor Name.");
      return;
    }
    const newVen: VendorAddress = {
      id: `VADDR-${Math.floor(10 + Math.random() * 90)}`,
      vendorName: newVenName.trim(),
      vendorCode: newVenCode || `VEN-${Math.floor(100 + Math.random() * 900)}`,
      contactPerson: newVenContact || "Logistics Manager",
      contactPhone: newVenPhone || "+234 800 000 0000",
      contactEmail: newVenEmail || "logistics@vendor.ng",
      warehouseAddress: newVenAddress || "Main Distribution Hub",
      lga: newVenLga,
      state: newVenState,
      operatingHours: newVenHours,
      dockAccess: newVenDock,
      pickupNotes: "Standard pickup dispatch protocol",
      verificationStatus: "Verified",
    };
    setVendorAddresses([newVen, ...vendorAddresses]);
    setIsAddVendorModalOpen(false);
  };

  // Save / Update LGA Price
  const handleSaveLgaPrice = () => {
    if (!lgaNameInput.trim()) {
      alert("Please enter LGA Name.");
      return;
    }
    if (editingLga) {
      setLgaPrices((prev) =>
        prev.map((l) => {
          if (l.id === editingLga.id) {
            return {
              ...l,
              lgaName: lgaNameInput,
              state: lgaStateInput,
              zone: lgaZoneInput,
              standardDeliveryFee: Number(stdFeeInput) || 5000,
              heavyApplianceFee: Number(heavyFeeInput) || 12000,
              estimatedTransitTime: transitTimeInput,
              hubAssigned: hubInput,
            };
          }
          return l;
        }),
      );
      setEditingLga(null);
    } else {
      const newLgaItem: LgaDeliveryPrice = {
        id: `LGA-${Math.floor(100 + Math.random() * 900)}`,
        lgaName: lgaNameInput.trim(),
        state: lgaStateInput,
        zone: lgaZoneInput,
        standardDeliveryFee: Number(stdFeeInput) || 5000,
        heavyApplianceFee: Number(heavyFeeInput) || 12000,
        estimatedTransitTime: transitTimeInput,
        hubAssigned: hubInput,
        status: "Active",
      };
      setLgaPrices([newLgaItem, ...lgaPrices]);
    }
    setIsAddLgaModalOpen(false);
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
  const handleUpdateDropStatus = (
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
  };

  return (
    <div className="space-y-6">
      {/* Tabs Switcher: Dropping Orders Management, Vendor addresses, delivery prices per lga */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-200 pb-0.5">
        <div className="flex items-center gap-2 overflow-x-auto">
          <button
            onClick={() => handleTabChange("dropping-orders")}
            className={`px-5 py-3 text-xs font-bold transition-all border-b-2 whitespace-nowrap flex items-center gap-2 ${
            activeTab === "dropping-orders"
              ? "border-blue-600 text-blue-600 bg-white shadow-sm rounded-t-xl"
              : "border-transparent text-gray-500 hover:text-gray-900 hover:bg-white/50"
          }`}
        >
          <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
            <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
            <line x1="12" y1="22.08" x2="12" y2="12" />
          </svg>
          <span>Dropping Orders Management</span>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-blue-50 text-blue-700">
            {droppingOrders.length}
          </span>
        </button>

        <button
          onClick={() => handleTabChange("vendor-addresses")}
          className={`px-5 py-3 text-xs font-bold transition-all border-b-2 whitespace-nowrap flex items-center gap-2 ${
            activeTab === "vendor-addresses"
              ? "border-blue-600 text-blue-600 bg-white shadow-sm rounded-t-xl"
              : "border-transparent text-gray-500 hover:text-gray-900 hover:bg-white/50"
          }`}
        >
          <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          <span>Vendor addresses</span>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-gray-100 text-gray-600">
            {vendorAddresses.length}
          </span>
        </button>

        <button
          onClick={() => handleTabChange("delivery-prices")}
          className={`px-5 py-3 text-xs font-bold transition-all border-b-2 whitespace-nowrap flex items-center gap-2 ${
            activeTab === "delivery-prices"
              ? "border-blue-600 text-blue-600 bg-white shadow-sm rounded-t-xl"
              : "border-transparent text-gray-500 hover:text-gray-900 hover:bg-white/50"
          }`}
        >
          <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <line x1="12" y1="1" x2="12" y2="23" />
            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
          </svg>
          <span>delivery prices per lga</span>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-gray-100 text-gray-600">
            {lgaPrices.length}
          </span>
        </button>
        </div>

        <div className="flex items-center gap-2 pb-1 shrink-0">
          {activeTab === "dropping-orders" && (
            <button
              onClick={() => setIsCreateDropModalOpen(true)}
              className="px-3.5 py-2 rounded-xl text-xs font-bold bg-blue-600 text-white hover:bg-blue-700 transition-all flex items-center gap-1.5 shadow-sm shadow-blue-500/20"
            >
              <Icon name="plus" className="w-3.5 h-3.5" />
              <span>New Dropping Order</span>
            </button>
          )}

          {activeTab === "vendor-addresses" && (
            <button
              onClick={() => setIsAddVendorModalOpen(true)}
              className="px-3.5 py-2 rounded-xl text-xs font-bold bg-blue-600 text-white hover:bg-blue-700 transition-all flex items-center gap-1.5 shadow-sm shadow-blue-500/20"
            >
              <Icon name="plus" className="w-3.5 h-3.5" />
              <span>Add Vendor Address</span>
            </button>
          )}

          {activeTab === "delivery-prices" && (
            <button
              onClick={openAddLgaModal}
              className="px-3.5 py-2 rounded-xl text-xs font-bold bg-blue-600 text-white hover:bg-blue-700 transition-all flex items-center gap-1.5 shadow-sm shadow-blue-500/20"
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
          <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="lg:col-span-2">
                <Input
                  type="text"
                  placeholder="Search Drop ID, Order Ref, Customer, Driver, LGA..."
                  value={dropSearch}
                  onChange={(e) => setDropSearch(e.target.value)}
                  className="w-full text-xs"
                />
              </div>

              <div>
                <Select
                  options={[
                    { label: "All Drop Statuses", value: "all" },
                    { label: "Ready for Drop", value: "Ready for Drop" },
                    { label: "Dispatched", value: "Dispatched" },
                    { label: "In Transit", value: "In Transit" },
                    { label: "Dropped Off", value: "Dropped Off" },
                    { label: "Failed Handover", value: "Failed Handover" },
                  ]}
                  value={dropStatusFilter}
                  onChange={(val) => setDropStatusFilter(val)}
                  className="text-xs"
                />
              </div>

              <div>
                <Select
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
                  onChange={(val) => setDropHubFilter(val)}
                  className="text-xs"
                />
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
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
                    <th className="py-3.5 px-4">Drop Status</th>
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
                        className="hover:bg-blue-50/20 transition-colors cursor-pointer"
                        onClick={() => setSelectedDropOrder(order)}
                      >
                        <td className="py-3.5 px-4">
                          <div className="font-mono font-bold text-gray-900">
                            {order.id}
                          </div>
                          <div className="text-[11px] text-blue-600 font-medium">
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
                          <span className="inline-block mt-0.5 text-[10px] font-semibold bg-gray-100 px-1.5 py-0.2 rounded text-gray-600">
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

                        <td className="py-3.5 px-4">
                          {order.dropStatus === "Ready for Drop" && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-100 text-amber-800 border border-amber-200">
                              READY FOR DROP
                            </span>
                          )}
                          {order.dropStatus === "Dispatched" && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-black bg-blue-100 text-blue-800 border border-blue-200">
                              DISPATCHED
                            </span>
                          )}
                          {order.dropStatus === "In Transit" && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-black bg-purple-100 text-purple-800 border border-purple-200 animate-pulse">
                              IN TRANSIT
                            </span>
                          )}
                          {order.dropStatus === "Dropped Off" && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800 border border-emerald-200">
                              DROPPED OFF
                            </span>
                          )}
                          {order.dropStatus === "Failed Handover" && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-black bg-rose-100 text-rose-800 border border-rose-200">
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
                              className="px-2.5 py-1 rounded-lg text-xs font-bold text-blue-600 hover:text-blue-800 hover:bg-blue-50 transition-colors"
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
          <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="lg:col-span-3">
                <Input
                  type="text"
                  placeholder="Search vendor name, contact person, address, LGA..."
                  value={vendorSearch}
                  onChange={(e) => setVendorSearch(e.target.value)}
                  className="w-full text-xs"
                />
              </div>

              <div>
                <Select
                  options={[
                    { label: "All States", value: "all" },
                    { label: "Lagos", value: "Lagos" },
                    { label: "FCT Abuja", value: "FCT Abuja" },
                    { label: "Rivers", value: "Rivers" },
                    { label: "Kano", value: "Kano" },
                    { label: "Delta", value: "Delta" },
                  ]}
                  value={vendorStateFilter}
                  onChange={(val) => setVendorStateFilter(val)}
                  className="text-xs"
                />
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
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
                        className="hover:bg-blue-50/20 transition-colors"
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
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                              Verified
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
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
                            className="px-2.5 py-1 rounded-lg text-xs font-bold text-blue-600 hover:text-blue-800 hover:bg-blue-50 transition-colors"
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
          <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="lg:col-span-2">
                <Input
                  type="text"
                  placeholder="Search LGA name, State, Hub..."
                  value={lgaSearch}
                  onChange={(e) => setLgaSearch(e.target.value)}
                  className="w-full text-xs"
                />
              </div>

              <div>
                <Select
                  options={[
                    { label: "All States", value: "all" },
                    { label: "Lagos", value: "Lagos" },
                    { label: "FCT Abuja", value: "FCT Abuja" },
                    { label: "Rivers", value: "Rivers" },
                    { label: "Oyo", value: "Oyo" },
                    { label: "Kano", value: "Kano" },
                  ]}
                  value={lgaStateFilter}
                  onChange={(val) => setLgaStateFilter(val)}
                  className="text-xs"
                />
              </div>

              <div>
                <Select
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
                  onChange={(val) => setLgaZoneFilter(val)}
                  className="text-xs"
                />
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
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
                        className="hover:bg-blue-50/20 transition-colors"
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
                          <span className="inline-block mt-0.5 text-[10px] font-semibold bg-slate-100 px-1.5 py-0.2 rounded text-slate-700">
                            {lga.zone}
                          </span>
                        </td>

                        <td className="py-3.5 px-4 font-mono font-bold text-gray-900">
                          ₦{lga.standardDeliveryFee.toLocaleString()}
                        </td>

                        <td className="py-3.5 px-4 font-mono font-bold text-blue-600">
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
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                              Active
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                              Restricted
                            </span>
                          )}
                        </td>

                        <td className="py-3.5 px-4 text-right">
                          <button
                            onClick={() => openEditLgaModal(lga)}
                            className="px-2.5 py-1 rounded-lg text-xs font-bold text-blue-600 hover:text-blue-800 hover:bg-blue-50 transition-colors"
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
            <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-mono text-sm font-black text-gray-900">
                  {selectedDropOrder.id}
                </span>
                <span className="text-xs font-bold text-blue-600">
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
              <h4 className="text-xs font-black uppercase tracking-wider text-gray-400">
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
                    className={`p-2.5 rounded-xl border text-xs font-bold transition-all text-center ${
                      selectedDropOrder.dropStatus === st
                        ? "border-blue-600 bg-blue-50 text-blue-900 shadow-sm"
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
                className="text-xs font-bold text-blue-600 hover:text-blue-800"
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
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
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
                  <Select
                    options={[
                      { label: "Lagos", value: "Lagos" },
                      { label: "FCT Abuja", value: "FCT Abuja" },
                      { label: "Rivers", value: "Rivers" },
                      { label: "Oyo", value: "Oyo" },
                      { label: "Kano", value: "Kano" },
                    ]}
                    value={newState}
                    onChange={(val) => setNewState(val)}
                    className="text-xs"
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
                <Select
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
                  onChange={(val) => setNewCarrier(val)}
                  className="text-xs"
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
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
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
                  <Select
                    options={[
                      { label: "Lagos", value: "Lagos" },
                      { label: "FCT Abuja", value: "FCT Abuja" },
                      { label: "Rivers", value: "Rivers" },
                      { label: "Oyo", value: "Oyo" },
                      { label: "Kano", value: "Kano" },
                    ]}
                    value={newVenState}
                    onChange={(val) => setNewVenState(val)}
                    className="text-xs"
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
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
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
                  <Select
                    options={[
                      { label: "Lagos", value: "Lagos" },
                      { label: "FCT Abuja", value: "FCT Abuja" },
                      { label: "Rivers", value: "Rivers" },
                      { label: "Oyo", value: "Oyo" },
                      { label: "Kano", value: "Kano" },
                    ]}
                    value={lgaStateInput}
                    onChange={(val) => setLgaStateInput(val)}
                    className="text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">
                  Logistics Zone
                </label>
                <Select
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
                  className="text-xs"
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
