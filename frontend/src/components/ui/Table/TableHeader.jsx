/**
 * KisanO Design System — Table Package
 * TableHeader
 *
 * The header component for tables. Renders column headers with
 * sorting support, header groups, and sticky positioning.
 *
 * Single Responsibility: Render the table header.
 * Does not manage table state or business logic.
 *
 * @module components/ui/Table/TableHeader
 */

import { forwardRef, memo, useMemo } from 'react';
import PropTypes from 'prop-types';
import { motion, useReducedMotion } from 'framer-motion';

import {
  TABLE_DEFAULTS,
} from './tableVariants';
import {
  mergeClasses,
  resolveResponsiveClasses,
  getTableHeaderClasses,
} from './tableUtils';

/* ---------------------------------- */
/* Component-specific tokens          */
/* ---------------------------------- */

/** Motion variants for header animation. */
const HEADER_MOTION = {
  initial: { opacity: 0, y: -8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
  transition: { duration: 0.15, ease: [0.4, 0, 0.2, 1] },
};

/** Sticky header classes. */
const STICKY_CLASSES = 'sticky top-0 z-10';

/* ---------------------------------- */
/* Component                          */
/* ---------------------------------- */

/**
 * TableHeader – the table header component.
 *
 * @component
 * @example
 * <TableHeader>
 *   <TableRow>
 *     <TableCell isHeader>Name</TableCell>
 *     <TableCell isHeader>Age</TableCell>
 *   </TableRow>
 * </TableHeader>
 */
const TableHeader = memo(
  forwardRef(function TableHeader(
    {
      children,
      variant = TABLE_DEFAULTS.variant,
      sticky = false,
      disabled = false,
      loading = false,
      responsive,
      className = '',
      role = 'rowgroup',
      'aria-label': ariaLabel,
      ...rest
    },
    ref,
  ) {
    const prefersReducedMotion = useReducedMotion();

    // Header classes.
    const headerClasses = useMemo(
      () =>
        getTableHeaderClasses({
          variant,
          className,
          disabled,
          loading,
        }),
      [variant, className, disabled, loading],
    );

    // Responsive overrides.
    const responsiveClasses = useMemo(
      () => (responsive ? resolveResponsiveClasses(responsive) : ''),
      [responsive],
    );

    const finalClasses = useMemo(
      () => mergeClasses(headerClasses, responsiveClasses, sticky ? STICKY_CLASSES : ''),
      [headerClasses, responsiveClasses, sticky],
    );

    // Motion props - respect reduced motion.
    const motionProps = useMemo(() => {
      if (prefersReducedMotion) {
        return { initial: false, animate: true, exit: false };
      }
      return HEADER_MOTION;
    }, [prefersReducedMotion]);

    // Accessibility attributes.
    const ariaProps = useMemo(
      () => ({
        role,
        'aria-label': ariaLabel || 'Table header',
        'aria-disabled': disabled || undefined,
        'aria-busy': loading || undefined,
        'data-sticky': sticky || undefined,
      }),
      [role, ariaLabel, disabled, loading, sticky],
    );

    return (
      <motion.thead
        ref={ref}
        className={finalClasses}
        {...motionProps}
        {...ariaProps}
        {...rest}
      >
        {children}
      </motion.thead>
    );
  }),
);

TableHeader.displayName = 'TableHeader';

TableHeader.propTypes = {
  /** Header content (TableRow with TableCell). */
  children: PropTypes.node,
  /** Visual variant. */
  variant: PropTypes.oneOf(['default', 'primary', 'dark', 'glass', 'minimal']),
  /** Whether header is sticky. */
  sticky: PropTypes.bool,
  /** Disabled state. */
  disabled: PropTypes.bool,
  /** Loading state. */
  loading: PropTypes.bool,
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

export default TableHeader;