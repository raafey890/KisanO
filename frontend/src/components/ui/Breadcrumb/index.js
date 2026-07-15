/**
 * KisanO Design System — Breadcrumb Package
 * Public API entry point.
 *
 * Exports all components, utilities, and design tokens for the Breadcrumb package.
 * Supports tree shaking and named imports.
 *
 * @module components/ui/Breadcrumb
 */

/* ---------------------------------- */
/* Re-export all design tokens        */
/* ---------------------------------- */

export {
  BREADCRUMB_VARIANTS,
  BREADCRUMB_SIZES,
  BREADCRUMB_SEPARATORS,
  BREADCRUMB_DEFAULTS,
  getBreadcrumbVariant,
  getBreadcrumbSize,
  getBreadcrumbSeparator,
} from './breadcrumbVariants';

/* ---------------------------------- */
/* Re-export utilities                */
/* ---------------------------------- */

export {
  mergeClasses,
  resolveResponsiveClasses,
  resolveDefaultProps,
  getBreadcrumbClasses,
  getBreadcrumbContainerClasses,
  getBreadcrumbItemClasses,
  getBreadcrumbLinkClasses,
  getBreadcrumbSeparatorClasses,
  isValidVariant,
  isValidSize,
  isValidSeparator,
  getAccessibilityHelpers,
} from './breadcrumbUtils';

/* ---------------------------------- */
/* Re-export components               */
/* ---------------------------------- */

export { default as Breadcrumb } from './Breadcrumb';
export { default as BreadcrumbContainer } from './BreadcrumbContainer';
export { default as BreadcrumbItem } from './BreadcrumbItem';
export { default as BreadcrumbSeparator } from './BreadcrumbSeparator';
export { default as BreadcrumbLink } from './BreadcrumbLink';
export { default as BreadcrumbLoader } from './BreadcrumbLoader';

/* ---------------------------------- */
/* Default export                     */
/* ---------------------------------- */

export { default } from './Breadcrumb';