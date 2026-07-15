/**
 * KisanO Design System — Chart Package
 * Chart
 *
 * The main Chart component that orchestrates all chart subcomponents.
 * Provides a convenient API for rendering line, bar, pie, and area charts
 * with legends, tooltips, and loading states.
 *
 * Single Responsibility: Orchestrate Chart subcomponents.
 * Does not contain business logic, helper functions, or duplicate styling.
 *
 * @module components/ui/Chart/Chart
 */

import { forwardRef, memo, useMemo } from 'react';
import PropTypes from 'prop-types';

import {
  CHART_DEFAULTS,
} from './chartVariants';
import {
  mergeClasses,
  resolveResponsiveClasses,
  resolveDefaultProps,
} from './chartUtils';

import ChartContainer from './ChartContainer';
import LineChart from './LineChart';
import BarChart from './BarChart';
import PieChart from './PieChart';
import AreaChart from './AreaChart';
import ChartLegend from './ChartLegend';
import ChartTooltip from './ChartTooltip';
import ChartLoader from './ChartLoader';

/* ---------------------------------- */
/* Component                          */
/* ---------------------------------- */

/**
 * Chart – the main chart component.
 *
 * @component
 * @example
 * <Chart
 *   type="line"
 *   data={[
 *     { label: 'Jan', value: 100 },
 *     { label: 'Feb', value: 150 },
 *   ]}
 * />
 *
 * @example
 * <Chart
 *   type="bar"
 *   data={data}
 *   variant="dark"
 *   size="lg"
 *   loading
 * />
 */
const Chart = memo(
  forwardRef(function Chart(
    {
      children,
      type = 'line',
      data = [],
      labels,
      series,
      title,
      description,
      variant = CHART_DEFAULTS.variant,
      size = CHART_DEFAULTS.size,
      colors = CHART_DEFAULTS.colors,
      animation = CHART_DEFAULTS.animation,
      responsive = CHART_DEFAULTS.responsive,
      showLegend = true,
      showTooltip = true,
      legendPosition = 'bottom',
      xAxisLabel,
      yAxisLabel,
      stacked = false,
      disabled = false,
      loading = false,
      className = '',
      containerClassName = '',
      legendClassName = '',
      tooltipClassName = '',
      containerProps,
      legendProps,
      tooltipProps,
      loaderProps,
      ...rest
    },
    ref,
  ) {
    // Resolve defaults.
    const resolved = useMemo(
      () =>
        resolveDefaultProps({
          variant,
          size,
          colors,
          animation,
          responsive,
          disabled,
          loading,
        }),
      [variant, size, colors, animation, responsive, disabled, loading],
    );

    // Determine if interactive.
    const isInteractive = !resolved.disabled && !resolved.loading;

    // Container props.
    const containerPropsMerged = useMemo(
      () => ({
        variant: resolved.variant,
        size: resolved.size,
        disabled: resolved.disabled,
        loading: resolved.loading,
        responsive: resolved.responsive,
        className: containerClassName,
        ...containerProps,
      }),
      [
        resolved.variant,
        resolved.size,
        resolved.disabled,
        resolved.loading,
        resolved.responsive,
        containerClassName,
        containerProps,
      ],
    );

    // Legend props.
    const legendPropsMerged = useMemo(
      () => ({
        variant: resolved.variant,
        size: resolved.size,
        disabled: resolved.disabled,
        loading: resolved.loading,
        position: legendPosition,
        className: legendClassName,
        ...legendProps,
      }),
      [
        resolved.variant,
        resolved.size,
        resolved.disabled,
        resolved.loading,
        legendPosition,
        legendClassName,
        legendProps,
      ],
    );

    // Tooltip props.
    const tooltipPropsMerged = useMemo(
      () => ({
        variant: resolved.variant,
        disabled: resolved.disabled,
        loading: resolved.loading,
        className: tooltipClassName,
        ...tooltipProps,
      }),
      [
        resolved.variant,
        resolved.disabled,
        resolved.loading,
        tooltipClassName,
        tooltipProps,
      ],
    );

    // Loader props.
    const loaderPropsMerged = useMemo(
      () => ({
        size: resolved.size,
        variant: 'shimmer',
        disabled: resolved.disabled,
        ...loaderProps,
      }),
      [resolved.size, resolved.disabled, loaderProps],
    );

    // Show loader.
    const showLoader = resolved.loading;

    // Render chart content.
    const renderChart = () => {
      if (showLoader) {
        return <ChartLoader {...loaderPropsMerged} />;
      }

      const chartProps = {
        data,
        labels,
        series,
        colors: resolved.colors,
        animation: resolved.animation,
        stacked,
        xAxisLabel,
        yAxisLabel,
        disabled: resolved.disabled,
        loading: resolved.loading,
      };

      switch (type) {
        case 'bar':
          return <BarChart {...chartProps} />;
        case 'pie':
          return <PieChart {...chartProps} />;
        case 'area':
          return <AreaChart {...chartProps} />;
        case 'line':
        default:
          return <LineChart {...chartProps} />;
      }
    };

    return (
      <ChartContainer ref={ref} {...containerPropsMerged} {...rest}>
        {/* Title */}
        {title && (
          <div className="mb-2">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {title}
            </h3>
            {description && (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {description}
              </p>
            )}
          </div>
        )}

        {/* Chart */}
        <div className="relative w-full">
          {renderChart()}

          {/* Tooltip */}
          {showTooltip && !showLoader && (
            <ChartTooltip {...tooltipPropsMerged} />
          )}
        </div>

        {/* Legend */}
        {showLegend && !showLoader && (
          <ChartLegend {...legendPropsMerged} />
        )}

        {children}
      </ChartContainer>
    );
  }),
);

Chart.displayName = 'Chart';

Chart.propTypes = {
  /** Chart children (custom). */
  children: PropTypes.node,
  /** Chart type. */
  type: PropTypes.oneOf(['line', 'bar', 'pie', 'area']),
  /** Chart data. */
  data: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      value: PropTypes.number,
      values: PropTypes.arrayOf(PropTypes.number),
    }),
  ),
  /** Chart labels. */
  labels: PropTypes.arrayOf(PropTypes.string),
  /** Chart series. */
  series: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      data: PropTypes.arrayOf(PropTypes.number),
    }),
  ),
  /** Chart title. */
  title: PropTypes.string,
  /** Chart description. */
  description: PropTypes.string,
  /** Visual variant. */
  variant: PropTypes.oneOf(['default', 'dark', 'glass', 'minimal']),
  /** Size preset. */
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
  /** Color palette. */
  colors: PropTypes.oneOf(['default', 'pastel', 'vibrant', 'dark', 'gradient']),
  /** Animation type. */
  animation: PropTypes.oneOf(['grow', 'fade', 'slide', 'scale', 'none']),
  /** Responsive chart. */
  responsive: PropTypes.bool,
  /** Whether to show legend. */
  showLegend: PropTypes.bool,
  /** Whether to show tooltip. */
  showTooltip: PropTypes.bool,
  /** Legend position. */
  legendPosition: PropTypes.oneOf(['top', 'bottom', 'left', 'right']),
  /** X-axis label. */
  xAxisLabel: PropTypes.string,
  /** Y-axis label. */
  yAxisLabel: PropTypes.string,
  /** Stacked chart (for bar/area). */
  stacked: PropTypes.bool,
  /** Disabled state. */
  disabled: PropTypes.bool,
  /** Loading state. */
  loading: PropTypes.bool,
  /** Additional CSS classes for the container. */
  className: PropTypes.string,
  /** Additional CSS classes for the container wrapper. */
  containerClassName: PropTypes.string,
  /** Additional CSS classes for the legend. */
  legendClassName: PropTypes.string,
  /** Additional CSS classes for the tooltip. */
  tooltipClassName: PropTypes.string,
  /** Additional props for ChartContainer. */
  containerProps: PropTypes.object,
  /** Additional props for ChartLegend. */
  legendProps: PropTypes.object,
  /** Additional props for ChartTooltip. */
  tooltipProps: PropTypes.object,
  /** Additional props for ChartLoader. */
  loaderProps: PropTypes.object,
};

export default Chart;