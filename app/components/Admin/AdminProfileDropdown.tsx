import { useUser } from "../../context/UserContext";
import { HiUser } from "react-icons/hi2";
import { Icon } from "../Icon";
import { DropdownMenu, DropdownFooterAction } from "../Dropdown/DropdownMenu";
import { useState } from "react";
import { ConfirmationModal } from "./ConfirmationModal";
import { useLogoutMutation } from "@/lib/store/api/auth-api";
import { clearStoredTokens, writeStoredUser } from "@/lib/api";

export const AdminProfileDropdown: React.FC = () => {
  const { userImage } = useUser();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [logoutUser, { isLoading: isLoggingOut }] = useLogoutMutation();
  return (
    <div className="absolute top-full right-0 pt-4 z-50 cursor-default">
      <DropdownMenu
        width={280}
        className="shadow-md border-gray-100 p-0 overflow-hidden"
      >
        {/* User Summary */}
        <div className="px-6 py-5 bg-gray-50/50 border-b border-gray-50 flex items-center gap-3">
          <div className="w-12 h-12 rounded-full border-2 border-white shadow-sm overflow-hidden shrink-0 bg-white flex items-center justify-center">
            {userImage ? (
              <img
                src={userImage}
                alt="Admin"
                className="w-full h-full object-cover"
              />
            ) : (
              <HiUser className="text-brand-orange-text w-6 h-6" />
            )}
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-bold text-brand-charcoal truncate leading-tight">
              Koolbuy Store Admin
            </span>
            <span className="text-[11px] font-bold text-gray-400 truncate uppercase tracking-wider mt-0.5">
              Super Administrator
            </span>
          </div>
        </div>

        {/* Action List */}
        <div className="p-2 flex flex-col">
          <button className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-brand-orange-soft hover:text-brand-orange-text transition-all group text-brand-charcoal">
            <Icon
              name="user-profile-circle"
              folder="dashboardIcon"
              size="sm"
              className="text-gray-400 group-hover:text-brand-orange-text"
            />
            <span className="text-[13px] font-bold">View Profile</span>
          </button>

          <button className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-brand-orange-soft hover:text-brand-orange-text transition-all group text-brand-charcoal">
            <Icon
              name="settings"
              folder="dashboardIcon"
              size="sm"
              className="text-gray-400 group-hover:text-brand-orange-text"
            />
            <span className="text-[13px] font-bold">Account Settings</span>
          </button>

          <button className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-brand-orange-soft hover:text-brand-orange-text transition-all group text-brand-charcoal">
            <Icon
              name="security"
              folder="icon"
              size="sm"
              className="text-gray-400 group-hover:text-brand-orange-text"
            />
            <span className="text-[13px] font-bold">Security & Audit</span>
          </button>

          <div className="h-px bg-gray-50 my-2 mx-4"></div>

          <button className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-brand-orange-soft hover:text-brand-orange-text transition-all group text-brand-charcoal">
            <Icon
              name="info-circle"
              folder="dashboardIcon"
              size="sm"
              className="text-gray-400 group-hover:text-brand-orange-text"
            />
            <span className="text-[13px] font-bold">Help & Support</span>
          </button>
        </div>

        {/* Footer Logout */}
        <DropdownFooterAction
          label="Logout Session"
          onClick={() => setIsLogoutModalOpen(true)}
          icon="ic_round-logout"
          className="h-14 py-0 text-rose-500 hover:bg-rose-50"
        />
      </DropdownMenu>

      <ConfirmationModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={async () => {
          try {
            await logoutUser().unwrap();
          } catch {
            /* ignore */
          } finally {
            clearStoredTokens();
            writeStoredUser(null);
            setIsLogoutModalOpen(false);
            window.location.href = "/admin/login";
          }
        }}
        title="Logout Session"
        message="Are you sure you want to end your current session? You will need to sign in again to access the administrative dashboard."
        confirmText={isLoggingOut ? "Logging out..." : "Yes, Logout Now"}
        cancelText="Stay Logged In"
        type="danger"
      />
    </div>
  );
};
