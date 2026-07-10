/**
 * KisanO Design System — Card Package
 * CardActions
 *
 * The CardActions component renders a horizontal or vertical row of action
 * buttons, links, or other interactive elements inside a Card. It provides
 * consistent spacing, alignment, and divider options.
 *
 * Single Responsibility: This component only renders the action area.
 * It does not handle Card layout, positioning, or other sections.
 *
 * @module components/ui/Card/CardActions
 */

import { forwardRef, memo, useMemo } from 'react';
import PropTypes from 'prop-types';
import { motion, useReducedMotion } from 'framer-motion';

import {
  mergeClasses,
  getActionAlignment,
  resolveResponsiveClasses,
} from './cardUtils';

/* ---------------------------------- */
/* Component-specific tokens          */
/* ---------------------------------- */

/** Gap (spacing) presets between action items. */
const SPACING_GAPS = {
  none: 'gap-0',
  xs: 'gap-1',
  sm: 'gap-2',
  md: 'gap-4',
  lg: 'gap-6',
  xl: 'gap-8',
};

const DEFAULT_SPACING = 'md';


/** Default spacing when no prop is provided. */


/** Vertical alignment mapping for vertical direction. */
const VERTICAL_ALIGN_MAP = {
  start: 'items-start',
  center: 'items-center',
  end: 'items-end',
};

/* ---------------------------------- */
/* Component                          */
/* ---------------------------------- */

/**
 * CardActions – a container for action buttons inside a Card.
 *
 * Supports both horizontal and vertical layouts, flexible spacing,
 * alignment, divider lines, responsive adjustments, and accessibility.
 *
 * @component
 * @example
 * <CardActions align="end" spacing="sm" divider>
 *   <Button variant="outline">Cancel</Button>
 *   <Button>Save</Button>
 * </CardActions>
 */
const CardActions = memo(
  forwardRef(function CardActions(
    {
      children,
      direction = 'horizontal',
      align = 'start',
      spacing = DEFAULT_SPACING,
      divider = false,
      fullWidth = true,
      wrap = false,
      disabled = false,
      loading = false,
      responsive,
      className = '',
      role = 'group',
      'aria-label': ariaLabel = 'Card actions',
      ...rest
    },
    ref,
  ) {
    const prefersReducedMotion = useReducedMotion();

    // Resolve gap class from spacing prop.
    const gapClass = useMemo(
      () => SPACING_GAPS[spacing] || SPACING_GAPS[DEFAULT_SPACING],
      [spacing],
    );

    // Determine alignment classes based on direction.
    const alignmentClasses = useMemo(() => {
      if (direction === 'vertical') {
        // For vertical, align controls cross-axis (items-*).
        return VERTICAL_ALIGN_MAP[align] || VERTICAL_ALIGN_MAP.start;
      }
      // For horizontal, use the standard justify-* helper.
      return getActionAlignment(align);
    }, [direction, align]);

    // Base flex container classes.
    const baseClasses = useMemo(
      () =>
        mergeClasses(
          'flex',
          direction === 'vertical' ? 'flex-col' : 'flex-row',
          gapClass,
          alignmentClasses,
          fullWidth && 'w-full',
          wrap && 'flex-wrap',
          divider && 'border-t border-default pt-4', // Adds top border and padding.
          disabled && 'opacity-50 cursor-not-allowed',
          loading && 'opacity-70 cursor-progress',
          className,
        ),
      [
        direction,
        gapClass,
        alignmentClasses,
        fullWidth,
        wrap,
        divider,
        disabled,
        loading,
        className,
      ],
    );

    // Responsive overrides if provided.
    const responsiveClasses = useMemo(
      () => 
        
    resolveResponsiveClasses(responsive),
      
      [responsive],
    );

    // Merge all classes.
    const containerClasses = useMemo(
      () => mergeClasses(baseClasses, responsiveClasses),
      [baseClasses, responsiveClasses],
    );

    // Motion props – only animate if not reduced motion.
    const motionProps = useMemo(() => {
      const baseMotion = {
        initial: { opacity: 0, y: 8 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.25, ease: [0.4, 0, 0.2, 1] },
      };
      if (prefersReducedMotion) {
        return { initial: false, animate: true };
      }
      return baseMotion;
    }, [prefersReducedMotion]);

    // ARIA attributes.
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
        className={containerClasses}
        {...motionProps}
        {...ariaProps}
        {...rest}
      >
        {children}
      </motion.div>
    );
  }),
);

CardActions.displayName = 'CardActions';

CardActions.propTypes = {
  /** Action elements (buttons, links, etc.) */
  children: PropTypes.node,
  /** Layout direction of the actions. */
  direction: PropTypes.oneOf(['horizontal', 'vertical']),
  /**
   * Alignment of the actions.
   * - For horizontal: `start`, `center`, `end`, `space-between`, `space-around`
   * - For vertical: `start`, `center`, `end` (maps to items-*)
   */
  align: PropTypes.oneOf(['start', 'center', 'end', 'space-between', 'space-around']),
  /** Gap between action items. */
  spacing: PropTypes.oneOf(['none', 'xs', 'sm', 'md', 'lg', 'xl']),
  /** If true, renders a top border divider. */
  divider: PropTypes.bool,
  /** If true, stretches to full width of the parent. */
  fullWidth: PropTypes.bool,
  /** If true, allows items to wrap to the next line. */
  wrap: PropTypes.bool,
  /** Disables interactions and dims the actions. */
  disabled: PropTypes.bool,
  /** Loading state – adds opacity and aria-busy. */
  loading: PropTypes.bool,
  /**
   * Responsive overrides as an object with keys `xs`, `sm`, `md`, `lg`, `xl`.
   * Each value is a string of Tailwind classes to apply at that breakpoint.
   */
  responsive: PropTypes.shape({
    xs: PropTypes.string,
    sm: PropTypes.string,
    md: PropTypes.string,
    lg: PropTypes.string,
    xl: PropTypes.string,
  }),
  /** Additional CSS classes. */
  className: PropTypes.string,
  /** ARIA role for the container. */
  role: PropTypes.string,
  /** Accessible label for the action group. */
  'aria-label': PropTypes.string,
};

export default CardActions;