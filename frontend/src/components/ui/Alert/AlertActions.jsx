/**
 * KisanO Design System — Alert Package
 * AlertActions
 *
 * The actions section of an Alert. Renders action buttons or other
 * interactive elements with flexible layout and spacing.
 *
 * Single Responsibility: Render the alert actions area.
 * Does not manage alert state, icons, or body content.
 *
 * @module components/ui/Alert/AlertActions
 */

import { forwardRef, memo, useMemo } from 'react';
import PropTypes from 'prop-types';
import { motion, useReducedMotion } from 'framer-motion';

import {
  ALERT_DEFAULTS,
  getAlertSize,
} from './alertVariants';
import {
  mergeClasses,
  resolveResponsiveClasses,
  getAlertActionsClasses,
} from './alertUtils';

/* ---------------------------------- */
/* Component-specific tokens          */
/* ---------------------------------- */

/** Alignment mapping. */
const ALIGNMENT_MAP = {
  left: 'justify-start',
  center: 'justify-center',
  right: 'justify-end',
  'space-between': 'justify-between',
  'space-around': 'justify-around',
};

/** Default alignment when not provided. */
const DEFAULT_ALIGN = 'left';

/** Motion variants for actions animation. */
const ACTIONS_MOTION = {
  initial: { opacity: 0, y: 4 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.15, ease: [0.4, 0, 0.2, 1] },
};

/* ---------------------------------- */
/* Component                          */
/* ---------------------------------- */

/**
 * AlertActions – the action area of an alert.
 *
 * @component
 * @example
 * <AlertActions align="right">
 *   <Button variant="outline">Cancel</Button>
 *   <Button variant="primary">Confirm</Button>
 * </AlertActions>
 */
const AlertActions = memo(
  forwardRef(function AlertActions(
    {
      children,
      size = ALERT_DEFAULTS.size,
      align = DEFAULT_ALIGN,
      disabled = false,
      loading = false,
      responsive,
      className = '',
      role = 'group',
      'aria-label': ariaLabel = 'Alert actions',
      ...rest
    },
    ref,
  ) {
    const prefersReducedMotion = useReducedMotion();

    // Get size configuration.
    const sizeConfig = useMemo(
      () => getAlertSize(size),
      [size],
    );

    // Resolve alignment classes.
    const alignClasses = useMemo(
      () => ALIGNMENT_MAP[align] || ALIGNMENT_MAP[DEFAULT_ALIGN],
      [align],
    );

    // Responsive overrides.
    const responsiveClasses = useMemo(
      () => (responsive ? resolveResponsiveClasses(responsive) : ''),
      [responsive],
    );

    // Actions classes.
    const actionsClasses = useMemo(() => {
      const base = getAlertActionsClasses({
        className,
        disabled,
      });
      return mergeClasses(base, responsiveClasses);
    }, [className, disabled, responsiveClasses]);

    // Content wrapper classes with alignment.
    const contentClasses = useMemo(() => {
      const base = mergeClasses(
        'flex flex-wrap items-center gap-2',
        alignClasses,
        disabled && 'opacity-50',
        loading && 'opacity-70',
        sizeConfig.gap,
      );
      return base;
    }, [alignClasses, disabled, loading, sizeConfig.gap]);

    // Motion props - respect reduced motion.
    const motionProps = useMemo(() => {
      if (prefersReducedMotion) {
        return { initial: false, animate: true };
      }
      return ACTIONS_MOTION;
    }, [prefersReducedMotion]);

    // Accessibility attributes.
    const ariaProps = useMemo(
      () => ({
        role,
        'aria-label': ariaLabel,
        'aria-disabled': disabled || undefined,
        'aria-busy': loading || undefined,
      }),
      [role, ariaLabel, disabled, loading],
    );

    // If no children, render nothing.
    if (!children) {
      return null;
    }

    return (
      <motion.div
        ref={ref}
        className={actionsClasses}
        {...motionProps}
        {...ariaProps}
        {...rest}
      >
        <div className={contentClasses}>
          {children}
        </div>
      </motion.div>
    );
  }),
);

AlertActions.displayName = 'AlertActions';

AlertActions.propTypes = {
  /** Action elements (buttons, links, etc.). */
  children: PropTypes.node,
  /** Alert size (affects gap spacing). */
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
  /** Alignment of the actions. */
  align: PropTypes.oneOf(['left', 'center', 'right', 'space-between', 'space-around']),
  /** Disabled state. */
  disabled: PropTypes.bool,
  /** Loading state. */
  loading: PropTypes.bool,
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

export default AlertActions;