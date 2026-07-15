/**
 * KisanO Design System — Tabs Package
 * TabsTrigger
 *
 * A single tab trigger button. Supports active states, icons, badges,
 * keyboard navigation, and accessibility.
 *
 * Single Responsibility: Render one tab trigger.
 * Does not manage tabs state or content panels.
 *
 * @module components/ui/Tabs/TabsTrigger
 */

import { forwardRef, memo, useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import { motion, useReducedMotion } from 'framer-motion';

import {
  TABS_DEFAULTS,
} from './tabsVariants';
import {
  mergeClasses,
  resolveResponsiveClasses,
  getTabsTriggerClasses,
} from './tabsUtils';

/* ---------------------------------- */
/* Component-specific tokens          */
/* ---------------------------------- */

/** Motion variants for trigger interaction. */
const TRIGGER_MOTION = {
  initial: { scale: 1 },
  hover: { scale: 1.02 },
  tap: { scale: 0.98 },
  transition: { duration: 0.15, ease: [0.4, 0, 0.2, 1] },
};

/** Badge color mapping. */
const BADGE_COLORS = {
  default: 'bg-gray-500',
  primary: 'bg-blue-500',
  success: 'bg-green-500',
  warning: 'bg-yellow-500',
  error: 'bg-red-500',
  info: 'bg-cyan-500',
};

/* ---------------------------------- */
/* Component                          */
/* ---------------------------------- */

/**
 * TabsTrigger – a single tab trigger button.
 *
 * @component
 * @example
 * <TabsTrigger value="tab1" active>
 *   Tab 1
 * </TabsTrigger>
 *
 * @example
 * <TabsTrigger
 *   value="tab2"
 *   label="Notifications"
 *   icon={<BellIcon />}
 *   badge={{ count: 5, color: 'error' }}
 * />
 */
const TabsTrigger = memo(
  forwardRef(function TabsTrigger(
    {
      children,
      label,
      value,
      icon,
      badge,
      active = false,
      disabled = false,
      loading = false,
      onClick,
      variant = TABS_DEFAULTS.variant,
      size = TABS_DEFAULTS.size,
      indicator = TABS_DEFAULTS.indicator,
      responsive,
      className = '',
      role = 'tab',
      'aria-label': ariaLabel,
      ...rest
    },
    ref,
  ) {
    const prefersReducedMotion = useReducedMotion();

    // Trigger classes.
    const triggerClasses = useMemo(
      () =>
        getTabsTriggerClasses({
          variant,
          size,
          className,
          active,
          disabled,
          loading,
          indicator,
        }),
      [variant, size, className, active, disabled, loading, indicator],
    );

    // Responsive overrides.
    const responsiveClasses = useMemo(
      () => (responsive ? resolveResponsiveClasses(responsive) : ''),
      [responsive],
    );

    const finalClasses = useMemo(
      () => mergeClasses(triggerClasses, responsiveClasses),
      [triggerClasses, responsiveClasses],
    );

    // Handle click.
    const handleClick = useCallback(
      (event) => {
        if (disabled || loading) return;
        onClick?.(value, event);
      },
      [disabled, loading, onClick, value],
    );

    // Handle keyboard.
    const handleKeyDown = useCallback(
      (event) => {
        if (disabled || loading) return;
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          onClick?.(value, event);
        }
      },
      [disabled, loading, onClick, value],
    );

    // Badge color.
    const badgeColor = useMemo(() => {
      if (!badge) return '';
      return BADGE_COLORS[badge.color] || BADGE_COLORS.default;
    }, [badge]);

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
        whileHover: TRIGGER_MOTION.hover,
        whileTap: TRIGGER_MOTION.tap,
        transition: TRIGGER_MOTION.transition,
      };
    }, [prefersReducedMotion, disabled, loading]);

    // Accessibility attributes.
    const ariaProps = useMemo(
      () => ({
        role,
        'aria-label': ariaLabel || label || 'Tab',
        'aria-selected': active,
        'aria-disabled': disabled || undefined,
        tabIndex: disabled || !active ? -1 : 0,
        'data-active': active || undefined,
        'data-value': value,
      }),
      [role, ariaLabel, label, active, disabled, value],
    );

    // Render content.
    const content = (
      <>
        {icon && <span className="shrink-0">{icon}</span>}
        <span className="truncate">{children || label}</span>
        {badge && (
          <span
            className={mergeClasses(
              'ml-1.5 inline-flex items-center justify-center',
              'min-w-[18px] h-[18px] px-1.5',
              'rounded-full text-xs font-medium text-white',
              badgeColor,
            )}
          >
            {badge.count}
          </span>
        )}
      </>
    );

    return (
      <motion.button
        ref={ref}
        type="button"
        className={finalClasses}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        {...motionProps}
        {...ariaProps}
        {...rest}
      >
        {content}
      </motion.button>
    );
  }),
);

TabsTrigger.displayName = 'TabsTrigger';

TabsTrigger.propTypes = {
  /** Trigger content (alternative to label). */
  children: PropTypes.node,
  /** Trigger label. */
  label: PropTypes.node,
  /** Tab value. */
  value: PropTypes.any.isRequired,
  /** Icon element. */
  icon: PropTypes.node,
  /** Badge configuration. */
  badge: PropTypes.shape({
    count: PropTypes.number,
    color: PropTypes.oneOf(['default', 'primary', 'success', 'warning', 'error', 'info']),
  }),
  /** Active state. */
  active: PropTypes.bool,
  /** Disabled state. */
  disabled: PropTypes.bool,
  /** Loading state. */
  loading: PropTypes.bool,
  /** Click handler. */
  onClick: PropTypes.func,
  /** Visual variant. */
  variant: PropTypes.oneOf(['default', 'primary', 'filled', 'pill', 'underline', 'minimal']),
  /** Size preset. */
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
  /** Indicator type. */
  indicator: PropTypes.oneOf(['underline', 'background', 'pill', 'dot', 'none']),
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

export default TabsTrigger;