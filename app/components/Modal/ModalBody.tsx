import React from "react";

interface ModalBodyProps {
  children: React.ReactNode;
  className?: string;
}

const ModalBody: React.FC<ModalBodyProps> = ({ children, className = "" }) => {
  return (
    <div className={`px-6 py-5 flex-1 overflow-y-auto ${className}`}>
      {children}
    </div>
  );
};

ModalBody.displayName = "ModalBody";

export default ModalBody;
