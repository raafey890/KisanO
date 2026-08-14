import { useQuery } from '@tanstack/react-query';
import { ownerApi } from '../api/ownerApi';

export const useOwnerNotifications = () => {
  return useQuery({
    queryKey: ['useOwnerNotifications'],
    queryFn: () => ownerApi.getOwnerNotifications(),
    staleTime: 5 * 60 * 1000,
  });
};

