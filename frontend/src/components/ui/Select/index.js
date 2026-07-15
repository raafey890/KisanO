/**
 * KisanO Design System — Select Package
 * Public API entry point.
 *
 * Exports all components, utilities, and design tokens for the Select package.
 * Supports tree shaking and named imports.
 *
 * @module components/ui/Select
 */

/* ---------------------------------- */
/* Re-export all design tokens        */
/* ---------------------------------- */

export {
  SELECT_VARIANTS,
  SELECT_SIZES,
  SELECT_RADIUS,
  SELECT_SHADOWS,
  SELECT_POSITIONS,
  SELECT_ANIMATIONS,
  SELECT_DEFAULTS,
  getSelectVariant,
  getSelectSize,
  getSelectRadius,
  getSelectShadow,
  getSelectPosition,
  getSelectAnimation,
} from './selectVariants';

/* ---------------------------------- */
/* Re-export utilities                */
/* ---------------------------------- */

export {
  mergeClasses,
  resolveResponsiveClasses,
  resolveDefaultProps,
  getSelectClasses,
  getSelectContainerClasses,
  getSelectTriggerClasses,
  getSelectMenuClasses,
  getSelectOptionClasses,
  getSelectSearchClasses,
  getSelectLabelClasses,
  getSelectEmptyClasses,
  getSelectGroupClasses,
  isValidVariant,
  isValidSize,
  isValidRadius,
  isValidShadow,
  isValidPosition,
  isValidAnimation,
  isInteractiveSelect,
  shouldCloseOnSelect,
  shouldCloseOnOutsideClick,
  shouldCloseOnEscape,
  getAccessibilityHelpers,
} from './selectUtils';

/* ---------------------------------- */
/* Re-export components               */
/* ---------------------------------- */

export { default as Select } from './Select';
export { default as SelectContainer } from './SelectContainer';
export { default as SelectTrigger } from './SelectTrigger';
export { default as SelectMenu } from './SelectMenu';
export { default as SelectOption } from './SelectOption';
export { default as SelectSearch } from './SelectSearch';
export { default as SelectLabel } from './SelectLabel';
export { default as SelectLoader } from './SelectLoader';
export { default as SelectPortal } from './SelectPortal';

/* ---------------------------------- */
/* Default export                     */
/* ---------------------------------- */

export { default } from './Select';