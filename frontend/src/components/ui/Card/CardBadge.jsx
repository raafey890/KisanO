/**
 * KisanO Design System — Card Package
 * CardBadge
 *
 * A badge component for displaying status, labels, or short information
 * inside Card components. Supports various positions, sizes, and variants
 * with full accessibility and reduced motion support.
 *
 * Single Responsibility: This component only renders a badge
 * with proper positioning, styling, and accessibility.
 *
 * @module components/ui/Card/CardBadge
 */
import { forwardRef, memo, useMemo } from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import { mergeClasses, getBadgePosition, getRadiusClasses } from './cardUtils';
/* ---------------------------------- */
/* CardBadge Component */
const CardBadge = memo(
  forwardRef(function CardBadge(
    {
      children,
      variant = 'default',
      size = 'md',
      position = 'top-right',
      floating = false,
      rounded = 'md',
      icon,
      ariaHidden = false,
      className,
      ...rest
    },
    ref
  ) {
    const badgePositionClasses = useMemo(
      () => getBadgePosition(position, floating),
      [position, floating]
    );
    
    const badgeRadiusClasses = useMemo(
      () => getRadiusClasses(rounded),
      [rounded]
    );
    
    const variantClasses = useMemo(() => {
      const variantMap = {
        default: 'bg-gray-100 text-gray-800 border border-gray-300',
        primary: 'bg-blue-100 text-blue-800 border border-blue-300',
        secondary: 'bg-gray-100 text-gray-700 border border-gray-400',
        success: 'bg-green-100 text-green-800 border border-green-300',
        warning: 'bg-yellow-100 text-yellow-800 border border-yellow-300',
        danger: 'bg-red-100 text-red-800 border border-red-300',
        info: 'bg-indigo-100 text-indigo-800 border border-indigo-300',
      };
      return variantMap[variant] || variantMap.default;
    }, [variant]);
    
    const sizeClasses = useMemo(() => {
      const sizeMap = {
        xs: 'text-xs px-2 py-1',
        sm: 'text-sm px-2.5 py-1',
        md: 'text-base px-3 py-1.5',
        lg: 'text-lg px-4 py-2',
        xl: 'text-xl px-5 py-2.5',
      };
      return sizeMap[size] || sizeMap.md;
    }, [size]);
    
    const badgeClasses = useMemo(() => mergeClasses(
      'absolute inline-flex items-center gap-1.5 font-medium',
      'whitespace-nowrap',
      'pointer-events-auto',
      'select-none',
      'transform transition-all duration-200',
      'z-0',
      badgePositionClasses,
      badgeRadiusClasses,
      variantClasses,
      sizeClasses,
      className
    ), [badgePositionClasses, badgeRadiusClasses, variantClasses, sizeClasses, className]);
    
    const motionProps = useMemo(() => {
      const baseMotion = {
        initial: { opacity: 0, scale: 0.8 },
        animate: { opacity: 1, scale: 1 },
        exit: { opacity: 0, scale: 0.8 },
        transition: {
          duration: 0.2,
          ease: [0.4, 0, 0.2, 1],
        },
      };
      
      return baseMotion;
    }, []);
    
    const handleKeyDown = useMemo(() => (event) => {
      if (event.key === 'Escape') {
        event.stopPropagation();
      }
    }, []);
    
    return (
      <motion.span
        ref={ref}
        className={badgeClasses}
        role="status"
        aria-hidden={ariaHidden}
        tabIndex={ariaHidden ? -1 : 0}
        onKeyDown={handleKeyDown}
        {...motionProps}
        {...rest}
      >
        {icon && (
          <span className="flex-shrink-0">
            {icon}
          </span>
        )}
        <span className="truncate max-w-xs">
          {children}
        </span>
      </motion.span>
    );
  }),
);
CardBadge.displayName = 'CardBadge';
CardBadge.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf([
    'default', 'primary', 'secondary', 'success', 
    'warning', 'danger', 'info'
  ]),
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
  position: PropTypes.oneOf([
    'top-right', 'top-left', 'bottom-right', 'bottom-left'
  ]),
  floating: PropTypes.bool,
  rounded: PropTypes.oneOf(['none', 'sm', 'md', 'lg', 'xl', 'full']),
  icon: PropTypes.node,
  ariaHidden: PropTypes.bool,
  className: PropTypes.string,
};
export default CardBadge;