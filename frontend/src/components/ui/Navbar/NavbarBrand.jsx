/**
 * KisanO Design System — Navbar Package
 * NavbarBrand
 *
 * The brand component for the navbar. Renders the logo and/or brand name
 * with proper accessibility and responsive support.
 *
 * Single Responsibility: Render the navbar brand with logo and text.
 * Does not manage navbar state or menu logic.
 *
 * @module components/ui/Navbar/NavbarBrand
 */

import { forwardRef, memo, useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';

import {
  NAVBAR_DEFAULTS,
} from './navbarVariants';
import {
  mergeClasses,
  resolveResponsiveClasses,
  getNavbarBrandClasses,
} from './navbarUtils';

/* ---------------------------------- */
/* Component                          */
/* ---------------------------------- */

/**
 * NavbarBrand – the brand section of a navbar.
 *
 * @component
 * @example
 * <NavbarBrand href="/" logo="/logo.png" brandText="My App" />
 *
 * @example
 * <NavbarBrand>
 *   <Logo />
 *   <span>My App</span>
 * </NavbarBrand>
 */
const NavbarBrand = memo(
  forwardRef(function NavbarBrand(
    {
      children,
      href = '/',
      logo,
      logoAlt = 'Logo',
      brandText,
      size = NAVBAR_DEFAULTS.size,
      disabled = false,
      onClick,
      responsive,
      className = '',
      role = 'link',
      'aria-label': ariaLabel,
      ...rest
    },
    ref,
  ) {
    // Brand classes.
    const brandClasses = useMemo(
      () =>
        getNavbarBrandClasses({
          size,
          className,
          disabled,
        }),
      [size, className, disabled],
    );

    // Responsive overrides.
    const responsiveClasses = useMemo(
      () => (responsive ? resolveResponsiveClasses(responsive) : ''),
      [responsive],
    );

    const finalClasses = useMemo(
      () => mergeClasses(brandClasses, responsiveClasses),
      [brandClasses, responsiveClasses],
    );

    // Handle click.
    const handleClick = useCallback(
      (event) => {
        if (disabled) return;
        onClick?.(event);
      },
      [disabled, onClick],
    );

    // Accessibility attributes.
    const ariaProps = useMemo(
      () => ({
        role,
        'aria-label': ariaLabel || brandText || 'Brand',
        'aria-disabled': disabled || undefined,
      }),
      [role, ariaLabel, brandText, disabled],
    );

    // Render content.
    const content = (
      <>
        {logo && (
          <img
            src={logo}
            alt={logoAlt}
            className="h-8 w-auto"
          />
        )}
        {brandText && (
          <span className="font-semibold">{brandText}</span>
        )}
        {children}
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

    // Otherwise, render as div.
    return (
      <div
        ref={ref}
        className={finalClasses}
        onClick={handleClick}
        {...ariaProps}
        {...rest}
      >
        {content}
      </div>
    );
  }),
);

NavbarBrand.displayName = 'NavbarBrand';

NavbarBrand.propTypes = {
  /** Brand content (custom). */
  children: PropTypes.node,
  /** Link href. */
  href: PropTypes.string,
  /** Logo image src. */
  logo: PropTypes.string,
  /** Logo alt text. */
  logoAlt: PropTypes.string,
  /** Brand text. */
  brandText: PropTypes.node,
  /** Size preset. */
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
  /** Disabled state. */
  disabled: PropTypes.bool,
  /** Click handler. */
  onClick: PropTypes.func,
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

export default NavbarBrand;