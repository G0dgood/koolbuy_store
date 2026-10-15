"use client";

import React from "react";
import { StoreProductGrid, StoreSectionHeader } from "./StoreUi";



const dealProducts = [
  {
    id: "d1",
    name: "Kool Bruhm 60ah Pedestal ...",
    vendor: "Koolbuy - Solar Energy and El...",
    price: "₦1,287,600.00",
    image: "/images/koolboks/items/1.webp",
  },
  {
    id: "d2",
    name: "Kool Bruhm 100ah Pedesta...",
    vendor: "Koolbuy - GOLDEN CROWN ELE...",
    price: "₦1,662,370.00",
    image: "/images/koolboks/items/4.webp",
  },
  {
    id: "d3",
    name: "Kool-242L Somotex - Glass...",
    vendor: "Koolbuy - Don Vic LTD",
    price: "₦2,100,000.00",
    image: "/images/koolboks/items/3.webp",
  },
  {
    id: "d4",
    name: "Kool Thermocool 100ah Pe...",
    vendor: "Koolbuy - Quality Naija Stores",
    price: "₦1,662,370.00",
    image: "/images/koolboks/items/4.webp",
  },
  {
    id: "d5",
    name: "Kool Thermocool 100ah Pe...",
    vendor: "Koolbuy - Thermocool Showr...",
    price: "₦1,662,370.00",
    image: "/images/koolboks/items/4.webp",
  },
  {
    id: "d6",
    name: "230L Hisense Freezer",
    vendor: "Koolbuy - Olas & BS Electronics",
    price: "₦430,000.00",
    image: "/images/koolboks/items/5.webp",
  },
];

const DealsSection = () => {
  return (
    <section className="w-full flex flex-col gap-6">
      <StoreSectionHeader title="On sale" subtitle="Great prices on freezers and power." href="/products" />
      <StoreProductGrid products={dealProducts} />
    </section>
  );
};

export { DealsSection };
