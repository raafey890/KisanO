/**
 * KisanO Design System — Tabs Package
 * TabsContainer
 *
 * The container component that wraps the tabs and handles layout,
 * orientation, and accessibility attributes.
 *
 * Single Responsibility: Render the tabs container with layout and styling.
 * Does not manage tabs state or business logic.
 *
 * @module components/ui/Tabs/TabsContainer
 */

import { forwardRef, memo, useMemo } from 'react';
import PropTypes from 'prop-types';
import { motion, useReducedMotion } from 'framer-motion';

import {
  TABS_DEFAULTS,
} from './tabsVariants';
import {
  mergeClasses,
  resolveResponsiveClasses,
  resolveDefaultProps,
  getTabsClasses,
  getTabsContainerClasses,
} from './tabsUtils';

/* ---------------------------------- */
/* Component-specific tokens          */
/* ---------------------------------- */

/** Motion variants for container animation. */
const CONTAINER_MOTION = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: 0.2, ease: [0.4, 0, 0.2, 1] },
};

/* ---------------------------------- */
/* Component                          */
/* ---------------------------------- */

/**
 * TabsContainer – the main tabs wrapper with layout and styling.
 *
 * @component
 * @example
 * <TabsContainer variant="default" size="md">
 *   <TabsList>
 *     <TabsTrigger value="tab1">Tab 1</TabsTrigger>
 *   </TabsList>
 *   <TabsContent value="tab1">Content</TabsContent>
 * </TabsContainer>
 */
const TabsContainer = memo(
  forwardRef(function TabsContainer(
    {
      children,
      variant = TABS_DEFAULTS.variant,
      size = TABS_DEFAULTS.size,
      orientation = TABS_DEFAULTS.orientation,
      disabled = false,
      loading = false,
      responsive,
      className = '',
      role = 'tablist',
      'aria-label': ariaLabel = 'Tabs',
      ...rest
    },
    ref,
  ) {
    const prefersReducedMotion = useReducedMotion();

    // Resolve defaults.
    const resolved = useMemo(
      () =>
        resolveDefaultProps({
          variant,
          size,
          orientation,
          disabled,
          loading,
        }),
      [variant, size, orientation, disabled, loading],
    );

    // Tabs classes.
    const tabsClasses = useMemo(
      () =>
        getTabsClasses({
          variant: resolved.variant,
          size: resolved.size,
          className,
          disabled: resolved.disabled,
          loading: resolved.loading,
        }),
      [
        resolved.variant,
        resolved.size,
        className,
        resolved.disabled,
        resolved.loading,
      ],
    );

    // Container classes.
    const containerClasses = useMemo(
      () =>
        getTabsContainerClasses({
          className: '',
          disabled: resolved.disabled,
          loading: resolved.loading,
        }),
      [resolved.disabled, resolved.loading],
    );

    // Responsive overrides.
    const responsiveClasses = useMemo(
      () => (responsive ? resolveResponsiveClasses(responsive) : ''),
      [responsive],
    );

    const finalClasses = useMemo(
      () => mergeClasses(tabsClasses, responsiveClasses),
      [tabsClasses, responsiveClasses],
    );

    // Motion props - respect reduced motion.
    const motionProps = useMemo(() => {
      if (prefersReducedMotion) {
        return { initial: false, animate: true };
      }
      return CONTAINER_MOTION;
    }, [prefersReducedMotion]);

    // Accessibility attributes.
    const ariaProps = useMemo(
      () => ({
        role,
        'aria-label': ariaLabel,
        'aria-orientation': resolved.orientation,
        'aria-disabled': resolved.disabled || undefined,
        'aria-busy': resolved.loading || undefined,
        'data-orientation': resolved.orientation,
        'data-variant': resolved.variant,
        'data-size': resolved.size,
      }),
      [role, ariaLabel, resolved.orientation, resolved.disabled, resolved.loading, resolved.variant, resolved.size],
    );

    return (
      <motion.div
        ref={ref}
        className={finalClasses}
        {...motionProps}
        {...ariaProps}
        {...rest}
      >
        <div className={containerClasses}>
          {children}
        </div>
      </motion.div>
    );
  }),
);

TabsContainer.displayName = 'TabsContainer';

TabsContainer.propTypes = {
  /** Tabs content (List, Content, etc.). */
  children: PropTypes.node,
  /** Visual variant. */
  variant: PropTypes.oneOf(['default', 'primary', 'filled', 'pill', 'underline', 'minimal']),
  /** Size preset. */
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
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

export default TabsContainer;