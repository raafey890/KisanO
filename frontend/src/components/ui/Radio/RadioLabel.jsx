/**
 * KisanO Design System — Radio Package
 * RadioLabel
 *
 * A label component for Radio fields. Renders label text with optional
 * required or optional indicators and accessibility support.
 *
 * Single Responsibility: Render a label for radio fields.
 * Does not manage radio state or input logic.
 *
 * @module components/ui/Radio/RadioLabel
 */

import { forwardRef, memo, useMemo } from 'react';
import PropTypes from 'prop-types';

import {
  RADIO_DEFAULTS,
} from './radioVariants';
import {
  mergeClasses,
  resolveResponsiveClasses,
  getRadioLabelClasses,
} from './radioUtils';

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
 * RadioLabel – a label for radio fields.
 *
 * @component
 * @example
 * <RadioLabel htmlFor="option1" required>
 *   Option 1
 * </RadioLabel>
 *
 * @example
 * <RadioLabel size="lg" optional>
 *   Choose your preference
 * </RadioLabel>
 */
const RadioLabel = memo(
  forwardRef(function RadioLabel(
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
      const base = getRadioLabelClasses({
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

RadioLabel.displayName = 'RadioLabel';

RadioLabel.propTypes = {
  /** Label content. */
  children: PropTypes.node,
  /** ID of the associated radio input. */
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

export default RadioLabel;