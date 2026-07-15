/**
 * KisanO Design System — Accordion Package
 * Public API entry point.
 *
 * Exports all components, utilities, and design tokens for the Accordion package.
 * Supports tree shaking and named imports.
 *
 * @module components/ui/Accordion
 */

/* ---------------------------------- */
/* Re-export all design tokens        */
/* ---------------------------------- */

export {
  ACCORDION_VARIANTS,
  ACCORDION_SIZES,
  ACCORDION_RADIUS,
  ACCORDION_SHADOWS,
  ACCORDION_ANIMATIONS,
  ACCORDION_DEFAULTS,
  getAccordionVariant,
  getAccordionSize,
  getAccordionRadius,
  getAccordionShadow,
  getAccordionAnimation,
} from './accordionVariants';

/* ---------------------------------- */
/* Re-export utilities                */
/* ---------------------------------- */

export {
  mergeClasses,
  resolveResponsiveClasses,
  resolveDefaultProps,
  getAccordionClasses,
  getAccordionContainerClasses,
  getAccordionItemClasses,
  getAccordionHeaderClasses,
  getAccordionContentClasses,
  getAccordionIconClasses,
  isValidVariant,
  isValidSize,
  isValidRadius,
  isValidShadow,
  getAccessibilityHelpers,
} from './accordionUtils';

/* ---------------------------------- */
/* Re-export components               */
/* ---------------------------------- */

export { default as Accordion } from './Accordion';
export { default as AccordionContainer } from './AccordionContainer';
export { default as AccordionItem } from './AccordionItem';
export { default as AccordionHeader } from './AccordionHeader';
export { default as AccordionContent } from './AccordionContent';
export { default as AccordionIcon } from './AccordionIcon';
export { default as AccordionLoader } from './AccordionLoader';

/* ---------------------------------- */
/* Default export                     */
/* ---------------------------------- */

export { default } from './Accordion';