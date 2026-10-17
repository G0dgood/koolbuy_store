"use client";

import React, { useState, useEffect } from "react";
import { motion, Variants } from "framer-motion";
import { Header } from "@/app/components/Header";
import { Footer } from "@/app/components/Footer";
import { Button } from "@/app/components/Button";
import { Input } from "@/app/components/Form";
import { Icon } from "@/app/components/Icon";
import { ProfileSidebar } from "@/app/components/Profile/ProfileSidebar";
import { ProfileStats } from "@/app/components/Profile/ProfileStats";
import { EmptyState } from "@/app/components/EmptyState";
import { useAuthModal } from "@/app/context/AuthModalContext";
import { apiErrorMessage } from "@/lib/store/base-api";
import { Breadcrumbs } from "@/app/components/Breadcrumbs";
import {
  useGetProfileQuery,
  useUpdateProfileMutation,
  type UserProfile,
} from "@/lib/store/api/auth-api";
import {
  readStoredTokens,
  readStoredUser,
  AUTH_CHANGED_EVENT,
} from "@/lib/api";
import { toast } from "sonner";

const containerVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      staggerChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const LABEL = "text-[13px] font-medium text-brand-charcoal";
const FIELD =
  "h-11! rounded-xl! bg-black/[0.04]! border! border-transparent! px-4! py-0! text-[15px]! text-brand-charcoal placeholder:text-faint! outline-none shadow-none transition-colors focus:bg-white! focus:border-brand-orange! focus:ring-4! focus:ring-brand-orange/15!";

export default function ProfilePage() {
  const { openLogin } = useAuthModal();
  // null until the stored session has been read on the client
  const [hasToken, setHasToken] = useState<boolean | null>(null);
  const [cachedUser, setCachedUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    const syncSession = () => {
      const tokens = readStoredTokens();
      const tokenExists = Boolean(tokens?.access);
      setHasToken(tokenExists);
      setCachedUser(tokenExists ? readStoredUser<UserProfile>() : null);
    };
    syncSession();
    window.addEventListener(AUTH_CHANGED_EVENT, syncSession);
    window.addEventListener("storage", syncSession);
    return () => {
      window.removeEventListener(AUTH_CHANGED_EVENT, syncSession);
      window.removeEventListener("storage", syncSession);
    };
  }, []);

  const {
    data: profile,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetProfileQuery(undefined, {
    skip: !hasToken,
  });

  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();

  const user = profile || cachedUser;

  // Name edits are kept as a draft over the saved profile; null = untouched
  const [draftFirst, setFirstName] = useState<string | null>(null);
  const [draftLast, setLastName] = useState<string | null>(null);
  const savedFirst = user?.first_name || user?.name?.split(" ")[0] || "";
  const savedLast =
    user?.last_name || user?.name?.split(" ").slice(1).join(" ") || "";
  const firstName = draftFirst ?? savedFirst;
  const lastName = draftLast ?? savedLast;
  const email = user?.email || "";
  const phone = user?.phone_number || "";

  const handleDiscard = () => {
    setFirstName(null);
    setLastName(null);
  };

  const handleSave = async () => {
    try {
      // PATCH /users/me/profile/ saves name only; email and phone are
      // sign-in identifiers and can't be changed here.
      await updateProfile({
        first_name: firstName.trim(),
        last_name: lastName.trim(),
      }).unwrap();
      toast.success("Profile saved");
      handleDiscard();
    } catch (err) {
      toast.error(apiErrorMessage(err, "Couldn't save your profile. Please try again."));
    }
  };

  return (
    <div className="min-h-screen bg-off-white flex flex-col font-inter">
      <Header />

      <div className="flex-1 max-w-[1440px] w-full mx-auto px-6 md:px-10 lg:px-16 py-8 md:py-12">
        {/* Breadcrumbs */}
        <Breadcrumbs
          items={[
            { label: "User dashboard", href: "/profile" },
            { label: "Personal info" },
          ]}
          className="mb-6 md:mb-8"
        />

        <div className="flex flex-col lg:flex-row gap-6 md:gap-8 items-start">
          {/* Enhanced Sidebar */}
          <ProfileSidebar />

          {/* Main Dashboard Content */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex-1 w-full flex flex-col gap-6 md:gap-8"
          >
            {hasToken === false ? (
              <motion.div variants={itemVariants}>
                <EmptyState
                  variant="card"
                  illustration="customers"
                  title="Sign in to view your profile"
                  description="Your personal details, orders and rewards will appear here once you sign in."
                  action={{ label: "Sign in", onClick: openLogin }}
                />
              </motion.div>
            ) : (
            <>
            <motion.div variants={itemVariants}>
              <ProfileStats signedIn={hasToken === true} />
            </motion.div>

            {/* Forms Section */}
            <motion.div
              variants={itemVariants}
              className="flex flex-col gap-4 md:gap-6"
            >
              <div className="flex flex-col gap-1">
                <h1 className="text-[20px] md:text-[22px] font-semibold text-brand-charcoal tracking-[-0.025em] leading-tight">
                  Personal information
                </h1>
                <p className="text-[14px] md:text-[15px] text-subtle">
                  Update your name. Email and phone are used to sign in and can&apos;t be changed here.
                </p>
              </div>

              <div className="bg-white rounded-tile overflow-hidden">
                <div className="p-6 md:p-8">
                  {(hasToken === null || isLoading) && !user ? (
                    <div
                      aria-label="Loading your profile"
                      className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-5 animate-pulse"
                    >
                      {[0, 1, 2, 3, 4].map((i) => (
                        <div
                          key={i}
                          className={`flex flex-col gap-1.5 ${i === 2 ? "md:col-span-2" : ""}`}
                        >
                          <div className="h-4 w-24 rounded-full bg-black/[0.06]" />
                          <div className="h-11 rounded-xl bg-black/[0.04]" />
                        </div>
                      ))}
                    </div>
                  ) : isError && !user ? (
                    <EmptyState
                      illustration="customers"
                      title="Couldn't load your profile"
                      description={apiErrorMessage(error)}
                      action={{ label: "Try again", onClick: () => refetch() }}
                    />
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-5">
                      <div className="flex flex-col gap-1.5">
                        <label className={LABEL}>First name</label>
                        <Input
                          placeholder="First name"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          className={FIELD}
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className={LABEL}>Last name</label>
                        <Input
                          placeholder="Last name"
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          className={FIELD}
                        />
                      </div>
                      <div className="flex flex-col gap-1.5 md:col-span-2">
                        <label className={LABEL}>Email address</label>
                        <Input
                          placeholder="Email address"
                          value={email}
                          disabled
                          type="email"
                          className={`${FIELD} opacity-70 cursor-not-allowed`}
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className={LABEL}>Phone number</label>
                        <Input
                          placeholder="Phone number"
                          value={phone}
                          disabled
                          className={`${FIELD} tabular-nums opacity-70 cursor-not-allowed`}
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className={LABEL}>Account Type</label>
                        <div className="flex items-center justify-between h-11 px-4 rounded-xl bg-black/[0.04] border border-transparent w-full">
                          <span className="text-[15px] text-brand-charcoal capitalize">
                            {user?.role || "Customer"}
                          </span>
                          <span className="text-xs px-2.5 py-0.5 bg-brand-orange-soft text-brand-charcoal font-medium rounded-full">
                            Active
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-6 py-5 md:px-8 border-t border-black/[0.06]">
                  <div className="flex items-center gap-2 text-[13px] text-subtle">
                    <Icon name="security" size="xs" className="text-faint" />
                    Your personal data is encrypted and secure.
                  </div>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="ghost"
                      shape="pill"
                      onClick={handleDiscard}
                      className="h-9 px-6 text-[13px]! font-medium! text-subtle hover:bg-black/[0.04]!"
                    >
                      Discard
                    </Button>
                    <Button
                      type="button"
                      variant="accent"
                      shape="pill"
                      onClick={handleSave}
                      disabled={isUpdating || !user || !firstName.trim()}
                      className="h-9 px-7 text-[13px]!"
                    >
                      {isUpdating ? "Saving..." : "Save profile"}
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>

            </>
            )}
          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
