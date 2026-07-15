/**
 * KisanO Design System — Showcase Package
 * ShowcaseHeader
 *
 * The header component for the showcase. Renders the title, subtitle,
 * and optional search field with responsive support.
 *
 * Single Responsibility: Render the showcase header.
 * Does not manage showcase state or business logic.
 *
 * @module components/ui/Showcase/ShowcaseHeader
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
  getShowcaseHeaderClasses,
} from './showcaseUtils';

/* ---------------------------------- */
/* Component-specific tokens          */
/* ---------------------------------- */

/** Motion variants for header animation. */
const HEADER_MOTION = {
  initial: { opacity: 0, y: -20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
};

/** Default title when not provided. */
const DEFAULT_TITLE = 'Component Showcase';

/** Default subtitle when not provided. */
const DEFAULT_SUBTITLE = 'Explore all available components';

/* ---------------------------------- */
/* Component                          */
/* ---------------------------------- */

/**
 * ShowcaseHeader – the header for the component showcase.
 *
 * @component
 * @example
 * <ShowcaseHeader
 *   title="KisanO Design System"
 *   subtitle="Enterprise UI Components"
 * />
 */
const ShowcaseHeader = memo(
  forwardRef(function ShowcaseHeader(
    {
      title = DEFAULT_TITLE,
      subtitle = DEFAULT_SUBTITLE,
      variant = SHOWCASE_DEFAULTS.variant,
      size = SHOWCASE_DEFAULTS.size,
      disabled = false,
      loading = false,
      responsive,
      className = '',
      role = 'banner',
      'aria-label': ariaLabel,
      ...rest
    },
    ref,
  ) {
    const prefersReducedMotion = useReducedMotion();

    // Header classes.
    const headerClasses = useMemo(
      () =>
        getShowcaseHeaderClasses({
          variant,
          size,
          className,
          disabled,
          loading,
        }),
      [variant, size, className, disabled, loading],
    );

    // Responsive overrides.
    const responsiveClasses = useMemo(
      () => (responsive ? resolveResponsiveClasses(responsive) : ''),
      [responsive],
    );

    const finalClasses = useMemo(
      () => mergeClasses(headerClasses, responsiveClasses),
      [headerClasses, responsiveClasses],
    );

    // Motion props - respect reduced motion.
    const motionProps = useMemo(() => {
      if (prefersReducedMotion) {
        return { initial: false, animate: true, exit: false };
      }
      return HEADER_MOTION;
    }, [prefersReducedMotion]);

    // Accessibility attributes.
    const ariaProps = useMemo(
      () => ({
        role,
        'aria-label': ariaLabel || title,
        'aria-disabled': disabled || undefined,
        'aria-busy': loading || undefined,
        'data-size': size,
        'data-variant': variant,
      }),
      [role, ariaLabel, title, disabled, loading, size, variant],
    );

    // If loading, render a loading placeholder.
    if (loading) {
      return (
        <motion.header
          ref={ref}
          className={finalClasses}
          {...motionProps}
          {...ariaProps}
          {...rest}
        >
          <div className="animate-pulse w-full">
            <div className="h-8 w-64 bg-gray-200 dark:bg-gray-700 rounded mb-2" />
            <div className="h-4 w-96 bg-gray-200 dark:bg-gray-700 rounded" />
          </div>
        </motion.header>
      );
    }

    return (
      <motion.header
        ref={ref}
        className={finalClasses}
        {...motionProps}
        {...ariaProps}
        {...rest}
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between w-full gap-4">
          {/* Title and Subtitle */}
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white">
              {title}
            </h1>
            {subtitle && (
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {subtitle}
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Theme toggle placeholder - can be replaced with actual theme toggle */}
            <button
              type="button"
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              aria-label="Toggle theme"
            >
              <svg
                className="h-5 w-5 text-gray-600 dark:text-gray-300"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                viewBox="0 0 24 24"
              >
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            </button>

            {/* GitHub/Code link placeholder */}
            <a
              href="#"
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              aria-label="View source code"
            >
              <svg
                className="h-5 w-5 text-gray-600 dark:text-gray-300"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                viewBox="0 0 24 24"
              >
                <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
              </svg>
            </a>
          </div>
        </div>
      </motion.header>
    );
  }),
);

ShowcaseHeader.displayName = 'ShowcaseHeader';

ShowcaseHeader.propTypes = {
  /** Header title. */
  title: PropTypes.node,
  /** Header subtitle. */
  subtitle: PropTypes.node,
  /** Visual variant. */
  variant: PropTypes.oneOf(['default', 'dark', 'glass', 'minimal', 'gradient']),
  /** Size preset. */
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl', 'full']),
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

export default ShowcaseHeader;