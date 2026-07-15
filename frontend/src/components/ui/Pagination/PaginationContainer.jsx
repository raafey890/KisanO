/**
 * KisanO Design System — Pagination Package
 * PaginationContainer
 *
 * The container component that wraps the pagination and handles layout,
 * styling, and accessibility attributes.
 *
 * Single Responsibility: Render the pagination container with layout and styling.
 * Does not manage pagination state or business logic.
 *
 * @module components/ui/Pagination/PaginationContainer
 */

import { forwardRef, memo, useMemo } from 'react';
import PropTypes from 'prop-types';
import { motion, useReducedMotion } from 'framer-motion';

import {
  PAGINATION_DEFAULTS,
} from './paginationVariants';
import {
  mergeClasses,
  resolveResponsiveClasses,
  resolveDefaultProps,
  getPaginationClasses,
  getPaginationContainerClasses,
} from './paginationUtils';

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
const DEFAULT_ALIGN = 'center';

/* ---------------------------------- */
/* Component                          */
/* ---------------------------------- */

/**
 * PaginationContainer – the main pagination wrapper with layout and styling.
 *
 * @component
 * @example
 * <PaginationContainer variant="default" size="md" align="center">
 *   <PaginationButton>1</PaginationButton>
 *   <PaginationButton>2</PaginationButton>
 * </PaginationContainer>
 */
const PaginationContainer = memo(
  forwardRef(function PaginationContainer(
    {
      children,
      variant = PAGINATION_DEFAULTS.variant,
      size = PAGINATION_DEFAULTS.size,
      align = DEFAULT_ALIGN,
      disabled = false,
      loading = false,
      responsive,
      className = '',
      role = 'navigation',
      'aria-label': ariaLabel = 'Pagination',
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

    // Pagination classes.
    const paginationClasses = useMemo(
      () =>
        getPaginationClasses({
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
        getPaginationContainerClasses({
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
      () => mergeClasses(paginationClasses, alignClasses, responsiveClasses),
      [paginationClasses, alignClasses, responsiveClasses],
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

PaginationContainer.displayName = 'PaginationContainer';

PaginationContainer.propTypes = {
  /** Pagination content (buttons, ellipsis, etc.). */
  children: PropTypes.node,
  /** Visual variant. */
  variant: PropTypes.oneOf(['default', 'primary', 'dark', 'outline', 'ghost']),
  /** Size preset. */
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
  /** Alignment of pagination items. */
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

export default PaginationContainer;