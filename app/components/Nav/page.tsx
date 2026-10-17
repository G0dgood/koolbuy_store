"use client";

import React, { useState } from "react";
import { VerticalMenu, Pagination } from "@/app/components/Navigation";
import { TabFilter, LinkTabs } from "@/app/components/Tabs";
import { Icon } from "@/app/components/Icon";

export default function NavDemo() {
  const [activeMenu, setActiveMenu] = useState("active");
  const [activeTab, setActiveTab] = useState("active");
  const [activeIconTab, setActiveIconTab] = useState("tab-1");
  const [currentPage, setCurrentPage] = useState(2);
  const [currentPage2, setCurrentPage2] = useState(1);
  const [pageSize, setPageSize] = useState(15);

  const menuItems = [
    { id: "active", label: "Active menu" },
    { id: "item1", label: "Menu item" },
    { id: "item2", label: "Menu item" },
    { id: "item3", label: "Menu item" },
  ];

  const tabItems = [
    { value: "active", label: "Active" },
    { value: "first", label: "First" },
    { value: "second", label: "Second", count: 12 },
    { value: "third", label: "Third" },
  ];

  const iconTabs = [
    { value: "tab-1", label: "Grid", icon: <Icon name="grid_view" size="sm" /> },
    { value: "tab-2", label: "Tab" },
    { value: "tab-3", label: "Tab" },
  ];

  return (
    <div className="min-h-screen bg-off-white p-12 font-sans">
      <div className="max-w-6xl mx-auto bg-white rounded-xl  p-16">
        <h1 className="text-4xl font-bold mb-16 text-black">Nav, Tab, Pagination</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-20">
          {/* Vertical Menu Section */}
          <section>
            <h2 className="text-xl font-bold mb-8 text-black">Vertical menu</h2>
            <VerticalMenu
              items={menuItems}
              activeId={activeMenu}
              onItemClick={setActiveMenu}
            />
          </section>

          {/* Tabs Section: every tab row in the app uses these */}
          <section>
            <h2 className="text-xl font-bold mb-8 text-black">Tabs</h2>
            <div className="border border-gray-100 rounded-lg p-8 min-h-[250px] bg-white flex flex-col gap-6">
              <TabFilter ariaLabel="Demo tabs" options={tabItems} activeTab={activeTab} onChange={setActiveTab} />
              <TabFilter ariaLabel="Demo icon tabs" options={iconTabs} activeTab={activeIconTab} onChange={setActiveIconTab} />
            </div>
          </section>

          {/* Link Tabs Section */}
          <section>
            <h2 className="text-xl font-bold mb-8 text-black">Link tabs</h2>
            <div className="border border-gray-100 rounded-lg p-8 min-h-[250px] bg-white">
              <LinkTabs
                ariaLabel="Demo link tabs"
                activeHref="/components/Nav"
                links={[
                  { href: "/components/Nav", label: "Nav" },
                  { href: "/buttons", label: "Buttons" },
                  { href: "/form", label: "Form" },
                ]}
              />
            </div>
          </section>
        </div>

        {/* Pagination Section */}
        <section className="mb-20">
          <h2 className="text-xl font-bold mb-8 text-black">Pagination</h2>
          <div className="flex flex-col gap-8">
            <Pagination
              currentPage={currentPage}
              totalPages={5}
              onPageChange={setCurrentPage}
            />

            <Pagination
              currentPage={currentPage2}
              totalPages={3}
              onPageChange={setCurrentPage2}
              showSizeChanger={true}
              pageSize={pageSize}
              onPageSizeChange={setPageSize}
            />
          </div>
        </section>

        <div className="mt-24 pt-12 border-t border-gray-200">
          <h3 className="text-gray-400 font-semibold mb-8 uppercase tracking-wider">Base components</h3>

          <div className="flex flex-col gap-12">
            {/* Base Menu Variants */}
            <div className="flex items-center gap-12">
              <div className="w-48 bg-gray-50 p-2 rounded-md font-medium text-sm text-gray-900">
                Active menu
              </div>
              <div className="flex items-center gap-3 w-48 bg-gray-50 p-2 rounded-md font-medium text-sm text-gray-900">
                <Icon name="grid_view" size="sm" className="text-gray-500" />
                Active menu
              </div>
            </div>

            <div className="flex items-center gap-12">
              <div className="w-48 p-2 font-medium text-sm text-gray-600">
                Menu item
              </div>
              <div className="flex items-center gap-3 w-48 p-2 font-medium text-sm text-gray-600">
                <Icon name="grid_view" size="sm" className="text-gray-400" />
                Menu item
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
