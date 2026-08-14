import { useQuery } from '@tanstack/react-query';
import { ownerApi } from '../api/ownerApi';

export const useOwnerStats = () => {
  return useQuery({
    queryKey: ['useOwnerStats'],
    queryFn: () => ownerApi.getOwnerStats(),
    staleTime: 5 * 60 * 1000,
  });
};

