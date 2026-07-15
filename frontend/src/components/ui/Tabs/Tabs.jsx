/**
 * KisanO Design System — Tabs Package
 * Tabs
 *
 * The main Tabs component that orchestrates all tabs subcomponents.
 * Provides a convenient API for rendering tab navigation with
 * content panels, icons, badges, and animated indicators.
 *
 * Single Responsibility: Orchestrate Tabs subcomponents.
 * Does not contain business logic, helper functions, or duplicate styling.
 *
 * @module components/ui/Tabs/Tabs
 */

import { forwardRef, memo, useMemo, useState, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';

import {
  TABS_DEFAULTS,
} from './tabsVariants';
import {
  mergeClasses,
  resolveResponsiveClasses,
  resolveDefaultProps,
} from './tabsUtils';

import TabsContainer from './TabsContainer';
import TabsList from './TabsList';
import TabsTrigger from './TabsTrigger';
import TabsContent from './TabsContent';
import TabsIndicator from './TabsIndicator';
import TabsLoader from './TabsLoader';

/* ---------------------------------- */
/* Component                          */
/* ---------------------------------- */

/**
 * Tabs – the main tabs component with navigation and content panels.
 *
 * @component
 * @example
 * <Tabs
 *   defaultValue="tab1"
 *   items={[
 *     { label: 'Tab 1', value: 'tab1', content: 'Content 1' },
 *     { label: 'Tab 2', value: 'tab2', content: 'Content 2' },
 *   ]}
 * />
 *
 * @example
 * <Tabs
 *   value={activeTab}
 *   onChange={setActiveTab}
 *   variant="pill"
 *   size="sm"
 * >
 *   <TabsTrigger value="tab1">Tab 1</TabsTrigger>
 *   <TabsTrigger value="tab2">Tab 2</TabsTrigger>
 *   <TabsContent value="tab1">Content 1</TabsContent>
 *   <TabsContent value="tab2">Content 2</TabsContent>
 * </Tabs>
 */
const Tabs = memo(
  forwardRef(function Tabs(
    {
      children,
      items = [],
      value: controlledValue,
      defaultValue,
      onChange,
      variant = TABS_DEFAULTS.variant,
      size = TABS_DEFAULTS.size,
      radius = TABS_DEFAULTS.radius,
      indicator = TABS_DEFAULTS.indicator,
      orientation = TABS_DEFAULTS.orientation,
      disabled = false,
      loading = false,
      responsive,
      className = '',
      listClassName = '',
      triggerClassName = '',
      contentClassName = '',
      triggerProps,
      contentProps,
      indicatorProps,
      loaderProps,
      containerProps,
      listProps,
      ...rest
    },
    ref,
  ) {
    // Internal state for uncontrolled mode.
    const [internalValue, setInternalValue] = useState(defaultValue || (items[0]?.value));

    // Determine if controlled or uncontrolled.
    const isControlled = controlledValue !== undefined;
    const value = isControlled ? controlledValue : internalValue;

    // Handle value change.
    const handleValueChange = useCallback(
      (newValue) => {
        if (!isControlled) {
          setInternalValue(newValue);
        }
        onChange?.(newValue);
      },
      [isControlled, onChange],
    );

    // Resolve defaults.
    const resolved = useMemo(
      () =>
        resolveDefaultProps({
          variant,
          size,
          radius,
          indicator,
          orientation,
          disabled,
          loading,
        }),
      [variant, size, radius, indicator, orientation, disabled, loading],
    );

    // Determine if interactive.
    const isInteractive = !resolved.disabled && !resolved.loading;

    // Get active index.
    const activeIndex = useMemo(() => {
      const index = items.findIndex((item) => item.value === value);
      return index >= 0 ? index : 0;
    }, [items, value]);

    // Validate active value exists.
    useEffect(() => {
      if (items.length > 0 && !items.some((item) => item.value === value)) {
        handleValueChange(items[0].value);
      }
    }, [items, value, handleValueChange]);

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

    // List props.
    const listPropsMerged = useMemo(
      () => ({
        variant: resolved.variant,
        size: resolved.size,
        radius: resolved.radius,
        orientation: resolved.orientation,
        disabled: resolved.disabled,
        loading: resolved.loading,
        className: listClassName,
        ...listProps,
      }),
      [
        resolved.variant,
        resolved.size,
        resolved.radius,
        resolved.orientation,
        resolved.disabled,
        resolved.loading,
        listClassName,
        listProps,
      ],
    );

    // Trigger props.
    const triggerPropsMerged = useMemo(
      () => ({
        variant: resolved.variant,
        size: resolved.size,
        indicator: resolved.indicator,
        disabled: resolved.disabled,
        loading: resolved.loading,
        className: triggerClassName,
        ...triggerProps,
      }),
      [
        resolved.variant,
        resolved.size,
        resolved.indicator,
        resolved.disabled,
        resolved.loading,
        triggerClassName,
        triggerProps,
      ],
    );

    // Content props.
    const contentPropsMerged = useMemo(
      () => ({
        size: resolved.size,
        disabled: resolved.disabled,
        loading: resolved.loading,
        className: contentClassName,
        ...contentProps,
      }),
      [
        resolved.size,
        resolved.disabled,
        resolved.loading,
        contentClassName,
        contentProps,
      ],
    );

    // Indicator props.
    const indicatorPropsMerged = useMemo(
      () => ({
        indicator: resolved.indicator,
        orientation: resolved.orientation,
        activeIndex,
        itemsCount: items.length,
        ...indicatorProps,
      }),
      [resolved.indicator, resolved.orientation, activeIndex, items.length, indicatorProps],
    );

    // Loader props.
    const loaderPropsMerged = useMemo(
      () => ({
        size: resolved.size,
        variant: 'shimmer',
        rows: 3,
        disabled: resolved.disabled,
        ...loaderProps,
      }),
      [resolved.size, resolved.disabled, loaderProps],
    );

    // Render tabs from items array.
    const renderItems = useCallback(() => {
      if (!items || items.length === 0) return null;

      // Render triggers.
      const triggers = items.map((item, index) => (
        <TabsTrigger
          key={item.value}
          value={item.value}
          label={item.label}
          icon={item.icon}
          badge={item.badge}
          active={value === item.value}
          disabled={item.disabled || resolved.disabled}
          loading={resolved.loading}
          onClick={() => handleValueChange(item.value)}
          index={index}
          {...triggerPropsMerged}
        />
      ));

      // Render content panels.
      const contents = items.map((item) => (
        <TabsContent
          key={item.value}
          value={item.value}
          active={value === item.value}
          {...contentPropsMerged}
        >
          {item.content}
        </TabsContent>
      ));

      return { triggers, contents };
    }, [
      items,
      value,
      resolved.disabled,
      resolved.loading,
      handleValueChange,
      triggerPropsMerged,
      contentPropsMerged,
    ]);

    // Render children with context.
    const renderChildren = useCallback(() => {
      // If items are provided, render them.
      if (items.length > 0) {
        const { triggers, contents } = renderItems();
        return (
          <>
            <TabsList {...listPropsMerged}>
              {triggers}
              <TabsIndicator {...indicatorPropsMerged} />
            </TabsList>
            {contents}
          </>
        );
      }

      // Otherwise, render children directly.
      return children;
    }, [items, renderItems, listPropsMerged, indicatorPropsMerged, children]);

    // Show loader.
    const showLoader = resolved.loading;

    return (
      <TabsContainer ref={ref} {...containerPropsMerged}>
        {showLoader ? (
          <TabsLoader {...loaderPropsMerged} />
        ) : (
          renderChildren()
        )}
      </TabsContainer>
    );
  }),
);

Tabs.displayName = 'Tabs';

Tabs.propTypes = {
  /** Tabs children (custom). */
  children: PropTypes.node,
  /** Tabs items array. */
  items: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.node,
      value: PropTypes.any.isRequired,
      icon: PropTypes.node,
      badge: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.node]),
      disabled: PropTypes.bool,
      content: PropTypes.node,
    }),
  ),
  /** Controlled active value. */
  value: PropTypes.any,
  /** Default value for uncontrolled mode. */
  defaultValue: PropTypes.any,
  /** Callback when active tab changes. */
  onChange: PropTypes.func,
  /** Visual variant. */
  variant: PropTypes.oneOf(['default', 'primary', 'filled', 'pill', 'underline', 'minimal']),
  /** Size preset. */
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
  /** Border radius override. */
  radius: PropTypes.oneOf(['none', 'sm', 'md', 'lg', 'xl', '2xl', 'full']),
  /** Indicator type. */
  indicator: PropTypes.oneOf(['underline', 'background', 'pill', 'dot', 'none']),
  /** Tabs orientation. */
  orientation: PropTypes.oneOf(['horizontal', 'vertical']),
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
  /** Additional CSS classes for the list. */
  listClassName: PropTypes.string,
  /** Additional CSS classes for triggers. */
  triggerClassName: PropTypes.string,
  /** Additional CSS classes for content. */
  contentClassName: PropTypes.string,
  /** Additional props for TabsTrigger. */
  triggerProps: PropTypes.object,
  /** Additional props for TabsContent. */
  contentProps: PropTypes.object,
  /** Additional props for TabsIndicator. */
  indicatorProps: PropTypes.object,
  /** Additional props for TabsLoader. */
  loaderProps: PropTypes.object,
  /** Additional props for TabsContainer. */
  containerProps: PropTypes.object,
  /** Additional props for TabsList. */
  listProps: PropTypes.object,
};

export default Tabs;