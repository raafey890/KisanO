/**
 * KisanO Design System — Skeleton Package
 * Public API entry point.
 *
 * Exports all components, utilities, and design tokens for the Skeleton package.
 * Supports tree shaking and named imports.
 *
 * @module components/ui/Skeleton
 */

/* ---------------------------------- */
/* Re-export all design tokens        */
/* ---------------------------------- */

export {
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
/* Re-export utilities                */
/* ---------------------------------- */

export {
  mergeClasses,
  resolveResponsiveClasses,
  resolveDefaultProps,
  getSkeletonClasses,
  getSkeletonContainerClasses,
  getSkeletonTextClasses,
  getSkeletonAvatarClasses,
  getSkeletonCardClasses,
  isValidVariant,
  isValidSize,
  isValidRadius,
  getAccessibilityHelpers,
} from './skeletonUtils';

/* ---------------------------------- */
/* Re-export components               */
/* ---------------------------------- */

export { default as Skeleton } from './Skeleton';
export { default as SkeletonContainer } from './SkeletonContainer';
export { default as SkeletonText } from './SkeletonText';
export { default as SkeletonAvatar } from './SkeletonAvatar';
export { default as SkeletonCard } from './SkeletonCard';
export { default as SkeletonLoader } from './SkeletonLoader';

/* ---------------------------------- */
/* Default export                     */
/* ---------------------------------- */

export { default } from './Skeleton';