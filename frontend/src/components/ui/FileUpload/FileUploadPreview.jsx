/**
 * KisanO Design System — FileUpload Package
 * FileUploadPreview
 *
 * The preview component for uploaded files. Renders file previews with
 * image thumbnails or file icons, file name, size, and action buttons.
 *
 * Single Responsibility: Render file previews with metadata and actions.
 * Does not manage file upload state or drag/drop events.
 *
 * @module components/ui/FileUpload/FileUploadPreview
 */

import { forwardRef, memo, useMemo, useCallback, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { motion, useReducedMotion } from 'framer-motion';

import {
  FILE_UPLOAD_DEFAULTS,
  getFileUploadSize,
} from './fileUploadVariants';
import {
  mergeClasses,
  resolveResponsiveClasses,
  getFileUploadPreviewClasses,
} from './fileUploadUtils';

/* ---------------------------------- */
/* Component-specific tokens          */
/* ---------------------------------- */

/** File icon mapping by extension. */
const FILE_ICON_MAP = {
  pdf: '📄',
  doc: '📝',
  docx: '📝',
  xls: '📊',
  xlsx: '📊',
  ppt: '📽️',
  pptx: '📽️',
  jpg: '🖼️',
  jpeg: '🖼️',
  png: '🖼️',
  gif: '🖼️',
  svg: '🖼️',
  webp: '🖼️',
  mp4: '🎬',
  mov: '🎬',
  avi: '🎬',
  wmv: '🎬',
  mp3: '🎵',
  wav: '🎵',
  flac: '🎵',
  zip: '📦',
  rar: '📦',
  '7z': '📦',
  txt: '📃',
  csv: '📊',
  json: '📋',
  xml: '📋',
  html: '🌐',
  css: '🎨',
  js: '⚡',
  py: '🐍',
  java: '☕',
};

/** Motion variants for preview animation. */
const PREVIEW_MOTION = {
  initial: { opacity: 0, scale: 0.9, y: 10 },
  animate: { opacity: 1, scale: 1, y: 0 },
  exit: { opacity: 0, scale: 0.9, y: -10 },
  transition: { duration: 0.2, ease: [0.4, 0, 0.2, 1] },
};

/** File size formatter. */
function formatFileSize(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

/** Get file extension. */
function getFileExtension(filename) {
  return filename.split('.').pop()?.toLowerCase() || '';
}

/** Get file icon. */
function getFileIcon(filename) {
  const ext = getFileExtension(filename);
  return FILE_ICON_MAP[ext] || '📎';
}

/* ---------------------------------- */
/* Component                          */
/* ---------------------------------- */

/**
 * FileUploadPreview – a preview for uploaded files.
 *
 * @component
 * @example
 * <FileUploadPreview
 *   file={file}
 *   onRemove={handleRemove}
 * />
 */
const FileUploadPreview = memo(
  forwardRef(function FileUploadPreview(
    {
      file,
      onRemove,
      onDownload,
      size = FILE_UPLOAD_DEFAULTS.size,
      disabled = false,
      loading = false,
      error = false,
      success = false,
      showImagePreview = true,
      showRemoveButton = true,
      showDownloadButton = false,
      responsive,
      className = '',
      role = 'listitem',
      'aria-label': ariaLabel,
      removeLabel = 'Remove file',
      downloadLabel = 'Download file',
      ...rest
    },
    ref,
  ) {
    const prefersReducedMotion = useReducedMotion();
    const [imageUrl, setImageUrl] = useState(null);

    // Get size configuration.
    const sizeConfig = useMemo(
      () => getFileUploadSize(size),
      [size],
    );

    // Responsive overrides.
    const responsiveClasses = useMemo(
      () => (responsive ? resolveResponsiveClasses(responsive) : ''),
      [responsive],
    );

    // Preview classes.
    const previewClasses = useMemo(() => {
      const base = getFileUploadPreviewClasses({
        size,
        className,
        disabled,
        error,
        success,
      });
      return mergeClasses(base, responsiveClasses);
    }, [size, className, disabled, error, success, responsiveClasses]);

    // Generate image preview URL.
    useEffect(() => {
      if (!showImagePreview || !file || loading || error) {
        setImageUrl(null);
        return;
      }

      // Check if file is an image.
      const isImage = file.type?.startsWith('image/');
      if (isImage) {
        const url = URL.createObjectURL(file);
        setImageUrl(url);
        return () => URL.revokeObjectURL(url);
      }

      setImageUrl(null);
    }, [file, showImagePreview, loading, error]);

    // Handle remove.
    const handleRemove = useCallback(
      (event) => {
        event.stopPropagation();
        if (disabled || loading) return;
        onRemove?.();
      },
      [disabled, loading, onRemove],
    );

    // Handle download.
    const handleDownload = useCallback(
      (event) => {
        event.stopPropagation();
        if (disabled || loading || !file) return;
        if (onDownload) {
          onDownload();
        } else {
          // Fallback download.
          const url = URL.createObjectURL(file);
          const link = document.createElement('a');
          link.href = url;
          link.download = file.name;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
        }
      },
      [disabled, loading, file, onDownload],
    );

    // Determine if image preview should be shown.
    const isImage = file?.type?.startsWith('image/');
    const showPreviewImage = showImagePreview && isImage && imageUrl && !loading && !error;

    // Motion props - respect reduced motion.
    const motionProps = useMemo(() => {
      if (prefersReducedMotion) {
        return { initial: false, animate: true, exit: false };
      }
      return PREVIEW_MOTION;
    }, [prefersReducedMotion]);

    // Accessibility attributes.
    const ariaProps = useMemo(
      () => ({
        role,
        'aria-label': ariaLabel || file?.name || 'File preview',
        'aria-disabled': disabled || undefined,
        'aria-busy': loading || undefined,
      }),
      [role, ariaLabel, file, disabled, loading],
    );

    // File metadata.
    const fileName = file?.name || 'Unknown file';
    const fileSize = file?.size ? formatFileSize(file.size) : '';
    const fileIcon = showPreviewImage || !file ? null : getFileIcon(fileName);

    return (
      <motion.div
        ref={ref}
        className={previewClasses}
        {...motionProps}
        {...ariaProps}
        {...rest}
      >
        {/* Preview content */}
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {/* Image preview */}
          {showPreviewImage && (
            <div className="shrink-0 w-10 h-10 rounded overflow-hidden bg-gray-100">
              <img
                src={imageUrl}
                alt={file.name}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* File icon */}
          {!showPreviewImage && fileIcon && (
            <div className="shrink-0 text-2xl w-10 h-10 flex items-center justify-center bg-gray-50 rounded">
              {fileIcon}
            </div>
          )}

          {/* File info */}
          <div className="flex-1 min-w-0">
            <p className="font-medium truncate text-sm">{fileName}</p>
            {fileSize && (
              <p className="text-xs text-gray-500">{fileSize}</p>
            )}
            {loading && (
              <p className="text-xs text-blue-500 animate-pulse">Uploading...</p>
            )}
            {error && (
              <p className="text-xs text-red-500">Error uploading</p>
            )}
            {success && (
              <p className="text-xs text-green-500">Uploaded</p>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1 shrink-0">
            {showDownloadButton && file && (
              <button
                type="button"
                className="p-1.5 rounded-md hover:bg-gray-100 transition-colors text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                onClick={handleDownload}
                disabled={disabled || loading}
                aria-label={downloadLabel}
                title={downloadLabel}
              >
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  viewBox="0 0 24 24"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
              </button>
            )}

            {showRemoveButton && onRemove && (
              <button
                type="button"
                className="p-1.5 rounded-md hover:bg-red-50 transition-colors text-gray-400 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
                onClick={handleRemove}
                disabled={disabled || loading}
                aria-label={removeLabel}
                title={removeLabel}
              >
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  viewBox="0 0 24 24"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </motion.div>
    );
  }),
);

FileUploadPreview.displayName = 'FileUploadPreview';

FileUploadPreview.propTypes = {
  /** File object to preview. */
  file: PropTypes.shape({
    name: PropTypes.string,
    size: PropTypes.number,
    type: PropTypes.string,
  }),
  /** Callback when file is removed. */
  onRemove: PropTypes.func,
  /** Callback when file is downloaded. */
  onDownload: PropTypes.func,
  /** Size preset. */
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
  /** Disabled state. */
  disabled: PropTypes.bool,
  /** Loading state. */
  loading: PropTypes.bool,
  /** Error state. */
  error: PropTypes.bool,
  /** Success state. */
  success: PropTypes.bool,
  /** Whether to show image preview. */
  showImagePreview: PropTypes.bool,
  /** Whether to show remove button. */
  showRemoveButton: PropTypes.bool,
  /** Whether to show download button. */
  showDownloadButton: PropTypes.bool,
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
  /** Label for remove button. */
  removeLabel: PropTypes.string,
  /** Label for download button. */
  downloadLabel: PropTypes.string,
};

export default FileUploadPreview;