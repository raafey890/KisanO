/**
 * KisanO Design System — Sidebar Package
 * SidebarGroup
 *
 * A collapsible group of sidebar navigation items. Supports expand/collapse
 * with animated transitions, group titles, and nested items.
 *
 * Single Responsibility: Render a collapsible sidebar group.
 * Does not manage sidebar state or content layout.
 *
 * @module components/ui/Sidebar/SidebarGroup
 */

import { forwardRef, memo, useMemo, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { motion, useReducedMotion, AnimatePresence } from 'framer-motion';

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

const CONTENT_MOTION = {
  initial: { height: 0, opacity: 0 },
  animate: { height: 'auto', opacity: 1 },
  exit: { height: 0, opacity: 0 },
  transition: { duration: 0.25, ease: [0.4, 0, 0.2, 1] },
};

const CHEVRON_MOTION = {
  initial: { rotate: 0 },
  animate: { rotate: 180 },
  transition: { duration: 0.2, ease: [0.4, 0, 0.2, 1] },
};

/* ---------------------------------- */
/* Component                          */
/* ---------------------------------- */

const SidebarGroup = memo(
  forwardRef(function SidebarGroup(
    {
      children,
      label,
      icon,
      defaultOpen = false,
      open: controlledOpen,
      onOpenChange,
      size = SIDEBAR_DEFAULTS.size,
      collapsed = false,
      disabled = false,
      responsive,
      className = '',
      role = 'group',
      'aria-label': ariaLabel,
      ...rest
    },
    ref,
  ) {
    const prefersReducedMotion = useReducedMotion();

    // Internal state for uncontrolled mode
    const [internalOpen, setInternalOpen] = useState(defaultOpen);

    // Determine if controlled or uncontrolled
    const isControlled = controlledOpen !== undefined;
    const open = isControlled ? controlledOpen : internalOpen;

    // Handle open change
    const handleOpenChange = useCallback(
      (newOpen) => {
        if (!isControlled) {
          setInternalOpen(newOpen);
        }
        onOpenChange?.(newOpen);
      },
      [isControlled, onOpenChange],
    );

    // Handle toggle
    const handleToggle = useCallback(() => {
      if (disabled || collapsed) return;
      handleOpenChange(!open);
    }, [disabled, collapsed, open, handleOpenChange]);

    // Responsive overrides
    const responsiveClasses = useMemo(
      () => (responsive ? resolveResponsiveClasses(responsive) : ''),
      [responsive],
    );

    // Group container classes
    const groupClasses = useMemo(() => {
      const base = mergeClasses(
        'flex flex-col',
        disabled && 'opacity-50',
        className,
      );
      return mergeClasses(base, responsiveClasses);
    }, [disabled, className, responsiveClasses]);

    // Header classes - ✅ NO hover state, pure CSS
    const headerClasses = useMemo(() => {
      const base = mergeClasses(
        'flex items-center w-full',
        'px-3 py-2 rounded-md',
        'text-sm font-medium',
        'transition-colors duration-200',
        'cursor-pointer',
        'hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-white',
        collapsed && 'justify-center px-2',
        disabled && 'cursor-not-allowed',
      );
      return base;
    }, [collapsed, disabled]);

    // Label classes
    const labelClasses = useMemo(() => {
      const base = mergeClasses(
        'flex-1 text-left truncate',
        collapsed && 'sr-only',
      );
      return base;
    }, [collapsed]);

    // Icon classes
    const iconClasses = useMemo(() => {
      const base = mergeClasses(
        'shrink-0',
        collapsed ? 'mr-0' : 'mr-3',
      );
      return base;
    }, [collapsed]);

    // ✅ NO useRef for hover
    // ✅ NO useState for hover
    // ✅ NO onMouseEnter/onMouseLeave

    // Chevron motion props
    const chevronMotionProps = useMemo(() => {
      if (prefersReducedMotion) {
        return { initial: false, animate: open };
      }
      return CHEVRON_MOTION;
    }, [prefersReducedMotion, open]);

    // Content motion props
    const contentMotionProps = useMemo(() => {
      if (prefersReducedMotion) {
        return { initial: false, animate: true, exit: false };
      }
      return CONTENT_MOTION;
    }, [prefersReducedMotion]);

    // Accessibility attributes
    const ariaProps = useMemo(
      () => ({
        role,
        'aria-label': ariaLabel || label || 'Sidebar group',
        'aria-disabled': disabled || undefined,
        'aria-expanded': open || undefined,
      }),
      [role, ariaLabel, label, disabled, open],
    );

    // If collapsed, render only the icon
    if (collapsed) {
      return (
        <div className={groupClasses} {...rest}>
          <button
            ref={ref}
            className={headerClasses}
            onClick={handleToggle}
            disabled={disabled}
            {...ariaProps}
          >
            {icon && <span className={iconClasses}>{icon}</span>}
          </button>
        </div>
      );
    }

    return (
      <div
        ref={ref}
        className={groupClasses}
        {...rest}
      >
        {/* Header - ✅ Pure CSS hover, no state */}
        <motion.button
          className={headerClasses}
          onClick={handleToggle}
          disabled={disabled}
          {...ariaProps}
        >
          {icon && <span className={iconClasses}>{icon}</span>}
          <span className={labelClasses}>{label}</span>
          <motion.svg
            className="h-4 w-4 shrink-0"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            viewBox="0 0 24 24"
            aria-hidden="true"
            animate={open ? 'animate' : 'initial'}
            {...chevronMotionProps}
          >
            <path d="M6 9l6 6 6-6" />
          </motion.svg>
        </motion.button>

        {/* Content */}
        <AnimatePresence initial={false}>
          {open && !collapsed && (
            <motion.div
              className="flex flex-col ml-3 pl-3 border-l border-gray-200 dark:border-gray-700 overflow-hidden"
              {...contentMotionProps}
            >
              {children}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }),
);

SidebarGroup.displayName = 'SidebarGroup';

SidebarGroup.propTypes = {
  children: PropTypes.node,
  label: PropTypes.node,
  icon: PropTypes.node,
  defaultOpen: PropTypes.bool,
  open: PropTypes.bool,
  onOpenChange: PropTypes.func,
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
  collapsed: PropTypes.bool,
  disabled: PropTypes.bool,
  responsive: PropTypes.shape({
    xs: PropTypes.string,
    sm: PropTypes.string,
    md: PropTypes.string,
    lg: PropTypes.string,
    xl: PropTypes.string,
  }),
  className: PropTypes.string,
  role: PropTypes.string,
  'aria-label': PropTypes.string,
};

export default SidebarGroup;