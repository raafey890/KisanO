/**
 * KisanO Design System — Progress Package
 * ProgressLabel
 *
 * The label component for progress. Renders label text with optional
 * description and alignment support.
 *
 * Single Responsibility: Render the progress label.
 * Does not manage progress state or business logic.
 *
 * @module components/ui/Progress/ProgressLabel
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
  getProgressLabelClasses,
} from './progressUtils';

/* ---------------------------------- */
/* Component-specific tokens          */
/* ---------------------------------- */

/** Motion variants for label animation. */
const LABEL_MOTION = {
  initial: { opacity: 0, y: -4 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -4 },
  transition: { duration: 0.15, ease: [0.4, 0, 0.2, 1] },
};

/** Alignment mapping. */
const ALIGNMENT_MAP = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
};

/** Default alignment when not provided. */
const DEFAULT_ALIGN = 'left';

/* ---------------------------------- */
/* Component                          */
/* ---------------------------------- */

/**
 * ProgressLabel – the label for progress bars.
 *
 * @component
 * @example
 * <ProgressLabel>Loading...</ProgressLabel>
 *
 * @example
 * <ProgressLabel variant="primary" size="lg" align="center">
 *   Upload Progress
 * </ProgressLabel>
 */
const ProgressLabel = memo(
  forwardRef(function ProgressLabel(
    {
      children,
      description,
      variant = PROGRESS_DEFAULTS.variant,
      size = PROGRESS_DEFAULTS.size,
      align = DEFAULT_ALIGN,
      disabled = false,
      loading = false,
      responsive,
      className = '',
      role = 'heading',
      'aria-level': ariaLevel = 3,
      ...rest
    },
    ref,
  ) {
    const prefersReducedMotion = useReducedMotion();

    // Label classes.
    const labelClasses = useMemo(
      () =>
        getProgressLabelClasses({
          size,
          className,
          disabled,
          variant,
        }),
      [size, className, disabled, variant],
    );

    // Responsive overrides.
    const responsiveClasses = useMemo(
      () => (responsive ? resolveResponsiveClasses(responsive) : ''),
      [responsive],
    );

    const finalClasses = useMemo(
      () => mergeClasses(labelClasses, responsiveClasses),
      [labelClasses, responsiveClasses],
    );

    // Alignment classes.
    const alignClasses = useMemo(
      () => ALIGNMENT_MAP[align] || ALIGNMENT_MAP[DEFAULT_ALIGN],
      [align],
    );

    // Motion props - respect reduced motion.
    const motionProps = useMemo(() => {
      if (prefersReducedMotion) {
        return { initial: false, animate: true, exit: false };
      }
      return LABEL_MOTION;
    }, [prefersReducedMotion]);

    // Accessibility attributes.
    const ariaProps = useMemo(
      () => ({
        role,
        'aria-level': ariaLevel,
        'aria-disabled': disabled || undefined,
        'aria-busy': loading || undefined,
      }),
      [role, ariaLevel, disabled, loading],
    );

    // If loading, render a simple loading state.
    if (loading) {
      return (
        <motion.div
          ref={ref}
          className={finalClasses}
          {...motionProps}
          {...ariaProps}
          {...rest}
        >
          <div className="flex items-center gap-2">
            <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
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
        className={mergeClasses(finalClasses, alignClasses)}
        {...motionProps}
        {...ariaProps}
        {...rest}
      >
        <span className="block">{children}</span>
        {description && (
          <span className="block text-sm text-gray-500">{description}</span>
        )}
      </motion.div>
    );
  }),
);

ProgressLabel.displayName = 'ProgressLabel';

ProgressLabel.propTypes = {
  /** Label content. */
  children: PropTypes.node,
  /** Description text. */
  description: PropTypes.node,
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
  /** Text alignment. */
  align: PropTypes.oneOf(['left', 'center', 'right']),
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
  /** ARIA heading level. */
  'aria-level': PropTypes.number,
};

export default ProgressLabel;