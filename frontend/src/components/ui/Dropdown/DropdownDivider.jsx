/**
 * KisanO Design System — Dropdown Package
 * DropdownDivider
 *
 * A visual divider for separating dropdown items into groups.
 * Provides a horizontal line with proper accessibility attributes.
 *
 * Single Responsibility: Render a visual divider.
 * Does not manage dropdown state or item rendering.
 *
 * @module components/ui/Dropdown/DropdownDivider
 */

import { forwardRef, memo, useMemo } from 'react';
import PropTypes from 'prop-types';

import {
  mergeClasses,
  resolveResponsiveClasses,
  getDropdownDividerClasses,
} from './dropdownUtils';

/* ---------------------------------- */
/* Component                          */
/* ---------------------------------- */

/**
 * DropdownDivider – a separator between dropdown items.
 *
 * @component
 * @example
 * <DropdownDivider />
 *
 * @example
 * <DropdownDivider className="my-2 border-gray-300" />
 */
const DropdownDivider = memo(
  forwardRef(function DropdownDivider(
    {
      className = '',
      responsive,
      role = 'separator',
      'aria-orientation': ariaOrientation = 'horizontal',
      ...rest
    },
    ref,
  ) {
    // Divider classes.
    const dividerClasses = useMemo(
      () => getDropdownDividerClasses(className),
      [className],
    );

    // Responsive overrides.
    const responsiveClasses = useMemo(
      () => (responsive ? resolveResponsiveClasses(responsive) : ''),
      [responsive],
    );

    const finalClasses = useMemo(
      () => mergeClasses(dividerClasses, responsiveClasses),
      [dividerClasses, responsiveClasses],
    );

    // Accessibility attributes.
    const ariaProps = useMemo(
      () => ({
        role,
        'aria-orientation': ariaOrientation,
      }),
      [role, ariaOrientation],
    );

    return (
      <div
        ref={ref}
        className={finalClasses}
        {...ariaProps}
        {...rest}
      />
    );
  }),
);

DropdownDivider.displayName = 'DropdownDivider';

DropdownDivider.propTypes = {
  /** Additional CSS classes. */
  className: PropTypes.string,
  /** Responsive overrides. */
  responsive: PropTypes.shape({
    xs: PropTypes.string,
    sm: PropTypes.string,
    md: PropTypes.string,
    lg: PropTypes.string,
    xl: PropTypes.string,
  }),
  /** ARIA role. */
  role: PropTypes.string,
  /** ARIA orientation. */
  'aria-orientation': PropTypes.oneOf(['horizontal', 'vertical']),
};

export default DropdownDivider;