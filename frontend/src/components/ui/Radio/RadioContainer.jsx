/**
 * KisanO Design System — Radio Package
 * RadioContainer
 *
 * The container component that wraps the radio input and visual elements.
 * Handles layout, styling, and accessibility attributes.
 *
 * Single Responsibility: Render the radio container with layout and styling.
 * Does not manage radio state or business logic.
 *
 * @module components/ui/Radio/RadioContainer
 */

import { forwardRef, memo, useMemo } from 'react';
import PropTypes from 'prop-types';
import { motion, useReducedMotion } from 'framer-motion';

import {
  RADIO_DEFAULTS,
} from './radioVariants';
import {
  mergeClasses,
  resolveResponsiveClasses,
  resolveDefaultProps,
  getRadioContainerClasses,
} from './radioUtils';

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
 * RadioContainer – the main radio wrapper with layout and styling.
 *
 * @component
 * @example
 * <RadioContainer variant="primary" size="md">
 *   <RadioIndicator />
 *   <RadioLabel>Option 1</RadioLabel>
 * </RadioContainer>
 */
const RadioContainer = memo(
  forwardRef(function RadioContainer(
    {
      children,
      variant = RADIO_DEFAULTS.variant,
      size = RADIO_DEFAULTS.size,
      disabled = false,
      loading = false,
      checked = false,
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
          checked,
        }),
      [variant, size, disabled, checked],
    );

    // Container classes.
    const containerClasses = useMemo(() => {
      const base = getRadioContainerClasses({
        className,
        disabled: resolved.disabled,
      });
      return responsive ? mergeClasses(base, resolveResponsiveClasses(responsive)) : base;
    }, [className, resolved.disabled, responsive]);

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
        'aria-busy': loading || undefined,
        'aria-checked': checked,
      }),
      [role, resolved.disabled, loading, checked],
    );

    // Data attributes for styling.
    const dataAttributes = useMemo(
      () => ({
        'data-variant': resolved.variant,
        'data-size': resolved.size,
        'data-disabled': resolved.disabled || undefined,
        'data-loading': loading || undefined,
        'data-checked': checked || undefined,
      }),
      [resolved.variant, resolved.size, resolved.disabled, loading, checked],
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

RadioContainer.displayName = 'RadioContainer';

RadioContainer.propTypes = {
  /** Radio content (Indicator, Label, etc.). */
  children: PropTypes.node,
  /** Visual variant. */
  variant: PropTypes.oneOf(['default', 'primary', 'secondary', 'success', 'warning', 'error']),
  /** Size preset. */
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
  /** Disabled state. */
  disabled: PropTypes.bool,
  /** Loading state. */
  loading: PropTypes.bool,
  /** Checked state. */
  checked: PropTypes.bool,
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

export default RadioContainer;