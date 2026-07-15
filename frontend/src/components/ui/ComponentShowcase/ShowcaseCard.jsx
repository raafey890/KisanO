/**
 * KisanO Design System — Showcase Package
 * ShowcaseCard
 *
 * A card component for showcasing individual UI components with
 * preview, title, description, and code preview support.
 *
 * Single Responsibility: Render a component showcase card.
 * Does not manage showcase state or business logic.
 *
 * @module components/ui/Showcase/ShowcaseCard
 */

import { forwardRef, memo, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { motion, useReducedMotion } from 'framer-motion';

import {
  SHOWCASE_DEFAULTS,
} from './showcaseVariants';
import {
  mergeClasses,
  resolveResponsiveClasses,
  getShowcaseCardClasses,
} from './showcaseUtils';

/* ---------------------------------- */
/* Component-specific tokens          */
/* ---------------------------------- */

/** Motion variants for card animation. */
const CARD_MOTION = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.95 },
  transition: { duration: 0.2, ease: [0.4, 0, 0.2, 1] },
};

/** Hover motion variants. */
const HOVER_MOTION = {
  hover: { scale: 1.02, y: -4 },
  tap: { scale: 0.98 },
  transition: { duration: 0.15, ease: [0.4, 0, 0.2, 1] },
};

/** Default label when not provided. */
const DEFAULT_LABEL = 'Component';

/* ---------------------------------- */
/* Component                          */
/* ---------------------------------- */

/**
 * ShowcaseCard – a card for showcasing a component.
 *
 * @component
 * @example
 * <ShowcaseCard label="Button" description="Primary button">
 *   <Button variant="primary">Click me</Button>
 * </ShowcaseCard>
 */
const ShowcaseCard = memo(
  forwardRef(function ShowcaseCard(
    {
      children,
      label = DEFAULT_LABEL,
      description,
      code,
      variant = SHOWCASE_DEFAULTS.variant,
      size = SHOWCASE_DEFAULTS.size,
      interactive = true,
      selected = false,
      disabled = false,
      loading = false,
      responsive,
      className = '',
      role = 'article',
      'aria-label': ariaLabel,
      ...rest
    },
    ref,
  ) {
    const prefersReducedMotion = useReducedMotion();
    const [isHovered, setIsHovered] = useState(false);

    // Card classes.
    const cardClasses = useMemo(
      () =>
        getShowcaseCardClasses({
          variant,
          size,
          className,
          disabled,
          interactive,
          selected,
        }),
      [variant, size, className, disabled, interactive, selected],
    );

    // Responsive overrides.
    const responsiveClasses = useMemo(
      () => (responsive ? resolveResponsiveClasses(responsive) : ''),
      [responsive],
    );

    const finalClasses = useMemo(
      () => mergeClasses(cardClasses, responsiveClasses),
      [cardClasses, responsiveClasses],
    );

    // Motion props - respect reduced motion.
    const motionProps = useMemo(() => {
      if (prefersReducedMotion || !interactive) {
        return {
          initial: false,
          animate: true,
          whileHover: undefined,
          whileTap: undefined,
        };
      }
      return {
        initial: CARD_MOTION.initial,
        animate: CARD_MOTION.animate,
        exit: CARD_MOTION.exit,
        whileHover: HOVER_MOTION.hover,
        whileTap: HOVER_MOTION.tap,
        transition: CARD_MOTION.transition,
      };
    }, [prefersReducedMotion, interactive]);

    // Accessibility attributes.
    const ariaProps = useMemo(
      () => ({
        role,
        'aria-label': ariaLabel || label,
        'aria-disabled': disabled || undefined,
        'aria-busy': loading || undefined,
        'data-label': label,
        'data-selected': selected || undefined,
        'data-interactive': interactive || undefined,
      }),
      [role, ariaLabel, label, disabled, loading, selected, interactive],
    );

    // If loading, render a loading placeholder.
    if (loading) {
      return (
        <motion.div
          ref={ref}
          className={finalClasses}
          {...motionProps}
          {...ariaProps}
          {...rest}
        >
          <div className="animate-pulse">
            <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded mb-3" />
            <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded" />
          </div>
        </motion.div>
      );
    }

    return (
      <motion.div
        ref={ref}
        className={finalClasses}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        {...motionProps}
        {...ariaProps}
        {...rest}
      >
        {/* Component Preview */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 min-h-[80px] flex items-center justify-center">
          {children}
        </div>

        {/* Label and Description */}
        <div className="p-4">
          <h3 className="text-sm font-medium text-gray-900 dark:text-white">
            {label}
          </h3>
          {description && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {description}
            </p>
          )}
        </div>

        {/* Code Preview Slot */}
        {code && (
          <div className="px-4 pb-4">
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 font-mono bg-gray-100 dark:bg-gray-800 p-2 rounded-md overflow-x-auto">
              {code}
            </div>
          </div>
        )}
      </motion.div>
    );
  }),
);

ShowcaseCard.displayName = 'ShowcaseCard';

ShowcaseCard.propTypes = {
  /** Component to showcase. */
  children: PropTypes.node,
  /** Component label. */
  label: PropTypes.node,
  /** Component description. */
  description: PropTypes.node,
  /** Code preview content. */
  code: PropTypes.node,
  /** Visual variant. */
  variant: PropTypes.oneOf(['default', 'dark', 'glass', 'minimal', 'gradient']),
  /** Size preset. */
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl', 'full']),
  /** Whether the card is interactive. */
  interactive: PropTypes.bool,
  /** Whether the card is selected. */
  selected: PropTypes.bool,
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

export default ShowcaseCard;