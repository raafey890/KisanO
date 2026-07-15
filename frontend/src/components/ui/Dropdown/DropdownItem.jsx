/**
 * KisanO Design System — Dropdown Package
 * DropdownItem
 *
 * A single item in the dropdown menu. Supports selection, active states,
 * variants (danger, success, warning), icons, and keyboard accessibility.
 *
 * Single Responsibility: Render a single dropdown item.
 * Does not manage dropdown state or menu rendering.
 *
 * @module components/ui/Dropdown/DropdownItem
 */

import { forwardRef, memo, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { motion, useReducedMotion } from 'framer-motion';

import {
  DROPDOWN_DEFAULTS,
} from './dropdownVariants';
import {
  mergeClasses,
  resolveResponsiveClasses,
  getDropdownItemClasses,
} from './dropdownUtils';

/* ---------------------------------- */
/* Component-specific tokens          */
/* ---------------------------------- */

/** Motion variants for item interaction feedback. */
const ITEM_MOTION = {
  initial: { scale: 1 },
  hover: { scale: 1.02 },
  tap: { scale: 0.98 },
  transition: { duration: 0.15, ease: [0.4, 0, 0.2, 1] },
};

/** Keyboard keys for item interaction. */
const ITEM_KEYS = {
  ENTER: 'Enter',
  SPACE: ' ',
};

/* ---------------------------------- */
/* Component                          */
/* ---------------------------------- */

/**
 * DropdownItem – a single dropdown menu item.
 *
 * @component
 * @example
 * <DropdownItem
 *   label="Edit"
 *   icon={<EditIcon />}
 *   onClick={handleEdit}
 * />
 *
 * @example
 * <DropdownItem
 *   label="Delete"
 *   variant="danger"
 *   disabled
 * />
 */
const DropdownItem = memo(
  forwardRef(function DropdownItem(
    {
      children,
      label,
      icon,
      variant = 'default',
      selected = false,
      active = false,
      disabled = false,
      onClick,
      size = DROPDOWN_DEFAULTS.size,
      responsive,
      className = '',
      role = 'option',
      'aria-label': ariaLabel,
      ...rest
    },
    ref,
  ) {
    const prefersReducedMotion = useReducedMotion();

    // Determine the state for styling.
    const state = useMemo(() => {
      if (disabled) return 'disabled';
      if (variant === 'danger') return 'danger';
      if (variant === 'success') return 'success';
      if (variant === 'warning') return 'warning';
      if (selected) return 'selected';
      if (active) return 'active';
      return 'default';
    }, [disabled, variant, selected, active]);

    // Get item classes.
    const itemClasses = useMemo(
      () =>
        getDropdownItemClasses({
          state,
          size,
          className,
          disabled,
        }),
      [state, size, className, disabled],
    );

    // Responsive overrides.
    const responsiveClasses = useMemo(
      () => (responsive ? resolveResponsiveClasses(responsive) : ''),
      [responsive],
    );

    const finalClasses = useMemo(
      () => mergeClasses(itemClasses, responsiveClasses),
      [itemClasses, responsiveClasses],
    );

    // Handle click.
    const handleClick = useCallback(
      (event) => {
        if (disabled) return;
        onClick?.(event);
      },
      [disabled, onClick],
    );

    // Handle key down.
    const handleKeyDown = useCallback(
      (event) => {
        if (disabled) return;
        if (event.key === ITEM_KEYS.ENTER || event.key === ITEM_KEYS.SPACE) {
          event.preventDefault();
          onClick?.(event);
        }
      },
      [disabled, onClick],
    );

    // Motion props - respect reduced motion.
    const motionProps = useMemo(() => {
      if (prefersReducedMotion || disabled) {
        return {
          whileHover: undefined,
          whileTap: undefined,
          transition: undefined,
        };
      }
      return {
        whileHover: { scale: ITEM_MOTION.hover.scale },
        whileTap: { scale: ITEM_MOTION.tap.scale },
        transition: ITEM_MOTION.transition,
      };
    }, [prefersReducedMotion, disabled]);

    // Accessibility attributes.
    const ariaProps = useMemo(
      () => ({
        role,
        'aria-label': ariaLabel || label || 'Dropdown item',
        'aria-selected': selected || undefined,
        'aria-disabled': disabled || undefined,
        tabIndex: disabled ? -1 : 0,
      }),
      [role, ariaLabel, label, selected, disabled],
    );

    // Content to render.
    const content = (
      <>
        {icon && <span className="shrink-0">{icon}</span>}
        <span>{children || label}</span>
        {selected && (
          <span className="ml-auto" aria-hidden="true">
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              viewBox="0 0 24 24"
            >
              <path d="M20 6L9 17l-5-5" />
            </svg>
          </span>
        )}
      </>
    );

    return (
      <motion.button
        ref={ref}
        type="button"
        className={finalClasses}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        {...motionProps}
        {...ariaProps}
        {...rest}
      >
        {content}
      </motion.button>
    );
  }),
);

DropdownItem.displayName = 'DropdownItem';

DropdownItem.propTypes = {
  /** Item content (alternative to label). */
  children: PropTypes.node,
  /** Item label. */
  label: PropTypes.node,
  /** Optional icon. */
  icon: PropTypes.node,
  /** Visual variant. */
  variant: PropTypes.oneOf(['default', 'danger', 'success', 'warning']),
  /** Whether the item is selected. */
  selected: PropTypes.bool,
  /** Whether the item is actively hovered/focused. */
  active: PropTypes.bool,
  /** Disabled state. */
  disabled: PropTypes.bool,
  /** Click handler. */
  onClick: PropTypes.func,
  /** Size preset. */
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
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

export default DropdownItem;