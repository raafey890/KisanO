import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { aidoctorApi } from '../api/aidoctorApi';
import { aidoctorKeys } from '../constants/queryKeys';

export const useScans = () => {
  return useQuery({
    queryKey: aidoctorKeys.scans(),
    queryFn: aidoctorApi.getScans,
    staleTime: 5 * 60 * 1000,
  });
};

export const useScanDetails = (id: string) => {
  return useQuery({
    queryKey: aidoctorKeys.scanDetails(id),
    queryFn: () => aidoctorApi.getScanDetails(id),
    enabled: !!id,
  });
};

export const useDeleteScan = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => aidoctorApi.deleteScan(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: aidoctorKeys.scans() });
      const previousScans = queryClient.getQueryData(aidoctorKeys.scans());

      queryClient.setQueryData(aidoctorKeys.scans(), (old: any) => {
        if (!old) return old;
        return old.filter((scan: any) => scan.id !== id);
      });

      return { previousScans };
    },
    onError: (err, variables, context) => {
      if (context?.previousScans) {
        queryClient.setQueryData(aidoctorKeys.scans(), context.previousScans);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: aidoctorKeys.scans() });
    },
  });
};

export const useAnalyzeImage = () => {
  return useMutation({
    mutationFn: (file: File) => aidoctorApi.analyzeImage(file),
  });
};
