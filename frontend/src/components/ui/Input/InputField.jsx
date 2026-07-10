'use client';
/**
 * KisanO Design System — Input Package
 * InputField
 *
 * The production-ready native `<input>` element for the KisanO Design
 * System. This component has a single responsibility: rendering a fully
 * styled, fully accessible native input. It does NOT render labels,
 * icons, helper text, or containers — those concerns belong to sibling
 * components in the Input package (InputContainer, InputLabel, etc.).
 *
 * All styling is composed exclusively through the pure helpers in
 * `inputUtils.js`, which source every class from the design tokens in
 * `inputVariants.js`.
 *
 * @module components/ui/Input/InputField
 */
import { forwardRef, useCallback, useMemo, memo } from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import {
  INPUT_ERROR_STATE,
  INPUT_LOADING_STATE,
  INPUT_READONLY_STATE,
  INPUT_DEFAULTS,
} from './inputVariants';
import { getInputClasses } from './inputUtils';
/* ---------------------------------- */
/* Constants */
/* ---------------------------------- */
/**
 * Input types supported by the KisanO Design System.
 * @type {ReadonlyArray<string>}
 */
export const INPUT_FIELD_TYPES = Object.freeze([
  'text',
  'email',
  'password',
  'search',
  'tel',
  'number',
  'url',
  'date',
]);
/**
 * Resolves an arbitrary `type` prop to a supported input type,
 * falling back to `'text'` for unknown values.
 *
 * @param {string} type - Requested input type.
 * @returns {string} A supported input type.
 */
function resolveType(type) {
  return INPUT_FIELD_TYPES.includes(type) ? type : 'text';
}
/**
 * Resolves a single validation status from boolean status flags.
 * Error takes precedence over warning, which takes precedence over success.
 *
 * @param {Object} flags - Status flags.
 * @param {boolean} flags.error - Error flag.
 * @param {boolean} flags.warning - Warning flag.
 * @param {boolean} flags.success - Success flag.
 * @returns {'error'|'warning'|'success'|'none'} The resolved status.
 */
function resolveStatus({ error, warning, success }) {
  if (error) return 'error';
  if (warning) return 'warning';
  if (success) return 'success';
  return 'none';
}
/* ---------------------------------- */
/* Motion Variants */
/* ---------------------------------- */
const INPUT_MOTION_VARIANTS = {
  entrance: {
    opacity: 0,
    y: 14,
    scale: 0.94,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
  },
  focus: {
    scale: 1.018,
    y: -0.8,
    transition: { 
      duration: 0.2, 
      ease: [0.23, 1, 0.32, 1],
      type: "spring",
      stiffness: 420,
      damping: 24
    },
  },
  blur: {
    scale: 1,
    y: 0,
    transition: { duration: 0.28, ease: [0.23, 1, 0.32, 1] },
  },
  error: {
    x: [0, -6, 6, -4, 4, -2, 2, 0],
    transition: { duration: 0.48, ease: 'easeInOut' },
  },
  success: {
    scale: [1, 1.025, 1],
    transition: { duration: 0.65, ease: 'easeOut' },
  },
  loading: {
    opacity: [1, 0.78, 1],
    transition: { duration: 1.4, repeat: Infinity, ease: 'easeInOut' },
  },
  caret: {
    caretColor: '#2E7D32',
  },
};
/* ---------------------------------- */
/* Component */
/* ---------------------------------- */
/**
 * InputField — the styled native input element of the KisanO Design System.
 *
 * Supports both controlled (`value` + `onChange`) and uncontrolled
 * (`defaultValue`) usage, all common input types, validation states,
 * loading, disabled/read-only behavior, and full keyboard and screen
 * reader accessibility via native semantics and ARIA attributes.
 *
 * Performance optimizations:
 * - Memoized to prevent unnecessary re-renders when parent re-renders
 * - `useMemo` for derived values (classes, status, aria attributes)
 * - `useCallback` for event handlers with proper dependency arrays
 *
 * @example
 * // Controlled
 * <InputField
 * id="email"
 * type="email"
 * value={email}
 * onChange={(e) => setEmail(e.target.value)}
 * placeholder="you@farm.com"
 * required
 * />
 *
 * @example
 * // Uncontrolled with validation state
 * <InputField
 * id="phone"
 * type="tel"
 * defaultValue="+91"
 * pattern="^\+?[0-9\s-]{7,15}$"
 * error
 * aria-describedby="phone-error"
 * />
 */
const InputField = memo(
  forwardRef(function InputField(
    {
      id,
      name,
      type = 'text',
      value,
      defaultValue,
      onChange,
      onFocus,
      onBlur,
      onKeyDown,
      placeholder,
      autoFocus = false,
      autoComplete,
      maxLength,
      minLength,
      pattern,
      inputMode,
      variant = INPUT_DEFAULTS.variant,
      size = INPUT_DEFAULTS.size,
      shape = INPUT_DEFAULTS.shape,
      radius,
      disabled = false,
      readOnly = false,
      required = false,
      loading = false,
      error = false,
      success = false,
      warning = false,
      hasLeftIcon = false,
      hasRightIcon = false,
      fullWidth = true,
      className = '',
      'aria-label': ariaLabel,
      'aria-labelledby': ariaLabelledBy,
      'aria-describedby': ariaDescribedBy,
      ...rest
    },
    ref,
  ) {
    // Memoized derived state
    const status = useMemo(
      () => resolveStatus({ error, warning, success }),
      [error, warning, success],
    );
    const resolvedType = useMemo(
      () => resolveType(type),
      [type],
    );
    const isInteractive = !disabled && !readOnly && !loading;
    const inputClasses = useMemo(
      () =>
        getInputClasses({
          variant,
          size,
          shape,
          radius,
          status,
          disabled,
          readOnly,
          loading,
          hasLeftIcon,
          hasRightIcon: hasRightIcon || loading,
          fullWidth,
          className,
        }),
      [
        variant,
        size,
        shape,
        radius,
        status,
        disabled,
        readOnly,
        loading,
        hasLeftIcon,
        hasRightIcon,
        fullWidth,
        className,
      ],
    );
    // Memoized ARIA attributes for performance and clarity
    const ariaAttrs = useMemo(
      () => ({
        'aria-label': ariaLabel,
        'aria-labelledby': ariaLabelledBy,
        'aria-describedby': ariaDescribedBy,
        'aria-invalid': status === 'error' ? INPUT_ERROR_STATE.aria['aria-invalid'] : undefined,
        'aria-busy': loading ? INPUT_LOADING_STATE.aria['aria-busy'] : undefined,
        'aria-readonly': readOnly ? INPUT_READONLY_STATE.aria['aria-readonly'] : undefined,
        'aria-required': required || undefined,
      }),
      [
        ariaLabel,
        ariaLabelledBy,
        ariaDescribedBy,
        status,
        loading,
        readOnly,
        required,
      ],
    );
    /**
     * Guards change events while the field is non-interactive.
     * Always attached to intercept changes during loading/disabled states.
     * Calls user-provided onChange only when interactive and the handler exists.
     */
    const handleChange = useCallback(
      (event) => {
        if (!isInteractive) return;
        onChange?.(event);
      },
      [isInteractive, onChange],
    );
    const handleFocus = useCallback(
      (e) => {
        onFocus?.(e);
      },
      [onFocus],
    );
    const handleBlur = useCallback(
      (e) => {
        onBlur?.(e);
      },
      [onBlur],
    );
    return (
      <motion.input
        ref={ref}
        id={id}
        name={name}
        type={resolvedType}
        value={value}
        defaultValue={defaultValue}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        autoFocus={autoFocus}
        autoComplete={autoComplete}
        maxLength={maxLength}
        minLength={minLength}
        pattern={pattern}
        inputMode={inputMode}
        disabled={disabled}
        readOnly={readOnly}
        required={required}
        className={inputClasses}
        data-status={status}
        data-loading={loading || undefined}
        spellCheck="false"
        autoCapitalize="none"
        initial="entrance"
        animate="visible"
        whileFocus={INPUT_MOTION_VARIANTS.focus}
        whileTap={isInteractive ? { scale: 0.975 } : undefined}
        whileHover={isInteractive ? { scale: 1.01 } : undefined}
        variants={INPUT_MOTION_VARIANTS}
        animate={
          status === 'error' 
            ? 'error' 
            : status === 'success' 
              ? 'success' 
              : loading 
                ? 'loading' 
                : 'visible'
        }
        transition={{ 
          duration: 0.25, 
          ease: [0.23, 1, 0.32, 1],
          type: "spring",
          stiffness: 450,
          damping: 25
        }}
        style={{
          caretColor: status === 'error' ? '#DC2626' : status === 'success' ? '#16A34A' : '#2E7D32',
        }}
        {...ariaAttrs}
        {...rest}
      />
    );
  }),
);
InputField.displayName = 'InputField';
InputField.propTypes = {
  /** Unique id — required for label association and a11y wiring. */
  id: PropTypes.string,
  /** Form field name submitted with the form. */
  name: PropTypes.string,
  /** Input type. Unknown values safely fall back to 'text'. */
  type: PropTypes.oneOf([...INPUT_FIELD_TYPES]),
  /** Controlled value. Pair with `onChange`. */
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  /** Initial value for uncontrolled usage. */
  defaultValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  /** Change handler (receives the native event). */
  onChange: PropTypes.func,
  /** Focus handler. */
  onFocus: PropTypes.func,
  /** Blur handler. */
  onBlur: PropTypes.func,
  /** KeyDown handler for keyboard interactions. */
  onKeyDown: PropTypes.func,
  /** Placeholder text. */
  placeholder: PropTypes.string,
  /** Autofocus the input on mount. Use sparingly for a11y. */
  autoFocus: PropTypes.bool,
  /** Native autocomplete hint (e.g. 'email', 'tel', 'new-password'). */
  autoComplete: PropTypes.string,
  /** Maximum number of characters. */
  maxLength: PropTypes.number,
  /** Minimum number of characters. */
  minLength: PropTypes.number,
  /** Native validation regex pattern. */
  pattern: PropTypes.string,
  /** Virtual keyboard hint for touch devices. */
  inputMode: PropTypes.oneOf([
    'none',
    'text',
    'tel',
    'url',
    'email',
    'numeric',
    'decimal',
    'search',
  ]),
  /** Visual variant from the design system. */
  variant: PropTypes.oneOf(['default', 'filled', 'outlined', 'ghost', 'underlined']),
  /** Size scale. */
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
  /** Shape preset (ignored when `radius` is provided). */
  shape: PropTypes.oneOf(['square', 'rounded', 'pill']),
  /** Radius override (takes precedence over `shape`). */
  radius: PropTypes.oneOf(['none', 'sm', 'md', 'lg', 'full']),
  /** Disables the input. */
  disabled: PropTypes.bool,
  /** Marks the input read-only. */
  readOnly: PropTypes.bool,
  /** Marks the field as required. */
  required: PropTypes.bool,
  /** Async/loading state — reserves trailing space and blocks edits. */
  loading: PropTypes.bool,
  /** Error validation state (highest precedence). */
  error: PropTypes.bool,
  /** Success validation state. */
  success: PropTypes.bool,
  /** Warning validation state. */
  warning: PropTypes.bool,
  /** Reserve leading padding for an icon rendered by the parent. */
  hasLeftIcon: PropTypes.bool,
  /** Reserve trailing padding for an icon rendered by the parent. */
  hasRightIcon: PropTypes.bool,
  /** Stretch to the parent container width. */
  fullWidth: PropTypes.bool,
  /** Extra classes appended after the design-system classes. */
  className: PropTypes.string,
  /** Accessible label when no visible label exists. */
  'aria-label': PropTypes.string,
  /** Id of the element labelling this input. */
  'aria-labelledby': PropTypes.string,
  /** Id(s) of helper/error text describing this input. */
  'aria-describedby': PropTypes.string,
};
export default InputField;