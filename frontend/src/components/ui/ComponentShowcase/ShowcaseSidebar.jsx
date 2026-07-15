/**
 * KisanO Design System — Showcase Package
 * ShowcaseSidebar
 *
 * The sidebar navigation component for the showcase. Renders navigation
 * links to different sections with active state and responsive collapse.
 *
 * Single Responsibility: Render the showcase navigation sidebar.
 * Does not manage showcase state or business logic.
 *
 * @module components/ui/Showcase/ShowcaseSidebar
 */

import { forwardRef, memo, useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import { motion, useReducedMotion } from 'framer-motion';

import {
  SHOWCASE_DEFAULTS,
} from './showcaseVariants';
import {
  mergeClasses,
  resolveResponsiveClasses,
} from './showcaseUtils';

/* ---------------------------------- */
/* Component-specific tokens          */
/* ---------------------------------- */

/** Motion variants for sidebar animation. */
const SIDEBAR_MOTION = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 },
  transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
};

/** Section definitions. */
const DEFAULT_SECTIONS = {
  core: { label: 'Core UI', icon: '🎯' },
  forms: { label: 'Forms', icon: '📝' },
  navigation: { label: 'Navigation', icon: '🧭' },
  display: { label: 'Display', icon: '🖼️' },
  charts: { label: 'Charts', icon: '📊' },
};

/** Default active section when not provided. */
const DEFAULT_ACTIVE = 'core';

/* ---------------------------------- */
/* Component                          */
/* ---------------------------------- */

/**
 * ShowcaseSidebar – the sidebar navigation for the showcase.
 *
 * @component
 * @example
 * <ShowcaseSidebar
 *   sections={sections}
 *   activeSection="core"
 *   onSectionChange={handleSectionChange}
 * />
 */
const ShowcaseSidebar = memo(
  forwardRef(function ShowcaseSidebar(
    {
      sections = DEFAULT_SECTIONS,
      activeSection = DEFAULT_ACTIVE,
      onSectionChange,
      variant = SHOWCASE_DEFAULTS.variant,
      size = SHOWCASE_DEFAULTS.size,
      collapsed = false,
      disabled = false,
      loading = false,
      responsive,
      className = '',
      role = 'navigation',
      'aria-label': ariaLabel = 'Showcase navigation',
      ...rest
    },
    ref,
  ) {
    const prefersReducedMotion = useReducedMotion();

    // Sidebar classes.
    const sidebarClasses = useMemo(() => {
      const base = mergeClasses(
        'sticky top-6',
        'flex flex-col gap-1',
        'w-full lg:w-48 shrink-0',
        disabled && 'opacity-50 cursor-not-allowed',
        loading && 'opacity-70',
        className,
      );
      return responsive ? mergeClasses(base, resolveResponsiveClasses(responsive)) : base;
    }, [className, disabled, loading, responsive]);

    // Motion props - respect reduced motion.
    const motionProps = useMemo(() => {
      if (prefersReducedMotion) {
        return { initial: false, animate: true, exit: false };
      }
      return SIDEBAR_MOTION;
    }, [prefersReducedMotion]);

    // Handle section click.
    const handleSectionClick = useCallback(
      (sectionId) => {
        if (disabled || loading) return;
        onSectionChange?.(sectionId);
      },
      [disabled, loading, onSectionChange],
    );

    // Accessibility attributes.
    const ariaProps = useMemo(
      () => ({
        role,
        'aria-label': ariaLabel,
        'aria-disabled': disabled || undefined,
        'aria-busy': loading || undefined,
        'data-collapsed': collapsed || undefined,
      }),
      [role, ariaLabel, disabled, loading, collapsed],
    );

    // If loading, render a loading placeholder.
    if (loading) {
      return (
        <motion.nav
          ref={ref}
          className={sidebarClasses}
          {...motionProps}
          {...ariaProps}
          {...rest}
        >
          <div className="animate-pulse space-y-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-10 bg-gray-200 dark:bg-gray-700 rounded" />
            ))}
          </div>
        </motion.nav>
      );
    }

    return (
      <motion.nav
        ref={ref}
        className={sidebarClasses}
        {...motionProps}
        {...ariaProps}
        {...rest}
      >
        {Object.entries(sections).map(([id, section]) => {
          const isActive = id === activeSection;

          return (
            <button
              key={id}
              type="button"
              className={mergeClasses(
                'flex items-center gap-3 px-3 py-2 rounded-lg',
                'text-sm font-medium transition-all duration-200',
                'w-full text-left',
                isActive
                  ? 'bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white',
                disabled && 'pointer-events-none opacity-50',
              )}
              onClick={() => handleSectionClick(id)}
              aria-current={isActive ? 'page' : undefined}
              disabled={disabled}
            >
              {section.icon && (
                <span className="text-lg" aria-hidden="true">
                  {section.icon}
                </span>
              )}
              <span className="truncate">{section.label}</span>
              {isActive && (
                <span className="ml-auto h-1.5 w-1.5 rounded-full bg-blue-600 dark:bg-blue-400" />
              )}
            </button>
          );
        })}
      </motion.nav>
    );
  }),
);

ShowcaseSidebar.displayName = 'ShowcaseSidebar';

ShowcaseSidebar.propTypes = {
  /** Sections object with id, label, and icon. */
  sections: PropTypes.objectOf(
    PropTypes.shape({
      label: PropTypes.node,
      icon: PropTypes.node,
    }),
  ),
  /** Active section ID. */
  activeSection: PropTypes.string,
  /** Callback when section changes. */
  onSectionChange: PropTypes.func,
  /** Visual variant. */
  variant: PropTypes.oneOf(['default', 'dark', 'glass', 'minimal', 'gradient']),
  /** Size preset. */
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl', 'full']),
  /** Collapsed state. */
  collapsed: PropTypes.bool,
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

export default ShowcaseSidebar;