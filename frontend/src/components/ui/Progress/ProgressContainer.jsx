/**
 * KisanO Design System — Progress Package
 * ProgressContainer
 *
 * The container component that wraps the progress and handles layout,
 * styling, and accessibility attributes.
 *
 * Single Responsibility: Render the progress container with layout and styling.
 * Does not manage progress state or business logic.
 *
 * @module components/ui/Progress/ProgressContainer
 */

import { forwardRef, memo, useMemo } from 'react';
import PropTypes from 'prop-types';
import { motion, useReducedMotion } from 'framer-motion';

import {
  PROGRESS_DEFAULTS,
} from './progressVariants';
import {
  mergeClasses,
  resolveResponsiveClasses,
  resolveDefaultProps,
  getProgressClasses,
  getProgressContainerClasses,
} from './progressUtils';

/* ---------------------------------- */
/* Component-specific tokens          */
/* ---------------------------------- */

/** Motion variants for container animation. */
const CONTAINER_MOTION = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: 0.2, ease: [0.4, 0, 0.2, 1] },
};

/** Orientation mapping. */
const ORIENTATION_MAP = {
  horizontal: 'flex-row',
  vertical: 'flex-col',
};

/** Default orientation when not provided. */
const DEFAULT_ORIENTATION = 'horizontal';

/* ---------------------------------- */
/* Component                          */
/* ---------------------------------- */

/**
 * ProgressContainer – the main progress wrapper with layout and styling.
 *
 * @component
 * @example
 * <ProgressContainer variant="primary" size="md">
 *   <ProgressBar value={75} />
 * </ProgressContainer>
 */
const ProgressContainer = memo(
  forwardRef(function ProgressContainer(
    {
      children,
      variant = PROGRESS_DEFAULTS.variant,
      size = PROGRESS_DEFAULTS.size,
      orientation = DEFAULT_ORIENTATION,
      disabled = false,
      loading = false,
      responsive,
      className = '',
      role = 'progressbar',
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
          disabled,
          loading,
        }),
      [variant, size, disabled, loading],
    );

    // Orientation classes.
    const orientationClasses = useMemo(
      () => ORIENTATION_MAP[orientation] || ORIENTATION_MAP[DEFAULT_ORIENTATION],
      [orientation],
    );

    // Progress classes.
    const progressClasses = useMemo(
      () =>
        getProgressClasses({
          variant: resolved.variant,
          size: resolved.size,
          className,
          disabled: resolved.disabled,
          loading: resolved.loading,
        }),
      [
        resolved.variant,
        resolved.size,
        className,
        resolved.disabled,
        resolved.loading,
      ],
    );

    // Container classes.
    const containerClasses = useMemo(
      () =>
        getProgressContainerClasses({
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
      () => mergeClasses(progressClasses, orientationClasses, responsiveClasses),
      [progressClasses, orientationClasses, responsiveClasses],
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
        'aria-label': ariaLabel || 'Progress',
        'aria-disabled': resolved.disabled || undefined,
        'aria-busy': resolved.loading || undefined,
        'data-variant': resolved.variant,
        'data-size': resolved.size,
        'data-orientation': orientation,
      }),
      [role, ariaLabel, resolved.variant, resolved.disabled, resolved.loading, resolved.size, orientation],
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

ProgressContainer.displayName = 'ProgressContainer';

ProgressContainer.propTypes = {
  /** Progress content (Bar, Label, etc.). */
  children: PropTypes.node,
  /** Visual variant. */
  variant: PropTypes.oneOf([
    'default',
    'primary',
    'secondary',
    'success',
    'warning',
    'error',
    'info',
    'gradient',
  ]),
  /** Size preset. */
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
  /** Orientation. */
  orientation: PropTypes.oneOf(['horizontal', 'vertical']),
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

export default ProgressContainer;