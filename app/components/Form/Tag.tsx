import React from "react";
import { Icon } from "../Icon";

interface TagProps {
  label: string;
  onRemove?: () => void;
  className?: string;
}

const Tag: React.FC<TagProps> = ({ label, onRemove, className = "" }) => {
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-1 bg-black/[0.04] rounded text-xs font-semibold text-subtle ${className}`}>
      {label}
      {onRemove && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="p-0.5 hover:bg-black/[0.08] rounded transition-colors"
        >
          <Icon name="clear" size="xs" className="text-faint" />
        </button>
      )}
    </span>
  );
};

export { Tag };
