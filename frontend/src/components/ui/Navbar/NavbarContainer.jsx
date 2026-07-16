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

const CONTAINER_MOTION = {
  initial: { opacity: 0, y: -8 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
};

/* ---------------------------------- */
/* Component                          */
/* ---------------------------------- */

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

    // Filter out custom props before spreading to DOM element
    const { 
      onOpenChange, 
      onClose,
      onToggle,
      ...validDomProps 
    } = rest;

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

    const containerClasses = useMemo(
      () => getNavbarContainerClasses({ className: '' }),
      [],
    );

    const responsiveClasses = useMemo(
      () => (responsive ? resolveResponsiveClasses(responsive) : ''),
      [responsive],
    );

    const finalClasses = useMemo(
      () => mergeClasses(navbarClasses, responsiveClasses),
      [navbarClasses, responsiveClasses],
    );

    const motionProps = useMemo(() => {
      if (prefersReducedMotion) {
        return { initial: false, animate: true };
      }
      return CONTAINER_MOTION;
    }, [prefersReducedMotion]);

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
        {...validDomProps}
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
  children: PropTypes.node,
  variant: PropTypes.oneOf(['default', 'dark', 'primary', 'transparent', 'glass', 'gradient']),
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
  shadow: PropTypes.oneOf(['none', 'sm', 'md', 'lg', 'xl', '2xl']),
  position: PropTypes.oneOf(['static', 'fixed', 'sticky', 'absolute']),
  backdrop: PropTypes.oneOf(['none', 'sm', 'md', 'lg', 'xl']),
  collapsed: PropTypes.bool,
  transparent: PropTypes.bool,
  isOpen: PropTypes.bool,
  dark: PropTypes.bool,
  responsive: PropTypes.shape({
    xs: PropTypes.string,
    sm: PropTypes.string,
    md: PropTypes.string,
    lg: PropTypes.string,
    xl: PropTypes.string,
  }),
  className: PropTypes.string,
  role: PropTypes.string,
  'aria-label': PropTypes.string,
};

export default NavbarContainer;