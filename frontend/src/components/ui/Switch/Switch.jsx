/**
 * KisanO Design System — Switch Package
 * Switch
 *
 * The main Switch component that orchestrates all switch subcomponents.
 * Provides a convenient API for rendering switches with labels,
 * helper text, error states, and loading states.
 *
 * Single Responsibility: Orchestrate Switch subcomponents.
 * Does not contain business logic, helper functions, or duplicate styling.
 *
 * @module components/ui/Switch/Switch
 */

import { forwardRef, memo, useMemo, useState, useCallback } from 'react';
import PropTypes from 'prop-types';

import {
  SWITCH_DEFAULTS,
} from './switchVariants';
import {
  mergeClasses,
  resolveResponsiveClasses,
  resolveDefaultProps,
  isInteractiveSwitch,
} from './switchUtils';

import SwitchContainer from './SwitchContainer';
import SwitchThumb from './SwitchThumb';
import SwitchLabel from './SwitchLabel';
import SwitchLoader from './SwitchLoader';

/* ---------------------------------- */
/* Component                          */
/* ---------------------------------- */

/**
 * Switch – the main switch component with label and helper text.
 *
 * @component
 * @example
 * <Switch
 *   label="Enable notifications"
 *   checked={isEnabled}
 *   onChange={setIsEnabled}
 * />
 *
 * @example
 * <Switch
 *   label="Dark mode"
 *   defaultChecked
 *   disabled
 *   helperText="Apply dark theme"
 * />
 */
const Switch = memo(
  forwardRef(function Switch(
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
      variant = SWITCH_DEFAULTS.variant,
      size = SWITCH_DEFAULTS.size,
      radius = SWITCH_DEFAULTS.radius,
      shadow = SWITCH_DEFAULTS.shadow,
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
    const [generatedId] = useState(() => id || `switch-${Math.random().toString(36).slice(2, 9)}`);
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
      () => isInteractiveSwitch({ disabled: resolved.disabled }),
      [resolved.disabled],
    );

    // Determine switch state for styling.
    const switchState = useMemo(() => {
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

    // Thumb props.
    const thumbProps = {
      variant: resolved.variant,
      size: resolved.size,
      radius: resolved.radius,
      shadow: resolved.shadow,
      checked: resolved.checked,
      disabled: resolved.disabled,
      loading,
      state: switchState,
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
      <SwitchContainer ref={ref} {...containerPropsMerged}>
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
          role="switch"
          aria-checked={checked}
          {...ariaProps}
        />

        {/* Visual switch */}
        <div className="flex items-start">
          <SwitchThumb {...thumbProps} />

          {/* Label and helper text */}
          <div className="flex-1 min-w-0">
            {showLoader ? (
              <SwitchLoader {...loaderPropsMerged} />
            ) : (
              <>
                {label && (
                  <SwitchLabel
                    htmlFor={inputId}
                    {...labelProps}
                  >
                    {label}
                    {required && (
                      <span className="ml-0.5 text-red-500" aria-hidden="true">
                        *
                      </span>
                    )}
                  </SwitchLabel>
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
      </SwitchContainer>
    );
  }),
);

Switch.displayName = 'Switch';

Switch.propTypes = {
  /** Switch label. */
  label: PropTypes.node,
  /** Helper text displayed below the switch. */
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
  /** Switch name for form submission. */
  name: PropTypes.string,
  /** Switch value. */
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
  /** Additional props for SwitchContainer. */
  containerProps: PropTypes.object,
  /** Additional props for SwitchLoader. */
  loaderProps: PropTypes.object,
  /** Additional content. */
  children: PropTypes.node,
};

export default Switch;