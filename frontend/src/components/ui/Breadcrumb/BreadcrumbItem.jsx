/**
 * KisanO Design System — Breadcrumb Package
 * BreadcrumbItem
 *
 * A single breadcrumb item that contains a link or text and a separator.
 * Supports active, disabled, and icon states with accessibility.
 *
 * Single Responsibility: Render one breadcrumb item.
 * Does not manage breadcrumb state or business logic.
 *
 * @module components/ui/Breadcrumb/BreadcrumbItem
 */

import { forwardRef, memo, useMemo } from 'react';
import PropTypes from 'prop-types';
import { motion, useReducedMotion } from 'framer-motion';

import {
  BREADCRUMB_DEFAULTS,
} from './breadcrumbVariants';
import {
  mergeClasses,
  resolveResponsiveClasses,
  getBreadcrumbItemClasses,
} from './breadcrumbUtils';

/* ---------------------------------- */
/* Component-specific tokens          */
/* ---------------------------------- */

/** Motion variants for item animation. */
const ITEM_MOTION = {
  initial: { opacity: 0, x: -4 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -4 },
  transition: { duration: 0.15, ease: [0.4, 0, 0.2, 1] },
};

/* ---------------------------------- */
/* Component                          */
/* ---------------------------------- */

/**
 * BreadcrumbItem – a single breadcrumb item.
 *
 * @component
 * @example
 * <BreadcrumbItem active>
 *   <BreadcrumbLink href="/">Home</BreadcrumbLink>
 * </BreadcrumbItem>
 */
const BreadcrumbItem = memo(
  forwardRef(function BreadcrumbItem(
    {
      children,
      index = 0,
      active = false,
      disabled = false,
      loading = false,
      variant = BREADCRUMB_DEFAULTS.variant,
      size = BREADCRUMB_DEFAULTS.size,
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
        getBreadcrumbItemClasses({
          variant,
          size,
          className,
          active,
          disabled,
          loading,
        }),
      [variant, size, className, active, disabled, loading],
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
        'aria-label': ariaLabel || `Breadcrumb item ${index + 1}`,
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

BreadcrumbItem.displayName = 'BreadcrumbItem';

BreadcrumbItem.propTypes = {
  /** Item content (Link, Separator, etc.). */
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
  variant: PropTypes.oneOf(['default', 'primary', 'dark', 'filled', 'minimal']),
  /** Size preset. */
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
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

export default BreadcrumbItem;