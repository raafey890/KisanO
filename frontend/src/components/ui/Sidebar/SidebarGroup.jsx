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

/** Motion variants for group content. */
const CONTENT_MOTION = {
  initial: { height: 0, opacity: 0 },
  animate: { height: 'auto', opacity: 1 },
  exit: { height: 0, opacity: 0 },
  transition: { duration: 0.25, ease: [0.4, 0, 0.2, 1] },
};

/** Motion variants for group header. */
const HEADER_MOTION = {
  hover: { scale: 1.02 },
  tap: { scale: 0.98 },
  transition: { duration: 0.15, ease: [0.4, 0, 0.2, 1] },
};

/** Motion variants for chevron icon. */
const CHEVRON_MOTION = {
  initial: { rotate: 0 },
  animate: { rotate: 180 },
  transition: { duration: 0.2, ease: [0.4, 0, 0.2, 1] },
};

/* ---------------------------------- */
/* Component                          */
/* ---------------------------------- */

/**
 * SidebarGroup – a collapsible group of sidebar items.
 *
 * @component
 * @example
 * <SidebarGroup label="Settings" defaultOpen>
 *   <SidebarItem label="Profile" href="/profile" />
 *   <SidebarItem label="Security" href="/security" />
 * </SidebarGroup>
 */
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

    // Internal state for uncontrolled mode.
    const [internalOpen, setInternalOpen] = useState(defaultOpen);

    // Determine if controlled or uncontrolled.
    const isControlled = controlledOpen !== undefined;
    const open = isControlled ? controlledOpen : internalOpen;

    // Handle open change.
    const handleOpenChange = useCallback(
      (newOpen) => {
        if (!isControlled) {
          setInternalOpen(newOpen);
        }
        onOpenChange?.(newOpen);
      },
      [isControlled, onOpenChange],
    );

    // Handle toggle.
    const handleToggle = useCallback(() => {
      if (disabled || collapsed) return;
      handleOpenChange(!open);
    }, [disabled, collapsed, open, handleOpenChange]);

    // Responsive overrides.
    const responsiveClasses = useMemo(
      () => (responsive ? resolveResponsiveClasses(responsive) : ''),
      [responsive],
    );

    // Group container classes.
    const groupClasses = useMemo(() => {
      const base = mergeClasses(
        'flex flex-col',
        disabled && 'opacity-50',
        className,
      );
      return mergeClasses(base, responsiveClasses);
    }, [disabled, className, responsiveClasses]);

    // Header classes.
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

    // Label classes.
    const labelClasses = useMemo(() => {
      const base = mergeClasses(
        'flex-1 text-left truncate',
        collapsed && 'sr-only',
      );
      return base;
    }, [collapsed]);

    // Icon classes.
    const iconClasses = useMemo(() => {
      const base = mergeClasses(
        'shrink-0',
        collapsed ? 'mr-0' : 'mr-3',
      );
      return base;
    }, [collapsed]);

    // Motion props - respect reduced motion.
    const motionProps = useMemo(() => {
      if (prefersReducedMotion || disabled || collapsed) {
        return {
          whileHover: undefined,
          whileTap: undefined,
          transition: undefined,
        };
      }
      return HEADER_MOTION;
    }, [prefersReducedMotion, disabled, collapsed]);

    // Chevron motion props.
    const chevronMotionProps = useMemo(() => {
      if (prefersReducedMotion) {
        return { initial: false, animate: open };
      }
      return CHEVRON_MOTION;
    }, [prefersReducedMotion, open]);

    // Content motion props.
    const contentMotionProps = useMemo(() => {
      if (prefersReducedMotion) {
        return { initial: false, animate: true, exit: false };
      }
      return CONTENT_MOTION;
    }, [prefersReducedMotion]);

    // Accessibility attributes.
    const ariaProps = useMemo(
      () => ({
        role,
        'aria-label': ariaLabel || label || 'Sidebar group',
        'aria-disabled': disabled || undefined,
        'aria-expanded': open || undefined,
      }),
      [role, ariaLabel, label, disabled, open],
    );

    // If collapsed, render only the icon.
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
        {/* Header */}
        <motion.button
          className={headerClasses}
          onClick={handleToggle}
          disabled={disabled}
          {...motionProps}
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
  /** Group content (items). */
  children: PropTypes.node,
  /** Group label. */
  label: PropTypes.node,
  /** Group icon. */
  icon: PropTypes.node,
  /** Default open state for uncontrolled mode. */
  defaultOpen: PropTypes.bool,
  /** Controlled open state. */
  open: PropTypes.bool,
  /** Callback when open state changes. */
  onOpenChange: PropTypes.func,
  /** Size preset. */
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
  /** Whether the sidebar is collapsed. */
  collapsed: PropTypes.bool,
  /** Disabled state. */
  disabled: PropTypes.bool,
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

export default SidebarGroup;