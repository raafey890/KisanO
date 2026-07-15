/**
 * KisanO Design System — Table Package
 * TableContainer
 *
 * The container component that wraps the table and handles layout,
 * responsiveness, and accessibility attributes.
 *
 * Single Responsibility: Render the table container with layout and styling.
 * Does not manage table state or business logic.
 *
 * @module components/ui/Table/TableContainer
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
  resolveDefaultProps,
  getTableClasses,
  getTableContainerClasses,
} from './tableUtils';

/* ---------------------------------- */
/* Component-specific tokens          */
/* ---------------------------------- */

/** Motion variants for container animation. */
const CONTAINER_MOTION = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: 0.2, ease: [0.4, 0, 0.2, 1] },
};

/* ---------------------------------- */
/* Component                          */
/* ---------------------------------- */

/**
 * TableContainer – the main table wrapper with layout and styling.
 *
 * @component
 * @example
 * <TableContainer variant="default" size="md" responsive>
 *   <TableHeader />
 *   <TableBody />
 * </TableContainer>
 */
const TableContainer = memo(
  forwardRef(function TableContainer(
    {
      children,
      variant = TABLE_DEFAULTS.variant,
      size = TABLE_DEFAULTS.size,
      radius = TABLE_DEFAULTS.radius,
      shadow = TABLE_DEFAULTS.shadow,
      bordered = TABLE_DEFAULTS.bordered,
      responsive = true,
      disabled = false,
      loading = false,
      responsiveClasses,
      className = '',
      role = 'table',
      'aria-label': ariaLabel,
      ...rest
    },
    ref,
  ) {
    const prefersReducedMotion = useReducedMotion();

    // Resolve defaults.
    const resolved = useMemo(
      () =>
        resolveDefaultProps({
          variant,
          size,
          radius,
          shadow,
          bordered,
          disabled,
          loading,
        }),
      [variant, size, radius, shadow, bordered, disabled, loading],
    );

    // Table classes.
    const tableClasses = useMemo(
      () =>
        getTableClasses({
          variant: resolved.variant,
          size: resolved.size,
          radius: resolved.radius,
          shadow: resolved.shadow,
          className,
          disabled: resolved.disabled,
          loading: resolved.loading,
          bordered: resolved.bordered,
        }),
      [
        resolved.variant,
        resolved.size,
        resolved.radius,
        resolved.shadow,
        className,
        resolved.disabled,
        resolved.loading,
        resolved.bordered,
      ],
    );

    // Container classes.
    const containerClasses = useMemo(
      () =>
        getTableContainerClasses({
          className: '',
          disabled: resolved.disabled,
          loading: resolved.loading,
          responsive,
        }),
      [resolved.disabled, resolved.loading, responsive],
    );

    // Responsive overrides.
    const responsiveOverrideClasses = useMemo(
      () => (responsiveClasses ? resolveResponsiveClasses(responsiveClasses) : ''),
      [responsiveClasses],
    );

    const finalClasses = useMemo(
      () => mergeClasses(tableClasses, responsiveOverrideClasses),
      [tableClasses, responsiveOverrideClasses],
    );

    // Motion props - respect reduced motion.
    const motionProps = useMemo(() => {
      if (prefersReducedMotion) {
        return { initial: false, animate: true };
      }
      return CONTAINER_MOTION;
    }, [prefersReducedMotion]);

    // Accessibility attributes.
    const ariaProps = useMemo(
      () => ({
        role,
        'aria-label': ariaLabel || 'Table',
        'aria-disabled': resolved.disabled || undefined,
        'aria-busy': resolved.loading || undefined,
        'data-variant': resolved.variant,
        'data-size': resolved.size,
        'data-responsive': responsive || undefined,
      }),
      [role, ariaLabel, resolved.variant, resolved.disabled, resolved.loading, resolved.size, responsive],
    );

    return (
      <motion.div
        ref={ref}
        className={containerClasses}
        {...motionProps}
        {...ariaProps}
        {...rest}
      >
        <div className={finalClasses}>
          {children}
        </div>
      </motion.div>
    );
  }),
);

TableContainer.displayName = 'TableContainer';

TableContainer.propTypes = {
  /** Table content (Header, Body, etc.). */
  children: PropTypes.node,
  /** Visual variant. */
  variant: PropTypes.oneOf(['default', 'primary', 'dark', 'glass', 'minimal']),
  /** Size preset. */
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
  /** Border radius override. */
  radius: PropTypes.oneOf(['none', 'sm', 'md', 'lg', 'xl', '2xl', 'full']),
  /** Shadow level. */
  shadow: PropTypes.oneOf(['none', 'sm', 'md', 'lg', 'xl', '2xl']),
  /** Bordered table. */
  bordered: PropTypes.bool,
  /** Responsive table. */
  responsive: PropTypes.bool,
  /** Disabled state. */
  disabled: PropTypes.bool,
  /** Loading state. */
  loading: PropTypes.bool,
  /** Responsive overrides. */
  responsiveClasses: PropTypes.shape({
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

export default TableContainer;