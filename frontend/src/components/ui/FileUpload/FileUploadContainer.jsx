/**
 * KisanO Design System — FileUpload Package
 * FileUploadContainer
 *
 * The container component that wraps the file upload and its associated elements.
 * Handles layout, styling, and accessibility attributes.
 *
 * Single Responsibility: Render the file upload container with layout and styling.
 * Does not manage file upload state or business logic.
 *
 * @module components/ui/FileUpload/FileUploadContainer
 */

import { forwardRef, memo, useMemo } from 'react';
import PropTypes from 'prop-types';
import { motion, useReducedMotion } from 'framer-motion';

import {
  FILE_UPLOAD_DEFAULTS,
} from './fileUploadVariants';
import {
  mergeClasses,
  resolveResponsiveClasses,
  resolveDefaultProps,
  getFileUploadContainerClasses,
} from './fileUploadUtils';

/* ---------------------------------- */
/* Component-specific tokens          */
/* ---------------------------------- */

/** Motion variants for container animation. */
const CONTAINER_MOTION = {
  initial: { opacity: 0, y: 4 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.15, ease: [0.4, 0, 0.2, 1] },
};

/* ---------------------------------- */
/* Component                          */
/* ---------------------------------- */

/**
 * FileUploadContainer – the main file upload wrapper with layout and styling.
 *
 * @component
 * @example
 * <FileUploadContainer variant="default" size="md">
 *   <FileUploadDropzone />
 *   <FileUploadPreview />
 * </FileUploadContainer>
 */
const FileUploadContainer = memo(
  forwardRef(function FileUploadContainer(
    {
      children,
      variant = FILE_UPLOAD_DEFAULTS.variant,
      size = FILE_UPLOAD_DEFAULTS.size,
      disabled = false,
      loading = false,
      error = false,
      success = false,
      warning = false,
      isDragOver = false,
      responsive,
      className = '',
      role = 'none',
      ...rest
    },
    ref,
  ) {
    const prefersReducedMotion = useReducedMotion();

    // Resolve defaults.
    const resolved = useMemo(
      () =>
        resolveDefaultProps({
          variant,
          size,
          disabled,
        }),
      [variant, size, disabled],
    );

    // Container classes.
    const containerClasses = useMemo(() => {
      const base = getFileUploadContainerClasses({
        className,
        disabled: resolved.disabled,
        loading,
      });
      return responsive ? mergeClasses(base, resolveResponsiveClasses(responsive)) : base;
    }, [className, resolved.disabled, loading, responsive]);

    // Motion props - respect reduced motion.
    const motionProps = useMemo(() => {
      if (prefersReducedMotion) {
        return { initial: false, animate: true };
      }
      return CONTAINER_MOTION;
    }, [prefersReducedMotion]);

    // Accessibility attributes.
    const ariaProps = useMemo(
      () => ({
        role,
        'aria-disabled': resolved.disabled || undefined,
        'aria-busy': loading || undefined,
        'aria-invalid': error || undefined,
      }),
      [role, resolved.disabled, loading, error],
    );

    // Data attributes for styling.
    const dataAttributes = useMemo(
      () => ({
        'data-variant': resolved.variant,
        'data-size': resolved.size,
        'data-disabled': resolved.disabled || undefined,
        'data-loading': loading || undefined,
        'data-error': error || undefined,
        'data-success': success || undefined,
        'data-warning': warning || undefined,
        'data-dragover': isDragOver || undefined,
      }),
      [
        resolved.variant,
        resolved.size,
        resolved.disabled,
        loading,
        error,
        success,
        warning,
        isDragOver,
      ],
    );

    return (
      <motion.div
        ref={ref}
        className={containerClasses}
        {...motionProps}
        {...ariaProps}
        {...dataAttributes}
        {...rest}
      >
        {children}
      </motion.div>
    );
  }),
);

FileUploadContainer.displayName = 'FileUploadContainer';

FileUploadContainer.propTypes = {
  /** File upload content (Dropzone, Preview, etc.). */
  children: PropTypes.node,
  /** Visual variant. */
  variant: PropTypes.oneOf(['default', 'filled', 'outlined', 'ghost']),
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
  /** Warning state. */
  warning: PropTypes.bool,
  /** Whether the dropzone is in drag over state. */
  isDragOver: PropTypes.bool,
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
};

export default FileUploadContainer;