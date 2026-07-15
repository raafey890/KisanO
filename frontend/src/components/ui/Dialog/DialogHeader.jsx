/**
 * KisanO Design System — Dialog Package
 * DialogHeader
 *
 * The header section of a Dialog. Renders the title, subtitle, icon,
 * and action buttons. Provides consistent styling and layout for the
 * dialog header area.
 *
 * Single Responsibility: Render the dialog header with title, subtitle,
 * icon, and actions. Does not manage dialog state or content.
 *
 * @module components/ui/Dialog/DialogHeader
 */

import { forwardRef, memo, useMemo } from 'react';
import PropTypes from 'prop-types';
import { motion, useReducedMotion } from 'framer-motion';

import {
  DIALOG_DEFAULTS,
  getDialogSize,
  getDialogVariant,
} from './dialogVariants';
import {
  mergeClasses,
  resolveResponsiveClasses,
  getDialogHeaderClasses,
} from './dialogUtils';

/* ---------------------------------- */
/* Component-specific tokens          */
/* ---------------------------------- */

/** Alignment mapping. */
const ALIGNMENT_MAP = {
  left: 'text-left items-start',
  center: 'text-center items-center',
  right: 'text-right items-end',
};

/** Motion variants for header animation. */
const HEADER_MOTION = {
  initial: { opacity: 0, y: -10 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.2, ease: [0.4, 0, 0.2, 1] },
};

/* ---------------------------------- */
/* Component                          */
/* ---------------------------------- */

/**
 * DialogHeader – the header of a dialog.
 *
 * @component
 * @example
 * <DialogHeader
 *   title="Confirm Action"
 *   description="This action cannot be undone"
 *   icon={<AlertIcon />}
 *   actions={<CloseButton onClick={onClose} />}
 * />
 */
const DialogHeader = memo(
  forwardRef(function DialogHeader(
    {
      children,
      title,
      description,
      icon,
      actions,
      size = DIALOG_DEFAULTS.size,
      variant = DIALOG_DEFAULTS.variant,
      align = 'left',
      divider = true,
      disabled = false,
      loading = false,
      responsive,
      className = '',
      role = 'heading',
      'aria-level': ariaLevel = 2,
      ...rest
    },
    ref,
  ) {
    const prefersReducedMotion = useReducedMotion();

    // Get size configuration.
    const sizeConfig = useMemo(
      () => getDialogSize(size),
      [size],
    );

    // Get variant configuration.
    const variantConfig = useMemo(
      () => getDialogVariant(variant),
      [variant],
    );

    // Resolve alignment classes.
    const alignClasses = useMemo(
      () => ALIGNMENT_MAP[align] || ALIGNMENT_MAP.left,
      [align],
    );

    // Responsive overrides.
    const responsiveClasses = useMemo(
      () => (responsive ? resolveResponsiveClasses(responsive) : ''),
      [responsive],
    );

    // Header classes.
    const headerClasses = useMemo(() => {
      const base = getDialogHeaderClasses({
        variant,
        className,
        disabled,
      });
      return mergeClasses(base, responsiveClasses);
    }, [variant, className, disabled, responsiveClasses]);

    // Content wrapper classes.
    const contentClasses = useMemo(() => {
      const base = mergeClasses(
        'flex-1 min-w-0',
        alignClasses,
      );
      return base;
    }, [alignClasses]);

    // Title classes.
    const titleClasses = useMemo(() => {
      const base = mergeClasses(
        'font-semibold leading-tight',
        sizeConfig.title,
        variantConfig.text,
        disabled && 'opacity-50',
        loading && 'opacity-70',
      );
      return base;
    }, [sizeConfig.title, variantConfig.text, disabled, loading]);

    // Description classes.
    const descriptionClasses = useMemo(() => {
      const base = mergeClasses(
        'font-normal leading-relaxed',
        sizeConfig.description,
        'text-gray-600',
        disabled && 'opacity-50',
        loading && 'opacity-70',
      );
      return base;
    }, [sizeConfig.description, disabled, loading]);

    // Icon wrapper classes.
    const iconClasses = useMemo(() => {
      const base = mergeClasses(
        'shrink-0',
        variantConfig.text,
        disabled && 'opacity-50',
        loading && 'opacity-70',
      );
      return base;
    }, [variantConfig.text, disabled, loading]);

    // Actions wrapper classes.
    const actionsClasses = useMemo(() => {
      const base = mergeClasses(
        'shrink-0 flex items-center gap-2',
        align === 'left' && 'ml-auto',
        align === 'center' && 'ml-auto',
      );
      return base;
    }, [align]);

    // Motion props - respect reduced motion.
    const motionProps = useMemo(() => {
      if (prefersReducedMotion) {
        return { initial: false, animate: true };
      }
      return HEADER_MOTION;
    }, [prefersReducedMotion]);

    // Determine if header has content.
    const hasTitle = Boolean(title || description || children);
    const hasIcon = Boolean(icon);
    const hasActions = Boolean(actions);

    // If no content, render nothing.
    if (!hasTitle && !hasIcon && !hasActions) {
      return null;
    }

    // Accessibility attributes.
    const ariaProps = useMemo(
      () => ({
        role,
        'aria-level': ariaLevel,
        'aria-disabled': disabled || undefined,
        'aria-busy': loading || undefined,
      }),
      [role, ariaLevel, disabled, loading],
    );

    return (
      <motion.header
        ref={ref}
        className={headerClasses}
        {...motionProps}
        {...ariaProps}
        {...rest}
      >
        {/* Icon */}
        {hasIcon && (
          <div className={iconClasses} aria-hidden="true">
            {icon}
          </div>
        )}

        {/* Title and Description */}
        <div className={contentClasses}>
          {title && (
            <h2 className={titleClasses}>
              {title}
            </h2>
          )}
          {description && (
            <p className={descriptionClasses}>
              {description}
            </p>
          )}
          {children}
        </div>

        {/* Actions */}
        {hasActions && (
          <div className={actionsClasses}>
            {actions}
          </div>
        )}
      </motion.header>
    );
  }),
);

DialogHeader.displayName = 'DialogHeader';

DialogHeader.propTypes = {
  /** Main title of the dialog. */
  title: PropTypes.node,
  /** Subtitle or description text. */
  description: PropTypes.node,
  /** Icon displayed next to the title. */
  icon: PropTypes.node,
  /** Action elements (close button, etc.). */
  actions: PropTypes.node,
  /** Dialog size (affects title and description size). */
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
  /** Dialog variant (affects header styling). */
  variant: PropTypes.oneOf(['default', 'primary', 'secondary', 'success', 'warning', 'error']),
  /** Text alignment. */
  align: PropTypes.oneOf(['left', 'center', 'right']),
  /** Whether to show a bottom border divider. */
  divider: PropTypes.bool,
  /** Disabled state. */
  disabled: PropTypes.bool,
  /** Loading state. */
  loading: PropTypes.bool,
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
  /** Additional content (rendered below description). */
  children: PropTypes.node,
  /** ARIA role. */
  role: PropTypes.string,
  /** ARIA heading level. */
  'aria-level': PropTypes.number,
};

export default DialogHeader;