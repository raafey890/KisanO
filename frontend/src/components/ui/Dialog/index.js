/**
 * KisanO Design System — Dialog Package
 * Public API entry point.
 *
 * Exports all components, utilities, and design tokens for the Dialog package.
 * Supports tree shaking and named imports.
 *
 * @module components/ui/Dialog
 */

/* ---------------------------------- */
/* Re-export all design tokens        */
/* ---------------------------------- */

export {
  DIALOG_VARIANTS,
  DIALOG_SIZES,
  DIALOG_RADIUS,
  DIALOG_SHADOWS,
  DIALOG_ANIMATIONS,
  DIALOG_OVERLAYS,
  DIALOG_DEFAULTS,
  getDialogVariant,
  getDialogSize,
  getDialogRadius,
  getDialogShadow,
  getDialogAnimation,
  getDialogOverlay,
} from './dialogVariants';

/* ---------------------------------- */
/* Re-export utilities                */
/* ---------------------------------- */

export {
  mergeClasses,
  resolveResponsiveClasses,
  resolveDefaultProps,
  getDialogClasses,
  getDialogContainerClasses,
  getDialogOverlayClasses,
  getDialogContentClasses,
  getDialogHeaderClasses,
  getDialogBodyClasses,
  getDialogFooterClasses,
  getDialogCloseButtonClasses,
  isValidVariant,
  isValidSize,
  isValidRadius,
  isValidShadow,
  isValidAnimation,
  isValidOverlay,
  isInteractiveDialog,
  getAccessibilityHelpers,
} from './dialogUtils';

/* ---------------------------------- */
/* Re-export components               */
/* ---------------------------------- */

export { default as Dialog } from './Dialog';
export { default as DialogContainer } from './DialogContainer';
export { default as DialogHeader } from './DialogHeader';
export { default as DialogBody } from './DialogBody';
export { default as DialogFooter } from './DialogFooter';
export { default as DialogCloseButton } from './DialogCloseButton';
export { default as DialogLoader } from './DialogLoader';

/* ---------------------------------- */
/* Default export                     */
/* ---------------------------------- */

export { default } from './Dialog';