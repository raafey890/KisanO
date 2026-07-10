/**
 * KisanO Design System — Card Package
 * CardBadge
 *
 * The CardBadge component renders a small badge used to indicate status,
 * category, or other metadata. It is designed to be placed inside a Card
 * (or any other container) and does not control its own positioning.
 *
 * Single Responsibility: This component only renders a styled badge.
 * It does not handle layout, positioning, or Card-specific logic.
 *
 * @module components/ui/Card/CardBadge
 */

import { forwardRef, memo, useMemo } from 'react';
import PropTypes from 'prop-types';
import { motion, useReducedMotion } from 'framer-motion';

import {
  CARD_STATUS_COLORS,
} from './cardVariants';
import {
  mergeClasses,
  getRadiusClasses,
} from './cardUtils';

/* ---------------------------------- */
/* Component‑specific Design Tokens   */
/* ---------------------------------- */

/** Size presets for badge padding, font size, and icon dimensions. */
const BADGE_SIZES = {
  xs: {
    padding: 'px-1.5 py-0.5',
    fontSize: 'text-[10px]',
    iconSize: 'w-3 h-3',
    dotSize: 'w-1.5 h-1.5',
  },
  sm: {
    padding: 'px-2 py-0.5',
    fontSize: 'text-xs',
    iconSize: 'w-3.5 h-3.5',
    dotSize: 'w-2 h-2',
  },
  md: {
    padding: 'px-2.5 py-1',
    fontSize: 'text-xs',
    iconSize: 'w-4 h-4',
    dotSize: 'w-2 h-2',
  },
  lg: {
    padding: 'px-3 py-1.5',
    fontSize: 'text-sm',
    iconSize: 'w-5 h-5',
    dotSize: 'w-2.5 h-2.5',
  },
};



/** Motion variants for entrance and exit animations. */
const badgeMotion = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.95 },
  transition: { duration: 0.2, ease: [0.4, 0, 0.2, 1] },
};

/* ---------------------------------- */
/* Component                          */
/* ---------------------------------- */

/**
 * CardBadge – a small, color‑coded label for cards.
 *
 * Supports multiple visual styles (filled, subtle, outlined),
 * sizes, custom icons, a dot indicator, and status‑based color
 * mapping. Fully accessible and motion‑aware.
 *
 * @component
 * @example
 * <CardBadge color="success" size="sm" dot>
 *   Approved
 * </CardBadge>
 */
const CardBadge = memo(
  forwardRef(function CardBadge(
    {
      children,
      color = 'default',
      variant = 'filled',
      size = DEFAULT_SIZE,
      rounded = 'md',
      icon = null,
      dot = false,
      disabled = false,
      role = 'status',
      className = '',
      'aria-label': ariaLabel,
      ...rest
    },
    ref,
  ) {
    const prefersReducedMotion = useReducedMotion();

    // Resolve the color configuration from the shared status colors.
    const colorConfig = useMemo(
      () => CARD_STATUS_COLORS[color] || CARD_STATUS_COLORS.default,
      [color],
    );
   

    // Resolve size configuration.
    const sizeConfig = useMemo(
      () => BADGE_SIZES[size] || BADGE_SIZES[DEFAULT_SIZE],
      [size],
    );

    // Build variant‑specific class overrides.
    const variantClasses = useMemo(() => {
      const { bg, border, text } = colorConfig;
      switch (variant) {
        case 'subtle':
          return `${bg} ${text}`;
        case 'outlined':
          return `bg-transparent border ${border} ${text}`;
        case 'filled':
        default:
          return `${bg} ${border} ${text}`;
      }
    }, [variant, colorConfig]);

    // Base classes common to all badges.
    const baseClasses = useMemo(
      () =>
        mergeClasses(
          'inline-flex items-center justify-center gap-1.5',
          'font-medium whitespace-nowrap',
          sizeConfig.padding,
          sizeConfig.fontSize,
          variantClasses,
          getRadiusClasses(rounded),
          disabled && 'opacity-50 cursor-not-allowed',
          !disabled && 'select-none',
          className,
        ),
      [
        sizeConfig.padding,
        sizeConfig.fontSize,
        variantClasses,
        rounded,
        disabled,
        className,
      ],
    );

    // Icon with the appropriate size.
    const iconElement = useMemo(() => {
      if (!icon) return null;
      return (
        <span
          aria-hidden="true"
          className={mergeClasses(
            sizeConfig.iconSize,
            'shrink-0',
          )}
        >
          {icon}
        </span>
      );
    }, [icon, sizeConfig.iconSize]);

    // Dot indicator (status dot) – uses the text color as its fill.
    const dotElement = useMemo(() => {
      if (!dot) return null;
      return (
        <span
          aria-hidden="true"
          className={mergeClasses(
            sizeConfig.dotSize,
            'rounded-full shrink-0',
            colorConfig.text, // sets the text color
            'bg-current', // uses the text color as background
          )}
        />
      );
    }, [dot, sizeConfig.dotSize, colorConfig.text]);

    // Determine if the badge is interactive (hover/tap animations only when not disabled).
    const isInteractive = !disabled;

    // Animation props – skip if reduced motion is preferred.
    const motionProps = useMemo(() => {
      if (prefersReducedMotion) {
        return {
          initial: false,
          animate: true,
          whileHover: undefined,
          whileTap: undefined,
        };
      }
      return {
        ...badgeMotion,
        whileHover: isInteractive ? { scale: 1.05 } : undefined,
        whileTap: isInteractive ? { scale: 0.95 } : undefined,
      };
    }, [prefersReducedMotion, isInteractive]);

    // Accessibility attributes.
    const ariaProps = useMemo(
      () => ({
        role,
        'aria-label': ariaLabel || (typeof children === 'string' ? children : undefined),
        'aria-disabled': disabled || undefined,
      }),
      [role, ariaLabel, children, disabled],
    );

    return (
      <motion.span
        ref={ref}
        className={baseClasses}
        {...motionProps}
        {...ariaProps}
        {...rest}
      >
        {dotElement}
        {iconElement}
        {children}
      </motion.span>
    );
  }),
);

CardBadge.displayName = 'CardBadge';

CardBadge.propTypes = {
  /** The content of the badge (typically a short text). */
  children: PropTypes.node,
  /**
   * Color theme, mapped to CARD_STATUS_COLORS.
   * Available: default, online, offline, active, inactive, pending, approved, rejected.
   */
  color: PropTypes.oneOf(Object.keys(CARD_STATUS_COLORS)),
  /**
   * Visual style of the badge.
   * - filled: solid background with border
   * - subtle: background only, no border
   * - outlined: border and text only, transparent background
   */
  variant: PropTypes.oneOf(['filled', 'subtle', 'outlined']),
  /** Size preset controlling padding, font size, and icon/dot dimensions. */
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg']),
  /** Border radius preset from CARD_RADIUS. */
  rounded: PropTypes.oneOf(['none', 'sm', 'md', 'lg', 'xl', '2xl', 'full']),
  /** An optional icon element to display before the text. */
  icon: PropTypes.node,
  /** If true, shows a small dot indicator next to the text. */
  dot: PropTypes.bool,
  /** Disables the badge (reduces opacity and removes hover/tap animations). */
  disabled: PropTypes.bool,
  /** ARIA role; defaults to 'status' for status badges. */
  role: PropTypes.string,
  /** Additional CSS classes. */
  className: PropTypes.string,
  /** Accessible label for screen readers (if different from children). */
  'aria-label': PropTypes.string,
};

export default CardBadge;