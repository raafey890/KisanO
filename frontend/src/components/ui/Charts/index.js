/**
 * KisanO Design System — Chart Package
 * Public API entry point.
 *
 * Exports all components, utilities, and design tokens for the Chart package.
 * Supports tree shaking and named imports.
 *
 * @module components/ui/Chart
 */

/* ---------------------------------- */
/* Re-export all design tokens        */
/* ---------------------------------- */

export {
  CHART_VARIANTS,
  CHART_SIZES,
  CHART_COLORS,
  CHART_ANIMATIONS,
  CHART_DEFAULTS,
  getChartVariant,
  getChartSize,
  getChartColor,
  getChartAnimation,
} from './chartVariants';

/* ---------------------------------- */
/* Re-export utilities                */
/* ---------------------------------- */

export {
  mergeClasses,
  resolveResponsiveClasses,
  resolveDefaultProps,
  getChartClasses,
  getChartContainerClasses,
  getLegendClasses,
  getTooltipClasses,
  isValidVariant,
  isValidSize,
  isValidColor,
  getAccessibilityHelpers,
} from './chartUtils';

/* ---------------------------------- */
/* Re-export components               */
/* ---------------------------------- */

export { default as Chart } from './Chart';
export { default as ChartContainer } from './ChartContainer';
export { default as LineChart } from './LineChart';
export { default as BarChart } from './BarChart';
export { default as PieChart } from './PieChart';
export { default as AreaChart } from './AreaChart';
export { default as ChartLegend } from './ChartLegend';
export { default as ChartTooltip } from './ChartTooltip';
export { default as ChartLoader } from './ChartLoader';

/* ---------------------------------- */
/* Default export                     */
/* ---------------------------------- */

export { default } from './Chart';