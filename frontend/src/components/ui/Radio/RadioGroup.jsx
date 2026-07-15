/**
 * KisanO Design System — Radio Package
 * RadioGroup
 *
 * A group of radios that manages a single radio selection.
 * Provides a convenient API for rendering a group of radios
 * with validation, disabled states, and accessibility support.
 *
 * Single Responsibility: Manage a group of radio selections.
 * Does not contain business logic or duplicate styling.
 *
 * @module components/ui/Radio/RadioGroup
 */

import { forwardRef, memo, useMemo, useCallback, useState } from 'react';
import PropTypes from 'prop-types';

import {
  RADIO_DEFAULTS,
} from './radioVariants';
import {
  mergeClasses,
  resolveResponsiveClasses,
  resolveDefaultProps,
} from './radioUtils';

import Radio from './Radio';
import RadioLabel from './RadioLabel';

/* ---------------------------------- */
/* Component                          */
/* ---------------------------------- */

/**
 * RadioGroup – a group of radios with shared state.
 *
 * @component
 * @example
 * <RadioGroup
 *   options={[
 *     { label: 'Option 1', value: '1' },
 *     { label: 'Option 2', value: '2' },
 *   ]}
 *   value="1"
 *   onChange={handleChange}
 * />
 *
 * @example
 * <RadioGroup
 *   options={options}
 *   label="Select your preference"
 *   required
 *   error={hasError}
 * />
 */
const RadioGroup = memo(
  forwardRef(function RadioGroup(
    {
      children,
      options = [],
      label,
      helperText,
      error,
      success,
      value: controlledValue,
      defaultValue = '',
      onChange,
      variant = RADIO_DEFAULTS.variant,
      size = RADIO_DEFAULTS.size,
      disabled = false,
      loading = false,
      required = false,
      orientation = 'vertical',
      responsive,
      className = '',
      labelClassName = '',
      helperClassName = '',
      radioProps,
      containerProps,
      ...rest
    },
    ref,
  ) {
    // Internal state for uncontrolled mode.
    const [internalValue, setInternalValue] = useState(defaultValue);

    // Determine if controlled or uncontrolled.
    const isControlled = controlledValue !== undefined;
    const value = isControlled ? controlledValue : internalValue;

    // Generate unique ID if not provided.
    const [generatedId] = useState(() => `radio-group-${Math.random().toString(36).slice(2, 9)}`);
    const groupId = rest.id || generatedId;

    // Handle radio change.
    const handleRadioChange = useCallback(
      (radioValue, event) => {
        if (disabled || loading) return;
        if (radioValue === value) return; // No change

        if (!isControlled) {
          setInternalValue(radioValue);
        }
        onChange?.(radioValue, event);
      },
      [disabled, loading, value, isControlled, onChange],
    );

    // Resolve defaults.
    const resolved = useMemo(
      () =>
        resolveDefaultProps({
          variant,
          size,
          disabled,
          required,
        }),
      [variant, size, disabled, required],
    );

    // Orientation classes.
    const orientationClasses = useMemo(() => {
      if (orientation === 'horizontal') {
        return 'flex flex-row flex-wrap gap-4';
      }
      return 'flex flex-col gap-2';
    }, [orientation]);

    // Responsive overrides.
    const responsiveClasses = useMemo(
      () => (responsive ? resolveResponsiveClasses(responsive) : ''),
      [responsive],
    );

    // Group container classes.
    const groupClasses = useMemo(() => {
      const base = mergeClasses(
        'flex flex-col',
        orientationClasses,
        disabled && 'opacity-50 cursor-not-allowed',
        className,
      );
      return mergeClasses(base, responsiveClasses);
    }, [orientationClasses, disabled, className, responsiveClasses]);

    // Helper text ID.
    const helperId = helperText ? `${groupId}-helper` : undefined;

    // Accessibility attributes.
    const ariaProps = useMemo(
      () => ({
        role: 'radiogroup',
        'aria-labelledby': label ? `${groupId}-label` : undefined,
        'aria-describedby': helperId,
        'aria-disabled': disabled || undefined,
        'aria-required': required || undefined,
      }),
      [label, helperId, disabled, required, groupId],
    );

    // Render options from array.
    const renderOptions = useCallback(() => {
      if (!options || options.length === 0) return null;

      return options.map((option, index) => {
        const optionValue = option.value ?? option.label;
        const isChecked = value === optionValue;
        const optionDisabled = option.disabled || disabled;

        return (
          <Radio
            key={optionValue}
            label={option.label}
            name={groupId}
            value={optionValue}
            checked={isChecked}
            onChange={(event) => handleRadioChange(optionValue, event)}
            disabled={optionDisabled}
            variant={resolved.variant}
            size={resolved.size}
            required={required}
            {...radioProps}
          />
        );
      });
    }, [
      options,
      value,
      handleRadioChange,
      disabled,
      resolved.variant,
      resolved.size,
      required,
      groupId,
      radioProps,
    ]);

    return (
      <div
        ref={ref}
        className={groupClasses}
        {...ariaProps}
        {...rest}
      >
        {/* Label */}
        {label && (
          <RadioLabel
            id={`${groupId}-label`}
            size={resolved.size}
            disabled={disabled}
            className={labelClassName}
            required={required}
          >
            {label}
            {required && (
              <span className="ml-0.5 text-red-500" aria-hidden="true">
                *
              </span>
            )}
          </RadioLabel>
        )}

        {/* Radios */}
        <div className="flex flex-col gap-2">
          {children || renderOptions()}
        </div>

        {/* Helper text */}
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

        {/* Error/Success indicator */}
        {error && (
          <div className="text-red-600 text-sm mt-0.5" role="alert">
            {typeof error === 'string' ? error : 'This field has an error'}
          </div>
        )}
      </div>
    );
  }),
);

RadioGroup.displayName = 'RadioGroup';

RadioGroup.propTypes = {
  /** Array of radio options. */
  options: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.node,
      value: PropTypes.any,
      disabled: PropTypes.bool,
    }),
  ),
  /** Group label. */
  label: PropTypes.node,
  /** Helper text displayed below the group. */
  helperText: PropTypes.node,
  /** Error state. */
  error: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  /** Success state. */
  success: PropTypes.bool,
  /** Controlled value. */
  value: PropTypes.any,
  /** Default value for uncontrolled mode. */
  defaultValue: PropTypes.any,
  /** Change handler. */
  onChange: PropTypes.func,
  /** Visual variant. */
  variant: PropTypes.oneOf(['default', 'primary', 'secondary', 'success', 'warning', 'error']),
  /** Size preset. */
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
  /** Disabled state. */
  disabled: PropTypes.bool,
  /** Loading state. */
  loading: PropTypes.bool,
  /** Required state. */
  required: PropTypes.bool,
  /** Orientation of radios. */
  orientation: PropTypes.oneOf(['vertical', 'horizontal']),
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
  /** Additional props for Radio components. */
  radioProps: PropTypes.object,
  /** Additional props for RadioContainer. */
  containerProps: PropTypes.object,
  /** Custom children (overrides options). */
  children: PropTypes.node,
};

export default RadioGroup;