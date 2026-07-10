/**
 * KisanO Design System — Button Package
 * ButtonContainer
 *
 * The reusable wrapper component for every Button in the KisanO Design System.
 * It owns the field-level layout (icon slot, label slot, loader slot, content slot),
 * state-aware styling (hover, focus-within, disabled, loading, error, warning, success),
 * entrance/interaction animations via Framer Motion, and the ARIA wiring shared by
 * all Button compositions.
 *
 * Single Responsibility: this component only wraps and orchestrates — it never
 * renders icon, text, or loader. Children (Icon, Loader, ButtonContent) are
 * rendered as-is inside the container.
 *
 * @module components/ui/Button/ButtonContainer
 */
import { forwardRef, useMemo, useState, useCallback, memo } from 'react';
import PropTypes from 'prop-types';
import { motion, useReducedMotion } from 'framer-motion';
import {
  mergeClasses,
  getButtonClasses,
  resolveDefaultProps,
} from './buttonUtils';
/* ---------------------------------- */
/* Motion Presets */
/* ---------------------------------- */
const MOTION_DURATION = Object.freeze({
  fast: 0.15,
  normal: 0.25,
  slow: 0.35,
  duration: MOTION_DURATION.normal
});
const ERROR_SHAKE = {
  x: [0, -3, 3, -2, 2, 0],
  transition: { duration: MOTION_DURATION.slow, ease: 'easeInOut' },
};
const FOCUS_LIFT = {
  y: -0.5,
  scale: 1.005,
  transition: { duration: MOTION_DURATION.fast, ease: [0.23, 1, 0.32, 1] },
};
/* ---------------------------------- */
/* Helpers */
/* ---------------------------------- */
function resolveStatus({ error, success, warning }) {
  if (error) return 'error';
  if (warning) return 'warning';
  if (success) return 'success';
  return 'none';
}
function mergeEventHandlers(internalHandler, externalHandler) {
  if (!externalHandler) return internalHandler;
  return (event) => {
    internalHandler(event);
    if (externalHandler) externalHandler(event);
  };
}
/* ---------------------------------- */
/* Component */
/* ---------------------------------- */
const ButtonContainer = memo(
  forwardRef(function ButtonContainer(
    {
      children,
variant = 'primary',
size = 'md',
shape = 'default',
error = false,
success = false,
warning = false,
loading = false,
disabled = false,
readOnly = false,
    },
    ref,
  ) {
    const prefersReducedMotion = useReducedMotion();
    const [isFocused, setIsFocused] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const status = useMemo(
      () => resolveStatus({ error, success, warning }),
      [error, success, warning],
    );
    const isInteractive = !disabled && !readOnly;
    const resolvedProps = useMemo(
  () =>
    resolveDefaultProps({
      variant,
      size,
      shape,
      isDisabled: disabled,
      isLoading: loading,
      isHovered,
      isFocused,
      className: '',
      baseClass: 'btn',
    }),
  [variant, size, shape, disabled, loading, isHovered, isFocused],
);

const buttonClasses = useMemo(
  () =>
    mergeClasses(
      getButtonClasses({
        isDisabled: disabled,
        isLoading: loading,
        isHovered,
        isFocused,
        variant: resolvedProps.variant,
        size: resolvedProps.size,
        shape: resolvedProps.shape,
        className: resolvedProps.className,
        baseClass: resolvedProps.baseClass,
      }),
      className,
    ),
  [disabled, loading, isHovered, isFocused, resolvedProps, className],
);
    
    const containerClasses = useMemo(
  () =>
    mergeClasses(
      'group relative inline-flex items-center justify-center',
      'focus:outline-none',
      'transition-all duration-200 ease-in-out',
      fullWidth && 'w-full',
      withMargin && 'mb-4',
      buttonClasses,
    ),
  [buttonClasses, fullWidth, withMargin],
);
    const ariaProps = useMemo(() => {
  const attrs = {
    role: 'button',
    tabIndex: disabled ? -1 : 0,
    'aria-disabled': disabled || undefined,
  };

  if (loading) {
    attrs['aria-busy'] = true;
  }

  if (status === 'error') {
    attrs['aria-invalid'] = true;
  }

  if (readOnly) {
    attrs['aria-readonly'] = true;
  }

  return attrs;
}, [disabled, loading, readOnly, status]);
    const motionProps = useMemo(() => {
      const shouldAnimate = animate && !prefersReducedMotion;
      const hasErrorShake = status === 'error' && !prefersReducedMotion;
      const baseAnimate = hasErrorShake 
        ? { ...CONTAINER_MOTION.animate, ...ERROR_SHAKE }
        : (isFocused && isInteractive && !prefersReducedMotion 
            ? { ...CONTAINER_MOTION.animate, ...FOCUS_LIFT } 
            : CONTAINER_MOTION.animate);
      if (shouldAnimate) {
        return {
          initial: CONTAINER_MOTION.initial,
          animate: baseAnimate,
          transition: CONTAINER_MOTION.transition,
          whileHover: isInteractive && !prefersReducedMotion 
            ? { scale: 1.02, y: -0.5 } 
            : undefined,
        };
      }
      return {
        initial: false,
        animate: hasErrorShake ? ERROR_SHAKE : (isFocused && isInteractive ? FOCUS_LIFT : undefined),
      };
    }, [animate, prefersReducedMotion, status, isFocused, isInteractive]);
    const handleFocus = useCallback(() => {
      if (!disabled) setIsFocused(true);
    }, [disabled]);
    const handleBlur = useCallback(
      (event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          setIsFocused(false);
        }
      },
      [],
    );
    const handleMouseEnter = useCallback(() => {
      if (isInteractive) setIsHovered(true);
    }, [isInteractive]);
    const handleMouseLeave = useCallback(() => {
      setIsHovered(false);
    }, []);
    const mergedHandlers = useMemo(() => {
      const { onFocus, onBlur, onMouseEnter, onMouseLeave, ...otherRest } = rest;
      return {
        onFocus: mergeEventHandlers(handleFocus, onFocus),
        onBlur: mergeEventHandlers(handleBlur, onBlur),
        onMouseEnter: mergeEventHandlers(handleMouseEnter, onMouseEnter),
        onMouseLeave: mergeEventHandlers(handleMouseLeave, onMouseLeave),
        ...otherRest,
      };
    }, [rest, handleFocus, handleBlur, handleMouseEnter, handleMouseLeave]);
    return (
      <motion.button
        ref={ref}
        id={id}
        className={containerClasses}
        data-status={status}
        data-focused={isFocused || undefined}
        data-hovered={isHovered || undefined}
        data-disabled={disabled || undefined}
        data-readonly={readOnly || undefined}
        data-loading={loading || undefined}
        {...ariaProps}
        {...mergedHandlers}
        {...motionProps}
      >
        {children}
      </motion.button>
    );
  }),
);

Object.freeze(ERROR_SHAKE);
Object.freeze(FOCUS_LIFT);
Object.freeze(MOTION_DURATION);
ButtonContainer.displayName = 'ButtonContainer';
ButtonContainer.propTypes = {
  children: PropTypes.node,
  error: PropTypes.bool,
  success: PropTypes.bool,
  warning: PropTypes.bool,
  loading: PropTypes.bool,
  disabled: PropTypes.bool,
  readOnly: PropTypes.bool,
  fullWidth: PropTypes.bool,
  withMargin: PropTypes.bool,
  animate: PropTypes.bool,
  className: PropTypes.string,
  id: PropTypes.string,
};
export default ButtonContainer;