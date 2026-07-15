/**
 * KisanO Design System — EmptyState Package
 * EmptyState
 *
 * The main EmptyState component that orchestrates all empty state subcomponents.
 * Provides a convenient API for rendering empty states with illustrations,
 * icons, titles, descriptions, and actions.
 *
 * Single Responsibility: Orchestrate EmptyState subcomponents.
 * Does not contain business logic, helper functions, or duplicate styling.
 *
 * @module components/ui/EmptyState/EmptyState
 */

import { forwardRef, memo, useMemo } from 'react';
import PropTypes from 'prop-types';

import {
  EMPTYSTATE_DEFAULTS,
} from './emptyStateVariants';
import {
  mergeClasses,
  resolveResponsiveClasses,
  resolveDefaultProps,
} from './emptyStateUtils';

import EmptyStateContainer from './EmptyStateContainer';
import EmptyStateIcon from './EmptyStateIcon';
import EmptyStateTitle from './EmptyStateTitle';
import EmptyStateDescription from './EmptyStateDescription';
import EmptyStateAction from './EmptyStateAction';
import EmptyStateLoader from './EmptyStateLoader';

/* ---------------------------------- */
/* Default illustration              */
/* ---------------------------------- */

const DEFAULT_ILLUSTRATION = (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-full h-full"
  >
    <circle cx="12" cy="12" r="10" />
    <path d="M8 14s1.5 2 4 2 4-2 4-2" />
    <line x1="9" y1="9" x2="9.01" y2="9" />
    <line x1="15" y1="9" x2="15.01" y2="9" />
  </svg>
);

/* ---------------------------------- */
/* Component                          */
/* ---------------------------------- */

/**
 * EmptyState – the main empty state component.
 *
 * @component
 * @example
 * <EmptyState
 *   title="No Data"
 *   description="No data available at the moment"
 *   action={{ label: 'Add Data', onClick: handleAdd }}
 * />
 *
 * @example
 * <EmptyState
 *   icon={<CustomIcon />}
 *   title="Empty Folder"
 *   description="This folder is empty"
 *   variant="primary"
 *   size="lg"
 * />
 */
const EmptyState = memo(
  forwardRef(function EmptyState(
    {
      children,
      icon,
      illustration,
      title,
      description,
      action,
      secondaryAction,
      variant = EMPTYSTATE_DEFAULTS.variant,
      size = EMPTYSTATE_DEFAULTS.size,
      radius = EMPTYSTATE_DEFAULTS.radius,
      alignment = EMPTYSTATE_DEFAULTS.alignment,
      disabled = false,
      loading = false,
      responsive,
      className = '',
      containerClassName = '',
      iconClassName = '',
      titleClassName = '',
      descriptionClassName = '',
      actionClassName = '',
      containerProps,
      iconProps,
      titleProps,
      descriptionProps,
      actionProps,
      loaderProps,
      ...rest
    },
    ref,
  ) {
    // Resolve defaults.
    const resolved = useMemo(
      () =>
        resolveDefaultProps({
          variant,
          size,
          radius,
          alignment,
          disabled,
          loading,
        }),
      [variant, size, radius, alignment, disabled, loading],
    );

    // Determine if interactive.
    const isInteractive = !resolved.disabled && !resolved.loading;

    // Container props.
    const containerPropsMerged = useMemo(
      () => ({
        variant: resolved.variant,
        size: resolved.size,
        radius: resolved.radius,
        alignment: resolved.alignment,
        disabled: resolved.disabled,
        loading: resolved.loading,
        className: containerClassName,
        ...containerProps,
      }),
      [
        resolved.variant,
        resolved.size,
        resolved.radius,
        resolved.alignment,
        resolved.disabled,
        resolved.loading,
        containerClassName,
        containerProps,
      ],
    );

    // Icon props.
    const iconPropsMerged = useMemo(
      () => ({
        variant: resolved.variant,
        size: resolved.size,
        disabled: resolved.disabled,
        loading: resolved.loading,
        className: iconClassName,
        ...iconProps,
      }),
      [
        resolved.variant,
        resolved.size,
        resolved.disabled,
        resolved.loading,
        iconClassName,
        iconProps,
      ],
    );

    // Title props.
    const titlePropsMerged = useMemo(
      () => ({
        variant: resolved.variant,
        size: resolved.size,
        disabled: resolved.disabled,
        loading: resolved.loading,
        className: titleClassName,
        ...titleProps,
      }),
      [
        resolved.variant,
        resolved.size,
        resolved.disabled,
        resolved.loading,
        titleClassName,
        titleProps,
      ],
    );

    // Description props.
    const descriptionPropsMerged = useMemo(
      () => ({
        variant: resolved.variant,
        size: resolved.size,
        disabled: resolved.disabled,
        loading: resolved.loading,
        className: descriptionClassName,
        ...descriptionProps,
      }),
      [
        resolved.variant,
        resolved.size,
        resolved.disabled,
        resolved.loading,
        descriptionClassName,
        descriptionProps,
      ],
    );

    // Action props.
    const actionPropsMerged = useMemo(
      () => ({
        disabled: resolved.disabled || action?.disabled,
        loading: resolved.loading,
        className: actionClassName,
        ...actionProps,
        ...action,
      }),
      [
        resolved.disabled,
        resolved.loading,
        actionClassName,
        actionProps,
        action,
      ],
    );

    // Secondary action props.
    const secondaryActionPropsMerged = useMemo(
      () => ({
        disabled: resolved.disabled || secondaryAction?.disabled,
        loading: resolved.loading,
        variant: 'outline',
        className: actionClassName,
        ...actionProps,
        ...secondaryAction,
      }),
      [
        resolved.disabled,
        resolved.loading,
        actionClassName,
        actionProps,
        secondaryAction,
      ],
    );

    // Loader props.
    const loaderPropsMerged = useMemo(
      () => ({
        size: resolved.size,
        variant: 'shimmer',
        disabled: resolved.disabled,
        ...loaderProps,
      }),
      [resolved.size, resolved.disabled, loaderProps],
    );

    // Show loader.
    const showLoader = resolved.loading;

    // Render icon or illustration.
    const renderIcon = () => {
      if (icon) {
        return <EmptyStateIcon {...iconPropsMerged}>{icon}</EmptyStateIcon>;
      }
      if (illustration) {
        return <EmptyStateIcon {...iconPropsMerged}>{illustration}</EmptyStateIcon>;
      }
      return <EmptyStateIcon {...iconPropsMerged}>{DEFAULT_ILLUSTRATION}</EmptyStateIcon>;
    };

    // Render content.
    const renderContent = () => {
      if (showLoader) {
        return <EmptyStateLoader {...loaderPropsMerged} />;
      }

      return (
        <>
          {renderIcon()}
          {title && <EmptyStateTitle {...titlePropsMerged}>{title}</EmptyStateTitle>}
          {description && <EmptyStateDescription {...descriptionPropsMerged}>{description}</EmptyStateDescription>}
          {(action || secondaryAction) && (
            <EmptyStateAction
              primaryAction={actionPropsMerged}
              secondaryAction={secondaryActionPropsMerged}
              alignment={resolved.alignment}
              className={actionClassName}
            />
          )}
          {children}
        </>
      );
    };

    return (
      <EmptyStateContainer ref={ref} {...containerPropsMerged} {...rest}>
        {renderContent()}
      </EmptyStateContainer>
    );
  }),
);

EmptyState.displayName = 'EmptyState';

EmptyState.propTypes = {
  /** Empty state children (custom). */
  children: PropTypes.node,
  /** Custom icon element. */
  icon: PropTypes.node,
  /** Custom illustration element. */
  illustration: PropTypes.node,
  /** Title text. */
  title: PropTypes.node,
  /** Description text. */
  description: PropTypes.node,
  /** Primary action configuration. */
  action: PropTypes.shape({
    label: PropTypes.node,
    onClick: PropTypes.func,
    disabled: PropTypes.bool,
    variant: PropTypes.string,
    size: PropTypes.string,
  }),
  /** Secondary action configuration. */
  secondaryAction: PropTypes.shape({
    label: PropTypes.node,
    onClick: PropTypes.func,
    disabled: PropTypes.bool,
    variant: PropTypes.string,
    size: PropTypes.string,
  }),
  /** Visual variant. */
  variant: PropTypes.oneOf([
    'default',
    'subtle',
    'glass',
    'primary',
    'success',
    'warning',
    'error',
  ]),
  /** Size preset. */
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
  /** Border radius override. */
  radius: PropTypes.oneOf(['none', 'sm', 'md', 'lg', 'xl', '2xl', 'full']),
  /** Content alignment. */
  alignment: PropTypes.oneOf(['left', 'center', 'right']),
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
  /** Additional CSS classes for the container. */
  className: PropTypes.string,
  /** Additional CSS classes for the container wrapper. */
  containerClassName: PropTypes.string,
  /** Additional CSS classes for the icon. */
  iconClassName: PropTypes.string,
  /** Additional CSS classes for the title. */
  titleClassName: PropTypes.string,
  /** Additional CSS classes for the description. */
  descriptionClassName: PropTypes.string,
  /** Additional CSS classes for the action. */
  actionClassName: PropTypes.string,
  /** Additional props for EmptyStateContainer. */
  containerProps: PropTypes.object,
  /** Additional props for EmptyStateIcon. */
  iconProps: PropTypes.object,
  /** Additional props for EmptyStateTitle. */
  titleProps: PropTypes.object,
  /** Additional props for EmptyStateDescription. */
  descriptionProps: PropTypes.object,
  /** Additional props for EmptyStateAction. */
  actionProps: PropTypes.object,
  /** Additional props for EmptyStateLoader. */
  loaderProps: PropTypes.object,
};

export default EmptyState;