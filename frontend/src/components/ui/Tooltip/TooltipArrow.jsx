/**
 * KisanO Design System — Tooltip Package
 * TooltipArrow
 *
 * The arrow component for tooltips. Renders a decorative arrow that points
 * to the trigger element. Supports all positions and sizes.
 *
 * Single Responsibility: Render tooltip arrow.
 * Does not handle positioning, triggers, or open/close state.
 *
 * @module components/ui/Tooltip/TooltipArrow
 */

import { forwardRef, memo, useMemo } from 'react';
import PropTypes from 'prop-types';
import { motion, useReducedMotion } from 'framer-motion';

import {
  TOOLTIP_DEFAULTS,
  getTooltipVariant,
  getTooltipArrowSize,
  getTooltipArrowOffset,
} from './tooltipVariants';
import {
  mergeClasses,
  resolveResponsiveClasses,
} from './tooltipUtils';

/* ---------------------------------- */
/* Component-specific tokens          */
/* ---------------------------------- */

/** Motion variants for arrow animation. */
const ARROW_MOTION = {
  initial: { opacity: 0, scale: 0.8 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.8 },
  transition: { duration: 0.15, ease: [0.4, 0, 0.2, 1] },
};

/* ---------------------------------- */
/* Component                          */
/* ---------------------------------- */

/**
 * TooltipArrow – the arrow of a tooltip.
 *
 * @component
 * @example
 * <TooltipArrow position="top" size="md" variant="default" />
 */
const TooltipArrow = memo(
  forwardRef(function TooltipArrow(
    {
      position = TOOLTIP_DEFAULTS.position,
      size = TOOLTIP_DEFAULTS.arrowSize,
      variant = TOOLTIP_DEFAULTS.variant,
      disabled = false,
      responsive,
      className = '',
      'aria-hidden': ariaHidden = true,
      ...rest
    },
    ref,
  ) {
    const prefersReducedMotion = useReducedMotion();

    // Get variant configuration.
    const variantConfig = useMemo(
      () => getTooltipVariant(variant),
      [variant],
    );

    // Get arrow size class.
    const arrowSizeClass = useMemo(
      () => getTooltipArrowSize(size),
      [size],
    );

    // Get arrow offset class based on position.
    const arrowOffsetClass = useMemo(
      () => getTooltipArrowOffset(position),
      [position],
    );

    // Responsive overrides.
    const responsiveClasses = useMemo(
      () => (responsive ? resolveResponsiveClasses(responsive) : ''),
      [responsive],
    );

    // Arrow classes.
    const arrowClasses = useMemo(() => {
      const base = mergeClasses(
        'absolute block rotate-45',
        arrowSizeClass,
        arrowOffsetClass,
        variantConfig.background,
        variantConfig.border,
        'border-t border-l',
        'pointer-events-none',
        disabled && 'opacity-50',
        className,
      );
      return mergeClasses(base, responsiveClasses);
    }, [
      arrowSizeClass,
      arrowOffsetClass,
      variantConfig.background,
      variantConfig.border,
      disabled,
      className,
      responsiveClasses,
    ]);

    // Motion props - respect reduced motion.
    const motionProps = useMemo(() => {
      if (prefersReducedMotion) {
        return { initial: false, animate: true, exit: false };
      }
      return ARROW_MOTION;
    }, [prefersReducedMotion]);

    // Accessibility attributes.
    const ariaProps = useMemo(
      () => ({
        'aria-hidden': ariaHidden,
        'data-position': position,
      }),
      [ariaHidden, position],
    );

    return (
      <motion.div
        ref={ref}
        className={arrowClasses}
        {...motionProps}
        {...ariaProps}
        {...rest}
      />
    );
  }),
);

TooltipArrow.displayName = 'TooltipArrow';

TooltipArrow.propTypes = {
  /** Tooltip position (determines arrow orientation). */
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
  /** Arrow size. */
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
  /** Tooltip variant (affects arrow color). */
  variant: PropTypes.oneOf(['default', 'light', 'primary', 'success', 'warning', 'error', 'info']),
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
  /** Hides the arrow from screen readers. */
  'aria-hidden': PropTypes.bool,
};

export default TooltipArrow;