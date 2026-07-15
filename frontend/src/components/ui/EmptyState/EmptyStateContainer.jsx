/**
 * KisanO Design System — EmptyState Package
 * EmptyStateContainer
 *
 * The container component that wraps the empty state and handles layout,
 * styling, and accessibility attributes.
 *
 * Single Responsibility: Render the empty state container with layout and styling.
 * Does not manage empty state or business logic.
 *
 * @module components/ui/EmptyState/EmptyStateContainer
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
  resolveDefaultProps,
  getEmptyStateClasses,
  getEmptyStateContainerClasses,
} from './emptyStateUtils';

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
 * EmptyStateContainer – the main empty state wrapper with layout and styling.
 *
 * @component
 * @example
 * <EmptyStateContainer variant="default" size="md" alignment="center">
 *   <EmptyStateIcon />
 *   <EmptyStateTitle>No Data</EmptyStateTitle>
 * </EmptyStateContainer>
 */
const EmptyStateContainer = memo(
  forwardRef(function EmptyStateContainer(
    {
      children,
      variant = EMPTYSTATE_DEFAULTS.variant,
      size = EMPTYSTATE_DEFAULTS.size,
      radius = EMPTYSTATE_DEFAULTS.radius,
      alignment = EMPTYSTATE_DEFAULTS.alignment,
      disabled = false,
      loading = false,
      responsive,
      className = '',
      role = 'status',
      'aria-label': ariaLabel,
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
          alignment,
          disabled,
          loading,
        }),
      [variant, size, radius, alignment, disabled, loading],
    );

    // Empty state classes.
    const emptyStateClasses = useMemo(
      () =>
        getEmptyStateClasses({
          variant: resolved.variant,
          size: resolved.size,
          radius: resolved.radius,
          alignment: resolved.alignment,
          className,
          disabled: resolved.disabled,
          loading: resolved.loading,
        }),
      [
        resolved.variant,
        resolved.size,
        resolved.radius,
        resolved.alignment,
        className,
        resolved.disabled,
        resolved.loading,
      ],
    );

    // Container classes.
    const containerClasses = useMemo(
      () =>
        getEmptyStateContainerClasses({
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
      () => mergeClasses(emptyStateClasses, responsiveClasses),
      [emptyStateClasses, responsiveClasses],
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
        'aria-label': ariaLabel || 'Empty state',
        'aria-disabled': resolved.disabled || undefined,
        'aria-busy': resolved.loading || undefined,
        'data-variant': resolved.variant,
        'data-size': resolved.size,
        'data-alignment': resolved.alignment,
      }),
      [role, ariaLabel, resolved.variant, resolved.disabled, resolved.loading, resolved.size, resolved.alignment],
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

EmptyStateContainer.displayName = 'EmptyStateContainer';

EmptyStateContainer.propTypes = {
  /** Empty state content (Icon, Title, Description, etc.). */
  children: PropTypes.node,
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
  /** Border radius override. */
  radius: PropTypes.oneOf(['none', 'sm', 'md', 'lg', 'xl', '2xl', 'full']),
  /** Content alignment. */
  alignment: PropTypes.oneOf(['left', 'center', 'right']),
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

export default EmptyStateContainer;