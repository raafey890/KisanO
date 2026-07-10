'use client';

import { forwardRef, memo, useMemo } from 'react';
import PropTypes from 'prop-types';
import { motion, useReducedMotion } from 'framer-motion';

/**
 * KisanO Design System — Input Package
 * InputCounter
 *
 * Renders an animated character counter for text-based inputs.
 * The component is intentionally presentation-focused so it can be reused
 * beneath any input implementation inside the KisanO design system.
 *
 * Features:
 * - Premium, restrained motion with reduced-motion support
 * - Accessible live updates for assistive technologies
 * - Warning / limit-reached state handling
 * - Reusable sizing and alignment options
 *
 * @module components/ui/Input/InputCounter
 */

const SIZE_STYLES = Object.freeze({
  xs: 'text-[11px]',
  sm: 'text-xs',
  md: 'text-xs',
  lg: 'text-sm',
  xl: 'text-sm',
});

const ALIGNMENT_STYLES = Object.freeze({
  left: 'justify-start text-left',
  center: 'justify-center text-center',
  right: 'justify-end text-right',
});

const TONE_STYLES = Object.freeze({
  neutral:
    'border-transparent bg-white/65 text-slate-500 shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]',
  warning:
    'border-amber-200/80 bg-amber-50/90 text-amber-700 shadow-[0_8px_24px_rgba(245,158,11,0.12)]',
  danger:
    'border-red-200/90 bg-red-50/95 text-red-700 shadow-[0_10px_28px_rgba(239,68,68,0.14)]',
});

const MOTION_VARIANTS = {
  initial: {
    opacity: 0,
    y: 6,
    scale: 0.96,
  },
  animate: (reducedMotion) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: reducedMotion
      ? { duration: 0.18, ease: 'easeOut' }
      : {
          type: 'spring',
          stiffness: 380,
          damping: 28,
          mass: 0.7,
        },
  }),
};

const VALUE_VARIANTS = {
  initial: {
    opacity: 0,
    y: 4,
    filter: 'blur(2px)',
  },
  animate: (reducedMotion) => ({
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: reducedMotion
      ? { duration: 0.14, ease: 'easeOut' }
      : {
          type: 'spring',
          stiffness: 520,
          damping: 30,
          mass: 0.65,
        },
  }),
  exit: {
    opacity: 0,
    y: -3,
    filter: 'blur(2px)',
    transition: {
      duration: 0.12,
      ease: 'easeIn',
    },
  },
};

/**
 * Returns a safe numeric character length from the provided value.
 *
 * @param {string|number|null|undefined} value - Input value.
 * @returns {number} Character length.
 */
function getCharacterLength(value) {
  if (value === null || value === undefined) {
    return 0;
  }

  return String(value).length;
}

/**
 * Resolves the visual tone based on the current usage ratio.
 *
 * @param {number} currentLength - Current number of characters.
 * @param {number|undefined} maxLength - Maximum allowed characters.
 * @param {number} warningThreshold - Threshold ratio that triggers warning styling.
 * @returns {'neutral'|'warning'|'danger'} Visual tone key.
 */
function getTone(currentLength, maxLength, warningThreshold) {
  if (!Number.isFinite(maxLength) || maxLength <= 0) {
    return 'neutral';
  }

  const ratio = currentLength / maxLength;

  if (ratio >= 1) {
    return 'danger';
  }

  if (ratio >= warningThreshold) {
    return 'warning';
  }

  return 'neutral';
}

/**
 * Clamps a numeric value between a minimum and maximum.
 *
 * @param {number} value - Value to clamp.
 * @param {number} min - Lower boundary.
 * @param {number} max - Upper boundary.
 * @returns {number} Clamped value.
 */
function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

/**
 * Concatenates class names while ignoring falsy entries.
 *
 * @param {...(string|false|null|undefined)} classes - Class names to merge.
 * @returns {string} Combined class string.
 */
function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}

/**
 * Animated character counter for the KisanO Input package.
 *
 * @component
 * @param {Object} props - Component props.
 * @param {string|number} [props.value] - Full input value used to derive count.
 * @param {number} [props.currentLength] - Explicit current character length. Overrides `value` length when provided.
 * @param {number} [props.maxLength] - Maximum character limit.
 * @param {number} [props.warningThreshold=0.9] - Ratio that triggers warning styling.
 * @param {'xs'|'sm'|'md'|'lg'|'xl'} [props.size='md'] - Counter typography scale.
 * @param {'left'|'center'|'right'} [props.align='right'] - Horizontal alignment inside the wrapper.
 * @param {boolean} [props.showProgress=false] - Whether to render the progress bar.
 * @param {boolean} [props.showRemaining=false] - Whether to expose remaining characters text to assistive technologies.
 * @param {boolean} [props.announceChanges=true] - Enables polite live region announcements.
 * @param {string} [props.className=''] - Additional wrapper classes.
 * @param {string} [props.counterLabel='Character count'] - Accessible label for screen readers.
 * @returns {JSX.Element|null} Animated character counter or `null`.
 */
const InputCounter = memo(
  forwardRef(function InputCounter(
    {
      value,
      currentLength,
      maxLength,
      warningThreshold = 0.9,
      size = 'md',
      align = 'right',
      showProgress = false,
      showRemaining = false,
      announceChanges = true,
      className = '',
      counterLabel = 'Character count',
      ...props
    },
    ref,
  ) {
    const prefersReducedMotion = useReducedMotion();

    const resolvedLength = useMemo(() => {
      if (Number.isFinite(currentLength) && currentLength >= 0) {
        return currentLength;
      }

      return getCharacterLength(value);
    }, [currentLength, value]);

    const safeMaxLength = useMemo(() => {
      if (!Number.isFinite(maxLength) || maxLength <= 0) {
        return undefined;
      }

      return maxLength;
    }, [maxLength]);

    const tone = useMemo(
      () => getTone(resolvedLength, safeMaxLength, clamp(warningThreshold, 0, 1)),
      [resolvedLength, safeMaxLength, warningThreshold],
    );

    const remainingCharacters = useMemo(() => {
      if (!safeMaxLength) {
        return undefined;
      }

      return safeMaxLength - resolvedLength;
    }, [resolvedLength, safeMaxLength]);

    const progressValue = useMemo(() => {
      if (!safeMaxLength) {
        return 0;
      }

      return clamp((resolvedLength / safeMaxLength) * 100, 0, 100);
    }, [resolvedLength, safeMaxLength]);

    const statusMessage = useMemo(() => {
      if (!safeMaxLength) {
        return `${counterLabel}: ${resolvedLength}`;
      }

      if (remainingCharacters < 0) {
        return `${counterLabel}: ${resolvedLength} of ${safeMaxLength}. Limit exceeded by ${Math.abs(
          remainingCharacters,
        )}.`;
      }

      if (showRemaining) {
        return `${counterLabel}: ${resolvedLength} of ${safeMaxLength}. ${remainingCharacters} remaining.`;
      }

      return `${counterLabel}: ${resolvedLength} of ${safeMaxLength}.`;
    }, [counterLabel, remainingCharacters, resolvedLength, safeMaxLength, showRemaining]);

    const sizeClass = SIZE_STYLES[size] ?? SIZE_STYLES.md;
    const alignmentClass = ALIGNMENT_STYLES[align] ?? ALIGNMENT_STYLES.right;
    const toneClass = TONE_STYLES[tone];

    if (!Number.isFinite(resolvedLength) || resolvedLength < 0) {
      return null;
    }

    return (
      <motion.div
        ref={ref}
        custom={prefersReducedMotion}
        initial="initial"
        animate="animate"
        variants={MOTION_VARIANTS}
        className={cn('flex w-full', alignmentClass, className)}
        {...props}
      >
        <div className="inline-flex min-w-[5rem] flex-col items-end gap-1">
          <motion.div
            layout={!prefersReducedMotion}
            className={cn(
              'inline-flex items-center gap-2 rounded-full border px-2.5 py-1',
              'backdrop-blur-md transition-colors duration-200',
              'supports-[backdrop-filter]:bg-white/70',
              sizeClass,
              toneClass,
            )}
            aria-live={announceChanges ? 'polite' : undefined}
            aria-atomic={announceChanges ? 'true' : undefined}
            role="status"
          >
            <span className="sr-only">{statusMessage}</span>

            <motion.span
              aria-hidden="true"
              className={cn(
                'h-1.5 w-1.5 rounded-full',
                tone === 'danger'
                  ? 'bg-red-500'
                  : tone === 'warning'
                    ? 'bg-amber-500'
                    : 'bg-emerald-500',
              )}
              animate={
                prefersReducedMotion
                  ? { opacity: 1 }
                  : tone === 'danger'
                    ? { scale: [1, 1.2, 1], opacity: [0.75, 1, 0.75] }
                    : { scale: 1, opacity: 1 }
              }
              transition={
                prefersReducedMotion
                  ? { duration: 0 }
                  : tone === 'danger'
                    ? { duration: 1.2, repeat: Infinity, ease: 'easeInOut' }
                    : { duration: 0.2 }
              }
            />

            <span
              aria-hidden="true"
              className="inline-flex items-baseline gap-1 font-medium tracking-[-0.01em]"
            >
              <motion.span
                key={`current-${resolvedLength}`}
                custom={prefersReducedMotion}
                initial="initial"
                animate="animate"
                exit="exit"
                variants={VALUE_VARIANTS}
              >
                {resolvedLength}
              </motion.span>

              {safeMaxLength ? (
                <>
                  <span className="text-current/50">/</span>
                  <span className="text-current/72">{safeMaxLength}</span>
                </>
              ) : null}
            </span>
          </motion.div>

          {showProgress && safeMaxLength ? (
            <div
              className="h-1.5 w-full overflow-hidden rounded-full bg-slate-200/80"
              aria-hidden="true"
            >
              <motion.div
                className={cn(
                  'h-full rounded-full',
                  tone === 'danger'
                    ? 'bg-gradient-to-r from-red-500 to-rose-500'
                    : tone === 'warning'
                      ? 'bg-gradient-to-r from-amber-400 to-orange-500'
                      : 'bg-gradient-to-r from-emerald-500 to-green-600',
                )}
                initial={prefersReducedMotion ? false : { width: 0 }}
                animate={{ width: `${progressValue}%` }}
                transition={
                  prefersReducedMotion
                    ? { duration: 0.15, ease: 'easeOut' }
                    : {
                        type: 'spring',
                        stiffness: 180,
                        damping: 24,
                        mass: 0.75,
                      }
                }
              />
            </div>
          ) : null}
        </div>
      </motion.div>
    );
  }),
);

InputCounter.displayName = 'InputCounter';

InputCounter.propTypes = {
  /** Full input value used to derive the current character count. */
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  /** Explicit character count. Takes precedence over `value` length. */
  currentLength: PropTypes.number,
  /** Maximum allowed character count. */
  maxLength: PropTypes.number,
  /** Ratio that triggers warning styling before the limit is reached. */
  warningThreshold: PropTypes.number,
  /** Typography scale for the counter. */
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
  /** Horizontal alignment inside the parent wrapper. */
  align: PropTypes.oneOf(['left', 'center', 'right']),
  /** Displays a compact progress bar below the counter pill. */
  showProgress: PropTypes.bool,
  /** Includes remaining character information in screen-reader announcements. */
  showRemaining: PropTypes.bool,
  /** Enables polite live region updates as the count changes. */
  announceChanges: PropTypes.bool,
  /** Additional wrapper classes. */
  className: PropTypes.string,
  /** Accessible label for the live region. */
  counterLabel: PropTypes.string,
};

export default InputCounter;
