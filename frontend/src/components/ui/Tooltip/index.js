/**
 * KisanO Design System — Tooltip Package
 * Public API entry point.
 *
 * Exports all components, utilities, and design tokens for the Tooltip package.
 * Supports tree shaking and named imports.
 *
 * @module components/ui/Tooltip
 */

/* ---------------------------------- */
/* Re-export all design tokens        */
/* ---------------------------------- */

export {
  TOOLTIP_VARIANTS,
  TOOLTIP_SIZES,
  TOOLTIP_RADIUS,
  TOOLTIP_SHADOWS,
  TOOLTIP_POSITIONS,
  TOOLTIP_ARROW_SIZES,
  TOOLTIP_ARROW_OFFSETS,
  TOOLTIP_TRANSITIONS,
  TOOLTIP_DEFAULTS,
  getTooltipVariant,
  getTooltipSize,
  getTooltipRadius,
  getTooltipShadow,
  getTooltipPosition,
  getTooltipArrowSize,
  getTooltipArrowOffset,
} from './tooltipVariants';

/* ---------------------------------- */
/* Re-export utilities                */
/* ---------------------------------- */

export {
  mergeClasses,
  resolveResponsiveClasses,
  resolveDefaultProps,
  getTooltipClasses,
  getTooltipContainerClasses,
  getTooltipArrowClasses,
  isValidVariant,
  isValidSize,
  isValidRadius,
  isValidShadow,
  isValidPosition,
  isValidArrowSize,
  isInteractiveTooltip,
  getAccessibilityHelpers,
} from './tooltipUtils';

/* ---------------------------------- */
/* Re-export components               */
/* ---------------------------------- */

export { default as Tooltip } from './Tooltip';
export { default as TooltipContainer } from './TooltipContainer';
export { default as TooltipTrigger } from './TooltipTrigger';
export { default as TooltipContent } from './TooltipContent';
export { default as TooltipArrow } from './TooltipArrow';
export { default as TooltipLoader } from './TooltipLoader';
export { default as TooltipPortal } from './TooltipPortal';

/* ---------------------------------- */
/* Default export                     */
/* ---------------------------------- */

export { default } from './Tooltip';