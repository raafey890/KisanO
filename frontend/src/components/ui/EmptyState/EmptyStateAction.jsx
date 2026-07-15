/**
 * KisanO Design System — EmptyState Package
 * EmptyStateAction
 *
 * The action component for empty states. Renders primary and
 * secondary action buttons with icon support.
 *
 * Single Responsibility: Render empty state action buttons.
 * Does not manage empty state or business logic.
 *
 * @module components/ui/EmptyState/EmptyStateAction
 */

import { forwardRef, memo, useMemo } from 'react';
import PropTypes from 'prop-types';
import { motion, useReducedMotion } from 'framer-motion';

import {
  EMPTYSTATE_DEFAULTS,
} from './emptyStateVariants';
import {
  mergeClasses,
  resolveResponsiveClasses,
  getEmptyStateActionClasses,
} from './emptyStateUtils';

/* ---------------------------------- */
/* Component-specific tokens          */
/* ---------------------------------- */

/** Motion variants for action animation. */
const ACTION_MOTION = {
  initial: { opacity: 0, scale: 0.9 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.9 },
  transition: { duration: 0.15, ease: [0.4, 0, 0.2, 1] },
};

/** Alignment mapping. */
const ALIGNMENT_MAP = {
  left: 'justify-start',
  center: 'justify-center',
  right: 'justify-end',
};

/** Default alignment when not provided. */
const DEFAULT_ALIGN = 'center';

/** Primary button default variants. */
const PRIMARY_VARIANTS = {
  primary: 'bg-blue-600 text-white hover:bg-blue-700',
  secondary: 'bg-gray-600 text-white hover:bg-gray-700',
  success: 'bg-green-600 text-white hover:bg-green-700',
  warning: 'bg-yellow-600 text-white hover:bg-yellow-700',
  error: 'bg-red-600 text-white hover:bg-red-700',
  outline: 'border border-gray-300 text-gray-700 hover:bg-gray-50',
  ghost: 'text-gray-700 hover:bg-gray-50',
};

/** Secondary button default variants. */
const SECONDARY_VARIANTS = {
  primary: 'text-blue-600 hover:bg-blue-50',
  secondary: 'text-gray-600 hover:bg-gray-50',
  success: 'text-green-600 hover:bg-green-50',
  warning: 'text-yellow-600 hover:bg-yellow-50',
  error: 'text-red-600 hover:bg-red-50',
  outline: 'border border-gray-300 text-gray-700 hover:bg-gray-50',
  ghost: 'text-gray-700 hover:bg-gray-50',
};

/** Default variant when not provided. */
const DEFAULT_VARIANT = 'primary';

/** Default size when not provided. */
const DEFAULT_SIZE = 'md';

/* ---------------------------------- */
/* Component                          */
/* ---------------------------------- */

/**
 * EmptyStateAction – action buttons for empty states.
 *
 * @component
 * @example
 * <EmptyStateAction
 *   primaryAction={{ label: 'Add Item', onClick: handleAdd }}
 * />
 *
 * @example
 * <EmptyStateAction
 *   primaryAction={{ label: 'Create' }}
 *   secondaryAction={{ label: 'Learn More' }}
 *   alignment="center"
 * />
 */
const EmptyStateAction = memo(
  forwardRef(function EmptyStateAction(
    {
      primaryAction,
      secondaryAction,
      alignment = DEFAULT_ALIGN,
      disabled = false,
      loading = false,
      responsive,
      className = '',
      role = 'group',
      'aria-label': ariaLabel = 'Actions',
      ...rest
    },
    ref,
  ) {
    const prefersReducedMotion = useReducedMotion();

    // Action classes.
    const actionClasses = useMemo(
      () =>
        getEmptyStateActionClasses({
          className,
          disabled,
          loading,
        }),
      [className, disabled, loading],
    );

    // Responsive overrides.
    const responsiveClasses = useMemo(
      () => (responsive ? resolveResponsiveClasses(responsive) : ''),
      [responsive],
    );

    const finalClasses = useMemo(
      () => mergeClasses(actionClasses, responsiveClasses),
      [actionClasses, responsiveClasses],
    );

    // Alignment classes.
    const alignClasses = useMemo(
      () => ALIGNMENT_MAP[alignment] || ALIGNMENT_MAP[DEFAULT_ALIGN],
      [alignment],
    );

    // Motion props - respect reduced motion.
    const motionProps = useMemo(() => {
      if (prefersReducedMotion) {
        return { initial: false, animate: true, exit: false };
      }
      return ACTION_MOTION;
    }, [prefersReducedMotion]);

    // Render a single action button.
    const renderButton = (action, isPrimary = true) => {
      if (!action) return null;

      const {
        label,
        icon,
        onClick,
        variant = DEFAULT_VARIANT,
        size = DEFAULT_SIZE,
        disabled: actionDisabled,
        loading: actionLoading,
        className: actionClassName,
        ...actionRest
      } = action;

      const isDisabled = disabled || actionDisabled;
      const isLoading = loading || actionLoading;

      // Determine button styles based on variant and primary/secondary.
      const variantStyles = isPrimary
        ? PRIMARY_VARIANTS[variant] || PRIMARY_VARIANTS[DEFAULT_VARIANT]
        : SECONDARY_VARIANTS[variant] || SECONDARY_VARIANTS[DEFAULT_VARIANT];

      // Size styles.
      const sizeStyles = {
        xs: 'px-2.5 py-1 text-xs',
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-4 py-2 text-sm',
        lg: 'px-5 py-2.5 text-base',
        xl: 'px-6 py-3 text-base',
      }[size] || 'px-4 py-2 text-sm';

      const buttonClasses = mergeClasses(
        'inline-flex items-center justify-center gap-2',
        'font-medium rounded-md',
        'transition-all duration-200 ease-in-out',
        'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
        variantStyles,
        sizeStyles,
        isDisabled && 'opacity-50 cursor-not-allowed pointer-events-none',
        isLoading && 'opacity-70 cursor-progress',
        actionClassName,
      );

      return (
        <button
          key={isPrimary ? 'primary' : 'secondary'}
          type="button"
          className={buttonClasses}
          onClick={onClick}
          disabled={isDisabled}
          aria-disabled={isDisabled}
          {...actionRest}
        >
          {isLoading && (
            <svg
              className="animate-spin h-4 w-4 shrink-0"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 0 1 8-8v4a4 4 0 0 0-4 4H4z" />
            </svg>
          )}
          {!isLoading && icon && <span className="shrink-0">{icon}</span>}
          {label}
        </button>
      );
    };

    // Accessibility attributes.
    const ariaProps = useMemo(
      () => ({
        role,
        'aria-label': ariaLabel,
        'aria-disabled': disabled || undefined,
        'aria-busy': loading || undefined,
      }),
      [role, ariaLabel, disabled, loading],
    );

    // If no actions, render nothing.
    if (!primaryAction && !secondaryAction) {
      return null;
    }

    return (
      <motion.div
        ref={ref}
        className={mergeClasses(finalClasses, alignClasses)}
        {...motionProps}
        {...ariaProps}
        {...rest}
      >
        {renderButton(secondaryAction, false)}
        {renderButton(primaryAction, true)}
      </motion.div>
    );
  }),
);

EmptyStateAction.displayName = 'EmptyStateAction';

EmptyStateAction.propTypes = {
  /** Primary action configuration. */
  primaryAction: PropTypes.shape({
    label: PropTypes.node,
    icon: PropTypes.node,
    onClick: PropTypes.func,
    variant: PropTypes.oneOf(['primary', 'secondary', 'success', 'warning', 'error', 'outline', 'ghost']),
    size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
    disabled: PropTypes.bool,
    loading: PropTypes.bool,
    className: PropTypes.string,
  }),
  /** Secondary action configuration. */
  secondaryAction: PropTypes.shape({
    label: PropTypes.node,
    icon: PropTypes.node,
    onClick: PropTypes.func,
    variant: PropTypes.oneOf(['primary', 'secondary', 'success', 'warning', 'error', 'outline', 'ghost']),
    size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
    disabled: PropTypes.bool,
    loading: PropTypes.bool,
    className: PropTypes.string,
  }),
  /** Alignment of actions. */
  alignment: PropTypes.oneOf(['left', 'center', 'right']),
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

export default EmptyStateAction;