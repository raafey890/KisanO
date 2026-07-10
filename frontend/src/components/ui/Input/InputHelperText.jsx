import { forwardRef, memo, useMemo } from 'react';
import PropTypes from 'prop-types';
import { motion, useReducedMotion } from 'framer-motion';
import {
  INPUT_SUCCESS_STATE,
  INPUT_WARNING_STATE,
  INPUT_TRANSITIONS,
} from './inputVariants';
import { getHelperTextClasses, mergeClasses } from './inputUtils';

/**
 * KisanO Design System — Input Package
 * InputHelperText
 *
 * Accessible, animated helper text component for the KisanO Input system.
 * This component is intentionally presentation-focused and does not own field
 * validation or input state. It renders contextual guidance beneath an input
 * and supports premium motion, responsive spacing, and status-aware visuals.
 *
 * Supported states:
 * - default
 * - info
 * - success
 * - warning
 *
 * @module components/ui/Input/InputHelperText
 */

const HELPER_STATE_STYLES = Object.freeze({
  default: {
    status: 'none',
    container:
      'border-transparent bg-transparent text-gray-500',
    icon: 'text-gray-400',
  },
  info: {
    status: 'none',
    container:
      'border-sky-100/80 bg-sky-50/80 text-sky-700 shadow-[0_8px_20px_rgba(14,165,233,0.08)]',
    icon: 'text-sky-500',
  },
  success: {
    status: 'success',
    container:
      'border-emerald-100/90 bg-emerald-50/80 shadow-[0_8px_22px_rgba(22,163,74,0.10)]',
    icon: INPUT_SUCCESS_STATE.icon,
  },
  warning: {
    status: 'warning',
    container:
      'border-amber-100/90 bg-amber-50/85 shadow-[0_8px_22px_rgba(217,119,6,0.10)]',
    icon: INPUT_WARNING_STATE.icon,
  },
});

const MOTION_VARIANTS = {
  initial: {
    opacity: 0,
    y: 6,
    scale: 0.98,
    filter: 'blur(2px)',
  },
  animate: (reducedMotion) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    filter: 'blur(0px)',
    transition: reducedMotion
      ? {
          duration: 0.16,
          ease: 'easeOut',
        }
      : {
          type: 'spring',
          stiffness: 360,
          damping: 28,
          mass: 0.75,
        },
  }),
  exit: {
    opacity: 0,
    y: -4,
    scale: 0.985,
    filter: 'blur(2px)',
    transition: {
      duration: 0.12,
      ease: 'easeIn',
    },
  },
};

/**
 * Resolves helper state metadata.
 *
 * @param {'default'|'info'|'success'|'warning'} state - Requested helper state.
 * @returns {{status: string, container: string, icon: string}} Resolved style config.
 */
function resolveState(state) {
  return HELPER_STATE_STYLES[state] ?? HELPER_STATE_STYLES.default;
}

/**
 * Returns the appropriate decorative icon for the helper state.
 *
 * @param {'default'|'info'|'success'|'warning'} state - Helper visual state.
 * @returns {JSX.Element} SVG icon.
 */
function getStateIcon(state) {
  if (state === 'success') {
    return (
      <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" className="h-3.5 w-3.5">
        <path
          fillRule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.707a1 1 0 00-1.414-1.414L9 10.172 7.707 8.879a1 1 0 10-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
          clipRule="evenodd"
        />
      </svg>
    );
  }

  if (state === 'warning') {
    return (
      <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" className="h-3.5 w-3.5">
        <path
          fillRule="evenodd"
          d="M8.257 3.099c.765-1.36 2.72-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.981-1.742 2.981H4.42c-1.53 0-2.492-1.647-1.742-2.98l5.58-9.921zM11 13a1 1 0 10-2 0 1 1 0 002 0zm-1-6a1 1 0 00-.993.883L9 8v3a1 1 0 001.993.117L11 11V8a1 1 0 00-1-1z"
          clipRule="evenodd"
        />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" className="h-3.5 w-3.5">
      <path
        fillRule="evenodd"
        d="M18 10A8 8 0 112 10a8 8 0 0116 0zM9 8a1 1 0 112 0 1 1 0 01-2 0zm.25 2.25a.75.75 0 000 1.5h.25v2.5a.75.75 0 001.5 0v-3.25a.75.75 0 00-.75-.75h-1z"
        clipRule="evenodd"
      />
    </svg>
  );
}

/**
 * InputHelperText component.
 *
 * @component
 * @param {Object} props - Component props.
 * @param {string|React.ReactNode} [props.message] - Helper text content.
 * @param {React.ReactNode} [props.children] - Alternative helper text content.
 * @param {'default'|'info'|'success'|'warning'} [props.state='default'] - Visual helper state.
 * @param {boolean} [props.withIcon=true] - Shows a leading state icon.
 * @param {string} [props.id] - Optional id for aria-describedby linkage.
 * @param {string} [props.className=''] - Additional container classes.
 * @param {boolean} [props.announce=true] - Enables polite live region updates.
 * @returns {JSX.Element|null} Animated helper text element.
 */
const InputHelperText = memo(
  forwardRef(function InputHelperText(
    {
      message,
      children,
      state = 'default',
      withIcon = true,
      id,
      className = '',
      announce = true,
      ...props
    },
    ref,
  ) {
    const prefersReducedMotion = useReducedMotion();
    const content = children ?? message;

    const resolvedState = useMemo(() => resolveState(state), [state]);

    const textClasses = useMemo(
      () =>
        getHelperTextClasses({
          status: resolvedState.status,
          className: '',
        }),
      [resolvedState.status],
    );

    const containerClasses = useMemo(
      () =>
        mergeClasses(
          'mt-1.5 flex w-full items-start gap-2 rounded-xl border px-3 py-2',
          'sm:px-3.5',
          'backdrop-blur-sm',
          INPUT_TRANSITIONS.default,
          resolvedState.container,
          className,
        ),
      [className, resolvedState.container],
    );

    const iconClasses = useMemo(
      () =>
        mergeClasses(
          'mt-0.5 shrink-0',
          resolvedState.icon,
          INPUT_TRANSITIONS.colorsOnly,
        ),
      [resolvedState.icon],
    );

    const textClassName = useMemo(
      () =>
        mergeClasses(
          'min-w-0 flex-1 leading-relaxed tracking-[-0.006em]',
          textClasses,
        ),
      [textClasses],
    );

    if (!content) {
      return null;
    }

    return (
      <motion.div
        ref={ref}
        id={id}
        custom={prefersReducedMotion}
        initial="initial"
        animate="animate"
        exit="exit"
        variants={MOTION_VARIANTS}
        className={containerClasses}
        role={announce ? 'status' : undefined}
        aria-live={announce ? 'polite' : undefined}
        aria-atomic={announce ? 'true' : undefined}
        data-state={state}
        {...props}
      >
        {withIcon ? <span className={iconClasses}>{getStateIcon(state)}</span> : null}

        <div className={textClassName}>{content}</div>
      </motion.div>
    );
  }),
);

InputHelperText.displayName = 'InputHelperText';

InputHelperText.propTypes = {
  /** Helper text content. */
  message: PropTypes.node,
  /** Alternative helper text content. */
  children: PropTypes.node,
  /** Visual helper state. */
  state: PropTypes.oneOf(['default', 'info', 'success', 'warning']),
  /** Displays a leading contextual icon. */
  withIcon: PropTypes.bool,
  /** Optional id for aria-describedby wiring. */
  id: PropTypes.string,
  /** Additional container classes. */
  className: PropTypes.string,
  /** Enables polite live region announcements. */
  announce: PropTypes.bool,
};

export default InputHelperText;