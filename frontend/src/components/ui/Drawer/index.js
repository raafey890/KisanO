/**
 * KisanO Design System — Drawer Package
 * Public API entry point.
 *
 * Exports all components, utilities, and design tokens for the Drawer package.
 * Supports tree shaking and named imports.
 *
 * @module components/ui/Drawer
 */

/* ---------------------------------- */
/* Re-export all design tokens        */
/* ---------------------------------- */

export {
  DRAWER_VARIANTS,
  DRAWER_SIZES,
  DRAWER_RADIUS,
  DRAWER_SHADOWS,
  DRAWER_POSITIONS,
  DRAWER_POSITION_TRANSFORMS,
  DRAWER_ANIMATIONS,
  DRAWER_OVERLAYS,
  DRAWER_DEFAULTS,
  getDrawerVariant,
  getDrawerSize,
  getDrawerRadius,
  getDrawerShadow,
  getDrawerPosition,
  getDrawerPositionTransform,
  getDrawerAnimation,
  getDrawerOverlay,
} from './drawerVariants';

/* ---------------------------------- */
/* Re-export utilities                */
/* ---------------------------------- */

export {
  mergeClasses,
  resolveResponsiveClasses,
  resolveDefaultProps,
  getDrawerClasses,
  getDrawerContainerClasses,
  getDrawerOverlayClasses,
  getDrawerContentClasses,
  getDrawerHeaderClasses,
  getDrawerBodyClasses,
  getDrawerFooterClasses,
  getDrawerCloseButtonClasses,
  isValidVariant,
  isValidSize,
  isValidRadius,
  isValidShadow,
  isValidPosition,
  isValidAnimation,
  isValidOverlay,
  isInteractiveDrawer,
  getAccessibilityHelpers,
} from './drawerUtils';

/* ---------------------------------- */
/* Re-export components               */
/* ---------------------------------- */

export { default as Drawer } from './Drawer';
export { default as DrawerContainer } from './DrawerContainer';
export { default as DrawerHeader } from './DrawerHeader';
export { default as DrawerBody } from './DrawerBody';
export { default as DrawerFooter } from './DrawerFooter';
export { default as DrawerCloseButton } from './DrawerCloseButton';
export { default as DrawerLoader } from './DrawerLoader';

/* ---------------------------------- */
/* Default export                     */
/* ---------------------------------- */

export { default } from './Drawer';