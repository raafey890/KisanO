/**
 * KisanO Design System — Navbar Package
 * Navbar
 *
 * The main Navbar component that orchestrates all navbar subcomponents.
 * Provides a convenient API for rendering responsive navigation with
 * brand, menu items, search, user profile, and mobile menu support.
 *
 * @module components/ui/Navbar/Navbar
 */

import { forwardRef, memo, useMemo, useState, useCallback, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

import {
  NAVBAR_DEFAULTS,
} from './navbarVariants';
import {
  mergeClasses,
  resolveResponsiveClasses,
  resolveDefaultProps,
} from './navbarUtils';

import NavbarContainer from './NavbarContainer';
import NavbarBrand from './NavbarBrand';
import NavbarMenu from './NavbarMenu';
import NavbarToggle from './NavbarToggle';
import NavbarSearch from './NavbarSearch';
import NavbarProfile from './NavbarProfile';
import NavbarLoader from './NavbarLoader';

/* ---------------------------------- */
/* Component                          */
/* ---------------------------------- */

const Navbar = memo(
  forwardRef(function Navbar(
    {
      children,
      brand,
      menu,
      right: rightProp,
      search,
      profile,
      toggle,
      items = [],
      logo,
      logoAlt = 'Logo',
      logoHref = '/',
      brandText,
      variant = NAVBAR_DEFAULTS.variant,
      size = NAVBAR_DEFAULTS.size,
      shadow = NAVBAR_DEFAULTS.shadow,
      position = NAVBAR_DEFAULTS.position,
      backdrop = NAVBAR_DEFAULTS.backdrop,
      sticky = false,
      fixed = false,
      transparent = false,
      dark = false,
      loading = false,
      collapsed = false,
      responsive,
      className = '',
      menuClassName = '',
      brandProps,
      menuProps,
      toggleProps,
      searchProps,
      profileProps,
      containerProps,
      loaderProps,
      onToggle,
      ...rest
    },
    ref,
  ) {
    const [isOpen, setIsOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    // Store onToggle in ref to prevent re-render loops
    const onToggleRef = useRef(onToggle);
    useEffect(() => {
      onToggleRef.current = onToggle;
    }, [onToggle]);

    // ✅ Fixed: handleToggle uses functional update to avoid dependencies
    const handleToggle = useCallback(() => {
      setIsOpen((prevOpen) => {
        const newOpen = !prevOpen;
        onToggleRef.current?.(newOpen);
        return newOpen;
      });
    }, []);

    // Handle scroll detection
    useEffect(() => {
      const handleScroll = () => {
        setIsScrolled(window.scrollY > 10);
      };

      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Resolve defaults
    const resolved = useMemo(
      () =>
        resolveDefaultProps({
          variant,
          size,
          shadow,
          position,
          backdrop,
          collapsed,
          transparent,
        }),
      [variant, size, shadow, position, backdrop, collapsed, transparent],
    );

    const isDark = dark || resolved.variant === 'dark' || resolved.variant === 'primary';

    const effectivePosition = useMemo(() => {
      if (sticky) return 'sticky';
      if (fixed) return 'fixed';
      return resolved.position;
    }, [sticky, fixed, resolved.position]);

    // Container props
    const containerPropsMerged = useMemo(
      () => ({
        variant: resolved.variant,
        size: resolved.size,
        shadow: resolved.shadow,
        position: effectivePosition,
        backdrop: resolved.backdrop,
        collapsed: resolved.collapsed,
        transparent: resolved.transparent || isScrolled,
        isOpen,
        dark: isDark,
        className,
        ...containerProps,
      }),
      [
        resolved.variant,
        resolved.size,
        resolved.shadow,
        effectivePosition,
        resolved.backdrop,
        resolved.collapsed,
        resolved.transparent,
        isScrolled,
        isOpen,
        isDark,
        className,
        containerProps,
      ],
    );

    const brandPropsMerged = useMemo(
      () => ({
        size: resolved.size,
        disabled: resolved.collapsed,
        ...brandProps,
      }),
      [resolved.size, resolved.collapsed, brandProps],
    );

    const menuPropsMerged = useMemo(
      () => ({
        size: resolved.size,
        open: isOpen,
        collapsed: resolved.collapsed,
        className: menuClassName,
        ...menuProps,
      }),
      [resolved.size, isOpen, resolved.collapsed, menuClassName, menuProps],
    );

    const togglePropsMerged = useMemo(
      () => ({
        size: resolved.size,
        open: isOpen,
        disabled: resolved.collapsed || loading,
        onClick: handleToggle,
        ...toggleProps,
      }),
      [resolved.size, isOpen, resolved.collapsed, loading, toggleProps],
    );

    const loaderPropsMerged = useMemo(
      () => ({
        size: resolved.size,
        variant: 'shimmer',
        rows: 4,
        disabled: resolved.collapsed,
        ...loaderProps,
      }),
      [resolved.size, resolved.collapsed, loaderProps],
    );

    const renderBrand = useMemo(() => {
      if (brand) return brand;
      if (logo || brandText) {
        return (
          <NavbarBrand href={logoHref} {...brandPropsMerged}>
            {logo && <img src={logo} alt={logoAlt} className="h-8 w-auto" />}
            {brandText}
          </NavbarBrand>
        );
      }
      return null;
    }, [brand, logo, logoAlt, logoHref, brandText, brandPropsMerged]);

    const renderMenuItems = useMemo(() => {
      if (menu) return menu;
      if (items.length > 0) {
        return (
          <NavbarMenu {...menuPropsMerged}>
            {items.map((item, index) => (
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
              >
                {item.icon && <span className="mr-2">{item.icon}</span>}
                {item.label}
              </a>
            ))}
          </NavbarMenu>
        );
      }
      return null;
    }, [menu, items, menuPropsMerged]);

    const renderRight = useMemo(() => {
      if (rightProp) return rightProp;
      return (
        <div className="flex items-center gap-2">
          {search && <NavbarSearch {...searchProps} />}
          {profile && <NavbarProfile {...profileProps} />}
          {toggle && <NavbarToggle {...togglePropsMerged} />}
        </div>
      );
    }, [rightProp, search, searchProps, profile, profileProps, toggle, togglePropsMerged]);

    const showLoader = loading;

    return (
      <NavbarContainer ref={ref} {...containerPropsMerged} {...rest}>
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-4">{renderBrand}</div>
          {!resolved.collapsed && renderMenuItems}
          <div className="flex items-center gap-2">
            {showLoader ? <NavbarLoader {...loaderPropsMerged} /> : renderRight}
          </div>
        </div>

        {resolved.collapsed && isOpen && (
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            {showLoader ? <NavbarLoader {...loaderPropsMerged} /> : renderMenuItems}
          </div>
        )}

        {children}
      </NavbarContainer>
    );
  }),
);

Navbar.displayName = 'Navbar';

Navbar.propTypes = {
  children: PropTypes.node,
  brand: PropTypes.node,
  menu: PropTypes.node,
  right: PropTypes.node,
  search: PropTypes.node,
  profile: PropTypes.node,
  toggle: PropTypes.node,
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
  logo: PropTypes.string,
  logoAlt: PropTypes.string,
  logoHref: PropTypes.string,
  brandText: PropTypes.node,
  variant: PropTypes.oneOf(['default', 'dark', 'primary', 'transparent', 'glass', 'gradient']),
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
  shadow: PropTypes.oneOf(['none', 'sm', 'md', 'lg', 'xl', '2xl']),
  position: PropTypes.oneOf(['static', 'fixed', 'sticky', 'absolute']),
  backdrop: PropTypes.oneOf(['none', 'sm', 'md', 'lg', 'xl']),
  sticky: PropTypes.bool,
  fixed: PropTypes.bool,
  transparent: PropTypes.bool,
  dark: PropTypes.bool,
  loading: PropTypes.bool,
  collapsed: PropTypes.bool,
  responsive: PropTypes.shape({
    xs: PropTypes.string,
    sm: PropTypes.string,
    md: PropTypes.string,
    lg: PropTypes.string,
    xl: PropTypes.string,
  }),
  className: PropTypes.string,
  menuClassName: PropTypes.string,
  brandProps: PropTypes.object,
  menuProps: PropTypes.object,
  toggleProps: PropTypes.object,
  searchProps: PropTypes.object,
  profileProps: PropTypes.object,
  containerProps: PropTypes.object,
  loaderProps: PropTypes.object,
  onToggle: PropTypes.func,
};

export default Navbar;