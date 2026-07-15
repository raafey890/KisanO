/**
 * KisanO Design System — Navbar Package
 * NavbarProfile
 *
 * The profile component for the navbar. Renders user avatar, name, email,
 * online status, and a dropdown indicator with accessibility support.
 *
 * Single Responsibility: Render the user profile section in the navbar.
 * Does not manage user authentication or dropdown state.
 *
 * @module components/ui/Navbar/NavbarProfile
 */

import { forwardRef, memo, useMemo } from 'react';
import PropTypes from 'prop-types';
import { motion, useReducedMotion } from 'framer-motion';

import {
  NAVBAR_DEFAULTS,
} from './navbarVariants';
import {
  mergeClasses,
  resolveResponsiveClasses,
} from './navbarUtils';

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

/** Motion variants for profile animation. */
const PROFILE_MOTION = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  hover: { scale: 1.02 },
  tap: { scale: 0.98 },
  transition: { duration: 0.2, ease: [0.4, 0, 0.2, 1] },
};

/* ---------------------------------- */
/* Component                          */
/* ---------------------------------- */

/**
 * NavbarProfile – the user profile section in the navbar.
 *
 * @component
 * @example
 * <NavbarProfile
 *   name="John Doe"
 *   email="john@example.com"
 *   avatar="/avatar.jpg"
 *   status="online"
 * />
 */
const NavbarProfile = memo(
  forwardRef(function NavbarProfile(
    {
      name,
      email,
      avatar,
      initials,
      status = 'offline',
      size = NAVBAR_DEFAULTS.size,
      disabled = false,
      loading = false,
      showName = true,
      showEmail = false,
      showStatus = true,
      responsive,
      className = '',
      role = 'button',
      'aria-label': ariaLabel,
      ...rest
    },
    ref,
  ) {
    const prefersReducedMotion = useReducedMotion();

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

    // Responsive overrides.
    const responsiveClasses = useMemo(
      () => (responsive ? resolveResponsiveClasses(responsive) : ''),
      [responsive],
    );

    // Profile classes.
    const profileClasses = useMemo(() => {
      const base = mergeClasses(
        'flex items-center gap-2',
        'rounded-md',
        'cursor-pointer',
        'transition-all duration-200 ease-in-out',
        disabled && 'opacity-50 cursor-not-allowed pointer-events-none',
        loading && 'opacity-70',
        className,
      );
      return mergeClasses(base, responsiveClasses);
    }, [disabled, loading, className, responsiveClasses]);

    // Avatar classes.
    const avatarClasses = useMemo(() => {
      const base = mergeClasses(
        'relative flex items-center justify-center',
        'rounded-full',
        avatarSize,
        'bg-gray-200 dark:bg-gray-700',
        'text-gray-700 dark:text-gray-300',
        'font-medium',
        'overflow-hidden',
        'flex-shrink-0',
      );
      return base;
    }, [avatarSize]);

    // Text classes.
    const textClasses = useMemo(() => {
      const base = mergeClasses(
        'flex flex-col min-w-0',
        disabled && 'opacity-50',
        loading && 'opacity-70',
      );
      return base;
    }, [disabled, loading]);

    // Name classes.
    const nameClasses = useMemo(() => {
      const base = mergeClasses(
        'text-sm font-medium truncate',
        'text-gray-900 dark:text-white',
      );
      return base;
    }, []);

    // Email classes.
    const emailClasses = useMemo(() => {
      const base = mergeClasses(
        'text-xs truncate',
        'text-gray-500 dark:text-gray-400',
      );
      return base;
    }, []);

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
        whileHover: PROFILE_MOTION.hover,
        whileTap: PROFILE_MOTION.tap,
        transition: PROFILE_MOTION.transition,
      };
    }, [prefersReducedMotion, disabled, loading]);

    // Accessibility attributes.
    const ariaProps = useMemo(
      () => ({
        role,
        'aria-label': ariaLabel || `Profile: ${name || 'User'}`,
        'aria-disabled': disabled || undefined,
        tabIndex: disabled ? -1 : 0,
      }),
      [role, ariaLabel, name, disabled],
    );

    return (
      <motion.div
        ref={ref}
        className={profileClasses}
        {...motionProps}
        {...ariaProps}
        {...rest}
      >
        {/* Avatar */}
        <div className={avatarClasses}>
          {avatar ? (
            <img
              src={avatar}
              alt={name || 'Avatar'}
              className="w-full h-full object-cover"
            />
          ) : (
            <span>{generatedInitials}</span>
          )}

          {/* Status indicator */}
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

        {/* Name and Email */}
        {(showName || showEmail) && (
          <div className={textClasses}>
            {showName && name && (
              <span className={nameClasses}>{name}</span>
            )}
            {showEmail && email && (
              <span className={emailClasses}>{email}</span>
            )}
          </div>
        )}

        {/* Dropdown indicator */}
        {!loading && (
          <svg
            className="h-4 w-4 shrink-0 text-gray-400 dark:text-gray-500"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
        )}

        {/* Loading spinner */}
        {loading && (
          <svg
            className="animate-spin h-4 w-4 shrink-0 text-gray-400"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 0 1 8-8v4a4 4 0 0 0-4 4H4z" />
          </svg>
        )}
      </motion.div>
    );
  }),
);

NavbarProfile.displayName = 'NavbarProfile';

NavbarProfile.propTypes = {
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
  /** Size preset. */
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
  /** Disabled state. */
  disabled: PropTypes.bool,
  /** Loading state. */
  loading: PropTypes.bool,
  /** Whether to show the user name. */
  showName: PropTypes.bool,
  /** Whether to show the user email. */
  showEmail: PropTypes.bool,
  /** Whether to show the online status indicator. */
  showStatus: PropTypes.bool,
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

export default NavbarProfile;