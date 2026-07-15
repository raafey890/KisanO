/**
 * KisanO Design System — Accordion Package
 * AccordionContent
 *
 * The content panel for an accordion item. Renders content with animated
 * expand and collapse transitions, and supports lazy rendering.
 *
 * Single Responsibility: Render the accordion content panel.
 * Does not manage accordion state or header logic.
 *
 * @module components/ui/Accordion/AccordionContent
 */

import { forwardRef, memo, useMemo } from 'react';
import PropTypes from 'prop-types';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';

import {
  ACCORDION_DEFAULTS,
  getAccordionAnimation,
} from './accordionVariants';
import {
  mergeClasses,
  resolveResponsiveClasses,
  getAccordionContentClasses,
} from './accordionUtils';

/* ---------------------------------- */
/* Component-specific tokens          */
/* ---------------------------------- */

/** Motion variants for content animation. */
const CONTENT_MOTION = {
  initial: { height: 0, opacity: 0 },
  animate: { height: 'auto', opacity: 1 },
  exit: { height: 0, opacity: 0 },
  transition: { duration: 0.25, ease: [0.4, 0, 0.2, 1] },
};

/** Staggered animation variants for children. */
const STAGGER_MOTION = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { staggerChildren: 0.05 },
};

/* ---------------------------------- */
/* Component                          */
/* ---------------------------------- */

/**
 * AccordionContent – the content panel for an accordion item.
 *
 * @component
 * @example
 * <AccordionContent open={isOpen}>
 *   Content for the accordion section
 * </AccordionContent>
 */
const AccordionContent = memo(
  forwardRef(function AccordionContent(
    {
      children,
      open = false,
      lazy = true,
      animation = ACCORDION_DEFAULTS.animation,
      size = ACCORDION_DEFAULTS.size,
      disabled = false,
      loading = false,
      responsive,
      className = '',
      role = 'region',
      'aria-label': ariaLabel,
      ...rest
    },
    ref,
  ) {
    const prefersReducedMotion = useReducedMotion();

    // Content classes.
    const contentClasses = useMemo(
      () =>
        getAccordionContentClasses({
          size,
          className,
          disabled,
          loading,
        }),
      [size, className, disabled, loading],
    );

    // Responsive overrides.
    const responsiveClasses = useMemo(
      () => (responsive ? resolveResponsiveClasses(responsive) : ''),
      [responsive],
    );

    const finalClasses = useMemo(
      () => mergeClasses(contentClasses, responsiveClasses),
      [contentClasses, responsiveClasses],
    );

    // Determine if content should be rendered.
    const shouldRender = !lazy || open;

    // Animation configuration - respect reduced motion.
    const animationConfig = useMemo(() => {
      if (prefersReducedMotion) {
        return { initial: false, animate: true, exit: false };
      }
      return getAccordionAnimation(animation);
    }, [prefersReducedMotion, animation]);

    // Stagger motion props for children.
    const staggerProps = useMemo(() => {
      if (prefersReducedMotion) {
        return { initial: false, animate: true };
      }
      return STAGGER_MOTION;
    }, [prefersReducedMotion]);

    // Accessibility attributes.
    const ariaProps = useMemo(
      () => ({
        role,
        'aria-label': ariaLabel || 'Accordion content',
        'aria-hidden': !open,
        'aria-disabled': disabled || undefined,
        'aria-busy': loading || undefined,
        'data-open': open || undefined,
      }),
      [role, ariaLabel, open, disabled, loading],
    );

    // If not rendered and lazy, return null.
    if (!shouldRender) {
      return null;
    }

    // If not open but rendered (lazy=false), render without animation.
    if (!open) {
      return (
        <div
          ref={ref}
          className={finalClasses}
          hidden={!open}
          {...ariaProps}
          {...rest}
        >
          {children}
        </div>
      );
    }

    // Render with animation.
    return (
      <motion.div
        ref={ref}
        className={finalClasses}
        initial={animationConfig.initial}
        animate={animationConfig.animate}
        exit={animationConfig.exit}
        transition={animationConfig.transition}
        {...ariaProps}
        {...rest}
      >
        <motion.div {...staggerProps}>
          {children}
        </motion.div>
      </motion.div>
    );
  }),
);

AccordionContent.displayName = 'AccordionContent';

AccordionContent.propTypes = {
  /** Content to render. */
  children: PropTypes.node,
  /** Whether the content is open. */
  open: PropTypes.bool,
  /** Whether to lazy render content (only render when open). */
  lazy: PropTypes.bool,
  /** Animation type. */
  animation: PropTypes.oneOf(['slide', 'fade', 'scale', 'none']),
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

export default AccordionContent;