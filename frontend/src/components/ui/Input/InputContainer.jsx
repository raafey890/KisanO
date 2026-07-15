'use client';
/**
 * KisanO Design System — Input Package
 * InputContainer
 *
 * The reusable wrapper component for every Input in the KisanO Design System.
 * It owns the field-level layout (label slot, control slot, helper slot),
 * state-aware styling (hover, focus-within, error, success, warning, loading,
 * disabled, read-only), entrance/interaction animations via Framer Motion,
 * and the ARIA wiring shared by all Input compositions.
 *
 * Single Responsibility: this component only wraps and orchestrates — it never
 * renders an `<input>` itself. Children (Input, InputIcon, InputLabel, etc.)
 * are rendered as-is inside the container.
 */
import { forwardRef, useMemo, useState, useCallback, memo } from 'react';
import PropTypes from 'prop-types';
import { motion, useReducedMotion } from 'framer-motion';
import {
  INPUT_SPACING,
  INPUT_TRANSITIONS,
  INPUT_DEFAULTS,
  INPUT_ERROR_STATE,
  INPUT_LOADING_STATE,
  INPUT_READONLY_STATE,
} from './inputVariants';
import { mergeClasses, getContainerClasses } from './inputUtils';

/* ---------------------------------- */
/* Motion Presets - Declared Locally */
/* ---------------------------------- */

const MOTION_DURATION = Object.freeze({
  fast: 0.15,
  normal: 0.25,
  slow: 0.35,
});

const CONTAINER_MOTION = {
  initial: { opacity: 0, scale: 0.98 },
  animate: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: MOTION_DURATION.normal,
      ease: [0.23, 1, 0.32, 1],
    },
  },
  exit: {
    opacity: 0,
    scale: 0.98,
    transition: {
      duration: MOTION_DURATION.fast,
      ease: 'easeIn',
    },
  },
};

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

/**
 * Resolves the active validation status from individual boolean flags.
 * Error takes precedence over warning, which takes precedence over success.
 *
 * @param {{ error?: boolean, success?: boolean, warning?: boolean }} flags - Status flags.
 * @returns {'error'|'success'|'warning'|'none'} The resolved status key.
 */
function resolveStatus({ error, success, warning }) {
  if (error) return 'error';
  if (warning) return 'warning';
  if (success) return 'success';
  return 'none';
}

/**
 * Merges two event handler functions into one that calls both.
 * @param {Function} internalHandler - The component's internal handler.
 * @param {Function|undefined} externalHandler - The user-provided handler.
 * @returns {Function} A combined handler.
 */
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

/**
 * InputContainer — state-aware, animated wrapper for KisanO input fields.
 *
 * @component
 * @example
 * <InputContainer error={Boolean(errorMessage)} disabled={isSubmitting}>
 *   <InputLabel htmlFor="email">Email</InputLabel>
 *   <Input id="email" type="email" />
 *   <InputHelperText>{errorMessage}</InputHelperText>
 * </InputContainer>
 *
 * @param {Object} props - Component props.
 * @param {React.ReactNode} props.children - Field parts rendered inside the container.
 * @param {boolean} [props.error=false] - Marks the field as invalid (highest precedence).
 * @param {boolean} [props.success=false] - Marks the field as valid.
 * @param {boolean} [props.warning=false] - Marks the field with a warning.
 * @param {boolean} [props.loading=false] - Marks the field as busy (async validation, fetch).
 * @param {boolean} [props.disabled=false] - Disables all pointer interaction and dims the field.
 * @param {boolean} [props.readOnly=false] - Marks the field as read-only.
 * @param {boolean} [props.fullWidth=true] - Whether the field stretches to its parent width.
 * @param {boolean} [props.withMargin=true] - Whether to apply the default bottom field margin.
 * @param {boolean} [props.animate=true] - Whether to run the entrance animation.
 * @param {string} [props.className] - Extra classes merged onto the container.
 * @param {string} [props.id] - Optional id for the container element.
 * @param {React.Ref<HTMLDivElement>} ref - Forwarded ref to the container element.
 * @returns {React.ReactElement} The rendered field container.
 */
const InputContainer = memo(
  forwardRef(function InputContainer(
    {
      children,
      error = false,
      success = false,
      warning = false,
      loading = false,
      disabled = false,
      readOnly = false,
      fullWidth = true,
      withMargin = true,
      animate = true,
      className = '',
      id,
      ...rest
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

    /* -------- Event handlers (merged with user-provided handlers) -------- */

    const handleFocus = useCallback(() => {
      if (!disabled) setIsFocused(true);
    }, [disabled]);

    const handleBlur = useCallback(
      (event) => {
        // Only clear focus when it leaves the container entirely.
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

    // Merge internal handlers with any user-provided ones from `rest`.
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

    /* -------- Class composition -------- */

    const containerClasses = useMemo(
      () =>
        mergeClasses(
          getContainerClasses({ fullWidth, withMargin, className: '' }),
          'group relative',
          INPUT_SPACING.wrapperGap,
          INPUT_TRANSITIONS[INPUT_DEFAULTS.transition],
          'focus-within:ring-1 focus-within:ring-offset-2 focus-within:ring-[#2E7D32]/25',
          disabled && 'cursor-not-allowed opacity-75 pointer-events-none',
          readOnly && 'cursor-default',
          loading && 'cursor-progress',
          className,
        ),
      [fullWidth, withMargin, disabled, readOnly, loading, className],
    );

    /* -------- ARIA attributes -------- */

    const ariaProps = useMemo(() => {
      /** @type {Record<string, boolean | string>} */
      const attrs = {
        role: 'group',
        tabIndex: disabled ? -1 : 0,
        'aria-disabled': disabled || undefined,
      };

      if (status === 'error') {
        Object.assign(attrs, INPUT_ERROR_STATE.aria);
      }
      if (loading) {
        Object.assign(attrs, INPUT_LOADING_STATE.aria);
      }
      if (readOnly) {
        Object.assign(attrs, INPUT_READONLY_STATE.aria);
      }

      return attrs;
    }, [status, loading, readOnly, disabled]);

    /* -------- Motion configuration -------- */

    const motionProps = useMemo(() => {
      const shouldAnimate = animate && !prefersReducedMotion;
      const hasErrorShake = status === 'error' && !prefersReducedMotion;

      const baseAnimate = hasErrorShake
        ? { ...CONTAINER_MOTION.animate, ...ERROR_SHAKE }
        : isFocused && isInteractive && !prefersReducedMotion
          ? { ...CONTAINER_MOTION.animate, ...FOCUS_LIFT }
          : CONTAINER_MOTION.animate;

      if (shouldAnimate) {
        return {
          initial: CONTAINER_MOTION.initial,
          animate: baseAnimate,
          transition: CONTAINER_MOTION.transition,
          whileHover: isInteractive && !prefersReducedMotion
            ? { scale: 1.002, y: -0.5 }
            : undefined,
        };
      }

      return {
        initial: false,
        animate: hasErrorShake
          ? ERROR_SHAKE
          : isFocused && isInteractive
            ? FOCUS_LIFT
            : undefined,
      };
    }, [animate, prefersReducedMotion, status, isFocused, isInteractive]);

    return (
      <motion.div
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
      </motion.div>
    );
  }),
);

InputContainer.displayName = 'InputContainer';

InputContainer.propTypes = {
  /** Field parts (label, input, icons, helper text) rendered inside the container. */
  children: PropTypes.node,
  /** Marks the field as invalid. Takes precedence over warning and success. */
  error: PropTypes.bool,
  /** Marks the field as valid. */
  success: PropTypes.bool,
  /** Marks the field with a warning. Takes precedence over success. */
  warning: PropTypes.bool,
  /** Marks the field as busy during async work. */
  loading: PropTypes.bool,
  /** Disables the field and dims the container. */
  disabled: PropTypes.bool,
  /** Marks the field as read-only. */
  readOnly: PropTypes.bool,
  /** Whether the field stretches to the parent width. */
  fullWidth: PropTypes.bool,
  /** Whether to apply the default bottom field margin. */
  withMargin: PropTypes.bool,
  /** Whether to run the entrance animation (respects prefers-reduced-motion). */
  animate: PropTypes.bool,
  /** Extra classes merged onto the container element. */
  className: PropTypes.string,
  /** Optional id for the container element. */
  id: PropTypes.string,
};

export default InputContainer;