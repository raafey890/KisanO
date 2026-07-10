/**
 * KisanO Design System — Modal Package
 * ModalFooter
 *
 * The footer section of a Modal. Renders action buttons or additional
 * content at the bottom of the modal with flexible layout and alignment
 * options. Supports sticky positioning and dividers.
 *
 * Single Responsibility: Render the modal footer with layout and
 * accessibility support. Does not handle header, body, or modal visibility.
 *
 * @module components/ui/Modal/ModalFooter
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

/* ---------------------------------- */
/* Component‑specific tokens          */
/* ---------------------------------- */

/** Alignment mapping for horizontal layout. */
const ALIGNMENT_MAP = {
  left: 'justify-start',
  center: 'justify-center',
  right: 'justify-end',
  'space-between': 'justify-between',
  'space-around': 'justify-around',
};

/** Alignment mapping for vertical layout. */
const VERTICAL_ALIGN_MAP = {
  left: 'items-start',
  center: 'items-center',
  right: 'items-end',
  'space-between': 'items-center',
  'space-around': 'items-center',
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

/** Default spacing when not provided. */
const DEFAULT_SPACING = MODAL_DEFAULTS.spacing || 'md';
const DEFAULT_ALIGN = MODAL_DEFAULTS.align || 'right';
/* ---------------------------------- */
/* Component                          */
/* ---------------------------------- */

/**
 * ModalFooter – the footer section of a modal.
 *
 * @component
 * @example
 * <ModalFooter align="right" spacing="md" divider>
 *   <Button variant="outline">Cancel</Button>
 *   <Button variant="primary">Confirm</Button>
 * </ModalFooter>
 */
const ModalFooter = memo(
  forwardRef(function ModalFooter(
    {
      children,
      align = DEFAULT_ALIGN,
      direction = 'row',
      spacing = DEFAULT_SPACING,
      divider = true,
      sticky = false,
      disabled = false,
      loading = false,
      responsive,
      className = '',
      role = 'contentinfo',
      'aria-label': ariaLabel = 'Modal actions',
      ...rest
    },
    ref,
  ) {
    const prefersReducedMotion = useReducedMotion();

    // Resolve alignment based on direction.
    const alignClasses = useMemo(() => {
      if (direction === 'vertical') {
        return VERTICAL_ALIGN_MAP[align] || VERTICAL_ALIGN_MAP.center;
      }
      return ALIGNMENT_MAP[align] || ALIGNMENT_MAP.right;
    }, [align, direction]);

    // Resolve spacing class.
    const spacingClass = useMemo(
      () => SPACING_MAP[spacing] || SPACING_MAP[DEFAULT_SPACING],
      [spacing],
    );

    // Responsive overrides.
    const responsiveClasses = useMemo(
      () => (responsive ? resolveResponsiveClasses(responsive) : ''),
      [responsive],
    );

    // Direction class.
    const directionClass = useMemo(
      () => (direction === 'vertical' ? 'flex-col' : 'flex-row'),
      [direction],
    );

    // Base footer classes.
    const footerClasses = useMemo(() => {
      const base = mergeClasses(
        'flex w-full',
        directionClass,
        alignClasses,
        spacingClass,
        'px-6 py-4',
        divider && 'border-t border-gray-200',
        sticky && 'sticky bottom-0 z-10 bg-white/95 backdrop-blur-sm',
        disabled && 'opacity-50 cursor-not-allowed',
        loading && 'opacity-70',
        className,
      );
      return mergeClasses(base, responsiveClasses);
    }, [
      directionClass,
      alignClasses,
      spacingClass,
      divider,
      sticky,
      disabled,
      loading,
      className,
      responsiveClasses,
    ]);

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
        'aria-label': ariaLabel,
        'aria-disabled': disabled || undefined,
        'aria-busy': loading || undefined,
      }),
      [role, ariaLabel, disabled, loading],
    );

    return (
      <motion.footer
        ref={ref}
        className={footerClasses}
        {...motionProps}
        {...ariaProps}
        {...rest}
      >
        {children}
      </motion.footer>
    );
  }),
);

ModalFooter.displayName = 'ModalFooter';

ModalFooter.propTypes = {
  /** Content to render in the footer (buttons, text, etc.). */
  children: PropTypes.node,
  /** Alignment of the footer content. */
  align: PropTypes.oneOf(['left', 'center', 'right', 'space-between', 'space-around']),
  /** Layout direction. */
  direction: PropTypes.oneOf(['row', 'column']),
  /** Gap between items. */
  spacing: PropTypes.oneOf(['none', 'xs', 'sm', 'md', 'lg', 'xl']),
  /** Whether to show a top border divider. */
  divider: PropTypes.bool,
  /** Makes the footer sticky at the bottom. */
  sticky: PropTypes.bool,
  /** Disables interactions and dims content. */
  disabled: PropTypes.bool,
  /** Shows loading state. */
  loading: PropTypes.bool,
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

export default ModalFooter;