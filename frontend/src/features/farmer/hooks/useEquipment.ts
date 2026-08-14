import { useQuery } from '@tanstack/react-query';
import { farmerApi } from '../api/farmerApi';
import { Equipment } from '../types';

export const useEquipment = (filters?: Record<string, any>) => {
  return useQuery<Equipment[], Error>({
    queryKey: ['equipment', filters],
    queryFn: () => farmerApi.getEquipment(filters),
    staleTime: 5 * 60 * 1000,
  });
};

export const useEquipmentDetail = (id: string | undefined) => {
  return useQuery<Equipment, Error>({
    queryKey: ['equipment', id],
    queryFn: () => farmerApi.getEquipmentDetail(id!),
    enabled: !!id, // Only run if ID is provided
    staleTime: 5 * 60 * 1000,
  });
};
