/**
 * KisanO Design System — Breadcrumb Package
 * Breadcrumb
 *
 * The main Breadcrumb component that orchestrates all breadcrumb subcomponents.
 * Provides a convenient API for rendering navigation trails with
 * dynamic items, icons, custom separators, and accessibility.
 *
 * Single Responsibility: Orchestrate Breadcrumb subcomponents.
 * Does not contain business logic, helper functions, or duplicate styling.
 *
 * @module components/ui/Breadcrumb/Breadcrumb
 */

import { forwardRef, memo, useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';

import {
  BREADCRUMB_DEFAULTS,
} from './breadcrumbVariants';
import {
  mergeClasses,
  resolveResponsiveClasses,
  resolveDefaultProps,
} from './breadcrumbUtils';

import BreadcrumbContainer from './BreadcrumbContainer';
import BreadcrumbItem from './BreadcrumbItem';
import BreadcrumbSeparator from './BreadcrumbSeparator';
import BreadcrumbLink from './BreadcrumbLink';
import BreadcrumbLoader from './BreadcrumbLoader';

/* ---------------------------------- */
/* Component                          */
/* ---------------------------------- */

/**
 * Breadcrumb – the main breadcrumb navigation component.
 *
 * @component
 * @example
 * <Breadcrumb
 *   items={[
 *     { label: 'Home', href: '/' },
 *     { label: 'Products', href: '/products' },
 *     { label: 'Details', href: '/products/1', active: true },
 *   ]}
 * />
 *
 * @example
 * <Breadcrumb
 *   items={items}
 *   separator="arrow"
 *   variant="primary"
 *   size="sm"
 * />
 */
const Breadcrumb = memo(
  forwardRef(function Breadcrumb(
    {
      children,
      items = [],
      variant = BREADCRUMB_DEFAULTS.variant,
      size = BREADCRUMB_DEFAULTS.size,
      separator = BREADCRUMB_DEFAULTS.separator,
      disabled = false,
      loading = false,
      responsive,
      className = '',
      itemClassName = '',
      linkClassName = '',
      separatorClassName = '',
      renderItem,
      renderSeparator,
      containerProps,
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
          separator,
          disabled,
          loading,
        }),
      [variant, size, separator, disabled, loading],
    );

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

    // Render items from array.
    const renderItems = useCallback(() => {
      if (!items || items.length === 0) return null;

      return items.map((item, index) => {
        const isLast = index === items.length - 1;
        const isActive = item.active ?? isLast;

        // Render custom item if provided.
        if (renderItem) {
          return renderItem({
            item,
            index,
            isLast,
            isActive,
            variant: resolved.variant,
            size: resolved.size,
            className: itemClassName,
          });
        }

        return (
          <BreadcrumbItem
            key={index}
            index={index}
            active={isActive}
            disabled={item.disabled || resolved.disabled}
            loading={resolved.loading}
            variant={resolved.variant}
            size={resolved.size}
            className={itemClassName}
          >
            {/* Separator (except for first item) */}
            {index > 0 && (
              <BreadcrumbSeparator
                separator={resolved.separator}
                size={resolved.size}
                disabled={resolved.disabled}
                className={separatorClassName}
              />
            )}

            {/* Link or Text */}
            {item.href ? (
              <BreadcrumbLink
                href={item.href}
                active={isActive}
                disabled={item.disabled || resolved.disabled}
                loading={resolved.loading}
                variant={resolved.variant}
                size={resolved.size}
                className={linkClassName}
              >
                {item.icon && <span className="mr-1.5">{item.icon}</span>}
                {item.label}
              </BreadcrumbLink>
            ) : (
              <span className="inline-flex items-center gap-1.5">
                {item.icon && <span className="mr-1.5">{item.icon}</span>}
                {item.label}
              </span>
            )}
          </BreadcrumbItem>
        );
      });
    }, [
      items,
      renderItem,
      resolved.variant,
      resolved.size,
      resolved.disabled,
      resolved.loading,
      resolved.separator,
      itemClassName,
      linkClassName,
      separatorClassName,
    ]);

    // Render children with context.
    const renderChildren = useCallback(() => {
      if (items.length > 0) {
        return renderItems();
      }
      return children;
    }, [items, renderItems, children]);

    // Show loader.
    const showLoader = resolved.loading;

    return (
      <BreadcrumbContainer ref={ref} {...containerPropsMerged}>
        {showLoader ? (
          <BreadcrumbLoader {...loaderPropsMerged} />
        ) : (
          renderChildren()
        )}
      </BreadcrumbContainer>
    );
  }),
);

Breadcrumb.displayName = 'Breadcrumb';

Breadcrumb.propTypes = {
  /** Breadcrumb children (custom). */
  children: PropTypes.node,
  /** Breadcrumb items array. */
  items: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.node,
      href: PropTypes.string,
      icon: PropTypes.node,
      active: PropTypes.bool,
      disabled: PropTypes.bool,
    }),
  ),
  /** Visual variant. */
  variant: PropTypes.oneOf(['default', 'primary', 'dark', 'filled', 'minimal']),
  /** Size preset. */
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
  /** Separator type. */
  separator: PropTypes.oneOf(['slash', 'chevron', 'arrow', 'dot', 'hyphen', 'pipe', 'custom']),
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
  /** Additional CSS classes for links. */
  linkClassName: PropTypes.string,
  /** Additional CSS classes for separators. */
  separatorClassName: PropTypes.string,
  /** Custom item renderer. */
  renderItem: PropTypes.func,
  /** Custom separator renderer. */
  renderSeparator: PropTypes.func,
  /** Additional props for BreadcrumbContainer. */
  containerProps: PropTypes.object,
  /** Additional props for BreadcrumbLoader. */
  loaderProps: PropTypes.object,
};

export default Breadcrumb;