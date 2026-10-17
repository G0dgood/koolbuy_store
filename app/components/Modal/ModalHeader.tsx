"use client";

import { IoIosCloseCircleOutline } from "react-icons/io";
import { Icon } from "../Icon";

interface ModalHeaderProps {
  title: string;
  onClose: () => void;
  className?: string;
  hideBorder?: boolean;
  icon?: string;
}

export default function ModalHeader({
  title,
  onClose,
  className = "",
  hideBorder = false,
  icon,
}: ModalHeaderProps) {
  return (
    <div
      className={`flex items-center justify-between bg-white px-6 py-6 ${hideBorder ? "" : "border-b border-black/[0.06]"
        }`}
    >
      <div className="flex items-center gap-3">
        {icon && <Icon name={icon} size="sm" className="text-inherit" />}
        <h3
          className={`font-work text-[14px] font-normal tracking-[-0.03em] text-brand-orange-text md:text-[16px] ${className}`}
        >
          {title}
        </h3>
      </div>
      <button
        onClick={onClose}
        className="cursor-pointer text-subtle transition-colors hover:text-faint"
      >
        <IoIosCloseCircleOutline className={`text-[20px]`} />
      </button>
    </div>
  );
}
