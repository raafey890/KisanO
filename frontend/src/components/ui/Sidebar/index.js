/**
 * KisanO Design System — Sidebar Package
 * Public API entry point.
 *
 * Exports all components, utilities, and design tokens for the Sidebar package.
 * Supports tree shaking and named imports.
 *
 * @module components/ui/Sidebar
 */

/* ---------------------------------- */
/* Re-export all design tokens        */
/* ---------------------------------- */

export {
  SIDEBAR_VARIANTS,
  SIDEBAR_SIZES,
  SIDEBAR_WIDTHS,
  SIDEBAR_SHADOWS,
  SIDEBAR_POSITIONS,
  SIDEBAR_DEFAULTS,
  getSidebarVariant,
  getSidebarSize,
  getSidebarWidth,
  getSidebarShadow,
  getSidebarPosition,
} from './sidebarVariants';

/* ---------------------------------- */
/* Re-export utilities                */
/* ---------------------------------- */

export {
  mergeClasses,
  resolveResponsiveClasses,
  resolveDefaultProps,
  getSidebarClasses,
  getSidebarContainerClasses,
  getSidebarHeaderClasses,
  getSidebarContentClasses,
  getSidebarItemClasses,
  getSidebarFooterClasses,
  isValidVariant,
  isValidSize,
  isValidWidth,
  getAccessibilityHelpers,
} from './sidebarUtils';

/* ---------------------------------- */
/* Re-export components               */
/* ---------------------------------- */

export { default as Sidebar } from './Sidebar';
export { default as SidebarContainer } from './SidebarContainer';
export { default as SidebarHeader } from './SidebarHeader';
export { default as SidebarContent } from './SidebarContent';
export { default as SidebarItem } from './SidebarItem';
export { default as SidebarGroup } from './SidebarGroup';
export { default as SidebarFooter } from './SidebarFooter';
export { default as SidebarToggle } from './SidebarToggle';
export { default as SidebarLoader } from './SidebarLoader';

/* ---------------------------------- */
/* Default export                     */
/* ---------------------------------- */

export { default } from './Sidebar';