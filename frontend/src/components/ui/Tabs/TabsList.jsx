/**
 * KisanO Design System — Tabs Package
 * TabsList
 *
 * The list component that contains tab triggers. Renders a horizontal
 * or vertical list of tab buttons with scrollable support.
 *
 * Single Responsibility: Render the tabs list container.
 * Does not manage tabs state or content panels.
 *
 * @module components/ui/Tabs/TabsList
 */

import { forwardRef, memo, useMemo, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { motion, useReducedMotion } from 'framer-motion';

import {
  TABS_DEFAULTS,
} from './tabsVariants';
import {
  mergeClasses,
  resolveResponsiveClasses,
  getTabsListClasses,
} from './tabsUtils';

/* ---------------------------------- */
/* Component-specific tokens          */
/* ---------------------------------- */

/** Motion variants for list animation. */
const LIST_MOTION = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: 0.15, ease: [0.4, 0, 0.2, 1] },
};

/** Scrollbar styling. */
const SCROLLBAR_CLASSES = 'scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600';

/* ---------------------------------- */
/* Component                          */
/* ---------------------------------- */

/**
 * TabsList – the container for tab triggers.
 *
 * @component
 * @example
 * <TabsList>
 *   <TabsTrigger value="tab1">Tab 1</TabsTrigger>
 *   <TabsTrigger value="tab2">Tab 2</TabsTrigger>
 * </TabsList>
 */
const TabsList = memo(
  forwardRef(function TabsList(
    {
      children,
      variant = TABS_DEFAULTS.variant,
      size = TABS_DEFAULTS.size,
      radius = TABS_DEFAULTS.radius,
      orientation = TABS_DEFAULTS.orientation,
      scrollable = false,
      disabled = false,
      loading = false,
      responsive,
      className = '',
      role = 'tablist',
      'aria-label': ariaLabel = 'Tabs list',
      ...rest
    },
    ref,
  ) {
    const prefersReducedMotion = useReducedMotion();
    const listRef = useRef(null);

    // List classes.
    const listClasses = useMemo(
      () =>
        getTabsListClasses({
          variant,
          size,
          radius,
          orientation,
          className,
          disabled,
          loading,
        }),
      [variant, size, radius, orientation, className, disabled, loading],
    );

    // Responsive overrides.
    const responsiveClasses = useMemo(
      () => (responsive ? resolveResponsiveClasses(responsive) : ''),
      [responsive],
    );

    const finalClasses = useMemo(
      () => mergeClasses(listClasses, responsiveClasses, scrollable ? SCROLLBAR_CLASSES : ''),
      [listClasses, responsiveClasses, scrollable],
    );

    // Scrollable classes.
    const scrollClasses = useMemo(() => {
      if (!scrollable) return '';
      return mergeClasses(
        'overflow-x-auto overflow-y-hidden',
        'whitespace-nowrap',
        'flex-nowrap',
        '-mx-1 px-1',
      );
    }, [scrollable]);

    // Motion props - respect reduced motion.
    const motionProps = useMemo(() => {
      if (prefersReducedMotion) {
        return { initial: false, animate: true };
      }
      return LIST_MOTION;
    }, [prefersReducedMotion]);

    // Accessibility attributes.
    const ariaProps = useMemo(
      () => ({
        role,
        'aria-label': ariaLabel,
        'aria-orientation': orientation,
        'aria-disabled': disabled || undefined,
        'aria-busy': loading || undefined,
      }),
      [role, ariaLabel, orientation, disabled, loading],
    );

    // Handle scroll on mount if scrollable.
    useEffect(() => {
      if (scrollable && listRef.current) {
        const activeTab = listRef.current.querySelector('[data-active="true"]');
        if (activeTab) {
          activeTab.scrollIntoView({
            behavior: 'smooth',
            block: 'nearest',
            inline: 'center',
          });
        }
      }
    }, [scrollable, children]);

    return (
      <motion.div
        ref={(node) => {
          listRef.current = node;
          if (typeof ref === 'function') ref(node);
          else if (ref) ref.current = node;
        }}
        className={mergeClasses(finalClasses, scrollClasses)}
        {...motionProps}
        {...ariaProps}
        {...rest}
      >
        {children}
      </motion.div>
    );
  }),
);

TabsList.displayName = 'TabsList';

TabsList.propTypes = {
  /** Tab triggers. */
  children: PropTypes.node,
  /** Visual variant. */
  variant: PropTypes.oneOf(['default', 'primary', 'filled', 'pill', 'underline', 'minimal']),
  /** Size preset. */
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
  /** Border radius override. */
  radius: PropTypes.oneOf(['none', 'sm', 'md', 'lg', 'xl', '2xl', 'full']),
  /** Tabs orientation. */
  orientation: PropTypes.oneOf(['horizontal', 'vertical']),
  /** Whether the list is scrollable. */
  scrollable: PropTypes.bool,
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

export default TabsList;