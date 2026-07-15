/**
 * KisanO Design System — Sidebar Package
 * SidebarHeader
 *
 * The header component for the sidebar. Renders logo, brand title,
 * and optional collapse button with accessibility support.
 *
 * Single Responsibility: Render the sidebar header with branding and actions.
 * Does not manage sidebar state or content.
 *
 * @module components/ui/Sidebar/SidebarHeader
 */

import { forwardRef, memo, useMemo } from 'react';
import PropTypes from 'prop-types';
import { motion, useReducedMotion } from 'framer-motion';

import {
  SIDEBAR_DEFAULTS,
} from './sidebarVariants';
import {
  mergeClasses,
  resolveResponsiveClasses,
  getSidebarHeaderClasses,
} from './sidebarUtils';

/* ---------------------------------- */
/* Component-specific tokens          */
/* ---------------------------------- */

/** Logo size mapping. */
const LOGO_SIZES = {
  xs: 'h-6 w-6',
  sm: 'h-7 w-7',
  md: 'h-8 w-8',
  lg: 'h-9 w-9',
  xl: 'h-10 w-10',
};

/** Text size mapping. */
const TEXT_SIZES = {
  xs: 'text-xs',
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg',
  xl: 'text-xl',
};

/** Motion variants for header animation. */
const HEADER_MOTION = {
  initial: { opacity: 0, y: -8 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.2, ease: [0.4, 0, 0.2, 1] },
};

/* ---------------------------------- */
/* Component                          */
/* ---------------------------------- */

/**
 * SidebarHeader – the header section of the sidebar.
 *
 * @component
 * @example
 * <SidebarHeader
 *   logo="/logo.png"
 *   brandText="My App"
 *   onCollapse={handleCollapse}
 * />
 */
const SidebarHeader = memo(
  forwardRef(function SidebarHeader(
    {
      children,
      logo,
      logoAlt = 'Logo',
      brandText,
      size = SIDEBAR_DEFAULTS.size,
      collapsed = false,
      onCollapse,
      responsive,
      className = '',
      role = 'banner',
      'aria-label': ariaLabel = 'Sidebar header',
      ...rest
    },
    ref,
  ) {
    const prefersReducedMotion = useReducedMotion();

    // Header classes.
    const headerClasses = useMemo(
      () =>
        getSidebarHeaderClasses({
          size,
          className,
          collapsed,
        }),
      [size, className, collapsed],
    );

    // Responsive overrides.
    const responsiveClasses = useMemo(
      () => (responsive ? resolveResponsiveClasses(responsive) : ''),
      [responsive],
    );

    const finalClasses = useMemo(
      () => mergeClasses(headerClasses, responsiveClasses),
      [headerClasses, responsiveClasses],
    );

    // Logo size.
    const logoSize = useMemo(
      () => LOGO_SIZES[size] || LOGO_SIZES.md,
      [size],
    );

    // Text size.
    const textSize = useMemo(
      () => TEXT_SIZES[size] || TEXT_SIZES.md,
      [size],
    );

    // Motion props - respect reduced motion.
    const motionProps = useMemo(() => {
      if (prefersReducedMotion) {
        return { initial: false, animate: true };
      }
      return HEADER_MOTION;
    }, [prefersReducedMotion]);

    // Accessibility attributes.
    const ariaProps = useMemo(
      () => ({
        role,
        'aria-label': ariaLabel,
        'aria-hidden': collapsed ? true : undefined,
      }),
      [role, ariaLabel, collapsed],
    );

    // Handle collapse click.
    const handleCollapse = (event) => {
      onCollapse?.(event);
    };

    // Render content.
    const content = (
      <>
        {logo && (
          <img
            src={logo}
            alt={logoAlt}
            className={mergeClasses(
              logoSize,
              'shrink-0 object-contain',
            )}
          />
        )}
        {brandText && !collapsed && (
          <span className={mergeClasses(
            'font-semibold truncate',
            textSize,
          )}>
            {brandText}
          </span>
        )}
        {children}
      </>
    );

    return (
      <motion.header
        ref={ref}
        className={finalClasses}
        {...motionProps}
        {...ariaProps}
        {...rest}
      >
        {content}
      </motion.header>
    );
  }),
);

SidebarHeader.displayName = 'SidebarHeader';

SidebarHeader.propTypes = {
  /** Header children (custom). */
  children: PropTypes.node,
  /** Logo image src. */
  logo: PropTypes.string,
  /** Logo alt text. */
  logoAlt: PropTypes.string,
  /** Brand text. */
  brandText: PropTypes.node,
  /** Size preset. */
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
  /** Collapsed state. */
  collapsed: PropTypes.bool,
  /** Callback when collapse button is clicked. */
  onCollapse: PropTypes.func,
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

export default SidebarHeader;