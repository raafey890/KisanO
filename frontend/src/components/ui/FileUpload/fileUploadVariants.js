/**
 * KisanO Design System — FileUpload Package
 * FileUpload Design Tokens
 *
 * Complete design token system for the KisanO FileUpload component family.
 * This file defines all visual states, sizes, variants, and design tokens
 * required for consistent file upload styling across the KisanO application.
 *
 * Architecture principles:
 * - All exports are plain objects with string values or nested objects
 * - Objects are intended to be merged with clsx/tailwind-merge for class composition
 * - Each export covers a single dimension (size, variant, state, etc.)
 * - The `FILE_UPLOAD_DEFAULTS` object provides sensible defaults for all dimensions
 *
 * @version 1.0.0
 * @author KisanO Team
 * @see {@link https://kisan-o.design} for full documentation.
 * @module components/ui/FileUpload/fileUploadVariants
 */

/* ---------------------------------- */
/* Variants                           */
/* ---------------------------------- */

/**
 * Core visual variants of the FileUpload.
 * Each variant defines background, text, border, and interaction states.
 */
export const FILE_UPLOAD_VARIANTS = Object.freeze({
  default: {
    background: 'bg-white',
    text: 'text-gray-900',
    border: 'border-2 border-dashed border-gray-300',
    icon: 'text-gray-400',
    hover: 'hover:border-gray-400 hover:bg-gray-50',
    active: 'active:border-gray-500 active:bg-gray-100',
    disabled: 'opacity-50 cursor-not-allowed pointer-events-none',
    focus: 'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
  },
  filled: {
    background: 'bg-gray-50',
    text: 'text-gray-900',
    border: 'border-2 border-dashed border-gray-300',
    icon: 'text-gray-400',
    hover: 'hover:border-gray-400 hover:bg-gray-100',
    active: 'active:border-gray-500 active:bg-gray-200',
    disabled: 'opacity-50 cursor-not-allowed pointer-events-none',
    focus: 'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
  },
  outlined: {
    background: 'bg-transparent',
    text: 'text-gray-900',
    border: 'border-2 border-dashed border-gray-400',
    icon: 'text-gray-500',
    hover: 'hover:border-gray-500 hover:bg-gray-50',
    active: 'active:border-gray-600 active:bg-gray-100',
    disabled: 'opacity-50 cursor-not-allowed pointer-events-none',
    focus: 'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
  },
  ghost: {
    background: 'bg-transparent',
    text: 'text-gray-700',
    border: 'border-2 border-dashed border-transparent',
    icon: 'text-gray-400',
    hover: 'hover:border-gray-300 hover:bg-gray-50',
    active: 'active:border-gray-400 active:bg-gray-100',
    disabled: 'opacity-50 cursor-not-allowed pointer-events-none',
    focus: 'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
  },
});

/* ---------------------------------- */
/* Sizes                              */
/* ---------------------------------- */

/**
 * Size presets for FileUploads.
 * Each size defines padding, text size, icon size, and dimensions.
 */
export const FILE_UPLOAD_SIZES = Object.freeze({
  xs: {
    padding: 'p-3',
    text: 'text-xs',
    icon: 'h-8 w-8',
    minHeight: 'min-h-[80px]',
    gap: 'gap-1.5',
  },
  sm: {
    padding: 'p-4',
    text: 'text-sm',
    icon: 'h-10 w-10',
    minHeight: 'min-h-[100px]',
    gap: 'gap-2',
  },
  md: {
    padding: 'p-6',
    text: 'text-sm',
    icon: 'h-12 w-12',
    minHeight: 'min-h-[140px]',
    gap: 'gap-2.5',
  },
  lg: {
    padding: 'p-8',
    text: 'text-base',
    icon: 'h-14 w-14',
    minHeight: 'min-h-[180px]',
    gap: 'gap-3',
  },
  xl: {
    padding: 'p-10',
    text: 'text-base',
    icon: 'h-16 w-16',
    minHeight: 'min-h-[220px]',
    gap: 'gap-3.5',
  },
});

/* ---------------------------------- */
/* Radius                             */
/* ---------------------------------- */

/**
 * Border radius presets for FileUploads.
 */
export const FILE_UPLOAD_RADIUS = Object.freeze({
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
 * Shadow presets for FileUploads.
 */
export const FILE_UPLOAD_SHADOWS = Object.freeze({
  none: 'shadow-none',
  sm: 'shadow-sm',
  md: 'shadow-md',
  lg: 'shadow-lg',
  xl: 'shadow-xl',
  '2xl': 'shadow-2xl',
});

/* ---------------------------------- */
/* States                             */
/* ---------------------------------- */

/**
 * State presets for FileUploads.
 * Defines styling for each interaction state.
 */
export const FILE_UPLOAD_STATES = Object.freeze({
  default: {
    background: 'bg-white',
    border: 'border-gray-300',
    text: 'text-gray-900',
  },
  hover: {
    background: 'bg-gray-50',
    border: 'border-gray-400',
    text: 'text-gray-900',
  },
  active: {
    background: 'bg-gray-100',
    border: 'border-gray-500',
    text: 'text-gray-900',
  },
  focus: {
    background: 'bg-white',
    border: 'border-blue-500',
    text: 'text-gray-900',
    ring: 'ring-2 ring-blue-500',
  },
  disabled: {
    background: 'bg-gray-100',
    border: 'border-gray-200',
    text: 'text-gray-400',
  },
  dragOver: {
    background: 'bg-blue-50',
    border: 'border-blue-500',
    text: 'text-blue-900',
  },
  error: {
    background: 'bg-red-50',
    border: 'border-red-500',
    text: 'text-red-900',
  },
  success: {
    background: 'bg-green-50',
    border: 'border-green-500',
    text: 'text-green-900',
  },
  uploading: {
    background: 'bg-gray-50',
    border: 'border-gray-300',
    text: 'text-gray-700',
  },
});

/* ---------------------------------- */
/* Progress Colors                    */
/* ---------------------------------- */

/**
 * Progress color presets for FileUpload progress bars.
 */
export const FILE_UPLOAD_PROGRESS_COLORS = Object.freeze({
  default: 'bg-blue-500',
  error: 'bg-red-500',
  success: 'bg-green-500',
  warning: 'bg-yellow-500',
});

/* ---------------------------------- */
/* Defaults                           */
/* ---------------------------------- */

/**
 * Default values for all FileUpload dimensions.
 */
export const FILE_UPLOAD_DEFAULTS = Object.freeze({
  variant: 'default',
  size: 'md',
  radius: 'lg',
  shadow: 'none',
  disabled: false,
  required: false,
  multiple: false,
  accept: '*/*',
  maxSize: 5242880, // 5MB
  maxFiles: 1,
});

/* ---------------------------------- */
/* Helper Functions                   */
/* ---------------------------------- */

/**
 * Gets the variant configuration for a file upload.
 * @param {string} variant - The variant key.
 * @returns {Object} The variant configuration.
 */
export function getFileUploadVariant(variant) {
  return FILE_UPLOAD_VARIANTS[variant] || FILE_UPLOAD_VARIANTS[FILE_UPLOAD_DEFAULTS.variant];
}

/**
 * Gets the size configuration for a file upload.
 * @param {string} size - The size key.
 * @returns {Object} The size configuration.
 */
export function getFileUploadSize(size) {
  return FILE_UPLOAD_SIZES[size] || FILE_UPLOAD_SIZES[FILE_UPLOAD_DEFAULTS.size];
}

/**
 * Gets the radius class for a file upload.
 * @param {string} radius - The radius key.
 * @returns {string} The radius class.
 */
export function getFileUploadRadius(radius) {
  return FILE_UPLOAD_RADIUS[radius] || FILE_UPLOAD_RADIUS[FILE_UPLOAD_DEFAULTS.radius];
}

/**
 * Gets the shadow class for a file upload.
 * @param {string} shadow - The shadow key.
 * @returns {string} The shadow class.
 */
export function getFileUploadShadow(shadow) {
  return FILE_UPLOAD_SHADOWS[shadow] || FILE_UPLOAD_SHADOWS[FILE_UPLOAD_DEFAULTS.shadow];
}

/**
 * Gets the state configuration for a file upload.
 * @param {string} state - The state key.
 * @returns {Object} The state configuration.
 */
export function getFileUploadState(state) {
  return FILE_UPLOAD_STATES[state] || FILE_UPLOAD_STATES.default;
}

/**
 * Gets the progress color for a file upload.
 * @param {string} status - The status key (default, error, success, warning).
 * @returns {string} The progress color class.
 */
export function getFileUploadProgressColor(status) {
  return FILE_UPLOAD_PROGRESS_COLORS[status] || FILE_UPLOAD_PROGRESS_COLORS.default;
}