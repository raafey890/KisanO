/**
 * KisanO Design System — Tooltip Package
 * TooltipTrigger
 *
 * The trigger component that wraps the target element and provides
 * hover, focus, keyboard, and click interactions for tooltips.
 * Handles all interaction logic and accessibility attributes.
 *
 * Single Responsibility: Handle trigger interactions for tooltips.
 * Does not render tooltip content or positioning.
 *
 * @module components/ui/Tooltip/TooltipTrigger
 */

import React, {
  forwardRef,
  memo,
  useCallback,
  useRef,
  useEffect,
  useMemo,
  cloneElement,
} from 'react';
import PropTypes, { object } from 'prop-types';
import { motion, useReducedMotion } from 'framer-motion';

import {
  TOOLTIP_DEFAULTS,
} from './tooltipVariants';
import {
  mergeClasses,
  resolveResponsiveClasses,
} from './tooltipUtils';

/* ---------------------------------- */
/* Component-specific tokens          */
/* ---------------------------------- */

/** Keyboard keys that trigger tooltip actions. */
const TRIGGER_KEYS = {
  ENTER: 'Enter',
  SPACE: ' ',
  ESCAPE: 'Escape',
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
 * TooltipTrigger – the interactive trigger for tooltips.
 *
 * @component
 * @example
 * <TooltipTrigger onOpenChange={setOpen}>
 *   <Button>Hover me</Button>
 * </TooltipTrigger>
 */
const TooltipTrigger = memo(
  forwardRef(function TooltipTrigger(
    {
      children,
      onOpenChange,
      onOpen,
      onClose,
      trigger = 'hover',
      delay = TOOLTIP_DEFAULTS.delay,
      closeDelay = TOOLTIP_DEFAULTS.closeDelay,
      disabled = false,
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
    const openTimerRef = useRef(null);
    const closeTimerRef = useRef(null);
    const [isHovered, setIsHovered] ;
    const [isFocused, setIsFocused];
    const [isPressed, setIsPressed]

    // Determine trigger modes.
    const triggers = useMemo(() => {
      const modes = {
        hover: false,
        focus: false,
        click: false,
      };
      if (typeof trigger === 'string') {
        modes[trigger] = true;
      } else if (Array.isArray(trigger)) {
        trigger.forEach((mode) => {
          if (object.hasOwn(modes,mode)) modes[mode] = true;
        });
      }
      return modes;
    }, [trigger]);

    // Clear timers.
    const clearTimers = useCallback(() => {
      if (openTimerRef.current) {
        clearTimeout(openTimerRef.current);
        openTimerRef.current = null;
      }
      if (closeTimerRef.current) {
        clearTimeout(closeTimerRef.current);
        closeTimerRef.current = null;
      }
    }, []);

    // Open tooltip.
    const openTooltip = useCallback(() => {
      if (disabled || !interactive) return;
      clearTimers();
      if (delay > 0) {
        openTimerRef.current = setTimeout(() => {
          onOpenChange?.(true);
          onOpen?.();
        }, delay);
      } else {
        onOpenChange?.(true);
        onOpen?.();
      }
    }, [disabled, interactive, clearTimers, delay, onOpenChange, onOpen]);

    // Close tooltip.
    const closeTooltip = useCallback(() => {
      if (disabled || !interactive) return;
      clearTimers();
      if (closeDelay > 0) {
        closeTimerRef.current = setTimeout(() => {
          onOpenChange?.(false);
          onClose?.();
        }, closeDelay);
      } else {
        onOpenChange?.(false);
        onClose?.();
      }
    }, [disabled, interactive, clearTimers, closeDelay, onOpenChange, onClose]);

    // Handle mouse enter.
    const handleMouseEnter = useCallback(() => {
      if (disabled || !interactive) return;
      isHovered.current = true;
      if (triggers.hover) {
        openTooltip();
      }
    }, [disabled, interactive, triggers.hover, openTooltip]);

    // Handle mouse leave.
    const handleMouseLeave = useCallback(() => {
      isHovered.current = false;
      if (triggers.hover) {
        closeTooltip();
      }
    }, [triggers.hover, closeTooltip]);

    // Handle focus.
    const handleFocus = useCallback(() => {
      if (disabled || !interactive) return;
      isFocused.current = true;
      if (triggers.focus) {
        openTooltip();
      }
    }, [disabled, interactive, triggers.focus, openTooltip]);

    // Handle blur.
    const handleBlur = useCallback(() => {
      isFocused.current = false;
      if (triggers.focus) {
        closeTooltip();
      }
    }, [triggers.focus, closeTooltip]);

    // Handle key down.
    const handleKeyDown = useCallback(
      (event) => {
        if (disabled || !interactive) return;

        // Handle Enter/Space for click triggers.
        if (triggers.click && (event.key === TRIGGER_KEYS.ENTER || event.key === TRIGGER_KEYS.SPACE)) {
          event.preventDefault();
          if (isPressed.current) {
            closeTooltip();
            isPressed.current = false;
          } else {
            openTooltip();
            isPressed.current = true;
          }
          return;
        }

        // Handle Escape to close.
        if (event.key === TRIGGER_KEYS.ESCAPE) {
          event.preventDefault();
          closeTooltip();
          isPressed.current = false;
        }
      },
      [disabled, interactive, triggers.click, openTooltip, closeTooltip],
    );

    // Handle click.
    const handleClick = useCallback(() => {
      if (disabled || !interactive || !triggers.click) return;
      if (isPressed.current) {
        closeTooltip();
        isPressed.current = false;
      } else {
        openTooltip();
        isPressed.current = true;
      }
    }, [disabled, interactive, triggers.click, openTooltip, closeTooltip]);

    // Cleanup timers on unmount.
    useEffect(() => {
      return () => {
        clearTimers();
      };
    }, [clearTimers]);

    // Merge refs.
    const mergedRef = useCallback(
      (node) => {
        triggerRef.current = node;
        if (typeof ref === 'function') ref(node);
        else if (ref) ref.current = node;
      },
      [ref],
    );

    // Determine trigger classes.
    const triggerClasses = useMemo(() => {
      const base = mergeClasses(
        'inline-flex',
        disabled && 'opacity-50 cursor-not-allowed pointer-events-none',
        className,
      );
      return responsive ? mergeClasses(base, resolveResponsiveClasses(responsive)) : base;
    }, [disabled, className, responsive]);

    // Motion props - respect reduced motion.
    const motionProps = useMemo(() => {
      if (prefersReducedMotion) {
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
    }, [prefersReducedMotion]);

    // Accessibility attributes.
    const ariaProps = useMemo(
      () => ({
        role,
        'aria-label': ariaLabel,
        'aria-disabled': disabled || undefined,
        tabIndex: disabled ? -1 : 0,
      }),
      [role, ariaLabel, disabled],
    );

    // Clone child with trigger props.
    const child = children;
    const childProps = {
      ref: mergedRef,
      className: mergeClasses(child.props?.className || '', triggerClasses),
      onMouseEnter: (e) => {
  child.props?.onMouseEnter?.(e);
  handleMouseEnter(e);
},

onMouseLeave: (e) => {
  child.props?.onMouseLeave?.(e);
  handleMouseLeave(e);
},

onFocus: (e) => {
  child.props?.onFocus?.(e);
  handleFocus(e);
},

onBlur: (e) => {
  child.props?.onBlur?.(e);
  handleBlur(e);
},

onKeyDown: (e) => {
  child.props?.onKeyDown?.(e);
  handleKeyDown(e);
},

onClick: (e) => {
  child.props?.onClick?.(e);
  handleClick(e);
},
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
        className={triggerClasses}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        onClick={handleClick}
        {...ariaProps}
        {...motionProps}
        {...rest}
      >
        {child}
      </motion.div>
    );
  }),
);

TooltipTrigger.displayName = 'TooltipTrigger';

TooltipTrigger.propTypes = {
  /** The trigger element (button, icon, text, etc.). */
  children: PropTypes.node.isRequired,
  /** Called when tooltip open state changes. */
  onOpenChange: PropTypes.func,
  /** Called when tooltip opens. */
  onOpen: PropTypes.func,
  /** Called when tooltip closes. */
  onClose: PropTypes.func,
  /** Interaction trigger type(s). */
  trigger: PropTypes.oneOfType([
    PropTypes.oneOf(['hover', 'focus', 'click']),
    PropTypes.arrayOf(PropTypes.oneOf(['hover', 'focus', 'click'])),
  ]),
  /** Delay before opening (ms). */
  delay: PropTypes.number,
  /** Delay before closing (ms). */
  closeDelay: PropTypes.number,
  /** Disables the trigger. */
  disabled: PropTypes.bool,
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

export default TooltipTrigger;