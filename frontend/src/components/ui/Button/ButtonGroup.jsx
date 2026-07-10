/**
 * KisanO Design System — Button Package
 * ButtonGroup
 *
 * Groups multiple Button components with layout controls, spacing, and responsive stacking.
 * Renders the outer container for button groups, never handling button content directly.
 *
 * Single Responsibility: This component only orchestrates button layout
 * and manages group-level styling and responsive behavior.
 *
 * @module components/ui/Button/ButtonGroup
 */
import { forwardRef, memo } from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import { mergeClasses } from './buttonUtils';
/* ---------------------------------- */
/* Layout Classes */
const getLayoutClasses = ({ orientation, spacing, attached, fullWidth, wrap }) => {
  const orientationClasses = {
    horizontal: 'flex-row',
    vertical: 'flex-col',
  };
  const spacingClasses = {
    none: '',
    xs: 'gap-1',
    sm: 'gap-2',
    md: 'gap-3',
    lg: 'gap-4',
    xl: 'gap-5',
  };
  const attachedClasses = attached ? {
    horizontal: '-space-x-px',
    vertical: '-space-y-px',
  }[orientation] || '' : '';
  const firstLastClasses = attached ? {
    horizontal: '[&>*:first-child]:rounded-l-md [&>*:last-child]:rounded-r-md',
    vertical: '[&>*:first-child]:rounded-t-md [&>*:last-child]:rounded-b-md',
  }[orientation] || '' : '';
  const widthClasses = fullWidth ? 'w-full' : '';
  const wrapClasses = wrap === 'wrap' ? 'flex-wrap' : 'flex-nowrap';
  return mergeClasses(
    'flex',
    orientationClasses[orientation],
    wrapClasses,
    spacingClasses[spacing],
    attachedClasses,
    firstLastClasses,
    widthClasses,
    'p-0.5',
  );
};
/* ---------------------------------- */
/* Border Classes */
const getBorderClasses = (attached) => {
  return attached 
    ? 'border border-gray-200 dark:border-gray-700' 
    : '';
};
/* ---------------------------------- */
/* Group Animation Variants */
const GROUP_ANIMATIONS = {
  container: {
    initial: { opacity: 0, scale: 0.98 },
    animate: { 
      opacity: 1, 
      scale: 1,
      transition: { 
        duration: 0.2, 
        ease: [0.23, 1, 0.32, 1],
        staggerChildren: 0.05,
        delayChildren: 0.02
      }
    },
    exit: { 
      opacity: 0, 
      scale: 0.98,
      transition: { 
        duration: 0.15, 
        ease: 'easeIn' 
      }
    },
  },
  item: {
    initial: { opacity: 0, y: 8 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.18, 
        ease: [0.23, 1, 0.32, 1] 
      }
    },
    whileHover: { 
      scale: 1.02, 
      zIndex: 10,
      transition: { duration: 0.15, ease: [0.23, 1, 0.32, 1] }
    },
    whileTap: { 
      scale: 0.98 
    },
  },
};
/* ---------------------------------- */
/* Component */
const ButtonGroup = memo(
  forwardRef(function ButtonGroup(
    {
      children,
      orientation = 'horizontal',
      spacing = 'md',
      attached = false,
      fullWidth = false,
      wrap = 'nowrap',
      className,
      ...rest
    },
    ref
  ) {
    const containerClasses = mergeClasses(
      getLayoutClasses({
        orientation,
        spacing,
        attached,
        fullWidth,
        wrap,
      }),
      getBorderClasses(attached),
      'relative',
      className
    );
    return (
     <motion.div
  role="group"
        ref={ref}
        className={containerClasses}
        aria-orientation={orientation}
        variants={GROUP_ANIMATIONS.container}
        initial="initial"
        animate="animate"
        exit="exit"
        {...rest}
      >
        {children}
      </motion.div>
    );
  }),
);
ButtonGroup.displayName = 'ButtonGroup';
ButtonGroup.propTypes = {
  children: PropTypes.node.isRequired,
  orientation: PropTypes.oneOf(['horizontal', 'vertical']),
  spacing: PropTypes.oneOf(['none', 'xs', 'sm', 'md', 'lg', 'xl']),
  attached: PropTypes.bool,
  fullWidth: PropTypes.bool,
  wrap: PropTypes.oneOf(['wrap', 'nowrap']),
  className: PropTypes.string,
};
export default ButtonGroup;