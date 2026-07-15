/**
 * KisanO Design System — Drawer Package
 * DrawerFooter
 *
 * The footer section of a Drawer. Renders action buttons or additional
 * content at the bottom of the drawer with flexible layout and alignment
 * options.
 *
 * Single Responsibility: Render the drawer footer with layout and
 * accessibility support. Does not handle header, body, or drawer visibility.
 *
 * @module components/ui/Drawer/DrawerFooter
 */

import { forwardRef, memo, useMemo } from 'react';
import PropTypes from 'prop-types';
import { motion, useReducedMotion } from 'framer-motion';

import {
  DRAWER_DEFAULTS,
  getDrawerSize,
  getDrawerVariant,
} from './drawerVariants';
import {
  mergeClasses,
  resolveResponsiveClasses,
  getDrawerFooterClasses,
} from './drawerUtils';

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
 * DrawerFooter – the footer of a drawer.
 *
 * @component
 * @example
 * <DrawerFooter align="right" spacing="md">
 *   <Button variant="outline">Cancel</Button>
 *   <Button variant="primary">Confirm</Button>
 * </DrawerFooter>
 */
const DrawerFooter = memo(
  forwardRef(function DrawerFooter(
    {
      children,
      variant = DRAWER_DEFAULTS.variant,
      size = DRAWER_DEFAULTS.size,
      align = 'right',
      spacing = DEFAULT_SPACING,
      divider = true,
      disabled = false,
      loading = false,
      responsive,
      className = '',
      role = 'contentinfo',
      'aria-label': ariaLabel = 'Drawer actions',
      ...rest
    },
    ref,
  ) {
    const prefersReducedMotion = useReducedMotion();

    // Get size configuration.
    const sizeConfig = useMemo(
      () => getDrawerSize(size),
      [size],
    );

    // Get variant configuration.
    const variantConfig = useMemo(
      () => getDrawerVariant(variant),
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
      const base = getDrawerFooterClasses({
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

DrawerFooter.displayName = 'DrawerFooter';

DrawerFooter.propTypes = {
  /** Content to render in the footer (buttons, text, etc.). */
  children: PropTypes.node,
  /** Drawer variant (affects footer styling). */
  variant: PropTypes.oneOf(['default', 'primary', 'secondary', 'success', 'warning', 'error', 'glass']),
  /** Drawer size (affects padding and typography). */
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl', 'full']),
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

export default DrawerFooter;