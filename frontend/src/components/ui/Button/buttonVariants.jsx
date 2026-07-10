/**
 * KisanO Design System - Button Design Tokens
 * 
 * This file serves as the design token foundation for the Button package.
 * It contains all design tokens required for consistent button styling across the KisanO application.
 * 
 * @author KisanO Design System Team
 * @version 1.0.0
 * @file buttonVariants.js
 * @since 2024-07-07
 */

/**
 * KisanO Design System Color Palette
 * 
 * Centralized color definitions following KisanO's design system
 * using semantic naming and consistent color values.
 * 
 * @constant {Object} KISANO_COLORS
 */
const KISANO_COLORS = Object.freeze({
  primary: {
    50: '#eff6ff',
    100: '#dbeafe',
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8',
    800: '#1e40af',
    900: '#1e3a8a'
  },
  secondary: {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#4ade80',
    500: '#22c55e',
    600: '#16a34a',
    700: '#15803d',
    800: '#166534',
    900: '#14532d'
  },
  success: {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#4ade80',
    500: '#22c55e',
    600: '#16a34a',
    700: '#15803d',
    800: '#166534',
    900: '#14532d'
  },
  danger: {
    50: '#fef2f2',
    100: '#fee2e2',
    200: '#fecaca',
    300: '#fca5a5',
    400: '#f87171',
    500: '#ef4444',
    600: '#dc2626',
    700: '#b91c1c',
    800: '#991b1b',
    900: '#7f1d1d'
  },
  warning: {
    50: '#fefce8',
    100: '#fef3c7',
    200: '#fde68a',
    300: '#fcd34d',
    400: '#fbbf24',
    500: '#f59e0b',
    600: '#d97706',
    700: '#b45309',
    800: '#a16207',
    900: '#854d0e'
  },
  gray: {
    50: '#f8fafc',
    100: '#f1f5f9',
    200: '#e2e8f0',
    300: '#cbd5e1',
    400: '#94a3b8',
    500: '#64748b',
    600: '#475569',
    700: '#334155',
    800: '#1e293b',
    900: '#0f172a'
  }
});

/**
 * KisanO Design System Typography Tokens
 * 
 * Font definitions following KisanO's typography system
 * with consistent spacing and weighting.
 * 
 * @constant {Object} TYPOGRAPHY_TOKENS
 */
const TYPOGRAPHY_TOKENS = Object.freeze({
  fontFamily: {
    primary: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    mono: "'JetBrains Mono', 'Monaco', 'Cascadia Code', monospace"
  },
  fontSize: {
    xs: '0.75rem',
    sm: '0.875rem',
    md: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
    '3xl': '1.875rem'
  },
  fontWeight: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700'
  },
  lineHeight: {
    tight: '1.25',
    normal: '1.5',
    relaxed: '1.75'
  },
  letterSpacing: {
    tight: '-0.025em',
    normal: '0em',
    wide: '0.025em'
  }
});

/**
 * KisanO Design System Spacing Tokens
 * 
 * Semantic spacing values following KisanO's spacing system.
 * Used for consistent padding, margin, and layout.
 * 
 * @constant {Object} SPACING_TOKENS
 */
const SPACING_TOKENS = Object.freeze({
  xs: '0.25rem',
  sm: '0.5rem',
  md: '0.75rem',
  lg: '1rem',
  xl: '1.5rem',
  '2xl': '2rem',
  '3xl': '3rem',
  '4xl': '4rem'
});

/**
 * KisanO Design System Border Radius Tokens
 * 
 * Radius values following KisanO's border radius system.
 * Ensures consistent rounded corners across components.
 * 
 * @constant {Object} RADIUS_TOKENS
 */
const RADIUS_TOKENS = Object.freeze({
  none: '0',
  xs: '0.125rem',
  sm: '0.25rem',
  md: '0.375rem',
  lg: '0.5rem',
  xl: '0.75rem',
  '2xl': '1rem',
  full: '9999px'
});

/**
 * KisanO Design System Shadow Tokens
 * 
 * Shadow definitions following KisanO's elevation system.
 * Used for creating depth and visual hierarchy.
 * 
 * @constant {Object} SHADOW_TOKENS
 */
const SHADOW_TOKENS = Object.freeze({
  none: 'none',
  xs: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  sm: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)'
});

/**
 * KisanO Design System Transition Tokens
 * 
 * Animation timing definitions following KisanO's transition system.
 * Ensures smooth and consistent animations across interactions.
 * 
 * @constant {Object} TRANSITION_TOKENS
 */
const TRANSITION_TOKENS = Object.freeze({
  none: 'none',
  fast: '150ms ease-in-out',
  normal: '300ms ease-in-out',
  slow: '500ms ease-in-out'
});

/**
 * KisanO Design System Icon Size Tokens
 * 
 * Icon dimension values following KisanO's icon system.
 * Ensures consistent icon sizing across components.
 * 
 * @constant {Object} ICON_SIZE_TOKENS
 */
const ICON_SIZE_TOKENS = Object.freeze({
  xs: '0.75rem',
  sm: '1rem',
  md: '1.25rem',
  lg: '1.5rem',
  xl: '2rem',
  '2xl': '2.5rem'
});

/**
 * KisanO Design System Focus Ring Tokens
 * 
 * Focus ring styles following KisanO's accessibility system.
 * Provides consistent focus indicators for keyboard navigation.
 * 
 * @constant {Object} FOCUS_RING_TOKENS
 */
const FOCUS_RING_TOKENS = Object.freeze({
  default: {
    offset: '2px',
    width: '2px',
    color: '#3b82f6',
    style: 'solid'
  },
  success: {
    offset: '2px',
    width: '2px',
    color: '#22c55e',
    style: 'solid'
  },
  danger: {
    offset: '2px',
    width: '2px',
    color: '#ef4444',
    style: 'solid'
  }
});

/**
 * KisanO Design System Button Variants Configuration
 * 
 * Variant definitions following KisanO's button design system.
 * Each variant contains semantic Tailwind CSS classes for consistent styling.
 * 
 * @constant {Object} BUTTON_VARIANTS_CONFIG
 */
const BUTTON_VARIANTS_CONFIG = Object.freeze({
  primary: {
    backgroundColor: 'bg-primary-600',
    hoverBackgroundColor: 'bg-primary-700',
    textColor: 'text-white',
    borderColor: 'border-transparent',
    shadow: 'shadow-sm',
    hoverShadow: 'shadow-md'
  },
  secondary: {
    backgroundColor: 'bg-gray-100',
    hoverBackgroundColor: 'bg-gray-200',
    textColor: 'text-gray-900',
    borderColor: 'border-gray-300',
    shadow: 'shadow-sm',
    hoverShadow: 'shadow-none'
  },
  outline: {
    backgroundColor: 'bg-transparent',
    hoverBackgroundColor: 'bg-gray-50',
    textColor: 'text-gray-700',
    borderColor: 'border-gray-300',
    shadow: 'none',
    hoverShadow: 'shadow-sm'
  },
  ghost: {
    backgroundColor: 'bg-transparent',
    hoverBackgroundColor: 'bg-gray-100',
    textColor: 'text-gray-700',
    borderColor: 'border-transparent',
    shadow: 'none',
    hoverShadow: 'none'
  },
  gradient: {
    backgroundColor: 'bg-gradient-to-r from-primary-600 to-secondary-600',
    hoverBackgroundColor: 'bg-gradient-to-r from-primary-700 to-secondary-700',
    textColor: 'text-white',
    borderColor: 'border-transparent',
    shadow: 'shadow-sm',
    hoverShadow: 'shadow-md'
  },
  success: {
    backgroundColor: 'bg-success-600',
    hoverBackgroundColor: 'bg-success-700',
    textColor: 'text-white',
    borderColor: 'border-transparent',
    shadow: 'shadow-sm',
    hoverShadow: 'shadow-md'
  },
  danger: {
    backgroundColor: 'bg-danger-600',
    hoverBackgroundColor: 'bg-danger-700',
    textColor: 'text-white',
    borderColor: 'border-transparent',
    shadow: 'shadow-sm',
    hoverShadow: 'shadow-md'
  },
  warning: {
    backgroundColor: 'bg-warning-500',
    hoverBackgroundColor: 'bg-warning-600',
    textColor: 'text-white',
    borderColor: 'border-transparent',
    shadow: 'shadow-sm',
    hoverShadow: 'shadow-md'
  }
});

/**
 * KisanO Design System Button Sizes Configuration
 * 
 * Size definitions following KisanO's button sizing system.
 * Each size contains semantic Tailwind CSS classes for consistent layout.
 * 
 * @constant {Object} BUTTON_SIZES_CONFIG
 */
const BUTTON_SIZES_CONFIG = Object.freeze({
  xs: {
    padding: 'px-3 py-1.5',
    fontSize: 'text-xs',
    height: 'h-8',
    borderRadius: 'rounded-md',
    iconSize: 'w-3 h-3',
    spacing: 'gap-1.5'
  },
  sm: {
    padding: 'px-4 py-2',
    fontSize: 'text-sm',
    height: 'h-9',
    borderRadius: 'rounded-md',
    iconSize: 'w-4 h-4',
    spacing: 'gap-2'
  },
  md: {
    padding: 'px-6 py-3',
    fontSize: 'text-sm',
    height: 'h-10',
    borderRadius: 'rounded-lg',
    iconSize: 'w-4 h-4',
    spacing: 'gap-2.5'
  },
  lg: {
    padding: 'px-8 py-4',
    fontSize: 'text-base',
    height: 'h-12',
    borderRadius: 'rounded-lg',
    iconSize: 'w-5 h-5',
    spacing: 'gap-3'
  },
  xl: {
    padding: 'px-10 py-5',
    fontSize: 'text-lg',
    height: 'h-14',
    borderRadius: 'rounded-xl',
    iconSize: 'w-6 h-6',
    spacing: 'gap-4'
  }
});

/**
 * KisanO Design System Button Shapes Configuration
 * 
 * Shape definitions following KisanO's button shape system.
 * Ensures consistent border radius across button types.
 * 
 * @constant {Object} BUTTON_SHAPES_CONFIG
 */
const BUTTON_SHAPES_CONFIG = Object.freeze({
  default: {
    borderRadius: 'rounded-lg'
  },
  rounded: {
    borderRadius: 'rounded-2xl'
  },
  pill: {
    borderRadius: 'rounded-full'
  },
  square: {
    borderRadius: 'rounded-none'
  }
});

/**
 * KisanO Design System Disabled State Tokens
 * 
 * Disabled state styling following KisanO's accessibility system.
 * Provides appropriate visual feedback for disabled interactions.
 * 
 * @constant {Object} DISABLED_STATE_TOKENS
 */
const DISABLED_STATE_TOKENS = Object.freeze({
  backgroundColor: 'bg-gray-100',
  textColor: 'text-gray-400',
  borderColor: 'border-gray-200',
  cursor: 'cursor-not-allowed',
  opacity: 'opacity-60',
  shadow: 'shadow-none'
});

/**
 * KisanO Design System Loading State Tokens
 * 
 * Loading state styling following KisanO's feedback system.
 * Provides appropriate visual feedback during async operations.
 * 
 * @constant {Object} LOADING_STATE_TOKENS
 */
const LOADING_STATE_TOKENS = Object.freeze({
  spinnerColor: 'border-gray-300',
  spinnerBorderColor: 'border-t-gray-600'
});

/**
 * KisanO Design System Hover State Tokens
 * 
 * Hover state effects following KisanO's interaction patterns.
 * Provides subtle visual feedback for user interactions.
 * 
 * @constant {Object} HOVER_STATE_TOKENS
 */
const HOVER_STATE_TOKENS = Object.freeze({
  transform: 'translateY(-1px)',
  scale: 'scale-[1.02]'
});

/**
 * KisanO Design System Active State Tokens
 * 
 * Active state effects following KisanO's press patterns.
 * Provides tactile feedback for button interactions.
 * 
 * @constant {Object} ACTIVE_STATE_TOKENS
 */
const ACTIVE_STATE_TOKENS = Object.freeze({
  transform: 'translateY(0)',
  scale: 'scale-95'
});

/**
 * Master buttonTokens object
 * 
 * Centralized token collection containing all design tokens
 * for the KisanO Button package. Provides single source of truth
 * for all button styling requirements.
 * 
 * @constant {Object} buttonTokens
 */
const buttonTokens = Object.freeze({
  colors: KISANO_COLORS,
  typography: TYPOGRAPHY_TOKENS,
  spacing: SPACING_TOKENS,
  radius: RADIUS_TOKENS,
  shadows: SHADOW_TOKENS,
  transitions: TRANSITION_TOKENS,
  iconSizes: ICON_SIZE_TOKENS,
  focusRings: FOCUS_RING_TOKENS,
  variants: BUTTON_VARIANTS_CONFIG,
  sizes: BUTTON_SIZES_CONFIG,
  shapes: BUTTON_SHAPES_CONFIG,
  disabled: DISABLED_STATE_TOKENS,
  loading: LOADING_STATE_TOKENS,
  hover: HOVER_STATE_TOKENS,
  active: ACTIVE_STATE_TOKENS
});

/**
 * Get button variant styles based on variant type
 * 
 * Retrieves the button variant configuration based on the
 * specified variant. Returns the primary variant if the
 * specified variant is not found.
 * 
 * @param {string} variant - The button variant
 * @returns {Object} Button variant styles
 */
function getVariantStyles(variant) {
  return BUTTON_VARIANTS_CONFIG[variant] || BUTTON_VARIANTS_CONFIG.primary;
}

/**
 * Get button size styles based on size
 * 
 * Retrieves the button size configuration based on the
 * specified size. Returns the medium size if the
 * specified size is not found.
 * 
 * @param {string} size - The button size
 * @returns {Object} Button size styles
 */
function getSizeStyles(size) {
  return BUTTON_SIZES_CONFIG[size] || BUTTON_SIZES_CONFIG.md;
}

/**
 * Get button shape styles based on shape
 * 
 * Retrieves the button shape configuration based on the
 * specified shape. Returns the default shape if the
 * specified shape is not found.
 * 
 * @param {string} shape - The button shape
 * @returns {Object} Button shape styles
 */
function getShapeStyles(shape) {
  return BUTTON_SHAPES_CONFIG[shape] || BUTTON_SHAPES_CONFIG.default;
}

/**
 * Check if button is in disabled state
 * 
 * Returns the disabled state configuration. This function
 * can be used to conditionally apply disabled styles.
 * 
 * @param {boolean} isDisabled - Disabled state flag
 * @returns {Object} Disabled state styles
 */
function getDisabledStyles(isDisabled) {
  return isDisabled ? DISABLED_STATE_TOKENS : {};
}

/**
 * Check if button is in loading state
 * 
 * Returns the loading state configuration. This function
 * can be used to conditionally apply loading styles.
 * 
 * @param {boolean} isLoading - Loading state flag
 * @returns {Object} Loading state styles
 */
function getLoadingStyles(isLoading) {
  return isLoading ? LOADING_STATE_TOKENS : {};
}

/**
 * Get button hover styles
 * 
 * Returns hover transition styles. This function
 * can be used to conditionally apply hover effects.
 * 
 * @param {boolean} isHovered - Hover state flag
 * @returns {Object} Hover state styles
 */
function getHoverStyles(isHovered) {
  return isHovered ? { transition: TRANSITION_TOKENS.normal } : {};
}

/**
 * Get button focus ring styles
 * 
 * Retrieves the focus ring styles based on the
 * variant color context. Provides accessibility-compliant
 * focus indicators.
 * 
 * @param {string} variant - Button variant color context
 * @returns {Object} Focus ring styles
 */
function getFocusRingStyles(variant) {
  const focusRing = FOCUS_RING_TOKENS[variant] || FOCUS_RING_TOKENS.default;
  return focusRing ? {
    outline: 'none',
    boxShadow: `0 0 0 ${focusRing.width} ${focusRing.color}`
  } : {};
}

// Public API
export {
  KISANO_COLORS,
  TYPOGRAPHY_TOKENS,
  SPACING_TOKENS,
  RADIUS_TOKENS,
  SHADOW_TOKENS,
  TRANSITION_TOKENS,
  ICON_SIZE_TOKENS,
  FOCUS_RING_TOKENS,
  BUTTON_VARIANTS_CONFIG,
  BUTTON_SIZES_CONFIG,
  BUTTON_SHAPES_CONFIG,
  DISABLED_STATE_TOKENS,
  LOADING_STATE_TOKENS,
  HOVER_STATE_TOKENS,
  ACTIVE_STATE_TOKENS,
  buttonTokens,
  getVariantStyles,
  getSizeStyles,
  getShapeStyles,
  getDisabledStyles,
  getLoadingStyles,
  getHoverStyles,
  getFocusRingStyles
};