"use client";

import React from "react";
import { Icon } from "../Icon";
import { Button } from "../Button";

const bestSellingData = [
 {
  name: "Kool Scanfrost 600L Inverter Freezer",
  orders: 104,
  status: "Stock",
  price: "₦1,406,000",
  image: "/images/koolboks/items/5.webp",
  color: "bg-[#4CAF50]",
 },
 {
  name: "Kool Bruhm 100ah Pedestal Freezer",
  orders: 56,
  status: "Stock out",
  price: "₦1,662,370",
  image: "/images/koolboks/items/4.webp",
  color: "bg-red-500",
 },
 {
  name: "Kool-242L Somotex Glass Door Freezer",
  orders: 266,
  status: "Stock",
  price: "₦2,100,000",
  image: "/images/koolboks/items/3.webp",
  color: "bg-[#4CAF50]",
 },
 {
  name: "230L Hisense Deep Chest Freezer",
  orders: 506,
  status: "Stock",
  price: "₦430,000",
  image: "/images/koolboks/items/1.webp",
  color: "bg-[#4CAF50]",
 },
];

export function BestSellingProductTable() {
 return (
  <div className="bg-white p-8 rounded-[6px] border border-gray-100 shadow-sm flex flex-col gap-6">
   <div className="flex justify-between items-center">
    <h3 className="text-[18px] font-black text-[#1D3557]">Best selling product</h3>
    <Button
     variant="blue"
     iconRight={<Icon name="sort" folder="dashboardIcon" size="sm" />}
     className="text-[11px] font-black px-6 h-9 rounded-[6px]"
    >
     Filter
    </Button>
   </div>

   <div className="admin-table-container">
    <table>
     <thead>
      <tr>
       <th className="pl-4">PRODUCT</th>
       <th>TOTAL ORDER</th>
       <th>STATUS</th>
       <th className="text-right">PRICE</th>
      </tr>
     </thead>
     <tbody>
      {bestSellingData.map((p, i) => (
       <tr key={i} className="group">
        <td className="pl-4">
         <div className="flex items-center gap-4">
          <img
           src={p.image}
           className="w-10 h-10 rounded-[6px] object-contain bg-gray-50 border border-gray-100 p-1"
          />
          <span className="text-[12px] font-black text-[#1D3557]">{p.name}</span>
         </div>
        </td>
        <td className="text-[12px] font-bold text-gray-500">{p.orders}</td>
        <td>
         <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${p.color}`}></span>
          <span className="text-[12px] font-bold text-[#1D3557]">{p.status}</span>
         </div>
        </td>
        <td className="text-[12px] font-black text-[#1D3557] text-right">{p.price}</td>
       </tr>
      ))}
     </tbody>
    </table>
   </div>

   <div className="flex justify-end pt-2">
    <Button
     variant="blue"
     className="text-[10px] font-black uppercase tracking-widest px-8 h-10 rounded-[6px]"
    >
     Details
    </Button>
   </div>
  </div>
 );
}
