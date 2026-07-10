import {
  forwardRef,
  memo,
  useCallback,
  useEffect,
  useId,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import PropTypes from 'prop-types';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { INPUT_DEFAULTS } from './inputVariants';
import { hasValue, mergeClasses } from './inputUtils';
import InputContainer from './InputContainer';
import InputField from './InputField';
import InputActions from './InputActions';
import InputCounter from './InputCounter';
import InputLabel from './InputLabel';
import InputHelperText from './InputHelperText';
import InputError from './InputError';

/**
 * KisanO Design System — Input Package
 * Input
 *
 * The main orchestration component for the KisanO Input package.
 * It composes the package's atomic building blocks into a complete,
 * production-ready field without reimplementing child logic.
 *
 * Responsibilities:
 * - Coordinate label, field, actions, helper text, error message, and counter
 * - Manage local UI-only state such as focus and password visibility
 * - Wire ARIA relationships across the composed field
 * - Support controlled and uncontrolled usage
 *
 * This component intentionally delegates rendering logic and visual behavior
 * to the specialized child components in the package.
 *
 * @module components/ui/Input/Input
 */

/**
 * Supported input types for the public Input API.
 * @type {ReadonlyArray<string>}
 */
const INPUT_TYPES = Object.freeze([
  'text',
  'email',
  'password',
  'search',
  'tel',
  'number',
  'url',
  'date',
]);

const FOOTER_VARIANTS = {
  initial: {
    opacity: 0,
    y: 4,
  },
  animate: (reducedMotion) => ({
    opacity: 1,
    y: 0,
    transition: reducedMotion
      ? {
          duration: 0.14,
          ease: 'easeOut',
        }
      : {
          type: 'spring',
          stiffness: 340,
          damping: 28,
          mass: 0.75,
        },
  }),
  exit: {
    opacity: 0,
    y: -2,
    transition: {
      duration: 0.12,
      ease: 'easeIn',
    },
  },
};

/**
 * Resolves a single validation status from the provided flags.
 *
 * Precedence:
 * error > warning > success > none
 *
 * @param {Object} flags - Status flags.
 * @param {boolean} flags.error - Error flag.
 * @param {boolean} flags.warning - Warning flag.
 * @param {boolean} flags.success - Success flag.
 * @returns {'none'|'error'|'success'|'warning'} Resolved status.
 */
function resolveStatus({ error, warning, success }) {
  if (error) return 'error';
  if (warning) return 'warning';
  if (success) return 'success';
  return 'none';
}

/**
 * Normalizes any value into a string-safe value for display-oriented logic.
 *
 * @param {string|number|null|undefined} value - Input value.
 * @returns {string|number} Normalized value.
 */
function normalizeValue(value) {
  if (value === null || value === undefined) {
    return '';
  }

  return value;
}

/**
 * Creates a safe DOM id suffix from a React-generated id.
 *
 * @param {string} reactId - React-generated id.
 * @returns {string} Sanitized id suffix.
 */
function sanitizeId(reactId) {
  return String(reactId).replace(/[:]/g, '');
}

/**
 * Dispatches a native input event so controlled parents can react to clear actions.
 *
 * @param {HTMLInputElement|null} element - Input element.
 * @param {string} nextValue - Next input value.
 * @returns {boolean} Whether a native input event was dispatched.
 */
function dispatchNativeInputChange(element, nextValue) {
  if (!element || typeof window === 'undefined') {
    return false;
  }

  const descriptor = Object.getOwnPropertyDescriptor(
    window.HTMLInputElement.prototype,
    'value',
  );

  if (!descriptor?.set) {
    return false;
  }

  descriptor.set.call(element, nextValue);
  element.dispatchEvent(new Event('input', { bubbles: true }));

  return true;
}

/**
 * Main KisanO Input component.
 *
 * @component
 * @param {Object} props - Component props.
 * @param {string} [props.id] - Input id. Auto-generated when omitted.
 * @param {string} [props.name] - Native input name.
 * @param {'text'|'email'|'password'|'search'|'tel'|'number'|'url'|'date'} [props.type='text'] - Input type.
 * @param {string|number} [props.value] - Controlled input value.
 * @param {string|number} [props.defaultValue] - Uncontrolled default value.
 * @param {Function} [props.onChange] - Native change handler.
 * @param {Function} [props.onFocus] - Native focus handler.
 * @param {Function} [props.onBlur] - Native blur handler.
 * @param {Function} [props.onKeyDown] - Native keydown handler.
 * @param {Function} [props.onClear] - Called after clear action.
 * @param {string} [props.label] - Floating label text.
 * @param {string|React.ReactNode} [props.helperText] - Helper content.
 * @param {'default'|'info'|'success'|'warning'} [props.helperTextState] - Helper text visual state.
 * @param {string|string[]|React.ReactNode|boolean} [props.error] - Error state or error content.
 * @param {string|string[]|React.ReactNode} [props.errorMessage] - Explicit error content.
 * @param {boolean} [props.success=false] - Success state.
 * @param {boolean} [props.warning=false] - Warning state.
 * @param {React.ReactNode} [props.leftIcon] - Leading icon.
 * @param {React.ReactNode} [props.rightIcon] - Trailing icon.
 * @param {React.ReactNode} [props.prefix] - Leading text affix.
 * @param {React.ReactNode} [props.suffix] - Trailing text affix.
 * @param {boolean} [props.loading=false] - Loading state.
 * @param {boolean} [props.disabled=false] - Disabled state.
 * @param {boolean} [props.readOnly=false] - Read-only state.
 * @param {boolean} [props.required=false] - Required state.
 * @param {boolean} [props.characterCounter=false] - Renders the character counter.
 * @param {number} [props.maxLength] - Maximum input length.
 * @param {boolean} [props.showCounterProgress=false] - Shows counter progress.
 * @param {boolean} [props.showCounterRemaining=false] - Announces remaining characters.
 * @param {boolean} [props.showPasswordToggle=false] - Enables password visibility toggle.
 * @param {boolean} [props.showClearButton=false] - Enables the clear action.
 * @param {string} [props.placeholder] - Native placeholder.
 * @param {string} [props.autoComplete] - Native autocomplete value.
 * @param {boolean} [props.autoFocus=false] - Native autofocus.
 * @param {number} [props.minLength] - Native minLength.
 * @param {string} [props.pattern] - Native validation pattern.
 * @param {'none'|'text'|'tel'|'url'|'email'|'numeric'|'decimal'|'search'} [props.inputMode] - Native inputMode.
 * @param {'default'|'filled'|'outlined'|'ghost'|'underlined'} [props.variant='default'] - Visual variant.
 * @param {'xs'|'sm'|'md'|'lg'|'xl'} [props.size='md'] - Size scale.
 * @param {'square'|'rounded'|'pill'} [props.shape='rounded'] - Shape preset.
 * @param {'none'|'sm'|'md'|'lg'|'full'} [props.radius] - Radius override.
 * @param {boolean} [props.fullWidth=true] - Stretch to parent width.
 * @param {boolean} [props.withMargin=true] - Apply default field margin.
 * @param {boolean} [props.animate=true] - Enable container entrance motion.
 * @param {string} [props.className=''] - Container class name.
 * @param {string} [props.inputClassName=''] - Input field class name.
 * @param {string} [props.actionsClassName=''] - Actions wrapper class name.
 * @param {string} [props.helperClassName=''] - Helper text class name.
 * @param {string} [props.errorClassName=''] - Error text class name.
 * @param {string} [props.counterClassName=''] - Counter class name.
 * @param {string} [props.counterLabel='Character count'] - Counter accessible label.
 * @param {string} [props.clearLabel='Clear input'] - Clear button accessible label.
 * @param {string} [props.showPasswordLabel='Show password'] - Password toggle accessible label.
 * @param {string} [props.hidePasswordLabel='Hide password'] - Password toggle accessible label.
 * @param {string} [props.requiredLabel='required'] - Required indicator accessible label.
 * @param {string} [props['aria-label']] - Accessible label when no visible label is rendered.
 * @param {string} [props['aria-describedby']] - External described-by ids.
 * @returns {JSX.Element} Fully composed input field.
 */
const Input = memo(
  forwardRef(function Input(
    {
      id,
      name,
      type = 'text',
      value,
      defaultValue,
      onChange,
      onFocus,
      onBlur,
      onKeyDown,
      onClear,
      label,
      helperText,
      helperTextState,
      error = false,
      errorMessage,
      success = false,
      warning = false,
      leftIcon,
      rightIcon,
      prefix,
      suffix,
      loading = false,
      disabled = false,
      readOnly = false,
      required = false,
      characterCounter = false,
      maxLength,
      showCounterProgress = false,
      showCounterRemaining = false,
      showPasswordToggle = false,
      showClearButton = false,
      placeholder,
      autoComplete,
      autoFocus = false,
      minLength,
      pattern,
      inputMode,
      variant = INPUT_DEFAULTS.variant,
      size = INPUT_DEFAULTS.size,
      shape = INPUT_DEFAULTS.shape,
      radius,
      fullWidth = true,
      withMargin = true,
      animate = true,
      className = '',
      inputClassName = '',
      actionsClassName = '',
      helperClassName = '',
      errorClassName = '',
      counterClassName = '',
      counterLabel = 'Character count',
      clearLabel = 'Clear input',
      showPasswordLabel = 'Show password',
      hidePasswordLabel = 'Hide password',
      requiredLabel = 'required',
      'aria-label': ariaLabel,
      'aria-describedby': ariaDescribedBy,
      ...rest
    },
    forwardedRef,
  ) {
    const reactId = useId();
    const prefersReducedMotion = useReducedMotion();
    const inputRef = useRef(null);

    useImperativeHandle(forwardedRef, () => inputRef.current);

    const inputId = useMemo(
      () => id ?? `kisano-input-${sanitizeId(reactId)}`,
      [id, reactId],
    );

    const helperId = `${inputId}-helper`;
    const errorId = `${inputId}-error`;
    const counterId = `${inputId}-counter`;

    const isControlled = value !== undefined;

    const [uncontrolledValue, setUncontrolledValue] = useState(() =>
      normalizeValue(defaultValue),
    );
    const [isFocused, setIsFocused] = useState(false);
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    useEffect(() => {
      if (!isControlled) {
        setUncontrolledValue(normalizeValue(defaultValue));
      }
    }, [defaultValue, isControlled]);

    const currentValue = isControlled ? normalizeValue(value) : uncontrolledValue;
    const hasCurrentValue = hasValue(currentValue);

    const resolvedErrorMessage = useMemo(() => {
      if (typeof error === 'boolean') {
        return errorMessage ?? null;
      }

      return error ?? errorMessage ?? null;
    }, [error, errorMessage]);

    const hasError = useMemo(() => {
      if (typeof error === 'boolean') {
        return error || Boolean(errorMessage);
      }

      if (Array.isArray(error)) {
        return error.length > 0;
      }

      return Boolean(error) || Boolean(errorMessage);
    }, [error, errorMessage]);

    const status = useMemo(
      () =>
        resolveStatus({
          error: hasError,
          warning,
          success,
        }),
      [hasError, success, warning],
    );

    const resolvedType = useMemo(() => {
      if (type !== 'password') {
        return type;
      }

      return showPasswordToggle && isPasswordVisible ? 'text' : 'password';
    }, [isPasswordVisible, showPasswordToggle, type]);

    const helperState = useMemo(() => {
      if (helperTextState) {
        return helperTextState;
      }

      if (status === 'success') {
        return 'success';
      }

      if (status === 'warning') {
        return 'warning';
      }

      return 'default';
    }, [helperTextState, status]);

    const describedBy = useMemo(() => {
      const ids = [
        ariaDescribedBy,
        hasError && resolvedErrorMessage ? errorId : null,
        !hasError && helperText ? helperId : null,
        characterCounter ? counterId : null,
      ].filter(Boolean);

      return ids.length ? ids.join(' ') : undefined;
    }, [
      ariaDescribedBy,
      characterCounter,
      errorId,
      hasError,
      helperId,
      helperText,
      resolvedErrorMessage,
    ]);

    const shouldShowCounter = useMemo(
      () => characterCounter && (Boolean(maxLength) || hasCurrentValue || currentValue === 0),
      [characterCounter, currentValue, hasCurrentValue, maxLength],
    );

    const showClear = useMemo(
      () =>
        showClearButton &&
        hasCurrentValue &&
        !disabled &&
        !readOnly &&
        !loading,
      [disabled, hasCurrentValue, loading, readOnly, showClearButton],
    );

    const hasLeftDecoration = Boolean(leftIcon || prefix);
    const hasRightDecoration = Boolean(
      suffix || rightIcon || loading || (type === 'password' && showPasswordToggle) || showClear,
    );

    const footerClasses = useMemo(
      () =>
        mergeClasses(
          'flex w-full items-start justify-between gap-3',
          shouldShowCounter ? 'flex-wrap sm:flex-nowrap' : '',
        ),
      [shouldShowCounter],
    );

    const feedbackClasses = useMemo(
      () => mergeClasses('min-w-0 flex-1'),
      [],
    );

    const handleChange = useCallback(
      (event) => {
        if (!isControlled) {
          setUncontrolledValue(event.target.value);
        }

        onChange?.(event);
      },
      [isControlled, onChange],
    );

    const handleFocus = useCallback(
      (event) => {
        setIsFocused(true);
        onFocus?.(event);
      },
      [onFocus],
    );

    const handleBlur = useCallback(
      (event) => {
        setIsFocused(false);
        onBlur?.(event);
      },
      [onBlur],
    );

    const handleTogglePassword = useCallback(() => {
      if (disabled || readOnly) {
        return;
      }

      setIsPasswordVisible((prev) => !prev);
      inputRef.current?.focus();
    }, [disabled, readOnly]);

    const handleClear = useCallback(
      (event) => {
        if (disabled || readOnly || loading) {
          return;
        }

        if (!isControlled) {
          setUncontrolledValue('');
        }

        const nativeEventDispatched = dispatchNativeInputChange(inputRef.current, '');

        if (!nativeEventDispatched) {
          onChange?.({
            ...event,
            target: { value: '' },
            currentTarget: { value: '' },
          });
        }

        inputRef.current?.focus();
        onClear?.(event);
      },
      [disabled, isControlled, loading, onChange, onClear, readOnly],
    );

    return (
      <InputContainer
        id={`${inputId}-container`}
        error={status === 'error'}
        success={status === 'success'}
        warning={status === 'warning'}
        loading={loading}
        disabled={disabled}
        readOnly={readOnly}
        fullWidth={fullWidth}
        withMargin={withMargin}
        animate={animate}
        className={className}
      >
        {label ? (
          <InputLabel
            id={inputId}
            label={label}
            required={required}
            requiredLabel={requiredLabel}
            isFocused={isFocused || hasCurrentValue}
            disabled={disabled}
            error={status === 'error'}
            success={status === 'success'}
            warning={status === 'warning'}
            variant={variant}
          />
        ) : null}

        <div className="relative">
          <InputField
            ref={inputRef}
            id={inputId}
            name={name}
            type={resolvedType}
            value={isControlled ? currentValue : undefined}
            defaultValue={isControlled ? undefined : currentValue}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onKeyDown={onKeyDown}
            placeholder={placeholder}
            autoFocus={autoFocus}
            autoComplete={autoComplete}
            maxLength={maxLength}
            minLength={minLength}
            pattern={pattern}
            inputMode={inputMode}
            variant={variant}
            size={size}
            shape={shape}
            radius={radius}
            disabled={disabled}
            readOnly={readOnly}
            required={required}
            loading={loading}
            error={status === 'error'}
            success={status === 'success'}
            warning={status === 'warning'}
            hasLeftIcon={hasLeftDecoration}
            hasRightIcon={hasRightDecoration}
            fullWidth={fullWidth}
            className={inputClassName}
            aria-label={ariaLabel}
            aria-describedby={describedBy}
            {...rest}
          />

          <InputActions
            size={size}
            status={status}
            disabled={disabled || readOnly}
            loading={loading}
            leftIcon={leftIcon}
            rightIcon={rightIcon}
            prefix={prefix}
            suffix={suffix}
            isPassword={type === 'password' && showPasswordToggle}
            isPasswordVisible={isPasswordVisible}
            onTogglePassword={handleTogglePassword}
            clearable={showClearButton}
            showClear={showClear}
            onClear={handleClear}
            clearLabel={clearLabel}
            showPasswordLabel={showPasswordLabel}
            hidePasswordLabel={hidePasswordLabel}
            className={actionsClassName}
          />
        </div>

        {(hasError && resolvedErrorMessage) || helperText || shouldShowCounter ? (
          <motion.div
            custom={prefersReducedMotion}
            initial="initial"
            animate="animate"
            variants={FOOTER_VARIANTS}
            className={footerClasses}
          >
            <div className={feedbackClasses}>
              <AnimatePresence initial={false} mode="wait">
                {hasError && resolvedErrorMessage ? (
                  <motion.div
                    key="error"
                    initial={prefersReducedMotion ? false : { opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={prefersReducedMotion ? undefined : { opacity: 0, y: -2 }}
                    transition={
                      prefersReducedMotion
                        ? { duration: 0.12, ease: 'easeOut' }
                        : { duration: 0.18, ease: [0.23, 1, 0.32, 1] }
                    }
                  >
                    <InputError
                      id={errorId}
                      message={resolvedErrorMessage}
                      className={errorClassName}
                    />
                  </motion.div>
                ) : helperText ? (
                  <motion.div
                    key="helper"
                    initial={prefersReducedMotion ? false : { opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={prefersReducedMotion ? undefined : { opacity: 0, y: -2 }}
                    transition={
                      prefersReducedMotion
                        ? { duration: 0.12, ease: 'easeOut' }
                        : { duration: 0.18, ease: [0.23, 1, 0.32, 1] }
                    }
                  >
                    <InputHelperText
                      id={helperId}
                      state={helperState}
                      className={helperClassName}
                    >
                      {helperText}
                    </InputHelperText>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </div>

            {shouldShowCounter ? (
              <InputCounter
                id={counterId}
                value={currentValue}
                maxLength={maxLength}
                showProgress={showCounterProgress}
                showRemaining={showCounterRemaining}
                className={counterClassName}
                counterLabel={counterLabel}
              />
            ) : null}
          </motion.div>
        ) : null}
      </InputContainer>
    );
  }),
);

Input.displayName = 'Input';

Input.propTypes = {
  /** Input id. Auto-generated when omitted. */
  id: PropTypes.string,
  /** Native input name. */
  name: PropTypes.string,
  /** Input type. */
  type: PropTypes.oneOf(INPUT_TYPES),
  /** Controlled input value. */
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  /** Uncontrolled default value. */
  defaultValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  /** Native change handler. */
  onChange: PropTypes.func,
  /** Native focus handler. */
  onFocus: PropTypes.func,
  /** Native blur handler. */
  onBlur: PropTypes.func,
  /** Native keydown handler. */
  onKeyDown: PropTypes.func,
  /** Called after clear action. */
  onClear: PropTypes.func,
  /** Floating label content. */
  label: PropTypes.string,
  /** Helper text content. */
  helperText: PropTypes.node,
  /** Helper text visual state. */
  helperTextState: PropTypes.oneOf(['default', 'info', 'success', 'warning']),
  /** Error state or error content. */
  error: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
    PropTypes.node,
    PropTypes.arrayOf(PropTypes.node),
  ]),
  /** Explicit error content. */
  errorMessage: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.node,
    PropTypes.arrayOf(PropTypes.node),
  ]),
  /** Success state. */
  success: PropTypes.bool,
  /** Warning state. */
  warning: PropTypes.bool,
  /** Leading icon. */
  leftIcon: PropTypes.node,
  /** Trailing icon. */
  rightIcon: PropTypes.node,
  /** Leading text affix. */
  prefix: PropTypes.node,
  /** Trailing text affix. */
  suffix: PropTypes.node,
  /** Loading state. */
  loading: PropTypes.bool,
  /** Disabled state. */
  disabled: PropTypes.bool,
  /** Read-only state. */
  readOnly: PropTypes.bool,
  /** Required state. */
  required: PropTypes.bool,
  /** Enables the character counter. */
  characterCounter: PropTypes.bool,
  /** Native maxLength. */
  maxLength: PropTypes.number,
  /** Shows counter progress. */
  showCounterProgress: PropTypes.bool,
  /** Announces remaining characters. */
  showCounterRemaining: PropTypes.bool,
  /** Enables password visibility toggle. */
  showPasswordToggle: PropTypes.bool,
  /** Enables clear action. */
  showClearButton: PropTypes.bool,
  /** Native placeholder. */
  placeholder: PropTypes.string,
  /** Native autocomplete value. */
  autoComplete: PropTypes.string,
  /** Native autofocus. */
  autoFocus: PropTypes.bool,
  /** Native minLength. */
  minLength: PropTypes.number,
  /** Native validation pattern. */
  pattern: PropTypes.string,
  /** Native inputMode. */
  inputMode: PropTypes.oneOf([
    'none',
    'text',
    'tel',
    'url',
    'email',
    'numeric',
    'decimal',
    'search',
  ]),
  /** Visual variant. */
  variant: PropTypes.oneOf(['default', 'filled', 'outlined', 'ghost', 'underlined']),
  /** Size scale. */
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
  /** Shape preset. */
  shape: PropTypes.oneOf(['square', 'rounded', 'pill']),
  /** Radius override. */
  radius: PropTypes.oneOf(['none', 'sm', 'md', 'lg', 'full']),
  /** Stretch to parent width. */
  fullWidth: PropTypes.bool,
  /** Apply default field margin. */
  withMargin: PropTypes.bool,
  /** Enable container entrance motion. */
  animate: PropTypes.bool,
  /** Container class name. */
  className: PropTypes.string,
  /** Input field class name. */
  inputClassName: PropTypes.string,
  /** Actions wrapper class name. */
  actionsClassName: PropTypes.string,
  /** Helper text class name. */
  helperClassName: PropTypes.string,
  /** Error text class name. */
  errorClassName: PropTypes.string,
  /** Counter class name. */
  counterClassName: PropTypes.string,
  /** Counter accessible label. */
  counterLabel: PropTypes.string,
  /** Clear button accessible label. */
  clearLabel: PropTypes.string,
  /** Password toggle accessible label when hidden. */
  showPasswordLabel: PropTypes.string,
  /** Password toggle accessible label when visible. */
  hidePasswordLabel: PropTypes.string,
  /** Required indicator accessible label. */
  requiredLabel: PropTypes.string,
  /** Accessible label when no visible label exists. */
  'aria-label': PropTypes.string,
  /** External described-by ids. */
  'aria-describedby': PropTypes.string,
};

export default Input;