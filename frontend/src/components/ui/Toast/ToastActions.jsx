/**
 * KisanO Design System — Toast Package
 * ToastActions
 *
 * The action area of a Toast notification. Renders buttons or other
 * interactive elements with flexible layout, alignment, and spacing.
 *
 * Single Responsibility: Render the toast actions area.
 * Does not manage toast state, timers, progress bars, or close buttons.
 *
 * @module components/ui/Toast/ToastActions
 */

import { forwardRef, memo, useMemo } from 'react';
import PropTypes from 'prop-types';
import { motion, useReducedMotion } from 'framer-motion';

import {
  TOAST_DEFAULTS,
  getToastSize,
} from './toastVariants';
import {
  mergeClasses,
  resolveResponsiveClasses,
} from './toastUtils';

/* ---------------------------------- */
/* Component-specific tokens          */
/* ---------------------------------- */

/** Alignment mapping for horizontal layout. */
const ALIGNMENT_MAP = {
  start: 'justify-start',
  center: 'justify-center',
  end: 'justify-end',
  'space-between': 'justify-between',
  'space-around': 'justify-around',
};

/** Alignment mapping for vertical layout. */
const VERTICAL_ALIGN_MAP = {
  start: 'items-start',
  center: 'items-center',
  end: 'items-end',
  'space-between': 'items-stretch',
  'space-around': 'items-stretch',
};

/** Default spacing between action items. */
const ACTION_GAP = 'gap-2';

/** Motion variants. */
const ACTION_MOTION = {
  initial: { opacity: 0, y: 4 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.2, ease: [0.4, 0, 0.2, 1] },
};

/* ---------------------------------- */
/* Component                          */
/* ---------------------------------- */

/**
 * ToastActions – the action area of a toast notification.
 *
 * @component
 * @example
 * <ToastActions align="end" direction="row">
 *   <Button variant="outline">Cancel</Button>
 *   <Button variant="primary">Confirm</Button>
 * </ToastActions>
 */
const ToastActions = memo(
  forwardRef(function ToastActions(
    {
      children,
      size = TOAST_DEFAULTS.size,
      align = 'end',
      direction = 'row',
      disabled = false,
      loading = false,
      responsive,
      className = '',
      role = 'group',
      'aria-label': ariaLabel = 'Toast actions',
      ...rest
    },
    ref,
  ) {
    const prefersReducedMotion = useReducedMotion();

    // Get size configuration.
    const sizeConfig = useMemo(
      () => getToastSize(size),
      [size],
    );

    // Resolve alignment based on direction.
    const alignClasses = useMemo(() => {
      if (direction === 'column') {
        return VERTICAL_ALIGN_MAP[align] || VERTICAL_ALIGN_MAP.start;
      }
      return ALIGNMENT_MAP[align] || ALIGNMENT_MAP.end;
    }, [align, direction]);

    // Direction class.
    const directionClass = useMemo(
      () => (direction === 'vertical' ? 'flex-col' : 'flex-row'),
      [direction],
    );

    // Responsive overrides.
    const responsiveClasses = useMemo(
      () => (responsive ? resolveResponsiveClasses(responsive) : ''),
      [responsive],
    );

    // Base actions classes.
    const actionsClasses = useMemo(() => {
      const base = mergeClasses(
        'flex w-full',
        directionClass,
        alignClasses,
        ACTION_GAP,
        sizeConfig.gap,
        disabled && 'opacity-50 cursor-not-allowed pointer-events-none',
        loading && 'opacity-70',
        className,
      );
      return mergeClasses(base, responsiveClasses);
    }, [
      directionClass,
      alignClasses,
      sizeConfig.gap,
      disabled,
      loading,
      className,
      responsiveClasses,
    ]);

    // Motion props - respect reduced motion.
    const motionProps = useMemo(() => {
      if (prefersReducedMotion) {
        return { initial: false, animate: true };
      }
      return ACTION_MOTION;
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
        {children}
      </motion.div>
    );
  }),
);

ToastActions.displayName = 'ToastActions';

ToastActions.propTypes = {
  /** Action elements (buttons, links, etc.). */
  children: PropTypes.node,
  /** Size preset. */
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
  /** Alignment of the actions. */
  align: PropTypes.oneOf(['start', 'center', 'end', 'space-between', 'space-around']),
  /** Layout direction. */
  direction: PropTypes.oneOf(['row', 'column']),
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

export default ToastActions;