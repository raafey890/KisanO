import { useQuery } from '@tanstack/react-query';
import { ownerApi } from '../api/ownerApi';

export const useOwnerEquipment = () => {
  return useQuery({
    queryKey: ['useOwnerEquipment'],
    queryFn: () => ownerApi.getOwnerEquipment(),
    staleTime: 5 * 60 * 1000,
  });
};

