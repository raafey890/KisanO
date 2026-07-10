/**
 * KisanO Design System — Button Package
 * ButtonIcon
 *
 * Renders icons for buttons with premium animations, accessibility, and responsive behavior.
 * Handles both regular icons and loading placeholders with smooth transitions.
 *
 * Single Responsibility: This component only renders and animates icons
 * for buttons, never handling text, variants, or button logic.
 *
 * @module components/ui/Button/ButtonIcon
 */
import { forwardRef, memo } from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import { 
  mergeClasses, 
  getIconSize, 
  getIconSpacing, 
  getVariantClasses 
} from './buttonUtils';
/* ---------------------------------- */
/* Motion Presets */
const MOTION_DURATION = Object.freeze({
  fast: 0.15,
  normal: 0.25,
  slow: 0.35,
});
const HOVER_SCALE = 1.05;
const TAPS_SCALE = 0.95;
/* ---------------------------------- */
/* Icon Animation Variants */
const ICON_ANIMATIONS = {
  container: {
    initial: { opacity: 0, scale: 0.9 },
    animate: { 
      opacity: 1, 
      scale: 1,
      transition: { 
        duration: 0.16, 
        ease: [0.23, 1, 0.32, 1] 
      }
    },
    exit: { 
      opacity: 0, 
      scale: 0.9,
      transition: { 
        duration: 0.12, 
        ease: 'easeIn' 
      }
    },
  },
  icon: {
    whileHover: { scale: HOVER_SCALE },
    whileTap: { scale: TAPS_SCALE },
    transition: { duration: MOTION_DURATION.fast, ease: [0.23, 1, 0.32, 1] },
  },
  loading: {
    animate: { 
      rotate: 360,
      transition: { 
        duration: 1.2, 
        repeat: Infinity, 
        ease: 'linear' 
      }
    },
  },
};
/* ---------------------------------- */
/* Component */
const ButtonIcon = memo(
  forwardRef(function ButtonIcon(
    {
      icon,
      position = 'left',
      size = 'md',
      loading = false,
      disabled = false,
      className,
      ...rest
    },
    ref
  ) {
    const iconSize = getIconSize(size);
    const iconSpacing = getIconSpacing(size);
   const variantClasses = getVariantClasses(rest.variant || 'primary');
    const isDisabledOrLoading = disabled || loading;
    const wrapperClasses = mergeClasses(
      'relative flex items-center justify-center',
      iconSpacing,
      position === 'right' && 'order-2',
      isDisabledOrLoading && 'pointer-events-none',
      className
    );
    const iconContainerClasses = mergeClasses(
      'inline-flex',
      iconSize,
      'text-current',
      'transition-colors duration-200',
      disabled ? 'text-gray-400' : variantClasses.textColor,
      loading && 'animate-spin'
    );
    return (
      <motion.div
  aria-hidden="true"
        ref={ref}
        className={wrapperClasses}
        variants={ICON_ANIMATIONS.container}
        initial="initial"
        animate="animate"
        exit="exit"
        whileHover={isDisabledOrLoading ? undefined : ICON_ANIMATIONS.icon.whileHover}
        whileTap={isDisabledOrLoading ? undefined : ICON_ANIMATIONS.icon.whileTap}
        transition={ICON_ANIMATIONS.icon.transition}
        {...rest}
      >
        <motion.div
  aria-hidden="true"
          className={iconContainerClasses}
         animate={loading ? 'animate' : undefined}
variants={loading ? ICON_ANIMATIONS.loading : undefined}
        >
          {icon}
        </motion.div>
      </motion.div>
    );
  }),
);
ButtonIcon.displayName = 'ButtonIcon';
ButtonIcon.propTypes = {
  icon: PropTypes.node.isRequired,
  position: PropTypes.oneOf(['left', 'right']),
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
  loading: PropTypes.bool,
  disabled: PropTypes.bool,
  className: PropTypes.string,
};
export default ButtonIcon;