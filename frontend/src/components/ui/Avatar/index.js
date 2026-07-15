/**
 * KisanO Design System — Avatar Package
 * Public API entry point.
 *
 * Exports all components, utilities, and design tokens for the Avatar package.
 * Supports tree shaking and named imports.
 *
 * @module components/ui/Avatar
 */

/* ---------------------------------- */
/* Re-export all design tokens        */
/* ---------------------------------- */

export {
  AVATAR_VARIANTS,
  AVATAR_SIZES,
  AVATAR_RADIUS,
  AVATAR_STATUS,
  AVATAR_GROUP,
  AVATAR_DEFAULTS,
  getAvatarVariant,
  getAvatarSize,
  getAvatarRadius,
  getAvatarStatus,
  getAvatarGroup,
} from './avatarVariants';

/* ---------------------------------- */
/* Re-export utilities                */
/* ---------------------------------- */

export {
  mergeClasses,
  resolveResponsiveClasses,
  resolveDefaultProps,
  getAvatarClasses,
  getAvatarContainerClasses,
  getAvatarImageClasses,
  getAvatarFallbackClasses,
  getAvatarStatusClasses,
  getAvatarGroupClasses,
  isValidVariant,
  isValidSize,
  isValidRadius,
  isValidStatus,
  getAccessibilityHelpers,
} from './avatarUtils';

/* ---------------------------------- */
/* Re-export components               */
/* ---------------------------------- */

export { default as Avatar } from './Avatar';
export { default as AvatarContainer } from './AvatarContainer';
export { default as AvatarImage } from './AvatarImage';
export { default as AvatarFallback } from './AvatarFallback';
export { default as AvatarStatus } from './AvatarStatus';
export { default as AvatarGroup } from './AvatarGroup';
export { default as AvatarLoader } from './AvatarLoader';

/* ---------------------------------- */
/* Default export                     */
/* ---------------------------------- */

export { default } from './Avatar';