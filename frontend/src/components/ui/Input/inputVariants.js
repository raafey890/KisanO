/**
 * KisanO Design System — Input Package
 * Design tokens for the Input component.
 *
 * This file defines all possible visual states, sizes, shapes, and interactions
 * for the Input component. It is designed to be consumed by the Input component
 * and its sub-components (e.g., InputAdornment, InputLabel, HelperText).
 *
 * Architecture principles:
 * - All exports are plain objects with string values or nested objects.
 * - Objects are intended to be merged with clsx/tailwind-merge for class composition.
 * - Each export covers a single dimension (size, variant, state, etc.).
 * - The `INPUT_DEFAULTS` object provides sensible defaults for all dimensions.
 *
 * @version 1.2.0
 * @author KisanO Team
 * @see {@link https://kisan-o.design} for full documentation.
 *
 * Palette:
 * - Primary: #2E7D32 (nature green)
 * - Accent: #F4B400 (harvest gold)
 * - Background: #F8FAF5 (off-white)
 * - Text: #1F2937 (charcoal)
 * - Error: #DC2626 (red)
 * - Success: #16A34A (green)
 * - Warning: #D97706 (amber)
 */

/* ---------------------------------- */
/* Colors - Core Design Tokens */
/* ---------------------------------- */

/**
 * Central color palette for the Input package.
 * All hex values are defined here for easy theming or future CSS variable migration.
 */
export const INPUT_COLORS = Object.freeze({
  primary: '#2E7D32',
  accent: '#F4B400',
  background: '#F8FAF5',
  surface: '#FFFFFF',
  text: '#1F2937',
  placeholder: '#9CA3AF',
  border: '#D1D5DB',
  error: '#DC2626',
  success: '#16A34A',
  warning: '#D97706',
  disabled: '#F3F4F6',
  disabledText: '#9CA3AF',
  disabledBorder: '#E5E7EB',
});

/* ---------------------------------- */
/* Variants */
/* ---------------------------------- */

/**
 * Core visual variants of the Input.
 * Each variant defines background, border, and text color classes.
 * These are the primary styles applied to the input element.
 */
export const INPUT_VARIANTS = Object.freeze({
  default:
    'bg-white border-gray-300 text-[#1F2937] placeholder:text-gray-400',
  filled:
    'bg-[#F8FAF5] border-transparent text-[#1F2937] placeholder:text-gray-400',
  outlined:
    'bg-transparent border-gray-300 text-[#1F2937] placeholder:text-gray-400',
  ghost:
    'bg-transparent border-transparent text-[#1F2937] placeholder:text-gray-400',
  underlined:
    'bg-transparent border-b-2 border-gray-300 text-[#1F2937] placeholder:text-gray-400 rounded-none',
});

/* ---------------------------------- */
/* Sizes */
/* ---------------------------------- */

/**
 * Height and text-size presets for the Input.
 * Keys correspond to standard sizing scales (xs → xl).
 */
export const INPUT_SIZES = Object.freeze({
  xs: 'h-8 text-xs',
  sm: 'h-9 text-sm',
  md: 'h-11 text-sm',
  lg: 'h-12 text-base',
  xl: 'h-14 text-lg',
});

/* ---------------------------------- */
/* Shapes */
/* ---------------------------------- */

/**
 * High‑level shape presets (square, rounded, pill).
 * These are applied directly to the input element.
 * For more granular border-radius control, use `INPUT_RADIUS`.
 */
export const INPUT_SHAPES = Object.freeze({
  square: 'rounded-none',
  rounded: 'rounded-lg',
  pill: 'rounded-full',
});

/* ---------------------------------- */
/* Border Radius */
/* ---------------------------------- */

/**
 * Granular border-radius options.
 * These can be used independently of the `shape` preset,
 * allowing for finer control (e.g., `radius="sm"` on a filled input).
 */
export const INPUT_RADIUS = Object.freeze({
  none: 'rounded-none',
  sm: 'rounded-md',
  md: 'rounded-lg',
  lg: 'rounded-xl',
  full: 'rounded-full',
});

/* ---------------------------------- */
/* Typography */
/* ---------------------------------- */

/**
 * Typography styles for the input, its label, and helper text.
 * These are separate from the main input text size (handled by `INPUT_SIZES`).
 */
export const INPUT_TYPOGRAPHY = Object.freeze({
  input: 'font-sans font-normal leading-relaxed tracking-[-0.006em]',
  label: 'font-sans text-sm font-medium text-[#1F2937]',
  helperText: 'font-sans text-xs text-gray-500',
  errorText: 'font-sans text-xs font-medium text-red-600',
  successText: 'font-sans text-xs font-medium text-green-600',
  warningText: 'font-sans text-xs font-medium text-amber-600',
});

/* ---------------------------------- */
/* Padding */
/* ---------------------------------- */

/**
 * Padding presets for each size.
 * Nested objects provide additional padding adjustments when an icon is present
 * on the left or right side of the input.
 */
export const INPUT_PADDING = Object.freeze({
  xs: 'px-3 py-1.5',
  sm: 'px-3.5 py-2',
  md: 'px-4 py-2.5',
  lg: 'px-4.5 py-3',
  xl: 'px-5 py-3.5',
  withLeftIcon: {
    xs: 'pl-8',
    sm: 'pl-9',
    md: 'pl-10',
    lg: 'pl-11',
    xl: 'pl-12',
  },
  withRightIcon: {
    xs: 'pr-8',
    sm: 'pr-9',
    md: 'pr-10',
    lg: 'pr-11',
    xl: 'pr-12',
  },
});

/* ---------------------------------- */
/* Margins */
/* ---------------------------------- */

/**
 * Margin utilities for layout spacing around the input,
 * its label, helper text, and container.
 */
export const INPUT_MARGINS = Object.freeze({
  none: 'm-0',
  labelBottom: 'mb-1.5',
  helperTop: 'mt-1.5',
  fieldBottom: 'mb-4',
});

/* ---------------------------------- */
/* Spacing */
/* ---------------------------------- */

/**
 * Gap utilities for flex/grid layouts inside the input wrapper.
 * Used to space between the input, icons, and other adornments.
 */
export const INPUT_SPACING = Object.freeze({
  wrapperGap: 'gap-1.5',
  iconGap: 'gap-2',
  inlineGap: 'gap-3',
});

/* ---------------------------------- */
/* Icon Sizes */
/* ---------------------------------- */

/**
 * Icon dimensions that align with the input size.
 * Ensure that icons placed inside the input are proportionally sized.
 */
export const INPUT_ICON_SIZES = Object.freeze({
  xs: 'h-3.5 w-3.5',
  sm: 'h-4 w-4',
  md: 'h-4 w-4',
  lg: 'h-5 w-5',
  xl: 'h-6 w-6',
});

/* ---------------------------------- */
/* Focus Ring */
/* ---------------------------------- */

/**
 * Focus ring styles for different interaction states.
 * Each variant defines the outline, border color, and ring color.
 * `default` applies the primary color; `accent` uses the harvest gold.
 */
export const INPUT_FOCUS_RING = Object.freeze({
  default:
    'focus:outline-none focus:border-[#2E7D32] focus:ring-2 focus:ring-[#2E7D32]/20 focus:ring-offset-2 focus:ring-offset-white',
  accent:
    'focus:outline-none focus:border-[#F4B400] focus:ring-2 focus:ring-[#F4B400]/25 focus:ring-offset-2 focus:ring-offset-white',
  error:
    'focus:outline-none focus:border-[#DC2626] focus:ring-2 focus:ring-[#DC2626]/20 focus:ring-offset-2 focus:ring-offset-white',
  success:
    'focus:outline-none focus:border-[#16A34A] focus:ring-2 focus:ring-[#16A34A]/20 focus:ring-offset-2 focus:ring-offset-white',
  warning:
    'focus:outline-none focus:border-[#D97706] focus:ring-2 focus:ring-[#D97706]/20 focus:ring-offset-2 focus:ring-offset-white',
});

/* ---------------------------------- */
/* Hover State */
/* ---------------------------------- */

/**
 * Hover styles corresponding to each variant.
 * These apply when the input is not disabled and the user hovers over it.
 */
export const INPUT_HOVER = Object.freeze({
  default: 'hover:border-[#2E7D32]/70 hover:bg-white',
  filled: 'hover:bg-[#F1F5EC]',
  outlined: 'hover:border-[#2E7D32]/70',
  ghost: 'hover:bg-gray-50',
  underlined: 'hover:border-[#2E7D32]/70',
});

/* ---------------------------------- */
/* Error State */
/* ---------------------------------- */

/**
 * Styles and ARIA attributes for the error state.
 * Applied when the input has validation errors.
 */
export const INPUT_ERROR_STATE = Object.freeze({
  input: 'border-[#DC2626] text-[#1F2937] placeholder:text-red-300',
  icon: 'text-[#DC2626]',
  text: 'text-[#DC2626]',
  aria: { 'aria-invalid': true },
});

/* ---------------------------------- */
/* Success State */
/* ---------------------------------- */

/**
 * Styles for a successful validation state.
 */
export const INPUT_SUCCESS_STATE = Object.freeze({
  input: 'border-[#16A34A] text-[#1F2937]',
  icon: 'text-[#16A34A]',
  text: 'text-[#16A34A]',
});

/* ---------------------------------- */
/* Warning State */
/* ---------------------------------- */

/**
 * Styles for a warning validation state.
 */
export const INPUT_WARNING_STATE = Object.freeze({
  input: 'border-[#D97706] text-[#1F2937]',
  icon: 'text-[#D97706]',
  text: 'text-[#D97706]',
});

/* ---------------------------------- */
/* Loading State */
/* ---------------------------------- */

/**
 * Styles and ARIA attributes for the loading state.
 * The spinner is positioned inside the input via padding and a dedicated element.
 */
export const INPUT_LOADING_STATE = Object.freeze({
  input: 'pr-10 cursor-progress',
  spinner: 'animate-spin text-[#2E7D32]',
  aria: { 'aria-busy': true },
});

/* ---------------------------------- */
/* Disabled State */
/* ---------------------------------- */

/**
 * Styles applied when the input is disabled.
 * The `disabled:` prefix ensures these only apply when the element is disabled.
 */
export const INPUT_DISABLED_STATE = Object.freeze({
  input:
    'disabled:bg-[#F3F4F6] disabled:text-[#9CA3AF] disabled:border-[#E5E7EB] disabled:cursor-not-allowed disabled:placeholder:text-[#D1D5DB]',
  label: 'text-[#9CA3AF]',
  icon: 'text-[#D1D5DB]',
});

/* ---------------------------------- */
/* ReadOnly State */
/* ---------------------------------- */

/**
 * Styles and ARIA attributes for the read‑only state.
 * Removes interactive indicators and provides a subtle static appearance.
 */
export const INPUT_READONLY_STATE = Object.freeze({
  input:
    'read-only:bg-[#F8FAF5] read-only:border-gray-200 read-only:cursor-default read-only:focus:ring-0 read-only:focus:border-gray-200',
  aria: { 'aria-readonly': true },
});

/* ---------------------------------- */
/* Transitions */
/* ---------------------------------- */

/**
 * Transition presets for different interaction speeds.
 * Use these to control the animation smoothness of state changes.
 */
export const INPUT_TRANSITIONS = Object.freeze({
  default: 'transition-all duration-200 ease-in-out',
  fast: 'transition-all duration-150 ease-out',
  slow: 'transition-all duration-300 ease-in-out',
  colorsOnly: 'transition-colors duration-200 ease-in-out',
});

/* ---------------------------------- */
/* Shadows */
/* ---------------------------------- */

/**
 * Box shadow utilities for the input.
 * Can be used to elevate the input or add subtle depth.
 */
export const INPUT_SHADOWS = Object.freeze({
  none: 'shadow-none',
  soft: 'shadow-sm shadow-gray-200/60',
  focus: 'focus:shadow-md focus:shadow-[#2E7D32]/10',
  elevated: 'shadow-md shadow-gray-300/40',
});

/* ---------------------------------- */
/* Defaults */
/* ---------------------------------- */

/**
 * Default values for all input dimensions.
 * These should be used by the Input component as fallbacks when no explicit prop is provided.
 */
export const INPUT_DEFAULTS = Object.freeze({
  variant: 'default',
  size: 'md',
  shape: 'rounded',
  radius: 'md',
  transition: 'default',
  shadow: 'soft',
});

/* ---------------------------------- */
/* Master Input Theme */
/* ---------------------------------- */

/**
 * Master Input Theme
 * Combines every design token into one export.
 */
export const INPUT_THEME = Object.freeze({
  colors: INPUT_COLORS,
  variants: INPUT_VARIANTS,
  sizes: INPUT_SIZES,
  shapes: INPUT_SHAPES,
  radius: INPUT_RADIUS,
  typography: INPUT_TYPOGRAPHY,
  padding: INPUT_PADDING,
  margins: INPUT_MARGINS,
  spacing: INPUT_SPACING,
  icons: INPUT_ICON_SIZES,
  focusRing: INPUT_FOCUS_RING,
  hover: INPUT_HOVER,
  error: INPUT_ERROR_STATE,
  success: INPUT_SUCCESS_STATE,
  warning: INPUT_WARNING_STATE,
  loading: INPUT_LOADING_STATE,
  disabled: INPUT_DISABLED_STATE,
  readOnly: INPUT_READONLY_STATE,
  transitions: INPUT_TRANSITIONS,
  shadows: INPUT_SHADOWS,
  defaults: INPUT_DEFAULTS,
});