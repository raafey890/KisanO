/**
 * KisanO Design System — Checkbox Package
 * Public API entry point.
 *
 * Exports all components, utilities, and design tokens for the Checkbox package.
 * Supports tree shaking and named imports.
 *
 * @module components/ui/Checkbox
 */

/* ---------------------------------- */
/* Re-export all design tokens        */
/* ---------------------------------- */

export {
  CHECKBOX_VARIANTS,
  CHECKBOX_SIZES,
  CHECKBOX_RADIUS,
  CHECKBOX_SHADOWS,
  CHECKBOX_STATES,
  CHECKBOX_ICON_SIZES,
  CHECKBOX_DEFAULTS,
  getCheckboxVariant,
  getCheckboxSize,
  getCheckboxRadius,
  getCheckboxShadow,
  getCheckboxState,
  getCheckboxIconSize,
} from './checkboxVariants';

/* ---------------------------------- */
/* Re-export utilities                */
/* ---------------------------------- */

export {
  mergeClasses,
  resolveResponsiveClasses,
  resolveDefaultProps,
  getCheckboxClasses,
  getCheckboxContainerClasses,
  getCheckboxLabelClasses,
  getCheckboxIndicatorClasses,
  isValidVariant,
  isValidSize,
  isValidRadius,
  isValidShadow,
  isInteractiveCheckbox,
  getAccessibilityHelpers,
} from './checkboxUtils';

/* ---------------------------------- */
/* Re-export components               */
/* ---------------------------------- */

export { default as Checkbox } from './Checkbox';
export { default as CheckboxGroup } from './CheckboxGroup';
export { default as CheckboxContainer } from './CheckboxContainer';
export { default as CheckboxLabel } from './CheckboxLabel';
export { default as CheckboxIndicator } from './CheckboxIndicator';
export { default as CheckboxLoader } from './CheckboxLoader';

/* ---------------------------------- */
/* Default export                     */
/* ---------------------------------- */

export { default } from './Checkbox';