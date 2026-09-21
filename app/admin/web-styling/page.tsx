"use client";

import React, { useState } from "react";
import { Icon } from "@/app/components/Icon";
import { Button } from "@/app/components/Button";
import { Input, Textarea } from "@/app/components/Form/Inputs";
import { Select } from "@/app/components/Form/Select";
import { ConfirmationModal } from "@/app/components/Admin/ConfirmationModal";
import {
  HiGlobeAlt,
  HiPhoto,
  HiLockClosed,
  HiComputerDesktop,
  HiPhone,
  HiCreditCard,
  HiTruck,
  HiCheckCircle,
  HiEye,
  HiArrowUpTray,
  HiSparkles,
} from "react-icons/hi2";

type WebStylingTab =
  | "favicon"
  | "auth-images"
  | "home-page-style"
  | "contact-us"
  | "payment-icons"
  | "delivery-status-icons";

export default function WebStylingPage() {
  const [activeTab, setActiveTab] = useState<WebStylingTab>("favicon");
  const [isSavedModalOpen, setIsSavedModalOpen] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");

  // 1. Favicon State
  const [favicon, setFavicon] = useState({
    url: "/favicon.ico",
    appleTouchIcon: "/images/koolboks/koolbuy_logo.webp",
    tabTitlePrefix: "Koolbuy Store | Solar Refrigeration",
  });

  // 2. Sign In / Up & Admin Sign In Images
  const [authImages, setAuthImages] = useState({
    customerAuthImage:
      "https://images.unsplash.com/photo-1556742049-0a67c5574f73?w=800&auto=format&fit=crop",
    customerHeadline: "Access Zero-Emission Cold Storage & Instant BNPL Credit",
    adminAuthImage:
      "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&auto=format&fit=crop",
    adminHeadline: "Koolbuy Platform Operations & Financial Control Portal",
  });

  // 3. Home Page Style (Web)
  const [homePageStyle, setHomePageStyle] = useState({
    heroLayout: "split-featured", // "full-width-carousel" | "split-featured" | "boxed-modern"
    headerStyle: "sticky-white", // "sticky-white" | "brand-blue" | "transparent-glass"
    containerMaxWidth: "1440px",
    gridColumns: "4", // "4" | "5" | "3"
    cardCornerRadius: "12px",
    sectionSpacing: "spacious", // "compact" | "normal" | "spacious"
    showTrustBadges: true,
  });

  // 4. Contact Us Page
  const [contactUs, setContactUs] = useState({
    heroBannerImage:
      "https://images.unsplash.com/photo-1423666639041-f56000c27a9a?w=1200&auto=format&fit=crop",
    supportEmail: "support@koolbuy.com",
    helplinePhone: "+234 800 KOOLBOKS",
    whatsappLink: "https://wa.me/23480056652657",
    officeAddress: "Plot 12B, Admiralty Way, Lekki Phase 1, Lagos, Nigeria",
    googleMapsEmbedUrl: "https://maps.google.com/?q=Lekki+Phase+1+Lagos",
    averageResponseTime: "Under 15 Minutes",
  });

  // 5. Payment Method Icons
  const [paymentIcons, setPaymentIcons] = useState([
    {
      id: "pay-1",
      name: "Mastercard",
      iconUrl:
        "https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg",
      enabled: true,
    },
    {
      id: "pay-2",
      name: "Visa",
      iconUrl:
        "https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg",
      enabled: true,
    },
    {
      id: "pay-3",
      name: "Verve Card",
      iconUrl:
        "https://upload.wikimedia.org/wikipedia/commons/b/b5/Verve_logo.png",
      enabled: true,
    },
    {
      id: "pay-4",
      name: "Paystack",
      iconUrl: "https://assets.paystack.com/assets/img/press/Paystack-Mark.png",
      enabled: true,
    },
    {
      id: "pay-5",
      name: "Flutterwave",
      iconUrl: "https://flutterwave.com/images/logo/full.svg",
      enabled: true,
    },
    {
      id: "pay-6",
      name: "Direct Bank Transfer",
      iconUrl: "https://cdn-icons-png.flaticon.com/512/2830/2830284.png",
      enabled: true,
    },
    {
      id: "pay-7",
      name: "KoolBuy BNPL (Installments)",
      iconUrl: "https://cdn-icons-png.flaticon.com/512/8802/8802871.png",
      enabled: true,
    },
  ]);

  // 6. Order Delivery Status Icons
  const [deliveryStatusIcons, setDeliveryStatusIcons] = useState([
    {
      id: "status-1",
      status: "Pending",
      iconName: "Pending",
      color: "text-amber-500",
      bg: "bg-amber-50",
      description: "Order received, awaiting payment confirmation.",
    },
    {
      id: "status-2",
      status: "Processing",
      iconName: "Shipped",
      color: "text-blue-500",
      bg: "bg-blue-50",
      description: "Warehouse picking and packaging in progress.",
    },
    {
      id: "status-3",
      status: "Shipped / In Transit",
      iconName: "Shipped",
      color: "text-indigo-600",
      bg: "bg-indigo-50",
      description: "Dispatched with logistics carrier, on transit.",
    },
    {
      id: "status-4",
      status: "Delivered",
      iconName: "Delivered",
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      description: "Successfully delivered and confirmed by customer.",
    },
    {
      id: "status-5",
      status: "Cancelled",
      iconName: "Cancelled",
      color: "text-rose-600",
      bg: "bg-rose-50",
      description: "Order cancelled or customer refund issued.",
    },
  ]);

  const handleSave = (sectionTitle: string) => {
    setSaveMessage(
      `${sectionTitle} settings have been successfully applied to the web storefront!`,
    );
    setIsSavedModalOpen(true);
  };

  const navItems = [
    { id: "favicon", label: "Favicon", icon: HiGlobeAlt },
    { id: "auth-images", label: "Sign In/Up Images", icon: HiPhoto },
    {
      id: "home-page-style",
      label: "Home Page Style",
      icon: HiComputerDesktop,
    },
    { id: "contact-us", label: "Contact Us", icon: HiPhone },
    { id: "payment-icons", label: "Payment Method Icons", icon: HiCreditCard },
    {
      id: "delivery-status-icons",
      label: "Delivery Status Icons",
      icon: HiTruck,
    },
  ];

  return (
    <div className="flex flex-col gap-6 mx-auto pb-16">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-100 pb-5">
        <div>
          {/* <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Web Styling</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-brand-blue border border-blue-100">
              Desktop & Web Storefront
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Customize browser favicon, authentication banner artwork, web homepage layouts, contact page coordinates, payment badges, and fulfillment status indicators.
          </p> */}
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="blue"
            iconLeft={<HiCheckCircle className="w-4 h-4" />}
            onClick={() => handleSave("Web Storefront Theme")}
          >
            Publish Web Styling
          </Button>
        </div>
      </div>

      {/* Main Grid: Settings (8 cols) & Live Desktop Browser Preview (4 cols) */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        {/* Left Column: Configuration Forms (8 cols) */}
        <div className="xl:col-span-8 flex flex-col gap-6">
          {/* Section Navigation Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-gray-100 custom-scrollbar">
            {navItems.map((item) => {
              const IconComponent = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as WebStylingTab)}
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

          {/* 1. FAVICON */}
          {activeTab === "favicon" && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8 flex flex-col gap-6">
              <div className="flex justify-between items-center border-b border-gray-50 pb-4">
                <div>
                  <h3 className="text-base font-bold text-gray-900">
                    Browser Favicon & Identity
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Upload website tab icons, touch icons, and title bar
                    formatting.
                  </p>
                </div>
                <Button
                  variant="blue"
                  size="sm"
                  onClick={() => handleSave("Favicon")}
                >
                  Save Favicon
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-gray-600 uppercase">
                    Standard Favicon URL (.ico / .png)
                  </label>
                  <Input
                    value={favicon.url}
                    onChange={(e) =>
                      setFavicon({ ...favicon, url: e.target.value })
                    }
                    placeholder="/favicon.ico or https://..."
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-gray-600 uppercase">
                    Apple Touch Bookmark Icon (180x180)
                  </label>
                  <Input
                    value={favicon.appleTouchIcon}
                    onChange={(e) =>
                      setFavicon({ ...favicon, appleTouchIcon: e.target.value })
                    }
                    placeholder="/images/koolboks/koolbuy_logo.webp"
                  />
                </div>

                <div className="flex flex-col gap-2 md:col-span-2">
                  <label className="text-xs font-bold text-gray-600 uppercase">
                    Browser Tab Title Prefix
                  </label>
                  <Input
                    value={favicon.tabTitlePrefix}
                    onChange={(e) =>
                      setFavicon({ ...favicon, tabTitlePrefix: e.target.value })
                    }
                    placeholder="e.g. Koolbuy Store | Solar Refrigeration"
                  />
                </div>
              </div>

              {/* Simulated Browser Tab Preview */}
              <div className="bg-gray-100 p-4 rounded-xl border border-gray-200 flex flex-col gap-2">
                <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                  Live Browser Tab Appearance
                </span>
                <div className="bg-white rounded-t-xl px-4 py-2 border-b-2 border-brand-blue flex items-center gap-2 max-w-xs shadow-xs">
                  <img
                    src={favicon.url}
                    alt="Favicon"
                    className="w-4 h-4 object-contain"
                  />
                  <span className="text-xs font-semibold text-gray-800 truncate">
                    {favicon.tabTitlePrefix}
                  </span>
                  <span className="text-xs text-gray-400 ml-auto">✕</span>
                </div>
              </div>
            </div>
          )}

          {/* 2. SIGN IN / UP & ADMIN SIGN IN IMAGES */}
          {activeTab === "auth-images" && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8 flex flex-col gap-6">
              <div className="flex justify-between items-center border-b border-gray-50 pb-4">
                <div>
                  <h3 className="text-base font-bold text-gray-900">
                    Authentication Portal Artwork
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Customize split-screen cover images and welcome headlines
                    for customer sign-in and admin logins.
                  </p>
                </div>
                <Button
                  variant="blue"
                  size="sm"
                  onClick={() => handleSave("Auth Images")}
                >
                  Save Images
                </Button>
              </div>

              {/* Customer Sign In / Up */}
              <div className="flex flex-col gap-4 p-5 rounded-xl border border-gray-100 bg-gray-50/40">
                <div className="flex items-center gap-2">
                  <HiPhoto className="w-4 h-4 text-brand-blue" />
                  <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
                    Customer Sign In & Sign Up Split Image
                  </h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-semibold text-gray-600">
                      Cover Image URL
                    </label>
                    <Input
                      value={authImages.customerAuthImage}
                      onChange={(e) =>
                        setAuthImages({
                          ...authImages,
                          customerAuthImage: e.target.value,
                        })
                      }
                    />
                    <label className="text-xs font-semibold text-gray-600 mt-2">
                      Marketing Headline Overlay
                    </label>
                    <Input
                      value={authImages.customerHeadline}
                      onChange={(e) =>
                        setAuthImages({
                          ...authImages,
                          customerHeadline: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="h-40 rounded-xl overflow-hidden border border-gray-200 relative shadow-inner">
                    <img
                      src={authImages.customerAuthImage}
                      alt="Customer Auth"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-end p-3">
                      <p className="text-xs font-bold text-white leading-tight">
                        {authImages.customerHeadline}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Admin Portal Sign In Image */}
              <div className="flex flex-col gap-4 p-5 rounded-xl border border-gray-100 bg-gray-50/40">
                <div className="flex items-center gap-2">
                  <HiLockClosed className="w-4 h-4 text-brand-blue" />
                  <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
                    Admin Portal Sign In Artwork
                  </h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-semibold text-gray-600">
                      Admin Image URL
                    </label>
                    <Input
                      value={authImages.adminAuthImage}
                      onChange={(e) =>
                        setAuthImages({
                          ...authImages,
                          adminAuthImage: e.target.value,
                        })
                      }
                    />
                    <label className="text-xs font-semibold text-gray-600 mt-2">
                      Admin Security Headline
                    </label>
                    <Input
                      value={authImages.adminHeadline}
                      onChange={(e) =>
                        setAuthImages({
                          ...authImages,
                          adminHeadline: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="h-40 rounded-xl overflow-hidden border border-gray-200 relative shadow-inner">
                    <img
                      src={authImages.adminAuthImage}
                      alt="Admin Auth"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-blue-900/40 flex items-end p-3">
                      <p className="text-xs font-bold text-white leading-tight">
                        {authImages.adminHeadline}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 3. HOME PAGE STYLE (WEB) */}
          {activeTab === "home-page-style" && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8 flex flex-col gap-6">
              <div className="flex justify-between items-center border-b border-gray-50 pb-4">
                <div>
                  <h3 className="text-base font-bold text-gray-900">
                    Web Storefront Home Page Layout
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Adjust desktop container widths, top hero banner layouts,
                    product grid density, and header styles.
                  </p>
                </div>
                <Button
                  variant="blue"
                  size="sm"
                  onClick={() => handleSave("Web Home Page Style")}
                >
                  Save Layout
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-gray-600 uppercase">
                    Top Hero Section Style
                  </label>
                  <Select
                    value={homePageStyle.heroLayout}
                    onChange={(val) =>
                      setHomePageStyle({
                        ...homePageStyle,
                        heroLayout: val as string,
                      })
                    }
                    options={[
                      {
                        label: "Split Hero (Carousel + Featured BNPL Card)",
                        value: "split-featured",
                      },
                      {
                        label: "Full-Width Cinematic Carousel Banner",
                        value: "full-width-carousel",
                      },
                      {
                        label: "Boxed Modern Grid with Quick Banners",
                        value: "boxed-modern",
                      },
                    ]}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-gray-600 uppercase">
                    Storefront Navigation Header
                  </label>
                  <Select
                    value={homePageStyle.headerStyle}
                    onChange={(val) =>
                      setHomePageStyle({
                        ...homePageStyle,
                        headerStyle: val as string,
                      })
                    }
                    options={[
                      {
                        label: "Sticky White Header with Drop Shadows",
                        value: "sticky-white",
                      },
                      {
                        label: "Solid Brand Blue Bar with Search",
                        value: "brand-blue",
                      },
                      {
                        label: "Transparent Frosted Glass Bar",
                        value: "transparent-glass",
                      },
                    ]}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-gray-600 uppercase">
                    Max Container Width
                  </label>
                  <Select
                    value={homePageStyle.containerMaxWidth}
                    onChange={(val) =>
                      setHomePageStyle({
                        ...homePageStyle,
                        containerMaxWidth: val as string,
                      })
                    }
                    options={[
                      { label: "1280px (Standard Desktop)", value: "1280px" },
                      {
                        label: "1440px (Wide Desktop - Recommended)",
                        value: "1440px",
                      },
                      {
                        label: "1600px (Ultra-Wide Cinematic)",
                        value: "1600px",
                      },
                    ]}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-gray-600 uppercase">
                    Product Grid Columns (Desktop)
                  </label>
                  <Select
                    value={homePageStyle.gridColumns}
                    onChange={(val) =>
                      setHomePageStyle({
                        ...homePageStyle,
                        gridColumns: val as string,
                      })
                    }
                    options={[
                      { label: "4 Cards per Row (Spacious View)", value: "4" },
                      {
                        label: "5 Cards per Row (Compact Catalog)",
                        value: "5",
                      },
                      {
                        label: "3 Cards per Row (Large Visual Showcase)",
                        value: "3",
                      },
                    ]}
                  />
                </div>
              </div>
            </div>
          )}

          {/* 4. CONTACT US */}
          {activeTab === "contact-us" && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8 flex flex-col gap-6">
              <div className="flex justify-between items-center border-b border-gray-50 pb-4">
                <div>
                  <h3 className="text-base font-bold text-gray-900">
                    Contact Us Page Customization
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Configure customer support inquiry channels, head office
                    addresses, and response commitments.
                  </p>
                </div>
                <Button
                  variant="blue"
                  size="sm"
                  onClick={() => handleSave("Contact Us")}
                >
                  Save Contact Settings
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2 md:col-span-2">
                  <label className="text-xs font-bold text-gray-600 uppercase">
                    Contact Us Page Hero Banner Image URL
                  </label>
                  <Input
                    value={contactUs.heroBannerImage}
                    onChange={(e) =>
                      setContactUs({
                        ...contactUs,
                        heroBannerImage: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-gray-600 uppercase">
                    Official Support Email
                  </label>
                  <Input
                    value={contactUs.supportEmail}
                    onChange={(e) =>
                      setContactUs({
                        ...contactUs,
                        supportEmail: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-gray-600 uppercase">
                    Toll-Free Helpline Phone
                  </label>
                  <Input
                    value={contactUs.helplinePhone}
                    onChange={(e) =>
                      setContactUs({
                        ...contactUs,
                        helplinePhone: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-gray-600 uppercase">
                    WhatsApp Instant Support Link
                  </label>
                  <Input
                    value={contactUs.whatsappLink}
                    onChange={(e) =>
                      setContactUs({
                        ...contactUs,
                        whatsappLink: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-gray-600 uppercase">
                    Average Support Response Time
                  </label>
                  <Input
                    value={contactUs.averageResponseTime}
                    onChange={(e) =>
                      setContactUs({
                        ...contactUs,
                        averageResponseTime: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="flex flex-col gap-2 md:col-span-2">
                  <label className="text-xs font-bold text-gray-600 uppercase">
                    Registered Physical Office Address
                  </label>
                  <Input
                    value={contactUs.officeAddress}
                    onChange={(e) =>
                      setContactUs({
                        ...contactUs,
                        officeAddress: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
            </div>
          )}

          {/* 5. PAYMENT METHOD ICONS */}
          {activeTab === "payment-icons" && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8 flex flex-col gap-6">
              <div className="flex justify-between items-center border-b border-gray-50 pb-4">
                <div>
                  <h3 className="text-base font-bold text-gray-900">
                    Payment Gateway & Method Icons
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Toggle visibility and adjust icons displayed across web
                    checkout pages and storefront footers.
                  </p>
                </div>
                <Button
                  variant="blue"
                  size="sm"
                  onClick={() => handleSave("Payment Method Icons")}
                >
                  Save Payment Icons
                </Button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {paymentIcons.map((pay) => (
                  <div
                    key={pay.id}
                    className="flex items-center justify-between p-4 rounded-xl border border-gray-100 bg-gray-50/40 hover:bg-white transition-all shadow-xs"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-8 rounded border border-gray-200 bg-white p-1 flex items-center justify-center shrink-0 shadow-2xs">
                        <img
                          src={pay.iconUrl}
                          alt={pay.name}
                          className="max-h-full max-w-full object-contain"
                        />
                      </div>
                      <span className="text-xs font-bold text-gray-800">
                        {pay.name}
                      </span>
                    </div>

                    <input
                      type="checkbox"
                      checked={pay.enabled}
                      onChange={(e) => {
                        setPaymentIcons((prev) =>
                          prev.map((p) =>
                            p.id === pay.id
                              ? { ...p, enabled: e.target.checked }
                              : p,
                          ),
                        );
                      }}
                      className="w-5 h-5 text-brand-blue accent-brand-blue rounded cursor-pointer"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 6. ORDER DELIVERY STATUS ICONS */}
          {activeTab === "delivery-status-icons" && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8 flex flex-col gap-6">
              <div className="flex justify-between items-center border-b border-gray-50 pb-4">
                <div>
                  <h3 className="text-base font-bold text-gray-900">
                    Order & Fulfillment Status Icons
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Customize icon badges and color identifiers across order
                    tracking timelines and reports.
                  </p>
                </div>
                <Button
                  variant="blue"
                  size="sm"
                  onClick={() => handleSave("Delivery Status Icons")}
                >
                  Save Status Icons
                </Button>
              </div>

              <div className="flex flex-col gap-4">
                {deliveryStatusIcons.map((st) => (
                  <div
                    key={st.id}
                    className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl border border-gray-100 bg-gray-50/40 hover:bg-white transition-all shadow-xs"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-xl ${st.bg} ${st.color} flex items-center justify-center shrink-0`}
                      >
                        <Icon
                          name={st.iconName as any}
                          folder="dashboardIcon"
                          size="sm"
                        />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-gray-900">
                          {st.status}
                        </h4>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {st.description}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span
                        className={`px-3 py-1 rounded-full text-[11px] font-bold ${st.bg} ${st.color}`}
                      >
                        {st.status.split(" ")[0]}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Live Desktop Browser Preview (4 cols) */}
        <div className="xl:col-span-4 sticky top-6">
          <div className="bg-white rounded-3xl border border-gray-200 shadow-xl p-5 flex flex-col items-center">
            <div className="w-full flex justify-between items-center mb-3">
              <span className="text-xs font-bold text-gray-800 flex items-center gap-1.5">
                <HiEye className="w-4 h-4 text-brand-blue" />
                Live Web Storefront Preview
              </span>
              <span className="text-[10px] font-mono font-bold text-gray-400">
                Desktop Web
              </span>
            </div>

            {/* Desktop Browser Window Mockup */}
            <div className="w-full h-130 rounded-2xl border border-gray-200 bg-gray-50 overflow-hidden shadow-md flex flex-col">
              {/* Browser Tab Strip */}
              <div className="bg-gray-200 px-3 py-1.5 flex items-center gap-2 border-b border-gray-300">
                <div className="flex items-center gap-1">
                  <div className="w-2.5 h-2.5 rounded-full bg-rose-400" />
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                </div>
                <div className="flex-1 bg-white rounded-md px-2 py-0.5 text-[9px] font-semibold text-gray-700 flex items-center gap-1 truncate shadow-xs">
                  <img
                    src={favicon.url}
                    alt="fav"
                    className="w-3 h-3 object-contain"
                  />
                  <span className="truncate">{favicon.tabTitlePrefix}</span>
                </div>
              </div>

              {/* Web Header Bar */}
              <div
                className={`px-3 py-2 flex items-center justify-between border-b ${
                  homePageStyle.headerStyle === "brand-blue"
                    ? "bg-[#2196F3] text-white"
                    : "bg-white text-gray-800 border-gray-100"
                }`}
              >
                <img
                  src="/images/koolboks/koolbuy_logo.webp"
                  alt="Koolbuy"
                  className="h-4 object-contain"
                />
                <div className="flex items-center gap-2 text-[9px] font-bold">
                  <span>Shop</span>
                  <span>BNPL</span>
                  <span>Contact</span>
                </div>
              </div>

              {/* Web Storefront Body Preview */}
              <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-3 custom-scrollbar text-left">
                {/* Hero Banner Sample */}
                <div className="w-full h-28 rounded-xl bg-linear-to-r from-blue-600 to-sky-500 text-white p-3 flex flex-col justify-between shadow-xs">
                  <span className="text-[8px] font-extrabold uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded w-fit">
                    Koolbuy Web Store
                  </span>
                  <div>
                    <h4 className="text-xs font-bold leading-tight">
                      Solar Inverter Freezers
                    </h4>
                    <p className="text-[9px] text-blue-100">
                      Own from ₦15,000/month with zero deposit
                    </p>
                  </div>
                </div>

                {/* Product Cards Row */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-white p-2 rounded-lg border border-gray-100 shadow-xs flex flex-col gap-1">
                    <img
                      src="/images/koolboks/items/5.webp"
                      alt="P1"
                      className="h-14 object-contain mx-auto"
                    />
                    <span className="text-[9px] font-bold text-gray-800 truncate">
                      Scanfrost 600L
                    </span>
                    <span className="text-[9px] font-bold text-brand-blue">
                      ₦1,406,000
                    </span>
                  </div>
                  <div className="bg-white p-2 rounded-lg border border-gray-100 shadow-xs flex flex-col gap-1">
                    <img
                      src="/images/koolboks/items/4.webp"
                      alt="P2"
                      className="h-14 object-contain mx-auto"
                    />
                    <span className="text-[9px] font-bold text-gray-800 truncate">
                      Bruhm 100ah Solar
                    </span>
                    <span className="text-[9px] font-bold text-brand-blue">
                      ₦1,662,370
                    </span>
                  </div>
                </div>

                {/* Payment Icons Strip */}
                <div className="bg-white p-2.5 rounded-xl border border-gray-100 flex flex-col gap-1.5">
                  <span className="text-[8px] font-bold uppercase text-gray-400">
                    Accepted Payment Methods
                  </span>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {paymentIcons
                      .filter((p) => p.enabled)
                      .slice(0, 4)
                      .map((p) => (
                        <div
                          key={p.id}
                          className="h-5 px-1.5 bg-gray-50 border border-gray-100 rounded flex items-center"
                        >
                          <img
                            src={p.iconUrl}
                            alt={p.name}
                            className="h-3 max-w-7 object-contain"
                          />
                        </div>
                      ))}
                  </div>
                </div>
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
        title="Web Styling Saved"
        message={saveMessage}
        confirmText="Done"
        type="info"
      />
    </div>
  );
}
