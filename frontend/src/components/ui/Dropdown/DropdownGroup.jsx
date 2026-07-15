/**
 * KisanO Design System — Dropdown Package
 * DropdownGroup
 *
 * A group of dropdown items with an optional label. Provides visual
 * grouping and semantic structure for dropdown menus.
 *
 * Single Responsibility: Group dropdown items with a label.
 * Does not manage item selection, state, or menu rendering.
 *
 * @module components/ui/Dropdown/DropdownGroup
 */

import { forwardRef, memo, useMemo } from 'react';
import PropTypes from 'prop-types';

import {
  DROPDOWN_DEFAULTS,
} from './dropdownVariants';
import {
  mergeClasses,
  resolveResponsiveClasses,
  getDropdownGroupClasses,
  getDropdownLabelClasses,
} from './dropdownUtils';

/* ---------------------------------- */
/* Component                          */
/* ---------------------------------- */

/**
 * DropdownGroup – a group of dropdown items with an optional label.
 *
 * @component
 * @example
 * <DropdownGroup label="Actions">
 *   <DropdownItem label="Edit" />
 *   <DropdownItem label="Delete" />
 * </DropdownGroup>
 *
 * @example
 * <DropdownGroup>
 *   <DropdownItem label="Save" />
 *   <DropdownItem label="Export" />
 * </DropdownGroup>
 */
const DropdownGroup = memo(
  forwardRef(function DropdownGroup(
    {
      children,
      label,
      size = DROPDOWN_DEFAULTS.size,
      disabled = false,
      responsive,
      className = '',
      role = 'group',
      'aria-label': ariaLabel,
      ...rest
    },
    ref,
  ) {
    // Group classes.
    const groupClasses = useMemo(
      () => getDropdownGroupClasses(className),
      [className],
    );

    // Label classes.
    const labelClasses = useMemo(
      () =>
        getDropdownLabelClasses({
          size,
          className: '',
          disabled,
        }),
      [size, disabled],
    );

    // Responsive overrides.
    const responsiveClasses = useMemo(
      () => (responsive ? resolveResponsiveClasses(responsive) : ''),
      [responsive],
    );

    const finalGroupClasses = useMemo(
      () => mergeClasses(groupClasses, responsiveClasses),
      [groupClasses, responsiveClasses],
    );

    // Accessibility attributes.
    const ariaProps = useMemo(
      () => ({
        role,
        'aria-label': ariaLabel || label || 'Dropdown group',
        'aria-disabled': disabled || undefined,
      }),
      [role, ariaLabel, label, disabled],
    );

    return (
      <div
        ref={ref}
        className={finalGroupClasses}
        {...ariaProps}
        {...rest}
      >
        {label && (
          <div className={labelClasses}>
            {label}
          </div>
        )}
        {children}
      </div>
    );
  }),
);

DropdownGroup.displayName = 'DropdownGroup';

DropdownGroup.propTypes = {
  /** Group items. */
  children: PropTypes.node,
  /** Group label. */
  label: PropTypes.node,
  /** Size preset (affects label styling). */
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
  /** Accessible label. */
  'aria-label': PropTypes.string,
};

export default DropdownGroup;