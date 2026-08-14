import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { operatorApi } from '../api/operatorApi';
import { operatorKeys } from '../constants/queryKeys';

export const useOperatorJobs = () => {
  return useQuery({
    queryKey: operatorKeys.jobs(),
    queryFn: operatorApi.getOperatorJobs,
    staleTime: 5 * 60 * 1000,
  });
};

export const useUpdateOperatorJobStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => operatorApi.updateJobStatus(id, status),
    onMutate: async ({ id, status }) => {
      await queryClient.cancelQueries({ queryKey: operatorKeys.jobs() });
      const previousJobs = queryClient.getQueryData(operatorKeys.jobs());

      queryClient.setQueryData(operatorKeys.jobs(), (old: any) => {
        if (!old) return old;
        return old.map((job: any) =>
          job.id === id ? { ...job, status } : job
        );
      });

      return { previousJobs };
    },
    onError: (err, variables, context) => {
      if (context?.previousJobs) {
        queryClient.setQueryData(operatorKeys.jobs(), context.previousJobs);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: operatorKeys.jobs() });
    },
  });
};

export const useSprayerBookings = () => {
  return useQuery({
    queryKey: operatorKeys.services(),
    queryFn: operatorApi.getSprayerBookings,
    staleTime: 5 * 60 * 1000,
  });
};

export const useSprayerProviders = () => {
  return useQuery({
    queryKey: operatorKeys.services(), // using same namespace since it's closely related
    queryFn: operatorApi.getSprayerProviders,
    staleTime: 5 * 60 * 1000,
  });
};
