/**
 * KisanO Design System — Select Package
 * SelectContainer
 *
 * The container component that wraps the select trigger and menu.
 * Handles outside clicks, Escape key, positioning, and open/close state.
 * Uses Framer Motion for animations.
 *
 * Single Responsibility: Manage select positioning and interactions.
 * Does not render trigger or menu content directly.
 *
 * @module components/ui/Select/SelectContainer
 */

import  React,{ forwardRef, memo, useMemo, useCallback, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';

import {
  SELECT_DEFAULTS,
  getSelectAnimation,
} from './selectVariants';
import {
  mergeClasses,
  resolveResponsiveClasses,
  resolveDefaultProps,
  getSelectContainerClasses,
  isInteractiveSelect,
  shouldCloseOnOutsideClick,
  shouldCloseOnEscape,
} from './selectUtils';

/* ---------------------------------- */
/* Component                          */
/* ---------------------------------- */

/**
 * SelectContainer – the main select wrapper with positioning and interactions.
 *
 * @component
 * @example
 * <SelectContainer open={isOpen} onOpenChange={setOpen}>
 *   <SelectTrigger>Open</SelectTrigger>
 *   <SelectMenu>Options</SelectMenu>
 * </SelectContainer>
 */
const SelectContainer = memo(
  forwardRef(function SelectContainer(
    {
      children,
      open: controlledOpen,
      defaultOpen = false,
      onOpenChange,
      variant = SELECT_DEFAULTS.variant,
      size = SELECT_DEFAULTS.size,
      disabled = false,
      loading = false,
      closeOnOutsideClick = SELECT_DEFAULTS.closeOnOutsideClick,
      closeOnEscape = SELECT_DEFAULTS.closeOnEscape,
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
      () => isInteractiveSelect({ disabled: resolved.disabled, loading: resolved.loading }),
      [resolved.disabled, resolved.loading],
    );

    // Container classes.
    const containerClasses = useMemo(() => {
      const base = getSelectContainerClasses(className);
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

      // Focus the first interactive item when select opens.
      const firstItem = containerRef.current?.querySelector('[role="option"]:not([aria-disabled="true"])');
      if (firstItem) {
        setTimeout(() => firstItem.focus(), 0);
      }
    }, [open, interactive]);

    // Animation props - respect reduced motion.
    const animationConfig = useMemo(() => {
      if (prefersReducedMotion) {
        return { initial: false, animate: true, exit: false };
      }
      return getSelectAnimation(resolved.animation);
    }, [prefersReducedMotion, resolved.animation]);

    // Clone children with necessary props.
    const childrenArray = React.Children.toArray(children);
    const triggerChild = childrenArray.find(
      (child) => child.type?.displayName === 'SelectTrigger',
    );
    const menuChild = childrenArray.find(
      (child) => child.type?.displayName === 'SelectMenu' || child.type?.displayName === 'SelectPortal',
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
        {triggerChild}

        <AnimatePresence initial={false}>
          {open && interactive && (
            <motion.div
              {...animationConfig}
              className="relative z-50"
            >
              {menuChild}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }),
);

SelectContainer.displayName = 'SelectContainer';

SelectContainer.propTypes = {
  /** Children (SelectTrigger and SelectMenu or SelectPortal). */
  children: PropTypes.node,
  /** Controlled open state. */
  open: PropTypes.bool,
  /** Default open state for uncontrolled mode. */
  defaultOpen: PropTypes.bool,
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
  /** Close select when clicking outside. */
  closeOnOutsideClick: PropTypes.bool,
  /** Close select when pressing Escape. */
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

export default SelectContainer;