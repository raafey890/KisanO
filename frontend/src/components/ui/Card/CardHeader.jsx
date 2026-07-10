/**
 * KisanO Design System — Card Package
 * CardHeader
 *
 * The CardHeader component serves as the header section of a Card.
 * It provides semantic structure for header content including titles,
 * subtitles, leading elements, and trailing actions.
 *
 * Single Responsibility: This component only renders the Card header
 * section with proper accessibility and layout support.
 *
 * @module components/ui/Card/CardHeader
 */
import { forwardRef, memo } from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import { mergeClasses } from './cardUtils';
/* ---------------------------------- */
/* CardHeader Component */
const CardHeader = memo(
  forwardRef(function CardHeader(
    {
      children,
      title,
      subtitle,
      leading,
      trailing,
      align = 'start',
      
      className,
      ...rest
    },
    ref
  ) {
    const headerClasses = mergeClasses(
      'flex items-center justify-between w-full',
      'px-6 py-4',
      'border-b border-gray-200',
      'bg-gray-50/50',
      'space-x-4',
      className
    );
    
    const contentClasses = mergeClasses(
      'flex-1 min-w-0',
      align === 'center' && 'text-center',
      align === 'end' && 'text-end',
      align === 'start' && 'text-start'
    );
    
    const titleClasses = mergeClasses(
      'text-lg font-semibold text-gray-900',
      'truncate'
    );
    
    const subtitleClasses = mergeClasses(
      'text-sm text-gray-600 mt-1',
      'truncate'
    );
    
    const actionsClasses = mergeClasses(
      'flex items-center gap-2',
      'shrink-0'
    );
    
    return (
      <motion.header
        ref={ref}
        className={headerClasses}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
        {...rest}
      >
        {leading && (
          <div className="shrink-0 mr-4">
            {leading}
          </div>
        )}
        
        <div className={contentClasses}>
          {title && (
            <h3 className={titleClasses}>
              {title}
            </h3>
          )}
          {subtitle && (
            <p className={subtitleClasses}>
              {subtitle}
            </p>
          )}
          {(title || subtitle) && children && (
            <div className="mt-2">
              {children}
            </div>
          )}
          {!title && !subtitle && children && (
            <div className="w-full">
              {children}
            </div>
          )}
        </div>
        
        {trailing && (
          <div className={actionsClasses}>
            {trailing}
          </div>
        )}
      </motion.header>
    );
  }),
);
CardHeader.displayName = 'CardHeader';
CardHeader.propTypes = {
  children: PropTypes.node,
  title: PropTypes.node,
subtitle: PropTypes.node,
  leading: PropTypes.node,
  trailing: PropTypes.node,
  align: PropTypes.oneOf(['start', 'center', 'end']),
  
  className: PropTypes.string,
};
export default CardHeader;