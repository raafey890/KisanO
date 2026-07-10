import React from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';

/**
 * Utility function to cleanly merge Tailwind CSS classes.
 * Ensures consistent class string formatting without undefined/null values.
 * * @param {...(string|boolean|undefined|null)} classes 
 * @returns {string}
 */
const cn = (...classes) => classes.filter(Boolean).join(' ').trim();

/**
 * Size mappings for the spinner to maintain consistency 
 * with the overall KisanO Design System Button sizes.
 */
const SIZE_MAP = {
  xs: 'w-3.5 h-3.5 border-[1.5px]',
  sm: 'w-4 h-4 border-2',
  md: 'w-5 h-5 border-2',
  lg: 'w-6 h-6 border-[2.5px]',
  xl: 'w-7 h-7 border-[3px]',
};

/**
 * ButtonSpinner Component - KisanO Design System
 * * A production-ready, accessible, and smoothly animated loading indicator 
 * designed specifically for use inside buttons. Built with Framer Motion 
 * for hardware-accelerated animations and Tailwind CSS for styling.
 * * @param {Object} props
 * @param {'xs' | 'sm' | 'md' | 'lg' | 'xl'} [props.size='md'] - The dimensions of the spinner.
 * @param {string} [props.color='currentColor'] - Optional color override, defaults to inheriting the parent text color.
 * @param {string} [props.className] - Additional Tailwind classes for layout positioning (e.g., margins).
 */
const ButtonSpinner = ({
  size = 'md',
  color = 'currentColor',
  className = '',
}) => {
  // Fallback to 'md' if an invalid size is provided
  const spinnerDimensions = SIZE_MAP[size] || SIZE_MAP.md;

  return (
    <motion.svg
      // Accessibility attributes
      role="status"
      aria-label="Loading..."
      aria-live="polite"
      // Framer Motion properties for an infinite, smooth linear rotation
      animate={{ rotate: 360 }}
      transition={{ 
        repeat: Infinity, 
        duration: 0.75, 
        ease: 'linear' 
      }}
      // Viewbox optimized for a standard 24x24 scalable vector
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      // Dynamic styling
      className={cn(
        'inline-block shrink-0',
        spinnerDimensions,
        className
      )}
      style={{ color }}
    >
      {/* Background track of the spinner (semi-transparent) */}
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
      />
      {/* Active spinning arc (solid) */}
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </motion.svg>
  );
};

ButtonSpinner.propTypes = {
  /** Controls the width and height of the spinner */
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
  /** Custom color value (hex, rgba, or tailwind arbitrary value), defaults to currentColor */
  color: PropTypes.string,
  /** Additional CSS classes to merge into the final class string */
  className: PropTypes.string,
};

export default ButtonSpinner;