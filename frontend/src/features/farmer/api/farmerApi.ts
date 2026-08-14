// @ts-ignore - Importing JS module into TS without declarations
import api from '../../../services/api';
import { FARMER_ENDPOINTS } from './farmerEndpoints';
import { FarmerDashboardData, Equipment } from '../types';

export const farmerApi = {
  getDashboard: async (): Promise<FarmerDashboardData> => {
    return await api.get<any, FarmerDashboardData>(FARMER_ENDPOINTS.DASHBOARD);
  },

  getEquipment: async (filters?: Record<string, any>): Promise<Equipment[]> => {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value.toString());
      });
    }
    const queryString = params.toString() ? `?${params.toString()}` : '';
    return await api.get<any, Equipment[]>(`${FARMER_ENDPOINTS.EQUIPMENT}${queryString}`);
  },

  getEquipmentDetail: async (id: string): Promise<Equipment> => {
    return await api.get<any, Equipment>(FARMER_ENDPOINTS.EQUIPMENT_DETAIL(id));
  },
  
  // TODO: Add mock endpoints here in the future
};
