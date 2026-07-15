/**
 * KisanO Design System — Tabs Package
 * Public API entry point.
 *
 * Exports all components, utilities, and design tokens for the Tabs package.
 * Supports tree shaking and named imports.
 *
 * @module components/ui/Tabs
 */

/* ---------------------------------- */
/* Re-export all design tokens        */
/* ---------------------------------- */

export {
  TABS_VARIANTS,
  TABS_SIZES,
  TABS_RADIUS,
  TABS_INDICATORS,
  TABS_DEFAULTS,
  getTabsVariant,
  getTabsSize,
  getTabsRadius,
  getTabsIndicator,
} from './tabsVariants';

/* ---------------------------------- */
/* Re-export utilities                */
/* ---------------------------------- */

export {
  mergeClasses,
  resolveResponsiveClasses,
  resolveDefaultProps,
  getTabsClasses,
  getTabsContainerClasses,
  getTabsListClasses,
  getTabsTriggerClasses,
  getTabsContentClasses,
  getTabsIndicatorClasses,
  isValidVariant,
  isValidSize,
  isValidRadius,
  getAccessibilityHelpers,
} from './tabsUtils';

/* ---------------------------------- */
/* Re-export components               */
/* ---------------------------------- */

export { default as Tabs } from './Tabs';
export { default as TabsContainer } from './TabsContainer';
export { default as TabsList } from './TabsList';
export { default as TabsTrigger } from './TabsTrigger';
export { default as TabsContent } from './TabsContent';
export { default as TabsIndicator } from './TabsIndicator';
export { default as TabsLoader } from './TabsLoader';

/* ---------------------------------- */
/* Default export                     */
/* ---------------------------------- */

export { default } from './Tabs';