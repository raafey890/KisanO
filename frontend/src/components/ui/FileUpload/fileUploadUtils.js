/**
 * KisanO Design System — FileUpload Package
 * FileUpload Utilities
 *
 * Production-ready utility functions for the FileUpload package.
 * Contains only pure utility functions based on the existing fileUploadVariants.js tokens.
 *
 * Single Responsibility: This module only provides utility functions
 * for file upload styling, validation, and composition - no design tokens or React components.
 *
 * @module components/ui/FileUpload/fileUploadUtils
 */

import {
  FILE_UPLOAD_VARIANTS,
  FILE_UPLOAD_SIZES,
  FILE_UPLOAD_RADIUS,
  FILE_UPLOAD_SHADOWS,
  FILE_UPLOAD_STATES,
  FILE_UPLOAD_PROGRESS_COLORS,
  FILE_UPLOAD_DEFAULTS,
  getFileUploadVariant,
  getFileUploadSize,
  getFileUploadRadius,
  getFileUploadShadow,
  getFileUploadState,
  getFileUploadProgressColor,
} from './fileUploadVariants';

/* ---------------------------------- */
/* Core Utility Functions             */
/* ---------------------------------- */

/**
 * Merges an arbitrary list of class values into a single class string.
 * - Falsy values (null, undefined, false, '') are ignored.
 * - Whitespace is normalized.
 * - Duplicate class names are removed (first occurrence wins).
 *
 * @param {...(string|false|null|undefined)} classes - Class values to merge.
 * @returns {string} A single, de-duplicated class string.
 *
 * @example
 * mergeClasses('p-4', isError && 'border-red-500', undefined)
 * // => 'p-4 border-red-500'
 */
export function mergeClasses(...classes) {
  const seen = new Set();
  const tokens = classes
    .filter(Boolean)
    .join(' ')
    .split(/\s+/)
    .filter((token) => token && !seen.has(token));

  for (const token of tokens) {
    seen.add(token);
  }
  return tokens.join(' ');
}

/**
 * Resolves responsive class overrides into a single class string.
 *
 * @param {Object} responsive - Responsive class map.
 * @param {string} [responsive.xs] - Extra small classes.
 * @param {string} [responsive.sm] - Small classes.
 * @param {string} [responsive.md] - Medium classes.
 * @param {string} [responsive.lg] - Large classes.
 * @param {string} [responsive.xl] - Extra large classes.
 * @returns {string} Merged responsive classes.
 */
export function resolveResponsiveClasses(responsive = {}) {
  const { xs, sm, md, lg, xl } = responsive;
  return mergeClasses(
    xs || '',
    sm ? `sm:${sm}` : '',
    md ? `md:${md}` : '',
    lg ? `lg:${lg}` : '',
    xl ? `xl:${xl}` : '',
  );
}

/**
 * Resolves default props for file upload components.
 *
 * @param {Object} props - Component props.
 * @param {string} [props.variant] - File upload variant.
 * @param {string} [props.size] - File upload size.
 * @param {string} [props.radius] - Border radius.
 * @param {string} [props.shadow] - Shadow level.
 * @param {boolean} [props.disabled] - Disabled state.
 * @param {boolean} [props.required] - Required state.
 * @param {boolean} [props.multiple] - Multiple files.
 * @param {string} [props.accept] - Accepted file types.
 * @param {number} [props.maxSize] - Maximum file size.
 * @param {number} [props.maxFiles] - Maximum number of files.
 * @returns {Object} Resolved props with defaults applied.
 */
export function resolveDefaultProps({
  variant = FILE_UPLOAD_DEFAULTS.variant,
  size = FILE_UPLOAD_DEFAULTS.size,
  radius = FILE_UPLOAD_DEFAULTS.radius,
  shadow = FILE_UPLOAD_DEFAULTS.shadow,
  disabled = FILE_UPLOAD_DEFAULTS.disabled,
  required = FILE_UPLOAD_DEFAULTS.required,
  multiple = FILE_UPLOAD_DEFAULTS.multiple,
  accept = FILE_UPLOAD_DEFAULTS.accept,
  maxSize = FILE_UPLOAD_DEFAULTS.maxSize,
  maxFiles = FILE_UPLOAD_DEFAULTS.maxFiles,
}) {
  return {
    variant: FILE_UPLOAD_VARIANTS[variant] ? variant : FILE_UPLOAD_DEFAULTS.variant,
    size: FILE_UPLOAD_SIZES[size] ? size : FILE_UPLOAD_DEFAULTS.size,
    radius: FILE_UPLOAD_RADIUS[radius] ? radius : FILE_UPLOAD_DEFAULTS.radius,
    shadow: FILE_UPLOAD_SHADOWS[shadow] ? shadow : FILE_UPLOAD_DEFAULTS.shadow,
    disabled,
    required,
    multiple,
    accept,
    maxSize,
    maxFiles,
  };
}

/* ---------------------------------- */
/* Component Class Builders           */
/* ---------------------------------- */

/**
 * Gets complete file upload classes based on options.
 *
 * @param {Object} options - File upload options.
 * @param {string} [options.variant] - File upload variant.
 * @param {string} [options.size] - File upload size.
 * @param {string} [options.radius] - Border radius.
 * @param {string} [options.shadow] - Shadow level.
 * @param {string} [options.className] - Additional classes.
 * @param {boolean} [options.disabled] - Disabled state.
 * @param {boolean} [options.isDragOver] - Drag over state.
 * @param {string} [options.state] - State for styling.
 * @returns {string} Merged file upload classes.
 */
export function getFileUploadClasses({
  variant = FILE_UPLOAD_DEFAULTS.variant,
  size = FILE_UPLOAD_DEFAULTS.size,
  radius = FILE_UPLOAD_DEFAULTS.radius,
  shadow = FILE_UPLOAD_DEFAULTS.shadow,
  className = '',
  disabled = false,
  isDragOver = false,
  state = 'default',
}) {
  const variantConfig = getFileUploadVariant(variant);
  const sizeConfig = getFileUploadSize(size);

  // Determine state for styling (drag over takes precedence).
  let currentState = state;
  if (isDragOver && !disabled) {
    currentState = 'dragOver';
  }

  const stateConfig = getFileUploadState(currentState);

  return mergeClasses(
    'relative flex flex-col items-center justify-center w-full',
    'cursor-pointer',
    sizeConfig.padding,
    sizeConfig.minHeight,
    sizeConfig.gap,
    variantConfig.background,
    variantConfig.text,
    variantConfig.border,
    getFileUploadRadius(radius),
    getFileUploadShadow(shadow),
    stateConfig.background,
    stateConfig.border,
    stateConfig.text,
    'transition-all duration-200 ease-in-out',
    'focus:outline-none',
    disabled && variantConfig.disabled,
    !disabled && !isDragOver && variantConfig.hover,
    !disabled && variantConfig.active,
    !disabled && variantConfig.focus,
    className,
  );
}

/**
 * Gets container classes for file upload wrapper.
 *
 * @param {Object} options - Container options.
 * @param {string} [options.className] - Additional classes.
 * @param {boolean} [options.disabled] - Disabled state.
 * @param {boolean} [options.loading] - Loading state.
 * @returns {string} Merged container classes.
 */
export function getFileUploadContainerClasses({
  className = '',
  disabled = false,
  loading = false,
}) {
  return mergeClasses(
    'flex flex-col w-full',
    disabled && 'cursor-not-allowed',
    loading && 'opacity-70 cursor-progress',
    className,
  );
}

/**
 * Gets dropzone classes for file upload dropzone.
 *
 * @param {Object} options - Dropzone options.
 * @param {string} [options.size] - File upload size.
 * @param {string} [options.className] - Additional classes.
 * @param {boolean} [options.disabled] - Disabled state.
 * @param {boolean} [options.isDragOver] - Drag over state.
 * @returns {string} Merged dropzone classes.
 */
export function getFileUploadDropzoneClasses({
  size = FILE_UPLOAD_DEFAULTS.size,
  className = '',
  disabled = false,
  isDragOver = false,
}) {
  const sizeConfig = getFileUploadSize(size);

  return mergeClasses(
    'flex flex-col items-center justify-center w-full',
    'rounded-lg',
    'transition-all duration-200 ease-in-out',
    disabled && 'opacity-50 cursor-not-allowed',
    isDragOver && 'scale-[1.02]',
    className,
  );
}

/**
 * Gets preview classes for file upload preview.
 *
 * @param {Object} options - Preview options.
 * @param {string} [options.size] - File upload size.
 * @param {string} [options.className] - Additional classes.
 * @param {boolean} [options.disabled] - Disabled state.
 * @param {boolean} [options.error] - Error state.
 * @param {boolean} [options.success] - Success state.
 * @returns {string} Merged preview classes.
 */
export function getFileUploadPreviewClasses({
  size = FILE_UPLOAD_DEFAULTS.size,
  className = '',
  disabled = false,
  error = false,
  success = false,
}) {
  const sizeConfig = getFileUploadSize(size);

  // Determine border color based on state.
  let borderColor = 'border-gray-200';
  if (error) borderColor = 'border-red-500';
  else if (success) borderColor = 'border-green-500';

  return mergeClasses(
    'flex items-center gap-3 p-3 border rounded-lg',
    borderColor,
    'bg-white',
    sizeConfig.text,
    disabled && 'opacity-50 cursor-not-allowed',
    className,
  );
}

/**
 * Gets progress classes for file upload progress bar.
 *
 * @param {Object} options - Progress options.
 * @param {string} [options.status] - Progress status (default, error, success, warning).
 * @param {string} [options.className] - Additional classes.
 * @param {number} [options.value] - Progress value (0-100).
 * @returns {string} Merged progress classes.
 */
export function getFileUploadProgressClasses({
  status = 'default',
  className = '',
  value = 0,
}) {
  const progressColor = getFileUploadProgressColor(status);

  return mergeClasses(
    'h-1.5 w-full bg-gray-200 rounded-full overflow-hidden',
    className,
  );
}

/**
 * Gets progress bar classes for the inner progress bar.
 *
 * @param {Object} options - Progress bar options.
 * @param {string} [options.status] - Progress status (default, error, success, warning).
 * @param {string} [options.className] - Additional classes.
 * @param {number} [options.value] - Progress value (0-100).
 * @returns {string} Merged progress bar classes.
 */
export function getFileUploadProgressBarClasses({
  status = 'default',
  className = '',
  value = 0,
}) {
  const progressColor = getFileUploadProgressColor(status);

  return mergeClasses(
    'h-full rounded-full transition-all duration-300 ease-in-out',
    progressColor,
    className,
  );
}

/* ---------------------------------- */
/* Validation Utilities               */
/* ---------------------------------- */

/**
 * Validates if a variant is valid.
 *
 * @param {string} variant - The variant to check.
 * @returns {boolean} True if valid.
 */
export function isValidVariant(variant) {
  return variant ? Object.keys(FILE_UPLOAD_VARIANTS).includes(variant) : false;
}

/**
 * Validates if a size is valid.
 *
 * @param {string} size - The size to check.
 * @returns {boolean} True if valid.
 */
export function isValidSize(size) {
  return size ? Object.keys(FILE_UPLOAD_SIZES).includes(size) : false;
}

/**
 * Validates if a radius is valid.
 *
 * @param {string} radius - The radius to check.
 * @returns {boolean} True if valid.
 */
export function isValidRadius(radius) {
  return radius ? Object.keys(FILE_UPLOAD_RADIUS).includes(radius) : false;
}

/**
 * Validates if a shadow is valid.
 *
 * @param {string} shadow - The shadow to check.
 * @returns {boolean} True if valid.
 */
export function isValidShadow(shadow) {
  return shadow ? Object.keys(FILE_UPLOAD_SHADOWS).includes(shadow) : false;
}

/* ---------------------------------- */
/* State Helpers                      */
/* ---------------------------------- */

/**
 * Determines if a file upload is interactive.
 *
 * @param {Object} options - File upload options.
 * @param {boolean} [options.disabled] - Disabled state.
 * @param {boolean} [options.loading] - Loading state.
 * @returns {boolean} True if interactive.
 */
export function isInteractiveFileUpload({ disabled = false, loading = false }) {
  return !disabled && !loading;
}

/* ---------------------------------- */
/* Accessibility Helpers              */
/* ---------------------------------- */

/**
 * Generates accessibility helpers for file upload components.
 *
 * @param {Object} state - Component state.
 * @param {string} [state.label] - File upload label.
 * @param {boolean} [state.disabled] - Disabled state.
 * @param {boolean} [state.required] - Required state.
 * @param {boolean} [state.multiple] - Multiple files.
 * @param {string} [state.accept] - Accepted file types.
 * @param {number} [state.maxSize] - Maximum file size.
 * @param {number} [state.maxFiles] - Maximum number of files.
 * @returns {Object} Accessibility helper functions.
 */
export function getAccessibilityHelpers({
  label = '',
  disabled = false,
  required = false,
  multiple = false,
  accept = '',
  maxSize = 0,
  maxFiles = 0,
}) {
  return {
    getRole: () => 'button',
    getAriaLabel: () => label || 'File upload',
    getAriaDisabled: () => disabled || undefined,
    getAriaRequired: () => required || undefined,
    getAriaMultiselectable: () => multiple || undefined,
    getAriaAccept: () => accept || undefined,
    getTabIndex: () => (disabled ? -1 : 0),
    getAriaDescribedBy: () => {
      const descriptions = [];
      if (maxSize) descriptions.push(`Maximum file size: ${Math.round(maxSize / 1024 / 1024)}MB`);
      if (maxFiles > 1) descriptions.push(`Maximum files: ${maxFiles}`);
      return descriptions.join('. ') || undefined;
    },
  };
}

/* ---------------------------------- */
/* Re-exported Utilities              */
/* ---------------------------------- */

// Re-export token utilities for convenience
export {
  getFileUploadVariant,
  getFileUploadSize,
  getFileUploadRadius,
  getFileUploadShadow,
  getFileUploadState,
  getFileUploadProgressColor,
};