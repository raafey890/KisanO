/**
 * KisanO Design System — Accordion Package
 * AccordionContainer
 *
 * The container component that wraps the accordion and handles layout,
 * styling, and accessibility attributes.
 *
 * Single Responsibility: Render the accordion container with layout and styling.
 * Does not manage accordion state or business logic.
 *
 * @module components/ui/Accordion/AccordionContainer
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
  resolveDefaultProps,
  getAccordionClasses,
  getAccordionContainerClasses,
} from './accordionUtils';

/* ---------------------------------- */
/* Component-specific tokens          */
/* ---------------------------------- */

/** Motion variants for container animation. */
const CONTAINER_MOTION = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: 0.2, ease: [0.4, 0, 0.2, 1] },
};

/* ---------------------------------- */
/* Component                          */
/* ---------------------------------- */

/**
 * AccordionContainer – the main accordion wrapper with layout and styling.
 *
 * @component
 * @example
 * <AccordionContainer variant="default" size="md">
 *   <AccordionItem>
 *     <AccordionHeader>Section 1</AccordionHeader>
 *     <AccordionContent>Content 1</AccordionContent>
 *   </AccordionItem>
 * </AccordionContainer>
 */
const AccordionContainer = memo(
  forwardRef(function AccordionContainer(
    {
      children,
      variant = ACCORDION_DEFAULTS.variant,
      size = ACCORDION_DEFAULTS.size,
      radius = ACCORDION_DEFAULTS.radius,
      shadow = ACCORDION_DEFAULTS.shadow,
      disabled = false,
      loading = false,
      responsive,
      className = '',
      role = 'list',
      'aria-label': ariaLabel = 'Accordion',
      ...rest
    },
    ref,
  ) {
    const prefersReducedMotion = useReducedMotion();

    // Resolve defaults.
    const resolved = useMemo(
      () =>
        resolveDefaultProps({
          variant,
          size,
          radius,
          shadow,
          disabled,
          loading,
        }),
      [variant, size, radius, shadow, disabled, loading],
    );

    // Accordion classes.
    const accordionClasses = useMemo(
      () =>
        getAccordionClasses({
          variant: resolved.variant,
          size: resolved.size,
          radius: resolved.radius,
          shadow: resolved.shadow,
          className,
          disabled: resolved.disabled,
          loading: resolved.loading,
        }),
      [
        resolved.variant,
        resolved.size,
        resolved.radius,
        resolved.shadow,
        className,
        resolved.disabled,
        resolved.loading,
      ],
    );

    // Container classes.
    const containerClasses = useMemo(
      () =>
        getAccordionContainerClasses({
          className: '',
          disabled: resolved.disabled,
          loading: resolved.loading,
        }),
      [resolved.disabled, resolved.loading],
    );

    // Responsive overrides.
    const responsiveClasses = useMemo(
      () => (responsive ? resolveResponsiveClasses(responsive) : ''),
      [responsive],
    );

    const finalClasses = useMemo(
      () => mergeClasses(accordionClasses, responsiveClasses),
      [accordionClasses, responsiveClasses],
    );

    // Motion props - respect reduced motion.
    const motionProps = useMemo(() => {
      if (prefersReducedMotion) {
        return { initial: false, animate: true };
      }
      return CONTAINER_MOTION;
    }, [prefersReducedMotion]);

    // Accessibility attributes.
    const ariaProps = useMemo(
      () => ({
        role,
        'aria-label': ariaLabel,
        'aria-disabled': resolved.disabled || undefined,
        'aria-busy': resolved.loading || undefined,
        'data-variant': resolved.variant,
        'data-size': resolved.size,
      }),
      [role, ariaLabel, resolved.disabled, resolved.loading, resolved.variant, resolved.size],
    );

    return (
      <motion.div
        ref={ref}
        className={finalClasses}
        {...motionProps}
        {...ariaProps}
        {...rest}
      >
        <div className={containerClasses}>
          {children}
        </div>
      </motion.div>
    );
  }),
);

AccordionContainer.displayName = 'AccordionContainer';

AccordionContainer.propTypes = {
  /** Accordion content (items). */
  children: PropTypes.node,
  /** Visual variant. */
  variant: PropTypes.oneOf(['default', 'outlined', 'filled', 'ghost', 'minimal']),
  /** Size preset. */
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
  /** Border radius override. */
  radius: PropTypes.oneOf(['none', 'sm', 'md', 'lg', 'xl', '2xl', 'full']),
  /** Shadow level. */
  shadow: PropTypes.oneOf(['none', 'sm', 'md', 'lg', 'xl', '2xl']),
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

export default AccordionContainer;