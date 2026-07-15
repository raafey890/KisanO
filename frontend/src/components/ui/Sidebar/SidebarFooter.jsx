/**
 * KisanO Design System — Sidebar Package
 * SidebarFooter
 *
 * The footer component for the sidebar. Renders user profile, actions,
 * and version information with accessibility support.
 *
 * Single Responsibility: Render the sidebar footer with user info and actions.
 * Does not manage sidebar state or content.
 *
 * @module components/ui/Sidebar/SidebarFooter
 */

import { forwardRef, memo, useMemo } from 'react';
import PropTypes from 'prop-types';
import { motion, useReducedMotion } from 'framer-motion';

import {
  SIDEBAR_DEFAULTS,
} from './sidebarVariants';
import {
  mergeClasses,
  resolveResponsiveClasses,
  getSidebarFooterClasses,
} from './sidebarUtils';

/* ---------------------------------- */
/* Component-specific tokens          */
/* ---------------------------------- */

/** Avatar size mapping. */
const AVATAR_SIZES = {
  xs: 'h-6 w-6 text-xs',
  sm: 'h-7 w-7 text-sm',
  md: 'h-8 w-8 text-sm',
  lg: 'h-9 w-9 text-base',
  xl: 'h-10 w-10 text-base',
};

/** Status indicator size mapping. */
const STATUS_SIZES = {
  xs: 'h-1.5 w-1.5',
  sm: 'h-2 w-2',
  md: 'h-2.5 w-2.5',
  lg: 'h-3 w-3',
  xl: 'h-3.5 w-3.5',
};

/** Status colors. */
const STATUS_COLORS = {
  online: 'bg-green-500',
  offline: 'bg-gray-400',
  away: 'bg-yellow-500',
  busy: 'bg-red-500',
};

/** Motion variants for footer animation. */
const FOOTER_MOTION = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.2, ease: [0.4, 0, 0.2, 1] },
};

/* ---------------------------------- */
/* Component                          */
/* ---------------------------------- */

/**
 * SidebarFooter – the footer section of the sidebar.
 *
 * @component
 * @example
 * <SidebarFooter
 *   name="John Doe"
 *   email="john@example.com"
 *   avatar="/avatar.jpg"
 *   onLogout={handleLogout}
 * />
 */
const SidebarFooter = memo(
  forwardRef(function SidebarFooter(
    {
      children,
      name,
      email,
      avatar,
      initials,
      status = 'offline',
      version,
      size = SIDEBAR_DEFAULTS.size,
      collapsed = false,
      disabled = false,
      showStatus = true,
      onLogout,
      onSettings,
      responsive,
      className = '',
      role = 'contentinfo',
      'aria-label': ariaLabel = 'Sidebar footer',
      ...rest
    },
    ref,
  ) {
    const prefersReducedMotion = useReducedMotion();

    // Footer classes.
    const footerClasses = useMemo(
      () =>
        getSidebarFooterClasses({
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
      () => mergeClasses(footerClasses, responsiveClasses),
      [footerClasses, responsiveClasses],
    );

    // Avatar size.
    const avatarSize = useMemo(
      () => AVATAR_SIZES[size] || AVATAR_SIZES.md,
      [size],
    );

    // Status size.
    const statusSize = useMemo(
      () => STATUS_SIZES[size] || STATUS_SIZES.md,
      [size],
    );

    // Status color.
    const statusColor = useMemo(
      () => STATUS_COLORS[status] || STATUS_COLORS.offline,
      [status],
    );

    // Generate initials from name.
    const generatedInitials = useMemo(() => {
      if (initials) return initials;
      if (!name) return '?';
      return name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
    }, [name, initials]);

    // Motion props - respect reduced motion.
    const motionProps = useMemo(() => {
      if (prefersReducedMotion) {
        return { initial: false, animate: true };
      }
      return FOOTER_MOTION;
    }, [prefersReducedMotion]);

    // Accessibility attributes.
    const ariaProps = useMemo(
      () => ({
        role,
        'aria-label': ariaLabel,
        'aria-hidden': collapsed ? true : undefined,
      }),
      [role, ariaLabel, collapsed],
    );

    // Avatar classes.
    const avatarClasses = useMemo(
      () =>
        mergeClasses(
          'relative flex items-center justify-center',
          'rounded-full',
          avatarSize,
          'bg-gray-200 dark:bg-gray-700',
          'text-gray-700 dark:text-gray-300',
          'font-medium',
          'overflow-hidden',
          'flex-shrink-0',
        ),
      [avatarSize],
    );

    // Handle logout.
    const handleLogout = (event) => {
      if (disabled) return;
      onLogout?.(event);
    };

    // Handle settings.
    const handleSettings = (event) => {
      if (disabled) return;
      onSettings?.(event);
    };

    // Render content.
    const content = (
      <>
        {/* Avatar */}
        {name && (
          <div className={avatarClasses}>
            {avatar ? (
              <img
                src={avatar}
                alt={name}
                className="w-full h-full object-cover"
              />
            ) : (
              <span>{generatedInitials}</span>
            )}
            {showStatus && (
              <span
                className={mergeClasses(
                  'absolute bottom-0 right-0',
                  'rounded-full ring-1 ring-white dark:ring-gray-800',
                  statusSize,
                  statusColor,
                )}
                aria-hidden="true"
              />
            )}
          </div>
        )}

        {/* Name and Email */}
        {!collapsed && (
          <div className="flex flex-col min-w-0 flex-1">
            {name && (
              <span className="text-sm font-medium truncate text-gray-900 dark:text-white">
                {name}
              </span>
            )}
            {email && (
              <span className="text-xs truncate text-gray-500 dark:text-gray-400">
                {email}
              </span>
            )}
          </div>
        )}

        {/* Actions */}
        {!collapsed && (
          <div className="flex items-center gap-1 shrink-0">
            {onSettings && (
              <button
                type="button"
                className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white"
                onClick={handleSettings}
                aria-label="Settings"
                disabled={disabled}
              >
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              </button>
            )}
            {onLogout && (
              <button
                type="button"
                className="p-1 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400"
                onClick={handleLogout}
                aria-label="Logout"
                disabled={disabled}
              >
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
              </button>
            )}
          </div>
        )}

        {/* Version */}
        {!collapsed && version && (
          <span className="text-xs text-gray-400 dark:text-gray-500">
            {version}
          </span>
        )}

        {children}
      </>
    );

    return (
      <motion.footer
        ref={ref}
        className={finalClasses}
        {...motionProps}
        {...ariaProps}
        {...rest}
      >
        {content}
      </motion.footer>
    );
  }),
);

SidebarFooter.displayName = 'SidebarFooter';

SidebarFooter.propTypes = {
  /** Footer content (custom). */
  children: PropTypes.node,
  /** User name. */
  name: PropTypes.string,
  /** User email. */
  email: PropTypes.string,
  /** Avatar image URL. */
  avatar: PropTypes.string,
  /** Initials (auto-generated from name if not provided). */
  initials: PropTypes.string,
  /** Online status. */
  status: PropTypes.oneOf(['online', 'offline', 'away', 'busy']),
  /** Version text. */
  version: PropTypes.string,
  /** Size preset. */
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
  /** Collapsed state. */
  collapsed: PropTypes.bool,
  /** Disabled state. */
  disabled: PropTypes.bool,
  /** Whether to show online status indicator. */
  showStatus: PropTypes.bool,
  /** Callback when logout button is clicked. */
  onLogout: PropTypes.func,
  /** Callback when settings button is clicked. */
  onSettings: PropTypes.func,
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

export default SidebarFooter;