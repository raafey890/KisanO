/**
 * KisanO Design System — Select Package
 * SelectOption
 *
 * A single option in the select menu. Supports selection, disabled states,
 * icons, and keyboard accessibility.
 *
 * Single Responsibility: Render a single select option.
 * Does not manage select state or menu rendering.
 *
 * @module components/ui/Select/SelectOption
 */

import { forwardRef, memo, useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import { motion, useReducedMotion } from 'framer-motion';

import {
  SELECT_DEFAULTS,
} from './selectVariants';
import {
  mergeClasses,
  resolveResponsiveClasses,
  getSelectOptionClasses,
} from './selectUtils';

/* ---------------------------------- */
/* Component-specific tokens          */
/* ---------------------------------- */

/** Motion variants for option interaction feedback. */
const OPTION_MOTION = {
  initial: { scale: 1 },
  hover: { scale: 1.02 },
  tap: { scale: 0.98 },
  transition: { duration: 0.15, ease: [0.4, 0, 0.2, 1] },
};

/** Keyboard keys for option interaction. */
const OPTION_KEYS = {
  ENTER: 'Enter',
  SPACE: ' ',
};

/* ---------------------------------- */
/* Component                          */
/* ---------------------------------- */

/**
 * SelectOption – a single select option.
 *
 * @component
 * @example
 * <SelectOption
 *   label="Option 1"
 *   value="1"
 *   selected={isSelected}
 *   onSelect={handleSelect}
 * />
 *
 * @example
 * <SelectOption
 *   label="Disabled Option"
 *   value="2"
 *   disabled
 * />
 */
const SelectOption = memo(
  forwardRef(function SelectOption(
    {
      children,
      label,
      value,
      icon,
      selected = false,
      disabled = false,
      onSelect,
      size = SELECT_DEFAULTS.size,
      multiple = false,
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
      if (selected) return 'selected';
      return 'default';
    }, [disabled, selected]);

    // Get option classes.
    const optionClasses = useMemo(
      () =>
        getSelectOptionClasses({
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
      () => mergeClasses(optionClasses, responsiveClasses),
      [optionClasses, responsiveClasses],
    );

    // Handle click.
    const handleClick = useCallback(
      (event) => {
        if (disabled) return;
        onSelect?.(value, event);
      },
      [disabled, onSelect, value],
    );

    // Handle key down.
    const handleKeyDown = useCallback(
      (event) => {
        if (disabled) return;
        if (event.key === OPTION_KEYS.ENTER || event.key === OPTION_KEYS.SPACE) {
          event.preventDefault();
          onSelect?.(value, event);
        }
      },
      [disabled, onSelect, value],
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
        whileHover: { scale: OPTION_MOTION.hover.scale },
        whileTap: { scale: OPTION_MOTION.tap.scale },
        transition: OPTION_MOTION.transition,
      };
    }, [prefersReducedMotion, disabled]);

    // Accessibility attributes.
    const ariaProps = useMemo(
      () => ({
        role,
        'aria-label': ariaLabel || label || 'Option',
        'aria-selected': selected || undefined,
        'aria-disabled': disabled || undefined,
        tabIndex: disabled ? -1 : 0,
      }),
      [role, ariaLabel, label, selected, disabled],
    );

    // Content to render.
    const content = (
      <>
        {multiple && (
          <div
            className={mergeClasses(
              'shrink-0 w-5 h-5 border-2 rounded flex items-center justify-center transition-colors',
              selected ? 'border-blue-500 bg-blue-500' : 'border-gray-300 bg-white',
              disabled && 'opacity-50',
            )}
          >
            {selected && (
              <svg
                className="h-3 w-3 text-white"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M20 6L9 17l-5-5" />
              </svg>
            )}
          </div>
        )}
        {icon && <span className="shrink-0">{icon}</span>}
        <span className="flex-1 truncate">{children || label}</span>
        {selected && !multiple && (
          <span className="shrink-0 text-blue-500" aria-hidden="true">
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
      <motion.div
        ref={ref}
        className={finalClasses}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        {...motionProps}
        {...ariaProps}
        {...rest}
      >
        {content}
      </motion.div>
    );
  }),
);

SelectOption.displayName = 'SelectOption';

SelectOption.propTypes = {
  /** Option content (alternative to label). */
  children: PropTypes.node,
  /** Option label. */
  label: PropTypes.node,
  /** Option value. */
  value: PropTypes.any,
  /** Optional icon. */
  icon: PropTypes.node,
  /** Whether the option is selected. */
  selected: PropTypes.bool,
  /** Disabled state. */
  disabled: PropTypes.bool,
  /** Callback when option is selected. */
  onSelect: PropTypes.func,
  /** Size preset. */
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
  /** Whether multiple selection is enabled. */
  multiple: PropTypes.bool,
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

export default SelectOption;