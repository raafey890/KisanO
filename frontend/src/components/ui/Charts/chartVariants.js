/**
 * KisanO Design System — Chart Package
 * Chart Design Tokens
 *
 * Complete design token system for the KisanO Chart component family.
 * This file defines all visual states, sizes, variants, and design tokens
 * required for consistent chart styling across the KisanO application.
 *
 * Architecture principles:
 * - All exports are plain objects with string values or nested objects
 * - Objects are intended to be merged with clsx/tailwind-merge for class composition
 * - Each export covers a single dimension (size, variant, state, etc.)
 * - The `CHART_DEFAULTS` object provides sensible defaults for all dimensions
 *
 * @version 1.0.0
 * @author KisanO Team
 * @see {@link https://kisan-o.design} for full documentation.
 * @module components/ui/Chart/chartVariants
 */

/* ---------------------------------- */
/* Variants                           */
/* ---------------------------------- */

/**
 * Core visual variants of the Chart.
 * Each variant defines background, text, and border styles.
 */
export const CHART_VARIANTS = Object.freeze({
  default: {
    background: 'bg-white dark:bg-gray-900',
    text: 'text-gray-900 dark:text-gray-100',
    border: 'border border-gray-200 dark:border-gray-700',
    grid: 'stroke-gray-200 dark:stroke-gray-700',
    axis: 'stroke-gray-400 dark:stroke-gray-500',
    label: 'text-gray-600 dark:text-gray-400',
  },
  dark: {
    background: 'bg-gray-900 dark:bg-gray-950',
    text: 'text-white dark:text-gray-100',
    border: 'border border-gray-800 dark:border-gray-800',
    grid: 'stroke-gray-800 dark:stroke-gray-800',
    axis: 'stroke-gray-600 dark:stroke-gray-600',
    label: 'text-gray-400 dark:text-gray-400',
  },
  glass: {
    background: 'bg-white/80 backdrop-blur-md dark:bg-gray-900/80',
    text: 'text-gray-900 dark:text-gray-100',
    border: 'border border-white/20 dark:border-gray-700/50',
    grid: 'stroke-gray-200 dark:stroke-gray-700',
    axis: 'stroke-gray-400 dark:stroke-gray-500',
    label: 'text-gray-600 dark:text-gray-400',
  },
  minimal: {
    background: 'bg-transparent',
    text: 'text-gray-900 dark:text-gray-100',
    border: 'border border-transparent',
    grid: 'stroke-gray-200 dark:stroke-gray-700',
    axis: 'stroke-gray-400 dark:stroke-gray-500',
    label: 'text-gray-600 dark:text-gray-400',
  },
});

/* ---------------------------------- */
/* Sizes                              */
/* ---------------------------------- */

/**
 * Size presets for Charts.
 * Each size defines dimensions and padding.
 */
export const CHART_SIZES = Object.freeze({
  xs: {
    height: 'h-40',
    width: 'w-full',
    padding: 'p-2',
    gap: 'gap-1',
    text: 'text-xs',
  },
  sm: {
    height: 'h-52',
    width: 'w-full',
    padding: 'p-3',
    gap: 'gap-1.5',
    text: 'text-sm',
  },
  md: {
    height: 'h-64',
    width: 'w-full',
    padding: 'p-4',
    gap: 'gap-2',
    text: 'text-sm',
  },
  lg: {
    height: 'h-80',
    width: 'w-full',
    padding: 'p-5',
    gap: 'gap-2.5',
    text: 'text-base',
  },
  xl: {
    height: 'h-96',
    width: 'w-full',
    padding: 'p-6',
    gap: 'gap-3',
    text: 'text-base',
  },
});

/* ---------------------------------- */
/* Colors                             */
/* ---------------------------------- */

/**
 * Color presets for Charts.
 * Defines color palettes for chart elements.
 */
export const CHART_COLORS = Object.freeze({
  default: {
    primary: '#3B82F6',
    secondary: '#6B7280',
    success: '#22C55E',
    warning: '#EAB308',
    error: '#EF4444',
    info: '#06B6D4',
    purple: '#8B5CF6',
    pink: '#EC4899',
  },
  pastel: {
    primary: '#93C5FD',
    secondary: '#D1D5DB',
    success: '#86EFAC',
    warning: '#FDE047',
    error: '#FCA5A5',
    info: '#67E8F9',
    purple: '#C4B5FD',
    pink: '#F9A8D4',
  },
  vibrant: {
    primary: '#2563EB',
    secondary: '#4B5563',
    success: '#16A34A',
    warning: '#CA8A04',
    error: '#DC2626',
    info: '#0891B2',
    purple: '#7C3AED',
    pink: '#DB2777',
  },
  dark: {
    primary: '#60A5FA',
    secondary: '#9CA3AF',
    success: '#4ADE80',
    warning: '#FDE047',
    error: '#F87171',
    info: '#67E8F9',
    purple: '#A78BFA',
    pink: '#F472B6',
  },
  gradient: {
    primary: 'url(#primaryGradient)',
    secondary: 'url(#secondaryGradient)',
    success: 'url(#successGradient)',
    warning: 'url(#warningGradient)',
    error: 'url(#errorGradient)',
    info: 'url(#infoGradient)',
    purple: 'url(#purpleGradient)',
    pink: 'url(#pinkGradient)',
  },
});

/* ---------------------------------- */
/* Animations                         */
/* ---------------------------------- */

/**
 * Animation presets for Charts.
 * Defines animation types and configurations.
 */
export const CHART_ANIMATIONS = Object.freeze({
  grow: {
    animation: 'animate-chart-grow',
    transition: 'transition-all duration-700 ease-out',
  },
  fade: {
    animation: 'animate-chart-fade',
    transition: 'transition-opacity duration-500 ease-in',
  },
  slide: {
    animation: 'animate-chart-slide',
    transition: 'transition-transform duration-600 ease-out',
  },
  scale: {
    animation: 'animate-chart-scale',
    transition: 'transition-transform duration-500 ease-in-out',
  },
  none: {
    animation: '',
    transition: 'transition-none',
  },
});

/* ---------------------------------- */
/* Defaults                           */
/* ---------------------------------- */

/**
 * Default values for all Chart dimensions.
 */
export const CHART_DEFAULTS = Object.freeze({
  variant: 'default',
  size: 'md',
  colors: 'default',
  animation: 'grow',
  responsive: true,
  loading: false,
  disabled: false,
});

/* ---------------------------------- */
/* Helper Functions                   */
/* ---------------------------------- */

/**
 * Gets the variant configuration for a chart.
 * @param {string} variant - The variant key.
 * @returns {Object} The variant configuration.
 */
export function getChartVariant(variant) {
  return CHART_VARIANTS[variant] || CHART_VARIANTS[CHART_DEFAULTS.variant];
}

/**
 * Gets the size configuration for a chart.
 * @param {string} size - The size key.
 * @returns {Object} The size configuration.
 */
export function getChartSize(size) {
  return CHART_SIZES[size] || CHART_SIZES[CHART_DEFAULTS.size];
}

/**
 * Gets the color configuration for a chart.
 * @param {string} colors - The color key.
 * @returns {Object} The color configuration.
 */
export function getChartColor(colors) {
  return CHART_COLORS[colors] || CHART_COLORS[CHART_DEFAULTS.colors];
}

/**
 * Gets the animation configuration for a chart.
 * @param {string} animation - The animation key.
 * @returns {Object} The animation configuration.
 */
export function getChartAnimation(animation) {
  return CHART_ANIMATIONS[animation] || CHART_ANIMATIONS[CHART_DEFAULTS.animation];
}