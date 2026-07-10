/**
 * KisanO Design System — Card Package
 * Card Design Tokens
 *
 * Complete design token system for the KisanO Card component family.
 * This file defines all visual states, sizes, variants, and design tokens
 * required for consistent card styling across the KisanO application.
 *
 * Architecture principles:
 * - All exports are plain objects with string values or nested objects
 * - Objects are intended to be merged with clsx/tailwind-merge for class composition
 * - Each export covers a single dimension (size, variant, state, etc.)
 * - The `CARD_DEFAULTS` object provides sensible defaults for all dimensions
 *
 * @version 1.5.0
 * @author KisanO Team
 * @see {@link https://kisan-o.design} for full documentation.
 * @module components/ui/Card/cardVariants
 */

export const CARD_VARIANTS = Object.freeze({
  default: {
    background: 'bg-white',
    border: 'border border-gray-200',
    shadow: 'shadow-sm',
    text: 'text-gray-900',
    hover: 'hover:shadow-md hover:border-gray-300',
    active: 'active:shadow-lg active:border-gray-400',
    focus: 'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
  },
  outlined: {
    background: 'bg-white',
    border: 'border-2 border-gray-300',
    shadow: 'shadow-none',
    text: 'text-gray-900',
    hover: 'hover:border-blue-400 hover:bg-gray-50',
    active: 'active:border-blue-500 active:shadow-md',
    focus: 'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
  },
  filled: {
    background: 'bg-gray-50',
    border: 'border border-gray-200',
    shadow: 'shadow-none',
    text: 'text-gray-900',
    hover: 'hover:bg-gray-100 hover:border-gray-300',
    active: 'active:bg-gray-200 active:shadow-sm',
    focus: 'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-gray-100',
  },
  elevated: {
    background: 'bg-white',
    border: 'border border-gray-200',
    shadow: 'shadow-lg',
    text: 'text-gray-900',
    hover: 'hover:shadow-xl hover:border-gray-300 hover:-translate-y-1',
    active: 'active:shadow-2xl active:border-gray-400 active:translate-y-0',
    focus: 'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
  },
  glass: {
    background: 'bg-white/80 backdrop-blur-md',
    border: 'border border-white/20',
    shadow: 'shadow-lg',
    text: 'text-gray-900',
    hover: 'hover:bg-white/90 hover:border-white/40 hover:shadow-xl',
    active: 'active:bg-white/95 active:shadow-2xl',
    focus: 'focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/60',
  },
  gradient: {
    background: 'bg-gradient-to-br from-blue-50 to-indigo-100',
    border: 'border border-blue-200',
    shadow: 'shadow-md',
    text: 'text-gray-900',
    hover: 'hover:from-blue-100 hover:to-indigo-200 hover:shadow-lg',
    active: 'active:from-blue-200 active:to-indigo-300 active:shadow-xl',
    focus: 'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
  },
  success: {
    background: 'bg-green-50',
    border: 'border border-green-200',
    shadow: 'shadow-sm',
    text: 'text-green-900',
    hover: 'hover:bg-green-100 hover:border-green-300',
    active: 'active:bg-green-200 active:shadow-md',
    focus: 'focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500',
  },
  warning: {
    background: 'bg-yellow-50',
    border: 'border border-yellow-200',
    shadow: 'shadow-sm',
    text: 'text-yellow-900',
    hover: 'hover:bg-yellow-100 hover:border-yellow-300',
    active: 'active:bg-yellow-200 active:shadow-md',
    focus: 'focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500',
  },
  danger: {
    background: 'bg-red-50',
    border: 'border border-red-200',
    shadow: 'shadow-sm',
    text: 'text-red-900',
    hover: 'hover:bg-red-100 hover:border-red-300',
    active: 'active:bg-red-200 active:shadow-md',
    focus: 'focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500',
  },
  info: {
    background: 'bg-blue-50',
    border: 'border border-blue-200',
    shadow: 'shadow-sm',
    text: 'text-blue-900',
    hover: 'hover:bg-blue-100 hover:border-blue-300',
    active: 'active:bg-blue-200 active:shadow-md',
    focus: 'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
  },
});
/* ---------------------------------- */
export const CARD_SIZES = Object.freeze({
  xs: {
    padding: 'p-3',
    radius: 'rounded-md',
    shadow: 'shadow-sm',
    typography: {
      heading: 'text-sm font-semibold',
      body: 'text-xs',
      meta: 'text-[10px]',
    },
    icon: 'w-4 h-4',
    gap: 'gap-2',
  },
  sm: {
    padding: 'p-4',
    radius: 'rounded-lg',
    shadow: 'shadow-sm',
    typography: {
      heading: 'text-base font-semibold',
      body: 'text-sm',
      meta: 'text-xs',
    },
    icon: 'w-5 h-5',
    gap: 'gap-3',
  },
  md: {
    padding: 'p-6',
    radius: 'rounded-xl',
    shadow: 'shadow-md',
    typography: {
      heading: 'text-lg font-semibold',
      body: 'text-sm',
      meta: 'text-sm',
    },
    icon: 'w-6 h-6',
    gap: 'gap-4',
  },
  lg: {
    padding: 'p-8',
    radius: 'rounded-2xl',
    shadow: 'shadow-lg',
    typography: {
      heading: 'text-xl font-semibold',
      body: 'text-base',
      meta: 'text-base',
    },
    icon: 'w-8 h-8',
    gap: 'gap-5',
  },
  xl: {
    padding: 'p-10',
    radius: 'rounded-3xl',
    shadow: 'shadow-xl',
    typography: {
      heading: 'text-2xl font-semibold',
      body: 'text-lg',
      meta: 'text-lg',
    },
    icon: 'w-10 h-10',
    gap: 'gap-6',
  },
});
/* ---------------------------------- */
export const CARD_RADIUS = Object.freeze({
  none: 'rounded-none',
  sm: 'rounded-sm',
  md: 'rounded-md',
  lg: 'rounded-lg',
  xl: 'rounded-xl',
  '2xl': 'rounded-2xl',
  full: 'rounded-full',
});
/* ---------------------------------- */
export const CARD_SHADOWS = Object.freeze({
  none: 'shadow-none',
  xs: 'shadow-xs',
  sm: 'shadow-sm',
  md: 'shadow-md',
  lg: 'shadow-lg',
  xl: 'shadow-xl',
  '2xl': 'shadow-2xl',
  inner: 'shadow-inner',
});
/* ---------------------------------- */
export const CARD_COLORS = Object.freeze({
  primary: {
    bg: 'bg-blue-600',
    text: 'text-white',
    border: 'border-blue-600',
    hover: 'hover:bg-blue-700',
    active: 'active:bg-blue-800',
  },
  secondary: {
    bg: 'bg-gray-600',
    text: 'text-white',
    border: 'border-gray-600',
    hover: 'hover:bg-gray-700',
    active: 'active:bg-gray-800',
  },
  success: {
    bg: 'bg-green-600',
    text: 'text-white',
    border: 'border-green-600',
    hover: 'hover:bg-green-700',
    active: 'active:bg-green-800',
  },
  warning: {
    bg: 'bg-yellow-600',
    text: 'text-white',
    border: 'border-yellow-600',
    hover: 'hover:bg-yellow-700',
    active: 'active:bg-yellow-800',
  },
  danger: {
    bg: 'bg-red-600',
    text: 'text-white',
    border: 'border-red-600',
    hover: 'hover:bg-red-700',
    active: 'active:bg-red-800',
  },
  info: {
    bg: 'bg-blue-600',
    text: 'text-white',
    border: 'border-blue-600',
    hover: 'hover:bg-blue-700',
    active: 'active:bg-blue-800',
  },
});
/* ---------------------------------- */
export const CARD_GRADIENTS = Object.freeze({
  primary: 'bg-gradient-to-br from-blue-500 to-blue-700',
  secondary: 'bg-gradient-to-br from-gray-500 to-gray-700',
  success: 'bg-gradient-to-br from-green-500 to-green-700',
  warning: 'bg-gradient-to-br from-yellow-500 to-yellow-700',
  danger: 'bg-gradient-to-br from-red-500 to-red-700',
  info: 'bg-gradient-to-br from-blue-500 to-indigo-700',
});
/* ---------------------------------- */
export const CARD_TRANSITIONS = Object.freeze({
  fast: 'transition-all duration-150 ease-in-out',
  normal: 'transition-all duration-300 ease-in-out',
  slow: 'transition-all duration-500 ease-in-out',
  colorsOnly: 'transition-colors duration-200 ease-in-out',
  transformOnly: 'transition-transform duration-200 ease-in-out',
});
/* ---------------------------------- */
export const CARD_ELEVATION = Object.freeze({
  level1: 'shadow-sm',
  level2: 'shadow-md',
  level3: 'shadow-lg',
  level4: 'shadow-xl',
  level5: 'shadow-2xl',
});
/* ---------------------------------- */
export const CARD_HOVER_EFFECTS = Object.freeze({
  lift: 'hover:-translate-y-1 hover:shadow-lg',
  hover: 'hover:scale-[1.02]',
  glow: 'hover:shadow-xl',
  border: 'hover:border-blue-400',
});
/* ---------------------------------- */
export const CARD_ACTIVE_EFFECTS = Object.freeze({
  reset: 'active:translate-y-0 active:shadow-md',
  pressed: 'active:scale-95',
});
/* ---------------------------------- */
export const CARD_FOCUS_RING = Object.freeze({
  default: 'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
  colored: {
    primary: 'focus:ring-blue-500',
    success: 'focus:ring-green-500',
    warning: 'focus:ring-yellow-500',
    danger: 'focus:ring-red-500',
  },
});
/* ---------------------------------- */
export const CARD_PADDING = Object.freeze({
  none: 'p-0',
  xs: 'p-2',
  sm: 'p-3',
  md: 'p-4',
  lg: 'p-6',
  xl: 'p-8',
});
/* ---------------------------------- */
export const CARD_TYPOGRAPHY = Object.freeze({
  heading: {
    xs: 'text-sm font-semibold leading-tight',
    sm: 'text-base font-semibold leading-tight',
    md: 'text-lg font-semibold leading-tight',
    lg: 'text-xl font-semibold leading-tight',
    xl: 'text-2xl font-semibold leading-tight',
  },
  body: {
    xs: 'text-xs leading-normal',
    sm: 'text-sm leading-normal',
    md: 'text-base leading-normal',
    lg: 'text-lg leading-normal',
    xl: 'text-xl leading-normal',
  },
  meta: {
    xs: 'text-[10px] leading-tight',
    sm: 'text-xs leading-tight',
    md: 'text-sm leading-tight',
    lg: 'text-base leading-tight',
    xl: 'text-lg leading-tight',
  },
  caption: {
    xs: 'text-[9px] leading-tight',
    sm: 'text-xs leading-tight',
    md: 'text-sm leading-tight',
    lg: 'text-base leading-tight',
    xl: 'text-lg leading-tight',
  },
});
/* ---------------------------------- */
export const CARD_BORDERS = Object.freeze({
  default: 'border border-gray-200',
  colored: {
    primary: 'border-blue-500',
    success: 'border-green-500',
    warning: 'border-yellow-500',
    danger: 'border-red-500',
    info: 'border-blue-500',
  },
  thin: 'border-2 border-gray-200',
  thick: 'border-4 border-gray-300',
});
/* ---------------------------------- */
export const CARD_STATES = Object.freeze({
  default: {
    background: 'bg-white',
    text: 'text-gray-900',
    border: 'border-gray-200',
  },
  hover: {
    background: 'bg-gray-50',
    text: 'text-gray-900',
    border: 'border-gray-300',
  },
  active: {
    background: 'bg-gray-100',
    text: 'text-gray-900',
    border: 'border-gray-400',
  },
  loading: {
    background: 'bg-gray-50',
    text: 'text-gray-400',
    border: 'border-gray-200',
  },
  error: {
    background: 'bg-red-50',
    text: 'text-red-900',
    border: 'border-red-200',
  },
  success: {
    background: 'bg-green-50',
    text: 'text-green-900',
    border: 'border-green-200',
  },
  warning: {
    background: 'bg-yellow-50',
    text: 'text-yellow-900',
    border: 'border-yellow-200',
  },
  disabled: {
    background: 'bg-gray-50',
    text: 'text-gray-400',
    border: 'border-gray-200',
    cursor: 'cursor-not-allowed',
    opacity: 'opacity-60',
  },
});
/* ---------------------------------- */
export const CARD_STATUS_COLORS = Object.freeze({
  default: {
    bg: 'bg-gray-50',
    border: 'border-gray-200',
    text: 'text-gray-700',
  },
  online: {
    bg: 'bg-green-50',
    border: 'border-green-200',
    text: 'text-green-700',
  },
  offline: {
    bg: 'bg-gray-50',
    border: 'border-gray-200',
    text: 'text-gray-500',
  },
  active: {
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    text: 'text-blue-700',
  },
  inactive: {
    bg: 'bg-gray-50',
    border: 'border-gray-200',
    text: 'text-gray-500',
  },
  pending: {
    bg: 'bg-yellow-50',
    border: 'border-yellow-200',
    text: 'text-yellow-700',
  },
  approved: {
    bg: 'bg-green-50',
    border: 'border-green-200',
    text: 'text-green-700',
  },
  rejected: {
    bg: 'bg-red-50',
    border: 'border-red-200',
    text: 'text-red-700',
  },
});
/* ---------------------------------- */
export const CARD_GLASS_EFFECTS = Object.freeze({
  default: 'bg-white/80 backdrop-blur-md border-white/20 shadow-lg',
  subtle: 'bg-white/60 backdrop-blur-sm border-white/10 shadow-md',
  strong: 'bg-white/90 backdrop-blur-lg border-white/30 shadow-xl',
  vibrant: 'bg-white/70 backdrop-blur-xl border-white/40 shadow-2xl',
});
/* ---------------------------------- */
export const CARD_ICONS = Object.freeze({
  size: {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
    xl: 'w-8 h-8',
  },
  status: {
    online: 'text-green-500',
    offline: 'text-gray-400',
    active: 'text-blue-500',
    inactive: 'text-gray-400',
    pending: 'text-yellow-500',
    approved: 'text-green-500',
    rejected: 'text-red-500',
  },
});
/* ---------------------------------- */
export const CARD_DEFAULTS = Object.freeze({
  variant: 'default',
  size: 'md',
  radius: 'xl',
  elevation: 'level3',
  transition: 'normal',
  padding: 'md',
  animation: true,
  interactive: true,
  loading: false,
  disabled: false,
});
/* ---------------------------------- */
export const CARD_THEME = Object.freeze({
  variants: CARD_VARIANTS,
  sizes: CARD_SIZES,
  radius: CARD_RADIUS,
  shadows: CARD_SHADOWS,
  colors: CARD_COLORS,
  gradients: CARD_GRADIENTS,
  transitions: CARD_TRANSITIONS,
  elevation: CARD_ELEVATION,
  hoverEffects: CARD_HOVER_EFFECTS,
  activeEffects: CARD_ACTIVE_EFFECTS,
  focusRing: CARD_FOCUS_RING,
  padding: CARD_PADDING,
  typography: CARD_TYPOGRAPHY,
  borders: CARD_BORDERS,
  states: CARD_STATES,
  statusColors: CARD_STATUS_COLORS,
  glassEffects: CARD_GLASS_EFFECTS,
  icons: CARD_ICONS,
  defaults: CARD_DEFAULTS,
});
/* ---------------------------------- */
/* Helper functions */
export function getCardClasses(
  variant = CARD_DEFAULTS.variant,
  size = CARD_DEFAULTS.size,
  state = 'default',
) {
  const variantConfig = CARD_VARIANTS[variant] || CARD_VARIANTS.default;
  const sizeConfig = CARD_SIZES[size] || CARD_SIZES.md;
  const stateConfig = CARD_STATES[state] || CARD_STATES.default;

  return {
    container: [
      variantConfig.background,
      variantConfig.border,
      variantConfig.shadow,
      sizeConfig.padding,
      sizeConfig.radius,
      'transition-all duration-200 ease-in-out',
      variantConfig.hover,
      stateConfig.background,
      stateConfig.border,
    ]
      .filter(Boolean)
      .join(' '),

    content: [
      'flex flex-col',
      sizeConfig.gap,
      'text-inherit',
    ]
      .filter(Boolean)
      .join(' '),

    header: [
      'flex items-center gap-3',
      sizeConfig.padding,
      'border-b border-gray-200',
    ]
      .filter(Boolean)
      .join(' '),

    body: [
      'flex-1',
      sizeConfig.padding,
    ]
      .filter(Boolean)
      .join(' '),

    footer: [
      'flex items-center justify-between gap-3',
      sizeConfig.padding,
      'border-t border-gray-200',
    ]
      .filter(Boolean)
      .join(' '),
  };
}
export function getCardStatusColor(status = 'default') {
  return CARD_STATUS_COLORS[status] || CARD_STATUS_COLORS.default;
}
export function getCardElevationLevel(level = 'level3') {
  return CARD_ELEVATION[level] || CARD_ELEVATION.level3;
}
/* ---------------------------------- */

/* ---------------------------------- */
/* Export all exported items for external consumption */
