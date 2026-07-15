/**
 * KisanO Design System — Sidebar Package
 * SidebarItem
 *
 * A single navigation item in the sidebar. Supports active states,
 * icons, badges, nested indicators, and accessibility.
 *
 * Single Responsibility: Render one sidebar navigation item.
 * Does not manage sidebar state or content layout.
 *
 * @module components/ui/Sidebar/SidebarItem
 */

import { forwardRef, memo, useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';

import {
  SIDEBAR_DEFAULTS,
} from './sidebarVariants';
import {
  mergeClasses,
  resolveResponsiveClasses,
  getSidebarItemClasses,
} from './sidebarUtils';

/* ---------------------------------- */
/* Component-specific tokens          */
/* ---------------------------------- */

/** Badge color mapping. */
const BADGE_COLORS = {
  default: 'bg-gray-500',
  primary: 'bg-blue-500',
  success: 'bg-green-500',
  warning: 'bg-yellow-500',
  error: 'bg-red-500',
  info: 'bg-cyan-500',
};

/** Motion variants (if used with Framer Motion). */
const ITEM_MOTION = {
  hover: { scale: 1.02 },
  tap: { scale: 0.98 },
  transition: { duration: 0.15, ease: [0.4, 0, 0.2, 1] },
};

/* ---------------------------------- */
/* Component                          */
/* ---------------------------------- */

/**
 * SidebarItem – a single sidebar navigation item.
 *
 * @component
 * @example
 * <SidebarItem
 *   label="Dashboard"
 *   icon={<DashboardIcon />}
 *   href="/"
 *   active
 * />
 *
 * @example
 * <SidebarItem
 *   label="Notifications"
 *   icon={<BellIcon />}
 *   badge={{ count: 5, color: 'error' }}
 * />
 */
const SidebarItem = memo(
  forwardRef(function SidebarItem(
    {
      children,
      label,
      href,
      icon,
      badge,
      active = false,
      disabled = false,
      collapsed = false,
      nested = false,
      onClick,
      size = SIDEBAR_DEFAULTS.size,
      responsive,
      className = '',
      role = 'menuitem',
      'aria-label': ariaLabel,
      ...rest
    },
    ref,
  ) {
    // Item classes.
    const itemClasses = useMemo(
      () =>
        getSidebarItemClasses({
          size,
          className,
          active,
          disabled,
          collapsed,
        }),
      [size, className, active, disabled, collapsed],
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

    // Handle click.
    const handleClick = useCallback(
      (event) => {
        if (disabled) return;
        onClick?.(event);
      },
      [disabled, onClick],
    );

    // Badge color.
    const badgeColor = useMemo(() => {
      if (!badge) return '';
      return BADGE_COLORS[badge.color] || BADGE_COLORS.default;
    }, [badge]);

    // Render content.
    const content = (
      <>
        {icon && (
          <span className={mergeClasses(
            'shrink-0',
            collapsed ? 'mr-0' : 'mr-3',
          )}>
            {icon}
          </span>
        )}
        {!collapsed && label && (
          <span className="truncate">{children || label}</span>
        )}
        {!collapsed && badge && (
          <span
            className={mergeClasses(
              'ml-auto inline-flex items-center justify-center',
              'min-w-[18px] h-[18px] px-1.5',
              'rounded-full text-xs font-medium text-white',
              badgeColor,
            )}
          >
            {badge.count}
          </span>
        )}
        {collapsed && badge && (
          <span className="absolute -top-1 -right-1 inline-flex items-center justify-center min-w-[16px] h-[16px] px-1 rounded-full text-[10px] font-medium text-white bg-red-500">
            {badge.count}
          </span>
        )}
        {nested && !collapsed && (
          <svg
            className="ml-auto h-4 w-4 shrink-0 text-gray-400"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path d="M9 18l6-6-6-6" />
          </svg>
        )}
      </>
    );

    // If href is provided, render as link.
    if (href) {
      return (
        <a
          ref={ref}
          href={href}
          className={finalClasses}
          onClick={handleClick}
          aria-current={active ? 'page' : undefined}
          aria-disabled={disabled || undefined}
          {...rest}
        >
          {content}
        </a>
      );
    }

    // Otherwise, render as button.
    return (
      <button
        ref={ref}
        type="button"
        className={finalClasses}
        onClick={handleClick}
        disabled={disabled}
        aria-current={active ? 'page' : undefined}
        aria-disabled={disabled || undefined}
        {...rest}
      >
        {content}
      </button>
    );
  }),
);

SidebarItem.displayName = 'SidebarItem';

SidebarItem.propTypes = {
  /** Item content (alternative to label). */
  children: PropTypes.node,
  /** Item label. */
  label: PropTypes.node,
  /** Link href. */
  href: PropTypes.string,
  /** Icon element. */
  icon: PropTypes.node,
  /** Badge configuration. */
  badge: PropTypes.shape({
    count: PropTypes.number,
    color: PropTypes.oneOf(['default', 'primary', 'success', 'warning', 'error', 'info']),
  }),
  /** Active state. */
  active: PropTypes.bool,
  /** Disabled state. */
  disabled: PropTypes.bool,
  /** Whether the sidebar is collapsed. */
  collapsed: PropTypes.bool,
  /** Whether the item is nested. */
  nested: PropTypes.bool,
  /** Click handler. */
  onClick: PropTypes.func,
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

export default SidebarItem;