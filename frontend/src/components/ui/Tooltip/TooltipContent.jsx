/**
 * KisanO Design System — Tooltip Package
 * TooltipContent
 *
 * The content component that renders the tooltip text and content.
 * Handles typography, responsive support, and accessibility.
 *
 * Single Responsibility: Render tooltip content.
 * Does not handle positioning, triggers, or open/close state.
 *
 * @module components/ui/Tooltip/TooltipContent
 */

import { forwardRef, memo, useMemo } from 'react';
import PropTypes from 'prop-types';
import { motion, useReducedMotion } from 'framer-motion';

import {
  TOOLTIP_DEFAULTS,
  getTooltipSize,
} from './tooltipVariants';
import {
  mergeClasses,
  resolveResponsiveClasses,
} from './tooltipUtils';

/* ---------------------------------- */
/* Component-specific tokens          */
/* ---------------------------------- */

/** Alignment mapping. */
const ALIGNMENT_MAP = {
  left: 'text-left items-start',
  center: 'text-center items-center',
  right: 'text-right items-end',
};

/** Motion variants for content animation. */
const CONTENT_MOTION = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.15, ease: [0.4, 0, 0.2, 1] },
};

/* ---------------------------------- */
/* Component                          */
/* ---------------------------------- */

/**
 * TooltipContent – the content of a tooltip.
 *
 * @component
 * @example
 * <TooltipContent size="md" align="center">
 *   This is a tooltip
 * </TooltipContent>
 */
const TooltipContent = memo(
  forwardRef(function TooltipContent(
    {
      children,
      size = TOOLTIP_DEFAULTS.size,
      align = 'center',
      disabled = false,
      responsive,
      className = '',
      role = 'tooltip',
      'aria-label': ariaLabel,
      ...rest
    },
    ref,
  ) {
    const prefersReducedMotion = useReducedMotion();

    // Get size configuration.
    const sizeConfig = useMemo(
      () => getTooltipSize(size),
      [size],
    );

    // Resolve alignment classes.
    const alignClasses = useMemo(
      () => ALIGNMENT_MAP[align] || ALIGNMENT_MAP.center,
      [align],
    );

    // Responsive overrides.
    const responsiveClasses = useMemo(
      () => (responsive ? resolveResponsiveClasses(responsive) : ''),
      [responsive],
    );

    // Content classes.
    const contentClasses = useMemo(() => {
      const base = mergeClasses(
        'flex flex-col w-full',
        sizeConfig.gap,
        sizeConfig.fontSize,
        alignClasses,
        disabled && 'opacity-50 cursor-not-allowed',
        className,
      );
      return mergeClasses(base, responsiveClasses);
    }, [sizeConfig.gap, sizeConfig.fontSize, alignClasses, disabled, className, responsiveClasses]);

    // Motion props - respect reduced motion.
    const motionProps = useMemo(() => {
      if (prefersReducedMotion) {
        return { initial: false, animate: true, exit: false };
      }
      return CONTENT_MOTION;
    }, [prefersReducedMotion]);

    // Accessibility attributes.
    const ariaProps = useMemo(
      () => ({
        role,
        'aria-label':
  ariaLabel ??
  (typeof children === 'string'
    ? children
    : undefined),
        'aria-disabled': disabled || undefined,
      }),
      [role, ariaLabel, children, disabled],
    );

    // If no content, render nothing.
    if (!children) {
      return null;
    }

    return (
      <motion.div
        ref={ref}
        className={contentClasses}
        {...motionProps}
        {...ariaProps}
        {...rest}
      >
        {children}
      </motion.div>
    );
  }),
);

TooltipContent.displayName = 'TooltipContent';

TooltipContent.propTypes = {
  /** Tooltip content. */
  children: PropTypes.node,
  /** Size preset (affects font size and spacing). */
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
  /** Text alignment. */
  align: PropTypes.oneOf(['left', 'center', 'right']),
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
  /** ARIA role. */
  role: PropTypes.string,
  /** Accessible label. */
  'aria-label': PropTypes.string,
};

export default TooltipContent;