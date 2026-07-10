/**
 * KisanO Design System — Card Package
 * CardContainer
 *
 * The outer Card container component that handles all layout and styling
 * for the entire card structure. This component is responsible only for
 * rendering the outer wrapper and applying all card-related styling.
 *
 * Single Responsibility: This component only renders the outer container
 * and applies card variants, sizes, states, and accessibility attributes.
 *
 * @module components/ui/Card/CardContainer
 */
import { forwardRef, memo, useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import { 
  mergeClasses, 
  getCardClasses, 
  resolveDefaultProps 
} from './cardUtils';
/* ---------------------------------- */
/* CardContainer Component */
const CardContainer = memo(
  forwardRef(function CardContainer(
    {
      children,
      variant = 'default',
      size = 'md',
      radius,
      elevation,
      status = 'default',
      disabled = false,
      loading = false,
      interactive = true,
      className,
      onClick,
      onFocus,
      onBlur,
      onMouseEnter,
      onMouseLeave,
      ...rest
    },
    ref
  ) {
    const resolvedProps = useMemo(() => resolveDefaultProps({
      variant,
      size,
      radius,
      elevation,
      animation: true,
      interactive,
      loading,
      disabled,
    }), [variant, size, radius, elevation, interactive, loading, disabled]);
    
    const cardClasses = useMemo(() => mergeClasses(
      getCardClasses({
        variant: resolvedProps.variant,
        size: resolvedProps.size,
        radius: resolvedProps.radius,
        elevation: resolvedProps.elevation,
        state: status,
        disabled: resolvedProps.disabled,
        interactive: resolvedProps.interactive,
        loading: resolvedProps.loading,
        className,
      }),
      className
    ), [resolvedProps, radius, elevation, status, disabled, interactive, loading, className]);
    
   const tabIndex = useMemo(
  () =>
    resolvedProps.interactive &&
    !resolvedProps.disabled &&
    !resolvedProps.loading
      ? 0
      : -1,
  [
    resolvedProps.interactive,
    resolvedProps.disabled,
    resolvedProps.loading,
  ]
);
    const ariaProps = useMemo(() => ({
      role: 'article',
      
      tabIndex,
    }), [resolvedProps.disabled, resolvedProps.loading, tabIndex]);
    
    const motionProps = useMemo(() => {
      const baseMotion = {
        initial: { opacity: 0, scale: 0.98 },
        animate: { opacity: 1, scale: 1 },
        transition: {
          duration: 0.25,
          ease: [0.4, 0, 0.2, 1],
        },
      };
      
      const interactiveMotion = resolvedProps.interactive ? {
        whileHover: {
          scale: 1.02,
          y: -4,
          transition: { duration: 0.15, ease: [0.23, 1, 0.32, 1] },
        },
        whileTap: { scale: 0.98, transition: { duration: 0.15 } },
        
      } : {};
      
      return { ...baseMotion, ...interactiveMotion };
    }, [resolvedProps.interactive]);
    
    const handleKeyDown = useCallback((event) => {
      if (
        (event.key === 'Enter' || event.key === ' ') &&
        resolvedProps.interactive &&
        !resolvedProps.disabled &&
        !resolvedProps.loading
      ) {
        event.preventDefault();
        onClick?.(event);
      }
    }, [resolvedProps.interactive, resolvedProps.disabled, resolvedProps.loading, onClick]);
    
    return (
      <motion.div
        ref={ref}
        className={cardClasses}
        onClick={onClick}
        onFocus={onFocus}
        onBlur={onBlur}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onKeyDown={handleKeyDown}
        tabIndex={tabIndex}
        aria-disabled={resolvedProps.disabled}
        aria-busy={resolvedProps.loading}
        aria-live="polite"
        aria-atomic="true"
        {...ariaProps}
        {...motionProps}
        {...rest}
      >
        {children}
      </motion.div>
    );
  }),
);
CardContainer.displayName = 'CardContainer';
CardContainer.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf([
    'default', 'outlined', 'filled', 'elevated', 'glass', 'gradient', 
    'success', 'warning', 'danger', 'info'
  ]),
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
  radius: PropTypes.string,
  elevation: PropTypes.oneOf(['none', 'xs', 'sm', 'md', 'lg', 'xl', '2xl', 'inner']),
  status: PropTypes.oneOf([
    'default', 'hover', 'active', 'loading', 'error', 'success', 'warning', 'disabled'
  ]),
  disabled: PropTypes.bool,
  loading: PropTypes.bool,
  interactive: PropTypes.bool,
  className: PropTypes.string,
  onClick: PropTypes.func,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  onMouseEnter: PropTypes.func,
  onMouseLeave: PropTypes.func,
};
export default CardContainer;