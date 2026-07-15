/**
 * KisanO Design System — Breadcrumb Package
 * BreadcrumbContainer
 *
 * The container component that wraps the breadcrumb and handles layout,
 * styling, and accessibility attributes.
 *
 * Single Responsibility: Render the breadcrumb container with layout and styling.
 * Does not manage breadcrumb state or business logic.
 *
 * @module components/ui/Breadcrumb/BreadcrumbContainer
 */

import { forwardRef, memo, useMemo } from 'react';
import PropTypes from 'prop-types';
import { motion, useReducedMotion } from 'framer-motion';

import {
  BREADCRUMB_DEFAULTS,
} from './breadcrumbVariants';
import {
  mergeClasses,
  resolveResponsiveClasses,
  resolveDefaultProps,
  getBreadcrumbClasses,
  getBreadcrumbContainerClasses,
} from './breadcrumbUtils';

/* ---------------------------------- */
/* Component-specific tokens          */
/* ---------------------------------- */

/** Motion variants for container animation. */
const CONTAINER_MOTION = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: 0.2, ease: [0.4, 0, 0.2, 1] },
};

/** Alignment mapping. */
const ALIGNMENT_MAP = {
  left: 'justify-start',
  center: 'justify-center',
  right: 'justify-end',
};

/** Default alignment when not provided. */
const DEFAULT_ALIGN = 'left';

/* ---------------------------------- */
/* Component                          */
/* ---------------------------------- */

/**
 * BreadcrumbContainer – the main breadcrumb wrapper with layout and styling.
 *
 * @component
 * @example
 * <BreadcrumbContainer variant="default" size="md" align="center">
 *   <BreadcrumbItem>Home</BreadcrumbItem>
 *   <BreadcrumbItem>Products</BreadcrumbItem>
 * </BreadcrumbContainer>
 */
const BreadcrumbContainer = memo(
  forwardRef(function BreadcrumbContainer(
    {
      children,
      variant = BREADCRUMB_DEFAULTS.variant,
      size = BREADCRUMB_DEFAULTS.size,
      align = DEFAULT_ALIGN,
      disabled = false,
      loading = false,
      responsive,
      className = '',
      role = 'navigation',
      'aria-label': ariaLabel = 'Breadcrumb',
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
          disabled,
          loading,
        }),
      [variant, size, disabled, loading],
    );

    // Alignment classes.
    const alignClasses = useMemo(
      () => ALIGNMENT_MAP[align] || ALIGNMENT_MAP[DEFAULT_ALIGN],
      [align],
    );

    // Breadcrumb classes.
    const breadcrumbClasses = useMemo(
      () =>
        getBreadcrumbClasses({
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
        getBreadcrumbContainerClasses({
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
      () => mergeClasses(breadcrumbClasses, alignClasses, responsiveClasses),
      [breadcrumbClasses, alignClasses, responsiveClasses],
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
        'data-align': align,
      }),
      [role, ariaLabel, resolved.disabled, resolved.loading, resolved.variant, resolved.size, align],
    );

    return (
      <motion.nav
        ref={ref}
        className={finalClasses}
        {...motionProps}
        {...ariaProps}
        {...rest}
      >
        <div className={containerClasses}>
          {children}
        </div>
      </motion.nav>
    );
  }),
);

BreadcrumbContainer.displayName = 'BreadcrumbContainer';

BreadcrumbContainer.propTypes = {
  /** Breadcrumb content (items). */
  children: PropTypes.node,
  /** Visual variant. */
  variant: PropTypes.oneOf(['default', 'primary', 'dark', 'filled', 'minimal']),
  /** Size preset. */
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
  /** Alignment of breadcrumb items. */
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

export default BreadcrumbContainer;