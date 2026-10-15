"use client";

import React, { useState, useEffect } from "react";
import { LoginForm } from "../components/Auth/LoginForm";
import { LoginAdvert } from "../components/Auth/LoginAdvert";
import { LoginBackground } from "../components/Auth/LoginBackground";
import { getAdvertConfig } from "../utils/advertState";

export default function LoginPage() {
  const [layout, setLayout] = useState<"left-form" | "right-form">("left-form");

  useEffect(() => {
    setLayout(getAdvertConfig().layout);

    const handleUpdate = () => {
      setLayout(getAdvertConfig().layout);
    };

    window.addEventListener("advertConfigUpdated", handleUpdate);
    return () => window.removeEventListener("advertConfigUpdated", handleUpdate);
  }, []);

  return (
    <div className={`relative min-h-screen w-full flex flex-col gap-4 md:gap-6 p-4 md:p-6 bg-off-white
      ${layout === "right-form" ? "lg:flex-row-reverse" : "lg:flex-row"}
    `}>
      {/* Floating Login Card */}
      <div className="flex-1 lg:flex-none lg:w-[46%] xl:w-[42%] flex items-center justify-center py-6 md:py-10 order-2 lg:order-none">
        <LoginForm />
      </div>

      {/* Advert tile: background photos with the advert copy on top */}
      <div className="group relative h-56 sm:h-72 lg:h-auto lg:flex-1 rounded-tile md:rounded-hero overflow-hidden flex items-end justify-end p-8 xl:p-12 order-1 lg:order-none">
        {/* Immersive Background Advert Component */}
        <LoginBackground />

        {/* Expanded Advert Details */}
        <LoginAdvert />
      </div>
    </div>
  );
}
