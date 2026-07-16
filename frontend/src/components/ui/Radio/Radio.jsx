/**
 * KisanO Design System — Radio Package
 * Radio
 *
 * The main Radio component that orchestrates all radio subcomponents.
 * Provides a convenient API for rendering radios with labels,
 * helper text, error states, and loading states.
 *
 * Single Responsibility: Orchestrate Radio subcomponents.
 * Does not contain business logic, helper functions, or duplicate styling.
 *
 * @module components/ui/Radio/Radio
 */

import { forwardRef, memo, useMemo, useState, useCallback } from 'react';
import PropTypes from 'prop-types';

import {
  RADIO_DEFAULTS,
} from './radioVariants';
import {
  mergeClasses,
  resolveDefaultProps,
  isInteractiveRadio,
} from './radioUtils';

import RadioContainer from './RadioContainer';
import RadioIndicator from './RadioIndicator';
import RadioLabel from './RadioLabel';
import RadioLoader from './RadioLoader';

/* ---------------------------------- */
/* Component                          */
/* ---------------------------------- */

/**
 * Radio – the main radio component with label and helper text.
 *
 * @component
 * @example
 * <Radio
 *   label="Option 1"
 *   name="group"
 *   checked={selected === '1'}
 *   onChange={() => setSelected('1')}
 * />
 *
 * @example
 * <Radio
 *   label="Subscribe"
 *   defaultChecked
 *   disabled
 *   helperText="You can change later"
 * />
 */
const Radio = memo(
  forwardRef(function Radio(
    {
      children,
      label,
      helperText,
      error,
      success,
      checked: controlledChecked,
      defaultChecked = false,
      onChange,
      onBlur,
      onFocus,
      name,
      value,
      variant = RADIO_DEFAULTS.variant,
      size = RADIO_DEFAULTS.size,
      radius = RADIO_DEFAULTS.radius,
      shadow = RADIO_DEFAULTS.shadow,
      disabled = false,
      loading = false,
      required = false,
      responsive,
      className = '',
      labelClassName = '',
      helperClassName = '',
      id,
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
    const [generatedId] = useState(() => id || `radio-${Math.random().toString(36).slice(2, 9)}`);
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
          disabled,
          required,
        }),
      [variant, size, radius, shadow, checked, disabled, required, isControlled],
    );

    // Determine if interactive.
    const interactive = useMemo(
      () => isInteractiveRadio({ disabled: resolved.disabled }),
      [resolved.disabled],
    );

    // Determine radio state for styling.
    const radioState = useMemo(() => {
      if (resolved.disabled) return 'disabled';
      if (error) return 'error';
      if (success) return 'success';
      if (resolved.checked) return 'checked';
      return 'default';
    }, [resolved.disabled, error, success, resolved.checked]);

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
      disabled: resolved.disabled,
      loading,
      state: radioState,
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
      <RadioContainer ref={ref} {...containerPropsMerged}>
        {/* Hidden input for form submission */}
        <input
          type="radio"
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
          {...ariaProps}
        />

        {/* Visual radio */}
        <div className="flex items-start">
          <RadioIndicator {...indicatorProps} />

          {/* Label and helper text */}
          <div className="flex-1 min-w-0">
            {showLoader ? (
              <RadioLoader {...loaderPropsMerged} />
            ) : (
              <>
                {label && (
                  <RadioLabel
                    htmlFor={inputId}
                    {...labelProps}
                  >
                    {label}
                    {required && (
                      <span className="ml-0.5 text-red-500" aria-hidden="true">
                        *
                      </span>
                    )}
                  </RadioLabel>
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
      </RadioContainer>
    );
  }),
);

Radio.displayName = 'Radio';

Radio.propTypes = {
  /** Radio label. */
  label: PropTypes.node,
  /** Helper text displayed below the radio. */
  helperText: PropTypes.node,
  /** Error state. */
  error: PropTypes.bool,
  /** Success state. */
  success: PropTypes.bool,
  /** Controlled checked state. */
  checked: PropTypes.bool,
  /** Default checked state for uncontrolled mode. */
  defaultChecked: PropTypes.bool,
  /** Change handler. */
  onChange: PropTypes.func,
  /** Blur handler. */
  onBlur: PropTypes.func,
  /** Focus handler. */
  onFocus: PropTypes.func,
  /** Radio group name. */
  name: PropTypes.string,
  /** Radio value. */
  value: PropTypes.any,
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
  /** Additional props for RadioContainer. */
  containerProps: PropTypes.object,
  /** Additional props for RadioLoader. */
  loaderProps: PropTypes.object,
  /** Additional content. */
  children: PropTypes.node,
};

export default Radio;