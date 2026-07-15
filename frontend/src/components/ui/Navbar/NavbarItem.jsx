/**
 * KisanO Design System — Navbar Package
 * NavbarItem
 *
 * A single navigation item in the navbar menu. Supports active states,
 * icons, badges, dropdown indicators, and accessibility.
 *
 * Single Responsibility: Render one navigation item.
 * Does not manage navbar state or menu layout.
 *
 * @module components/ui/Navbar/NavbarItem
 */

import { forwardRef, memo, useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';

import {
  NAVBAR_DEFAULTS,
} from './navbarVariants';
import {
  mergeClasses,
  resolveResponsiveClasses,
  getNavbarItemClasses,
} from './navbarUtils';

/* ---------------------------------- */
/* Component-specific tokens          */
/* ---------------------------------- */

/** Badge color mapping. */
const BADGE_COLORS = {
  default: 'bg-gray-500',
  primary: 'bg-blue-500',
  success: 'bg-green-500',
  warning: 'bg-yellow-500',
  error: 'bg-red-500',
  info: 'bg-cyan-500',
};

/** Motion variants (if used with Framer Motion). */
const ITEM_MOTION = {
  hover: { scale: 1.02 },
  tap: { scale: 0.98 },
  transition: { duration: 0.15, ease: [0.4, 0, 0.2, 1] },
};

/* ---------------------------------- */
/* Component                          */
/* ---------------------------------- */

/**
 * NavbarItem – a single navigation item.
 *
 * @component
 * @example
 * <NavbarItem href="/" active>
 *   Home
 * </NavbarItem>
 *
 * @example
 * <NavbarItem
 *   label="Notifications"
 *   icon={<BellIcon />}
 *   badge={{ count: 5, color: 'error' }}
 * />
 */
const NavbarItem = memo(
  forwardRef(function NavbarItem(
    {
      children,
      label,
      href,
      icon,
      badge,
      active = false,
      disabled = false,
      onClick,
      size = NAVBAR_DEFAULTS.size,
      responsive,
      className = '',
      role = 'menuitem',
      'aria-label': ariaLabel,
      ...rest
    },
    ref,
  ) {
    // Item classes.
    const itemClasses = useMemo(
      () =>
        getNavbarItemClasses({
          className,
          active,
          disabled,
        }),
      [className, active, disabled],
    );

    // Responsive overrides.
    const responsiveClasses = useMemo(
      () => (responsive ? resolveResponsiveClasses(responsive) : ''),
      [responsive],
    );

    const finalClasses = useMemo(
      () => mergeClasses(itemClasses, responsiveClasses),
      [itemClasses, responsiveClasses],
    );

    // Handle click.
    const handleClick = useCallback(
      (event) => {
        if (disabled) return;
        onClick?.(event);
      },
      [disabled, onClick],
    );

    // Badge color.
    const badgeColor = useMemo(() => {
      if (!badge) return '';
      return BADGE_COLORS[badge.color] || BADGE_COLORS.default;
    }, [badge]);

    // Accessibility attributes.
    const ariaProps = useMemo(
      () => ({
        role,
        'aria-label': ariaLabel || label || 'Navigation item',
        'aria-current': active ? 'page' : undefined,
        'aria-disabled': disabled || undefined,
        tabIndex: disabled ? -1 : 0,
      }),
      [role, ariaLabel, label, active, disabled],
    );

    // Render content.
    const content = (
      <>
        {icon && <span className="shrink-0">{icon}</span>}
        <span className="truncate">{children || label}</span>
        {badge && (
          <span
            className={mergeClasses(
              'ml-1.5 inline-flex items-center justify-center',
              'min-w-[18px] h-[18px] px-1.5',
              'rounded-full text-xs font-medium text-white',
              badgeColor,
            )}
          >
            {badge.count}
          </span>
        )}
      </>
    );

    // If href is provided, render as link.
    if (href) {
      return (
        <a
          ref={ref}
          href={href}
          className={finalClasses}
          onClick={handleClick}
          {...ariaProps}
          {...rest}
        >
          {content}
        </a>
      );
    }

    // Otherwise, render as button.
    return (
      <button
        ref={ref}
        type="button"
        className={finalClasses}
        onClick={handleClick}
        disabled={disabled}
        {...ariaProps}
        {...rest}
      >
        {content}
      </button>
    );
  }),
);

NavbarItem.displayName = 'NavbarItem';

NavbarItem.propTypes = {
  /** Item content (alternative to label). */
  children: PropTypes.node,
  /** Item label. */
  label: PropTypes.node,
  /** Link href. */
  href: PropTypes.string,
  /** Icon element. */
  icon: PropTypes.node,
  /** Badge configuration. */
  badge: PropTypes.shape({
    count: PropTypes.number,
    color: PropTypes.oneOf(['default', 'primary', 'success', 'warning', 'error', 'info']),
  }),
  /** Active state. */
  active: PropTypes.bool,
  /** Disabled state. */
  disabled: PropTypes.bool,
  /** Click handler. */
  onClick: PropTypes.func,
  /** Size preset. */
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
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

export default NavbarItem;