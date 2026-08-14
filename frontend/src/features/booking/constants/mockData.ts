import { TractorEquipment } from '../../../assets/images';

export const MOCK_FARMER_BOOKINGS = [
  {
    id: 'BKG-7411',
    status: 'Upcoming',
    equipment: {
      name: 'Mahindra 575 DI 45 HP Tractor',
      image: TractorEquipment,
      type: 'Tractor'
    },
    owner: {
      name: 'Anandrao Deshmukh',
      phone: '+91 98220 12345'
    },
    rentalDates: '30/07/2026 - 31/07/2026',
    totalAmount: 9000,
  },
  {
    id: 'BKG-8992',
    status: 'Active',
    equipment: {
      name: 'Honda 1000L Boom Sprayer',
      image: TractorEquipment,
      type: 'Sprayer'
    },
    owner: {
      name: 'Ramesh Patel',
      phone: '+91 91234 56780'
    },
    rentalDates: '28/07/2026 - 29/07/2026',
    totalAmount: 4500,
  },
  {
    id: 'BKG-1822',
    status: 'Completed',
    equipment: {
      name: 'Swaraj 744 FE Harvester',
      image: TractorEquipment,
      type: 'Harvester'
    },
    owner: {
      name: 'Vikram Singh',
      phone: '+91 99887 77665'
    },
    rentalDates: '15/06/2026 - 16/06/2026',
    totalAmount: 14000,
  },
  {
    id: 'BKG-9921',
    status: 'Cancelled',
    equipment: {
      name: 'John Deere Rotavator 6ft',
      image: TractorEquipment, 
      type: 'Implement'
    },
    owner: {
      name: 'Suresh Patil',
      phone: '+91 88776 66554'
    },
    rentalDates: '01/05/2026 - 02/05/2026',
    totalAmount: 3000,
  }
];
