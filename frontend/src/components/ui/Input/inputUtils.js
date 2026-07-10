/**
 * KisanO Design System — Input Package
 * Pure utility helpers for composing Input class names and state logic.
 *
 * Every helper is pure: given the same arguments it always returns the
 * same output and produces no side effects. All class values are sourced
 * from the design tokens exported by `inputVariants.js`.
 *
 * @module inputUtils
 */
import {
  INPUT_VARIANTS,
  INPUT_SIZES,
  INPUT_SHAPES,
  INPUT_RADIUS,
  INPUT_COLORS,
  INPUT_TYPOGRAPHY,
  INPUT_PADDING,
  INPUT_MARGINS,
  INPUT_SPACING,
  INPUT_ICON_SIZES,
  INPUT_FOCUS_RING,
  INPUT_HOVER,
  INPUT_ERROR_STATE,
  INPUT_SUCCESS_STATE,
  INPUT_WARNING_STATE,
  INPUT_LOADING_STATE,
  INPUT_DISABLED_STATE,
  INPUT_READONLY_STATE,
  INPUT_TRANSITIONS,
  INPUT_SHADOWS,
  INPUT_DEFAULTS,
} from './inputVariants';
/* ---------------------------------- */
/* Class Composition */
/* ---------------------------------- */
/**
 * Merges an arbitrary list of class values into a single class string.
 * - Falsy values (null, undefined, false, '') are ignored.
 * - Whitespace is normalized.
 * - Duplicate class names are removed (first occurrence wins; order otherwise preserved).
 *
 * @param {...(string|false|null|undefined)} classes - Class values to merge.
 * @returns {string} A single, de-duplicated class string.
 *
 * @example
 * mergeClasses('h-11', isError && 'border-red-500', undefined)
 * // => 'h-11 border-red-500'
 *
 * @example
 * mergeClasses('p-2', 'p-2', 'm-1')
 * // => 'p-2 m-1' (duplicate removed)
 */
export function mergeClasses(...classes) {
  const seen = new Set();
  return classes
    .flatMap((cls) => (cls ? String(cls).trim().split(/\s+/) : []))
    .filter((token) => token && !seen.has(token) && seen.add(token))
    .join(' ');
}
/* ---------------------------------- */
/* Token Resolvers */
/* ---------------------------------- */
/**
 * Resolves the variant classes for a given variant key.
 * Falls back to the design-system default variant when the key is unknown.
 *
 * @param {string} [variant] - Variant key ('default' | 'filled' | 'outlined' | 'ghost' | 'underlined').
 * @returns {string} Tailwind classes for the resolved variant.
 */
export function getVariant(variant) {
  return INPUT_VARIANTS[variant] ?? INPUT_VARIANTS[INPUT_DEFAULTS.variant];
}
/**
 * Resolves the size classes for a given size key.
 * Falls back to the design-system default size when the key is unknown.
 *
 * @param {string} [size] - Size key ('xs' | 'sm' | 'md' | 'lg' | 'xl').
 * @returns {string} Tailwind classes for the resolved size.
 */
export function getSize(size) {
  return INPUT_SIZES[size] ?? INPUT_SIZES[INPUT_DEFAULTS.size];
}
/**
 * Resolves the shape classes for a given shape key.
 * Falls back to the design-system default shape when the key is unknown.
 *
 * @param {string} [shape] - Shape key ('square' | 'rounded' | 'pill').
 * @returns {string} Tailwind classes for the resolved shape.
 */
export function getShape(shape) {
  return INPUT_SHAPES[shape] ?? INPUT_SHAPES[INPUT_DEFAULTS.shape];
}
/**
 * Resolves the border-radius classes for a given radius key.
 * Falls back to the design-system default radius when the key is unknown.
 *
 * @param {string} [radius] - Radius key ('none' | 'sm' | 'md' | 'lg' | 'full').
 * @returns {string} Tailwind classes for the resolved radius.
 */
export function getRadius(radius) {
  return INPUT_RADIUS[radius] ?? INPUT_RADIUS[INPUT_DEFAULTS.radius];
}
/* ---------------------------------- */
/* Padding */
/* ---------------------------------- */
/**
 * Computes the padding classes for the input element, accounting for the
 * presence of leading/trailing icons at the given size.
 *
 * @param {Object} [options] - Padding options.
 * @param {string} [options.size] - Size key ('xs' | 'sm' | 'md' | 'lg' | 'xl').
 * @param {boolean} [options.hasLeftIcon=false] - Whether a leading icon is rendered.
 * @param {boolean} [options.hasRightIcon=false] - Whether a trailing icon is rendered.
 * @returns {string} Combined padding classes.
 */
export function getInputPadding({
  size = INPUT_DEFAULTS.size,
  hasLeftIcon = false,
  hasRightIcon = false,
} = {}) {
  const resolvedSize = INPUT_SIZES[size] ? size : INPUT_DEFAULTS.size;
  return mergeClasses(
    INPUT_PADDING[resolvedSize],
    hasLeftIcon && INPUT_PADDING.withLeftIcon[resolvedSize],
    hasRightIcon && INPUT_PADDING.withRightIcon[resolvedSize],
  );
}
/* ---------------------------------- */
/* Status Classes */
/* ---------------------------------- */
/**
 * Returns the input classes applied when the field is in an error state.
 * Includes error border, text, placeholder, and error-focused ring.
 *
 * @returns {string} Error state classes.
 */
export function getErrorClasses() {
  return mergeClasses(INPUT_ERROR_STATE.input, INPUT_FOCUS_RING.error);
}
/**
 * Returns the input classes applied when the field is in a success state.
 * Includes success border, text, and success-focused ring.
 *
 * @returns {string} Success state classes.
 */
export function getSuccessClasses() {
  return mergeClasses(INPUT_SUCCESS_STATE.input, INPUT_FOCUS_RING.success);
}
/**
 * Returns the input classes applied when the field is in a warning state.
 * Includes warning border, text, and warning-focused ring.
 *
 * @returns {string} Warning state classes.
 */
export function getWarningClasses() {
  return mergeClasses(INPUT_WARNING_STATE.input, INPUT_FOCUS_RING.warning);
}
/**
 * Returns the input classes applied while an async operation is in flight.
 * Adds right padding for spinner and changes cursor.
 *
 * @returns {string} Loading state classes.
 */
export function getLoadingClasses() {
  return INPUT_LOADING_STATE.input;
}
/**
 * Returns the input classes applied when the field is disabled.
 * Includes gray background, muted text, and disabled cursor.
 *
 * @returns {string} Disabled state classes.
 */
export function getDisabledClasses() {
  return INPUT_DISABLED_STATE.input;
}
/**
 * Returns the input classes applied when the field is read-only.
 * Provides a static appearance with no focus interactions.
 *
 * @returns {string} Read-only state classes.
 */
export function getReadOnlyClasses() {
  return INPUT_READONLY_STATE.input;
}
/* ---------------------------------- */
/* Composite Class Builders */
/* ---------------------------------- */
/**
 * Resolves the status-specific classes for the current field status.
 * Pure lookup used internally by {@link getInputClasses}.
 *
 * @param {'error'|'success'|'warning'|'none'} status - Field status.
 * @returns {string} Status classes, or the default focus ring when no status applies.
 */
function getStatusClasses(status) {
  const statusMap = Object.freeze({
  error: getErrorClasses(),
  success: getSuccessClasses(),
  warning: getWarningClasses(),
});
  return statusMap[status] ?? INPUT_FOCUS_RING.default;
}
/**
 * Builds the complete class string for the `<input>` element from the
 * provided options. This is the single source of truth for input styling.
 *
 * Order of class application:
 * 1. Base (variant, size, shape/radius, padding, typography, transition, shadow)
 * 2. Status (error/success/warning or default focus ring)
 * 3. Hover (only when not disabled/readonly and no status)
 * 4. Overrides (disabled, readOnly, loading)
 * 5. Consumer className (last for maximum override)
 *
 * @param {Object} [options] - Input styling options.
 * @param {string} [options.variant] - Variant key.
 * @param {string} [options.size] - Size key.
 * @param {string} [options.shape] - Shape key (ignored when `radius` is provided).
 * @param {string} [options.radius] - Radius key (overrides `shape`).
 * @param {'error'|'success'|'warning'|'none'} [options.status='none'] - Validation status.
 * @param {boolean} [options.disabled=false] - Disabled flag.
 * @param {boolean} [options.readOnly=false] - Read-only flag.
 * @param {boolean} [options.loading=false] - Loading flag.
 * @param {boolean} [options.hasLeftIcon=false] - Leading icon flag.
 * @param {boolean} [options.hasRightIcon=false] - Trailing icon flag.
 * @param {boolean} [options.fullWidth=true] - Whether the input stretches to its container.
 * @param {string} [options.className] - Extra classes appended by the consumer.
 * @returns {string} The merged class string for the input element.
 */
export function getInputClasses({
  variant = INPUT_DEFAULTS.variant,
  size = INPUT_DEFAULTS.size,
  shape = INPUT_DEFAULTS.shape,
  radius,
  status = 'none',
  disabled = false,
  readOnly = false,
  loading = false,
  hasLeftIcon = false,
  hasRightIcon = false,
  fullWidth = true,
  className = '',
} = {}) {
  const isUnderlined = variant === 'underlined';
  const resolvedRadius = radius ? getRadius(radius) : getShape(shape);
  const paddingClasses = getInputPadding({ size, hasLeftIcon, hasRightIcon });
  const statusClasses = getStatusClasses(status);
  return mergeClasses(
    getVariant(variant),
    getSize(size),
    // Underlined variant has no border-radius or shadow.
    !isUnderlined && resolvedRadius,
    paddingClasses,
    INPUT_TYPOGRAPHY.input,
    INPUT_TRANSITIONS[INPUT_DEFAULTS.transition],
    !isUnderlined && INPUT_SHADOWS[INPUT_DEFAULTS.shadow],
    statusClasses,
    // Hover only applies when the field is interactive and not in a validation state.
    !disabled && !readOnly && status === 'none' && INPUT_HOVER[variant],
    disabled && getDisabledClasses(),
    readOnly && getReadOnlyClasses(),
    loading && getLoadingClasses(),
    fullWidth && 'w-full',
    className,
  );
}
/**
 * Builds the class string for the field container (label + input + helper).
 *
 * @param {Object} [options] - Container options.
 * @param {boolean} [options.fullWidth=true] - Whether the field stretches to its container.
 * @param {boolean} [options.withMargin=true] - Whether to apply the default bottom margin.
 * @param {string} [options.className] - Extra classes appended by the consumer.
 * @returns {string} The merged class string for the container element.
 */
export function getContainerClasses({
  fullWidth = true,
  withMargin = true,
  className = '',
} = {}) {
  return mergeClasses(
    'flex flex-col',
    INPUT_SPACING.wrapperGap,
    fullWidth ? 'w-full' : 'w-auto',
    withMargin && INPUT_MARGINS.fieldBottom,
    className,
  );
}
/**
 * Builds the class string for the field label.
 *
 * @param {Object} [options] - Label options.
 * @param {boolean} [options.disabled=false] - Whether the field is disabled.
 * @param {boolean} [options.required=false] - Whether the field is required (adds asterisk styling hook).
 * @param {string} [options.className] - Extra classes appended by the consumer.
 * @returns {string} The merged class string for the label element.
 */
export function getLabelClasses({
  disabled = false,
  required = false,
  className = '',
} = {}) {
  return mergeClasses(
    INPUT_TYPOGRAPHY.label,
    INPUT_MARGINS.labelBottom,
    disabled && INPUT_DISABLED_STATE.label,
    required && "after:ml-0.5 after:text-red-500 after:content-['*']",
    className,
  );
}
/**
 * Builds the class string for the helper text rendered below the input.
 * When a validation status is active, status typography takes precedence.
 *
 * @param {Object} [options] - Helper text options.
 * @param {'error'|'success'|'warning'|'none'} [options.status='none'] - Validation status.
 * @param {string} [options.className] - Extra classes appended by the consumer.
 * @returns {string} The merged class string for the helper text element.
 */
export function getHelperTextClasses({ status = 'none', className = '' } = {}) {
  const statusTypography = {
    error: INPUT_TYPOGRAPHY.errorText,
    success: INPUT_TYPOGRAPHY.successText,
    warning: INPUT_TYPOGRAPHY.warningText,
  };
  return mergeClasses(
    statusTypography[status] ?? INPUT_TYPOGRAPHY.helperText,
    INPUT_MARGINS.helperTop,
    className,
  );
}
/**
 * Builds the class string for leading/trailing input icons.
 *
 * @param {Object} [options] - Icon options.
 * @param {string} [options.size] - Size key controlling icon dimensions.
 * @param {'error'|'success'|'warning'|'none'} [options.status='none'] - Validation status.
 * @param {boolean} [options.disabled=false] - Whether the field is disabled.
 * @param {string} [options.className] - Extra classes appended by the consumer.
 * @returns {string} The merged class string for the icon element.
 */
export function getIconClasses({
  size = INPUT_DEFAULTS.size,
  status = 'none',
  disabled = false,
  className = '',
} = {}) {
  const statusIcon = {
    error: INPUT_ERROR_STATE.icon,
    success: INPUT_SUCCESS_STATE.icon,
    warning: INPUT_WARNING_STATE.icon,
  };
  const resolvedSize = INPUT_ICON_SIZES[size] ? size : INPUT_DEFAULTS.size;
  return mergeClasses(
    INPUT_ICON_SIZES[resolvedSize],
    'pointer-events-none shrink-0',
    disabled ? INPUT_DISABLED_STATE.icon : (statusIcon[status] ?? 'text-gray-400'),
    className,
  );
}
/* ---------------------------------- */
/* Character Counter */
/* ---------------------------------- */
/**
 * Resolves the text color class for a character counter based on how close
 * the current length is to the maximum.
 *
 * - >= 100% of max: error color
 * - >= 90% of max: warning color
 * - otherwise: muted gray
 *
 * @param {number} currentLength - Current character count.
 * @param {number} maxLength - Maximum allowed characters.
 * @returns {string} Tailwind text color class for the counter.
 */
export function getCharacterCounterColor(currentLength, maxLength) {
  if (!Number.isFinite(maxLength) || maxLength <= 0)
    return INPUT_TYPOGRAPHY.helperText;
  const ratio = currentLength / maxLength;
  if (ratio >= 1) return INPUT_ERROR_STATE.text;
  if (ratio >= 0.9) return INPUT_WARNING_STATE.text;
  return INPUT_TYPOGRAPHY.helperText;
}
/* ---------------------------------- */
/* Value Predicates */
/* ---------------------------------- */
/**
 * Determines whether an input value is considered non-empty.
 * Numbers (including 0) count as a value; strings are trimmed first.
 *
 * @param {string|number|null|undefined} value - The input value to test.
 * @returns {boolean} True when the value is present and non-blank.
 */
export function hasValue(value) {
  if (value === null || value === undefined) return false;
  if (typeof value === 'number') return true;
  return String(value).trim().length > 0;
}
/**
 * Determines whether an input value is empty.
 * Logical inverse of {@link hasValue}.
 *
 * @param {string|number|null|undefined} value - The input value to test.
 * @returns {boolean} True when the value is absent or blank.
 */
export function isInputEmpty(value) {
  return !hasValue(value);
}
/* ---------------------------------- */
/* Re-exported Token Accessors */
/* ---------------------------------- */
/**
 * Frozen snapshot of the brand color palette for programmatic consumers
 * (e.g. inline styles, charts, canvas). Prefer CSS classes for DOM styling.
 *
 * @type {Readonly<Record<string, string>>}
 */
/**
 * Frozen snapshot of the brand color palette.
 */
export const inputColorTokens = Object.freeze({
  ...INPUT_COLORS,
});

/**
 * Master design tokens for the Input package.
 * Useful when importing all design tokens from a single object.
 */
export const inputTokens = Object.freeze({
  colors: INPUT_COLORS,
  variants: INPUT_VARIANTS,
  sizes: INPUT_SIZES,
  shapes: INPUT_SHAPES,
  radius: INPUT_RADIUS,
  typography: INPUT_TYPOGRAPHY,
  padding: INPUT_PADDING,
  spacing: INPUT_SPACING,
  transitions: INPUT_TRANSITIONS,
  shadows: INPUT_SHADOWS,
  defaults: INPUT_DEFAULTS,
});