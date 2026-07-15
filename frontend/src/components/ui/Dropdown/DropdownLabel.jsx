/**
 * KisanO Design System — Dropdown Package
 * DropdownLabel
 *
 * A label for dropdown sections or groups. Provides visual hierarchy
 * and semantic structure for dropdown menus.
 *
 * Single Responsibility: Render a label for dropdown sections.
 * Does not manage dropdown state or item rendering.
 *
 * @module components/ui/Dropdown/DropdownLabel
 */

import { forwardRef, memo, useMemo } from 'react';
import PropTypes from 'prop-types';

import {
  DROPDOWN_DEFAULTS,
} from './dropdownVariants';
import {
  mergeClasses,
  resolveResponsiveClasses,
  getDropdownLabelClasses,
} from './dropdownUtils';

/* ---------------------------------- */
/* Component                          */
/* ---------------------------------- */

/**
 * DropdownLabel – a section label for dropdown menus.
 *
 * @component
 * @example
 * <DropdownLabel>Actions</DropdownLabel>
 *
 * @example
 * <DropdownLabel size="sm" disabled>Disabled Section</DropdownLabel>
 */
const DropdownLabel = memo(
  forwardRef(function DropdownLabel(
    {
      children,
      size = DROPDOWN_DEFAULTS.size,
      disabled = false,
      responsive,
      className = '',
      role = 'presentation',
      ...rest
    },
    ref,
  ) {
    // Label classes.
    const labelClasses = useMemo(
      () =>
        getDropdownLabelClasses({
          size,
          className,
          disabled,
        }),
      [size, className, disabled],
    );

    // Responsive overrides.
    const responsiveClasses = useMemo(
      () => (responsive ? resolveResponsiveClasses(responsive) : ''),
      [responsive],
    );

    const finalClasses = useMemo(
      () => mergeClasses(labelClasses, responsiveClasses),
      [labelClasses, responsiveClasses],
    );

    // Accessibility attributes.
    const ariaProps = useMemo(
      () => ({
        role,
        'aria-disabled': disabled || undefined,
      }),
      [role, disabled],
    );

    return (
      <div
        ref={ref}
        className={finalClasses}
        {...ariaProps}
        {...rest}
      >
        {children}
      </div>
    );
  }),
);

DropdownLabel.displayName = 'DropdownLabel';

DropdownLabel.propTypes = {
  /** Label content. */
  children: PropTypes.node,
  /** Size preset (affects text size and padding). */
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
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

export default DropdownLabel;