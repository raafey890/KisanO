/**
 * KisanO Design System — Pagination Package
 * PaginationButton
 *
 * A navigation button for pagination. Supports previous, next, first,
 * last, and page number buttons with active and disabled states.
 *
 * Single Responsibility: Render a pagination navigation button.
 * Does not manage pagination state or business logic.
 *
 * @module components/ui/Pagination/PaginationButton
 */

import { forwardRef, memo, useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import { motion, useReducedMotion } from 'framer-motion';

import {
  PAGINATION_DEFAULTS,
} from './paginationVariants';
import {
  mergeClasses,
  resolveResponsiveClasses,
  getPaginationButtonClasses,
} from './paginationUtils';

/* ---------------------------------- */
/* Component-specific tokens          */
/* ---------------------------------- */

/** Motion variants for button interaction. */
const BUTTON_MOTION = {
  initial: { scale: 1 },
  hover: { scale: 1.05 },
  tap: { scale: 0.95 },
  transition: { duration: 0.15, ease: [0.4, 0, 0.2, 1] },
};

/** Icon size mapping. */
const ICON_SIZES = {
  xs: 'h-3 w-3',
  sm: 'h-3.5 w-3.5',
  md: 'h-4 w-4',
  lg: 'h-4.5 w-4.5',
  xl: 'h-5 w-5',
};

/* ---------------------------------- */
/* Component                          */
/* ---------------------------------- */

/**
 * PaginationButton – a navigation button for pagination.
 *
 * @component
 * @example
 * <PaginationButton label="1" active onClick={handleClick} />
 *
 * @example
 * <PaginationButton label="Next" icon={<ChevronRight />} />
 */
const PaginationButton = memo(
  forwardRef(function PaginationButton(
    {
      children,
      label,
      icon,
      active = false,
      disabled = false,
      loading = false,
      onClick,
      variant = PAGINATION_DEFAULTS.variant,
      size = PAGINATION_DEFAULTS.size,
      radius = PAGINATION_DEFAULTS.radius,
      responsive,
      className = '',
      role = 'button',
      'aria-label': ariaLabel,
      ...rest
    },
    ref,
  ) {
    const prefersReducedMotion = useReducedMotion();

    // Button classes.
    const buttonClasses = useMemo(
      () =>
        getPaginationButtonClasses({
          variant,
          size,
          radius,
          className,
          active,
          disabled,
          loading,
        }),
      [variant, size, radius, className, active, disabled, loading],
    );

    // Responsive overrides.
    const responsiveClasses = useMemo(
      () => (responsive ? resolveResponsiveClasses(responsive) : ''),
      [responsive],
    );

    const finalClasses = useMemo(
      () => mergeClasses(buttonClasses, responsiveClasses),
      [buttonClasses, responsiveClasses],
    );

    // Icon size.
    const iconSize = useMemo(
      () => ICON_SIZES[size] || ICON_SIZES.md,
      [size],
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
        whileHover: BUTTON_MOTION.hover,
        whileTap: BUTTON_MOTION.tap,
        transition: BUTTON_MOTION.transition,
      };
    }, [prefersReducedMotion, disabled, loading]);

    // Accessibility attributes.
    const ariaProps = useMemo(
      () => ({
        role,
        'aria-label': ariaLabel || (typeof label === 'string' ? label : 'Page button'),
        'aria-current': active ? 'page' : undefined,
        'aria-disabled': disabled || undefined,
        tabIndex: disabled ? -1 : 0,
        'data-active': active || undefined,
        'data-disabled': disabled || undefined,
      }),
      [role, ariaLabel, label, active, disabled],
    );

    // Render content.
    const content = (
      <>
        {icon && <span className={mergeClasses(iconSize, 'shrink-0')}>{icon}</span>}
        {label && <span className="truncate">{children || label}</span>}
      </>
    );

    return (
      <motion.button
        ref={ref}
        type="button"
        className={finalClasses}
        onClick={handleClick}
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

PaginationButton.displayName = 'PaginationButton';

PaginationButton.propTypes = {
  /** Button content (alternative to label). */
  children: PropTypes.node,
  /** Button label. */
  label: PropTypes.node,
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
  variant: PropTypes.oneOf(['default', 'primary', 'dark', 'outline', 'ghost']),
  /** Size preset. */
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
  /** Border radius override. */
  radius: PropTypes.oneOf(['none', 'sm', 'md', 'lg', 'xl', '2xl', 'full']),
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

export default PaginationButton;