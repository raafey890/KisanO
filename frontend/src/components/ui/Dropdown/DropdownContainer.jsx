/**
 * KisanO Design System — Dropdown Package
 * DropdownContainer
 *
 * The container component that wraps the dropdown trigger and menu.
 * Handles outside clicks, Escape key, positioning, and open/close state.
 * Uses Framer Motion for animations.
 *
 * Single Responsibility: Manage dropdown positioning and interactions.
 * Does not render trigger or menu content directly.
 *
 * @module components/ui/Dropdown/DropdownContainer
 */

import React, {
  forwardRef,
  memo,
  useMemo,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import PropTypes from 'prop-types';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';

import {
  DROPDOWN_DEFAULTS,
  getDropdownAnimation,
} from './dropdownVariants';
import {
  mergeClasses,
  resolveResponsiveClasses,
  resolveDefaultProps,
  getDropdownContainerClasses,
  isInteractiveDropdown,
  shouldCloseOnOutsideClick,
  shouldCloseOnEscape,
} from './dropdownUtils';

/* ---------------------------------- */
/* Component                          */
/* ---------------------------------- */

/**
 * DropdownContainer – the main dropdown wrapper with positioning and interactions.
 *
 * @component
 * @example
 * <DropdownContainer open={isOpen} onOpenChange={setOpen}>
 *   <DropdownTrigger>Open</DropdownTrigger>
 *   <DropdownMenu>Items</DropdownMenu>
 * </DropdownContainer>
 */
const DropdownContainer = memo(
  forwardRef(function DropdownContainer(
    {
      children,
      open: controlledOpen,
      defaultOpen = false,
      onOpenChange,
      variant = DROPDOWN_DEFAULTS.variant,
      size = DROPDOWN_DEFAULTS.size,
      disabled = false,
      loading = false,
      closeOnOutsideClick = DROPDOWN_DEFAULTS.closeOnOutsideClick,
      closeOnEscape = DROPDOWN_DEFAULTS.closeOnEscape,
      responsive,
      className = '',
      ...rest
    },
    ref,
  ) {
    
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
      () => isInteractiveDropdown({ disabled: resolved.disabled, loading: resolved.loading }),
      [resolved.disabled, resolved.loading],
    );

    // Container classes.
    const containerClasses = useMemo(() => {
      const base = getDropdownContainerClasses(className);
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

    // Prevent body scroll when dropdown is open (for overflow).
    useEffect(() => {
      if (!open || !interactive) return;
      // Only prevent scroll if dropdown has items that might overflow.
      const menuElement = containerRef.current?.querySelector('[role="listbox"]');
      if (!menuElement) return;

      const originalOverflow = document.body.style.overflow;
      const hasOverflow = menuElement.scrollHeight > menuElement.clientHeight;
      if (hasOverflow) {
        document.body.style.overflow = 'hidden';
      }
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }, [open, interactive]);

    // Focus management.
    useEffect(() => {
      if (!open || !interactive) return;

      // Focus the first interactive item when dropdown opens.
      const firstItem = containerRef.current?.querySelector('[role="option"]:not([aria-disabled="true"])');
      if (firstItem) {
        setTimeout(() => firstItem.focus(), 0);
      }
    }, [open, interactive]);

    // Animation props - respect reduced motion.
    const animationConfig = useMemo(
      () => {
        if (prefersReducedMotion) {
          return { initial: false, animate: true, exit: false };
        }
        return getDropdownAnimation(resolved.animation);
      },
      [prefersReducedMotion, resolved.animation],
    );

    // Clone children with necessary props.
    const childrenArray = React.Children.toArray(children);
    const triggerChild = childrenArray.find(
      (child) => child.type?.displayName === 'DropdownTrigger',
    );
    const menuChild = childrenArray.find(
      (child) => child.type?.displayName === 'DropdownMenu' || child.type?.displayName === 'DropdownPortal',
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

DropdownContainer.displayName = 'DropdownContainer';

DropdownContainer.propTypes = {
  /** Children (DropdownTrigger and DropdownMenu or DropdownPortal). */
  children: PropTypes.node,
  /** Controlled open state. */
  open: PropTypes.bool,
  /** Default open state for uncontrolled mode. */
  defaultOpen: PropTypes.bool,
  /** Callback when open state changes. */
  onOpenChange: PropTypes.func,
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
  /** Close dropdown when clicking outside. */
  closeOnOutsideClick: PropTypes.bool,
  /** Close dropdown when pressing Escape. */
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

export default DropdownContainer;