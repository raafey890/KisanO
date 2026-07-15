/**
 * KisanO Design System — Spinner Package
 * SpinnerContainer
 *
 * The container component that wraps the spinner and handles layout,
 * positioning, and accessibility attributes.
 *
 * Single Responsibility: Render the spinner container with layout and styling.
 * Does not manage spinner state or business logic.
 *
 * @module components/ui/Spinner/SpinnerContainer
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
  resolveDefaultProps,
  getSpinnerContainerClasses,
} from './spinnerUtils';

/* ---------------------------------- */
/* Component-specific tokens          */
/* ---------------------------------- */

/** Motion variants for container animation. */
const CONTAINER_MOTION = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: 0.2, ease: [0.4, 0, 0.2, 1] },
};

/** Layout variants. */
const LAYOUT_MAP = {
  inline: 'inline-flex',
  centered: 'flex',
  fullscreen: 'fixed inset-0 flex',
};

/** Default layout when not provided. */
const DEFAULT_LAYOUT = 'inline';

/** Background overlay for fullscreen layout. */
const FULLSCREEN_BG = 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm';

/* ---------------------------------- */
/* Component                          */
/* ---------------------------------- */

/**
 * SpinnerContainer – the main spinner wrapper with layout and styling.
 *
 * @component
 * @example
 * <SpinnerContainer layout="centered">
 *   <SpinnerRing />
 * </SpinnerContainer>
 *
 * @example
 * <SpinnerContainer layout="fullscreen" overlay>
 *   <Spinner />
 * </SpinnerContainer>
 */
const SpinnerContainer = memo(
  forwardRef(function SpinnerContainer(
    {
      children,
      layout = DEFAULT_LAYOUT,
      variant = SPINNER_DEFAULTS.variant,
      size = SPINNER_DEFAULTS.size,
      disabled = false,
      loading = true,
      overlay = false,
      responsive,
      className = '',
      role = 'status',
      'aria-label': ariaLabel = 'Loading',
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

    // Determine if loading.
    const isLoading = resolved.loading && !resolved.disabled;

    // Layout classes.
    const layoutClass = useMemo(
      () => LAYOUT_MAP[layout] || LAYOUT_MAP[DEFAULT_LAYOUT],
      [layout],
    );

    // Spinner container classes.
    const containerClasses = useMemo(
      () =>
        getSpinnerContainerClasses({
          className,
          disabled: resolved.disabled,
          loading: isLoading,
          orientation: 'horizontal',
        }),
      [className, resolved.disabled, isLoading],
    );

    // Responsive overrides.
    const responsiveClasses = useMemo(
      () => (responsive ? resolveResponsiveClasses(responsive) : ''),
      [responsive],
    );

    // Fullscreen overlay classes.
    const overlayClasses = useMemo(() => {
      if (!overlay || layout !== 'fullscreen') return '';
      return mergeClasses(FULLSCREEN_BG, 'z-50');
    }, [overlay, layout]);

    // Alignment classes.
    const alignClasses = useMemo(() => {
      if (layout === 'centered' || layout === 'fullscreen') {
        return 'items-center justify-center';
      }
      return 'items-center';
    }, [layout]);

    const finalClasses = useMemo(
      () => mergeClasses(layoutClass, alignClasses, containerClasses, overlayClasses, responsiveClasses),
      [layoutClass, alignClasses, containerClasses, overlayClasses, responsiveClasses],
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
        'aria-busy': isLoading || undefined,
        'aria-disabled': resolved.disabled || undefined,
        'data-layout': layout,
        'data-size': resolved.size,
        'data-variant': resolved.variant,
      }),
      [role, ariaLabel, isLoading, resolved.disabled, layout, resolved.size, resolved.variant],
    );

    // If not loading, render nothing.
    if (!isLoading) {
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
        {children}
      </motion.div>
    );
  }),
);

SpinnerContainer.displayName = 'SpinnerContainer';

SpinnerContainer.propTypes = {
  /** Spinner elements. */
  children: PropTypes.node,
  /** Layout type. */
  layout: PropTypes.oneOf(['inline', 'centered', 'fullscreen']),
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
  /** Size preset. */
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl', '2xl']),
  /** Disabled state. */
  disabled: PropTypes.bool,
  /** Loading state. */
  loading: PropTypes.bool,
  /** Whether to show overlay for fullscreen layout. */
  overlay: PropTypes.bool,
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

export default SpinnerContainer;