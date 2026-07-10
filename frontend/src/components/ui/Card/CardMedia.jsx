/**
 * KisanO Design System — Card Package
 * CardMedia
 *
 * The CardMedia component renders media content inside a Card, such as
 * images, videos, or other media elements. It provides comprehensive
 * support for various media types with proper accessibility and responsive
 * behavior.
 *
 * Single Responsibility: This component only renders media content
 * within the Card structure with appropriate styling and accessibility.
 *
 * @module components/ui/Card/CardMedia
 */
import { forwardRef, memo, useMemo } from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import { 
  mergeClasses, 
  getMediaAspectRatio, 
  getImageClasses, 
  
} from './cardUtils';
/* ---------------------------------- */
/* Media Component Variants */

/* ---------------------------------- */
/* CardMedia Component */
const CardMedia = memo(
  forwardRef(function CardMedia(
    {
      src,
      alt,
      type = 'image',
      aspectRatio = '16:9',
      objectFit = 'cover',
      objectPosition = 'center',
      rounded = 'md',
      loading = 'lazy',
      disabled = false,
      className,
      children,
      ...rest
    },
    ref
  ) {
    
    
    const mediaClasses = useMemo(() => mergeClasses(
      'relative w-full overflow-hidden',
      'bg-gray-100',
      type === 'video' && 'aspect-video',
      type === 'figure' && 'aspect-square',
      type === 'custom' && 'aspect-auto',
      
      className
    ), [resolvedProps, className]);
    
    const mediaContentClasses = useMemo(() => mergeClasses(
      'w-full h-full',
      'object-cover',
      
    ), [objectFit, objectPosition]);
    
    const renderMediaContent = useMemo(() => {
      switch (resolvedProps.type) {
        case 'image':
          return (
            <img
              src={src}
              alt={alt || 'Card image'}
              loading={loading}
              className={mediaContentClasses}
              
            />
          );
        case 'video':
          return (
            <video
              src={src}
              className={mediaContentClasses}
              controls={true}
              preload="metadata"
              aria-label={alt || 'Card video'}
            />
          );
        case 'figure':
          return (
            <figure className={mediaContentClasses}>
              <img
                src={src}
                alt={alt || 'Card figure image'}
                loading={loading}
                className="w-full h-full object-cover"
              />
              {children && (
                <figcaption className="p-4 text-sm text-gray-600">
                  {children}
                </figcaption>
              )}
            </figure>
          );
        case 'custom':
          return children || <div className={mediaContentClasses} />;
        default:
          return (
            <div className={mediaContentClasses}>
              {children}
            </div>
          );
      }
    }, [type, src, alt, loading, mediaContentClasses, children]);
    
    return (
      <motion.figure
        ref={ref}
        className={mediaClasses}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        aria-hidden={disabled}
        aria-label={alt || `Card ${resolvedProps.type}`}
        {...rest}
      >
        {renderMediaContent}
      </motion.figure>
    );
  }),
);
CardMedia.displayName = 'CardMedia';
CardMedia.propTypes = {
  src: PropTypes.string,
  alt: PropTypes.string,
  type: PropTypes.oneOf(['image', 'video', 'figure', 'custom']),
  aspectRatio: PropTypes.oneOf(['16:9', '4:3', '1:1', '21:9', '5:4']),
  objectFit: PropTypes.oneOf(['cover', 'contain', 'fill', 'none', 'scale-down']),
  objectPosition: PropTypes.oneOf(['left', 'center', 'right', 'top', 'bottom']),
  rounded: PropTypes.oneOf(['none', 'sm', 'md', 'lg', 'xl', '2xl', 'full']),
  loading: PropTypes.oneOf(['eager', 'lazy']),
  disabled: PropTypes.bool,
  className: PropTypes.string,
  children: PropTypes.node,
};
/* ---------------------------------- */
/* Helper Functions */
function resolveAspectRatioClasses(aspectRatio) {
  const ratioMap = {
    '16:9': 'aspect-video',
    '4:3': 'aspect-[4/3]',
    '1:1': 'aspect-square',
    '21:9': 'aspect-[21/9]',
    '5:4': 'aspect-[5/4]',
  };
  return ratioMap[aspectRatio] || ratioMap['16:9'];
}
function resolveRoundedClasses(rounded) {
  const roundedMap = {
    none: 'rounded-none',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
    '2xl': 'rounded-2xl',
    full: 'rounded-full',
  };
  return roundedMap[rounded] || roundedMap['md'];
}
function resolveObjectFitClasses(objectFit) {
  const fitMap = {
    cover: 'object-cover',
    contain: 'object-contain',
    fill: 'object-fill',
    none: 'object-none',
    'scale-down': 'object-scale-down',
  };
  return fitMap[objectFit] || fitMap['cover'];
}
function resolveObjectPositionClasses(objectPosition) {
  const positionMap = {
    left: 'object-left',
    center: 'object-center',
    right: 'object-right',
    top: 'object-top',
    bottom: 'object-bottom',
  };
  return positionMap[objectPosition] || positionMap['center'];
}
export default CardMedia;