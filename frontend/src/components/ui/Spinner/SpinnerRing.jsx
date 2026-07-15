/**
 * KisanO Design System — Spinner Package
 * SpinnerRing
 *
 * The ring spinner component. Renders a circular spinning ring
 * with customizable size, color, and speed.
 *
 * Single Responsibility: Render a ring spinner.
 * Does not manage spinner state or business logic.
 *
 * @module components/ui/Spinner/SpinnerRing
 */

import { forwardRef, memo, useMemo } from 'react';
import PropTypes from 'prop-types';
import { motion, useReducedMotion } from 'framer-motion';

import {
  SPINNER_DEFAULTS,
} from './spinnerVariants';
import {
  mergeClasses,
  resolveResponsiveClasses,
  getSpinnerRingClasses,
} from './spinnerUtils';

/* ---------------------------------- */
/* Component-specific tokens          */
/* ---------------------------------- */

/** Motion variants for ring animation. */
const RING_MOTION = {
  initial: { rotate: 0 },
  animate: { rotate: 360 },
  transition: {
    duration: 0.7,
    repeat: Infinity,
    ease: 'linear',
  },
};

/** Stroke dasharray mapping. */
const STROKE_DASHARRAY = {
  xs: 24,
  sm: 30,
  md: 36,
  lg: 48,
  xl: 60,
  '2xl': 72,
};

/** Stroke dashoffset mapping. */
const STROKE_DASHOFFSET = {
  xs: 8,
  sm: 10,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
};

/** ViewBox mapping. */
const VIEWBOX = {
  xs: '0 0 24 24',
  sm: '0 0 30 30',
  md: '0 0 36 36',
  lg: '0 0 48 48',
  xl: '0 0 60 60',
  '2xl': '0 0 72 72',
};

/** Center mapping. */
const CENTER = {
  xs: 12,
  sm: 15,
  md: 18,
  lg: 24,
  xl: 30,
  '2xl': 36,
};

/** Radius mapping. */
const RADIUS = {
  xs: 8,
  sm: 10,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
};

/** Stroke width mapping. */
const STROKE_WIDTH = {
  xs: 2,
  sm: 2.5,
  md: 3,
  lg: 3.5,
  xl: 4,
  '2xl': 4.5,
};

/* ---------------------------------- */
/* Component                          */
/* ---------------------------------- */

/**
 * SpinnerRing – a circular ring spinner.
 *
 * @component
 * @example
 * <SpinnerRing size="md" variant="primary" />
 *
 * @example
 * <SpinnerRing size="lg" variant="white" speed="fast" />
 */
const SpinnerRing = memo(
  forwardRef(function SpinnerRing(
    {
      size = SPINNER_DEFAULTS.size,
      variant = SPINNER_DEFAULTS.variant,
      speed = SPINNER_DEFAULTS.speed,
      disabled = false,
      loading = true,
      responsive,
      className = '',
      role = 'img',
      'aria-label': ariaLabel = 'Loading',
      ...rest
    },
    ref,
  ) {
    const prefersReducedMotion = useReducedMotion();

    // Determine if loading.
    const isLoading = loading && !disabled;

    // Ring classes.
    const ringClasses = useMemo(
      () =>
        getSpinnerRingClasses({
          variant,
          size,
          speed,
          className,
          disabled,
          loading: isLoading,
        }),
      [variant, size, speed, className, disabled, isLoading],
    );

    // Responsive overrides.
    const responsiveClasses = useMemo(
      () => (responsive ? resolveResponsiveClasses(responsive) : ''),
      [responsive],
    );

    const finalClasses = useMemo(
      () => mergeClasses(ringClasses, responsiveClasses),
      [ringClasses, responsiveClasses],
    );

    // Get size-specific values.
    const viewBox = useMemo(
      () => VIEWBOX[size] || VIEWBOX.md,
      [size],
    );

    const center = useMemo(
      () => CENTER[size] || CENTER.md,
      [size],
    );

    const radius = useMemo(
      () => RADIUS[size] || RADIUS.md,
      [size],
    );

    const strokeWidth = useMemo(
      () => STROKE_WIDTH[size] || STROKE_WIDTH.md,
      [size],
    );

    const dasharray = useMemo(
      () => STROKE_DASHARRAY[size] || STROKE_DASHARRAY.md,
      [size],
    );

    const dashoffset = useMemo(
      () => STROKE_DASHOFFSET[size] || STROKE_DASHOFFSET.md,
      [size],
    );

    // Motion props - respect reduced motion.
    const motionProps = useMemo(() => {
      if (prefersReducedMotion || !isLoading) {
        return { initial: false, animate: true };
      }
      return RING_MOTION;
    }, [prefersReducedMotion, isLoading]);

    // Accessibility attributes.
    const ariaProps = useMemo(
      () => ({
        role,
        'aria-label': ariaLabel,
        'aria-busy': isLoading || undefined,
        'aria-disabled': disabled || undefined,
        'data-size': size,
        'data-variant': variant,
        'data-speed': speed,
      }),
      [role, ariaLabel, isLoading, disabled, size, variant, speed],
    );

    // If not loading, render nothing.
    if (!isLoading) {
      return null;
    }

    return (
      <motion.svg
        ref={ref}
        className={finalClasses}
        viewBox={viewBox}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...motionProps}
        {...ariaProps}
        {...rest}
      >
        {/* Track */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          strokeWidth={strokeWidth}
          stroke="currentColor"
          className="opacity-25"
        />
        {/* Spinning arc */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          stroke="currentColor"
          strokeDasharray={dasharray}
          strokeDashoffset={dashoffset}
        >
          {prefersReducedMotion && (
            <animateTransform
              attributeName="transform"
              type="rotate"
              from={`0 ${center} ${center}`}
              to={`360 ${center} ${center}`}
              dur={`${speed === 'fast' ? 0.4 : speed === 'faster' ? 0.2 : speed === 'slow' ? 1.0 : 0.7}s`}
              repeatCount="indefinite"
            />
          )}
        </circle>
      </motion.svg>
    );
  }),
);

SpinnerRing.displayName = 'SpinnerRing';

SpinnerRing.propTypes = {
  /** Size preset. */
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl', '2xl']),
  /** Visual variant. */
  variant: PropTypes.oneOf([
    'default',
    'primary',
    'secondary',
    'success',
    'warning',
    'error',
    'info',
    'white',
    'dark',
  ]),
  /** Speed preset. */
  speed: PropTypes.oneOf(['slow', 'normal', 'fast', 'faster']),
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

export default SpinnerRing;