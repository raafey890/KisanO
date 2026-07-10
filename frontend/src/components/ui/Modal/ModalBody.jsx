/**
 * KisanO Design System — Modal Package
 * ModalBody
 *
 * The main content area of a Modal. Renders the body content with
 * proper padding, spacing, and scroll behavior. Supports loading states
 * and accessibility attributes.
 *
 * Single Responsibility: Render the modal body content with layout
 * and accessibility support. Does not handle header, footer, or
 * modal visibility.
 *
 * @module components/ui/Modal/ModalBody
 */

import { forwardRef, memo, useMemo } from 'react';
import PropTypes from 'prop-types';
import { motion, useReducedMotion } from 'framer-motion';

import {
  
  MODAL_DEFAULTS,
} from './modalVariants';
import {
  mergeClasses,
  resolveResponsiveClasses,
} from './modalUtils';
import ModalLoader from './ModalLoader';

/* ---------------------------------- */
/* Component‑specific tokens          */
/* ---------------------------------- */

/** Padding presets. */
const PADDING_MAP = {
  none: 'p-0',
  xs: 'p-3',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
  xl: 'p-10',
};

/** Spacing (gap) presets. */
const SPACING_MAP = {
  none: 'gap-0',
  xs: 'gap-2',
  sm: 'gap-3',
  md: 'gap-4',
  lg: 'gap-6',
  xl: 'gap-8',
};

/** Default padding when not provided. */
const DEFAULT_PADDING = MODAL_DEFAULTS.padding || 'md';
const DEFAULT_SPACING = MODAL_DEFAULTS.spacing || 'md';

/* ---------------------------------- */
/* Component                          */
/* ---------------------------------- */

/**
 * ModalBody – the content area of a modal.
 *
 * @component
 * @example
 * <ModalBody padding="lg" scrollable>
 *   <p>Main content goes here...</p>
 * </ModalBody>
 */
const ModalBody = memo(
  forwardRef(function ModalBody(
    {
      children,
      padding = DEFAULT_PADDING,
      spacing = DEFAULT_SPACING,
      scrollable = false,
      loading = false,
      disabled = false,
      responsive,
      className = '',
      role = 'document',
      'aria-label': ariaLabel,
      ...rest
    },
    ref,
  ) {
    const prefersReducedMotion = useReducedMotion();

    // Resolve padding class.
    const paddingClass = useMemo(
      () => PADDING_MAP[padding] || PADDING_MAP[DEFAULT_PADDING],
      [padding],
    );

    // Resolve spacing (gap) class.
    const spacingClass = useMemo(
      () => SPACING_MAP[spacing] || SPACING_MAP[DEFAULT_SPACING],
      [spacing],
    );

    // Responsive overrides.
    const responsiveClasses = useMemo(
      () => (responsive ? resolveResponsiveClasses(responsive) : ''),
      [responsive],
    );

    // Base body classes.
    const bodyClasses = useMemo(() => {
      const base = mergeClasses(
        'flex-1 w-full',
        paddingClass,
        spacingClass,
        'flex flex-col',
        scrollable && 'overflow-y-auto',
        scrollable && 'max-h-[60vh]',
        disabled && 'opacity-50 cursor-not-allowed',
        loading && 'opacity-70',
        className,
      );
      return mergeClasses(base, responsiveClasses);
    }, [paddingClass, spacingClass, scrollable, disabled, loading, className, responsiveClasses]);

    // Motion props.
    const motionProps = useMemo(() => {
      if (prefersReducedMotion) {
        return { initial: false, animate: true };
      }
      return {
        initial: { opacity: 0, y: 8 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.2, ease: [0.4, 0, 0.2, 1] },
      };
    }, [prefersReducedMotion]);

    // Accessibility attributes.
    const ariaProps = useMemo(
      () => ({
        role,
        'aria-label': ariaLabel || 'Modal content',
        'aria-busy': loading || undefined,
        'aria-disabled': disabled || undefined,
      }),
      [role, ariaLabel, loading, disabled],
    );

    // Render loading state if active.
    const content = loading ? (
      <ModalLoader
        size="md"
        variant="shimmer"
        animated={!prefersReducedMotion}
        rows={4}
        type="text"
      />
    ) : (
      children
    );

    return (
      <motion.section
        ref={ref}
        className={bodyClasses}
        {...motionProps}
        {...ariaProps}
        {...rest}
      >
        {content}
      </motion.section>
    );
  }),
);

ModalBody.displayName = 'ModalBody';

ModalBody.propTypes = {
  /** Content to render inside the body. */
  children: PropTypes.node,
  /** Padding preset. */
  padding: PropTypes.oneOf(['none', 'xs', 'sm', 'md', 'lg', 'xl']),
  /** Vertical gap between children. */
  spacing: PropTypes.oneOf(['none', 'xs', 'sm', 'md', 'lg', 'xl']),
  /** Makes the body scrollable with max height. */
  scrollable: PropTypes.bool,
  /** Shows loading skeleton. */
  loading: PropTypes.bool,
  /** Disables interactions and dims content. */
  disabled: PropTypes.bool,
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

export default ModalBody;