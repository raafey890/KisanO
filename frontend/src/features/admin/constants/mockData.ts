export const MOCK_ADMIN_EQUIPMENT = [
  { id: 'EQ-1001', name: 'John Deere 5310', owner: 'Suresh Patil', category: 'Tractor', price: '₹800/hr', status: 'Pending', rating: 0, utilization: '0%' },
  { id: 'EQ-1002', name: 'Mahindra Arjun Novo', owner: 'Anil Desai', category: 'Tractor', price: '₹850/hr', status: 'Active', rating: 4.8, utilization: '75%' },
  { id: 'EQ-1003', name: 'Automatic Seed Drill', owner: 'Ramesh Kumar', category: 'Implement', price: '₹300/hr', status: 'Active', rating: 4.5, utilization: '40%' },
];

export const MOCK_ADMIN_VERIFICATIONS = [
  { id: 'VR-101', name: 'Suresh Patil', role: 'Equipment Owner', type: 'Aadhar Card', status: 'Pending', date: '29 Jul 2026' },
  { id: 'VR-102', name: 'Ramesh Kumar', role: 'Sprayer Operator', type: 'Sprayer License', status: 'Pending', date: '29 Jul 2026' },
  { id: 'VR-103', name: 'Anil Desai', role: 'Marketplace Seller', type: 'GST Certificate', status: 'Pending', date: '28 Jul 2026' },
];

export const MOCK_ADMIN_USERS = [
  { id: 'USR-001', name: 'Ramesh Patil', role: 'Farmer', phone: '+91 9876543210', email: 'ramesh@example.com', status: 'Active', verified: true, date: '12 Sep 2026' },
  { id: 'USR-002', name: 'Suresh Desai', role: 'Equipment Owner', phone: '+91 8765432109', email: 'suresh@example.com', status: 'Active', verified: true, date: '10 Sep 2026' },
  { id: 'USR-003', name: 'Anil Kumar', role: 'Sprayer Operator', phone: '+91 7654321098', email: 'anil@example.com', status: 'Suspended', verified: false, date: '05 Sep 2026' },
  { id: 'USR-004', name: 'Vikram Singh', role: 'Admin', phone: '+91 6543210987', email: 'admin.vikram@kisano.com', status: 'Active', verified: true, date: '01 Sep 2026' },
];
