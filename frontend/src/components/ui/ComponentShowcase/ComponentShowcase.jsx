/**
 * KisanO Design System — Showcase Package
 * ComponentShowcase
 *
 * The main showcase component that displays all KisanO UI components
 * grouped into organized sections with live previews.
 *
 * Single Responsibility: Display all KisanO components in a showcase.
 * Does not contain business logic or duplicate styling.
 *
 * @module components/ui/Showcase/ComponentShowcase
 */

import { forwardRef, memo, useMemo, useState } from 'react';
import PropTypes from 'prop-types';

import {
  SHOWCASE_DEFAULTS,
} from './showcaseVariants';
import {
  mergeClasses,
  resolveResponsiveClasses,
  resolveDefaultProps,
} from './showcaseUtils';

import ShowcaseContainer from './ShowcaseContainer';
import ShowcaseHeader from './ShowcaseHeader';
import ShowcaseSection from './ShowcaseSection';
import ShowcaseCard from './ShowcaseCard';
import ShowcaseSidebar from './ShowcaseSidebar';
import ShowcaseLoader from './ShowcaseLoader';

// Import all KisanO components
import {
  // Core UI
  Button,
  Input,
  Card,
  CardBody,
  Modal,
  Dialog,
  Drawer,
  Toast,
  Alert,
//   // Forms
  Select,
//   Dropdown,
//   Checkbox,
//   Radio,
//   Switch,
//   Textarea,
//   FileUpload,
//   DatePicker,
//   // Navigation
//   Navbar,
//   Sidebar,
//   Tabs,
//   Accordion,
//   Breadcrumb,
//   Pagination,
//   // Display
//   Badge,
//   Avatar,
//   Progress,
//   Table,
//   Skeleton,
//   EmptyState,
//   Spinner,
//   // Charts
//   Chart,
//   LineChart,
//   BarChart,
//   PieChart,
//   AreaChart,
} from '../index';

/* ---------------------------------- */
/* Component                          */
/* ---------------------------------- */

/**
 * ComponentShowcase – displays all KisanO components.
 *
 * @component
 * @example
 * <ComponentShowcase />
 */
const ComponentShowcase = memo(
  forwardRef(function ComponentShowcase(
    {
      variant = SHOWCASE_DEFAULTS.variant,
      size = SHOWCASE_DEFAULTS.size,
      layout = 'grid',
      showSidebar = true,
      disabled = false,
      loading = false,
      responsive,
      className = '',
      containerClassName = '',
      headerClassName = '',
      sectionClassName = '',
      cardClassName = '',
      sidebarClassName = '',
      containerProps,
      headerProps,
      sectionProps,
      cardProps,
      sidebarProps,
      loaderProps,
      ...rest
    },
    ref,
  ) {
    const [activeSection, setActiveSection] = useState('core');

    // Resolve defaults.
    const resolved = useMemo(
      () =>
        resolveDefaultProps({
          variant,
          size,
          layout,
          disabled,
          loading,
        }),
      [variant, size, layout, disabled, loading],
    );

    // Define showcase sections.
    const sections = useMemo(
      () => ({
        core: {
          label: 'Core UI',
          icon: '🎯',
          components: [
            { name: 'Button', component: <Button variant="primary">Button</Button> },
            { name: 'Input', component: <Input placeholder="Input" /> },
            { name: 'Card', component: <Card><CardBody>Card Content</CardBody></Card> },
            { name: 'Modal', component: <Modal open={false} title="Modal" /> },
            { name: 'Dialog', component: <Dialog open={false} title="Dialog" /> },
            { name: 'Drawer', component: <Drawer open={false} title="Drawer" /> },
            { name: 'Toast', component: <Toast variant="success" message="Toast" /> },
            { name: 'Alert', component: <Alert variant="success">Alert</Alert> },
          ],
        },
        forms: {
          label: 'Forms',
          icon: '📝',
          components: [
            { name: 'Select', component: <Select placeholder="Select" /> },
            // { name: 'Dropdown', component: <Dropdown /> },
            // { name: 'Checkbox', component: <Checkbox label="Checkbox" /> },
            // { name: 'Radio', component: <Radio label="Radio" /> },
            // { name: 'Switch', component: <Switch label="Switch" /> },
            // { name: 'Textarea', component: <Textarea placeholder="Textarea" /> },
            // { name: 'FileUpload', component: <FileUpload label="File Upload" /> },
            // { name: 'DatePicker', component: <DatePicker placeholder="Date" /> },
          ],
        },
        // navigation: {
        //   label: 'Navigation',
        //   icon: '🧭',
        //   components: [
        //     { name: 'Navbar', component: <Navbar brandText="Navbar" /> },
        //     { name: 'Sidebar', component: <Sidebar /> },
        //     { name: 'Tabs', component: <Tabs /> },
        //     { name: 'Accordion', component: <Accordion /> },
        //     { name: 'Breadcrumb', component: <Breadcrumb /> },
        //     { name: 'Pagination', component: <Pagination total={10} /> },
        //   ],
        // },
        // display: {
        //   label: 'Display',
        //   icon: '🖼️',
        //   components: [
        //     { name: 'Badge', component: <Badge>Badge</Badge> },
        //     { name: 'Avatar', component: <Avatar name="User" /> },
        //     { name: 'Progress', component: <Progress value={50} /> },
        //     { name: 'Table', component: <Table /> },
        //     { name: 'Skeleton', component: <Skeleton /> },
        //     { name: 'EmptyState', component: <EmptyState title="Empty" /> },
        //     { name: 'Spinner', component: <Spinner /> },
        //   ],
        // },
        // charts: {
        //   label: 'Charts',
        //   icon: '📊',
        //   components: [
        //     { name: 'LineChart', component: <LineChart /> },
        //     { name: 'BarChart', component: <BarChart /> },
        //     { name: 'PieChart', component: <PieChart /> },
        //     { name: 'AreaChart', component: <AreaChart /> },
        //   ],
        // },
      }),
      [],
    );

    // Container props.
    const containerPropsMerged = useMemo(
      () => ({
        variant: resolved.variant,
        size: resolved.size,
        disabled: resolved.disabled,
        loading: resolved.loading,
        responsive: resolved.responsive,
        className: containerClassName,
        ...containerProps,
      }),
      [
        resolved.variant,
        resolved.size,
        resolved.disabled,
        resolved.loading,
        resolved.responsive,
        containerClassName,
        containerProps,
      ],
    );

    // Header props.
    const headerPropsMerged = useMemo(
      () => ({
        variant: resolved.variant,
        size: resolved.size,
        disabled: resolved.disabled,
        loading: resolved.loading,
        className: headerClassName,
        ...headerProps,
      }),
      [
        resolved.variant,
        resolved.size,
        resolved.disabled,
        resolved.loading,
        headerClassName,
        headerProps,
      ],
    );

    // Section props.
    const sectionPropsMerged = useMemo(
      () => ({
        variant: resolved.variant,
        size: resolved.size,
        disabled: resolved.disabled,
        loading: resolved.loading,
        className: sectionClassName,
        ...sectionProps,
      }),
      [
        resolved.variant,
        resolved.size,
        resolved.disabled,
        resolved.loading,
        sectionClassName,
        sectionProps,
      ],
    );

    // Card props.
    const cardPropsMerged = useMemo(
      () => ({
        variant: resolved.variant,
        size: resolved.size,
        disabled: resolved.disabled,
        loading: resolved.loading,
        className: cardClassName,
        ...cardProps,
      }),
      [
        resolved.variant,
        resolved.size,
        resolved.disabled,
        resolved.loading,
        cardClassName,
        cardProps,
      ],
    );

    // Sidebar props.
    const sidebarPropsMerged = useMemo(
      () => ({
        variant: resolved.variant,
        size: resolved.size,
        disabled: resolved.disabled,
        loading: resolved.loading,
        className: sidebarClassName,
        ...sidebarProps,
      }),
      [
        resolved.variant,
        resolved.size,
        resolved.disabled,
        resolved.loading,
        sidebarClassName,
        sidebarProps,
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

    // Render sections.
    const renderSections = () => {
      if (showLoader) {
        return <ShowcaseLoader {...loaderPropsMerged} />;
      }

      return Object.entries(sections).map(([key, section]) => (
        <ShowcaseSection
          key={key}
          id={key}
          label={section.label}
          icon={section.icon}
          {...sectionPropsMerged}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {section.components.map((item) => (
              <ShowcaseCard
                key={item.name}
                label={item.name}
                {...cardPropsMerged}
              >
                {item.component}
              </ShowcaseCard>
            ))}
          </div>
        </ShowcaseSection>
      ));
    };

    return (
      <ShowcaseContainer ref={ref} {...containerPropsMerged} {...rest}>
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          {showSidebar && (
            <ShowcaseSidebar
              sections={sections}
              activeSection={activeSection}
              onSectionChange={setActiveSection}
              {...sidebarPropsMerged}
            />
          )}

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            <ShowcaseHeader
              title="KisanO Component Showcase"
              subtitle="Explore all available components in the KisanO Design System"
              {...headerPropsMerged}
            />
            {renderSections()}
          </div>
        </div>
      </ShowcaseContainer>
    );
  }),
);

ComponentShowcase.displayName = 'ComponentShowcase';

ComponentShowcase.propTypes = {
  /** Visual variant. */
  variant: PropTypes.oneOf(['default', 'dark', 'glass', 'minimal', 'gradient']),
  /** Size preset. */
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl', 'full']),
  /** Layout type. */
  layout: PropTypes.oneOf(['row', 'column', 'grid', 'carousel', 'masonry']),
  /** Whether to show sidebar. */
  showSidebar: PropTypes.bool,
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
  /** Additional CSS classes for the header. */
  headerClassName: PropTypes.string,
  /** Additional CSS classes for sections. */
  sectionClassName: PropTypes.string,
  /** Additional CSS classes for cards. */
  cardClassName: PropTypes.string,
  /** Additional CSS classes for the sidebar. */
  sidebarClassName: PropTypes.string,
  /** Additional props for ShowcaseContainer. */
  containerProps: PropTypes.object,
  /** Additional props for ShowcaseHeader. */
  headerProps: PropTypes.object,
  /** Additional props for ShowcaseSection. */
  sectionProps: PropTypes.object,
  /** Additional props for ShowcaseCard. */
  cardProps: PropTypes.object,
  /** Additional props for ShowcaseSidebar. */
  sidebarProps: PropTypes.object,
  /** Additional props for ShowcaseLoader. */
  loaderProps: PropTypes.object,
};

export default ComponentShowcase;