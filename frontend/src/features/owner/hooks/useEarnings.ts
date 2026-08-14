import { useQuery } from '@tanstack/react-query';
import { ownerApi } from '../api/ownerApi';

export const useEarnings = () => {
  return useQuery({
    queryKey: ['useEarnings'],
    queryFn: () => ownerApi.getEarnings(),
    staleTime: 5 * 60 * 1000,
  });
};

