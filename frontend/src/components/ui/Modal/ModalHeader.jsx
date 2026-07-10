/**
 * KisanO Design System — Modal Package
 * ModalHeader
 *
 * The header section of a Modal. Renders the title, subtitle, icon, and
 * action buttons (like close, minimize, etc.). It provides consistent
 * styling and layout for the modal header area.
 *
 * Single Responsibility: Render the modal header with title, subtitle,
 * icon, and actions. Does not handle modal visibility or content.
 *
 * @module components/ui/Modal/ModalHeader
 */

import { forwardRef, memo, useMemo } from 'react';
import PropTypes from 'prop-types';
import { motion, useReducedMotion } from 'framer-motion';

import {
  MODAL_TYPOGRAPHY,
  
  MODAL_DEFAULTS,
} from './modalVariants';
import {
  mergeClasses,
  resolveResponsiveClasses,
} from './modalUtils';

/* ---------------------------------- */
/* Component‑specific tokens          */
/* ---------------------------------- */

/** Alignment mapping. */
const ALIGNMENT_MAP = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
};

/** Flex alignment mapping. */
const FLEX_ALIGN_MAP = {
  left: 'justify-start',
  center: 'justify-center',
  right: 'justify-end',
};

/** Title size mapping based on modal size. */
const TITLE_SIZES = {
  xs: 'text-base',
  sm: 'text-lg',
  md: 'text-xl',
  lg: 'text-2xl',
  xl: 'text-3xl',
  full: 'text-2xl',
};

/* ---------------------------------- */
/* Component                          */
/* ---------------------------------- */

/**
 * ModalHeader – the header section of a modal.
 *
 * @component
 * @example
 * <ModalHeader
 *   title="Confirm Action"
 *   subtitle="This action cannot be undone"
 *   icon={<AlertIcon />}
 *   actions={<CloseButton onClick={onClose} />}
 * />
 */
const ModalHeader = memo(
  forwardRef(function ModalHeader(
    {
      title,
      subtitle,
      icon,
      actions,
      size = MODAL_DEFAULTS.size,
      align = 'left',
      divider = true,
      sticky = false,
      disabled = false,
      loading = false,
      responsive,
      className = '',
      children,
      ...rest
    },
    ref,
  ) {
    const prefersReducedMotion = useReducedMotion();

    // Resolve alignment classes.
    const alignClasses = useMemo(
      () => ALIGNMENT_MAP[align] || ALIGNMENT_MAP.left,
      [align],
    );

    const flexAlignClasses = useMemo(
      () => FLEX_ALIGN_MAP[align] || FLEX_ALIGN_MAP.left,
      [align],
    );

    // Resolve title size based on modal size.
    const titleSize = useMemo(
      () => TITLE_SIZES[size] || TITLE_SIZES.md,
      [size],
    );

    // Responsive overrides.
    const responsiveClasses = useMemo(
      () => (responsive ? resolveResponsiveClasses(responsive) : ''),
      [responsive],
    );

    // Base header classes.
    const headerClasses = useMemo(() => {
      const base = mergeClasses(
        'flex items-start w-full gap-4',
        flexAlignClasses,
        'px-6 py-4',
        sticky && 'sticky top-0 z-10 bg-white/95 backdrop-blur-sm',
        divider && 'border-b border-gray-200',
        disabled && 'opacity-50 cursor-not-allowed',
        loading && 'opacity-70',
        className,
      );
      return mergeClasses(base, responsiveClasses);
    }, [flexAlignClasses, sticky, divider, disabled, loading, className, responsiveClasses]);

    // Content wrapper classes (flex column).
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
        MODAL_TYPOGRAPHY.title,
        titleSize,
        'text-gray-900',
        disabled && 'text-gray-500',
      );
      return base;
    }, [titleSize, disabled]);

    // Subtitle classes.
    const subtitleClasses = useMemo(() => {
      const base = mergeClasses(
        MODAL_TYPOGRAPHY.subtitle,
        'text-gray-500 mt-1',
        disabled && 'text-gray-400',
      );
      return base;
    }, [disabled]);

    // Icon wrapper classes.
    const iconClasses = useMemo(() => {
      const base = mergeClasses(
        'shrink-0',
        'text-gray-500',
        disabled && 'text-gray-400',
      );
      return base;
    }, [disabled]);

    // Actions wrapper classes.
    const actionsClasses = useMemo(() => {
      const base = mergeClasses(
        'shrink-0 flex items-center gap-2',
        align === 'left' && 'ml-auto',
        align === 'center' && 'ml-auto',
      );
      return base;
    }, [align]);

    // Motion props.
    const motionProps = useMemo(() => {
      if (prefersReducedMotion) {
        return { initial: false, animate: true };
      }
      return {
        initial: { opacity: 0, y: -10 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.2, ease: [0.4, 0, 0.2, 1] },
      };
    }, [prefersReducedMotion]);

    // Determine if header has content.
    const hasTitle = Boolean(title || subtitle || children);
    const hasIcon = Boolean(icon);
    const hasActions = Boolean(actions);

    // If no content, render nothing.
    if (!hasTitle && !hasIcon && !hasActions) {
      return null;
    }

    return (
      <motion.header
        ref={ref}
        role="banner"
        className={headerClasses}
        {...motionProps}
        {...rest}
      >
        {/* Icon */}
        {hasIcon && (
          <div className={iconClasses} aria-hidden="true">
            {icon}
          </div>
        )}

        {/* Title and Subtitle */}
        <div className={contentClasses}>
          {title && (
            <h2 className={titleClasses}>
              {title}
            </h2>
          )}
          {subtitle && (
            <p className={subtitleClasses}>
              {subtitle}
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

ModalHeader.displayName = 'ModalHeader';

ModalHeader.propTypes = {
  /** Main title of the modal. */
  title: PropTypes.node,
  /** Subtitle or description text. */
  subtitle: PropTypes.node,
  /** Icon displayed next to the title. */
  icon: PropTypes.node,
  /** Action elements (close button, etc.). */
  actions: PropTypes.node,
  /** Modal size (affects title size). */
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl', 'full']),
  /** Text alignment. */
  align: PropTypes.oneOf(['left', 'center', 'right']),
  /** Whether to show a bottom border divider. */
  divider: PropTypes.bool,
  /** Makes the header sticky at the top. */
  sticky: PropTypes.bool,
  /** Disables interactions. */
  disabled: PropTypes.bool,
  /** Shows loading state. */
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
  /** Additional content (rendered below subtitle). */
  children: PropTypes.node,
};

export default ModalHeader;