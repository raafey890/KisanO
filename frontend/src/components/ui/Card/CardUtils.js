/**
 * KisanO Design System — Card Package
 * Card Utilities
 *
 * Production-ready utility functions for the Card package.
 * Contains only pure utility functions based on the existing cardVariants.js tokens.
 *
 * Single Responsibility: This module only provides utility functions
 * for card styling, validation, and composition - no design tokens or React components.
 *
 * @module components/ui/Card/cardUtils
 */
import {
  CARD_VARIANTS,
  CARD_SIZES,
  CARD_RADIUS,
  CARD_PADDING,
  CARD_STATES,
  CARD_STATUS_COLORS,
  CARD_DEFAULTS,
  CARD_HOVER_EFFECTS,
  CARD_ACTIVE_EFFECTS,
  CARD_FOCUS_RING,
  CARD_GLASS_EFFECTS,
} from './cardVariants';
/* ---------------------------------- */
/* Core Utility Functions */
/* ---------------------------------- */
function mergeClasses(...classNames) {
  const seen = new Set();
  return classNames
    .flatMap((cls) => (cls ? String(cls).trim().split(/\s+/) : []))
    .filter((token) => token && !seen.has(token) && seen.add(token))
    .join(' ');
}
function getVariant(variant) {
  return CARD_VARIANTS[variant] || CARD_VARIANTS[CARD_DEFAULTS.variant];
}
function getSize(size) {
  return CARD_SIZES[size] || CARD_SIZES[CARD_DEFAULTS.size];
}
function getRadiusClasses(radius) {
  return CARD_RADIUS[radius] || CARD_RADIUS[CARD_DEFAULTS.radius];
}
function getShadowClasses(variant, isHovered = false, isActive = false) {
  const variantConfig = getVariant(variant);
  if (isActive) {
    return mergeClasses(variantConfig.background, variantConfig.shadow, 'active:shadow-lg active:scale-95');
  }
  if (isHovered) {
    return mergeClasses(variantConfig.background, variantConfig.shadow, 'hover:shadow-lg hover:-translate-y-1');
  }
  return variantConfig.shadow;
}
function getPaddingClasses(size) {
  return CARD_PADDING[size] || CARD_PADDING[CARD_DEFAULTS.padding];
}
function getHoverClasses(variant) {
  const variantConfig = getVariant(variant);
  return variantConfig.hover || '';
}
function getActiveClasses(variant) {
  const variantConfig = getVariant(variant);
  return variantConfig.active || '';
}
function getFocusClasses(variant, state = 'default') {
  if (state !== 'default') {
    const stateColors = {
      error: 'focus:ring-red-500',
      success: 'focus:ring-green-500',
      warning: 'focus:ring-yellow-500',
      info: 'focus:ring-blue-500',
      default: 'focus:ring-blue-500',
    };
    return stateColors[state] || CARD_FOCUS_RING.default;
  }
  return CARD_FOCUS_RING.default;
}
function getStatusClasses(status) {
  const statusMap = {
    default: CARD_STATES.default,
    hover: CARD_STATES.hover,
    active: CARD_STATES.active,
    loading: CARD_STATES.loading,
    error: CARD_STATES.error,
    success: CARD_STATES.success,
    warning: CARD_STATES.warning,
    disabled: CARD_STATES.disabled,
  };
  return statusMap[status] || CARD_STATES.default;
}
function getGlassClasses(glassVariant = 'default') {
  return CARD_GLASS_EFFECTS[glassVariant] || CARD_GLASS_EFFECTS.default;
}
function resolveDefaultProps({
  variant = CARD_DEFAULTS.variant,
  size = CARD_DEFAULTS.size,
  radius = CARD_DEFAULTS.radius,
  padding = CARD_DEFAULTS.padding,
  animation = CARD_DEFAULTS.animation,
  interactive = CARD_DEFAULTS.interactive,
  loading = CARD_DEFAULTS.loading,
  disabled = CARD_DEFAULTS.disabled,
}) {
  return {
    variant: CARD_VARIANTS[variant] ? variant : CARD_DEFAULTS.variant,
    size: CARD_SIZES[size] ? size : CARD_DEFAULTS.size,
    radius: CARD_RADIUS[radius] ? radius : CARD_DEFAULTS.radius,
    padding: CARD_PADDING[padding] ? padding : CARD_DEFAULTS.padding,
    animation,
    interactive,
    loading,
    disabled,
  };
}
function isInteractiveCard({ interactive = true, loading = false, disabled = false }) {
  return interactive && !loading && !disabled;
}
function isValidVariant(variant) {
  const validVariants = Object.keys(CARD_VARIANTS);
  return validVariants.includes(variant);
}
function isValidSize(size) {
  const validSizes = Object.keys(CARD_SIZES);
  return validSizes.includes(size);
}
function isValidRadius(radius) {
  const validRadii = Object.keys(CARD_RADIUS);
  return validRadii.includes(radius);
}
function isValidShadow(elevation) {
  const validElevations = [
    'none',
    'xs',
    'sm',
    'md',
    'lg',
    'xl',
    '2xl',
    'inner',
    'shadow-inner',
    'shadow-xs',
    'shadow-sm',
    'shadow-md',
    'shadow-lg',
    'shadow-xl',
    'shadow-2xl',
  ];
  return validElevations.includes(elevation);
}
function getMediaAspectRatio(aspectRatio = '1:1') {
  const aspectRatioMap = {
    '16:9': 'aspect-video',
    '4:3': 'aspect-[4/3]',
    '1:1': 'aspect-square',
    '21:9': 'aspect-[21/9]',
    '5:4': 'aspect-[5/4]',
  };
  return aspectRatioMap[aspectRatio] || aspectRatioMap['1:1'];
}
function getImageClasses({
  aspectRatio = '1:1',
  objectFit = 'cover',
  objectPosition = 'center',
} = {}) {
  const fitMap = {
    cover: 'object-cover',
    contain: 'object-contain',
    fill: 'object-fill',
    none: 'object-none',
    'scale-down': 'object-scale-down',
  };
  const positionMap = {
    left: 'object-left',
    right: 'object-right',
    top: 'object-top',
    bottom: 'object-bottom',
    center: 'object-center',
  };
  return mergeClasses(
    getMediaAspectRatio(aspectRatio),
    fitMap[objectFit] || '',
    positionMap[objectPosition] || ''
  );
}
function getBadgePosition(position = 'top-right', isFloating = false) {
  const positionMap = {
    'top-right': 'absolute top-2 right-2',
    'top-left': 'absolute top-2 left-2',
    'bottom-right': 'absolute bottom-2 right-2',
    'bottom-left': 'absolute bottom-2 left-2',
  };
  const floatingClasses = isFloating ? 'z-10 shadow-lg' : '';
  return mergeClasses(positionMap[position] || positionMap['top-right'], floatingClasses);
}
function getActionAlignment(alignment = 'left') {
  const alignmentMap = {
    left: 'justify-start',
    center: 'justify-center',
    right: 'justify-end',
    'space-between': 'justify-between',
    'space-around': 'justify-around',
  };
  return alignmentMap[alignment] || alignmentMap['left'];
}
function resolveResponsiveClasses({
  xs,
  sm,
  md,
  lg,
  xl,
} = {}) {
  return mergeClasses(
    xs ,
    sm ? `sm:${sm}` : '',
    md ? `md:${md}` : '',
    lg ? `lg:${lg}` : '',
    xl ? `xl:${xl}` : ''
  );
}
function getAccessibilityHelpers(state) {
  return {
    getRole: () => 'article',
    getAriaLabel: (title) => title ? `Card${title ? `: ${title}` : ''}` : 'Card',
    getAriaDescribedBy: (id) => id,
    getTabIndex: () => state.isInteractive ? 0 : -1,
  };
}
/* ---------------------------------- */

/* ---------------------------------- */
function getCardClasses({
  variant = CARD_DEFAULTS.variant,
  size = CARD_DEFAULTS.size,
  radius,
  elevation,
  state = 'default',
  disabled = false,
  interactive = true,
  loading = false,
  className = '',
}) {
  const variantConfig = getVariant(variant);
  const sizeConfig = getSize(size);
  const statusConfig = getStatusClasses(state);
  const hoverClasses = getHoverClasses(variant);
  const activeClasses = getActiveClasses(variant);
  const focusClasses = getFocusClasses(variant, state);
  
  return mergeClasses(
    variantConfig.background,
    variantConfig.border,
    elevation ? getShadowClasses(variant, false, false) : sizeConfig.shadow,
    sizeConfig.padding,
    sizeConfig.radius,
    variantConfig.text,
    hoverClasses,
    activeClasses,
    focusClasses,
    statusConfig.background,
    statusConfig.border,
    statusConfig.text,
    className,
    !isInteractiveCard({ interactive, loading, disabled }) && 'cursor-not-allowed opacity-60'
  );
}
export {
  mergeClasses,
  getCardClasses,
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
};
