/**
 * KisanO Design System — Modal Package
 * Public API entry point.
 *
 * Exports all components, utilities, and design tokens for the Modal package.
 * Supports tree shaking and named imports.
 *
 * @module components/ui/Modal
 */

/* ---------------------------------- */
/* Re-export all design tokens        */
/* ---------------------------------- */

export {
  MODAL_VARIANTS,
  MODAL_SIZES,
  MODAL_RADIUS,
  MODAL_SHADOWS,
  MODAL_PADDING,
  MODAL_SPACING,
  MODAL_TYPOGRAPHY,
  MODAL_OVERLAY_VARIANTS,
  MODAL_TRANSITIONS,
  MODAL_CLOSE_BUTTON_SIZES,
  MODAL_CLOSE_BUTTON_ICON_SIZES,
  MODAL_CLOSE_BUTTON_VARIANTS,
  MODAL_SKELETON_HEIGHTS,
  MODAL_SKELETON_TEXT_WIDTHS,
  MODAL_DEFAULTS,
  
} from './modalVariants';

/* ---------------------------------- */
/* Re-export utilities                */
/* ---------------------------------- */

export {
  mergeClasses,
  resolveResponsiveClasses,
  resolveDefaultProps,
  getModalClasses,
  getOverlayClasses,
  isValidVariant,
  isValidSize,
  isValidRadius,
  isValidShadow,
  isValidOverlayVariant,
  isInteractiveModal,
  getAccessibilityHelpers,
} from './modalUtils';

/* ---------------------------------- */
/* Re-export components               */
/* ---------------------------------- */

export { default as Modal } from './Modal';
export { default as ModalContainer } from './ModalContainer';
export { default as ModalHeader } from './ModalHeader';
export { default as ModalBody } from './ModalBody';
export { default as ModalFooter } from './ModalFooter';
export { default as ModalCloseButton } from './ModalCloseButton';
export { default as ModalLoader } from './ModalLoader';
export { default as ModalOverlay } from './ModalOverlay';

/* ---------------------------------- */
/* Default export                     */
/* ---------------------------------- */

export { default } from './Modal';