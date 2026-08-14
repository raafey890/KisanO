import { TractorEquipment } from '../../../assets/images';
import userAvatar from '../../../assets/ai/farmer_3d_icon.jpg';

export const MOCK_OPERATOR_JOBS = [
  {
    id: 'JOB-8821',
    status: 'Pending',
    farmer: 'Suresh Patil',
    crop: 'Sugarcane',
    size: '5 Acres',
    service: 'Pesticide Spraying',
    date: '12 Sep 2026',
    time: '09:00 AM',
    duration: '4 Hours',
    amount: 1200,
    paymentStatus: 'Pending',
    location: 'Village Khed, Pune',
    avatar: userAvatar
  },
  {
    id: 'JOB-8822',
    status: 'Accepted',
    farmer: 'Ramesh Kumar',
    crop: 'Cotton',
    size: '10 Acres',
    service: 'Fertilizer Application',
    date: '13 Sep 2026',
    time: '10:30 AM',
    duration: '8 Hours',
    amount: 2500,
    paymentStatus: 'Paid',
    location: 'Village Shirur, Pune',
    avatar: userAvatar
  },
  {
    id: 'JOB-8823',
    status: 'In Progress',
    farmer: 'Anil Desai',
    crop: 'Wheat',
    size: '3 Acres',
    service: 'Herbicide Spraying',
    date: 'Today',
    time: '08:00 AM',
    duration: '2 Hours',
    amount: 800,
    paymentStatus: 'Pending',
    location: 'Village Baramati, Pune',
    avatar: userAvatar
  }
];

import sprayerPerson1Img from '../../../assets/services/sprayer_person1.jpg';
import sprayerPerson2Img from '../../../assets/services/sprayer_person2.jpg';
import sprayerDroneImg from '../../../assets/services/sprayer_drone.jpg';

export const MOCK_SPRAYER_BOOKINGS = [
  {
    id: 'SPY-88492',
    status: 'Upcoming',
    date: '27 Aug 2026',
    time: '06:00 AM',
    provider: {
      name: 'Ramesh Kumar',
      serviceType: 'Pesticide Spraying',
      image: sprayerPerson1Img
    }
  },
  {
    id: 'SPY-77381',
    status: 'Completed',
    date: '15 Aug 2026',
    time: '08:30 AM',
    provider: {
      name: 'Suresh Patil',
      serviceType: 'Fertilizer Spraying',
      image: sprayerPerson2Img
    }
  },
  {
    id: 'SPY-99211',
    status: 'Completed',
    date: '02 Aug 2026',
    time: '07:00 AM',
    provider: {
      name: 'AeroTech AgriDrones',
      serviceType: 'Drone Spraying',
      image: sprayerDroneImg
    }
  },
  {
    id: 'SPY-55422',
    status: 'Cancelled',
    date: '20 Jul 2026',
    time: '04:00 PM',
    provider: {
      name: 'Ramesh Kumar',
      serviceType: 'Pesticide Spraying',
      image: sprayerPerson1Img
    }
  }
];

import sprayerPerson3Img from '../../../assets/services/sprayer_person3.jpg';

export const MOCK_SPRAYER_PROVIDERS = [
  {
    id: 's1',
    name: 'Ramesh Kumar',
    serviceType: 'Pesticide Spraying',
    startingPrice: 500,
    priceUnit: 'per acre',
    experience: 8,
    rating: 4.9,
    jobsCompleted: 342,
    distance: '2.5 km',
    availableToday: true,
    image: sprayerPerson1Img,
    isFeatured: true
  },
  {
    id: 's2',
    name: 'AeroTech AgriDrones',
    serviceType: 'Drone Spraying',
    startingPrice: 1200,
    priceUnit: 'per acre',
    experience: 3,
    rating: 4.8,
    jobsCompleted: 890,
    distance: '15 km',
    availableToday: false,
    image: sprayerDroneImg,
    isFeatured: true
  },
  {
    id: 's3',
    name: 'Suresh Patil',
    serviceType: 'Fertilizer Spraying',
    startingPrice: 450,
    priceUnit: 'per acre',
    experience: 12,
    rating: 4.7,
    jobsCompleted: 1250,
    distance: '4.2 km',
    availableToday: true,
    image: sprayerPerson2Img,
    isFeatured: true
  },
  {
    id: 's4',
    name: 'GreenLife Naturals',
    serviceType: 'Organic Spraying',
    startingPrice: 600,
    priceUnit: 'per acre',
    experience: 5,
    rating: 4.6,
    jobsCompleted: 215,
    distance: '8.0 km',
    availableToday: true,
    image: sprayerPerson3Img,
    isFeatured: true
  }
];
