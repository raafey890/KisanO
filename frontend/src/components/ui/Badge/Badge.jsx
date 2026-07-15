/**
 * KisanO Design System — Badge Package
 * Badge
 *
 * The main Badge component that orchestrates all badge subcomponents.
 * Provides a convenient API for rendering text, number, status,
 * notification, icon, and dot badges with accessibility.
 *
 * Single Responsibility: Orchestrate Badge subcomponents.
 * Does not contain business logic, helper functions, or duplicate styling.
 *
 * @module components/ui/Badge/Badge
 */

import { forwardRef, memo, useMemo } from 'react';
import PropTypes from 'prop-types';

import {
  BADGE_DEFAULTS,
} from './badgeVariants';
import {
  mergeClasses,
  resolveResponsiveClasses,
  resolveDefaultProps,
} from './badgeUtils';

import BadgeContainer from './BadgeContainer';
import BadgeIcon from './BadgeIcon';
import BadgeDot from './BadgeDot';
import BadgeLoader from './BadgeLoader';

/* ---------------------------------- */
/* Component                          */
/* ---------------------------------- */

/**
 * Badge – the main badge component.
 *
 * @component
 * @example
 * <Badge variant="primary">New</Badge>
 *
 * @example
 * <Badge variant="error" size="sm" dot />
 *
 * @example
 * <Badge variant="success" icon={<CheckIcon />}>
 *   Verified
 * </Badge>
 */
const Badge = memo(
  forwardRef(function Badge(
    {
      children,
      label,
      icon,
      count,
      variant = BADGE_DEFAULTS.variant,
      size = BADGE_DEFAULTS.size,
      radius = BADGE_DEFAULTS.radius,
      position = BADGE_DEFAULTS.position,
      dot = false,
      animated = false,
      disabled = false,
      loading = false,
      responsive,
      className = '',
      containerClassName = '',
      iconClassName = '',
      dotClassName = '',
      containerProps,
      iconProps,
      dotProps,
      loaderProps,
      ...rest
    },
    ref,
  ) {
    // Resolve defaults.
    const resolved = useMemo(
      () =>
        resolveDefaultProps({
          variant,
          size,
          radius,
          position,
          disabled,
          loading,
        }),
      [variant, size, radius, position, disabled, loading],
    );

    // Determine if interactive.
    const isInteractive = !resolved.disabled && !resolved.loading;

    // Display label.
    const displayLabel = useMemo(() => {
      if (children) return children;
      if (label) return label;
      if (count !== undefined && count !== null) {
        if (count > 99) return '99+';
        return count;
      }
      return null;
    }, [children, label, count]);

    // Container props.
    const containerPropsMerged = useMemo(
      () => ({
        variant: resolved.variant,
        size: resolved.size,
        position: resolved.position,
        disabled: resolved.disabled,
        loading: resolved.loading,
        className: containerClassName,
        ...containerProps,
      }),
      [
        resolved.variant,
        resolved.size,
        resolved.position,
        resolved.disabled,
        resolved.loading,
        containerClassName,
        containerProps,
      ],
    );

    // Icon props.
    const iconPropsMerged = useMemo(
      () => ({
        size: resolved.size,
        disabled: resolved.disabled,
        className: iconClassName,
        ...iconProps,
      }),
      [resolved.size, resolved.disabled, iconClassName, iconProps],
    );

    // Dot props.
    const dotPropsMerged = useMemo(
      () => ({
        size: resolved.size,
        variant: resolved.variant,
        position: resolved.position,
        disabled: resolved.disabled,
        animated,
        className: dotClassName,
        ...dotProps,
      }),
      [
        resolved.size,
        resolved.variant,
        resolved.position,
        resolved.disabled,
        animated,
        dotClassName,
        dotProps,
      ],
    );

    // Loader props.
    const loaderPropsMerged = useMemo(
      () => ({
        size: resolved.size,
        variant: 'shimmer',
        disabled: resolved.disabled,
        ...loaderProps,
      }),
      [resolved.size, resolved.disabled, loaderProps],
    );

    // Show loader.
    const showLoader = resolved.loading;

    // If dot badge, render BadgeDot.
    if (dot) {
      return <BadgeDot ref={ref} {...dotPropsMerged} {...rest} />;
    }

    // Render badge content.
    const badgeContent = (
      <>
        {icon && <BadgeIcon {...iconPropsMerged}>{icon}</BadgeIcon>}
        {displayLabel && <span className="truncate">{displayLabel}</span>}
      </>
    );

    return (
      <BadgeContainer ref={ref} {...containerPropsMerged} {...rest}>
        {showLoader ? (
          <BadgeLoader {...loaderPropsMerged} />
        ) : (
          badgeContent
        )}
      </BadgeContainer>
    );
  }),
);

Badge.displayName = 'Badge';

Badge.propTypes = {
  /** Badge content (alternative to label). */
  children: PropTypes.node,
  /** Badge label. */
  label: PropTypes.node,
  /** Icon element. */
  icon: PropTypes.node,
  /** Count number (shows '99+' for >99). */
  count: PropTypes.number,
  /** Visual variant. */
  variant: PropTypes.oneOf([
    'default',
    'primary',
    'secondary',
    'success',
    'warning',
    'error',
    'info',
    'outline',
    'ghost',
  ]),
  /** Size preset. */
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
  /** Border radius override. */
  radius: PropTypes.oneOf(['none', 'sm', 'md', 'lg', 'xl', '2xl', 'full']),
  /** Position for floating badges. */
  position: PropTypes.oneOf([
    'top-left',
    'top-right',
    'bottom-left',
    'bottom-right',
    'top-center',
    'bottom-center',
  ]),
  /** Whether to render as dot badge. */
  dot: PropTypes.bool,
  /** Whether dot badge is animated. */
  animated: PropTypes.bool,
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
  /** Additional CSS classes for the container. */
  className: PropTypes.string,
  /** Additional CSS classes for the container wrapper. */
  containerClassName: PropTypes.string,
  /** Additional CSS classes for the icon. */
  iconClassName: PropTypes.string,
  /** Additional CSS classes for the dot. */
  dotClassName: PropTypes.string,
  /** Additional props for BadgeContainer. */
  containerProps: PropTypes.object,
  /** Additional props for BadgeIcon. */
  iconProps: PropTypes.object,
  /** Additional props for BadgeDot. */
  dotProps: PropTypes.object,
  /** Additional props for BadgeLoader. */
  loaderProps: PropTypes.object,
};

export default Badge;