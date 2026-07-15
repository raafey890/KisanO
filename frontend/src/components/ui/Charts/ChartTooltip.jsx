/**
 * KisanO Design System — Chart Package
 * ChartTooltip
 *
 * The tooltip component for charts. Renders custom tooltips with
 * value formatting, label formatting, and multiple dataset support.
 *
 * Single Responsibility: Render a chart tooltip.
 * Does not manage chart state or business logic.
 *
 * @module components/ui/Chart/ChartTooltip
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
  getTooltipClasses,
} from './chartUtils';

/* ---------------------------------- */
/* Component-specific tokens          */
/* ---------------------------------- */

/** Motion variants for tooltip animation. */
const TOOLTIP_MOTION = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.95 },
  transition: { duration: 0.15, ease: [0.4, 0, 0.2, 1] },
};

/** Default position when not provided. */
const DEFAULT_POSITION = 'top';

/** Default alignment when not provided. */
const DEFAULT_ALIGN = 'center';

/* ---------------------------------- */
/* Component                          */
/* ---------------------------------- */

/**
 * ChartTooltip – a tooltip for charts.
 *
 * @component
 * @example
 * <ChartTooltip
 *   label="January"
 *   value={150}
 *   series={[
 *     { name: 'Sales', value: 100, color: '#3B82F6' },
 *     { name: 'Revenue', value: 50, color: '#22C55E' },
 *   ]}
 * />
 *
 * @example
 * <ChartTooltip
 *   label="Q1"
 *   value={1200}
 *   formatValue={(v) => `$${v}`}
 *   position="bottom"
 * />
 */
const ChartTooltip = memo(
  forwardRef(function ChartTooltip(
    {
      label,
      value,
      series = [],
      formatValue,
      formatLabel,
      variant = CHART_DEFAULTS.variant,
      colors = CHART_DEFAULTS.colors,
      position = DEFAULT_POSITION,
      align = DEFAULT_ALIGN,
      disabled = false,
      loading = false,
      responsive,
      className = '',
      role = 'tooltip',
      'aria-label': ariaLabel = 'Chart tooltip',
      ...rest
    },
    ref,
  ) {
    const prefersReducedMotion = useReducedMotion();

    // Tooltip classes.
    const tooltipClasses = useMemo(
      () =>
        getTooltipClasses({
          variant,
          className,
          disabled,
        }),
      [variant, className, disabled],
    );

    // Responsive overrides.
    const responsiveClasses = useMemo(
      () => (responsive ? resolveResponsiveClasses(responsive) : ''),
      [responsive],
    );

    // Position classes.
    const positionClasses = useMemo(() => {
      const map = {
        top: 'bottom-full mb-2',
        bottom: 'top-full mt-2',
        left: 'right-full mr-2',
        right: 'left-full ml-2',
      };
      return map[position] || map.top;
    }, [position]);

    // Alignment classes.
    const alignClasses = useMemo(() => {
      const map = {
        start: 'left-0',
        center: 'left-1/2 -translate-x-1/2',
        end: 'right-0',
      };
      return map[align] || map.center;
    }, [align]);

    const finalClasses = useMemo(
      () => mergeClasses(tooltipClasses, positionClasses, alignClasses, responsiveClasses),
      [tooltipClasses, positionClasses, alignClasses, responsiveClasses],
    );

    // Color palette.
    const colorPalette = useMemo(
      () => getChartColor(colors),
      [colors],
    );

    // Get color for a series.
    const getColor = useCallback(
      (index) => {
        const colorKeys = Object.keys(colorPalette);
        return colorPalette[colorKeys[index % colorKeys.length]];
      },
      [colorPalette],
    );

    // Format value.
    const formattedValue = useMemo(() => {
      if (formatValue) {
        return formatValue(value);
      }
      if (typeof value === 'number') {
        return value.toLocaleString();
      }
      return value;
    }, [value, formatValue]);

    // Format label.
    const formattedLabel = useMemo(() => {
      if (formatLabel) {
        return formatLabel(label);
      }
      return label;
    }, [label, formatLabel]);

    // Motion props - respect reduced motion.
    const motionProps = useMemo(() => {
      if (prefersReducedMotion) {
        return { initial: false, animate: true, exit: false };
      }
      return TOOLTIP_MOTION;
    }, [prefersReducedMotion]);

    // Accessibility attributes.
    const ariaProps = useMemo(
      () => ({
        role,
        'aria-label': ariaLabel,
        'aria-hidden': !label && !value && series.length === 0,
        'aria-disabled': disabled || undefined,
        'aria-busy': loading || undefined,
      }),
      [role, ariaLabel, label, value, series, disabled, loading],
    );

    // If no content, render nothing.
    if (!label && value === undefined && series.length === 0) {
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
        {/* Label */}
        {formattedLabel && (
          <div className="text-sm font-medium text-gray-900 dark:text-white mb-1">
            {formattedLabel}
          </div>
        )}

        {/* Value */}
        {value !== undefined && (
          <div className="text-sm text-gray-600 dark:text-gray-300">
            {formattedValue}
          </div>
        )}

        {/* Series */}
        {series.length > 0 && (
          <div className="mt-1 space-y-1">
            {series.map((item, index) => {
              const color = item.color || getColor(index);
              const itemValue = formatValue
                ? formatValue(item.value)
                : typeof item.value === 'number'
                  ? item.value.toLocaleString()
                  : item.value;

              return (
                <div key={item.name || index} className="flex items-center gap-2 text-sm">
                  <span
                    className="h-2.5 w-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: color }}
                    aria-hidden="true"
                  />
                  <span className="text-gray-600 dark:text-gray-300">
                    {item.name || `Series ${index + 1}`}: {itemValue}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </motion.div>
    );
  }),
);

ChartTooltip.displayName = 'ChartTooltip';

ChartTooltip.propTypes = {
  /** Tooltip label. */
  label: PropTypes.node,
  /** Tooltip value. */
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  /** Series data. */
  series: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      color: PropTypes.string,
    }),
  ),
  /** Value formatter function. */
  formatValue: PropTypes.func,
  /** Label formatter function. */
  formatLabel: PropTypes.func,
  /** Visual variant. */
  variant: PropTypes.oneOf(['default', 'dark', 'glass', 'minimal']),
  /** Color palette. */
  colors: PropTypes.oneOf(['default', 'pastel', 'vibrant', 'dark', 'gradient']),
  /** Tooltip position. */
  position: PropTypes.oneOf(['top', 'bottom', 'left', 'right']),
  /** Tooltip alignment. */
  align: PropTypes.oneOf(['start', 'center', 'end']),
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

export default ChartTooltip;