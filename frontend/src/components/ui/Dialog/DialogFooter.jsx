/**
 * KisanO Design System — Dialog Package
 * DialogFooter
 *
 * The footer section of a Dialog. Renders action buttons or additional
 * content at the bottom of the dialog with flexible layout and alignment
 * options.
 *
 * Single Responsibility: Render the dialog footer with layout and
 * accessibility support. Does not handle header, body, or dialog visibility.
 *
 * @module components/ui/Dialog/DialogFooter
 */

import { forwardRef, memo, useMemo } from 'react';
import PropTypes from 'prop-types';
import { motion, useReducedMotion } from 'framer-motion';

import {
  DIALOG_DEFAULTS,
  getDialogSize,
  getDialogVariant,
} from './dialogVariants';
import {
  mergeClasses,
  resolveResponsiveClasses,
  getDialogFooterClasses,
} from './dialogUtils';

/* ---------------------------------- */
/* Component-specific tokens          */
/* ---------------------------------- */

/** Alignment mapping for horizontal layout. */
const ALIGNMENT_MAP = {
  left: 'justify-start',
  center: 'justify-center',
  right: 'justify-end',
  'space-between': 'justify-between',
  'space-around': 'justify-around',
};

/** Gap mapping for spacing. */
const SPACING_MAP = {
  none: 'gap-0',
  xs: 'gap-1',
  sm: 'gap-2',
  md: 'gap-3',
  lg: 'gap-4',
  xl: 'gap-6',
};

/** Default spacing when not provided. */
const DEFAULT_SPACING = 'md';

/** Motion variants for footer animation. */
const FOOTER_MOTION = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.2, ease: [0.4, 0, 0.2, 1] },
};

/* ---------------------------------- */
/* Component                          */
/* ---------------------------------- */

/**
 * DialogFooter – the footer of a dialog.
 *
 * @component
 * @example
 * <DialogFooter align="right" spacing="md">
 *   <Button variant="outline">Cancel</Button>
 *   <Button variant="primary">Confirm</Button>
 * </DialogFooter>
 */
const DialogFooter = memo(
  forwardRef(function DialogFooter(
    {
      children,
      variant = DIALOG_DEFAULTS.variant,
      size = DIALOG_DEFAULTS.size,
      align = 'right',
      spacing = DEFAULT_SPACING,
      divider = true,
      disabled = false,
      loading = false,
      responsive,
      className = '',
      role = 'contentinfo',
      'aria-label': ariaLabel = 'Dialog actions',
      ...rest
    },
    ref,
  ) {
    const prefersReducedMotion = useReducedMotion();

    // Get size configuration.
    const sizeConfig = useMemo(
      () => getDialogSize(size),
      [size],
    );

    // Get variant configuration.
    const variantConfig = useMemo(
      () => getDialogVariant(variant),
      [variant],
    );

    // Resolve alignment classes.
    const alignClasses = useMemo(
      () => ALIGNMENT_MAP[align] || ALIGNMENT_MAP.right,
      [align],
    );

    // Resolve spacing classes.
    const spacingClasses = useMemo(
      () => SPACING_MAP[spacing] || SPACING_MAP[DEFAULT_SPACING],
      [spacing],
    );

    // Responsive overrides.
    const responsiveClasses = useMemo(
      () => (responsive ? resolveResponsiveClasses(responsive) : ''),
      [responsive],
    );

    // Footer classes.
    const footerClasses = useMemo(() => {
      const base = getDialogFooterClasses({
        variant,
        className,
        disabled,
      });
      return mergeClasses(base, responsiveClasses);
    }, [variant, className, disabled, responsiveClasses]);

    // Content wrapper classes with alignment and spacing.
    const contentClasses = useMemo(() => {
      const base = mergeClasses(
        'flex w-full flex-wrap',
        alignClasses,
        spacingClasses,
        disabled && 'opacity-50',
        loading && 'opacity-70',
      );
      return base;
    }, [alignClasses, spacingClasses, disabled, loading]);

    // Motion props - respect reduced motion.
    const motionProps = useMemo(() => {
      if (prefersReducedMotion) {
        return { initial: false, animate: true };
      }
      return FOOTER_MOTION;
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

    // If no children, render nothing.
    if (!children) {
      return null;
    }

    return (
      <motion.footer
        ref={ref}
        className={footerClasses}
        {...motionProps}
        {...ariaProps}
        {...rest}
      >
        <div className={contentClasses}>
          {children}
        </div>
      </motion.footer>
    );
  }),
);

DialogFooter.displayName = 'DialogFooter';

DialogFooter.propTypes = {
  /** Content to render in the footer (buttons, text, etc.). */
  children: PropTypes.node,
  /** Dialog variant (affects footer styling). */
  variant: PropTypes.oneOf(['default', 'primary', 'secondary', 'success', 'warning', 'error']),
  /** Dialog size (affects padding and typography). */
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
  /** Alignment of the footer content. */
  align: PropTypes.oneOf(['left', 'center', 'right', 'space-between', 'space-around']),
  /** Gap between items. */
  spacing: PropTypes.oneOf(['none', 'xs', 'sm', 'md', 'lg', 'xl']),
  /** Whether to show a top border divider. */
  divider: PropTypes.bool,
  /** Disabled state. */
  disabled: PropTypes.bool,
  /** Loading state. */
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

export default DialogFooter;