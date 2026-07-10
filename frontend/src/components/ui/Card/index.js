/**
 * KisanO Design System — Card Package
 * Public API entry point.
 *
 * Exports all components, utilities, and design tokens for the Card package.
 * Supports tree shaking and named imports.
 *
 * @module components/ui/Card
 */

/* ---------------------------------- */
/* Re-export all design tokens        */
/* ---------------------------------- */

export {
  CARD_VARIANTS,
  CARD_SIZES,
  CARD_RADIUS,
  CARD_SHADOWS,
  CARD_COLORS,
  CARD_GRADIENTS,
  CARD_TRANSITIONS,
  CARD_ELEVATION,
  CARD_HOVER_EFFECTS,
  CARD_ACTIVE_EFFECTS,
  CARD_FOCUS_RING,
  CARD_PADDING,
  CARD_TYPOGRAPHY,
  CARD_BORDERS,
  CARD_STATES,
  CARD_STATUS_COLORS,
  CARD_GLASS_EFFECTS,
  CARD_ICONS,
  CARD_DEFAULTS,
  CARD_THEME,
  getCardStatusColor,
  getCardElevationLevel,
  // Renamed to avoid conflict with the main getCardClasses from cardUtils
  getCardClasses as getCardVariantClasses,
} from './cardVariants';

/* ---------------------------------- */
/* Re-export utilities                */
/* ---------------------------------- */

export {
  mergeClasses,
  getVariant,
  getSize,
  getRadiusClasses,
  getShadowClasses,
  getPaddingClasses,
  getHoverClasses,
  getActiveClasses,
  getFocusClasses,
  getStatusClasses,
  getGlassClasses,
  resolveDefaultProps,
  isInteractiveCard,
  isValidVariant,
  isValidSize,
  isValidRadius,
  isValidShadow,
  getMediaAspectRatio,
  getImageClasses,
  getBadgePosition,
  getActionAlignment,
  resolveResponsiveClasses,
  getAccessibilityHelpers,
  // Main getCardClasses (object‑based) used by CardContainer
  getCardClasses,
} from './cardUtils';

/* ---------------------------------- */
/* Re-export components               */
/* ---------------------------------- */

export { default as Card } from './Card';
export { default as CardContainer } from './CardContainer';
export { default as CardHeader } from './CardHeader';
export { default as CardBody } from './CardBody';
export { default as CardFooter } from './CardFooter';
export { default as CardMedia } from './CardMedia';
export { default as CardImage } from './CardImage';
export { default as CardBadge } from './CardBadge';
export { default as CardActions } from './CardActions';
export { default as CardLoader } from './CardLoader';

/* ---------------------------------- */
/* Default export                     */
/* ---------------------------------- */

export { default } from './Card';