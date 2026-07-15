/**
 * KisanO Design System — Showcase Package
 * Public API entry point.
 *
 * Exports all components, utilities, and design tokens for the Showcase package.
 * Supports tree shaking and named imports.
 *
 * @module components/ui/Showcase
 */

/* ---------------------------------- */
/* Re-export all design tokens        */
/* ---------------------------------- */

export {
  SHOWCASE_VARIANTS,
  SHOWCASE_SIZES,
  SHOWCASE_LAYOUTS,
  SHOWCASE_DEFAULTS,
  getShowcaseVariant,
  getShowcaseSize,
  getShowcaseLayout,
} from './showcaseVariants';

/* ---------------------------------- */
/* Re-export utilities                */
/* ---------------------------------- */

export {
  mergeClasses,
  resolveResponsiveClasses,
  resolveDefaultProps,
  getShowcaseClasses,
  getShowcaseContainerClasses,
  getShowcaseSectionClasses,
  getShowcaseCardClasses,
  getShowcaseHeaderClasses,
  isValidVariant,
  isValidSize,
  isValidLayout,
  getAccessibilityHelpers,
} from './showcaseUtils';

/* ---------------------------------- */
/* Re-export components               */
/* ---------------------------------- */

export { default as ComponentShowcase } from './ComponentShowcase';
export { default as ShowcaseContainer } from './ShowcaseContainer';
export { default as ShowcaseSection } from './ShowcaseSection';
export { default as ShowcaseCard } from './ShowcaseCard';
export { default as ShowcaseHeader } from './ShowcaseHeader';
export { default as ShowcaseSidebar } from './ShowcaseSidebar';
export { default as ShowcaseLoader } from './ShowcaseLoader';

/* ---------------------------------- */
/* Default export                     */
/* ---------------------------------- */

export { default } from './ComponentShowcase';