/**
 * KisanO Design System — Dropdown Package
 * Dropdown
 *
 * The main Dropdown component that orchestrates all dropdown subcomponents.
 * Provides a convenient API for rendering dropdowns with triggers, menus,
 * items, and loading states.
 *
 * Single Responsibility: Orchestrate Dropdown subcomponents.
 * Does not contain business logic, helper functions, or duplicate styling.
 *
 * @module components/ui/Dropdown/Dropdown
 */

import { forwardRef, memo, useMemo, useState, useCallback } from 'react';
import PropTypes from 'prop-types';

import {
  DROPDOWN_DEFAULTS,
} from './dropdownVariants';
import {
  resolveDefaultProps,
} from './dropdownUtils';

import DropdownContainer from './DropdownContainer';
import DropdownTrigger from './DropdownTrigger';
import DropdownMenu from './DropdownMenu';
import DropdownPortal from './DropdownPortal';
import DropdownLoader from './DropdownLoader';

/* ---------------------------------- */
/* Component                          */
/* ---------------------------------- */

/**
 * Dropdown – the main dropdown component with trigger and menu.
 *
 * @component
 * @example
 * <Dropdown items={['Option 1', 'Option 2', 'Option 3']}>
 *   <Button>Open Dropdown</Button>
 * </Dropdown>
 *
 * @example
 * <Dropdown
 *   items={[
 *     { label: 'Edit', icon: <EditIcon />, onClick: handleEdit },
 *     { label: 'Delete', variant: 'danger', onClick: handleDelete },
 *   ]}
 *   loading
 *   position="bottom-start"
 * >
 *   <IconButton icon={<MoreIcon />} />
 * </Dropdown>
 */
const Dropdown = memo(
  forwardRef(function Dropdown(
    {
      children,
      items,
      open: controlledOpen,
      defaultOpen = false,
      onOpenChange,
      variant = DROPDOWN_DEFAULTS.variant,
      size = DROPDOWN_DEFAULTS.size,
      radius = DROPDOWN_DEFAULTS.radius,
      shadow = DROPDOWN_DEFAULTS.shadow,
      position = DROPDOWN_DEFAULTS.position,
      animation = DROPDOWN_DEFAULTS.animation,
      closeOnSelect = DROPDOWN_DEFAULTS.closeOnSelect,
      closeOnOutsideClick = DROPDOWN_DEFAULTS.closeOnOutsideClick,
      closeOnEscape = DROPDOWN_DEFAULTS.closeOnEscape,
      disabled = false,
      loading = false,
      portal = true,
      portalContainerId = 'dropdown-portal',
      responsive,
      className = '',
      menuClassName = '',
      triggerProps,
      menuProps,
      loaderProps,
      containerProps,
      ...rest
    },
    ref,
  ) {
    // Internal open state for uncontrolled mode.
    const [internalOpen, setInternalOpen] = useState(defaultOpen);

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
          animation,
          closeOnSelect,
          closeOnOutsideClick,
          closeOnEscape,
          disabled,
          loading,
        }),
      [
        variant,
        size,
        radius,
        shadow,
        position,
        animation,
        closeOnSelect,
        closeOnOutsideClick,
        closeOnEscape,
        disabled,
        loading,
      ],
    );

    // Determine if loading.
    const isLoading = resolved.loading;

    // Determine if interactive.
    

    // Trigger props.
    const triggerPropsMerged = useMemo(
      () => ({
        variant: resolved.variant,
        size: resolved.size,
        disabled: resolved.disabled,
        loading: resolved.loading,
        open,
        onOpenChange: handleOpenChange,
        responsive,
        ...triggerProps,
      }),
      [
        resolved.variant,
        resolved.size,
        resolved.disabled,
        resolved.loading,
        open,
        handleOpenChange,
        responsive,
        triggerProps,
      ],
    );

    // Menu props.
    const menuPropsMerged = useMemo(
      () => ({
        items,
        variant: resolved.variant,
        size: resolved.size,
        radius: resolved.radius,
        shadow: resolved.shadow,
        position: resolved.position,
        animation: resolved.animation,
        closeOnSelect: resolved.closeOnSelect,
        disabled: resolved.disabled,
        loading: resolved.loading,
        open,
        onOpenChange: handleOpenChange,
        responsive,
        className: menuClassName,
        ...menuProps,
      }),
      [
        items,
        resolved.variant,
        resolved.size,
        resolved.radius,
        resolved.shadow,
        resolved.position,
        resolved.animation,
        resolved.closeOnSelect,
        resolved.disabled,
        resolved.loading,
        open,
        handleOpenChange,
        responsive,
        menuClassName,
        menuProps,
      ],
    );

    // Loader props.
    const loaderPropsMerged = useMemo(
      () => ({
        size: resolved.size,
        variant: 'shimmer',
        rows: 3,
        disabled: resolved.disabled,
        responsive,
        ...loaderProps,
      }),
      [resolved.size, resolved.disabled, responsive, loaderProps],
    );

    // Container props.
    const containerPropsMerged = useMemo(
      () => ({
        variant: resolved.variant,
        size: resolved.size,
        disabled: resolved.disabled,
        loading: resolved.loading,
        className,
        ...containerProps,
        ...rest,
      }),
      [
        resolved.variant,
        resolved.size,
        resolved.disabled,
        resolved.loading,
        className,
        containerProps,
        rest,
      ],
    );

    // Combine ref with container ref.
    const combinedRef = useCallback(
      (node) => {
        if (typeof ref === 'function') ref(node);
        else if (ref) ref.current = node;
      },
      [ref],
    );

    // Determine if we should use portal.
    const MenuWrapper = portal ? DropdownPortal : DropdownMenu;

    // Portal props.
    const portalProps = portal
      ? {
          open,
          containerId: portalContainerId,
          disabled: resolved.disabled,
          ...rest,
        }
      : {};

    // Menu props for non-portal mode.
    
    // Render menu content.
    const renderMenuContent = () => {
      if (isLoading) {
        return <DropdownLoader {...loaderPropsMerged} />;
      }
      return <DropdownMenu {...menuPropsMerged} />;
    };

    // If using portal, wrap menu inside portal.
    if (portal) {
      return (
        <DropdownContainer
          ref={combinedRef}
          {...containerPropsMerged}
        >
          <DropdownTrigger {...triggerPropsMerged}>
            {children}
          </DropdownTrigger>
          <DropdownPortal {...portalProps}>
            {renderMenuContent()}
          </DropdownPortal>
        </DropdownContainer>
      );
    }

    // Without portal, use menu directly.
    return (
      <DropdownContainer
        ref={combinedRef}
        {...containerPropsMerged}
      >
        <DropdownTrigger {...triggerPropsMerged}>
          {children}
        </DropdownTrigger>
        {renderMenuContent()}
      </DropdownContainer>
    );
  }),
);

Dropdown.displayName = 'Dropdown';

Dropdown.propTypes = {
  /** The trigger element (button, icon, text, etc.). */
  children: PropTypes.node.isRequired,
  /** Array of dropdown items. */
  items: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.node,
value: PropTypes.any,
icon: PropTypes.node,
variant: PropTypes.oneOf(['default', 'danger', 'success', 'warning']),
disabled: PropTypes.bool,
divider: PropTypes.bool,
onClick: PropTypes.func,
    }),
  ),
  /** Controlled open state. */
  open: PropTypes.bool,
  /** Default open state for uncontrolled mode. */
  defaultOpen: PropTypes.bool,
  /** Callback when open state changes. */
  onOpenChange: PropTypes.func,
  /** Visual variant. */
  variant: PropTypes.oneOf([
    'default',
    'primary',
    'secondary',
    'success',
    'warning',
    'error',
    'ghost',
  ]),
  /** Size preset. */
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
  /** Border radius override. */
  radius: PropTypes.oneOf(['none', 'sm', 'md', 'lg', 'xl', '2xl', 'full']),
  /** Shadow level. */
  shadow: PropTypes.oneOf(['none', 'sm', 'md', 'lg', 'xl', '2xl']),
  /** Dropdown menu position. */
  position: PropTypes.oneOf([
    'bottom',
    'bottom-start',
    'bottom-end',
    'top',
    'top-start',
    'top-end',
    'left',
    'left-start',
    'left-end',
    'right',
    'right-start',
    'right-end',
  ]),
  /** Animation type. */
  animation: PropTypes.oneOf(['fade', 'slide', 'scale', 'slideScale', 'none']),
  /** Close dropdown when an item is selected. */
  closeOnSelect: PropTypes.bool,
  /** Close dropdown when clicking outside. */
  closeOnOutsideClick: PropTypes.bool,
  /** Close dropdown when pressing Escape. */
  closeOnEscape: PropTypes.bool,
  /** Disables the dropdown. */
  disabled: PropTypes.bool,
  /** Shows loading state. */
  loading: PropTypes.bool,
  /** Whether to render menu in a portal. */
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
  /** Additional CSS classes for the menu. */
  menuClassName: PropTypes.string,
  /** Additional props for DropdownTrigger. */
  triggerProps: PropTypes.object,
  /** Additional props for DropdownMenu. */
  menuProps: PropTypes.object,
  /** Additional props for DropdownLoader. */
  loaderProps: PropTypes.object,
  /** Additional props for DropdownContainer. */
  containerProps: PropTypes.object,
};

export default Dropdown;