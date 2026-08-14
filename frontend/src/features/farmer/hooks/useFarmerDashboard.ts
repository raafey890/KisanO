import { useQuery } from '@tanstack/react-query';
import { farmerApi } from '../api/farmerApi';
import { FarmerDashboardData } from '../types';

export const useFarmerDashboard = () => {
  return useQuery<FarmerDashboardData, Error>({
    queryKey: ['farmerDashboard'],
    queryFn: farmerApi.getDashboard,
    staleTime: 5 * 60 * 1000, // 5 minutes cache
  });
};
