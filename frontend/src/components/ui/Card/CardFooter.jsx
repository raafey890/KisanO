/**
 * KisanO Design System — Card Package
 * CardFooter
 *
 * The CardFooter component serves as the footer section of a Card.
 * It provides semantic structure for footer content including actions,
 * secondary information, and alignment controls.
 *
 * Single Responsibility: This component only renders the Card footer
 * section with proper accessibility and layout support.
 *
 * @module components/ui/Card/CardFooter
 */
import { forwardRef, memo } from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import { mergeClasses } from './cardUtils';
/* ---------------------------------- */
/* CardFooter Component */
const CardFooter = memo(
  forwardRef(function CardFooter(
    {
      children,
      left,
      right,
      divider = true,
      align = 'start',
      spacing = 'md',
      className,
      ...rest
    },
    ref
  ) {
    const spacingClasses = {
  none: 'gap-0',
  xs: 'gap-1',
  sm: 'gap-2',
  md: 'gap-4',
  lg: 'gap-6',
  xl: 'gap-8',
};
    const footerClasses = mergeClasses(
  'flex items-center justify-between w-full',
  'px-6 py-4',
  divider && 'border-t border-gray-200',
  'bg-gray-50/50',
  spacingClasses[spacing],
  className
);
    
    const contentClasses = mergeClasses(
      'flex-1 min-w-0',
      align === 'center' && 'text-center',
      align === 'end' && 'text-end',
      align === 'start' && 'text-start'
    );
    
    const actionsClasses = mergeClasses(
      'flex items-center gap-2',
      'shrink-0'
    );
    
    return (
      <motion.footer
        ref={ref}
        className={footerClasses}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
  duration: 0.25,
  ease: [0.23, 1, 0.32, 1],
}}
        {...rest}
      >
        {left && (
          <div className="shrink-0 mr-4">
            {left}
          </div>
        )}
        
        <div className={contentClasses}>
          {children}
        </div>
        
        {right && (
          <div className={actionsClasses}>
            {right}
          </div>
        )}
      </motion.footer>
    );
  }),
);
CardFooter.displayName = 'CardFooter';
CardFooter.propTypes = {
  children: PropTypes.node,
  left: PropTypes.node,
  right: PropTypes.node,
  divider: PropTypes.bool,
  align: PropTypes.oneOf(['start', 'center', 'end']),
  spacing: PropTypes.oneOf(['none', 'xs', 'sm', 'md', 'lg', 'xl']),
  className: PropTypes.string,
};
export default CardFooter;