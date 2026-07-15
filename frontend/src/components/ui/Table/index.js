/**
 * KisanO Design System — Table Package
 * Public API entry point.
 *
 * Exports all components, utilities, and design tokens for the Table package.
 * Supports tree shaking and named imports.
 *
 * @module components/ui/Table
 */

/* ---------------------------------- */
/* Re-export all design tokens        */
/* ---------------------------------- */

export {
  TABLE_VARIANTS,
  TABLE_SIZES,
  TABLE_RADIUS,
  TABLE_SHADOWS,
  TABLE_STRIPES,
  TABLE_DEFAULTS,
  getTableVariant,
  getTableSize,
  getTableRadius,
  getTableShadow,
  getTableStripe,
} from './tableVariants';

/* ---------------------------------- */
/* Re-export utilities                */
/* ---------------------------------- */

export {
  mergeClasses,
  resolveResponsiveClasses,
  resolveDefaultProps,
  getTableClasses,
  getTableContainerClasses,
  getTableHeaderClasses,
  getTableBodyClasses,
  getTableRowClasses,
  getTableCellClasses,
  isValidVariant,
  isValidSize,
  isValidRadius,
  getAccessibilityHelpers,
} from './tableUtils';

/* ---------------------------------- */
/* Re-export components               */
/* ---------------------------------- */

export { default as Table } from './Table';
export { default as TableContainer } from './TableContainer';
export { default as TableHeader } from './TableHeader';
export { default as TableBody } from './TableBody';
export { default as TableRow } from './TableRow';
export { default as TableCell } from './TableCell';
export { default as TableLoader } from './TableLoader';

/* ---------------------------------- */
/* Default export                     */
/* ---------------------------------- */

export { default } from './Table';