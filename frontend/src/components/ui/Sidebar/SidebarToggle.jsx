/**
 * KisanO Design System — Sidebar Package
 * SidebarToggle
 *
 * The toggle button for sidebar collapse/expand. Renders an animated
 * icon that transforms between collapse and expand states.
 *
 * Single Responsibility: Render the sidebar toggle button.
 * Does not manage sidebar state or content.
 *
 * @module components/ui/Sidebar/SidebarToggle
 */

import { forwardRef, memo, useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import { motion, useReducedMotion } from 'framer-motion';

import {
  SIDEBAR_DEFAULTS,
} from './sidebarVariants';
import {
  mergeClasses,
  resolveResponsiveClasses,
} from './sidebarUtils';

/* ---------------------------------- */
/* Component-specific tokens          */
/* ---------------------------------- */

/** Motion variants for the toggle button. */
const TOGGLE_MOTION = {
  initial: { scale: 1 },
  hover: { scale: 1.05 },
  tap: { scale: 0.95 },
  transition: { duration: 0.15, ease: [0.4, 0, 0.2, 1] },
};

/** Motion variants for the chevron icon. */
const CHEVRON_MOTION = {
  initial: { rotate: 0 },
  animate: { rotate: 180 },
  transition: { duration: 0.25, ease: [0.4, 0, 0.2, 1] },
};

/** Size mapping. */
const SIZE_MAP = {
  xs: 'h-6 w-6 text-xs',
  sm: 'h-7 w-7 text-sm',
  md: 'h-8 w-8 text-base',
  lg: 'h-9 w-9 text-lg',
  xl: 'h-10 w-10 text-xl',
};

/* ---------------------------------- */
/* Component                          */
/* ---------------------------------- */

/**
 * SidebarToggle – the sidebar collapse/expand toggle button.
 *
 * @component
 * @example
 * <SidebarToggle collapsed={isCollapsed} onClick={handleToggle} />
 */
const SidebarToggle = memo(
  forwardRef(function SidebarToggle(
    {
      collapsed = false,
      onClick,
      size = SIDEBAR_DEFAULTS.size,
      disabled = false,
      loading = false,
      responsive,
      className = '',
      label = 'Toggle sidebar',
      ...rest
    },
    ref,
  ) {
    const prefersReducedMotion = useReducedMotion();

    // Toggle size.
    const sizeClass = useMemo(
      () => SIZE_MAP[size] || SIZE_MAP.md,
      [size],
    );

    // Responsive overrides.
    const responsiveClasses = useMemo(
      () => (responsive ? resolveResponsiveClasses(responsive) : ''),
      [responsive],
    );

    // Toggle classes.
    const toggleClasses = useMemo(() => {
      const base = mergeClasses(
        'inline-flex items-center justify-center',
        'rounded-lg',
        sizeClass,
        'text-gray-500 hover:text-gray-700 hover:bg-gray-100',
        'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
        'transition-colors duration-200',
        disabled && 'opacity-50 cursor-not-allowed pointer-events-none',
        loading && 'opacity-70 cursor-progress',
        className,
      );
      return mergeClasses(base, responsiveClasses);
    }, [sizeClass, disabled, loading, className, responsiveClasses]);

    // Handle click.
    const handleClick = useCallback(
      (event) => {
        if (disabled || loading) return;
        onClick?.(event);
      },
      [disabled, loading, onClick],
    );

    // Motion props - respect reduced motion.
    const motionProps = useMemo(() => {
      if (prefersReducedMotion || disabled || loading) {
        return {
          whileHover: undefined,
          whileTap: undefined,
          transition: undefined,
        };
      }
      return {
        whileHover: TOGGLE_MOTION.hover,
        whileTap: TOGGLE_MOTION.tap,
        transition: TOGGLE_MOTION.transition,
      };
    }, [prefersReducedMotion, disabled, loading]);

    // Chevron motion props.
    const chevronMotionProps = useMemo(() => {
      if (prefersReducedMotion) {
        return { initial: false, animate: collapsed };
      }
      return CHEVRON_MOTION;
    }, [prefersReducedMotion, collapsed]);

    // Accessibility attributes.
    const ariaProps = useMemo(
      () => ({
        type: 'button',
        'aria-label': label,
        'aria-expanded': !collapsed,
        'aria-controls': 'sidebar',
        'aria-disabled': disabled || undefined,
        disabled: disabled,
      }),
      [label, collapsed, disabled],
    );

    return (
      <motion.button
        ref={ref}
        className={toggleClasses}
        onClick={handleClick}
        {...motionProps}
        {...ariaProps}
        {...rest}
      >
        <span className="sr-only">{label}</span>
        <motion.svg
          className="h-4 w-4"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          viewBox="0 0 24 24"
          aria-hidden="true"
          animate={collapsed ? 'animate' : 'initial'}
          {...chevronMotionProps}
        >
          <path d={collapsed ? 'M15 18l-6-6 6-6' : 'M9 18l6-6-6-6'} />
        </motion.svg>
      </motion.button>
    );
  }),
);

SidebarToggle.displayName = 'SidebarToggle';

SidebarToggle.propTypes = {
  /** Whether the sidebar is collapsed. */
  collapsed: PropTypes.bool,
  /** Click handler. */
  onClick: PropTypes.func,
  /** Size preset. */
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
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
  /** Accessible label. */
  label: PropTypes.string,
};

export default SidebarToggle;