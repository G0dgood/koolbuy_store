"use client";

import React, { useState } from "react";
import { Icon } from "@/app/components/Icon";
import { Button } from "@/app/components/Button";
import { Input, Textarea } from "@/app/components/Form/Inputs";
import { Select } from "@/app/components/Form/Select";
import { ConfirmationModal } from "@/app/components/Admin/ConfirmationModal";
import {
  HiPaintBrush,
  HiDevicePhoneMobile,
  HiSwatch,
  HiSquares2X2,
  HiPhoto,
  HiEye,
  HiCheckCircle,
  HiArrowPath,
  HiPlus,
  HiTrash,
  HiArrowsUpDown,
  HiBars3,
} from "react-icons/hi2";

type StylingSection =
  | "fonts"
  | "colors"
  | "tab-bar"
  | "tutorial-images"
  | "home-style"
  | "home-sections";

interface TutorialSlide {
  id: string;
  title: string;
  description: string;
  image: string;
  active: boolean;
}

interface HomeSection {
  id: string;
  name: string;
  type:
    | "banner"
    | "categories"
    | "deals"
    | "bnpl"
    | "brands"
    | "products"
    | "reviews";
  enabled: boolean;
  layout: "grid" | "carousel" | "scroll";
}

export default function AppStylingPage() {
  const [activeSection, setActiveSection] = useState<StylingSection>("fonts");
  const [isSavedModalOpen, setIsSavedModalOpen] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");

  // 1. Font Styles
  const [fonts, setFonts] = useState({
    fontFamily: "Outfit, sans-serif",
    headingWeight: "Bold (700)",
    bodyWeight: "Regular (400)",
    baseFontSize: "14px",
    headingScale: "1.25 (Major Third)",
    letterSpacing: "0.01em",
  });

  // 2. Color Palette
  const [colors, setColors] = useState({
    primary: "#2196F3",
    secondary: "#0284C7",
    accent: "#F59E0B",
    background: "#F8FAFC",
    surface: "#FFFFFF",
    textPrimary: "#0F172A",
    textSecondary: "#64748B",
    success: "#10B981",
    danger: "#EF4444",
  });

  // 3. Tab Bar Style
  const [tabBarStyle, setTabBarStyle] = useState({
    layout: "docked", // "docked" | "floating" | "pill"
    backgroundType: "glass", // "solid" | "glass" | "dark"
    activeColor: "#2196F3",
    inactiveColor: "#94A3B8",
    showLabels: true,
    showCenterActionButton: true,
    actionButtonIcon: "cart",
  });

  // 4. Tutorial Images (Onboarding Slides)
  const [tutorialSlides, setTutorialSlides] = useState<TutorialSlide[]>([
    {
      id: "slide-1",
      title: "Clean Energy Solar Refrigeration",
      description:
        "Keep food and drinks frozen 24/7 with zero reliance on the national electric grid.",
      image: "/images/koolboks/items/5.webp",
      active: true,
    },
    {
      id: "slide-2",
      title: "Flexible Pay-As-You-Go Plans",
      description:
        "Own an inverter freezer today with low down payments and 3 to 12 month installments.",
      image: "/images/koolboks/items/4.webp",
      active: true,
    },
    {
      id: "slide-3",
      title: "Nationwide Delivery & Support",
      description:
        "Express shipping directly to your doorstep with certified technical service warranty.",
      image: "/images/koolboks/items/1.webp",
      active: true,
    },
  ]);
  const [newSlide, setNewSlide] = useState({
    title: "",
    description: "",
    image: "",
  });

  // 5. Home Page Style
  const [homeStyle, setHomeStyle] = useState({
    headerStyle: "brand-search", // "brand-search" | "story-circles" | "minimal"
    bannerAnimation: "carousel", // "carousel" | "fade" | "stacked"
    cardCornerRadius: "16px",
    cardShadow: "subtle", // "none" | "subtle" | "elevated"
    productCardStyle: "two-column", // "two-column" | "masonry" | "single-feed"
  });

  // 6. Home Page Sections
  const [homeSections, setHomeSections] = useState<HomeSection[]>([
    {
      id: "sec-1",
      name: "Hero Promotional Carousel Banners",
      type: "banner",
      enabled: true,
      layout: "carousel",
    },
    {
      id: "sec-2",
      name: "Quick Product Categories",
      type: "categories",
      enabled: true,
      layout: "scroll",
    },
    {
      id: "sec-3",
      name: "Flash Deals & Limited Offers",
      type: "deals",
      enabled: true,
      layout: "carousel",
    },
    {
      id: "sec-4",
      name: "Featured BNPL Installment Freezers",
      type: "bnpl",
      enabled: true,
      layout: "grid",
    },
    {
      id: "sec-5",
      name: "Partner Brands Showcase (Scanfrost & Bruhm)",
      type: "brands",
      enabled: true,
      layout: "scroll",
    },
    {
      id: "sec-6",
      name: "Trending Solar Chest Freezers",
      type: "products",
      enabled: true,
      layout: "grid",
    },
    {
      id: "sec-7",
      name: "Verified Customer Reviews & Stories",
      type: "reviews",
      enabled: true,
      layout: "scroll",
    },
  ]);

  const handleSave = (sectionTitle: string) => {
    setSaveMessage(
      `${sectionTitle} settings have been successfully applied to the mobile app!`,
    );
    setIsSavedModalOpen(true);
  };

  const navItems = [
    { id: "fonts", label: "Font Styles", icon: HiPaintBrush },
    { id: "colors", label: "Color Picker", icon: HiSwatch },
    { id: "tab-bar", label: "Tab Bar Style", icon: HiSquares2X2 },
    { id: "tutorial-images", label: "Tutorial Images", icon: HiPhoto },
    { id: "home-style", label: "Home Page Style", icon: HiDevicePhoneMobile },
    { id: "home-sections", label: "Home Page Sections", icon: HiBars3 },
  ];

  return (
    <div className="flex flex-col gap-6 max-w-400 mx-auto pb-16 p-2 sm:p-4">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-100 pb-5">
        <div>
          {/* <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">App Styling</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-brand-blue border border-blue-100">
              Mobile App Theme
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Customize mobile app typography, color palettes, bottom tab navigation, tutorial splash screens, and dynamic home page sections.
          </p> */}
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="blue"
            iconLeft={<HiCheckCircle className="w-4 h-4" />}
            onClick={() => handleSave("Mobile App Theme")}
          >
            Publish App Theme
          </Button>
        </div>
      </div>

      {/* Main Grid: Controls on Left (8 cols), Interactive Device Preview on Right (4 cols) */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        {/* Left Column: Configuration Controls (8 cols) */}
        <div className="xl:col-span-8 flex flex-col gap-6">
          {/* Section Navigation Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-gray-100 custom-scrollbar">
            {navItems.map((item) => {
              const IconComponent = item.icon;
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id as StylingSection)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                    isActive
                      ? "bg-brand-blue text-white shadow-sm shadow-brand-blue/20"
                      : "bg-white text-gray-600 border border-gray-100 hover:bg-gray-50 hover:text-brand-blue"
                  }`}
                >
                  <IconComponent
                    className={`w-4 h-4 ${isActive ? "text-white" : "text-gray-400"}`}
                  />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* 1. FONT STYLES */}
          {activeSection === "fonts" && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8 flex flex-col gap-6">
              <div className="flex justify-between items-center border-b border-gray-50 pb-4">
                <div>
                  <h3 className="text-base font-bold text-gray-900">
                    Mobile Typography & Fonts
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Define primary typefaces, font weights, and text scales
                    across the mobile app.
                  </p>
                </div>
                <Button
                  variant="blue"
                  size="sm"
                  onClick={() => handleSave("Typography")}
                >
                  Save Fonts
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-gray-600 uppercase">
                    Primary App Font Family
                  </label>
                  <Select
                    value={fonts.fontFamily}
                    onChange={(val) =>
                      setFonts({ ...fonts, fontFamily: val as string })
                    }
                    options={[
                      {
                        label: "Outfit (Modern & Clean)",
                        value: "Outfit, sans-serif",
                      },
                      {
                        label: "Inter (Technical & Readable)",
                        value: "Inter, sans-serif",
                      },
                      {
                        label: "Plus Jakarta Sans (Premium Display)",
                        value: "Plus Jakarta Sans, sans-serif",
                      },
                      {
                        label: "Poppins (Rounded & Friendly)",
                        value: "Poppins, sans-serif",
                      },
                      {
                        label: "Roboto (Classic Material)",
                        value: "Roboto, sans-serif",
                      },
                    ]}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-gray-600 uppercase">
                    Base Font Size
                  </label>
                  <Select
                    value={fonts.baseFontSize}
                    onChange={(val) =>
                      setFonts({ ...fonts, baseFontSize: val as string })
                    }
                    options={[
                      { label: "13px (Compact UI)", value: "13px" },
                      { label: "14px (Standard Default)", value: "14px" },
                      { label: "15px (Enhanced Readability)", value: "15px" },
                      { label: "16px (Large Text)", value: "16px" },
                    ]}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-gray-600 uppercase">
                    Heading Font Weight
                  </label>
                  <Select
                    value={fonts.headingWeight}
                    onChange={(val) =>
                      setFonts({ ...fonts, headingWeight: val as string })
                    }
                    options={[
                      { label: "SemiBold (600)", value: "SemiBold (600)" },
                      { label: "Bold (700)", value: "Bold (700)" },
                      { label: "ExtraBold (800)", value: "ExtraBold (800)" },
                    ]}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-gray-600 uppercase">
                    Heading Size Scale
                  </label>
                  <Select
                    value={fonts.headingScale}
                    onChange={(val) =>
                      setFonts({ ...fonts, headingScale: val as string })
                    }
                    options={[
                      {
                        label: "1.20 (Minor Third)",
                        value: "1.20 (Minor Third)",
                      },
                      {
                        label: "1.25 (Major Third - Recommended)",
                        value: "1.25 (Major Third)",
                      },
                      {
                        label: "1.33 (Perfect Fourth)",
                        value: "1.33 (Perfect Fourth)",
                      },
                    ]}
                  />
                </div>
              </div>

              {/* Font Preview Card */}
              <div className="bg-gray-50/70 rounded-xl p-5 border border-gray-100 flex flex-col gap-2">
                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                  Live Typography Sample ({fonts.fontFamily.split(",")[0]})
                </span>
                <p
                  className="text-2xl font-bold text-gray-900"
                  style={{ fontFamily: fonts.fontFamily }}
                >
                  Kool - Scanfrost Inverter Solar Freezer
                </p>
                <p
                  className="text-sm text-gray-600"
                  style={{ fontFamily: fonts.fontFamily }}
                >
                  Pay in flexible monthly installments of ₦468,666 with zero
                  deposit required for verified merchants.
                </p>
              </div>
            </div>
          )}

          {/* 2. COLOR PICKER */}
          {activeSection === "colors" && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8 flex flex-col gap-6">
              <div className="flex justify-between items-center border-b border-gray-50 pb-4">
                <div>
                  <h3 className="text-base font-bold text-gray-900">
                    App Color Palette & Themes
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Configure primary brand tones, accents, card backgrounds,
                    and button colors.
                  </p>
                </div>
                <Button
                  variant="blue"
                  size="sm"
                  onClick={() => handleSave("Color Palette")}
                >
                  Save Colors
                </Button>
              </div>

              {/* Preset Palettes */}
              <div className="flex flex-col gap-2">
                <span className="text-xs font-bold text-gray-600 uppercase">
                  Quick Brand Presets
                </span>
                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() =>
                      setColors({
                        ...colors,
                        primary: "#2196F3",
                        secondary: "#0284C7",
                        accent: "#F59E0B",
                      })
                    }
                    className="flex items-center gap-2 px-3 py-2 rounded-xl border border-gray-200 bg-white hover:border-brand-blue text-xs font-semibold cursor-pointer"
                  >
                    <span className="w-4 h-4 rounded-full bg-[#2196F3]" />
                    <span>Kool Ocean Blue (Default)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setColors({
                        ...colors,
                        primary: "#0D9488",
                        secondary: "#059669",
                        accent: "#F59E0B",
                      })
                    }
                    className="flex items-center gap-2 px-3 py-2 rounded-xl border border-gray-200 bg-white hover:border-teal-600 text-xs font-semibold cursor-pointer"
                  >
                    <span className="w-4 h-4 rounded-full bg-[#0D9488]" />
                    <span>Clean Energy Teal</span>
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setColors({
                        ...colors,
                        primary: "#6366F1",
                        secondary: "#4F46E5",
                        accent: "#EC4899",
                      })
                    }
                    className="flex items-center gap-2 px-3 py-2 rounded-xl border border-gray-200 bg-white hover:border-indigo-600 text-xs font-semibold cursor-pointer"
                  >
                    <span className="w-4 h-4 rounded-full bg-[#6366F1]" />
                    <span>Electric Indigo</span>
                  </button>
                </div>
              </div>

              {/* Color Inputs Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 pt-2">
                <div className="flex flex-col gap-2 p-3 bg-gray-50/60 rounded-xl border border-gray-100">
                  <label className="text-xs font-bold text-gray-700">
                    Primary Brand
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={colors.primary}
                      onChange={(e) =>
                        setColors({ ...colors, primary: e.target.value })
                      }
                      className="w-10 h-10 rounded-lg cursor-pointer border-0 p-0"
                    />
                    <Input
                      value={colors.primary}
                      onChange={(e) =>
                        setColors({ ...colors, primary: e.target.value })
                      }
                      className="font-mono text-xs uppercase"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2 p-3 bg-gray-50/60 rounded-xl border border-gray-100">
                  <label className="text-xs font-bold text-gray-700">
                    Secondary Accent
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={colors.secondary}
                      onChange={(e) =>
                        setColors({ ...colors, secondary: e.target.value })
                      }
                      className="w-10 h-10 rounded-lg cursor-pointer border-0 p-0"
                    />
                    <Input
                      value={colors.secondary}
                      onChange={(e) =>
                        setColors({ ...colors, secondary: e.target.value })
                      }
                      className="font-mono text-xs uppercase"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2 p-3 bg-gray-50/60 rounded-xl border border-gray-100">
                  <label className="text-xs font-bold text-gray-700">
                    Deals & Highlight Accent
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={colors.accent}
                      onChange={(e) =>
                        setColors({ ...colors, accent: e.target.value })
                      }
                      className="w-10 h-10 rounded-lg cursor-pointer border-0 p-0"
                    />
                    <Input
                      value={colors.accent}
                      onChange={(e) =>
                        setColors({ ...colors, accent: e.target.value })
                      }
                      className="font-mono text-xs uppercase"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2 p-3 bg-gray-50/60 rounded-xl border border-gray-100">
                  <label className="text-xs font-bold text-gray-700">
                    App Background
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={colors.background}
                      onChange={(e) =>
                        setColors({ ...colors, background: e.target.value })
                      }
                      className="w-10 h-10 rounded-lg cursor-pointer border-0 p-0"
                    />
                    <Input
                      value={colors.background}
                      onChange={(e) =>
                        setColors({ ...colors, background: e.target.value })
                      }
                      className="font-mono text-xs uppercase"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2 p-3 bg-gray-50/60 rounded-xl border border-gray-100">
                  <label className="text-xs font-bold text-gray-700">
                    Card Surface Background
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={colors.surface}
                      onChange={(e) =>
                        setColors({ ...colors, surface: e.target.value })
                      }
                      className="w-10 h-10 rounded-lg cursor-pointer border-0 p-0"
                    />
                    <Input
                      value={colors.surface}
                      onChange={(e) =>
                        setColors({ ...colors, surface: e.target.value })
                      }
                      className="font-mono text-xs uppercase"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2 p-3 bg-gray-50/60 rounded-xl border border-gray-100">
                  <label className="text-xs font-bold text-gray-700">
                    Primary Text Color
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={colors.textPrimary}
                      onChange={(e) =>
                        setColors({ ...colors, textPrimary: e.target.value })
                      }
                      className="w-10 h-10 rounded-lg cursor-pointer border-0 p-0"
                    />
                    <Input
                      value={colors.textPrimary}
                      onChange={(e) =>
                        setColors({ ...colors, textPrimary: e.target.value })
                      }
                      className="font-mono text-xs uppercase"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 3. TAB BAR STYLE */}
          {activeSection === "tab-bar" && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8 flex flex-col gap-6">
              <div className="flex justify-between items-center border-b border-gray-50 pb-4">
                <div>
                  <h3 className="text-base font-bold text-gray-900">
                    Bottom Navigation Bar Style
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Customize the floating shape, active tab indicator, and
                    center action buttons.
                  </p>
                </div>
                <Button
                  variant="blue"
                  size="sm"
                  onClick={() => handleSave("Tab Bar Style")}
                >
                  Save Tab Bar
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-gray-600 uppercase">
                    Tab Bar Shape & Position
                  </label>
                  <Select
                    value={tabBarStyle.layout}
                    onChange={(val) =>
                      setTabBarStyle({ ...tabBarStyle, layout: val as string })
                    }
                    options={[
                      {
                        label: "Docked (Standard Edge-to-Edge)",
                        value: "docked",
                      },
                      {
                        label: "Floating Capsule (Modern Rounded)",
                        value: "floating",
                      },
                      {
                        label: "Minimalist Pill (Curved Inset)",
                        value: "pill",
                      },
                    ]}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-gray-600 uppercase">
                    Material / Background Texture
                  </label>
                  <Select
                    value={tabBarStyle.backgroundType}
                    onChange={(val) =>
                      setTabBarStyle({
                        ...tabBarStyle,
                        backgroundType: val as string,
                      })
                    }
                    options={[
                      {
                        label: "Frosted Glass (Blur & Translucency)",
                        value: "glass",
                      },
                      { label: "Pure White (#FFFFFF)", value: "solid" },
                      { label: "OLED Dark Mode", value: "dark" },
                    ]}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-gray-600 uppercase">
                    Active Tab Highlight Color
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={tabBarStyle.activeColor}
                      onChange={(e) =>
                        setTabBarStyle({
                          ...tabBarStyle,
                          activeColor: e.target.value,
                        })
                      }
                      className="w-10 h-10 rounded-lg cursor-pointer border-0 p-0"
                    />
                    <Input
                      value={tabBarStyle.activeColor}
                      onChange={(e) =>
                        setTabBarStyle({
                          ...tabBarStyle,
                          activeColor: e.target.value,
                        })
                      }
                      className="font-mono text-xs uppercase"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-gray-600 uppercase">
                    Inactive Tab Color
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={tabBarStyle.inactiveColor}
                      onChange={(e) =>
                        setTabBarStyle({
                          ...tabBarStyle,
                          inactiveColor: e.target.value,
                        })
                      }
                      className="w-10 h-10 rounded-lg cursor-pointer border-0 p-0"
                    />
                    <Input
                      value={tabBarStyle.inactiveColor}
                      onChange={(e) =>
                        setTabBarStyle({
                          ...tabBarStyle,
                          inactiveColor: e.target.value,
                        })
                      }
                      className="font-mono text-xs uppercase"
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-4 pt-2 border-t border-gray-50">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-gray-900 block">
                      Show Text Labels Under Icons
                    </span>
                    <span className="text-xs text-gray-400">
                      Display "Home", "Categories", "BNPL", "Account".
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={tabBarStyle.showLabels}
                    onChange={(e) =>
                      setTabBarStyle({
                        ...tabBarStyle,
                        showLabels: e.target.checked,
                      })
                    }
                    className="w-5 h-5 text-brand-blue accent-brand-blue rounded cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-gray-900 block">
                      Elevated Center Action Button
                    </span>
                    <span className="text-xs text-gray-400">
                      Prominent raised button in the middle for instant cart or
                      scan.
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={tabBarStyle.showCenterActionButton}
                    onChange={(e) =>
                      setTabBarStyle({
                        ...tabBarStyle,
                        showCenterActionButton: e.target.checked,
                      })
                    }
                    className="w-5 h-5 text-brand-blue accent-brand-blue rounded cursor-pointer"
                  />
                </div>
              </div>
            </div>
          )}

          {/* 4. TUTORIAL IMAGES (ONBOARDING SLIDES) */}
          {activeSection === "tutorial-images" && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8 flex flex-col gap-6">
              <div className="flex justify-between items-center border-b border-gray-50 pb-4">
                <div>
                  <h3 className="text-base font-bold text-gray-900">
                    Tutorial & Onboarding Carousel Slides
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Configure the introductory walk-through screens shown when a
                    customer launches the app.
                  </p>
                </div>
                <Button
                  variant="blue"
                  size="sm"
                  onClick={() => handleSave("Tutorial Slides")}
                >
                  Save Slides
                </Button>
              </div>

              {/* Slides List */}
              <div className="flex flex-col gap-4">
                {tutorialSlides.map((slide, idx) => (
                  <div
                    key={slide.id}
                    className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 rounded-xl border border-gray-100 bg-gray-50/50 hover:bg-white transition-all shadow-xs"
                  >
                    <div className="w-16 h-16 rounded-xl border border-gray-200 bg-white p-1 overflow-hidden shrink-0 flex items-center justify-center">
                      <img
                        src={slide.image}
                        alt={slide.title}
                        className="w-full h-full object-contain"
                      />
                    </div>

                    <div className="flex-1 flex flex-col min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-bold text-brand-blue bg-blue-50 px-2 py-0.5 rounded">
                          Slide #{idx + 1}
                        </span>
                        <h4 className="text-xs font-bold text-gray-900 truncate">
                          {slide.title}
                        </h4>
                      </div>
                      <p className="text-xs text-gray-500 mt-1 line-clamp-1">
                        {slide.description}
                      </p>
                    </div>

                    <div className="flex items-center gap-3 ml-auto">
                      <label className="flex items-center gap-2 text-xs font-semibold text-gray-600 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={slide.active}
                          onChange={(e) => {
                            setTutorialSlides((prev) =>
                              prev.map((s) =>
                                s.id === slide.id
                                  ? { ...s, active: e.target.checked }
                                  : s,
                              ),
                            );
                          }}
                          className="w-4 h-4 text-brand-blue accent-brand-blue rounded"
                        />
                        Active
                      </label>
                      <Button
                        variant="outline"
                        size="sm"
                        className="p-1.5! text-gray-400 hover:text-rose-500"
                        onClick={() =>
                          setTutorialSlides((prev) =>
                            prev.filter((s) => s.id !== slide.id),
                          )
                        }
                      >
                        <HiTrash className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add New Slide Form */}
              <div className="bg-gray-50/70 rounded-xl p-5 border border-gray-100 flex flex-col gap-4">
                <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wider">
                  Add New Walkthrough Slide
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <Input
                    placeholder="Slide Title"
                    value={newSlide.title}
                    onChange={(e) =>
                      setNewSlide({ ...newSlide, title: e.target.value })
                    }
                  />
                  <Input
                    placeholder="Image URL (/images/...)"
                    value={newSlide.image}
                    onChange={(e) =>
                      setNewSlide({ ...newSlide, image: e.target.value })
                    }
                  />
                  <Button
                    variant="blue"
                    iconLeft={<HiPlus className="w-4 h-4" />}
                    onClick={() => {
                      if (newSlide.title) {
                        setTutorialSlides((prev) => [
                          ...prev,
                          {
                            id: `slide-${Date.now()}`,
                            title: newSlide.title,
                            description:
                              newSlide.description ||
                              "Discover high-performance refrigeration solutions.",
                            image:
                              newSlide.image || "/images/koolboks/items/2.webp",
                            active: true,
                          },
                        ]);
                        setNewSlide({ title: "", description: "", image: "" });
                      }
                    }}
                  >
                    Add Slide
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* 5. HOME PAGE STYLE */}
          {activeSection === "home-style" && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8 flex flex-col gap-6">
              <div className="flex justify-between items-center border-b border-gray-50 pb-4">
                <div>
                  <h3 className="text-base font-bold text-gray-900">
                    Home Page Visual Layout
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Adjust mobile top app bar style, card corner radius, banner
                    animations, and product feed grids.
                  </p>
                </div>
                <Button
                  variant="blue"
                  size="sm"
                  onClick={() => handleSave("Home Page Style")}
                >
                  Save Style
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-gray-600 uppercase">
                    App Top Bar Style
                  </label>
                  <Select
                    value={homeStyle.headerStyle}
                    onChange={(val) =>
                      setHomeStyle({ ...homeStyle, headerStyle: val as string })
                    }
                    options={[
                      {
                        label: "Brand Logo + Live Search Bar",
                        value: "brand-search",
                      },
                      {
                        label: "Category Story Circles (Instagram-style)",
                        value: "story-circles",
                      },
                      { label: "Minimalist Title & Icons", value: "minimal" },
                    ]}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-gray-600 uppercase">
                    Banner Transition Effect
                  </label>
                  <Select
                    value={homeStyle.bannerAnimation}
                    onChange={(val) =>
                      setHomeStyle({
                        ...homeStyle,
                        bannerAnimation: val as string,
                      })
                    }
                    options={[
                      {
                        label: "Horizontal Smooth Swipe (Carousel)",
                        value: "carousel",
                      },
                      { label: "Subtle Crossfade Animation", value: "fade" },
                      { label: "3D Stacked Cards Swipe", value: "stacked" },
                    ]}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-gray-600 uppercase">
                    Card Corner Radius
                  </label>
                  <Select
                    value={homeStyle.cardCornerRadius}
                    onChange={(val) =>
                      setHomeStyle({
                        ...homeStyle,
                        cardCornerRadius: val as string,
                      })
                    }
                    options={[
                      { label: "8px (Subtle Rounded)", value: "8px" },
                      {
                        label: "16px (Modern Smooth - Recommended)",
                        value: "16px",
                      },
                      { label: "24px (Soft Pill Curves)", value: "24px" },
                      { label: "0px (Sharp Brutalist)", value: "0px" },
                    ]}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-gray-600 uppercase">
                    Product Feed Grid Format
                  </label>
                  <Select
                    value={homeStyle.productCardStyle}
                    onChange={(val) =>
                      setHomeStyle({
                        ...homeStyle,
                        productCardStyle: val as string,
                      })
                    }
                    options={[
                      {
                        label: "Two-Column Grid (Standard E-Commerce)",
                        value: "two-column",
                      },
                      { label: "Masonry Dynamic Stagger", value: "masonry" },
                      {
                        label: "Single-Column Large Showcase Cards",
                        value: "single-feed",
                      },
                    ]}
                  />
                </div>
              </div>
            </div>
          )}

          {/* 6. HOME PAGE SECTIONS */}
          {activeSection === "home-sections" && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8 flex flex-col gap-6">
              <div className="flex justify-between items-center border-b border-gray-50 pb-4">
                <div>
                  <h3 className="text-base font-bold text-gray-900">
                    Home Page Sections Manager
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Enable, disable, and format sections displayed on the mobile
                    storefront home screen.
                  </p>
                </div>
                <Button
                  variant="blue"
                  size="sm"
                  onClick={() => handleSave("Home Page Sections")}
                >
                  Save Sections
                </Button>
              </div>

              <div className="flex flex-col gap-3">
                {homeSections.map((sec, idx) => (
                  <div
                    key={sec.id}
                    className="flex items-center justify-between p-4 rounded-xl border border-gray-100 bg-gray-50/40 hover:bg-white transition-all shadow-xs"
                  >
                    <div className="flex items-center gap-3">
                      <span className="cursor-grab text-gray-400 hover:text-gray-600">
                        <HiBars3 className="w-5 h-5" />
                      </span>
                      <span className="w-6 h-6 rounded-full bg-blue-50 text-brand-blue font-bold text-xs flex items-center justify-center">
                        {idx + 1}
                      </span>
                      <div>
                        <h4 className="text-xs font-bold text-gray-900">
                          {sec.name}
                        </h4>
                        <span className="text-[10px] text-gray-400 capitalize">
                          Layout: {sec.layout}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <Select
                        value={sec.layout}
                        onChange={(val) => {
                          setHomeSections((prev) =>
                            prev.map((s) =>
                              s.id === sec.id
                                ? { ...s, layout: val as any }
                                : s,
                            ),
                          );
                        }}
                        options={[
                          { label: "Horizontal Scroll", value: "scroll" },
                          { label: "Product Grid", value: "grid" },
                          { label: "Banner Carousel", value: "carousel" },
                        ]}
                      />
                      <input
                        type="checkbox"
                        checked={sec.enabled}
                        onChange={(e) => {
                          setHomeSections((prev) =>
                            prev.map((s) =>
                              s.id === sec.id
                                ? { ...s, enabled: e.target.checked }
                                : s,
                            ),
                          );
                        }}
                        className="w-5 h-5 text-brand-blue accent-brand-blue rounded cursor-pointer"
                        title="Toggle section visibility"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Live Mobile Mockup Preview (4 cols) */}
        <div className="xl:col-span-4 sticky top-6">
          <div className="bg-white rounded-3xl border border-gray-200 shadow-xl p-5 flex flex-col items-center">
            <div className="w-full flex justify-between items-center mb-3">
              <span className="text-xs font-bold text-gray-800 flex items-center gap-1.5">
                <HiEye className="w-4 h-4 text-brand-blue" />
                Live Mobile Theme Preview
              </span>
              <span className="text-[10px] font-mono font-bold text-gray-400">
                iOS / Android
              </span>
            </div>

            {/* Mobile Device Frame */}
            <div
              className="w-full max-w-77.5 h-145 rounded-[36px] border-[6px] border-gray-900 bg-white overflow-hidden shadow-2xl flex flex-col relative"
              style={{
                backgroundColor: colors.background,
                fontFamily: fonts.fontFamily,
              }}
            >
              {/* Device Notch */}
              <div className="absolute top-0 inset-x-0 h-5 bg-gray-900 rounded-b-xl w-32 mx-auto z-30" />

              {/* Status Bar */}
              <div className="pt-2 px-6 flex justify-between items-center text-[10px] font-semibold text-gray-800 z-20">
                <span>9:41</span>
                <div className="flex items-center gap-1 text-[10px]">
                  <span>5G</span>
                  <div className="w-4 h-2 rounded border border-gray-800 bg-gray-800" />
                </div>
              </div>

              {/* App Top Bar */}
              <div
                className="px-4 py-2 flex items-center justify-between border-b border-gray-100 bg-white/95 backdrop-blur-sm z-10 mt-1"
                style={{ backgroundColor: colors.surface }}
              >
                <div className="flex items-center gap-2">
                  <img
                    src="/images/koolboks/koolbuy_logo.webp"
                    alt="Logo"
                    className="h-5 w-auto object-contain"
                  />
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <span className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-xs">
                    🔍
                  </span>
                  <span className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-xs">
                    🔔
                  </span>
                </div>
              </div>

              {/* Scrollable App Feed Content */}
              <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-3 custom-scrollbar text-left">
                {/* Hero Banner Sample */}
                <div
                  className="w-full h-28 rounded-2xl p-3 text-white flex flex-col justify-end relative overflow-hidden shadow-sm"
                  style={{
                    backgroundColor: colors.primary,
                    borderRadius: homeStyle.cardCornerRadius,
                  }}
                >
                  <span className="text-[9px] font-extrabold uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded w-fit">
                    Zero Interest BNPL
                  </span>
                  <h4 className="text-xs font-bold leading-tight mt-1">
                    Solar Freezers from ₦15,000/mo
                  </h4>
                </div>

                {/* Categories Sample */}
                <div className="flex items-center gap-2 overflow-x-hidden">
                  {["Chest", "Solar", "Display", "Inverter"].map((cat, i) => (
                    <div
                      key={i}
                      className="px-2.5 py-1 rounded-full text-[10px] font-bold shrink-0 border"
                      style={{
                        backgroundColor:
                          i === 0 ? colors.primary : colors.surface,
                        color: i === 0 ? "#FFFFFF" : colors.textPrimary,
                        borderColor: i === 0 ? colors.primary : "#E2E8F0",
                      }}
                    >
                      {cat}
                    </div>
                  ))}
                </div>

                {/* Product Cards Sample */}
                <div className="grid grid-cols-2 gap-2">
                  {[
                    {
                      name: "Scanfrost 600L",
                      price: "₦1,406,000",
                      img: "/images/koolboks/items/5.webp",
                    },
                    {
                      name: "Bruhm 100ah",
                      price: "₦1,662,370",
                      img: "/images/koolboks/items/4.webp",
                    },
                  ].map((p, idx) => (
                    <div
                      key={idx}
                      className="p-2 border border-gray-100 flex flex-col gap-1 shadow-xs"
                      style={{
                        backgroundColor: colors.surface,
                        borderRadius: homeStyle.cardCornerRadius,
                      }}
                    >
                      <div className="w-full h-16 bg-gray-50 rounded-lg p-1 flex items-center justify-center">
                        <img
                          src={p.img}
                          alt={p.name}
                          className="h-full object-contain"
                        />
                      </div>
                      <span
                        className="text-[10px] font-bold truncate"
                        style={{ color: colors.textPrimary }}
                      >
                        {p.name}
                      </span>
                      <span
                        className="text-[10px] font-black"
                        style={{ color: colors.primary }}
                      >
                        {p.price}
                      </span>
                      <button
                        type="button"
                        className="w-full py-1 text-[9px] font-bold text-white rounded mt-1"
                        style={{ backgroundColor: colors.primary }}
                      >
                        Buy Now
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom Navigation Tab Bar */}
              <div
                className={`w-full py-2 px-3 flex items-center justify-around z-20 border-t ${
                  tabBarStyle.layout === "floating"
                    ? "mx-2 mb-2 rounded-2xl shadow-lg border border-gray-200/80"
                    : "border-gray-100"
                }`}
                style={{
                  backgroundColor:
                    tabBarStyle.backgroundType === "dark"
                      ? "#0F172A"
                      : tabBarStyle.backgroundType === "glass"
                        ? "rgba(255, 255, 255, 0.9)"
                        : "#FFFFFF",
                }}
              >
                {[
                  { label: "Home", icon: "🏠", active: true },
                  { label: "Explore", icon: "🔍", active: false },
                  { label: "BNPL", icon: "⚡", active: false },
                  { label: "Account", icon: "👤", active: false },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col items-center gap-0.5 cursor-pointer"
                  >
                    <span className="text-sm">{item.icon}</span>
                    {tabBarStyle.showLabels && (
                      <span
                        className="text-[8px] font-bold"
                        style={{
                          color: item.active
                            ? tabBarStyle.activeColor
                            : tabBarStyle.inactiveColor,
                        }}
                      >
                        {item.label}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={isSavedModalOpen}
        onClose={() => setIsSavedModalOpen(false)}
        onConfirm={() => setIsSavedModalOpen(false)}
        title="App Styling Saved"
        message={saveMessage}
        confirmText="Done"
        type="info"
      />
    </div>
  );
}
