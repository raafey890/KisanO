/**
 * KisanO Design System — Chart Package
 * ChartContainer
 *
 * The container component that wraps the chart and handles layout,
 * sizing, and accessibility attributes.
 *
 * Single Responsibility: Render the chart container with layout and styling.
 * Does not manage chart state or business logic.
 *
 * @module components/ui/Chart/ChartContainer
 */

import { forwardRef, memo, useMemo } from 'react';
import PropTypes from 'prop-types';
import { motion, useReducedMotion } from 'framer-motion';

import {
  CHART_DEFAULTS,
} from './chartVariants';
import {
  mergeClasses,
  resolveResponsiveClasses,
  resolveDefaultProps,
  getChartContainerClasses,
} from './chartUtils';

/* ---------------------------------- */
/* Component-specific tokens          */
/* ---------------------------------- */

/** Motion variants for container animation. */
const CONTAINER_MOTION = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
};

/** Aspect ratio mapping. */
const ASPECT_RATIO_MAP = {
  auto: '',
  '16:9': 'aspect-video',
  '4:3': 'aspect-[4/3]',
  '1:1': 'aspect-square',
  '21:9': 'aspect-[21/9]',
};

/** Default aspect ratio when not provided. */
const DEFAULT_ASPECT_RATIO = 'auto';

/* ---------------------------------- */
/* Component                          */
/* ---------------------------------- */

/**
 * ChartContainer – the main chart wrapper with layout and styling.
 *
 * @component
 * @example
 * <ChartContainer variant="default" size="md" aspectRatio="16:9">
 *   <LineChart />
 * </ChartContainer>
 */
const ChartContainer = memo(
  forwardRef(function ChartContainer(
    {
      children,
      variant = CHART_DEFAULTS.variant,
      size = CHART_DEFAULTS.size,
      aspectRatio = DEFAULT_ASPECT_RATIO,
      responsive = true,
      disabled = false,
      loading = false,
      responsiveClasses,
      className = '',
      role = 'figure',
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
          responsive,
          disabled,
          loading,
        }),
      [variant, size, responsive, disabled, loading],
    );

    // Aspect ratio classes.
    const aspectRatioClasses = useMemo(
      () => ASPECT_RATIO_MAP[aspectRatio] || ASPECT_RATIO_MAP[DEFAULT_ASPECT_RATIO],
      [aspectRatio],
    );

    // Chart container classes.
    const chartContainerClasses = useMemo(
      () =>
        getChartContainerClasses({
          className,
          disabled: resolved.disabled,
          loading: resolved.loading,
          responsive: resolved.responsive,
        }),
      [className, resolved.disabled, resolved.loading, resolved.responsive],
    );

    // Responsive overrides.
    const responsiveOverrideClasses = useMemo(
      () => (responsiveClasses ? resolveResponsiveClasses(responsiveClasses) : ''),
      [responsiveClasses],
    );

    const finalClasses = useMemo(
      () => mergeClasses(chartContainerClasses, responsiveOverrideClasses, aspectRatioClasses),
      [chartContainerClasses, responsiveOverrideClasses, aspectRatioClasses],
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
        'aria-label': ariaLabel || 'Chart',
        'aria-disabled': resolved.disabled || undefined,
        'aria-busy': resolved.loading || undefined,
        'data-variant': resolved.variant,
        'data-size': resolved.size,
        'data-aspect-ratio': aspectRatio,
        'data-responsive': resolved.responsive || undefined,
      }),
      [
        role,
        ariaLabel,
        resolved.variant,
        resolved.disabled,
        resolved.loading,
        resolved.size,
        aspectRatio,
        resolved.responsive,
      ],
    );

    return (
      <motion.div
        ref={ref}
        className={finalClasses}
        {...motionProps}
        {...ariaProps}
        {...rest}
      >
        <div className="relative w-full h-full">
          {children}
        </div>
      </motion.div>
    );
  }),
);

ChartContainer.displayName = 'ChartContainer';

ChartContainer.propTypes = {
  /** Chart content (LineChart, BarChart, etc.). */
  children: PropTypes.node,
  /** Visual variant. */
  variant: PropTypes.oneOf(['default', 'dark', 'glass', 'minimal']),
  /** Size preset. */
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
  /** Aspect ratio. */
  aspectRatio: PropTypes.oneOf(['auto', '16:9', '4:3', '1:1', '21:9']),
  /** Responsive chart. */
  responsive: PropTypes.bool,
  /** Disabled state. */
  disabled: PropTypes.bool,
  /** Loading state. */
  loading: PropTypes.bool,
  /** Responsive overrides. */
  responsiveClasses: PropTypes.shape({
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

export default ChartContainer;