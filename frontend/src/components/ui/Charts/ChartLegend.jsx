/**
 * KisanO Design System — Chart Package
 * ChartLegend
 *
 * The legend component for charts. Renders legend items with
 * color indicators, icons, and responsive layouts.
 *
 * Single Responsibility: Render a chart legend.
 * Does not manage chart state or business logic.
 *
 * @module components/ui/Chart/ChartLegend
 */

import { forwardRef, memo, useMemo } from 'react';
import PropTypes from 'prop-types';
import { motion, useReducedMotion } from 'framer-motion';

import {
  CHART_DEFAULTS,
  getChartColor,
} from './chartVariants';
import {
  mergeClasses,
  resolveResponsiveClasses,
  getLegendClasses,
} from './chartUtils';

/* ---------------------------------- */
/* Component-specific tokens          */
/* ---------------------------------- */

/** Motion variants for legend animation. */
const LEGEND_MOTION = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
  transition: { duration: 0.15, ease: [0.4, 0, 0.2, 1] },
};

/** Indicator types. */
const INDICATOR_TYPES = {
  circle: 'rounded-full',
  square: 'rounded',
  line: 'h-0.5 w-4',
  dot: 'rounded-full h-2 w-2',
};

/** Indicator size mapping. */
const INDICATOR_SIZES = {
  xs: 'h-2.5 w-2.5',
  sm: 'h-3 w-3',
  md: 'h-3.5 w-3.5',
  lg: 'h-4 w-4',
  xl: 'h-4.5 w-4.5',
};

/** Default indicator type when not provided. */
const DEFAULT_INDICATOR = 'circle';

/** Default layout when not provided. */
const DEFAULT_LAYOUT = 'horizontal';

/* ---------------------------------- */
/* Component                          */
/* ---------------------------------- */

/**
 * ChartLegend – a legend for charts.
 *
 * @component
 * @example
 * <ChartLegend
 *   items={[
 *     { name: 'Sales', color: '#3B82F6' },
 *     { name: 'Revenue', color: '#22C55E' },
 *   ]}
 * />
 *
 * @example
 * <ChartLegend
 *   items={items}
 *   layout="vertical"
 *   indicatorType="square"
 *   size="lg"
 * />
 */
const ChartLegend = memo(
  forwardRef(function ChartLegend(
    {
      items = [],
      layout = DEFAULT_LAYOUT,
      indicatorType = DEFAULT_INDICATOR,
      size = CHART_DEFAULTS.size,
      variant = CHART_DEFAULTS.variant,
      colors = CHART_DEFAULTS.colors,
      disabled = false,
      loading = false,
      responsive,
      className = '',
      role = 'list',
      'aria-label': ariaLabel = 'Chart legend',
      ...rest
    },
    ref,
  ) {
    const prefersReducedMotion = useReducedMotion();

    // Legend classes.
    const legendClasses = useMemo(
      () =>
        getLegendClasses({
          variant,
          size,
          className,
          disabled,
          position: layout === 'horizontal' ? 'bottom' : 'left',
        }),
      [variant, size, className, disabled, layout],
    );

    // Responsive overrides.
    const responsiveClasses = useMemo(
      () => (responsive ? resolveResponsiveClasses(responsive) : ''),
      [responsive],
    );

    const finalClasses = useMemo(
      () => mergeClasses(legendClasses, responsiveClasses),
      [legendClasses, responsiveClasses],
    );

    // Indicator size.
    const indicatorSize = useMemo(
      () => INDICATOR_SIZES[size] || INDICATOR_SIZES.md,
      [size],
    );

    // Indicator type class.
    const indicatorTypeClass = useMemo(
      () => INDICATOR_TYPES[indicatorType] || INDICATOR_TYPES[DEFAULT_INDICATOR],
      [indicatorType],
    );

    // Color palette.
    const colorPalette = useMemo(
      () => getChartColor(colors),
      [colors],
    );

    // Get color for an item.
    const getColor = useCallback(
      (index) => {
        const colorKeys = Object.keys(colorPalette);
        return colorPalette[colorKeys[index % colorKeys.length]];
      },
      [colorPalette],
    );

    // Motion props - respect reduced motion.
    const motionProps = useMemo(() => {
      if (prefersReducedMotion) {
        return { initial: false, animate: true, exit: false };
      }
      return LEGEND_MOTION;
    }, [prefersReducedMotion]);

    // Staggered animation variants.
    const staggerMotion = useMemo(() => {
      if (prefersReducedMotion) {
        return { initial: false, animate: true };
      }
      return {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        transition: { staggerChildren: 0.05 },
      };
    }, [prefersReducedMotion]);

    // Accessibility attributes.
    const ariaProps = useMemo(
      () => ({
        role,
        'aria-label': ariaLabel,
        'aria-disabled': disabled || undefined,
        'aria-busy': loading || undefined,
        'data-layout': layout,
        'data-size': size,
      }),
      [role, ariaLabel, disabled, loading, layout, size],
    );

    // If no items, render nothing.
    if (!items || items.length === 0) {
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
        <motion.ul
          className={mergeClasses(
            'flex flex-wrap gap-3',
            layout === 'vertical' ? 'flex-col' : 'flex-row',
          )}
          {...staggerMotion}
        >
          {items.map((item, index) => {
            const color = item.color || getColor(index);

            return (
              <motion.li
                key={item.name || index}
                className="flex items-center gap-2 text-sm cursor-default"
                initial={{ opacity: 0, x: -4 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.1, delay: index * 0.05 }}
              >
                <span
                  className={mergeClasses(
                    'shrink-0',
                    indicatorSize,
                    indicatorTypeClass,
                  )}
                  style={{ backgroundColor: color }}
                  aria-hidden="true"
                />
                <span>{item.name || `Item ${index + 1}`}</span>
                {item.value !== undefined && (
                  <span className="text-gray-500">{item.value}</span>
                )}
              </motion.li>
            );
          })}
        </motion.ul>
      </motion.div>
    );
  }),
);

ChartLegend.displayName = 'ChartLegend';

ChartLegend.propTypes = {
  /** Legend items. */
  items: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      color: PropTypes.string,
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    }),
  ),
  /** Layout direction. */
  layout: PropTypes.oneOf(['horizontal', 'vertical']),
  /** Indicator type. */
  indicatorType: PropTypes.oneOf(['circle', 'square', 'line', 'dot']),
  /** Size preset. */
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
  /** Visual variant. */
  variant: PropTypes.oneOf(['default', 'dark', 'glass', 'minimal']),
  /** Color palette. */
  colors: PropTypes.oneOf(['default', 'pastel', 'vibrant', 'dark', 'gradient']),
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

export default ChartLegend;