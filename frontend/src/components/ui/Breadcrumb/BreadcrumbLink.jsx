/**
 * KisanO Design System — Breadcrumb Package
 * BreadcrumbLink
 *
 * A link component for breadcrumb navigation. Supports active states,
 * icons, hover and focus states with accessibility.
 *
 * Single Responsibility: Render one breadcrumb link.
 * Does not manage breadcrumb state or business logic.
 *
 * @module components/ui/Breadcrumb/BreadcrumbLink
 */

import { forwardRef, memo, useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import { motion, useReducedMotion } from 'framer-motion';

import {
  BREADCRUMB_DEFAULTS,
} from './breadcrumbVariants';
import {
  mergeClasses,
  resolveResponsiveClasses,
  getBreadcrumbLinkClasses,
} from './breadcrumbUtils';

/* ---------------------------------- */
/* Component-specific tokens          */
/* ---------------------------------- */

/** Motion variants for link interaction. */
const LINK_MOTION = {
  initial: { scale: 1 },
  hover: { scale: 1.02 },
  tap: { scale: 0.98 },
  transition: { duration: 0.15, ease: [0.4, 0, 0.2, 1] },
};

/* ---------------------------------- */
/* Component                          */
/* ---------------------------------- */

/**
 * BreadcrumbLink – a link for breadcrumb navigation.
 *
 * @component
 * @example
 * <BreadcrumbLink href="/" active>
 *   Home
 * </BreadcrumbLink>
 *
 * @example
 * <BreadcrumbLink href="/products" icon={<ProductIcon />}>
 *   Products
 * </BreadcrumbLink>
 */
const BreadcrumbLink = memo(
  forwardRef(function BreadcrumbLink(
    {
      children,
      href,
      icon,
      active = false,
      disabled = false,
      loading = false,
      onClick,
      variant = BREADCRUMB_DEFAULTS.variant,
      size = BREADCRUMB_DEFAULTS.size,
      responsive,
      className = '',
      role = 'link',
      'aria-label': ariaLabel,
      ...rest
    },
    ref,
  ) {
    const prefersReducedMotion = useReducedMotion();

    // Link classes.
    const linkClasses = useMemo(
      () =>
        getBreadcrumbLinkClasses({
          variant,
          size,
          className,
          active,
          disabled,
          loading,
        }),
      [variant, size, className, active, disabled, loading],
    );

    // Responsive overrides.
    const responsiveClasses = useMemo(
      () => (responsive ? resolveResponsiveClasses(responsive) : ''),
      [responsive],
    );

    const finalClasses = useMemo(
      () => mergeClasses(linkClasses, responsiveClasses),
      [linkClasses, responsiveClasses],
    );

    // Handle click.
    const handleClick = useCallback(
      (event) => {
        if (disabled || loading) return;
        onClick?.(event);
      },
      [disabled, loading, onClick],
    );

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
        whileHover: LINK_MOTION.hover,
        whileTap: LINK_MOTION.tap,
        transition: LINK_MOTION.transition,
      };
    }, [prefersReducedMotion, disabled, loading]);

    // Accessibility attributes.
    const ariaProps = useMemo(
      () => ({
        role,
        'aria-label': ariaLabel || (typeof children === 'string' ? children : 'Breadcrumb link'),
        'aria-current': active ? 'page' : undefined,
        'aria-disabled': disabled || undefined,
        tabIndex: disabled ? -1 : 0,
        'data-active': active || undefined,
        'data-disabled': disabled || undefined,
      }),
      [role, ariaLabel, children, active, disabled],
    );

    // Render content.
    const content = (
      <>
        {icon && <span className="shrink-0 mr-1.5">{icon}</span>}
        <span className="truncate">{children}</span>
      </>
    );

    // If href is provided, render as link.
    if (href) {
      return (
        <motion.a
          ref={ref}
          href={href}
          className={finalClasses}
          onClick={handleClick}
          {...motionProps}
          {...ariaProps}
          {...rest}
        >
          {content}
        </motion.a>
      );
    }

    // Otherwise, render as span.
    return (
      <motion.span
        ref={ref}
        className={finalClasses}
        onClick={handleClick}
        {...motionProps}
        {...ariaProps}
        {...rest}
      >
        {content}
      </motion.span>
    );
  }),
);

BreadcrumbLink.displayName = 'BreadcrumbLink';

BreadcrumbLink.propTypes = {
  /** Link content. */
  children: PropTypes.node,
  /** Link href. */
  href: PropTypes.string,
  /** Icon element. */
  icon: PropTypes.node,
  /** Active state. */
  active: PropTypes.bool,
  /** Disabled state. */
  disabled: PropTypes.bool,
  /** Loading state. */
  loading: PropTypes.bool,
  /** Click handler. */
  onClick: PropTypes.func,
  /** Visual variant. */
  variant: PropTypes.oneOf(['default', 'primary', 'dark', 'filled', 'minimal']),
  /** Size preset. */
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
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

export default BreadcrumbLink;