/**
 * KisanO Design System — Sidebar Package
 * Sidebar
 *
 * The main Sidebar component that orchestrates all sidebar subcomponents.
 * Provides a convenient API for rendering collapsible navigation with
 * header, content, footer, and nested navigation support.
 *
 * @module components/ui/Sidebar/Sidebar
 */

import { forwardRef, memo, useMemo, useState, useCallback, useRef, useEffect } from 'react';
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
    // Internal state for uncontrolled mode
    const [internalCollapsed, setInternalCollapsed] = useState(defaultCollapsed);
    const [internalOpen, setInternalOpen] = useState(defaultOpen);

    // Determine if controlled or uncontrolled
    const isCollapsedControlled = controlledCollapsed !== undefined;
    const collapsed = isCollapsedControlled ? controlledCollapsed : internalCollapsed;

    const isOpenControlled = controlledOpen !== undefined;
    const open = isOpenControlled ? controlledOpen : internalOpen;

    // Store callbacks in refs to prevent dependency loops
    const onCollapseChangeRef = useRef(onCollapseChange);
    const onOpenChangeRef = useRef(onOpenChange);
    
    useEffect(() => {
      onCollapseChangeRef.current = onCollapseChange;
      onOpenChangeRef.current = onOpenChange;
    }, [onCollapseChange, onOpenChange]);

    // ✅ Fixed: Use functional updates for state setters
    // This avoids needing 'collapsed' and 'open' in dependencies
    const handleCollapseChange = useCallback(() => {
      if (isCollapsedControlled) {
        // If controlled, call the callback with the new value
        const newValue = !controlledCollapsed;
        onCollapseChangeRef.current?.(newValue);
      } else {
        // If uncontrolled, use functional update
        setInternalCollapsed((prev) => {
          const newValue = !prev;
          onCollapseChangeRef.current?.(newValue);
          return newValue;
        });
      }
    }, [isCollapsedControlled, controlledCollapsed]);

    const handleOpenChange = useCallback(() => {
      if (isOpenControlled) {
        const newValue = !controlledOpen;
        onOpenChangeRef.current?.(newValue);
      } else {
        setInternalOpen((prev) => {
          const newValue = !prev;
          onOpenChangeRef.current?.(newValue);
          return newValue;
        });
      }
    }, [isOpenControlled, controlledOpen]);

    // ✅ Fixed: handleToggle now has NO dependencies that change
    const handleToggle = useCallback(() => {
      if (collapsible) {
        handleCollapseChange();
      } else {
        handleOpenChange();
      }
    }, [collapsible, handleCollapseChange, handleOpenChange]);

    // Resolve defaults
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

    // Determine if sidebar is open (for rendering)
    const isOpen = resolved.open;

    // Determine if sidebar is collapsed (for width)
    const isCollapsed = resolved.collapsed && collapsible;

    // Container props
    const containerPropsMerged = useMemo(
      () => ({
        variant: resolved.variant,
        size: resolved.size,
        width: resolved.width,
        shadow: resolved.shadow,
        position: resolved.position,
        collapsed: isCollapsed,
        open: isOpen,
        className,
        ...containerProps,
        // ✅ Don't spread rest here - it contains callback props that cause loops
      }),
      [
        resolved.variant,
        resolved.size,
        resolved.width,
        resolved.shadow,
        resolved.position,
        isCollapsed,
        isOpen,
        className,
        containerProps,
      ],
    );

    // Header props
    const headerPropsMerged = useMemo(
      () => ({
        size: resolved.size,
        collapsed: isCollapsed,
        className: '',
        ...headerProps,
      }),
      [resolved.size, isCollapsed, headerProps],
    );

    // Content props
    const contentPropsMerged = useMemo(
      () => ({
        size: resolved.size,
        collapsed: isCollapsed,
        className: '',
        ...contentProps,
      }),
      [resolved.size, isCollapsed, contentProps],
    );

    // Footer props
    const footerPropsMerged = useMemo(
      () => ({
        size: resolved.size,
        collapsed: isCollapsed,
        className: '',
        ...footerProps,
      }),
      [resolved.size, isCollapsed, footerProps],
    );

    // Toggle props
    const togglePropsMerged = useMemo(
      () => ({
        size: resolved.size,
        collapsed: isCollapsed,
        disabled: loading,
        onClick: handleToggle,
        className: '',
        ...toggleProps,
      }),
      [resolved.size, isCollapsed, loading, toggleProps],
    );

    // Loader props
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

    // Render header
    const renderHeader = useMemo(() => {
      if (header) return header;
      return <SidebarHeader {...headerPropsMerged} />;
    }, [header, headerPropsMerged]);

    // Render content
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

    // Render footer
    const renderFooter = useMemo(() => {
      if (footer) return footer;
      return <SidebarFooter {...footerPropsMerged} />;
    }, [footer, footerPropsMerged]);

    // Render toggle
    const renderToggle = useMemo(() => {
      if (toggle) return toggle;
      return <SidebarToggle {...togglePropsMerged} />;
    }, [toggle, togglePropsMerged]);

    const showLoader = loading;

    return (
      <SidebarContainer ref={ref} {...containerPropsMerged} {...rest}>
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
  children: PropTypes.node,
  header: PropTypes.node,
  content: PropTypes.node,
  footer: PropTypes.node,
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
  groups: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.node,
      icon: PropTypes.node,
      items: PropTypes.array,
    }),
  ),
  toggle: PropTypes.node,
  variant: PropTypes.oneOf(['default', 'dark', 'primary', 'transparent', 'glass', 'gradient']),
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
  width: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl', 'full', 'collapsed']),
  shadow: PropTypes.oneOf(['none', 'sm', 'md', 'lg', 'xl', '2xl']),
  position: PropTypes.oneOf(['left', 'right']),
  collapsible: PropTypes.bool,
  collapsed: PropTypes.bool,
  defaultCollapsed: PropTypes.bool,
  onCollapseChange: PropTypes.func,
  open: PropTypes.bool,
  defaultOpen: PropTypes.bool,
  onOpenChange: PropTypes.func,
  loading: PropTypes.bool,
  responsive: PropTypes.shape({
    xs: PropTypes.string,
    sm: PropTypes.string,
    md: PropTypes.string,
    lg: PropTypes.string,
    xl: PropTypes.string,
  }),
  className: PropTypes.string,
  headerProps: PropTypes.object,
  contentProps: PropTypes.object,
  footerProps: PropTypes.object,
  itemProps: PropTypes.object,
  groupProps: PropTypes.object,
  toggleProps: PropTypes.object,
  containerProps: PropTypes.object,
  loaderProps: PropTypes.object,
};

export default Sidebar;