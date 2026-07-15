/**
 * KisanO Design System — Showcase Package
 * ShowcaseSection
 *
 * A section component for the showcase that groups related components
 * with a title and description.
 *
 * Single Responsibility: Render a showcase section with title and content.
 * Does not manage showcase state or business logic.
 *
 * @module components/ui/Showcase/ShowcaseSection
 */

import { forwardRef, memo, useMemo } from 'react';
import PropTypes from 'prop-types';
import { motion, useReducedMotion } from 'framer-motion';

import {
  SHOWCASE_DEFAULTS,
} from './showcaseVariants';
import {
  mergeClasses,
  resolveResponsiveClasses,
  getShowcaseSectionClasses,
} from './showcaseUtils';

/* ---------------------------------- */
/* Component-specific tokens          */
/* ---------------------------------- */

/** Motion variants for section animation. */
const SECTION_MOTION = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
};

/** Staggered animation variants for children. */
const STAGGER_MOTION = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { staggerChildren: 0.05 },
};

/** Default section id when not provided. */
const DEFAULT_ID = 'section';

/* ---------------------------------- */
/* Component                          */
/* ---------------------------------- */

/**
 * ShowcaseSection – a section for the component showcase.
 *
 * @component
 * @example
 * <ShowcaseSection
 *   id="core"
 *   label="Core UI"
 *   icon="🎯"
 *   description="Essential UI components"
 * >
 *   <Button>Button</Button>
 *   <Input />
 * </ShowcaseSection>
 */
const ShowcaseSection = memo(
  forwardRef(function ShowcaseSection(
    {
      children,
      id = DEFAULT_ID,
      label,
      icon,
      description,
      variant = SHOWCASE_DEFAULTS.variant,
      size = SHOWCASE_DEFAULTS.size,
      align = 'center',
      disabled = false,
      loading = false,
      responsive,
      className = '',
      role = 'section',
      'aria-label': ariaLabel,
      ...rest
    },
    ref,
  ) {
    const prefersReducedMotion = useReducedMotion();

    // Section classes.
    const sectionClasses = useMemo(
      () =>
        getShowcaseSectionClasses({
          className,
          disabled,
          loading,
          align,
        }),
      [className, disabled, loading, align],
    );

    // Responsive overrides.
    const responsiveClasses = useMemo(
      () => (responsive ? resolveResponsiveClasses(responsive) : ''),
      [responsive],
    );

    const finalClasses = useMemo(
      () => mergeClasses(sectionClasses, responsiveClasses),
      [sectionClasses, responsiveClasses],
    );

    // Motion props - respect reduced motion.
    const motionProps = useMemo(() => {
      if (prefersReducedMotion) {
        return { initial: false, animate: true, exit: false };
      }
      return SECTION_MOTION;
    }, [prefersReducedMotion]);

    // Stagger motion props.
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
        'aria-label': ariaLabel || label || 'Section',
        'aria-disabled': disabled || undefined,
        'aria-busy': loading || undefined,
        'data-id': id,
        'data-align': align,
      }),
      [role, ariaLabel, label, disabled, loading, id, align],
    );

    // If loading, render a loading placeholder.
    if (loading) {
      return (
        <motion.section
          ref={ref}
          className={finalClasses}
          {...motionProps}
          {...ariaProps}
          {...rest}
        >
          <div className="w-full animate-pulse">
            <div className="h-8 w-48 bg-gray-200 rounded mb-2" />
            <div className="h-4 w-64 bg-gray-200 rounded mb-4" />
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-32 bg-gray-200 rounded" />
              ))}
            </div>
          </div>
        </motion.section>
      );
    }

    return (
      <motion.section
        ref={ref}
        className={finalClasses}
        {...motionProps}
        {...ariaProps}
        {...rest}
      >
        {/* Header */}
        {(label || icon) && (
          <div className="flex items-center gap-3 mb-4">
            {icon && (
              <span className="text-2xl" aria-hidden="true">
                {icon}
              </span>
            )}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {label}
              </h2>
              {description && (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {description}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Content */}
        <motion.div {...staggerProps}>
          {children}
        </motion.div>
      </motion.section>
    );
  }),
);

ShowcaseSection.displayName = 'ShowcaseSection';

ShowcaseSection.propTypes = {
  /** Section content. */
  children: PropTypes.node,
  /** Section ID. */
  id: PropTypes.string,
  /** Section label. */
  label: PropTypes.node,
  /** Section icon. */
  icon: PropTypes.node,
  /** Section description. */
  description: PropTypes.node,
  /** Visual variant. */
  variant: PropTypes.oneOf(['default', 'dark', 'glass', 'minimal', 'gradient']),
  /** Size preset. */
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl', 'full']),
  /** Text alignment. */
  align: PropTypes.oneOf(['left', 'center', 'right']),
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

export default ShowcaseSection;