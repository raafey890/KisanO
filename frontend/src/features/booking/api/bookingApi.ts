import { MOCK_FARMER_BOOKINGS } from '../constants/mockData';

export const bookingApi = {
  getFarmerBookings: async () => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));
    return MOCK_FARMER_BOOKINGS;
  },

  updateBookingStatus: async (id: string, status: string) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return { id, status };
  },

  confirmBooking: async (bookingData: any) => {
    await new Promise(resolve => setTimeout(resolve, 1500));
    return { 
      id: `BKG-${Math.floor(1000 + Math.random() * 9000)}`,
      ...bookingData 
    };
  }
};
