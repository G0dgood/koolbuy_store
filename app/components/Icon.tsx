import React from "react";
import {
  CardStackIcon,
  CopyIcon,
  DragHandleDots2Icon,
  ArrowRightIcon,
  LayersIcon,
} from "@radix-ui/react-icons";

interface IconProps extends React.HTMLAttributes<HTMLDivElement> {
  name: string;
  size?: "xs" | "sm" | "md" | "lg";
  folder?: "icon" | "dashboardIcon";
}

const sizes = {
  xs: "w-2.5 h-2.5",
  sm: "w-3.5 h-3.5",
  md: "w-5 h-5",
  lg: "w-6 h-6",
};

/* Names used in the code whose SVG never existed in public/, so the icon drew
   nothing. Each points at the closest file that does exist ("folder/name"),
   or at a Radix icon when there is no file. Add new icons as files instead. */
const ALIAS: Record<string, string> = {
  "dashboardIcon/filter": "icon/filter_list",
  "dashboardIcon/info-circle": "icon/info",
  "icon/alert-triangle": "icon/warning_amber",
  "icon/delete": "icon/delete_outline",
  "icon/trash": "dashboardIcon/Delete",
  "icon/edit": "icon/create",
  "icon/local_shipping": "icon/van",
  "icon/location_on": "icon/fmd_good",
  "icon/logout": "dashboardIcon/ic_round-logout",
  "icon/mail_outline": "icon/email",
  "icon/phone": "icon/call",
  "icon/plus": "icon/add",
  "icon/public": "icon/language",
};

const RADIX: Record<string, React.ComponentType<{ className?: string }>> = {
  // "View" opens the record: an arrow, as the CRM's KArrowRightIcon.
  "dashboardIcon/view": ArrowRightIcon,
  "icon/visibility": ArrowRightIcon,
  "icon/copy": CopyIcon,
  "icon/drag_indicator": DragHandleDots2Icon,
  "dashboardIcon/layer": LayersIcon,
  "icon/paypal": CardStackIcon,
};

const Icon: React.FC<IconProps> = ({ name, size = "md", folder = "icon", className = "", ...props }) => {
  const key = `${folder}/${name}`;

  const Radix = RADIX[key];
  if (Radix) {
    return (
      <span className={`k-icon inline-flex items-center justify-center ${sizes[size]} ${className}`} aria-hidden {...props}>
        <Radix className="w-full h-full" />
      </span>
    );
  }

  const iconUrl = `/${ALIAS[key] ?? key}.svg`;

  return (
    <span
      className={`k-icon inline-block ${sizes[size]} bg-current ${className}`}
      style={{
        maskImage: `url("${iconUrl}")`,
        maskRepeat: "no-repeat",
        maskPosition: "center",
        maskSize: "contain",
        WebkitMaskImage: `url("${iconUrl}")`,
        WebkitMaskRepeat: "no-repeat",
        WebkitMaskPosition: "center",
        WebkitMaskSize: "contain",
      }}
      {...props}
    />
  );
};

export { Icon };
