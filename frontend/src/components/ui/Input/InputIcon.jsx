import { forwardRef, memo, useMemo } from 'react';
import PropTypes from 'prop-types';
import { motion, useReducedMotion } from 'framer-motion';
import {
  INPUT_DEFAULTS,
  INPUT_ICON_SIZES,
  INPUT_LOADING_STATE,
  INPUT_TRANSITIONS,
} from './inputVariants';
import { getIconClasses, mergeClasses } from './inputUtils';

/**
 * KisanO Design System — Input Package
 * InputIcon
 *
 * Production-ready icon renderer for KisanO input fields.
 * This component is intentionally presentation-focused and does not own input
 * state. It supports left/right positioning, status-aware icon styling,
 * loading visuals, reduced motion, and accessible semantics when the icon
 * is not decorative.
 *
 * Supported use cases:
 * - Left icon
 * - Right icon
 * - Status fallback icons
 * - Loading spinner
 * - Optional hover animation
 *
 * @module components/ui/Input/InputIcon
 */

const POSITION_STYLES = Object.freeze({
  left: 'pointer-events-none absolute inset-y-0 left-3 flex items-center',
  right: 'pointer-events-none absolute inset-y-0 right-3 flex items-center',
  inline: 'inline-flex items-center justify-center',
});

const WRAPPER_VARIANTS = {
  initial: {
    opacity: 0,
    scale: 0.92,
    y: 2,
    filter: 'blur(2px)',
  },
  animate: (reducedMotion) => ({
    opacity: 1,
    scale: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: reducedMotion
      ? {
          duration: 0.14,
          ease: 'easeOut',
        }
      : {
          type: 'spring',
          stiffness: 420,
          damping: 28,
          mass: 0.72,
        },
  }),
  exit: {
    opacity: 0,
    scale: 0.9,
    y: -2,
    filter: 'blur(2px)',
    transition: {
      duration: 0.12,
      ease: 'easeIn',
    },
  },
};

const SPINNER_VARIANTS = {
  initial: {
    opacity: 0,
    rotate: -90,
    scale: 0.82,
  },
  animate: (reducedMotion) => ({
    opacity: 1,
    rotate: 360,
    scale: 1,
    transition: reducedMotion
      ? {
          opacity: { duration: 0.12, ease: 'easeOut' },
          scale: { duration: 0.12, ease: 'easeOut' },
          rotate: { duration: 0 },
        }
      : {
          opacity: { duration: 0.18, ease: 'easeOut' },
          scale: {
            type: 'spring',
            stiffness: 300,
            damping: 22,
          },
          rotate: {
            duration: 0.8,
            repeat: Infinity,
            ease: 'linear',
          },
        },
  }),
};

const HOVER_ANIMATION = Object.freeze({
  scale: 1.08,
  y: -0.5,
  transition: {
    type: 'spring',
    stiffness: 520,
    damping: 18,
  },
});

/**
 * Resolves the position class for the icon wrapper.
 *
 * @param {'left'|'right'|'inline'} position - Icon position.
 * @param {boolean} decorative - Whether the icon is decorative.
 * @returns {string} Position class string.
 */
function resolvePositionClasses(position, decorative) {
  const resolvedPosition = POSITION_STYLES[position] ?? POSITION_STYLES.inline;

  if (!decorative && position !== 'inline') {
    return resolvedPosition.replace('pointer-events-none ', '');
  }

  return resolvedPosition;
}

/**
 * Returns a default status icon when no custom icon is provided.
 *
 * @param {'none'|'error'|'success'|'warning'} status - Visual status.
 * @returns {JSX.Element|null} Fallback icon.
 */
function getStatusFallbackIcon(status) {
  if (status === 'success') {
    return (
      <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" className="h-full w-full">
        <path
          fillRule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.707a1 1 0 00-1.414-1.414L9 10.172 7.707 8.879a1 1 0 10-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
          clipRule="evenodd"
        />
      </svg>
    );
  }

  if (status === 'warning') {
    return (
      <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" className="h-full w-full">
        <path
          fillRule="evenodd"
          d="M8.257 3.099c.765-1.36 2.72-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.981-1.742 2.981H4.42c-1.53 0-2.492-1.647-1.742-2.98l5.58-9.921zM11 13a1 1 0 10-2 0 1 1 0 002 0zm-1-6a1 1 0 00-.993.883L9 8v3a1 1 0 001.993.117L11 11V8a1 1 0 00-1-1z"
          clipRule="evenodd"
        />
      </svg>
    );
  }

  if (status === 'error') {
    return (
      <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" className="h-full w-full">
        <path
          fillRule="evenodd"
          d="M18 10A8 8 0 112 10a8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
          clipRule="evenodd"
        />
      </svg>
    );
  }

  return null;
}

/**
 * Returns the rendered icon content.
 *
 * Loading state takes precedence over custom or fallback icons.
 *
 * @param {Object} options - Render options.
 * @param {React.ReactNode} options.icon - Custom icon node.
 * @param {React.ReactNode} options.children - Alternative custom icon node.
 * @param {'none'|'error'|'success'|'warning'} options.status - Visual status.
 * @param {boolean} options.loading - Whether loading spinner should render.
 * @returns {React.ReactNode|null} Icon content.
 */
function resolveIconContent({ icon, children, status, loading }) {
  if (loading) {
    return null;
  }

  return children ?? icon ?? getStatusFallbackIcon(status);
}

/**
 * Production-ready icon component for input fields.
 *
 * @component
 * @param {Object} props - Component props.
 * @param {React.ReactNode} [props.icon] - Custom icon node.
 * @param {React.ReactNode} [props.children] - Alternative custom icon node.
 * @param {'left'|'right'|'inline'} [props.position='inline'] - Placement of the icon.
 * @param {'xs'|'sm'|'md'|'lg'|'xl'} [props.size='md'] - Icon scale.
 * @param {'none'|'error'|'success'|'warning'} [props.status='none'] - Validation-aware visual state.
 * @param {boolean} [props.disabled=false] - Applies disabled styling.
 * @param {boolean} [props.loading=false] - Displays a loading spinner.
 * @param {boolean} [props.decorative=true] - Marks the icon as decorative.
 * @param {boolean} [props.hoverable=false] - Enables premium hover motion.
 * @param {string} [props.label] - Accessible label for non-decorative icons.
 * @param {string} [props.loadingLabel='Loading'] - Accessible label for loading icons.
 * @param {string} [props.className=''] - Additional wrapper classes.
 * @returns {JSX.Element|null} Rendered input icon.
 */
const InputIcon = memo(
  forwardRef(function InputIcon(
    {
      icon,
      children,
      position = 'inline',
      size = INPUT_DEFAULTS.size,
      status = 'none',
      disabled = false,
      loading = false,
      decorative = true,
      hoverable = false,
      label,
      loadingLabel = 'Loading',
      className = '',
      ...props
    },
    ref,
  ) {
    const prefersReducedMotion = useReducedMotion();

    const resolvedIcon = useMemo(
      () => resolveIconContent({ icon, children, status, loading }),
      [children, icon, loading, status],
    );

    const wrapperClasses = useMemo(
      () =>
        mergeClasses(
          resolvePositionClasses(position, decorative),
          !decorative && 'cursor-default',
          className,
        ),
      [className, decorative, position],
    );

    const visualClasses = useMemo(() => {
      if (loading) {
        return mergeClasses(
          INPUT_ICON_SIZES[size] ?? INPUT_ICON_SIZES[INPUT_DEFAULTS.size],
          'shrink-0 text-[#2E7D32]',
          INPUT_LOADING_STATE.spinner,
          INPUT_TRANSITIONS.colorsOnly,
        );
      }

      return getIconClasses({
        size,
        status,
        disabled,
        className: '',
      });
    }, [disabled, loading, size, status]);

    const accessibilityProps = useMemo(() => {
      if (decorative) {
        return {
          'aria-hidden': true,
        };
      }

      if (loading) {
        return {
          role: 'status',
          'aria-live': 'polite',
          'aria-label': label || loadingLabel,
          'aria-hidden': undefined,
        };
      }

      return {
        role: 'img',
        'aria-label': label || 'Input icon',
        'aria-hidden': undefined,
      };
    }, [decorative, label, loading, loadingLabel]);

    if (!loading && !resolvedIcon) {
      return null;
    }

    return (
      <motion.span
        ref={ref}
        custom={prefersReducedMotion}
        initial="initial"
        animate="animate"
        exit="exit"
        variants={WRAPPER_VARIANTS}
        whileHover={
          hoverable && !disabled && !loading && !prefersReducedMotion
            ? HOVER_ANIMATION
            : undefined
        }
        className={wrapperClasses}
        data-position={position}
        data-status={status !== 'none' ? status : undefined}
        data-loading={loading || undefined}
        {...accessibilityProps}
        {...props}
      >
        {loading ? (
          <motion.svg
            viewBox="0 0 24 24"
            fill="none"
            className={visualClasses}
            custom={prefersReducedMotion}
            initial="initial"
            animate="animate"
            variants={SPINNER_VARIANTS}
          >
            <circle
              className="opacity-20"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="3.5"
            />
            <path
              className="opacity-90"
              fill="currentColor"
              d="M12 2a10 10 0 00-10 10h3.5a6.5 6.5 0 016.5-6.5V2z"
            />
          </motion.svg>
        ) : (
          <motion.span
            className={visualClasses}
            custom={prefersReducedMotion}
            initial={false}
            animate={
              prefersReducedMotion
                ? {
                    opacity: 1,
                    scale: 1,
                  }
                : {
                    opacity: 1,
                    scale: 1,
                  }
            }
            transition={
              prefersReducedMotion
                ? {
                    duration: 0.12,
                    ease: 'easeOut',
                  }
                : {
                    type: 'spring',
                    stiffness: 360,
                    damping: 24,
                    mass: 0.7,
                  }
            }
          >
            {resolvedIcon}
          </motion.span>
        )}
      </motion.span>
    );
  }),
);

InputIcon.displayName = 'InputIcon';

InputIcon.propTypes = {
  /** Custom icon node. */
  icon: PropTypes.node,
  /** Alternative custom icon node. */
  children: PropTypes.node,
  /** Placement of the icon relative to the input. */
  position: PropTypes.oneOf(['left', 'right', 'inline']),
  /** Icon scale. */
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
  /** Validation-aware visual state. */
  status: PropTypes.oneOf(['none', 'error', 'success', 'warning']),
  /** Applies disabled styling. */
  disabled: PropTypes.bool,
  /** Displays a loading spinner instead of the provided icon. */
  loading: PropTypes.bool,
  /** Marks the icon as decorative for assistive technologies. */
  decorative: PropTypes.bool,
  /** Enables subtle hover motion. */
  hoverable: PropTypes.bool,
  /** Accessible label for non-decorative icons. */
  label: PropTypes.string,
  /** Accessible label announced during loading state. */
  loadingLabel: PropTypes.string,
  /** Additional wrapper classes. */
  className: PropTypes.string,
};

export default InputIcon;