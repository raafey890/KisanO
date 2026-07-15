import React, { useState } from 'react';
import { 
  Button,
  Input,
  Card,
  Modal,
  Dialog,
  Drawer,
  Toast,
  Alert,
  Select,
  Dropdown,
  Checkbox,
  Radio,
  Switch,
  Textarea,
  FileUpload,
  DatePicker,
  Navbar,
  Sidebar,
  Tabs,
  Accordion,
  Breadcrumb,
  Pagination,
  Badge,
  Avatar,
  Progress,
  Table,
  Skeleton,
  EmptyState,
  Spinner,
  LineChart,
  BarChart,
  PieChart,
  AreaChart
} from '../index';

/**
 * KisanO Design System - Component Showcase
 * 
 * A comprehensive showcase of all KisanO Design System components.
 * Each component group is organized into separate objects for easy
 * enable/disable during integration.
 * 
 * @version 1.0.0
 * @author KisanO Design System Team
 */

const ComponentShowcase = () => {
  // State for interactive components
  const [modalOpen, setModalOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [toastOpen, setToastOpen] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState('tab1');
  const [accordionOpen, setAccordionOpen] = useState('item1');
  const [currentPage, setCurrentPage] = useState(1);
  const [checkboxChecked, setCheckboxChecked] = useState(false);
  const [radioValue, setRadioValue] = useState('option1');
  const [switchOn, setSwitchOn] = useState(false);
  const [dateValue, setDateValue] = useState(new Date());
  const [fileValue, setFileValue] = useState(null);

  // Sample data for tables and charts
  const tableData = [
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'User' },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'Editor' },
  ];

  const chartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Revenue',
        data: [12, 19, 3, 5, 2, 3],
      },
    ],
  };

  // ============================================================
  // COMPONENT GROUPS
  // Each group contains components that can be individually
  // commented/uncommented during integration
  // ============================================================

  // ============================================================
  // CORE UI COMPONENTS
  // ============================================================

  const coreComponents = {
    name: 'Core UI',
    description: 'Essential building blocks for your interface',
    components: [
      {
        name: 'Button',
        component: (
          <div className="flex flex-wrap gap-4">
            <Button variant="primary">Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="success">Success</Button>
            <Button variant="danger">Danger</Button>
            <Button variant="warning">Warning</Button>
            <Button variant="gradient">Gradient</Button>
            <Button size="sm">Small</Button>
            <Button size="lg">Large</Button>
            <Button loading>Loading</Button>
            <Button disabled>Disabled</Button>
          </div>
        ),
      },
      {
        name: 'Input',
        component: (
          <div className="space-y-4 max-w-md">
            <Input 
              label="Email Address" 
              placeholder="Enter your email" 
              type="email"
              helperText="We'll never share your email"
            />
            <Input 
              label="Password" 
              placeholder="Enter your password" 
              type="password"
              showPasswordToggle
            />
            <Input 
              label="Search" 
              placeholder="Search..." 
              leftIcon={<span>🔍</span>}
            />
            <Input 
              label="With Error" 
              placeholder="Error state" 
              error
              errorMessage="This field is required"
            />
            <Input 
              label="With Success" 
              placeholder="Success state" 
              success
            />
            <Input 
              label="With Warning" 
              placeholder="Warning state" 
              warning
            />
            <Input 
              label="Disabled" 
              placeholder="Disabled input" 
              disabled
            />
          </div>
        ),
      },
      {
        name: 'Card',
        component: (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
            <Card title="Basic Card">
              <p className="text-gray-600">
                This is a basic card with some content. Cards are used to group
                related information and actions.
              </p>
            </Card>
            <Card 
              title="Interactive Card" 
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => alert('Card clicked!')}
            >
              <p className="text-gray-600">
                This card is interactive. Click on it to see the action.
              </p>
            </Card>
            <Card 
              title="Card with Footer" 
              footer={<Button size="sm">Action</Button>}
            >
              <p className="text-gray-600">
                This card has a footer with an action button.
              </p>
            </Card>
            <Card 
              title="Card with Image" 
              className="overflow-hidden"
              image="https://via.placeholder.com/400x200"
            >
              <p className="text-gray-600">
                This card includes an image at the top.
              </p>
            </Card>
          </div>
        ),
      },
      {
        name: 'Modal',
        component: (
          <div className="space-y-4">
            <Button onClick={() => setModalOpen(true)}>Open Modal</Button>
            <Modal
              isOpen={modalOpen}
              onClose={() => setModalOpen(false)}
              title="Modal Title"
              description="This is a modal dialog. It can contain any content."
              actions={
                <>
                  <Button variant="outline" onClick={() => setModalOpen(false)}>
                    Cancel
                  </Button>
                  <Button variant="primary" onClick={() => setModalOpen(false)}>
                    Confirm
                  </Button>
                </>
              }
            >
              <p className="text-gray-600">
                Modals are used to display important information or gather user
                input without navigating away from the current page.
              </p>
            </Modal>
          </div>
        ),
      },
      {
        name: 'Dialog',
        component: (
          <div className="space-y-4">
            <Button variant="danger" onClick={() => setDialogOpen(true)}>
              Open Dialog
            </Button>
            <Dialog
              isOpen={dialogOpen}
              onClose={() => setDialogOpen(false)}
              title="Delete Confirmation"
              description="Are you sure you want to delete this item? This action cannot be undone."
              type="danger"
              actions={
                <>
                  <Button variant="outline" onClick={() => setDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button variant="danger" onClick={() => setDialogOpen(false)}>
                    Delete
                  </Button>
                </>
              }
            />
          </div>
        ),
      },
      {
        name: 'Drawer',
        component: (
          <div className="space-y-4">
            <Button onClick={() => setDrawerOpen(true)}>Open Drawer</Button>
            <Drawer
              isOpen={drawerOpen}
              onClose={() => setDrawerOpen(false)}
              title="Drawer Title"
              position="right"
            >
              <div className="p-4 space-y-4">
                <p className="text-gray-600">
                  Drawers slide in from the side of the screen and contain
                  additional content or navigation.
                </p>
                <Button variant="primary" onClick={() => setDrawerOpen(false)}>
                  Close Drawer
                </Button>
              </div>
            </Drawer>
          </div>
        ),
      },
      {
        name: 'Toast',
        component: (
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <Button variant="success" onClick={() => setToastOpen(true)}>
                Show Success Toast
              </Button>
              <Button variant="danger" onClick={() => setToastOpen(true)}>
                Show Error Toast
              </Button>
              <Button variant="warning" onClick={() => setToastOpen(true)}>
                Show Warning Toast
              </Button>
              <Button variant="primary" onClick={() => setToastOpen(true)}>
                Show Info Toast
              </Button>
            </div>
            <Toast
              isOpen={toastOpen}
              onClose={() => setToastOpen(false)}
              type="success"
              title="Success!"
              description="Your action was completed successfully."
              duration={3000}
            />
          </div>
        ),
      },
      {
        name: 'Alert',
        component: (
          <div className="space-y-4 max-w-2xl">
            <Alert
              type="info"
              title="Information"
              description="This is an informational alert."
              onClose={() => setAlertOpen(false)}
            />
            <Alert
              type="success"
              title="Success"
              description="Your changes have been saved successfully."
            />
            <Alert
              type="warning"
              title="Warning"
              description="Please review your input before submitting."
            />
            <Alert
              type="error"
              title="Error"
              description="There was a problem processing your request."
            />
          </div>
        ),
      },
    ],
  };

  // ============================================================
  // FORM COMPONENTS
  // ============================================================

  const formComponents = {
    name: 'Forms',
    description: 'Form elements for user input and selection',
    components: [
      {
        name: 'Select',
        component: (
          <div className="space-y-4 max-w-md">
            <Select
              label="Select an option"
              options={[
                { label: 'Option 1', value: 'option1' },
                { label: 'Option 2', value: 'option2' },
                { label: 'Option 3', value: 'option3' },
              ]}
              placeholder="Choose an option"
            />
            <Select
              label="Disabled Select"
              disabled
              options={[
                { label: 'Option 1', value: 'option1' },
                { label: 'Option 2', value: 'option2' },
              ]}
            />
            <Select
              label="Select with Error"
              error
              errorMessage="Please select an option"
              options={[
                { label: 'Option 1', value: 'option1' },
                { label: 'Option 2', value: 'option2' },
              ]}
            />
          </div>
        ),
      },
      {
        name: 'Dropdown',
        component: (
          <div className="space-y-4 max-w-md">
            <Dropdown
              label="Dropdown Menu"
              items={[
                { label: 'Profile', onClick: () => alert('Profile') },
                { label: 'Settings', onClick: () => alert('Settings') },
                { label: 'Logout', onClick: () => alert('Logout') },
              ]}
            >
              <Button>Options</Button>
            </Dropdown>
            <Dropdown
              label="Dropdown with Icons"
              items={[
                { label: '📧 Email', onClick: () => alert('Email') },
                { label: '📱 Phone', onClick: () => alert('Phone') },
                { label: '💬 Chat', onClick: () => alert('Chat') },
              ]}
            >
              <Button variant="outline">Contact</Button>
            </Dropdown>
          </div>
        ),
      },
      {
        name: 'Checkbox',
        component: (
          <div className="space-y-4">
            <Checkbox
              label="Accept terms and conditions"
              checked={checkboxChecked}
              onChange={() => setCheckboxChecked(!checkboxChecked)}
            />
            <Checkbox
              label="Disabled checkbox"
              disabled
              checked={false}
            />
            <Checkbox
              label="Checked and disabled"
              disabled
              checked={true}
            />
          </div>
        ),
      },
      {
        name: 'Radio',
        component: (
          <div className="space-y-4">
            <Radio
              label="Option 1"
              name="radio-group"
              value="option1"
              checked={radioValue === 'option1'}
              onChange={(e) => setRadioValue(e.target.value)}
            />
            <Radio
              label="Option 2"
              name="radio-group"
              value="option2"
              checked={radioValue === 'option2'}
              onChange={(e) => setRadioValue(e.target.value)}
            />
            <Radio
              label="Option 3"
              name="radio-group"
              value="option3"
              checked={radioValue === 'option3'}
              onChange={(e) => setRadioValue(e.target.value)}
            />
            <Radio
              label="Disabled option"
              name="radio-group"
              value="option4"
              disabled
            />
          </div>
        ),
      },
      {
        name: 'Switch',
        component: (
          <div className="space-y-4">
            <Switch
              label="Enable notifications"
              checked={switchOn}
              onChange={() => setSwitchOn(!switchOn)}
            />
            <Switch
              label="Dark mode"
              checked={false}
              onChange={() => {}}
            />
            <Switch
              label="Disabled switch"
              disabled
              checked={true}
            />
          </div>
        ),
      },
      {
        name: 'Textarea',
        component: (
          <div className="space-y-4 max-w-md">
            <Textarea
              label="Message"
              placeholder="Enter your message here..."
              rows={4}
            />
            <Textarea
              label="With Error"
              placeholder="Error state"
              error
              errorMessage="Please enter a valid message"
            />
            <Textarea
              label="Disabled"
              placeholder="Disabled textarea"
              disabled
              value="This textarea is disabled"
            />
          </div>
        ),
      },
      {
        name: 'FileUpload',
        component: (
          <div className="space-y-4 max-w-md">
            <FileUpload
              label="Upload File"
              onChange={(files) => setFileValue(files[0])}
              accept=".jpg,.png,.pdf"
            />
            <FileUpload
              label="Multiple Files"
              multiple
              onChange={(files) => setFileValue(files)}
            />
            <FileUpload
              label="Disabled"
              disabled
            />
          </div>
        ),
      },
      {
        name: 'DatePicker',
        component: (
          <div className="space-y-4 max-w-md">
            <DatePicker
              label="Select Date"
              value={dateValue}
              onChange={(date) => setDateValue(date)}
            />
            <DatePicker
              label="Date with Range"
              type="range"
            />
            <DatePicker
              label="Disabled"
              disabled
              value={new Date()}
            />
          </div>
        ),
      },
    ],
  };

  // ============================================================
  // NAVIGATION COMPONENTS
  // ============================================================

  const navigationComponents = {
    name: 'Navigation',
    description: 'Navigation components for structuring your application',
    components: [
      {
        name: 'Navbar',
        component: (
          <Navbar
            brand={<span className="font-bold text-lg">KisanO</span>}
            links={[
              { label: 'Home', href: '#' },
              { label: 'About', href: '#' },
              { label: 'Services', href: '#' },
              { label: 'Contact', href: '#' },
            ]}
            rightContent={
              <div className="flex items-center gap-4">
                <Button size="sm" variant="outline">Login</Button>
                <Button size="sm" variant="primary">Sign Up</Button>
              </div>
            }
          />
        ),
      },
      {
        name: 'Sidebar',
        component: (
          <div className="flex h-64 border rounded-lg overflow-hidden">
            <Sidebar
              items={[
                { label: 'Dashboard', icon: '📊', active: true },
                { label: 'Users', icon: '👥' },
                { label: 'Settings', icon: '⚙️' },
                { label: 'Reports', icon: '📈' },
              ]}
              className="w-48 bg-gray-50"
            />
            <div className="flex-1 p-4 bg-white">
              <h3 className="font-medium">Sidebar Content</h3>
              <p className="text-sm text-gray-600 mt-2">
                Click on sidebar items to navigate.
              </p>
            </div>
          </div>
        ),
      },
      {
        name: 'Tabs',
        component: (
          <div className="max-w-2xl">
            <Tabs
              tabs={[
                { id: 'tab1', label: 'Tab 1' },
                { id: 'tab2', label: 'Tab 2' },
                { id: 'tab3', label: 'Tab 3' },
              ]}
              activeTab={selectedTab}
              onChange={(id) => setSelectedTab(id)}
            >
              <div className="p-4 bg-white rounded-b-lg border border-t-0">
                <p>Content for Tab 1</p>
              </div>
              <div className="p-4 bg-white rounded-b-lg border border-t-0">
                <p>Content for Tab 2</p>
              </div>
              <div className="p-4 bg-white rounded-b-lg border border-t-0">
                <p>Content for Tab 3</p>
              </div>
            </Tabs>
          </div>
        ),
      },
      {
        name: 'Accordion',
        component: (
          <div className="max-w-2xl">
            <Accordion
              items={[
                {
                  id: 'item1',
                  title: 'What is KisanO?',
                  content: 'KisanO is a design system for agricultural applications.',
                },
                {
                  id: 'item2',
                  title: 'How do I get started?',
                  content: 'Install the package and import the components you need.',
                },
                {
                  id: 'item3',
                  title: 'Is it free to use?',
                  content: 'Yes, KisanO is open-source and free to use.',
                },
              ]}
              activeId={accordionOpen}
              onChange={(id) => setAccordionOpen(id)}
            />
          </div>
        ),
      },
      {
        name: 'Breadcrumb',
        component: (
          <Breadcrumb
            items={[
              { label: 'Home', href: '#' },
              { label: 'Products', href: '#' },
              { label: 'Category', href: '#' },
              { label: 'Current Item', active: true },
            ]}
          />
        ),
      },
      {
        name: 'Pagination',
        component: (
          <Pagination
            currentPage={currentPage}
            totalPages={10}
            onPageChange={(page) => setCurrentPage(page)}
            showPreviousNext
            showFirstLast
          />
        ),
      },
    ],
  };

  // ============================================================
  // DISPLAY COMPONENTS
  // ============================================================

  const displayComponents = {
    name: 'Display',
    description: 'Components for displaying information and feedback',
    components: [
      {
        name: 'Badge',
        component: (
          <div className="flex flex-wrap gap-4">
            <Badge>Default</Badge>
            <Badge variant="primary">Primary</Badge>
            <Badge variant="success">Success</Badge>
            <Badge variant="danger">Danger</Badge>
            <Badge variant="warning">Warning</Badge>
            <Badge variant="info">Info</Badge>
            <Badge size="sm">Small</Badge>
            <Badge size="lg">Large</Badge>
            <Badge variant="success" rounded>Rounded</Badge>
          </div>
        ),
      },
      {
        name: 'Avatar',
        component: (
          <div className="flex flex-wrap items-center gap-4">
            <Avatar size="sm" src="https://i.pravatar.cc/40" alt="User" />
            <Avatar size="md" src="https://i.pravatar.cc/80" alt="User" />
            <Avatar size="lg" src="https://i.pravatar.cc/120" alt="User" />
            <Avatar size="xl" src="https://i.pravatar.cc/160" alt="User" />
            <Avatar size="md" initials="JD" />
            <Avatar size="md" initials="AB" variant="success" />
            <Avatar size="md" src="https://i.pravatar.cc/80" alt="User" status="online" />
            <Avatar size="md" src="https://i.pravatar.cc/80" alt="User" status="offline" />
          </div>
        ),
      },
      {
        name: 'Progress',
        component: (
          <div className="space-y-4 max-w-md">
            <div>
              <label className="text-sm text-gray-600">Basic Progress</label>
              <Progress value={75} />
            </div>
            <div>
              <label className="text-sm text-gray-600">Success Progress</label>
              <Progress value={100} variant="success" />
            </div>
            <div>
              <label className="text-sm text-gray-600">Warning Progress</label>
              <Progress value={45} variant="warning" />
            </div>
            <div>
              <label className="text-sm text-gray-600">Error Progress</label>
              <Progress value={25} variant="danger" />
            </div>
            <div>
              <label className="text-sm text-gray-600">Small Progress</label>
              <Progress value={60} size="sm" />
            </div>
          </div>
        ),
      },
      {
        name: 'Table',
        component: (
          <Table
            columns={[
              { header: 'ID', accessor: 'id' },
              { header: 'Name', accessor: 'name' },
              { header: 'Email', accessor: 'email' },
              { header: 'Role', accessor: 'role' },
            ]}
            data={tableData}
            className="max-w-2xl"
          />
        ),
      },
      {
        name: 'Skeleton',
        component: (
          <div className="space-y-4 max-w-md">
            <Skeleton variant="text" width="w-3/4" />
            <Skeleton variant="text" width="w-full" />
            <Skeleton variant="text" width="w-1/2" />
            <Skeleton variant="circle" size="w-12 h-12" />
            <Skeleton variant="rect" width="w-full" height="h-32" />
            <div className="flex items-center gap-4">
              <Skeleton variant="circle" size="w-8 h-8" />
              <div className="flex-1 space-y-2">
                <Skeleton variant="text" width="w-full" />
                <Skeleton variant="text" width="w-3/4" />
              </div>
            </div>
          </div>
        ),
      },
      {
        name: 'EmptyState',
        component: (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
            <EmptyState
              icon="📭"
              title="No Items Found"
              description="There are no items to display at this time."
              action={<Button size="sm">Add Item</Button>}
            />
            <EmptyState
              icon="🔍"
              title="No Search Results"
              description="Try adjusting your search terms."
            />
          </div>
        ),
      },
      {
        name: 'Spinner',
        component: (
          <div className="flex flex-wrap gap-8 items-center">
            <Spinner size="sm" />
            <Spinner size="md" />
            <Spinner size="lg" />
            <Spinner size="xl" />
            <Spinner variant="primary" />
            <Spinner variant="success" />
            <Spinner variant="danger" />
            <Spinner variant="warning" />
          </div>
        ),
      },
    ],
  };

  // ============================================================
  // CHART COMPONENTS
  // ============================================================

  const chartComponents = {
    name: 'Charts',
    description: 'Data visualization components for analytics and reporting',
    components: [
      {
        name: 'LineChart',
        component: (
          <div className="max-w-2xl">
            <LineChart
              data={chartData}
              title="Revenue Trend"
              xAxisLabel="Month"
              yAxisLabel="Revenue ($)"
            />
          </div>
        ),
      },
      {
        name: 'BarChart',
        component: (
          <div className="max-w-2xl">
            <BarChart
              data={chartData}
              title="Sales by Category"
              xAxisLabel="Category"
              yAxisLabel="Sales ($)"
            />
          </div>
        ),
      },
      {
        name: 'PieChart',
        component: (
          <div className="max-w-2xl">
            <PieChart
              data={chartData}
              title="Market Share"
            />
          </div>
        ),
      },
      {
        name: 'AreaChart',
        component: (
          <div className="max-w-2xl">
            <AreaChart
              data={chartData}
              title="User Growth"
              xAxisLabel="Month"
              yAxisLabel="Users"
            />
          </div>
        ),
      },
    ],
  };

  // ============================================================
  // ORGANIZE ALL GROUPS
  // ============================================================

  const componentGroups = [
    coreComponents,
    formComponents,
    navigationComponents,
    displayComponents,
    chartComponents,
  ];

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            KisanO Design System
          </h1>
          <p className="text-lg text-gray-600">
            Component Showcase — v1.0.0
          </p>
        </header>

        {componentGroups.map((group, index) => (
          <section 
            key={index} 
            className="mb-16 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
          >
            <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
              <h2 className="text-2xl font-semibold text-gray-900">
                {group.name}
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                {group.description}
              </p>
            </div>

            <div className="p-6 space-y-12">
              {group.components.map((component, idx) => (
                <div key={idx} className="border-b border-gray-100 last:border-0 pb-8 last:pb-0">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-gray-800">
                      {component.name}
                    </h3>
                    <span className="text-xs text-gray-400 font-mono bg-gray-50 px-3 py-1 rounded-full border border-gray-200">
                      {component.name.toLowerCase()}
                    </span>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                    {component.component}
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
};

export default ComponentShowcase_FULL;