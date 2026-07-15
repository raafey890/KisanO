/**
 * KisanO Design System — Pagination Package
 * PaginationItem
 *
 * A single pagination item that wraps a button or ellipsis.
 * Supports active, disabled, and loading states with accessibility.
 *
 * Single Responsibility: Render one pagination item.
 * Does not manage pagination state or business logic.
 *
 * @module components/ui/Pagination/PaginationItem
 */

import { forwardRef, memo, useMemo } from 'react';
import PropTypes from 'prop-types';
import { motion, useReducedMotion } from 'framer-motion';

import {
  PAGINATION_DEFAULTS,
} from './paginationVariants';
import {
  mergeClasses,
  resolveResponsiveClasses,
  getPaginationItemClasses,
} from './paginationUtils';

/* ---------------------------------- */
/* Component-specific tokens          */
/* ---------------------------------- */

/** Motion variants for item animation. */
const ITEM_MOTION = {
  initial: { opacity: 0, scale: 0.9 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.9 },
  transition: { duration: 0.15, ease: [0.4, 0, 0.2, 1] },
};

/* ---------------------------------- */
/* Component                          */
/* ---------------------------------- */

/**
 * PaginationItem – a single pagination item.
 *
 * @component
 * @example
 * <PaginationItem active>
 *   <PaginationButton>1</PaginationButton>
 * </PaginationItem>
 */
const PaginationItem = memo(
  forwardRef(function PaginationItem(
    {
      children,
      index = 0,
      active = false,
      disabled = false,
      loading = false,
      variant = PAGINATION_DEFAULTS.variant,
      size = PAGINATION_DEFAULTS.size,
      radius = PAGINATION_DEFAULTS.radius,
      responsive,
      className = '',
      role = 'listitem',
      'aria-label': ariaLabel,
      ...rest
    },
    ref,
  ) {
    const prefersReducedMotion = useReducedMotion();

    // Item classes.
    const itemClasses = useMemo(
      () =>
        getPaginationItemClasses({
          variant,
          size,
          radius,
          className,
          state: active ? 'active' : disabled ? 'disabled' : 'default',
          disabled,
          loading,
        }),
      [variant, size, radius, className, active, disabled, loading],
    );

    // Responsive overrides.
    const responsiveClasses = useMemo(
      () => (responsive ? resolveResponsiveClasses(responsive) : ''),
      [responsive],
    );

    const finalClasses = useMemo(
      () => mergeClasses(itemClasses, responsiveClasses),
      [itemClasses, responsiveClasses],
    );

    // Motion props - respect reduced motion.
    const motionProps = useMemo(() => {
      if (prefersReducedMotion) {
        return { initial: false, animate: true, exit: false };
      }
      return ITEM_MOTION;
    }, [prefersReducedMotion]);

    // Accessibility attributes.
    const ariaProps = useMemo(
      () => ({
        role,
        'aria-label': ariaLabel || `Pagination item ${index + 1}`,
        'aria-current': active ? 'page' : undefined,
        'aria-disabled': disabled || undefined,
        'data-index': index,
        'data-active': active || undefined,
        'data-disabled': disabled || undefined,
      }),
      [role, ariaLabel, index, active, disabled],
    );

    return (
      <motion.li
        ref={ref}
        className={finalClasses}
        {...motionProps}
        {...ariaProps}
        {...rest}
      >
        {children}
      </motion.li>
    );
  }),
);

PaginationItem.displayName = 'PaginationItem';

PaginationItem.propTypes = {
  /** Item content (Button, Ellipsis, etc.). */
  children: PropTypes.node,
  /** Item index. */
  index: PropTypes.number,
  /** Whether the item is active. */
  active: PropTypes.bool,
  /** Disabled state. */
  disabled: PropTypes.bool,
  /** Loading state. */
  loading: PropTypes.bool,
  /** Visual variant. */
  variant: PropTypes.oneOf(['default', 'primary', 'dark', 'outline', 'ghost']),
  /** Size preset. */
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
  /** Border radius override. */
  radius: PropTypes.oneOf(['none', 'sm', 'md', 'lg', 'xl', '2xl', 'full']),
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

export default PaginationItem;