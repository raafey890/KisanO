/**
 * KisanO Design System — Checkbox Package
 * CheckboxGroup
 *
 * A group of checkboxes that manages multiple checkbox states.
 * Provides a convenient API for rendering a group of checkboxes
 * with validation, disabled states, and accessibility support.
 *
 * Single Responsibility: Manage a group of checkboxes.
 * Does not contain business logic or duplicate styling.
 *
 * @module components/ui/Checkbox/CheckboxGroup
 */

import { forwardRef, memo, useMemo, useCallback, useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import {
  CHECKBOX_DEFAULTS,
} from './checkboxVariants';
import {
  mergeClasses,
  resolveResponsiveClasses,
  resolveDefaultProps,
} from './checkboxUtils';

import Checkbox from './Checkbox';
import CheckboxContainer from './CheckboxContainer';
import CheckboxLabel from './CheckboxLabel';

/* ---------------------------------- */
/* Component                          */
/* ---------------------------------- */

/**
 * CheckboxGroup – a group of checkboxes with shared state.
 *
 * @component
 * @example
 * <CheckboxGroup
 *   options={[
 *     { label: 'Option 1', value: '1' },
 *     { label: 'Option 2', value: '2' },
 *   ]}
 *   value={['1']}
 *   onChange={handleChange}
 * />
 *
 * @example
 * <CheckboxGroup
 *   options={options}
 *   label="Select your preferences"
 *   required
 *   error={hasError}
 * />
 */
const CheckboxGroup = memo(
  forwardRef(function CheckboxGroup(
    {
      children,
      options = [],
      label,
      helperText,
      error,
      success,
      value: controlledValue,
      defaultValue = [],
      onChange,
      variant = CHECKBOX_DEFAULTS.variant,
      size = CHECKBOX_DEFAULTS.size,
      disabled = false,
      loading = false,
      required = false,
      orientation = 'vertical',
      responsive,
      className = '',
      labelClassName = '',
      helperClassName = '',
      checkboxProps,
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
    const [generatedId] = useState(() => `checkbox-group-${Math.random().toString(36).slice(2, 9)}`);
    const groupId = rest.id || generatedId;

    // Handle checkbox change.
    const handleCheckboxChange = useCallback(
      (checkboxValue, event) => {
        if (disabled || loading) return;

        let newValue;
        if (Array.isArray(value)) {
          const index = value.indexOf(checkboxValue);
          if (index > -1) {
            newValue = value.filter((v) => v !== checkboxValue);
          } else {
            newValue = [...value, checkboxValue];
          }
        } else {
          newValue = value === checkboxValue ? null : checkboxValue;
        }

        if (!isControlled) {
          setInternalValue(newValue);
        }
        onChange?.(newValue, event);
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

    // Check if a value is selected.
    const isValueSelected = useCallback(
      (val) => {
        if (Array.isArray(value)) {
          return value.includes(val);
        }
        return value === val;
      },
      [value],
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
        role: 'group',
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
        const isChecked = isValueSelected(optionValue);
        const optionDisabled = option.disabled || disabled;

        return (
          <Checkbox
            key={optionValue}
            label={option.label}
            checked={isChecked}
            onChange={(event) => handleCheckboxChange(optionValue, event)}
            disabled={optionDisabled}
            variant={resolved.variant}
            size={resolved.size}
            required={required}
            {...checkboxProps}
          />
        );
      });
    }, [
      options,
      isValueSelected,
      handleCheckboxChange,
      disabled,
      resolved.variant,
      resolved.size,
      required,
      checkboxProps,
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
          <CheckboxLabel
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
          </CheckboxLabel>
        )}

        {/* Checkboxes */}
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

CheckboxGroup.displayName = 'CheckboxGroup';

CheckboxGroup.propTypes = {
  /** Array of checkbox options. */
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
  /** Controlled value (array for multiple selection). */
  value: PropTypes.oneOfType([
    PropTypes.any,
    PropTypes.arrayOf(PropTypes.any),
  ]),
  /** Default value for uncontrolled mode. */
  defaultValue: PropTypes.oneOfType([
    PropTypes.any,
    PropTypes.arrayOf(PropTypes.any),
  ]),
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
  /** Orientation of checkboxes. */
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
  /** Additional props for Checkbox components. */
  checkboxProps: PropTypes.object,
  /** Additional props for CheckboxContainer. */
  containerProps: PropTypes.object,
  /** Custom children (overrides options). */
  children: PropTypes.node,
};

export default CheckboxGroup;