/**
 * KisanO Design System — Breadcrumb Package
 * BreadcrumbSeparator
 *
 * The separator component between breadcrumb items. Supports text
 * characters, custom icons, and responsive styling.
 *
 * Single Responsibility: Render a separator between breadcrumb items.
 * Does not manage breadcrumb state or business logic.
 *
 * @module components/ui/Breadcrumb/BreadcrumbSeparator
 */

import { forwardRef, memo, useMemo } from 'react';
import PropTypes from 'prop-types';
import { motion, useReducedMotion } from 'framer-motion';

import {
  BREADCRUMB_DEFAULTS,
  getBreadcrumbSeparator,
} from './breadcrumbVariants';
import {
  mergeClasses,
  resolveResponsiveClasses,
  getBreadcrumbSeparatorClasses,
} from './breadcrumbUtils';

/* ---------------------------------- */
/* Component-specific tokens          */
/* ---------------------------------- */

/** Motion variants for separator animation. */
const SEPARATOR_MOTION = {
  initial: { opacity: 0, scale: 0.8 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.8 },
  transition: { duration: 0.15, ease: [0.4, 0, 0.2, 1] },
};

/** Separator character mapping. */
const SEPARATOR_CHARS = {
  slash: '/',
  chevron: '›',
  arrow: '→',
  dot: '•',
  hyphen: '-',
  pipe: '|',
};

/* ---------------------------------- */
/* Component                          */
/* ---------------------------------- */

/**
 * BreadcrumbSeparator – a separator between breadcrumb items.
 *
 * @component
 * @example
 * <BreadcrumbSeparator separator="chevron" />
 *
 * @example
 * <BreadcrumbSeparator separator="custom">
 *   <CustomIcon />
 * </BreadcrumbSeparator>
 */
const BreadcrumbSeparator = memo(
  forwardRef(function BreadcrumbSeparator(
    {
      children,
      separator = BREADCRUMB_DEFAULTS.separator,
      size = BREADCRUMB_DEFAULTS.size,
      disabled = false,
      loading = false,
      responsive,
      className = '',
      role = 'separator',
      'aria-label': ariaLabel = 'Separator',
      ...rest
    },
    ref,
  ) {
    const prefersReducedMotion = useReducedMotion();

    // Get separator character.
    const separatorChar = useMemo(() => {
      if (children) return null;
      return getBreadcrumbSeparator(separator);
    }, [children, separator]);

    // Separator classes.
    const separatorClasses = useMemo(
      () =>
        getBreadcrumbSeparatorClasses({
          size,
          className,
          disabled,
        }),
      [size, className, disabled],
    );

    // Responsive overrides.
    const responsiveClasses = useMemo(
      () => (responsive ? resolveResponsiveClasses(responsive) : ''),
      [responsive],
    );

    const finalClasses = useMemo(
      () => mergeClasses(separatorClasses, responsiveClasses),
      [separatorClasses, responsiveClasses],
    );

    // Motion props - respect reduced motion.
    const motionProps = useMemo(() => {
      if (prefersReducedMotion) {
        return { initial: false, animate: true, exit: false };
      }
      return SEPARATOR_MOTION;
    }, [prefersReducedMotion]);

    // Accessibility attributes.
    const ariaProps = useMemo(
      () => ({
        role,
        'aria-label': ariaLabel,
        'aria-hidden': true,
        'data-separator': separator,
      }),
      [role, ariaLabel, separator],
    );

    // Render custom separator if children provided.
    if (children) {
      return (
        <motion.span
          ref={ref}
          className={finalClasses}
          {...motionProps}
          {...ariaProps}
          {...rest}
        >
          {children}
        </motion.span>
      );
    }

    // Render text separator.
    return (
      <motion.span
        ref={ref}
        className={finalClasses}
        {...motionProps}
        {...ariaProps}
        {...rest}
      >
        {separatorChar}
      </motion.span>
    );
  }),
);

BreadcrumbSeparator.displayName = 'BreadcrumbSeparator';

BreadcrumbSeparator.propTypes = {
  /** Custom separator content (overrides separator prop). */
  children: PropTypes.node,
  /** Separator type. */
  separator: PropTypes.oneOf(['slash', 'chevron', 'arrow', 'dot', 'hyphen', 'pipe', 'custom']),
  /** Size preset. */
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
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

export default BreadcrumbSeparator;