/**
 * KisanO Design System — Tooltip Package
 * TooltipContainer
 *
 * The container component that wraps the trigger element and renders
 * the tooltip content with proper positioning and accessibility.
 * Handles open/close state, positioning, and animation of tooltips.
 *
 * Single Responsibility: Render a positioned tooltip with proper
 * accessibility and animation. Does not manage business logic.
 *
 * @module components/ui/Tooltip/TooltipContainer
 */

import React, {
  forwardRef,
  memo,
  useMemo,
  useState,
  useCallback,
  useRef,
  useEffect,
} from 'react';
import PropTypes from 'prop-types';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';

import {
  TOOLTIP_DEFAULTS,
} from './tooltipVariants';
import {
  mergeClasses,
  resolveResponsiveClasses,
  resolveDefaultProps,
  getTooltipClasses,
  getTooltipContainerClasses,
  getTooltipArrowClasses,
  isInteractiveTooltip,
  getAccessibilityHelpers,
} from './tooltipUtils';

/* ---------------------------------- */
/* Component-specific tokens          */
/* ---------------------------------- */

/** Motion variants for tooltip entrance/exit. */
const TOOLTIP_MOTION = {
  initial: { opacity: 0, scale: 0.95, y: -4 },
  animate: { opacity: 1, scale: 1, y: 0 },
  exit: { opacity: 0, scale: 0.95, y: -4 },
  transition: { duration: 0.15, ease: [0.4, 0, 0.2, 1] },
};

/** Position-specific motion variants. */
const POSITION_MOTION = {
  top: { initial: { opacity: 0, y: -8 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -8 } },
  bottom: { initial: { opacity: 0, y: 8 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: 8 } },
  left: { initial: { opacity: 0, x: -8 }, animate: { opacity: 1, x: 0 }, exit: { opacity: 0, x: -8 } },
  right: { initial: { opacity: 0, x: 8 }, animate: { opacity: 1, x: 0 }, exit: { opacity: 0, x: 8 } },
};

/* ---------------------------------- */
/* Component                          */
/* ---------------------------------- */

/**
 * TooltipContainer – the main tooltip wrapper with positioning and animation.
 *
 * @component
 * @example
 * <TooltipContainer content="Tooltip text" position="top">
 *   <Button>Hover me</Button>
 * </TooltipContainer>
 */
const TooltipContainer = memo(
  forwardRef(function TooltipContainer(
    {
      children,
      content,
      open: controlledOpen,
      onOpenChange,
      variant = TOOLTIP_DEFAULTS.variant,
      size = TOOLTIP_DEFAULTS.size,
      radius = TOOLTIP_DEFAULTS.radius,
      shadow = TOOLTIP_DEFAULTS.shadow,
      position = TOOLTIP_DEFAULTS.position,
      arrow = TOOLTIP_DEFAULTS.arrow,
      arrowSize = TOOLTIP_DEFAULTS.arrowSize,
      delay = TOOLTIP_DEFAULTS.delay,
      closeDelay = TOOLTIP_DEFAULTS.closeDelay,
      disabled = false,
      animation = TOOLTIP_DEFAULTS.animation,
      responsive,
      className = '',
      contentClassName = '',
      arrowClassName = '',
      role = 'tooltip',
      'aria-label': ariaLabel,
      ...rest
    },
    ref,
  ) {
    const prefersReducedMotion = useReducedMotion();
    const [internalOpen, setInternalOpen] = useState(false);
    
    const openTimerRef = useRef(null);
    const closeTimerRef = useRef(null);

    // Determine if open is controlled or uncontrolled.
    const isControlled = controlledOpen !== undefined;
    const open = isControlled ? controlledOpen : internalOpen;

    // Resolve defaults.
    const resolved = useMemo(
      () =>
        resolveDefaultProps({
          variant,
          size,
          radius,
          shadow,
          position,
          arrowSize,
          arrow,
          delay,
          closeDelay,
          disabled,
          animation,
        }),
      [
        variant,
        size,
        radius,
        shadow,
        position,
        arrowSize,
        arrow,
        delay,
        closeDelay,
        disabled,
        animation,
      ],
    );

    // Resolve position for motion.
    const basePosition = useMemo(
      () => {
        const pos = resolved.position;
        if (pos.startsWith('top')) return 'top';
        if (pos.startsWith('bottom')) return 'bottom';
        if (pos.startsWith('left')) return 'left';
        if (pos.startsWith('right')) return 'right';
        return 'top';
      },
      [resolved.position],
    );

    // Get position-specific motion.
    const positionMotion = useMemo(
      () => POSITION_MOTION[basePosition] || POSITION_MOTION.top,
      [basePosition],
    );

    // Motion props - respect reduced motion.
    const motionProps = useMemo(() => {
      if (prefersReducedMotion || !resolved.animation) {
        return { initial: false, animate: true, exit: false };
      }
      return {
        initial: positionMotion.initial,
        animate: positionMotion.animate,
        exit: positionMotion.exit,
        transition: TOOLTIP_MOTION.transition,
      };
    }, [prefersReducedMotion, resolved.animation, positionMotion]);

    // Get tooltip classes.
    const tooltipClasses = useMemo(
      () =>
        getTooltipClasses({
          variant: resolved.variant,
          size: resolved.size,
          radius: resolved.radius,
          shadow: resolved.shadow,
          position: resolved.position,
          className: contentClassName,
          disabled: resolved.disabled,
          animation: resolved.animation,
        }),
      [
        resolved.variant,
        resolved.size,
        resolved.radius,
        resolved.shadow,
        resolved.position,
        contentClassName,
        resolved.disabled,
        resolved.animation,
      ],
    );

    // Get container classes.
    const containerClasses = useMemo(
      () => getTooltipContainerClasses(className),
      [className],
    );

    // Responsive overrides.
    const responsiveClasses = useMemo(
      () => (responsive ? resolveResponsiveClasses(responsive) : ''),
      [responsive],
    );

    const finalContainerClasses = useMemo(
      () => mergeClasses(containerClasses, responsiveClasses),
      [containerClasses, responsiveClasses],
    );

    // Get arrow classes.
    const arrowClasses = useMemo(
      () =>
        getTooltipArrowClasses({
          position: resolved.position,
          arrowSize: resolved.arrowSize,
          variant: resolved.variant,
          className: arrowClassName,
        }),
      [resolved.position, resolved.arrowSize, resolved.variant, arrowClassName],
    );

    // Determine if interactive.
    const interactive = useMemo(
      () => isInteractiveTooltip({ disabled: resolved.disabled }),
      [resolved.disabled],
    );

    // Get accessibility helpers.
    const accessibility = useMemo(
      () =>
        getAccessibilityHelpers({
          content: typeof content === 'string' ? content : '',
          disabled: resolved.disabled,
          open,
        }),
      [content, resolved.disabled, open],
    );

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
      if (!interactive) return;
      clearTimers();
      if (resolved.delay > 0) {
        openTimerRef.current = setTimeout(() => {
          if (isControlled) {
            onOpenChange?.(true);
          } else {
            setInternalOpen(true);
          }
        }, resolved.delay);
      } else {
        if (isControlled) {
          onOpenChange?.(true);
        } else {
          setInternalOpen(true);
        }
      }
    }, [interactive, clearTimers, resolved.delay, isControlled, onOpenChange]);

    // Close tooltip.
    const closeTooltip = useCallback(() => {
      clearTimers();
      if (resolved.closeDelay > 0) {
        closeTimerRef.current = setTimeout(() => {
          if (isControlled) {
            onOpenChange?.(false);
          } else {
            setInternalOpen(false);
          }
        }, resolved.closeDelay);
      } else {
        if (isControlled) {
          onOpenChange?.(false);
        } else {
          setInternalOpen(false);
        }
      }
    }, [clearTimers, resolved.closeDelay, isControlled, onOpenChange]);

    // Handle mouse enter.
    const handleMouseEnter = useCallback(() => {
      if (!interactive) return;
     
      openTooltip();
    }, [interactive, openTooltip]);

    // Handle mouse leave.
    const handleMouseLeave = useCallback(() => {
      setIsHovered(false);
      closeTooltip();
    }, [closeTooltip]);

    // Handle focus.
    const handleFocus = useCallback(() => {
      if (!interactive) return;
      
      openTooltip();
    }, [interactive, openTooltip]);

    // Handle blur.
    const handleBlur = useCallback(() => {
     
      closeTooltip();
    }, [closeTooltip]);

    // Cleanup timers on unmount.
    useEffect(() => {
      return () => {
        clearTimers();
      };
    }, [clearTimers]);

    // Merge child props with tooltip handlers.
    const child = React.Children.only(children);
    const childProps = {
      ref: child.ref,
      onMouseEnter: handleMouseEnter,
      onMouseLeave: handleMouseLeave,
      onFocus: handleFocus,
      onBlur: handleBlur,
      'aria-describedby': open ? 'tooltip-content' : undefined,
    };

    // Accessibility attributes for tooltip content.
    const ariaProps = useMemo(
      () => ({
        role: accessibility.getRole(),
        'aria-label': ariaLabel || accessibility.getAriaLabel(),
        'aria-hidden': accessibility.getAriaHidden(),
        id: 'tooltip-content',
      }),
      [accessibility, ariaLabel],
    );

    // If no content or disabled, render children only.
    if (!content || resolved.disabled) {
      return <>{React.cloneElement(child, childProps)}</>;
    }

    return (
      <div ref={ref} className={finalContainerClasses} {...rest}>
        {React.cloneElement(child, childProps)}

        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              className={tooltipClasses}
              {...motionProps}
              {...ariaProps}
            >
              {content}

              {/* Arrow */}
              {resolved.arrow && (
                <div className={arrowClasses} aria-hidden="true" />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }),
);

TooltipContainer.displayName = 'TooltipContainer';

TooltipContainer.propTypes = {
  /** The trigger element that opens the tooltip. */
  children: PropTypes.element.isRequired,
  /** Tooltip content. */
  content: PropTypes.node,
  /** Controlled open state. */
  open: PropTypes.bool,
  /** Callback when open state changes. */
  onOpenChange: PropTypes.func,
  /** Visual variant. */
  variant: PropTypes.oneOf(['default', 'light', 'primary', 'success', 'warning', 'error', 'info']),
  /** Size preset. */
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
  /** Border radius override. */
  radius: PropTypes.oneOf(['none', 'sm', 'md', 'lg', 'xl', 'full']),
  /** Shadow level. */
  shadow: PropTypes.oneOf(['none', 'sm', 'md', 'lg', 'xl', '2xl']),
  /** Tooltip position. */
  position: PropTypes.oneOf([
    'top',
    'top-start',
    'top-end',
    'bottom',
    'bottom-start',
    'bottom-end',
    'left',
    'left-start',
    'left-end',
    'right',
    'right-start',
    'right-end',
  ]),
  /** Whether to show the arrow. */
  arrow: PropTypes.bool,
  /** Arrow size. */
  arrowSize: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
  /** Delay before opening (ms). */
  delay: PropTypes.number,
  /** Delay before closing (ms). */
  closeDelay: PropTypes.number,
  /** Disables the tooltip. */
  disabled: PropTypes.bool,
  /** Whether animation is enabled. */
  animation: PropTypes.bool,
  /** Responsive overrides. */
  responsive: PropTypes.shape({
    xs: PropTypes.string,
    sm: PropTypes.string,
    md: PropTypes.string,
    lg: PropTypes.string,
    xl: PropTypes.string,
  }),
  /** Additional CSS classes for the container. */
  className: PropTypes.string,
  /** Additional CSS classes for the tooltip content. */
  contentClassName: PropTypes.string,
  /** Additional CSS classes for the arrow. */
  arrowClassName: PropTypes.string,
  /** ARIA role. */
  role: PropTypes.string,
  /** Accessible label. */
  'aria-label': PropTypes.string,
};

export default TooltipContainer;