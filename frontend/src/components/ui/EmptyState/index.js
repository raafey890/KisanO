/**
 * KisanO Design System — EmptyState Package
 * Public API entry point.
 *
 * Exports all components, utilities, and design tokens for the EmptyState package.
 * Supports tree shaking and named imports.
 *
 * @module components/ui/EmptyState
 */

/* ---------------------------------- */
/* Re-export all design tokens        */
/* ---------------------------------- */

export {
  EMPTYSTATE_VARIANTS,
  EMPTYSTATE_SIZES,
  EMPTYSTATE_RADIUS,
  EMPTYSTATE_ALIGNMENTS,
  EMPTYSTATE_DEFAULTS,
  getEmptyStateVariant,
  getEmptyStateSize,
  getEmptyStateRadius,
  getEmptyStateAlignment,
} from './emptyStateVariants';

/* ---------------------------------- */
/* Re-export utilities                */
/* ---------------------------------- */

export {
  mergeClasses,
  resolveResponsiveClasses,
  resolveDefaultProps,
  getEmptyStateClasses,
  getEmptyStateContainerClasses,
  getEmptyStateIconClasses,
  getEmptyStateTitleClasses,
  getEmptyStateDescriptionClasses,
  getEmptyStateActionClasses,
  isValidVariant,
  isValidSize,
  isValidRadius,
  isValidAlignment,
  getAccessibilityHelpers,
} from './emptyStateUtils';

/* ---------------------------------- */
/* Re-export components               */
/* ---------------------------------- */

export { default as EmptyState } from './EmptyState';
export { default as EmptyStateContainer } from './EmptyStateContainer';
export { default as EmptyStateIcon } from './EmptyStateIcon';
export { default as EmptyStateTitle } from './EmptyStateTitle';
export { default as EmptyStateDescription } from './EmptyStateDescription';
export { default as EmptyStateAction } from './EmptyStateAction';
export { default as EmptyStateLoader } from './EmptyStateLoader';

/* ---------------------------------- */
/* Default export                     */
/* ---------------------------------- */

export { default } from './EmptyState';