/**
 * KisanO Design System — Accordion Package
 * AccordionItem
 *
 * A single accordion item that contains a header and content panel.
 * Supports expanded, disabled, and loading states with accessibility.
 *
 * Single Responsibility: Render one accordion item.
 * Does not manage accordion state or business logic.
 *
 * @module components/ui/Accordion/AccordionItem
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
  getAccordionItemClasses,
} from './accordionUtils';

/* ---------------------------------- */
/* Component-specific tokens          */
/* ---------------------------------- */

/** Motion variants for item animation. */
const ITEM_MOTION = {
  initial: { opacity: 0, y: -4 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -4 },
  transition: { duration: 0.2, ease: [0.4, 0, 0.2, 1] },
};

/* ---------------------------------- */
/* Component                          */
/* ---------------------------------- */

/**
 * AccordionItem – a single accordion item.
 *
 * @component
 * @example
 * <AccordionItem open={isOpen} index={0}>
 *   <AccordionHeader>Title</AccordionHeader>
 *   <AccordionContent>Content</AccordionContent>
 * </AccordionItem>
 */
const AccordionItem = memo(
  forwardRef(function AccordionItem(
    {
      children,
      index,
      open = false,
      disabled = false,
      loading = false,
      variant = ACCORDION_DEFAULTS.variant,
      responsive,
      className = '',
      role = 'listitem',
      'aria-label': ariaLabel,
      ...rest
    },
    ref,
  ) {
    const prefersReducedMotion = useReducedMotion();

    // Item classes.
    const itemClasses = useMemo(
      () =>
        getAccordionItemClasses({
          variant,
          className,
          open,
          disabled,
          loading,
        }),
      [variant, className, open, disabled, loading],
    );

    // Responsive overrides.
    const responsiveClasses = useMemo(
      () => (responsive ? resolveResponsiveClasses(responsive) : ''),
      [responsive],
    );

    const finalClasses = useMemo(
      () => mergeClasses(itemClasses, responsiveClasses),
      [itemClasses, responsiveClasses],
    );

    // Motion props - respect reduced motion.
    const motionProps = useMemo(() => {
      if (prefersReducedMotion) {
        return { initial: false, animate: true, exit: false };
      }
      return ITEM_MOTION;
    }, [prefersReducedMotion]);

    // Accessibility attributes.
    const ariaProps = useMemo(
      () => ({
        role,
        'aria-label': ariaLabel || `Accordion item ${index + 1}`,
        'aria-disabled': disabled || undefined,
        'data-index': index,
        'data-open': open || undefined,
        'data-disabled': disabled || undefined,
      }),
      [role, ariaLabel, index, disabled, open],
    );

    return (
      <motion.div
        ref={ref}
        className={finalClasses}
        {...motionProps}
        {...ariaProps}
        {...rest}
      >
        {children}
      </motion.div>
    );
  }),
);

AccordionItem.displayName = 'AccordionItem';

AccordionItem.propTypes = {
  /** Item content (Header and Content). */
  children: PropTypes.node,
  /** Item index. */
  index: PropTypes.number,
  /** Whether the item is open. */
  open: PropTypes.bool,
  /** Disabled state. */
  disabled: PropTypes.bool,
  /** Loading state. */
  loading: PropTypes.bool,
  /** Visual variant. */
  variant: PropTypes.oneOf(['default', 'outlined', 'filled', 'ghost', 'minimal']),
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

export default AccordionItem;