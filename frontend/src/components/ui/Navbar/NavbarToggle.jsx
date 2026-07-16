/**
 * KisanO Design System — Navbar Package
 * NavbarToggle
 *
 * The toggle button for mobile navigation menus. Renders an animated
 * hamburger icon that transforms between open and closed states.
 *
 * Single Responsibility: Render the navbar toggle button.
 * Does not manage navbar state or menu content.
 *
 * @module components/ui/Navbar/NavbarToggle
 */

import { forwardRef, memo, useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import { motion, useReducedMotion } from 'framer-motion';

import {
  NAVBAR_DEFAULTS,
} from './navbarVariants';
import {
  mergeClasses,
  resolveResponsiveClasses,
  getNavbarToggleClasses,
} from './navbarUtils';

/* ---------------------------------- */
/* Component-specific tokens          */
/* ---------------------------------- */

/** Motion variants for the toggle button. */
const TOGGLE_MOTION = {
  initial: { scale: 1 },
  hover: { scale: 1.05 },
  tap: { scale: 0.95 },
  transition: { duration: 0.15, ease: [0.4, 0, 0.2, 1] },
};

/** Motion variants for hamburger lines. */
const LINE_MOTION = {
  initial: { rotate: 0, y: 0, opacity: 1 },
  animate: { rotate: 0, y: 0, opacity: 1 },
  exit: { rotate: 0, y: 0, opacity: 1 },
  transition: { duration: 0.2, ease: [0.4, 0, 0.2, 1] },
};

/** Open state line animations. */
const LINE_OPEN_MOTION = {
  top: {
    initial: { rotate: 0, y: 0 },
    animate: { rotate: 45, y: 6 },
    transition: { duration: 0.2, ease: [0.4, 0, 0.2, 1] },
  },
  middle: {
    initial: { opacity: 1 },
    animate: { opacity: 0 },
    transition: { duration: 0.15, ease: [0.4, 0, 0.2, 1] },
  },
  bottom: {
    initial: { rotate: 0, y: 0 },
    animate: { rotate: -45, y: -6 },
    transition: { duration: 0.2, ease: [0.4, 0, 0.2, 1] },
  },
};

/* ---------------------------------- */
/* Component                          */
/* ---------------------------------- */

/**
 * NavbarToggle – the mobile menu toggle button.
 *
 * @component
 * @example
 * <NavbarToggle open={isOpen} onClick={handleToggle} />
 */
const NavbarToggle = memo(
  forwardRef(function NavbarToggle(
    {
      open = false,
      onClick,
      size = NAVBAR_DEFAULTS.size,
      disabled = false,
      loading = false,
      responsive,
      className = '',
      'aria-label': ariaLabel = 'Toggle menu',
      ...rest
    },
    ref,
  ) {
    const prefersReducedMotion = useReducedMotion();

    // Toggle classes.
    const toggleClasses = useMemo(
      () =>
        getNavbarToggleClasses({
          className,
          open,
          disabled,
        }),
      [className, open, disabled],
    );

    // Responsive overrides.
    const responsiveClasses = useMemo(
      () => (responsive ? resolveResponsiveClasses(responsive) : ''),
      [responsive],
    );

    const finalClasses = useMemo(
      () => mergeClasses(toggleClasses, responsiveClasses),
      [toggleClasses, responsiveClasses],
    );

    // Handle click.
    const handleClick = useCallback(
      (event) => {
        if (disabled || loading) return;
        onClick?.(event);
      },
      [disabled, loading, onClick],
    );

    // Motion props - respect reduced motion.
    const motionProps = useMemo(() => {
      if (prefersReducedMotion || disabled || loading) {
        return {
          whileHover: undefined,
          whileTap: undefined,
          transition: undefined,
        };
      }
      return {
        whileHover: TOGGLE_MOTION.hover,
        whileTap: TOGGLE_MOTION.tap,
        transition: TOGGLE_MOTION.transition,
      };
    }, [prefersReducedMotion, disabled, loading]);

    // Line motion props.
    const lineMotionProps = useMemo(() => {
      if (prefersReducedMotion) {
        return { initial: false, animate: true };
      }
      return LINE_MOTION;
    }, [prefersReducedMotion]);

    // Open line motion props.
    const openLineProps = useMemo(() => {
      if (prefersReducedMotion) {
        return { initial: false, animate: true };
      }
      return {
        top: LINE_OPEN_MOTION.top,
        middle: LINE_OPEN_MOTION.middle,
        bottom: LINE_OPEN_MOTION.bottom,
      };
    }, [prefersReducedMotion]);

    // Accessibility attributes - FIXED: removed onOpenChange
    const ariaProps = useMemo(
      () => ({
        type: 'button',
        'aria-label': ariaLabel,
        'aria-expanded': open,
        'aria-controls': 'navbar-menu',
        'aria-disabled': disabled || undefined,
        disabled: disabled,
      }),
      [ariaLabel, open, disabled],
    );

    return (
      <motion.button
        ref={ref}
        className={finalClasses}
        onClick={handleClick}
        {...motionProps}
        {...ariaProps}
        {...rest}
      >
        <span className="sr-only">{ariaLabel}</span>
        <div className="relative w-5 h-5">
          {/* Top line */}
          <motion.span
            className="absolute block w-5 h-0.5 bg-current rounded-full"
            style={{ top: '2px', left: 0 }}
            animate={open ? openLineProps.top.animate : { rotate: 0, y: 0 }}
            transition={openLineProps.top.transition}
            {...lineMotionProps}
          />
          {/* Middle line */}
          <motion.span
            className="absolute block w-5 h-0.5 bg-current rounded-full"
            style={{ top: '50%', left: 0, transform: 'translateY(-50%)' }}
            animate={open ? openLineProps.middle.animate : { opacity: 1 }}
            transition={openLineProps.middle.transition}
            {...lineMotionProps}
          />
          {/* Bottom line */}
          <motion.span
            className="absolute block w-5 h-0.5 bg-current rounded-full"
            style={{ bottom: '2px', left: 0 }}
            animate={open ? openLineProps.bottom.animate : { rotate: 0, y: 0 }}
            transition={openLineProps.bottom.transition}
            {...lineMotionProps}
          />
        </div>
      </motion.button>
    );
  }),
);

NavbarToggle.displayName = 'NavbarToggle';

NavbarToggle.propTypes = {
  /** Whether the menu is open. */
  open: PropTypes.bool,
  /** Click handler. */
  onClick: PropTypes.func,
  /** Size preset. */
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
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
  /** Accessible label. */
  'aria-label': PropTypes.string,
};

export default NavbarToggle;