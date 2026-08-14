import { useQuery } from '@tanstack/react-query';
import { ownerApi } from '../api/ownerApi';

export const useOwnerCalendar = () => {
  return useQuery({
    queryKey: ['useOwnerCalendar'],
    queryFn: () => ownerApi.getOwnerCalendar(),
    staleTime: 5 * 60 * 1000,
  });
};

