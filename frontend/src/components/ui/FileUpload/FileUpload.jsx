/**
 * KisanO Design System — FileUpload Package
 * FileUpload
 *
 * The main FileUpload component that orchestrates all file upload subcomponents.
 * Provides a convenient API for uploading files with drag & drop,
 * previews, progress tracking, and validation.
 *
 * Single Responsibility: Orchestrate FileUpload subcomponents.
 * Does not contain business logic, helper functions, or duplicate styling.
 *
 * @module components/ui/FileUpload/FileUpload
 */

import { forwardRef, memo, useMemo, useState, useCallback, useRef } from 'react';
import PropTypes from 'prop-types';

import {
  FILE_UPLOAD_DEFAULTS,
} from './fileUploadVariants';
import {
  mergeClasses,
  resolveResponsiveClasses,
  resolveDefaultProps,
  isInteractiveFileUpload,
} from './fileUploadUtils';

import FileUploadContainer from './FileUploadContainer';
import FileUploadDropzone from './FileUploadDropzone';
import FileUploadPreview from './FileUploadPreview';
import FileUploadProgress from './FileUploadProgress';
import FileUploadLoader from './FileUploadLoader';

/* ---------------------------------- */
/* Component                          */
/* ---------------------------------- */

/**
 * FileUpload – the main file upload component.
 *
 * @component
 * @example
 * <FileUpload
 *   label="Upload File"
 *   onFileChange={handleFileChange}
 *   accept=".pdf,.doc"
 * />
 *
 * @example
 * <FileUpload
 *   label="Upload Images"
 *   multiple
 *   accept="image/*"
 *   maxSize={5242880}
 *   onFileChange={handleFilesChange}
 * />
 */
const FileUpload = memo(
  forwardRef(function FileUpload(
    {
      children,
      label,
      helperText,
      error,
      success,
      warning,
      value: controlledValue,
      defaultValue = [],
      onFileChange,
      onChange,
      onBlur,
      onFocus,
      name,
      id,
      variant = FILE_UPLOAD_DEFAULTS.variant,
      size = FILE_UPLOAD_DEFAULTS.size,
      radius = FILE_UPLOAD_DEFAULTS.radius,
      shadow = FILE_UPLOAD_DEFAULTS.shadow,
      disabled = false,
      loading = false,
      required = false,
      multiple = FILE_UPLOAD_DEFAULTS.multiple,
      accept = FILE_UPLOAD_DEFAULTS.accept,
      maxSize = FILE_UPLOAD_DEFAULTS.maxSize,
      maxFiles = FILE_UPLOAD_DEFAULTS.maxFiles,
      showPreviews = true,
      showProgress = true,
      responsive,
      className = '',
      labelClassName = '',
      helperClassName = '',
      containerProps,
      loaderProps,
      dropzoneProps,
      previewProps,
      progressProps,
      onFileRemove,
      onProgress,
      ...rest
    },
    ref,
  ) {
    // Internal state for uncontrolled mode.
    const [internalValue, setInternalValue] = useState(defaultValue);
    const [isDragOver, setIsDragOver] = useState(false);
    const [uploadProgress, setUploadProgress] = useState({});
    const fileInputRef = useRef(null);

    // Determine if controlled or uncontrolled.
    const isControlled = controlledValue !== undefined;
    const files = isControlled ? controlledValue : internalValue;

    // Generate unique ID if not provided.
    const [generatedId] = useState(() => id || `file-upload-${Math.random().toString(36).slice(2, 9)}`);
    const inputId = id || generatedId;

    // Handle file selection.
    const handleFileChange = useCallback(
      (event) => {
        if (disabled || loading) return;

        const selectedFiles = Array.from(event.target.files || []);
        if (selectedFiles.length === 0) return;

        // Validate files.
        const validFiles = [];
        const errors = [];

        selectedFiles.forEach((file) => {
          // Check file type.
          if (accept && accept !== '*/*') {
            const acceptTypes = accept.split(',').map((t) => t.trim());
            const fileType = file.type;
            const fileExtension = `.${file.name.split('.').pop().toLowerCase()}`;
            const isValidType = acceptTypes.some((type) => {
              if (type.startsWith('.')) return type === fileExtension;
              if (type.endsWith('/*')) {
                const baseType = type.replace('/*', '');
                return fileType.startsWith(baseType);
              }
              return type === fileType;
            });
            if (!isValidType) {
              errors.push(`File "${file.name}" has an invalid type.`);
              return;
            }
          }

          // Check file size.
          if (maxSize && file.size > maxSize) {
            const maxSizeMB = Math.round(maxSize / 1024 / 1024);
            errors.push(`File "${file.name}" exceeds the maximum size of ${maxSizeMB}MB.`);
            return;
          }

          validFiles.push(file);
        });

        if (errors.length > 0) {
          // Set error state or show error messages.
          console.warn('File upload validation errors:', errors);
          return;
        }

        let newFiles;
        if (multiple) {
          newFiles = [...files, ...validFiles];
          if (maxFiles && newFiles.length > maxFiles) {
            newFiles = newFiles.slice(0, maxFiles);
          }
        } else {
          newFiles = validFiles.slice(0, 1);
        }

        if (!isControlled) {
          setInternalValue(newFiles);
        }

        onFileChange?.(newFiles, event);
        onChange?.(event);

        // Reset input.
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      },
      [disabled, loading, accept, maxSize, multiple, maxFiles, files, isControlled, onFileChange, onChange],
    );

    // Handle file removal.
    const handleRemove = useCallback(
      (index) => {
        if (disabled || loading) return;

        const newFiles = files.filter((_, i) => i !== index);
        if (!isControlled) {
          setInternalValue(newFiles);
        }
        onFileChange?.(newFiles);
        onFileRemove?.(index);
      },
      [disabled, loading, files, isControlled, onFileChange, onFileRemove],
    );

    // Handle drag events.
    const handleDragEnter = useCallback((event) => {
      event.preventDefault();
      if (!disabled && !loading) {
        setIsDragOver(true);
      }
    }, [disabled, loading]);

    const handleDragLeave = useCallback((event) => {
      event.preventDefault();
      setIsDragOver(false);
    }, []);

    const handleDragOver = useCallback((event) => {
      event.preventDefault();
    }, []);

    const handleDrop = useCallback(
      (event) => {
        event.preventDefault();
        setIsDragOver(false);

        if (disabled || loading) return;

        const droppedFiles = Array.from(event.dataTransfer.files || []);
        if (droppedFiles.length === 0) return;

        // Trigger file change with dropped files.
        const fakeEvent = { target: { files: droppedFiles } };
        handleFileChange(fakeEvent);
      },
      [disabled, loading, handleFileChange],
    );

    // Resolve defaults.
    const resolved = useMemo(
      () =>
        resolveDefaultProps({
          variant,
          size,
          radius,
          shadow,
          disabled,
          required,
          multiple,
          accept,
          maxSize,
          maxFiles,
        }),
      [variant, size, radius, shadow, disabled, required, multiple, accept, maxSize, maxFiles],
    );

    // Determine if interactive.
    const interactive = useMemo(
      () => isInteractiveFileUpload({ disabled: resolved.disabled, loading }),
      [resolved.disabled, loading],
    );

    // Determine file upload state for styling.
    const uploadState = useMemo(() => {
      if (resolved.disabled) return 'disabled';
      if (error) return 'error';
      if (success) return 'success';
      if (isDragOver) return 'dragOver';
      if (loading) return 'uploading';
      return 'default';
    }, [resolved.disabled, error, success, isDragOver, loading]);

    // Build helper text ID.
    const helperId = helperText ? `${inputId}-helper` : undefined;

    // Accessibility attributes.
    const ariaProps = useMemo(
      () => ({
        'aria-invalid': error ? true : undefined,
        'aria-describedby': helperId,
        'aria-required': required || undefined,
        'aria-label': typeof label === 'string' ? label : undefined,
      }),
      [error, helperId, required, label],
    );

    // Container props.
    const containerPropsMerged = useMemo(
      () => ({
        variant: resolved.variant,
        size: resolved.size,
        disabled: resolved.disabled,
        loading,
        className,
        ...containerProps,
        ...rest,
      }),
      [resolved.variant, resolved.size, resolved.disabled, loading, className, containerProps, rest],
    );

    // Dropzone props.
    const dropzonePropsMerged = useMemo(
      () => ({
        label,
        size: resolved.size,
        disabled: resolved.disabled,
        loading,
        isDragOver,
        accept: resolved.accept,
        maxSize: resolved.maxSize,
        maxFiles: resolved.maxFiles,
        multiple: resolved.multiple,
        state: uploadState,
        ...dropzoneProps,
      }),
      [
        label,
        resolved.size,
        resolved.disabled,
        loading,
        isDragOver,
        resolved.accept,
        resolved.maxSize,
        resolved.maxFiles,
        resolved.multiple,
        uploadState,
        dropzoneProps,
      ],
    );

    // Loader props.
    const loaderPropsMerged = useMemo(
      () => ({
        size: resolved.size,
        variant: 'shimmer',
        rows: 2,
        disabled: resolved.disabled,
        ...loaderProps,
      }),
      [resolved.size, resolved.disabled, loaderProps],
    );

    // Handle loading state.
    const showLoader = loading;

    return (
      <FileUploadContainer ref={ref} {...containerPropsMerged}>
        {/* Hidden input */}
        <input
          ref={fileInputRef}
          type="file"
          id={inputId}
          name={name}
          onChange={handleFileChange}
          onBlur={onBlur}
          onFocus={onFocus}
          disabled={disabled || loading}
          required={required}
          multiple={multiple}
          accept={accept}
          className="sr-only"
          {...ariaProps}
        />

        {/* Dropzone */}
        <FileUploadDropzone
          htmlFor={inputId}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          {...dropzonePropsMerged}
        />

        {/* Loader */}
        {showLoader && <FileUploadLoader {...loaderPropsMerged} />}

        {/* Helper text */}
        {helperText && (
          <div
            id={helperId}
            className={mergeClasses(
              'text-sm mt-1.5',
              error ? 'text-red-600' : success ? 'text-green-600' : warning ? 'text-yellow-600' : 'text-gray-500',
              helperClassName,
            )}
          >
            {helperText}
          </div>
        )}

        {/* Previews */}
        {showPreviews && files.length > 0 && !showLoader && (
          <div className="mt-4 space-y-2">
            {files.map((file, index) => (
              <FileUploadPreview
                key={index}
                file={file}
                onRemove={() => handleRemove(index)}
                disabled={disabled || loading}
                error={error}
                success={success}
                size={resolved.size}
                {...previewProps}
              />
            ))}
          </div>
        )}

        {/* Progress */}
        {showProgress && loading && Object.keys(uploadProgress).length > 0 && (
          <FileUploadProgress
            value={uploadProgress.value || 0}
            status={error ? 'error' : success ? 'success' : 'default'}
            size={resolved.size}
            {...progressProps}
          />
        )}

        {children}
      </FileUploadContainer>
    );
  }),
);

FileUpload.displayName = 'FileUpload';

FileUpload.propTypes = {
  /** File upload label. */
  label: PropTypes.node,
  /** Helper text displayed below the dropzone. */
  helperText: PropTypes.node,
  /** Error state. */
  error: PropTypes.bool,
  /** Success state. */
  success: PropTypes.bool,
  /** Warning state. */
  warning: PropTypes.bool,
  /** Controlled file list. */
  value: PropTypes.arrayOf(PropTypes.object),
  /** Default file list for uncontrolled mode. */
  defaultValue: PropTypes.arrayOf(PropTypes.object),
  /** Callback when files change. */
  onFileChange: PropTypes.func,
  /** Change handler (for native input). */
  onChange: PropTypes.func,
  /** Blur handler. */
  onBlur: PropTypes.func,
  /** Focus handler. */
  onFocus: PropTypes.func,
  /** Input name. */
  name: PropTypes.string,
  /** Input ID. */
  id: PropTypes.string,
  /** Visual variant. */
  variant: PropTypes.oneOf(['default', 'filled', 'outlined', 'ghost']),
  /** Size preset. */
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
  /** Border radius override. */
  radius: PropTypes.oneOf(['none', 'sm', 'md', 'lg', 'xl', '2xl', 'full']),
  /** Shadow level. */
  shadow: PropTypes.oneOf(['none', 'sm', 'md', 'lg', 'xl', '2xl']),
  /** Disabled state. */
  disabled: PropTypes.bool,
  /** Loading state. */
  loading: PropTypes.bool,
  /** Required state. */
  required: PropTypes.bool,
  /** Whether multiple files can be selected. */
  multiple: PropTypes.bool,
  /** Accepted file types (comma-separated or MIME types). */
  accept: PropTypes.string,
  /** Maximum file size in bytes. */
  maxSize: PropTypes.number,
  /** Maximum number of files. */
  maxFiles: PropTypes.number,
  /** Whether to show file previews. */
  showPreviews: PropTypes.bool,
  /** Whether to show progress bar. */
  showProgress: PropTypes.bool,
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
  /** Additional CSS classes for the label. */
  labelClassName: PropTypes.string,
  /** Additional CSS classes for the helper text. */
  helperClassName: PropTypes.string,
  /** Additional props for FileUploadContainer. */
  containerProps: PropTypes.object,
  /** Additional props for FileUploadLoader. */
  loaderProps: PropTypes.object,
  /** Additional props for FileUploadDropzone. */
  dropzoneProps: PropTypes.object,
  /** Additional props for FileUploadPreview. */
  previewProps: PropTypes.object,
  /** Additional props for FileUploadProgress. */
  progressProps: PropTypes.object,
  /** Callback when a file is removed. */
  onFileRemove: PropTypes.func,
  /** Callback for progress updates. */
  onProgress: PropTypes.func,
  /** Additional content. */
  children: PropTypes.node,
};

export default FileUpload;