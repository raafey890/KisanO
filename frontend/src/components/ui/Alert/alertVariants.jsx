/**
 * KisanO Design System — Alert Package
 * Alert Design Tokens
 *
 * Complete design token system for the KisanO Alert component family.
 * This file defines all visual states, sizes, variants, and design tokens
 * required for consistent alert styling across the KisanO application.
 *
 * Architecture principles:
 * - All exports are plain objects with string values or nested objects
 * - Objects are intended to be merged with clsx/tailwind-merge for class composition
 * - Each export covers a single dimension (size, variant, state, etc.)
 * - The `ALERT_DEFAULTS` object provides sensible defaults for all dimensions
 *
 * @version 1.0.0
 * @author KisanO Team
 * @see {@link https://kisan-o.design} for full documentation.
 * @module components/ui/Alert/alertVariants
 */

/* ---------------------------------- */
/* Variants                           */
/* ---------------------------------- */

/**
 * Core visual variants of the Alert.
 * Each variant defines background, text, border, icon, and progress classes.
 */
export const ALERT_VARIANTS = Object.freeze({
  default: {
    background: 'bg-gray-50',
    text: 'text-gray-900',
    border: 'border border-gray-200',
    icon: 'text-gray-500',
    progress: 'bg-gray-500',
  },
  primary: {
    background: 'bg-blue-50',
    text: 'text-blue-900',
    border: 'border border-blue-200',
    icon: 'text-blue-500',
    progress: 'bg-blue-500',
  },
  secondary: {
    background: 'bg-gray-100',
    text: 'text-gray-900',
    border: 'border border-gray-300',
    icon: 'text-gray-600',
    progress: 'bg-gray-600',
  },
  success: {
    background: 'bg-green-50',
    text: 'text-green-900',
    border: 'border border-green-200',
    icon: 'text-green-500',
    progress: 'bg-green-500',
  },
  warning: {
    background: 'bg-yellow-50',
    text: 'text-yellow-900',
    border: 'border border-yellow-200',
    icon: 'text-yellow-500',
    progress: 'bg-yellow-500',
  },
  error: {
    background: 'bg-red-50',
    text: 'text-red-900',
    border: 'border border-red-200',
    icon: 'text-red-500',
    progress: 'bg-red-500',
  },
  info: {
    background: 'bg-cyan-50',
    text: 'text-cyan-900',
    border: 'border border-cyan-200',
    icon: 'text-cyan-500',
    progress: 'bg-cyan-500',
  },
});

/* ---------------------------------- */
/* Sizes                              */
/* ---------------------------------- */

/**
 * Size presets for Alerts.
 * Each size defines padding, text size, icon size, and gap.
 */
export const ALERT_SIZES = Object.freeze({
  xs: {
    padding: 'px-2.5 py-2',
    text: 'text-xs',
    icon: 'h-4 w-4',
    gap: 'gap-1.5',
  },
  sm: {
    padding: 'px-4 py-2.5',
    text: 'text-sm',
    icon: 'h-4 w-4',
    gap: 'gap-2',
  },
  md: {
    padding: 'px-5 py-3.5',
    text: 'text-sm',
    icon: 'h-5 w-5',
    gap: 'gap-2.5',
  },
  lg: {
    padding: 'px-6 py-4.5',
    text: 'text-base',
    icon: 'h-5 w-5',
    gap: 'gap-3',
  },
  xl: {
    padding: 'px-7 py-5.5',
    text: 'text-base',
    icon: 'h-6 w-6',
    gap: 'gap-3.5',
  },
});

/* ---------------------------------- */
/* Radius                             */
/* ---------------------------------- */

/**
 * Border radius presets for Alerts.
 */
export const ALERT_RADIUS = Object.freeze({
  none: 'rounded-none',
  sm: 'rounded-sm',
  md: 'rounded-md',
  lg: 'rounded-lg',
  xl: 'rounded-xl',
  '2xl': 'rounded-2xl',
  full: 'rounded-full',
});

/* ---------------------------------- */
/* Shadows                            */
/* ---------------------------------- */

/**
 * Shadow presets for Alerts.
 */
export const ALERT_SHADOWS = Object.freeze({
  none: 'shadow-none',
  sm: 'shadow-sm',
  md: 'shadow-md',
  lg: 'shadow-lg',
  xl: 'shadow-xl',
  '2xl': 'shadow-2xl',
});

/* ---------------------------------- */
/* Icons                              */
/* ---------------------------------- */

/**
 * Default icons for each Alert variant.
 */
export const ALERT_ICONS = Object.freeze({
  default: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  ),
  primary: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  ),
  secondary: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  ),
  success: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 6L9 17l-5-5" />
    </svg>
  ),
  warning: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 9v4" />
      <path d="M12 17h.01" />
      <path d="M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18z" />
    </svg>
  ),
  error: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  ),
  info: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="16" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  ),
});

/* ---------------------------------- */
/* Animations                         */
/* ---------------------------------- */

/**
 * Animation presets for Alert entrance/exit.
 */
export const ALERT_ANIMATIONS = Object.freeze({
  slide: {
    initial: { opacity: 0, y: -8 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -8 },
    transition: { duration: 0.25, ease: [0.4, 0, 0.2, 1] },
  },
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.2, ease: 'easeOut' },
  },
  scale: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 },
    transition: { duration: 0.2, ease: [0.4, 0, 0.2, 1] },
  },
  none: {
    initial: {},
    animate: {},
    exit: {},
    transition: { duration: 0 },
  },
});

/* ---------------------------------- */
/* Defaults                           */
/* ---------------------------------- */

/**
 * Default values for all Alert dimensions.
 */
export const ALERT_DEFAULTS = Object.freeze({
  variant: 'default',
  size: 'md',
  radius: 'md',
  shadow: 'none',
  animation: 'slide',
  closeable: true,
  dismissible: false,
  autoClose: false,
  duration: 5000,
  showIcon: true,
  loading: false,
  disabled: false,
});

/* ---------------------------------- */
/* Helper Functions                   */
/* ---------------------------------- */

/**
 * Gets the variant configuration for an alert.
 * @param {string} variant - The variant key.
 * @returns {Object} The variant configuration.
 */
export function getAlertVariant(variant) {
  return ALERT_VARIANTS[variant] || ALERT_VARIANTS[ALERT_DEFAULTS.variant];
}

/**
 * Gets the size configuration for an alert.
 * @param {string} size - The size key.
 * @returns {Object} The size configuration.
 */
export function getAlertSize(size) {
  return ALERT_SIZES[size] || ALERT_SIZES[ALERT_DEFAULTS.size];
}

/**
 * Gets the radius class for an alert.
 * @param {string} radius - The radius key.
 * @returns {string} The radius class.
 */
export function getAlertRadius(radius) {
  return ALERT_RADIUS[radius] || ALERT_RADIUS[ALERT_DEFAULTS.radius];
}

/**
 * Gets the shadow class for an alert.
 * @param {string} shadow - The shadow key.
 * @returns {string} The shadow class.
 */
export function getAlertShadow(shadow) {
  return ALERT_SHADOWS[shadow] || ALERT_SHADOWS[ALERT_DEFAULTS.shadow];
}

/**
 * Gets the icon for an alert variant.
 * @param {string} variant - The variant key.
 * @returns {React.ReactElement} The icon element.
 */
export function getAlertIcon(variant) {
  return ALERT_ICONS[variant] || ALERT_ICONS[ALERT_DEFAULTS.variant];
}

/**
 * Gets the animation configuration for an alert.
 * @param {string} animation - The animation key.
 * @returns {Object} The animation configuration.
 */
export function getAlertAnimation(animation) {
  return ALERT_ANIMATIONS[animation] || ALERT_ANIMATIONS[ALERT_DEFAULTS.animation];
}