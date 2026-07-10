'use client';
/**
 * KisanO Design System — Input Package
 * InputActions
 *
 * Single Responsibility: render the decorative and interactive adornments
 * that flank the raw `<input>` element — leading/trailing icons, prefix and
 * suffix text, a clear button, a password visibility toggle, and a loading
 * spinner. It renders NO input element itself; the parent (Input /
 * InputContainer) positions this component absolutely around InputField.
 *
 * Layout contract:
 * - `<InputActions.Leading />` → absolutely positioned at the left edge.
 * - `<InputActions.Trailing />` → absolutely positioned at the right edge.
 * - The default export renders both sides inside a passthrough fragment so
 * consumers can simply drop `<InputActions {...props} />` next to the
 * field inside a `relative` wrapper.
 *
 * Precedence (trailing side, left → right visual order):
 * suffix → clear → password toggle → right icon → spinner
 * While `loading` is true the spinner replaces the clear button and the
 * right icon to avoid overcrowding; the password toggle stays available.
 *
 * @module InputActions
 */
import {
  forwardRef,
  useCallback,
  useMemo,
  memo,
  Fragment,
} from 'react';
import PropTypes from 'prop-types';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { HiEye, HiEyeOff, HiX } from 'react-icons/hi';
import {
  INPUT_ICON_SIZES,
  INPUT_LOADING_STATE,
  INPUT_SPACING,
  INPUT_TRANSITIONS,
  INPUT_DEFAULTS,
} from './inputVariants';
import { mergeClasses, getIconClasses } from './inputUtils';
/* ---------------------------------- */
/* Constants */
/* ---------------------------------- */
/** Horizontal inset for each side, keyed by input size. */
const SIDE_INSET = {
  xs: { left: 'left-2.5', right: 'right-2.5' },
  sm: { left: 'left-3', right: 'right-3' },
  md: { left: 'left-3', right: 'right-3' },
  lg: { left: 'left-3.5', right: 'right-3.5' },
  xl: { left: 'left-4', right: 'right-4' },
};
/** Tap-target sizing for interactive action buttons, keyed by input size. */
const ACTION_BUTTON_SIZES = {
  xs: 'h-5 w-5',
  sm: 'h-6 w-6',
  md: 'h-6 w-6',
  lg: 'h-7 w-7',
  xl: 'h-8 w-8',
};
/** Typography for prefix/suffix affixes, keyed by input size. */
const AFFIX_TYPOGRAPHY = {
  xs: 'text-xs',
  sm: 'text-sm',
  md: 'text-sm',
  lg: 'text-base',
  xl: 'text-lg',
};
/* ---------------------------------- */
/* Motion Variants */
/* ---------------------------------- */
const ACTION_VARIANTS = {
  initial: { opacity: 0, scale: 0.55, rotate: -18, y: 4 },
  enter: { 
    opacity: 1, 
    scale: 1, 
    rotate: 0,
    y: 0,
    transition: { 
      type: "spring", 
      stiffness: 480, 
      damping: 24, 
      mass: 0.55 
    } 
  },
  exit: { 
    opacity: 0, 
    scale: 0.65, 
    rotate: 12,
    y: -2,
    transition: { duration: 0.16, ease: [0.4, 0, 1, 1] } 
  },
};

const BUTTON_VARIANTS = {
  hover: { 
    scale: 1.12, 
    transition: { type: "spring", stiffness: 550, damping: 14 } 
  },
  tap: { 
    scale: 0.9,
    transition: { type: "spring", stiffness: 650, damping: 18 } 
  },
};

const SPINNER_VARIANTS = {
  initial: { opacity: 0, rotate: -90, scale: 0.7 },
  animate: { 
    opacity: 1, 
    rotate: 360,
    scale: 1,
    transition: { 
      rotate: { duration: 0.75, repeat: Infinity, ease: "linear" },
      opacity: { duration: 0.22 },
      scale: { type: "spring", stiffness: 300 }
    } 
  },
  exit: { opacity: 0, scale: 0.6, transition: { duration: 0.18 } },
};

const PASSWORD_ICON_VARIANTS = {
  hidden: { opacity: 0, rotate: -110, scale: 0.65 },
  visible: { 
    opacity: 1, 
    rotate: 0, 
    scale: 1,
    transition: { type: "spring", stiffness: 420, damping: 20 }
  },
};

const ICON_VARIANTS = {
  initial: { opacity: 0.6, scale: 0.75 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { type: "spring", stiffness: 320, damping: 22 }
  },
};
/* ---------------------------------- */
/* Internal Building Blocks */
/* ---------------------------------- */
/**
 * Accessible, keyboard-operable icon button used for clear / password toggle.
 * Rendered as `type="button"` so it never submits enclosing forms.
 */
const ActionButton = memo(
  forwardRef(function ActionButton(
    {
      label,
      onClick,
      disabled,
      size,
      reduceMotion,
      className,
      children,
      ...rest
    },
    ref,
  ) {
    return (
      <motion.button
        ref={ref}
        type="button"
        aria-label={label}
        title={label}
        disabled={disabled}
        onClick={onClick}
        onMouseDown={(event) => event.preventDefault()} // Prevents stealing focus from input
        className={mergeClasses(
          'pointer-events-auto inline-flex items-center justify-center rounded-full',
          ACTION_BUTTON_SIZES[size] ?? ACTION_BUTTON_SIZES[INPUT_DEFAULTS.size],
          'text-gray-400 hover:text-[#2E7D32] hover:bg-[#2E7D32]/10 active:bg-[#2E7D32]/20',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2E7D32]/40 focus-visible:ring-offset-1',
          'disabled:cursor-not-allowed disabled:text-gray-300 disabled:hover:bg-transparent',
          INPUT_TRANSITIONS.colorsOnly,
          className,
        )}
        whileHover={!reduceMotion && !disabled ? BUTTON_VARIANTS.hover : undefined}
        whileTap={!reduceMotion && !disabled ? BUTTON_VARIANTS.tap : undefined}
        {...(reduceMotion ? {} : { variants: ACTION_VARIANTS, initial: "initial", animate: "enter", exit: "exit" })}
        {...rest}
      >
        {children}
      </motion.button>
    );
  }),
);
ActionButton.displayName = 'ActionButton';
ActionButton.propTypes = {
  /** Accessible label announced by screen readers. */
  label: PropTypes.string.isRequired,
  /** Click handler. */
  onClick: PropTypes.func,
  /** Disables the button. */
  disabled: PropTypes.bool,
  /** Input size key controlling the tap-target dimensions. */
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
  /** Suppresses enter/exit animations. */
  reduceMotion: PropTypes.bool,
  /** Extra classes. */
  className: PropTypes.string,
  /** Icon content. */
  children: PropTypes.node,
};
/**
 * Animated SVG spinner shown while the field is loading.
 * Marked `aria-hidden` — loading is announced via `aria-busy` on the field.
 */
const Spinner = memo(function Spinner({ size }) {
  const resolvedSize = size ?? INPUT_DEFAULTS.size;
  return (
    <motion.svg
      aria-hidden="true"
      className={mergeClasses(
        INPUT_ICON_SIZES[resolvedSize],
        INPUT_LOADING_STATE.spinner,
        'shrink-0',
      )}
      viewBox="0 0 24 24"
      fill="none"
      variants={SPINNER_VARIANTS}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 0 1 8-8v4a4 4 0 0 0-4 4H4z"
      />
    </motion.svg>
  );
});
Spinner.displayName = 'Spinner';
Spinner.propTypes = {
  /** Input size key controlling the spinner dimensions. */
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
};
/**
 * Non-interactive prefix/suffix text affix (e.g. "₹", "/day", "kg").
 */
const Affix = memo(function Affix({ children, size, className }) {
  const resolvedSize = size ?? INPUT_DEFAULTS.size;
  return (
    <motion.span
      initial={{ opacity: 0.5, y: 2 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
      className={mergeClasses(
        'pointer-events-none select-none font-sans text-gray-500',
        AFFIX_TYPOGRAPHY[resolvedSize],
        className,
      )}
    >
      {children}
    </motion.span>
  );
});
Affix.displayName = 'Affix';
Affix.propTypes = {
  /** Affix content. */
  children: PropTypes.node,
  /** Input size key controlling the affix typography. */
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
  /** Extra classes. */
  className: PropTypes.string,
};
/* ---------------------------------- */
/* InputActions */
/* ---------------------------------- */
/**
 * Action area for the KisanO Input component.
 *
 * Renders leading (left icon, prefix) and trailing (suffix, clear button,
 * password toggle, right icon, spinner) adornments as absolutely positioned
 * overlays. Must be placed inside a `relative` wrapper alongside InputField.
 *
 * @component
 * @example
 * <div className="relative">
 * <InputField type={showPassword ? 'text' : 'password'} ... />
 * <InputActions
 * size="md"
 * isPassword
 * isPasswordVisible={showPassword}
 * onTogglePassword={() => setShowPassword((v) => !v)}
 * clearable
 * showClear={hasValue(value)}
 * onClear={() => setValue('')}
 * />
 * </div>
 *
 * Note: The forwarded ref is attached to the trailing side container.
 * If you need a ref to the whole actions area, consider wrapping the
 * component in a container and forwarding a ref to that.
 */
const InputActions = forwardRef(function InputActions(
  {
    size = INPUT_DEFAULTS.size,
    status = 'none',
    disabled = false,
    loading = false,
    leftIcon = null,
    rightIcon = null,
    prefix = null,
    suffix = null,
    isPassword = false,
    isPasswordVisible = false,
    onTogglePassword,
    clearable = false,
    showClear = false,
    onClear,
    clearLabel = 'Clear input',
    showPasswordLabel = 'Show password',
    hidePasswordLabel = 'Hide password',
    className = '',
  },
  ref,
) {
  const prefersReducedMotion = useReducedMotion();
  const reduceMotion = Boolean(prefersReducedMotion);
  // Memoize derived values to avoid recomputation on each render
  const inset = useMemo(
    () => SIDE_INSET[size] ?? SIDE_INSET[INPUT_DEFAULTS.size],
    [size],
  );
  const iconClasses = useMemo(
    () => getIconClasses({ size, status, disabled }),
    [size, status, disabled],
  );
  const hasLeading = useMemo(
    () => Boolean(leftIcon || prefix),
    [leftIcon, prefix],
  );
  const canClear = useMemo(
    () => clearable && showClear && !loading && !disabled,
    [clearable, showClear, loading, disabled],
  );
  const showRightIcon = useMemo(
    () => Boolean(rightIcon) && !loading,
    [rightIcon, loading],
  );
  const hasTrailing = useMemo(
    () => Boolean(suffix) || canClear || isPassword || showRightIcon || loading,
    [suffix, canClear, isPassword, showRightIcon, loading],
  );
  // Memoize event handlers with stable references
  const handleClear = useCallback(
    (event) => {
      if (disabled) return;
      onClear?.(event);
    },
    [disabled, onClear],
  );
  const handleTogglePassword = useCallback(
    (event) => {
      if (disabled) return;
      onTogglePassword?.(event);
    },
    [disabled, onTogglePassword],
  );
  // Early return if nothing to render
  if (!hasLeading && !hasTrailing) {
    return null;
  }
  return (
    <Fragment>
      {/* Leading side: left icon + prefix */}
      {hasLeading && (
        <div
          className={mergeClasses(
            'pointer-events-none absolute inset-y-0 flex items-center',
            INPUT_SPACING.iconGap,
            inset.left,
            className,
          )}
        >
          {leftIcon && (
            <motion.span 
              aria-hidden="true" 
              className={iconClasses}
              variants={ICON_VARIANTS}
              initial="initial"
              animate="visible"
            >
              {leftIcon}
            </motion.span>
          )}
          {prefix && <Affix size={size}>{prefix}</Affix>}
        </div>
      )}
      {/* Trailing side: suffix + clear + password toggle + right icon + spinner */}
      {hasTrailing && (
        <div
          ref={ref} // forwardRef attached to the trailing container
          className={mergeClasses(
            'pointer-events-none absolute inset-y-0 flex items-center',
            INPUT_SPACING.iconGap,
            inset.right,
            className,
          )}
        >
          {suffix && <Affix size={size}>{suffix}</Affix>}
          
          <AnimatePresence initial={false} mode="popLayout">
            {canClear && (
              <ActionButton
                key="clear"
                label={clearLabel}
                onClick={handleClear}
                disabled={disabled}
                size={size}
                reduceMotion={reduceMotion}
              >
                <HiX aria-hidden="true" className="h-[1em] w-[1em] text-[0.875em]" />
              </ActionButton>
            )}
          </AnimatePresence>

          {isPassword && (
            <ActionButton
              key="password-toggle"
              label={isPasswordVisible ? hidePasswordLabel : showPasswordLabel}
              onClick={handleTogglePassword}
              disabled={disabled}
              size={size}
              reduceMotion={reduceMotion}
            >
              <AnimatePresence mode="wait" initial={false}>
                {isPasswordVisible ? (
                  <motion.span
                    key="eye-off"
                    variants={PASSWORD_ICON_VARIANTS}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                  >
                    <HiEyeOff aria-hidden="true" className="h-[1em] w-[1em]" />
                  </motion.span>
                ) : (
                  <motion.span
                    key="eye"
                    variants={PASSWORD_ICON_VARIANTS}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                  >
                    <HiEye aria-hidden="true" className="h-[1em] w-[1em]" />
                  </motion.span>
                )}
              </AnimatePresence>
            </ActionButton>
          )}

          {showRightIcon && (
            <motion.span 
              aria-hidden="true" 
              className={iconClasses}
              variants={ICON_VARIANTS}
              initial="initial"
              animate="visible"
            >
              {rightIcon}
            </motion.span>
          )}

          <AnimatePresence initial={false} mode="wait">
            {loading && (
              <motion.span
                key="spinner"
                className="inline-flex items-center"
                initial="initial"
                animate="animate"
                exit="exit"
                variants={SPINNER_VARIANTS}
              >
                <Spinner size={size} />
              </motion.span>
            )}
          </AnimatePresence>
        </div>
      )}
    </Fragment>
  );
});
InputActions.displayName = 'InputActions';
InputActions.propTypes = {
  /** Input size key — keeps adornments in scale with the field. */
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
  /** Validation status used to tint static icons. */
  status: PropTypes.oneOf(['none', 'error', 'success', 'warning']),
  /** Disables all interactive actions and mutes icon colors. */
  disabled: PropTypes.bool,
  /** Shows the loading spinner and hides clear / right icon. */
  loading: PropTypes.bool,
  /** Decorative leading icon element. */
  leftIcon: PropTypes.node,
  /** Decorative trailing icon element (hidden while loading). */
  rightIcon: PropTypes.node,
  /** Non-interactive leading text affix (e.g. "₹"). */
  prefix: PropTypes.node,
  /** Non-interactive trailing text affix (e.g. "/day"). */
  suffix: PropTypes.node,
  /** Whether the field is a password field (enables the visibility toggle). */
  isPassword: PropTypes.bool,
  /** Current password visibility, controlled by the parent. */
  isPasswordVisible: PropTypes.bool,
  /** Called when the password visibility toggle is activated. */
  onTogglePassword: PropTypes.func,
  /** Enables the clear button behavior. */
  clearable: PropTypes.bool,
  /** Whether the clear button is currently visible (parent decides via hasValue). */
  showClear: PropTypes.bool,
  /** Called when the clear button is activated. */
  onClear: PropTypes.func,
  /** Accessible label for the clear button. */
  clearLabel: PropTypes.string,
  /** Accessible label for the toggle when the password is hidden. */
  showPasswordLabel: PropTypes.string,
  /** Accessible label for the toggle when the password is visible. */
  hidePasswordLabel: PropTypes.string,
  /** Extra classes applied to each side's wrapper. */
  className: PropTypes.string,
};
export default InputActions;