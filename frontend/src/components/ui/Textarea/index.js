/**
 * KisanO Design System — Textarea Package
 * Public API entry point.
 *
 * Exports all components, utilities, and design tokens for the Textarea package.
 * Supports tree shaking and named imports.
 *
 * @module components/ui/Textarea
 */

/* ---------------------------------- */
/* Re-export all design tokens        */
/* ---------------------------------- */

export {
  TEXTAREA_VARIANTS,
  TEXTAREA_SIZES,
  TEXTAREA_RADIUS,
  TEXTAREA_SHADOWS,
  TEXTAREA_STATES,
  TEXTAREA_RESIZE_OPTIONS,
  TEXTAREA_DEFAULTS,
  getTextareaVariant,
  getTextareaSize,
  getTextareaRadius,
  getTextareaShadow,
  getTextareaState,
  getTextareaResize,
} from './textareaVariants';

/* ---------------------------------- */
/* Re-export utilities                */
/* ---------------------------------- */

export {
  mergeClasses,
  resolveResponsiveClasses,
  resolveDefaultProps,
  getTextareaClasses,
  getTextareaContainerClasses,
  getTextareaLabelClasses,
  getTextareaCounterClasses,
  isValidVariant,
  isValidSize,
  isValidRadius,
  isValidShadow,
  isValidResize,
  isInteractiveTextarea,
  getAccessibilityHelpers,
} from './textareaUtils';

/* ---------------------------------- */
/* Re-export components               */
/* ---------------------------------- */

export { default as Textarea } from './Textarea';
export { default as TextareaContainer } from './TextareaContainer';
export { default as TextareaLabel } from './TextareaLabel';
export { default as TextareaCounter } from './TextareaCounter';
export { default as TextareaLoader } from './TextareaLoader';

/* ---------------------------------- */
/* Default export                     */
/* ---------------------------------- */

export { default } from './Textarea';