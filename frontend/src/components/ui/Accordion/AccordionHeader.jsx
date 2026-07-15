/**
 * KisanO Design System — Accordion Package
 * AccordionHeader
 *
 * The header/trigger component for an accordion item. Handles click and
 * keyboard interactions to toggle the accordion content.
 *
 * Single Responsibility: Render the accordion header trigger.
 * Does not manage accordion state or content rendering.
 *
 * @module components/ui/Accordion/AccordionHeader
 */

import { forwardRef, memo, useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import { motion, useReducedMotion } from 'framer-motion';

import {
  ACCORDION_DEFAULTS,
} from './accordionVariants';
import {
  mergeClasses,
  resolveResponsiveClasses,
  getAccordionHeaderClasses,
} from './accordionUtils';

/* ---------------------------------- */
/* Component-specific tokens          */
/* ---------------------------------- */

/** Motion variants for header interaction. */
const HEADER_MOTION = {
  initial: { scale: 1 },
  hover: { scale: 1.02 },
  tap: { scale: 0.98 },
  transition: { duration: 0.15, ease: [0.4, 0, 0.2, 1] },
};

/* ---------------------------------- */
/* Component                          */
/* ---------------------------------- */

/**
 * AccordionHeader – the trigger for an accordion item.
 *
 * @component
 * @example
 * <AccordionHeader open={isOpen} onClick={handleToggle}>
 *   Section Title
 * </AccordionHeader>
 */
const AccordionHeader = memo(
  forwardRef(function AccordionHeader(
    {
      children,
      index = 0,
      open = false,
      disabled = false,
      loading = false,
      onClick,
      variant = ACCORDION_DEFAULTS.variant,
      size = ACCORDION_DEFAULTS.size,
      responsive,
      className = '',
      role = 'button',
      'aria-label': ariaLabel,
      ...rest
    },
    ref,
  ) {
    const prefersReducedMotion = useReducedMotion();

    // Header classes.
    const headerClasses = useMemo(
      () =>
        getAccordionHeaderClasses({
          variant,
          size,
          className,
          open,
          disabled,
          loading,
        }),
      [variant, size, className, open, disabled, loading],
    );

    // Responsive overrides.
    const responsiveClasses = useMemo(
      () => (responsive ? resolveResponsiveClasses(responsive) : ''),
      [responsive],
    );

    const finalClasses = useMemo(
      () => mergeClasses(headerClasses, responsiveClasses),
      [headerClasses, responsiveClasses],
    );

    // Handle click.
    const handleClick = useCallback(
      (event) => {
        if (disabled || loading) return;
        onClick?.(event);
      },
      [disabled, loading, onClick],
    );

    // Handle keyboard.
    const handleKeyDown = useCallback(
      (event) => {
        if (disabled || loading) return;
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          onClick?.(event);
        }
      },
      [disabled, loading, onClick],
    );

    // Motion props - respect reduced motion.
    const motionProps = useMemo(() => {
      if (prefersReducedMotion || disabled || loading) {
        return {
          whileHover: undefined,
          whileTap: undefined,
          transition: undefined,
        };
      }
      return {
        whileHover: HEADER_MOTION.hover,
        whileTap: HEADER_MOTION.tap,
        transition: HEADER_MOTION.transition,
      };
    }, [prefersReducedMotion, disabled, loading]);

    // Accessibility attributes.
    const ariaProps = useMemo(
      () => ({
        role,
        'aria-label': ariaLabel || `Accordion section ${index + 1}`,
        'aria-expanded': open,
        'aria-disabled': disabled || undefined,
        'aria-controls': `accordion-content-${index}`,
        tabIndex: disabled ? -1 : 0,
        'data-index': index,
        'data-open': open || undefined,
        'data-disabled': disabled || undefined,
      }),
      [role, ariaLabel, index, open, disabled],
    );

    return (
      <motion.button
        ref={ref}
        type="button"
        className={finalClasses}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        {...motionProps}
        {...ariaProps}
        {...rest}
      >
        {children}
      </motion.button>
    );
  }),
);

AccordionHeader.displayName = 'AccordionHeader';

AccordionHeader.propTypes = {
  /** Header content. */
  children: PropTypes.node,
  /** Item index. */
  index: PropTypes.number,
  /** Whether the item is open. */
  open: PropTypes.bool,
  /** Disabled state. */
  disabled: PropTypes.bool,
  /** Loading state. */
  loading: PropTypes.bool,
  /** Click handler. */
  onClick: PropTypes.func,
  /** Visual variant. */
  variant: PropTypes.oneOf(['default', 'outlined', 'filled', 'ghost', 'minimal']),
  /** Size preset. */
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
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

export default AccordionHeader;