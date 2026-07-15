/**
 * KisanO Design System — Select Package
 * Select
 *
 * The main Select component that orchestrates all select subcomponents.
 * Provides a convenient API for rendering selects with search, multi-select,
 * loading states, and custom rendering.
 *
 * Single Responsibility: Orchestrate Select subcomponents.
 * Does not contain business logic, helper functions, or duplicate styling.
 *
 * @module components/ui/Select/Select
 */

import { forwardRef, memo, useMemo, useState, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';

import {
  SELECT_DEFAULTS,
} from './selectVariants';
import {
  resolveDefaultProps,
} from './selectUtils';

import SelectContainer from './SelectContainer';
import SelectTrigger from './SelectTrigger';
import SelectMenu from './SelectMenu';
import SelectOption from './SelectOption';
import SelectSearch from './SelectSearch';
import SelectLoader from './SelectLoader';
import SelectPortal from './SelectPortal';

/* ---------------------------------- */
/* Component                          */
/* ---------------------------------- */

/**
 * Select – the main select component with search and multi-select support.
 *
 * @component
 * @example
 * <Select
 *   options={[
 *     { label: 'Option 1', value: '1' },
 *     { label: 'Option 2', value: '2' },
 *   ]}
 *   placeholder="Select an option"
 *   onValueChange={handleChange}
 * />
 *
 * @example
 * <Select
 *   options={options}
 *   multiple
 *   searchable
 *   loading
 *   value={selectedValues}
 *   onValueChange={setSelectedValues}
 * />
 */
const Select = memo(
  forwardRef(function Select(
    {
      options = [],
      value: controlledValue,
      defaultValue,
      multiple = false,
      searchable = false,
      placeholder = SELECT_DEFAULTS.placeholder,
      searchPlaceholder = 'Search...',
      emptyMessage = 'No options found',
      variant = SELECT_DEFAULTS.variant,
      size = SELECT_DEFAULTS.size,
      radius = SELECT_DEFAULTS.radius,
      shadow = SELECT_DEFAULTS.shadow,
      position = SELECT_DEFAULTS.position,
      animation = SELECT_DEFAULTS.animation,
      closeOnSelect = SELECT_DEFAULTS.closeOnSelect,
      closeOnOutsideClick = SELECT_DEFAULTS.closeOnOutsideClick,
      closeOnEscape = SELECT_DEFAULTS.closeOnEscape,
      disabled = false,
      loading = false,
      clearable = false,
      portal = true,
      portalContainerId = 'select-portal',
      responsive,
      className = '',
      menuClassName = '',
      triggerProps,
      menuProps,
      searchProps,
      optionProps,
      loaderProps,
      containerProps,
      onValueChange,
      onOpenChange,
      renderOption,
      renderTrigger,
      ...rest
    },
    ref,
  ) {
    // Internal state for uncontrolled mode.
    const [internalValue, setInternalValue] = useState(defaultValue || (multiple ? [] : null));
    const [internalOpen, setInternalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    // Determine if controlled.
    const isControlled = controlledValue !== undefined;
    const value = isControlled ? controlledValue : internalValue;

    // Handle value change.
    const handleValueChange = useCallback(
      (newValue) => {
        if (!isControlled) {
          setInternalValue(newValue);
        }
        onValueChange?.(newValue);
      },
      [isControlled, onValueChange],
    );

    // Handle open change.
    const handleOpenChange = useCallback(
      (newOpen) => {
        setInternalOpen(newOpen);
        onOpenChange?.(newOpen);
      },
      [onOpenChange],
    );

    // Resolve defaults.
    const resolved = useMemo(
      () =>
        resolveDefaultProps({
          variant,
          size,
          radius,
          shadow,
          position,
          animation,
          closeOnSelect,
          closeOnOutsideClick,
          closeOnEscape,
          disabled,
          loading,
          multiple,
          searchable,
          clearable,
        }),
      [
        variant,
        size,
        radius,
        shadow,
        position,
        animation,
        closeOnSelect,
        closeOnOutsideClick,
        closeOnEscape,
        disabled,
        loading,
        multiple,
        searchable,
        clearable,
      ],
    );

    // Filter options based on search.
    const filteredOptions = useMemo(() => {
      if (!searchable || !searchTerm) return options;
      return options.filter((option) =>
        option.label.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }, [options, searchable, searchTerm]);

    // Determine if interactive.
    const isInteractive = !resolved.disabled && !resolved.loading;

    // Handle option select.
    const handleSelect = useCallback(
      (option) => {
        if (option.disabled || !isInteractive) return;

        let newValue;
        if (resolved.multiple) {
          const current = Array.isArray(value) ? value : [];
          const index = current.findIndex((v) => v === option.value);
          if (index > -1) {
            newValue = current.filter((v) => v !== option.value);
          } else {
            newValue = [...current, option.value];
          }
        } else {
          newValue = option.value;
          if (resolved.closeOnSelect) {
            handleOpenChange(false);
          }
        }

        handleValueChange(newValue);
        setSearchTerm('');
      },
      [isInteractive, resolved.multiple, resolved.closeOnSelect, value, handleValueChange, handleOpenChange],
    );

    // Handle clear.
    const handleClear = useCallback(() => {
      if (!isInteractive || !resolved.clearable) return;
      handleValueChange(resolved.multiple ? [] : null);
    }, [isInteractive, resolved.clearable, resolved.multiple, handleValueChange]);

    // Get selected labels.
    const selectedLabels = useMemo(() => {
      if (!value) return [];
      if (resolved.multiple) {
        const values = Array.isArray(value) ? value : [];
        return options
          .filter((opt) => values.includes(opt.value))
          .map((opt) => opt.label);
      }
      const option = options.find((opt) => opt.value === value);
      return option ? [option.label] : [];
    }, [value, options, resolved.multiple]);

    // Reset search when closed.
    useEffect(() => {
      if (!internalOpen) {
        setSearchTerm('');
      }
    }, [internalOpen]);

    // Trigger props.
    const triggerPropsMerged = useMemo(
      () => ({
        variant: resolved.variant,
        size: resolved.size,
        disabled: resolved.disabled,
        loading: resolved.loading,
        placeholder,
        value: value,
        selectedLabels,
        multiple: resolved.multiple,
        clearable: resolved.clearable,
        open: internalOpen,
        onOpenChange: handleOpenChange,
        onClear: handleClear,
        responsive,
        renderTrigger,
        ...triggerProps,
      }),
      [
        resolved.variant,
        resolved.size,
        resolved.disabled,
        resolved.loading,
        placeholder,
        value,
        selectedLabels,
        resolved.multiple,
        resolved.clearable,
        internalOpen,
        handleOpenChange,
        handleClear,
        responsive,
        renderTrigger,
        triggerProps,
      ],
    );

    // Menu props.
    const menuPropsMerged = useMemo(
      () => ({
        options: filteredOptions,
        value,
        multiple: resolved.multiple,
        variant: resolved.variant,
        size: resolved.size,
        radius: resolved.radius,
        shadow: resolved.shadow,
        position: resolved.position,
        animation: resolved.animation,
        closeOnSelect: resolved.closeOnSelect,
        disabled: resolved.disabled,
        loading: resolved.loading,
        open: internalOpen,
        onOpenChange: handleOpenChange,
        onSelect: handleSelect,
        responsive,
        className: menuClassName,
        emptyMessage,
        renderOption,
        ...menuProps,
      }),
      [
        filteredOptions,
        value,
        resolved.multiple,
        resolved.variant,
        resolved.size,
        resolved.radius,
        resolved.shadow,
        resolved.position,
        resolved.animation,
        resolved.closeOnSelect,
        resolved.disabled,
        resolved.loading,
        internalOpen,
        handleOpenChange,
        handleSelect,
        responsive,
        menuClassName,
        emptyMessage,
        renderOption,
        menuProps,
      ],
    );

    // Search props.
    const searchPropsMerged = useMemo(
      () => ({
        value: searchTerm,
        onChange: setSearchTerm,
        placeholder: searchPlaceholder,
        disabled: resolved.disabled,
        loading: resolved.loading,
        responsive,
        ...searchProps,
      }),
      [searchTerm, searchPlaceholder, resolved.disabled, resolved.loading, responsive, searchProps],
    );

    // Loader props.
    const loaderPropsMerged = useMemo(
      () => ({
        size: resolved.size,
        variant: 'shimmer',
        rows: 4,
        disabled: resolved.disabled,
        responsive,
        ...loaderProps,
      }),
      [resolved.size, resolved.disabled, responsive, loaderProps],
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

    // Combine ref.
    const combinedRef = useCallback(
      (node) => {
        if (typeof ref === 'function') ref(node);
        else if (ref) ref.current = node;
      },
      [ref],
    );

    // Determine if we should use portal.
    const MenuWrapper = portal ? SelectPortal : SelectMenu;

    // Portal props.
    const portalProps = portal
      ? {
          open: internalOpen,
          containerId: portalContainerId,
          disabled: resolved.disabled,
        }
      : {};

    // Render menu content.
    const renderMenuContent = () => {
      if (resolved.loading) {
        return <SelectLoader {...loaderPropsMerged} />;
      }

      return (
        <SelectMenu {...menuPropsMerged}>
          {searchable && <SelectSearch {...searchPropsMerged} />}
        </SelectMenu>
      );
    };

    // If using portal, wrap menu inside portal.
    if (portal) {
      return (
        <SelectContainer ref={combinedRef} {...containerPropsMerged}>
          <SelectTrigger {...triggerPropsMerged} />
          <SelectPortal {...portalProps}>
            {renderMenuContent()}
          </SelectPortal>
        </SelectContainer>
      );
    }

    // Without portal, use menu directly.
    return (
      <SelectContainer ref={combinedRef} {...containerPropsMerged}>
        <SelectTrigger {...triggerPropsMerged} />
        {renderMenuContent()}
      </SelectContainer>
    );
  }),
);

Select.displayName = 'Select';

Select.propTypes = {
  /** Array of select options. */
  options: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.node,
      value: PropTypes.any.isRequired,
      disabled: PropTypes.bool,
      icon: PropTypes.node,
      group: PropTypes.string,
    }),
  ),
  /** Controlled value. */
  value: PropTypes.oneOfType([
    PropTypes.any,
    PropTypes.arrayOf(PropTypes.any),
  ]),
  /** Default value for uncontrolled mode. */
  defaultValue: PropTypes.oneOfType([
    PropTypes.any,
    PropTypes.arrayOf(PropTypes.any),
  ]),
  /** Whether multiple selection is enabled. */
  multiple: PropTypes.bool,
  /** Whether search is enabled. */
  searchable: PropTypes.bool,
  /** Placeholder text. */
  placeholder: PropTypes.string,
  /** Search input placeholder. */
  searchPlaceholder: PropTypes.string,
  /** Message shown when no options match search. */
  emptyMessage: PropTypes.string,
  /** Visual variant. */
  variant: PropTypes.oneOf(['default', 'primary', 'secondary', 'ghost']),
  /** Size preset. */
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
  /** Border radius override. */
  radius: PropTypes.oneOf(['none', 'sm', 'md', 'lg', 'xl', '2xl', 'full']),
  /** Shadow level. */
  shadow: PropTypes.oneOf(['none', 'sm', 'md', 'lg', 'xl', '2xl']),
  /** Menu position. */
  position: PropTypes.oneOf([
    'bottom',
    'bottom-start',
    'bottom-end',
    'top',
    'top-start',
    'top-end',
  ]),
  /** Animation type. */
  animation: PropTypes.oneOf(['fade', 'slide', 'scale', 'slideScale', 'none']),
  /** Close menu when an option is selected. */
  closeOnSelect: PropTypes.bool,
  /** Close menu when clicking outside. */
  closeOnOutsideClick: PropTypes.bool,
  /** Close menu when pressing Escape. */
  closeOnEscape: PropTypes.bool,
  /** Disabled state. */
  disabled: PropTypes.bool,
  /** Loading state. */
  loading: PropTypes.bool,
  /** Whether the value can be cleared. */
  clearable: PropTypes.bool,
  /** Whether to render menu in a portal. */
  portal: PropTypes.bool,
  /** Portal container ID. */
  portalContainerId: PropTypes.string,
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
  /** Additional CSS classes for the menu. */
  menuClassName: PropTypes.string,
  /** Additional props for SelectTrigger. */
  triggerProps: PropTypes.object,
  /** Additional props for SelectMenu. */
  menuProps: PropTypes.object,
  /** Additional props for SelectSearch. */
  searchProps: PropTypes.object,
  /** Additional props for SelectOption. */
  optionProps: PropTypes.object,
  /** Additional props for SelectLoader. */
  loaderProps: PropTypes.object,
  /** Additional props for SelectContainer. */
  containerProps: PropTypes.object,
  /** Callback when value changes. */
  onValueChange: PropTypes.func,
  /** Callback when open state changes. */
  onOpenChange: PropTypes.func,
  /** Custom option renderer. */
  renderOption: PropTypes.func,
  /** Custom trigger renderer. */
  renderTrigger: PropTypes.func,
};

export default Select;