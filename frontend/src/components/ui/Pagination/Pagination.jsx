/**
 * KisanO Design System — Pagination Package
 * Pagination
 *
 * The main Pagination component that orchestrates all pagination subcomponents.
 * Provides a convenient API for rendering page navigation with
 * previous/next buttons, page numbers, ellipsis, and accessibility.
 *
 * Single Responsibility: Orchestrate Pagination subcomponents.
 * Does not contain business logic, helper functions, or duplicate styling.
 *
 * @module components/ui/Pagination/Pagination
 */

import { forwardRef, memo, useMemo, useState, useCallback } from 'react';
import PropTypes from 'prop-types';

import {
  PAGINATION_DEFAULTS,
} from './paginationVariants';
import {
  mergeClasses,
  resolveResponsiveClasses,
  resolveDefaultProps,
} from './paginationUtils';

import PaginationContainer from './PaginationContainer';
import PaginationItem from './PaginationItem';
import PaginationButton from './PaginationButton';
import PaginationEllipsis from './PaginationEllipsis';
import PaginationLoader from './PaginationLoader';

/* ---------------------------------- */
/* Helper Functions                   */
/* ---------------------------------- */

/**
 * Generates an array of page numbers to display with ellipsis.
 * @param {number} current - Current page.
 * @param {number} total - Total pages.
 * @param {number} siblings - Number of sibling pages to show.
 * @param {number} boundaries - Number of boundary pages to show.
 * @returns {Array} Array of page numbers and ellipsis markers.
 */
function generatePaginationPages(current, total, siblings = 1, boundaries = 1) {
  const pages = [];

  if (total <= 1) return pages;

  // Always show first page.
  pages.push(1);

  // Calculate range around current page.
  const leftSibling = Math.max(2, current - siblings);
  const rightSibling = Math.min(total - 1, current + siblings);

  // Show boundaries.
  const showLeftEllipsis = leftSibling > 2;
  const showRightEllipsis = rightSibling < total - 1;

  // Left boundary.
  if (boundaries > 1) {
    for (let i = 2; i < Math.min(leftSibling, boundaries + 1); i++) {
      pages.push(i);
    }
  }

  // Left ellipsis.
  if (showLeftEllipsis) {
    pages.push('ellipsis');
  }

  // Middle pages.
  for (let i = leftSibling; i <= rightSibling; i++) {
    if (i > 1 && i < total) {
      pages.push(i);
    }
  }

  // Right ellipsis.
  if (showRightEllipsis) {
    pages.push('ellipsis');
  }

  // Right boundary.
  if (boundaries > 1) {
    for (let i = Math.max(rightSibling + 1, total - boundaries + 1); i < total; i++) {
      pages.push(i);
    }
  }

  // Always show last page.
  if (total > 1) {
    pages.push(total);
  }

  // Remove duplicates.
  return [...new Set(pages)];
}

/* ---------------------------------- */
/* Component                          */
/* ---------------------------------- */

/**
 * Pagination – the main pagination component.
 *
 * @component
 * @example
 * <Pagination
 *   total={10}
 *   currentPage={1}
 *   onPageChange={handlePageChange}
 * />
 *
 * @example
 * <Pagination
 *   total={50}
 *   siblings={2}
 *   boundaries={2}
 *   variant="primary"
 *   size="sm"
 * />
 */
const Pagination = memo(
  forwardRef(function Pagination(
    {
      children,
      total = 1,
      currentPage: controlledPage,
      defaultPage = 1,
      onPageChange,
      siblings = 1,
      boundaries = 1,
      showFirstLast = true,
      showPrevNext = true,
      previousLabel = 'Previous',
      nextLabel = 'Next',
      firstLabel = 'First',
      lastLabel = 'Last',
      variant = PAGINATION_DEFAULTS.variant,
      size = PAGINATION_DEFAULTS.size,
      radius = PAGINATION_DEFAULTS.radius,
      disabled = false,
      loading = false,
      responsive,
      className = '',
      itemClassName = '',
      buttonClassName = '',
      ellipsisClassName = '',
      containerProps,
      loaderProps,
      ...rest
    },
    ref,
  ) {
    // Internal state for uncontrolled mode.
    const [internalPage, setInternalPage] = useState(defaultPage);

    // Determine if controlled or uncontrolled.
    const isControlled = controlledPage !== undefined;
    const currentPage = isControlled ? controlledPage : internalPage;

    // Clamp current page.
    const clampedPage = useMemo(
      () => Math.max(1, Math.min(total, currentPage)),
      [currentPage, total],
    );

    // Handle page change.
    const handlePageChange = useCallback(
      (page) => {
        if (page === clampedPage || disabled || loading) return;
        const newPage = Math.max(1, Math.min(total, page));
        if (!isControlled) {
          setInternalPage(newPage);
        }
        onPageChange?.(newPage);
      },
      [clampedPage, disabled, loading, total, isControlled, onPageChange],
    );

    // Resolve defaults.
    const resolved = useMemo(
      () =>
        resolveDefaultProps({
          variant,
          size,
          radius,
          disabled,
          loading,
        }),
      [variant, size, radius, disabled, loading],
    );

    // Generate page numbers.
    const pages = useMemo(
      () => generatePaginationPages(clampedPage, total, siblings, boundaries),
      [clampedPage, total, siblings, boundaries],
    );

    // Check if previous/next buttons should be disabled.
    const isPrevDisabled = clampedPage <= 1 || disabled || loading;
    const isNextDisabled = clampedPage >= total || disabled || loading;

    // Container props.
    const containerPropsMerged = useMemo(
      () => ({
        variant: resolved.variant,
        size: resolved.size,
        disabled: resolved.disabled,
        loading: resolved.loading,
        className,
        ...containerProps,
        ...rest,
      }),
      [
        resolved.variant,
        resolved.size,
        resolved.disabled,
        resolved.loading,
        className,
        containerProps,
        rest,
      ],
    );

    // Render pagination items.
    const renderItems = useCallback(() => {
      const items = [];

      // First page button.
      if (showFirstLast && total > 1) {
        items.push(
          <PaginationButton
            key="first"
            label={firstLabel}
            ariaLabel="First page"
            active={clampedPage === 1}
            disabled={isPrevDisabled}
            loading={resolved.loading}
            onClick={() => handlePageChange(1)}
            variant={resolved.variant}
            size={resolved.size}
            radius={resolved.radius}
            className={buttonClassName}
          />,
        );
      }

      // Previous button.
      if (showPrevNext) {
        items.push(
          <PaginationButton
            key="prev"
            label={previousLabel}
            ariaLabel="Previous page"
            active={false}
            disabled={isPrevDisabled}
            loading={resolved.loading}
            onClick={() => handlePageChange(clampedPage - 1)}
            variant={resolved.variant}
            size={resolved.size}
            radius={resolved.radius}
            className={buttonClassName}
          />,
        );
      }

      // Page numbers.
      pages.forEach((page, index) => {
        if (page === 'ellipsis') {
          items.push(
            <PaginationEllipsis
              key={`ellipsis-${index}`}
              size={resolved.size}
              disabled={resolved.disabled}
              className={ellipsisClassName}
            />,
          );
        } else {
          const isActive = page === clampedPage;
          const isDisabled = page < 1 || page > total || resolved.disabled || resolved.loading;
          const ariaLabel = `Page ${page}`;

          items.push(
            <PaginationButton
              key={page}
              label={page}
              ariaLabel={ariaLabel}
              active={isActive}
              disabled={isDisabled}
              loading={resolved.loading}
              onClick={() => handlePageChange(page)}
              variant={resolved.variant}
              size={resolved.size}
              radius={resolved.radius}
              className={buttonClassName}
            />,
          );
        }
      });

      // Next button.
      if (showPrevNext) {
        items.push(
          <PaginationButton
            key="next"
            label={nextLabel}
            ariaLabel="Next page"
            active={false}
            disabled={isNextDisabled}
            loading={resolved.loading}
            onClick={() => handlePageChange(clampedPage + 1)}
            variant={resolved.variant}
            size={resolved.size}
            radius={resolved.radius}
            className={buttonClassName}
          />,
        );
      }

      // Last page button.
      if (showFirstLast && total > 1) {
        items.push(
          <PaginationButton
            key="last"
            label={lastLabel}
            ariaLabel="Last page"
            active={clampedPage === total}
            disabled={isNextDisabled}
            loading={resolved.loading}
            onClick={() => handlePageChange(total)}
            variant={resolved.variant}
            size={resolved.size}
            radius={resolved.radius}
            className={buttonClassName}
          />,
        );
      }

      return items;
    }, [
      showFirstLast,
      total,
      showPrevNext,
      pages,
      clampedPage,
      isPrevDisabled,
      isNextDisabled,
      resolved,
      buttonClassName,
      ellipsisClassName,
      handlePageChange,
      previousLabel,
      nextLabel,
      firstLabel,
      lastLabel,
    ]);

    // Render children.
    const renderChildren = useCallback(() => {
      if (children) return children;
      return renderItems();
    }, [children, renderItems]);

    // Show loader.
    const showLoader = resolved.loading;

    return (
      <PaginationContainer ref={ref} {...containerPropsMerged}>
        {showLoader ? (
          <PaginationLoader {...loaderPropsMerged} />
        ) : (
          renderChildren()
        )}
      </PaginationContainer>
    );
  }),
);

Pagination.displayName = 'Pagination';

Pagination.propTypes = {
  /** Pagination children (custom). */
  children: PropTypes.node,
  /** Total number of pages. */
  total: PropTypes.number,
  /** Controlled current page. */
  currentPage: PropTypes.number,
  /** Default page for uncontrolled mode. */
  defaultPage: PropTypes.number,
  /** Callback when page changes. */
  onPageChange: PropTypes.func,
  /** Number of sibling pages to show. */
  siblings: PropTypes.number,
  /** Number of boundary pages to show. */
  boundaries: PropTypes.number,
  /** Whether to show first/last buttons. */
  showFirstLast: PropTypes.bool,
  /** Whether to show previous/next buttons. */
  showPrevNext: PropTypes.bool,
  /** Label for previous button. */
  previousLabel: PropTypes.string,
  /** Label for next button. */
  nextLabel: PropTypes.string,
  /** Label for first button. */
  firstLabel: PropTypes.string,
  /** Label for last button. */
  lastLabel: PropTypes.string,
  /** Visual variant. */
  variant: PropTypes.oneOf(['default', 'primary', 'dark', 'outline', 'ghost']),
  /** Size preset. */
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
  /** Border radius override. */
  radius: PropTypes.oneOf(['none', 'sm', 'md', 'lg', 'xl', '2xl', 'full']),
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
  /** Additional CSS classes for the container. */
  className: PropTypes.string,
  /** Additional CSS classes for items. */
  itemClassName: PropTypes.string,
  /** Additional CSS classes for buttons. */
  buttonClassName: PropTypes.string,
  /** Additional CSS classes for ellipsis. */
  ellipsisClassName: PropTypes.string,
  /** Additional props for PaginationContainer. */
  containerProps: PropTypes.object,
  /** Additional props for PaginationLoader. */
  loaderProps: PropTypes.object,
};

export default Pagination;