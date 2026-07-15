/**
 * KisanO Design System — Navbar Package
 * NavbarMenu
 *
 * The menu component for the navbar. Renders navigation items with
 * support for desktop and mobile layouts, nested menus, and accessibility.
 *
 * Single Responsibility: Render the navbar menu with items.
 * Does not manage navbar state or brand/toggle logic.
 *
 * @module components/ui/Navbar/NavbarMenu
 */

import { forwardRef, memo, useMemo, useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { motion, useReducedMotion } from 'framer-motion';

import {
  NAVBAR_DEFAULTS,
} from './navbarVariants';
import {
  mergeClasses,
  resolveResponsiveClasses,
  getNavbarMenuClasses,
  getNavbarItemClasses,
} from './navbarUtils';

/* ---------------------------------- */
/* Component-specific tokens          */
/* ---------------------------------- */

/** Motion variants for menu items. */
const ITEM_MOTION = {
  initial: { opacity: 0, y: -4 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -4 },
  transition: { duration: 0.15, ease: [0.4, 0, 0.2, 1] },
};

/** Motion variants for submenu. */
const SUBMENU_MOTION = {
  initial: { opacity: 0, y: -8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
  transition: { duration: 0.2, ease: [0.4, 0, 0.2, 1] },
};

/* ---------------------------------- */
/* Subcomponent: NavbarSubmenu        */
/* ---------------------------------- */

/**
 * NavbarSubmenu – a nested submenu for navbar items.
 */
const NavbarSubmenu = memo(
  forwardRef(function NavbarSubmenu(
    {
      children,
      label,
      icon,
      active = false,
      disabled = false,
      className = '',
      ...rest
    },
    ref,
  ) {
    const [isOpen, setIsOpen] = useState(false);
    const prefersReducedMotion = useReducedMotion();

    const itemClasses = useMemo(
      () =>
        getNavbarItemClasses({
          className,
          active,
          disabled,
        }),
      [className, active, disabled],
    );

    const submenuClasses = useMemo(
      () =>
        mergeClasses(
          'absolute left-0 top-full mt-1 min-w-[200px]',
          'bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700',
          'py-1 z-50',
          isOpen ? 'block' : 'hidden',
        ),
      [isOpen],
    );

    const handleMouseEnter = useCallback(() => {
      if (!disabled) setIsOpen(true);
    }, [disabled]);

    const handleMouseLeave = useCallback(() => {
      setIsOpen(false);
    }, []);

    const handleToggle = useCallback(() => {
      if (!disabled) setIsOpen(!isOpen);
    }, [disabled, isOpen]);

    const motionProps = useMemo(() => {
      if (prefersReducedMotion) {
        return { initial: false, animate: true, exit: false };
      }
      return SUBMENU_MOTION;
    }, [prefersReducedMotion]);

    return (
      <div
        ref={ref}
        className="relative"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        {...rest}
      >
        <button
          type="button"
          className={itemClasses}
          onClick={handleToggle}
          aria-expanded={isOpen}
          aria-haspopup="true"
          disabled={disabled}
        >
          {icon && <span className="mr-2">{icon}</span>}
          {label}
          <svg
            className={mergeClasses(
              'ml-1 h-4 w-4 transition-transform duration-200',
              isOpen && 'rotate-180',
            )}
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        <motion.div className={submenuClasses} {...motionProps}>
          {children}
        </motion.div>
      </div>
    );
  }),
);

NavbarSubmenu.displayName = 'NavbarSubmenu';

/* ---------------------------------- */
/* Main Component: NavbarMenu         */
/* ---------------------------------- */

/**
 * NavbarMenu – the navigation menu for the navbar.
 *
 * @component
 * @example
 * <NavbarMenu>
 *   <a href="/">Home</a>
 *   <a href="/about">About</a>
 *   <NavbarSubmenu label="Services">
 *     <a href="/services/consulting">Consulting</a>
 *   </NavbarSubmenu>
 * </NavbarMenu>
 */
const NavbarMenu = memo(
  forwardRef(function NavbarMenu(
    {
      children,
      items = [],
      size = NAVBAR_DEFAULTS.size,
      open = false,
      collapsed = false,
      dark = false,
      responsive,
      className = '',
      role = 'menu',
      'aria-label': ariaLabel = 'Navigation menu',
      ...rest
    },
    ref,
  ) {
    const prefersReducedMotion = useReducedMotion();

    // Menu classes.
    const menuClasses = useMemo(
      () =>
        getNavbarMenuClasses({
          size,
          className,
          open,
          collapsed,
        }),
      [size, className, open, collapsed],
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

    // Render menu items from array.
    const renderItems = useCallback(() => {
      if (!items || items.length === 0) return null;

      return items.map((item, index) => {
        // If item has subitems, render as submenu.
        if (item.items && item.items.length > 0) {
          return (
            <NavbarSubmenu
              key={index}
              label={item.label}
              icon={item.icon}
              active={item.active}
              disabled={item.disabled}
            >
              {item.items.map((subItem, subIndex) => (
                <a
                  key={subIndex}
                  href={subItem.href}
                  className={mergeClasses(
                    'block px-4 py-2 text-sm',
                    'hover:bg-gray-100 dark:hover:bg-gray-700',
                    subItem.active && 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
                    subItem.disabled && 'opacity-50 cursor-not-allowed pointer-events-none',
                  )}
                  onClick={subItem.onClick}
                  aria-current={subItem.active ? 'page' : undefined}
                >
                  {subItem.icon && <span className="mr-2">{subItem.icon}</span>}
                  {subItem.label}
                </a>
              ))}
            </NavbarSubmenu>
          );
        }

        // Render regular item.
        return (
          <a
            key={index}
            href={item.href}
            className={mergeClasses(
              'px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200',
              item.active
                ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                : 'hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-white',
              item.disabled && 'opacity-50 cursor-not-allowed pointer-events-none',
            )}
            onClick={item.onClick}
            aria-current={item.active ? 'page' : undefined}
            aria-disabled={item.disabled || undefined}
          >
            {item.icon && <span className="mr-2">{item.icon}</span>}
            {item.label}
          </a>
        );
      });
    }, [items]);

    // Motion props for items.
    const itemMotionProps = useMemo(() => {
      if (prefersReducedMotion) {
        return { initial: false, animate: true, exit: false };
      }
      return ITEM_MOTION;
    }, [prefersReducedMotion]);

    // Accessibility attributes.
    const ariaProps = useMemo(
      () => ({
        role,
        'aria-label': ariaLabel,
        'aria-hidden': !open && collapsed ? true : undefined,
      }),
      [role, ariaLabel, open, collapsed],
    );

    return (
      <motion.div
        ref={ref}
        className={finalClasses}
        {...itemMotionProps}
        {...ariaProps}
        {...rest}
      >
        {children || renderItems()}
      </motion.div>
    );
  }),
);

NavbarMenu.displayName = 'NavbarMenu';

NavbarMenu.propTypes = {
  /** Menu children (custom). */
  children: PropTypes.node,
  /** Menu items array. */
  items: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.node,
      href: PropTypes.string,
      icon: PropTypes.node,
      active: PropTypes.bool,
      disabled: PropTypes.bool,
      onClick: PropTypes.func,
      items: PropTypes.arrayOf(
        PropTypes.shape({
          label: PropTypes.node,
          href: PropTypes.string,
          icon: PropTypes.node,
          active: PropTypes.bool,
          disabled: PropTypes.bool,
          onClick: PropTypes.func,
        }),
      ),
    }),
  ),
  /** Size preset. */
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
  /** Whether the menu is open (mobile). */
  open: PropTypes.bool,
  /** Whether the menu is collapsed (mobile). */
  collapsed: PropTypes.bool,
  /** Dark mode. */
  dark: PropTypes.bool,
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

export default NavbarMenu;