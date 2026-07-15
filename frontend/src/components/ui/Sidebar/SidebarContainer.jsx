/**
 * KisanO Design System — Sidebar Package
 * SidebarContainer
 *
 * The container component that wraps the sidebar and handles layout,
 * positioning, and accessibility attributes.
 *
 * Single Responsibility: Render the sidebar container with layout and styling.
 * Does not manage sidebar state or business logic.
 *
 * @module components/ui/Sidebar/SidebarContainer
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
  resolveDefaultProps,
  getSidebarClasses,
  getSidebarContainerClasses,
} from './sidebarUtils';

/* ---------------------------------- */
/* Component-specific tokens          */
/* ---------------------------------- */

/** Motion variants for container animation. */
const CONTAINER_MOTION = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 },
  transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
};

/** Motion variants for overlay animation. */
const OVERLAY_MOTION = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.2, ease: 'easeOut' },
};

/* ---------------------------------- */
/* Component                          */
/* ---------------------------------- */

/**
 * SidebarContainer – the main sidebar wrapper with layout and styling.
 *
 * @component
 * @example
 * <SidebarContainer variant="default" size="md" position="left">
 *   <SidebarHeader>Logo</SidebarHeader>
 *   <SidebarContent>Items</SidebarContent>
 * </SidebarContainer>
 */
const SidebarContainer = memo(
  forwardRef(function SidebarContainer(
    {
      children,
      variant = SIDEBAR_DEFAULTS.variant,
      size = SIDEBAR_DEFAULTS.size,
      width = SIDEBAR_DEFAULTS.width,
      shadow = SIDEBAR_DEFAULTS.shadow,
      position = SIDEBAR_DEFAULTS.position,
      collapsed = false,
      open = true,
      overlay = true,
      onOverlayClick,
      responsive,
      className = '',
      role = 'complementary',
      'aria-label': ariaLabel = 'Sidebar navigation',
      ...rest
    },
    ref,
  ) {
    const prefersReducedMotion = useReducedMotion();

    // Resolve defaults.
    const resolved = useMemo(
      () =>
        resolveDefaultProps({
          variant,
          size,
          width,
          shadow,
          position,
          collapsed,
          open,
        }),
      [variant, size, width, shadow, position, collapsed, open],
    );

    // Sidebar classes.
    const sidebarClasses = useMemo(
      () =>
        getSidebarClasses({
          variant: resolved.variant,
          size: resolved.size,
          width: resolved.width,
          shadow: resolved.shadow,
          position: resolved.position,
          className,
          collapsed: resolved.collapsed,
          open: resolved.open,
        }),
      [
        resolved.variant,
        resolved.size,
        resolved.width,
        resolved.shadow,
        resolved.position,
        className,
        resolved.collapsed,
        resolved.open,
      ],
    );

    // Container classes.
    const containerClasses = useMemo(
      () =>
        getSidebarContainerClasses({
          className: '',
          open: resolved.open,
          position: resolved.position,
        }),
      [resolved.open, resolved.position],
    );

    // Responsive overrides.
    const responsiveClasses = useMemo(
      () => (responsive ? resolveResponsiveClasses(responsive) : ''),
      [responsive],
    );

    const finalClasses = useMemo(
      () => mergeClasses(sidebarClasses, responsiveClasses),
      [sidebarClasses, responsiveClasses],
    );

    // Motion props - respect reduced motion.
    const motionProps = useMemo(() => {
      if (prefersReducedMotion) {
        return { initial: false, animate: true, exit: false };
      }
      return CONTAINER_MOTION;
    }, [prefersReducedMotion]);

    // Overlay motion props.
    const overlayMotionProps = useMemo(() => {
      if (prefersReducedMotion) {
        return { initial: false, animate: true, exit: false };
      }
      return OVERLAY_MOTION;
    }, [prefersReducedMotion]);

    // Accessibility attributes.
    const ariaProps = useMemo(
      () => ({
        role,
        'aria-label': ariaLabel,
        'aria-hidden': !resolved.open || undefined,
        'aria-expanded': !resolved.collapsed || undefined,
        'data-collapsed': resolved.collapsed || undefined,
        'data-open': resolved.open || undefined,
        'data-position': resolved.position,
      }),
      [role, ariaLabel, resolved.open, resolved.collapsed, resolved.position],
    );

    // Handle overlay click.
    const handleOverlayClick = (event) => {
      if (event.target === event.currentTarget) {
        onOverlayClick?.();
      }
    };

    // If sidebar is not open, don't render (for mobile).
    if (!resolved.open) {
      return null;
    }

    return (
      <>
        {/* Overlay for mobile */}
        {overlay && !resolved.collapsed && (
          <motion.div
            className={mergeClasses(
              'fixed inset-0 z-30 bg-black/50',
              resolved.position === 'left' ? 'left-0' : 'right-0',
            )}
            onClick={handleOverlayClick}
            {...overlayMotionProps}
          />
        )}

        {/* Sidebar */}
        <motion.aside
          ref={ref}
          className={finalClasses}
          {...motionProps}
          {...ariaProps}
          {...rest}
        >
          {children}
        </motion.aside>
      </>
    );
  }),
);

SidebarContainer.displayName = 'SidebarContainer';

SidebarContainer.propTypes = {
  /** Sidebar content (Header, Content, Footer, etc.). */
  children: PropTypes.node,
  /** Visual variant. */
  variant: PropTypes.oneOf(['default', 'dark', 'primary', 'transparent', 'glass', 'gradient']),
  /** Size preset. */
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
  /** Width preset. */
  width: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl', 'full', 'collapsed']),
  /** Shadow level. */
  shadow: PropTypes.oneOf(['none', 'sm', 'md', 'lg', 'xl', '2xl']),
  /** Position. */
  position: PropTypes.oneOf(['left', 'right']),
  /** Collapsed state. */
  collapsed: PropTypes.bool,
  /** Open state. */
  open: PropTypes.bool,
  /** Whether to show overlay. */
  overlay: PropTypes.bool,
  /** Callback when overlay is clicked. */
  onOverlayClick: PropTypes.func,
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

export default SidebarContainer;