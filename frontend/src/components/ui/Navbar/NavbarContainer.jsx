/**
 * KisanO Design System — Navbar Package
 * NavbarContainer
 *
 * The container component that wraps the navbar and handles layout,
 * positioning, and accessibility attributes.
 *
 * Single Responsibility: Render the navbar container with layout and styling.
 * Does not manage navbar state or business logic.
 *
 * @module components/ui/Navbar/NavbarContainer
 */

import { forwardRef, memo, useMemo } from 'react';
import PropTypes from 'prop-types';
import { motion, useReducedMotion } from 'framer-motion';

import {
  NAVBAR_DEFAULTS,
} from './navbarVariants';
import {
  mergeClasses,
  resolveResponsiveClasses,
  resolveDefaultProps,
  getNavbarClasses,
  getNavbarContainerClasses,
} from './navbarUtils';

/* ---------------------------------- */
/* Component-specific tokens          */
/* ---------------------------------- */

/** Motion variants for container animation. */
const CONTAINER_MOTION = {
  initial: { opacity: 0, y: -8 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
};

/* ---------------------------------- */
/* Component                          */
/* ---------------------------------- */

/**
 * NavbarContainer – the main navbar wrapper with layout and styling.
 *
 * @component
 * @example
 * <NavbarContainer variant="default" size="md">
 *   <NavbarBrand>Logo</NavbarBrand>
 *   <NavbarMenu>Items</NavbarMenu>
 * </NavbarContainer>
 */
const NavbarContainer = memo(
  forwardRef(function NavbarContainer(
    {
      children,
      variant = NAVBAR_DEFAULTS.variant,
      size = NAVBAR_DEFAULTS.size,
      shadow = NAVBAR_DEFAULTS.shadow,
      position = NAVBAR_DEFAULTS.position,
      backdrop = NAVBAR_DEFAULTS.backdrop,
      collapsed = false,
      transparent = false,
      isOpen = false,
      dark = false,
      responsive,
      className = '',
      role = 'navigation',
      'aria-label': ariaLabel = 'Navigation',
      ...rest
    },
    ref,
  ) {
    const prefersReducedMotion = useReducedMotion();

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

    // Navbar classes.
    const navbarClasses = useMemo(
      () =>
        getNavbarClasses({
          variant: resolved.variant,
          size: resolved.size,
          shadow: resolved.shadow,
          position: resolved.position,
          backdrop: resolved.backdrop,
          className,
          collapsed: resolved.collapsed,
          transparent: resolved.transparent,
        }),
      [
        resolved.variant,
        resolved.size,
        resolved.shadow,
        resolved.position,
        resolved.backdrop,
        className,
        resolved.collapsed,
        resolved.transparent,
      ],
    );

    // Container classes.
    const containerClasses = useMemo(
      () => getNavbarContainerClasses({ className: '' }),
      [],
    );

    // Responsive overrides.
    const responsiveClasses = useMemo(
      () => (responsive ? resolveResponsiveClasses(responsive) : ''),
      [responsive],
    );

    const finalClasses = useMemo(
      () => mergeClasses(navbarClasses, responsiveClasses),
      [navbarClasses, responsiveClasses],
    );

    // Motion props - respect reduced motion.
    const motionProps = useMemo(() => {
      if (prefersReducedMotion) {
        return { initial: false, animate: true };
      }
      return CONTAINER_MOTION;
    }, [prefersReducedMotion]);

    // Accessibility attributes.
    const ariaProps = useMemo(
      () => ({
        role,
        'aria-label': ariaLabel,
        'aria-expanded': isOpen || undefined,
        'data-dark': dark || undefined,
        'data-open': isOpen || undefined,
        'data-collapsed': resolved.collapsed || undefined,
        'data-transparent': resolved.transparent || undefined,
      }),
      [role, ariaLabel, isOpen, dark, resolved.collapsed, resolved.transparent],
    );

    return (
      <motion.nav
        ref={ref}
        className={finalClasses}
        {...motionProps}
        {...ariaProps}
        {...rest}
      >
        <div className={containerClasses}>
          {children}
        </div>
      </motion.nav>
    );
  }),
);

NavbarContainer.displayName = 'NavbarContainer';

NavbarContainer.propTypes = {
  /** Navbar content (Brand, Menu, etc.). */
  children: PropTypes.node,
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
  /** Collapsed state (mobile menu). */
  collapsed: PropTypes.bool,
  /** Transparent mode. */
  transparent: PropTypes.bool,
  /** Whether the menu is open. */
  isOpen: PropTypes.bool,
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

export default NavbarContainer;