/**
 * KisanO Design System — Showcase Package
 * ShowcaseContainer
 *
 * The container component that wraps the showcase and handles layout,
 * positioning, and accessibility attributes.
 *
 * Single Responsibility: Render the showcase container with layout and styling.
 * Does not manage showcase state or business logic.
 *
 * @module components/ui/Showcase/ShowcaseContainer
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
  resolveDefaultProps,
  getShowcaseClasses,
  getShowcaseContainerClasses,
} from './showcaseUtils';

/* ---------------------------------- */
/* Component-specific tokens          */
/* ---------------------------------- */

/** Motion variants for container animation. */
const CONTAINER_MOTION = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
};

/** Container variants. */
const CONTAINER_VARIANTS = {
  full: 'max-w-full',
  wide: 'max-w-7xl',
  normal: 'max-w-5xl',
  narrow: 'max-w-3xl',
};

/** Default container variant when not provided. */
const DEFAULT_CONTAINER = 'wide';

/* ---------------------------------- */
/* Component                          */
/* ---------------------------------- */

/**
 * ShowcaseContainer – the main showcase wrapper with layout and styling.
 *
 * @component
 * @example
 * <ShowcaseContainer variant="default" size="md" containerVariant="wide">
 *   <ShowcaseHeader />
 *   <ShowcaseSection />
 * </ShowcaseContainer>
 */
const ShowcaseContainer = memo(
  forwardRef(function ShowcaseContainer(
    {
      children,
      variant = SHOWCASE_DEFAULTS.variant,
      size = SHOWCASE_DEFAULTS.size,
      layout = SHOWCASE_DEFAULTS.layout,
      containerVariant = DEFAULT_CONTAINER,
      responsive = true,
      disabled = false,
      loading = false,
      responsiveClasses,
      className = '',
      role = 'region',
      'aria-label': ariaLabel = 'Component showcase',
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
          layout,
          responsive,
          disabled,
          loading,
        }),
      [variant, size, layout, responsive, disabled, loading],
    );

    // Container width class.
    const containerWidth = useMemo(
      () => CONTAINER_VARIANTS[containerVariant] || CONTAINER_VARIANTS[DEFAULT_CONTAINER],
      [containerVariant],
    );

    // Showcase classes.
    const showcaseClasses = useMemo(
      () =>
        getShowcaseClasses({
          variant: resolved.variant,
          size: resolved.size,
          layout: resolved.layout,
          className,
          disabled: resolved.disabled,
          loading: resolved.loading,
        }),
      [
        resolved.variant,
        resolved.size,
        resolved.layout,
        className,
        resolved.disabled,
        resolved.loading,
      ],
    );

    // Container classes.
    const containerClasses = useMemo(
      () =>
        getShowcaseContainerClasses({
          className: '',
          disabled: resolved.disabled,
          loading: resolved.loading,
          responsive: resolved.responsive,
        }),
      [resolved.disabled, resolved.loading, resolved.responsive],
    );

    // Responsive overrides.
    const responsiveOverrideClasses = useMemo(
      () => (responsiveClasses ? resolveResponsiveClasses(responsiveClasses) : ''),
      [responsiveClasses],
    );

    const finalClasses = useMemo(
      () => mergeClasses(showcaseClasses, containerWidth, responsiveOverrideClasses),
      [showcaseClasses, containerWidth, responsiveOverrideClasses],
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
        'aria-disabled': resolved.disabled || undefined,
        'aria-busy': resolved.loading || undefined,
        'data-variant': resolved.variant,
        'data-size': resolved.size,
        'data-layout': resolved.layout,
        'data-container': containerVariant,
      }),
      [
        role,
        ariaLabel,
        resolved.variant,
        resolved.disabled,
        resolved.loading,
        resolved.size,
        resolved.layout,
        containerVariant,
      ],
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

ShowcaseContainer.displayName = 'ShowcaseContainer';

ShowcaseContainer.propTypes = {
  /** Showcase content (Header, Sections, etc.). */
  children: PropTypes.node,
  /** Visual variant. */
  variant: PropTypes.oneOf(['default', 'dark', 'glass', 'minimal', 'gradient']),
  /** Size preset. */
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl', 'full']),
  /** Layout type. */
  layout: PropTypes.oneOf(['row', 'column', 'grid', 'carousel', 'masonry']),
  /** Container width variant. */
  containerVariant: PropTypes.oneOf(['full', 'wide', 'normal', 'narrow']),
  /** Responsive container. */
  responsive: PropTypes.bool,
  /** Disabled state. */
  disabled: PropTypes.bool,
  /** Loading state. */
  loading: PropTypes.bool,
  /** Responsive overrides. */
  responsiveClasses: PropTypes.shape({
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

export default ShowcaseContainer;