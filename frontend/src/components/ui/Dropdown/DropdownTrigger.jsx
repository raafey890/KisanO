/**
 * KisanO Design System — Dropdown Package
 * DropdownTrigger
 *
 * The trigger component that wraps the target element and provides
 * click, keyboard, and accessibility interactions for dropdowns.
 *
 * Single Responsibility: Handle trigger interactions for dropdowns.
 * Does not render menu content or manage positioning.
 *
 * @module components/ui/Dropdown/DropdownTrigger
 */

import { forwardRef, memo, useCallback, useRef, useEffect, useMemo, cloneElement } from 'react';
import PropTypes from 'prop-types';
import { motion, useReducedMotion } from 'framer-motion';

import {
  DROPDOWN_DEFAULTS,
} from './dropdownVariants';
import {
  mergeClasses,
  resolveResponsiveClasses,
  getDropdownTriggerClasses,
} from './dropdownUtils';

/* ---------------------------------- */
/* Component-specific tokens          */
/* ---------------------------------- */

/** Keyboard keys that trigger dropdown actions. */
const TRIGGER_KEYS = {
  ENTER: 'Enter',
  SPACE: ' ',
  ESCAPE: 'Escape',
  ARROW_DOWN: 'ArrowDown',
  ARROW_UP: 'ArrowUp',
  HOME: 'Home',
  END: 'End',
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
 * DropdownTrigger – the interactive trigger for dropdowns.
 *
 * @component
 * @example
 * <DropdownTrigger onOpenChange={setOpen} open={isOpen}>
 *   <Button>Open Dropdown</Button>
 * </DropdownTrigger>
 */
const DropdownTrigger = memo(
  forwardRef(function DropdownTrigger(
    {
      children,
      open = false,
      onOpenChange,
      onOpen,
      onClose,
      variant = DROPDOWN_DEFAULTS.variant,
      size = DROPDOWN_DEFAULTS.size,
      disabled = false,
      loading = false,
      interactive = true,
      responsive,
      className = '',
      role = 'button',
      'aria-label': ariaLabel,
      ...rest
    },
    ref,
  ) {
    const prefersReducedMotion = useReducedMotion();
    const triggerRef = useRef(null);
    const [isHovered, setIsHovered] = useState(false);
    const [isPressed, setIsPressed] = useState(false);

    // Determine if interactive.
    const isInteractive = !disabled && !loading && interactive;

    // Get trigger classes.
    const triggerClasses = useMemo(
      () =>
        getDropdownTriggerClasses({
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

    // Handle toggle.
    const toggleDropdown = useCallback(() => {
      if (!isInteractive) return;
      const newOpen = !open;
      onOpenChange?.(newOpen);
      if (newOpen) {
        onOpen?.();
      } else {
        onClose?.();
      }
    }, [isInteractive, open, onOpenChange, onOpen, onClose]);

    // Handle open.
    const openDropdown = useCallback(() => {
      if (!isInteractive || open) return;
      onOpenChange?.(true);
      onOpen?.();
    }, [isInteractive, open, onOpenChange, onOpen]);

    // Handle close.
    const closeDropdown = useCallback(() => {
      if (!isInteractive || !open) return;
      onOpenChange?.(false);
      onClose?.();
    }, [isInteractive, open, onOpenChange, onClose]);

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
          closeDropdown();
          return;
        }

        // Arrow keys for navigation (delegated to menu).
        if (open && (event.key === TRIGGER_KEYS.ARROW_DOWN || event.key === TRIGGER_KEYS.ARROW_UP)) {
          event.preventDefault();
          // Focus the menu if it exists.
          const menu = triggerRef.current?.parentElement?.querySelector('[role="listbox"]');
          if (menu) {
            menu.focus();
          }
          return;
        }
      },
      [isInteractive, open, toggleDropdown, closeDropdown],
    );

    // Handle mouse enter.
    const handleMouseEnter = useCallback(() => {
      if (!isInteractive) return;
      setIsHovered(true);
    }, [isInteractive]);

    // Handle mouse leave.
    const handleMouseLeave = useCallback(() => {
      setIsHovered(false);
    }, []);

    // Handle focus.
    const handleFocus = useCallback(() => {
      if (!isInteractive) return;
    }, [isInteractive]);

    // Handle blur.
    const handleBlur = useCallback(() => {
      // Don't close on blur - let outside click handler handle it.
    }, []);

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
        'aria-label': ariaLabel,
        'aria-expanded': open,
        'aria-haspopup': 'listbox',
        'aria-disabled': disabled || undefined,
        tabIndex: disabled ? -1 : 0,
      }),
      [role, ariaLabel, open, disabled],
    );

    // Clone child with trigger props.
    const child = children;
    const childProps = {
      ref: mergedRef,
      className: finalClasses,
      onClick: handleClick,
      onKeyDown: handleKeyDown,
      onMouseEnter: handleMouseEnter,
      onMouseLeave: handleMouseLeave,
      onFocus: handleFocus,
      onBlur: handleBlur,
      ...ariaProps,
      ...motionProps,
      ...rest,
    };

    // If child is a React element, clone it with the props.
    if (React.isValidElement(child)) {
      return cloneElement(child, childProps);
    }

    // Otherwise, wrap the child in a motion.div.
    return (
      <motion.div
        ref={mergedRef}
        className={finalClasses}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onFocus={handleFocus}
        onBlur={handleBlur}
        {...ariaProps}
        {...motionProps}
        {...rest}
      >
        {child}
      </motion.div>
    );
  }),
);

DropdownTrigger.displayName = 'DropdownTrigger';

DropdownTrigger.propTypes = {
  /** The trigger element (button, icon, text, etc.). */
  children: PropTypes.node.isRequired,
  /** Whether the dropdown is open. */
  open: PropTypes.bool,
  /** Called when open state changes. */
  onOpenChange: PropTypes.func,
  /** Called when dropdown opens. */
  onOpen: PropTypes.func,
  /** Called when dropdown closes. */
  onClose: PropTypes.func,
  /** Visual variant. */
  variant: PropTypes.oneOf([
    'default',
    'primary',
    'secondary',
    'success',
    'warning',
    'error',
    'ghost',
  ]),
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
};

export default DropdownTrigger;