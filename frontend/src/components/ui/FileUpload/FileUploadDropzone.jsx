/**
 * KisanO Design System — FileUpload Package
 * FileUploadDropzone
 *
 * The dropzone component for file uploads. Handles drag & drop events,
 * click to browse, and visual feedback for drag states.
 *
 * Single Responsibility: Render the dropzone area and handle drag/drop events.
 * Does not manage file storage, previews, or progress tracking.
 *
 * @module components/ui/FileUpload/FileUploadDropzone
 */

import { forwardRef, memo, useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import { motion, useReducedMotion } from 'framer-motion';

import {
  FILE_UPLOAD_DEFAULTS,
  getFileUploadSize,
  getFileUploadVariant,
} from './fileUploadVariants';
import {
  mergeClasses,
  resolveResponsiveClasses,
  getFileUploadClasses,
  getFileUploadDropzoneClasses,
} from './fileUploadUtils';

/* ---------------------------------- */
/* Component-specific tokens          */
/* ---------------------------------- */

/** Motion variants for dropzone animation. */
const DROPZONE_MOTION = {
  initial: { opacity: 0, scale: 0.98 },
  animate: { opacity: 1, scale: 1 },
  hover: { scale: 1.01 },
  tap: { scale: 0.98 },
  transition: { duration: 0.2, ease: [0.4, 0, 0.2, 1] },
};

/** Default icon for the dropzone. */
const UPLOAD_ICON = (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-full h-full"
  >
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="17 8 12 3 7 8" />
    <line x1="12" y1="3" x2="12" y2="15" />
  </svg>
);

/* ---------------------------------- */
/* Component                          */
/* ---------------------------------- */

/**
 * FileUploadDropzone – the drag-and-drop upload area.
 *
 * @component
 * @example
 * <FileUploadDropzone
 *   htmlFor="file-upload"
 *   onDrop={handleDrop}
 *   label="Drop files here"
 * />
 */
const FileUploadDropzone = memo(
  forwardRef(function FileUploadDropzone(
    {
      children,
      htmlFor,
      label,
      icon,
      size = FILE_UPLOAD_DEFAULTS.size,
      variant = FILE_UPLOAD_DEFAULTS.variant,
      disabled = false,
      loading = false,
      isDragOver = false,
      accept,
      maxSize,
      maxFiles,
      multiple = false,
      state = 'default',
      responsive,
      className = '',
      role = 'button',
      'aria-label': ariaLabel,
      onDragEnter,
      onDragLeave,
      onDragOver,
      onDrop,
      onClick,
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

    // Get variant configuration.
    const variantConfig = useMemo(
      () => getFileUploadVariant(variant),
      [variant],
    );

    // Dropzone classes.
    const dropzoneClasses = useMemo(() => {
      const base = getFileUploadDropzoneClasses({
        size,
        className,
        disabled,
        isDragOver,
      });
      return responsive ? mergeClasses(base, resolveResponsiveClasses(responsive)) : base;
    }, [size, className, disabled, isDragOver, responsive]);

    // File upload classes (container).
    const uploadClasses = useMemo(
      () =>
        getFileUploadClasses({
          variant,
          size,
          className: dropzoneClasses,
          disabled,
          isDragOver,
          state,
        }),
      [variant, size, dropzoneClasses, disabled, isDragOver, state],
    );

    // Icon size class.
    const iconSize = useMemo(
      () => sizeConfig.icon,
      [sizeConfig.icon],
    );

    // Motion props - respect reduced motion.
    const motionProps = useMemo(() => {
      if (prefersReducedMotion || disabled || loading) {
        return {
          whileHover: undefined,
          whileTap: undefined,
          transition: undefined,
        };
      }
      return {
        whileHover: DROPZONE_MOTION.hover,
        whileTap: DROPZONE_MOTION.tap,
        transition: DROPZONE_MOTION.transition,
      };
    }, [prefersReducedMotion, disabled, loading]);

    // Handle click.
    const handleClick = useCallback(
      (event) => {
        if (disabled || loading) return;
        onClick?.(event);
      },
      [disabled, loading, onClick],
    );

    // Handle drag events.
    const handleDragEnter = useCallback(
      (event) => {
        event.preventDefault();
        event.stopPropagation();
        if (disabled || loading) return;
        onDragEnter?.(event);
      },
      [disabled, loading, onDragEnter],
    );

    const handleDragLeave = useCallback(
      (event) => {
        event.preventDefault();
        event.stopPropagation();
        if (disabled || loading) return;
        onDragLeave?.(event);
      },
      [disabled, loading, onDragLeave],
    );

    const handleDragOver = useCallback(
      (event) => {
        event.preventDefault();
        event.stopPropagation();
        if (disabled || loading) return;
        onDragOver?.(event);
      },
      [disabled, loading, onDragOver],
    );

    const handleDrop = useCallback(
      (event) => {
        event.preventDefault();
        event.stopPropagation();
        if (disabled || loading) return;
        onDrop?.(event);
      },
      [disabled, loading, onDrop],
    );

    // Accessibility attributes.
    const ariaProps = useMemo(
      () => ({
        role,
        'aria-label': ariaLabel || label || 'File upload',
        'aria-disabled': disabled || undefined,
        'aria-busy': loading || undefined,
        tabIndex: disabled || loading ? -1 : 0,
      }),
      [role, ariaLabel, label, disabled, loading],
    );

    // Data attributes.
    const dataAttributes = useMemo(
      () => ({
        'data-state': state,
        'data-dragover': isDragOver || undefined,
        'data-disabled': disabled || undefined,
        'data-loading': loading || undefined,
      }),
      [state, isDragOver, disabled, loading],
    );

    // Helper text for accepted files.
    const acceptText = useMemo(() => {
      if (accept && accept !== '*/*') {
        const types = accept.split(',').map((t) => t.trim());
        return `Accepted: ${types.join(', ')}`;
      }
      return null;
    }, [accept]);

    // Helper text for max size.
    const sizeText = useMemo(() => {
      if (maxSize) {
        const maxSizeMB = Math.round(maxSize / 1024 / 1024);
        return `Max size: ${maxSizeMB}MB`;
      }
      return null;
    }, [maxSize]);

    // Helper text for max files.
    const filesText = useMemo(() => {
      if (maxFiles > 1) {
        return `Max files: ${maxFiles}`;
      }
      return null;
    }, [maxFiles]);

    return (
      <motion.div
        ref={ref}
        className={uploadClasses}
        onClick={handleClick}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        {...motionProps}
        {...ariaProps}
        {...dataAttributes}
        {...rest}
      >
        {/* Hidden label for accessibility */}
        <label htmlFor={htmlFor} className="sr-only">
          {label || 'Upload files'}
        </label>

        {/* Icon */}
        <div className={iconSize}>
          {icon || UPLOAD_ICON}
        </div>

        {/* Content */}
        <div className="flex flex-col items-center gap-1 text-center">
          {label && (
            <p className={mergeClasses('font-medium', sizeConfig.text)}>
              {label}
            </p>
          )}
          {acceptText && (
            <p className={mergeClasses('text-gray-500', sizeConfig.text)}>
              {acceptText}
            </p>
          )}
          {(sizeText || filesText) && (
            <p className={mergeClasses('text-gray-400 text-xs', sizeConfig.text)}>
              {[sizeText, filesText].filter(Boolean).join(' • ')}
            </p>
          )}
        </div>

        {children}
      </motion.div>
    );
  }),
);

FileUploadDropzone.displayName = 'FileUploadDropzone';

FileUploadDropzone.propTypes = {
  /** Children to render inside the dropzone. */
  children: PropTypes.node,
  /** ID of the associated file input. */
  htmlFor: PropTypes.string,
  /** Label text. */
  label: PropTypes.node,
  /** Custom icon. */
  icon: PropTypes.node,
  /** Size preset. */
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
  /** Visual variant. */
  variant: PropTypes.oneOf(['default', 'filled', 'outlined', 'ghost']),
  /** Disabled state. */
  disabled: PropTypes.bool,
  /** Loading state. */
  loading: PropTypes.bool,
  /** Whether the dropzone is in drag over state. */
  isDragOver: PropTypes.bool,
  /** Accepted file types. */
  accept: PropTypes.string,
  /** Maximum file size in bytes. */
  maxSize: PropTypes.number,
  /** Maximum number of files. */
  maxFiles: PropTypes.number,
  /** Whether multiple files can be selected. */
  multiple: PropTypes.bool,
  /** State for styling. */
  state: PropTypes.oneOf(['default', 'hover', 'active', 'focus', 'disabled', 'dragOver', 'error', 'success', 'uploading']),
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
  /** Drag enter handler. */
  onDragEnter: PropTypes.func,
  /** Drag leave handler. */
  onDragLeave: PropTypes.func,
  /** Drag over handler. */
  onDragOver: PropTypes.func,
  /** Drop handler. */
  onDrop: PropTypes.func,
  /** Click handler. */
  onClick: PropTypes.func,
};

export default FileUploadDropzone;