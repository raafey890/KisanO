/**
 * KisanO Design System — Table Package
 * TableBody
 *
 * The body component for tables. Renders dynamic rows with support
 * for empty states and loading states.
 *
 * Single Responsibility: Render the table body.
 * Does not manage table state or business logic.
 *
 * @module components/ui/Table/TableBody
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
  getTableBodyClasses,
} from './tableUtils';

/* ---------------------------------- */
/* Component-specific tokens          */
/* ---------------------------------- */

/** Motion variants for body animation. */
const BODY_MOTION = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.2, ease: [0.4, 0, 0.2, 1] },
};

/** Empty state default text. */
const DEFAULT_EMPTY_TEXT = 'No data available';

/* ---------------------------------- */
/* Component                          */
/* ---------------------------------- */

/**
 * TableBody – the table body component.
 *
 * @component
 * @example
 * <TableBody>
 *   <TableRow>
 *     <TableCell>John</TableCell>
 *     <TableCell>30</TableCell>
 *   </TableRow>
 *   <TableRow>
 *     <TableCell>Jane</TableCell>
 *     <TableCell>25</TableCell>
 *   </TableRow>
 * </TableBody>
 */
const TableBody = memo(
  forwardRef(function TableBody(
    {
      children,
      emptyText = DEFAULT_EMPTY_TEXT,
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

    // Body classes.
    const bodyClasses = useMemo(
      () =>
        getTableBodyClasses({
          className,
          disabled,
          loading,
        }),
      [className, disabled, loading],
    );

    // Responsive overrides.
    const responsiveClasses = useMemo(
      () => (responsive ? resolveResponsiveClasses(responsive) : ''),
      [responsive],
    );

    const finalClasses = useMemo(
      () => mergeClasses(bodyClasses, responsiveClasses),
      [bodyClasses, responsiveClasses],
    );

    // Motion props - respect reduced motion.
    const motionProps = useMemo(() => {
      if (prefersReducedMotion) {
        return { initial: false, animate: true, exit: false };
      }
      return BODY_MOTION;
    }, [prefersReducedMotion]);

    // Check if there are any children.
    const hasChildren = useMemo(() => {
      return React.Children.count(children) > 0;
    }, [children]);

    // Accessibility attributes.
    const ariaProps = useMemo(
      () => ({
        role,
        'aria-label': ariaLabel || 'Table body',
        'aria-disabled': disabled || undefined,
        'aria-busy': loading || undefined,
        'data-empty': !hasChildren || undefined,
      }),
      [role, ariaLabel, disabled, loading, hasChildren],
    );

    // If loading, render a loading state.
    if (loading) {
      return (
        <motion.tbody
          ref={ref}
          className={finalClasses}
          {...motionProps}
          {...ariaProps}
          {...rest}
        >
          <tr>
            <td colSpan={100} className="text-center py-8">
              <div className="flex items-center justify-center">
                <div className="animate-pulse flex flex-col items-center gap-2">
                  <div className="h-4 w-32 bg-gray-200 rounded" />
                  <div className="h-3 w-48 bg-gray-200 rounded" />
                  <div className="h-3 w-40 bg-gray-200 rounded" />
                </div>
              </div>
            </td>
          </tr>
        </motion.tbody>
      );
    }

    // If no children, render empty state.
    if (!hasChildren) {
      return (
        <motion.tbody
          ref={ref}
          className={finalClasses}
          {...motionProps}
          {...ariaProps}
          {...rest}
        >
          <tr>
            <td colSpan={100} className="text-center py-8 text-gray-500">
              {emptyText}
            </td>
          </tr>
        </motion.tbody>
      );
    }

    // Render children.
    return (
      <motion.tbody
        ref={ref}
        className={finalClasses}
        {...motionProps}
        {...ariaProps}
        {...rest}
      >
        {children}
      </motion.tbody>
    );
  }),
);

TableBody.displayName = 'TableBody';

TableBody.propTypes = {
  /** Body content (TableRow components). */
  children: PropTypes.node,
  /** Empty state text. */
  emptyText: PropTypes.string,
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

export default TableBody;