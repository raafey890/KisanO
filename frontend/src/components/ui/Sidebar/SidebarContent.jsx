/**
 * KisanO Design System — Sidebar Package
 * SidebarContent
 *
 * The content component for the sidebar. Renders navigation items,
 * groups, and nested navigation with scrollable support.
 *
 * Single Responsibility: Render the sidebar content with navigation.
 * Does not manage sidebar state or header/footer logic.
 *
 * @module components/ui/Sidebar/SidebarContent
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
  getSidebarContentClasses,
} from './sidebarUtils';

/* ---------------------------------- */
/* Component-specific tokens          */
/* ---------------------------------- */

/** Motion variants for content animation. */
const CONTENT_MOTION = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.2, ease: [0.4, 0, 0.2, 1] },
};

/** Scrollbar styling. */
const SCROLLBAR_CLASSES = 'scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-300 dark:scrollbar-track-gray-800 dark:scrollbar-thumb-gray-600';

/* ---------------------------------- */
/* Component                          */
/* ---------------------------------- */

/**
 * SidebarContent – the content area of the sidebar.
 *
 * @component
 * @example
 * <SidebarContent>
 *   <SidebarItem label="Dashboard" href="/" active />
 *   <SidebarItem label="Users" href="/users" />
 *   <SidebarGroup label="Settings">
 *     <SidebarItem label="Profile" href="/profile" />
 *   </SidebarGroup>
 * </SidebarContent>
 */
const SidebarContent = memo(
  forwardRef(function SidebarContent(
    {
      children,
      items = [],
      groups = [],
      size = SIDEBAR_DEFAULTS.size,
      collapsed = false,
      loading = false,
      disabled = false,
      responsive,
      className = '',
      role = 'navigation',
      'aria-label': ariaLabel = 'Sidebar navigation',
      ...rest
    },
    ref,
  ) {
    const prefersReducedMotion = useReducedMotion();

    // Content classes.
    const contentClasses = useMemo(
      () =>
        getSidebarContentClasses({
          size,
          className,
          collapsed,
        }),
      [size, className, collapsed],
    );

    // Responsive overrides.
    const responsiveClasses = useMemo(
      () => (responsive ? resolveResponsiveClasses(responsive) : ''),
      [responsive],
    );

    const finalClasses = useMemo(
      () => mergeClasses(contentClasses, responsiveClasses, SCROLLBAR_CLASSES),
      [contentClasses, responsiveClasses],
    );

    // Motion props - respect reduced motion.
    const motionProps = useMemo(() => {
      if (prefersReducedMotion) {
        return { initial: false, animate: true, exit: false };
      }
      return CONTENT_MOTION;
    }, [prefersReducedMotion]);

    // Render items.
    const renderItems = useCallback(() => {
      if (!items || items.length === 0) return null;

      return items.map((item, index) => {
        // If item is a group, render as SidebarGroup.
        if (item.items) {
          return (
            <div key={index} className="mb-2">
              {!collapsed && item.label && (
                <div className={mergeClasses(
                  'px-3 py-1.5 text-xs font-medium text-gray-500 uppercase tracking-wider',
                  collapsed && 'sr-only',
                  disabled && 'opacity-50',
                )}>
                  {item.label}
                </div>
              )}
              <div className="space-y-1">
                {item.items.map((subItem, subIndex) => (
                  <a
                    key={subIndex}
                    href={subItem.href}
                    className={mergeClasses(
                      'flex items-center rounded-md transition-colors duration-200',
                      'px-3 py-2 text-sm',
                      'hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-white',
                      subItem.active && 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
                      subItem.disabled && 'opacity-50 cursor-not-allowed pointer-events-none',
                      collapsed && 'justify-center px-2',
                      disabled && 'opacity-50',
                      loading && 'opacity-70',
                    )}
                    onClick={subItem.onClick}
                    aria-current={subItem.active ? 'page' : undefined}
                    aria-disabled={subItem.disabled || disabled || undefined}
                  >
                    {subItem.icon && (
                      <span className={mergeClasses(
                        'shrink-0',
                        collapsed ? 'mr-0' : 'mr-3',
                      )}>
                        {subItem.icon}
                      </span>
                    )}
                    {!collapsed && subItem.label}
                  </a>
                ))}
              </div>
            </div>
          );
        }

        // Render regular item.
        return (
          <a
            key={index}
            href={item.href}
            className={mergeClasses(
              'flex items-center rounded-md transition-colors duration-200',
              'px-3 py-2 text-sm',
              'hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-white',
              item.active && 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
              item.disabled && 'opacity-50 cursor-not-allowed pointer-events-none',
              collapsed && 'justify-center px-2',
              disabled && 'opacity-50',
              loading && 'opacity-70',
            )}
            onClick={item.onClick}
            aria-current={item.active ? 'page' : undefined}
            aria-disabled={item.disabled || disabled || undefined}
          >
            {item.icon && (
              <span className={mergeClasses(
                'shrink-0',
                collapsed ? 'mr-0' : 'mr-3',
              )}>
                {item.icon}
              </span>
            )}
            {!collapsed && item.label}
            {!collapsed && item.badge && (
              <span className="ml-auto px-2 py-0.5 text-xs rounded-full bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300">
                {item.badge}
              </span>
            )}
          </a>
        );
      });
    }, [items, collapsed, disabled, loading]);

    // Render groups.
    const renderGroups = useCallback(() => {
      if (!groups || groups.length === 0) return null;

      return groups.map((group, index) => (
        <div key={index} className="mb-3">
          {!collapsed && group.label && (
            <div className={mergeClasses(
              'px-3 py-1.5 text-xs font-medium text-gray-500 uppercase tracking-wider',
              collapsed && 'sr-only',
              disabled && 'opacity-50',
            )}>
              {group.label}
            </div>
          )}
          <div className="space-y-1">
            {group.items.map((item, itemIndex) => (
              <a
                key={itemIndex}
                href={item.href}
                className={mergeClasses(
                  'flex items-center rounded-md transition-colors duration-200',
                  'px-3 py-2 text-sm',
                  'hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-white',
                  item.active && 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
                  item.disabled && 'opacity-50 cursor-not-allowed pointer-events-none',
                  collapsed && 'justify-center px-2',
                  disabled && 'opacity-50',
                  loading && 'opacity-70',
                )}
                onClick={item.onClick}
                aria-current={item.active ? 'page' : undefined}
                aria-disabled={item.disabled || disabled || undefined}
              >
                {item.icon && (
                  <span className={mergeClasses(
                    'shrink-0',
                    collapsed ? 'mr-0' : 'mr-3',
                  )}>
                    {item.icon}
                  </span>
                )}
                {!collapsed && item.label}
                {!collapsed && item.badge && (
                  <span className="ml-auto px-2 py-0.5 text-xs rounded-full bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300">
                    {item.badge}
                  </span>
                )}
              </a>
            ))}
          </div>
        </div>
      ));
    }, [groups, collapsed, disabled, loading]);

    // Accessibility attributes.
    const ariaProps = useMemo(
      () => ({
        role,
        'aria-label': ariaLabel,
        'aria-disabled': disabled || undefined,
        'aria-busy': loading || undefined,
      }),
      [role, ariaLabel, disabled, loading],
    );

    return (
      <motion.nav
        ref={ref}
        className={finalClasses}
        {...motionProps}
        {...ariaProps}
        {...rest}
      >
        {children || renderItems() || renderGroups()}
      </motion.nav>
    );
  }),
);

SidebarContent.displayName = 'SidebarContent';

SidebarContent.propTypes = {
  /** Content children (custom). */
  children: PropTypes.node,
  /** Navigation items array. */
  items: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.node,
      icon: PropTypes.node,
      href: PropTypes.string,
      active: PropTypes.bool,
      disabled: PropTypes.bool,
      badge: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.node]),
      onClick: PropTypes.func,
      items: PropTypes.array,
    }),
  ),
  /** Navigation groups array. */
  groups: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.node,
      items: PropTypes.array,
    }),
  ),
  /** Size preset. */
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
  /** Collapsed state. */
  collapsed: PropTypes.bool,
  /** Loading state. */
  loading: PropTypes.bool,
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

export default SidebarContent;