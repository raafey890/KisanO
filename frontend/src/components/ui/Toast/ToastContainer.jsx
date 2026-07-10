/**
 * KisanO Design System — Toast Package
 * ToastContainer
 *
 * The container component that holds and positions multiple Toast components.
 * Handles stacking, positioning, and animation of toasts with proper
 * accessibility support.
 *
 * Single Responsibility: Render a positioned container for Toast components.
 * Does not manage individual toast state or business logic.
 *
 * @module components/ui/Toast/ToastContainer
 */

import { forwardRef, memo, useMemo } from 'react';
import PropTypes from 'prop-types';
import { motion, AnimatePresence } from 'framer-motion';

import {
  TOAST_DEFAULTS,
 
} from './toastVariants';
import {
  mergeClasses,
  resolveResponsiveClasses,
  getContainerPositionClasses,
} from './toastUtils';

/* ---------------------------------- */
/* Component-specific tokens          */
/* ---------------------------------- */

/** Motion variants for toast container animation. */
const CONTAINER_MOTION = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.95 },
  transition: { duration: 0.2, ease: [0.4, 0, 0.2, 1] },
};

/** Stack gap between toasts. */
const STACK_GAP = 'gap-3';

/* ---------------------------------- */
/* Component                          */
/* ---------------------------------- */

/**
 * ToastContainer – the container for Toast components.
 *
 * @component
 * @example
 * <ToastContainer position="top-right">
 *   <Toast variant="success" message="Success!" />
 *   <Toast variant="error" message="Error!" />
 * </ToastContainer>
 */
const ToastContainer = memo(
  forwardRef(function ToastContainer(
    {
      children,
      position = TOAST_DEFAULTS.position,
      className = '',
      responsive,
      role = 'region',
      'aria-label': ariaLabel = 'Notifications',
      ...rest
    },
    ref,
  ) {
    // Resolve position classes.
    const positionClasses = useMemo(
      () => getContainerPositionClasses(position),
      [position],
    );

    // Responsive overrides.
    const responsiveClasses = useMemo(
      () => (responsive ? resolveResponsiveClasses(responsive) : ''),
      [responsive],
    );

    // Base container classes.
    const containerClasses = useMemo(() => {
      const base = mergeClasses(
        positionClasses,
        'flex flex-col pointer-events-auto',
        STACK_GAP,
        className,
      );
      return mergeClasses(base, responsiveClasses);
    }, [positionClasses, className, responsiveClasses]);

    // Animation props.
    const motionProps = useMemo(
      () => ({
        initial: CONTAINER_MOTION.initial,
        animate: CONTAINER_MOTION.animate,
        exit: CONTAINER_MOTION.exit,
        transition: CONTAINER_MOTION.transition,
      }),
      [],
    );

    // Accessibility attributes.
    const ariaProps = useMemo(
      () => ({
        role,
        'aria-label': ariaLabel,
        'aria-live': 'polite',
        'aria-atomic': true,
      }),
      [role, ariaLabel],
    );

    return (
      <AnimatePresence initial={false} mode="popLayout">
        <motion.div
          ref={ref}
          className={containerClasses}
          {...motionProps}
          {...ariaProps}
          {...rest}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    );
  }),
);

ToastContainer.displayName = 'ToastContainer';

ToastContainer.propTypes = {
  /** Toast components to render inside the container. */
  children: PropTypes.node,
  /** Position of the toast container. */
  position: PropTypes.oneOf([
    'top-left',
    'top-center',
    'top-right',
    'bottom-left',
    'bottom-center',
    'bottom-right',
  ]),
  /** Additional CSS classes. */
  className: PropTypes.string,
  /** Responsive overrides. */
  responsive: PropTypes.shape({
    xs: PropTypes.string,
    sm: PropTypes.string,
    md: PropTypes.string,
    lg: PropTypes.string,
    xl: PropTypes.string,
  }),
  /** ARIA role. */
  role: PropTypes.string,
  /** Accessible label. */
  'aria-label': PropTypes.string,
};

export default ToastContainer;