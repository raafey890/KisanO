/**
 * KisanO Design System — Switch Package
 * Public API entry point.
 *
 * Exports all components, utilities, and design tokens for the Switch package.
 * Supports tree shaking and named imports.
 *
 * @module components/ui/Switch
 */

/* ---------------------------------- */
/* Re-export all design tokens        */
/* ---------------------------------- */

export {
  SWITCH_VARIANTS,
  SWITCH_SIZES,
  SWITCH_RADIUS,
  SWITCH_SHADOWS,
  SWITCH_STATES,
  SWITCH_THUMB_SIZES,
  SWITCH_DEFAULTS,
  getSwitchVariant,
  getSwitchSize,
  getSwitchRadius,
  getSwitchShadow,
  getSwitchState,
  getSwitchThumbSize,
} from './switchVariants';

/* ---------------------------------- */
/* Re-export utilities                */
/* ---------------------------------- */

export {
  mergeClasses,
  resolveResponsiveClasses,
  resolveDefaultProps,
  getSwitchClasses,
  getSwitchContainerClasses,
  getSwitchThumbClasses,
  getSwitchLabelClasses,
  isValidVariant,
  isValidSize,
  isValidRadius,
  isValidShadow,
  isInteractiveSwitch,
  getAccessibilityHelpers,
} from './switchUtils';

/* ---------------------------------- */
/* Re-export components               */
/* ---------------------------------- */

export { default as Switch } from './Switch';
export { default as SwitchContainer } from './SwitchContainer';
export { default as SwitchThumb } from './SwitchThumb';
export { default as SwitchLabel } from './SwitchLabel';
export { default as SwitchLoader } from './SwitchLoader';

/* ---------------------------------- */
/* Default export                     */
/* ---------------------------------- */

export { default } from './Switch';