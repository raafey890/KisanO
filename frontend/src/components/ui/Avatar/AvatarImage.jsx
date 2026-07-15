/**
 * KisanO Design System — Avatar Package
 * AvatarImage
 *
 * The image component for avatars. Renders an image with loading states,
 * error fallback, lazy loading, and accessibility support.
 *
 * Single Responsibility: Render an avatar image.
 * Does not manage avatar state or business logic.
 *
 * @module components/ui/Avatar/AvatarImage
 */

import { forwardRef, memo, useMemo, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { motion, useReducedMotion } from 'framer-motion';

import {
  AVATAR_DEFAULTS,
} from './avatarVariants';
import {
  mergeClasses,
  resolveResponsiveClasses,
  getAvatarImageClasses,
} from './avatarUtils';

/* ---------------------------------- */
/* Component-specific tokens          */
/* ---------------------------------- */

/** Motion variants for image animation. */
const IMAGE_MOTION = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.95 },
  transition: { duration: 0.2, ease: [0.4, 0, 0.2, 1] },
};

/* ---------------------------------- */
/* Component                          */
/* ---------------------------------- */

/**
 * AvatarImage – an image for avatars.
 *
 * @component
 * @example
 * <AvatarImage src="/avatar.jpg" alt="John Doe" />
 */
const AvatarImage = memo(
  forwardRef(function AvatarImage(
    {
      src,
      alt,
      objectFit = 'cover',
      loading = 'lazy',
      decoding = 'async',
      disabled = false,
      fallback,
      onError,
      onLoad,
      responsive,
      className = '',
      role = 'img',
      'aria-label': ariaLabel,
      ...rest
    },
    ref,
  ) {
    const prefersReducedMotion = useReducedMotion();
    const [isLoaded, setIsLoaded] = useState(false);
    const [hasError, setHasError] = useState(false);

    // Image classes.
    const imageClasses = useMemo(
      () =>
        getAvatarImageClasses({
          className,
          disabled,
          objectFit,
        }),
      [className, disabled, objectFit],
    );

    // Responsive overrides.
    const responsiveClasses = useMemo(
      () => (responsive ? resolveResponsiveClasses(responsive) : ''),
      [responsive],
    );

    const finalClasses = useMemo(
      () => mergeClasses(imageClasses, responsiveClasses),
      [imageClasses, responsiveClasses],
    );

    // Handle load.
    const handleLoad = useCallback(
      (event) => {
        setIsLoaded(true);
        onLoad?.(event);
      },
      [onLoad],
    );

    // Handle error.
    const handleError = useCallback(
      (event) => {
        setHasError(true);
        onError?.(event);
      },
      [onError],
    );

    // Motion props - respect reduced motion.
    const motionProps = useMemo(() => {
      if (prefersReducedMotion) {
        return { initial: false, animate: true };
      }
      return IMAGE_MOTION;
    }, [prefersReducedMotion]);

    // Accessibility attributes.
    const ariaProps = useMemo(
      () => ({
        role,
        'aria-label': ariaLabel || alt || 'Avatar image',
        'aria-hidden': !ariaLabel && !alt,
        'data-loaded': isLoaded || undefined,
        'data-error': hasError || undefined,
      }),
      [role, ariaLabel, alt, isLoaded, hasError],
    );

    // If error and fallback provided, render fallback.
    if (hasError && fallback) {
      return fallback;
    }

    // If no src, render nothing.
    if (!src) {
      return null;
    }

    return (
      <motion.img
        ref={ref}
        src={src}
        alt={alt || ''}
        className={finalClasses}
        loading={loading}
        decoding={decoding}
        onLoad={handleLoad}
        onError={handleError}
        {...motionProps}
        {...ariaProps}
        {...rest}
      />
    );
  }),
);

AvatarImage.displayName = 'AvatarImage';

AvatarImage.propTypes = {
  /** Image source URL. */
  src: PropTypes.string,
  /** Image alt text. */
  alt: PropTypes.string,
  /** Object fit for image. */
  objectFit: PropTypes.oneOf(['cover', 'contain', 'fill', 'none', 'scale-down']),
  /** Loading strategy. */
  loading: PropTypes.oneOf(['eager', 'lazy']),
  /** Decoding strategy. */
  decoding: PropTypes.oneOf(['async', 'sync', 'auto']),
  /** Disabled state. */
  disabled: PropTypes.bool,
  /** Fallback element to render on error. */
  fallback: PropTypes.node,
  /** Error handler. */
  onError: PropTypes.func,
  /** Load handler. */
  onLoad: PropTypes.func,
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

export default AvatarImage;