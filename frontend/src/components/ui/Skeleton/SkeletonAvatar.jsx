/**
 * KisanO Design System — Skeleton Package
 * SkeletonAvatar
 *
 * An avatar skeleton loader component. Renders circular or square
 * placeholder avatars with pulse or shimmer animations.
 *
 * Single Responsibility: Render avatar skeleton placeholders.
 * Does not manage skeleton state or business logic.
 *
 * @module components/ui/Skeleton/SkeletonAvatar
 */

import { forwardRef, memo, useMemo } from 'react';
import PropTypes from 'prop-types';
import { motion, useReducedMotion } from 'framer-motion';

import {
  SKELETON_DEFAULTS,
} from './skeletonVariants';
import {
  mergeClasses,
  resolveResponsiveClasses,
  getSkeletonAvatarClasses,
} from './skeletonUtils';

/* ---------------------------------- */
/* Component-specific tokens          */
/* ---------------------------------- */

/** Motion variants for avatar animation. */
const AVATAR_MOTION = {
  initial: { opacity: 0, scale: 0.8 },
  animate: { opacity: 1, scale: 1 },
  transition: { duration: 0.2, ease: [0.4, 0, 0.2, 1] },
};

/** Default size mapping. */
const SIZE_MAP = {
  xs: 'h-6 w-6',
  sm: 'h-8 w-8',
  md: 'h-10 w-10',
  lg: 'h-12 w-12',
  xl: 'h-14 w-14',
  '2xl': 'h-16 w-16',
};

/** Custom dimension processing. */
const DIMENSION_REGEX = /^(\d+)(px|rem|em|%)?$/;

/* ---------------------------------- */
/* Component                          */
/* ---------------------------------- */

/**
 * SkeletonAvatar – an avatar skeleton loader.
 *
 * @component
 * @example
 * <SkeletonAvatar size="lg" />
 *
 * @example
 * <SkeletonAvatar dimension="h-12 w-12" variant="primary" animation="shimmer" />
 */
const SkeletonAvatar = memo(
  forwardRef(function SkeletonAvatar(
    {
      size = SKELETON_DEFAULTS.size,
      variant = SKELETON_DEFAULTS.variant,
      radius = SKELETON_DEFAULTS.radius,
      animation = SKELETON_DEFAULTS.animation,
      dimension,
      circular = true,
      disabled = false,
      loading = true,
      responsive,
      className = '',
      role = 'img',
      'aria-label': ariaLabel = 'Loading avatar',
      ...rest
    },
    ref,
  ) {
    const prefersReducedMotion = useReducedMotion();

    // Determine if loading.
    const isLoading = loading && !disabled;

    // Get dimension classes.
    const dimensionClasses = useMemo(() => {
      if (dimension) return dimension;
      return SIZE_MAP[size] || SIZE_MAP.md;
    }, [size, dimension]);

    // Avatar classes.
    const avatarClasses = useMemo(
      () =>
        getSkeletonAvatarClasses({
          size,
          variant,
          radius,
          animation,
          className,
          disabled,
          loading: isLoading,
          dimension: dimensionClasses,
        }),
      [size, variant, radius, animation, className, disabled, isLoading, dimensionClasses],
    );

    // Responsive overrides.
    const responsiveClasses = useMemo(
      () => (responsive ? resolveResponsiveClasses(responsive) : ''),
      [responsive],
    );

    const finalClasses = useMemo(
      () => mergeClasses(avatarClasses, responsiveClasses),
      [avatarClasses, responsiveClasses],
    );

    // Motion props - respect reduced motion.
    const motionProps = useMemo(() => {
      if (prefersReducedMotion) {
        return { initial: false, animate: true };
      }
      return AVATAR_MOTION;
    }, [prefersReducedMotion]);

    // Shimmer overlay.
    const shimmerOverlay = isLoading && animation === 'shimmer' ? (
      <motion.div
        className="absolute inset-0 overflow-hidden rounded-inherit"
        initial={{ x: '-100%' }}
        animate={{ x: '100%' }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: 'ease-in-out',
        }}
      >
        <div
          className="h-full w-1/2 bg-gradient-to-r from-transparent via-white/50 to-transparent"
          style={{ borderRadius: 'inherit' }}
        />
      </motion.div>
    ) : null;

    // Accessibility attributes.
    const ariaProps = useMemo(
      () => ({
        role,
        'aria-label': ariaLabel,
        'aria-busy': isLoading || undefined,
        'aria-disabled': disabled || undefined,
        'data-size': size,
        'data-circular': circular || undefined,
      }),
      [role, ariaLabel, isLoading, disabled, size, circular],
    );

    // If not loading, render nothing.
    if (!isLoading) {
      return null;
    }

    return (
      <motion.div
        ref={ref}
        className={finalClasses}
        {...motionProps}
        {...ariaProps}
        {...rest}
      >
        {shimmerOverlay}
      </motion.div>
    );
  }),
);

SkeletonAvatar.displayName = 'SkeletonAvatar';

SkeletonAvatar.propTypes = {
  /** Size preset. */
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl', '2xl']),
  /** Visual variant. */
  variant: PropTypes.oneOf(['default', 'light', 'dark', 'primary']),
  /** Border radius override. */
  radius: PropTypes.oneOf(['none', 'sm', 'md', 'lg', 'xl', '2xl', 'full']),
  /** Animation type. */
  animation: PropTypes.oneOf(['pulse', 'shimmer', 'wave', 'none']),
  /** Custom dimension (e.g., "h-12 w-12"). */
  dimension: PropTypes.string,
  /** Whether avatar is circular. */
  circular: PropTypes.bool,
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
  /** ARIA role. */
  role: PropTypes.string,
  /** Accessible label. */
  'aria-label': PropTypes.string,
};

export default SkeletonAvatar;