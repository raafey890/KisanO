/**
 * KisanO Design System — Avatar Package
 * Avatar
 *
 * The main Avatar component that orchestrates all avatar subcomponents.
 * Provides a convenient API for rendering image avatars, initials fallback,
 * icon avatars, status indicators, and groups.
 *
 * Single Responsibility: Orchestrate Avatar subcomponents.
 * Does not contain business logic, helper functions, or duplicate styling.
 *
 * @module components/ui/Avatar/Avatar
 */

import { forwardRef, memo, useMemo } from 'react';
import PropTypes from 'prop-types';

import {
  AVATAR_DEFAULTS,
} from './avatarVariants';
import {
  mergeClasses,
  resolveResponsiveClasses,
  resolveDefaultProps,
} from './avatarUtils';

import AvatarContainer from './AvatarContainer';
import AvatarImage from './AvatarImage';
import AvatarFallback from './AvatarFallback';
import AvatarStatus from './AvatarStatus';
import AvatarGroup from './AvatarGroup';
import AvatarLoader from './AvatarLoader';

/* ---------------------------------- */
/* Component                          */
/* ---------------------------------- */

/**
 * Avatar – the main avatar component.
 *
 * @component
 * @example
 * <Avatar src="/image.jpg" name="John Doe" />
 *
 * @example
 * <Avatar name="Jane Smith" size="lg" variant="primary" />
 *
 * @example
 * <Avatar icon={<UserIcon />} variant="gradient" />
 */
const Avatar = memo(
  forwardRef(function Avatar(
    {
      children,
      src,
      name,
      initials,
      icon,
      alt,
      status = AVATAR_DEFAULTS.status,
      variant = AVATAR_DEFAULTS.variant,
      size = AVATAR_DEFAULTS.size,
      radius = AVATAR_DEFAULTS.radius,
      group = AVATAR_DEFAULTS.group,
      showStatus = true,
      animated = false,
      disabled = false,
      loading = false,
      objectFit = 'cover',
      responsive,
      className = '',
      containerClassName = '',
      imageClassName = '',
      fallbackClassName = '',
      statusClassName = '',
      containerProps,
      imageProps,
      fallbackProps,
      statusProps,
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
          status,
          group,
          disabled,
          loading,
        }),
      [variant, size, radius, status, group, disabled, loading],
    );

    // Determine if interactive.
    const isInteractive = !resolved.disabled && !resolved.loading;

    // Generate initials from name.
    const generatedInitials = useMemo(() => {
      if (initials) return initials;
      if (!name) return null;
      return name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
    }, [name, initials]);

    // Determine if image is present.
    const hasImage = Boolean(src);

    // Container props.
    const containerPropsMerged = useMemo(
      () => ({
        variant: resolved.variant,
        size: resolved.size,
        radius: resolved.radius,
        disabled: resolved.disabled,
        loading: resolved.loading,
        hasImage,
        className: containerClassName,
        ...containerProps,
      }),
      [
        resolved.variant,
        resolved.size,
        resolved.radius,
        resolved.disabled,
        resolved.loading,
        hasImage,
        containerClassName,
        containerProps,
      ],
    );

    // Image props.
    const imagePropsMerged = useMemo(
      () => ({
        src,
        alt,
        objectFit,
        disabled: resolved.disabled,
        className: imageClassName,
        ...imageProps,
      }),
      [src, alt, objectFit, resolved.disabled, imageClassName, imageProps],
    );

    // Fallback props.
    const fallbackPropsMerged = useMemo(
      () => ({
        variant: resolved.variant,
        size: resolved.size,
        disabled: resolved.disabled,
        className: fallbackClassName,
        ...fallbackProps,
      }),
      [resolved.variant, resolved.size, resolved.disabled, fallbackClassName, fallbackProps],
    );

    // Status props.
    const statusPropsMerged = useMemo(
      () => ({
        status: resolved.status,
        size: resolved.size,
        disabled: resolved.disabled,
        animated,
        className: statusClassName,
        ...statusProps,
      }),
      [
        resolved.status,
        resolved.size,
        resolved.disabled,
        animated,
        statusClassName,
        statusProps,
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

    // Render avatar content.
    const renderContent = () => {
      if (showLoader) {
        return <AvatarLoader {...loaderPropsMerged} />;
      }

      if (hasImage) {
        return <AvatarImage {...imagePropsMerged} />;
      }

      if (icon) {
        return <span className="w-full h-full flex items-center justify-center">{icon}</span>;
      }

      if (generatedInitials) {
        return <AvatarFallback {...fallbackPropsMerged}>{generatedInitials}</AvatarFallback>;
      }

      // Default fallback icon.
      return (
        <AvatarFallback {...fallbackPropsMerged}>
          <svg
            className="w-1/2 h-1/2"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
        </AvatarFallback>
      );
    };

    return (
      <AvatarContainer ref={ref} {...containerPropsMerged} {...rest}>
        {renderContent()}
        {showStatus && <AvatarStatus {...statusPropsMerged} />}
        {children}
      </AvatarContainer>
    );
  }),
);

Avatar.displayName = 'Avatar';

Avatar.propTypes = {
  /** Avatar children (custom). */
  children: PropTypes.node,
  /** Image source URL. */
  src: PropTypes.string,
  /** User name (used to generate initials). */
  name: PropTypes.string,
  /** Custom initials (overrides auto-generated). */
  initials: PropTypes.string,
  /** Icon element (rendered instead of initials). */
  icon: PropTypes.node,
  /** Image alt text. */
  alt: PropTypes.string,
  /** Status indicator. */
  status: PropTypes.oneOf(['online', 'offline', 'away', 'busy']),
  /** Visual variant. */
  variant: PropTypes.oneOf([
    'default',
    'primary',
    'secondary',
    'success',
    'warning',
    'error',
    'info',
    'gradient',
  ]),
  /** Size preset. */
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl', '2xl']),
  /** Border radius override. */
  radius: PropTypes.oneOf(['none', 'sm', 'md', 'lg', 'xl', '2xl', 'full']),
  /** Group style. */
  group: PropTypes.oneOf(['default', 'compact', 'loose']),
  /** Whether to show status indicator. */
  showStatus: PropTypes.bool,
  /** Whether status indicator is animated. */
  animated: PropTypes.bool,
  /** Disabled state. */
  disabled: PropTypes.bool,
  /** Loading state. */
  loading: PropTypes.bool,
  /** Object fit for image. */
  objectFit: PropTypes.oneOf(['cover', 'contain', 'fill', 'none', 'scale-down']),
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
  /** Additional CSS classes for the image. */
  imageClassName: PropTypes.string,
  /** Additional CSS classes for the fallback. */
  fallbackClassName: PropTypes.string,
  /** Additional CSS classes for the status. */
  statusClassName: PropTypes.string,
  /** Additional props for AvatarContainer. */
  containerProps: PropTypes.object,
  /** Additional props for AvatarImage. */
  imageProps: PropTypes.object,
  /** Additional props for AvatarFallback. */
  fallbackProps: PropTypes.object,
  /** Additional props for AvatarStatus. */
  statusProps: PropTypes.object,
  /** Additional props for AvatarLoader. */
  loaderProps: PropTypes.object,
};

export default Avatar;