import { forwardRef, memo, useMemo } from 'react';
import PropTypes from 'prop-types';
import { motion, useReducedMotion } from 'framer-motion';
import {
  INPUT_DISABLED_STATE,
  INPUT_ERROR_STATE,
  INPUT_SUCCESS_STATE,
  INPUT_WARNING_STATE,
  INPUT_TYPOGRAPHY,
  INPUT_TRANSITIONS,
} from './inputVariants';
import { mergeClasses } from './inputUtils';

/**
 * KisanO Design System — Input Package
 * InputLabel
 *
 * Premium, accessible floating label for form fields.
 * This component is presentation-focused and intentionally does not own
 * input state. It reflects field state through props and integrates with
 * the existing Input package architecture.
 *
 * Supported states:
 * - Floating / resting
 * - Required
 * - Disabled
 * - Error
 * - Success
 * - Warning
 * - Reduced motion
 *
 * @module components/ui/Input/InputLabel
 */

const LABEL_LAYOUTS = Object.freeze({
  default: {
    base: 'left-4 top-3.5',
    floatOffset: -26,
  },
  outlined: {
    base: 'left-4 top-3.5',
    floatOffset: -26,
  },
  outline: {
    base: 'left-4 top-3.5',
    floatOffset: -26,
  },
  filled: {
    base: 'left-4 top-3.5',
    floatOffset: -24,
  },
  ghost: {
    base: 'left-4 top-3.5',
    floatOffset: -24,
  },
  underlined: {
    base: 'left-0 top-2.5',
    floatOffset: -18,
  },
});

const STATUS_STYLES = Object.freeze({
  none: 'text-gray-500',
  error: INPUT_ERROR_STATE.text,
  success: INPUT_SUCCESS_STATE.text,
  warning: INPUT_WARNING_STATE.text,
});

/**
 * Resolves the validation status for the label.
 *
 * Precedence:
 * error > warning > success > none
 *
 * @param {Object} flags - Status flags.
 * @param {boolean} flags.error - Whether the field is in an error state.
 * @param {boolean} flags.warning - Whether the field is in a warning state.
 * @param {boolean} flags.success - Whether the field is in a success state.
 * @returns {'none'|'error'|'success'|'warning'} Resolved status.
 */
function resolveStatus({ error, warning, success }) {
  if (error) return 'error';
  if (warning) return 'warning';
  if (success) return 'success';
  return 'none';
}

/**
 * Resolves layout values for the provided variant.
 *
 * @param {string} variant - Input variant.
 * @returns {{ base: string, floatOffset: number }} Layout config.
 */
function resolveLayout(variant) {
  return LABEL_LAYOUTS[variant] ?? LABEL_LAYOUTS.default;
}

/**
 * InputLabel component.
 *
 * @component
 * @param {Object} props - Component props.
 * @param {string} props.id - ID of the associated input element.
 * @param {string} props.label - Visible label text.
 * @param {boolean} [props.required=false] - Whether the field is required.
 * @param {boolean} [props.isFocused=false] - Whether the field is focused or has value.
 * @param {boolean} [props.disabled=false] - Whether the field is disabled.
 * @param {boolean} [props.error=false] - Whether the field is in an error state.
 * @param {boolean} [props.success=false] - Whether the field is in a success state.
 * @param {boolean} [props.warning=false] - Whether the field is in a warning state.
 * @param {boolean} [props.floating=true] - Enables floating label behavior.
 * @param {string} [props.variant='outline'] - Visual variant context.
 * @param {string} [props.className=''] - Additional class names.
 * @param {string} [props.requiredLabel='required'] - Screen-reader text for the required indicator.
 * @returns {JSX.Element|null} Animated label element.
 */
const InputLabel = memo(
  forwardRef(function InputLabel(
    {
      id,
      label,
      required = false,
      isFocused = false,
      disabled = false,
      error = false,
      success = false,
      warning = false,
      floating = true,
      variant = 'outline',
      className = '',
      requiredLabel = 'required',
      ...props
    },
    ref,
  ) {
    const prefersReducedMotion = useReducedMotion();

    const status = useMemo(
      () => resolveStatus({ error, warning, success }),
      [error, success, warning],
    );

    const layout = useMemo(() => resolveLayout(variant), [variant]);

    const isActive = floating && isFocused;

    const labelClasses = useMemo(
      () =>
        mergeClasses(
          'absolute z-10 inline-flex max-w-[calc(100%-1.5rem)] items-center gap-1',
          'origin-left rounded-md select-none',
          'cursor-text',
          'px-1.5 py-0.5',
          'backdrop-blur-sm',
          INPUT_TYPOGRAPHY.label,
          INPUT_TRANSITIONS.default,
          layout.base,
          variant === 'underlined'
            ? 'bg-transparent'
            : isActive
              ? 'bg-white/95 supports-[backdrop-filter]:bg-white/80 shadow-[0_1px_0_rgba(255,255,255,0.9)]'
              : 'bg-transparent',
          disabled ? INPUT_DISABLED_STATE.label : STATUS_STYLES[status],
          !disabled && status === 'none' && isActive && 'text-[#2E7D32]',
          className,
        ),
      [className, disabled, isActive, layout.base, status, variant],
    );

    const motionProps = useMemo(() => {
      if (prefersReducedMotion) {
        return {
          initial: false,
          animate: {
            opacity: disabled ? 0.75 : 1,
            y: isActive ? -2 : 0,
            scale: isActive ? 0.92 : 1,
          },
          transition: {
            duration: 0.16,
            ease: 'easeOut',
          },
          whileTap: undefined,
        };
      }

      return {
        initial: false,
        animate: {
          opacity: disabled ? 0.75 : 1,
          y: isActive ? layout.floatOffset : 0,
          scale: isActive ? 0.88 : 1,
        },
        transition: {
          type: 'spring',
          stiffness: 440,
          damping: 30,
          mass: 0.75,
        },
        whileTap: disabled
          ? undefined
          : {
              scale: isActive ? 0.86 : 0.98,
            },
      };
    }, [disabled, isActive, layout.floatOffset, prefersReducedMotion]);

    if (!label) {
      return null;
    }

    return (
      <motion.label
        ref={ref}
        htmlFor={id}
        className={labelClasses}
        aria-disabled={disabled || undefined}
        data-floating={isActive || undefined}
        data-status={status !== 'none' ? status : undefined}
        {...motionProps}
        {...props}
      >
        <span className="truncate">{label}</span>

        {required ? (
          <>
            <span
              aria-hidden="true"
              className={mergeClasses(
                'shrink-0 text-[0.95em] font-semibold leading-none',
                disabled ? 'text-red-400/80' : 'text-red-500',
              )}
            >
              *
            </span>
            <span className="sr-only">{requiredLabel}</span>
          </>
        ) : null}
      </motion.label>
    );
  }),
);

InputLabel.displayName = 'InputLabel';

InputLabel.propTypes = {
  /** ID of the associated input element. */
  id: PropTypes.string.isRequired,
  /** Visible label content. */
  label: PropTypes.string.isRequired,
  /** Shows the required indicator. */
  required: PropTypes.bool,
  /** Controls floating / active state. */
  isFocused: PropTypes.bool,
  /** Applies disabled styling. */
  disabled: PropTypes.bool,
  /** Applies error styling. */
  error: PropTypes.bool,
  /** Applies success styling. */
  success: PropTypes.bool,
  /** Applies warning styling. */
  warning: PropTypes.bool,
  /** Enables floating label behavior. */
  floating: PropTypes.bool,
  /** Visual input variant context. */
  variant: PropTypes.oneOf([
    'default',
    'outlined',
    'outline',
    'filled',
    'ghost',
    'underlined',
  ]),
  /** Additional classes for the label. */
  className: PropTypes.string,
  /** Screen-reader text for the required indicator. */
  requiredLabel: PropTypes.string,
};

export default InputLabel;