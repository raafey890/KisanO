/**
 * KisanO Design System — Tabs Package
 * TabsIndicator
 *
 * The animated indicator that highlights the active tab. Supports
 * horizontal and vertical orientations with smooth transitions.
 *
 * Single Responsibility: Render the animated tab indicator.
 * Does not manage tabs state or trigger logic.
 *
 * @module components/ui/Tabs/TabsIndicator
 */

import { forwardRef, memo, useMemo, useRef, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { motion, useReducedMotion } from 'framer-motion';

import {
  TABS_DEFAULTS,
} from './tabsVariants';
import {
  mergeClasses,
  resolveResponsiveClasses,
  getTabsIndicatorClasses,
} from './tabsUtils';

/* ---------------------------------- */
/* Component-specific tokens          */
/* ---------------------------------- */

/** Motion variants for indicator animation. */
const INDICATOR_MOTION = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
};

/** Spring animation for smooth transitions. */
const SPRING_ANIMATION = {
  type: 'spring',
  stiffness: 500,
  damping: 30,
  mass: 1,
};

/* ---------------------------------- */
/* Component                          */
/* ---------------------------------- */

/**
 * TabsIndicator – the animated tab indicator.
 *
 * @component
 * @example
 * <TabsIndicator activeIndex={0} itemsCount={2} />
 */
const TabsIndicator = memo(
  forwardRef(function TabsIndicator(
    {
      activeIndex = 0,
      itemsCount = 0,
      indicator = TABS_DEFAULTS.indicator,
      orientation = TABS_DEFAULTS.orientation,
      disabled = false,
      loading = false,
      responsive,
      className = '',
      role = 'presentation',
      'aria-label': ariaLabel = 'Active tab indicator',
      ...rest
    },
    ref,
  ) {
    const prefersReducedMotion = useReducedMotion();
    const indicatorRef = useRef(null);
    const [dimensions, setDimensions] = useState({ left: 0, top: 0, width: 0, height: 0 });

    // Calculate indicator position.
    useEffect(() => {
      if (!indicatorRef.current) return;

      const parent = indicatorRef.current.parentElement;
      if (!parent) return;

      const activeTrigger = parent.querySelector('[data-active="true"]');
      if (!activeTrigger) return;

      const parentRect = parent.getBoundingClientRect();
      const triggerRect = activeTrigger.getBoundingClientRect();

      if (orientation === 'vertical') {
        setDimensions({
          left: 0,
          top: triggerRect.top - parentRect.top,
          width: 2,
          height: triggerRect.height,
        });
      } else {
        setDimensions({
          left: triggerRect.left - parentRect.left,
          top: 0,
          width: triggerRect.width,
          height: 2,
        });
      }
    }, [activeIndex, itemsCount, orientation]);

    // Indicator classes.
    const indicatorClasses = useMemo(
      () =>
        getTabsIndicatorClasses({
          indicator,
          className,
          active: true,
          orientation,
        }),
      [indicator, className, orientation],
    );

    // Responsive overrides.
    const responsiveClasses = useMemo(
      () => (responsive ? resolveResponsiveClasses(responsive) : ''),
      [responsive],
    );

    const finalClasses = useMemo(
      () => mergeClasses(indicatorClasses, responsiveClasses),
      [indicatorClasses, responsiveClasses],
    );

    // Motion props - respect reduced motion.
    const motionProps = useMemo(() => {
      if (prefersReducedMotion) {
        return { initial: false, animate: true };
      }
      return {
        initial: INDICATOR_MOTION.initial,
        animate: INDICATOR_MOTION.animate,
        transition: INDICATOR_MOTION.transition,
        layoutTransition: SPRING_ANIMATION,
      };
    }, [prefersReducedMotion]);

    // Indicator style.
    const indicatorStyle = useMemo(() => {
      if (!dimensions) return {};

      const style = {
        position: 'absolute',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      };

      if (orientation === 'vertical') {
        style.left = `${dimensions.left}px`;
        style.top = `${dimensions.top}px`;
        style.width = `${dimensions.width}px`;
        style.height = `${dimensions.height}px`;
      } else {
        style.left = `${dimensions.left}px`;
        style.top = `${dimensions.top}px`;
        style.width = `${dimensions.width}px`;
        style.height = `${dimensions.height}px`;
      }

      return style;
    }, [dimensions, orientation]);

    // If disabled, no indicator.
    if (disabled || loading || itemsCount === 0 || indicator === 'none') {
      return null;
    }

    // Accessibility attributes.
    const ariaProps = useMemo(
      () => ({
        role,
        'aria-label': ariaLabel,
        'aria-hidden': true,
      }),
      [role, ariaLabel],
    );

    return (
      <motion.div
        ref={(node) => {
          indicatorRef.current = node;
          if (typeof ref === 'function') ref(node);
          else if (ref) ref.current = node;
        }}
        className={finalClasses}
        style={indicatorStyle}
        {...motionProps}
        {...ariaProps}
        {...rest}
      />
    );
  }),
);

TabsIndicator.displayName = 'TabsIndicator';

TabsIndicator.propTypes = {
  /** Active tab index. */
  activeIndex: PropTypes.number,
  /** Total number of tabs. */
  itemsCount: PropTypes.number,
  /** Indicator type. */
  indicator: PropTypes.oneOf(['underline', 'background', 'pill', 'dot', 'none']),
  /** Tabs orientation. */
  orientation: PropTypes.oneOf(['horizontal', 'vertical']),
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

export default TabsIndicator;