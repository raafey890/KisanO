/**
 * KisanO Design System — Drawer Package
 * DrawerBody
 *
 * The main content area of a Drawer. Renders the body content with
 * proper padding, spacing, and scroll behavior. Supports loading states
 * and accessibility attributes.
 *
 * Single Responsibility: Render the drawer body content with layout
 * and accessibility support. Does not handle header, footer, or
 * drawer visibility.
 *
 * @module components/ui/Drawer/DrawerBody
 */

import { forwardRef, memo, useMemo } from 'react';
import PropTypes from 'prop-types';
import { motion, useReducedMotion } from 'framer-motion';

import {
  DRAWER_DEFAULTS,
  getDrawerSize,
} from './drawerVariants';
import {
  mergeClasses,
  resolveResponsiveClasses,
  getDrawerBodyClasses,
} from './drawerUtils';

/* ---------------------------------- */
/* Component-specific tokens          */
/* ---------------------------------- */

/** Motion variants for body animation. */
const BODY_MOTION = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.2, ease: [0.4, 0, 0.2, 1] },
};

/* ---------------------------------- */
/* Component                          */
/* ---------------------------------- */

/**
 * DrawerBody – the content area of a drawer.
 *
 * @component
 * @example
 * <DrawerBody>
 *   <p>Main content goes here...</p>
 * </DrawerBody>
 *
 * @example
 * <DrawerBody scrollable loading>
 *   <p>Loading content...</p>
 * </DrawerBody>
 */
const DrawerBody = memo(
  forwardRef(function DrawerBody(
    {
      children,
      size = DRAWER_DEFAULTS.size,
      variant = DRAWER_DEFAULTS.variant,
      scrollable = false,
      loading = false,
      disabled = false,
      responsive,
      className = '',
      role = 'document',
      'aria-label': ariaLabel,
      ...rest
    },
    ref,
  ) {
    const prefersReducedMotion = useReducedMotion();

    // Get size configuration.
    const sizeConfig = useMemo(
      () => getDrawerSize(size),
      [size],
    );

    // Responsive overrides.
    const responsiveClasses = useMemo(
      () => (responsive ? resolveResponsiveClasses(responsive) : ''),
      [responsive],
    );

    // Body classes.
    const bodyClasses = useMemo(() => {
      const base = getDrawerBodyClasses({
        size,
        className,
        disabled,
        loading,
      });
      return mergeClasses(base, responsiveClasses);
    }, [size, className, disabled, loading, responsiveClasses]);

    // Scrollable wrapper classes.
    const scrollClasses = useMemo(() => {
      if (!scrollable) return '';
      return mergeClasses(
        'overflow-y-auto',
        'max-h-[60vh]',
        'pr-2',
        '-mr-2',
      );
    }, [scrollable]);

    // Final body classes with scroll support.
    const finalClasses = useMemo(
      () => mergeClasses(bodyClasses, scrollClasses),
      [bodyClasses, scrollClasses],
    );

    // Motion props - respect reduced motion.
    const motionProps = useMemo(() => {
      if (prefersReducedMotion) {
        return { initial: false, animate: true };
      }
      return BODY_MOTION;
    }, [prefersReducedMotion]);

    // Accessibility attributes.
    const ariaProps = useMemo(
      () => ({
        role,
        'aria-label': ariaLabel || 'Drawer content',
        'aria-busy': loading || undefined,
        'aria-disabled': disabled || undefined,
      }),
      [role, ariaLabel, loading, disabled],
    );

    // If loading, show a simple loading state (loader is handled by parent).
    // This component only renders content.
    if (loading) {
      return (
        <motion.div
          ref={ref}
          className={finalClasses}
          {...motionProps}
          {...ariaProps}
          {...rest}
        >
          <div className="animate-pulse space-y-3">
            <div className="h-4 bg-gray-200 rounded w-3/4" />
            <div className="h-4 bg-gray-200 rounded w-full" />
            <div className="h-4 bg-gray-200 rounded w-5/6" />
            <div className="h-4 bg-gray-200 rounded w-2/3" />
          </div>
        </motion.div>
      );
    }

    return (
      <motion.div
        ref={ref}
        className={finalClasses}
        {...motionProps}
        {...ariaProps}
        {...rest}
      >
        {children}
      </motion.div>
    );
  }),
);

DrawerBody.displayName = 'DrawerBody';

DrawerBody.propTypes = {
  /** Content to render inside the body. */
  children: PropTypes.node,
  /** Drawer size (affects padding and typography). */
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl', 'full']),
  /** Drawer variant (affects styling). */
  variant: PropTypes.oneOf(['default', 'primary', 'secondary', 'success', 'warning', 'error', 'glass']),
  /** Makes the body scrollable with max height. */
  scrollable: PropTypes.bool,
  /** Shows loading skeleton. */
  loading: PropTypes.bool,
  /** Disabled state. */
  disabled: PropTypes.bool,
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

export default DrawerBody;