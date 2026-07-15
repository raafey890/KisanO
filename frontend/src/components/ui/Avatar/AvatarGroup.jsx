/**
 * KisanO Design System — Avatar Package
 * AvatarGroup
 *
 * The group component for avatars. Renders multiple avatars with
 * overlapping, maximum visible count, and overflow indicator.
 *
 * Single Responsibility: Render a group of avatars.
 * Does not manage individual avatar state or business logic.
 *
 * @module components/ui/Avatar/AvatarGroup
 */

import { forwardRef, memo, useMemo } from 'react';
import PropTypes from 'prop-types';
import { motion, useReducedMotion } from 'framer-motion';

import {
  AVATAR_DEFAULTS,
} from './avatarVariants';
import {
  mergeClasses,
  resolveResponsiveClasses,
  getAvatarGroupClasses,
} from './avatarUtils';

import Avatar from './Avatar';

/* ---------------------------------- */
/* Component-specific tokens          */
/* ---------------------------------- */

/** Motion variants for group animation. */
const GROUP_MOTION = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: 0.2, ease: [0.4, 0, 0.2, 1] },
};

/** Overflow avatar size mapping. */
const OVERFLOW_SIZES = {
  xs: 'h-6 w-6 text-[10px]',
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-12 w-12 text-base',
  xl: 'h-14 w-14 text-lg',
  '2xl': 'h-16 w-16 text-xl',
};

/** Default maximum number of avatars to show. */
const DEFAULT_MAX = 5;

/* ---------------------------------- */
/* Component                          */
/* ---------------------------------- */

/**
 * AvatarGroup – a group of avatars.
 *
 * @component
 * @example
 * <AvatarGroup
 *   avatars={[
 *     { src: '/user1.jpg', name: 'John Doe' },
 *     { src: '/user2.jpg', name: 'Jane Smith' },
 *   ]}
 * />
 *
 * @example
 * <AvatarGroup
 *   avatars={avatars}
 *   max={3}
 *   size="lg"
 *   variant="primary"
 * />
 */
const AvatarGroup = memo(
  forwardRef(function AvatarGroup(
    {
      children,
      avatars = [],
      max = DEFAULT_MAX,
      size = AVATAR_DEFAULTS.size,
      variant = AVATAR_DEFAULTS.variant,
      radius = AVATAR_DEFAULTS.radius,
      status = AVATAR_DEFAULTS.status,
      group = AVATAR_DEFAULTS.group,
      showStatus = true,
      animated = false,
      disabled = false,
      loading = false,
      responsive,
      className = '',
      avatarProps,
      ...rest
    },
    ref,
  ) {
    const prefersReducedMotion = useReducedMotion();

    // Group classes.
    const groupClasses = useMemo(
      () =>
        getAvatarGroupClasses({
          group,
          className,
          radius,
          max,
          count: avatars.length,
          disabled,
        }),
      [group, className, radius, max, avatars.length, disabled],
    );

    // Responsive overrides.
    const responsiveClasses = useMemo(
      () => (responsive ? resolveResponsiveClasses(responsive) : ''),
      [responsive],
    );

    const finalClasses = useMemo(
      () => mergeClasses(groupClasses, responsiveClasses),
      [groupClasses, responsiveClasses],
    );

    // Overflow size.
    const overflowSize = useMemo(
      () => OVERFLOW_SIZES[size] || OVERFLOW_SIZES.md,
      [size],
    );

    // Determine visible avatars.
    const visibleAvatars = useMemo(() => {
      if (loading) return [];
      return avatars.slice(0, max);
    }, [avatars, max, loading]);

    // Overflow count.
    const overflowCount = useMemo(() => {
      if (loading) return 0;
      return Math.max(0, avatars.length - max);
    }, [avatars, max, loading]);

    // Motion props - respect reduced motion.
    const motionProps = useMemo(() => {
      if (prefersReducedMotion) {
        return { initial: false, animate: true };
      }
      return GROUP_MOTION;
    }, [prefersReducedMotion]);

    // Accessibility attributes.
    const ariaProps = useMemo(
      () => ({
        role: 'group',
        'aria-label': `Avatar group with ${avatars.length} members`,
        'aria-disabled': disabled || undefined,
        'data-group': group,
        'data-size': size,
      }),
      [avatars.length, disabled, group, size],
    );

    // If no avatars and no children, render nothing.
    if (!avatars.length && !children) {
      return null;
    }

    // Render avatar group.
    return (
      <motion.div
        ref={ref}
        className={finalClasses}
        {...motionProps}
        {...ariaProps}
        {...rest}
      >
        {/* Avatars */}
        {visibleAvatars.map((avatar, index) => (
          <Avatar
            key={avatar.id || index}
            src={avatar.src}
            name={avatar.name}
            initials={avatar.initials}
            icon={avatar.icon}
            alt={avatar.alt}
            status={avatar.status || status}
            variant={avatar.variant || variant}
            size={size}
            radius={radius}
            showStatus={showStatus}
            animated={animated}
            disabled={avatar.disabled || disabled}
            loading={avatar.loading || loading}
            className={`z-${Math.min(index + 1, 50)}`}
            {...avatarProps}
            {...avatar}
          />
        ))}

        {/* Overflow count */}
        {overflowCount > 0 && (
          <Avatar
            name={`+${overflowCount}`}
            variant={variant}
            size={size}
            radius={radius}
            disabled={disabled}
            className={mergeClasses(
              'ring-2 ring-white dark:ring-gray-900',
              'bg-gray-200 dark:bg-gray-700',
              'text-gray-600 dark:text-gray-300',
              overflowSize,
            )}
          />
        )}

        {/* Custom children */}
        {children}
      </motion.div>
    );
  }),
);

AvatarGroup.displayName = 'AvatarGroup';

AvatarGroup.propTypes = {
  /** Avatar group children (custom). */
  children: PropTypes.node,
  /** Array of avatar objects. */
  avatars: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      src: PropTypes.string,
      name: PropTypes.string,
      initials: PropTypes.string,
      icon: PropTypes.node,
      alt: PropTypes.string,
      status: PropTypes.oneOf(['online', 'offline', 'away', 'busy']),
      variant: PropTypes.oneOf([
        'default',
        'primary',
        'secondary',
        'success',
        'warning',
        'error',
        'info',
        'gradient',
      ]),
      disabled: PropTypes.bool,
      loading: PropTypes.bool,
    }),
  ),
  /** Maximum number of avatars to show. */
  max: PropTypes.number,
  /** Size preset. */
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl', '2xl']),
  /** Visual variant. */
  variant: PropTypes.oneOf([
    'default',
    'primary',
    'secondary',
    'success',
    'warning',
    'error',
    'info',
    'gradient',
  ]),
  /** Border radius override. */
  radius: PropTypes.oneOf(['none', 'sm', 'md', 'lg', 'xl', '2xl', 'full']),
  /** Status indicator. */
  status: PropTypes.oneOf(['online', 'offline', 'away', 'busy']),
  /** Group style. */
  group: PropTypes.oneOf(['default', 'compact', 'loose']),
  /** Whether to show status indicator. */
  showStatus: PropTypes.bool,
  /** Whether status indicator is animated. */
  animated: PropTypes.bool,
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
  /** Additional props for Avatar components. */
  avatarProps: PropTypes.object,
};

export default AvatarGroup;