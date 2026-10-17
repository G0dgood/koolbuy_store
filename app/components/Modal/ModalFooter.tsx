import React from "react";

interface ModalFooterProps {
  children: React.ReactNode;
  className?: string;
}

const ModalFooter: React.FC<ModalFooterProps> = ({ children, className = "" }) => {
  return (
    <div className={`px-6 py-4 bg-off-white/70 flex flex-row gap-2.5 items-center justify-end border-t border-light-gray shrink-0 ${className}`}>
      {children}
    </div>
  );
};

ModalFooter.displayName = "ModalFooter";

export default ModalFooter;
