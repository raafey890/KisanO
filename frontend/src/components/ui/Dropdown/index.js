/**
 * KisanO Design System — Dropdown Package
 * Public API entry point.
 *
 * Exports all components, utilities, and design tokens for the Dropdown package.
 * Supports tree shaking and named imports.
 *
 * @module components/ui/Dropdown
 */

/* ---------------------------------- */
/* Re-export all design tokens        */
/* ---------------------------------- */

export {
  DROPDOWN_VARIANTS,
  DROPDOWN_SIZES,
  DROPDOWN_RADIUS,
  DROPDOWN_SHADOWS,
  DROPDOWN_POSITIONS,
  DROPDOWN_ANIMATIONS,
  DROPDOWN_ITEM_STATES,
  DROPDOWN_DEFAULTS,
  getDropdownVariant,
  getDropdownSize,
  getDropdownRadius,
  getDropdownShadow,
  getDropdownPosition,
  getDropdownAnimation,
} from './dropdownVariants';

/* ---------------------------------- */
/* Re-export utilities                */
/* ---------------------------------- */

export {
  mergeClasses,
  resolveResponsiveClasses,
  resolveDefaultProps,
  getDropdownClasses,
  getDropdownContainerClasses,
  getDropdownTriggerClasses,
  getDropdownMenuClasses,
  getDropdownItemClasses,
  getDropdownDividerClasses,
  getDropdownGroupClasses,
  getDropdownLabelClasses,
  isValidVariant,
  isValidSize,
  isValidRadius,
  isValidShadow,
  isValidPosition,
  isValidAnimation,
  isInteractiveDropdown,
  shouldCloseOnSelect,
  shouldCloseOnOutsideClick,
  shouldCloseOnEscape,
  getAccessibilityHelpers,
} from './dropdownUtils';

/* ---------------------------------- */
/* Re-export components               */
/* ---------------------------------- */

export { default as Dropdown } from './Dropdown';
export { default as DropdownContainer } from './DropdownContainer';
export { default as DropdownTrigger } from './DropdownTrigger';
export { default as DropdownMenu } from './DropdownMenu';
export { default as DropdownItem } from './DropdownItem';
export { default as DropdownGroup } from './DropdownGroup';
export { default as DropdownDivider } from './DropdownDivider';
export { default as DropdownLabel } from './DropdownLabel';
export { default as DropdownLoader } from './DropdownLoader';
export { default as DropdownPortal } from './DropdownPortal';

/* ---------------------------------- */
/* Default export                     */
/* ---------------------------------- */

export { default } from './Dropdown';