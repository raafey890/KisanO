/**
 * KisanO Design System — FileUpload Package
 * FileUploadProgress
 *
 * The progress component for file uploads. Renders an animated progress bar
 * with percentage, status indicators, and accessibility support.
 *
 * Single Responsibility: Render upload progress UI.
 * Does not manage file upload state or drag/drop events.
 *
 * @module components/ui/FileUpload/FileUploadProgress
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
  getFileUploadProgressClasses,
  getFileUploadProgressBarClasses,
} from './fileUploadUtils';

/* ---------------------------------- */
/* Component-specific tokens          */
/* ---------------------------------- */

/** Motion variants for progress bar animation. */
const PROGRESS_MOTION = {
  initial: { width: 0 },
  animate: { width: 'var(--progress)' },
  transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
};

/** Status icon mapping. */
const STATUS_ICONS = {
  default: null,
  success: (
    <svg className="h-5 w-5 text-green-500" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <path d="M20 6L9 17l-5-5" />
    </svg>
  ),
  error: (
    <svg className="h-5 w-5 text-red-500" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  ),
  warning: (
    <svg className="h-5 w-5 text-yellow-500" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <path d="M12 9v4" />
      <path d="M12 17h.01" />
      <path d="M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18z" />
    </svg>
  ),
};

/* ---------------------------------- */
/* Component                          */
/* ---------------------------------- */

/**
 * FileUploadProgress – upload progress bar with percentage and status.
 *
 * @component
 * @example
 * <FileUploadProgress value={75} status="default" />
 *
 * @example
 * <FileUploadProgress value={100} status="success" />
 */
const FileUploadProgress = memo(
  forwardRef(function FileUploadProgress(
    {
      value = 0,
      status = 'default',
      label,
      showPercentage = true,
      showStatusIcon = true,
      animated = true,
      size = FILE_UPLOAD_DEFAULTS.size,
      disabled = false,
      responsive,
      className = '',
      barClassName = '',
      role = 'progressbar',
      'aria-label': ariaLabel = 'Upload progress',
      ...rest
    },
    ref,
  ) {
    const prefersReducedMotion = useReducedMotion();

    // Get size configuration.
    const sizeConfig = useMemo(
      () => getFileUploadSize(size),
      [size],
    );

    // Clamp value between 0 and 100.
    const clampedValue = useMemo(
      () => Math.max(0, Math.min(100, value)),
      [value],
    );

    // Determine if animation should be active.
    const shouldAnimate = animated && !prefersReducedMotion && !disabled;

    // Progress classes.
    const progressClasses = useMemo(() => {
      const base = getFileUploadProgressClasses({
        status,
        className,
        value: clampedValue,
      });
      return responsive ? mergeClasses(base, resolveResponsiveClasses(responsive)) : base;
    }, [status, className, clampedValue, responsive]);

    // Progress bar classes.
    const barClasses = useMemo(
      () =>
        getFileUploadProgressBarClasses({
          status,
          className: barClassName,
          value: clampedValue,
        }),
      [status, barClassName, clampedValue],
    );

    // Progress bar style with custom property for animation.
    const barStyle = useMemo(
      () => ({
        '--progress': `${clampedValue}%`,
        width: shouldAnimate ? '0%' : `${clampedValue}%`,
      }),
      [clampedValue, shouldAnimate],
    );

    // Motion props - respect reduced motion.
    const motionProps = useMemo(() => {
      if (!shouldAnimate) {
        return { initial: false, animate: true };
      }
      return PROGRESS_MOTION;
    }, [shouldAnimate]);

    // Status icon.
    const statusIcon = useMemo(() => {
      if (!showStatusIcon || status === 'default') return null;
      return STATUS_ICONS[status] || null;
    }, [status, showStatusIcon]);

    // Status label.
    const statusLabel = useMemo(() => {
      switch (status) {
        case 'success':
          return 'Upload complete';
        case 'error':
          return 'Upload failed';
        case 'warning':
          return 'Upload warning';
        default:
          return `${Math.round(clampedValue)}% uploaded`;
      }
    }, [status, clampedValue]);

    // Accessibility attributes.
    const ariaProps = useMemo(
      () => ({
        role,
        'aria-label': ariaLabel || label || statusLabel,
        'aria-valuenow': clampedValue,
        'aria-valuemin': 0,
        'aria-valuemax': 100,
        'aria-disabled': disabled || undefined,
        'aria-busy': clampedValue > 0 && clampedValue < 100,
      }),
      [role, ariaLabel, label, statusLabel, clampedValue, disabled],
    );

    return (
      <div
        ref={ref}
        className="flex flex-col w-full gap-1.5"
        {...ariaProps}
        {...rest}
      >
        {/* Label and percentage */}
        {(label || showPercentage) && (
          <div className="flex items-center justify-between">
            {label && (
              <span className={mergeClasses('text-sm font-medium', sizeConfig.text)}>
                {label}
              </span>
            )}
            {showPercentage && (
              <span className={mergeClasses('text-sm font-mono', sizeConfig.text)}>
                {Math.round(clampedValue)}%
              </span>
            )}
          </div>
        )}

        {/* Progress bar */}
        <div className={progressClasses}>
          <motion.div
            className={barClasses}
            style={barStyle}
            {...motionProps}
          />
        </div>

        {/* Status indicator */}
        {(status !== 'default' || statusIcon) && (
          <div className="flex items-center gap-2 mt-0.5">
            {statusIcon}
            <span className={mergeClasses(
              'text-sm',
              status === 'success' && 'text-green-600',
              status === 'error' && 'text-red-600',
              status === 'warning' && 'text-yellow-600',
              sizeConfig.text,
            )}>
              {statusLabel}
            </span>
          </div>
        )}
      </div>
    );
  }),
);

FileUploadProgress.displayName = 'FileUploadProgress';

FileUploadProgress.propTypes = {
  /** Progress value (0-100). */
  value: PropTypes.number,
  /** Progress status. */
  status: PropTypes.oneOf(['default', 'success', 'error', 'warning']),
  /** Custom label text. */
  label: PropTypes.node,
  /** Whether to show percentage text. */
  showPercentage: PropTypes.bool,
  /** Whether to show status icon. */
  showStatusIcon: PropTypes.bool,
  /** Whether to animate the progress bar. */
  animated: PropTypes.bool,
  /** Size preset. */
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
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
  /** Additional CSS classes for the container. */
  className: PropTypes.string,
  /** Additional CSS classes for the progress bar. */
  barClassName: PropTypes.string,
  /** ARIA role. */
  role: PropTypes.string,
  /** Accessible label. */
  'aria-label': PropTypes.string,
};

export default FileUploadProgress;