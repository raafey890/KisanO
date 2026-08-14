import { useQuery } from '@tanstack/react-query';
import { ownerApi } from '../api/ownerApi';

export const useOwnerProfile = () => {
  return useQuery({
    queryKey: ['useOwnerProfile'],
    queryFn: () => ownerApi.getOwnerProfile(),
    staleTime: 5 * 60 * 1000,
  });
};

