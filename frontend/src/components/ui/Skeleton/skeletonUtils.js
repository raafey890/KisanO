/**
 * KisanO Design System — Skeleton Package
 * Skeleton Utilities
 *
 * Production-ready utility functions for the Skeleton package.
 * Contains only pure utility functions based on the existing skeletonVariants.js tokens.
 *
 * Single Responsibility: This module only provides utility functions
 * for skeleton styling, validation, and composition - no design tokens or React components.
 *
 * @module components/ui/Skeleton/skeletonUtils
 */

import {
  SKELETON_VARIANTS,
  SKELETON_SIZES,
  SKELETON_RADIUS,
  SKELETON_ANIMATIONS,
  SKELETON_DEFAULTS,
  getSkeletonVariant,
  getSkeletonSize,
  getSkeletonRadius,
  getSkeletonAnimation,
} from './skeletonVariants';

/* ---------------------------------- */
/* Core Utility Functions             */
/* ---------------------------------- */

/**
 * Merges an arbitrary list of class values into a single class string.
 * - Falsy values (null, undefined, false, '') are ignored.
 * - Whitespace is normalized.
 * - Duplicate class names are removed (first occurrence wins).
 *
 * @param {...(string|false|null|undefined)} classes - Class values to merge.
 * @returns {string} A single, de-duplicated class string.
 *
 * @example
 * mergeClasses('p-4', isError && 'border-red-500', undefined)
 * // => 'p-4 border-red-500'
 */
export function mergeClasses(...classes) {
  const seen = new Set();
  const tokens = classes
    .filter(Boolean)
    .join(' ')
    .split(/\s+/)
    .filter((token) => token && !seen.has(token));

  for (const token of tokens) {
    seen.add(token);
  }
  return tokens.join(' ');
}

/**
 * Resolves responsive class overrides into a single class string.
 *
 * @param {Object} responsive - Responsive class map.
 * @param {string} [responsive.xs] - Extra small classes.
 * @param {string} [responsive.sm] - Small classes.
 * @param {string} [responsive.md] - Medium classes.
 * @param {string} [responsive.lg] - Large classes.
 * @param {string} [responsive.xl] - Extra large classes.
 * @returns {string} Merged responsive classes.
 */
export function resolveResponsiveClasses(responsive = {}) {
  const { xs, sm, md, lg, xl } = responsive;
  return mergeClasses(
    xs || '',
    sm ? `sm:${sm}` : '',
    md ? `md:${md}` : '',
    lg ? `lg:${lg}` : '',
    xl ? `xl:${xl}` : '',
  );
}

/**
 * Resolves default props for skeleton components.
 *
 * @param {Object} props - Component props.
 * @param {string} [props.variant] - Skeleton variant.
 * @param {string} [props.size] - Skeleton size.
 * @param {string} [props.radius] - Border radius.
 * @param {string} [props.animation] - Animation type.
 * @param {boolean} [props.disabled] - Disabled state.
 * @param {boolean} [props.loading] - Loading state.
 * @returns {Object} Resolved props with defaults applied.
 */
export function resolveDefaultProps({
  variant = SKELETON_DEFAULTS.variant,
  size = SKELETON_DEFAULTS.size,
  radius = SKELETON_DEFAULTS.radius,
  animation = SKELETON_DEFAULTS.animation,
  disabled = SKELETON_DEFAULTS.disabled,
  loading = SKELETON_DEFAULTS.loading,
}) {
  return {
    variant: SKELETON_VARIANTS[variant] ? variant : SKELETON_DEFAULTS.variant,
    size: SKELETON_SIZES[size] ? size : SKELETON_DEFAULTS.size,
    radius: SKELETON_RADIUS[radius] ? radius : SKELETON_DEFAULTS.radius,
    animation: SKELETON_ANIMATIONS[animation] ? animation : SKELETON_DEFAULTS.animation,
    disabled,
    loading,
  };
}

/* ---------------------------------- */
/* Component Class Builders           */
/* ---------------------------------- */

/**
 * Gets complete skeleton classes based on options.
 *
 * @param {Object} options - Skeleton options.
 * @param {string} [options.variant] - Skeleton variant.
 * @param {string} [options.size] - Skeleton size.
 * @param {string} [options.radius] - Border radius.
 * @param {string} [options.animation] - Animation type.
 * @param {string} [options.className] - Additional classes.
 * @param {boolean} [options.disabled] - Disabled state.
 * @param {boolean} [options.loading] - Loading state.
 * @param {boolean} [options.circular] - Circular skeleton.
 * @returns {string} Merged skeleton classes.
 */
export function getSkeletonClasses({
  variant = SKELETON_DEFAULTS.variant,
  size = SKELETON_DEFAULTS.size,
  radius = SKELETON_DEFAULTS.radius,
  animation = SKELETON_DEFAULTS.animation,
  className = '',
  disabled = false,
  loading = true,
  circular = false,
}) {
  const variantConfig = getSkeletonVariant(variant);
  const sizeConfig = getSkeletonSize(size);
  const animationConfig = getSkeletonAnimation(animation);

  const baseClasses = mergeClasses(
    'relative overflow-hidden',
    variantConfig.background,
    sizeConfig.height,
    circular ? sizeConfig.width : 'w-full',
    getSkeletonRadius(radius),
    animationConfig.transition,
    disabled && 'opacity-50 cursor-not-allowed',
    loading ? animationConfig.animation : '',
    circular && `aspect-square ${sizeConfig.width}`,
    className,
  );

  return baseClasses;
}

/**
 * Gets container classes for skeleton wrapper.
 *
 * @param {Object} options - Container options.
 * @param {string} [options.className] - Additional classes.
 * @param {boolean} [options.disabled] - Disabled state.
 * @param {boolean} [options.loading] - Loading state.
 * @param {string} [options.orientation] - Orientation.
 * @returns {string} Merged container classes.
 */
export function getSkeletonContainerClasses({
  className = '',
  disabled = false,
  loading = false,
  orientation = 'horizontal',
}) {
  const orientationMap = {
    horizontal: 'flex flex-row',
    vertical: 'flex flex-col',
  };

  return mergeClasses(
    orientationMap[orientation] || orientationMap.horizontal,
    'gap-2',
    disabled && 'opacity-50 cursor-not-allowed',
    loading && 'opacity-70',
    className,
  );
}

/**
 * Gets text skeleton classes.
 *
 * @param {Object} options - Text options.
 * @param {string} [options.size] - Skeleton size.
 * @param {string} [options.variant] - Skeleton variant.
 * @param {string} [options.radius] - Border radius.
 * @param {string} [options.animation] - Animation type.
 * @param {string} [options.className] - Additional classes.
 * @param {boolean} [options.disabled] - Disabled state.
 * @param {boolean} [options.loading] - Loading state.
 * @param {string} [options.width] - Custom width.
 * @param {number} [options.lines] - Number of lines.
 * @returns {string} Merged text skeleton classes.
 */
export function getSkeletonTextClasses({
  size = SKELETON_DEFAULTS.size,
  variant = SKELETON_DEFAULTS.variant,
  radius = SKELETON_DEFAULTS.radius,
  animation = SKELETON_DEFAULTS.animation,
  className = '',
  disabled = false,
  loading = true,
  width = '',
  lines = 1,
}) {
  const sizeConfig = getSkeletonSize(size);
  const variantConfig = getSkeletonVariant(variant);
  const animationConfig = getSkeletonAnimation(animation);

  const baseClasses = mergeClasses(
    'relative overflow-hidden',
    variantConfig.background,
    sizeConfig.height,
    width || 'w-full',
    getSkeletonRadius(radius),
    animationConfig.transition,
    disabled && 'opacity-50 cursor-not-allowed',
    loading ? animationConfig.animation : '',
    className,
  );

  if (lines > 1) {
    const lineClasses = [];
    for (let i = 0; i < lines; i++) {
      const lineWidth = i === lines - 1 ? 'w-3/4' : 'w-full';
      lineClasses.push(
        mergeClasses(
          baseClasses,
          lineWidth,
          i < lines - 1 && 'mb-2',
        ),
      );
    }
    return lineClasses.join(' ');
  }

  return baseClasses;
}

/**
 * Gets avatar skeleton classes.
 *
 * @param {Object} options - Avatar options.
 * @param {string} [options.size] - Skeleton size.
 * @param {string} [options.variant] - Skeleton variant.
 * @param {string} [options.radius] - Border radius.
 * @param {string} [options.animation] - Animation type.
 * @param {string} [options.className] - Additional classes.
 * @param {boolean} [options.disabled] - Disabled state.
 * @param {boolean} [options.loading] - Loading state.
 * @param {string} [options.dimension] - Custom dimension.
 * @returns {string} Merged avatar skeleton classes.
 */
export function getSkeletonAvatarClasses({
  size = SKELETON_DEFAULTS.size,
  variant = SKELETON_DEFAULTS.variant,
  radius = SKELETON_DEFAULTS.radius,
  animation = SKELETON_DEFAULTS.animation,
  className = '',
  disabled = false,
  loading = true,
  dimension = '',
}) {
  const sizeConfig = getSkeletonSize(size);
  const variantConfig = getSkeletonVariant(variant);
  const animationConfig = getSkeletonAnimation(animation);

  return mergeClasses(
    'relative overflow-hidden shrink-0',
    variantConfig.background,
    dimension || sizeConfig.width,
    dimension || sizeConfig.height,
    getSkeletonRadius('full'),
    animationConfig.transition,
    disabled && 'opacity-50 cursor-not-allowed',
    loading ? animationConfig.animation : '',
    'aspect-square',
    className,
  );
}

/**
 * Gets card skeleton classes.
 *
 * @param {Object} options - Card options.
 * @param {string} [options.size] - Skeleton size.
 * @param {string} [options.variant] - Skeleton variant.
 * @param {string} [options.radius] - Border radius.
 * @param {string} [options.animation] - Animation type.
 * @param {string} [options.className] - Additional classes.
 * @param {boolean} [options.disabled] - Disabled state.
 * @param {boolean} [options.loading] - Loading state.
 * @param {number} [options.lines] - Number of text lines.
 * @param {boolean} [options.showImage] - Show image placeholder.
 * @param {boolean} [options.showAvatar] - Show avatar placeholder.
 * @returns {string} Merged card skeleton classes.
 */
export function getSkeletonCardClasses({
  size = SKELETON_DEFAULTS.size,
  variant = SKELETON_DEFAULTS.variant,
  radius = SKELETON_DEFAULTS.radius,
  animation = SKELETON_DEFAULTS.animation,
  className = '',
  disabled = false,
  loading = true,
  lines = 3,
  showImage = true,
  showAvatar = false,
}) {
  const sizeConfig = getSkeletonSize(size);
  const variantConfig = getSkeletonVariant(variant);
  const animationConfig = getSkeletonAnimation(animation);

  const cardClasses = mergeClasses(
    'relative overflow-hidden flex flex-col',
    variantConfig.background,
    getSkeletonRadius(radius),
    'p-4',
    sizeConfig.gap,
    animationConfig.transition,
    disabled && 'opacity-50 cursor-not-allowed',
    loading ? animationConfig.animation : '',
    className,
  );

  const imageHeight = showImage ? 'h-32 w-full' : '';
  const avatarClasses = showAvatar ? 'h-10 w-10 rounded-full' : '';

  const contentLines = [];
  for (let i = 0; i < lines; i++) {
    const lineWidth = i === lines - 1 ? 'w-3/4' : 'w-full';
    contentLines.push(
      mergeClasses(
        'h-3 bg-gray-200 dark:bg-gray-700 rounded',
        lineWidth,
        i < lines - 1 && 'mb-2',
      ),
    );
  }

  return {
    container: cardClasses,
    image: imageHeight,
    avatar: avatarClasses,
    content: contentLines.join(' '),
  };
}

/* ---------------------------------- */
/* Validation Utilities               */
/* ---------------------------------- */

/**
 * Validates if a variant is valid.
 *
 * @param {string} variant - The variant to check.
 * @returns {boolean} True if valid.
 */
export function isValidVariant(variant) {
  return variant ? Object.keys(SKELETON_VARIANTS).includes(variant) : false;
}

/**
 * Validates if a size is valid.
 *
 * @param {string} size - The size to check.
 * @returns {boolean} True if valid.
 */
export function isValidSize(size) {
  return size ? Object.keys(SKELETON_SIZES).includes(size) : false;
}

/**
 * Validates if a radius is valid.
 *
 * @param {string} radius - The radius to check.
 * @returns {boolean} True if valid.
 */
export function isValidRadius(radius) {
  return radius ? Object.keys(SKELETON_RADIUS).includes(radius) : false;
}

/* ---------------------------------- */
/* Accessibility Helpers              */
/* ---------------------------------- */

/**
 * Generates accessibility helpers for skeleton components.
 *
 * @param {Object} state - Component state.
 * @param {string} [state.label] - Skeleton label.
 * @param {boolean} [state.disabled] - Disabled state.
 * @param {boolean} [state.loading] - Loading state.
 * @returns {Object} Accessibility helper functions.
 */
export function getAccessibilityHelpers({
  label = '',
  disabled = false,
  loading = true,
}) {
  return {
    getRole: () => 'progressbar',
    getAriaLabel: () => label || 'Loading',
    getAriaDisabled: () => disabled || undefined,
    getAriaBusy: () => loading || undefined,
    getAriaValuenow: () => undefined,
    getAriaValuemin: () => 0,
    getAriaValuemax: () => 100,
    getTabIndex: () => (disabled ? -1 : 0),
  };
}

/* ---------------------------------- */
/* Re-exported Utilities              */
/* ---------------------------------- */

// Re-export token utilities for convenience
export {
  getSkeletonVariant,
  getSkeletonSize,
  getSkeletonRadius,
  getSkeletonAnimation,
};