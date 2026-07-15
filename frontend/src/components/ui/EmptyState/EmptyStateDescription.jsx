/**
 * KisanO Design System — EmptyState Package
 * EmptyStateDescription
 *
 * The description component for empty states. Renders descriptive text
 * with proper typography and accessibility support.
 *
 * Single Responsibility: Render the empty state description.
 * Does not manage empty state or business logic.
 *
 * @module components/ui/EmptyState/EmptyStateDescription
 */

import { forwardRef, memo, useMemo } from 'react';
import PropTypes from 'prop-types';
import { motion, useReducedMotion } from 'framer-motion';

import {
  EMPTYSTATE_DEFAULTS,
} from './emptyStateVariants';
import {
  mergeClasses,
  resolveResponsiveClasses,
  getEmptyStateDescriptionClasses,
} from './emptyStateUtils';

/* ---------------------------------- */
/* Component-specific tokens          */
/* ---------------------------------- */

/** Motion variants for description animation. */
const DESCRIPTION_MOTION = {
  initial: { opacity: 0, y: -4 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -4 },
  transition: { duration: 0.15, ease: [0.4, 0, 0.2, 1] },
};

/** Default element when not provided. */
const DEFAULT_ELEMENT = 'p';

/* ---------------------------------- */
/* Component                          */
/* ---------------------------------- */

/**
 * EmptyStateDescription – the description for empty states.
 *
 * @component
 * @example
 * <EmptyStateDescription>
 *   No data available at the moment.
 * </EmptyStateDescription>
 *
 * @example
 * <EmptyStateDescription variant="primary" size="lg">
 *   This folder is empty. Try adding some files.
 * </EmptyStateDescription>
 */
const EmptyStateDescription = memo(
  forwardRef(function EmptyStateDescription(
    {
      children,
      as = DEFAULT_ELEMENT,
      variant = EMPTYSTATE_DEFAULTS.variant,
      size = EMPTYSTATE_DEFAULTS.size,
      disabled = false,
      loading = false,
      responsive,
      className = '',
      role = 'text',
      'aria-label': ariaLabel,
      ...rest
    },
    ref,
  ) {
    const prefersReducedMotion = useReducedMotion();

    // Description classes.
    const descriptionClasses = useMemo(
      () =>
        getEmptyStateDescriptionClasses({
          variant,
          size,
          className,
          disabled,
          loading,
        }),
      [variant, size, className, disabled, loading],
    );

    // Responsive overrides.
    const responsiveClasses = useMemo(
      () => (responsive ? resolveResponsiveClasses(responsive) : ''),
      [responsive],
    );

    const finalClasses = useMemo(
      () => mergeClasses(descriptionClasses, responsiveClasses),
      [descriptionClasses, responsiveClasses],
    );

    // Element to render.
    const Element = useMemo(
      () => as || DEFAULT_ELEMENT,
      [as],
    );

    // Motion props - respect reduced motion.
    const motionProps = useMemo(() => {
      if (prefersReducedMotion) {
        return { initial: false, animate: true, exit: false };
      }
      return DESCRIPTION_MOTION;
    }, [prefersReducedMotion]);

    // Accessibility attributes.
    const ariaProps = useMemo(
      () => ({
        role,
        'aria-label': ariaLabel || (typeof children === 'string' ? children : 'Empty state description'),
        'aria-disabled': disabled || undefined,
        'aria-busy': loading || undefined,
      }),
      [role, ariaLabel, children, disabled, loading],
    );

    // If loading, render a loading placeholder.
    if (loading) {
      return (
        <motion.div
          ref={ref}
          className={finalClasses}
          {...motionProps}
          {...ariaProps}
          {...rest}
        >
          <div className="flex flex-col gap-2">
            <div className="h-4 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            <div className="h-4 w-36 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          </div>
        </motion.div>
      );
    }

    // If no children, render nothing.
    if (!children) {
      return null;
    }

    return (
      <motion.div
        ref={ref}
        className={finalClasses}
        {...motionProps}
        {...ariaProps}
        {...rest}
      >
        <Element className="m-0">{children}</Element>
      </motion.div>
    );
  }),
);

EmptyStateDescription.displayName = 'EmptyStateDescription';

EmptyStateDescription.propTypes = {
  /** Description content. */
  children: PropTypes.node,
  /** HTML element to render. */
  as: PropTypes.string,
  /** Visual variant. */
  variant: PropTypes.oneOf([
    'default',
    'subtle',
    'glass',
    'primary',
    'success',
    'warning',
    'error',
  ]),
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

export default EmptyStateDescription;