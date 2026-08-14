// @ts-ignore
import api from '../../../services/api';
import { OWNER_ENDPOINTS } from './ownerEndpoints';
import { OwnerEquipment, BookingRequest, OwnerDashboardStats } from '../types';

export const ownerApi = {
  getFleet: async (): Promise<OwnerEquipment[]> => {
    return await api.get<any, OwnerEquipment[]>(OWNER_ENDPOINTS.EQUIPMENT);
  },
  
  getBookings: async (): Promise<BookingRequest[]> => {
    return await api.get<any, BookingRequest[]>(OWNER_ENDPOINTS.BOOKINGS);
  },
  
  updateBookingStatus: async (id: string, status: string): Promise<any> => {
    return await api.put<any, any>(OWNER_ENDPOINTS.BOOKING_STATUS(id), { status });
  },

  getDashboard: async (): Promise<OwnerDashboardStats> => {
    // TODO: Backend integration pending
    return await api.get<any, OwnerDashboardStats>(OWNER_ENDPOINTS.DASHBOARD);
  },

  getEarnings: async (): Promise<any> => {
    // TODO: Backend integration pending
    return await api.get<any, any>(OWNER_ENDPOINTS.EARNINGS);
  }
};

// Placeholders for remaining modules
ownerApi.getOwnerProfile = async () => api.get(OWNER_ENDPOINTS.PROFILE);
ownerApi.getOwnerEquipment = async () => api.get(OWNER_ENDPOINTS.EQUIPMENT);
ownerApi.getOwnerReviews = async () => api.get('/reviews');
ownerApi.getOwnerNotifications = async () => api.get(OWNER_ENDPOINTS.NOTIFICATIONS);
ownerApi.getOwnerCalendar = async () => api.get('/calendar');
ownerApi.getOwnerStats = async () => api.get('/stats');
