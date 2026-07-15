/**
 * KisanO Design System — Skeleton Package
 * Skeleton
 *
 * The main Skeleton component that orchestrates all skeleton subcomponents.
 * Provides a convenient API for rendering loading placeholders for
 * text, avatars, cards, rectangles, and circles.
 *
 * Single Responsibility: Orchestrate Skeleton subcomponents.
 * Does not contain business logic, helper functions, or duplicate styling.
 *
 * @module components/ui/Skeleton/Skeleton
 */

import { forwardRef, memo, useMemo } from 'react';
import PropTypes from 'prop-types';

import {
  SKELETON_DEFAULTS,
} from './skeletonVariants';
import {
  mergeClasses,
  resolveResponsiveClasses,
  resolveDefaultProps,
} from './skeletonUtils';

import SkeletonContainer from './SkeletonContainer';
import SkeletonText from './SkeletonText';
import SkeletonAvatar from './SkeletonAvatar';
import SkeletonCard from './SkeletonCard';
import SkeletonLoader from './SkeletonLoader';

/* ---------------------------------- */
/* Component                          */
/* ---------------------------------- */

/**
 * Skeleton – the main skeleton component.
 *
 * @component
 * @example
 * <Skeleton variant="text" width="200px" height="20px" />
 *
 * @example
 * <Skeleton variant="avatar" size="lg" />
 *
 * @example
 * <Skeleton variant="card" lines={4} showImage />
 */
const Skeleton = memo(
  forwardRef(function Skeleton(
    {
      children,
      variant = 'text',
      width,
      height,
      size = SKELETON_DEFAULTS.size,
      variant: variantProp,
      radius = SKELETON_DEFAULTS.radius,
      animation = SKELETON_DEFAULTS.animation,
      lines = 1,
      showImage = false,
      showAvatar = false,
      circular = false,
      dimension,
      disabled = false,
      loading = true,
      responsive,
      className = '',
      containerClassName = '',
      textClassName = '',
      avatarClassName = '',
      cardClassName = '',
      containerProps,
      textProps,
      avatarProps,
      cardProps,
      loaderProps,
      ...rest
    },
    ref,
  ) {
    // Resolve defaults.
    const resolved = useMemo(
      () =>
        resolveDefaultProps({
          variant: variantProp || variant,
          size,
          radius,
          animation,
          disabled,
          loading,
        }),
      [variantProp, variant, size, radius, animation, disabled, loading],
    );

    // Determine effective variant.
    const effectiveVariant = variantProp || variant;

    // Container props.
    const containerPropsMerged = useMemo(
      () => ({
        orientation: effectiveVariant === 'card' ? 'vertical' : 'horizontal',
        disabled: resolved.disabled,
        loading: resolved.loading,
        className: containerClassName,
        ...containerProps,
      }),
      [effectiveVariant, resolved.disabled, resolved.loading, containerClassName, containerProps],
    );

    // Render content based on variant.
    const renderContent = () => {
      if (children) return children;

      switch (effectiveVariant) {
        case 'avatar':
          return (
            <SkeletonAvatar
              size={size}
              variant={resolved.variant}
              radius={radius}
              animation={resolved.animation}
              dimension={dimension}
              disabled={resolved.disabled}
              loading={resolved.loading}
              className={avatarClassName}
              {...avatarProps}
            />
          );

        case 'card':
          return (
            <SkeletonCard
              size={size}
              variant={resolved.variant}
              radius={radius}
              animation={resolved.animation}
              lines={lines}
              showImage={showImage}
              showAvatar={showAvatar}
              disabled={resolved.disabled}
              loading={resolved.loading}
              className={cardClassName}
              {...cardProps}
            />
          );

        case 'rectangle':
          return (
            <div
              className={mergeClasses(
                'relative overflow-hidden',
                resolved.variant === 'default' ? 'bg-gray-200 dark:bg-gray-700' : '',
                getSkeletonRadius(resolved.radius),
                getSkeletonAnimation(resolved.animation).transition,
                resolved.loading ? getSkeletonAnimation(resolved.animation).animation : '',
                resolved.disabled && 'opacity-50 cursor-not-allowed',
                width ? `w-[${width}]` : 'w-full',
                height ? `h-[${height}]` : 'h-20',
                className,
              )}
            >
              {resolved.loading && resolved.animation === 'shimmer' && (
                <div className="absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent via-white/50 to-transparent" />
              )}
            </div>
          );

        case 'circle':
          return (
            <div
              className={mergeClasses(
                'relative overflow-hidden rounded-full',
                resolved.variant === 'default' ? 'bg-gray-200 dark:bg-gray-700' : '',
                getSkeletonAnimation(resolved.animation).transition,
                resolved.loading ? getSkeletonAnimation(resolved.animation).animation : '',
                resolved.disabled && 'opacity-50 cursor-not-allowed',
                dimension || 'h-20 w-20',
                className,
              )}
            >
              {resolved.loading && resolved.animation === 'shimmer' && (
                <div className="absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent via-white/50 to-transparent" />
              )}
            </div>
          );

        case 'text':
        default:
          return (
            <SkeletonText
              size={size}
              variant={resolved.variant}
              radius={radius}
              animation={resolved.animation}
              width={width}
              lines={lines}
              disabled={resolved.disabled}
              loading={resolved.loading}
              className={textClassName}
              {...textProps}
            />
          );
      }
    };

    // If loading is false, render nothing.
    if (!resolved.loading) {
      return null;
    }

    return (
      <SkeletonContainer ref={ref} {...containerPropsMerged} {...rest}>
        {renderContent()}
      </SkeletonContainer>
    );
  }),
);

Skeleton.displayName = 'Skeleton';

Skeleton.propTypes = {
  /** Skeleton children (custom). */
  children: PropTypes.node,
  /** Skeleton variant. */
  variant: PropTypes.oneOf(['text', 'avatar', 'card', 'rectangle', 'circle']),
  /** Custom width. */
  width: PropTypes.string,
  /** Custom height. */
  height: PropTypes.string,
  /** Size preset. */
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
  /** Visual variant. */
  variantProp: PropTypes.oneOf(['default', 'light', 'dark', 'primary']),
  /** Border radius override. */
  radius: PropTypes.oneOf(['none', 'sm', 'md', 'lg', 'xl', '2xl', 'full']),
  /** Animation type. */
  animation: PropTypes.oneOf(['pulse', 'shimmer', 'wave', 'none']),
  /** Number of text lines. */
  lines: PropTypes.number,
  /** Show image in card. */
  showImage: PropTypes.bool,
  /** Show avatar in card. */
  showAvatar: PropTypes.bool,
  /** Circular skeleton. */
  circular: PropTypes.bool,
  /** Custom dimension for circle/avatar. */
  dimension: PropTypes.string,
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
  /** Additional CSS classes for the container wrapper. */
  containerClassName: PropTypes.string,
  /** Additional CSS classes for text skeleton. */
  textClassName: PropTypes.string,
  /** Additional CSS classes for avatar skeleton. */
  avatarClassName: PropTypes.string,
  /** Additional CSS classes for card skeleton. */
  cardClassName: PropTypes.string,
  /** Additional props for SkeletonContainer. */
  containerProps: PropTypes.object,
  /** Additional props for SkeletonText. */
  textProps: PropTypes.object,
  /** Additional props for SkeletonAvatar. */
  avatarProps: PropTypes.object,
  /** Additional props for SkeletonCard. */
  cardProps: PropTypes.object,
  /** Additional props for SkeletonLoader. */
  loaderProps: PropTypes.object,
};

export default Skeleton;