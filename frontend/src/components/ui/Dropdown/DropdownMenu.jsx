/**
 * KisanO Design System — Dropdown Package
 * DropdownMenu
 *
 * The menu component that renders dropdown items with animations
 * and accessibility support. Renders items, dividers, and groups.
 *
 * Single Responsibility: Render dropdown menu with items.
 * Does not manage trigger interactions or positioning.
 *
 * @module components/ui/Dropdown/DropdownMenu
 */

import { forwardRef, memo, useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import { motion, useReducedMotion } from 'framer-motion';

import {
  DROPDOWN_DEFAULTS,
  getDropdownAnimation,
} from './dropdownVariants';
import {
  mergeClasses,
  resolveResponsiveClasses,
  getDropdownMenuClasses,
  getDropdownItemClasses,
  getDropdownDividerClasses,
  getDropdownGroupClasses,
  getDropdownLabelClasses,
  shouldCloseOnSelect,
} from './dropdownUtils';

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
 * DropdownItem – a single item in the dropdown menu.
 */
const DropdownItem = memo(
  forwardRef(function DropdownItem(
    {
      children,
      label,
      icon,
      variant = 'default',
      disabled = false,
      onClick,
      className = '',
      ...rest
    },
    ref,
  ) {
    const handleClick = useCallback(
      (event) => {
        if (disabled) return;
        onClick?.(event);
      },
      [disabled, onClick],
    );

    const itemClasses = getDropdownItemClasses({
      state: disabled ? 'disabled' : variant,
      className,
      disabled,
    });

    return (
      <button
        ref={ref}
        type="button"
        role="option"
        className={itemClasses}
        disabled={disabled}
        onClick={handleClick}
        aria-disabled={disabled}
        {...rest}
      >
        {icon && <span className="shrink-0">{icon}</span>}
        <span>{children || label}</span>
      </button>
    );
  }),
);

DropdownItem.displayName = 'DropdownItem';

/**
 * DropdownDivider – a divider in the dropdown menu.
 */
const DropdownDivider = memo(
  forwardRef(function DropdownDivider({ className = '', ...rest }, ref) {
    const dividerClasses = getDropdownDividerClasses(className);
    return <div ref={ref} className={dividerClasses} role="separator" {...rest} />;
  }),
);

DropdownDivider.displayName = 'DropdownDivider';

/**
 * DropdownGroup – a group of items in the dropdown menu.
 */
const DropdownGroup = memo(
  forwardRef(function DropdownGroup(
    { children, label, size = DROPDOWN_DEFAULTS.size, className = '', ...rest },
    ref,
  ) {
    const groupClasses = getDropdownGroupClasses(className);
    const labelClasses = getDropdownLabelClasses({ size, disabled: false });

    return (
      <div ref={ref} className={groupClasses} role="group" {...rest}>
        {label && <div className={labelClasses}>{label}</div>}
        {children}
      </div>
    );
  }),
);

DropdownGroup.displayName = 'DropdownGroup';

/* ---------------------------------- */
/* Main Component                     */
/* ---------------------------------- */

/**
 * DropdownMenu – the dropdown menu with items.
 *
 * @component
 * @example
 * <DropdownMenu
 *   items={[
 *     { label: 'Edit', onClick: handleEdit },
 *     { divider: true },
 *     { label: 'Delete', variant: 'danger', onClick: handleDelete },
 *   ]}
 * />
 */
const DropdownMenu = memo(
  forwardRef(function DropdownMenu(
    {
      items,
      children,
      variant = DROPDOWN_DEFAULTS.variant,
      size = DROPDOWN_DEFAULTS.size,
      radius = DROPDOWN_DEFAULTS.radius,
      shadow = DROPDOWN_DEFAULTS.shadow,
      position = DROPDOWN_DEFAULTS.position,
      animation = DROPDOWN_DEFAULTS.animation,
      closeOnSelect = DROPDOWN_DEFAULTS.closeOnSelect,
      disabled = false,
      loading = false,
      open = false,
      onOpenChange,
      responsive,
      className = '',
      role = 'listbox',
      'aria-label': ariaLabel = 'Dropdown menu',
      ...rest
    },
    ref,
  ) {
    const prefersReducedMotion = useReducedMotion();

    // Get menu classes.
    const menuClasses = useMemo(
      () =>
        getDropdownMenuClasses({
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

    // Handle item selection.
    const handleItemClick = useCallback(
      (item, event) => {
        if (item.disabled || disabled || loading) return;
        item.onClick?.(event);
        if (shouldCloseOnSelect({ closeOnSelect, disabled, loading })) {
          onOpenChange?.(false);
        }
      },
      [closeOnSelect, disabled, loading, onOpenChange],
    );

    // Render items from array.
    const renderItems = useCallback(() => {
      if (!items || items.length === 0) return null;

      return items.map((item, index) => {
        // Render divider.
        if (item.divider) {
          return <DropdownDivider key={index} />;
        }

        // Render group.
        if (item.group) {
          return (
            <DropdownGroup
              key={index}
              label={item.label}
              size={size}
            >
              {item.items?.map((subItem, subIndex) => (
                <DropdownItem
                  key={`${index}-${subIndex}`}
                  label={subItem.label}
                  icon={subItem.icon}
                  variant={subItem.variant || 'default'}
                  disabled={subItem.disabled || disabled}
                  onClick={(e) => handleItemClick(subItem, e)}
                />
              ))}
            </DropdownGroup>
          );
        }

        // Render regular item.
        return (
          <DropdownItem
            key={index}
            label={item.label}
            icon={item.icon}
            variant={item.variant || 'default'}
            disabled={item.disabled || disabled}
            onClick={(e) => handleItemClick(item, e)}
          />
        );
      });
    }, [items, size, disabled, handleItemClick]);

    // Animation props - respect reduced motion.
    const motionProps = useMemo(() => {
      if (prefersReducedMotion) {
        return { initial: false, animate: true, exit: false };
      }
      const anim = getDropdownAnimation(animation);
      return {
        initial: anim.initial,
        animate: anim.animate,
        exit: anim.exit,
        transition: anim.transition,
      };
    }, [prefersReducedMotion, animation]);

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

    // If loading, render a loading state (but don't show loader directly).
    // The loader is handled by the parent Dropdown component.
    if (loading) {
      return null; // Parent renders loader via DropdownLoader
    }

    // If no items and no children, render nothing.
    if ((!items || items.length === 0) && !children) {
      return null;
    }

    return (
      <motion.div
        ref={ref}
        className={finalClasses}
        {...motionProps}
        {...ariaProps}
        {...rest}
      >
        {children || renderItems()}
      </motion.div>
    );
  }),
);

DropdownMenu.displayName = 'DropdownMenu';

DropdownMenu.propTypes = {
  /** Array of dropdown items. */
  items: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.node,
      value: PropTypes.any,
      icon: PropTypes.node,
      variant: PropTypes.oneOf(['default', 'danger', 'success', 'warning']),
      disabled: PropTypes.bool,
      divider: PropTypes.bool,
      group: PropTypes.bool,
      onClick: PropTypes.func,
      items: PropTypes.array,
    }),
  ),
  /** Custom children (overrides items). */
  children: PropTypes.node,
  /** Visual variant. */
  variant: PropTypes.oneOf([
    'default',
    'primary',
    'secondary',
    'success',
    'warning',
    'error',
    'ghost',
  ]),
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
    'left',
    'left-start',
    'left-end',
    'right',
    'right-start',
    'right-end',
  ]),
  /** Animation type. */
  animation: PropTypes.oneOf(['fade', 'slide', 'scale', 'slideScale', 'none']),
  /** Close dropdown when an item is selected. */
  closeOnSelect: PropTypes.bool,
  /** Disabled state. */
  disabled: PropTypes.bool,
  /** Loading state. */
  loading: PropTypes.bool,
  /** Whether dropdown is open. */
  open: PropTypes.bool,
  /** Callback when open state changes. */
  onOpenChange: PropTypes.func,
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
  /** ARIA role. */
  role: PropTypes.string,
  /** Accessible label. */
  'aria-label': PropTypes.string,
};

export default DropdownMenu;