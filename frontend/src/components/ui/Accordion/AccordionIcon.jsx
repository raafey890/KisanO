/**
 * KisanO Design System — Accordion Package
 * AccordionIcon
 *
 * The expand/collapse icon for an accordion item. Renders an animated
 * chevron icon that rotates based on the open state.
 *
 * Single Responsibility: Render the accordion expand/collapse icon.
 * Does not manage accordion state or header logic.
 *
 * @module components/ui/Accordion/AccordionIcon
 */

import { forwardRef, memo, useMemo } from 'react';
import PropTypes from 'prop-types';
import { motion, useReducedMotion } from 'framer-motion';

import {
  ACCORDION_DEFAULTS,
} from './accordionVariants';
import {
  mergeClasses,
  resolveResponsiveClasses,
  getAccordionIconClasses,
} from './accordionUtils';

/* ---------------------------------- */
/* Component-specific tokens          */
/* ---------------------------------- */

/** Motion variants for icon rotation. */
const ICON_MOTION = {
  initial: { rotate: 0 },
  animate: { rotate: 180 },
  transition: { duration: 0.25, ease: [0.4, 0, 0.2, 1] },
};

/** Size mapping. */
const SIZE_MAP = {
  xs: 'h-3 w-3',
  sm: 'h-4 w-4',
  md: 'h-4 w-4',
  lg: 'h-5 w-5',
  xl: 'h-5 w-5',
};

/* ---------------------------------- */
/* Component                          */
/* ---------------------------------- */

/**
 * AccordionIcon – the expand/collapse icon for an accordion.
 *
 * @component
 * @example
 * <AccordionIcon open={isOpen} />
 */
const AccordionIcon = memo(
  forwardRef(function AccordionIcon(
    {
      open = false,
      size = ACCORDION_DEFAULTS.size,
      disabled = false,
      loading = false,
      responsive,
      className = '',
      role = 'img',
      'aria-label': ariaLabel,
      ...rest
    },
    ref,
  ) {
    const prefersReducedMotion = useReducedMotion();

    // Icon size.
    const sizeClass = useMemo(
      () => SIZE_MAP[size] || SIZE_MAP.md,
      [size],
    );

    // Icon classes.
    const iconClasses = useMemo(
      () =>
        getAccordionIconClasses({
          size,
          className,
          open,
          disabled,
        }),
      [size, className, open, disabled],
    );

    // Responsive overrides.
    const responsiveClasses = useMemo(
      () => (responsive ? resolveResponsiveClasses(responsive) : ''),
      [responsive],
    );

    const finalClasses = useMemo(
      () => mergeClasses(iconClasses, responsiveClasses),
      [iconClasses, responsiveClasses],
    );

    // Motion props - respect reduced motion.
    const motionProps = useMemo(() => {
      if (prefersReducedMotion) {
        return { initial: false, animate: open };
      }
      return ICON_MOTION;
    }, [prefersReducedMotion, open]);

    // Accessibility attributes.
    const ariaProps = useMemo(
      () => ({
        role,
        'aria-label': ariaLabel || (open ? 'Collapse' : 'Expand'),
        'aria-hidden': !ariaLabel,
        'data-open': open || undefined,
        'data-disabled': disabled || undefined,
      }),
      [role, ariaLabel, open, disabled],
    );

    // If loading, render a spinner instead.
    if (loading) {
      return (
        <svg
          ref={ref}
          className={mergeClasses(sizeClass, 'animate-spin')}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
          aria-hidden="true"
          {...rest}
        >
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 0 1 8-8v4a4 4 0 0 0-4 4H4z" />
        </svg>
      );
    }

    return (
      <motion.span
        ref={ref}
        className={finalClasses}
        animate={open ? 'animate' : 'initial'}
        {...motionProps}
        {...ariaProps}
        {...rest}
      >
        <svg
          className={sizeClass}
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
      </motion.span>
    );
  }),
);

AccordionIcon.displayName = 'AccordionIcon';

AccordionIcon.propTypes = {
  /** Whether the accordion is open. */
  open: PropTypes.bool,
  /** Size preset. */
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
  /** Disabled state. */
  disabled: PropTypes.bool,
  /** Loading state. */
  loading: PropTypes.bool,
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

export default AccordionIcon;