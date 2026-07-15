/**
 * KisanO Design System — Pagination Package
 * Public API entry point.
 *
 * Exports all components, utilities, and design tokens for the Pagination package.
 * Supports tree shaking and named imports.
 *
 * @module components/ui/Pagination
 */

/* ---------------------------------- */
/* Re-export all design tokens        */
/* ---------------------------------- */

export {
  PAGINATION_VARIANTS,
  PAGINATION_SIZES,
  PAGINATION_RADIUS,
  PAGINATION_STATES,
  PAGINATION_DEFAULTS,
  getPaginationVariant,
  getPaginationSize,
  getPaginationRadius,
  getPaginationState,
} from './paginationVariants';

/* ---------------------------------- */
/* Re-export utilities                */
/* ---------------------------------- */

export {
  mergeClasses,
  resolveResponsiveClasses,
  resolveDefaultProps,
  getPaginationClasses,
  getPaginationContainerClasses,
  getPaginationItemClasses,
  getPaginationButtonClasses,
  getPaginationEllipsisClasses,
  isValidVariant,
  isValidSize,
  isValidRadius,
  getAccessibilityHelpers,
} from './paginationUtils';

/* ---------------------------------- */
/* Re-export components               */
/* ---------------------------------- */

export { default as Pagination } from './Pagination';
export { default as PaginationContainer } from './PaginationContainer';
export { default as PaginationItem } from './PaginationItem';
export { default as PaginationButton } from './PaginationButton';
export { default as PaginationEllipsis } from './PaginationEllipsis';
export { default as PaginationLoader } from './PaginationLoader';

/* ---------------------------------- */
/* Default export                     */
/* ---------------------------------- */

export { default } from './Pagination';