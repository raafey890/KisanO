/**
 * KisanO Design System — Checkbox Package
 * CheckboxLabel
 *
 * A label component for Checkbox fields. Renders label text with optional
 * required or optional indicators and accessibility support.
 *
 * Single Responsibility: Render a label for checkbox fields.
 * Does not manage checkbox state or input logic.
 *
 * @module components/ui/Checkbox/CheckboxLabel
 */

import { forwardRef, memo, useMemo } from 'react';
import PropTypes from 'prop-types';

import {
  CHECKBOX_DEFAULTS,
} from './checkboxVariants';
import {
  mergeClasses,
  resolveResponsiveClasses,
  getCheckboxLabelClasses,
} from './checkboxUtils';

/* ---------------------------------- */
/* Component-specific tokens          */
/* ---------------------------------- */

/** Size mapping for label typography. */
const LABEL_SIZES = {
  xs: 'text-xs',
  sm: 'text-sm',
  md: 'text-sm',
  lg: 'text-base',
  xl: 'text-base',
};

/** Default size when not provided. */
const DEFAULT_SIZE = 'md';

/* ---------------------------------- */
/* Component                          */
/* ---------------------------------- */

/**
 * CheckboxLabel – a label for checkbox fields.
 *
 * @component
 * @example
 * <CheckboxLabel htmlFor="terms" required>
 *   Accept terms and conditions
 * </CheckboxLabel>
 *
 * @example
 * <CheckboxLabel size="lg" optional>
 *   Subscribe to newsletter
 * </CheckboxLabel>
 */
const CheckboxLabel = memo(
  forwardRef(function CheckboxLabel(
    {
      children,
      htmlFor,
      size = DEFAULT_SIZE,
      required = false,
      optional = false,
      disabled = false,
      error = false,
      success = false,
      responsive,
      className = '',
      role = 'label',
      ...rest
    },
    ref,
  ) {
    // Resolve size class.
    const sizeClass = useMemo(
      () => LABEL_SIZES[size] || LABEL_SIZES[DEFAULT_SIZE],
      [size],
    );

    // Responsive overrides.
    const responsiveClasses = useMemo(
      () => (responsive ? resolveResponsiveClasses(responsive) : ''),
      [responsive],
    );

    // Label classes.
    const labelClasses = useMemo(() => {
      const base = getCheckboxLabelClasses({
        size,
        className,
        disabled,
      });
      return mergeClasses(base, responsiveClasses);
    }, [size, className, disabled, responsiveClasses]);

    // Determine text color based on state.
    const textColorClasses = useMemo(() => {
      if (error) return 'text-red-600';
      if (success) return 'text-green-600';
      if (disabled) return 'text-gray-400';
      return 'text-gray-700';
    }, [error, success, disabled]);

    // Final classes with state colors.
    const finalClasses = useMemo(
      () => mergeClasses(labelClasses, textColorClasses),
      [labelClasses, textColorClasses],
    );

    // Accessibility attributes.
    const ariaProps = useMemo(
      () => ({
        role,
        'aria-disabled': disabled || undefined,
        'aria-required': required || undefined,
      }),
      [role, disabled, required],
    );

    // If no children, render nothing.
    if (!children) {
      return null;
    }

    return (
      <label
        ref={ref}
        htmlFor={htmlFor}
        className={finalClasses}
        {...ariaProps}
        {...rest}
      >
        {children}
        {required && (
          <span className="ml-0.5 text-red-500" aria-hidden="true">
            *
          </span>
        )}
        {optional && !required && (
          <span className="ml-1 text-gray-400 text-xs font-normal" aria-hidden="true">
            (optional)
          </span>
        )}
      </label>
    );
  }),
);

CheckboxLabel.displayName = 'CheckboxLabel';

CheckboxLabel.propTypes = {
  /** Label content. */
  children: PropTypes.node,
  /** ID of the associated checkbox input. */
  htmlFor: PropTypes.string,
  /** Size preset (affects typography). */
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
  /** Whether the field is required. */
  required: PropTypes.bool,
  /** Whether the field is optional (shows "(optional)" text). */
  optional: PropTypes.bool,
  /** Disabled state. */
  disabled: PropTypes.bool,
  /** Error state. */
  error: PropTypes.bool,
  /** Success state. */
  success: PropTypes.bool,
  /** Responsive overrides. */
  responsive: PropTypes.shape({
    xs: PropTypes.string,
    sm: PropTypes.string,
    md: PropTypes.string,
    lg: PropTypes.string,
    xl: PropTypes.string,
  }),
  /** Additional CSS classes. */
  className: PropTypes.string,
  /** ARIA role. */
  role: PropTypes.string,
};

export default CheckboxLabel;