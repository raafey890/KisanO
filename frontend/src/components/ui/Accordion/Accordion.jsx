/**
 * KisanO Design System — Accordion Package
 * Accordion
 *
 * The main Accordion component that orchestrates all accordion subcomponents.
 * Provides a convenient API for rendering collapsible sections with
 * single or multiple expansion, animated transitions, and accessibility.
 *
 * Single Responsibility: Orchestrate Accordion subcomponents.
 * Does not contain business logic, helper functions, or duplicate styling.
 *
 * @module components/ui/Accordion/Accordion
 */

import { forwardRef, memo, useMemo, useState, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';

import {
  ACCORDION_DEFAULTS,
} from './accordionVariants';
import {
  mergeClasses,
  resolveResponsiveClasses,
  resolveDefaultProps,
} from './accordionUtils';

import AccordionContainer from './AccordionContainer';
import AccordionItem from './AccordionItem';
import AccordionHeader from './AccordionHeader';
import AccordionContent from './AccordionContent';
import AccordionIcon from './AccordionIcon';
import AccordionLoader from './AccordionLoader';

/* ---------------------------------- */
/* Component                          */
/* ---------------------------------- */

/**
 * Accordion – the main accordion component with collapsible sections.
 *
 * @component
 * @example
 * <Accordion
 *   items={[
 *     { title: 'Section 1', content: 'Content 1' },
 *     { title: 'Section 2', content: 'Content 2' },
 *   ]}
 * />
 *
 * @example
 * <Accordion
 *   items={items}
 *   multiple
 *   defaultValue={[0]}
 *   variant="filled"
 *   size="sm"
 * />
 */
const Accordion = memo(
  forwardRef(function Accordion(
    {
      children,
      items = [],
      value: controlledValue,
      defaultValue,
      onChange,
      multiple = ACCORDION_DEFAULTS.multiple,
      variant = ACCORDION_DEFAULTS.variant,
      size = ACCORDION_DEFAULTS.size,
      radius = ACCORDION_DEFAULTS.radius,
      shadow = ACCORDION_DEFAULTS.shadow,
      animation = ACCORDION_DEFAULTS.animation,
      disabled = false,
      loading = false,
      responsive,
      className = '',
      itemClassName = '',
      headerClassName = '',
      contentClassName = '',
      iconClassName = '',
      headerProps,
      contentProps,
      iconProps,
      loaderProps,
      containerProps,
      ...rest
    },
    ref,
  ) {
    // Internal state for uncontrolled mode.
    const [internalValue, setInternalValue] = useState(defaultValue || []);

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
          shadow,
          animation,
          multiple,
          disabled,
          loading,
        }),
      [variant, size, radius, shadow, animation, multiple, disabled, loading],
    );

    // Determine if interactive.
    const isInteractive = !resolved.disabled && !resolved.loading;

    // Toggle an item.
    const toggleItem = useCallback(
      (index) => {
        if (!isInteractive) return;

        let newValue;
        if (resolved.multiple) {
          const currentValue = Array.isArray(value) ? value : [];
          if (currentValue.includes(index)) {
            newValue = currentValue.filter((i) => i !== index);
          } else {
            newValue = [...currentValue, index];
          }
        } else {
          newValue = value === index ? [] : [index];
        }

        handleValueChange(newValue);
      },
      [isInteractive, resolved.multiple, value, handleValueChange],
    );

    // Check if an item is open.
    const isItemOpen = useCallback(
      (index) => {
        if (Array.isArray(value)) {
          return value.includes(index);
        }
        return false;
      },
      [value],
    );

    // Container props.
    const containerPropsMerged = useMemo(
      () => ({
        variant: resolved.variant,
        size: resolved.size,
        radius: resolved.radius,
        shadow: resolved.shadow,
        disabled: resolved.disabled,
        loading: resolved.loading,
        className,
        ...containerProps,
        ...rest,
      }),
      [
        resolved.variant,
        resolved.size,
        resolved.radius,
        resolved.shadow,
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
        const open = isItemOpen(index);

        return (
          <AccordionItem
            key={index}
            index={index}
            open={open}
            disabled={item.disabled || resolved.disabled}
            loading={resolved.loading}
            variant={resolved.variant}
            className={itemClassName}
          >
            <AccordionHeader
              index={index}
              open={open}
              disabled={item.disabled || resolved.disabled}
              loading={resolved.loading}
              onClick={() => toggleItem(index)}
              variant={resolved.variant}
              size={resolved.size}
              className={headerClassName}
              {...headerProps}
            >
              {item.icon && (
                <AccordionIcon
                  open={open}
                  disabled={item.disabled || resolved.disabled}
                  size={resolved.size}
                  className={iconClassName}
                  {...iconProps}
                />
              )}
              {item.title}
            </AccordionHeader>
            <AccordionContent
              open={open}
              disabled={item.disabled || resolved.disabled}
              loading={resolved.loading}
              animation={resolved.animation}
              size={resolved.size}
              className={contentClassName}
              {...contentProps}
            >
              {item.content}
            </AccordionContent>
          </AccordionItem>
        );
      });
    }, [
      items,
      isItemOpen,
      resolved.disabled,
      resolved.loading,
      resolved.variant,
      resolved.size,
      resolved.animation,
      itemClassName,
      headerClassName,
      contentClassName,
      iconClassName,
      headerProps,
      contentProps,
      iconProps,
      toggleItem,
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
      <AccordionContainer ref={ref} {...containerPropsMerged}>
        {showLoader ? (
          <AccordionLoader {...loaderPropsMerged} />
        ) : (
          renderChildren()
        )}
      </AccordionContainer>
    );
  }),
);

Accordion.displayName = 'Accordion';

Accordion.propTypes = {
  /** Accordion children (custom). */
  children: PropTypes.node,
  /** Accordion items array. */
  items: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.node,
      content: PropTypes.node,
      icon: PropTypes.node,
      disabled: PropTypes.bool,
    }),
  ),
  /** Controlled open values (array of indices). */
  value: PropTypes.arrayOf(PropTypes.number),
  /** Default open values for uncontrolled mode. */
  defaultValue: PropTypes.arrayOf(PropTypes.number),
  /** Callback when open values change. */
  onChange: PropTypes.func,
  /** Whether multiple items can be open. */
  multiple: PropTypes.bool,
  /** Visual variant. */
  variant: PropTypes.oneOf(['default', 'outlined', 'filled', 'ghost', 'minimal']),
  /** Size preset. */
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
  /** Border radius override. */
  radius: PropTypes.oneOf(['none', 'sm', 'md', 'lg', 'xl', '2xl', 'full']),
  /** Shadow level. */
  shadow: PropTypes.oneOf(['none', 'sm', 'md', 'lg', 'xl', '2xl']),
  /** Animation type. */
  animation: PropTypes.oneOf(['slide', 'fade', 'scale', 'none']),
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
  /** Additional CSS classes for headers. */
  headerClassName: PropTypes.string,
  /** Additional CSS classes for content. */
  contentClassName: PropTypes.string,
  /** Additional CSS classes for icons. */
  iconClassName: PropTypes.string,
  /** Additional props for AccordionHeader. */
  headerProps: PropTypes.object,
  /** Additional props for AccordionContent. */
  contentProps: PropTypes.object,
  /** Additional props for AccordionIcon. */
  iconProps: PropTypes.object,
  /** Additional props for AccordionLoader. */
  loaderProps: PropTypes.object,
  /** Additional props for AccordionContainer. */
  containerProps: PropTypes.object,
};

export default Accordion;