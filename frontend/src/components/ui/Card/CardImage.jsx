/**
 * KisanO Design System — Card Package
 * CardImage
 *
 * A specialized image component for rendering images within Card containers.
 * This component provides enterprise-grade image rendering with comprehensive
 * accessibility, responsive, and performance optimization features.
 *
 * Single Responsibility: This component only renders images with proper
 * accessibility and loading attributes.
 *
 * @module components/ui/Card/CardImage
 */
import { forwardRef, memo } from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import { mergeClasses, getImageClasses } from './cardUtils';
/* ---------------------------------- */
/* CardImage Component */
const CardImage = memo(
  forwardRef(function CardImage(
    {
      src,
      alt,
      objectFit = 'cover',
      objectPosition = 'center',
      loading = 'lazy',
      decoding = 'async',
      draggable = false,
      className,
      ...rest
    },
    ref
  ) {
    const imageClasses = mergeClasses(
      'w-full h-full',
      getImageClasses({
        aspectRatio: undefined,
        objectFit,
        objectPosition,
      }),
      className
    );
    
    return (
      <motion.img
        ref={ref}
        src={src}
        alt={alt}
        loading={loading}
        decoding={decoding}
        draggable={draggable}
        className={imageClasses}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
        {...rest}
      />
    );
  }),
);
CardImage.displayName = 'CardImage';
CardImage.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string,
  objectFit: PropTypes.oneOf(['cover', 'contain', 'fill', 'none', 'scale-down']),
  objectPosition: PropTypes.oneOf(['left', 'center', 'right', 'top', 'bottom']),
  loading: PropTypes.oneOf(['eager', 'lazy']),
  decoding: PropTypes.oneOf(['async', 'sync']),
  draggable: PropTypes.bool,
  className: PropTypes.string,
};
export default CardImage;