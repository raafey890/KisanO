/**
 * KisanO Design System — Textarea Package
 * TextareaContainer
 *
 * The container component that wraps the textarea and its associated elements.
 * Handles layout, styling, and accessibility attributes.
 *
 * Single Responsibility: Render the textarea container with layout and styling.
 * Does not manage textarea state or business logic.
 *
 * @module components/ui/Textarea/TextareaContainer
 */

import { forwardRef, memo, useMemo } from 'react';
import PropTypes from 'prop-types';
import { motion, useReducedMotion } from 'framer-motion';

import {
  TEXTAREA_DEFAULTS,
} from './textareaVariants';
import {
  mergeClasses,
  resolveResponsiveClasses,
  resolveDefaultProps,
  getTextareaContainerClasses,
} from './textareaUtils';

/* ---------------------------------- */
/* Component-specific tokens          */
/* ---------------------------------- */

/** Motion variants for container animation. */
const CONTAINER_MOTION = {
  initial: { opacity: 0, y: 4 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.15, ease: [0.4, 0, 0.2, 1] },
};

/* ---------------------------------- */
/* Component                          */
/* ---------------------------------- */

/**
 * TextareaContainer – the main textarea wrapper with layout and styling.
 *
 * @component
 * @example
 * <TextareaContainer variant="default" size="md">
 *   <TextareaLabel>Description</TextareaLabel>
 *   <textarea />
 * </TextareaContainer>
 */
const TextareaContainer = memo(
  forwardRef(function TextareaContainer(
    {
      children,
      variant = TEXTAREA_DEFAULTS.variant,
      size = TEXTAREA_DEFAULTS.size,
      disabled = false,
      readOnly = false,
      loading = false,
      error = false,
      success = false,
      warning = false,
      isFocused = false,
      responsive,
      className = '',
      role = 'none',
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
        }),
      [variant, size, disabled],
    );

    // Container classes.
    const containerClasses = useMemo(() => {
      const base = getTextareaContainerClasses({
        className,
        disabled: resolved.disabled,
        loading,
      });
      return responsive ? mergeClasses(base, resolveResponsiveClasses(responsive)) : base;
    }, [className, resolved.disabled, loading, responsive]);

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
        'aria-disabled': resolved.disabled || undefined,
        'aria-readonly': readOnly || undefined,
        'aria-busy': loading || undefined,
        'aria-invalid': error || undefined,
      }),
      [role, resolved.disabled, readOnly, loading, error],
    );

    // Data attributes for styling.
    const dataAttributes = useMemo(
      () => ({
        'data-variant': resolved.variant,
        'data-size': resolved.size,
        'data-disabled': resolved.disabled || undefined,
        'data-readonly': readOnly || undefined,
        'data-loading': loading || undefined,
        'data-error': error || undefined,
        'data-success': success || undefined,
        'data-warning': warning || undefined,
        'data-focused': isFocused || undefined,
      }),
      [
        resolved.variant,
        resolved.size,
        resolved.disabled,
        readOnly,
        loading,
        error,
        success,
        warning,
        isFocused,
      ],
    );

    return (
      <motion.div
        ref={ref}
        className={containerClasses}
        {...motionProps}
        {...ariaProps}
        {...dataAttributes}
        {...rest}
      >
        {children}
      </motion.div>
    );
  }),
);

TextareaContainer.displayName = 'TextareaContainer';

TextareaContainer.propTypes = {
  /** Textarea content (Label, textarea, helper, etc.). */
  children: PropTypes.node,
  /** Visual variant. */
  variant: PropTypes.oneOf(['default', 'filled', 'outlined', 'ghost']),
  /** Size preset. */
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
  /** Disabled state. */
  disabled: PropTypes.bool,
  /** Read-only state. */
  readOnly: PropTypes.bool,
  /** Loading state. */
  loading: PropTypes.bool,
  /** Error state. */
  error: PropTypes.bool,
  /** Success state. */
  success: PropTypes.bool,
  /** Warning state. */
  warning: PropTypes.bool,
  /** Whether the textarea is focused. */
  isFocused: PropTypes.bool,
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
};

export default TextareaContainer;