import { useQuery } from '@tanstack/react-query';
import { ownerApi } from '../api/ownerApi';

export const useOwnerDashboard = () => {
  return useQuery({
    queryKey: ['useOwnerDashboard'],
    queryFn: () => ownerApi.getOwnerDashboard(),
    staleTime: 5 * 60 * 1000,
  });
};

