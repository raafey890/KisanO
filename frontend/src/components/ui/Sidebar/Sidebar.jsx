/**
 * KisanO Design System — Sidebar Package
 * Sidebar
 *
 * The main Sidebar component that orchestrates all sidebar subcomponents.
 * Provides a convenient API for rendering collapsible navigation with
 * header, content, footer, and nested navigation support.
 *
 * Single Responsibility: Orchestrate Sidebar subcomponents.
 * Does not contain business logic, helper functions, or duplicate styling.
 *
 * @module components/ui/Sidebar/Sidebar
 */

import { forwardRef, memo, useMemo, useState, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';

import {
  SIDEBAR_DEFAULTS,
} from './sidebarVariants';
import {
  mergeClasses,
  resolveResponsiveClasses,
  resolveDefaultProps,
} from './sidebarUtils';

import SidebarContainer from './SidebarContainer';
import SidebarHeader from './SidebarHeader';
import SidebarContent from './SidebarContent';
import SidebarItem from './SidebarItem';
import SidebarGroup from './SidebarGroup';
import SidebarFooter from './SidebarFooter';
import SidebarToggle from './SidebarToggle';
import SidebarLoader from './SidebarLoader';

/* ---------------------------------- */
/* Component                          */
/* ---------------------------------- */

/**
 * Sidebar – the main navigation sidebar component.
 *
 * @component
 * @example
 * <Sidebar
 *   header={<SidebarHeader>Logo</SidebarHeader>}
 *   items={[
 *     { label: 'Dashboard', icon: <DashboardIcon />, href: '/' },
 *     { label: 'Users', icon: <UsersIcon />, href: '/users' },
 *   ]}
 *   footer={<SidebarFooter>Profile</SidebarFooter>}
 * />
 *
 * @example
 * <Sidebar
 *   collapsible
 *   defaultCollapsed={false}
 *   items={items}
 *   position="left"
 * />
 */
const Sidebar = memo(
  forwardRef(function Sidebar(
    {
      children,
      header,
      content,
      footer,
      items = [],
      groups = [],
      toggle,
      variant = SIDEBAR_DEFAULTS.variant,
      size = SIDEBAR_DEFAULTS.size,
      width = SIDEBAR_DEFAULTS.width,
      shadow = SIDEBAR_DEFAULTS.shadow,
      position = SIDEBAR_DEFAULTS.position,
      collapsible = true,
      collapsed: controlledCollapsed,
      defaultCollapsed = false,
      onCollapseChange,
      open: controlledOpen,
      defaultOpen = true,
      onOpenChange,
      loading = false,
      responsive,
      className = '',
      headerProps,
      contentProps,
      footerProps,
      itemProps,
      groupProps,
      toggleProps,
      containerProps,
      loaderProps,
      ...rest
    },
    ref,
  ) {
    // Internal state for uncontrolled mode.
    const [internalCollapsed, setInternalCollapsed] = useState(defaultCollapsed);
    const [internalOpen, setInternalOpen] = useState(defaultOpen);

    // Determine if controlled or uncontrolled.
    const isCollapsedControlled = controlledCollapsed !== undefined;
    const collapsed = isCollapsedControlled ? controlledCollapsed : internalCollapsed;

    const isOpenControlled = controlledOpen !== undefined;
    const open = isOpenControlled ? controlledOpen : internalOpen;

    // Handle collapse change.
    const handleCollapseChange = useCallback(
      (newCollapsed) => {
        if (!isCollapsedControlled) {
          setInternalCollapsed(newCollapsed);
        }
        onCollapseChange?.(newCollapsed);
      },
      [isCollapsedControlled, onCollapseChange],
    );

    // Handle open change.
    const handleOpenChange = useCallback(
      (newOpen) => {
        if (!isOpenControlled) {
          setInternalOpen(newOpen);
        }
        onOpenChange?.(newOpen);
      },
      [isOpenControlled, onOpenChange],
    );

    // Handle toggle.
    const handleToggle = useCallback(() => {
      if (collapsible) {
        handleCollapseChange(!collapsed);
      } else {
        handleOpenChange(!open);
      }
    }, [collapsible, collapsed, open, handleCollapseChange, handleOpenChange]);

    // Resolve defaults.
    const resolved = useMemo(
      () =>
        resolveDefaultProps({
          variant,
          size,
          width,
          shadow,
          position,
          collapsed,
          open,
        }),
      [variant, size, width, shadow, position, collapsed, open],
    );

    // Determine effective collapsed state.
    const isCollapsed = resolved.collapsed && collapsible;

    // Container props.
    const containerPropsMerged = useMemo(
      () => ({
        variant: resolved.variant,
        size: resolved.size,
        width: resolved.width,
        shadow: resolved.shadow,
        position: resolved.position,
        collapsed: isCollapsed,
        open: resolved.open,
        className,
        ...containerProps,
        ...rest,
      }),
      [
        resolved.variant,
        resolved.size,
        resolved.width,
        resolved.shadow,
        resolved.position,
        isCollapsed,
        resolved.open,
        className,
        containerProps,
        rest,
      ],
    );

    // Header props.
    const headerPropsMerged = useMemo(
      () => ({
        size: resolved.size,
        collapsed: isCollapsed,
        className: '',
        ...headerProps,
      }),
      [resolved.size, isCollapsed, headerProps],
    );

    // Content props.
    const contentPropsMerged = useMemo(
      () => ({
        size: resolved.size,
        collapsed: isCollapsed,
        className: '',
        ...contentProps,
      }),
      [resolved.size, isCollapsed, contentProps],
    );

    // Footer props.
    const footerPropsMerged = useMemo(
      () => ({
        size: resolved.size,
        collapsed: isCollapsed,
        className: '',
        ...footerProps,
      }),
      [resolved.size, isCollapsed, footerProps],
    );

    // Toggle props.
    const togglePropsMerged = useMemo(
      () => ({
        size: resolved.size,
        collapsed: isCollapsed,
        disabled: loading,
        onClick: handleToggle,
        className: '',
        ...toggleProps,
      }),
      [resolved.size, isCollapsed, loading, handleToggle, toggleProps],
    );

    // Loader props.
    const loaderPropsMerged = useMemo(
      () => ({
        size: resolved.size,
        variant: 'shimmer',
        items: 4,
        groups: 2,
        disabled: loading,
        ...loaderProps,
      }),
      [resolved.size, loading, loaderProps],
    );

    // Render header.
    const renderHeader = useMemo(() => {
      if (header) return header;
      return <SidebarHeader {...headerPropsMerged} />;
    }, [header, headerPropsMerged]);

    // Render content.
    const renderContent = useMemo(() => {
      if (content) return content;
      if (groups.length > 0 || items.length > 0) {
        return (
          <SidebarContent {...contentPropsMerged}>
            {groups.map((group, index) => (
              <SidebarGroup
                key={index}
                label={group.label}
                icon={group.icon}
                collapsed={isCollapsed}
                {...groupProps}
              >
                {group.items.map((item, itemIndex) => (
                  <SidebarItem
                    key={itemIndex}
                    label={item.label}
                    icon={item.icon}
                    href={item.href}
                    active={item.active}
                    disabled={item.disabled}
                    badge={item.badge}
                    collapsed={isCollapsed}
                    onClick={item.onClick}
                    {...itemProps}
                  />
                ))}
              </SidebarGroup>
            ))}
            {items.map((item, index) => (
              <SidebarItem
                key={index}
                label={item.label}
                icon={item.icon}
                href={item.href}
                active={item.active}
                disabled={item.disabled}
                badge={item.badge}
                collapsed={isCollapsed}
                onClick={item.onClick}
                {...itemProps}
              />
            ))}
          </SidebarContent>
        );
      }
      return null;
    }, [content, groups, items, isCollapsed, contentPropsMerged, groupProps, itemProps]);

    // Render footer.
    const renderFooter = useMemo(() => {
      if (footer) return footer;
      return <SidebarFooter {...footerPropsMerged} />;
    }, [footer, footerPropsMerged]);

    // Render toggle.
    const renderToggle = useMemo(() => {
      if (toggle) return toggle;
      return <SidebarToggle {...togglePropsMerged} />;
    }, [toggle, togglePropsMerged]);

    // Show loader.
    const showLoader = loading;

    return (
      <SidebarContainer ref={ref} {...containerPropsMerged}>
        {/* Header */}
        {renderHeader}

        {/* Toggle (if collapsible) */}
        {collapsible && renderToggle}

        {/* Content or Loader */}
        {showLoader ? (
          <SidebarLoader {...loaderPropsMerged} />
        ) : (
          renderContent
        )}

        {/* Footer */}
        {renderFooter}

        {children}
      </SidebarContainer>
    );
  }),
);

Sidebar.displayName = 'Sidebar';

Sidebar.propTypes = {
  /** Sidebar children. */
  children: PropTypes.node,
  /** Header element. */
  header: PropTypes.node,
  /** Content element. */
  content: PropTypes.node,
  /** Footer element. */
  footer: PropTypes.node,
  /** Menu items array. */
  items: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.node,
      icon: PropTypes.node,
      href: PropTypes.string,
      active: PropTypes.bool,
      disabled: PropTypes.bool,
      badge: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.node]),
      onClick: PropTypes.func,
    }),
  ),
  /** Menu groups array. */
  groups: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.node,
      icon: PropTypes.node,
      items: PropTypes.array,
    }),
  ),
  /** Toggle element. */
  toggle: PropTypes.node,
  /** Visual variant. */
  variant: PropTypes.oneOf(['default', 'dark', 'primary', 'transparent', 'glass', 'gradient']),
  /** Size preset. */
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
  /** Width preset. */
  width: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl', 'full', 'collapsed']),
  /** Shadow level. */
  shadow: PropTypes.oneOf(['none', 'sm', 'md', 'lg', 'xl', '2xl']),
  /** Position. */
  position: PropTypes.oneOf(['left', 'right']),
  /** Whether sidebar is collapsible. */
  collapsible: PropTypes.bool,
  /** Controlled collapsed state. */
  collapsed: PropTypes.bool,
  /** Default collapsed state for uncontrolled mode. */
  defaultCollapsed: PropTypes.bool,
  /** Callback when collapse state changes. */
  onCollapseChange: PropTypes.func,
  /** Controlled open state. */
  open: PropTypes.bool,
  /** Default open state for uncontrolled mode. */
  defaultOpen: PropTypes.bool,
  /** Callback when open state changes. */
  onOpenChange: PropTypes.func,
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
  /** Additional props for SidebarHeader. */
  headerProps: PropTypes.object,
  /** Additional props for SidebarContent. */
  contentProps: PropTypes.object,
  /** Additional props for SidebarFooter. */
  footerProps: PropTypes.object,
  /** Additional props for SidebarItem. */
  itemProps: PropTypes.object,
  /** Additional props for SidebarGroup. */
  groupProps: PropTypes.object,
  /** Additional props for SidebarToggle. */
  toggleProps: PropTypes.object,
  /** Additional props for SidebarContainer. */
  containerProps: PropTypes.object,
  /** Additional props for SidebarLoader. */
  loaderProps: PropTypes.object,
};

export default Sidebar;