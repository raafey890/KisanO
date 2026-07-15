/**
 * KisanO Design System — Table Package
 * TableRow
 *
 * A single table row component. Supports hover, selected, disabled,
 * and click states with accessibility.
 *
 * Single Responsibility: Render one table row.
 * Does not manage table state or business logic.
 *
 * @module components/ui/Table/TableRow
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
  getTableRowClasses,
} from './tableUtils';

/* ---------------------------------- */
/* Component-specific tokens          */
/* ---------------------------------- */

/** Motion variants for row animation. */
const ROW_MOTION = {
  initial: { opacity: 0, x: -8 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -8 },
  transition: { duration: 0.15, ease: [0.4, 0, 0.2, 1] },
};

/** Role mapping. */
const ROLE_MAP = {
  header: 'row',
  body: 'row',
};

/* ---------------------------------- */
/* Component                          */
/* ---------------------------------- */

/**
 * TableRow – a single table row.
 *
 * @component
 * @example
 * <TableRow>
 *   <TableCell>John</TableCell>
 *   <TableCell>30</TableCell>
 * </TableRow>
 *
 * @example
 * <TableRow selected hoverable onClick={handleClick}>
 *   <TableCell>Jane</TableCell>
 *   <TableCell>25</TableCell>
 * </TableRow>
 */
const TableRow = memo(
  forwardRef(function TableRow(
    {
      children,
      index = 0,
      variant = TABLE_DEFAULTS.variant,
      stripes = TABLE_DEFAULTS.stripes,
      hoverable = TABLE_DEFAULTS.hoverable,
      selectable = TABLE_DEFAULTS.selectable,
      selected = false,
      disabled = false,
      loading = false,
      isHeader = false,
      onClick,
      onDoubleClick,
      responsive,
      className = '',
      role = 'row',
      'aria-label': ariaLabel,
      ...rest
    },
    ref,
  ) {
    const prefersReducedMotion = useReducedMotion();

    // Row classes.
    const rowClasses = useMemo(
      () =>
        getTableRowClasses({
          variant,
          stripes,
          className,
          index,
          hoverable,
          selectable,
          selected,
          disabled,
          loading,
        }),
      [variant, stripes, className, index, hoverable, selectable, selected, disabled, loading],
    );

    // Responsive overrides.
    const responsiveClasses = useMemo(
      () => (responsive ? resolveResponsiveClasses(responsive) : ''),
      [responsive],
    );

    const finalClasses = useMemo(
      () => mergeClasses(rowClasses, responsiveClasses),
      [rowClasses, responsiveClasses],
    );

    // Handle click.
    const handleClick = useCallback(
      (event) => {
        if (disabled || loading) return;
        onClick?.(event);
      },
      [disabled, loading, onClick],
    );

    // Handle double click.
    const handleDoubleClick = useCallback(
      (event) => {
        if (disabled || loading) return;
        onDoubleClick?.(event);
      },
      [disabled, loading, onDoubleClick],
    );

    // Motion props - respect reduced motion.
    const motionProps = useMemo(() => {
      if (prefersReducedMotion) {
        return { initial: false, animate: true, exit: false };
      }
      return ROW_MOTION;
    }, [prefersReducedMotion]);

    // Accessibility attributes.
    const ariaProps = useMemo(
      () => ({
        role,
        'aria-label': ariaLabel || (isHeader ? 'Header row' : `Row ${index + 1}`),
        'aria-selected': selectable ? selected : undefined,
        'aria-disabled': disabled || undefined,
        'aria-busy': loading || undefined,
        'data-index': index,
        'data-selected': selected || undefined,
        'data-disabled': disabled || undefined,
        'data-header': isHeader || undefined,
        tabIndex: disabled ? -1 : 0,
      }),
      [role, ariaLabel, isHeader, index, selectable, selected, disabled, loading],
    );

    // Determine element type.
    const Element = isHeader ? 'th' : 'tr';

    return (
      <motion.tr
        ref={ref}
        as={Element}
        className={finalClasses}
        onClick={handleClick}
        onDoubleClick={handleDoubleClick}
        {...motionProps}
        {...ariaProps}
        {...rest}
      >
        {children}
      </motion.tr>
    );
  }),
);

TableRow.displayName = 'TableRow';

TableRow.propTypes = {
  /** Row content (TableCell components). */
  children: PropTypes.node,
  /** Row index (for stripes). */
  index: PropTypes.number,
  /** Visual variant. */
  variant: PropTypes.oneOf(['default', 'primary', 'dark', 'glass', 'minimal']),
  /** Stripe style. */
  stripes: PropTypes.oneOf(['none', 'default', 'primary', 'dark']),
  /** Whether row is hoverable. */
  hoverable: PropTypes.bool,
  /** Whether row is selectable. */
  selectable: PropTypes.bool,
  /** Whether row is selected. */
  selected: PropTypes.bool,
  /** Disabled state. */
  disabled: PropTypes.bool,
  /** Loading state. */
  loading: PropTypes.bool,
  /** Whether row is a header row. */
  isHeader: PropTypes.bool,
  /** Click handler. */
  onClick: PropTypes.func,
  /** Double click handler. */
  onDoubleClick: PropTypes.func,
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

export default TableRow;