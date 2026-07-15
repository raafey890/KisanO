/**
 * KisanO Design System — Table Package
 * TableCell
 *
 * A single table cell component. Supports header and data cells,
 * text alignment, truncation, and accessibility.
 *
 * Single Responsibility: Render one table cell.
 * Does not manage table state or business logic.
 *
 * @module components/ui/Table/TableCell
 */

import { forwardRef, memo, useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import { motion, useReducedMotion } from 'framer-motion';

import {
  TABLE_DEFAULTS,
} from './tableVariants';
import {
  mergeClasses,
  resolveResponsiveClasses,
  getTableCellClasses,
} from './tableUtils';

/* ---------------------------------- */
/* Component-specific tokens          */
/* ---------------------------------- */

/** Motion variants for cell animation. */
const CELL_MOTION = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.1, ease: [0.4, 0, 0.2, 1] },
};

/** Sort direction icons. */
const SORT_ICONS = {
  asc: (
    <svg className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <path d="M12 5v14" />
      <path d="M5 12l7-7 7 7" />
    </svg>
  ),
  desc: (
    <svg className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <path d="M12 19V5" />
      <path d="M5 12l7 7 7-7" />
    </svg>
  ),
  default: (
    <svg className="h-3 w-3 opacity-30" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <path d="M12 5v14" />
      <path d="M5 12l7-7 7 7" />
      <path d="M5 12l7 7 7-7" />
    </svg>
  ),
};

/* ---------------------------------- */
/* Component                          */
/* ---------------------------------- */

/**
 * TableCell – a single table cell.
 *
 * @component
 * @example
 * <TableCell>John</TableCell>
 *
 * @example
 * <TableCell isHeader align="center" width="100px">
 *   Name
 * </TableCell>
 */
const TableCell = memo(
  forwardRef(function TableCell(
    {
      children,
      isHeader = false,
      align = 'left',
      width,
      colSpan = 1,
      rowSpan = 1,
      truncate = false,
      sortable = false,
      sorted = false,
      sortDirection = 'asc',
      onSort,
      disabled = false,
      loading = false,
      render,
      responsive,
      className = '',
      role = 'cell',
      'aria-label': ariaLabel,
      ...rest
    },
    ref,
  ) {
    const prefersReducedMotion = useReducedMotion();

    // Cell classes.
    const cellClasses = useMemo(
      () =>
        getTableCellClasses({
          size: TABLE_DEFAULTS.size,
          className,
          align,
          isHeader,
          disabled,
          loading,
        }),
      [className, align, isHeader, disabled, loading],
    );

    // Responsive overrides.
    const responsiveClasses = useMemo(
      () => (responsive ? resolveResponsiveClasses(responsive) : ''),
      [responsive],
    );

    const finalClasses = useMemo(
      () => mergeClasses(cellClasses, responsiveClasses, truncate ? 'truncate' : ''),
      [cellClasses, responsiveClasses, truncate],
    );

    // Handle sort click.
    const handleSortClick = useCallback(
      (event) => {
        if (disabled || loading || !sortable) return;
        onSort?.(event);
      },
      [disabled, loading, sortable, onSort],
    );

    // Render content.
    const content = useMemo(() => {
      if (render) {
        return render(children);
      }
      return children;
    }, [children, render]);

    // Sort icon.
    const sortIcon = useMemo(() => {
      if (!sortable) return null;
      if (sorted) {
        return SORT_ICONS[sortDirection] || SORT_ICONS.asc;
      }
      return SORT_ICONS.default;
    }, [sortable, sorted, sortDirection]);

    // Motion props - respect reduced motion.
    const motionProps = useMemo(() => {
      if (prefersReducedMotion) {
        return { initial: false, animate: true, exit: false };
      }
      return CELL_MOTION;
    }, [prefersReducedMotion]);

    // Accessibility attributes.
    const ariaProps = useMemo(
      () => ({
        role,
        'aria-label': ariaLabel || (isHeader ? 'Header cell' : 'Cell'),
        'aria-disabled': disabled || undefined,
        'aria-busy': loading || undefined,
        'aria-sort': sortable && sorted ? sortDirection : undefined,
        'data-align': align,
        'data-header': isHeader || undefined,
        'data-sortable': sortable || undefined,
        'data-sorted': sorted || undefined,
        colSpan,
        rowSpan,
        style: width ? { width } : undefined,
      }),
      [role, ariaLabel, isHeader, disabled, loading, sortable, sorted, sortDirection, align, colSpan, rowSpan, width],
    );

    // Determine element type.
    const Element = isHeader ? 'th' : 'td';

    return (
      <motion.td
        ref={ref}
        as={Element}
        className={finalClasses}
        onClick={handleSortClick}
        {...motionProps}
        {...ariaProps}
        {...rest}
      >
        {sortable && (
          <span className="inline-flex items-center gap-1 cursor-pointer">
            {content}
            <span className="shrink-0">{sortIcon}</span>
          </span>
        )}
        {!sortable && content}
      </motion.td>
    );
  }),
);

TableCell.displayName = 'TableCell';

TableCell.propTypes = {
  /** Cell content. */
  children: PropTypes.node,
  /** Whether cell is a header cell. */
  isHeader: PropTypes.bool,
  /** Text alignment. */
  align: PropTypes.oneOf(['left', 'center', 'right']),
  /** Cell width. */
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  /** Number of columns to span. */
  colSpan: PropTypes.number,
  /** Number of rows to span. */
  rowSpan: PropTypes.number,
  /** Whether to truncate text. */
  truncate: PropTypes.bool,
  /** Whether cell is sortable. */
  sortable: PropTypes.bool,
  /** Whether cell is sorted. */
  sorted: PropTypes.bool,
  /** Sort direction. */
  sortDirection: PropTypes.oneOf(['asc', 'desc']),
  /** Sort callback. */
  onSort: PropTypes.func,
  /** Disabled state. */
  disabled: PropTypes.bool,
  /** Loading state. */
  loading: PropTypes.bool,
  /** Custom render function. */
  render: PropTypes.func,
  /** Responsive overrides. */
  responsive: PropTypes.shape({
    xs: PropTypes.string,
    sm: PropTypes.string,
    md: PropTypes.string,
    lg: PropTypes.string,
    xl: PropTypes.string,
  }),
  /** Additional CSS classes. */
  className: PropTypes.string,
  /** ARIA role. */
  role: PropTypes.string,
  /** Accessible label. */
  'aria-label': PropTypes.string,
};

export default TableCell;