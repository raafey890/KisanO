/**
 * KisanO Design System — Alert Package
 * Public API entry point.
 *
 * Exports all components, utilities, and design tokens for the Alert package.
 * Supports tree shaking and named imports.
 *
 * @module components/ui/Alert
 */

/* ---------------------------------- */
/* Re-export all design tokens        */
/* ---------------------------------- */

export {
  ALERT_VARIANTS,
  ALERT_SIZES,
  ALERT_RADIUS,
  ALERT_SHADOWS,
  ALERT_ICONS,
  ALERT_ANIMATIONS,
  ALERT_DEFAULTS,
  getAlertVariant,
  getAlertSize,
  getAlertRadius,
  getAlertShadow,
  getAlertIcon,
  getAlertAnimation,
} from './alertVariants';

/* ---------------------------------- */
/* Re-export utilities                */
/* ---------------------------------- */

export {
  mergeClasses,
  resolveResponsiveClasses,
  resolveDefaultProps,
  getAlertClasses,
  getAlertContainerClasses,
  getAlertHeaderClasses,
  getAlertBodyClasses,
  getAlertActionsClasses,
  getAlertIconClasses,
  getAlertCloseButtonClasses,
  isValidVariant,
  isValidSize,
  isValidRadius,
  isValidShadow,
  isValidAnimation,
  isInteractiveAlert,
  getAccessibilityHelpers,
} from './alertUtils';

/* ---------------------------------- */
/* Re-export components               */
/* ---------------------------------- */

export { default as Alert } from './Alert';
export { default as AlertContainer } from './AlertContainer';
export { default as AlertHeader } from './AlertHeader';
export { default as AlertBody } from './AlertBody';
export { default as AlertActions } from './AlertActions';
export { default as AlertIcon } from './AlertIcon';
export { default as AlertCloseButton } from './AlertCloseButton';
export { default as AlertLoader } from './AlertLoader';

/* ---------------------------------- */
/* Default export                     */
/* ---------------------------------- */

export { default } from './Alert';