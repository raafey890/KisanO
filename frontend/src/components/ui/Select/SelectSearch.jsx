/**
 * KisanO Design System — Select Package
 * SelectSearch
 *
 * A search input component for the Select menu. Renders an input field
 * with search icon, clear button, and accessibility support.
 *
 * Single Responsibility: Render search input and emit search events.
 * Does not implement filtering logic or manage select state.
 *
 * @module components/ui/Select/SelectSearch
 */

import { forwardRef, memo, useMemo, useCallback, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { motion, useReducedMotion } from 'framer-motion';

import {
  SELECT_DEFAULTS,
} from './selectVariants';
import {
  mergeClasses,
  resolveResponsiveClasses,
  getSelectSearchClasses,
} from './selectUtils';

/* ---------------------------------- */
/* Component-specific tokens          */
/* ---------------------------------- */

/** Motion variants for search animation. */
const SEARCH_MOTION = {
  initial: { opacity: 0, y: -4 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -4 },
  transition: { duration: 0.15, ease: [0.4, 0, 0.2, 1] },
};

/* ---------------------------------- */
/* Component                          */
/* ---------------------------------- */

/**
 * SelectSearch – a search input for the select menu.
 *
 * @component
 * @example
 * <SelectSearch
 *   value={searchTerm}
 *   onChange={setSearchTerm}
 *   placeholder="Search options..."
 * />
 */
const SelectSearch = memo(
  forwardRef(function SelectSearch(
    {
      value: controlledValue,
      defaultValue = '',
      onChange,
      placeholder = 'Search...',
      size = SELECT_DEFAULTS.size,
      disabled = false,
      loading = false,
      autoFocus = true,
      clearable = true,
      responsive,
      className = '',
      role = 'searchbox',
      'aria-label': ariaLabel = 'Search options',
      ...rest
    },
    ref,
  ) {
    const prefersReducedMotion = useReducedMotion();
    const inputRef = useRef(null);
    const [internalValue, setInternalValue] = useState(defaultValue);

    // Determine if controlled or uncontrolled.
    const isControlled = controlledValue !== undefined;
    const searchValue = isControlled ? controlledValue : internalValue;

    // Handle value change.
    const handleChange = useCallback(
      (newValue) => {
        if (!isControlled) {
          setInternalValue(newValue);
        }
        onChange?.(newValue);
      },
      [isControlled, onChange],
    );

    // Handle input change.
    const handleInputChange = useCallback(
      (event) => {
        if (disabled) return;
        handleChange(event.target.value);
      },
      [disabled, handleChange],
    );

    // Handle clear.
    const handleClear = useCallback(() => {
      if (disabled) return;
      handleChange('');
      inputRef.current?.focus();
    }, [disabled, handleChange]);

    // Handle key down.
    const handleKeyDown = useCallback(
      (event) => {
        if (event.key === 'Escape') {
          event.stopPropagation();
        }
      },
      [],
    );

    // Auto focus.
    useEffect(() => {
      if (autoFocus && inputRef.current) {
        setTimeout(() => inputRef.current?.focus(), 0);
      }
    }, [autoFocus]);

    // Responsive overrides.
    const responsiveClasses = useMemo(
      () => (responsive ? resolveResponsiveClasses(responsive) : ''),
      [responsive],
    );

    // Search classes.
    const searchClasses = useMemo(() => {
      const base = getSelectSearchClasses({
        size,
        className,
        disabled,
      });
      return mergeClasses(base, responsiveClasses);
    }, [size, className, disabled, responsiveClasses]);

    // Motion props - respect reduced motion.
    const motionProps = useMemo(() => {
      if (prefersReducedMotion) {
        return { initial: false, animate: true, exit: false };
      }
      return SEARCH_MOTION;
    }, [prefersReducedMotion]);

    // Accessibility attributes.
    const ariaProps = useMemo(
      () => ({
        role,
        'aria-label': ariaLabel,
        'aria-disabled': disabled || undefined,
        'aria-busy': loading || undefined,
        autoComplete: 'off',
        autoCorrect: 'off',
        autoCapitalize: 'off',
        spellCheck: false,
      }),
      [role, ariaLabel, disabled, loading],
    );

    return (
      <motion.div
        ref={ref}
        className={searchClasses}
        {...motionProps}
        {...rest}
      >
        {/* Search Icon */}
        <svg
          className="h-4 w-4 text-gray-400 shrink-0"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="M21 21l-4.35-4.35" />
        </svg>

        {/* Input */}
        <input
          ref={inputRef}
          type="text"
          value={searchValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          className="flex-1 bg-transparent outline-none min-w-0"
          {...ariaProps}
        />

        {/* Clear Button */}
        {clearable && searchValue && !disabled && !loading && (
          <button
            type="button"
            className="p-0.5 rounded-full hover:bg-gray-200 transition-colors shrink-0"
            onClick={handleClear}
            aria-label="Clear search"
          >
            <svg
              className="h-3.5 w-3.5 text-gray-400"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              viewBox="0 0 24 24"
            >
              <path d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}

        {/* Loading Spinner */}
        {loading && (
          <svg
            className="animate-spin h-4 w-4 text-gray-400 shrink-0"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 0 1 8-8v4a4 4 0 0 0-4 4H4z" />
          </svg>
        )}
      </motion.div>
    );
  }),
);

SelectSearch.displayName = 'SelectSearch';

SelectSearch.propTypes = {
  /** Controlled search value. */
  value: PropTypes.string,
  /** Default search value for uncontrolled mode. */
  defaultValue: PropTypes.string,
  /** Callback when search value changes. */
  onChange: PropTypes.func,
  /** Placeholder text. */
  placeholder: PropTypes.string,
  /** Size preset. */
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
  /** Disabled state. */
  disabled: PropTypes.bool,
  /** Loading state. */
  loading: PropTypes.bool,
  /** Auto-focus the input on mount. */
  autoFocus: PropTypes.bool,
  /** Whether the clear button is shown. */
  clearable: PropTypes.bool,
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
  /** Accessible label. */
  'aria-label': PropTypes.string,
};

export default SelectSearch;