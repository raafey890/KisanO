/**
 * KisanO Design System — Skeleton Package
 * SkeletonCard
 *
 * A card skeleton loader component. Renders placeholder content for
 * cards with image, title, description, and action button placeholders.
 *
 * Single Responsibility: Render card skeleton placeholders.
 * Does not manage skeleton state or business logic.
 *
 * @module components/ui/Skeleton/SkeletonCard
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
  getSkeletonCardClasses,
} from './skeletonUtils';

/* ---------------------------------- */
/* Component-specific tokens          */
/* ---------------------------------- */

/** Motion variants for card animation. */
const CARD_MOTION = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  transition: { duration: 0.2, ease: [0.4, 0, 0.2, 1] },
};

/** Staggered animation variants for card elements. */
const STAGGER_MOTION = {
  initial: { opacity: 0, y: -8 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.15, staggerChildren: 0.05 },
};

/** Default lines for description. */
const DEFAULT_DESCRIPTION_LINES = 3;

/* ---------------------------------- */
/* Component                          */
/* ---------------------------------- */

/**
 * SkeletonCard – a card skeleton loader.
 *
 * @component
 * @example
 * <SkeletonCard />
 *
 * @example
 * <SkeletonCard showImage={false} lines={2} variant="primary" animation="shimmer" />
 */
const SkeletonCard = memo(
  forwardRef(function SkeletonCard(
    {
      size = SKELETON_DEFAULTS.size,
      variant = SKELETON_DEFAULTS.variant,
      radius = SKELETON_DEFAULTS.radius,
      animation = SKELETON_DEFAULTS.animation,
      lines = DEFAULT_DESCRIPTION_LINES,
      showImage = true,
      showAvatar = false,
      showTitle = true,
      showSubtitle = true,
      showAction = true,
      imageHeight = 'h-32',
      titleWidth = 'w-3/4',
      subtitleWidth = 'w-1/2',
      disabled = false,
      loading = true,
      responsive,
      className = '',
      imageClassName = '',
      contentClassName = '',
      actionClassName = '',
      ...rest
    },
    ref,
  ) {
    const prefersReducedMotion = useReducedMotion();

    // Determine if loading.
    const isLoading = loading && !disabled;

    // Get card skeleton classes.
    const cardClasses = useMemo(
      () =>
        getSkeletonCardClasses({
          size,
          variant,
          radius,
          animation,
          className,
          disabled,
          loading: isLoading,
          lines,
          showImage,
          showAvatar,
        }),
      [size, variant, radius, animation, className, disabled, isLoading, lines, showImage, showAvatar],
    );

    // Responsive overrides.
    const responsiveClasses = useMemo(
      () => (responsive ? resolveResponsiveClasses(responsive) : ''),
      [responsive],
    );

    const finalClasses = useMemo(
      () => mergeClasses(cardClasses.container, responsiveClasses),
      [cardClasses.container, responsiveClasses],
    );

    // Motion props - respect reduced motion.
    const motionProps = useMemo(() => {
      if (prefersReducedMotion) {
        return { initial: false, animate: true };
      }
      return CARD_MOTION;
    }, [prefersReducedMotion]);

    // Stagger motion props.
    const staggerProps = useMemo(() => {
      if (prefersReducedMotion) {
        return { initial: false, animate: true };
      }
      return STAGGER_MOTION;
    }, [prefersReducedMotion]);

    // Shimmer overlay.
    const shimmerOverlay = isLoading && animation === 'shimmer' ? (
      <motion.div
        className="absolute inset-0 overflow-hidden rounded-inherit"
        initial={{ x: '-100%' }}
        animate={{ x: '100%' }}
        transition={{
          duration: 1.8,
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

    // Render card elements.
    const renderElements = () => (
      <div className={mergeClasses('flex flex-col gap-3', cardClasses.content || '')}>
        {/* Image */}
        {showImage && (
          <div
            className={mergeClasses(
              'relative overflow-hidden bg-gray-200 dark:bg-gray-700 rounded-md',
              imageHeight,
              isLoading && animation === 'pulse' && 'animate-pulse',
              imageClassName,
            )}
          >
            {isLoading && animation === 'shimmer' && (
              <motion.div
                className="absolute inset-0"
                initial={{ x: '-100%' }}
                animate={{ x: '100%' }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'ease-in-out' }}
              >
                <div className="h-full w-1/2 bg-gradient-to-r from-transparent via-white/50 to-transparent" />
              </motion.div>
            )}
          </div>
        )}

        {/* Avatar */}
        {showAvatar && (
          <div
            className={mergeClasses(
              'relative overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700',
              'h-10 w-10',
              isLoading && animation === 'pulse' && 'animate-pulse',
            )}
          >
            {isLoading && animation === 'shimmer' && (
              <motion.div
                className="absolute inset-0"
                initial={{ x: '-100%' }}
                animate={{ x: '100%' }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'ease-in-out', delay: 0.1 }}
              >
                <div className="h-full w-1/2 bg-gradient-to-r from-transparent via-white/50 to-transparent" />
              </motion.div>
            )}
          </div>
        )}

        {/* Title */}
        {showTitle && (
          <div
            className={mergeClasses(
              'relative overflow-hidden bg-gray-200 dark:bg-gray-700 rounded-md',
              'h-4',
              titleWidth,
              isLoading && animation === 'pulse' && 'animate-pulse',
            )}
          >
            {isLoading && animation === 'shimmer' && (
              <motion.div
                className="absolute inset-0"
                initial={{ x: '-100%' }}
                animate={{ x: '100%' }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'ease-in-out', delay: 0.15 }}
              >
                <div className="h-full w-1/2 bg-gradient-to-r from-transparent via-white/50 to-transparent" />
              </motion.div>
            )}
          </div>
        )}

        {/* Subtitle */}
        {showSubtitle && (
          <div
            className={mergeClasses(
              'relative overflow-hidden bg-gray-200 dark:bg-gray-700 rounded-md',
              'h-3',
              subtitleWidth,
              isLoading && animation === 'pulse' && 'animate-pulse',
            )}
          >
            {isLoading && animation === 'shimmer' && (
              <motion.div
                className="absolute inset-0"
                initial={{ x: '-100%' }}
                animate={{ x: '100%' }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'ease-in-out', delay: 0.2 }}
              >
                <div className="h-full w-1/2 bg-gradient-to-r from-transparent via-white/50 to-transparent" />
              </motion.div>
            )}
          </div>
        )}

        {/* Description */}
        {Array.from({ length: lines }).map((_, index) => (
          <div
            key={index}
            className={mergeClasses(
              'relative overflow-hidden bg-gray-200 dark:bg-gray-700 rounded-md',
              'h-3',
              index === lines - 1 ? 'w-3/4' : 'w-full',
              isLoading && animation === 'pulse' && 'animate-pulse',
            )}
          >
            {isLoading && animation === 'shimmer' && (
              <motion.div
                className="absolute inset-0"
                initial={{ x: '-100%' }}
                animate={{ x: '100%' }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: 'ease-in-out',
                  delay: 0.25 + index * 0.05,
                }}
              >
                <div className="h-full w-1/2 bg-gradient-to-r from-transparent via-white/50 to-transparent" />
              </motion.div>
            )}
          </div>
        ))}

        {/* Action button */}
        {showAction && (
          <div
            className={mergeClasses(
              'relative overflow-hidden bg-gray-200 dark:bg-gray-700 rounded-md',
              'h-9 w-24 mt-2',
              isLoading && animation === 'pulse' && 'animate-pulse',
              actionClassName,
            )}
          >
            {isLoading && animation === 'shimmer' && (
              <motion.div
                className="absolute inset-0"
                initial={{ x: '-100%' }}
                animate={{ x: '100%' }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: 'ease-in-out',
                  delay: 0.3,
                }}
              >
                <div className="h-full w-1/2 bg-gradient-to-r from-transparent via-white/50 to-transparent" />
              </motion.div>
            )}
          </div>
        )}
      </div>
    );

    // Accessibility attributes.
    const ariaProps = useMemo(
      () => ({
        role: 'status',
        'aria-label': 'Loading card',
        'aria-busy': isLoading || undefined,
        'aria-disabled': disabled || undefined,
        'data-size': size,
        'data-variant': variant,
      }),
      [isLoading, disabled, size, variant],
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
        <motion.div {...staggerProps}>
          {renderElements()}
        </motion.div>
        {shimmerOverlay}
      </motion.div>
    );
  }),
);

SkeletonCard.displayName = 'SkeletonCard';

SkeletonCard.propTypes = {
  /** Size preset. */
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
  /** Visual variant. */
  variant: PropTypes.oneOf(['default', 'light', 'dark', 'primary']),
  /** Border radius override. */
  radius: PropTypes.oneOf(['none', 'sm', 'md', 'lg', 'xl', '2xl', 'full']),
  /** Animation type. */
  animation: PropTypes.oneOf(['pulse', 'shimmer', 'wave', 'none']),
  /** Number of description lines. */
  lines: PropTypes.number,
  /** Whether to show image placeholder. */
  showImage: PropTypes.bool,
  /** Whether to show avatar placeholder. */
  showAvatar: PropTypes.bool,
  /** Whether to show title placeholder. */
  showTitle: PropTypes.bool,
  /** Whether to show subtitle placeholder. */
  showSubtitle: PropTypes.bool,
  /** Whether to show action button placeholder. */
  showAction: PropTypes.bool,
  /** Image height class. */
  imageHeight: PropTypes.string,
  /** Title width class. */
  titleWidth: PropTypes.string,
  /** Subtitle width class. */
  subtitleWidth: PropTypes.string,
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
  /** Additional CSS classes for the container. */
  className: PropTypes.string,
  /** Additional CSS classes for the image. */
  imageClassName: PropTypes.string,
  /** Additional CSS classes for the content. */
  contentClassName: PropTypes.string,
  /** Additional CSS classes for the action. */
  actionClassName: PropTypes.string,
};

export default SkeletonCard;