/**
 * KisanO Design System — Tooltip Package
 * Tooltip
 *
 * The main Tooltip component that orchestrates all tooltip subcomponents.
 * Provides a convenient API for rendering tooltips with triggers, content,
 * positioning, and loading states.
 *
 * Single Responsibility: Orchestrate Tooltip subcomponents.
 * Does not contain business logic, helper functions, or duplicate styling.
 *
 * @module components/ui/Tooltip/Tooltip
 */

import { forwardRef, memo, useMemo, useState, useCallback } from 'react';
import PropTypes from 'prop-types';

import {
  TOOLTIP_DEFAULTS,
} from './tooltipVariants';
import {
  mergeClasses,
  resolveDefaultProps,
} from './tooltipUtils';

import TooltipContainer from './TooltipContainer';
import TooltipTrigger from './TooltipTrigger';
import TooltipContent from './TooltipContent';
import TooltipArrow from './TooltipArrow';
import TooltipLoader from './TooltipLoader';
import TooltipPortal from './TooltipPortal';

/* ---------------------------------- */
/* Component                          */
/* ---------------------------------- */

/**
 * Tooltip – the main tooltip component with trigger and content.
 *
 * @component
 * @example
 * <Tooltip content="This is a tooltip" position="top">
 *   <Button>Hover me</Button>
 * </Tooltip>
 *
 * @example
 * <Tooltip
 *   content="Loading..."
 *   loading
 *   position="right"
 *   variant="primary"
 * >
 *   <IconButton icon={<InfoIcon />} />
 * </Tooltip>
 */
const Tooltip = memo(
  forwardRef(function Tooltip(
    {
      children,
      content,
      open: controlledOpen,
      onOpenChange,
      variant = TOOLTIP_DEFAULTS.variant,
      size = TOOLTIP_DEFAULTS.size,
      radius = TOOLTIP_DEFAULTS.radius,
      shadow = TOOLTIP_DEFAULTS.shadow,
      position = TOOLTIP_DEFAULTS.position,
      arrow = TOOLTIP_DEFAULTS.arrow,
      arrowSize = TOOLTIP_DEFAULTS.arrowSize,
      trigger = 'hover',
      delay = TOOLTIP_DEFAULTS.delay,
      closeDelay = TOOLTIP_DEFAULTS.closeDelay,
      disabled = false,
      loading = false,
      animation = TOOLTIP_DEFAULTS.animation,
      portal = true,
      portalContainerId = 'tooltip-portal',
      responsive,
      className = '',
      contentClassName = '',
      arrowClassName = '',
      loaderProps,
      triggerProps,
      containerProps,
      role = 'tooltip',
      'aria-label': ariaLabel,
      ...rest
    },
    ref,
  ) {
    const [internalOpen, setInternalOpen] = useState(false);

    // Determine if controlled or uncontrolled.
    const isControlled = controlledOpen !== undefined;
    const open = isControlled ? controlledOpen : internalOpen;

    // Handle open state change.
    const handleOpenChange = useCallback(
      (newOpen) => {
        if (!isControlled) {
          setInternalOpen(newOpen);
        }
        onOpenChange?.(newOpen);
      },
      [isControlled, onOpenChange],
    );

    // Resolve defaults.
    const resolved = useMemo(
      () =>
        resolveDefaultProps({
          variant,
          size,
          radius,
          shadow,
          position,
          arrowSize,
          arrow,
          delay,
          closeDelay,
          disabled,
          animation,
        }),
      [
        variant,
        size,
        radius,
        shadow,
        position,
        arrowSize,
        arrow,
        delay,
        closeDelay,
        disabled,
        animation,
      ],
    );

    // Determine if loading.
    const isLoading = loading;

    // Determine if interactive.
    const isInteractive = !resolved.disabled && !isLoading;

    // Trigger props.
    const triggerPropsMerged = useMemo(
      () => ({
        onOpenChange: handleOpenChange,
        trigger,
        delay: resolved.delay,
        closeDelay: resolved.closeDelay,
        disabled: resolved.disabled,
        interactive: isInteractive,
        responsive,
        ...triggerProps,
      }),
      [
        handleOpenChange,
        trigger,
        resolved.delay,
        resolved.closeDelay,
        resolved.disabled,
        isInteractive,
        responsive,
        triggerProps,
      ],
    );

    // Container props.
    const containerPropsMerged = useMemo(
      () => ({
        content: isLoading ? null : content,
        open,
        onOpenChange: handleOpenChange,
        variant: resolved.variant,
        size: resolved.size,
        radius: resolved.radius,
        shadow: resolved.shadow,
        position: resolved.position,
        arrow: resolved.arrow,
        arrowSize: resolved.arrowSize,
        delay: resolved.delay,
        closeDelay: resolved.closeDelay,
        disabled: resolved.disabled,
        animation: resolved.animation,
        responsive,
        contentClassName,
        arrowClassName,
        role,
        'aria-label': ariaLabel,
        ...containerProps,
      }),
      [
        isLoading,
        content,
        open,
        handleOpenChange,
        resolved,
        responsive,
        contentClassName,
        arrowClassName,
        role,
        ariaLabel,
        containerProps,
      ],
    );

    // Content props.
    const contentProps = useMemo(
  () => ({
    size: resolved.size,
    disabled: resolved.disabled,
    responsive,
  }),
  [resolved.size, resolved.disabled, responsive],
);

    // Arrow props.
    const arrowProps = useMemo(
  () => ({
    position: resolved.position,
    size: resolved.arrowSize,
    variant: resolved.variant,
    disabled: resolved.disabled,
    responsive,
  }),
  [
    resolved.position,
    resolved.arrowSize,
    resolved.variant,
    resolved.disabled,
    responsive,
  ],
);

    // Loader props.
    const loaderPropsMerged = useMemo(
      () => ({
        size: resolved.size,
        variant: 'shimmer',
        animated: resolved.animation,
        rows: 2,
        disabled: resolved.disabled,
        responsive,
        ...loaderProps,
      }),
      [resolved.size, resolved.animation, resolved.disabled, responsive, loaderProps],
    );

    // Combine ref with container ref.
    const combinedRef = useCallback(
      (node) => {
        if (typeof ref === 'function') ref(node);
        else if (ref) ref.current = node;
      },
      [ref],
    );

    // Render tooltip content.
    const renderTooltipContent =  useCallback(() => {
      // If loading, show loader.
      if (isLoading) {
        return <TooltipLoader {...loaderPropsMerged} />;
      }

      // If no content, return null.
      if (!content) {
        return null;
      }

      return (
        <>
          <TooltipContent {...contentProps}>{content}</TooltipContent>
          {resolved.arrow && <TooltipArrow {...arrowProps} />}
        </>
      );
    }, [
  isLoading,
  content,
  resolved.arrow,
  loaderPropsMerged,
  contentProps,
  arrowProps,
]);

    // Determine if we should use portal.
    const TooltipWrapper = portal ? TooltipPortal : TooltipContainer;

    // Portal props.
    const portalProps = portal
      ? {
          open,
          containerId: portalContainerId,
          disabled: resolved.disabled,
          animated: resolved.animation,
          responsive,
          className: mergeClasses('pointer-events-none', className),
          role,
          'aria-label': ariaLabel,
        }
      : {};

    // Container props for non-portal mode.
    const containerPropsForWrapper = portal
      ? {}
      : {
          ...containerPropsMerged,
          ref: combinedRef,
          ...rest,
        };

    // If using portal, wrap container inside portal.
    if (portal) {
      return (
        <TooltipTrigger {...triggerPropsMerged}>
          {children}
          <TooltipPortal {...portalProps}>
            <TooltipContainer
              {...containerPropsMerged}
              ref={combinedRef}
              {...rest}
            >
              {renderTooltipContent()}
            </TooltipContainer>
          </TooltipPortal>
        </TooltipTrigger>
      );
    }

    // Without portal, use container directly.
    return (
      <TooltipContainer
        {...containerPropsForWrapper}
        ref={combinedRef}
      >
        <TooltipTrigger {...triggerPropsMerged}>
          {children}
        </TooltipTrigger>
        {renderTooltipContent()}
      </TooltipContainer>
    );
  }),
);

Tooltip.displayName = 'Tooltip';

Tooltip.propTypes = {
  /** The trigger element (button, icon, text, etc.). */
  children: PropTypes.node.isRequired,
  /** Tooltip content. */
  content: PropTypes.node,
  /** Controlled open state. */
  open: PropTypes.bool,
  /** Callback when open state changes. */
  onOpenChange: PropTypes.func,
  /** Visual variant. */
  variant: PropTypes.oneOf(['default', 'light', 'primary', 'success', 'warning', 'error', 'info']),
  /** Size preset. */
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
  /** Border radius override. */
  radius: PropTypes.oneOf(['none', 'sm', 'md', 'lg', 'xl', 'full']),
  /** Shadow level. */
  shadow: PropTypes.oneOf(['none', 'sm', 'md', 'lg', 'xl', '2xl']),
  /** Tooltip position. */
  position: PropTypes.oneOf([
    'top',
    'top-start',
    'top-end',
    'bottom',
    'bottom-start',
    'bottom-end',
    'left',
    'left-start',
    'left-end',
    'right',
    'right-start',
    'right-end',
  ]),
  /** Whether to show the arrow. */
  arrow: PropTypes.bool,
  /** Arrow size. */
  arrowSize: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
  /** Interaction trigger type(s). */
  trigger: PropTypes.oneOfType([
    PropTypes.oneOf(['hover', 'focus', 'click']),
    PropTypes.arrayOf(PropTypes.oneOf(['hover', 'focus', 'click'])),
  ]),
  /** Delay before opening (ms). */
  delay: PropTypes.number,
  /** Delay before closing (ms). */
  closeDelay: PropTypes.number,
  /** Disables the tooltip. */
  disabled: PropTypes.bool,
  /** Shows loading state. */
  loading: PropTypes.bool,
  /** Whether animation is enabled. */
  animation: PropTypes.bool,
  /** Whether to render tooltip in a portal. */
  portal: PropTypes.bool,
  /** Portal container ID. */
  portalContainerId: PropTypes.string,
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
  /** Additional CSS classes for the content. */
  contentClassName: PropTypes.string,
  /** Additional CSS classes for the arrow. */
  arrowClassName: PropTypes.string,
  /** Additional props for TooltipLoader. */
  loaderProps: PropTypes.object,
  /** Additional props for TooltipTrigger. */
  triggerProps: PropTypes.object,
  /** Additional props for TooltipContainer. */
  containerProps: PropTypes.object,
  /** ARIA role. */
  role: PropTypes.string,
  /** Accessible label. */
  'aria-label': PropTypes.string,
};

export default Tooltip;