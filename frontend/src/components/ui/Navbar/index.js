/**
 * KisanO Design System — Navbar Package
 * Public API entry point.
 *
 * Exports all components, utilities, and design tokens for the Navbar package.
 * Supports tree shaking and named imports.
 *
 * @module components/ui/Navbar
 */

/* ---------------------------------- */
/* Re-export all design tokens        */
/* ---------------------------------- */

export {
  NAVBAR_VARIANTS,
  NAVBAR_SIZES,
  NAVBAR_SHADOWS,
  NAVBAR_POSITIONS,
  NAVBAR_BACKDROPS,
  NAVBAR_DEFAULTS,
  getNavbarVariant,
  getNavbarSize,
  getNavbarShadow,
  getNavbarPosition,
  getNavbarBackdrop,
} from './navbarVariants';

/* ---------------------------------- */
/* Re-export utilities                */
/* ---------------------------------- */

export {
  mergeClasses,
  resolveResponsiveClasses,
  resolveDefaultProps,
  getNavbarClasses,
  getNavbarContainerClasses,
  getNavbarBrandClasses,
  getNavbarMenuClasses,
  getNavbarItemClasses,
  getNavbarToggleClasses,
  isValidVariant,
  isValidSize,
  isValidShadow,
  isValidPosition,
  getAccessibilityHelpers,
} from './navbarUtils';

/* ---------------------------------- */
/* Re-export components               */
/* ---------------------------------- */

export { default as Navbar } from './Navbar';
export { default as NavbarContainer } from './NavbarContainer';
export { default as NavbarBrand } from './NavbarBrand';
export { default as NavbarMenu } from './NavbarMenu';
export { default as NavbarItem } from './NavbarItem';
export { default as NavbarToggle } from './NavbarToggle';
export { default as NavbarSearch } from './NavbarSearch';
export { default as NavbarProfile } from './NavbarProfile';
export { default as NavbarLoader } from './NavbarLoader';

/* ---------------------------------- */
/* Default export                     */
/* ---------------------------------- */

export { default } from './Navbar';