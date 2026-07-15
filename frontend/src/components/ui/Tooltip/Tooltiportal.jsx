/**
 * KisanO Design System — Tooltip Package
 * TooltipPortal
 *
 * A portal component that renders tooltip content outside the DOM hierarchy
 * of the trigger element. Handles mounting, unmounting, and portal cleanup.
 *
 * Single Responsibility: Render tooltip content via React Portal.
 * Does not handle positioning, triggers, or tooltip state.
 *
 * @module components/ui/Tooltip/TooltipPortal
 */

import { forwardRef, memo, useMemo, useEffect, useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';


import {
  mergeClasses,
  resolveResponsiveClasses,
} from './tooltipUtils';

/* ---------------------------------- */
/* Component-specific tokens          */
/* ---------------------------------- */

/** Motion variants for portal entrance/exit. */
const PORTAL_MOTION = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.95 },
  transition: { duration: 0.15, ease: [0.4, 0, 0.2, 1] },
};

/** Default portal container ID. */
const DEFAULT_PORTAL_ID = 'tooltip-portal';

/* ---------------------------------- */
/* Component                          */
/* ---------------------------------- */

/**
 * TooltipPortal – a portal for tooltip content.
 *
 * @component
 * @example
 * <TooltipPortal open={isOpen} containerId="custom-portal">
 *   <div>Tooltip content</div>
 * </TooltipPortal>
 */
const TooltipPortal = memo(
  forwardRef(function TooltipPortal(
    {
      children,
      open = false,
      containerId = DEFAULT_PORTAL_ID,
      container,
      disabled = false,
      animated = true,
      responsive,
      className = '',
      role = 'tooltip',
      'aria-label': ariaLabel,
      ...rest
    },
    ref,
  ) {
    const prefersReducedMotion = useReducedMotion();
    const [portalContainer, setPortalContainer] = useState(null);
  

    // Determine if animation should be applied.
    const shouldAnimate = animated && !prefersReducedMotion && !disabled;

    // Motion props.
    const motionProps = useMemo(() => {
      if (!shouldAnimate) {
        return { initial: false, animate: true, exit: false };
      }
      return PORTAL_MOTION;
    }, [shouldAnimate]);

    // Create or get portal container.
    useEffect(() => {
      if (container) {
        setPortalContainer(container);
        return;
      }

      // Get or create portal container in DOM.
      let portalElement = document.getElementById(containerId);
      if (!portalElement) {
        portalElement = document.createElement('div');
        portalElement.id = containerId;
        portalElement.setAttribute('aria-hidden', 'true');
        document.body.appendChild(portalElement);
      }
      setPortalContainer(portalElement);

      // Cleanup on unmount.
      return () => {
        // Only remove if we created it and it's empty.
        if (portalElement && portalElement.childNodes.length === 0 && !container) {
          document.body.removeChild(portalElement);
        }
      };
    }, [container, containerId]);

    // Portal content classes.
    const portalClasses = useMemo(() => {
      const base = mergeClasses(
        'fixed z-50 pointer-events-none',
        disabled && 'opacity-50 cursor-not-allowed',
        className,
      );
      return responsive ? mergeClasses(base, resolveResponsiveClasses(responsive)) : base;
    }, [disabled, className, responsive]);

    // Accessibility attributes.
    const ariaProps = useMemo(
      () => ({
        role,
        'aria-label': ariaLabel || 'Tooltip portal',
        'aria-hidden': !open || undefined,
        'aria-disabled': disabled || undefined,
      }),
      [role, ariaLabel, open, disabled],
    );

    // If disabled or no portal container, return null.
    if (disabled || !portalContainer) {
      return null;
    }

    // Render portal content.
    return createPortal(
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            ref={(node) => {
  if (typeof ref === 'function') {
    ref(node);
  } else if (ref) {
    ref.current = node;
  }
}}
            className={portalClasses}
            {...motionProps}
            {...ariaProps}
            {...rest}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>,
      portalContainer,
    );
  }),
);

TooltipPortal.displayName = 'TooltipPortal';

TooltipPortal.propTypes = {
  /** Tooltip content to render in portal. */
  children: PropTypes.node,
  /** Whether the portal is open. */
  open: PropTypes.bool,
  /** ID of the portal container element. */
  containerId: PropTypes.string,
  /** Custom container element (overrides containerId). */
  container: PropTypes.instanceOf(HTMLElement),
  /** Disables the portal. */
  disabled: PropTypes.bool,
  /** Whether animation is enabled. */
  animated: PropTypes.bool,
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

export default TooltipPortal;