/**
 * KisanO Design System — Chart Package
 * PieChart
 *
 * A pie/donut chart component that renders with labels, legends,
 * tooltips, and custom colors using Recharts.
 *
 * Single Responsibility: Render a pie or donut chart.
 * Does not manage chart state or business logic.
 *
 * @module components/ui/Chart/PieChart
 */

import { forwardRef, memo, useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
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
 * PieChart – a pie/donut chart component.
 *
 * @component
 * @example
 * <PieChart
 *   data={[
 *     { name: 'Category A', value: 400 },
 *     { name: 'Category B', value: 300 },
 *   ]}
 * />
 *
 * @example
 * <PieChart
 *   data={data}
 *   donut
 *   innerRadius={60}
 *   colors="pastel"
 *   showLabels
 * />
 */
const PieChart = memo(
  forwardRef(function PieChart(
    {
      data = [],
      dataKey = 'value',
      nameKey = 'name',
      colors = CHART_DEFAULTS.colors,
      animation = CHART_DEFAULTS.animation,
      donut = false,
      innerRadius,
      outerRadius,
      showLabels = false,
      labelPosition = 'outside',
      labelLine = true,
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

    // Get color for a data point.
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
      if (data[0] && typeof data[0] === 'object' && data[0].name !== undefined && data[0].value !== undefined) {
        return data;
      }

      // If data has label and value keys, map them.
      if (data[0] && data[0].label !== undefined && data[0].value !== undefined) {
        return data.map((item) => ({
          name: item.label,
          value: item.value,
          ...item,
        }));
      }

      // If data is an array of values, convert to Recharts format.
      if (typeof data[0] === 'number') {
        return data.map((item, index) => ({
          name: labels?.[index] || `Item ${index + 1}`,
          value: item,
        }));
      }

      return data;
    }, [data]);

    // Calculate inner radius for donut chart.
    const calculatedInnerRadius = useMemo(() => {
      if (donut) {
        return innerRadius || 60;
      }
      return 0;
    }, [donut, innerRadius]);

    // Calculate outer radius.
    const calculatedOuterRadius = useMemo(() => {
      return outerRadius || 80;
    }, [outerRadius]);

    // Label renderer.
    const renderLabel = useCallback(
      (entry) => {
        const { name, percent } = entry;
        const percentage = (percent * 100).toFixed(0);
        return `${name} ${percentage}%`;
      },
      [],
    );

    // Custom label line.
    const labelLineConfig = useMemo(() => {
      if (!labelLine) return false;
      return {
        strokeWidth: 1,
        stroke: '#9ca3af',
      };
    }, [labelLine]);

    // If no data, render nothing.
    if (!chartData || chartData.length === 0) {
      return null;
    }

    return (
      <div ref={ref} className={mergeClasses('w-full h-full', className)} {...rest}>
        <ResponsiveContainer width="100%" height="100%">
          <RechartsPieChart>
            <Pie
              data={chartData}
              dataKey={dataKey}
              nameKey={nameKey}
              cx="50%"
              cy="50%"
              innerRadius={calculatedInnerRadius}
              outerRadius={calculatedOuterRadius}
              label={showLabels ? renderLabel : false}
              labelLine={labelLineConfig}
              paddingAngle={2}
              animationDuration={animation === 'none' ? 0 : 700}
              animationEasing="ease-out"
              isAnimationActive={animation !== 'none'}
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.color || getColor(index)}
                  stroke={entry.color || getColor(index)}
                  strokeWidth={1}
                />
              ))}
            </Pie>

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
              formatter={(value) => [`${value}`, '']}
            />

            {/* Legend */}
            <Legend
              wrapperStyle={{ paddingTop: '10px' }}
              iconType="circle"
              formatter={(value, entry, index) => {
                const item = chartData[index];
                return `${item?.name || value}`;
              }}
            />
          </RechartsPieChart>
        </ResponsiveContainer>
      </div>
    );
  }),
);

PieChart.displayName = 'PieChart';

PieChart.propTypes = {
  /** Chart data. */
  data: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      value: PropTypes.number,
      label: PropTypes.string,
      color: PropTypes.string,
    }),
  ),
  /** Data key for values. */
  dataKey: PropTypes.string,
  /** Name key for labels. */
  nameKey: PropTypes.string,
  /** Color palette. */
  colors: PropTypes.oneOf(['default', 'pastel', 'vibrant', 'dark', 'gradient']),
  /** Animation type. */
  animation: PropTypes.oneOf(['grow', 'fade', 'slide', 'scale', 'none']),
  /** Whether to render as donut chart. */
  donut: PropTypes.bool,
  /** Inner radius for donut chart. */
  innerRadius: PropTypes.number,
  /** Outer radius. */
  outerRadius: PropTypes.number,
  /** Whether to show labels. */
  showLabels: PropTypes.bool,
  /** Label position. */
  labelPosition: PropTypes.oneOf(['outside', 'inside', 'center']),
  /** Whether to show label lines. */
  labelLine: PropTypes.bool,
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

export default PieChart;