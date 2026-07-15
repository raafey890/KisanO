/**
 * KisanO Design System — Select Package
 * SelectTrigger
 *
 * The trigger component that displays the selected value(s) and opens/closes
 * the select menu. Provides keyboard accessibility, focus management,
 * and responsive support.
 *
 * Single Responsibility: Render the select trigger with selected values.
 * Does not manage menu rendering or option selection.
 *
 * @module components/ui/Select/SelectTrigger
 */

import { forwardRef, memo, useMemo, useCallback, useRef } from 'react';
import PropTypes from 'prop-types';
import { motion, useReducedMotion } from 'framer-motion';

import {
  SELECT_DEFAULTS,
} from './selectVariants';
import {
  mergeClasses,
  resolveResponsiveClasses,
  getSelectTriggerClasses,
} from './selectUtils';

/* ---------------------------------- */
/* Component-specific tokens          */
/* ---------------------------------- */

/** Keyboard keys that trigger select actions. */
const TRIGGER_KEYS = {
  ENTER: 'Enter',
  SPACE: ' ',
  ESCAPE: 'Escape',
  ARROW_DOWN: 'ArrowDown',
  ARROW_UP: 'ArrowUp',
};

/** Motion variants for trigger interaction feedback. */
const TRIGGER_MOTION = {
  initial: { scale: 1 },
  hover: { scale: 1.02 },
  tap: { scale: 0.98 },
  transition: { duration: 0.15, ease: [0.4, 0, 0.2, 1] },
};

/* ---------------------------------- */
/* Component                          */
/* ---------------------------------- */

/**
 * SelectTrigger – the interactive trigger for selects.
 *
 * @component
 * @example
 * <SelectTrigger
 *   placeholder="Select an option"
 *   selectedLabels={['Option 1']}
 *   open={isOpen}
 *   onOpenChange={setOpen}
 * />
 */
const SelectTrigger = memo(
  forwardRef(function SelectTrigger(
    {
      placeholder = SELECT_DEFAULTS.placeholder,
      selectedLabels = [],
      value,
      multiple = false,
      clearable = false,
      onClear,
      open = false,
      onOpenChange,
      variant = SELECT_DEFAULTS.variant,
      size = SELECT_DEFAULTS.size,
      disabled = false,
      loading = false,
      interactive = true,
      responsive,
      className = '',
      role = 'combobox',
      'aria-label': ariaLabel,
      renderTrigger,
      ...rest
    },
    ref,
  ) {
    const prefersReducedMotion = useReducedMotion();
    const triggerRef = useRef(null);

    // Determine if interactive.
    const isInteractive = !disabled && !loading && interactive;

    // Get trigger classes.
    const triggerClasses = useMemo(
      () =>
        getSelectTriggerClasses({
          variant,
          size,
          className,
          disabled,
          loading,
          open,
        }),
      [variant, size, className, disabled, loading, open],
    );

    // Responsive overrides.
    const responsiveClasses = useMemo(
      () => (responsive ? resolveResponsiveClasses(responsive) : ''),
      [responsive],
    );

    const finalClasses = useMemo(
      () => mergeClasses(triggerClasses, responsiveClasses),
      [triggerClasses, responsiveClasses],
    );

    // Toggle dropdown.
    const toggleDropdown = useCallback(() => {
      if (!isInteractive) return;
      onOpenChange?.(!open);
    }, [isInteractive, open, onOpenChange]);

    // Handle click.
    const handleClick = useCallback(
      (event) => {
        if (!isInteractive) return;
        event.preventDefault();
        toggleDropdown();
      },
      [isInteractive, toggleDropdown],
    );

    // Handle key down.
    const handleKeyDown = useCallback(
      (event) => {
        if (!isInteractive) return;

        // Enter or Space to toggle.
        if (event.key === TRIGGER_KEYS.ENTER || event.key === TRIGGER_KEYS.SPACE) {
          event.preventDefault();
          toggleDropdown();
          return;
        }

        // Escape to close.
        if (event.key === TRIGGER_KEYS.ESCAPE && open) {
          event.preventDefault();
          onOpenChange?.(false);
          return;
        }

        // Arrow keys for navigation.
        if (open && (event.key === TRIGGER_KEYS.ARROW_DOWN || event.key === TRIGGER_KEYS.ARROW_UP)) {
          event.preventDefault();
          const menu = triggerRef.current?.parentElement?.querySelector('[role="listbox"]');
          if (menu) {
            menu.focus();
          }
        }
      },
      [isInteractive, open, toggleDropdown, onOpenChange],
    );

    // Handle clear click.
    const handleClear = useCallback(
      (event) => {
        event.stopPropagation();
        if (!isInteractive || !clearable) return;
        onClear?.();
      },
      [isInteractive, clearable, onClear],
    );

    // Merge refs.
    const mergedRef = useCallback(
      (node) => {
        triggerRef.current = node;
        if (typeof ref === 'function') ref(node);
        else if (ref) ref.current = node;
      },
      [ref],
    );

    // Motion props - respect reduced motion.
    const motionProps = useMemo(() => {
      if (prefersReducedMotion || !isInteractive) {
        return {
          whileHover: undefined,
          whileTap: undefined,
          transition: undefined,
        };
      }
      return {
        whileHover: { scale: TRIGGER_MOTION.hover.scale },
        whileTap: { scale: TRIGGER_MOTION.tap.scale },
        transition: TRIGGER_MOTION.transition,
      };
    }, [prefersReducedMotion, isInteractive]);

    // Accessibility attributes.
    const ariaProps = useMemo(
      () => ({
        role,
        'aria-label': ariaLabel || placeholder || 'Select',
        'aria-expanded': open,
        'aria-haspopup': 'listbox',
        'aria-disabled': disabled || undefined,
        'aria-busy': loading || undefined,
        tabIndex: disabled ? -1 : 0,
      }),
      [role, ariaLabel, placeholder, open, disabled, loading],
    );

    // Display label(s).
    const displayLabel = useMemo(() => {
      if (selectedLabels.length === 0) {
        return <span className="text-gray-400">{placeholder}</span>;
      }
      if (multiple) {
        return <span className="truncate">{selectedLabels.join(', ')}</span>;
      }
      return <span className="truncate">{selectedLabels[0]}</span>;
    }, [selectedLabels, placeholder, multiple]);

    // Custom trigger rendering.
    if (renderTrigger) {
      return renderTrigger({
        open,
        value,
        selectedLabels,
        disabled,
        loading,
        onOpenChange: toggleDropdown,
        onClear: handleClear,
        className: finalClasses,
        ...ariaProps,
      });
    }

    return (
      <motion.div
        ref={mergedRef}
        className={finalClasses}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        role={role}
        {...motionProps}
        {...ariaProps}
        {...rest}
      >
        <div className="flex-1 min-w-0 flex items-center gap-2">
          {displayLabel}
          {loading && (
            <svg
              className="animate-spin h-4 w-4 shrink-0"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 0 1 8-8v4a4 4 0 0 0-4 4H4z" />
            </svg>
          )}
        </div>

        {clearable && selectedLabels.length > 0 && !disabled && !loading && (
          <button
            type="button"
            className="p-0.5 rounded-full hover:bg-gray-200 transition-colors shrink-0"
            onClick={handleClear}
            aria-label="Clear selection"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}

        <svg
          className={mergeClasses(
            'h-4 w-4 shrink-0 transition-transform duration-200',
            open && 'rotate-180',
          )}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </motion.div>
    );
  }),
);

SelectTrigger.displayName = 'SelectTrigger';

SelectTrigger.propTypes = {
  /** Placeholder text. */
  placeholder: PropTypes.string,
  /** Selected label(s) to display. */
  selectedLabels: PropTypes.arrayOf(PropTypes.string),
  /** Selected value(s). */
  value: PropTypes.oneOfType([
    PropTypes.any,
    PropTypes.arrayOf(PropTypes.any),
  ]),
  /** Whether multiple selection is enabled. */
  multiple: PropTypes.bool,
  /** Whether the value can be cleared. */
  clearable: PropTypes.bool,
  /** Callback when clear is triggered. */
  onClear: PropTypes.func,
  /** Whether the select is open. */
  open: PropTypes.bool,
  /** Callback when open state changes. */
  onOpenChange: PropTypes.func,
  /** Visual variant. */
  variant: PropTypes.oneOf(['default', 'primary', 'secondary', 'ghost']),
  /** Size preset. */
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
  /** Disabled state. */
  disabled: PropTypes.bool,
  /** Loading state. */
  loading: PropTypes.bool,
  /** Whether trigger is interactive. */
  interactive: PropTypes.bool,
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
  /** Custom trigger renderer. */
  renderTrigger: PropTypes.func,
};

export default SelectTrigger;