"use client";

import React, { useState, useMemo } from "react";
import { Button } from "@/app/components/Button";
import { ConfirmationModal } from "@/app/components/Admin/ConfirmationModal";
import {
  HiOutlineShieldCheck,
  HiOutlineUserGroup,
  HiOutlinePlus,
  HiOutlinePencilSquare,
  HiOutlineTrash,
  HiOutlineCheckCircle,
  HiOutlineXMark,
  HiOutlineMagnifyingGlass,
  HiOutlineUserPlus,
  HiOutlineCheck,
  HiOutlineArrowPath,
  HiOutlineKey,
  HiOutlineLockClosed,
} from "react-icons/hi2";

/* =========================================================================
   TYPES
   ========================================================================= */

interface RoleItem {
  id: string;
  name: string;
  department: string;
  description: string;
  userCount: number;
  status: "Active" | "Inactive";
}

interface PermissionModule {
  id: string;
  category: string;
  name: string;
  description: string;
  view: boolean;
  create: boolean;
  edit: boolean;
  delete: boolean;
}

interface AssignedUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  assignedDate: string;
  status: "Active" | "Inactive";
}

/* =========================================================================
   INITIAL DATA: THE 14 SYSTEM ROLES
   ========================================================================= */

const initialRoles: RoleItem[] = [
  {
    id: "super-admin",
    name: "Super Admin",
    department: "Executive & Governance",
    description:
      "Unrestricted master access across all system modules, financial ledgers, and API configurations.",
    userCount: 2,
    status: "Active",
  },
  {
    id: "admin",
    name: "Admin",
    department: "Operations Management",
    description:
      "Operational management of platform workflows, merchant onboarding, and administrative controls.",
    userCount: 5,
    status: "Active",
  },
  {
    id: "buyer",
    name: "Buyer",
    department: "Commerce Customers",
    description:
      "Registered retail and commercial purchasing account with order tracking and invoice access.",
    userCount: 1420,
    status: "Active",
  },
  {
    id: "vendor",
    name: "Vendor",
    department: "Merchant Partners",
    description:
      "Authorized appliance merchant/OEM with product catalog listing and order fulfilment rights.",
    userCount: 48,
    status: "Active",
  },
  {
    id: "ecommerce-manager",
    name: "E-commerce manager",
    department: "Catalog & Merchandising",
    description:
      "Oversees product catalog, pricing, banner campaigns, discounts, and brand listings.",
    userCount: 4,
    status: "Active",
  },
  {
    id: "user",
    name: "User",
    department: "General Users",
    description:
      "Standard registered user with basic profile browsing and customer account features.",
    userCount: 3250,
    status: "Active",
  },
  {
    id: "credit-checkers",
    name: "Credit Checkers",
    department: "Risk & Underwriting",
    description:
      "Underwrites BNPL financing applications, analyzes creditworthiness, and approves installment contracts.",
    userCount: 6,
    status: "Active",
  },
  {
    id: "sales-support",
    name: "Sales Support",
    department: "Customer Service",
    description:
      "Handles customer pre-sale inquiries, quote generation, and technical assistance.",
    userCount: 14,
    status: "Active",
  },
  {
    id: "finance",
    name: "Finance",
    department: "Accounting & Tax",
    description:
      "Audits transaction ledgers, processes merchant payouts, manages tax reports, and refunds.",
    userCount: 5,
    status: "Active",
  },
  {
    id: "inventory",
    name: "Inventory",
    department: "Warehouse & Supply",
    description:
      "Monitors warehouse stock thresholds, SKU replenishments, and multi-hub cold units.",
    userCount: 8,
    status: "Active",
  },
  {
    id: "logistics",
    name: "Logistics",
    department: "Fleet & Couriers",
    description:
      "Assigns 3rd-party dispatchers, tracks deliveries, and configures fulfillment service areas.",
    userCount: 11,
    status: "Active",
  },
  {
    id: "order-fulfilment",
    name: "Order Fulfilment",
    department: "Fulfillment Hub",
    description:
      "Packages and validates active orders, coordinates couriers, and handles counter pickups.",
    userCount: 18,
    status: "Active",
  },
  {
    id: "debit-mandate",
    name: "Debit Mandate",
    department: "Collections & Billing",
    description:
      "Manages recurring direct-debit mandates, Remita/Paystack e-mandate setups, and collection retries.",
    userCount: 4,
    status: "Active",
  },
  {
    id: "paygo",
    name: "Paygo",
    department: "IoT & PAYG Solar",
    description:
      "Manages Pay-As-You-Go solar activation keycodes, Angaza telemetry, and IoT lock/unlock operations.",
    userCount: 3,
    status: "Active",
  },
];

/* =========================================================================
   DEFAULT PERMISSIONS MATRIX BY MODULE
   ========================================================================= */

const defaultPermissionModules: PermissionModule[] = [
  {
    id: "perm-dash",
    category: "Core Commerce",
    name: "Dashboard & Analytics",
    description:
      "View real-time sales metrics, revenue charts, and visitor insights.",
    view: true,
    create: false,
    edit: false,
    delete: false,
  },
  {
    id: "perm-cat",
    category: "Core Commerce",
    name: "Catalog & Products",
    description:
      "Create, modify, and audit solar freezers, variants, and addon bundles.",
    view: true,
    create: true,
    edit: true,
    delete: false,
  },
  {
    id: "perm-orders",
    category: "Operations & Logistics",
    name: "Order Management",
    description:
      "Process new orders, handle cancellation requests, and update order statuses.",
    view: true,
    create: true,
    edit: true,
    delete: false,
  },
  {
    id: "perm-logistics",
    category: "Operations & Logistics",
    name: "Logistics & Delivery Slots",
    description:
      "Configure Royo/Lalamove/Dunzo dispatchers, delivery windows, and surcharges.",
    view: true,
    create: false,
    edit: true,
    delete: false,
  },
  {
    id: "perm-credit",
    category: "Credit & BNPL",
    name: "Credit Checkers & Underwriting",
    description:
      "Review customer KYC, credit scoring, bank statements, and approve BNPL contracts.",
    view: true,
    create: false,
    edit: true,
    delete: false,
  },
  {
    id: "perm-mandate",
    category: "Financials & Mandates",
    name: "Direct Debit Mandates",
    description:
      "Setup bank automated debit mandates, schedule deductions, and monitor failure retries.",
    view: true,
    create: true,
    edit: true,
    delete: false,
  },
  {
    id: "perm-paygo",
    category: "IoT & PAYG Solar",
    name: "Paygo Telemetry & Keycodes",
    description:
      "Generate Angaza solar unlock keycodes, manage Lumen battery telemetry, and unit cutoff.",
    view: true,
    create: true,
    edit: true,
    delete: false,
  },
  {
    id: "perm-finance",
    category: "Financials & Mandates",
    name: "Finance, Payouts & Taxes",
    description:
      "Process vendor payout requests, audit accounting entries, and configure VAT/WHT rates.",
    view: true,
    create: true,
    edit: true,
    delete: false,
  },
  {
    id: "perm-settings",
    category: "System & Governance",
    name: "Configurations & Security",
    description:
      "Manage 23 core configuration cards, 68 custom mods, payment gateways, and roles.",
    view: true,
    create: false,
    edit: false,
    delete: false,
  },
];

/* =========================================================================
   INITIAL ASSIGNED USERS (MOCK)
   ========================================================================= */

const initialUsersByRole: Record<string, AssignedUser[]> = {
  "super-admin": [
    {
      id: "u-1",
      name: "Babatunde Adeleke",
      email: "b.adeleke@koolboks.com",
      phone: "+234 803 111 2233",
      avatar:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&h=80&fit=crop",
      assignedDate: "12-01-2025",
      status: "Active",
    },
    {
      id: "u-2",
      name: "Ayomide Alabi",
      email: "a.alabi@koolboks.com",
      phone: "+234 802 444 5566",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop",
      assignedDate: "15-02-2025",
      status: "Active",
    },
  ],
  "credit-checkers": [
    {
      id: "u-3",
      name: "Ngozi Chukwu",
      email: "n.chukwu@koolbuy.store",
      phone: "+234 805 777 8899",
      avatar:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop",
      assignedDate: "04-03-2025",
      status: "Active",
    },
    {
      id: "u-4",
      name: "Femi Balogun",
      email: "femi.b@koolbuy.store",
      phone: "+234 814 333 9900",
      avatar:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop",
      assignedDate: "10-04-2025",
      status: "Active",
    },
  ],
  "debit-mandate": [
    {
      id: "u-5",
      name: "Tariq Ibrahim",
      email: "t.ibrahim@koolbuy.store",
      phone: "+234 809 222 1100",
      avatar:
        "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=80&h=80&fit=crop",
      assignedDate: "20-05-2025",
      status: "Active",
    },
  ],
  paygo: [
    {
      id: "u-6",
      name: "Emmanuel Nwankwo",
      email: "e.nwankwo@koolboks.com",
      phone: "+234 818 555 4433",
      avatar:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop",
      assignedDate: "11-06-2025",
      status: "Active",
    },
  ],
};

/* =========================================================================
   MAIN COMPONENT
   ========================================================================= */

export default function RolesManagementPage() {
  const [roles, setRoles] = useState<RoleItem[]>(initialRoles);
  const [selectedRoleId, setSelectedRoleId] = useState<string>("super-admin");
  const [roleSearch, setRoleSearch] = useState("");

  // Card 2 state: active tab (Permissions vs Assigned Users)
  const [activeRightTab, setActiveRightTab] = useState<
    "Permissions" | "Assigned Users"
  >("Permissions");

  // Permissions state keyed by role ID
  const [permissionsByRole, setPermissionsByRole] = useState<
    Record<string, PermissionModule[]>
  >({
    "super-admin": defaultPermissionModules.map((p) => ({
      ...p,
      view: true,
      create: true,
      edit: true,
      delete: true,
    })),
  });

  // Assigned users state
  const [usersByRole, setUsersByRole] =
    useState<Record<string, AssignedUser[]>>(initialUsersByRole);
  const [userSearch, setUserSearch] = useState("");

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modals
  const [isAddRoleModalOpen, setIsAddRoleModalOpen] = useState(false);
  const [roleToEdit, setRoleToEdit] = useState<RoleItem | null>(null);
  const [roleToDelete, setRoleToDelete] = useState<RoleItem | null>(null);
  const [isAssignUserModalOpen, setIsAssignUserModalOpen] = useState(false);

  // Add/Edit Role Form State
  const [roleForm, setRoleForm] = useState({
    name: "",
    department: "Operations Management",
    description: "",
    status: "Active" as "Active" | "Inactive",
  });

  // Assign User Form State
  const [assignUserForm, setAssignUserForm] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const selectedRole = useMemo(
    () => roles.find((r) => r.id === selectedRoleId) || roles[0],
    [roles, selectedRoleId],
  );

  // Current role's permissions
  const currentPermissions = useMemo(() => {
    if (permissionsByRole[selectedRole.id]) {
      return permissionsByRole[selectedRole.id];
    }
    // Default tailored by role type
    const isSuper = selectedRole.id === "super-admin";
    const isAdmin = selectedRole.id === "admin";
    return defaultPermissionModules.map((p) => ({
      ...p,
      view: true,
      create: isSuper || isAdmin,
      edit: isSuper || isAdmin,
      delete: isSuper,
    }));
  }, [permissionsByRole, selectedRole]);

  // Current role's users
  const currentUsers = useMemo(() => {
    const list = usersByRole[selectedRole.id] || [];
    if (!userSearch.trim()) return list;
    const q = userSearch.toLowerCase();
    return list.filter(
      (u) =>
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.phone.toLowerCase().includes(q),
    );
  }, [usersByRole, selectedRole, userSearch]);

  // Filtered Roles (Card 1)
  const filteredRoles = useMemo(() => {
    if (!roleSearch.trim()) return roles;
    const q = roleSearch.toLowerCase();
    return roles.filter(
      (r) =>
        r.name.toLowerCase().includes(q) ||
        r.department.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q),
    );
  }, [roles, roleSearch]);

  /* =========================================================================
     ROLE ACTIONS
     ========================================================================= */

  const handleOpenAddRole = () => {
    setRoleToEdit(null);
    setRoleForm({
      name: "",
      department: "Operations Management",
      description: "",
      status: "Active",
    });
    setIsAddRoleModalOpen(true);
  };

  const handleOpenEditRole = (role: RoleItem, e: React.MouseEvent) => {
    e.stopPropagation();
    setRoleToEdit(role);
    setRoleForm({
      name: role.name,
      department: role.department,
      description: role.description,
      status: role.status,
    });
    setIsAddRoleModalOpen(true);
  };

  const handleSaveRole = (e: React.FormEvent) => {
    e.preventDefault();
    if (!roleForm.name.trim()) return;

    if (roleToEdit) {
      setRoles((prev) =>
        prev.map((r) => (r.id === roleToEdit.id ? { ...r, ...roleForm } : r)),
      );
      showToast(`Updated role: ${roleForm.name}`);
    } else {
      const newId = roleForm.name.toLowerCase().replace(/\s+/g, "-");
      const newRole: RoleItem = {
        id: `role-${Date.now()}`,
        ...roleForm,
        userCount: 0,
      };
      setRoles((prev) => [...prev, newRole]);
      setSelectedRoleId(newRole.id);
      showToast(`Created new role: ${roleForm.name}`);
    }
    setIsAddRoleModalOpen(false);
  };

  const confirmDeleteRole = () => {
    if (!roleToDelete) return;
    setRoles((prev) => prev.filter((r) => r.id !== roleToDelete.id));
    if (selectedRoleId === roleToDelete.id) {
      setSelectedRoleId(roles[0]?.id || "");
    }
    showToast(`Deleted role: ${roleToDelete.name}`);
    setRoleToDelete(null);
  };

  /* =========================================================================
     PERMISSION ACTIONS
     ========================================================================= */

  const handleTogglePermission = (
    permId: string,
    action: "view" | "create" | "edit" | "delete",
  ) => {
    setPermissionsByRole((prev) => {
      const existing = prev[selectedRole.id] || currentPermissions;
      const updated = existing.map((p) =>
        p.id === permId ? { ...p, [action]: !p[action] } : p,
      );
      return { ...prev, [selectedRole.id]: updated };
    });
  };

  const handleToggleAllModuleActions = (permId: string, enable: boolean) => {
    setPermissionsByRole((prev) => {
      const existing = prev[selectedRole.id] || currentPermissions;
      const updated = existing.map((p) =>
        p.id === permId
          ? {
              ...p,
              view: enable,
              create: enable,
              edit: enable,
              delete: enable,
            }
          : p,
      );
      return { ...prev, [selectedRole.id]: updated };
    });
  };

  const handleSaveAllPermissions = () => {
    showToast(`Saved permissions matrix for ${selectedRole.name}!`);
  };

  /* =========================================================================
     ASSIGN USER ACTIONS
     ========================================================================= */

  const handleAssignUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!assignUserForm.name.trim() || !assignUserForm.email.trim()) return;

    const newUser: AssignedUser = {
      id: `u-${Date.now()}`,
      name: assignUserForm.name,
      email: assignUserForm.email,
      phone: assignUserForm.phone || "+234 800 000 0000",
      avatar: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&h=80&fit=crop`,
      assignedDate: new Date().toLocaleDateString("en-GB"),
      status: "Active",
    };

    setUsersByRole((prev) => ({
      ...prev,
      [selectedRole.id]: [newUser, ...(prev[selectedRole.id] || [])],
    }));

    setRoles((prev) =>
      prev.map((r) =>
        r.id === selectedRole.id ? { ...r, userCount: r.userCount + 1 } : r,
      ),
    );

    setAssignUserForm({ name: "", email: "", phone: "" });
    setIsAssignUserModalOpen(false);
    showToast(`Assigned ${newUser.name} to ${selectedRole.name}`);
  };

  const handleRemoveUser = (userId: string, userName: string) => {
    setUsersByRole((prev) => ({
      ...prev,
      [selectedRole.id]: (prev[selectedRole.id] || []).filter(
        (u) => u.id !== userId,
      ),
    }));

    setRoles((prev) =>
      prev.map((r) =>
        r.id === selectedRole.id
          ? { ...r, userCount: Math.max(0, r.userCount - 1) }
          : r,
      ),
    );

    showToast(`Removed ${userName} from ${selectedRole.name}`);
  };

  return (
    <div className="flex flex-col gap-6 mx-auto pb-16">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-8 z-50 bg-[#1D3557] text-white text-xs px-4 py-3 rounded-lg shadow-xl flex items-center gap-2 animate-in fade-in slide-in-from-top-2 duration-200">
          <HiOutlineCheckCircle className="w-4 h-4 text-[#00BCD4]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-100 pb-5">
        <div>
          {/* <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
              Roles & Permissions
            </h1>
            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-brand-blue-light text-brand-blue border border-[#00BCD4]/20">
              Access Governance
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Define system roles, manage granular module capabilities, and audit
            assigned user memberships
          </p> */}
        </div>
      </div>

      {/* =========================================================================
          THE TWO CARDS LAYOUT
          Card 1: View and Create Roles (Left)
          Card 2: Permissions and Assigned Users (Right)
          ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* =====================================================================
            CARD 1: ROLES AND PERMISSION (VIEW AND CREATE ROLES)
            ===================================================================== */}
        <div className="lg:col-span-4 bg-white rounded-lg border border-gray-100 shadow-2xs overflow-hidden flex flex-col">
          {/* Card 1 Header */}
          <div className="p-4 border-b border-gray-100 flex flex-col gap-3 bg-gray-50/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-brand-blue-light border border-[#00BCD4]/20 text-[#00BCD4] flex items-center justify-center">
                  <HiOutlineShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-[#1D3557] uppercase tracking-wider">
                    Roles and Permission
                  </h2>
                  <span className="text-[11px] text-gray-400 font-medium">
                    {roles.length} System Roles
                  </span>
                </div>
              </div>

              {/* Create Role Button */}
              <Button
                variant="primary"
                shape="rounded-sm"
                className="bg-[#00BCD4] hover:bg-[#00acc1] text-white flex items-center gap-1 text-xs font-semibold px-3 py-1.5 cursor-pointer shadow-xs"
                onClick={handleOpenAddRole}
              >
                <HiOutlinePlus className="w-3.5 h-3.5" />
                <span>Create Role</span>
              </Button>
            </div>

            {/* Quick Search */}
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search roles..."
                value={roleSearch}
                onChange={(e) => setRoleSearch(e.target.value)}
                className="w-full text-xs pl-8 pr-3 py-1.5 bg-white border border-gray-200 rounded-md focus:outline-none focus:border-[#00BCD4] text-gray-800"
              />
              <HiOutlineMagnifyingGlass className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          {/* List of the 14 Roles */}
          <div className="flex flex-col divide-y divide-gray-100 max-h-160 overflow-y-auto">
            {filteredRoles.map((role) => {
              const isSelected = role.id === selectedRole.id;

              return (
                <div
                  key={role.id}
                  onClick={() => setSelectedRoleId(role.id)}
                  className={`p-3.5 transition-all cursor-pointer flex items-center justify-between gap-3 ${
                    isSelected
                      ? "bg-brand-blue-light/70 border-l-4 border-l-[#00BCD4] text-brand-blue"
                      : "hover:bg-gray-50/70 text-gray-700"
                  }`}
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-xs font-bold tracking-tight truncate ${
                          isSelected ? "text-brand-blue" : "text-gray-900"
                        }`}
                      >
                        {role.name}
                      </span>
                      {role.id === "super-admin" && (
                        <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-purple-50 text-purple-700 border border-purple-200 uppercase tracking-widest">
                          Master
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-gray-400 block truncate mt-0.5">
                      {role.department}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 border border-gray-200">
                      {role.userCount} {role.userCount === 1 ? "user" : "users"}
                    </span>

                    {/* Edit button */}
                    <button
                      type="button"
                      onClick={(e) => handleOpenEditRole(role, e)}
                      className="p-1 text-gray-400 hover:text-[#00BCD4] transition-colors cursor-pointer"
                      title="Edit role details"
                    >
                      <HiOutlinePencilSquare className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}

            {filteredRoles.length === 0 && (
              <div className="p-8 text-center text-gray-400 text-xs">
                No roles match your search.
              </div>
            )}
          </div>
        </div>

        {/* =====================================================================
            CARD 2: DETAILS WITH TWO TABS (PERMISSIONS, ASSIGNED USERS)
            ===================================================================== */}
        <div className="lg:col-span-8 bg-white rounded-lg border border-gray-100 shadow-2xs overflow-hidden flex flex-col">
          {/* Card 2 Header with Selected Role & Tabs */}
          <div className="p-4 sm:p-5 border-b border-gray-100 bg-gray-50/50 flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-bold text-[#1D3557]">
                    {selectedRole.name}
                  </h2>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                    {selectedRole.status}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-0.5">
                  {selectedRole.description}
                </p>
              </div>

              {activeRightTab === "Permissions" ? (
                <Button
                  variant="primary"
                  shape="rounded-sm"
                  className="bg-[#00BCD4] hover:bg-[#00acc1] text-white text-xs font-semibold px-4 py-1.5 cursor-pointer shadow-xs shrink-0"
                  onClick={handleSaveAllPermissions}
                >
                  Save Permissions
                </Button>
              ) : (
                <Button
                  variant="primary"
                  shape="rounded-sm"
                  className="bg-[#00BCD4] hover:bg-[#00acc1] text-white flex items-center gap-1.5 text-xs font-semibold px-4 py-1.5 cursor-pointer shadow-xs shrink-0"
                  onClick={() => setIsAssignUserModalOpen(true)}
                >
                  <HiOutlineUserPlus className="w-4 h-4" />
                  <span>Assign User</span>
                </Button>
              )}
            </div>

            {/* The Two Tabs: Permissions and Assigned Users */}
            <div className="flex items-center gap-2 border-b border-gray-200 pt-1">
              <button
                type="button"
                onClick={() => setActiveRightTab("Permissions")}
                className={`pb-2 px-3 text-xs font-bold transition-all cursor-pointer relative ${
                  activeRightTab === "Permissions"
                    ? "text-[#00BCD4] border-b-2 border-b-[#00BCD4]"
                    : "text-gray-500 hover:text-gray-800"
                }`}
              >
                <span className="flex items-center gap-1.5">
                  <HiOutlineKey className="w-3.5 h-3.5" />
                  <span>Permissions</span>
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveRightTab("Assigned Users")}
                className={`pb-2 px-3 text-xs font-bold transition-all cursor-pointer relative ${
                  activeRightTab === "Assigned Users"
                    ? "text-[#00BCD4] border-b-2 border-b-[#00BCD4]"
                    : "text-gray-500 hover:text-gray-800"
                }`}
              >
                <span className="flex items-center gap-1.5">
                  <HiOutlineUserGroup className="w-3.5 h-3.5" />
                  <span>Assigned Users ({currentUsers.length})</span>
                </span>
              </button>
            </div>
          </div>

          {/* ===================================================================
              TAB CONTENT 1: PERMISSIONS
              =================================================================== */}
          {activeRightTab === "Permissions" && (
            <div className="p-4 sm:p-5 flex flex-col gap-4">
              <div className="flex items-center justify-between text-xs text-gray-500 pb-2 border-b border-gray-100">
                <span className="font-semibold text-gray-700">
                  Granular Module Access Matrix
                </span>
                <span className="text-[11px] text-gray-400 font-mono">
                  {currentPermissions.length} modules configured
                </span>
              </div>

              <div className="divide-y divide-gray-100">
                {currentPermissions.map((perm) => (
                  <div
                    key={perm.id}
                    className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-gray-50/50 p-2 rounded-lg transition-colors"
                  >
                    <div className="min-w-0 max-w-md">
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs font-bold text-gray-900">
                          {perm.name}
                        </h4>
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-gray-100 text-gray-600 font-medium">
                          {perm.category}
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-500 mt-0.5 leading-relaxed">
                        {perm.description}
                      </p>
                    </div>

                    {/* CRUD Toggles */}
                    <div className="flex items-center gap-3 shrink-0">
                      {(["view", "create", "edit", "delete"] as const).map(
                        (action) => {
                          const isChecked = perm[action];
                          return (
                            <label
                              key={action}
                              className="inline-flex items-center gap-1.5 cursor-pointer select-none text-[11px] font-semibold text-gray-600"
                            >
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={() =>
                                  handleTogglePermission(perm.id, action)
                                }
                                className="w-3.5 h-3.5 rounded text-[#00BCD4] focus:ring-[#00BCD4] accent-[#00BCD4] cursor-pointer"
                              />
                              <span className="capitalize">{action}</span>
                            </label>
                          );
                        },
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ===================================================================
              TAB CONTENT 2: ASSIGNED USERS
              =================================================================== */}
          {activeRightTab === "Assigned Users" && (
            <div className="flex flex-col">
              {/* Search user bar */}
              <div className="p-3 border-b border-gray-100 bg-white">
                <div className="relative w-full">
                  <input
                    type="text"
                    placeholder="Search assigned members by name, email, or phone..."
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                    className="w-full text-xs pl-8 pr-3 py-1.5 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:border-[#00BCD4] text-gray-800"
                  />
                  <HiOutlineMagnifyingGlass className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              {/* Users Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-150">
                  <thead>
                    <tr className="border-b border-gray-100 bg-gray-50/50 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                      <th className="py-3 px-4 w-12 text-center">#</th>
                      <th className="py-3 px-4">Member Name</th>
                      <th className="py-3 px-4">Email</th>
                      <th className="py-3 px-4">Phone</th>
                      <th className="py-3 px-4">Assigned On</th>
                      <th className="py-3 px-4 text-center">Status</th>
                      <th className="py-3 px-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-xs text-gray-700">
                    {currentUsers.map((user, idx) => (
                      <tr
                        key={user.id}
                        className="hover:bg-gray-50/60 transition-colors"
                      >
                        <td className="py-3 px-4 text-center font-mono text-gray-400 text-xs">
                          {idx + 1}
                        </td>
                        <td className="py-3 px-4 font-bold text-gray-900">
                          <div className="flex items-center gap-2.5">
                            <img
                              src={user.avatar}
                              alt={user.name}
                              className="w-7 h-7 rounded-full object-cover border border-gray-200"
                            />
                            <span>{user.name}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 font-mono text-gray-600">
                          {user.email}
                        </td>
                        <td className="py-3 px-4 font-mono text-gray-600">
                          {user.phone}
                        </td>
                        <td className="py-3 px-4 text-gray-500">
                          {user.assignedDate}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                            {user.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            type="button"
                            onClick={() => handleRemoveUser(user.id, user.name)}
                            className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                            title="Remove user from this role"
                          >
                            <HiOutlineTrash className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}

                    {currentUsers.length === 0 && (
                      <tr>
                        <td
                          colSpan={7}
                          className="py-12 text-center text-gray-400 text-xs"
                        >
                          <HiOutlineUserGroup className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                          <p className="font-bold text-gray-700">
                            No users currently assigned to this role
                          </p>
                          <p className="text-gray-400 mt-0.5">
                            Click &quot;Assign User&quot; above to grant this
                            role to a staff or team member.
                          </p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* =========================================================================
          MODAL: ADD / CREATE ROLE
          ========================================================================= */}
      {isAddRoleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-lg border border-gray-100 shadow-2xl w-full max-w-md overflow-hidden flex flex-col">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <h3 className="text-sm font-bold text-gray-900">
                {roleToEdit ? "Edit Role" : "Create New Role"}
              </h3>
              <button
                type="button"
                onClick={() => setIsAddRoleModalOpen(false)}
                className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <HiOutlineXMark className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveRole} className="p-5 flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Role Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Field Service Technician"
                  value={roleForm.name}
                  onChange={(e) =>
                    setRoleForm((prev) => ({ ...prev, name: e.target.value }))
                  }
                  className="w-full text-xs font-semibold px-3 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-[#00BCD4] text-gray-800"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Department *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Field Operations & Solar"
                  value={roleForm.department}
                  onChange={(e) =>
                    setRoleForm((prev) => ({
                      ...prev,
                      department: e.target.value,
                    }))
                  }
                  className="w-full text-xs font-semibold px-3 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-[#00BCD4] text-gray-800"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Responsibilities and permission scope for this role..."
                  value={roleForm.description}
                  onChange={(e) =>
                    setRoleForm((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  className="w-full text-xs p-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-[#00BCD4] text-gray-800 leading-relaxed"
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg border border-gray-100 bg-gray-50/50">
                <span className="text-xs font-bold text-gray-700">Status</span>
                <select
                  value={roleForm.status}
                  onChange={(e) =>
                    setRoleForm((prev) => ({
                      ...prev,
                      status: e.target.value as "Active" | "Inactive",
                    }))
                  }
                  className="text-xs font-semibold px-2.5 py-1 bg-white border border-gray-200 rounded-md focus:outline-none focus:border-[#00BCD4] text-gray-800"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              <div className="pt-2 border-t border-gray-100 flex items-center justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  shape="rounded-sm"
                  className="text-xs font-semibold px-3 py-1.5 border-gray-200 cursor-pointer"
                  onClick={() => setIsAddRoleModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  shape="rounded-sm"
                  className="bg-[#00BCD4] hover:bg-[#00acc1] text-white text-xs font-semibold px-4 py-1.5 cursor-pointer shadow-xs"
                >
                  {roleToEdit ? "Update Role" : "Create Role"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: ASSIGN USER
          ========================================================================= */}
      {isAssignUserModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-lg border border-gray-100 shadow-2xl w-full max-w-md overflow-hidden flex flex-col">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <h3 className="text-sm font-bold text-gray-900">
                Assign User to {selectedRole.name}
              </h3>
              <button
                type="button"
                onClick={() => setIsAssignUserModalOpen(false)}
                className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <HiOutlineXMark className="w-4 h-4" />
              </button>
            </div>

            <form
              onSubmit={handleAssignUser}
              className="p-5 flex flex-col gap-4"
            >
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Olawale Johnson"
                  value={assignUserForm.name}
                  onChange={(e) =>
                    setAssignUserForm((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }))
                  }
                  className="w-full text-xs font-semibold px-3 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-[#00BCD4] text-gray-800"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  placeholder="e.g. o.johnson@koolbuy.store"
                  value={assignUserForm.email}
                  onChange={(e) =>
                    setAssignUserForm((prev) => ({
                      ...prev,
                      email: e.target.value,
                    }))
                  }
                  className="w-full text-xs font-semibold px-3 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-[#00BCD4] text-gray-800"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Phone Number
                </label>
                <input
                  type="text"
                  placeholder="e.g. +234 803 123 4567"
                  value={assignUserForm.phone}
                  onChange={(e) =>
                    setAssignUserForm((prev) => ({
                      ...prev,
                      phone: e.target.value,
                    }))
                  }
                  className="w-full text-xs font-mono px-3 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-[#00BCD4] text-gray-800"
                />
              </div>

              <div className="pt-2 border-t border-gray-100 flex items-center justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  shape="rounded-sm"
                  className="text-xs font-semibold px-3 py-1.5 border-gray-200 cursor-pointer"
                  onClick={() => setIsAssignUserModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  shape="rounded-sm"
                  className="bg-[#00BCD4] hover:bg-[#00acc1] text-white text-xs font-semibold px-4 py-1.5 cursor-pointer shadow-xs"
                >
                  Assign User
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {roleToDelete && (
        <ConfirmationModal
          isOpen={true}
          onClose={() => setRoleToDelete(null)}
          onConfirm={confirmDeleteRole}
          title="Delete Role"
          message={`Are you sure you want to delete "${roleToDelete.name}"? Users with this role will lose their assigned privileges.`}
          confirmText="Yes, Delete"
          cancelText="Cancel"
          type="danger"
        />
      )}
    </div>
  );
}
