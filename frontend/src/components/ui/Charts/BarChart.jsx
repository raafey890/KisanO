/**
 * KisanO Design System — Chart Package
 * BarChart
 *
 * A bar chart component that renders vertical or horizontal bars
 * with multiple datasets, grid, tooltip, and legend support using Recharts.
 *
 * Single Responsibility: Render a bar chart.
 * Does not manage chart state or business logic.
 *
 * @module components/ui/Chart/BarChart
 */

import { forwardRef, memo, useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

import {
  CHART_DEFAULTS,
  getChartColor,
} from './chartVariants';
import {
  mergeClasses,
  resolveResponsiveClasses,
} from './chartUtils';

/* ---------------------------------- */
/* Component                          */
/* ---------------------------------- */

/**
 * BarChart – a bar chart component.
 *
 * @component
 * @example
 * <BarChart
 *   data={[
 *     { name: 'Jan', value: 100 },
 *     { name: 'Feb', value: 150 },
 *   ]}
 *   dataKey="value"
 * />
 *
 * @example
 * <BarChart
 *   data={data}
 *   series={[
 *     { name: 'Sales', dataKey: 'sales', color: '#3B82F6' },
 *     { name: 'Revenue', dataKey: 'revenue', color: '#22C55E' },
 *   ]}
 *   horizontal
 * />
 */
const BarChart = memo(
  forwardRef(function BarChart(
    {
      data = [],
      series = [],
      dataKey = 'value',
      nameKey = 'name',
      xAxisLabel,
      yAxisLabel,
      colors = CHART_DEFAULTS.colors,
      animation = CHART_DEFAULTS.animation,
      horizontal = false,
      grid = true,
      stacked = false,
      disabled = false,
      loading = false,
      responsive,
      className = '',
      ...rest
    },
    ref,
  ) {
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

    // Format data for Recharts.
    const chartData = useMemo(() => {
      if (data.length === 0) return [];

      // If data is already in Recharts format, use it directly.
      if (data[0] && typeof data[0] === 'object' && data[0].name !== undefined) {
        return data;
      }

      // If data is an array of values, convert to Recharts format.
      if (typeof data[0] === 'number' || typeof data[0] === 'string') {
        return data.map((item, index) => ({
          name: labels?.[index] || `Item ${index + 1}`,
          [dataKey]: item,
        }));
      }

      // If data has labels and values, use them.
      if (data[0] && data[0].label !== undefined) {
        return data.map((item) => ({
          name: item.label,
          [dataKey]: item.value,
        }));
      }

      return data;
    }, [data, dataKey]);

    // If no series provided, create one from dataKey.
    const chartSeries = useMemo(() => {
      if (series.length > 0) return series;

      return [
        {
          name: nameKey || 'Value',
          dataKey: dataKey,
          color: getColor(0),
        },
      ];
    }, [series, dataKey, nameKey, getColor]);

    // If no data, render nothing.
    if (!chartData || chartData.length === 0) {
      return null;
    }

    return (
      <div ref={ref} className={mergeClasses('w-full h-full', className)} {...rest}>
        <ResponsiveContainer width="100%" height="100%">
          <RechartsBarChart
            data={chartData}
            layout={horizontal ? 'vertical' : 'horizontal'}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            barCategoryGap={10}
            barGap={2}
          >
            {/* Grid */}
            {grid && <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />}

            {/* X-Axis */}
            {!horizontal ? (
              <XAxis
                dataKey="name"
                label={xAxisLabel ? { value: xAxisLabel, position: 'insideBottom', offset: -5 } : undefined}
                tick={{ fontSize: 12, fill: '#6b7280' }}
                axisLine={{ stroke: '#d1d5db' }}
                tickLine={{ stroke: '#d1d5db' }}
              />
            ) : (
              <XAxis
                type="number"
                label={xAxisLabel ? { value: xAxisLabel, position: 'insideBottom', offset: -5 } : undefined}
                tick={{ fontSize: 12, fill: '#6b7280' }}
                axisLine={{ stroke: '#d1d5db' }}
                tickLine={{ stroke: '#d1d5db' }}
              />
            )}

            {/* Y-Axis */}
            {!horizontal ? (
              <YAxis
                label={yAxisLabel ? { value: yAxisLabel, angle: -90, position: 'insideLeft' } : undefined}
                tick={{ fontSize: 12, fill: '#6b7280' }}
                axisLine={{ stroke: '#d1d5db' }}
                tickLine={{ stroke: '#d1d5db' }}
              />
            ) : (
              <YAxis
                dataKey="name"
                type="category"
                label={yAxisLabel ? { value: yAxisLabel, angle: -90, position: 'insideLeft' } : undefined}
                tick={{ fontSize: 12, fill: '#6b7280' }}
                axisLine={{ stroke: '#d1d5db' }}
                tickLine={{ stroke: '#d1d5db' }}
                width={60}
              />
            )}

            {/* Tooltip */}
            <Tooltip
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                padding: '8px 12px',
              }}
              labelStyle={{ fontWeight: 600, color: '#1f2937' }}
              itemStyle={{ color: '#374151' }}
            />

            {/* Legend */}
            <Legend
              wrapperStyle={{ paddingTop: '10px' }}
              iconType="square"
            />

            {/* Bars */}
            {chartSeries.map((serie, index) => (
              <Bar
                key={serie.dataKey || index}
                dataKey={serie.dataKey}
                name={serie.name}
                fill={serie.color || getColor(index)}
                stackId={stacked ? 'stack' : undefined}
                stroke={serie.color || getColor(index)}
                strokeWidth={1}
                radius={[2, 2, 0, 0]}
                animationDuration={animation === 'none' ? 0 : 700}
                animationEasing="ease-out"
                isAnimationActive={animation !== 'none'}
                label={false}
              />
            ))}
          </RechartsBarChart>
        </ResponsiveContainer>
      </div>
    );
  }),
);

BarChart.displayName = 'BarChart';

BarChart.propTypes = {
  /** Chart data. */
  data: PropTypes.arrayOf(
    PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.number,
      PropTypes.string,
    ]),
  ),
  /** Series configuration. */
  series: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      dataKey: PropTypes.string,
      color: PropTypes.string,
    }),
  ),
  /** Data key for values. */
  dataKey: PropTypes.string,
  /** Name key for labels. */
  nameKey: PropTypes.string,
  /** X-axis label. */
  xAxisLabel: PropTypes.string,
  /** Y-axis label. */
  yAxisLabel: PropTypes.string,
  /** Color palette. */
  colors: PropTypes.oneOf(['default', 'pastel', 'vibrant', 'dark', 'gradient']),
  /** Animation type. */
  animation: PropTypes.oneOf(['grow', 'fade', 'slide', 'scale', 'none']),
  /** Whether bars are horizontal. */
  horizontal: PropTypes.bool,
  /** Whether to show grid. */
  grid: PropTypes.bool,
  /** Stacked chart. */
  stacked: PropTypes.bool,
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
};

export default BarChart;