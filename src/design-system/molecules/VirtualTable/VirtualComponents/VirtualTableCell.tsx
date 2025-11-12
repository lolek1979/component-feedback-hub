import React from 'react';
/**
 * VirtualTableCell
 *
 * A cell component for the virtualized table, used to render a single cell.
 * Supports custom styling and children.
 *
 * @param props.children - The content to render inside the cell.
 * @param props.className - Additional class names for styling.
 * @param props.style - Inline styles for the cell (e.g., width, transform).
 *
 * @example
 * <VirtualTableCell style={{ width: 150 }}>Row 1 Col 1</VirtualTableCell>
 */
interface VirtualTableCellProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

const VirtualTableCell = ({ children, className, style }: VirtualTableCellProps) => {
  return (
    <div className={className} role="cell" style={style}>
      {children}
    </div>
  );
};

export default VirtualTableCell;
