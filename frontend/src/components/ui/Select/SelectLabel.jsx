/**
 * KisanO Design System — Select Package
 * SelectLabel
 *
 * A label component for Select fields. Renders label text with optional
 * required or optional indicators and accessibility support.
 *
 * Single Responsibility: Render a label for select fields.
 * Does not manage select state, options, or menu rendering.
 *
 * @module components/ui/Select/SelectLabel
 */

import { forwardRef, memo, useMemo } from 'react';
import PropTypes from 'prop-types';

import {
  SELECT_DEFAULTS,
} from './selectVariants';
import {
  mergeClasses,
  resolveResponsiveClasses,
  getSelectLabelClasses,
} from './selectUtils';

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
 * SelectLabel – a label for select fields.
 *
 * @component
 * @example
 * <SelectLabel htmlFor="select" required>
 *   Select an option
 * </SelectLabel>
 *
 * @example
 * <SelectLabel size="lg" optional>
 *   Choose your preference
 * </SelectLabel>
 */
const SelectLabel = memo(
  forwardRef(function SelectLabel(
    {
      children,
      htmlFor,
      size = DEFAULT_SIZE,
      required = false,
      optional = false,
      disabled = false,
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
      const base = getSelectLabelClasses({
        size,
        className,
        disabled,
      });
      return mergeClasses(base, responsiveClasses);
    }, [size, className, disabled, responsiveClasses]);

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
        className={labelClasses}
        {...ariaProps}
        {...rest}
      >
        {children}
        {required && (
          <span className="ml-1 text-red-500" aria-hidden="true">
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

SelectLabel.displayName = 'SelectLabel';

SelectLabel.propTypes = {
  /** Label content. */
  children: PropTypes.node,
  /** ID of the associated input/select. */
  htmlFor: PropTypes.string,
  /** Size preset (affects typography). */
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
  /** Whether the field is required. */
  required: PropTypes.bool,
  /** Whether the field is optional (shows "(optional)" text). */
  optional: PropTypes.bool,
  /** Disabled state. */
  disabled: PropTypes.bool,
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

export default SelectLabel;