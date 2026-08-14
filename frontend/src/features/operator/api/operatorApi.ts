import { MOCK_OPERATOR_JOBS, MOCK_SPRAYER_BOOKINGS, MOCK_SPRAYER_PROVIDERS } from '../constants/mockData';

export const operatorApi = {
  getOperatorJobs: async () => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));
    return MOCK_OPERATOR_JOBS;
  },

  updateJobStatus: async (id: string, status: string) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return { id, status };
  },

  getSprayerBookings: async () => {
    await new Promise(resolve => setTimeout(resolve, 800));
    return MOCK_SPRAYER_BOOKINGS;
  },

  getSprayerProviders: async () => {
    await new Promise(resolve => setTimeout(resolve, 800));
    return MOCK_SPRAYER_PROVIDERS;
  }
};
