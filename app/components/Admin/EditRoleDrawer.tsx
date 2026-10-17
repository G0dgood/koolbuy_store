"use client";

import React, { useState, useEffect } from "react";
import Drawer from "../Drawer/Drawer";
import { Button } from "../Button";
import { Icon } from "../Icon";
import Checkbox from "@/app/components/Checkbox";

interface EditRoleDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  role: any;
}

const modules = [
  { id: "products", label: "Products & Inventory" },
  { id: "orders", label: "Orders & Shipping" },
  { id: "customers", label: "Customer Management" },
  { id: "reviews", label: "Reviews & Feedback" },
  { id: "transactions", label: "Financial Data" },
  { id: "settings", label: "System Settings" },
];

const accessTypes = [
  { id: "view", label: "View" },
  { id: "create", label: "Create" },
  { id: "edit", label: "Edit" },
  { id: "delete", label: "Delete" },
];

export function EditRoleDrawer({ isOpen, onClose, role }: EditRoleDrawerProps) {
  // permissionState[moduleId][accessTypeId] = boolean
  const [permissionState, setPermissionState] = useState<Record<string, Record<string, boolean>>>({});

  useEffect(() => {
    if (role) {
      const initial: Record<string, Record<string, boolean>> = {};
      modules.forEach(m => {
        initial[m.id] = {};
        accessTypes.forEach(a => {
           // Mock logic: Super Admin gets all, others get View only by default
           initial[m.id][a.id] = role.name === "Super Admin" || a.id === "view";
        });
      });
      setPermissionState(initial);
    }
  }, [role]);

  const togglePermission = (moduleId: string, accessId: string) => {
    setPermissionState(prev => ({
      ...prev,
      [moduleId]: {
        ...prev[moduleId],
        [accessId]: !prev[moduleId][accessId]
      }
    }));
  };

  const toggleRow = (moduleId: string) => {
    const allOn = accessTypes.every(a => permissionState[moduleId]?.[a.id]);
    setPermissionState(prev => ({
      ...prev,
      [moduleId]: accessTypes.reduce((acc, a) => ({ ...acc, [a.id]: !allOn }), {})
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Updating Access Matrix:", { roleId: role.id, matrix: permissionState });
    onClose();
  };

  if (!role) return null;

  return (
    <Drawer isOpen={isOpen} onClose={onClose} title="Administrative Access Matrix">
      <form onSubmit={handleSubmit} className="flex flex-col h-full gap-8">
        <div className="flex flex-col gap-8">
          {/* Header Card */}
          <div className="bg-brand-charcoal rounded-lg p-6 text-white relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-[0.05] rounded-full -translate-y-12 translate-x-12" />
             <div className="flex flex-col gap-1 relative z-10">
                <span className="text-[11px] font-semibold opacity-60">Policy governance</span>
                <h3 className="text-xl font-semibold">{role.name}</h3>
                <p className="text-[11px] font-medium opacity-70 mt-1 max-w-[240px]">Define granular access rules for this administrative role across all system modules.</p>
             </div>
          </div>

          <div className="flex flex-col gap-4">
            {/* Matrix Header */}
            <div className="grid grid-cols-12 gap-2 px-1 items-center">
               <div className="col-span-5 text-[12px] font-medium text-subtle">System module</div>
               {accessTypes.map(a => (
                 <div key={a.id} className="col-span-1.5 text-center text-[12px] font-medium text-subtle">{a.label}</div>
               ))}
               <div className="col-span-1 text-right text-[12px] font-medium text-subtle">All</div>
            </div>

            <div className="flex flex-col gap-2">
              {modules.map((module) => (
                <div 
                  key={module.id} 
                  className="grid grid-cols-12 gap-2 items-center p-3 sm:p-4 bg-white border border-light-gray rounded-lg hover:border-brand-orange/15 hover:shadow-lift transition-all group"
                >
                  <div className="col-span-5 flex flex-col gap-0.5">
                    <span className="text-[13px] font-semibold text-brand-charcoal group-hover:text-brand-orange-text transition-colors">{module.label}</span>
                  </div>
                  
                  {accessTypes.map(a => (
                    <div key={a.id} className="col-span-1.5 flex justify-center">
                       <Checkbox 
                         checked={permissionState[module.id]?.[a.id] || false}
                         onChange={() => togglePermission(module.id, a.id)}
                       />
                    </div>
                  ))}

                  <div className="col-span-1 flex justify-end">
                     <button 
                       type="button" 
                       onClick={() => toggleRow(module.id)}
                       className="w-6 h-6 rounded-lg bg-off-white flex items-center justify-center text-faint hover:bg-brand-orange-soft hover:text-brand-orange-text transition-all"
                     >
                        <Icon name="verified" folder="icon" size="xs" />
                     </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Security Warning */}
          <div className="p-4 bg-error-soft/50 rounded-lg border border-error/20 flex gap-4 items-start">
             <div className="w-8 h-8 rounded-lg bg-error-soft flex items-center justify-center text-error shrink-0 mt-0.5">
                <Icon name="ic_round-logout" folder="dashboardIcon" size="xs" className="rotate-90" />
             </div>
             <div className="flex flex-col gap-1">
                <span className="text-[11px] font-semibold text-error">Elevation warning</span>
                <p className="text-[11px] font-medium text-error leading-relaxed">
                   Changes to the access matrix are global. Elevated permissions will be applied to all members assigned to this role immediately upon synchronization.
                </p>
             </div>
          </div>
        </div>

        <div className="mt-auto pt-8 border-t border-light-gray flex flex-col gap-3 pb-8">
          <Button 
            variant="primary" 
            type="submit"
            className="w-full h-10 text-[12px] font-semibold animate-pulse-subtle"
          >
            Deploy governance update
          </Button>
          <Button 
            variant="outline" 
            type="button" 
            onClick={onClose}
            className="w-full h-10 text-[11px] font-semibold text-faint group hover:text-brand-charcoal border-light-gray transition-all"
          >
            Discard Changes
          </Button>
        </div>
      </form>
    </Drawer>
  );
}
