/**
 * KisanO Design System — Card Package
 * CardBody
 *
 * The CardBody component serves as the main content container of a Card.
 * It provides semantic structure for the body content including text,
 * media, and other nested components with proper spacing and layout.
 *
 * Single Responsibility: This component only renders the Card body
 * section with appropriate styling, spacing, and layout support.
 *
 * @module components/ui/Card/CardBody
 */
import { forwardRef, memo, useMemo } from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import { mergeClasses } from './cardUtils';
/* ---------------------------------- */
/* CardBody Component */
const CardBody = memo(
  forwardRef(function CardBody(
    {
      children,
      spacing = 'md',
      padding,
      scrollable = false,
      loading = false,
      disabled = false,
      className,
      ...rest
    },
    ref
  ) {
    const paddingClasses = {
  none: 'p-0',
  xs: 'p-3',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
  xl: 'p-10',
};

const resolvedPadding = padding || paddingClasses[spacing];
    const bodyClasses = useMemo(() => mergeClasses(
        
      'flex-1',
      'w-full',
      scrollable ? 'overflow-y-auto' : 'overflow-hidden',
      scrollable ? 'max-h-64' : 'max-h-none',
      resolvedPadding,
      'space-y-4',
      'text-gray-700',
      disabled && 'opacity-50 cursor-not-allowed',
      className
    ), [spacing, padding, scrollable, disabled, className]);
    
    const contentClasses = useMemo(() => mergeClasses(
      'space-y-4',
      scrollable && 'pb-4'
    ), [scrollable]);
    
    const loadingClasses = useMemo(() => mergeClasses(
      'space-y-4',
      'animate-pulse',
      'opacity-70'
    ), []);
    
    return (
      <motion.section
        ref={ref}
        className={bodyClasses}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
        {...rest}
      >
        {loading ? (
          <div className={loadingClasses}>
            <div className="h-4 bg-gray-200 rounded w-3/4" />
            <div className="h-4 bg-gray-200 rounded w-full" />
            <div className="h-4 bg-gray-200 rounded w-5/6" />
          </div>
        ) : (
          <div className={contentClasses}>
            {children}
          </div>
        )}
     </motion.section>
    );
  }),
);
CardBody.displayName = 'CardBody';
CardBody.propTypes = {
  children: PropTypes.node,
  spacing: PropTypes.oneOf(['none', 'xs', 'sm', 'md', 'lg', 'xl']),
 padding: PropTypes.string,
  scrollable: PropTypes.bool,
  loading: PropTypes.bool,
  disabled: PropTypes.bool,
  className: PropTypes.string,
};
export default CardBody;