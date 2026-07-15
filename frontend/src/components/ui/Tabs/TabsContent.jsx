/**
 * KisanO Design System — Tabs Package
 * TabsContent
 *
 * The content panel for a tab. Renders content with animated transitions
 * and supports lazy rendering.
 *
 * Single Responsibility: Render a tab content panel.
 * Does not manage tabs state or trigger logic.
 *
 * @module components/ui/Tabs/TabsContent
 */

import { forwardRef, memo, useMemo } from 'react';
import PropTypes from 'prop-types';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';

import {
  TABS_DEFAULTS,
  getTabsSize,
} from './tabsVariants';
import {
  mergeClasses,
  resolveResponsiveClasses,
  getTabsContentClasses,
} from './tabsUtils';

/* ---------------------------------- */
/* Component-specific tokens          */
/* ---------------------------------- */

/** Motion variants for content animation. */
const CONTENT_MOTION = {
  initial: { opacity: 0, y: 4 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -4 },
  transition: { duration: 0.2, ease: [0.4, 0, 0.2, 1] },
};

/** Staggered animation variants. */
const STAGGER_MOTION = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { staggerChildren: 0.05 },
};

/* ---------------------------------- */
/* Component                          */
/* ---------------------------------- */

/**
 * TabsContent – a tab content panel.
 *
 * @component
 * @example
 * <TabsContent value="tab1" active>
 *   Content for tab 1
 * </TabsContent>
 */
const TabsContent = memo(
  forwardRef(function TabsContent(
    {
      children,
      value,
      active = false,
      lazy = true,
      size = TABS_DEFAULTS.size,
      disabled = false,
      loading = false,
      responsive,
      className = '',
      role = 'tabpanel',
      'aria-label': ariaLabel,
      ...rest
    },
    ref,
  ) {
    const prefersReducedMotion = useReducedMotion();

    // Get size configuration.
    const sizeConfig = useMemo(
      () => getTabsSize(size),
      [size],
    );

    // Content classes.
    const contentClasses = useMemo(
      () =>
        getTabsContentClasses({
          size,
          className,
          disabled,
          loading,
        }),
      [size, className, disabled, loading],
    );

    // Responsive overrides.
    const responsiveClasses = useMemo(
      () => (responsive ? resolveResponsiveClasses(responsive) : ''),
      [responsive],
    );

    const finalClasses = useMemo(
      () => mergeClasses(contentClasses, responsiveClasses),
      [contentClasses, responsiveClasses],
    );

    // Determine if content should be rendered.
    const shouldRender = !lazy || active;

    // Motion props - respect reduced motion.
    const motionProps = useMemo(() => {
      if (prefersReducedMotion) {
        return { initial: false, animate: true, exit: false };
      }
      return CONTENT_MOTION;
    }, [prefersReducedMotion]);

    // Stagger motion props for children.
    const staggerProps = useMemo(() => {
      if (prefersReducedMotion) {
        return { initial: false, animate: true };
      }
      return STAGGER_MOTION;
    }, [prefersReducedMotion]);

    // Accessibility attributes.
    const ariaProps = useMemo(
      () => ({
        role,
        'aria-label': ariaLabel || `Tab panel ${value}`,
        'aria-hidden': !active,
        'aria-disabled': disabled || undefined,
        'aria-busy': loading || undefined,
        'data-value': value,
        'data-active': active || undefined,
        tabIndex: active ? 0 : -1,
      }),
      [role, ariaLabel, value, active, disabled, loading],
    );

    // If not rendered, return null.
    if (!shouldRender) {
      return null;
    }

    // If active, render with animation.
    if (active) {
      return (
        <motion.div
          ref={ref}
          className={finalClasses}
          {...motionProps}
          {...ariaProps}
          {...rest}
        >
          <motion.div {...staggerProps}>
            {children}
          </motion.div>
        </motion.div>
      );
    }

    // If not active but rendered (lazy=false), render without animation.
    return (
      <div
        ref={ref}
        className={finalClasses}
        {...ariaProps}
        {...rest}
      >
        {children}
      </div>
    );
  }),
);

TabsContent.displayName = 'TabsContent';

TabsContent.propTypes = {
  /** Content to render. */
  children: PropTypes.node,
  /** Tab value. */
  value: PropTypes.any.isRequired,
  /** Whether the content is active. */
  active: PropTypes.bool,
  /** Whether to lazy render content (only render when active). */
  lazy: PropTypes.bool,
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
  /** ARIA role. */
  role: PropTypes.string,
  /** Accessible label. */
  'aria-label': PropTypes.string,
};

export default TabsContent;