/**
 * KisanO Design System — Select Package
 * SelectMenu
 *
 * The menu component that renders select options with support for
 * search, groups, empty states, and keyboard navigation.
 *
 * Single Responsibility: Render select options with search and groups.
 * Does not manage selection state or trigger interactions.
 *
 * @module components/ui/Select/SelectMenu
 */

import { forwardRef, memo, useMemo, useCallback, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { motion, useReducedMotion } from 'framer-motion';

import {
  SELECT_DEFAULTS,
  getSelectAnimation,
} from './selectVariants';
import {
  mergeClasses,
  resolveResponsiveClasses,
  getSelectMenuClasses,
  getSelectOptionClasses,
  getSelectGroupClasses,
  getSelectEmptyClasses,
} from './selectUtils';

/* ---------------------------------- */
/* Component-specific tokens          */
/* ---------------------------------- */

/** Motion variants for menu entrance/exit. */
const MENU_MOTION = {
  initial: { opacity: 0, y: -8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
  transition: { duration: 0.2, ease: [0.4, 0, 0.2, 1] },
};

/* ---------------------------------- */
/* Sub-components                     */
/* ---------------------------------- */

/**
 * SelectOptionItem – a single option in the select menu.
 */
const SelectOptionItem = memo(
  forwardRef(function SelectOptionItem(
    {
      option,
      isSelected,
      isHighlighted,
      multiple,
      onSelect,
      size = SELECT_DEFAULTS.size,
      renderOption,
      className = '',
      ...rest
    },
    ref,
  ) {
    const handleClick = useCallback(() => {
      if (option.disabled) return;
      onSelect?.(option);
    }, [option, onSelect]);

    const handleKeyDown = useCallback(
      (event) => {
        if (option.disabled) return;
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          onSelect?.(option);
        }
      },
      [option, onSelect],
    );

    const optionClasses = useMemo(
      () =>
        getSelectOptionClasses({
          state: option.disabled ? 'disabled' : isSelected ? 'selected' : 'default',
          size,
          className,
        }),
      [option.disabled, isSelected, size, className],
    );

    // Custom renderer.
    if (renderOption) {
      return renderOption({
        option,
        isSelected,
        isHighlighted,
        multiple,
        onSelect: handleClick,
        className: optionClasses,
        ...rest,
      });
    }

    return (
      <div
        ref={ref}
        role="option"
        aria-selected={isSelected}
        aria-disabled={option.disabled || undefined}
        tabIndex={option.disabled ? -1 : 0}
        className={optionClasses}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        {...rest}
      >
        {multiple && (
          <div className="shrink-0 w-5 h-5 border-2 rounded flex items-center justify-center transition-colors">
            {isSelected && (
              <svg className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M20 6L9 17l-5-5" />
              </svg>
            )}
          </div>
        )}
        {option.icon && <span className="shrink-0">{option.icon}</span>}
        <span className="flex-1 truncate">{option.label}</span>
      </div>
    );
  }),
);

SelectOptionItem.displayName = 'SelectOptionItem';

/**
 * SelectGroup – a group of options in the select menu.
 */
const SelectGroup = memo(
  forwardRef(function SelectGroup(
    { label, children, className = '', ...rest },
    ref,
  ) {
    const groupClasses = getSelectGroupClasses(className);
    return (
      <div ref={ref} className={groupClasses} role="group" aria-label={label} {...rest}>
        {label && (
          <div className="px-3 py-1.5 text-xs font-medium text-gray-500 uppercase tracking-wider">
            {label}
          </div>
        )}
        {children}
      </div>
    );
  }),
);

SelectGroup.displayName = 'SelectGroup';

/**
 * SelectEmpty – empty state for select menu.
 */
const SelectEmpty = memo(
  forwardRef(function SelectEmpty(
    { message = 'No options found', className = '', ...rest },
    ref,
  ) {
    const emptyClasses = getSelectEmptyClasses(className);
    return (
      <div ref={ref} className={emptyClasses} {...rest}>
        {message}
      </div>
    );
  }),
);

SelectEmpty.displayName = 'SelectEmpty';

/* ---------------------------------- */
/* Main Component                     */
/* ---------------------------------- */

/**
 * SelectMenu – the select menu with options and search.
 *
 * @component
 * @example
 * <SelectMenu
 *   options={options}
 *   value={selectedValue}
 *   onSelect={handleSelect}
 *   searchable
 * />
 */
const SelectMenu = memo(
  forwardRef(function SelectMenu(
    {
      options = [],
      value,
      multiple = false,
      searchable = false,
      searchValue = '',
      onSearchChange,
      variant = SELECT_DEFAULTS.variant,
      size = SELECT_DEFAULTS.size,
      radius = SELECT_DEFAULTS.radius,
      shadow = SELECT_DEFAULTS.shadow,
      position = SELECT_DEFAULTS.position,
      animation = SELECT_DEFAULTS.animation,
      disabled = false,
      loading = false,
      open = false,
      onSelect,
      responsive,
      className = '',
      emptyMessage = 'No options found',
      renderOption,
      role = 'listbox',
      'aria-label': ariaLabel = 'Select options',
      children,
      ...rest
    },
    ref,
  ) {
    const prefersReducedMotion = useReducedMotion();
    const menuRef = useRef(null);
    const [highlightedIndex, setHighlightedIndex] = useState(-1);

    // Get menu classes.
    const menuClasses = useMemo(
      () =>
        getSelectMenuClasses({
          position,
          radius,
          shadow,
          className,
          disabled,
          loading,
        }),
      [position, radius, shadow, className, disabled, loading],
    );

    // Responsive overrides.
    const responsiveClasses = useMemo(
      () => (responsive ? resolveResponsiveClasses(responsive) : ''),
      [responsive],
    );

    const finalClasses = useMemo(
      () => mergeClasses(menuClasses, responsiveClasses),
      [menuClasses, responsiveClasses],
    );

    // Check if option is selected.
    const isOptionSelected = useCallback(
      (option) => {
        if (multiple) {
          const values = Array.isArray(value) ? value : [];
          return values.some((v) => v === option.value);
        }
        return value === option.value;
      },
      [value, multiple],
    );

    // Handle option selection.
    const handleOptionSelect = useCallback(
      (option) => {
        if (option.disabled || disabled) return;
        onSelect?.(option);
      },
      [disabled, onSelect],
    );

    // Group options by group key.
    const groupedOptions = useMemo(() => {
      const groups = {};
      const ungrouped = [];

      options.forEach((option) => {
        if (option.group) {
          if (!groups[option.group]) {
            groups[option.group] = [];
          }
          groups[option.group].push(option);
        } else {
          ungrouped.push(option);
        }
      });

      return { groups, ungrouped };
    }, [options]);

    // Keyboard navigation.
    useEffect(() => {
      if (!open) return;

      const handleKeyDown = (event) => {
        const items = menuRef.current?.querySelectorAll('[role="option"]:not([aria-disabled="true"])');
        if (!items || items.length === 0) return;

        let newIndex = highlightedIndex;

        if (event.key === 'ArrowDown') {
          event.preventDefault();
          newIndex = (highlightedIndex + 1) % items.length;
        } else if (event.key === 'ArrowUp') {
          event.preventDefault();
          newIndex = (highlightedIndex - 1 + items.length) % items.length;
        } else if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          if (highlightedIndex >= 0 && highlightedIndex < items.length) {
            items[highlightedIndex]?.click();
          }
          return;
        }

        if (newIndex !== highlightedIndex) {
          setHighlightedIndex(newIndex);
          items[newIndex]?.focus();
        }
      };

      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }, [open, highlightedIndex]);

    // Reset highlight on open/options change.
    useEffect(() => {
      setHighlightedIndex(-1);
    }, [open, options]);

    // Animation props - respect reduced motion.
    const motionProps = useMemo(() => {
      if (prefersReducedMotion) {
        return { initial: false, animate: true, exit: false };
      }
      return getSelectAnimation(animation);
    }, [prefersReducedMotion, animation]);

    // Render options.
    const renderOptions = useCallback(() => {
      if (options.length === 0) {
        return <SelectEmpty message={emptyMessage} />;
      }

      const { groups, ungrouped } = groupedOptions;

      // Render ungrouped options.
      const ungroupedItems = ungrouped.map((option, index) => (
        <SelectOptionItem
          key={option.value}
          option={option}
          isSelected={isOptionSelected(option)}
          isHighlighted={highlightedIndex === index}
          multiple={multiple}
          onSelect={handleOptionSelect}
          size={size}
          renderOption={renderOption}
        />
      ));

      // Render grouped options.
      const groupedItems = Object.entries(groups).map(([groupName, groupOptions]) => (
        <SelectGroup key={groupName} label={groupName}>
          {groupOptions.map((option, index) => (
            <SelectOptionItem
              key={option.value}
              option={option}
              isSelected={isOptionSelected(option)}
              isHighlighted={highlightedIndex === options.indexOf(option)}
              multiple={multiple}
              onSelect={handleOptionSelect}
              size={size}
              renderOption={renderOption}
            />
          ))}
        </SelectGroup>
      ));

      return [...ungroupedItems, ...groupedItems];
    }, [
      options,
      groupedOptions,
      isOptionSelected,
      highlightedIndex,
      multiple,
      handleOptionSelect,
      size,
      renderOption,
      emptyMessage,
    ]);

    // Accessibility attributes.
    const ariaProps = useMemo(
      () => ({
        role,
        'aria-label': ariaLabel,
        'aria-disabled': disabled || undefined,
        'aria-busy': loading || undefined,
      }),
      [role, ariaLabel, disabled, loading],
    );

    return (
      <motion.div
        ref={(node) => {
          menuRef.current = node;
          if (typeof ref === 'function') ref(node);
          else if (ref) ref.current = node;
        }}
        className={finalClasses}
        {...motionProps}
        {...ariaProps}
        {...rest}
      >
        {children || renderOptions()}
      </motion.div>
    );
  }),
);

SelectMenu.displayName = 'SelectMenu';

SelectMenu.propTypes = {
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
  /** Selected value(s). */
  value: PropTypes.oneOfType([
    PropTypes.any,
    PropTypes.arrayOf(PropTypes.any),
  ]),
  /** Whether multiple selection is enabled. */
  multiple: PropTypes.bool,
  /** Whether search is enabled. */
  searchable: PropTypes.bool,
  /** Search input value. */
  searchValue: PropTypes.string,
  /** Callback when search changes. */
  onSearchChange: PropTypes.func,
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
  /** Disabled state. */
  disabled: PropTypes.bool,
  /** Loading state. */
  loading: PropTypes.bool,
  /** Whether select is open. */
  open: PropTypes.bool,
  /** Callback when an option is selected. */
  onSelect: PropTypes.func,
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
  /** Message shown when no options match search. */
  emptyMessage: PropTypes.string,
  /** Custom option renderer. */
  renderOption: PropTypes.func,
  /** ARIA role. */
  role: PropTypes.string,
  /** Accessible label. */
  'aria-label': PropTypes.string,
  /** Custom children. */
  children: PropTypes.node,
};

export default SelectMenu;