/**
 * KisanO Design System — Button Package
 * ButtonContent
 *
 * The content wrapper component for every Button in the KisanO Design System.
 * Renders button text, icons, children, and handles content layout and spacing.
 *
 * Single Responsibility: This component only renders button content
 * and manages content-specific styling and spacing.
 *
 * @module components/ui/Button/ButtonContent
 */
import { forwardRef, memo } from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import { 
  mergeClasses, 
   
  getIconSpacing, 
  isIconOnlyButton 
} from './buttonUtils';
/**
 * Premium animation variants for ButtonContent
 * Subtle transitions matching industry-leading UI patterns
 */
const ANIMATION_VARIANTS = {
  content: {
    initial: { opacity: 0, y: 2 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.18, 
        ease: [0.23, 1, 0.32, 1],
        staggerChildren: 0.03,
        delayChildren: 0.02
      }
    },
    exit: { 
      opacity: 0, 
      y: -2,
      transition: { 
        duration: 0.12, 
        ease: 'easeIn' 
      }
    },
  },
  icon: {
    initial: { opacity: 0, scale: 0.9 },
    animate: { 
      opacity: 1, 
      scale: 1,
      transition: { 
        duration: 0.16, 
        ease: [0.23, 1, 0.32, 1] 
      }
    },
  },
  text: {
    initial: { opacity: 0, y: 1 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.15, 
        ease: [0.23, 1, 0.32, 1] 
      }
    },
  }
};
/* ---------------------------------- */
/* Component */
const ButtonContent = memo(
  forwardRef(function ButtonContent(
    {
      children,
      leftIcon,
      rightIcon,
      iconPosition = 'left',
      loading = false,
      className,
      ...rest
    },
    ref
  ) {
    const isIconOnly = isIconOnlyButton({ 
      hasIcon: !!(leftIcon || rightIcon), 
      text: children ? String(children).trim() : '' 
    });
  
    const iconSpacing = getIconSpacing('md');
    const containerClasses = mergeClasses(
      'relative inline-flex items-center justify-center gap-2',
      'whitespace-nowrap',
      loading && 'opacity-80',
      !isIconOnly && iconSpacing,
      leftIcon && iconPosition === 'left' && 'flex-row',
      rightIcon && iconPosition === 'right' && 'flex-row-reverse',
      className
    );
    return (
      <motion.div
        ref={ref}
        className={containerClasses}
        variants={ANIMATION_VARIANTS.content}
        initial="initial"
        animate="animate"
        exit="exit"
        {...rest}
      >
        {leftIcon && (
  <motion.div variants={ANIMATION_VARIANTS.icon}>
    {leftIcon}
  </motion.div>
)}
        {rightIcon && (
  <motion.div variants={ANIMATION_VARIANTS.icon}>
    {rightIcon}
  </motion.div>
)}
        <motion.div
  aria-live="polite" variants={ANIMATION_VARIANTS.icon}>
          {rightIcon}
        </motion.div>
      </motion.div>
    );
  }),
);
ButtonContent.displayName = 'ButtonContent';
ButtonContent.propTypes = {
  children: PropTypes.node,
  leftIcon: PropTypes.node,
  rightIcon: PropTypes.node,
  iconPosition: PropTypes.oneOf(['left', 'right']),
  loading: PropTypes.bool,
  className: PropTypes.string,
};
export default ButtonContent;