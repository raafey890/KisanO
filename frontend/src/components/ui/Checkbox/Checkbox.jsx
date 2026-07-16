/**
 * KisanO Design System — Checkbox Package
 * Checkbox
 *
 * The main Checkbox component that orchestrates all checkbox subcomponents.
 * Provides a convenient API for rendering checkboxes with labels,
 * helper text, error states, and loading states.
 *
 * Single Responsibility: Orchestrate Checkbox subcomponents.
 * Does not contain business logic, helper functions, or duplicate styling.
 *
 * @module components/ui/Checkbox/Checkbox
 */

import { forwardRef, memo, useMemo, useState, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';

import {
  CHECKBOX_DEFAULTS,
} from './checkboxVariants';
import {
  mergeClasses,
  resolveDefaultProps,
  isInteractiveCheckbox,
} from './checkboxUtils';

import CheckboxContainer from './CheckboxContainer';
import CheckboxIndicator from './CheckboxIndicator';
import CheckboxLabel from './CheckboxLabel';
import CheckboxLoader from './CheckboxLoader';

/* ---------------------------------- */
/* Component                          */
/* ---------------------------------- */

/**
 * Checkbox – the main checkbox component with label and helper text.
 *
 * @component
 * @example
 * <Checkbox
 *   label="Accept terms"
 *   checked={isChecked}
 *   onChange={setIsChecked}
 * />
 *
 * @example
 * <Checkbox
 *   label="Subscribe"
 *   defaultChecked
 *   disabled
 *   helperText="You can unsubscribe later"
 * />
 */
const Checkbox = memo(
  forwardRef(function Checkbox(
    {
      children,
      label,
      helperText,
      error,
      success,
      checked: controlledChecked,
      defaultChecked = false,
      indeterminate = false,
      onChange,
      onBlur,
      onFocus,
      variant = CHECKBOX_DEFAULTS.variant,
      size = CHECKBOX_DEFAULTS.size,
      radius = CHECKBOX_DEFAULTS.radius,
      shadow = CHECKBOX_DEFAULTS.shadow,
      disabled = false,
      loading = false,
      required = false,
      responsive,
      className = '',
      labelClassName = '',
      helperClassName = '',
      id,
      name,
      value,
      containerProps,
      loaderProps,
      ...rest
    },
    ref,
  ) {
    // Internal state for uncontrolled mode.
    const [internalChecked, setInternalChecked] = useState(defaultChecked);

    // Determine if controlled or uncontrolled.
    const isControlled = controlledChecked !== undefined;
    const checked = isControlled ? controlledChecked : internalChecked;

    // Generate unique ID if not provided.
    const [generatedId] = useState(() => id || `checkbox-${Math.random().toString(36).slice(2, 9)}`);
    const inputId = id || generatedId;

    // Handle change.
    const handleChange = useCallback(
      (event) => {
        if (disabled || loading) return;

        const newChecked = event.target.checked;
        if (!isControlled) {
          setInternalChecked(newChecked);
        }
        onChange?.(event);
      },
      [disabled, loading, isControlled, onChange],
    );

    // Resolve defaults.
    const resolved = useMemo(
      () =>
        resolveDefaultProps({
          variant,
          size,
          radius,
          shadow,
          checked: isControlled ? checked : false,
          indeterminate,
          disabled,
          required,
        }),
      [variant, size, radius, shadow, checked, indeterminate, disabled, required, isControlled],
    );

    // Determine if interactive.
    const interactive = useMemo(
      () => isInteractiveCheckbox({ disabled: resolved.disabled }),
      [resolved.disabled],
    );

    // Determine checkbox state for styling.
    const checkboxState = useMemo(() => {
      if (resolved.disabled) return 'disabled';
      if (error) return 'error';
      if (success) return 'success';
      if (resolved.checked || resolved.indeterminate) return 'checked';
      return 'default';
    }, [resolved.disabled, error, success, resolved.checked, resolved.indeterminate]);

    // Accessibility attributes.
    const ariaProps = useMemo(
      () => ({
        'aria-invalid': error ? true : undefined,
        'aria-describedby': helperText ? `${inputId}-helper` : undefined,
        'aria-required': required || undefined,
        'aria-label': typeof label === 'string' ? label : undefined,
      }),
      [error, helperText, inputId, required, label],
    );

    // Build helper text ID.
    const helperId = helperText ? `${inputId}-helper` : undefined;

    // Container props.
    const containerPropsMerged = useMemo(
      () => ({
        variant: resolved.variant,
        size: resolved.size,
        disabled: resolved.disabled,
        loading,
        className,
        role: 'none',
        ...containerProps,
        ...rest,
      }),
      [resolved.variant, resolved.size, resolved.disabled, loading, className, containerProps, rest],
    );

    // Indicator props.
    const indicatorProps = {
      variant: resolved.variant,
      size: resolved.size,
      radius: resolved.radius,
      shadow: resolved.shadow,
      checked: resolved.checked,
      indeterminate: resolved.indeterminate,
      disabled: resolved.disabled,
      loading,
      state: checkboxState,
    };

    // Label props.
    const labelProps = {
      size: resolved.size,
      disabled: resolved.disabled,
      className: labelClassName,
      error,
      success,
    };

    // Loader props.
    const loaderPropsMerged = useMemo(
      () => ({
        size: resolved.size,
        variant: 'shimmer',
        rows: 2,
        disabled: resolved.disabled,
        ...loaderProps,
      }),
      [resolved.size, resolved.disabled, loaderProps],
    );

    // Handle loading state.
    const showLoader = loading;

    return (
      <CheckboxContainer ref={ref} {...containerPropsMerged}>
        {/* Hidden input for form submission */}
        <input
          type="checkbox"
          id={inputId}
          name={name}
          value={value}
          checked={isControlled ? checked : undefined}
          defaultChecked={!isControlled ? defaultChecked : undefined}
          onChange={handleChange}
          onBlur={onBlur}
          onFocus={onFocus}
          disabled={disabled || loading}
          required={required}
          className="sr-only"
          aria-checked={indeterminate ? 'mixed' : checked}
          {...ariaProps}
        />

        {/* Visual checkbox */}
        <div className="flex items-start">
          <CheckboxIndicator {...indicatorProps} />

          {/* Label and helper text */}
          <div className="flex-1 min-w-0">
            {showLoader ? (
              <CheckboxLoader {...loaderPropsMerged} />
            ) : (
              <>
                {label && (
                  <CheckboxLabel
                    htmlFor={inputId}
                    {...labelProps}
                  >
                    {label}
                    {required && (
                      <span className="ml-0.5 text-red-500" aria-hidden="true">
                        *
                      </span>
                    )}
                  </CheckboxLabel>
                )}
                {helperText && (
                  <div
                    id={helperId}
                    className={mergeClasses(
                      'text-sm mt-0.5',
                      error ? 'text-red-600' : success ? 'text-green-600' : 'text-gray-500',
                      helperClassName,
                    )}
                  >
                    {helperText}
                  </div>
                )}
                {children}
              </>
            )}
          </div>
        </div>
      </CheckboxContainer>
    );
  }),
);

Checkbox.displayName = 'Checkbox';

Checkbox.propTypes = {
  /** Checkbox label. */
  label: PropTypes.node,
  /** Helper text displayed below the checkbox. */
  helperText: PropTypes.node,
  /** Error state. */
  error: PropTypes.bool,
  /** Success state. */
  success: PropTypes.bool,
  /** Controlled checked state. */
  checked: PropTypes.bool,
  /** Default checked state for uncontrolled mode. */
  defaultChecked: PropTypes.bool,
  /** Indeterminate state. */
  indeterminate: PropTypes.bool,
  /** Change handler. */
  onChange: PropTypes.func,
  /** Blur handler. */
  onBlur: PropTypes.func,
  /** Focus handler. */
  onFocus: PropTypes.func,
  /** Visual variant. */
  variant: PropTypes.oneOf(['default', 'primary', 'secondary', 'success', 'warning', 'error']),
  /** Size preset. */
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
  /** Border radius override. */
  radius: PropTypes.oneOf(['none', 'sm', 'md', 'lg', 'xl', 'full']),
  /** Shadow level. */
  shadow: PropTypes.oneOf(['none', 'sm', 'md', 'lg', 'xl']),
  /** Disabled state. */
  disabled: PropTypes.bool,
  /** Loading state. */
  loading: PropTypes.bool,
  /** Required state. */
  required: PropTypes.bool,
  /** Responsive overrides. */
  responsive: PropTypes.shape({
    xs: PropTypes.string,
    sm: PropTypes.string,
    md: PropTypes.string,
    lg: PropTypes.string,
    xl: PropTypes.string,
  }),
  /** Additional CSS classes for the container. */
  className: PropTypes.string,
  /** Additional CSS classes for the label. */
  labelClassName: PropTypes.string,
  /** Additional CSS classes for the helper text. */
  helperClassName: PropTypes.string,
  /** Input ID. */
  id: PropTypes.string,
  /** Input name. */
  name: PropTypes.string,
  /** Input value. */
  value: PropTypes.any,
  /** Additional props for CheckboxContainer. */
  containerProps: PropTypes.object,
  /** Additional props for CheckboxLoader. */
  loaderProps: PropTypes.object,
  /** Additional content. */
  children: PropTypes.node,
};

export default Checkbox;