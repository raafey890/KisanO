/**
 * KisanO Design System — Navbar Package
 * Navbar
 *
 * The main Navbar component that orchestrates all navbar subcomponents.
 * Provides a convenient API for rendering responsive navigation with
 * brand, menu items, search, user profile, and mobile menu support.
 *
 * Single Responsibility: Orchestrate Navbar subcomponents.
 * Does not contain business logic, helper functions, or duplicate styling.
 *
 * @module components/ui/Navbar/Navbar
 */

import { forwardRef, memo, useMemo, useState, useCallback, useEffect } from 'react';
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

/**
 * Navbar – the main navigation component.
 *
 * @component
 * @example
 * <Navbar
 *   brand={<NavbarBrand>Logo</NavbarBrand>}
 *   menu={<NavbarMenu>Items</NavbarMenu>}
 *   right={<NavbarProfile />}
 * />
 *
 * @example
 * <Navbar
 *   brand="My App"
 *   items={[
 *     { label: 'Home', href: '/' },
 *     { label: 'About', href: '/about' },
 *   ]}
 *   sticky
 *   dark
 * />
 */
const Navbar = memo(
  forwardRef(function Navbar(
    {
      children,
      brand,
      menu,
      right,
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
      containerClassName = '',
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

    // Handle toggle.
    const handleToggle = useCallback(() => {
      const newOpen = !isOpen;
      setIsOpen(newOpen);
      onToggle?.(newOpen);
    }, [isOpen, onToggle]);

    // Handle scroll detection.
    useEffect(() => {
      const handleScroll = () => {
        setIsScrolled(window.scrollY > 10);
      };

      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Resolve defaults.
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

    // Determine if dark mode is active.
    const isDark = dark || resolved.variant === 'dark' || resolved.variant === 'primary';

    // Determine effective position.
    const effectivePosition = useMemo(() => {
      if (sticky) return 'sticky';
      if (fixed) return 'fixed';
      return resolved.position;
    }, [sticky, fixed, resolved.position]);

    // Container props.
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
        ...rest,
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
        rest,
      ],
    );

    // Brand props.
    const brandPropsMerged = useMemo(
      () => ({
        size: resolved.size,
        disabled: resolved.collapsed,
        className: '',
        ...brandProps,
      }),
      [resolved.size, resolved.collapsed, brandProps],
    );

    // Menu props.
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

    // Toggle props.
    const togglePropsMerged = useMemo(
      () => ({
        size: resolved.size,
        open: isOpen,
        disabled: resolved.collapsed || loading,
        onClick: handleToggle,
        className: '',
        ...toggleProps,
      }),
      [resolved.size, isOpen, resolved.collapsed, loading, handleToggle, toggleProps],
    );

    // Loader props.
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

    // Render brand content.
    const renderBrand = useMemo(() => {
      if (brand) return brand;
      if (logo || brandText) {
        return (
          <NavbarBrand href={logoHref} {...brandPropsMerged}>
            {logo && (
              <img src={logo} alt={logoAlt} className="h-8 w-auto" />
            )}
            {brandText}
          </NavbarBrand>
        );
      }
      return null;
    }, [brand, logo, logoAlt, logoHref, brandText, brandPropsMerged]);

    // Render menu items.
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

    // Render right side content.
    const renderRight = useMemo(() => {
      if (right) return right;
      return (
        <div className="flex items-center gap-2">
          {search && <NavbarSearch {...searchProps} />}
          {profile && <NavbarProfile {...profileProps} />}
          {toggle && <NavbarToggle {...togglePropsMerged} />}
        </div>
      );
    }, [right, search, searchProps, profile, profileProps, toggle, togglePropsMerged]);

    // Show loader.
    const showLoader = loading;

    return (
      <NavbarContainer ref={ref} {...containerPropsMerged}>
        <div className="flex items-center justify-between w-full">
          {/* Left: Brand */}
          <div className="flex items-center gap-4">
            {renderBrand}
          </div>

          {/* Center: Menu (desktop) */}
          {!resolved.collapsed && renderMenuItems}

          {/* Right: Search, Profile, Toggle */}
          <div className="flex items-center gap-2">
            {showLoader ? (
              <NavbarLoader {...loaderPropsMerged} />
            ) : (
              renderRight
            )}
          </div>
        </div>

        {/* Mobile menu */}
        {resolved.collapsed && isOpen && (
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            {showLoader ? (
              <NavbarLoader {...loaderPropsMerged} />
            ) : (
              renderMenuItems
            )}
          </div>
        )}

        {children}
      </NavbarContainer>
    );
  }),
);

Navbar.displayName = 'Navbar';

Navbar.propTypes = {
  /** Navbar children. */
  children: PropTypes.node,
  /** Brand element. */
  brand: PropTypes.node,
  /** Menu element. */
  menu: PropTypes.node,
  /** Right side content. */
  right: PropTypes.node,
  /** Search element. */
  search: PropTypes.node,
  /** Profile element. */
  profile: PropTypes.node,
  /** Toggle element. */
  toggle: PropTypes.node,
  /** Menu items array. */
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
  /** Logo image src. */
  logo: PropTypes.string,
  /** Logo alt text. */
  logoAlt: PropTypes.string,
  /** Logo href. */
  logoHref: PropTypes.string,
  /** Brand text. */
  brandText: PropTypes.node,
  /** Visual variant. */
  variant: PropTypes.oneOf(['default', 'dark', 'primary', 'transparent', 'glass', 'gradient']),
  /** Size preset. */
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
  /** Shadow level. */
  shadow: PropTypes.oneOf(['none', 'sm', 'md', 'lg', 'xl', '2xl']),
  /** Position. */
  position: PropTypes.oneOf(['static', 'fixed', 'sticky', 'absolute']),
  /** Backdrop effect. */
  backdrop: PropTypes.oneOf(['none', 'sm', 'md', 'lg', 'xl']),
  /** Sticky mode. */
  sticky: PropTypes.bool,
  /** Fixed mode. */
  fixed: PropTypes.bool,
  /** Transparent mode. */
  transparent: PropTypes.bool,
  /** Dark mode. */
  dark: PropTypes.bool,
  /** Loading state. */
  loading: PropTypes.bool,
  /** Collapsed state (mobile menu). */
  collapsed: PropTypes.bool,
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
  /** Additional CSS classes for the container wrapper. */
  containerClassName: PropTypes.string,
  /** Additional CSS classes for the menu. */
  menuClassName: PropTypes.string,
  /** Additional props for NavbarBrand. */
  brandProps: PropTypes.object,
  /** Additional props for NavbarMenu. */
  menuProps: PropTypes.object,
  /** Additional props for NavbarToggle. */
  toggleProps: PropTypes.object,
  /** Additional props for NavbarSearch. */
  searchProps: PropTypes.object,
  /** Additional props for NavbarProfile. */
  profileProps: PropTypes.object,
  /** Additional props for NavbarContainer. */
  containerProps: PropTypes.object,
  /** Additional props for NavbarLoader. */
  loaderProps: PropTypes.object,
  /** Callback when toggle is clicked. */
  onToggle: PropTypes.func,
};

export default Navbar;