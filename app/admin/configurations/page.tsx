"use client";

import React, { useState, useMemo } from "react";
import { Button } from "@/app/components/Button";
import { ConfirmationModal } from "@/app/components/Admin/ConfirmationModal";
import {
  HiOutlineMagnifyingGlass,
  HiOutlineAdjustmentsHorizontal,
  HiOutlineCheckCircle,
  HiOutlineXMark,
  HiOutlineArrowPath,
  HiOutlineCog6Tooth,
  HiOutlineDevicePhoneMobile,
  HiOutlineMapPin,
  HiOutlineTruck,
  HiOutlineCreditCard,
  HiOutlineShare,
  HiOutlineEnvelope,
  HiOutlineBellAlert,
  HiOutlineChatBubbleLeftRight,
  HiOutlineShieldExclamation,
  HiOutlineUserGroup,
  HiOutlineArrowsRightLeft,
  HiOutlineSparkles,
  HiOutlineCalculator,
  HiOutlineComputerDesktop,
  HiOutlineQrCode,
  HiOutlineUserPlus,
  HiOutlineClock,
  HiOutlineCube,
  HiOutlineSun,
  HiOutlineReceiptPercent,
  HiOutlineCircleStack,
  HiOutlineBolt,
  HiOutlinePencilSquare,
} from "react-icons/hi2";

/* =========================================================================
   TYPES
   ========================================================================= */

interface ConfigCardData {
  id: string;
  title: string;
  category:
    | "Core"
    | "Logistics"
    | "Finance"
    | "Communications"
    | "POS & ERP"
    | "IoT & Solar";
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  enabled: boolean;
  badge?: string;
  settings: Record<string, any>;
}

interface CustomModItem {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  category:
    | "E-Commerce"
    | "Logistics"
    | "Vendor Rules"
    | "Booking & Rides"
    | "Communications"
    | "General";
}

/* =========================================================================
   INITIAL DATA: 23 INTEGRATION & CONFIGURATION CARDS
   ========================================================================= */

const initialConfigCards: ConfigCardData[] = [
  {
    id: "hyperlocal",
    title: "Hyperlocal",
    category: "Logistics",
    description:
      "Location-based vendor discovery, radius constraints, and geofenced catalog matching.",
    icon: HiOutlineMapPin,
    enabled: true,
    badge: "Active",
    settings: {
      serviceRadiusKm: "25",
      strictGeofencing: true,
      autoDetectLocation: true,
      defaultCity: "Lagos, Nigeria",
    },
  },
  {
    id: "vendor-delivery-option",
    title: "Vendor Delivery Option",
    category: "Logistics",
    description:
      "Manage vendor-managed fulfillment vs. platform fleet delivery and custom time slots.",
    icon: HiOutlineTruck,
    enabled: true,
    settings: {
      allowVendorSelfDelivery: true,
      platformFleetAssigned: true,
      enableDeliverySlots: true,
      defaultBufferMins: "45",
    },
  },
  {
    id: "payment-option",
    title: "Payment Option",
    category: "Finance",
    description:
      "Payment gateway credentials, Cash on Delivery (COD), Direct Bank Transfer, and BNPL.",
    icon: HiOutlineCreditCard,
    enabled: true,
    badge: "Multi-Gateway",
    settings: {
      enablePaystack: true,
      enableFlutterwave: true,
      enableCashOnDelivery: true,
      enableBNPLFinancing: true,
      defaultCurrency: "NGN (₦)",
    },
  },
  {
    id: "social-logins",
    title: "Social Logins: (Facebook, Twitter, Google, Apple)",
    category: "Communications",
    description:
      "OAuth credentials and single sign-on options for Facebook, Twitter (X), Google, and Apple ID.",
    icon: HiOutlineShare,
    enabled: true,
    settings: {
      googleEnabled: true,
      googleClientId: "948271048-google-koolbuy.apps.googleusercontent.com",
      facebookEnabled: true,
      facebookAppId: "847291048194",
      twitterEnabled: false,
      twitterApiKey: "TW-KOOLBUY-PROD-2025",
      appleEnabled: true,
      appleServiceId: "com.koolbuy.store.signin",
    },
  },
  {
    id: "map-sms-emails",
    title: "Map Sms Emails: (Map, SMS, Mail)",
    category: "Communications",
    description:
      "Centralized configuration for Map navigation API, SMS gateways, and transactional mail servers.",
    icon: HiOutlineEnvelope,
    enabled: true,
    badge: "Core Stack",
    settings: {
      mapProvider: "Google Maps API",
      googleMapsApiKey: "AIzaSyD-KOOLBOKS-GEO-MAP-SECURE",
      smsProvider: "Termii (Nigeria) & Twilio",
      smsSenderId: "KOOLBUY",
      mailProvider: "AWS SES / Sendgrid",
      smtpHost: "email-smtp.eu-west-1.amazonaws.com",
      senderEmail: "notifications@koolbuy.store",
    },
  },
  {
    id: "firebase-notification-configuration",
    title: "Firebase Notification Configuration",
    category: "Communications",
    description:
      "Push notification server keys, Firebase Project ID, and Web Push credentials.",
    icon: HiOutlineBellAlert,
    enabled: true,
    settings: {
      projectId: "koolbuy-cloud-prod",
      serverKey: "AAAAx9281...uio0928",
      messagingSenderId: "93820194820",
      enableWebPush: true,
      enableInAppBanners: true,
    },
  },
  {
    id: "customer-support",
    title: "Customer Support",
    category: "Communications",
    description:
      "Direct WhatsApp support link, live chat widget integration, and escalation ticket routing.",
    icon: HiOutlineChatBubbleLeftRight,
    enabled: true,
    settings: {
      whatsappNumber: "+234800KOOLBOKS",
      enableLiveChat: true,
      enableZendeskTicketSync: false,
      supportHours: "8:00 AM - 8:00 PM WAT",
    },
  },
  {
    id: "sos",
    title: "SOS",
    category: "Logistics",
    description:
      "Emergency distress protocol for delivery couriers, riders, and field personnel.",
    icon: HiOutlineShieldExclamation,
    enabled: true,
    badge: "High Priority",
    settings: {
      emergencyHotline: "+234112SOS",
      policeAlertWebhook: "https://api.security.koolbuy.com/sos",
      notifyEmergencyContacts: true,
      driverAutoTracking: true,
    },
  },
  {
    id: "crm",
    title: "CRM",
    category: "Core",
    description:
      "Customer Relationship Management two-way synchronization with HubSpot and Salesforce.",
    icon: HiOutlineUserGroup,
    enabled: false,
    settings: {
      provider: "HubSpot",
      apiKey: "pat-eu1-987291-hubspot-koolbuy",
      syncCustomers: true,
      syncOrders: true,
    },
  },
  {
    id: "peer-to-peer-p2p",
    title: "Peer to Peer (P2P)",
    category: "Logistics",
    description:
      "Direct customer-to-customer parcel delivery, pickup dispatch, and escrow settlements.",
    icon: HiOutlineArrowsRightLeft,
    enabled: true,
    settings: {
      allowP2PDelivery: true,
      escrowHoldPeriodHours: "24",
      maxParcelWeightKg: "15",
      insuranceCoverPercent: "1.5",
    },
  },
  {
    id: "order-management-modes",
    title: "[Edit Order, Instant Booking and Bid & Ride]",
    category: "Core",
    description:
      "Operational ordering behaviors: live order modification, instant vehicle booking, and ride bidding.",
    icon: HiOutlineSparkles,
    enabled: true,
    badge: "3-in-1 Suite",
    settings: {
      allowEditOrderBeforeDispatch: true,
      instantBookingEnabled: true,
      bidAndRideEnabled: false,
      maxBidCounterRounds: "3",
    },
  },
  {
    id: "third-party-accounting",
    title: "Third party Accounting",
    category: "Finance",
    description:
      "Automated ledger, journal entry, and tax sync with QuickBooks, Xero, or Sage.",
    icon: HiOutlineCalculator,
    enabled: true,
    settings: {
      accountingEngine: "QuickBooks Online",
      autoSyncDaily: true,
      syncTaxLinesSeparately: true,
      companyRealmId: "938271049281",
    },
  },
  {
    id: "square-pos-integration",
    title: "Square POS integration",
    category: "POS & ERP",
    description:
      "In-store point of sale sync, hardware barcode scanning, and multi-location offline sales.",
    icon: HiOutlineComputerDesktop,
    enabled: false,
    settings: {
      squareApplicationId: "sq0idp-KOOLBUY-DEMO",
      accessToken: "EAAAEO8...92",
      syncInventory: true,
    },
  },
  {
    id: "gofrugal-pos-integration",
    title: "GoFrugal POS integration",
    category: "POS & ERP",
    description:
      "Retail and wholesale omnichannel POS connectivity for physical appliances and stores.",
    icon: HiOutlineQrCode,
    enabled: false,
    settings: {
      storeKey: "GF-KOOLBUY-LAGOS-01",
      apiLicenseKey: "LIC-GOFRUGAL-92819",
      realTimeStockPull: true,
    },
  },
  {
    id: "influencer-module",
    title: "Influencer Module",
    category: "Core",
    description:
      "Brand ambassador custom affiliate links, promo commission tiers, and payout tracking.",
    icon: HiOutlineUserPlus,
    enabled: true,
    settings: {
      defaultCommissionRate: "5%",
      minimumPayoutThreshold: "₦25,000",
      autoGenerateAffiliateSlugs: true,
    },
  },
  {
    id: "notification-pickup-delivery",
    title: "Notification for Pickup Delivery",
    category: "Communications",
    description:
      "Automated customer SMS and push alerts when orders arrive at the hub or pickup station.",
    icon: HiOutlineClock,
    enabled: true,
    settings: {
      sendArrivalSMS: true,
      requireOtpAtCounter: true,
      reminderAfterHours: "48",
    },
  },
  {
    id: "marg-cron-schedular",
    title: "Marg Cron Schedular",
    category: "POS & ERP",
    description:
      "Scheduled cron task executions for Marg ERP automated stock reconciliation.",
    icon: HiOutlineArrowPath,
    enabled: true,
    settings: {
      cronExpression: "0 2 * * * (Daily at 2:00 AM)",
      retryOnFailure: true,
      lastStatus: "Success (Ran 4 hours ago)",
    },
  },
  {
    id: "vendor-notification-product-stock",
    title: "Vendor Notification Product Stock",
    category: "Core",
    description:
      "Real-time alerts to vendors when inventories fall below critical minimum thresholds.",
    icon: HiOutlineCube,
    enabled: true,
    settings: {
      criticalStockUnits: "3",
      sendEmailDigest: true,
      sendAppPushNotification: true,
    },
  },
  {
    id: "lumen",
    title: "Lumen",
    category: "IoT & Solar",
    description:
      "Telemetry engine for solar energy generation, battery cycles, and Koolboks IoT cold units.",
    icon: HiOutlineSun,
    enabled: true,
    badge: "IoT Telemetry",
    settings: {
      iotEndpoint: "https://telemetry.lumen.koolboks.com/v2",
      syncIntervalMins: "15",
      autoAlertOnLowBattery: true,
    },
  },
  {
    id: "tax-jar",
    title: "Tax-Jar",
    category: "Finance",
    description:
      "Automated sales tax rate lookup, economic nexus tracking, and filing reports.",
    icon: HiOutlineReceiptPercent,
    enabled: false,
    settings: {
      apiToken: "taxjar_sandbox_9827104928",
      automaticCalculations: true,
    },
  },
  {
    id: "blockchain-route-formation",
    title: "Blockchain Route Formation",
    category: "Logistics",
    description:
      "Decentralized route verification, cryptographic chain-of-custody, and proof of cold-chain transit.",
    icon: HiOutlineCircleStack,
    enabled: false,
    badge: "Experimental",
    settings: {
      network: "Polygon POS Mainnet",
      smartContractAddress: "0x892719aF99B083fD4eA3129841C30E398912C092",
      logWaypointsOnChain: true,
    },
  },
  {
    id: "zoho-inventory",
    title: "Zoho Inventory",
    category: "POS & ERP",
    description:
      "Cloud-based multi-warehouse inventory, SKU mapping, and purchase order sync.",
    icon: HiOutlineCube,
    enabled: true,
    settings: {
      organizationId: "782910482",
      clientId: "1000.KOOLBUY_ZOHO_PROD",
      autoSyncSKUs: true,
    },
  },
  {
    id: "angaza",
    title: "Angaza",
    category: "IoT & Solar",
    description:
      "Pay-As-You-Go (PAYG) solar customer accounts, keycode generation, and automated hardware enablement.",
    icon: HiOutlineBolt,
    enabled: true,
    badge: "Solar PAYG",
    settings: {
      angazaApiUrl: "https://api.angaza.com/v1",
      orgSlug: "koolboks-solars",
      autoIssueKeycodes: true,
      gracePeriodDays: "3",
    },
  },
];

/* =========================================================================
   INITIAL DATA: 68 CUSTOM MODS (EXACT LIST FROM USER)
   ========================================================================= */

const initialCustomMods: CustomModItem[] = [
  {
    id: "pharmacy-mod",
    name: "Pharmacy Mod",
    description:
      "Offer restricted products like medicines which require prescription. Customer will have the option to add prescription on the cart page.",
    enabled: false,
    category: "E-Commerce",
  },
  {
    id: "inquiry-mod",
    name: "Inquiry Mod",
    description:
      "Set products to be only available for Inquiry and hide the price.",
    enabled: true,
    category: "E-Commerce",
  },
  {
    id: "isolate-single-vendor-order",
    name: "Isolate Single Vendor Order",
    description:
      "Only allow customers to place order from one vendor at a time.",
    enabled: true,
    category: "Vendor Rules",
  },
  {
    id: "subscription-mod",
    name: "Subscription Mod",
    description:
      "Enable the option to create Subscriptions for Customers and Vendors.",
    enabled: true,
    category: "E-Commerce",
  },
  {
    id: "subscription-tab",
    name: "Subscription Tab",
    description: "Enable subscription tab for taxi/cab.",
    enabled: false,
    category: "Booking & Rides",
  },
  {
    id: "pre-order-tips",
    name: "Pre Order Tips",
    description: "Manage the option to Tip before the Order..",
    enabled: true,
    category: "E-Commerce",
  },
  {
    id: "post-order-tips",
    name: "Post Order Tips",
    description: "Manage the option to Tip after the Order.",
    enabled: true,
    category: "E-Commerce",
  },
  {
    id: "auto-implement-tip-5",
    name: "Auto Implement Tip 5%",
    description: "Enable to apply auto implement 5 percent tip.",
    enabled: false,
    category: "E-Commerce",
  },
  {
    id: "product-order-form",
    name: "Product Order Form",
    description:
      "Add a Product Order form. Create Dynamic questions per product.",
    enabled: true,
    category: "E-Commerce",
  },
  {
    id: "gifting",
    name: "Gifting",
    description: "Enable option to mark an Order to be gift wrapped.",
    enabled: true,
    category: "E-Commerce",
  },
  {
    id: "pickup-delivery-service-area",
    name: "Pickup Delivery Service Area",
    description:
      "Option to show Pickup Delivery Vendors based on First location restricted to Service Areas only",
    enabled: true,
    category: "Logistics",
  },
  {
    id: "minimum-order-increment",
    name: "Minimum Order/Increment",
    description: "Set the minimum order and minimum increment per product..",
    enabled: true,
    category: "E-Commerce",
  },
  {
    id: "static-delivery-fee",
    name: "Static Delivery fee",
    description:
      "Set a static Delivery Price per vendor based on Minimum Order Value.",
    enabled: false,
    category: "Logistics",
  },
  {
    id: "max-safety",
    name: "Max Safety",
    description: "Enable to give max safety option to vendors.",
    enabled: true,
    category: "Vendor Rules",
  },
  {
    id: "hide-customer-details",
    name: "Hide customer details",
    description: "Enable to hide customer details from order.",
    enabled: false,
    category: "Vendor Rules",
  },
  {
    id: "user-place-order-documents",
    name: "User Place Order Documents",
    description: "Enable to require documents at the time of placing on order.",
    enabled: true,
    category: "E-Commerce",
  },
  {
    id: "return-request",
    name: "Return Request",
    description: "Enable to show return request functionality for vendors.",
    enabled: true,
    category: "Vendor Rules",
  },
  {
    id: "hide-order-preparation-time",
    name: "Hide Order Preparation Time",
    description: "Enable to hide order preparation time.",
    enabled: false,
    category: "Logistics",
  },
  {
    id: "order-cancellation-by-user",
    name: "Order Cancellation By User",
    description: "Enable to give permission to user for cancelling order.",
    enabled: true,
    category: "E-Commerce",
  },
  {
    id: "book-for-a-friend",
    name: "Book for a Friend",
    description: "Enable to add book for a friend functionality for customers.",
    enabled: true,
    category: "Booking & Rides",
  },
  {
    id: "static-dropoff-location",
    name: "Static dropoff location",
    description:
      "Enable to add the predefined list and this will reflect in the drop-off location.",
    enabled: false,
    category: "Logistics",
  },
  {
    id: "vendor-tags",
    name: "Vendor Tags",
    description: "Enable to add vendor tags.",
    enabled: true,
    category: "Vendor Rules",
  },
  {
    id: "service-area-for-banners",
    name: "Service Area For Banners",
    description: "Enable service area for banners.",
    enabled: true,
    category: "General",
  },
  {
    id: "stop-order-acceptance",
    name: "Stop Order Acceptance",
    description:
      "Activate to display a busy message to customers and stop accepting orders.",
    enabled: false,
    category: "Vendor Rules",
  },
  {
    id: "show-map-on-search-screen",
    name: "Show map on search screen",
    description:
      "Enable to show activate vendor's in map-view on search screen.",
    enabled: true,
    category: "General",
  },
  {
    id: "order-update-by-vendor",
    name: "Order Update By Vendor",
    description: "Enable to show edit button on order detail for vendor.",
    enabled: true,
    category: "Vendor Rules",
  },
  {
    id: "enable-bidding",
    name: "Enable Bidding",
    description: "Enable to allow customers to bid on orders.",
    enabled: false,
    category: "Booking & Rides",
  },
  {
    id: "food-truck-service",
    name: "Food Truck Service",
    description: "Enable or disable multiple service area for trucks",
    enabled: false,
    category: "Logistics",
  },
  {
    id: "attribute",
    name: "Attribute",
    description: "Enable to show attribute on catalog screen.",
    enabled: true,
    category: "E-Commerce",
  },
  {
    id: "long-term-service",
    name: "Long Term Service",
    description: "Enable to add long term service.",
    enabled: true,
    category: "General",
  },
  {
    id: "gst-details-for-vendor",
    name: "GST Details for vendor",
    description: "Enable to show GST details for vendor registration",
    enabled: true,
    category: "Vendor Rules",
  },
  {
    id: "banking-details-for-vendor",
    name: "Banking Details for vendor",
    description: "Enable to show Banking details for vendor registration",
    enabled: true,
    category: "Vendor Rules",
  },
  {
    id: "advanced-details-for-vendor",
    name: "Advanced Details for vendor",
    description: "Enable to show Advanced details for vendor registration",
    enabled: true,
    category: "Vendor Rules",
  },
  {
    id: "vendor-category-for-vendor",
    name: "Vendor Category for vendor",
    description: "Enable to show Vendor Category for vendor registration",
    enabled: true,
    category: "Vendor Rules",
  },
  {
    id: "show-seller-module",
    name: "Show Seller Module",
    description: "Enable to show Seller Module",
    enabled: true,
    category: "Vendor Rules",
  },
  {
    id: "gift-card",
    name: "Gift Card",
    description: "Enable to allow Gift Card.",
    enabled: true,
    category: "E-Commerce",
  },
  {
    id: "cab-pooling",
    name: "Cab Pooling",
    description: "Enable to allow customers to book Cab Pooling.",
    enabled: false,
    category: "Booking & Rides",
  },
  {
    id: "tracking-url",
    name: "Tracking Url",
    description: "Enable to allow guest customers to tracking url.",
    enabled: true,
    category: "Logistics",
  },
  {
    id: "tracking-url-sms-enable",
    name: "Tracking Url Sms Enable",
    description:
      "Enable to access guest customers to tracking url via sms otp.",
    enabled: true,
    category: "Communications",
  },
  {
    id: "place-order-to-dispatcher-even-if-delivery-fee-is-zero",
    name: "Place Order To Dispatcher even if delivery fee is zero",
    description:
      "Enable to place order To dispatcher even if delivery fee is zero.",
    enabled: true,
    category: "Logistics",
  },
  {
    id: "enable-to-save-kyc-details-for-user-registration",
    name: "Enable to save kyc details for user registration",
    description: "Enable to save kyc details for user registration.",
    enabled: true,
    category: "General",
  },
  {
    id: "customer-successfull-signup-email",
    name: "Customer Successfull Signup Email",
    description: "Enable to Send Email on Customer Successfull Signup.",
    enabled: true,
    category: "Communications",
  },
  {
    id: "upload-file-in-instructions",
    name: "Upload file In instructions",
    description: "Enable to show price by role on edit's vendor screen.",
    enabled: true,
    category: "Vendor Rules",
  },
  {
    id: "admin-vendor-rating",
    name: "Admin Vendor Rating",
    description: "Enable to show vendor on the basis of rating .",
    enabled: true,
    category: "Vendor Rules",
  },
  {
    id: "compare-product",
    name: "Compare Product",
    description:
      "Enable Compare Product Option in Product Details Recomended For ECommerce.",
    enabled: true,
    category: "E-Commerce",
  },
  {
    id: "freelancer-mod-for-service-booking",
    name: "Freelancer Mod for Service Booking",
    description: "To view list of agents on booking",
    enabled: false,
    category: "Booking & Rides",
  },
  {
    id: "map-configuration-mod",
    name: "Map Configuration",
    description:
      "Enable this if you want to search address within your country",
    enabled: true,
    category: "Logistics",
  },
  {
    id: "request-for-particular-driver",
    name: "Request for Particular Driver",
    description: "Enable to allow customers to book particular driver.",
    enabled: false,
    category: "Booking & Rides",
  },
  {
    id: "recurring-booking",
    name: "Recurring Booking",
    description: "Enable Recurring Booking.",
    enabled: true,
    category: "Booking & Rides",
  },
  {
    id: "rental-weekly-monthly-price",
    name: "Rental Weekly Monthly Price",
    description:
      "Enable to add weekly and monthly price for product in rental.",
    enabled: true,
    category: "E-Commerce",
  },
  {
    id: "share-ride-users",
    name: "Share Ride Users",
    description:
      "Enable to share ride details and split fare with other users.",
    enabled: false,
    category: "Booking & Rides",
  },
  {
    id: "curb-side",
    name: "Curb Side",
    description: "Enable Curb Side Notification To Vendor.",
    enabled: true,
    category: "Logistics",
  },
  {
    id: "customer-allergic-items",
    name: "Customer Allergic Items",
    description: "Enable this for Customer add Allergic Items.",
    enabled: false,
    category: "E-Commerce",
  },
  {
    id: "vendor-marg-configuration",
    name: "Vendor Marg Configuration",
    description: "Enable this for Vendor add own Marg Configuration.",
    enabled: true,
    category: "Vendor Rules",
  },
  {
    id: "manage-roles-permission",
    name: "Manage Roles & Permission",
    description: "Enable role and permission for users.",
    enabled: true,
    category: "General",
  },
  {
    id: "car-rental",
    name: "Car Rental",
    description:
      "Enable For Rental Protection,Booking Options and for Destination.",
    enabled: false,
    category: "Booking & Rides",
  },
  {
    id: "sms-on-complete-order",
    name: "SMS on Complete Order",
    description: "Enable sms for complete order.",
    enabled: true,
    category: "Communications",
  },
  {
    id: "sms-on-cancel-order",
    name: "SMS on Cancel Order",
    description: "Enable sms for cancel order.",
    enabled: true,
    category: "Communications",
  },
  {
    id: "sms-on-booked-ride",
    name: "SMS on Booked Ride",
    description: "Enable sms for booked ride.",
    enabled: false,
    category: "Communications",
  },
  {
    id: "product-measurement",
    name: "Product Measurement",
    description: "Enable measurement in (CM/KG).",
    enabled: true,
    category: "E-Commerce",
  },
  {
    id: "enable-freelancer-location-in-homepage",
    name: "Enable Freelancer Location in Homepage",
    description: "Enable Freelancer Location in Homepage.",
    enabled: false,
    category: "General",
  },
  {
    id: "bulk-order-product",
    name: "Bulk Order Product",
    description: "Enable Bulk Order Product Recomended For ECommerce.",
    enabled: true,
    category: "E-Commerce",
  },
  {
    id: "enable-pwa",
    name: "Enable PWA",
    description:
      "Progressive Web Application support with offline mode and home-screen install prompt.",
    enabled: true,
    category: "General",
  },
  {
    id: "vendor-online-status-enable-disable",
    name: "Vendor Online Status Enable/Disable",
    description: "Change Online Status In Vendor App Enable/Disable.",
    enabled: true,
    category: "Vendor Rules",
  },
  {
    id: "google-matrix-with-only-app",
    name: "Google Matrix with Only App",
    description: "Change Google Matrix Api /AppDisable.",
    enabled: true,
    category: "Logistics",
  },
  {
    id: "cart-cms-pages",
    name: "Cart CMS Pages",
    description: "Show CMS pages on cart page for all modules",
    enabled: true,
    category: "E-Commerce",
  },
  {
    id: "upload-document-report-by-vendor",
    name: "Upload document report by vendor",
    description: "Enable upload report in vendor.",
    enabled: true,
    category: "Vendor Rules",
  },
  {
    id: "product-measurment-extra",
    name: "Product Measurment",
    description: "To Add Measurment for Product.",
    enabled: true,
    category: "E-Commerce",
  },
];

/* =========================================================================
   MAIN COMPONENT
   ========================================================================= */

export default function ConfigurationsPage() {
  const [activeTab, setActiveTab] = useState<"cards" | "mods">("cards");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedModCategory, setSelectedModCategory] = useState<string>("All");

  // State
  const [configCards, setConfigCards] =
    useState<ConfigCardData[]>(initialConfigCards);
  const [customMods, setCustomMods] =
    useState<CustomModItem[]>(initialCustomMods);

  // Modal / Drawer state for configuring a card
  const [activeCardToEdit, setActiveCardToEdit] =
    useState<ConfigCardData | null>(null);
  const [editFormData, setEditFormData] = useState<Record<string, any>>({});
  const [saveToast, setSaveToast] = useState<string | null>(null);

  // Handle card toggle
  const toggleCardEnabled = (id: string) => {
    setConfigCards((prev) =>
      prev.map((c) => (c.id === id ? { ...c, enabled: !c.enabled } : c)),
    );
    showToast("Configuration status updated!");
  };

  // Handle mod toggle
  const toggleModEnabled = (id: string) => {
    setCustomMods((prev) =>
      prev.map((m) => (m.id === id ? { ...m, enabled: !m.enabled } : m)),
    );
  };

  const showToast = (msg: string) => {
    setSaveToast(msg);
    setTimeout(() => setSaveToast(null), 3000);
  };

  // Open edit drawer for a configuration card
  const handleOpenConfigModal = (card: ConfigCardData) => {
    setActiveCardToEdit(card);
    setEditFormData({ ...card.settings });
  };

  const handleSaveCardSettings = () => {
    if (!activeCardToEdit) return;
    setConfigCards((prev) =>
      prev.map((c) =>
        c.id === activeCardToEdit.id
          ? { ...c, settings: { ...editFormData } }
          : c,
      ),
    );
    setActiveCardToEdit(null);
    showToast(`Updated settings for ${activeCardToEdit.title}!`);
  };

  // Filtered Cards
  const filteredCards = useMemo(() => {
    if (!searchQuery.trim()) return configCards;
    const q = searchQuery.toLowerCase();
    return configCards.filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q),
    );
  }, [configCards, searchQuery]);

  // Filtered Mods
  const filteredMods = useMemo(() => {
    return customMods.filter((m) => {
      const matchesSearch =
        !searchQuery.trim() ||
        m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.category.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCat =
        selectedModCategory === "All" || m.category === selectedModCategory;

      return matchesSearch && matchesCat;
    });
  }, [customMods, searchQuery, selectedModCategory]);

  const enabledModsCount = useMemo(
    () => customMods.filter((m) => m.enabled).length,
    [customMods],
  );
  const enabledCardsCount = useMemo(
    () => configCards.filter((c) => c.enabled).length,
    [configCards],
  );

  return (
    <div className="flex flex-col gap-6 mx-auto pb-16">
      {/* Toast alert */}
      {saveToast && (
        <div className="fixed top-20 right-8 z-50 bg-[#1D3557] text-white text-xs px-4 py-3 rounded-lg shadow-xl flex items-center gap-2 animate-in fade-in slide-in-from-top-2 duration-200">
          <HiOutlineCheckCircle className="w-4 h-4 text-[#00BCD4]" />
          <span>{saveToast}</span>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-100 pb-5">
        <div>
          {/* <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
              Configurations
            </h1>
            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-brand-blue-light text-brand-blue border border-[#00BCD4]/20">
              System Settings
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Configure core integrations, payment gateways, social sign-ons,
            APIs, and operational custom mods
          </p> */}
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-72">
            <input
              type="text"
              placeholder="Search configurations or mods..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs pl-8 pr-3 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-[#00BCD4] shadow-2xs"
            />
            <HiOutlineMagnifyingGlass className="w-4 h-4 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
          </div>
        </div>
      </div>

      {/* Top Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-2 rounded-lg border border-gray-100 shadow-2xs">
        <div className="flex items-center gap-1.5 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab("cards")}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
              activeTab === "cards"
                ? "bg-[#00BCD4] text-white shadow-xs"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            <HiOutlineCog6Tooth className="w-4 h-4" />
            <span>Integrations & Services</span>
            <span
              className={`px-1.5 py-0.5 text-[10px] rounded-full font-semibold ${
                activeTab === "cards"
                  ? "bg-white/20 text-white"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              {enabledCardsCount}/{configCards.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("mods")}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
              activeTab === "mods"
                ? "bg-[#00BCD4] text-white shadow-xs"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            <HiOutlineAdjustmentsHorizontal className="w-4 h-4" />
            <span>Custom Mods</span>
            <span
              className={`px-1.5 py-0.5 text-[10px] rounded-full font-semibold ${
                activeTab === "mods"
                  ? "bg-white/20 text-white"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              {enabledModsCount}/{customMods.length}
            </span>
          </button>
        </div>

        {activeTab === "mods" && (
          <div className="flex items-center gap-1.5 overflow-x-auto px-1 py-0.5">
            {[
              "All",
              "E-Commerce",
              "Logistics",
              "Vendor Rules",
              "Booking & Rides",
              "Communications",
              "General",
            ].map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedModCategory(cat)}
                className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors cursor-pointer shrink-0 ${
                  selectedModCategory === cat
                    ? "bg-brand-blue-light text-brand-blue font-bold border border-[#00BCD4]/30"
                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-800 border border-transparent"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* =========================================================================
          TAB 1: INTEGRATION & CONFIGURATION CARDS (23 Cards)
          ========================================================================= */}
      {activeTab === "cards" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCards.map((card) => {
            const IconComponent = card.icon;

            return (
              <div
                key={card.id}
                className={`bg-white rounded-lg border transition-all duration-200 shadow-2xs hover:shadow-sm flex flex-col justify-between p-5 relative overflow-hidden ${
                  card.enabled
                    ? "border-gray-100"
                    : "border-gray-200/60 bg-gray-50/40 opacity-80"
                }`}
              >
                <div>
                  {/* Card Header & Category Tag */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 border ${
                          card.enabled
                            ? "bg-brand-blue-light border-[#00BCD4]/20 text-[#00BCD4]"
                            : "bg-gray-100 border-gray-200 text-gray-400"
                        }`}
                      >
                        <IconComponent className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                          {card.category}
                        </span>
                        <h3 className="text-sm font-bold text-gray-900 leading-snug">
                          {card.title}
                        </h3>
                      </div>
                    </div>

                    {/* Toggle Switch */}
                    <label className="relative inline-flex items-center cursor-pointer shrink-0">
                      <input
                        type="checkbox"
                        checked={card.enabled}
                        onChange={() => toggleCardEnabled(card.id)}
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#00BCD4]" />
                    </label>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-gray-500 leading-relaxed mb-4">
                    {card.description}
                  </p>

                  {/* Badge & Quick Details Preview */}
                  <div className="flex flex-wrap items-center gap-2 mb-4">
                    {card.badge && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#00BCD4]/10 text-brand-blue border border-[#00BCD4]/20">
                        {card.badge}
                      </span>
                    )}
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold ${
                        card.enabled
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : "bg-gray-100 text-gray-600 border border-gray-200"
                      }`}
                    >
                      {card.enabled ? "Active" : "Disabled"}
                    </span>
                    <span className="text-[11px] text-gray-400 ml-auto font-mono">
                      {Object.keys(card.settings).length} parameters
                    </span>
                  </div>
                </div>

                {/* Bottom Action Footer */}
                <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-[11px] text-gray-400 font-medium">
                    {card.enabled
                      ? "Synced & Operational"
                      : "Turn toggle on to activate"}
                  </span>

                  <Button
                    variant="outline"
                    shape="rounded-sm"
                    className="text-xs font-semibold px-3 py-1.5 border-gray-200 hover:border-[#00BCD4] hover:text-[#00BCD4] flex items-center gap-1.5 cursor-pointer"
                    onClick={() => handleOpenConfigModal(card)}
                  >
                    <HiOutlinePencilSquare className="w-3.5 h-3.5" />
                    <span>Configure</span>
                  </Button>
                </div>
              </div>
            );
          })}

          {filteredCards.length === 0 && (
            <div className="col-span-full bg-white rounded-lg p-12 text-center border border-gray-100">
              <HiOutlineCog6Tooth className="w-10 h-10 text-gray-300 mx-auto mb-2" />
              <p className="text-sm font-bold text-gray-700">
                No configuration cards found
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Try refining your search keyword above
              </p>
            </div>
          )}
        </div>
      )}

      {/* =========================================================================
          TAB 2: CUSTOM MODS (68 Items with Search & Category Filters)
          ========================================================================= */}
      {activeTab === "mods" && (
        <div className="bg-white rounded-lg border border-gray-100 shadow-2xs overflow-hidden flex flex-col">
          {/* Header Bar */}
          <div className="p-4 sm:p-5 border-b border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-gray-50/50">
            <div>
              <h2 className="text-sm font-bold text-[#1D3557] uppercase tracking-wider">
                Custom Operational Mods ({filteredMods.length})
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Toggle dynamic operational capabilities, restrictions,
                registration fields, and modular behaviors
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-gray-700 bg-white px-3 py-1.5 rounded-md border border-gray-200 shadow-2xs">
                {enabledModsCount} of {customMods.length} Mods Active
              </span>
            </div>
          </div>

          {/* Mods Grid / List */}
          <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:gap-px bg-gray-100">
            {filteredMods.map((mod) => (
              <div
                key={mod.id}
                className="bg-white p-4 sm:p-5 flex items-start justify-between gap-4 transition-colors hover:bg-gray-50/60"
              >
                <div className="flex flex-col gap-1 pr-2 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="text-xs font-bold text-gray-900 tracking-tight">
                      {mod.name}
                    </h4>
                    <span className="text-[10px] px-2 py-0.2 rounded font-semibold bg-gray-100 text-gray-600 border border-gray-200">
                      {mod.category}
                    </span>
                    {mod.enabled && (
                      <span className="text-[10px] px-1.5 py-0.2 rounded font-bold bg-emerald-50 text-emerald-600 border border-emerald-200">
                        Active
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed mt-0.5">
                    {mod.description}
                  </p>
                </div>

                {/* Toggle Switch */}
                <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-0.5">
                  <input
                    type="checkbox"
                    checked={mod.enabled}
                    onChange={() => toggleModEnabled(mod.id)}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#00BCD4]" />
                </label>
              </div>
            ))}
          </div>

          {filteredMods.length === 0 && (
            <div className="p-12 text-center bg-white">
              <HiOutlineAdjustmentsHorizontal className="w-10 h-10 text-gray-300 mx-auto mb-2" />
              <p className="text-sm font-bold text-gray-700">
                No custom mods matched your filters
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Try switching category or resetting search query
              </p>
            </div>
          )}
        </div>
      )}

      {/* =========================================================================
          CONFIG MODAL / DRAWER FOR SELECTED CARD
          ========================================================================= */}
      {activeCardToEdit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-lg border border-gray-100 shadow-2xl w-full max-w-xl overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-brand-blue-light border border-[#00BCD4]/20 text-[#00BCD4] flex items-center justify-center">
                  <HiOutlineCog6Tooth className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900">
                    Configure {activeCardToEdit.title}
                  </h3>
                  <span className="text-[11px] text-gray-400 font-medium">
                    Category: {activeCardToEdit.category}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setActiveCardToEdit(null)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <HiOutlineXMark className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body / Settings Inputs */}
            <div className="p-5 overflow-y-auto flex flex-col gap-4">
              <p className="text-xs text-gray-500 leading-relaxed border-b border-gray-100 pb-3">
                {activeCardToEdit.description}
              </p>

              {Object.entries(editFormData).map(([key, value]) => {
                const label = key
                  .replace(/([A-Z])/g, " $1")
                  .replace(/^./, (str) => str.toUpperCase());

                if (typeof value === "boolean") {
                  return (
                    <div
                      key={key}
                      className="flex items-center justify-between p-3 rounded-lg border border-gray-100 bg-gray-50/50"
                    >
                      <div>
                        <h4 className="text-xs font-bold text-gray-800">
                          {label}
                        </h4>
                        <span className="text-[10px] text-gray-400">
                          Toggle feature enablement for {activeCardToEdit.title}
                        </span>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer shrink-0">
                        <input
                          type="checkbox"
                          checked={value}
                          onChange={(e) =>
                            setEditFormData((prev) => ({
                              ...prev,
                              [key]: e.target.checked,
                            }))
                          }
                          className="sr-only peer"
                        />
                        <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#00BCD4]" />
                      </label>
                    </div>
                  );
                }

                return (
                  <div key={key} className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                      {label}
                    </label>
                    <input
                      type="text"
                      value={value}
                      onChange={(e) =>
                        setEditFormData((prev) => ({
                          ...prev,
                          [key]: e.target.value,
                        }))
                      }
                      className="w-full text-xs font-semibold px-3 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-[#00BCD4] text-gray-800"
                    />
                  </div>
                );
              })}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-gray-100 bg-gray-50/50 flex items-center justify-end gap-2.5">
              <Button
                variant="outline"
                shape="rounded-sm"
                className="text-xs font-semibold px-4 py-2 cursor-pointer border-gray-200"
                onClick={() => setActiveCardToEdit(null)}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                shape="rounded-sm"
                className="bg-[#00BCD4] hover:bg-[#00acc1] text-white text-xs font-semibold px-5 py-2 cursor-pointer shadow-xs"
                onClick={handleSaveCardSettings}
              >
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
