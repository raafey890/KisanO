import { useQuery } from '@tanstack/react-query';
import { ownerApi } from '../api/ownerApi';

export const useOwnerReviews = () => {
  return useQuery({
    queryKey: ['useOwnerReviews'],
    queryFn: () => ownerApi.getOwnerReviews(),
    staleTime: 5 * 60 * 1000,
  });
};

