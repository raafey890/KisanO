/**
 * KisanO Design System — FileUpload Package
 * FileUploadLoader
 *
 * A skeleton loader for FileUpload components. Renders placeholder content
 * with pulse or shimmer animations to indicate loading state.
 *
 * Single Responsibility: Render skeleton loading UI for file uploads.
 * Does not manage file upload state or input logic.
 *
 * @module components/ui/FileUpload/FileUploadLoader
 */

import { forwardRef, memo, useMemo } from 'react';
import PropTypes from 'prop-types';
import { motion, useReducedMotion } from 'framer-motion';

import {
  FILE_UPLOAD_DEFAULTS,
  getFileUploadSize,
} from './fileUploadVariants';
import {
  mergeClasses,
  resolveResponsiveClasses,
} from './fileUploadUtils';

/* ---------------------------------- */
/* Component-specific tokens          */
/* ---------------------------------- */

/** Height presets for skeleton rows. */
const SKELETON_HEIGHTS = {
  xs: 'h-3',
  sm: 'h-3.5',
  md: 'h-4',
  lg: 'h-5',
  xl: 'h-6',
};

/** Width presets for skeleton rows. */
const SKELETON_WIDTHS = ['w-3/4', 'w-full', 'w-5/6', 'w-2/3', 'w-1/2'];

/** Default number of rows. */
const DEFAULT_ROWS = 3;

/** Motion variants for loader animation. */
const LOADER_MOTION = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  transition: { duration: 0.2, ease: [0.4, 0, 0.2, 1] },
};

/** FileUpload skeleton size mapping. */
const FILEUPLOAD_SKELETON_SIZES = {
  xs: 'min-h-[80px]',
  sm: 'min-h-[100px]',
  md: 'min-h-[140px]',
  lg: 'min-h-[180px]',
  xl: 'min-h-[220px]',
};

/** Icon skeleton size mapping. */
const ICON_SKELETON_SIZES = {
  xs: 'h-8 w-8',
  sm: 'h-10 w-10',
  md: 'h-12 w-12',
  lg: 'h-14 w-14',
  xl: 'h-16 w-16',
};

/* ---------------------------------- */
/* Component                          */
/* ---------------------------------- */

/**
 * FileUploadLoader – a skeleton loader for file uploads.
 *
 * @component
 * @example
 * <FileUploadLoader size="md" variant="shimmer" rows={3} />
 */
const FileUploadLoader = memo(
  forwardRef(function FileUploadLoader(
    {
      size = FILE_UPLOAD_DEFAULTS.size,
      variant = 'shimmer',
      animated = true,
      rows = DEFAULT_ROWS,
      disabled = false,
      responsive,
      className = '',
      role = 'status',
      'aria-label': ariaLabel = 'Loading file upload',
      ...rest
    },
    ref,
  ) {
    const prefersReducedMotion = useReducedMotion();

    // Determine if animations should be active.
    const isAnimated = animated && !prefersReducedMotion && !disabled;

    // Get size configuration.
    const sizeConfig = useMemo(
      () => getFileUploadSize(size),
      [size],
    );

    // Get file upload skeleton size.
    const fileUploadSize = useMemo(
      () => FILEUPLOAD_SKELETON_SIZES[size] || FILEUPLOAD_SKELETON_SIZES.md,
      [size],
    );

    // Get icon skeleton size.
    const iconSize = useMemo(
      () => ICON_SKELETON_SIZES[size] || ICON_SKELETON_SIZES.md,
      [size],
    );

    // Get skeleton height for the size.
    const skeletonHeight = useMemo(
      () => SKELETON_HEIGHTS[size] || SKELETON_HEIGHTS.md,
      [size],
    );

    // Responsive overrides.
    const responsiveClasses = useMemo(
      () => (responsive ? resolveResponsiveClasses(responsive) : ''),
      [responsive],
    );

    // Container classes.
    const containerClasses = useMemo(() => {
      const base = mergeClasses(
        'flex flex-col w-full gap-3',
        disabled && 'opacity-50 cursor-not-allowed',
        className,
      );
      return mergeClasses(base, responsiveClasses);
    }, [disabled, className, responsiveClasses]);

    // Dropzone skeleton classes.
    const dropzoneSkeletonClasses = useMemo(() => {
      const base = mergeClasses(
        'flex flex-col items-center justify-center w-full',
        'bg-gray-100 border-2 border-dashed border-gray-200 rounded-lg',
        fileUploadSize,
        sizeConfig.padding,
        sizeConfig.gap,
        isAnimated && variant === 'pulse' && 'animate-pulse',
      );
      return base;
    }, [fileUploadSize, sizeConfig.padding, sizeConfig.gap, isAnimated, variant]);

    // Icon skeleton classes.
    const iconSkeletonClasses = useMemo(() => {
      const base = mergeClasses(
        'bg-gray-200 rounded-md',
        iconSize,
        isAnimated && variant === 'pulse' && 'animate-pulse',
      );
      return base;
    }, [iconSize, isAnimated, variant]);

    // Render a single skeleton row.
    const renderRow = (index) => {
      // Use varying widths for text rows.
      const widthClass = SKELETON_WIDTHS[index % SKELETON_WIDTHS.length];

      // Build text skeleton.
      const textClasses = mergeClasses(
        'bg-gray-200 rounded-md',
        skeletonHeight,
        widthClass,
        isAnimated && variant === 'pulse' && 'animate-pulse',
      );

      // Shimmer overlay for text.
      const textShimmer = isAnimated && variant === 'shimmer' ? (
        <motion.div
          className="absolute inset-0 overflow-hidden rounded-inherit"
          initial={{ x: '-100%' }}
          animate={{ x: '100%' }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'ease-in-out',
            delay: index * 0.05,
          }}
        >
          <div
            className="h-full w-1/2 bg-gradient-to-r from-transparent via-white/50 to-transparent"
            style={{ borderRadius: 'inherit' }}
          />
        </motion.div>
      ) : null;

      return (
        <motion.div
          key={index}
          className="relative w-full"
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.15, delay: index * 0.05 }}
        >
          <div className={textClasses} />
          {textShimmer}
        </motion.div>
      );
    };

    // Generate rows.
    const rowsToRender = useMemo(
      () => Array.from({ length: rows }, (_, i) => renderRow(i)),
      [rows, size, variant, isAnimated, skeletonHeight],
    );

    // Shimmer overlay for dropzone.
    const dropzoneShimmer = isAnimated && variant === 'shimmer' ? (
      <motion.div
        className="absolute inset-0 overflow-hidden rounded-inherit"
        initial={{ x: '-100%' }}
        animate={{ x: '100%' }}
        transition={{
          duration: 1.8,
          repeat: Infinity,
          ease: 'ease-in-out',
        }}
      >
        <div
          className="h-full w-1/2 bg-gradient-to-r from-transparent via-white/50 to-transparent"
          style={{ borderRadius: 'inherit' }}
        />
      </motion.div>
    ) : null;

    // Shimmer overlay for icon.
    const iconShimmer = isAnimated && variant === 'shimmer' ? (
      <motion.div
        className="absolute inset-0 overflow-hidden rounded-inherit"
        initial={{ x: '-100%' }}
        animate={{ x: '100%' }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: 'ease-in-out',
          delay: 0.1,
        }}
      >
        <div
          className="h-full w-1/2 bg-gradient-to-r from-transparent via-white/50 to-transparent"
          style={{ borderRadius: 'inherit' }}
        />
      </motion.div>
    ) : null;

    // Motion props - respect reduced motion.
    const motionProps = useMemo(() => {
      if (prefersReducedMotion) {
        return { initial: false, animate: true };
      }
      return LOADER_MOTION;
    }, [prefersReducedMotion]);

    // Accessibility attributes.
    const ariaProps = useMemo(
      () => ({
        role,
        'aria-label': ariaLabel,
        'aria-busy': true,
        'aria-disabled': disabled || undefined,
      }),
      [role, ariaLabel, disabled],
    );

    return (
      <motion.div
        ref={ref}
        className={containerClasses}
        {...motionProps}
        {...ariaProps}
        {...rest}
      >
        <div className="relative w-full">
          <div className={dropzoneSkeletonClasses}>
            <div className="relative">
              <div className={iconSkeletonClasses} />
              {iconShimmer}
            </div>
            <div className="flex flex-col items-center gap-1 w-full max-w-xs">
              <div className={mergeClasses('bg-gray-200 rounded-md h-4 w-40', isAnimated && variant === 'pulse' && 'animate-pulse')} />
              <div className={mergeClasses('bg-gray-200 rounded-md h-3 w-32', isAnimated && variant === 'pulse' && 'animate-pulse')} />
            </div>
          </div>
          {dropzoneShimmer}
        </div>

        <div className="flex flex-col gap-2 w-full">
          {rowsToRender}
        </div>
      </motion.div>
    );
  }),
);

FileUploadLoader.displayName = 'FileUploadLoader';

FileUploadLoader.propTypes = {
  /** Size preset. */
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
  /** Animation variant: 'pulse' (opacity pulse) or 'shimmer' (sliding gradient). */
  variant: PropTypes.oneOf(['pulse', 'shimmer']),
  /** Whether to animate the skeleton. */
  animated: PropTypes.bool,
  /** Number of skeleton rows to render. */
  rows: PropTypes.number,
  /** Disabled state. */
  disabled: PropTypes.bool,
  /** Responsive overrides. */
  responsive: PropTypes.shape({
    xs: PropTypes.string,
    sm: PropTypes.string,
    md: PropTypes.string,
    lg: PropTypes.string,
    xl: PropTypes.string,
  }),
  /** Additional CSS classes. */
  className: PropTypes.string,
  /** ARIA role. */
  role: PropTypes.string,
  /** Accessible label. */
  'aria-label': PropTypes.string,
};

export default FileUploadLoader;