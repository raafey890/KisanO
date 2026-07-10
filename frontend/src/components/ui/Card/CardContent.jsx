/**
 * KisanO Design System — Card Package
 * CardContent
 *
 * A flexible content wrapper for Card that provides consistent padding,
 * spacing, and overflow handling. It can be used as a standalone content
 * area or as a replacement for CardBody when more control is needed.
 *
 * Single Responsibility: This component only renders a styled content
 * container. It does not handle header, footer, media, or actions.
 *
 * @module components/ui/Card/CardContent
 */

import { forwardRef, memo, useMemo } from 'react';
import PropTypes from 'prop-types';
import { motion, useReducedMotion } from 'framer-motion';

import {
  CARD_PADDING,
  
} from './cardVariants';
import {
  mergeClasses,
  resolveResponsiveClasses,
  
} from './cardUtils';
import CardLoader from './CardLoader';

/* ---------------------------------- */
/* Component‑specific tokens          */
/* ---------------------------------- */

/** Gap (spacing) presets between content items. */
const SPACING_GAPS = {
  none: 'gap-0',
  xs: 'gap-2',
  sm: 'gap-3',
  md: 'gap-4',
  lg: 'gap-6',
  xl: 'gap-8',
};

/** Default spacing when no prop is provided. */
const DEFAULT_SPACING = 'md';

/* ---------------------------------- */
/* Component                          */
/* ---------------------------------- */

/**
 * CardContent – a content container for Card sections.
 *
 * Provides consistent padding, spacing, scrollability, and a loading state.
 * Designed to be used inside CardContainer or as a direct child of Card.
 *
 * @component
 * @example
 * <Card>
 *   <CardContent spacing="lg" padding="xl" scrollable>
 *     <p>Main content...</p>
 *   </CardContent>
 * </Card>
 */
const CardContent = memo(
  forwardRef(function CardContent(
    {
      children,
      spacing = DEFAULT_SPACING,
      padding = 'md',
      scrollable = false,
      loading = false,
      disabled = false,
      responsive,
      className = '',
      role = 'region',
      'aria-label': ariaLabel = 'Card content',
      ...rest
    },
    ref,
  ) {
    const prefersReducedMotion = useReducedMotion();

    // Resolve padding from CARD_PADDING or fallback to size-based padding.
    const paddingClass = useMemo(
      () => {
        // If padding is one of the predefined keys, use CARD_PADDING.
        if (CARD_PADDING[padding]) {
          return CARD_PADDING[padding];
        }
        // Otherwise, treat it as a custom class (e.g., 'p-8').
        return padding;
      },
      [padding],
    );

    // Resolve gap class from spacing prop.
    const gapClass = useMemo(
      () => SPACING_GAPS[spacing] || SPACING_GAPS[DEFAULT_SPACING],
      [spacing],
    );

    // Base classes.
    const baseClasses = useMemo(
      () =>
        mergeClasses(
          'flex flex-col w-full',
          paddingClass,
          gapClass,
          scrollable && 'overflow-y-auto max-h-64',
          disabled && 'opacity-50 cursor-not-allowed',
          className,
        ),
      [
        paddingClass,
        gapClass,
        scrollable,
        disabled,
        className,
      ],
    );

    // Responsive overrides.
    const responsiveClasses = useMemo(
      () => (responsive ? resolveResponsiveClasses(responsive) : ''),
      [responsive],
    );

    const containerClasses = useMemo(
      () => mergeClasses(baseClasses, responsiveClasses),
      [baseClasses, responsiveClasses],
    );

    // Animation props – fade in with a slight delay.
    const motionProps = useMemo(() => {
      if (prefersReducedMotion) {
        return { initial: false, animate: true };
      }
      return {
        initial: { opacity: 0, y: 6 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.25, ease: [0.4, 0, 0.2, 1] },
      };
    }, [prefersReducedMotion]);

    // ARIA attributes.
    const ariaProps = useMemo(
      () => ({
        role,
        'aria-label': ariaLabel,
        'aria-disabled': disabled || undefined,
        'aria-busy': loading || undefined,
        tabIndex: disabled ? -1 : undefined,
      }),
      [role, ariaLabel, disabled, loading],
    );

    // If loading, render a skeleton loader.
    const content = loading ? (
      <CardLoader
        size={padding}
        variant="shimmer"
        animated={!prefersReducedMotion}
        rows={3}
        type="text"
      />
    ) : (
      children
    );

    return (
      <motion.div
        ref={ref}
        className={containerClasses}
        {...motionProps}
        {...ariaProps}
        {...rest}
      >
        {content}
      </motion.div>
    );
  }),
);

CardContent.displayName = 'CardContent';

CardContent.propTypes = {
  /** Content to render inside the container. */
  children: PropTypes.node,
  /** Vertical gap between child elements. */
  spacing: PropTypes.oneOf(['none', 'xs', 'sm', 'md', 'lg', 'xl']),
  /** Padding preset from CARD_PADDING or custom Tailwind class. */
  padding: PropTypes.string,
  /** If true, makes the container scrollable with a max height. */
  scrollable: PropTypes.bool,
  /** Shows a loading skeleton instead of children. */
  loading: PropTypes.bool,
  /** Disables interactions and dims content. */
  disabled: PropTypes.bool,
  /** Responsive overrides (xs, sm, md, lg, xl). */
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

export default CardContent;