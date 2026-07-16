/**
 * KisanO Design System — DatePicker Package
 * DatePickerContainer
 *
 * The container component that wraps the date picker input and calendar.
 * Handles outside clicks, Escape key, positioning, and open/close state.
 * Uses Framer Motion for animations.
 *
 * Single Responsibility: Manage date picker positioning and interactions.
 * Does not render input or calendar content directly.
 *
 * @module components/ui/DatePicker/DatePickerContainer
 */

import { forwardRef, memo, useMemo, useCallback, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Children } from "react";
import {
  DATE_PICKER_DEFAULTS,
  getDatePickerAnimation,
} from './datePickerVariants';
import {
  mergeClasses,
  resolveResponsiveClasses,
  resolveDefaultProps,
  getDatePickerContainerClasses,
  isInteractiveDatePicker,
  shouldCloseOnOutsideClick,
  shouldCloseOnEscape,
} from './datePickerUtils';

/* ---------------------------------- */
/* Component                          */
/* ---------------------------------- */

/**
 * DatePickerContainer – the main date picker wrapper with positioning and interactions.
 *
 * @component
 * @example
 * <DatePickerContainer open={isOpen} onOpenChange={setOpen}>
 *   <DatePickerInput />
 *   <DatePickerCalendar />
 * </DatePickerContainer>
 */
const DatePickerContainer = memo(
  forwardRef(function DatePickerContainer(
    {
      children,
      open: controlledOpen,
      defaultOpen = false,
      onOpenChange,
      variant = DATE_PICKER_DEFAULTS.variant,
      size = DATE_PICKER_DEFAULTS.size,
      disabled = false,
      loading = false,
      closeOnOutsideClick = DATE_PICKER_DEFAULTS.closeOnOutsideClick,
      closeOnEscape = DATE_PICKER_DEFAULTS.closeOnEscape,
      responsive,
      className = '',
      ...rest
    },
    ref,
  ) {
    const prefersReducedMotion = useReducedMotion();
    const containerRef = useRef(null);
    const [internalOpen, setInternalOpen] = useState(defaultOpen);

    // Determine if controlled or uncontrolled.
    const isControlled = controlledOpen !== undefined;
    const open = isControlled ? controlledOpen : internalOpen;

    // Handle open state change.
    const handleOpenChange = useCallback(
      (newOpen) => {
        if (!isControlled) {
          setInternalOpen(newOpen);
        }
        onOpenChange?.(newOpen);
      },
      [isControlled, onOpenChange],
    );

    // Resolve defaults.
    const resolved = useMemo(
      () =>
        resolveDefaultProps({
          variant,
          size,
          disabled,
          loading,
          closeOnOutsideClick,
          closeOnEscape,
        }),
      [variant, size, disabled, loading, closeOnOutsideClick, closeOnEscape],
    );

    // Determine if interactive.
    const interactive = useMemo(
      () => isInteractiveDatePicker({ disabled: resolved.disabled, loading: resolved.loading }),
      [resolved.disabled, resolved.loading],
    );

    // Container classes.
    const containerClasses = useMemo(() => {
      const base = getDatePickerContainerClasses(className);
      return responsive ? mergeClasses(base, resolveResponsiveClasses(responsive)) : base;
    }, [className, responsive]);

    // Handle outside click.
    useEffect(() => {
      if (!open || !interactive) return;

      const handleOutsideClick = (event) => {
        if (!shouldCloseOnOutsideClick({
          closeOnOutsideClick: resolved.closeOnOutsideClick,
          disabled: resolved.disabled,
          loading: resolved.loading,
        })) {
          return;
        }

        if (containerRef.current && !containerRef.current.contains(event.target)) {
          handleOpenChange(false);
        }
      };

      // Use mousedown to capture clicks before they bubble.
      document.addEventListener('mousedown', handleOutsideClick);
      return () => document.removeEventListener('mousedown', handleOutsideClick);
    }, [open, interactive, resolved.closeOnOutsideClick, resolved.disabled, resolved.loading, handleOpenChange]);

    // Handle Escape key.
    useEffect(() => {
      if (!open || !interactive) return;

      const handleEscape = (event) => {
        if (!shouldCloseOnEscape({
          closeOnEscape: resolved.closeOnEscape,
          disabled: resolved.disabled,
          loading: resolved.loading,
        })) {
          return;
        }

        if (event.key === 'Escape') {
          event.preventDefault();
          handleOpenChange(false);
        }
      };

      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }, [open, interactive, resolved.closeOnEscape, resolved.disabled, resolved.loading, handleOpenChange]);

    // Focus management.
    useEffect(() => {
      if (!open || !interactive) return;

      // Focus the first interactive item when date picker opens.
      const firstItem = containerRef.current?.querySelector('[role="gridcell"]:not([aria-disabled="true"])');
      if (firstItem) {
        setTimeout(() => firstItem.focus(), 0);
      }
    }, [open, interactive]);

    // Animation props - respect reduced motion.
    const animationConfig = useMemo(() => {
      if (prefersReducedMotion) {
        return { initial: false, animate: true, exit: false };
      }
      return getDatePickerAnimation(resolved.animation);
    }, [prefersReducedMotion, resolved.animation]);

    // Clone children with necessary props.
    const childrenArray = Children.toArray(children);
    const inputChild = childrenArray.find(
      (child) => child.type?.displayName === 'DatePickerInput',
    );
    const calendarChild = childrenArray.find(
      (child) => child.type?.displayName === 'DatePickerCalendar' || child.type?.displayName === 'DatePickerPortal',
    );

    return (
      <div
        ref={(node) => {
          containerRef.current = node;
          if (typeof ref === 'function') ref(node);
          else if (ref) ref.current = node;
        }}
        className={containerClasses}
        {...rest}
      >
        {inputChild}

        <AnimatePresence initial={false}>
          {open && interactive && (
            <motion.div
              {...animationConfig}
              className="relative z-50"
            >
              {calendarChild}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }),
);

DatePickerContainer.displayName = 'DatePickerContainer';

DatePickerContainer.propTypes = {
  /** Children (DatePickerInput and DatePickerCalendar or DatePickerPortal). */
  children: PropTypes.node,
  /** Controlled open state. */
  open: PropTypes.bool,
  /** Default open state for uncontrolled mode. */
  defaultOpen: PropTypes.bool,
  /** Callback when open state changes. */
  onOpenChange: PropTypes.func,
  /** Visual variant. */
  variant: PropTypes.oneOf(['default', 'filled', 'outlined', 'ghost']),
  /** Size preset. */
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
  /** Disabled state. */
  disabled: PropTypes.bool,
  /** Loading state. */
  loading: PropTypes.bool,
  /** Close date picker when clicking outside. */
  closeOnOutsideClick: PropTypes.bool,
  /** Close date picker when pressing Escape. */
  closeOnEscape: PropTypes.bool,
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
};

export default DatePickerContainer;