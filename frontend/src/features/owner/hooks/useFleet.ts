import { useQuery } from '@tanstack/react-query';
import { ownerApi } from '../api/ownerApi';
import { OwnerEquipment } from '../types';
import { useAuthStore } from '../../auth';

export const useFleet = () => {
  const user = useAuthStore((state) => state.user);

  return useQuery<OwnerEquipment[], Error>({
    queryKey: ['ownerFleet', user?.id],
    queryFn: async () => {
      const data = await ownerApi.getFleet();
      // Filter by the current owner if the backend doesn't automatically do it
      // In the legacy code, it filtered by `eq.ownerId === user?.id`
      if (data && data.length > 0 && user?.id) {
        return data.filter(eq => {
          const ownerId = typeof eq.ownerId === 'object' ? eq.ownerId?._id : eq.ownerId;
          return ownerId === user.id;
        });
      }
      return [];
    },
    enabled: !!user?.id,
    staleTime: 5 * 60 * 1000,
  });
};
