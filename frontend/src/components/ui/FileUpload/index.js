/**
 * KisanO Design System — FileUpload Package
 * Public API entry point.
 *
 * Exports all components, utilities, and design tokens for the FileUpload package.
 * Supports tree shaking and named imports.
 *
 * @module components/ui/FileUpload
 */

/* ---------------------------------- */
/* Re-export all design tokens        */
/* ---------------------------------- */

export {
  FILE_UPLOAD_VARIANTS,
  FILE_UPLOAD_SIZES,
  FILE_UPLOAD_RADIUS,
  FILE_UPLOAD_SHADOWS,
  FILE_UPLOAD_STATES,
  FILE_UPLOAD_PROGRESS_COLORS,
  FILE_UPLOAD_DEFAULTS,
  getFileUploadVariant,
  getFileUploadSize,
  getFileUploadRadius,
  getFileUploadShadow,
  getFileUploadState,
  getFileUploadProgressColor,
} from './fileUploadVariants';

/* ---------------------------------- */
/* Re-export utilities                */
/* ---------------------------------- */

export {
  mergeClasses,
  resolveResponsiveClasses,
  resolveDefaultProps,
  getFileUploadClasses,
  getFileUploadContainerClasses,
  getFileUploadDropzoneClasses,
  getFileUploadPreviewClasses,
  getFileUploadProgressClasses,
  getFileUploadProgressBarClasses,
  isValidVariant,
  isValidSize,
  isValidRadius,
  isValidShadow,
  isInteractiveFileUpload,
  getAccessibilityHelpers,
} from './fileUploadUtils';

/* ---------------------------------- */
/* Re-export components               */
/* ---------------------------------- */

export { default as FileUpload } from './FileUpload';
export { default as FileUploadContainer } from './FileUploadContainer';
export { default as FileUploadDropzone } from './FileUploadDropzone';
export { default as FileUploadPreview } from './FileUploadPreview';
export { default as FileUploadProgress } from './FileUploadProgress';
export { default as FileUploadLoader } from './FileUploadLoader';

/* ---------------------------------- */
/* Default export                     */
/* ---------------------------------- */

export { default } from './FileUpload';