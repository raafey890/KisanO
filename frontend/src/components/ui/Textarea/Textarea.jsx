/**
 * KisanO Design System — Textarea Package
 * Textarea
 *
 * The main Textarea component that orchestrates all textarea subcomponents.
 * Provides a convenient API for rendering textareas with labels,
 * helper text, character counters, and loading states.
 *
 * Single Responsibility: Orchestrate Textarea subcomponents.
 * Does not contain business logic, helper functions, or duplicate styling.
 *
 * @module components/ui/Textarea/Textarea
 */

import { forwardRef, memo, useMemo, useState, useCallback, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

import {
  TEXTAREA_DEFAULTS,
} from './textareaVariants';
import {
  mergeClasses,
  resolveResponsiveClasses,
  resolveDefaultProps,
  isInteractiveTextarea,
} from './textareaUtils';

import TextareaContainer from './TextareaContainer';
import TextareaLabel from './TextareaLabel';
import TextareaCounter from './TextareaCounter';
import TextareaLoader from './TextareaLoader';

/* ---------------------------------- */
/* Component                          */
/* ---------------------------------- */

/**
 * Textarea – the main textarea component with label and helper text.
 *
 * @component
 * @example
 * <Textarea
 *   label="Description"
 *   placeholder="Enter description..."
 *   value={description}
 *   onChange={setDescription}
 * />
 *
 * @example
 * <Textarea
 *   label="Bio"
 *   maxLength={200}
 *   showCounter
 *   autoResize
 *   helperText="Tell us about yourself"
 * />
 */
const Textarea = memo(
  forwardRef(function Textarea(
    {
      children,
      label,
      helperText,
      error,
      success,
      warning,
      value: controlledValue,
      defaultValue = '',
      onChange,
      onBlur,
      onFocus,
      onKeyDown,
      placeholder,
      name,
      id,
      variant = TEXTAREA_DEFAULTS.variant,
      size = TEXTAREA_DEFAULTS.size,
      radius = TEXTAREA_DEFAULTS.radius,
      shadow = TEXTAREA_DEFAULTS.shadow,
      resize = TEXTAREA_DEFAULTS.resize,
      disabled = false,
      readOnly = false,
      loading = false,
      required = false,
      rows = TEXTAREA_DEFAULTS.rows,
      maxLength,
      showCounter = false,
      autoResize = false,
      minHeight,
      maxHeight,
      responsive,
      className = '',
      labelClassName = '',
      helperClassName = '',
      counterClassName = '',
      containerProps,
      loaderProps,
      ...rest
    },
    ref,
  ) {
    // Internal state for uncontrolled mode.
    const [internalValue, setInternalValue] = useState(defaultValue);
    const textareaRef = useRef(null);
    const [isFocused, setIsFocused] = useState(false);

    // Determine if controlled or uncontrolled.
    const isControlled = controlledValue !== undefined;
    const value = isControlled ? controlledValue : internalValue;

    // Generate unique ID if not provided.
    const [generatedId] = useState(() => id || `textarea-${Math.random().toString(36).slice(2, 9)}`);
    const inputId = id || generatedId;

    // Handle change.
    const handleChange = useCallback(
      (event) => {
        if (disabled || readOnly || loading) return;

        const newValue = event.target.value;
        if (!isControlled) {
          setInternalValue(newValue);
        }
        onChange?.(event);

        // Auto resize.
        if (autoResize && textareaRef.current) {
          textareaRef.current.style.height = 'auto';
          textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
      },
      [disabled, readOnly, loading, isControlled, onChange, autoResize],
    );

    // Handle focus.
    const handleFocus = useCallback(
      (event) => {
        if (disabled || readOnly || loading) return;
        setIsFocused(true);
        onFocus?.(event);
      },
      [disabled, readOnly, loading, onFocus],
    );

    // Handle blur.
    const handleBlur = useCallback(
      (event) => {
        setIsFocused(false);
        onBlur?.(event);
      },
      [onBlur],
    );

    // Auto resize effect.
    useEffect(() => {
      if (autoResize && textareaRef.current) {
        textareaRef.current.style.height = 'auto';
        textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
      }
    }, [value, autoResize]);

    // Resize observer for auto resize.
    useEffect(() => {
      if (!autoResize || !textareaRef.current) return;

      const resizeObserver = new ResizeObserver(() => {
        if (textareaRef.current) {
          textareaRef.current.style.height = 'auto';
          textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
      });

      resizeObserver.observe(textareaRef.current);
      return () => resizeObserver.disconnect();
    }, [autoResize]);

    // Resolve defaults.
    const resolved = useMemo(
      () =>
        resolveDefaultProps({
          variant,
          size,
          radius,
          shadow,
          resize,
          disabled,
          required,
          rows,
        }),
      [variant, size, radius, shadow, resize, disabled, required, rows],
    );

    // Determine if interactive.
    const interactive = useMemo(
      () => isInteractiveTextarea({ disabled: resolved.disabled, readOnly, loading }),
      [resolved.disabled, readOnly, loading],
    );

    // Determine textarea state for styling.
    const textareaState = useMemo(() => {
      if (resolved.disabled || readOnly) return 'disabled';
      if (error) return 'error';
      if (success) return 'success';
      if (warning) return 'warning';
      if (isFocused) return 'focus';
      return 'default';
    }, [resolved.disabled, readOnly, error, success, warning, isFocused]);

    // Build helper text ID.
    const helperId = helperText ? `${inputId}-helper` : undefined;

    // Character count.
    const charCount = useMemo(() => {
      if (typeof value === 'string') {
        return value.length;
      }
      return 0;
    }, [value]);

    // Accessibility attributes.
    const ariaProps = useMemo(
      () => ({
        'aria-invalid': error ? true : undefined,
        'aria-describedby': helperId,
        'aria-required': required || undefined,
        'aria-label': typeof label === 'string' ? label : undefined,
      }),
      [error, helperId, required, label],
    );

    // Container props.
    const containerPropsMerged = useMemo(
      () => ({
        variant: resolved.variant,
        size: resolved.size,
        disabled: resolved.disabled,
        readOnly,
        loading,
        className,
        ...containerProps,
        ...rest,
      }),
      [resolved.variant, resolved.size, resolved.disabled, readOnly, loading, className, containerProps, rest],
    );

    // Label props.
    const labelProps = {
      size: resolved.size,
      disabled: resolved.disabled,
      className: labelClassName,
      error,
      success,
      warning,
      required,
    };

    // Counter props.
    const counterProps = {
      size: resolved.size,
      current: charCount,
      max: maxLength,
      className: counterClassName,
      error,
      warning,
    };

    // Loader props.
    const loaderPropsMerged = useMemo(
      () => ({
        size: resolved.size,
        variant: 'shimmer',
        rows: 3,
        disabled: resolved.disabled,
        ...loaderProps,
      }),
      [resolved.size, resolved.disabled, loaderProps],
    );

    // Handle loading state.
    const showLoader = loading;

    // Merge refs.
    const combinedRef = useCallback(
      (node) => {
        textareaRef.current = node;
        if (typeof ref === 'function') ref(node);
        else if (ref) ref.current = node;
      },
      [ref],
    );

    // Custom styles for auto resize.
    const customStyles = useMemo(() => {
      const styles = {};
      if (minHeight) styles.minHeight = minHeight;
      if (maxHeight) styles.maxHeight = maxHeight;
      return styles;
    }, [minHeight, maxHeight]);

    return (
      <TextareaContainer ref={combinedRef} {...containerPropsMerged}>
        {/* Label */}
        {label && (
          <TextareaLabel htmlFor={inputId} {...labelProps}>
            {label}
          </TextareaLabel>
        )}

        {/* Textarea or Loader */}
        {showLoader ? (
          <TextareaLoader {...loaderPropsMerged} />
        ) : (
          <textarea
            id={inputId}
            name={name}
            value={value}
            defaultValue={defaultValue}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onKeyDown={onKeyDown}
            placeholder={placeholder}
            disabled={disabled}
            readOnly={readOnly}
            required={required}
            rows={rows}
            maxLength={maxLength}
            className={mergeClasses(
              'w-full',
              'transition-all duration-200 ease-in-out',
              'focus:outline-none',
              resolved.variant === 'default' && 'bg-white',
              resolved.variant === 'filled' && 'bg-gray-50 hover:bg-gray-100 focus:bg-white',
              resolved.variant === 'outlined' && 'bg-transparent border-2',
              resolved.variant === 'ghost' && 'bg-transparent',
              getTextareaRadius(resolved.radius),
              getTextareaShadow(resolved.shadow),
              getTextareaResize(resolved.resize),
              getTextareaState(textareaState).background,
              getTextareaState(textareaState).border,
              getTextareaState(textareaState).text,
              disabled && 'opacity-50 cursor-not-allowed',
              readOnly && 'cursor-default',
              className,
            )}
            style={customStyles}
            {...ariaProps}
          />
        )}

        {/* Helper text and character counter */}
        {(helperText || showCounter) && (
          <div className="flex items-start justify-between gap-4 mt-1.5">
            {helperText && (
              <div
                id={helperId}
                className={mergeClasses(
                  'text-sm flex-1',
                  error ? 'text-red-600' : success ? 'text-green-600' : warning ? 'text-yellow-600' : 'text-gray-500',
                  helperClassName,
                )}
              >
                {helperText}
              </div>
            )}
            {showCounter && maxLength && (
              <TextareaCounter {...counterProps} />
            )}
          </div>
        )}

        {children}
      </TextareaContainer>
    );
  }),
);

Textarea.displayName = 'Textarea';

Textarea.propTypes = {
  /** Textarea label. */
  label: PropTypes.node,
  /** Helper text displayed below the textarea. */
  helperText: PropTypes.node,
  /** Error state. */
  error: PropTypes.bool,
  /** Success state. */
  success: PropTypes.bool,
  /** Warning state. */
  warning: PropTypes.bool,
  /** Controlled value. */
  value: PropTypes.string,
  /** Default value for uncontrolled mode. */
  defaultValue: PropTypes.string,
  /** Change handler. */
  onChange: PropTypes.func,
  /** Blur handler. */
  onBlur: PropTypes.func,
  /** Focus handler. */
  onFocus: PropTypes.func,
  /** KeyDown handler. */
  onKeyDown: PropTypes.func,
  /** Placeholder text. */
  placeholder: PropTypes.string,
  /** Input name. */
  name: PropTypes.string,
  /** Input ID. */
  id: PropTypes.string,
  /** Visual variant. */
  variant: PropTypes.oneOf(['default', 'filled', 'outlined', 'ghost']),
  /** Size preset. */
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
  /** Border radius override. */
  radius: PropTypes.oneOf(['none', 'sm', 'md', 'lg', 'xl', '2xl', 'full']),
  /** Shadow level. */
  shadow: PropTypes.oneOf(['none', 'sm', 'md', 'lg', 'xl', '2xl']),
  /** Resize behavior. */
  resize: PropTypes.oneOf(['none', 'both', 'horizontal', 'vertical']),
  /** Disabled state. */
  disabled: PropTypes.bool,
  /** Read-only state. */
  readOnly: PropTypes.bool,
  /** Loading state. */
  loading: PropTypes.bool,
  /** Required state. */
  required: PropTypes.bool,
  /** Number of rows. */
  rows: PropTypes.number,
  /** Maximum character length. */
  maxLength: PropTypes.number,
  /** Whether to show character counter. */
  showCounter: PropTypes.bool,
  /** Whether to auto-resize the textarea. */
  autoResize: PropTypes.bool,
  /** Minimum height for auto-resize. */
  minHeight: PropTypes.string,
  /** Maximum height for auto-resize. */
  maxHeight: PropTypes.string,
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
  /** Additional CSS classes for the counter. */
  counterClassName: PropTypes.string,
  /** Additional props for TextareaContainer. */
  containerProps: PropTypes.object,
  /** Additional props for TextareaLoader. */
  loaderProps: PropTypes.object,
  /** Additional content. */
  children: PropTypes.node,
};

export default Textarea;