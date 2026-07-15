/**
 * KisanO Design System — Navbar Package
 * NavbarSearch
 *
 * The search component for the navbar. Renders a search input with
 * search icon, clear button, loading state, and accessibility support.
 *
 * Single Responsibility: Render the navbar search component.
 * Does not manage search logic or navbar state.
 *
 * @module components/ui/Navbar/NavbarSearch
 */

import { forwardRef, memo, useMemo, useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { motion, useReducedMotion } from 'framer-motion';

import {
  NAVBAR_DEFAULTS,
} from './navbarVariants';
import {
  mergeClasses,
  resolveResponsiveClasses,
} from './navbarUtils';

/* ---------------------------------- */
/* Component-specific tokens          */
/* ---------------------------------- */

/** Motion variants for search animation. */
const SEARCH_MOTION = {
  initial: { opacity: 0, scale: 0.9 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.9 },
  transition: { duration: 0.2, ease: [0.4, 0, 0.2, 1] },
};

/** Search sizes. */
const SEARCH_SIZES = {
  xs: 'h-8 text-xs px-2',
  sm: 'h-9 text-sm px-3',
  md: 'h-10 text-sm px-3',
  lg: 'h-11 text-base px-4',
  xl: 'h-12 text-base px-4',
};

/** Icon sizes. */
const ICON_SIZES = {
  xs: 'h-3 w-3',
  sm: 'h-3.5 w-3.5',
  md: 'h-4 w-4',
  lg: 'h-4.5 w-4.5',
  xl: 'h-5 w-5',
};

/* ---------------------------------- */
/* Component                          */
/* ---------------------------------- */

/**
 * NavbarSearch – the search input for the navbar.
 *
 * @component
 * @example
 * <NavbarSearch
 *   value={searchTerm}
 *   onChange={setSearchTerm}
 *   placeholder="Search..."
 * />
 */
const NavbarSearch = memo(
  forwardRef(function NavbarSearch(
    {
      value: controlledValue,
      defaultValue = '',
      onChange,
      onClear,
      onFocus,
      onBlur,
      placeholder = 'Search...',
      size = NAVBAR_DEFAULTS.size,
      disabled = false,
      loading = false,
      showClear = true,
      responsive,
      className = '',
      role = 'search',
      'aria-label': ariaLabel = 'Search',
      ...rest
    },
    ref,
  ) {
    const prefersReducedMotion = useReducedMotion();
    const [internalValue, setInternalValue] = useState(defaultValue);
    const [isFocused, setIsFocused] = useState(false);

    // Determine if controlled or uncontrolled.
    const isControlled = controlledValue !== undefined;
    const value = isControlled ? controlledValue : internalValue;

    // Search size.
    const searchSize = useMemo(
      () => SEARCH_SIZES[size] || SEARCH_SIZES.md,
      [size],
    );

    // Icon size.
    const iconSize = useMemo(
      () => ICON_SIZES[size] || ICON_SIZES.md,
      [size],
    );

    // Responsive overrides.
    const responsiveClasses = useMemo(
      () => (responsive ? resolveResponsiveClasses(responsive) : ''),
      [responsive],
    );

    // Search classes.
    const searchClasses = useMemo(() => {
      const base = mergeClasses(
        'flex items-center rounded-md',
        'bg-gray-100 dark:bg-gray-800',
        'text-gray-900 dark:text-white',
        'transition-all duration-200 ease-in-out',
        searchSize,
        isFocused && 'ring-2 ring-blue-500 bg-white dark:bg-gray-900',
        disabled && 'opacity-50 cursor-not-allowed',
        loading && 'opacity-70',
        className,
      );
      return mergeClasses(base, responsiveClasses);
    }, [searchSize, isFocused, disabled, loading, className, responsiveClasses]);

    // Input classes.
    const inputClasses = useMemo(() => {
      const base = mergeClasses(
        'flex-1 bg-transparent outline-none min-w-0',
        'placeholder-gray-400 dark:placeholder-gray-500',
        disabled && 'cursor-not-allowed',
      );
      return base;
    }, [disabled]);

    // Handle change.
    const handleChange = useCallback(
      (event) => {
        if (disabled || loading) return;
        const newValue = event.target.value;
        if (!isControlled) {
          setInternalValue(newValue);
        }
        onChange?.(newValue, event);
      },
      [disabled, loading, isControlled, onChange],
    );

    // Handle focus.
    const handleFocus = useCallback(
      (event) => {
        if (disabled || loading) return;
        setIsFocused(true);
        onFocus?.(event);
      },
      [disabled, loading, onFocus],
    );

    // Handle blur.
    const handleBlur = useCallback(
      (event) => {
        setIsFocused(false);
        onBlur?.(event);
      },
      [onBlur],
    );

    // Handle clear.
    const handleClear = useCallback(
      (event) => {
        if (disabled || loading) return;
        if (!isControlled) {
          setInternalValue('');
        }
        onChange?.('', event);
        onClear?.(event);
      },
      [disabled, loading, isControlled, onChange, onClear],
    );

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
      }),
      [role, ariaLabel, disabled, loading],
    );

    return (
      <motion.div
        ref={ref}
        className={searchClasses}
        {...motionProps}
        {...ariaProps}
        {...rest}
      >
        {/* Search Icon */}
        <svg
          className={mergeClasses(
            iconSize,
            'shrink-0 text-gray-400 dark:text-gray-500',
          )}
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
          type="text"
          value={value}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          disabled={disabled || loading}
          className={inputClasses}
        />

        {/* Clear Button */}
        {showClear && value && !disabled && !loading && (
          <button
            type="button"
            className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors shrink-0"
            onClick={handleClear}
            aria-label="Clear search"
          >
            <svg
              className={mergeClasses(
                iconSize,
                'text-gray-400 dark:text-gray-500',
              )}
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}

        {/* Loading Spinner */}
        {loading && (
          <svg
            className={mergeClasses(
              iconSize,
              'animate-spin shrink-0 text-gray-400',
            )}
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

NavbarSearch.displayName = 'NavbarSearch';

NavbarSearch.propTypes = {
  /** Controlled search value. */
  value: PropTypes.string,
  /** Default search value for uncontrolled mode. */
  defaultValue: PropTypes.string,
  /** Callback when search value changes. */
  onChange: PropTypes.func,
  /** Callback when clear button is clicked. */
  onClear: PropTypes.func,
  /** Focus handler. */
  onFocus: PropTypes.func,
  /** Blur handler. */
  onBlur: PropTypes.func,
  /** Placeholder text. */
  placeholder: PropTypes.string,
  /** Size preset. */
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
  /** Disabled state. */
  disabled: PropTypes.bool,
  /** Loading state. */
  loading: PropTypes.bool,
  /** Whether to show clear button. */
  showClear: PropTypes.bool,
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

export default NavbarSearch;