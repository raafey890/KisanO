import { forwardRef, memo, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { HiEye, HiEyeOff } from 'react-icons/hi';
import {
  INPUT_DEFAULTS,
  INPUT_ICON_SIZES,
  INPUT_TRANSITIONS,
} from './inputVariants';
import { mergeClasses } from './inputUtils';

/**
 * KisanO Design System — Input Package
 * PasswordToggle
 *
 * Accessible, production-ready password visibility toggle for input fields.
 * This component is intentionally presentation-focused and only handles
 * the toggle button UI, interaction semantics, and motion.
 *
 * Supported features:
 * - Show / hide password
 * - Animated eye / eye-off icon swap
 * - Keyboard accessibility
 * - Screen reader support
 * - Hover, focus, and reduced motion support
 *
 * @module components/ui/Input/PasswordToggle
 */

const BUTTON_SIZES = Object.freeze({
  xs: 'h-5 w-5',
  sm: 'h-6 w-6',
  md: 'h-6 w-6',
  lg: 'h-7 w-7',
  xl: 'h-8 w-8',
});

const ICON_FONT_SIZES = Object.freeze({
  xs: 'text-[0.75rem]',
  sm: 'text-[0.875rem]',
  md: 'text-[0.875rem]',
  lg: 'text-[1rem]',
  xl: 'text-[1.125rem]',
});

const BUTTON_VARIANTS = {
  initial: {
    opacity: 0,
    scale: 0.9,
    y: 2,
  },
  animate: (reducedMotion) => ({
    opacity: 1,
    scale: 1,
    y: 0,
    transition: reducedMotion
      ? {
          duration: 0.14,
          ease: 'easeOut',
        }
      : {
          type: 'spring',
          stiffness: 460,
          damping: 26,
          mass: 0.65,
        },
  }),
};

const ICON_SWAP_VARIANTS = {
  initial: {
    opacity: 0,
    scale: 0.72,
    rotate: -14,
    filter: 'blur(2px)',
  },
  animate: (reducedMotion) => ({
    opacity: 1,
    scale: 1,
    rotate: 0,
    filter: 'blur(0px)',
    transition: reducedMotion
      ? {
          duration: 0.12,
          ease: 'easeOut',
        }
      : {
          type: 'spring',
          stiffness: 520,
          damping: 28,
          mass: 0.58,
        },
  }),
  exit: {
    opacity: 0,
    scale: 0.76,
    rotate: 12,
    filter: 'blur(2px)',
    transition: {
      duration: 0.12,
      ease: 'easeIn',
    },
  },
};

const HOVER_ANIMATION = {
  scale: 1.08,
  y: -0.5,
  transition: {
    type: 'spring',
    stiffness: 560,
    damping: 18,
  },
};

const TAP_ANIMATION = {
  scale: 0.94,
  transition: {
    type: 'spring',
    stiffness: 640,
    damping: 22,
  },
};

/**
 * Resolves a safe size token.
 *
 * @param {'xs'|'sm'|'md'|'lg'|'xl'} size - Requested size.
 * @returns {'xs'|'sm'|'md'|'lg'|'xl'} Safe size token.
 */
function resolveSize(size) {
  return BUTTON_SIZES[size] ? size : INPUT_DEFAULTS.size;
}

/**
 * PasswordToggle component.
 *
 * @component
 * @param {Object} props - Component props.
 * @param {boolean} [props.isVisible=false] - Whether the password is currently visible.
 * @param {Function} [props.onToggle] - Called when visibility should toggle.
 * @param {boolean} [props.disabled=false] - Disables interaction.
 * @param {'xs'|'sm'|'md'|'lg'|'xl'} [props.size='md'] - Visual size scale.
 * @param {string} [props.showLabel='Show password'] - Accessible label when password is hidden.
 * @param {string} [props.hideLabel='Hide password'] - Accessible label when password is visible.
 * @param {string} [props.className=''] - Additional button classes.
 * @returns {JSX.Element} Password visibility toggle button.
 */
const PasswordToggle = memo(
  forwardRef(function PasswordToggle(
    {
      isVisible = false,
      onToggle,
      disabled = false,
      size = INPUT_DEFAULTS.size,
      showLabel = 'Show password',
      hideLabel = 'Hide password',
      className = '',
      ...props
    },
    ref,
  ) {
    const prefersReducedMotion = useReducedMotion();
    const resolvedSize = useMemo(() => resolveSize(size), [size]);

    const ariaLabel = isVisible ? hideLabel : showLabel;

    const buttonClasses = useMemo(
      () =>
        mergeClasses(
          'inline-flex items-center justify-center rounded-full',
          'text-gray-400 hover:text-[#2E7D32]',
          'hover:bg-[#2E7D32]/10 active:bg-[#2E7D32]/16',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2E7D32]/35 focus-visible:ring-offset-1',
          'disabled:cursor-not-allowed disabled:text-gray-300 disabled:hover:bg-transparent disabled:hover:text-gray-300',
          INPUT_TRANSITIONS.default,
          BUTTON_SIZES[resolvedSize],
          className,
        ),
      [className, resolvedSize],
    );

    const iconClasses = useMemo(
      () =>
        mergeClasses(
          'shrink-0',
          INPUT_ICON_SIZES[resolvedSize],
          ICON_FONT_SIZES[resolvedSize],
        ),
      [resolvedSize],
    );

    const handleClick = useCallback(
      (event) => {
        if (disabled) {
          return;
        }

        onToggle?.(event);
      },
      [disabled, onToggle],
    );

    const handleMouseDown = useCallback((event) => {
      event.preventDefault();
    }, []);

    return (
      <motion.button
        ref={ref}
        type="button"
        custom={prefersReducedMotion}
        initial="initial"
        animate="animate"
        variants={BUTTON_VARIANTS}
        whileHover={
          !disabled && !prefersReducedMotion ? HOVER_ANIMATION : undefined
        }
        whileTap={
          !disabled && !prefersReducedMotion ? TAP_ANIMATION : undefined
        }
        className={buttonClasses}
        onClick={handleClick}
        onMouseDown={handleMouseDown}
        disabled={disabled}
        aria-label={ariaLabel}
        aria-pressed={isVisible}
        title={ariaLabel}
        data-state={isVisible ? 'visible' : 'hidden'}
        {...props}
      >
        <span className="sr-only">{ariaLabel}</span>

        <AnimatePresence initial={false} mode="wait">
          {isVisible ? (
            <motion.span
              key="password-visible"
              custom={prefersReducedMotion}
              initial="initial"
              animate="animate"
              exit="exit"
              variants={ICON_SWAP_VARIANTS}
              className={iconClasses}
              aria-hidden="true"
            >
              <HiEyeOff className="h-full w-full" />
            </motion.span>
          ) : (
            <motion.span
              key="password-hidden"
              custom={prefersReducedMotion}
              initial="initial"
              animate="animate"
              exit="exit"
              variants={ICON_SWAP_VARIANTS}
              className={iconClasses}
              aria-hidden="true"
            >
              <HiEye className="h-full w-full" />
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>
    );
  }),
);

PasswordToggle.displayName = 'PasswordToggle';

PasswordToggle.propTypes = {
  /** Whether the password is currently visible. */
  isVisible: PropTypes.bool,
  /** Called when visibility should toggle. */
  onToggle: PropTypes.func,
  /** Disables interaction. */
  disabled: PropTypes.bool,
  /** Visual size scale. */
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
  /** Accessible label when password is hidden. */
  showLabel: PropTypes.string,
  /** Accessible label when password is visible. */
  hideLabel: PropTypes.string,
  /** Additional button classes. */
  className: PropTypes.string,
};

export default PasswordToggle;