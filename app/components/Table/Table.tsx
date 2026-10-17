import React from "react";

interface TableProps extends React.HTMLAttributes<HTMLTableElement> {
  children: React.ReactNode;
  containerClassName?: string;
}

const Table: React.FC<TableProps> = ({ 
  children, 
  className = "", 
  containerClassName = "",
  ...props 
}) => {
  return (
    <div className={`w-full overflow-x-auto ${containerClassName}`}>
      <table 
        className={`w-full text-left border-collapse ${className}`}
        {...props}
      >
        {children}
      </table>
    </div>
  );
};

const TableHeader: React.FC<React.HTMLAttributes<HTMLTableSectionElement>> = ({ 
  children, 
  className = "",
  ...props 
}) => (
  <thead 
    className={`border-b border-black/[0.06] ${className}`}
    {...props}
  >
    {children}
  </thead>
);

const TableBody: React.FC<React.HTMLAttributes<HTMLTableSectionElement>> = ({ 
  children, 
  className = "",
  ...props 
}) => (
  <tbody 
    className={className}
    {...props}
  >
    {children}
  </tbody>
);

interface TableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  children: React.ReactNode;
  isSelected?: boolean;
}

const TableRow: React.FC<TableRowProps> = ({ 
  children, 
  className = "", 
  isSelected = false,
  ...props 
}) => (
  <tr 
    className={`
      border-b border-black/[0.06] transition-colors
      ${isSelected ? "bg-brand-orange-soft/50" : "hover:bg-off-white/50"}
      ${className}
    `}
    {...props}
  >
    {children}
  </tr>
);

interface TableCellProps extends React.TdHTMLAttributes<HTMLTableCellElement> {
  children?: React.ReactNode;
  isHeader?: boolean;
  align?: "left" | "center" | "right";
}

const TableCell: React.FC<TableCellProps> = ({ 
  children, 
  className = "", 
  isHeader = false, 
  align = "left",
  ...props 
}) => {
  const Tag = isHeader ? "th" : "td";
  const alignment = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
  };

  return (
    <Tag 
      className={`
        py-4 px-4 text-sm 
        ${isHeader ? "font-semibold text-faint" : "text-subtle font-medium"}
        ${alignment[align]}
        ${className}
      `}
      {...props}
    >
      {children}
    </Tag>
  );
};

export { Table, TableHeader, TableBody, TableRow, TableCell };
