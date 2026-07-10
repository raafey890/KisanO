/**
 * KisanO Design System — Button Package
 * ButtonLoader
 *
 * Renders loading indicators for buttons with premium animations and accessibility.
 * Supports spinner, dots, pulse, and circle loaders with smooth transitions.
 *
 * Single Responsibility: This component only renders loading states
 * and manages loader-specific animations and accessibility.
 *
 * @module components/ui/Button/ButtonLoader
 */
import { forwardRef, memo } from 'react';
import PropTypes from 'prop-types';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  mergeClasses, 
 
} from './buttonUtils';
/* ---------------------------------- */
/* Motion Presets */
const MOTION_DURATION = Object.freeze({
  fast: 0.15,
  normal: 0.25,
  slow: 0.35,
});
const SPINNER_ROTATION_DURATION = 1.2;
const FADE_DURATION = 0.2;
const PULSE_SCALE = [1, 1.05, 1];
const DOTS_Bounce = [0, -8, 0];
const CIRCLE_PROGRESS_DURATION = 2;
/* ---------------------------------- */
/* Loader Variants */
const LOADER_VARIANTS = {
  spinner: {
    animate: { rotate: 360 },
    transition: { 
      repeat: Infinity, 
      duration: SPINNER_ROTATION_DURATION, 
      ease: 'linear' 
    },
  },
  dots: {
    animate: { 
      y: DOTS_Bounce,
      transition: { 
        repeat: Infinity, 
        duration: 0.8,
        ease: 'easeInOut',
        staggerChildren: 0.2
      }
    },
  },
  pulse: {
    animate: { 
      scale: PULSE_SCALE,
      transition: { 
        repeat: Infinity, 
        duration: 1.6,
        ease: 'easeInOut' 
      }
    },
  },
  circle: {
    animate: { 
      strokeDashoffset: [283, 0],
      transition: { 
        repeat: Infinity, 
        duration: CIRCLE_PROGRESS_DURATION,
        ease: 'easeInOut' 
      }
    },
  },
};
/* ---------------------------------- */
/* Dot Component */
const LoaderDot = memo(({ delay = 0 }) => (
  <motion.div
    className="w-1.5 h-1.5 bg-current rounded-full"
    initial={{ opacity: 0, y: 0 }}
    animate={{ 
      opacity: [0, 1, 0],
      y: DOTS_Bounce,
    }}
    transition={{ 
      repeat: Infinity, 
      duration: 0.8,
      ease: 'easeInOut',
      delay,
      staggerChildren: 0.2
    }}
  />
));
/* ---------------------------------- */
/* Circle Loader SVG */
const CircleLoader = ({ size = 'md' }) => {
  const sizeMap = {
    xs: { width: 20, height: 20, strokeWidth: 1.5 },
    sm: { width: 24, height: 24, strokeWidth: 2 },
    md: { width: 32, height: 32, strokeWidth: 2 },
    lg: { width: 40, height: 40, strokeWidth: 2.5 },
    xl: { width: 48, height: 48, strokeWidth: 3 },
  };
  const { width, height, strokeWidth } = sizeMap[size] || sizeMap.md;
  const radius = (width - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  return (
  <svg
  aria-hidden="true"
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className="overflow-visible"
    >
      <circle
        cx={width / 2}
        cy={height / 2}
        r={radius}
        stroke="currentColor"
        strokeWidth={strokeWidth}
        fill="none"
        strokeDasharray={`${circumference} ${circumference}`}
        className="opacity-30"
      />
      <motion.circle
        cx={width / 2}
        cy={height / 2}
        r={radius}
        stroke="currentColor"
        strokeWidth={strokeWidth}
        fill="none"
        strokeDasharray={`${circumference} ${circumference}`}
        initial={{ strokeDashoffset: circumference }}
        animate={{ strokeDashoffset: 0 }}
        transition={{ 
          repeat: Infinity, 
          duration: CIRCLE_PROGRESS_DURATION,
          ease: 'easeInOut' 
        }}
        className="origin-center"
      />
    </svg>
  );
};
/* ---------------------------------- */
/* Component */
const ButtonLoader = memo(
  forwardRef(function ButtonLoader(
    {
      loading = false,
      type = 'spinner',
      size = 'md',
      text,
      className,
      ...rest
    },
    ref
  ) {
    const sizeClasses = {
      xs: 'w-3 h-3',
      sm: 'w-4 h-4',
      md: 'w-5 h-5',
      lg: 'w-6 h-6',
      xl: 'w-7 h-7',
    };
    const iconSize = getIconSize(size);
    const iconSpacing = getIconSpacing(size);
    const wrapperClasses = mergeClasses(
      'inline-flex items-center justify-center gap-2',
      'text-current',
      loading ? 'text-primary-600' : 'text-current',
      className
    );
    const renderLoader = () => {
      switch (type) {
        case 'dots':
          return (
            <div className="flex items-center justify-center gap-1">
              <LoaderDot delay={0} />
              <LoaderDot delay={0.2} />
              <LoaderDot delay={0.4} />
            </div>
          );
        case 'circle':
          return <CircleLoader size={size} />;
        case 'pulse':
  return (
    <motion.div
  role="status"
  aria-live="polite"
      className={mergeClasses(
        'rounded-full bg-current',
        sizeClasses[size]
      )}
      animate={{
        scale: PULSE_SCALE,
      }}
      transition={{
        repeat: Infinity,
        duration: 1.6,
        ease: 'easeInOut',
      }}
    />
  );
        case 'spinner':
        default:
          return (
           <motion.div
  role="status"
  aria-live="polite"
              className={mergeClasses('rounded-full border-2', sizeClasses[size])}
              style={{
                borderColor: 'currentColor',
                borderRightColor: 'transparent',
              }}
              animate={{ rotate: 360 }}
              transition={{ 
                repeat: Infinity, 
                duration: SPINNER_ROTATION_DURATION, 
                ease: 'linear' 
              }}
            />
          );
      }
    };
    return (
      <AnimatePresence>
        {loading && (
          <motion.div
            ref={ref}
            className={wrapperClasses}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ 
              duration: FADE_DURATION, 
              ease: 'easeInOut' 
            }}
            {...rest}
          >
            {renderLoader()}
            {text && (
              <motion.span
                className="text-sm font-medium"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ delay: 0.1, duration: FADE_DURATION }}
              >
                {text}
              </motion.span>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    );
  }),
);
ButtonLoader.displayName = 'ButtonLoader';
ButtonLoader.propTypes = {
  loading: PropTypes.bool,
  type: PropTypes.oneOf(['spinner', 'dots', 'pulse', 'circle']),
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
  text: PropTypes.string,
  className: PropTypes.string,
};
export default ButtonLoader;