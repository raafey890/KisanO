/**
 * KisanO Design System — Table Package
 * Table
 *
 * The main Table component that orchestrates all table subcomponents.
 * Provides a convenient API for rendering data tables with sorting,
 * selection, striping, and loading states.
 *
 * Single Responsibility: Orchestrate Table subcomponents.
 * Does not contain business logic, helper functions, or duplicate styling.
 *
 * @module components/ui/Table/Table
 */

import { forwardRef, memo, useMemo, useState, useCallback } from 'react';
import PropTypes from 'prop-types';

import {
  TABLE_DEFAULTS,
} from './tableVariants';
import {
  mergeClasses,
  resolveResponsiveClasses,
  resolveDefaultProps,
} from './tableUtils';

import TableContainer from './TableContainer';
import TableHeader from './TableHeader';
import TableBody from './TableBody';
import TableRow from './TableRow';
import TableCell from './TableCell';
import TableLoader from './TableLoader';

/* ---------------------------------- */
/* Component                          */
/* ---------------------------------- */

/**
 * Table – the main table component.
 *
 * @component
 * @example
 * <Table
 *   columns={[
 *     { key: 'name', label: 'Name', sortable: true },
 *     { key: 'age', label: 'Age', sortable: true },
 *   ]}
 *   data={[
 *     { id: 1, name: 'John', age: 30 },
 *     { id: 2, name: 'Jane', age: 25 },
 *   ]}
 * />
 *
 * @example
 * <Table
 *   columns={columns}
 *   data={data}
 *   selectable
 *   striped
 *   hoverable
 *   variant="primary"
 * />
 */
const Table = memo(
  forwardRef(function Table(
    {
      children,
      columns = [],
      data = [],
      caption,
      summary,
      variant = TABLE_DEFAULTS.variant,
      size = TABLE_DEFAULTS.size,
      radius = TABLE_DEFAULTS.radius,
      shadow = TABLE_DEFAULTS.shadow,
      stripes = TABLE_DEFAULTS.stripes,
      bordered = TABLE_DEFAULTS.bordered,
      hoverable = TABLE_DEFAULTS.hoverable,
      selectable = TABLE_DEFAULTS.selectable,
      stickyHeader = false,
      responsive = true,
      emptyText = 'No data available',
      disabled = false,
      loading = false,
      sortable = false,
      onSort,
      onRowClick,
      onRowSelect,
      selectedRows = [],
      responsiveClasses,
      className = '',
      containerClassName = '',
      headerClassName = '',
      bodyClassName = '',
      rowClassName = '',
      cellClassName = '',
      headerProps,
      bodyProps,
      rowProps,
      cellProps,
      loaderProps,
      containerProps,
      ...rest
    },
    ref,
  ) {
    // Internal state for sorting.
    const [sortField, setSortField] = useState(null);
    const [sortDirection, setSortDirection] = useState('asc');

    // Resolve defaults.
    const resolved = useMemo(
      () =>
        resolveDefaultProps({
          variant,
          size,
          radius,
          shadow,
          stripes,
          bordered,
          hoverable,
          selectable,
          disabled,
          loading,
        }),
      [variant, size, radius, shadow, stripes, bordered, hoverable, selectable, disabled, loading],
    );

    // Handle sort.
    const handleSort = useCallback(
      (key) => {
        if (!sortable) return;

        let direction = 'asc';
        if (sortField === key) {
          direction = sortDirection === 'asc' ? 'desc' : 'asc';
        }
        setSortField(key);
        setSortDirection(direction);
        onSort?.(key, direction);
      },
      [sortable, sortField, sortDirection, onSort],
    );

    // Handle row select.
    const handleRowSelect = useCallback(
      (row, index) => {
        if (!selectable) return;
        onRowSelect?.(row, index);
      },
      [selectable, onRowSelect],
    );

    // Sort data.
    const sortedData = useMemo(() => {
      if (!sortField || !sortable) return data;

      return [...data].sort((a, b) => {
        const aVal = a[sortField];
        const bVal = b[sortField];

        if (aVal === bVal) return 0;
        if (aVal === undefined || aVal === null) return 1;
        if (bVal === undefined || bVal === null) return -1;

        const comparison = aVal < bVal ? -1 : 1;
        return sortDirection === 'asc' ? comparison : -comparison;
      });
    }, [data, sortField, sortDirection, sortable]);

    // Determine if row is selected.
    const isRowSelected = useCallback(
      (row, index) => {
        if (!selectable) return false;
        return selectedRows.includes(row.id ?? index);
      },
      [selectable, selectedRows],
    );

    // Container props.
    const containerPropsMerged = useMemo(
      () => ({
        variant: resolved.variant,
        size: resolved.size,
        disabled: resolved.disabled,
        loading: resolved.loading,
        responsive,
        className: containerClassName,
        ...containerProps,
      }),
      [
        resolved.variant,
        resolved.size,
        resolved.disabled,
        resolved.loading,
        responsive,
        containerClassName,
        containerProps,
      ],
    );

    // Header props.
    const headerPropsMerged = useMemo(
      () => ({
        variant: resolved.variant,
        disabled: resolved.disabled,
        loading: resolved.loading,
        className: headerClassName,
        ...headerProps,
      }),
      [resolved.variant, resolved.disabled, resolved.loading, headerClassName, headerProps],
    );

    // Body props.
    const bodyPropsMerged = useMemo(
      () => ({
        disabled: resolved.disabled,
        loading: resolved.loading,
        className: bodyClassName,
        ...bodyProps,
      }),
      [resolved.disabled, resolved.loading, bodyClassName, bodyProps],
    );

    // Row props.
    const rowPropsMerged = useMemo(
      () => ({
        variant: resolved.variant,
        stripes: resolved.stripes,
        hoverable: resolved.hoverable,
        selectable: resolved.selectable,
        disabled: resolved.disabled,
        loading: resolved.loading,
        className: rowClassName,
        ...rowProps,
      }),
      [
        resolved.variant,
        resolved.stripes,
        resolved.hoverable,
        resolved.selectable,
        resolved.disabled,
        resolved.loading,
        rowClassName,
        rowProps,
      ],
    );

    // Cell props.
    const cellPropsMerged = useMemo(
      () => ({
        size: resolved.size,
        disabled: resolved.disabled,
        loading: resolved.loading,
        className: cellClassName,
        ...cellProps,
      }),
      [resolved.size, resolved.disabled, resolved.loading, cellClassName, cellProps],
    );

    // Loader props.
    const loaderPropsMerged = useMemo(
      () => ({
        size: resolved.size,
        variant: 'shimmer',
        columns: columns.length || 3,
        rows: 5,
        disabled: resolved.disabled,
        ...loaderProps,
      }),
      [resolved.size, columns.length, resolved.disabled, loaderProps],
    );

    // Show loader.
    const showLoader = resolved.loading;

    // Render table content.
    const renderContent = () => {
      if (showLoader) {
        return <TableLoader {...loaderPropsMerged} />;
      }

      if (!data || data.length === 0) {
        return (
          <div className="flex items-center justify-center py-8 text-gray-500">
            {emptyText}
          </div>
        );
      }

      return (
        <>
          <TableHeader {...headerPropsMerged}>
            <TableRow isHeader {...rowPropsMerged}>
              {columns.map((column, index) => (
                <TableCell
                  key={column.key || index}
                  isHeader
                  align={column.align || 'left'}
                  width={column.width}
                  sortable={column.sortable && sortable}
                  sorted={sortField === column.key}
                  sortDirection={sortDirection}
                  onSort={() => handleSort(column.key)}
                  {...cellPropsMerged}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody {...bodyPropsMerged}>
            {sortedData.map((row, index) => {
              const selected = isRowSelected(row, index);
              return (
                <TableRow
                  key={row.id || index}
                  index={index}
                  selected={selected}
                  onClick={() => {
                    onRowClick?.(row, index);
                    handleRowSelect(row, index);
                  }}
                  {...rowPropsMerged}
                >
                  {columns.map((column, colIndex) => (
                    <TableCell
                      key={column.key || colIndex}
                      align={column.align || 'left'}
                      width={column.width}
                      render={column.render}
                      {...cellPropsMerged}
                    >
                      {row[column.key]}
                    </TableCell>
                  ))}
                </TableRow>
              );
            })}
          </TableBody>
        </>
      );
    };

    return (
      <TableContainer ref={ref} {...containerPropsMerged} {...rest}>
        {caption && <caption className="sr-only">{caption}</caption>}
        {summary && <div className="sr-only">{summary}</div>}
        <table className="w-full border-collapse">{renderContent()}</table>
        {children}
      </TableContainer>
    );
  }),
);

Table.displayName = 'Table';

Table.propTypes = {
  /** Table children (custom). */
  children: PropTypes.node,
  /** Table caption (accessible). */
  caption: PropTypes.string,
  /** Table summary (accessible). */
  summary: PropTypes.string,
  /** Column definitions. */
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      label: PropTypes.node,
      align: PropTypes.oneOf(['left', 'center', 'right']),
      width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      sortable: PropTypes.bool,
      render: PropTypes.func,
    }),
  ),
  /** Table data rows. */
  data: PropTypes.arrayOf(PropTypes.object),
  /** Visual variant. */
  variant: PropTypes.oneOf(['default', 'primary', 'dark', 'glass', 'minimal']),
  /** Size preset. */
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
  /** Border radius override. */
  radius: PropTypes.oneOf(['none', 'sm', 'md', 'lg', 'xl', '2xl', 'full']),
  /** Shadow level. */
  shadow: PropTypes.oneOf(['none', 'sm', 'md', 'lg', 'xl', '2xl']),
  /** Stripe style. */
  stripes: PropTypes.oneOf(['none', 'default', 'primary', 'dark']),
  /** Bordered table. */
  bordered: PropTypes.bool,
  /** Hoverable rows. */
  hoverable: PropTypes.bool,
  /** Selectable rows. */
  selectable: PropTypes.bool,
  /** Sticky header. */
  stickyHeader: PropTypes.bool,
  /** Responsive table. */
  responsive: PropTypes.bool,
  /** Empty state text. */
  emptyText: PropTypes.string,
  /** Disabled state. */
  disabled: PropTypes.bool,
  /** Loading state. */
  loading: PropTypes.bool,
  /** Sortable table. */
  sortable: PropTypes.bool,
  /** Callback when sorting changes. */
  onSort: PropTypes.func,
  /** Callback when row is clicked. */
  onRowClick: PropTypes.func,
  /** Callback when row is selected. */
  onRowSelect: PropTypes.func,
  /** Selected row IDs. */
  selectedRows: PropTypes.array,
  /** Responsive overrides. */
  responsiveClasses: PropTypes.shape({
    xs: PropTypes.string,
    sm: PropTypes.string,
    md: PropTypes.string,
    lg: PropTypes.string,
    xl: PropTypes.string,
  }),
  /** Additional CSS classes for the container. */
  className: PropTypes.string,
  /** Additional CSS classes for the container wrapper. */
  containerClassName: PropTypes.string,
  /** Additional CSS classes for the header. */
  headerClassName: PropTypes.string,
  /** Additional CSS classes for the body. */
  bodyClassName: PropTypes.string,
  /** Additional CSS classes for rows. */
  rowClassName: PropTypes.string,
  /** Additional CSS classes for cells. */
  cellClassName: PropTypes.string,
  /** Additional props for TableContainer. */
  containerProps: PropTypes.object,
  /** Additional props for TableHeader. */
  headerProps: PropTypes.object,
  /** Additional props for TableBody. */
  bodyProps: PropTypes.object,
  /** Additional props for TableRow. */
  rowProps: PropTypes.object,
  /** Additional props for TableCell. */
  cellProps: PropTypes.object,
  /** Additional props for TableLoader. */
  loaderProps: PropTypes.object,
};

export default Table;